<template>
   <VRow v-if="userData">
    <VCol
      cols="12"
      md="5"
      lg="4"
    >
      <UserBioPanel :user-data="userData" />
    </VCol>

    <VCol
      cols="12"
      md="7"
      lg="8"
    >
      <VTabs
        v-model="userTab"
        class="v-tabs-pill"
      >
        <VTab
          v-for="tab in tabs"
          :key="tab.icon"
        >
          <VIcon
            :size="18"
            :icon="tab.icon"
            class="me-1"
          />
          <span>{{ tab.title }}</span>
        </VTab>
      </VTabs>

      <VWindow
        v-model="userTab"
        class="mt-6 disable-tab-transition"
        :touch="false"
      >
        <VWindowItem>
          <UserTabAccount />
        </VWindowItem>

        <VWindowItem>
          <UserTabSecurity />
        </VWindowItem>

        <VWindowItem>
          <UserTabBillingsPlans />
        </VWindowItem>

        <VWindowItem>
          <UserTabNotifications />
        </VWindowItem>

        <VWindowItem>
          <UserTabConnections />
        </VWindowItem>
      </VWindow>
    </VCol>
  </VRow>
  <div v-else>
    <VAlert
      type="error"
      variant="tonal"
    >
      Invoice with ID  {{ route.params.id }} not found!
    </VAlert>
  </div>
</template>

<script setup>
import UserBioPanel from '@/views/Reutilisable/view/UserBioPanel.vue'
import UserTabAccount from '@/views/Reutilisable/view/UserTabAccount.vue'
import UserTabBillingsPlans from '@/views/Reutilisable/view/UserTabBillingsPlans.vue'
import UserTabConnections from '@/views/Reutilisable/view/UserTabConnections.vue'
import UserTabNotifications from '@/views/Reutilisable/view/UserTabNotifications.vue'
import UserTabSecurity from '@/views/Reutilisable/view/UserTabSecurity.vue'

const route = useRoute('apps-user-view-id')
const userTab = ref(null)

const tabs = [
  {
    icon: 'tabler-users',
    title: 'Account',
  },
  {
    icon: 'tabler-lock',
    title: 'Security',
  },
  {
    icon: 'tabler-bookmark',
    title: 'Billing & Plan',
  },
  {
    icon: 'tabler-bell',
    title: 'Notifications',
  },
  {
    icon: 'tabler-link',
    title: 'Connections',
  },
]

const { data: userData } = await useApi(`/apps/users/${ route.params.id }`)
</script>

<style lang="css" scoped>

</style>
