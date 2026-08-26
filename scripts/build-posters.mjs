/**
 * Genera i poster della scena, uno per mood, in public/poster/.
 *
 * Il poster è un render vero: la stessa scena, lo stesso shader, fermata a
 * un istante scelto. Non è un'approssimazione dipinta a mano — se lo shader
 * cambia, i poster vanno rigenerati.
 *
 *   npm run dev            (in un terminale)
 *   node scripts/build-posters.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:4321';
const MOODS = ['abisso', 'secca', 'deriva', 'fosforo'];
/** Istante della scena da congelare: abbastanza avanti da avere deriva. */
const FREEZE_AT = 22.5;
const QUALITY = 0.72;

mkdirSync('public/poster', { recursive: true });

const browser = await chromium.launch({
  // Su una macchina normale Playwright trova il suo Chromium da solo. In
  // ambienti dove il browser è già sul disco, CHROMIUM_PATH lo indica.
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});

for (const mood of MOODS) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(`${BASE}/poster/${mood}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => Boolean(window.__heroScene), null, { timeout: 120_000 });

  const dataUrl = await page.evaluate(async ({ t, q }) => {
    const handle = window.__heroScene;
    handle.pause();
    handle.drawAt(t);
    // Due giri: il bloom del composer legge il fotogramma precedente.
    handle.drawAt(t);
    return document.querySelector('canvas').toDataURL('image/webp', q);
  }, { t: FREEZE_AT, q: QUALITY });

  const base64 = dataUrl.split(',')[1];
  const buffer = Buffer.from(base64, 'base64');
  writeFileSync(`public/poster/${mood}.webp`, buffer);
  console.log(`  ${mood}.webp — ${(buffer.length / 1024).toFixed(0)} KB`);
  await page.close();
}

await browser.close();
console.log('poster rigenerati.');
