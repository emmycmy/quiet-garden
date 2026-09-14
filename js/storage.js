const KEY = "quiet-garden.profiles.v1";

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { profiles: [], activeId: null, soundOn: true };
  } catch {
    return { profiles: [], activeId: null, soundOn: true };
  }
}

function save(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // storage unavailable; app still works this session
  }
}

export function getState() {
  return load();
}

export function addProfile({ name, band }) {
  const data = load();
  const profile = {
    id: "p" + Date.now().toString(36),
    name: name.trim() || "Friend",
    band, // "young" (2-3) or "older" (4-5)
    avatar: pickAvatar(data.profiles.length),
    createdAt: Date.now(),
  };
  data.profiles.push(profile);
  data.activeId = profile.id;
  save(data);
  return profile;
}

export function removeProfile(id) {
  const data = load();
  data.profiles = data.profiles.filter((p) => p.id !== id);
  if (data.activeId === id) data.activeId = null;
  save(data);
}

export function setActiveProfile(id) {
  const data = load();
  data.activeId = id;
  save(data);
}

export function getActiveProfile() {
  const data = load();
  return data.profiles.find((p) => p.id === data.activeId) || null;
}

export function setSoundOn(on) {
  const data = load();
  data.soundOn = on;
  save(data);
}

export function isSoundOn() {
  return load().soundOn !== false;
}

const AVATARS = ["🌿", "🌸", "🐚", "🍄", "🦋", "🌙", "🍂", "⭐"];
function pickAvatar(i) {
  return AVATARS[i % AVATARS.length];
}
