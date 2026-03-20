import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const apiTarget = 'http://localhost:5000';

export default defineConfig({
  plugins: [
    react({
      include: ['**/*.{js,jsx,ts,tsx}'],
    }),
  ],
  optimizeDeps: {
    entries: ['index.html'],
  },
  server: {
    proxy: {
      '/games': {
        target: apiTarget,
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return req.url;
          }
        },
      },
      '/searches': {
        target: apiTarget,
        changeOrigin: true,
      },
      '/platforms': {
        target: apiTarget,
        changeOrigin: true,
      },
      '/releases': {
        target: apiTarget,
        changeOrigin: true,
      },
      '/inCollection': {
        target: apiTarget,
        changeOrigin: true,
      },
      '/add_to_collection': {
        target: apiTarget,
        changeOrigin: true,
      },
      '/removeFromCollection': {
        target: apiTarget,
        changeOrigin: true,
      },
      '/upload': {
        target: apiTarget,
        changeOrigin: true,
      },
      '/suggestions': {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
