<template>
  <div>
    <div class="app-user-search-filter d-flex align-center flex-wrap gap-4 mb-2">

      <!-- 👉 Export button -->

      <!-- 👉 Add user button -->
      <!-- <VBtn prepend-icon="tabler-plus" @click="isAddNewUserDrawerVisible = true" >
          Add New User
        </VBtn> -->
      <TerminalDialogForm @userData="addNewClient" />
    </div>
    <ag-grid-vue :rowData="rowData ?? []" :columnDefs="colDefs" :defaultColDef="defaultColDef"
      style=" block-size: 70vh;inline-size: 100%;" class="ag-theme-quartz" @grid-ready="onGridReady"
      :cacheBlockSize="cacheBlockSize" :pagination="true" :paginationPageSize="paginationPageSize"
      @cellClicked="onCellClicked">
    </ag-grid-vue>
    <!-- <AddNewUserDrawer v-model:isDrawerOpen="isAddNewUserDrawerVisible" @user-data="addNewUser" /> -->
    <Modalterminaux :rowId="rowId" />

  </div>
</template>

<script setup>
import ButtonComp from "@/views/Reutilisable/ButtonComp.vue";
import Modalterminaux from "@/views/Reutilisable/Modalteminaux.vue";
// Vue Data Grid Component
import {
  AgGridVue
} from "ag-grid-vue3";
// import AddNewUserDrawer from '@/views/apps/user/list/AddNewUserDrawer.vue'
import TerminalDialogForm from "@/views/Reutilisable/TerminalDialogForm.vue";
const rowData = ref([]);
const rowModelType = ref(null);
const paginationPageSize = ref(null);
const cacheBlockSize = ref(null);
const autoGroupColumnDef = ref(null);
const rowGroupPanelShow = ref(null);
const sideBar = ref(null);
const rowId = ref(1)
// Column Definitions: Defines the columns to be displayed.

const gridApi = shallowRef();
const frameworkComponents = {
  actionButton: ButtonComp,
};
const colDefs = ref([{
  headerName: 'ID Terminal',
  field: "terminalId"
},
{
  headerName: 'Type',
  field: "typeTerminal"
},
{
  headerName: 'Addresse Mac',
  field: "macAddress"
},
{
  headerName: 'Dernier Bus associé',
  field: "busMatricule"
},



{
  headerName: 'Actions',
  field: "id",
  cellRenderer: ButtonComp,

  editable: false
}
]);

// Handle the emitted event
function onCellClicked(value) {
  rowId.value = value.value
  console.log('Cell clicked with original value:', rowId.value);
  // You can perform additional actions based on the clicked cell value here
}
watch(rowData, (newValue, oldValue) => {
  console.log('Row data changed:', { newValue, oldValue });
  // You can perform additional actions here

});
// In your grid options
const gridOptions = {
  // frameworkComponents,
  // other options...
};
// const autoSizeStrategy = ref(null);

// onBeforeMount(() => {
//   autoSizeStrategy.value = {
//     type: "fitCellContents",
//   };
// });


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
function formatTimestamp1(timestamp) {
  const date = new Date(timestamp);

  const jourDuMois = String(date.getDate()).padStart(2, '0');
  const mois = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const annee = date.getFullYear();

  return `${jourDuMois}/${mois}/${annee}`;
}
// Now you can access any specific column value from 'data'

// onMounted(() => {
//   fetch("http://localhost:8080/api/clients")
//     .then((resp) => {
//       if (!resp.ok) throw new Error('Network response was not ok');
//       return resp.json();
//     })
//     .then((data) => {
//       console.warn(data);
//       (rowData.value = data)
//     })
//     .catch((error) => console.error('Fetch error:', error));
// });
// const defaultColDef = ref({
//   width: rowData.value.length < 4 ? 275 : 50,
//   flex: 1,
//   minWidth: 100,
//   filter: true,
//   floatingFilter: true,
//   enableRowGroup: true,
// });

const defaultColDef = ref({
  width: 100,
  flex: 1,
  minWidth: 100,
  filter: true,
  floatingFilter: true,
  enableRowGroup: true,
});

const autoSizeAll = (skipHeader) => {
  const allColumnIds = [];
  gridApi.value.getColumns().forEach((column) => {
    allColumnIds.push(column.getId());
  });
  gridApi.value.autoSizeColumns(allColumnIds, skipHeader);
};

const fetchData = () => {
  return fetch("http://51.178.42.116:8089/api/terminals")
    .then(resp => {
      if (!resp.ok) throw new Error('Network response was not ok');
      return resp.json();
    })
    .then(data => data.map(ter =>

    ({
      ...ter,

    })

    ));
};

const onGridReady = (params) => {
  // Store the grid API for later use
  gridApi.value = params.api;
  rowModelType.value = "serverSide";
  paginationPageSize.value = 20;
  cacheBlockSize.value = 10;
  autoGroupColumnDef.value = {
    minWidth: 200,
    filter: "agGroupColumnFilter",
  };
  rowGroupPanelShow.value = "always";
  sideBar.value = "filters";
  // Fetch data for the grid
  fetchData().then(data => {
    console.log(data)
    rowData.value = data.reverse()
  }).catch(console.error);
};
// onBeforeMount(() => {
//   rowModelType.value = "serverSide";
//   paginationPageSize.value = 20;
//   cacheBlockSize.value = 10;
//   autoGroupColumnDef.value = {
//     minWidth: 200,
//     filter: "agGroupColumnFilter",
//   };
//   rowGroupPanelShow.value = "always";
//   sideBar.value = "filters";

//   fetchData().then(data => {
//     console.log(data)
//     rowData.value = data
//   }).catch(console.error);
// });
const addNewClient = async userData => {
  console.log(userData);
  await fetch('http://51.178.42.116:8089/api/terminals/create', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)  // Make sure to stringify the object
  }).then((res) => fetchData().then(data => {
    console.log(data + "+++++++")
    rowData.value = data.reverse()
  }).catch(console.error)).catch(console.error);
};
</script>

<style scoped>
.ag-theme-quartz {
  --ag-cell-horizontal-border: solid rgb(150, 150, 200);
}
</style>
