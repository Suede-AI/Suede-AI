// Render a list of chunks with N parallel workers: node queue.mjs N "a-b,c-d,..."
import { spawn } from 'child_process';
const N = Number(process.argv[2]); const jobs = process.argv[3].split(',').map(s => s.split('-').map(Number));
const run = ([a, b]) => new Promise(res => { const out = `../chunks/c_${a.toFixed(2).padStart(7, '0')}.mp4`;
  const p = spawn('node', ['render.mjs', String(a), String(b), '30', out], { stdio: ['ignore', 'pipe', 'pipe'] });
  p.stdout.on('data', d => process.stdout.write(d)); p.stderr.on('data', d => process.stdout.write('ERR ' + d)); p.on('close', c => { console.log('chunk', a, b, 'exit', c); res(); }); });
const q = [...jobs]; await Promise.all(Array.from({ length: N }, async () => { while (q.length) await run(q.shift()); }));
console.log('ALL DONE');
