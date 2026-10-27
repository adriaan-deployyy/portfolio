/*
 * Light / dark theme, driven by the visitor's local time:
 *   light 06:00–18:59, dark 19:00–05:59.
 * The initial theme is set before paint by the inline script in Base.astro (keep the hours in sync).
 * A manual switch (Control Center, the Dock's Appearance icon) overrides the clock for the rest of
 * the visit; the next visit follows the clock again.
 */

const LIGHT_FROM = 6; // 6 a.m.
const DARK_FROM = 19; // 7 p.m.
const OVERRIDE_KEY = "theme";

type Theme = "light" | "dark";

const root = document.documentElement;

export const themeForTime = (date = new Date()): Theme => {
  const hour = date.getHours();
  return hour >= LIGHT_FROM && hour < DARK_FROM ? "light" : "dark";
};

const hasOverride = () => {
  try {
    return sessionStorage.getItem(OVERRIDE_KEY) !== null;
  } catch {
    return false;
  }
};

export const toggleTheme = () => {
  const next: Theme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try {
    sessionStorage.setItem(OVERRIDE_KEY, next);
  } catch {}
};

// Keep following the clock while the page is open, so a visitor who's here at 6:59 p.m.
// sees the desktop go dark at 7. Checked on each minute boundary and when the tab comes back.
const sync = () => {
  if (!hasOverride()) root.dataset.theme = themeForTime();
};

setTimeout(() => {
  sync();
  setInterval(sync, 60_000);
}, 60_000 - (Date.now() % 60_000));

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") sync();
});
