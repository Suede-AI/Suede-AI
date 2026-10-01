// Production renderer: node render.mjs <from> <to> <fps> <out.mp4>
// Renders frames [ceil(from*fps), floor(to*fps)) deterministically and streams them into ffmpeg.
import { chromium } from 'playwright'; import { serve, GL_ARGS } from './serve.mjs'; import { spawn } from 'child_process';
const [from, to, fps, out] = [Number(process.argv[2]), Number(process.argv[3]), Number(process.argv[4]), process.argv[5]];
const f0 = Math.round(from * fps), f1 = Math.round(to * fps);
const port = 9000 + Math.floor(Math.random() * 900); const srv = await serve('.', port);
const b = await chromium.launch({ args: GL_ARGS }); const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
p.on('pageerror', e => console.log('pageerror:', e.message));
await p.goto(`http://localhost:${port}/index.html`);
await p.evaluate(([a, z]) => window.__init(a, z), [f0 / fps, f1 / fps]);
const cdp = await p.context().newCDPSession(p);
const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(fps), '-i', '-', '-c:v', 'libx264', '-preset', 'fast', '-crf', '11', '-pix_fmt', 'yuv420p', '-r', String(fps), out], { stdio: ['pipe', 'inherit', 'inherit'] });
const t0 = Date.now();
for (let f = f0; f < f1; f++) {
  await p.evaluate(t => window.__frame(t), f / fps);
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 94, optimizeForSpeed: false });
  if (!ff.stdin.write(Buffer.from(data, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
  if ((f - f0) % 60 === 0) console.log(`[${out}] frame ${f - f0}/${f1 - f0}  ${((Date.now() - t0) / (f - f0 + 1)).toFixed(0)} ms/f`);
}
ff.stdin.end(); await new Promise(r => ff.on('close', r));
console.log(`[${out}] done ${f1 - f0} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
await b.close(); srv.close();
