# Atoll Audit analytics (GoatCounter): setup and privacy notes
*Draft Oct 17, 2026. Not legal advice. Facts about GoatCounter were checked on goatcounter.com on this date; re-check before relying on them.*

## What's already built
- `config.js` has **one** analytics setting: `GOATCOUNTER_CODE`. While it is still the placeholder, **no analytics script loads at all**.
- `analytics.js` (used by every page) loads GoatCounter's `count.js` only when the code is set **and** the browser does **not** send Do Not Track (`navigator.doNotTrack`) or Global Privacy Control (`navigator.globalPrivacyControl`). With DNT/GPC on, nothing is loaded and no events are sent.
- Page views are sent with the bare path only (`location.pathname`): no `?query` or `#hash`, so nothing a visitor typed can end up in analytics through the URL.
- Custom events must match a fixed allow-list (regex in `analytics.js`). Anything else is dropped.
- The checker page has a Content-Security-Policy that only allows network connections to `*.goatcounter.com`. The browser itself blocks any attempt to upload pasted code.

## Setup (about 5 minutes, free)
1. Go to https://www.goatcounter.com and click **Sign up**. Choose a site code such as `atollaudit`, which gives you a dashboard at `https://atollaudit.goatcounter.com`. Use an email you control and a strong password.
2. In `config.js`, set `GOATCOUNTER_CODE: "atollaudit"` (only the code, not the full URL). Commit and push.
3. Open the live site with DNT/GPC **off** (e.g. a normal Chrome profile) and load a page. The visit should appear on the dashboard within a minute. GoatCounter ignores `localhost` by default, so test on the deployed site.
4. Optional: in GoatCounter **Settings**, add your own browser to the ignore list (Settings → "Ignore IPs" or the "don't count my visits" option) so your testing isn't counted.
5. Optional, for the summary script: create an API key (username menu → **API**, read/"export" permission only) and keep it in an environment variable, never in the repo. Note: one third-party review claims the API needs a paid plan on goatcounter.com; the official docs don't say so. If it's blocked, export the CSV from the dashboard (Settings → Export) instead and pass the file to the script.

**Cost:** goatcounter.com says it is "free for reasonable public usage. Running your personal website or small-to-medium business on it is fine" (donations welcome via GitHub Sponsors). A tiny launch site is well within that.

## Where to look
- Dashboard: `https://<GOATCOUNTER_CODE>.goatcounter.com`. Page views, referrers, browsers, sizes and countries are built in.
- Events appear in the same list as pages (flagged as events), with the event name as the "path".
- Summary script: `python3 /workspace/atoll-audit/scripts/goatcounter_summary.py --csv export.csv` or `GOATCOUNTER_TOKEN=... python3 .../goatcounter_summary.py --site atollaudit`. It writes `goatcounter-summary.md`.

## Event dictionary
| Event | Sent when | Contains |
|---|---|---|
| (page view) | Any page loads | Path only (`/`, `/checker/`), referrer, and GoatCounter's derived browser/OS/screen/country |
| `check_run` | Visitor clicks "Check for leaked keys" | Nothing else |
| `finding_<type>` | Once per finding **type** in that check | Only the type, e.g. `finding_supabase_service_role`, `finding_stripe_secret_key`, `finding_openai_key`, `finding_anthropic_key`, `finding_resend_key`, `finding_twilio_key`, `finding_sendgrid_key`, `finding_aws_access_key`, `finding_github_token`, `finding_slack_token`, `finding_private_key`, `finding_google_api_key`, `finding_public_env_secret`, `finding_supabase_secret_key`, and the info-level `finding_supabase_anon_key` / `finding_supabase_publishable_key` |
| `platform_<name>` | With every check (dropdown choice, or auto-detected from code fingerprints) and with every scan request (dropdown) | One of `lovable`, `bolt`, `cursor`, `replit`, `v0`, `other`, `unknown` |
| `scan_request` | A "Request a free full scan" submission succeeds (or the mailto draft opens) | Nothing else |

Useful ratios: `check_run / checker page views` (does the page convert?), `finding_* / check_run` (how often real leaks are found, which makes good launch copy), `scan_request / home page views`, and platform mix (which builder community to target first).

Cursor apps have no reliable fingerprint in the bundle, so `platform_cursor` only appears when the visitor picks it. Auto-detected `unknown` mostly means Cursor/hand-coded/Next.js.

## Privacy and legal notes (not legal advice)
- **No PII rule:** never add events containing pasted code, keys (even masked), app URLs, emails, or free text. The allow-list regex enforces this, so keep it strict if you add events.
- **Cookies:** GoatCounter doesn't set cookies, and its docs argue that a GDPR consent banner is "probably" not required (no personal data stored, legitimate interest). The EU ePrivacy rules are about storing or reading data on the device; cookieless counting is usually treated as low-risk, but interpretations vary by country. We go further by honoring DNT/GPC. The privacy page lists exactly what's counted.
- **GDPR (EU/UK):** analytics rely on legitimate interest. Scan requests (URL + optional email) rely on the visitor's request. Visitors have the rights to access and erasure. GoatCounter itself says it cannot identify individual visitors, so access/deletion requests about analytics usually have nothing to return.
- **CCPA/CPRA (California):** no data is sold or shared for cross-context advertising. Honoring GPC is a good-faith signal (GPC is the opt-out signal recognized under CPRA regulations).
- **Opt-in email handling:** emails from scan requests go only to the form service/inbox you configure (`SCAN_REQUEST_URL`). Use them only to deliver the report. Don't add anyone to a newsletter unless they separately opt in (CAN-SPAM/GDPR). Keep a simple log of requests and delete them after the retention period stated in `privacy.html` ([90 days] placeholder).
- **Deletion requests:** when someone emails asking for deletion: delete the form-service submission, the email thread, `orders/<id>/` on your machine, and any report copies, then reply to confirm. Aim for 30 days or sooner.
- **Form service:** if you use one (e.g. Formspree, Basin, Web3Forms; check current free tiers), list it by name in `privacy.html`, because it processes the submissions.
- Before publishing, fill in the `[bracketed]` placeholders in `privacy.html`/`terms.html` and consider a cheap lawyer review once there's traction.
