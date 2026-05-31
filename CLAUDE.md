# CLAUDE.md — project context (Sally's site)

Context for future sessions/agents. Read this first.

## What this is

**Sally Tang Alptekin's** personal site — a fully static Astro site on **Cloudflare Workers Static
Assets** ($0 hosting), live at **sallyalptekin.com**. Pages: **Home, About, Projects, Artwork, Blog**.
Product + creative focus. Distinct **violet** theme (vs. Kenan's blue).

## Isolation from Kenan's sites (important)

- Separate repo (`sally-personal-site`), separate Worker **`sallyalptekin-site`**, bound only to
  **`sallyalptekin.com`** (+ `www`). Nothing references `kenanalptekin.com` / `alptekin.me`.
- `infra/` is scoped to `SALLY_ZONE = sallyalptekin.com` only.
- Deploy/manage with a **scoped API token** (Zone Resources = sallyalptekin.com only — see README).
  The token loader reads `cf_creds` or falls back to the `CLOUDFLARE_API_TOKEN` env var.
- Same Cloudflare account as Kenan's — the only shared-access caveat is account-level
  "Workers Scripts: Edit" (CF can't scope a token to one Worker). Domains/DNS/WAF/certs are isolated.

## Structure

```
site/
  src/pages/
    index.astro, about.astro, projects.astro, artwork.astro, 404.astro
    blog/index.astro, blog/[...slug].astro, blog/tags/index.astro, blog/tags/[tag].astro, rss.xml.js
  src/layouts/BaseLayout.astro   head/SEO/JSON-LD + article meta, nav, footer, theme + copy-code scripts
  src/components/   ThemeToggle, ProjectCard, PostCard, FormattedDate
  src/content/blog/*.md          blog posts (Markdown content collection)
  src/content.config.ts          blog collection schema
  src/data/   site.ts (name, role*, tagline*, location, links), resume.ts (BIO, SKILLS, +unused résumé data), projects.ts
  src/utils/  tags.ts (getPublishedPosts, getAllTags, tagSlug), reading.ts
  src/assets/ sally.jpeg + artwork/   (astro:assets, optimized)
  src/styles/global.css          violet theme, light/dark
  astro.config.mjs (site + sitemap + shiki + rehype anchors), wrangler.jsonc (sallyalptekin-site)
infra/  lib.mjs, recon.mjs, secure.mjs (WAF geo-block + Bot Fight Mode + Always Use HTTPS), smoke.mjs
```
(*`role`/`tagline` exist in site.ts but are no longer rendered — see Content model.)

## Commands (from repo root)

```bash
npm run dev | build | test | deploy
npm run recon | secure | secure:apply | smoke
```
Deploy needs `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` (or `npx wrangler login`).

## Content model

- **Home / Projects / Artwork** come from data files (`projects.ts`) + the artwork image glob.
- **About** renders **only `BIO` + `SKILLS`** from `resume.ts`, and the top shows **just the location
  (Marietta, GA)** — no role/title label (per request). `resume.ts` still contains experience,
  education, certs, honors, volunteering, interests, but those are **intentionally not rendered**
  (kept in case they're wanted later).
- **Blog** = a **Markdown content collection** (`src/content/blog/*.md`), same system as Kenan's:
  frontmatter `{title, description, pubDate, updatedDate?, heroImage?, tags[], draft}`. Lowercase
  `tags` generate `/blog/tags/<tag>` archives. Posts get reading time, prev/next, related-by-tag,
  copy-code buttons, heading anchors, Shiki highlighting, and `BlogPosting` JSON-LD + `article:*` meta.
- **Artwork** = `import.meta.glob('src/assets/artwork/*')` → drop image files, they appear (optimized).

## Conventions & gotchas

- Astro 6. Blog content layer: entries use **`entry.id`** as the slug; render with `render(entry)` from
  `astro:content`. `content.config.ts` lives in `src/`.
- `astro:assets` `<Image>` for photos (webp). Shiki `github-dark` + rehype-slug + rehype-autolink-headings.
- **Account-owned token**: verifies at `/accounts/{id}/tokens/verify`; zone list scoped with
  `?account.id=`. `wrangler deploy` with a token needs `CLOUDFLARE_ACCOUNT_ID` set.
- `wrangler.jsonc` is assets-only + `not_found_handling: "404-page"`.

## Deploy & security

- Push to `main` → `.github/workflows/deploy.yml` builds, tests, deploys (free). Needs repo secrets
  `CLOUDFLARE_API_TOKEN` (Sally's scoped token) + `CLOUDFLARE_ACCOUNT_ID`.
- `infra/secure.mjs --apply` sets the **WAF geo-block** + **Always Use HTTPS** (HTTP→HTTPS) and
  attempts Bot Fight Mode. **Bot Fight Mode** must be toggled in the dashboard on the free plan
  (Security → Bots → Bot Fight Mode → On) — it allows verified crawlers, so indexing is unaffected.

## Status / TODO

- [x] LinkedIn → `linkedin.com/in/tangsally`; email intentionally blank (footer hides it).
- [x] Location = Marietta, GA; About trimmed to bio + skills; Blog added; Always Use HTTPS on.
- [ ] Fill **Interests** in `resume.ts` if you want them shown (currently not rendered on About).
- [ ] Drop **artwork images** into `site/src/assets/artwork/`.
- [ ] Replace the seed post `src/content/blog/welcome.md` with real posts.
- [ ] Create Sally's **scoped API token** (README) → GitHub secret (and/or `cf_creds` for local infra).
