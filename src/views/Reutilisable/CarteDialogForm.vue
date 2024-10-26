<script setup>
import { requiredValidator } from '@/@core/utils/validators';
import html2canvas from 'html2canvas';
import { onMounted, ref } from 'vue';
const props = defineProps({
  isDialogVisible: Boolean,
});
const emit = defineEmits([
  'userData', 'clientId'
])
const isDialogVisible = ref(false);
const numClient = ref('');
const nom = ref('');
const prenom = ref('');
const quartier = ref('');
const nomAgent = ref('Mboumba eric');
const recto = ref(true);
const rfid = ref('')
const dateCreationCarte = ref('')
const dateExpiration = ref('')
const nomAgentCarte = ref('')
const dateCreation = ref('');
const active = ref(true);
const etape = ref('client');
const ville = ref('Libreville');
const client = ref({})
const clientId = ref('')
const villelist = [
  'Libreville',
  'Franceville',
  'Port-gentil',
  'Lambaréné',
  'Oyem',
  'Koulamoutou',
  'Makokou',
  'Tchibanga',
  'Mouila'
];

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
const fetchData = () => {
  return fetch("http://51.178.42.116:8089/api/clients")
    .then(resp => {
      if (!resp.ok) throw new Error('Network response was not ok');
      return resp.json();
    })
    .then(data => data.map(client =>

    ({
      ...client,

    })

    ));
};
let list = []
onMounted(async () => {
  const fetchedClients = await fetchData();
  clients.value = fetchedClients; // Update the reactive array
});
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function clearForm() {
  numClient.value = '';
  nom.value = '';
  prenom.value = '';
  quartier.value = '';
  nomAgent.value = '';

  rfid.value = '';
  dateCreationCarte.value = '';
  dateExpiration.value = '';
  nomAgentCarte.value = '';
  dateCreation.value = '';
  active.value = true; // Reset to default if needed
  etape.value = 'client'; // Reset to initial step
  ville.value = 'Libreville'; // Reset to default city
}
const clients = ref([])
const selectedOption = ref(null);
const root = ref(null);
const root1 = ref(null);
watch(selectedOption, (newValue) => {
  console.log('Selected option changed:', newValue);
  clientId.value = newValue
  let newList = clients.value.filter(client => client.id == newValue);
  client.value = newList[0]
});
const etapechange = (etap) => {
  etape.value = etap;
};

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
            body { margin: 0; text-align: center; }
            img { max-width: 100%; max-height: 100%; page-break-after: always; }
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
const handleClientChange = (newClient) => {
  let newtab = []
  newtab = clients.value.filter(client => client.id == newClient);
  client.value = newtab[0]
  console.log(newClient)
  // Update itemsPerPage or any other logic you want to handle
  // Example
};
const engerister = () => {

  const userData = {
    carte: {

      rfid: rfid.value,
      dateCreation: new Date().toISOString(),
      dateExpiration: new Date(Date.now() + (3 * 365 * 24 * 60 * 60 * 1000)).toISOString(),
      active: true,
      nomAgent: nomAgent.value,
      forfaitActif: false,
    },
    clientId: clientId.value
  };

  console.log(client.id)
  emit('userData', userData)

  // clearForm()
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
        Ajouter Carte
      </VBtn>
    </template>

    <DialogCloseBtn @click="close()" />

    <VCard title="Ajouter client" v-if="etape === 'client'">
      <VCardText>
        <VRow>

          <VCol cols="12" sm="6">
            <label for="my-select" class="form-label">Choisir un client:</label>
            <select v-model="selectedOption" id="my-select" class="form-select">
              <option v-for="option in clients" :key="option.id" :value="option.id">
                {{ option.nom + ' ' + option.prenom }}
              </option>
            </select>

          </VCol>

        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn variant="tonal" color="secondary" @click="clear()">Annuler</VBtn>
        <VBtn @click="etapechange('carte')" class="bg-success">Suivant</VBtn>
      </VCardText>
    </VCard>

    <VCard title="Visualisation de la carte" v-if="etape === 'carte'">
      <VCardText>
        <VRow>
          <VCol cols="12">

            <VBtn variant="tonal" color="success" @click="myfunc()" class="mb-1">Imprimer</VBtn>
            <VCard height="400" class="d-flex justify-content-center align-center">

              <div ref="root" class="mb-2">
                <div class="card">
                  <div class="card-header">
                    <p class="name text-center">
                      {{ capitalize(client.nom) + " " + capitalize(client.prenom)
                      }}
                    </p>
                    <p class="client-number text-center"
                      style="display: flex !important ; justify-content: center;block-size: 100px !important;inline-size: 100%;margin-block-end: 1250px;text-align: center;">
                      {{ client.numClient }}</p>
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
        <VBtn @click="etapechange('rfid')" class="bg-success">Suivant</VBtn>
      </VCardText>
    </VCard>

    <VCard title="Ajouter Rfid" v-if="etape === 'rfid'">
      <VCardText>
        <VRow>
          <VCol cols="12" sm="6" md="4">
            <AppTextField @change="choixClient" :rules="[requiredValidator]" v-model="rfid" label="Numéro carte"
              placeholder="ABC001" autofocus />
          </VCol>
          <VCol cols="12" sm="6">
            <AppTextField v-model="nomAgent" :rules="[requiredValidator]" label="Nom Agent" placeholder="Nzé Noé" />
          </VCol>
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn variant="tonal" color="secondary" @click="etapechange('carte')">Retour</VBtn>
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
