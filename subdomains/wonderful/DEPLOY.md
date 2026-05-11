# Deploy `<your-subdomain>.anysigma.com` runbook

Stand up a mini-site behind Cloudflare Access (magic-link email, 14-day rolling session), verify the auth wall, then swap content. ~30 minutes end-to-end.

**Prereqs:**
- `anysigma.com` is on Cloudflare DNS ✓
- You have admin rights to the Cloudflare account ✓

Replace `<your-subdomain>` (e.g. `client-x`) and `<project-slug>` (e.g. `client-x-anysigma`) throughout.

---

## What gets published vs what stays private

Only `dist/` (the Astro build output) gets served at `<your-subdomain>.anysigma.com`. Anything in the repo that isn't built into `dist/` stays in Git.

| Surface | Audience | Gate |
|---|---|---|
| `<your-subdomain>.anysigma.com` | Allowlisted emails | Cloudflare Access (14-day session) |
| `github.com/mavilas/<repo>` | Repo collaborators | GitHub repo invite |
| Public internet | Nobody | — |

---

## Phase 1 — Cloudflare Pages deploy (~15 min)

Two paths. Pick one up front and stick with it for the lifetime of the project — mixing them creates "main is ahead but live URL serves an older version" bugs.

### Path A · Git-connected auto-deploy (recommended for standalone repos)

Cloudflare Pages builds + deploys on every push to the production branch. Best when the repo is a single-project Astro app (no parent project sharing the working dir).

#### 1.A.1 Create the Pages project

Dashboard → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git** → select your repo.

Build settings:
- **Project name:** `<project-slug>` *(this becomes the value you'll pass to `--project-name` if you ever deploy via CLI — see Path B. **Different from the `name` field in `wrangler.toml`, which is a Workers concept and is ignored by Pages.**)*
- **Production branch:** `main`
- **Framework preset:** `Astro`
- **Build command:** `pnpm install --frozen-lockfile=false && pnpm build`
- **Build output directory:** `dist`
- **Root directory:** *(leave blank for standalone; for a parent-repo subdirectory like `subdomains/foo/`, set to that path)*
- **Environment variables:** `NODE_VERSION=22`

Click **Save and Deploy**. First build ~2 min.

### Path B · Manual `wrangler pages deploy` (use when the repo is a subdirectory of a multi-project repo)

If this mini-site lives at `<parent>.com/subdomains/<slug>/` inside a parent repo, Git auto-deploy is fiddly (Pages wants a single root directory; the parent repo's root has its own Astro project). Manual wrangler is cleaner.

#### 1.B.1 Create the Pages project (CLI-first, no Git connection)

```sh
cd /path/to/<parent>.com/subdomains/<slug>
pnpm wrangler pages project create <project-slug> --production-branch main
# project-slug becomes both the Cloudflare project name and the dashboard URL
```

Or via dashboard: **Workers & Pages** → **Create application** → **Pages** → **Direct upload** (no Git connection). Just name the project.

#### 1.B.2 First deploy (and every subsequent deploy)

**⚠️ Pre-deploy verification — non-negotiable for multi-project repos:**

```sh
# 1. Confirm working directory is the subdomain, NOT the parent root
pwd
# Expected: .../<parent>.com/subdomains/<slug>
# If it shows the parent root, `cd subdomains/<slug>` first.

# 2. Build
pnpm build

# 3. Confirm dist/ contains the right content (not the parent's coming-soon page)
grep -oE "<title>[^<]*</title>" dist/index.html
# Expected: the title of THIS mini-site, not the parent.

# 4. Deploy
pnpm wrangler pages deploy dist --project-name=<project-slug> --branch=main --commit-dirty=true
```

The `--commit-dirty=true` flag lets you deploy with uncommitted changes (useful for iteration). Drop it when you want to enforce clean state.

**Why the pwd + grep check matters:** if you forget to `cd` into the subdomain and run `pnpm wrangler pages deploy dist --project-name=<your-project>` from the parent root, wrangler uploads the parent's `dist/` (whatever that contains) to your mini-site's Pages project. The live URL serves the wrong content. **This has happened — it's not theoretical.**

### 1.2 Verify the deploy is reachable

Visit `https://<project-slug>.pages.dev` (the auto-generated subdomain). You should see the demo content. At this point still **unprotected** — Access comes next.

### 1.3 Add custom domain `<your-subdomain>.anysigma.com`

Pages project → **Custom domains** → **Set up a custom domain** → `<your-subdomain>.anysigma.com`.

Cloudflare *usually* auto-creates the CNAME (since DNS is already on Cloudflare). Wait ~30s for SSL.

> **If the CNAME doesn't auto-create** (this happened with the source Zunou deploy): go to **DNS** for `anysigma.com` and add manually:
> - Type: `CNAME`
> - Name: `<your-subdomain>`
> - Target: `<project-slug>.pages.dev`
> - Proxy status: Proxied (orange cloud)

Visit `https://<your-subdomain>.anysigma.com` — still serving without auth. Continue to Phase 2 immediately.

---

## Phase 2 — Cloudflare Access (Zero Trust) — ~15 min

### 2.1 Enable Zero Trust (one-time, if not already)

Dashboard → **Zero Trust** → team name `anysigma` (becomes `anysigma.cloudflareaccess.com`). Plan: **Free** (≤50 users; $3/user/mo beyond).

### 2.2 Add the magic-link email identity provider

Zero Trust → **Settings** → **Authentication** → **Add new** → **One-time PIN** → name it `Email magic-link` → save.

(Cloudflare labels it "One-time PIN" but the UX is magic-link: viewer enters email, gets a one-time code by email, pastes it, in.)

### 2.3 Create the Access application

Zero Trust → **Access** → **Applications** → **Add an application** → **Self-hosted**.

- **Application name:** `<Project Name>`
- **Session Duration:** `14 days` *(renews on activity)*
- **Subdomain:** `<your-subdomain>`
- **Domain:** `anysigma.com`
- **Path:** *(leave blank — protect the whole site)*
- **Identity providers:** enable **One-time PIN**
- **App Launcher:** off

### 2.4 Create the access policy

Policy 1: `<Project Name> readers`

- **Action:** Allow
- **Session duration:** 14 days (inherits from app)
- **Include rules — combine emails + domains as needed:**

  | Rule type | Value | Purpose |
  |---|---|---|
  | Emails ending in | `@anysigma.com` | Internal team |
  | Emails | `specific.reader@example.com` | Explicit allowlist for external readers |
  | Emails ending in | `@<client-domain>` | Domain-wide rule for client teams |

Save.

### 2.5 Test matrix — verify isolation works

Use a **private/incognito window** for each test.

| Test | Email | Expected |
|---|---|---|
| 1 — Internal domain rule | any `@anysigma.com` | ✅ Allowed |
| 2 — Explicit allowlist | the specific email you added | ✅ Allowed |
| 3 — Client-domain rule | any email on the client domain | ✅ Allowed |
| 4 — Random gmail not on list | a `@gmail.com` not in the policy | ❌ Denied |
| 5 — Random other domain | `@randomcompany.com` | ❌ Denied |

All five must behave as expected.

Audit: Zero Trust → **Logs** → **Access** — entries for both allows and denies.

### 2.6 Brand the login page (optional, 5 min)

Zero Trust → **Settings** → **Custom Pages** → **Login Page** — upload logo + colors. Visitors see your branding instead of Cloudflare default.

---

## Phase 3 — Sign-off and ongoing ops

Once all 5 tests in 2.5 pass:

- ✅ Security infrastructure verified
- ➡️ Swap demo content in `src/pages/index.astro` for the real mini-site
- ➡️ Tighten the policy for production: remove any test-only emails, keep production domain rules

**Add a person:** Zero Trust → Access → Applications → `<App Name>` → policy → add email.
**Remove a person:** same path, remove. Active sessions: Access → Sessions → revoke.
**Audit log:** Zero Trust → Logs → Access.
**Break-glass:** Access → Sessions → revoke all for the app — forces re-auth.

---

## Cost reality check

- Cloudflare Pages — $0 (unlimited bandwidth, 500 builds/month)
- Cloudflare Access — $0 (≤50 users; $3/user/mo beyond)
- DNS, Workers, etc. — $0 within free tiers
- **Total: $0/month** for the foreseeable future

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `404` on `<your-subdomain>.anysigma.com` | DNS still propagating, or CNAME missing | Check Pages → Custom domains status; manually add CNAME if needed (see 1.3 sidebar) |
| Build fails on Cloudflare | `pnpm` not detected | Ensure `NODE_VERSION=22` env var is set; pnpm comes via corepack |
| `502` after login | Build output dir wrong | Confirm build output is `dist` and matches `wrangler.toml` `pages_build_output_dir` |
| Login loops back to login | Cookie blocked / wrong IdP | Try a different IdP; check browser third-party cookie settings |
| Session not lasting 14 days | App or policy duration mismatch | Both app + policy should say `14 days`; the shorter wins |
| Allowed email blocked | Domain rule typo | Domain rule uses `@example.com` syntax — the `@` matters |

Sources: [Cloudflare Pages docs](https://developers.cloudflare.com/pages/), [Cloudflare Access — self-hosted apps](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/self-hosted-apps/), [Cloudflare Access — one-time PIN IdP](https://developers.cloudflare.com/cloudflare-one/identity/one-time-pin/).
