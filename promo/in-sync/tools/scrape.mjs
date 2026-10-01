import { chromium } from 'playwright';
// Run from promo/in-sync/: node tools/scrape.mjs
// Optional: SPKI_LIST=<base64 sha256 SPKI,...> to trust a TLS-intercepting proxy CA.
import fs from 'fs';
const SPKI = process.env.SPKI_LIST || '';
const sites = { storybeam:'https://storybeamkids.com', guitarhub:'https://guitarhub.org', social:'https://social.suedeai.ai', fretpulse:'https://fretpulse.suedeai.ai', sing:'https://sing.suedeai.ai', podcast:'https://podcast.suedeai.ai', studio:'https://studio.suedeai.ai', suedeai:'https://suedeai.ai', agents:'https://agents.suedeai.ai', dna:'https://dna.suedeai.ai', promo:'https://promo.suedeai.ai', muse:'https://muse.suedeai.ai', strumly:'https://strumly.suedeai.ai', ip:'https://ip.suedeai.ai' };
const b = await chromium.launch({ args: SPKI ? [`--ignore-certificate-errors-spki-list=${SPKI}`] : [] });
for (const [name,url] of Object.entries(sites)) {
  const ctx = await b.newContext({ viewport:{width:1600,height:1000} }); const p = await ctx.newPage();
  const seen = new Map();
  p.on('response', async r => { try { const ct=r.headers()['content-type']||''; if(!/image\/(png|jpe?g|webp|avif)/.test(ct)) return; const buf=await r.body(); if(buf.length<40000) return; seen.set(r.url(), {buf, ct}); } catch{} });
  try { await p.goto(url,{waitUntil:'networkidle',timeout:45000}); } catch(e){}
  const h = await p.evaluate(()=>document.documentElement.scrollHeight);
  for (let y=0;y<Math.min(h,12000);y+=600){ await p.evaluate(v=>scrollTo(0,v),y); await p.waitForTimeout(200);} await p.waitForTimeout(1500);
  let i=0; for (const [u,{buf,ct}] of seen) { const ext=ct.includes('png')?'png':ct.includes('webp')?'webp':ct.includes('avif')?'avif':'jpg'; const fn=`assets/img/${name}_${String(i++).padStart(2,'0')}.${ext}`; fs.writeFileSync(fn,buf); console.log(fn, buf.length, u.slice(0,110)); }
  await ctx.close();
}
await b.close();
