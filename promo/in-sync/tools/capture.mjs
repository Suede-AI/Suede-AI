import { chromium } from 'playwright';
// Run from promo/in-sync/: node tools/capture.mjs
// Optional: SPKI_LIST=<base64 sha256 SPKI,...> to trust a TLS-intercepting proxy CA.
const sites = {
  suedeai: 'https://suedeai.ai', agents: 'https://agents.suedeai.ai', storybeam: 'https://storybeamkids.com',
  guitarhub: 'https://guitarhub.org', fretpulse: 'https://fretpulse.suedeai.ai', sing: 'https://sing.suedeai.ai',
  map: 'https://map.suedeai.ai', ip: 'https://ip.suedeai.ai', social: 'https://social.suedeai.ai',
  strumly: 'https://strumly.suedeai.ai', muse: 'https://muse.suedeai.ai', skills: 'https://skills.suedeai.ai',
  seo: 'https://seo.suedeai.ai', distro: 'https://distro.suedeai.ai', dna: 'https://dna.suedeai.ai',
  podcast: 'https://podcast.suedeai.ai', promo: 'https://promo.suedeai.ai', cosmos: 'https://cosmos.suedeai.ai',
  agentix: 'https://agentix.suedeai.ai', johnny: 'https://johnnysuede.com', studio: 'https://studio.suedeai.ai',
  app: 'https://app.suedeai.ai', cinematic: 'https://cinematic.suedeai.ai',
};
const only = process.argv.slice(2);
const browser = await chromium.launch({ args: [...(process.env.SPKI_LIST ? [`--ignore-certificate-errors-spki-list=${process.env.SPKI_LIST}`] : []),'--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
async function shoot(name, url, vp, dpr, mobile, suffix) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile,
    userAgent: mobile ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' : undefined,
    colorScheme: 'dark', reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(e => console.log(name, 'goto warn', e.message.split('\n')[0]));
    await page.waitForTimeout(3500);
    // slowly scroll to trigger lazy content, then back to top
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < Math.min(h, 6000); y += 700) { await page.evaluate(v => window.scrollTo(0, v), y); await page.waitForTimeout(250); }
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(1500);
    await page.screenshot({ path: `assets/shots/${name}_${suffix}.png` });
    const tall = Math.min(h, mobile ? 3600 : 4200);
    await page.setViewportSize({ width: vp.width, height: tall }); await page.waitForTimeout(1200);
    await page.screenshot({ path: `assets/shots/${name}_${suffix}_tall.png` });
    console.log('ok', name, suffix, h, await page.title());
  } catch (e) { console.log('FAIL', name, suffix, e.message.split('\n')[0]); }
  await ctx.close();
}
const entries = Object.entries(sites).filter(([k]) => !only.length || only.includes(k));
const queue = [...entries];
async function worker() { while (queue.length) { const [n, u] = queue.shift();
  await shoot(n, u, { width: 1600, height: 1000 }, 2, false, 'desk');
  await shoot(n, u, { width: 393, height: 852 }, 3, true, 'mob'); } }
await Promise.all([worker(), worker(), worker()]);
await browser.close();
