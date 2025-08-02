import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import store from './store'
import './style.css'
import './axios'

// Import jQuery and make it global
import $ from "jquery";
window.jQuery = $;
window.$ = $;

import 'summernote/dist/summernote-lite.min.js';
import 'summernote/dist/summernote-lite.min.css';
import SummernoteEditor from 'vue3-summernote-editor';

import App from './App.vue'
import Toast from 'vue-toastification'
import "vue-toastification/dist/index.css";

const app = createApp(App)
app.use(createPinia()).use(router).use(store)
app.component('SummernoteEditor', SummernoteEditor);
app.use(Toast)
app.mount('#app')