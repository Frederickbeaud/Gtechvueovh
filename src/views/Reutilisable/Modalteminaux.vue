<template>

  <!-- Modal -->
  <div class="modal fade  modal-xl " id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-success">
          <h1 class="modal-title fs-5" id="exampleModalLabel"></h1>
          <button type="button" class="btn-close text-white bg-danger" data-bs-dismiss="modal"
            style="color: white !important;" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <TermiBioPanel :userData="userData" />
        </div>

      </div>
    </div>
  </div>

</template>

<script setup>

import TermiBioPanel from '@/views/Reutilisable/view/TermiBioPanel.vue';
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
    fetch(`http://51.178.42.116:8089/api/terminals/${props.rowId}`)
      .then((resp) => resp.json())
      .then((data) => {
        data

        console.log(data)

        updateData(data)

      });

  }
);

onMounted(() => {
  const updateData = (data) => (userData.value = data);
  console.log(props.rowId)
  fetch(`http://51.178.42.116:/api/terminals/${props.rowId}`)
    .then((resp) => resp.json())
    .then((data) => {
      data

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

<style lang="css" scoped>
.btn-close {
  color: white !important;
}
</style>
