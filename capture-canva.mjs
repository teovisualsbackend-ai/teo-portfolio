import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

console.log('Navigating to canva site...');
await page.goto('https://teovisuals.my.canva.site/', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(8000); // canva needs time

const height = await page.evaluate(() => document.body.scrollHeight);
console.log(`Page height: ${height}px`);

// Extract text
const text = await page.evaluate(() => document.body.innerText);
console.log('\n=== EXTRACTED TEXT ===\n');
console.log(text);
console.log('\n=== END TEXT ===\n');

// Take full-page screenshot
await page.screenshot({
  path: '/Users/teo_visuals/Documents/CLAUDE CODE/PORTFOLIO/canva_full.png',
  fullPage: true
});
console.log('Saved canva_full.png');

// Take section screenshots scrolling
const step = 900;
let i = 0;
for (let y = 0; y < height; y += step) {
  await page.evaluate(yy => window.scrollTo({ top: yy, behavior: 'instant' }), y);
  await page.waitForTimeout(1500);
  const file = `/Users/teo_visuals/Documents/CLAUDE CODE/PORTFOLIO/canva_${String(i).padStart(2,'0')}.png`;
  await page.screenshot({ path: file, fullPage: false });
  console.log(`Saved ${file}`);
  i++;
}

await browser.close();
