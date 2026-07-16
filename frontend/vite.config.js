import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // 1. Keep your backend proxy
    proxy: {
      '/api': {
        target: 'http://backend:8000',
        changeOrigin: true,
      }
    },
    // 2. Add Docker hot-reload support
    host: true, // Exposes the server to your local machine network
    watch: {
      usePolling: true, // Force Vite to poll Docker's volume for changes
    },
    hmr: {
      clientPort: 5173, // Ensures the browser hot-reloading web socket connects correctly
    }
  }
})