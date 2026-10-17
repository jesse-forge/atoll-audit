# LATER (not used at launch): paid Launch Check via Lemon Squeezy
*Status Oct 17, 2026: the launch is FREE. Nothing on the site links to a checkout. Keep this doc for when/if a paid tier is added.*

## Idea
A one-time paid "Launch Check" (e.g. $29, estimate) once the free version shows demand. The site's existing "Request a free full scan" form would turn into a "Buy" button.

## Why Lemon Squeezy
It acts as Merchant of Record (it handles sales tax/VAT), has no monthly fee, and takes a per-sale % (check current rates). ⚠️ Confirm payouts work for a US person living in FSM (e.g. payout to a US bank account) **before** relying on it. KYC/store approval can take days, so apply early.

## Steps (for Jesse, later)
1. Create the account at lemonsqueezy.com with 2FA. Complete identity verification and store activation. Set the payout method.
2. Create a product "Atoll Audit Launch Check" (single payment), price $29, with license keys turned off. Delivery: "We'll email your report within 2 business days".
3. Copy the variant's shareable checkout link (`https://<store>.lemonsqueezy.com/checkout/buy/<variant-id>`). Always share the `/checkout/buy/` link, never the single-use `?cart=` link.
4. Collecting the app URL and ownership confirmation: Lemon Squeezy's checkout pre-fill supports `checkout[email]`, and private data via `checkout[custom][field]=value`, which shows up in order webhooks as `meta.custom_data` (docs: help/checkout/prefilled-checkout-fields, help/checkout/passing-custom-data). So keep the site's own form (app URL, email, ownership checkbox), then redirect to:
   `LEMON_CHECKOUT_URL?checkout[email]=<email>&checkout[custom][app_url]=<url>&checkout[custom][owns_app]=yes&checkout[custom][consent_at]=<iso time>` (URL-encode each value).
5. Add one config value `LEMON_CHECKOUT_URL` to `config.js` and swap the form's submit handler to redirect there.
6. Fulfillment: download the order (or copy app_url/email from the order page) into a JSON file and run `python3 -m atoll_audit.fulfill order.json`. Same triple-check pipeline as the free scan.
7. Legal: update terms (refund policy, e.g. "refund if we can't scan your app") and the privacy notice (Lemon Squeezy as processor).

## Draft product description
> **Atoll Audit Launch Check: a security checkup for apps built with Lovable, Bolt or Cursor.**
> We scan your live app, read-only and with your permission, for the mistakes AI-built apps make most: leaked secret keys, Supabase tables anyone can read, public storage buckets, open Firebase data, weak login settings, exposed admin/debug pages, vulnerable libraries and missing security headers. Every finding is confirmed by two independent scans and a safety audit, then reviewed by a person. You get a graded, plain-English HTML report within 2 business days, with a copy-paste fix prompt for your AI tool for every issue.
> *Not a penetration test; no guarantee of security. You must own the app or have the owner's permission.*
