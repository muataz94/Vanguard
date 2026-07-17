import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        privacy: resolve(import.meta.dirname, 'privacy.html'),
        terms: resolve(import.meta.dirname, 'terms.html'),
        refund: resolve(import.meta.dirname, 'refund.html'),
        risk: resolve(import.meta.dirname, 'risk-disclosure.html'),
        notFound: resolve(import.meta.dirname, '404.html')
      },
      output: {
        manualChunks: {
          animation: ['gsap']
        }
      }
    }
  }
});
