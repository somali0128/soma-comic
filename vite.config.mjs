import { defineConfig, transformWithOxc } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    {
      name: 'treat-src-js-as-jsx',
      enforce: 'pre',
      async transform(code, id) {
        if (!/[\\/]src[\\/].*\.js$/.test(id)) {
          return null;
        }

        return transformWithOxc(code, id, {
          lang: 'jsx',
          jsx: {
            runtime: 'automatic',
          },
        });
      },
    },
    react(),
  ],
  build: {
    outDir: 'build',
  },
  optimizeDeps: {
    noDiscovery: true,
    include: ['phaser', 'react', 'react-dom/client', 'react-router-dom'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
});
