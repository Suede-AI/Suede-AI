// Render still frames: node shoot.mjs out_dir t1 t2 ...  (half-size jpg contact copies)
import { chromium } from 'playwright'; import { serve, GL_ARGS } from './serve.mjs'; import fs from 'fs';
const [out, ...ts] = process.argv.slice(2); const times = ts.map(Number); fs.mkdirSync(out, { recursive: true });
const port = 9000 + Math.floor(Math.random() * 900); const srv = await serve('.', port);
const b = await chromium.launch({ args: GL_ARGS }); const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log('console:', m.text().slice(0, 300)); }); p.on('pageerror', e => console.log('pageerror:', e.message));
await p.goto(`http://localhost:${port}/index.html`);
const t0 = Date.now(); await p.evaluate(([a, z]) => window.__init(a, z), [Math.min(...times), Math.max(...times)]); console.log('init ms', Date.now() - t0);
for (const t of times) { const s = Date.now(); await p.evaluate(t => window.__frame(t), t); await p.screenshot({ path: `${out}/t${t.toFixed(2).padStart(7, '0')}.jpg`, type: 'jpeg', quality: 90 }); console.log('t', t, Date.now() - s, 'ms'); }
await b.close(); srv.close();
