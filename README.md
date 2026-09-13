# Chris Young

Minimal HTML site for project images. Homepage and `/page.html` are blank. Each project is its own page with images in the HTML, a fade lightbox, and optional per-page CSS.

## Run locally

```bash
npm install
npm run dev
```

Then open http://127.0.0.1:43123

## Pages

- `/` — home (blank)
- `/time-war.html`, `/wedding.html`, `/cc-euro.html`, `/vision-zero.html`, `/streetsdot.html`, `/pgh.html`, `/phl.html` — one project each
- `/page.html` — blank subpage

## Edit

- Images: drop files in `images/<project>/` and add `<img>` tags in that page’s HTML
- Copy: headings and paragraphs in the same HTML file (`h1`, `h2`, `h3`, `p`; modifiers `.sub`, `.emph`)
- Type and background for one page: add `css/pages/<project>.css` and link it from that page (Time War is the example)
- Shared look: `css/styles.css`
- Header and nav: `partials/header.html` (included on every page)

Starter images are placeholders. Replace them with the real files.

## Lightbox

- Grid images: prev/next and arrow keys
- Scroll gallery (`.gallery-scroll`): one full-window image at a time, pinned while scrolling, quick fade; click opens the zoom lightbox (200%, no prev/next); include `js/gallery-scroll.js` on that page
- `.display`: full-width image (max-height 600px), lightbox without prev/next
- `.borderless`: full window width, lightbox without prev/next
- `.zoom`: lightbox at 200% of natural size, no prev/next
- Overlay click, image click, or Escape closes
