# Deploying the Atoll Audit site (GitHub Pages, free)
Everything in this folder is plain static files with relative links. There's no build step, and `.nojekyll` is included so GitHub serves files as-is.

## Before publishing (edit `config.js` only)
- `GOATCOUNTER_CODE`: your GoatCounter code (see ANALYTICS.md), or leave it as is for no analytics.
- `SCAN_REQUEST_URL`: a form endpoint that accepts POSTed form fields (e.g. a Formspree/Basin/Web3Forms form URL; check current free tiers), **or** `mailto:you@yourdomain`. If left as is, the form falls back to `mailto:CONTACT_EMAIL`, or to a "coming soon" message if that's unset too.
- `CONTACT_EMAIL`: the address for the mailto fallback.
- Fill the `[bracketed]` items in `privacy.html` and `terms.html` and remove the DRAFT banners once reviewed.

## Publish
1. Create a GitHub repo (e.g. `atoll-audit-site`) and push the **contents** of this folder to the repo root on `main`.
2. Repo → Settings → Pages → Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
3. The site appears at `https://<user>.github.io/atoll-audit-site/` within a minute or two. All links are relative, so the sub-path works.
4. Optional: add a custom domain later (Settings → Pages → Custom domain, plus a CNAME DNS record) and tick "Enforce HTTPS".

Note: GitHub Pages can't set HTTP headers, so the checker's Content-Security-Policy is a `<meta>` tag (that's enough to block uploads). The docs files (`*.md`) will also be publicly readable on Pages. They contain nothing secret, but move them out of the published folder if you prefer.
