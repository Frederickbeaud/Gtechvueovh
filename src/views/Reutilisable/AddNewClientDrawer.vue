<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'userData',
])

const isFormValid = ref(false)
const refForm = ref()
const nom = ref('')
const prenom = ref('')


const role = ref()
const uniqueUserNumber = ref()
const rfid = ref()


// 👉 drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
  })
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit('userData', {

        nom: nom.value,
        prenom: prenom.value,
        role: role.value.toLowerCase(),
        rfid: rfid.value,
        uniqueUserNumber: uniqueUserNumber.value,
        dateCreation: Date.now(),


      })
      emit('update:isDrawerOpen', false)
      nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
      })
    }
  })
}

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}
</script>

<template>
  <VNavigationDrawer temporary :width="600" location="center" class="scrollable-content"
    :model-value="props.isDrawerOpen" @update:model-value="handleDrawerModelValueUpdate">
    <!-- 👉 Title -->
    <AppDrawerHeaderSection title="Ajouter utilisateur" @cancel="closeNavigationDrawer" />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat :height="800">
        <VCardText>
          <!-- 👉 Form -->
          <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
            <VRow>
              <!-- 👉 Full name -->
              <VCol cols="6">
                <AppTextField v-model="nom" :rules="[requiredValidator]" label="Nom" placeholder="Moussavou" />
              </VCol>

              <!-- 👉 Username -->
              <VCol cols="6">
                <AppTextField v-model="prenom" :rules="[requiredValidator]" label="Prénom" placeholder="John" />
              </VCol>

              <!-- 👉 Email -->
              <VCol cols="6">
                <AppTextField v-model="uniqueUserNumber" :rules="[requiredValidator]" label="Numéro Client"
                  placeholder="AB5D1" />
              </VCol>






              <!-- 👉 Role -->
              <VCol cols="6">
                <AppSelect v-model="role" label="Choissir Role" placeholder="Choisir Role" :rules="[requiredValidator]"
                  :items="['Admin', 'chauffeur', 'Editor', 'Maintainer', 'Subscriber']" />
              </VCol>





              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn type="submit" class="me-3">
                  Submit
                </VBtn>
                <VBtn type="reset" variant="tonal" color="error" @click="closeNavigationDrawer">
                  Cancel
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
