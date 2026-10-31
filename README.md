# IRON MAN: NEW YORK

A mobile-friendly Three.js flight-combat prototype. Includes a procedural Manhattan-style blockout, fallback suit, arcade-style flight, boost, repulsor projectiles and flying target drones. The supplied OBJ assets are supported and load automatically from the `assets/` folders.

## Controls
- Desktop: WASD move, Space ascend, C descend, Shift boost, F or mouse click fire, Esc pause.
- Mobile: left virtual stick to move, + / − to change altitude, BOOST to accelerate, FIRE to shoot.

## Run
Serve this folder over HTTP (ES modules do not work reliably from `file://`), for example: `python -m http.server 8000`.

## Assets
Place the Iron Man OBJ, MTL and texture PNGs in `assets/armor/`. Place `ny_clean_up2.obj`, `tex.jpg`, and the provided `ny_clean_up2.mtl` in `assets/city/`.

The supplied armor OBJ has no skeleton/rig, so this prototype displays it as a single animated mesh. Articulated flight poses require a rigged model or a later rigging pass.

## GitHub Pages
Open Settings → Pages and choose GitHub Actions as the source. The workflow in `.github/workflows/deploy.yml` deploys each push to `main`.

This is a first playable vertical slice, not a finished AAA open-world game.
