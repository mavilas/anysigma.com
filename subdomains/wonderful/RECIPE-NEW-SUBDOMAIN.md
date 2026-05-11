# Recipe: Add a new subdomain mini-site to ANY parent domain

A step-by-step for spinning up `<slug>.<parent>.com` from the boilerplate, behind Cloudflare Access. Works for `anysigma.com`, `koemi.ai`, `leomares.com`, or anything else on Cloudflare DNS.

This recipe is the **generalized** version of what we used to ship `zunou.anysigma.com`. The two patterns it supports:

| Pattern | When to use it | Repo layout |
|---|---|---|
| **A · Standalone repo** | The mini-site is its own thing (e.g. an external proposal you might later open-source) | `github.com/mavilas/<slug>-<parent>` — a fresh repo from the boilerplate |
| **B · Subdirectory of the parent repo** | The mini-site lives alongside the parent (e.g. an internal proposal for the parent's team) | `<parent>.com/subdomains/<slug>/` inside the parent's repo |

Pick one upfront. Mixing creates surprises.

---

## Variables you'll substitute throughout

| Variable | Example |
|---|---|
| `<parent>` | `anysigma.com` |
| `<slug>` | `wonderful` (the subdomain leaf) |
| `<project-slug>` | `wonderful-anysigma` (the Cloudflare Pages project name — usually `<slug>-<parent without TLD>`) |
| `<Project Name>` | `Wonderful · Anysigma` (human-readable, used in Access) |

---

## Step 0 · Prereqs (one-time per parent)

- `<parent>` domain is on Cloudflare DNS ✓
- You have admin access to the Cloudflare account that owns it ✓
- Cloudflare Zero Trust is enabled on that account (team subdomain like `<parent-org>.cloudflareaccess.com`) — see DEPLOY.md §2.1 if it isn't ✓
- pnpm + Node 22+ on your machine

---

## Step 1 · Spin up the code

### Pattern A · Standalone repo

```sh
# 1. Use the boilerplate as a GitHub template
gh repo create mavilas/<project-slug> --template mavilas/mini-site-boilerplate --private --clone

cd <project-slug>
pnpm install

# 2. Pick an accent palette (or keep the default)
#    Edit src/styles/tailwind.css → swap @import "./palettes/X.css"
#    Built-in options: warm-orange, cool-blue, forest-green, slate, plum

# 3. Update wrangler.toml
#    Change `name = "your-project-name-here"` to `<project-slug>`
#    (decorative for Pages but keeps things consistent)
```

### Pattern B · Subdirectory of the parent repo

```sh
# 1. Clone or cd into the parent
cd ~/github/personal/<parent>

# 2. Create the subdomains directory if it doesn't exist
mkdir -p subdomains

# 3. Copy the boilerplate in (NOT a submodule — flat copy)
gh repo clone mavilas/mini-site-boilerplate /tmp/boilerplate
rsync -a --exclude={'.git','node_modules','dist','pnpm-lock.yaml'} \
  /tmp/boilerplate/ subdomains/<slug>/

cd subdomains/<slug>
pnpm install

# 4. Same palette + wrangler.toml updates as Pattern A
```

---

## Step 2 · Cloudflare Pages project

You need a Pages project on Cloudflare side. Two ways depending on the pattern.

### Pattern A · Git-connected auto-deploy (recommended for Pattern A repos)

Dashboard → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git** → select `mavilas/<project-slug>`.

Build settings:
- **Project name:** `<project-slug>`
- **Production branch:** `main`
- **Framework preset:** `Astro`
- **Build command:** `pnpm install --frozen-lockfile=false && pnpm build`
- **Build output directory:** `dist`
- **Environment variables:** `NODE_VERSION=22`

First build runs immediately.

### Pattern B · Manual `wrangler pages deploy` (required for subdomain pattern)

For repos like `<parent>.com/subdomains/<slug>/` where Git auto-deploy can't pick a clean root.

```sh
cd ~/github/personal/<parent>/subdomains/<slug>

# Create the project once (CLI; or use the dashboard "Direct upload" option)
pnpm wrangler pages project create <project-slug> --production-branch main

# Verify project name on Cloudflare
pnpm wrangler pages project list
# Look for <project-slug> in the table. The "Project Domains" column should
# eventually show <project-slug>.pages.dev + your custom domain (added below).
```

---

## Step 3 · Attach the custom domain `<slug>.<parent>.com`

Pages project → **Custom domains** → **Set up a custom domain** → `<slug>.<parent>.com`.

Cloudflare *usually* auto-creates the CNAME. If it doesn't:

- DNS for `<parent>.com` → **Add record**:
  - Type: `CNAME`
  - Name: `<slug>`
  - Target: `<project-slug>.pages.dev`
  - Proxy status: **Proxied** (orange cloud)

Wait ~30 seconds for SSL. Visit `https://<slug>.<parent>.com` — still serving without auth at this point. Move to Step 4 immediately.

---

## Step 4 · Cloudflare Access policy

Zero Trust → **Access** → **Applications** → **Add an application** → **Self-hosted**.

| Field | Value |
|---|---|
| Application name | `<Project Name>` |
| Session duration | `14 days` (renews on activity) |
| Subdomain | `<slug>` |
| Domain | `<parent>.com` |
| Path | *blank — protect the whole site* |
| Identity providers | enable **One-time PIN** (magic-link email) |
| App Launcher | off |

**Policy: `<Project Name> readers`**

- **Action:** Allow
- **Include rules:**

| Rule type | Value | Why |
|---|---|---|
| Emails | `marco@anysigma.com` | You |
| Emails | `mgmafo@gmail.com` | You (personal) |
| Emails | `majin@anysigma.com` | You (alt) |
| Emails ending in | `@<client-domain>` *if applicable* | Whole client team |
| Emails | `specific.external@example.com` *if applicable* | Per-person external readers |

Save.

---

## Step 5 · The 5-test verification matrix

Use a **private/incognito window** for each test.

| # | Email | Expected |
|---|---|---|
| 1 | One of your allowlisted emails | ✅ Allowed |
| 2 | A `@<client-domain>` email (if you added that rule) | ✅ Allowed |
| 3 | An external email you didn't add | ❌ Denied |
| 4 | A random `@gmail.com` | ❌ Denied |
| 5 | Your email but with a typo (e.g. `marco@anysigna.com`) | ❌ Denied |

All five must behave as expected. If any test fails, fix before deploying real content.

Audit log: Zero Trust → **Logs** → **Access** — entries for both allows and denies.

---

## Step 6 · Deploy real content

### Pattern A · Git auto-deploy

```sh
# Push to main → Cloudflare auto-builds + deploys
git add . && git commit -m "ship initial content" && git push
```

### Pattern B · Manual wrangler

**⚠️ Always run from the subdomain directory. Always verify before deploy.**

```sh
cd ~/github/personal/<parent>/subdomains/<slug>

# pnpm run deploy already does build + safety check + wrangler deploy
# (the deploy:check script prints the dist <title> and cwd so you can
#  catch the wrong-directory bug before it hits production)

pnpm run deploy
# OR for full control:
# pnpm build
# pnpm run deploy:check
# pnpm wrangler pages deploy dist --project-name=<project-slug> --branch=main --commit-dirty=true
```

After deploy, verify:

```sh
# the production-aliased preview hash for this deployment
pnpm wrangler pages deployment list --project-name=<project-slug> | head -10

# Or just curl the custom domain through Access:
curl -sL --max-redirs 0 https://<slug>.<parent>.com/ | grep -oE "<title>[^<]*</title>"
```

If `curl` returns the Cloudflare Access login redirect, the deploy worked and Access is enforcing — that's the right state.

---

## Step 7 · Optional · Vote chips + admin dashboard

If your mini-site needs reader voting (a decision-tracking proposal, for example), the boilerplate already includes the `Decision` component. To wire it to a backend you can review:

1. Create a Cloudflare KV namespace:

   ```sh
   pnpm wrangler kv namespace create "<PROJECT_VOTES>"
   # Copy the returned `id` into wrangler.toml under [[kv_namespaces]]
   ```

2. Add to `wrangler.toml`:

   ```toml
   [[kv_namespaces]]
   binding = "<PROJECT>_VOTES"
   id = "<the-id-cloudflare-just-gave-you>"
   ```

3. Copy `functions/api/vote.ts` and `functions/admin/votes.ts` from the Zunou repo into your project:

   ```
   <slug>/functions/api/vote.ts        — POST/GET vote per Cloudflare-Access email
   <slug>/functions/admin/votes.ts     — admin-only HTML view (allowlist in source)
   ```

4. Edit the `ADMIN_EMAILS` allowlist in `functions/admin/votes.ts` to match the people who should see all votes (typically just you).

5. Redeploy. `<slug>.<parent>.com/admin/votes` is now your dashboard.

---

## Troubleshooting (the ones that have actually bitten us)

| Symptom | Cause | Fix |
|---|---|---|
| Live URL serves the parent's content (not yours) | Deployed from the wrong working directory — wrangler uploaded the parent's `dist/`, not the subdomain's | `cd subdomains/<slug>` first. `pnpm run deploy:check` confirms `<title>` + cwd before upload. |
| Merge from feat branch to main fails after a prior squash | Squash-merge changes commit hashes; subsequent rebases conflict | `git reset --soft origin/main`, recommit, force-push. PR auto-updates with a single clean commit. |
| Animation works in dev, broken in production | Tailwind v4 / Lightning CSS hoisted rules out of `@media (prefers-reduced-motion: reduce)` | Don't put project-specific overrides inside that media query. The global `*, *::before, *::after { animation-duration: 0.01ms !important; }` is enough. |
| Cloudflare Pages project list shows two projects you don't recognize | The CLI auto-created one when you ran `pnpm wrangler pages deploy` with a typo'd `--project-name` | Delete the stray project: `pnpm wrangler pages project delete <wrong-name>` |
| New deploy works but custom domain still serves old content | DNS / edge cache | Wait ~60s. Hard refresh (Cmd+Shift+R). If still stale: Pages project → Custom domains → temporarily disable + re-enable the custom domain. |

---

## Cost reality check

For typical mini-site scale (≤50 readers, ≤1k pageviews/mo):

- Cloudflare Pages — $0 (unlimited bandwidth, 500 builds/mo)
- Cloudflare Access — $0 (≤50 users; $3/user/mo beyond)
- KV (if using vote backend) — $0 (free tier covers 100k reads + 1k writes/day)
- DNS — $0

**Total: $0/mo** indefinitely. Past 50 readers per app you're paying Cloudflare Access seats but nothing else.
