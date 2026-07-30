import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { siteConfig } from './src/config.js';

const productionUrl = new URL(siteConfig.deployment.productionUrl);
if (productionUrl.protocol !== 'https:') throw new Error('siteConfig.deployment.productionUrl must use HTTPS.');
const deploymentBase = productionUrl.href.endsWith('/') ? productionUrl.href : `${productionUrl.href}/`;
const ogImageUrl = new URL(siteConfig.media.ogImage.replace(/^\//, ''), productionUrl.origin).href;

function deploymentMetadata() {
  const replacements = {
    __VANGUARD_PRODUCTION_URL__: deploymentBase,
    __VANGUARD_OG_IMAGE_URL__: ogImageUrl
  };
  const replaceTokens = (content) => Object.entries(replacements)
    .reduce((result, [token, value]) => result.replaceAll(token, value), content);

  return {
    name: 'vanguard-deployment-metadata',
    transformIndexHtml: {
      order: 'pre',
      handler: replaceTokens
    },
    async closeBundle() {
      for (const file of ['robots.txt', 'sitemap.xml']) {
        const outputPath = resolve(import.meta.dirname, 'dist', file);
        const content = await readFile(outputPath, 'utf8');
        await writeFile(outputPath, replaceTokens(content), 'utf8');
      }
    }
  };
}

export default defineConfig({
  base: '/Vanguard/',
  plugins: [deploymentMetadata()],
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
        manualChunks: { animation: ['gsap'] }
      }
    }
  }
});
