<script setup>
import {
  PerfectScrollbar
} from 'vue3-perfect-scrollbar';

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
const root = ref(null);
const root1 = ref(null);
const etape = ref('client');
const visible = ref(false)
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
  refForm.value?.validate().then(({
    valid
  }) => {
    if (valid) {
      const data = {

        nom: nom.value,
        prenom: prenom.value,
        role: role.value.toLowerCase(),
        rfid: rfid.value,
        uniqueUserNumber: "CLIENT-" + uniqueUserNumber.value,
        dateCreation: Date.now(),

      }
      console.log(data)
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
        nom.value = "",
          prenom.valu = ""
        role.value = ""
        uniqueUserNumber.value = "",
          rfid.value = ""

        refForm.value?.reset()
        refForm.value?.resetValidation()
      })
    }
  })
}

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}
async function myfunc() {
  try {
    await nextTick(); // Ensure the DOM is updated

    const div1 = root.value; // Recto
    const div2 = root1.value; // Verso

    if (!div1 || !div2) {
      throw new Error('One or both divs are not rendered in the DOM.');
    }

    const canvas1 = await html2canvas(div1);
    const canvas2 = await html2canvas(div2);

    const imageData1 = canvas1.toDataURL("image/png");
    const imageData2 = canvas2.toDataURL("image/png");

    // Create a new window for printing
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Popup blocked! Please allow popups for this site.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimer la carte</title>
          
<style>
body {
    margin: 0;
    text-align: center;
}

img {
    max-width: 100%;
    max-height: 100%;
    page-break-after: always;
}
</style>
        </head>
        <body>
          <img width="550px" height="850px" src="${imageData1}" />
          <img width="550px" height="850px" src="${imageData2}" />
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  } catch (error) {
    console.error('Error capturing div:', error);
  }

}
// Column Definitions: Defines the columns to be displayed.
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const etapechange = (etap) => {
  etape.value = etap;
};
</script>

<template>
  <VNavigationDrawer temporary :width="800" location="left" class="scrollable-content" :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate">
    <!-- 👉 Title -->
    <AppDrawerHeaderSection title="Ajouter utilisateur" @cancel="closeNavigationDrawer" />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat :height="600">
        <VCardText>

          <!-- 👉 Form -->
          <VForm ref="refForm" v-model="isFormValid">
            <VRow>
              <VCol>
                <VCard :height="300" class="p-5" v-if="etape == 'client'">
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
                      <AppTextField v-model="uniqueUserNumber" :rules="[requiredValidator]" label="Numéro Utilisateur"
                        placeholder="AB5D1" />
                    </VCol>

                    <!-- 👉 Role -->
                    <VCol cols="6">
                      <AppSelect v-model="role" label="Choissir Role" placeholder="Choisir Role"
                        :rules="[requiredValidator]" :items="['Admin', 'chauffeur', 'Caissier', 'Controller']" />
                    </VCol>

                    <VCardText class="d-flex justify-end flex-wrap gap-3">
                      <VBtn variant="tonal" color="secondary" @click="etapechange('client')">Retour</VBtn>
                      <VBtn @click="etapechange('carte')" class="bg-success">Suivant</VBtn>
                    </VCardText>
                  </VRow>
                </VCard>

                <VCard title="Visualisation de la carte" v-if="etape == 'carte'" :height="400">
                  <VCardText>
                    <VRow>
                      <VCol cols="12" class="d-flex justify-content-center flex-column align-center">

                        <VCard height="200" width="800" class="d-flex justify-content-center align-center ">

                          <div ref="root" class="mb-2">
                            <div class="card">
                              <div class="card-header">
                                <p class="name">
                                  {{ capitalize(nom) + " " + capitalize(prenom)
                                  }}
                                </p>
                                <p class="client-number"
                                  style="display: flex!important ; justify-content:center;height:100px!important;width: 100%;text-align: center;margin-bottom: 1250px">
                                  {{ uniqueUserNumber }}</p>
                              </div>
                            </div>
                          </div>
                          <div ref="root1">

                            <div class="card1">
                              <div class="card-header d-flex justify-contents-center">

                              </div>
                            </div>
                          </div>

                        </VCard>
                      </VCol>
                    </VRow>
                  </VCardText>

                  <VCardText class="d-flex justify-end flex-wrap gap-3">

                    <VBtn variant="tonal" color="secondary" @click="etapechange('client')">Retour</VBtn>
                    <VBtn variant="tonal" color="success" @click="myfunc()" class="mb-1">Imprimer</VBtn>
                    <VBtn @click="etapechange('rfid')" class="bg-success">Suivant</VBtn>
                  </VCardText>
                </VCard>

                <VCard title="Ajouter Rfid" v-if="etape === 'rfid'">
                  <VCardText>
                    <VRow>
                      <VCol cols="12" sm="6" md="4">
                        <AppTextField :rules="[requiredValidator]" v-model="rfid" label="Numéro carte"
                          placeholder="ABC001" autofocus />
                      </VCol>
                    </VRow>
                  </VCardText>

                  <VCardText class="d-flex justify-end flex-wrap gap-3">
                    <VBtn variant="tonal" color="secondary" @click="etapechange('carte')">Retour</VBtn>
                    <VBtn type="reset" variant="tonal" color="error" @click="closeNavigationDrawer">
                      Cancel
                    </VBtn>
                    <VBtn type="submit" class="me-3" color="success" @click.prevent="onSubmit">
                      Submit
                    </VBtn>
                  </VCardText>
                </VCard>

              </VCol>

              <!-- 👉 Submit and Cancel -->

            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>

<style lang="css" scoped>
.container1 {
  position: relative;
  background: url('../../assets/images/TRANSURB-RECTO.png') !important;
  background-repeat: no-repeat !important;
  /* background-size: cover !important; */
  background-position: center !important;
  width: 320px;
  height: 400px;
  background-size: 100% 100% !important;
  border: 5px dotted;
  font-size: 1.2rem;

  color: black;
  display: flex;

  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.paragraph1 {
  position: absolute;
  top: 120px;
  left: 110px;

}

.paragraph2 {
  position: absolute;
  top: 150px;
}

.container2 {
  background: url('../../assets/images/TRANSURB-VERSO.png') !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
  /* background-position: center !important; */
  width: 320px;
  height: 400px;
  border: 5px dotted;
  background-size: 100% 100% !important;
}

.card {
  width: 330px;
  /* Largeur de la carte */
  height: 200px;
  /* Hauteur de la carte */
  border-radius: 15px;
  border: 1px solid grey;
  /* Bords arrondis */
  background: url('../../assets/images/TRANSURB-RECTO.png') !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
  /* background-position: center !important; */
  background-size: 100% 100% !important;
  /* Dégradé de couleur */
  /* box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); */
  /* Ombre */
  color: black;
  /* Couleur du texte */
  margin-top: 7px;
  padding: 20px;
  /* Espacement intérieur */
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* Centrer le contenu verticalement */
  align-items: center;
  /* Centrer le contenu horizontalement */
}

.card-header {
  text-align: center;
  /* Centrer le texte */
}

.name {
  font-size: 15px;
  /* Taille de la police pour le nom */
  margin: 0;
  text-align: center;

  width: 100%;
  position: absolute;
  top: 50px;
  right: 0px;
  /* Supprimer la marge par défaut */
}

.client-number {
  font-size: 14px;
  /* Taille de la police pour le numéro client */
  margin-top: 10px;
  /* Espace au-dessus du numéro client */
  color: black;
  position: absolute;
  top: 60px;
  right: 0px;

}

.card1 {
  background: url('../../assets/images/TRANSURB-VERSO.png') !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
  width: 330px;
  /* Largeur de la carte */
  margin-left: 5px;
  height: 200px;
  /* Hauteur de la carte */
  border-radius: 15px;
  /* Bords arrondis */

  background-size: 100% 100% !important;
  /* Dégradé de couleur */
  border: 1px solid grey;
  /* Ombre */
  color: black;
  /* Couleur du texte */
  padding: 20px;
  /* Espacement intérieur */
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* Centrer le contenu verticalement */
  align-items: center;
  /* Centrer le contenu horizontalement */
}
</style>
