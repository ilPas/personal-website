// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { codeThemeDark, codeThemeLight } from './src/styles/code-theme.mjs';

/**
 * URL canonico del sito.
 * Astro lo usa per <link rel="canonical">, i meta Open Graph e la sitemap.
 */
const site = 'https://www.erricopasquale.it';

export default defineConfig({
  site,

  // Nessuna integrazione UI: il sito è Astro puro e non spedisce
  // JavaScript di framework al browser.
  integrations: [
    sitemap({
      // La 404 non finisce in sitemap; le bozze non vengono nemmeno buildate.
      filter: (page) => !page.endsWith('/404/'),
    }),
  ],

  markdown: {
    shikiConfig: {
      // Temi doppi in scala di grigi: il passaggio light/dark è gestito
      // via CSS in global.css.
      themes: { light: codeThemeLight, dark: codeThemeDark },
      wrap: true,
    },
  },

  // ---------------------------------------------------------------------
  // FONT SELF-HOSTED — slot pronto, da riempire con la direzione visiva.
  //
  // Per ora la tipografia è un placeholder neutro di sistema (nessuna
  // richiesta di rete, nessun CDN). Quando arrivano i file dei font,
  // metterli in `src/assets/fonts/` e togliere il commento qui sotto:
  // l'API `fonts` di Astro genera @font-face, preload e fallback metrici,
  // servendo i file dal nostro dominio.
  //
  // import { fontProviders } from 'astro/config';
  //
  // fonts: [
  //   {
  //     provider: fontProviders.local(),
  //     name: 'Nome Del Font',
  //     cssVariable: '--font-sans',
  //     variants: [
  //       { weight: '400 700', style: 'normal', src: ['./src/assets/fonts/font.woff2'] },
  //     ],
  //   },
  // ],
  // ---------------------------------------------------------------------
});
