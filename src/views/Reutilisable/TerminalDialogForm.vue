<script setup>
import { requiredValidator } from '@/@core/utils/validators';
import { ref } from 'vue';
const props = defineProps({
  isDialogVisible: Boolean,
});
const emit = defineEmits([
  'userData',
])
const isDialogVisible = ref(false);
const TerminalId = ref('');
const typeTermina = ref('');

const macAddress = ref('');


const etape = ref('client');

const selectedOption = ref(null);
const selectedOption1 = ref(null);
watch(
  () => props.isDialogVisible,
  (newValue, oldValue) => {
    console.log('Dialog is now hidden');

    if (newValue) {
      isDialogVisible.value = true


    } else {

    }
  }
);
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function clearForm() {
  typeTermina.value = '';
  macAddress.value = '';
  TerminalId.value = '';

}
const root = ref(null);
const root1 = ref(null);

const etapechange = (etap) => {
  etape.value = etap;
};
watch(selectedOption, (newValue) => {
  console.log('Selected option changed:', newValue);

});
watch(selectedOption1, (newValue) => {
  console.log('Selected option changed:', newValue);

});
const engerister = () => {
  const userData = {
    "terminalId": TerminalId.value,
    "typeTerminal": typeTermina.value,
    "macAddress": macAddress.value,


  };

  console.log(userData)
  emit('userData', userData)

  clearForm()
  isDialogVisible.value = false
}
const close = () => {
  clearForm()
  isDialogVisible.value = !isDialogVisible.value
}
const clear = () => {
  clearForm()
  isDialogVisible.value = false
}

</script>

<template>
  <VDialog v-model="isDialogVisible" max-width="1000">
    <template #activator="{ props }">
      <VBtn v-bind="props" class="bg-success" prepend-icon="tabler-plus">
        Ajouter terminal
      </VBtn>
    </template>

    <DialogCloseBtn @click="close()" />

    <VCard title="Ajouter un terminal" v-if="etape === 'client'">
      <VCardText>
        <VRow>
          <VCol cols="12" sm="6" md="4">
            <AppTextField v-model="TerminalId" :rules="[requiredValidator]" label="ID du terminal" placeholder="" />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <AppTextField v-model="macAddress" :rules="[requiredValidator]" label="Addresse Mac"
              placeholder="00-B0-D0-63-C2-26" />
          </VCol>
          <VCol cols="12" sm="6">
            <AppSelect v-model="typeTermina" :rules="[requiredValidator]" :items="['Tablette', 'POS']" label="Type"
              single-line variant="filled" placeholder="Selection terminal" />
          </VCol>




        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn variant="tonal" color="secondary" @click="clear()">Annuler</VBtn>
        <VBtn @click="engerister()" class="bg-success">Enregistrer</VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="css" scoped>
.container1 {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  border: 5px dotted;
  background: url("../../assets/images/TRANSURB-RECTO.png") !important;

  /* background-size: cover !important; */
  background-position: center !important;
  background-repeat: no-repeat !important;
  background-size: 100% 100% !important;
  block-size: 400px;
  color: black;
  font-size: 1.2rem;
  inline-size: 320px;
}

.paragraph1 {
  position: absolute;
  inset-block-start: 120px;
  inset-inline-start: 110px;
}

.paragraph2 {
  position: absolute;
  inset-block-start: 150px;
}

.container2 {
  border: 5px dotted;
  background: url("../../assets/images/TRANSURB-VERSO.png") !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
  background-size: 100% 100% !important;
  block-size: 400px;

  /* background-position: center !important; */
  inline-size: 320px;
}

.card {
  /* Espacement intérieur */
  display: flex;
  flex-direction: column;

  /* Centrer le contenu verticalement */
  align-items: center;
  justify-content: center;

  /* Couleur du texte */
  padding: 20px;
  border: 1px solid grey;

  /* Hauteur de la carte */
  border-radius: 15px;

  /* Bords arrondis */
  background: url("../../assets/images/TRANSURB-RECTO.png") !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;

  /* background-position: center !important; */
  background-size: 100% 100% !important;

  /* Largeur de la carte */
  block-size: 200px;

  /* Dégradé de couleur */

  /* box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); */

  /* Ombre */
  color: black;
  inline-size: 330px;

  /* Centrer le contenu horizontalement */
}

.card-header {
  text-align: center;

  /* Centrer le texte */
}

.name {
  position: absolute;

  /* Taille de la police pour le nom */
  margin: 0;
  font-size: 15px;
  inline-size: 100%;
  inset-block-start: 50px;
  inset-inline-end: 0;
  text-align: center !important;

  /* Supprimer la marge par défaut */
}

.client-number {
  position: absolute;

  /* Espace au-dessus du numéro client */
  color: black;
  font-size: 14px;
  inset-block-start: 60px;
  inset-inline-end: 0;

  /* Taille de la police pour le numéro client */
  margin-block-start: 10px;
  text-align: center;
}

.card1 {
  /* Espacement intérieur */
  display: flex;
  flex-direction: column;

  /* Centrer le contenu verticalement */
  align-items: center;
  justify-content: center;

  /* Couleur du texte */
  padding: 20px;
  border: 1px solid grey;

  /* Hauteur de la carte */
  border-radius: 15px;
  background: url("../../assets/images/TRANSURB-VERSO.png") !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;

  /* Bords arrondis */

  background-size: 100% 100% !important;
  block-size: 200px;

  /* Dégradé de couleur */

  /* box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); */

  /* Ombre */
  color: black;
  inline-size: 330px;

  /* Largeur de la carte */
  margin-inline-start: 5px;

  /* Centrer le contenu horizontalement */
}

.ag-theme-quartz {
  --ag-cell-horizontal-border: solid rgb(150, 150, 200);
}
</style>
