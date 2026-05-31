# CLAUDE.md — project context (Sally's site)

Context for future sessions. Read this first.

## What this is

**Sally Tang Alptekin's** personal site — a fully static Astro site on **Cloudflare Workers
Static Assets** ($0 hosting). Pages: **Home, About, Projects, Artwork** (no blog, by request).
Product/creative focus. Distinct violet theme (vs. Kenan's blue).

## Isolation from Kenan's sites (important)

- Separate repo (`sally-personal-site`), separate Worker **`sallyalptekin-site`**, bound only to
  **`sallyalptekin.com`** (+ `www`). Nothing references `kenanalptekin.com`/`alptekin.me`.
- `infra/` is scoped to `SALLY_ZONE = sallyalptekin.com` only.
- Deploy/manage with a **scoped API token** (Zone Resources = sallyalptekin.com only). Steps are in
  `README.md`. The token loader reads `cf_creds` or falls back to `CLOUDFLARE_API_TOKEN` env.
- Same Cloudflare account as Kenan's — so the *only* shared-access caveat is account-level
  "Workers Scripts: Edit" (CF can't scope tokens to one Worker). Domains/DNS/WAF/certs are isolated.

## Structure

```
site/
  src/pages/{index,about,projects,artwork,404}.astro
  src/layouts/BaseLayout.astro       head/SEO/JSON-LD, nav (Home·About·Projects·Artwork), footer
  src/components/{ThemeToggle,ProjectCard}.astro
  src/data/{site.ts, resume.ts, projects.ts}   all content (no markdown collections)
  src/assets/sally.jpeg + src/assets/artwork/  profile + gallery images (astro:assets, optimized)
  src/styles/global.css              violet theme, light/dark
  astro.config.mjs (site sallyalptekin.com + sitemap), wrangler.jsonc (name sallyalptekin-site)
infra/  lib.mjs, recon.mjs, secure.mjs (WAF geo-block + Bot Fight Mode), smoke.mjs
```

## Commands

```bash
# from repo root
npm run dev | build | test | deploy
npm run recon | secure | secure:apply | smoke
```
Deploy needs `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` (or `npx wrangler login`).

## Content model

- No content collections / no blog. Everything is a **data array**: `resume.ts` (bio, interests,
  experience, skills, education, certs, honors, volunteering), `projects.ts` (product work cards),
  `site.ts` (name, role, tagline, links).
- **Artwork** = `import.meta.glob('src/assets/artwork/*')` → drop images, they appear (optimized).

## Conventions & gotchas

- Astro 6 + `astro:assets` `<Image>` for photos (optimized to webp). No rss/rehype (no blog).
- **Account-owned token**: verifies at `/accounts/{id}/tokens/verify`; zone list scoped with
  `?account.id=`. `wrangler deploy` with a token needs `CLOUDFLARE_ACCOUNT_ID` set.
- `wrangler.jsonc` is assets-only + `not_found_handling: "404-page"`.
- SEO: `Person`/`WebSite` JSON-LD on home, `og:image` (profile default), sitemap, canonical.
- **Security**: `infra/secure.mjs --apply` sets a WAF geo-block + Bot Fight Mode (allows verified
  crawlers, so indexing is fine).

## Deploy & tokens

- Push to `main` → `.github/workflows/deploy.yml` builds, tests, and deploys (free). Needs repo
  secrets `CLOUDFLARE_API_TOKEN` (Sally's scoped token) + `CLOUDFLARE_ACCOUNT_ID`.
- **Bot Fight Mode**: enable in the dashboard (Security → Bots → Bot Fight Mode → On) — free anti-bot
  that allows verified crawlers. WAF geo-block via `infra/secure.mjs --apply` (already applied).

## Status / TODO

- [ ] Add Sally's real **LinkedIn URL** + **public email** in `site/src/data/site.ts`.
- [ ] Fill **Interests** in `site/src/data/resume.ts` (placeholders now).
- [ ] Drop **artwork images** into `site/src/assets/artwork/`.
- [ ] Create Sally's **scoped API token** (README) → `cf_creds`; then `npm run deploy` + `secure:apply`.
- [ ] Delete any temporary/shared token after setup.
