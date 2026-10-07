# Photograph catalogue

This update starts from GitHub's `main` version at `3375d38`. It preserves the existing business-profile design, 49 supplied product photos, owner portrait, logo, registration PDF, mission, vision, history and colour palette.

The three overlapping product renderers have been replaced by one renderer. All 330 formerly emoji-illustrated product entries, three existing category overviews and four Multilac paints now use local raster photos. Repeated products in different departments share the same asset: 330 new WebP files total, approximately 6.9 MB for the entire collection (not an initial-page download).

## How it works

- `assets/catalog-data.js`: static category data; no fetch or directory listing needed, including for local file previews.
- `assets/catalog.js`: lazy category previews and product cards. Only the selected collection is inserted; returning to departments removes its image elements. Full images use `object-fit: contain`.
- `assets/products/`: locally stored photos, at most 640 pixels per side; no runtime third-party image requests.
- `assets/product-photo-sources.json`: item-by-item source URLs and image metadata. Cards also link to their source.
- The loading screen never waits for product images; it has a timeout and a no-JavaScript fallback.

Run `node scripts/verify-catalog.cjs` to check counts, every local asset, WebP signatures, exact filename casing, preserved owner/logo/PDF, and absence of emoji/SVG product rendering. A browser check opened all 19 departments: 382 product cards and four paint cards.

## Photo accuracy and usage

Internet photographs illustrate product types, not verified stock, exact sizes, dealership status or brand availability. Confirm actual products with the shop. Product names are generic where appropriate; different sizes can share a representative photograph. Original supplied photographs remain labelled as supplied shop photos rather than being assigned guessed product names.

Photography rights remain with the original owners. Source attribution does not imply permission or a free reuse licence; obtain any necessary republication permissions before commercial publication. The source manifest supports that review. No prices or unverified stock claims were copied from source stores.

The earlier waterproofing image showed road-marking paint; it was corrected using Multilac's official 3in1 Waterproofing Super Brilliant White product page.
