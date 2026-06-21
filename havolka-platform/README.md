# HAVOLKA Platform

Premium architectural door hardware platform — custom-coded, fully sovereign.

## Stack
- **Frontend:** Next.js 14 (App Router)
- **Database:** PostgreSQL via Prisma
- **Auth:** JWT
- **Payments:** Stripe
- **Email:** Nodemailer
- **AI:** Claude API (Anthropic)
- **PDF:** Puppeteer
- **Storage:** DigitalOcean Spaces

---

## Quick Deploy to Vercel (Ben — for testing)

1. Push this folder to your `havolka_platform` GitHub repo
2. Go to [vercel.com](https://vercel.com) → Import Project → Select `havolka_platform`
3. Add environment variables (see `.env.example`)
4. For Vercel testing, use a free PostgreSQL database from [neon.tech](https://neon.tech) — connect in 2 minutes
5. Click Deploy

That's it. Live URL in ~3 minutes.

**Environment variables needed for basic Vercel deploy:**
- `DATABASE_URL` — get from Neon.tech (free)
- `JWT_SECRET` — any random 32+ character string
- `ANTHROPIC_API_KEY` — from console.anthropic.com
- `NEXT_PUBLIC_SITE_URL` — your Vercel URL

Stripe and email can be added later — the site will work without them for testing.

---

## Production Deploy (Jack — DigitalOcean)

### Prerequisites
- DigitalOcean Droplet (Ubuntu 22.04, 2GB+ RAM recommended)
- Domain DNS pointed to droplet IP
- Docker and Docker Compose installed

### Steps

```bash
# 1. Clone the repo on your droplet
git clone https://github.com/yourusername/havolka_platform.git
cd havolka_platform

# 2. Copy and fill in environment variables
cp .env.example .env
nano .env

# 3. Build and run with Docker
docker-compose up -d --build

# 4. Run database migrations
docker-compose exec app npx prisma db push

# 5. Set up SSL with Certbot
certbot --nginx -d havolka.com -d www.havolka.com
```

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      - db
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: havolka
      POSTGRES_USER: havolka
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── products/             # Products index + product pages
│   ├── finishes/             # Finishes library
│   ├── for-trade/            # Membership page
│   ├── about/                # Brand page
│   ├── resources/            # Resources + downloads
│   ├── contact/              # Contact
│   ├── portal/               # Member portal (auth required)
│   ├── hub/                  # BDG Hub (team auth required)
│   └── api/                  # API routes
│       ├── apply/            # Membership application
│       ├── auth/             # Login/logout
│       ├── products/         # Products API
│       ├── samples/          # Sample requests
│       ├── quote-builder/    # AI quote builder
│       ├── quotes/           # Quote management
│       ├── orders/           # Order management
│       └── hub/              # BDG Hub APIs
├── components/
│   ├── layout/               # Nav, Footer
│   ├── ui/                   # Buttons, modals, overlays
│   ├── portal/               # Portal components
│   └── hub/                  # BDG Hub components
├── lib/
│   ├── prisma.ts             # Database client
│   ├── auth.ts               # JWT utilities
│   └── email.ts              # Email templates
├── styles/
│   └── globals.css           # Design system tokens
└── types/
    └── index.ts              # TypeScript types
```

---

## Key Features

### Public Site
- Homepage with product categories, finish library, door schedule offer
- Products index with category + finish filters
- Individual product pages with spec sheets, downloads, BIM files
- Finishes library with per-finish product views
- For Trade / Membership page with application overlay
- About, Resources, Contact pages

### Member Portal
- Dashboard with activity feed, quick stats
- Projects, Quotes, Orders, Reorder, Returns
- Notifications + Notes (shared with BDG Hub)
- Finish Samples tracker
- Member Perks (merch drops, birthday gifts)
- Documents library (invoices, schedules, spec sheets)
- Ask us anything (direct message to account manager)
- Request Callback (break glass)
- Light/dark mode toggle

### BDG Hub (Internal)
- Multi-brand (HAVOLKA / Ookami Studio)
- CRM with pipeline (Applications → Active → At risk)
- Orders + Quotes management
- Door Schedules workspace (Rafe)
- Merch dispatch queue (Kez)
- Supplier + Purchasing (POs, PIs, incoming stock)
- Products + SKU management
- Designs + Future product pipeline
- Marketing + Lead analytics
- Settings (pricing tiers, team, automations)

### AI Features
- AI Specification Assistant (Quick Quote + Full Door Schedule)
- Claude API powered (claude-sonnet-4-6)
- Lead auto-capture on schedule completion
- Commercial projects redirected to Rafe

---

## Team Access

| Person | Portal Access | Notes |
|--------|--------------|-------|
| Ben | BDG Hub admin | Full access |
| Kez | BDG Hub admin | Full access |
| Rafe | BDG Hub limited | Schedules + Products |
| Ryan | BDG Hub finance | Read-only orders/invoices |
| Members | Member Portal | Based on approval status |

---

## Adding Products

1. Log in to BDG Hub at `/hub`
2. Go to Products + SKUs
3. Add product with all SKUs, pricing, and images
4. Products appear immediately on public site

---

*Built by Bechelet Design Group. For technical support contact Jack.*
