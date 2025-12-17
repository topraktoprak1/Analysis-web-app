import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.DOCKER_ENV ? 'http://web:5000' : 'http://localhost:5000',
        changeOrigin: true,
      },
      '/static': {
        target: process.env.DOCKER_ENV ? 'http://web:5000' : 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: '../static/react',
    emptyOutDir: true
  }
})
