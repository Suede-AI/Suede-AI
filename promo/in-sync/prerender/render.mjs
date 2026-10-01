import { chromium } from 'playwright'; import http from 'http'; import fs from 'fs'; import path from 'path';
const root = path.resolve('.');
const srv = http.createServer((q,r)=>{const f=path.join(root,decodeURIComponent(q.url.split('?')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'content-type':{'.html':'text/html','.js':'text/javascript','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2','.css':'text/css'}[path.extname(f)]||'application/octet-stream'});r.end(d);});}).listen(8766);
const b = await chromium.launch(); const p = await b.newPage({ viewport:{width:1800,height:1200}, deviceScaleFactor:2 });
await p.goto('http://localhost:8766/prerender/cards.html'); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(800);
const ids = await p.evaluate(()=>[...document.querySelectorAll('body > [id]:not(#icons), .icon')].map(e=>e.id));
for (const id of ids) { await p.locator('#'+id).screenshot({ path:`assets/cards/${id}.png`, omitBackground:true }); }
console.log(ids.join(' ')); await b.close(); srv.close();
