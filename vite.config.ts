import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
      server: {
        port: 3002,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://localhost:8081',
            changeOrigin: true
          },
          '/healthz': {
            target: 'http://localhost:8081',
            changeOrigin: true
          }
        }
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
