import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const OUT = '/Users/teo_visuals/Documents/CLAUDE CODE/PORTFOLIO/feedback-shots';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

const base = 'file:///Users/teo_visuals/Documents/CLAUDE%20CODE/PORTFOLIO/';

// ── index.html sections ──
await page.goto(base + 'index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
// trigger reveals
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(e => e.classList.add('visible')));
// pause marquee
await page.addStyleTag({ content: '.marquee-track{animation-play-state:paused!important} *{scroll-behavior:auto!important}' });
await page.waitForTimeout(500);

const sections = ['hero', 'clientes', 'trabajos', 'contacto'];

for (const id of sections) {
  const el = await page.$('#' + id);
  if (!el) { console.log('skip', id); continue; }
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await el.screenshot({ path: `${OUT}/${id}.png` });
  console.log('✓', id);
}

await browser.close();
console.log('done');
