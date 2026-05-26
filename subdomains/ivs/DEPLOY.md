# Deploy `ivs.anysigma.com`

The IVS 2026 networking-activation pitch. Cloudflare Pages + Cloudflare Access (email allowlist, magic link, 14-day session). Same pattern as `zunou.anysigma.com`.

## Cloudflare Pages project

- Project name: `ivs-anysigma`
- Repo: `mavilas/anysigma.com`
- Production branch: `main`
- Build command: `cd subdomains/ivs && pnpm install --frozen-lockfile=false && pnpm build`
- Build output: `subdomains/ivs/dist`
- Custom domain: `ivs.anysigma.com`
- Env: `NODE_VERSION=22`

## Cloudflare Access policy

Application: `ivs.anysigma.com` · Type: Self-hosted · Session: 14 days · Identity: One-time PIN (email magic link).

Allowlist v1 (Marco + the team):

- `marco@finno.jp`
- Zunou team emails (Malek, etc.)
- IVS team emails as we receive them (add per-email; never wildcard `*@ivs.events` until we explicitly want to)

Add new emails via dashboard, Access, Applications, ivs.anysigma.com, Policy, Add include rule.

## What gets published vs what stays private

Only `subdomains/ivs/dist/` is served at `ivs.anysigma.com`. Strategy markdown, screenshots, and internal notes stay in the repo only. Two-tier privacy:

| Surface | Audience | Gate |
|---|---|---|
| `ivs.anysigma.com` | Allowlisted emails | Cloudflare Access |
| `github.com/mavilas/anysigma.com` (subdomains/ivs/) | Repo collaborators | GitHub repo invite |
| Public internet | Nobody | none |

## Local development

```bash
cd subdomains/ivs
pnpm install
pnpm dev
```

No auth wall locally. Cloudflare Access only enforces in production.
