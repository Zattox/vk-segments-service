// vite.config.mjs
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: '.',            // <- явно: корень проекта, где лежит index.html
  base: '/',            // <- публичный базовый URL
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html'  // <- точный путь к вашему index.html
    }
  },
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  }
})
