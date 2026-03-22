# launchkit — Setup Guide

## Agency workflow (fast path)

The fastest way to build and deliver a client site:

```bash
# 1. Generate
node scripts/setup.js --name joeshvac --output ../ --business

# 2. Personalize from scraped JSON (Apify / Firecrawl output)
node scripts/personalize.js --project ../joeshvac --profile client.json

# 3. Deploy → live URL
node scripts/deploy.js --project ../joeshvac

# 4. Upsell — add more sections later
node scripts/sections.js --project ../joeshvac --add booking --variant calendly --yes
node scripts/sections.js --project ../joeshvac --add google-reviews --yes
```

---

## 1. Generate a project

```bash
node scripts/setup.js --name my-project --output ../
```

Select template type. The script copies base scaffold + template, installs preset sections, runs `npm install`, writes `.launchkit`.

**Portfolio preset:** webgl-hero, chatbot, contact-form, testimonials, work, sidebar

**Business preset:** contact-form, floating-cta, whatsapp

## 2. Personalize content

Replace `YOUR_*` placeholders with real client content. Two modes:

**Interactive** — prompts field by field:
```bash
node scripts/personalize.js --project ../my-project
```

**Profile mode** — batch inject from a JSON file (Apify / Firecrawl output):
```bash
node scripts/personalize.js --project ../my-project --profile client.json
```

Profile schema (business):
```json
{
  "BUSINESS": "Joe's HVAC",
  "PHONE": "+971-50-123-4567",
  "EMAIL": "joe@joeshvac.ae",
  "ADDRESS": "Dubai Marina, Dubai, UAE",
  "WHATSAPP_NUMBER": "971501234567",
  "DOMAIN": "joeshvac.ae"
}
```

Profile schema (portfolio): `NAME`, `EMAIL`, `GITHUB`, `LINKEDIN`, `DOMAIN`, `CITY`, `TIMEZONE`

Keys are normalized to uppercase — Apify envelope `{ "result": { ... } }` is unwrapped automatically. Partial profiles are fine; only matching keys are replaced. The script saves `client-profile.json` in the project root for re-runs (safe to run again after adding new sections).

**Niche starter profiles** are in `configs/niche-profiles/` (hvac, cleaning, landscaping). These include `_content_hints` with niche-appropriate service names and FAQ samples to guide dictionary content.

## 3. Environment variables

```bash
cd ../my-project
cp .env.example .env.local   # fill in values per comments
```

| Variable | Required for |
|---|---|
| `RESEND_API_KEY` | Contact form email delivery |
| `GOOGLE_CREDENTIALS` | Dialogflow chatbot |
| `DIALOGFLOW_PROJECT_ID` | Dialogflow chatbot |

## 4. Replace images

| Portfolio | Business |
|---|---|
| `public/hero.jpg` (1920×1080) | `public/hero.jpg` (1920×1080) |
| `public/profile.jpg` (square) | `public/about.jpg` (4:3) |
| `public/og-image.png` (1200×630) | `public/og-image.png` (1200×630) |
| `public/projects/[slug]/1-3.png` | |

## 5. Add upsell sections

```bash
node scripts/sections.js --project ../my-project   # interactive add/remove
```

| Section | Variant | Upsell service |
|---|---|---|
| `booking` | `calendly` | Appointment booking ($50–300/mo) |
| `google-reviews` | `default` | Review generation ($50–300/mo) |
| `chatbot` | `default` | AI chatbot / lead capture ($50–500/mo) |
| `floating-cta` | `default` | Mobile CTA bar (included in business preset) |
| `skills` | `grid` or `bars` | Skills / services display |

After adding sections, re-run personalize to replace any new `YOUR_*` tokens the section introduced:
```bash
node scripts/personalize.js --project ../my-project --profile client.json
```

## 6. Deploy

Prerequisites: install and authenticate one CLI —
- Vercel: `npm i -g vercel` then `vercel login`
- Netlify: `npm i -g netlify-cli` then `netlify login`

```bash
node scripts/deploy.js --project ../my-project           # auto-detect CLI
node scripts/deploy.js --project ../my-project --no-build  # skip build step
```

The live URL is printed and stored in `.launchkit` as `features.deployUrl`.

Manual deploy: `npm run build` then push to Vercel/Netlify dashboard — add env vars from `.env.local`.

## Managing projects

```bash
node scripts/config.js --project ../my-project       # palette, accent color
node scripts/sections.js --project ../my-project     # add/remove sections
node scripts/components.js --project ../my-project   # add/remove UI atoms
node scripts/validate.js --project ../my-project     # check placeholders + TODOs + images
node scripts/status.js --project ../my-project       # view installed sections + project state
node scripts/reset.js --project ../my-project        # strip to base scaffold
```

All scripts support `--help` and fall back to cwd if `--project` is omitted.

## External services

**Dialogflow (portfolio chatbot):** Create agent at console.dialogflow.com → service account with Dialogflow API Client role → set `GOOGLE_CREDENTIALS` + `DIALOGFLOW_PROJECT_ID` in `.env.local` → edit `dialogflow/generate.js` → `node dialogflow/generate.js` → `node dialogflow/zip.js` → import zip. Never edit `intents/` directly.

**Resend (contact form):** Sign up at resend.com → set `RESEND_API_KEY` → verify domain → update `TO_EMAIL` in `app/api/contact/route.ts`.

**Calendly (booking section):** Create a free account at calendly.com → copy your scheduling link → replace `YOUR_CALENDLY_URL` in `app/[locale]/components/Booking.tsx`.

**Google Reviews (review CTA section):** Google Maps → your business → "Get more reviews" → copy the review link → replace `YOUR_GOOGLE_REVIEW_URL` in `app/[locale]/components/GoogleReviews.tsx`.
