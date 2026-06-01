# sallyalptekin.com

Personal site for **Sally Tang Alptekin** — Home, About, Projects, Artwork, and a Blog. A fully
static [Astro](https://astro.build) site served from **Cloudflare Workers** (free tier).

> **Isolated from Kenan's sites:** this is its own Worker (`sallyalptekin-site`) bound only to
> `sallyalptekin.com`. Nothing here references Kenan's domains, and it's meant to be deployed with
> a **scoped API token** that can't touch his resources (see the last section).

## Layout

```
sally-personal-site/
├── site/     Astro site (the website)
├── infra/    Cloudflare provisioning, scoped to sallyalptekin.com (recon / secure / smoke)
├── cf_creds  scoped API token (gitignored)
└── CLAUDE.md project context
```

## Develop

```bash
cd site
npm install
npm run dev      # http://localhost:4321 (hot reload; Ctrl+C to stop)
npm run build
npm test         # build + smoke tests
```

## Edit content

| Task | Where |
|------|-------|
| Bio / Skills (About page) | `site/src/data/resume.ts` — only `BIO` + `SKILLS` render |
| Projects | `site/src/data/projects.ts` |
| Name / links / location | `site/src/data/site.ts` |
| Photo | replace `site/src/assets/sally.jpeg` |
| **Add artwork** | drop images into `site/src/assets/artwork/` (auto-appears on `/artwork`) |
| **Add a blog post** | create `site/src/content/blog/my-post.md` (frontmatter: `title`, `description`, `pubDate`, `tags`) |

## Deploy

```bash
cd site
npm run build
npx wrangler deploy   # first time: npx wrangler login  (or set CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID)
```

## Security (run from repo root)

```bash
node infra/recon.mjs           # READ-ONLY audit (token, zone, DNS, WAF, Bot Fight Mode)
node infra/secure.mjs          # preview WAF geo-block + Bot Fight Mode
node infra/secure.mjs --apply  # apply them
node infra/smoke.mjs           # live checks after deploy
```

The WAF rule (`infra/secure.mjs --apply`) blocks a set of countries. Also turn on **Bot Fight Mode**
once in the dashboard — **Security → Bots → Bot Fight Mode → On**. It challenges bad bots but allows
verified crawlers (Googlebot/Bingbot), so indexing is unaffected. (On the free plan Bot Fight Mode is
a dashboard toggle; it can't be set via API.)

## Auto-deploy (GitHub Actions)

Pushing to `main` builds, tests, and deploys automatically via `.github/workflows/deploy.yml` (free tier).
In Sally's GitHub repo add two **Actions secrets** (Settings → Secrets and variables → Actions):

- `CLOUDFLARE_API_TOKEN` — Sally's scoped token (see below)
- `CLOUDFLARE_ACCOUNT_ID` — the Cloudflare account ID

## Creating a scoped Cloudflare API token (sallyalptekin.com ONLY)

This lets Sally (or her AI agent) deploy **only this site** — with **no access to Kenan's domains
or resources**.

1. **[dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)** → **Create Token** → **Create Custom Token**.
2. **Name:** `sally-deploy`.
3. **Permissions** (click *+ Add more* for each):
   - **Account** · *Workers Scripts* · **Edit**
   - **Zone** · *Workers Routes* · **Edit**
   - **Zone** · *DNS* · **Edit**
   - **Zone** · *SSL and Certificates* · **Edit**
   - **Zone** · *WAF* · **Edit**
   - **Zone** · *Bot Management* · **Edit** *(if not offered on the free plan, just toggle Bot Fight Mode in the dashboard)*
4. **Account Resources:** Include → *your account*.
5. **Zone Resources:** Include → **Specific zone** → **`sallyalptekin.com`**  ← this is the isolation; pick only this zone.
6. Leave **TTL** and **Client IP Filtering** blank.
7. **Continue to summary → Create Token →** copy the value into `sally-personal-site/cf_creds`.

✅ This token can manage **only `sallyalptekin.com`** — it cannot read or change `kenanalptekin.com`
or `alptekin.me` (they aren't in its Zone Resources).

⚠️ **Cloudflare limitation:** *Workers Scripts: Edit* is account-level — tokens can't be scoped to a
single Worker. So the token can deploy Workers in the account, but can only **route** them to
`sallyalptekin.com` (routes are zone-scoped), and it has **no DNS/WAF/cert access to Kenan's zones**.
For 100% Worker-script isolation you'd put the sites in separate Cloudflare accounts; for
domain/DNS/WAF/cert isolation, this token is fully isolated.

See **CLAUDE.md** for architecture + conventions.
