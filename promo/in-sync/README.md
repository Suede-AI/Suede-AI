# Suede AI — In Sync (film source)

A 3:08 brand film that ties every Suede surface together on one continuous light thread. It's rendered frame by frame from code, so every shot can be edited and re-rendered.

- **Engine:** Three.js scenes (glass browser windows, phones, light thread, bokeh particles, nebula skies) plus a DOM typography layer. Post-processing adds bloom, grading, chromatic aberration and eight transition types.
- **Determinism:** every frame is a pure function of time. Chunks render in parallel and concatenate without seams.
- **Music sync:** the cut is locked to the original soundtrack's 120 BPM grid. The drops land at 6.0 s, 54.0 s and 145.0 s, the breakdowns run 52–54 s and 143–145 s, and the fade starts at 183 s.

## Structure

| Path | What |
|---|---|
| `src/engine.js` | Renderer, post pipeline (mix → bloom → final grade), browser/phone/card builders |
| `src/materials.js` | Shaders: glass screens, phones, light thread, particles, logo, orbs, nebula, gold coin |
| `src/text.js` | Per-word cinematic type reveals |
| `src/act1.js` … `src/act4.js` | The 23 shots |
| `src/timeline.js` | Shot list and transitions, with times in seconds |
| `prerender/` | HTML-designed cards (certificate, x402, catalog, cinematic screens, app icons) |
| `tools/` | Live-site capture, image scrape, texture/mask builder |

## Shot list

| Time | Shot |
|---|---|
| 0–6 | Genesis: the Suede mark is drawn in light |
| 6–14 | "Many surfaces. One rhythm." Tunnel of live Suede sites |
| 14–22 | Agent Studio: agent graph, then the site |
| 22–30 | Storybeam |
| 30–36 | GuitarHub field guides |
| 36–42 | FretPulse |
| 42–48 | Suede Sing (daylight) |
| 48–54 | Suede Map constellation → breakdown |
| 54–62 | IP Registry: the certificate gets stamped |
| 62–64 | suedelabs |
| 64–74 | A dozen front doors. One house. |
| 74–82 | Eleven apps. In your pocket. |
| 82–90 | On Android. In your browser. |
| 90–98 | Learn + share |
| 98–106 | Create · Prove · Protect |
| 106–114 | Suede Cinematic (letterboxed) |
| 114–124 | Agent Studio + Agentix |
| 124–132 | Strumly for agents |
| 132–145 | SEO hub → breakdown |
| 145–157 | In Sync: product galaxy |
| 157–165 | $SUEDE: agents that pay, get paid, and prove it |
| 165–182 | Mosaic of every surface pulls back into the Suede mark |
| 182–188.6 | End card |

## Rebuild

```bash
npm install
node tools/capture.mjs            # live desktop + mobile captures → assets/shots
node tools/scrape.mjs             # product photography / covers → assets/img
python3 tools/make_assets.py <original-in-sync.mp4> <path/to/suede-brand-assets>
node prerender/render.mjs         # designed cards + icons → assets/cards
node shoot.mjs ../stills 10 60 150    # spot-check stills
node queue.mjs 3 "0-14,14-30,30-48,48-64,64-82,82-98,98-114,114-132,132-145,145-165,165-182,182-188.6"
./assemble.sh <original-in-sync.mp4> suede-in-sync.mp4    # concat + grain + original audio
```

Rendering uses headless Chromium with SwiftShader, so no GPU is needed. Expect roughly 0.7 s per 1080p frame with three workers.
