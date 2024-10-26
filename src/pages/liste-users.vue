<script setup>
import AddNewUserDrawer from '@/views/Reutilisable/AddNewUtilisateurDrawer.vue';
import { paginateArray } from '@api-utils/paginateArray';
import is from '@sindresorhus/is';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import destr from 'destr';
import 'flatpickr/dist/flatpickr.css';
import { onMounted, ref } from 'vue';

const date = ref();

// 👉 Store
const searchNom = ref('')
const searchPrenom = ref('')
const searchRfid = ref('')
const searchdate = ref([]);
const searchunique = ref('')
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const usersData = ref({})
// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const selectedRows = ref([])
const filteredData = ref([]);
const flatpickrOptions = {
  enableTime: true,
  dateFormat: 'Y-m-d H:i',
  time_24hr: true,
};

const updateOptions = options => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}
watch(
  [searchNom, searchPrenom, searchRfid, searchunique, searchdate, selectedRole, selectedPlan, selectedStatus, itemsPerPage, page, sortBy, orderBy, selectedRows],
  (newValues, oldValues) => {
    console.log('New values:', newValues);
    console.log('Old values:', oldValues);
    fetchUsers()
    // Add your logic here, e.g., filtering usersData based on searchQuery or selected filters
  },
  { deep: true } // Optional: set to true if you want to watch nested properties
);
// Headers
const headers = [

  {
    title: 'Numéro Utilisateur',
    key: 'uniqueUserNumber',
  },
  {
    title: 'Numéro RFID',
    key: 'rfid',
  },

  {
    title: 'Nom',
    key: 'nom',
  },
  {
    title: 'Prénom',
    key: 'prenom',
  },
  {
    title: 'Role',
    key: 'role',
  },
  {
    title: 'Date de Création',
    key: 'dateCreation',
  },
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
  },
]
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

  const jour = jours[date.getDay()];
  const jourDuMois = date.getDate();
  const moisNom = mois[date.getMonth()];
  const annee = date.getFullYear();
  const heures = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${jour}, ${jourDuMois} ${moisNom} ${annee} à ${heures}:${minutes}`;
}

function formatTimestamp1(timestamp) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

const updateData = (data) => (userData.value = data);

onMounted(() => {
  fetchUsers()
})

function fetchUsers() {
  fetch("http://51.178.42.116:8089/api/utilisateurs")
    .then((resp) => resp.json())
    .then((data) => {
      // updateData(data);
      usersData.value = readdata(data.reverse(), searchNom.value, searchPrenom.value, searchRfid.value, searchunique.value, searchdate.value, selectedRole.value, sortBy.value, itemsPerPage.value, page.value, orderBy.value)
    });






  const readdata = (data, nomS, prenomS, rfidS, searchunique, searchdate, roleName, sortByName, itemPerPage, pageNum, orderByName) => {
    console.log({ roleName, sortByName, itemPerPage, pageNum, orderByName })
    const nom = nomS
    const prenom = prenomS
    const rfid = rfidS
    const unique = searchunique
    const role = roleName
    const [startDate, endDate] = searchdate ?? [];
    const sortBy = sortByName
    const itemsPerPage = itemPerPage
    const page = pageNum
    const orderBy = orderByName

    // const searchNom = is.string(nom) ? nom : undefined
    // const searchPrenom = is.string(prenom) ? prenom : undefined
    // const searchRfid = is.string(rfid) ? rfid : undefined
    // const searchUnique = is.string(unique) ? unique : undefined
    // const nomLower = (searchNom ?? '').toString().toLowerCase()
    // const prenomLower = (searchPrenom ?? '').toString().toLowerCase()
    // const rfidLower = (searchRfid ?? '').toString().toLowerCase()
    const nomLower = is.string(nom) ? nom.toLowerCase() : '';
    const prenomLower = is.string(prenom) ? prenom.toLowerCase() : '';
    const rfidLower = is.string(rfid) ? rfid.toLowerCase() : '';
    const uniqueLower = is.string(unique) ? unique.toLowerCase() : '';
    const parsedSortBy = destr(sortBy)
    const sortByLocal = is.string(parsedSortBy) ? parsedSortBy : ''
    const parsedOrderBy = destr(orderBy)
    const orderByLocal = is.string(parsedOrderBy) ? parsedOrderBy : ''
    const parsedItemsPerPage = destr(itemsPerPage)
    const parsedPage = destr(page)
    const itemsPerPageLocal = is.number(parsedItemsPerPage) ? parsedItemsPerPage : 10
    const pageLocal = is.number(parsedPage) ? parsedPage : 1


    // console.log(nomLower, prenomLower, rfidLower, uniqueLower)
    let filteredUsers = []
    // let filteredUsers = data.filter(user => (user.nom.toLowerCase().includes(nomLower)) && (user.prenom.toLowerCase().includes(prenomLower)) && (user.rfid.toLowerCase().includes(rfidLower)) && (user.uniqueUserNumber.toLowerCase().includes(uniqueLower)) && user.role === (selectedRole.value || user.role)).reverse()
    // Condition pour retourner tout le tableau si tous les critères sont vides
    if (!nomLower && !prenomLower && !rfidLower && !uniqueLower && !selectedRole.value && !endDate && !startDate) {
      filteredUsers = data.reverse(); // Retourne tout le tableau inversé
    }

    // let filteredUsers = data.filter(user => {
    //   const matchesNom = user.nom.toLowerCase().includes(nomLower);
    //   const matchesPrenom = user.prenom.toLowerCase().includes(prenomLower);
    //   const matchesRfid = user.rfid.toLowerCase().includes(rfidLower);
    //   const matchesUnique = user.uniqueUserNumber.toLowerCase().includes(uniqueLower);
    //   const matchesRole = user.role === (selectedRole.value || user.role);
    console.log(endDate, startDate);
    //   return matchesNom && matchesPrenom && matchesRfid && matchesUnique && matchesRole;
    // }).reverse();

    filteredUsers = data.filter(user => {
      const matchesNom = user.nom.toLowerCase().includes(nomLower);
      const matchesPrenom = user.prenom.toLowerCase().includes(prenomLower);
      const matchesRfid = user.rfid && user.rfid.toLowerCase().includes(rfidLower);
      const matchesUnique = user.uniqueUserNumber.toLowerCase().includes(uniqueLower);
      const matchesRole = user.role === (selectedRole.value || user.role);
      const matchesDateRange = (!startDate || new Date(user.dateCreation) >= new Date(startDate)) && (!endDate || new Date(user.dateCreation) <= new Date(endDate));

      return matchesNom && matchesPrenom && matchesRfid && matchesUnique && matchesRole && matchesDateRange;
    }).reverse();

    // filteredUsers = data.filter(user => {
    //   const matchesNom = user.nom.toLowerCase().includes(nomLower);
    //   const matchesPrenom = user.prenom.toLowerCase().includes(prenomLower);
    //   const matchesRfid = user.rfid.toLowerCase().includes(rfidLower);
    //   const matchesUnique = user.uniqueUserNumber.toLowerCase().includes(uniqueLower);
    //   const matchesRole = user.role === (roleName || user.role);

    //   // Date range logic
    //   const matchesDateRange = (!startDate || user.date >= new Date(startDate)) && (endDate === null || user.date <= new Date(endDate));

    //   return matchesNom && matchesPrenom && matchesRfid && matchesUnique && matchesRole && matchesDateRange;
    // }).reverse();
    // apres filtres

    // sort users
    console.log(filteredUsers)
    if (sortByLocal) {
      console.log(sortByLocal)
      if (sortByLocal === 'nom') {
        filteredUsers = filteredUsers.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.nom.localeCompare(b.nom)
          else
            return b.nom.localeCompare(a.nom)
        })
      }
      if (sortByLocal === 'prenom') {
        filteredUsers = filteredUsers.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.prenom.localeCompare(b.prenom)
          else
            return b.prenom.localeCompare(a.prenom)
        })
      }
      if (sortByLocal === 'role') {
        filteredUsers = filteredUsers.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.role.localeCompare(b.role)
          else
            return b.role.localeCompare(a.role)
        })
      }
      if (sortByLocal === 'uniqueUserNumber') {
        filteredUsers = filteredUsers.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.uniqueUserNumber.localeCompare(b.uniqueUserNumber)
          else
            return b.uniqueUserNumber.localeCompare(a.uniqueUserNumber)
        })
      }
      if (sortByLocal === 'status') {
        filteredUsers = filteredUsers.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.status.localeCompare(b.status)
          else
            return b.status.localeCompare(a.status)
        })
      }
      if (sortByLocal === 'billing') {
        filteredUsers = filteredUsers.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.billing.localeCompare(b.billing)
          else
            return b.billing.localeCompare(a.billing)
        })
      }
    }
    const totalUsers = filteredUsers.length

    // total pages
    const totalPages = Math.ceil(totalUsers / itemsPerPageLocal)

    return {
      users: paginateArray(filteredUsers, itemsPerPageLocal, pageLocal),
      totalPages,
      totalUsers,
      page: pageLocal > Math.ceil(totalUsers / itemsPerPageLocal) ? 1 : page,
    }
  }

}


// const {
//   data: usersData,
//   execute: fetchUsers,
// } = await useApi(createUrl('/apps/users', {
//   query: {
//     q: searchQuery,
//     status: selectedStatus,
//     plan: selectedPlan,
//     role: selectedRole,
//     itemsPerPage,
//     page,
//     sortBy,
//     orderBy,
//   },
// }))

const users = computed(() => usersData.value.users ?? [])
const totalUsers = computed(() => usersData.value.totalUsers)

// 👉 search filters
const roles = [
  {
    title: 'Admin',
    value: 'admin',
  },
  {
    title: 'Chauffeur',
    value: 'chauffeur',
  },
  {
    title: 'Cassier(s)',
    value: 'caissier',
  },
  {
    title: 'Controlleur',
    value: 'controlleur',
  },
  {
    title: 'Subscriber',
    value: 'subscriber',
  },
]

const plans = [
  {
    title: 'Basic',
    value: 'basic',
  },
  {
    title: 'Company',
    value: 'company',
  },
  {
    title: 'Enterprise',
    value: 'enterprise',
  },
  {
    title: 'Team',
    value: 'team',
  },
]

const status = [
  {
    title: 'Pending',
    value: 'pending',
  },
  {
    title: 'Active',
    value: 'active',
  },
  {
    title: 'Inactive',
    value: 'inactive',
  },
]

const resolveUserRoleVariant = role => {
  const roleLowerCase = role.toLowerCase()
  if (roleLowerCase === 'subscriber')
    return {
      color: 'success',
      icon: 'tabler-user',
    }
  if (roleLowerCase === 'chauffeur')
    return {
      color: 'error',
      icon: 'tabler-steering-wheel',
    }
  if (roleLowerCase === 'controlleur')
    return {
      color: 'info',
      icon: 'tabler-shield-half',
    }
  if (roleLowerCase === 'caissier')
    return {
      color: 'warning',
      icon: 'tabler-cash-register',
    }
  if (roleLowerCase === 'admin')
    return {
      color: 'primary',
      icon: 'tabler-crown',
    }

  return {
    color: 'primary',
    icon: 'tabler-user',
  }
}

const resolveUserStatusVariant = stat => {
  const statLowerCase = stat.toLowerCase()
  if (statLowerCase === 'pending')
    return 'warning'
  if (statLowerCase === 'active')
    return 'success'
  if (statLowerCase === 'inactive')
    return 'secondary'

  return 'primary'
}

const isAddNewUserDrawerVisible = ref(false)

const addNewUser = async userData => {
  console.log(userData)
  await fetch('http://51.178.42.116:8089/api/utilisateurs', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  }).then((res) => fetchUsers());


}

const deleteUser = async id => {
  await $api(`/apps/users/${id}`, { method: 'DELETE' })

  // Delete from selectedRows
  const index = selectedRows.value.findIndex(row => row === id)
  if (index !== -1)
    selectedRows.value.splice(index, 1)


}

const widgetData = ref([
  {
    title: 'Session',
    value: totalUsers,
    change: 29,
    desc: 'Total Users',
    icon: 'tabler-users',
    iconColor: 'primary',
  },
  {
    title: 'Paid Users',
    value: '4,567',
    change: 18,
    desc: 'Last Week Analytics',
    icon: 'tabler-user-plus',
    iconColor: 'error',
  },
  {
    title: 'Active Users',
    value: '19,860',
    change: -14,
    desc: 'Last Week Analytics',
    icon: 'tabler-user-check',
    iconColor: 'success',
  },
  {
    title: 'Pending Users',
    value: '237',
    change: 42,
    desc: 'Last Week Analytics',
    icon: 'tabler-user-search',
    iconColor: 'warning',
  },
])
</script>

<template>
  <section>
    <!-- 👉 Widgets -->
    <div class="d-flex mb-6">
      <VRow>
        <template v-for="(data, id) in widgetData" :key="id">
          <VCol cols="12" md="3" sm="6">
            <VCard>
              <VCardText>
                <div class="d-flex justify-space-between">
                  <div class="d-flex flex-column gap-y-1">
                    <div class="text-body-1 text-high-emphasis">
                      {{ data.title }}
                    </div>
                    <div class="d-flex gap-x-2 align-center">
                      <h4 class="text-h4">
                        {{ data.value ?? 0 }}
                      </h4>
                      <div class="text-base" :class="data.change > 0 ? 'text-success' : 'text-error'">
                        ({{ prefixWithPlus(data.change) }}%)
                      </div>
                    </div>
                    <div class="text-sm">
                      {{ data.desc }}
                    </div>
                  </div>
                  <VAvatar :color="data.iconColor" variant="tonal" rounded size="42">
                    <VIcon :icon="data.icon" size="26" />
                  </VAvatar>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </template>
      </VRow>
    </div>

    <VCard class="mb-6">


      <VCardText class="d-flex flex-wrap gap-4">
        <div class="me-3 d-flex gap-3">
          <AppSelect :model-value="itemsPerPage" :items="[
            { value: 10, title: '10' },
            { value: 25, title: '25' },
            { value: 50, title: '50' },
            { value: 100, title: '100' },
            { value: -1, title: 'All' },
          ]" style="inline-size: 6.25rem;" @update:model-value="itemsPerPage = parseInt($event, 10)" />
        </div>
        <VSpacer />

        <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">


          <!-- 👉 Export button -->
          <VBtn variant="tonal" color="secondary" prepend-icon="tabler-upload">
            <download-excel :data="users">
              Export

            </download-excel>

          </VBtn>

          <!-- 👉 Add user button -->
          <VBtn class="bg-success" prepend-icon="tabler-plus" @click="isAddNewUserDrawerVisible = true">
            Ajouter utilisateur
          </VBtn>
        </div>
      </VCardText>

      <VDivider />
      <VCardItem class="pb-2">
        <VCardTitle>Filtres de Recherche</VCardTitle>
      </VCardItem>


      <VDivider />
      <VCardText>
        <VRow>
          <VCol cols="12" sm="4">
            <!-- 👉 Search  -->
            <div style=" display: inline-flex;inline-size: 12rem;margin-inline-end: 5px;">
              <AppTextField v-model="searchunique" placeholder="Numéro utilisateur" />
            </div>
            <!-- 👉 Search  -->
            <div style="display: inline-flex;inline-size: 12rem;">
              <AppTextField v-model="searchRfid" placeholder="Numéro RFID" />
            </div>
          </VCol>

          <!-- 👉 Select Plan -->
          <VCol cols="8" sm="4">
            <!-- 👉 Search  -->
            <div style=" display: inline-flex;inline-size: 11rem;margin-inline-end: 5px;">
              <AppTextField v-model="searchNom" placeholder="Nom" />
            </div>
            <!-- 👉 Search  -->
            <div style="display: inline-flex;inline-size: 11rem;">
              <AppTextField v-model="searchPrenom" placeholder="Prénom" />
            </div>
          </VCol>

          <!-- 👉 Select Role -->
          <VCol cols="8" sm="4" class="d-flex align-center">
            <div style="display: inline-flex;inline-size: 10rem;margin-right: 4px;">
              <AppSelect v-model="selectedRole" placeholder="choisir Role" :items="roles" clearable
                clear-icon="tabler-x" />
            </div>
            <div style="display: inline-flex;inline-size: 11rem;">
              <VueDatePicker v-model="searchdate" time-picker-inline range multi-calendars :teleport="true">
              </VueDatePicker>
            </div>
          </VCol>
        </VRow>
      </VCardText>
      <!-- SECTION datatable -->
      <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:model-value="selectedRows" v-model:page="page"
        :items="users" item-value="id" :items-length="totalUsers" :headers="headers" class="text-no-wrap" show-select
        @update:options="updateOptions">
        <!-- User
        <template #item.user="{ item }">
          <div class="d-flex align-center gap-x-4">
            <VAvatar size="34" :variant="!item.avatar ? 'tonal' : undefined"
              :color="!item.avatar ? resolveUserRoleVariant(item.role).color : undefined">
              <VImg v-if="item.avatar" :src="item.avatar" />
              <span v-else>{{ avatarText(item.nom + " "+ item.prenom) }}</span>
            </VAvatar>
            <div class="d-flex flex-column">
              <h6 class="text-base">
                <RouterLink
                  :to="{ name: 'apps-user-view-id', params: { id: item.id } }"
                  class="font-weight-medium text-link"
                >
                  {{ item.fullName }}
                </RouterLink>
              </h6>
              <div class="text-sm">
                {{ item.email }}
              </div>
            </div>
          </div>
        </template> -->
        <!--uniqueUserNumber-->
        <template #item.uniqueUserNumber="{ item }">
          <div class="d-flex align-center gap-x-4">

            <div class="d-flex flex-column">

              <div class="text-sm">
                {{ item.uniqueUserNumber }}
              </div>
            </div>
          </div>
        </template>
        <!--uniqueUserNumber-->
        <template #item.rfid="{ item }">
          <div class="d-flex align-center gap-x-4">

            <div class="d-flex flex-column">

              <div class="text-sm">
                {{ item?.rfid }}
              </div>
            </div>
          </div>
        </template>
        <!--nom-->
        <template #item.nom="{ item }">
          <div class="d-flex align-center gap-x-4">
            <VAvatar size="34" :variant="!item.avatar ? 'tonal' : undefined"
              :color="!item.avatar ? resolveUserRoleVariant(item.role).color : undefined">
              <VImg v-if="item.avatar" :src="item.avatar" />
              <span v-else>{{ avatarText(item.nom) }}</span>
            </VAvatar>
            <div class="d-flex flex-column">
              <h6 class="text-base">
                <!--<RouterLink
                  :to="{ name: 'apps-user-view-id', params: { id: item.id } }"
                  class="font-weight-medium text-link"
                >
                  {{ item.fullName }}
                </RouterLink>-->
              </h6>
              <div class="text-sm">
                {{ item.nom }}
              </div>
            </div>
          </div>
        </template>
        <!--prenom-->
        <template #item.prenom="{ item }">
          <div class="d-flex align-center gap-x-4">

            <div class="d-flex flex-column">

              <div class="text-sm">
                {{ item.prenom }}
              </div>
            </div>
          </div>
        </template>
        <!-- 👉 Role -->
        <template #item.role="{ item }">
          <div class="d-flex align-center gap-x-2">
            <VIcon :size="22" :icon="resolveUserRoleVariant(item.role).icon"
              :color="resolveUserRoleVariant(item.role).color" />

            <div class="text-capitalize text-high-emphasis text-body-1">
              {{ item.role }}
            </div>
          </div>
        </template>

        <!-- Plan -->
        <template #item.dateCreation="{ item }">
          <div class="text-body-1 text-high-emphasis text-capitalize">
            {{ formatTimestamp1(item.dateCreation) }}
          </div>
        </template>

        <!-- Status -->
        <template #item.status="{ item }">
          <VChip :color="resolveUserStatusVariant(item.status)" size="small" label class="text-capitalize">
            {{ item.status }}
          </VChip>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <!-- <IconBtn @click="deleteUser(item.id)">
            <VIcon icon="tabler-trash" />
          </IconBtn> -->

          <IconBtn>
            <VIcon icon="tabler-eye" />
          </IconBtn>

          <VBtn icon variant="text" color="medium-emphasis">
            <VIcon icon="tabler-dots-vertical" />
            <VMenu activator="parent">
              <VList>
                <VListItem :to="{ name: 'apps-user-view-id', params: { id: item.id } }">
                  <template #prepend>
                    <VIcon icon="tabler-eye" />
                  </template>

                  <VListItemTitle>View</VListItemTitle>
                </VListItem>

                <VListItem link>
                  <template #prepend>
                    <VIcon icon="tabler-pencil" />
                  </template>
                  <VListItemTitle>Edit</VListItemTitle>
                </VListItem>

                <VListItem @click="deleteUser(item.id)">
                  <template #prepend>
                    <VIcon icon="tabler-trash" />
                  </template>
                  <VListItemTitle>Delete</VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </VBtn>
        </template>

        <!-- pagination -->
        <template #bottom>
          <TablePagination v-model:page="page" :items-per-page="itemsPerPage" :total-items="totalUsers" />
        </template>
      </VDataTableServer>
      <!-- SECTION -->
    </VCard>
    <!-- 👉 Add New User -->
    <AddNewUserDrawer v-model:isDrawerOpen="isAddNewUserDrawerVisible" @user-data="addNewUser" />
  </section>
</template>
<style lang="css" scoped>
.vue-date-picker {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.vue-date-picker .vue-date-picker__header {
  padding: 10px;
  border-radius: 8px 8px 0 0;
  background-color: #007bff;
  color: white;
}

.vue-date-picker .vue-date-picker__time-picker {
  margin-block-start: 10px;
}

.vue-date-picker .vue-date-picker__day {
  color: #333;
  font-weight: bold;
}

.vue-date-picker .vue-date-picker__day:hover {
  background-color: #e9ecef;
}

.vue-date-picker .vue-date-picker__selected {
  background-color: #007bff;
  color: white;
}
</style>
