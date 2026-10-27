# Adriaan Myburgh — Portfolio

A macOS-style portfolio built with [Astro](https://astro.build), hosted on [Vercel](https://vercel.com).
Designs live in Figma (file `O7zOARYhfQMhwyqsKIwxGN`, "Designs" page).

## Run it locally

```sh
npm install      # first time only
npm run dev      # http://localhost:4321
npm run build    # production build into dist/
```

## Going live (first time)

1. Create an empty repository on GitHub (no README or .gitignore), then push this folder to it:

   ```sh
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```

2. In Vercel: **Add New → Project**, import the repository and press **Deploy**.
   The settings come from `vercel.json` (Astro, `npm run build`, output `dist`).
3. Custom domain: Vercel project → **Settings → Domains**, add the domain and copy the DNS
   record it shows into the domain's DNS settings.

## Making changes after it's live

Every push to `main` redeploys the live site; any other branch gets its own preview link.

```sh
# edit files, check them with npm run dev, then:
git add -A
git commit -m "Describe the change"
git push
```

To try something without touching the live site, push a branch and open its preview link in Vercel:

```sh
git switch -c new-idea
git push -u origin new-idea
```

Merge it into `main` (on GitHub) when it's ready. A bad deploy can be undone in Vercel:
**Deployments → ⋯ → Instant Rollback** on the previous one.

## Where things are

| What | Where |
| --- | --- |
| Projects / case studies | `src/data/projects.ts` |
| Dock apps and links | `src/data/dock.ts` |
| CV images and PDFs | `src/assets/cv/`, `public/cv/` |
| Notes app copy | `src/components/NotesApp.astro` |
| Photos | `src/data/photos.ts`, `src/assets/photos/` |
| YouTube Music track | `src/data/music.ts` |
| Wallpaper videos | `public/wallpaper/` |
| Colours, type, spacing | `src/styles/tokens.css` |
