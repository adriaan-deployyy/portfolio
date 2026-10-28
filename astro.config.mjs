// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
/*
 * The site's public address, used for absolute links in the share (Open Graph) tags.
 * On Vercel this is the production domain (your custom domain once one is connected);
 * set SITE_URL to override it, e.g. SITE_URL=https://adriaanmyburgh.com.
 */
const site =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:4321");

export default defineConfig({
  site,
  // The dev toolbar sits exactly where the Dock is
  devToolbar: { enabled: false },
});
