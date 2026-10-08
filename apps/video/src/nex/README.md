# Approved NEX identity

`NexCharacter` displays lossless crops from **NEX AI Robot Character Sheet.png**,
not the unrelated/simplified SVG characters in the downloaded demo projects.

- Source and crop bounds: `public/nex/reference.png`, `public/nex/crops.json`.
- Regenerate and verify exact crop pixels: `python3 scripts/extract-nex.py` (Pillow).
- Compare original sheet and Remotion output: `pnpm --filter @ahmed-os/video preview:nex`.
- 12-second 1080×1920, 60fps preview: `pnpm --filter @ahmed-os/video render:nex`.
- Use `<NexCharacter artwork="portrait" />`; other artwork keys include `hero`,
  six expressions, and `explain`, `point`, `think`, `approve` poses.

These are raster panels with their original backgrounds, not transparent sprites
or a rigged character. Pose/expression selection switches existing artwork;
optional motion moves the whole panel. No invented angles, moving limbs,
or lip synchronization. Small expression/pose crops cannot gain real detail
by being upscaled. A matching rigged 3D asset is needed for articulated motion
and new viewpoints without losing the approved identity.
