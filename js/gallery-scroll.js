function bindGallery(gallery) {
  const images = [...gallery.querySelectorAll("img")];
  if (images.length === 0) {
    return;
  }

  gallery.style.setProperty("--slides", String(images.length));
  let current = -1;

  function setActive(index) {
    if (index === current) {
      return;
    }
    current = index;
    for (const [i, img] of images.entries()) {
      img.classList.toggle("is-active", i === index);
    }
  }

  function update() {
    const total = gallery.offsetHeight - window.innerHeight;
    if (total <= 0) {
      setActive(0);
      return;
    }
    const progress = Math.min(1, Math.max(0, -gallery.getBoundingClientRect().top / total));
    const index = Math.min(images.length - 1, Math.floor(progress * images.length));
    setActive(index);
  }

  setActive(0);
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

for (const gallery of document.querySelectorAll(".gallery-scroll")) {
  bindGallery(gallery);
}
