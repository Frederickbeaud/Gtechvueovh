<template>
  <div>
    <div class="app-user-search-filter d-flex align-center flex-wrap gap-4 mb-2">

      <!-- 👉 Export button -->

      <!-- 👉 Add user button -->
      <!-- <VBtn prepend-icon="tabler-plus" @click="isAddNewUserDrawerVisible = true" >
          Add New User
        </VBtn> -->
      <CarteDialogForm @userData="addNewCarte" />
    </div>
    <ag-grid-vue :rowData="rowData ?? []" :columnDefs="colDefs" :defaultColDef="defaultColDef"
      style=" block-size: 70vh;inline-size: 100%;" class="ag-theme-quartz" @grid-ready="onGridReady"
      :cacheBlockSize="cacheBlockSize" :pagination="true" :paginationPageSize="paginationPageSize"
      @cellClicked="onCellClicked">
    </ag-grid-vue>
    <!-- <AddNewUserDrawer v-model:isDrawerOpen="isAddNewUserDrawerVisible" @user-data="addNewUser" /> -->
    <ModalCarte :rowId="rowId" />

  </div>
</template>

<script setup>
import ButtonComp from "@/views/Reutilisable/ButtonComp.vue";
import {
  AgGridVue
} from "ag-grid-vue3";
// import AddNewUserDrawer from '@/views/apps/user/list/AddNewUserDrawer.vue'
import CarteDialogForm from "@/views/Reutilisable/CarteDialogForm.vue";
import ModalCarte from "@/views/Reutilisable/ModalCarte.vue";
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
  headerName: 'Numéro Carte',
  field: "rfid"
},
{
  headerName: 'Numéro Client',
  field: "client.numClient"
},
{
  headerName: 'Nom',
  field: "client.nom"
},
{
  headerName: 'Prénom',
  field: "client.prenom"
},
{
  headerName: 'Date de fin validité',
  field: "dateExpiration"
},
{
  headerName: 'Date de délivrance',
  field: "dateCreation"
},

{
  headerName: 'Terminal',
  field: "terminal.id"
},
{
  headerName: 'Agent',
  field: "nomAgent"
},

{
  headerName: 'Status',
  field: "active"
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

// const fetchData = () => {
//   return fetch("http://localhost:8080/api/clients/cartes")
//     .then(resp => {
//       if (!resp.ok) throw new Error('Network response was not ok');
//       return resp.json();
//     })
//     .then(data => data.map(carte => {
//       let client = {}
//       fetch(`http://localhost:8080/api/clients/rfid/${carte.rfid}`)
//         .then(resp => {
//           if (!resp.ok) throw new Error('Network response was not ok');
//           return resp.json();
//         }).then(data => client = data);
//       return ({
//         ...carte,
//         client: client,
//         dateCreation: formatTimestamp(carte.dateCreation),
//         dateExpiration: formatTimestamp(carte.dateExpiration),
//       })
//     }
//     ));
// };
const fetchData = async () => {
  try {
    const response = await fetch("http://51.178.42.116:8089/api/clients/cartes");
    if (!response.ok) throw new Error('Network response was not ok');

    const cartes = await response.json();

    // Map over cartes and fetch client data for each
    const cartesWithClients = await Promise.all(cartes.map(async (carte) => {
      const clientResponse = await fetch(`http://51.178.42.116:8089/api/clients/rfid/${carte.rfid}`);
      if (!clientResponse.ok) throw new Error('Network response was not ok');

      const clientData = await clientResponse.json();

      return {
        ...carte,
        client: clientData,
        dateCreation: formatTimestamp1(carte.dateCreation),
        dateExpiration: formatTimestamp1(carte.dateExpiration),
      };
    }));

    return cartesWithClients;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Re-throw error for further handling if necessary
  }
};
function formatTimestamp1(timestamp) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

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
const addNewClient = async (userData, clientId) => {
  console.log(userData, clientId);
  // await fetch('http://localhost:8080/api/clients', {
  //   method: 'POST',
  //   headers: {
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(userData)  // Make sure to stringify the object
  // }).then((res) => fetchData().then(data => {
  //   console.log(data + "+++++++")

  //   rowData.value = data.reverse()
  // }).catch(console.error)).catch(console.error);
  fetch(`http://localhost:8080/api/clients/${clientId}/cartes`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)  // Make sure to stringify the object
  }).then((res) => res.json()).then((res) => fetchData().then(data => {
    console.log(data + "++++add success++")

    rowData.value = data.reverse()
  })).catch(console.error);
};
const addNewCarte = async (userData) => {
  console.log(userData);

  try {
    const response = await fetch(`http://51.178.42.116:8089/api/clients/${userData.clientId}/cartes`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData.carte)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data + "++++add success++");

    const fetchedData = await fetchData();
    rowData.value = fetchedData.reverse();

  } catch (error) {
    console.error('Error adding new client:', error);
  }
};
</script>

<style scoped>
.ag-theme-quartz {
  --ag-cell-horizontal-border: solid rgb(150, 150, 200);
}
</style>
