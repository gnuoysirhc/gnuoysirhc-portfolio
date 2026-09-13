const homePaths = new Set(["/", "/index.html"]);

function pathOf(href) {
  const url = new URL(href, window.location.origin);
  return url.pathname;
}

function isCurrent(linkPath) {
  const here = window.location.pathname;
  if (homePaths.has(linkPath)) {
    return homePaths.has(here);
  }
  return here === linkPath;
}

for (const link of document.querySelectorAll(".site-nav a")) {
  if (isCurrent(pathOf(link.href))) {
    link.setAttribute("aria-current", "page");
  }
}
