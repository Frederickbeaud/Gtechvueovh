<template>
    <VBtn variant="tonal" class="text-white mb-2 mx-2" color="error" @click="setVisible(true)">
        Cartes attachées
    </VBtn>
    <VBtn variant="tonal" class="text-white mb-2 mx-2" color="success" @click="setVisible(false)">
        Nouvelle carte
    </VBtn>
    <div v-if="visible">
        <ag-grid-vue :rowData="rowData ?? []" :columnDefs="colDefs" :defaultColDef="defaultColDef"
            style="height:450pt;width: 100%;" class="ag-theme-quartz" @grid-ready="onGridReady"
            :cacheBlockSize="cacheBlockSize" :pagination="true" :paginationPageSize="paginationPageSize">
        </ag-grid-vue>
    </div>
    <div v-else>
        <VCard title="Visualisation de la carte" v-if="etape === 'carte'">
            <VCardText>
                <VRow>
                    <VCol cols="12">

                        <VBtn variant="tonal" color="success" @click="myfunc()" class="mb-1">Imprimer</VBtn>
                        <VCard height="300" class="d-flex justify-content-center align-center">

                            <div ref="root" class="mb-2">
                                <div class="card">
                                    <div class="card-header">
                                        <p class="name">
                                            {{ capitalize(props.userData.nom) + " " + capitalize(props.userData.prenom)
                                            }}
                                        </p>
                                        <p class="client-number"
                                            style="display: flex!important ; justify-content:center;height:100px!important;width: 100%;text-align: center;margin-bottom: 1250px">
                                            {{ props.userData.numClient }}</p>
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
                <VBtn variant="tonal" color="secondary" @click="etapechange('carte')">Retour</VBtn>
                <VBtn @click="etapechange('rfid')" class="bg-success">Suivant</VBtn>
            </VCardText>
        </VCard>
        <VCard title="Ajouter Rfid" v-if="etape === 'rfid'">
            <VCardText>
                <VRow>
                    <VCol cols="12" sm="6" md="4">
                        <AppTextField :rules="[requiredValidator]" v-model="rfid" label="Numéro carte" autofocus
                            placeholder="ABC001" />
                    </VCol>
                </VRow>
            </VCardText>

            <VCardText class="d-flex justify-end flex-wrap gap-3">
                <VBtn variant="tonal" color="secondary" @click="etapechange('carte')">Retour</VBtn>
                <VBtn @click="engerister()" class="bg-success">Enregistrer</VBtn>
            </VCardText>
        </VCard>
    </div>
</template>

<script setup>
import ButtonComp from "@/views/Reutilisable/ButtonComp.vue";
// Vue Data Grid Component
import { AgGridVue } from "ag-grid-vue3";
import { onMounted } from "vue";
const props = defineProps({
    userData: {
        type: Object,
        required: true,
    },
})
const root = ref(null);
const root1 = ref(null);
const etape = ref('carte');
const visible = ref(true)
const rowData = ref([]);
const rowModelType = ref(null);
const paginationPageSize = ref(null);
const cacheBlockSize = ref(null);
const autoGroupColumnDef = ref(null);
const rowGroupPanelShow = ref(null);
const sideBar = ref(null);
let intervalId;
const nomAgent = ref('nzoé');


const rfid = ref('')



const ville = ref('Libreville');

// Column Definitions: Defines the columns to be displayed.
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
const etapechange = (etap) => {
    etape.value = etap;
};
const colDefs = ref([{
    headerName: 'Numero Carte',
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
    headerName: 'Derniere Transaction',
    field: "dernierTransaction.id"
},
{
    headerName: 'Date de délivrance',
    field: "dateCreation"
},
{
    headerName: 'Agent',
    field: "client.nomAgent"
},

{
    headerName: 'Status',
    field: "nomAgent"
},
{
    headerName: 'Actions',
    field: "id",
    cellRenderer: ButtonComp,

    editable: false
}
]);
// Function to set visibility state
const setVisible = (value) => {
    visible.value = value;
};
const gridApi = shallowRef();

// const autoSizeStrategy = ref(null);

// onBeforeMount(() => {
//   autoSizeStrategy.value = {
//     type: "fitCellContents",
//   };
// });
const defaultColDef = ref({
    width: rowData.value.length < 4 ? 275 : 150,
    flex: 1,
    minWidth: 150,
    filter: true,
    floatingFilter: true,
    enableRowGroup: true,
});

const onColumnResized = (params) => {
    console.log(params);
};
const autoSizeAll = (skipHeader) => {
    const allColumnIds = [];
    gridApi.value.getColumns().forEach((column) => {
        allColumnIds.push(column.getId());
    });
    gridApi.value.autoSizeColumns(allColumnIds, skipHeader);
};
const onGridReady = (params) => {
    gridApi.value = params.api;

    // const updateData = (data) => (rowData.value = data);
    let cartes = []
    if (props.userData.cartes) {
        cartes = props?.userData?.cartes.map(carte => {
            return {
                ...carte, // Spread the current carte
                client: {
                    ...props.userData, // Spread user data into client
                    cartes: [] // Set cartes to an empty array
                },

            };
        });
    }
    console.log(cartes)
    rowData.value = cartes
    // // fetch("http://localhost:8080/api/clients/rfid/")
    // //     .then((resp) => resp.json())
    // //     .then((data) => updateData(data));
};
onMounted(() => {
    rowModelType.value = "serverSide";
    paginationPageSize.value = 20;
    cacheBlockSize.value = 10;
    autoGroupColumnDef.value = {
        minWidth: 200,
        filter: "agGroupColumnFilter",
    };
    rowGroupPanelShow.value = "always";
    sideBar.value = "filters";
    let cartes = []
    if (props.userData.cartes) {
        cartes = props?.userData?.cartes.map(carte => {
            return {
                ...carte, // Spread the current carte
                client: {
                    ...props.userData, // Spread user data into client
                    cartes: [] // Set cartes to an empty array
                },

            };
        });
    }
    console.log(cartes)
    rowData.value = cartes
    // // fetch("http://localhost:8080/api/clients/rfid/")
    // //     .then((resp) => resp.json())
    // //     .then((data) => updateData(data));
});
watch(
    () => props.userData.cartes,
    (newCartes, oldCartes) => {
        console.log('Cartes changed:', { newCartes, oldCartes });
        // Perform actions based on the changes
        let cartes = []
        if (props.userData.cartes) {
            cartes = props?.userData?.cartes.map(carte => {
                return {
                    ...carte, // Spread the current carte
                    client: {
                        ...props.userData, // Spread user data into client
                        cartes: [] // Set cartes to an empty array
                    },

                };
            });
        }
        console.log(cartes)
        rowData.value = cartes
        // // fetch("http://localhost:8080/api/clients/rfid/")
        // //     .then((resp) => resp.json())
        // //     .then((data) => updateData(data));
    },
    { deep: true } // Use deep watch if the structure of cartes is nested
);
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
          <img  width="550px" height="850px" src="${imageData1}" />
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

const engerister = () => {
    const userData = {


        rfid: rfid.value,
        dateCreation: new Date().toISOString(),
        dateExpiration: new Date(Date.now() + (3 * 365 * 24 * 60 * 60 * 1000)).toISOString(),
        active: true,
        nomAgent: nomAgent.value,
        forfaitActif: false,


    };
    console.log(userData);
    fetch(`http://51.178.42.116:8089/api/clients/${props.userData.id}/cartes`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)  // Make sure to stringify the object
    }).then((res) => {
        rfid.value = ''
        res.json()
    }
    ).catch(console.error);
    console.log(userData)
    // emit('userData', userData)

    // // clearForm()
    // isDialogVisible.value = false
}
</script>

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
    position: absolute;
    text-align: center;

    width: 100%;
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
    text-align: center;
    position: absolute;
    top: 60px;
    right: 0px;

}

.card1 {
    background: url('../../assets/images/TRANSURB-VERSO.png') !important;
    background-repeat: no-repeat !important;
    background-size: cover !important;
    border: 1px solid grey;
    width: 330px;
    /* Largeur de la carte */
    margin-left: 5px;
    height: 200px;
    /* Hauteur de la carte */
    border-radius: 15px;
    /* Bords arrondis */

    background-size: 100% 100% !important;
    /* Dégradé de couleur */
    /* box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); */
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

.ag-theme-quartz {
    --ag-cell-horizontal-border: solid rgb(150, 150, 200);
}
</style>
