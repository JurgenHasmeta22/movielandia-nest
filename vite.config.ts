import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig(({ isSsrBuild }) => ({
    publicDir: false,
    base: '/build/',
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
    build: isSsrBuild
        ? {
              ssr: 'resources/js/ssr.tsx',
              outDir: 'bootstrap/ssr',
              emptyOutDir: false,
              rollupOptions: {
                  output: {
                      entryFileNames: 'ssr.js',
                  },
              },
          }
        : {
              outDir: 'public/build',
              emptyOutDir: true,
              rollupOptions: {
                  input: 'resources/js/app.tsx',
                  output: {
                      entryFileNames: 'app.js',
                      chunkFileNames: 'chunks/[name]-[hash].js',
                      assetFileNames: (assetInfo) => {
                          if (assetInfo.names?.some((n) => n.endsWith('.css'))) {
                              return 'app.css';
                          }
                          return 'assets/[name]-[hash][extname]';
                      },
                  },
              },
          },
}));
