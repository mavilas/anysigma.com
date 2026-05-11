# Deploy `zunou.anysigma.com` — security test runbook

> **Goal:** stand up `zunou.anysigma.com` behind Cloudflare Access (magic-link email, 14-day rolling session), verify the auth wall works, then later swap the placeholder for real content.

**Prereqs (confirmed):**
- `anysigma.com` is on Cloudflare DNS — ✓
- You have admin rights to the Cloudflare account — ✓

---

## What gets published vs what stays private

Only `subdomains/zunou/dist/` (the Astro build output) gets served at `zunou.anysigma.com`. The strategy markdown in `mavilas/zunou` is **never** in the deploy output — it stays in the private GitHub research repo. Two-tier privacy:

| Surface | Audience | Gate |
|---|---|---|
| `zunou.anysigma.com` | Allowlisted emails | Cloudflare Access (14-day session) |
| `github.com/mavilas/zunou` | Repo collaborators | GitHub repo invite |
| Public internet | Nobody | — |

---

## Phase 1 — Cloudflare Pages deploy (15 min)

### 1.1 Create the Pages project

Cloudflare dashboard → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git** → select `mavilas/anysigma.com`.

Build settings:
- **Project name:** `zunou-anysigma`
- **Production branch:** `main`
- **Framework preset:** `Astro`
- **Build command:** `cd subdomains/zunou && pnpm install --frozen-lockfile=false && pnpm build`
- **Build output directory:** `subdomains/zunou/dist`
- **Root directory:** *(leave blank)*
- **Environment variables:** `NODE_VERSION=22`

Click **Save and Deploy**. First build ~2 min.

### 1.2 Verify the deploy is reachable

Visit `https://zunou-anysigma.pages.dev` (or whatever subdomain Cloudflare assigned). You should see the "You're in" placeholder — at this point still **unprotected**; Access comes next.

### 1.3 Add custom domain `zunou.anysigma.com`

Pages project → **Custom domains** → **Set up a custom domain** → `zunou.anysigma.com`. Cloudflare auto-creates the CNAME (DNS is already on Cloudflare). Wait ~30s for SSL.

Visit `https://zunou.anysigma.com` — still serving without auth at this stage. Continue to Phase 2 immediately.

---

## Phase 2 — Cloudflare Access (Zero Trust) — 20 min

### 2.1 Enable Zero Trust (one-time, if not already)

Cloudflare dashboard → **Zero Trust** → set team name to **`anysigma`** (becomes the login UI slug, `anysigma.cloudflareaccess.com`). Plan: **Free** (≤50 users).

### 2.2 Add the magic-link email identity provider

Zero Trust → **Settings** → **Authentication** → **Add new** → **One-time PIN** → name it `Email magic-link` → save.

(Cloudflare calls it "One-time PIN" but it's the same UX as a magic-link — viewer enters email, gets one-time code by email, pastes it, in.)

### 2.3 Create the Access application

Zero Trust → **Access** → **Applications** → **Add an application** → **Self-hosted**.

- **Application name:** `Zunou Strategy`
- **Session Duration:** **`14 days`** *(renews on activity)*
- **Subdomain:** `zunou`
- **Domain:** `anysigma.com`
- **Path:** *(leave blank — protect the whole site)*
- **Identity providers:** enable **One-time PIN**
- **App Launcher:** off for now

Click **Next** to policies.

### 2.4 Create the access policy

Policy 1: **`Zunou team`**

- **Action:** Allow
- **Session duration:** 14 days (inherits from app)
- **Include rules — for the security test, configure BOTH:**

  | Rule type | Value | Purpose |
  |---|---|---|
  | Emails | `mgmafo@gmail.com` | Personal test — explicit allowlist |
  | Emails ending in | `@anysigma.com` | Domain rule — covers `majin@anysigma.com` etc. |
  | Emails ending in | `@zunou.ai` | Domain rule — Zunou team (production allowlist) |

Save.

### 2.5 The test matrix — verify isolation works

Use a **private/incognito window** to start fresh each time.

| Test | Email | Expected result |
|---|---|---|
| 1 — Personal explicit allowlist | `mgmafo@gmail.com` | ✅ Allowed (magic-link sent, login succeeds) |
| 2 — Anysigma domain rule | `majin@anysigma.com` | ✅ Allowed (via domain rule) |
| 3 — Zunou domain rule | any `@zunou.ai` email Malek/advisors have | ✅ Allowed (via domain rule) |
| 4 — Random email | any non-allowlisted `@gmail.com` (different from mgmafo) | ❌ Denied (Cloudflare deny page) |
| 5 — Random other domain | any `@randomcompany.com` | ❌ Denied |

**All five must behave as expected** for the security wall to be considered verified.

Bonus: in Zero Trust → **Logs** → **Access**, you should see entries for both the allows and the denies — confirms audit logging works.

### 2.6 Brand the login page (optional, 5 min)

Zero Trust → **Settings** → **Custom Pages** → **Login Page** — upload Anysigma logo + colors. Visitors see Anysigma branding instead of the Cloudflare default.

---

## Phase 3 — Sign-off and next steps

Once all 5 tests in 2.5 pass:

- ✅ Security infrastructure is confirmed
- ➡️ Swap the placeholder `subdomains/zunou/src/pages/index.astro` for the real Zunou strategy mini-site (single-page Astro built from the research in `mavilas/zunou`)
- ➡️ Tighten the Access policy for production: remove `mgmafo@gmail.com` (it was for the test), keep the `@zunou.ai` + `@anysigma.com` domain rules + add specific advisor emails

---

## Operational ops (after launch)

- **Add a person:** Zero Trust → Access → Applications → `Zunou Strategy` → policy → add email to include rules.
- **Remove a person:** same path, remove the email. Active sessions: Access → Sessions → revoke.
- **Audit log:** Zero Trust → Logs → Access — full trail.
- **Break-glass:** Access → Sessions → revoke all for the app — forces everyone to re-auth.

---

## Cost reality check

- Cloudflare Pages — $0 (unlimited bandwidth, 500 builds/month)
- Cloudflare Access — $0 (≤50 users; $3/user/month beyond)
- DNS, Workers, etc. — $0 within free tiers
- **Total monthly: $0** for the foreseeable future

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `404` on `zunou.anysigma.com` | DNS still propagating | Wait 1–2 min; check Pages → Custom domains status |
| Build fails on Cloudflare | `pnpm` not detected | Ensure `NODE_VERSION=22` env var is set; pnpm comes via corepack |
| `502` after login | Build output dir wrong | Confirm `subdomains/zunou/dist` |
| Login loops back to login | Cookie blocked / wrong IdP | Try a different IdP, check browser cookies |
| Session not lasting 14 days | App or policy duration mismatch | Both app + policy should say `14 days`; the shorter of the two wins |
| Allowed email blocked | Domain rule typo | Re-check the rule — domain rule uses `@example.com` syntax (the @ matters) |
