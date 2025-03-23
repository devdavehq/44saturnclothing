import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@component': resolve(__dirname, './src/components'),
    },
  },
  server:{
    historyFallback: true
  }
})
