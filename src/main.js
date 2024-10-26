import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { createApp } from 'vue'
import JsonExcel from "vue-json-excel3"
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
import 'flatpickr/dist/flatpickr.css';
// Create vue app
const app = createApp(App)


// Register plugins
registerPlugins(app)
app.component("downloadExcel", JsonExcel);
app.component('VueDatePicker', VueDatePicker);
// Mount vue app
app.mount('#app')
