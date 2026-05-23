import { chromium } from 'playwright';

const sections = [
  { id: '01_hero',     scrollY: 0,    name: 'Hero' },
  { id: '02_projects', scrollY: 900,  name: 'Projects' },
  { id: '03_more',     scrollY: 1800, name: 'More projects' },
  { id: '04_stats',    scrollY: 2700, name: 'Stats' },
  { id: '05_footer',   scrollY: 3600, name: 'Footer' },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

console.log('Navigating to betastudio.com.co...');
await page.goto('https://www.betastudio.com.co/', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);

// Full page height to figure out how many sections we need
const fullHeight = await page.evaluate(() => document.body.scrollHeight);
console.log(`Full page height: ${fullHeight}px`);

for (const s of sections) {
  if (s.scrollY > fullHeight) continue;
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), s.scrollY);
  await page.waitForTimeout(1200);
  const file = `/Users/teo_visuals/Documents/CLAUDE CODE/PORTFOLIO/beta_${s.id}.png`;
  await page.screenshot({ path: file, fullPage: false });
  console.log(`✓ ${s.name} -> ${file}`);
}

// Also a full-page screenshot
await page.screenshot({
  path: '/Users/teo_visuals/Documents/CLAUDE CODE/PORTFOLIO/beta_fullpage.png',
  fullPage: true
});
console.log('✓ full page');

await browser.close();
console.log('Done.');
