import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
 plugins: [vue()],
 server: {
   port: 3003,
   host: true
 },
 resolve: {
   alias: {
     '@': path.resolve(__dirname, 'src'),
     'vue': 'vue/dist/vue.esm-bundler.js'
   },
 },
});