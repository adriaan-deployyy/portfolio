/*
 * Client case studies, transcribed from the Figma "Client Projects" section (6465:10522).
 * Every project uses the same template; only the content and image grid differ.
 */
import type { ImageMetadata } from "astro";

const files = import.meta.glob<ImageMetadata>("../assets/projects/*.{jpg,png}", { eager: true, import: "default" });
const folders = import.meta.glob<ImageMetadata>("../assets/folders/*.png", { eager: true, import: "default" });

/** Look up a downloaded Figma image by its asset hash */
const img = (hash: string): ImageMetadata => {
  const match = Object.entries(files).find(([path]) => path.includes(`/${hash}.`));
  if (!match) throw new Error(`Missing project image ${hash}`);
  return match[1];
};

const folder = (n: string): ImageMetadata => folders[`../assets/folders/${n}.png`];

/** Image placement inside a card, as Figma crops it (percentages of the card box) */
export interface Crop {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface Shot {
  src: ImageMetadata;
  /** Matte colour behind the image */
  bg?: string;
  /** Without a crop the image covers the card */
  crop?: Crop;
}

export type GalleryRow =
  | { layout: "1"; shots: [Shot] }
  | { layout: "2"; shots: [Shot, Shot] }
  /** 1/3 + 2/3; each card keeps its own Figma aspect ratio, so heights can differ */
  | { layout: "3"; shots: [Shot, Shot]; aspects: [string, string] }
  /** 1/4 + 1/4 + 2/4 */
  | { layout: "4"; shots: [Shot, Shot, Shot] }
  /** Section intro; body is optional (Citlo's "Branding & Assets" is a title only) */
  | { layout: "text"; title: string; body?: string };

export interface Project {
  id: string;
  name: string;
  /** Desktop folder icon */
  icon: ImageMetadata;
  /**
   * Hover preview: Figma "Showreel Animation" frame (997 x 745), rendered by Figma as a looping
   * MP4 at 480 x 359 (2x the 240px preview). Slides cut every 0.5s.
   */
  showreel: string;
  intro: string;
  timeline: string;
  role: string;
  /** No url (e.g. an unreleased concept) shows the label as plain text */
  website: { label: string; url?: string };
  scope: string[];
  gallery: GalleryRow[];
  /**
   * "Want to see more?" works like a small CMS: every project has one card thumbnail, and each
   * case study suggests two projects that aren't open on the desktop right now. `seeMore` is the
   * preferred order (the picks from Figma); any other closed projects fill in after them.
   */
  seeMore: string[];
}

/** The thumbnail shown when this project is suggested under "Want to see more?" (360 x 250 card) */
export const cards: Record<string, Shot> = {
  driven: { src: img("78e84") },
  caven: { src: img("38d5f"), crop: { left: -17.78, top: -4.14, width: 135.56, height: 108.28 } },
  alkmist: { src: img("2f5d6") },
  exhibitly: { src: img("9ecba") },
  dawlati: { src: img("ef106") },
  citlo: { src: img("0192b") },
};

const matte = "#e8e8e8";
const white = "#ffffff";
const gray = "#8e8e93";
const centred: Crop = { left: 9.09, top: 0, width: 81.82, height: 100 };

/*
 * "3 Colm" card sizes at the 736px Figma column.
 * Driven, Caven and Alkmist: a 234.67 x 250 card beside a taller 485.33 x 517.05 card, top-aligned.
 * Dawlati's row uses the same split with both cards 250 tall.
 */
const tallThirds: [string, string] = ["234.67 / 250", "485.33 / 517.05"];
const evenThirds: [string, string] = ["234.67 / 250", "485.33 / 250"];

export const projects: Project[] = [
  {
    id: "driven",
    name: "Driven",
    icon: folder("01"),
    showreel: "/showreels/driven.mp4",
    intro:
      "Driven is an agentic AI platform built to transform how B2B companies structure, track, and pay out sales commissions. Entering the market as a pre-revenue startup, Driven partnered with Adriaan to enhanced brand identity, a complete website redesign, and custom motion graphic videos for their site.",
    timeline: "3 Weeks",
    role: "Assets, Design & Development",
    website: { label: "Driven.work", url: "https://driven.work" },
    scope: ["Brand Assets", "Web & Experimental"],
    gallery: [
      { layout: "1", shots: [{ src: img("78e84") }] },
      { layout: "2", shots: [{ src: img("f0dce") }, { src: img("54c88") }] },
      { layout: "1", shots: [{ src: img("6a4a0"), bg: matte, crop: centred }] },
      {
        layout: "3",
        aspects: tallThirds,
        shots: [{ src: img("68a8c") }, { src: img("69049"), crop: { left: -42.51, top: 0, width: 142.57, height: 100 } }],
      },
    ],
    seeMore: ["caven", "alkmist"],
  },
  {
    id: "caven",
    name: "Caven",
    icon: folder("02"),
    showreel: "/showreels/caven.mp4",
    intro:
      "Caven is a startup building privacy-first intelligence recording software designed for legal teams. Caven needed a refined digital presence that would immediately instill confidence in general counsels and law firm partners. They brought on Adriaan to lead comprehensive brand development and full website development.",
    timeline: "5 Weeks",
    role: "Brand & Design",
    website: { label: "Caven.io", url: "https://caven.io" },
    scope: ["Web & Experimental", "Brand Identity"],
    gallery: [
      { layout: "1", shots: [{ src: img("7d99a"), bg: matte, crop: centred }] },
      {
        layout: "2",
        shots: [{ src: img("74068"), crop: { left: 0, top: -7, width: 100, height: 107.6 } }, { src: img("881e9") }],
      },
      { layout: "1", shots: [{ src: img("c6808"), bg: white, crop: { left: 4.08, top: 11.46, width: 91.85, height: 77.08 } }] },
      { layout: "1", shots: [{ src: img("38d5f"), bg: white, crop: { left: -12.77, top: -6.95, width: 125.54, height: 113.9 } }] },
      {
        layout: "3",
        aspects: tallThirds,
        shots: [
          { src: img("0b041") },
          { src: img("0b85a"), bg: matte, crop: { left: 20.07, top: 13.73, width: 69.34, height: 72.54 } },
        ],
      },
      {
        layout: "text",
        title: "Brand Identity",
        body: "Our approach was modern and intentional, steering away from the traditional legal aesthetics. I focused on clear, thoughtful design choices, real people over generic stock imagery, a modern yet inviting visual language, and a strong foundation that could evolve with the business. In just 2 weeks, we delivered a fresh, forward-looking brand.",
      },
      { layout: "1", shots: [{ src: img("0434d") }] },
      { layout: "4", shots: [{ src: img("fb862") }, { src: img("41e53") }, { src: img("83b39") }] },
      {
        layout: "2",
        shots: [
          // Figma nests this one in a 360x269 frame; flattened to card percentages
          { src: img("fda52"), bg: gray, crop: { left: -54.94, top: 0, width: 168.37, height: 109.3 } },
          { src: img("de433") },
        ],
      },
    ],
    seeMore: ["exhibitly", "driven"],
  },
  {
    id: "alkmist",
    name: "Alkmist",
    icon: folder("03"),
    showreel: "/showreels/alkmist.mp4",
    intro:
      "Alkmist approached Adriaan to enchance their brand and digital appearance as they scaled their seed-funded SaaS platform for enterprises and service firms. Armed with €1.8 million in funding, they needed a digital identity that balanced enterprise-grade reliability with modern software aesthetics.",
    timeline: "4 Weeks",
    role: "Brand & Design",
    website: { label: "Alkmist.com", url: "https://alkmist.com" },
    scope: ["Web & Experimental", "Brand Enhancing"],
    gallery: [
      { layout: "1", shots: [{ src: img("fce66"), bg: "#fef9f3", crop: { left: 6.36, top: -3.33, width: 87.28, height: 106.67 } }] },
      {
        layout: "2",
        shots: [{ src: img("d39c6"), crop: { left: 0, top: -7, width: 100, height: 107.6 } }, { src: img("2f5d6") }],
      },
      { layout: "1", shots: [{ src: img("4bc38"), bg: white }] },
      { layout: "1", shots: [{ src: img("8f695"), bg: white }] },
      {
        layout: "2",
        shots: [{ src: img("0563d"), crop: { left: 0, top: -3.8, width: 100, height: 107.6 } }, { src: img("2381b") }],
      },
      {
        layout: "3",
        aspects: tallThirds,
        shots: [
          { src: img("45823"), bg: "#f2eadd", crop: { left: 13.49, top: 10.85, width: 73.01, height: 70.44 } },
          { src: img("0464b"), bg: "#2f2c25" },
        ],
      },
    ],
    seeMore: ["dawlati", "driven"],
  },
  {
    id: "exhibitly",
    name: "Exhibitly",
    icon: folder("04"),
    showreel: "/showreels/exhibitly.mp4",
    intro:
      "Exhibitly.ai is a pre-seed SaaS company enabling dynamic event personalization to drive higher attendee attendance across virtual and in-person experiences. Exhibitly.ai brought in Adriaan to design and develop a refined, high-converting website that would instill confidence in event organizers and venture partners alike. Following the collaboration, Exhibitly.ai leveraged their elevated presence to close €1.4 million in funding.",
    timeline: "3 Weeks",
    role: "Web Design & Development",
    website: { label: "Exhibitly.ai", url: "https://exhibitly.ai" },
    scope: ["Web & Experimental"],
    gallery: [
      { layout: "1", shots: [{ src: img("9ecba"), bg: matte, crop: centred }] },
      { layout: "2", shots: [{ src: img("d9c84") }, { src: img("45a97") }] },
      { layout: "1", shots: [{ src: img("ee502"), crop: { left: -7.47, top: -3.34, width: 114.95, height: 106.67 } }] },
      {
        layout: "2",
        shots: [{ src: img("9af60") }, { src: img("dc17c"), crop: { left: 0, top: -9.9, width: 100, height: 107.6 } }],
      },
      { layout: "1", shots: [{ src: img("164c1"), bg: white, crop: { left: -8.97, top: -6.89, width: 117.93, height: 113.78 } }] },
    ],
    seeMore: ["alkmist", "caven"],
  },
  {
    id: "dawlati",
    name: "Dawlati",
    icon: folder("05"),
    showreel: "/showreels/dawlati.mp4",
    intro:
      "For companies in the UAE, staying compliant with national workforce mandates is critical, and connecting with the right local talent remains a persistent bottleneck. Dawlati is the platform built to solve both challenges at once, streamlining regulatory compliance for businesses while opening clear pathways for Emirati candidates. To introduce their dual-sided solution to the market, Dawlati teamed up with Adriaan to design an engaging website.",
    timeline: "6 Weeks",
    role: "Web Design & Development",
    website: { label: "Dawlati.ae", url: "https://dawlati.ae" },
    scope: ["Web & Experimental"],
    gallery: [
      { layout: "1", shots: [{ src: img("c84cd"), bg: matte, crop: { left: 5.82, top: -7.33, width: 88.37, height: 108 } }] },
      {
        layout: "2",
        shots: [{ src: img("ef106") }, { src: img("c7735"), crop: { left: -4.17, top: -3.59, width: 107.5, height: 115.67 } }],
      },
      { layout: "1", shots: [{ src: img("06852"), bg: white }] },
      {
        layout: "3",
        aspects: evenThirds,
        shots: [{ src: img("e1aa7") }, { src: img("d5cc8"), crop: { left: 0, top: -30.13, width: 100, height: 145.06 } }],
      },
      {
        layout: "text",
        title: "Pitch Deck",
        // Copied as-is from Figma; this paragraph describes a different project and needs replacing
        body: "A key feature of the website is the custom closet builder, which we developed entirely using Webflow's no-code capabilities. This innovative solution allows customers to design their dream closet by selecting styles, finishes, and accessories through an intuitive interface. By leveraging Webflow's native features like custom attributes, conditional visibility, and form handling, we created a sophisticated configuration tool that maintains the premium feel of the site while being easy for the ClosetNow team to manage and update. The builder seamlessly integrates with their workflow, automatically sending detailed design specifications to their team for follow-up.",
      },
      { layout: "1", shots: [{ src: img("ff43d") }] },
      {
        layout: "2",
        shots: [{ src: img("dd62a"), bg: gray, crop: { left: 0, top: -22.14, width: 100, height: 144.27 } }, { src: img("8efb7") }],
      },
    ],
    seeMore: ["caven", "exhibitly"],
  },
  {
    // Figma: Client Projects → "Citlo Frame" (6473:59924)
    id: "citlo",
    name: "Citlo",
    icon: folder("06"),
    showreel: "/showreels/citlo.mp4",
    intro:
      "Unselected Creative Direction — Developed as an alternative brand and design proposal that the client ultimately chose not to take forward, this concept was built for an all-in-one platform unifying global HR, payroll, IT, and finance.",
    timeline: "2 Days",
    role: "Branding, Design & Assets",
    website: { label: "N/A" },
    scope: ["Branding", "Web & Experimental", "Brand Assets"],
    gallery: [
      { layout: "1", shots: [{ src: img("0192b"), bg: matte, crop: centred }] },
      {
        layout: "2",
        shots: [{ src: img("62f2a"), crop: { left: 0, top: -7, width: 100, height: 107.6 } }, { src: img("d9afe") }],
      },
      { layout: "text", title: "Branding & Assets" },
      { layout: "1", shots: [{ src: img("d41c5") }] },
      { layout: "1", shots: [{ src: img("b4195") }] },
      { layout: "1", shots: [{ src: img("f3e65"), bg: matte, crop: centred }] },
      { layout: "1", shots: [{ src: img("fc871") }] },
      { layout: "1", shots: [{ src: img("71dca") }] },
      { layout: "1", shots: [{ src: img("7c9d3") }] },
    ],
    seeMore: ["caven", "exhibitly"],
  },
];

export const projectName = (id: string) => projects.find((p) => p.id === id)?.name ?? id;
