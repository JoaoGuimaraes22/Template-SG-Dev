# launchkit

Next.js 16 project generator — creates standalone client sites from templates with configurable features.

## Templates

- **Portfolio** — WebGL hero, sidebar, chatbot, project gallery, testimonials, contact form
- **Business Site** — hero, services, reviews, FAQ, contact, footer, FloatingCTA
- **Blank** — minimal scaffold, clean starting point

## Quick Start

```bash
git clone <repo-url> launchkit && cd launchkit
node scripts/setup.js --name my-site --output ../
# or skip type prompt:
node scripts/setup.js --name my-site --output ../ --business
```

Then personalize with real client content, deploy, and send the live link:

```bash
node scripts/personalize.js --project ../my-site --profile client.json
node scripts/deploy.js --project ../my-site
```

## Scripts

All scripts support `--help`. Run from the launchkit directory.

```bash
# Project creation
node scripts/setup.js --name <name> --output <dir> [--portfolio|--business|--blank]

# Content & personalization
node scripts/personalize.js --project <path>                   # replace YOUR_* interactively
node scripts/personalize.js --project <path> --profile <json>  # batch inject from JSON profile

# Sections & components
node scripts/sections.js --project <path>    # add/remove page sections
node scripts/components.js --project <path>  # add/remove UI atoms (Button, Card, etc.)

# Configuration
node scripts/config.js --project <path>      # palette, accent color, i18n status

# Deployment
node scripts/deploy.js --project <path>                        # auto-detect Vercel/Netlify
node scripts/deploy.js --project <path> --platform vercel      # force platform

# Project health
node scripts/validate.js --project <path>    # check placeholders + TODOs + images
node scripts/status.js --project <path>      # view installed sections + project state
node scripts/reset.js --project <path>       # strip back to base scaffold
```

See [SETUP.md](SETUP.md) for the full agency workflow and [CLAUDE.md](CLAUDE.md) for architecture reference.
