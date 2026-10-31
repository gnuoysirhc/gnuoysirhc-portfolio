const form = document.querySelector(".card-search");
const input = form?.querySelector("input");
const cards = [...document.querySelectorAll(".card-preview")];
const empty = document.querySelector(".card-search-empty");

function applyFilter() {
  const query = input.value.trim().toLowerCase();
  let shown = 0;

  for (const card of cards) {
    const title = card.querySelector("h2")?.textContent ?? "";
    const match = query === "" || title.toLowerCase().includes(query);
    card.hidden = !match;
    if (match) {
      shown += 1;
    }
  }

  if (empty) {
    empty.hidden = shown > 0;
  }
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
});

input?.addEventListener("input", applyFilter);
