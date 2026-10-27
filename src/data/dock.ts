/*
 * Dock contents, transcribed from the Figma Dock component (light 6465:2248, dark 6465:2169).
 * Most icons are a single raster; the rest are composed like Figma does it:
 * a 36px tile with a fill and inner shadows, and an SVG glyph inside it.
 */

const L = "/figma/light";
const D = "/figma/dark";

/** A glyph layer: an SVG placed inside the glyph box with Figma's insets (the SVGs carry filter padding). */
export interface GlyphLayer {
  src: string;
  inset: string;
}

/** An extra layer positioned against the tile itself, e.g. the star beside the moon */
export interface TileOverlay {
  src: string;
  style: string;
}

export type IconSpec =
  | { kind: "image"; src: string }
  /** Figma "Calendar": live weekday + date text on a white (light) or black (dark) tile */
  | { kind: "calendar"; tone: "light" | "dark" }
  | {
      kind: "tile";
      /** CSS background for the tile */
      fill: string;
      /** Inner shadows layered over the tile */
      shadow: string;
      /** Drop shadow (CSS filter) */
      drop: string;
      /** 0.5px top/bottom hairline used on dark tiles */
      hairline?: boolean;
      padding: string;
      /** Glyph box aspect ratio (width / height) */
      aspect: string;
      layers: GlyphLayer[];
      overlays?: TileOverlay[];
    };

export interface DockApp {
  id: string;
  label: string;
  /** Tooltip per theme, when it differs between light and dark */
  labels?: { light: string; dark: string };
  /** What clicking does; apps just "launch" (bounce + running dot) */
  action?: "toggle-theme";
  /**
   * Opens a real destination instead. Web links open in a new tab; `mailto:` hands off to the
   * visitor's email app. Maps is rewritten per device by Dock.astro to open their own map app.
   */
  link?: string;
  /** Opens one of the site's own windows (e.g. Finder); a `link` alongside it is the no-JS fallback */
  window?: string;
  light: IconSpec;
  dark: IconSpec;
}

/** Contact and social links used by the Dock */
export const links = {
  email: "mailto:adriaan@deployyy.co",
  calendly: "https://calendly.com/adriaan-deployyy/20-minute-chat",
  linkedin: "https://www.linkedin.com/in/adriaan-myburgh/",
  // WhatsApp username link (usernames are still rolling out country by country in 2026)
  whatsapp: "https://wa.me/adriaan.myburgh",
  // Fallback for devices without a native maps link (see Dock.astro)
  maps: "https://www.google.com/maps/search/?api=1&query=Cape%20Town%2C%20South%20Africa",
};

const gloss = (color: string, top = 0.2, stop = "50%") =>
  `linear-gradient(180deg, rgba(255,255,255,${top}) 0%, rgba(255,255,255,0) ${stop}), ${color}`;

const blackFill = "var(--tile-black-fill)";
const whiteShadow = "var(--effect-white-bg)";
const blackShadow = "var(--effect-black-bg)";
const linkedinShadow = "inset 0 0.5px 0.5px 0 rgba(255,255,255,0.25), inset 0 -3px 10px 0 rgba(8,56,103,0.25)";

const gmailLayers = (base: string): GlyphLayer[] => [
  { src: `${base}/gmail-1.svg`, inset: "25% 75% 16.67% 6.25%" },
  { src: `${base}/gmail-2.svg`, inset: "25% 6.25% 16.67% 75%" },
  { src: `${base}/gmail-3.svg`, inset: "16.67% 6.25% 34.09% 6.25%" },
];

// Calendly mark: outer ring and inner "C", positioned as in Figma's 64 x 64 glyph box
const calendlyLayers: GlyphLayer[] = [
  { src: "/figma/calendly-ring.svg", inset: "2.45% 3.08% 2.48% 3.12%" },
  { src: "/figma/calendly-c.svg", inset: "19.02% 19.29% 18.84% 19.29%" },
];

export const dockApps: DockApp[] = [
  {
    id: "finder",
    label: "Finder",
    window: "finder",
    light: { kind: "image", src: `${L}/finder.png` },
    dark: { kind: "image", src: `${D}/finder.png` },
  },
  {
    // Figma: "Calendly" (light 4355:7964, dark 4355:8237); same mark on a white or dark tile
    id: "calendly",
    label: "Calendly",
    link: links.calendly,
    window: "calendly",
    light: {
      kind: "tile",
      fill: "#ffffff",
      shadow: whiteShadow,
      drop: "drop-shadow(0 0.75px 0.5px rgba(0,0,0,0.1))",
      padding: "4px",
      aspect: "1 / 1",
      layers: calendlyLayers,
    },
    dark: {
      kind: "tile",
      fill: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(153,153,153,0) 100%), #161616",
      shadow: "inset 0 1px 0.8px 0 rgba(255,255,255,0.1), inset 0 -3px 5px 0 rgba(0,0,0,0.15)",
      drop: "drop-shadow(0 0.75px 0.5px rgba(0,0,0,0.1))",
      padding: "4px",
      aspect: "1 / 1",
      layers: calendlyLayers,
    },
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    link: links.whatsapp,
    light: {
      kind: "tile",
      fill: gloss("#25d366"),
      shadow: "inset 0 1px 2px 0 rgba(255,255,255,0.25)",
      drop: "drop-shadow(0 1.2px 1px rgba(0,0,0,0.1))",
      padding: "6px",
      aspect: "1 / 1",
      layers: [{ src: `${L}/whatsapp.svg`, inset: "0 -8.33% -16.67% -8.33%" }],
    },
    dark: {
      kind: "tile",
      fill: gloss("#161616", 0.05),
      shadow: "inset 0 0.25px 2px 0 rgba(255,255,255,0.25)",
      drop: "drop-shadow(0 1.2px 1px rgba(0,0,0,0.1))",
      hairline: true,
      padding: "6px",
      aspect: "60 / 58",
      layers: [{ src: `${D}/whatsapp.svg`, inset: "0 -8.33% -17.24% -8.33%" }],
    },
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    link: links.linkedin,
    light: {
      kind: "tile",
      fill: gloss("#0a66c2"),
      shadow: linkedinShadow,
      drop: "drop-shadow(0 0.6px 0.6px rgba(0,0,0,0.1))",
      padding: "8px",
      aspect: "1 / 1",
      layers: [{ src: `${L}/linkedin.svg`, inset: "-2.5% -7.5% -12.5% -7.5%" }],
    },
    dark: {
      kind: "tile",
      fill: "#ffffff",
      shadow: linkedinShadow,
      drop: "drop-shadow(0 0.6px 0.6px rgba(0,0,0,0.1))",
      padding: "8px",
      aspect: "1 / 1",
      layers: [{ src: `${D}/linkedin.svg`, inset: "-2.5% -7.5% -12.5% -7.5%" }],
    },
  },
  {
    id: "gmail",
    label: "Gmail",
    link: links.email,
    light: {
      kind: "tile",
      fill: "#ffffff",
      shadow: whiteShadow,
      drop: "drop-shadow(0 0.75px 0.5px rgba(0,0,0,0.1))",
      padding: "4px",
      aspect: "1 / 1",
      layers: gmailLayers(L),
    },
    dark: {
      kind: "tile",
      fill: blackFill,
      shadow: blackShadow,
      drop: "drop-shadow(0 1.2px 1px rgba(0,0,0,0.1))",
      hairline: true,
      padding: "4px",
      aspect: "1 / 1",
      layers: gmailLayers(D),
    },
  },
  {
    id: "music",
    label: "YouTube Music",
    window: "music",
    light: {
      kind: "tile",
      fill: "#ffffff",
      shadow: whiteShadow,
      drop: "var(--effect-white-bg-drop)",
      padding: "4px",
      aspect: "1 / 1",
      layers: [{ src: `${L}/music.png`, inset: "0" }],
    },
    dark: {
      kind: "tile",
      fill: blackFill,
      shadow: blackShadow,
      drop: "var(--effect-black-bg-drop)",
      hairline: true,
      padding: "4px",
      aspect: "1 / 1",
      layers: [{ src: `${D}/music.png`, inset: "0" }],
    },
  },
  {
    id: "maps",
    label: "Maps",
    link: links.maps,
    light: { kind: "image", src: `${L}/maps.png` },
    dark: { kind: "image", src: `${D}/maps.png` },
  },
  {
    id: "photos",
    label: "Photos",
    window: "photos",
    light: { kind: "image", src: `${L}/photos.png` },
    dark: { kind: "image", src: `${D}/photos.png` },
  },
  {
    id: "notes",
    label: "Notes",
    window: "notes",
    light: { kind: "image", src: `${L}/notes.png` },
    dark: { kind: "image", src: `${D}/notes.png` },
  },
  {
    id: "calendar",
    label: "Calendar",
    // Shows the visitor's own weekday and date (kept current by the menu bar clock)
    light: { kind: "calendar", tone: "light" },
    dark: { kind: "calendar", tone: "dark" },
  },
  {
    // Figma: "Light Mode" (sun) in the light Dock, "Dark Mode" (moon) in the dark Dock.
    // Clicking it flips the whole site to the other theme.
    id: "theme",
    label: "Appearance",
    labels: { light: "Switch to Dark Mode", dark: "Switch to Light Mode" },
    action: "toggle-theme",
    light: {
      kind: "tile",
      fill: "var(--window-background)",
      shadow: whiteShadow,
      drop: "var(--effect-white-bg-drop)",
      padding: "6px",
      aspect: "1 / 1",
      layers: [{ src: `${L}/theme-sun.svg`, inset: "0" }],
    },
    dark: {
      kind: "tile",
      fill: blackFill,
      shadow: blackShadow,
      drop: "var(--effect-black-bg-drop)",
      padding: "6px",
      aspect: "84.623 / 84.374",
      layers: [{ src: `${D}/theme-moon.svg`, inset: "0" }],
      overlays: [{ src: `${D}/theme-star.svg`, style: "top: 7px; right: 6px; width: 10px; height: 10px;" }],
    },
  },
];

export const trash: DockApp = {
  id: "trash",
  label: "Trash",
  light: { kind: "image", src: `${L}/trash.png` },
  dark: { kind: "image", src: `${D}/trash.png` },
};
