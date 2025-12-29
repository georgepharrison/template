import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: true,
    watch: { usePolling: true },
    proxy: {
      '/api': {
        target: process.env.SERVER_HTTPS || process.env.SERVER_HTTP,
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // Forward the original host and protocol to the backend
            const forwardedHost =
              req.headers['x-forwarded-host'] || req.headers.host;
            const forwardedProto = req.headers['x-forwarded-proto'] || 'https';

            if (forwardedHost) {
              proxyReq.setHeader('X-Forwarded-Host', forwardedHost);
            }
            proxyReq.setHeader('X-Forwarded-Proto', forwardedProto);
          });
        },
      },
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router'],
          query: ['@tanstack/react-query'],
          ui: ['@base-ui/react', 'lucide-react'],
        },
      },
    },
  },
});
