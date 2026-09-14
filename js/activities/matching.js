import { chime, softTick } from "../audio.js";

const ICON_POOL = ["🌿", "🌸", "🐚", "🍄", "🦋", "🌙", "🍂", "⭐", "🌼", "🐌", "🪶", "🍓"];

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function initMatching(stage, profile) {
  const pairCount = profile.band === "young" ? 3 : 6;
  build();

  function build() {
    stage.innerHTML = "";
    const icons = shuffle(ICON_POOL).slice(0, pairCount);
    const cards = shuffle([...icons, ...icons]).map((icon, i) => ({
      id: i, icon, flipped: false, matched: false,
    }));

    const note = document.createElement("p");
    note.className = "gentle-note";
    note.textContent = "Find the matching pairs.";

    const grid = document.createElement("div");
    grid.className = "match-grid";
    const cols = pairCount <= 3 ? 3 : 4;
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    let open = [];
    let lock = false;
    let matchedCount = 0;

    const cardEls = cards.map((card) => {
      const cardEl = document.createElement("button");
      cardEl.className = "match-card";
      cardEl.textContent = "";
      cardEl.style.background = "var(--panel)";
      cardEl.addEventListener("pointerdown", () => onFlip(card, cardEl));
      return cardEl;
    });

    cardEls.forEach((c) => grid.appendChild(c));
    stage.appendChild(note);
    stage.appendChild(grid);

    function onFlip(card, cardEl) {
      if (lock || card.flipped || card.matched) return;
      card.flipped = true;
      cardEl.textContent = card.icon;
      cardEl.classList.add("flipped");
      softTick();
      open.push({ card, cardEl });

      if (open.length === 2) {
        lock = true;
        const [a, b] = open;
        if (a.card.icon === b.card.icon) {
          a.card.matched = true;
          b.card.matched = true;
          a.cardEl.classList.add("matched");
          b.cardEl.classList.add("matched");
          chime();
          matchedCount++;
          open = [];
          lock = false;
          if (matchedCount === pairCount) setTimeout(showDone, 500);
        } else {
          setTimeout(() => {
            a.card.flipped = false;
            b.card.flipped = false;
            a.cardEl.textContent = "";
            b.cardEl.textContent = "";
            a.cardEl.classList.remove("flipped");
            b.cardEl.classList.remove("flipped");
            open = [];
            lock = false;
          }, 800);
        }
      }
    }
  }

  function showDone() {
    stage.innerHTML = "";
    const banner = document.createElement("div");
    banner.className = "done-banner";
    banner.textContent = "🐚 All matched!";
    const again = document.createElement("button");
    again.className = "btn";
    again.textContent = "Play again";
    again.onclick = build;
    stage.appendChild(banner);
    stage.appendChild(again);
  }
}
