import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(), 
  ],
  server: {
    host: '0.0.0.0', // Allow access from external devices
    port: 5173, // Optional: Specify a custom port
    strictPort: true, // Optional: Fail if the port is already in use
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
