/*
 * The CV, from Figma: "Adriaan Myburgh CV" (light 6483:42687, dark 6465:1724), 595 x 1523.
 * The window shows a page render for the current theme; the PDFs are Figma's own exports.
 */
import icon from "../assets/cv/cv-icon.png";
import light from "../assets/cv/cv-light.png";
import dark from "../assets/cv/cv-dark.png";

export const cv = {
  id: "cv",
  /** Desktop and Finder file name */
  name: "CV.pdf",
  title: "Adriaan Myburgh — CV",
  /** Figma: "📄 Page facing up" (CV Icon Design) */
  icon,
  pages: { light, dark },
  pdf: {
    light: "/cv/adriaan-myburgh-cv-light.pdf",
    dark: "/cv/adriaan-myburgh-cv-dark.pdf",
  },
  /** Name the browser saves the download as */
  filename: "Adriaan Myburgh CV.pdf",
  /** Read out in place of the page image, and matched by Finder's search */
  summary:
    "Adriaan Myburgh, Designer. Product and web designer for B2B SaaS and founder of Deployyy.co. " +
    "Experience: Deployyy.co (Founder, May 2023 to present), Quandox (Creative Partner, Mar 2024 to Feb 2025), " +
    "Five2Nine Collective (Graphic & Motion, Dec 2021 to May 2023), Pragma (Intern Marketer, Dec 2019 to Feb 2020). " +
    "Education: City Varsity, Bachelor of Media & Design (2019 to 2021). " +
    "Skills: web, motion, product and graphic design, positioning and messaging, branding, web development, leadership. " +
    "Tools: Figma, Claude, Paper.design, Adobe Creative Suite, Framer, Webflow. " +
    "Languages: Afrikaans (native), English (fluent), isiXhosa (conversational). Includes client testimonials.",
};
