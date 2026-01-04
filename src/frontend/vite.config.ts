import type { ClientRequest, IncomingMessage } from 'http';
import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// Helper to configure proxy with forwarded headers
const configureProxy = (proxy: {
  on(
    event: 'proxyReq',
    cb: (proxyReq: ClientRequest, req: IncomingMessage) => void
  ): void;
}) => {
  proxy.on('proxyReq', (proxyReq, req) => {
    const host = req.headers.host;
    const forwardedHost = req.headers['x-forwarded-host'] || host;

    const isLocalhost = host?.includes('localhost');
    const forwardedProto =
      req.headers['x-forwarded-proto'] || (isLocalhost ? 'http' : 'https');

    if (forwardedHost) {
      proxyReq.setHeader('X-Forwarded-Host', forwardedHost);
    }
    proxyReq.setHeader('X-Forwarded-Proto', forwardedProto);
  });
};

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
        // Exclude API and auth routes from service worker
        navigateFallbackDenylist: [/^\/api\//, /^\/signin-google/],
        // Remove or keep runtimeCaching, but it shouldn't cache auth routes now
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60,
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
        configure: configureProxy,
      },
      '/signin-google': {
        target: process.env.SERVER_HTTPS || process.env.SERVER_HTTP,
        changeOrigin: true,
        secure: false,
        configure: configureProxy,
      },
    },
  },
  preview: {
    proxy: {
      '/api': {
        target: process.env.SERVER_HTTPS || process.env.SERVER_HTTP,
        changeOrigin: true,
        secure: false,
        configure: configureProxy,
      },
      '/signin-google': {
        target: process.env.SERVER_HTTPS || process.env.SERVER_HTTP,
        changeOrigin: true,
        secure: false,
        configure: configureProxy,
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
