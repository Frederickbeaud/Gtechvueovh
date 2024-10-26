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
          <UserBioPanel :userData="userData" />
        </div>

      </div>
    </div>
  </div>

</template>

<script setup>
import UserBioPanel from '@/views/Reutilisable/view/UserBioPanel.vue';
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
    const updateData = (data) => (userData.value = data);
    console.log(props.rowId)
    fetch(`http://51.178.42.116:8089/api/clients/${props.rowId}`)
      .then((resp) => resp.json())
      .then((data) => {
        data.cartes = data.cartes.map(carte =>

        ({
          ...carte,
          dateCreation: formatTimestamp1(carte.dateCreation),
          dateExpiration: formatTimestamp1(carte.dateExpiration)

        })

        )
        console.log(data)

        updateData(data)

      });

  }
);
function formatTimestamp1(timestamp) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
onMounted(() => {
  const updateData = (data) => (userData.value = data);
  console.log(props.rowId)
  fetch(`http://51.178.42.116:8089/api/clients/${props.rowId}`)
    .then((resp) => resp.json())
    .then((data) => {
      data.cartes = data.cartes.map(carte =>

      ({
        ...carte,
        dateCreation: formatTimestamp1(carte.dateCreation),
        dateExpiration: formatTimestamp1(carte.dateExpiration)

      })

      )

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
  max-width: 1400px !important;
  /* Set your desired max width */
  width: 95% !important;
  /* Full width on smaller screens */
}

.modal-content {
  padding: 0px;
  /* Adjust padding if necessary */
}
</style>
