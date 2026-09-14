import { isSoundOn } from "./storage.js";

let ctx = null;
function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(freq, start, duration, gainPeak = 0.08) {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, c.currentTime + start);
  gain.gain.linearRampToValueAtTime(gainPeak, c.currentTime + start + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + duration);
  osc.connect(gain).connect(c.destination);
  osc.start(c.currentTime + start);
  osc.stop(c.currentTime + start + duration + 0.05);
}

export function chime() {
  if (!isSoundOn()) return;
  tone(660, 0, 0.35);
  tone(880, 0.12, 0.4);
}

export function softTick() {
  if (!isSoundOn()) return;
  tone(520, 0, 0.12, 0.05);
}

export function completeFanfare() {
  if (!isSoundOn()) return;
  tone(523, 0, 0.3);
  tone(659, 0.15, 0.3);
  tone(784, 0.3, 0.5);
}

// Device voices vary; these are common standard system voice names tried in
// order of preference. Deliberately skipping the "novelty" voices (Bubbles,
// Junior, etc.) — they read as more odd than friendly. None of this
// impersonates a specific real person's voice — it's just a warmer pick
// among whatever ordinary voices are already installed, offline, on the
// device, with a gently raised pitch for warmth.
const PREFERRED_VOICE_NAMES = ["Samantha", "Karen", "Moira", "Tessa", "Fiona", "Victoria", "Ava"];

let cachedVoice = null;
let voiceLookupDone = false;

function pickVoice() {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  for (const name of PREFERRED_VOICE_NAMES) {
    const match = voices.find((v) => v.name.includes(name));
    if (match) return match;
  }
  return voices.find((v) => v.lang && v.lang.startsWith("en")) || voices[0];
}

if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = pickVoice();
    voiceLookupDone = true;
  };
}

export function speak(text) {
  if (!isSoundOn()) return;
  if (!("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (!voiceLookupDone) {
      cachedVoice = pickVoice();
      voiceLookupDone = true;
    }
    if (cachedVoice) u.voice = cachedVoice;
    u.rate = 0.9;
    u.pitch = 1.1;
    window.speechSynthesis.speak(u);
  } catch {
    // speech unavailable; visuals still work
  }
}
