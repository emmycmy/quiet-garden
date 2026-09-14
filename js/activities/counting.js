import { softTick, completeFanfare } from "../audio.js";

const ICONS = ["🍂", "🐚", "🍄", "🌰", "🌼", "🪨", "🍓", "🌙"];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function initCounting(stage, profile) {
  const max = profile.band === "young" ? 5 : 10;
  round();

  function round() {
    stage.innerHTML = "";
    const target = randInt(3, max);
    const icon = ICONS[randInt(0, ICONS.length - 1)];
    let counted = 0;

    const display = document.createElement("div");
    display.className = "count-display";
    display.textContent = "0";

    const note = document.createElement("p");
    note.className = "gentle-note";
    note.textContent = `Tap each one to count it.`;

    const row = document.createElement("div");
    row.className = "count-row";

    const items = [];
    for (let i = 0; i < target; i++) {
      const item = document.createElement("div");
      item.className = "count-item";
      item.innerHTML = `<span class="count-emoji">${icon}</span><span class="count-check">✓</span>`;
      row.appendChild(item);
      items.push(item);
      item.addEventListener("pointerdown", () => {
        if (item.classList.contains("counted")) return;
        item.classList.add("counted");
        counted += 1;
        display.textContent = String(counted);
        softTick();
        if (counted === target) {
          display.classList.add("celebrate");
          setTimeout(completeFanfare, 500);
          setTimeout(showDone, 1150);
        }
      });
    }

    stage.appendChild(note);
    stage.appendChild(display);
    stage.appendChild(row);

    function showDone() {
      stage.innerHTML = "";
      const banner = document.createElement("div");
      banner.className = "done-banner";
      banner.textContent = `${target}! Well counted.`;
      const again = document.createElement("button");
      again.className = "btn";
      again.textContent = "Next";
      again.onclick = round;
      stage.appendChild(banner);
      stage.appendChild(again);
    }
  }
}
