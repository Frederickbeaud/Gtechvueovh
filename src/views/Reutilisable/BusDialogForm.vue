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
const Immatriculation = ref('');
const trajet = ref('');
const chauffeur = ref('');
const macAddress = ref('');
const marque = ref('');
const modele = ref('');

const utilisateurs = ref([])
const terminaux = ref([])
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
  Immatriculation.value = '';
  trajet.value = '';
  chauffeur.value = '';
  macAddress.value = '';
  marque.value = ''
  modele.value = ''
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
    "immatriculation": Immatriculation.value,
    "trajet": trajet.value,
    "chauffeur": chauffeur.value,
    "modele": modele.value,
    "marque": marque.value,
    "macAddress": macAddress.value
  };

  console.log(typeof userData)
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
const fetchDataUtilisateurs = () => {
  return fetch("http://localhost:8089/api/utilisateurs")
    .then(resp => {
      if (!resp.ok) throw new Error('Network response was not ok');
      return resp.json();
    })
    .then(data => data);
};
const fetchDataTerminaux = () => {
  return fetch("http://localhost:8089/api/terminals")
    .then(resp => {
      if (!resp.ok) throw new Error('Network response was not ok');
      return resp.json();
    })
    .then(data => data);
};
onMounted(async () => {
  const fetchUtilisateurs = await fetchDataUtilisateurs();
  console.log(fetchUtilisateurs)
  utilisateurs.value = fetchUtilisateurs.filter(u => u.role == "chauffeur") ?? []; // Update the reactive array 
  const fetchTerminaux = await fetchDataTerminaux();
  console.log(fetchTerminaux)
  terminaux.value = fetchTerminaux ?? [] // Update the reactive array
});
</script>

<template>
  <VDialog v-model="isDialogVisible" max-width="1000">
    <template #activator="{ props }">
      <VBtn v-bind="props" class="bg-success" prepend-icon="tabler-plus">
        Ajouter Vehicule
      </VBtn>
    </template>

    <DialogCloseBtn @click="close()" />

    <VCard title="Ajouter un vehicule" v-if="etape === 'client'">
      <VCardText>
        <VRow>
          <VCol cols="12" sm="6" md="4">
            <AppTextField v-model="Immatriculation" :rules="[requiredValidator]" label="Immatriculation"
              placeholder="PPASDGA4" />
          </VCol>
          <VCol cols="12" sm="6" md="4">
            <AppTextField v-model="trajet" :rules="[requiredValidator]" label="Trajet" placeholder="Pk5-pk12" />
          </VCol>
          <VCol cols="12" sm="6">
            <AppTextField v-model="marque" :rules="[requiredValidator]" label="Marque" placeholder="Toyota" />
          </VCol>
          <VCol cols="12" sm="6">
            <AppTextField v-model="modele" :rules="[requiredValidator]" label="Modèle" placeholder="Coster" />
          </VCol>
          <VCol cols="12" sm="6" md="4" v-if="utilisateurs">
            <label for="my-select" class="form-label">Choisir un chauffeur:</label>
            <select v-model="chauffeur" id="my-select" class="form-select">
              <option v-for="option in utilisateurs" :key="option.id" :value="`${option.nom} ${option.prenom}`">
                {{ option.nom + ' ' + option.prenom }}
              </option>
            </select>
          </VCol>
          <VCol cols="12" sm="6" v-if="terminaux">
            <label for="my-select" class="form-label">Choisir un Terminal:</label>
            <select v-model="macAddress" id="my-select" class="form-select">
              <option v-for="option in terminaux" :key="option.id" :value="`${option.macAddress}`">
                {{ option.macAddress ?? "Aucun terminal" }}
              </option>
            </select>
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
