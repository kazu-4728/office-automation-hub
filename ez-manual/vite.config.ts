import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'frontend',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './frontend/src'),
      '@shared': path.resolve(__dirname, './shared'),
      '@components': path.resolve(__dirname, './frontend/src/components'),
      '@pages': path.resolve(__dirname, './frontend/src/pages'),
      '@hooks': path.resolve(__dirname, './frontend/src/hooks'),
      '@store': path.resolve(__dirname, './frontend/src/store'),
      '@api': path.resolve(__dirname, './frontend/src/api'),
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  },
})
