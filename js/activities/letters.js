import { chime, speak } from "../audio.js";

const YOUNG_SET = ["A", "B", "C", "O", "S", "T"];
const OLDER_SET = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

const PICTURES = {
  A: "🍎", B: "🎈", C: "🐱", D: "🦆", E: "🥚",
  F: "🐸", G: "🍇", H: "🏠", I: "🍦", J: "🧃",
  M: "🌙", O: "🐙", S: "☀️",
};

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function initLetters(stage, profile) {
  const set = shuffle(profile.band === "young" ? YOUNG_SET : OLDER_SET);
  const withPictures = profile.band !== "young";
  let index = 0;
  let pictureTimeoutId = null;

  round();

  function round() {
    if (pictureTimeoutId) clearTimeout(pictureTimeoutId);
    stage.innerHTML = "";
    const letter = set[index % set.length];

    const note = document.createElement("p");
    note.className = "gentle-note";
    note.textContent = "Trace the letter with your finger.";

    const wrap = document.createElement("div");
    wrap.className = "letter-canvas-wrap";

    stage.appendChild(note);
    stage.appendChild(wrap);

    const tracer = setupTracing(wrap, letter);

    const controls = document.createElement("div");
    controls.style.display = "flex";
    controls.style.flexWrap = "wrap";
    controls.style.justifyContent = "center";
    controls.style.gap = "12px";

    const hear = document.createElement("button");
    hear.className = "btn";
    hear.textContent = "🔊 Hear it";
    hear.onclick = () => speak(letter);

    const clear = document.createElement("button");
    clear.className = "btn";
    clear.textContent = "↻ Clear";
    clear.onclick = () => tracer.clear();

    controls.appendChild(hear);
    controls.appendChild(clear);
    stage.appendChild(controls);

    speak(letter);

    if (withPictures) {
      pictureTimeoutId = setTimeout(() => showPicturePrompt(letter), 1800);
    } else {
      const next = document.createElement("button");
      next.className = "btn";
      next.textContent = "Next letter";
      next.onclick = () => { index++; round(); };
      stage.appendChild(next);
    }
  }

  function showPicturePrompt(letter) {
    const prompt = document.createElement("div");
    prompt.style.display = "flex";
    prompt.style.flexDirection = "column";
    prompt.style.alignItems = "center";
    prompt.style.gap = "14px";

    const q = document.createElement("p");
    q.className = "gentle-note";
    q.textContent = `Which one starts with ${letter}?`;

    const options = document.createElement("div");
    options.style.display = "flex";
    options.style.gap = "16px";

    const correct = PICTURES[letter];
    const others = shuffle(Object.values(PICTURES).filter((v) => v !== correct)).slice(0, 2);
    const choices = shuffle([correct, ...others]);

    choices.forEach((pic) => {
      const btn = document.createElement("button");
      btn.className = "btn";
      btn.style.fontSize = "40px";
      btn.textContent = pic;
      btn.onclick = () => {
        if (pic === correct) {
          chime();
          setTimeout(() => { index++; round(); }, 500);
        } else {
          btn.style.transform = "translateX(4px)";
          setTimeout(() => { btn.style.transform = ""; }, 150);
        }
      };
      options.appendChild(btn);
    });

    prompt.appendChild(q);
    prompt.appendChild(options);
    stage.appendChild(prompt);
  }
}

function strokeLetter(ctx, letter, size, lineWidth, dashed) {
  ctx.clearRect(0, 0, size, size);
  ctx.font = `${size * 0.7}px -apple-system, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = lineWidth;
  ctx.setLineDash(dashed ? [8, 8] : []);
  ctx.strokeText(letter, size / 2, size / 2 + size * 0.03);
  ctx.setLineDash([]);
}

function setupTracing(wrap, letter) {
  const size = wrap.getBoundingClientRect().width || 320;
  const dpr = window.devicePixelRatio || 1;

  const guideCanvas = document.createElement("canvas");
  const inkCanvas = document.createElement("canvas");
  [guideCanvas, inkCanvas].forEach((c) => {
    c.width = size * dpr;
    c.height = size * dpr;
    c.style.width = size + "px";
    c.style.height = size + "px";
  });
  wrap.appendChild(guideCanvas);
  wrap.appendChild(inkCanvas);

  const guideCtx = guideCanvas.getContext("2d");
  guideCtx.scale(dpr, dpr);
  guideCtx.strokeStyle = "#c9c0b0";
  strokeLetter(guideCtx, letter, size, 3, true);

  const inkCtx = inkCanvas.getContext("2d");
  inkCtx.scale(dpr, dpr);
  inkCtx.strokeStyle = "#7f9878";
  inkCtx.lineWidth = 10;
  inkCtx.lineCap = "round";
  inkCtx.lineJoin = "round";

  let drawing = false;

  function pos(e) {
    const rect = inkCanvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  inkCanvas.addEventListener("pointerdown", (e) => {
    drawing = true;
    const p = pos(e);
    inkCtx.beginPath();
    inkCtx.moveTo(p.x, p.y);
  });
  inkCanvas.addEventListener("pointermove", (e) => {
    if (!drawing) return;
    const p = pos(e);
    inkCtx.lineTo(p.x, p.y);
    inkCtx.stroke();
  });
  window.addEventListener("pointerup", () => { drawing = false; });

  function clear() {
    inkCtx.clearRect(0, 0, size, size);
  }

  return { clear };
}
