/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Local demo auth: forward API calls to the root Express/SQLite server so
    // httpOnly session cookies stay same-origin. Start it from the repo root
    // with: PORT=5055 HOST=127.0.0.1 npm run dev
    proxy: {
      '/api': {
        target: process.env.MCT_API_PROXY_TARGET ?? 'http://127.0.0.1:5055',
        changeOrigin: false,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
