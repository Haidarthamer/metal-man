# IRON MAN: NEW YORK

A mobile-friendly Three.js flight prototype. Includes a procedural Manhattan-style blockout, a fallback suit, arcade-style flight, boost, a beacon-scanning activity and rescue drones. Optimized OBJ assets are loaded from gzip files in the `assets/` folders.

## Controls
- Desktop: WASD move, Space ascend, C descend, Shift boost, F or mouse click fire, Esc pause.
- Mobile: left virtual stick to move, + / − to change altitude, BOOST to accelerate, FIRE to shoot.

## Run
Serve this folder over HTTP (ES modules do not work reliably from `file://`), for example: `python -m http.server 8000`.

## Assets
The optimized archive contains `hero_ironman01.obj.gz` plus its MTL/PNG textures in `assets/armor/`, and `ny_clean_up2.obj.gz`, `tex.jpg`, and `ny_clean_up2.mtl` in `assets/city/`. The OBJ files are gzip-compressed to reduce mobile download size; the game decompresses them in the browser.

The supplied armor OBJ has no skeleton/rig, so this prototype displays it as a single animated mesh. Articulated flight poses require a rigged model or a later rigging pass.

## GitHub Pages
Open Settings → Pages and choose GitHub Actions as the source. The workflow in `.github/workflows/deploy.yml` deploys each push to `main`.

This is a first playable vertical slice, not a finished AAA open-world game.
