<script setup>
import TerminalComponent from '@/views/Reutilisable/view/TerminalComponent.vue';

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
      <VCard v-if="props.userData" height="400">
        <VCardText class="text-center pt-12">
          <!-- 👉 Avatar -->


          <!-- 👉 User fullName -->


          <!-- 👉 Role chip -->

        </VCardText>

        <VCardText>

          <!-- 👉 Details -->
          <h5 class="text-h5">
            Details du Terminal
          </h5>

          <VDivider class="my-4" />

          <!-- 👉 User Details list -->
          <VList class="card-list mt-2">
            <VListItem>

              <VListItem>
                <VListItemTitle>
                  <h6 class="text-h6">
                    <i class="fa-solid fa-hashtag"></i> <span class="infoclient">ID Terminal:</span>
                    <div class="d-inline-block text-body-1">
                      {{ props.userData.terminalId }}
                    </div>
                  </h6>
                </VListItemTitle>
              </VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  <span class="infoclient">Type :</span>
                  <div class="d-inline-block text-body-1">
                    {{ props.userData.typeTerminal }}
                  </div>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <span class="text-h6">
                  <span class="infoclient">Addresse Mac:</span>
                </span><br>
                <span class="text-body-1 ps-3">
                  {{ props.userData.macAddress }}
                </span>
              </VListItemTitle>
            </VListItem>




          </VList>
        </VCardText>

        <!-- 👉 Edit and Suspend button -->
        <VCardText class="d-flex justify-center gap-x-4">


        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="9" height="600">

      <VCard v-if="props.userData" height="600">
        <TerminalComponent :userData="props.userData" />
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
