# Bust 3D model

**TEMPORARY — replace with classical (Greco-Roman / neoclassical) bust before launch.**

This is the well-known "Lee Perry-Smith" head scan from the three.js sample
asset library. It is a modern human head, not a classical marble bust, but it
ships under CC-BY 3.0 with no auth gate and is the documented fallback in the
hero-animation brief when no classical CC0/CC-BY GLB is reachable within
budget.

- File: `bust.glb`
- Source: https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb
- Author: Lee Perry-Smith (Infinite-Realities / Triplegangers)
- License: CC BY 3.0 Unported (https://creativecommons.org/licenses/by/3.0/)
- Original work: "Infinite" 3D head scan, Lee Perry-Smith. http://www.ir-ltd.net/ / www.triplegangers.com
- File size: 395 KB (no Draco recompression required)
- Format: glTF binary (GLB), glTF 2.0
- Downloaded: 2026-05-17

## Why this, not a classical bust

Hunt within the 20-min time-box covered:

1. **Direct CDN probes** — three.js samples (`Nefertiti.glb` is the closest
   match but CC-BY-NC, disqualified for commercial use), Khronos sample
   models, modelviewer.dev assets. None classical and license-clean.
2. **Sketchfab v3 search** — found ~13 strong candidates including a CC0
   "Portrait Head of a Noble or Official" by Cleveland Museum of Art
   (`fc442ce1d47a49b0aea6ee03e86b5080`), plus CC-BY busts of Hadrian, Antinous,
   Lucius Verus, Antoninus Pius, Marcus Aurelius. **All download endpoints
   are auth-gated** (`/v3/models/{uid}/download` returns 401 without an OAuth
   token; embed pages do not leak direct GLB URLs).
3. **Smithsonian 3D (3d.si.edu)** — bot-protection (403 / "Request Rejected")
   on every endpoint tried with realistic UAs.
4. **Cleveland Museum Open Access API** — exposes metadata but no 3D asset
   URLs on the artwork record for 1952.260.
5. **MyMiniFactory / Scan The World** — search page returns JS-rendered HTML
   with no parseable object IDs in the static markup; STL→GLB conversion
   path was not feasible in the remaining budget.
6. **GitHub code search** — requires authentication (401 anonymously).

## To replace with a real classical bust

Best path: log into Sketchfab, download the CC0 Cleveland Museum bust
(https://sketchfab.com/3d-models/1952260-bust-fc442ce1d47a49b0aea6ee03e86b5080)
as GLB, run `gltf-pipeline -i in.glb -o bust.glb --draco.compressionLevel=10`
to compress, and update this file. Author field for CC0 is optional but
"Cleveland Museum of Art" is the courteous credit.
