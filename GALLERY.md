# Image Gallery

The separately requested shop gallery contains all 19 supplied photographs from the folder dated 2026-10-07 at 10.28.23. Product categories, owner portrait, logo, registration PDF, reviews and contact sections remain separate and unchanged.

- `assets/gallery/*-thumb.webp`: 600-pixel thumbnails, approximately 1.23 MB for all 19 (loaded lazily as the gallery approaches the viewport).
- `assets/gallery/*.webp`: 1400-pixel full-view assets, approximately 6.28 MB for all 19; the viewer requests only the selected image.
- `assets/gallery/manifest.json`: original filenames, source hashes, captions and generated dimensions. No exact duplicate files were found.
- `assets/gallery.js`: native dialog viewer with previous/next controls, arrow keys, Escape/Close, focus return and removal of the full image source on close.

Images use contain sizing without cropping. Source photographs were not modified; the generated display assets omit original metadata. Thumbnail links still open the full image without JavaScript. Run `node scripts/verify-gallery.cjs` and the existing catalogue/profile checks to verify required assets and separation from product data.
