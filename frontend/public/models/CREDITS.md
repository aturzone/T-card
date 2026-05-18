# Bust 3D model

- **Subject:** David (1501–1504)
- **Original artist:** Michelangelo Buonarroti
- **Institution:** Galleria dell'Accademia, Florence, Italy
- **Source:** user-supplied STL scan (presumed Scan The World / Cosmo Wenman lineage — CC-BY-SA 4.0)
- **Format:** glTF binary (GLB) with Draco compression
- **File size:** ~430 KB
- **Geometry:** decimated to ~80,000 triangles, cropped to top 22% (head + neck + shoulders + upper chest)
- **Re-shaded:** materials replaced at runtime in `Statue3D.tsx` (white marble PBR)
- **Date prepared:** 2026-05-17 by atur

## Pipeline

```
unrar x Michelangelo1501–1504_Galleria_dell_Accademia.rar
blender --background --python /tmp/bust-prep.py -- input.stl bust.glb
npx gltf-pipeline -i bust.glb -o bust.glb --draco.compressionLevel=10
```

If redistributing this project, credit the original scanner per CC-BY-SA 4.0
when known. Replace `bust.glb` and update this file with the new attribution.
