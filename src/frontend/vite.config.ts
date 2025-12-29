import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      devOptions: {
        enabled: false,
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Acme Inc',
        short_name: 'Acme',
        description: 'Your app description',
        theme_color: '#09090b',
        background_color: '#09090b',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: 'index.html',
        // Don't cache API calls
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60, // 1 hour
              },
            },
          },
        ],
      },
    }),
  ],
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
      '/signin-google': {
        target: process.env.SERVER_HTTPS || process.env.SERVER_HTTP,
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
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
  preview: {
    proxy: {
      '/api': {
        target: process.env.SERVER_HTTPS || process.env.SERVER_HTTP,
        changeOrigin: true,
        secure: false,
      },
      '/signin-google': {
        target: process.env.SERVER_HTTPS || process.env.SERVER_HTTP,
        changeOrigin: true,
        secure: false,
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
