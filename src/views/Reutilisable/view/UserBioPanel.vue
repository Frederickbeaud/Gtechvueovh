<script setup>
import CarteComponent from '@/views/Reutilisable/CarteComponent.vue';

const props = defineProps({
  userData: {
    type: Object,
    required: true,
  },
})
const visible = ref(true)
const recto = ref(false)
const standardPlan = {
  plan: 'Standard',
  price: 99,
  benefits: [
    '10 Users',
    'Up to 10GB storage',
    'Basic Support',
  ],
}

const isUserInfoEditDialogVisible = ref(false)
const isUpgradePlanDialogVisible = ref(false)

const resolveUserRoleVariant = role => {
  if (role === 'client')
    return {
      color: 'warning',
      icon: 'tabler-user',
    }
  if (role === 'author')
    return {
      color: 'success',
      icon: 'tabler-circle-check',
    }
  if (role === 'maintainer')
    return {
      color: 'primary',
      icon: 'tabler-chart-pie-2',
    }
  if (role === 'editor')
    return {
      color: 'info',
      icon: 'tabler-pencil',
    }
  if (role === 'admin')
    return {
      color: 'secondary',
      icon: 'tabler-server-2',
    }

  return {
    color: 'primary',
    icon: 'tabler-user',
  }
}




</script>

<template>
  <VRow v-if="visible">
    <!-- SECTION User Details -->
    <VCol cols="3">
      <VCard v-if="props.userData" height="600">
        <VCardText class="text-center pt-12">
          <!-- 👉 Avatar -->
          <VAvatar rounded :size="100" :color="!props.userData.avatar ? 'primary' : undefined"
            :variant="!props.userData.avatar ? 'tonal' : undefined">
            <VImg v-if="props.userData.avatar" :src="props.userData.avatar" />
            <span v-else class="text-5xl font-weight-medium">
              {{ avatarText(props.userData.nom + " " + props.userData.prenom) }}
            </span>
          </VAvatar>

          <!-- 👉 User fullName -->
          <h5 class="text-h5 mt-4">
            {{ props.userData.nom + " " + props.userData.prenom }}
          </h5>

          <!-- 👉 Role chip -->
          <VChip label :color="resolveUserRoleVariant('client').color" size="small" class="text-capitalize mt-4">
            {{ "Client-" + props.userData.id }}
          </VChip>
        </VCardText>

        <VCardText>

          <!-- 👉 Details -->
          <h5 class="text-h5">
            Details
          </h5>

          <VDivider class="my-4" />

          <!-- 👉 User Details list -->
          <VList class="card-list mt-2">
            <VListItem>

              <VListItem>
                <VListItemTitle>
                  <h6 class="text-h6">
                    <i class="fa-solid fa-hashtag"></i> <span class="infoclient">Numero du client:</span>
                    <div class="d-inline-block text-body-1">
                      {{ props.userData.numClient }}
                    </div>
                  </h6>
                </VListItemTitle>
              </VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  <i class="fa-regular fa-user"></i> <span class="infoclient">Nom :</span>
                  <div class="d-inline-block text-body-1">
                    {{ props.userData.nom }}
                  </div>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <span class="text-h6">
                  <i class="fa-regular fa-user"></i> <span class="infoclient">Prenom:</span>
                </span>
                <span class="text-body-1">
                  {{ props.userData.prenom }}
                </span>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  <i class="fa-solid fa-map-pin"></i> <span class="infoclient"> Quartier:</span>
                  <div class="d-inline-block text-body-1 text-capitalize">
                    {{ props.userData.quartier }}
                  </div>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  <i class="fa-solid fa-location-dot"></i> <span class="infoclient">Ville:</span>
                  <div class="d-inline-block text-capitalize text-body-1">
                    {{ props.userData.ville }}
                  </div>
                </h6>
              </VListItemTitle>
            </VListItem>





          </VList>
        </VCardText>

        <!-- 👉 Edit and Suspend button -->
        <VCardText class="d-flex justify-center gap-x-4">

          <VBtn variant="tonal" color="error">
            Suspendre
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="9" height="600">

      <VCard v-if="props.userData" height="600">
        <CarteComponent :userData="props.userData" />
      </VCard>
    </VCol>
  </VRow>
  <VRow v-else>
    <VCol cols="12">
      <VBtn variant="tonal" color="error" @click="recto = !recto" class="mb-1">
        tourner
      </VBtn>
      <VBtn variant="tonal" color="success" @click="recto = !recto" class="mb-1 mx-2">
        Imprimer
      </VBtn>
      <VBtn @click="visible = true" class="mb-1 bg-warning">
        continuer
      </VBtn>
      <VCard height="600" v-if="recto">
        <VRow>
          <VCol cols="12">
            <div class="container1">

            </div>
          </VCol>
        </VRow>
      </VCard>
      <VCard height="600" v-else>
        <VRow>
          <VCol cols="12">
            <div class="container2">

            </div>
          </VCol>
        </VRow>

      </VCard>
    </VCol>
  </VRow>
  <!-- 👉 Edit user info dialog -->
  <UserInfoEditDialog v-model:isDialogVisible="isUserInfoEditDialogVisible" :user-data="props.userData" />

  <!-- 👉 Upgrade plan dialog -->
  <UserUpgradePlanDialog v-model:isDialogVisible="isUpgradePlanDialogVisible" />
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.5rem;
}

.text-capitalize {
  text-transform: capitalize !important;
}



.infoclient {
  font-size: 1.1rem;
  font-weight: 800;
  margin-right: 10px;
}
</style>
<style lang="css" scoped>
.container1 {
  background: url('../../../assets/images/TRANSURB-RECTO.png') !important;
  background-repeat: no-repeat !important;
  background-size: auto !important;
  background-position: center !important;
  width: 100%;

  height: 600px;
  border: 5px dotted;
}

.container2 {
  background: url('../../../assets/images/TRANSURB-VERSO.png') !important;
  background-repeat: no-repeat !important;
  background-size: auto !important;
  background-position: center !important;
  width: 100%;
  border: 5px dotted;
  height: 600px;
}
</style>
