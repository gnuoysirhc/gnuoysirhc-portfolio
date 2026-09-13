# Chris Young

Minimal HTML site for project images. Homepage and `/page.html` are blank. Each project is its own page with one image list, a fade lightbox, and optional per-page CSS.

## Run locally

```bash
npm install
npm run dev
```

Then open http://127.0.0.1:43123

## Pages

- `/` — home (blank)
- `/time-war.html`, `/wedding.html`, `/cc-euro.html`, `/vision-zero.html`, `/streetsdot.html`, `/pgh.html`, `/phl.html` — one list each
- `/page.html` — blank subpage

## Edit

- Images: drop files in `images/<project>/` and list them in `js/lists/<project>.js`
- Copy: `before.header` / `before.paragraph` (and optional `subtitle`, `emphasis`, `after`) in that same list file
- Type and background for one page: `css/pages/<project>.css` (or `home.css` / `page.css`)
- Shared look: `css/styles.css`

Starter images are placeholders. Replace them with the real files.

## Lightbox

- Grid images: prev/next and arrow keys
- `.display`: full-width image (max-height 600px), lightbox without prev/next
- `.zoom`: lightbox at 200% of natural size, no prev/next
- Overlay click, image click, or Escape closes
