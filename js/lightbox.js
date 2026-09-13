const FADE_MS = 180;

let overlay;
let imageEl;
let prevButton;
let nextButton;
let items = [];
let index = 0;
let navEnabled = false;
let zoomEnabled = false;

function ensureOverlay() {
  if (overlay) {
    return overlay;
  }

  overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Image viewer");

  imageEl = document.createElement("img");
  imageEl.className = "lightbox__image";
  imageEl.addEventListener("click", (event) => {
    event.stopPropagation();
    closeLightbox();
  });

  prevButton = document.createElement("button");
  prevButton.type = "button";
  prevButton.className = "lightbox__button lightbox__prev";
  prevButton.setAttribute("aria-label", "Previous image");
  prevButton.textContent = "‹";
  prevButton.addEventListener("click", (event) => {
    event.stopPropagation();
    step(-1);
  });

  nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.className = "lightbox__button lightbox__next";
  nextButton.setAttribute("aria-label", "Next image");
  nextButton.textContent = "›";
  nextButton.addEventListener("click", (event) => {
    event.stopPropagation();
    step(1);
  });

  overlay.append(imageEl, prevButton, nextButton);
  overlay.addEventListener("click", closeLightbox);
  document.body.append(overlay);
  return overlay;
}

function modeFor(image) {
  const zoom = image.classList.contains("zoom") || image.closest(".gallery-scroll");
  const display = image.classList.contains("display");
  const borderless = image.classList.contains("borderless");
  if (zoom) {
    return "zoom";
  }
  if (display || borderless) {
    return "display";
  }
  return "gallery";
}

function showCurrent() {
  const item = items[index];
  if (!item) {
    return;
  }

  imageEl.removeAttribute("width");
  imageEl.removeAttribute("height");
  imageEl.style.width = "";
  imageEl.style.height = "";
  imageEl.alt = item.alt || "";
  imageEl.src = item.src;

  if (!zoomEnabled) {
    return;
  }

  const applyZoom = () => {
    imageEl.style.width = `${imageEl.naturalWidth * 1.25}px`;
    imageEl.style.height = `${imageEl.naturalHeight * 1.25}px`;
  };

  if (imageEl.complete && imageEl.naturalWidth) {
    applyZoom();
  } else {
    imageEl.addEventListener("load", applyZoom, { once: true });
  }
}

function step(delta) {
  if (!navEnabled || items.length === 0) {
    return;
  }
  index = (index + delta + items.length) % items.length;
  showCurrent();
}

export function openLightbox(sequence, startIndex, options = {}) {
  ensureOverlay();
  items = sequence;
  index = startIndex;
  navEnabled = Boolean(options.nav) && sequence.length > 1;
  zoomEnabled = Boolean(options.zoom);

  overlay.classList.toggle("lightbox--nav", navEnabled);
  overlay.classList.toggle("lightbox--zoom", zoomEnabled);
  showCurrent();

  requestAnimationFrame(() => {
    overlay.classList.add("is-open");
  });
}

export function closeLightbox() {
  if (!overlay) {
    return;
  }
  overlay.classList.remove("is-open");
  window.setTimeout(() => {
    if (!overlay.classList.contains("is-open")) {
      imageEl.removeAttribute("src");
    }
  }, FADE_MS);
}

export function openFromImage(image, galleryImages = []) {
  const mode = modeFor(image);

  if (mode === "gallery") {
    const sequence = galleryImages.filter((img) => modeFor(img) === "gallery");
    const start = Math.max(0, sequence.indexOf(image));
    openLightbox(
      sequence.map((img) => ({ src: img.currentSrc || img.src, alt: img.alt })),
      start,
      { nav: true, zoom: false },
    );
    return;
  }

  openLightbox([{ src: image.currentSrc || image.src, alt: image.alt }], 0, {
    nav: false,
    zoom: mode === "zoom",
  });
}

export function bindImages(root = document) {
  const images = [...root.querySelectorAll("img.display, img.zoom, img.borderless, .gallery-images img, .gallery-scroll img")];
  const galleryImages = images.filter((img) => img.closest(".gallery-images"));

  for (const image of images) {
    if (image.dataset.lightboxBound) {
      continue;
    }
    image.dataset.lightboxBound = "true";
    image.addEventListener("click", () => openFromImage(image, galleryImages));
  }
}

document.addEventListener("keydown", (event) => {
  if (!overlay?.classList.contains("is-open")) {
    return;
  }
  if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "ArrowLeft") {
    step(-1);
  } else if (event.key === "ArrowRight") {
    step(1);
  }
});

bindImages(document);
