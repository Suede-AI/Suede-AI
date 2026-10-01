"""Build GPU-friendly textures and derived assets for the In Sync film.

Run from promo/in-sync/ after `node tools/capture.mjs` and `node tools/scrape.mjs`:

    python3 tools/make_assets.py <original-in-sync-video.mp4> <path-to-suede-brand-assets>

Requires: pillow, numpy, scipy, ffmpeg on PATH.
"""
import glob, os, shutil, subprocess, sys

import numpy as np
from PIL import Image
from scipy import ndimage

Image.MAX_IMAGE_PIXELS = None
video, brand = sys.argv[1], sys.argv[2]
os.makedirs('assets/tex', exist_ok=True)
os.makedirs('assets/img', exist_ok=True)

# 1. Resize live-site captures into textures (desktop 2048w, tall 1600w, mobile 786w).
for f in sorted(glob.glob('assets/shots/*.png')):
    n = os.path.basename(f)[:-4]
    im = Image.open(f).convert('RGB'); w, h = im.size
    if n.endswith('_desk'):
        im = im.resize((2048, round(h * 2048 / w)), Image.LANCZOS)
    elif n.endswith('_desk_tall'):
        im = im.resize((1600, round(h * 1600 / w)), Image.LANCZOS).crop((0, 0, 1600, min(round(h * 1600 / w), 8000)))
    elif n.endswith('_mob'):
        im = im.resize((786, round(h * 786 / w)), Image.LANCZOS)
    elif n.endswith('_mob_tall'):
        im = im.resize((786, round(h * 786 / w)), Image.LANCZOS); im = im.crop((0, 0, 786, min(im.size[1], 8000)))
    im.save(f'assets/tex/{n}.jpg', quality=93)

# 2. Crisp 1600px logo mask from the approved brand mark (spline upsample + soft threshold).
a = np.asarray(Image.open(os.path.join(brand, 'assets/suede-approved-logo-light.png')).convert('RGBA').split()[3]).astype(np.float32) / 255
up = ndimage.gaussian_filter(ndimage.zoom(a, 4, order=3), 4.0)
x = np.clip((up - .5) * 3 + .5, 0, 1); x = x * x * (3 - 2 * x)
mask = Image.new('RGBA', (1600, 1600), (255, 255, 255, 0)); mask.putalpha(Image.fromarray((x * 255).astype(np.uint8)))
mask.save('assets/img/logo_mask.png')
shutil.copy(os.path.join(brand, 'assets/suede-approved-logo.png'), 'assets/img/logo.png')

# 3. Storybeam cover art: clean frame from the original cut.
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', '14.5', '-i', video, '-frames:v', '1', 'assets/img/storybeam_art.png'], check=True)
print('assets ready')
