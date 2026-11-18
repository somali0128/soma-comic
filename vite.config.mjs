import { fileURLToPath } from 'node:url';
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
    rollupOptions: {
      // Two pages: the main site, and the standalone 换算 app (own title,
      // manifest and icons, so it can be added to a phone's home screen).
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        convert: fileURLToPath(new URL('./convert/index.html', import.meta.url)),
      },
    },
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
