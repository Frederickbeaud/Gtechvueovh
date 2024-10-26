<template>

  <!-- Modal -->
  <div class="modal fade  modal-xl " id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog custom-modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-success">
          <h1 class="modal-title fs-5" id="exampleModalLabel"></h1>
          <button type="button" class="btn-close text-white bg-danger" data-bs-dismiss="modal"
            style="color: white !important;" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <CarteBioPanel :userData="userData" />
        </div>

      </div>
    </div>
  </div>

</template>

<script setup>

import CarteBioPanel from '@/views/Reutilisable/view/CarteBioPanel.vue';
import { onMounted, ref } from 'vue';
const props = defineProps({
  rowId: {
    type: Number,
    required: true,
    default: 1
  },
})
const userData = ref([])
watch(
  () => props.rowId, // Watch the rowId prop
  (newValue, oldValue) => {
    console.log('Row ID changed from', oldValue, 'to', newValue);
    // Yoconst updateData = (data) => (userData.value = data);
    const updateData = (data) => {
      data.map(carte => {

      })

        (userData.value = data)
    };
    console.log(props.rowId)
    fetch(`http://51.178.42.116:8089/api/clients/cartes/${props.rowId}`)
      .then((resp) => resp.json())
      .then((data) => {


        updateData(data)

      });

  }
);
const fetchSingleCarteWithClient = async (carteId) => {
  try {
    const carteResponse = await fetch(`http://51.178.42.116:8089/api/clients/cartes/${carteId}`);
    if (!carteResponse.ok) throw new Error('Network response was not ok');

    const carte = await carteResponse.json();

    // Fetch client data for the specific carte
    const clientResponse = await fetch(`http://51.178.42.116:8089/api/clients/rfid/${carte.rfid}`);
    if (!clientResponse.ok) throw new Error('Network response was not ok');

    const clientData = await clientResponse.json();

    return {
      ...carte,
      client: clientData,
      dateCreation: formatTimestamp1(carte.dateCreation),
      dateExpiration: formatTimestamp1(carte.dateExpiration),
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Re-throw error for further handling if necessary
  }
};
onMounted(() => {
  const updateData = (data) => (userData.value = data);
  console.log(props.rowId)
  fetch(`http://51.178.42.116:8089/api/clients/cartes/${props.rowId}`)
    .then((resp) => resp.json())
    .then((data) => {

      console.log(data)
      updateData(data)
    }
    );
})
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
</script>
<style scoped>
.custom-modal-dialog {
  min-width: 1300px !important;
  /* Set your desired max width */
  width: 100%;
  /* Full width on smaller screens */
}

.modal-content {
  padding: 0px;
  /* Adjust padding if necessary */
}
</style>
