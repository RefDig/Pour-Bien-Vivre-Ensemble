
import { resolve } from 'path';
import { copyFileSync } from 'fs';
import build from '@hono/vite-build/node';
import devServer from '@hono/vite-dev-server';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    build({
      entry: 'src/index.tsx',
    }),
    devServer({
      entry: 'src/index.tsx',
    }),
    {
      name: 'copy-redirects',
      closeBundle() {
        try {
          copyFileSync(
            resolve(__dirname, 'public/_redirects'),
            resolve(__dirname, 'dist/_redirects')
          );
          console.log('✅ _redirects file copied to dist/');
        } catch (e) {
          console.warn('⚠️ Could not copy _redirects:', e);
        }
      },
    },
  ],
  build: {
    ssr: true,
    rollupOptions: {
      input: 'src/index.tsx',
      output: {
        dir: 'dist',
        format: 'esm'
      }
    }
  }
});
