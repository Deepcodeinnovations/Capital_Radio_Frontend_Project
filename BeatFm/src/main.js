import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import router from './router'
import store from './store'
import './axios'
import Toast from 'vue-toastification'
import "vue-toastification/dist/index.css";

createApp(App).use(router).use(store).use(Toast).mount('#app') 