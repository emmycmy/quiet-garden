import { chime } from "../audio.js";

const SHAPES = {
  circle: { label: "circle", svg: (c) => `<circle cx="36" cy="36" r="30" fill="${c}"/>` },
  square: { label: "square", svg: (c) => `<rect x="8" y="8" width="56" height="56" rx="10" fill="${c}"/>` },
  triangle: { label: "triangle", svg: (c) => `<polygon points="36,6 68,64 4,64" fill="${c}"/>` },
  star: { label: "star", svg: (c) => `<polygon points="36,4 44,26 68,26 48,40 56,64 36,50 16,64 24,40 4,26 28,26" fill="${c}"/>` },
  heart: { label: "heart", svg: (c) => `<path d="M36 62 C10 44 4 28 16 16 C24 8 34 10 36 20 C38 10 48 8 56 16 C68 28 62 44 36 62 Z" fill="${c}"/>` },
};

const COLORS = ["#a9bfa2", "#d8a48f", "#a8c3c9", "#e3c581", "#c3b7d1"];

const DONE_MESSAGES = [
  "🌿 Lovely work!",
  "🌸 Wonderful sorting!",
  "🐚 All in their place!",
  "⭐ Nicely done!",
  "🍃 So well matched!",
  "🌼 Great eye for shapes!",
];

function svgFor(kind, color) {
  return `<svg width="72" height="72" viewBox="0 0 72 72">${SHAPES[kind].svg(color)}</svg>`;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function initShapes(stage, profile) {
  const kinds = profile.band === "young"
    ? ["circle", "square", "triangle"]
    : ["circle", "square", "triangle", "star", "heart"];
  let lastMessage = "";

  build();

  function build() {
    stage.innerHTML = "";
    let remaining = kinds.length;

    const tray = document.createElement("div");
    tray.className = "tray";
    const targets = {};
    shuffle(kinds).forEach((kind) => {
      const target = document.createElement("div");
      target.className = "drop-target";
      target.dataset.kind = kind;
      target.innerHTML = svgFor(kind, "#8a8074");
      target.style.opacity = "0.35";
      tray.appendChild(target);
      targets[kind] = target;
    });

    const dragRow = document.createElement("div");
    dragRow.className = "drag-shapes";
    const order = shuffle(kinds);
    order.forEach((kind, i) => {
      const piece = document.createElement("div");
      piece.className = "shape-piece";
      piece.dataset.kind = kind;
      piece.innerHTML = svgFor(kind, COLORS[i % COLORS.length]);
      dragRow.appendChild(piece);
      makeDraggable(piece, kind, targets, () => {
        remaining -= 1;
        if (remaining === 0) setTimeout(showDone, 500);
      });
    });

    const note = document.createElement("p");
    note.className = "gentle-note";
    note.textContent = "Drag each shape to its matching outline.";

    stage.appendChild(note);
    stage.appendChild(tray);
    stage.appendChild(dragRow);
  }

  function showDone() {
    stage.innerHTML = "";
    const banner = document.createElement("div");
    banner.className = "done-banner";
    let message = DONE_MESSAGES[Math.floor(Math.random() * DONE_MESSAGES.length)];
    if (message === lastMessage) message = DONE_MESSAGES[(DONE_MESSAGES.indexOf(message) + 1) % DONE_MESSAGES.length];
    lastMessage = message;
    banner.textContent = message;
    const again = document.createElement("button");
    again.className = "btn";
    again.textContent = "Play again";
    again.onclick = build;
    stage.appendChild(banner);
    stage.appendChild(again);
  }
}

function makeDraggable(piece, kind, targets, onPlaced) {
  let dragging = false;
  let offsetX = 0, offsetY = 0;
  let startRect = null;

  piece.style.position = "relative";

  piece.addEventListener("pointerdown", (e) => {
    dragging = true;
    piece.classList.add("dragging");
    piece.setPointerCapture(e.pointerId);
    startRect = piece.getBoundingClientRect();
    offsetX = e.clientX - startRect.left;
    offsetY = e.clientY - startRect.top;
    piece.style.position = "fixed";
    piece.style.left = startRect.left + "px";
    piece.style.top = startRect.top + "px";
    piece.style.margin = "0";
  });

  piece.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    piece.style.left = e.clientX - offsetX + "px";
    piece.style.top = e.clientY - offsetY + "px";
  });

  piece.addEventListener("pointerup", (e) => {
    if (!dragging) return;
    dragging = false;
    piece.classList.remove("dragging");
    const target = targets[kind];
    const tRect = target.getBoundingClientRect();
    const pRect = piece.getBoundingClientRect();
    const overlap = !(pRect.right < tRect.left || pRect.left > tRect.right || pRect.bottom < tRect.top || pRect.top > tRect.bottom);

    if (overlap) {
      target.classList.add("filled", "glow");
      target.style.opacity = "1";
      chime();
      piece.classList.add("placed");
      onPlaced();
    } else {
      piece.style.position = "relative";
      piece.style.left = "";
      piece.style.top = "";
      piece.style.margin = "";
    }
  });
}
