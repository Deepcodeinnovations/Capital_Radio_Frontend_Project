import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'url';

// Emulate __dirname in ES Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Resolve the '@' alias to './src'
    },
  },
  server: {
    port: 3000, // Specify the development server port
    host: true, // Allow external access to the development server
  },
  build: {
    outDir: 'dist', // Output directory for the build
    sourcemap: true, // Generate source maps for easier debugging
  },
});