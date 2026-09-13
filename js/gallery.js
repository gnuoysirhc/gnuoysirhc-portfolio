import { bindImages } from "./lightbox.js";

function pageId() {
  const file = window.location.pathname.split("/").pop() || "";
  return file.replace(/\.html$/, "");
}

function textBlock(tag, className, value) {
  if (!value) {
    return null;
  }
  const el = document.createElement(tag);
  el.className = className;
  el.textContent = value;
  return el;
}

function renderCopy(copy, { headingTag, headingClass }) {
  if (!copy) {
    return null;
  }
  const wrap = document.createElement("div");
  const heading = textBlock(headingTag, headingClass, copy.header);
  const nodes = [
    heading,
    textBlock("p", "subtitle", copy.subtitle),
    textBlock("p", "paragraph-1", copy.paragraph),
    textBlock("p", "emphasis", copy.emphasis),
  ].filter(Boolean);

  if (nodes.length === 0) {
    return null;
  }
  wrap.append(...nodes);
  return wrap;
}

function renderImages(images) {
  if (!images?.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No images in this list yet.";
    return empty;
  }

  const grid = document.createElement("div");
  grid.className = "gallery-images";

  for (const item of images) {
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt || "";
    if (item.class) {
      img.className = item.class;
    }
    grid.append(img);
  }

  return grid;
}

async function loadList(id) {
  const modules = import.meta.glob("./lists/*.js");
  const loader = modules[`./lists/${id}.js`];
  if (!loader) {
    return null;
  }
  const mod = await loader();
  return mod.default;
}

async function renderGallery() {
  const root = document.querySelector("#galleries");
  if (!root) {
    return;
  }

  const id = pageId();
  const list = await loadList(id);

  if (!list) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "This gallery could not be found.";
    root.replaceChildren(empty);
    return;
  }

  const section = document.createElement("section");
  section.className = "gallery-section";
  section.dataset.list = list.id;

  const before = renderCopy(list.before, {
    headingTag: "h1",
    headingClass: "heading-1",
  });
  const images = renderImages(list.images);
  const after = renderCopy(list.after, {
    headingTag: "h2",
    headingClass: "heading-2",
  });

  if (before) {
    section.append(before);
  }
  section.append(images);
  if (after) {
    section.append(after);
  }

  root.replaceChildren(section);
  bindImages(section);
}

renderGallery();
