@AGENTS.md

# Excelsior Barber Studio — Project Rules

## Stack
- Next.js 16 + TypeScript + Tailwind CSS v4
- Prisma ORM + SQLite (dev) / PostgreSQL (prod)
- No external booking services — fully custom booking system

## Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run db:seed      # Seed barbers + services
npm run db:reset     # Reset + reseed database
npm run db:studio    # Prisma Studio GUI
```

## Routes
| URL | Page |
|-----|------|
| `/` | Homepage |
| `/about` | About |
| `/services` | Services & Pricing |
| `/team` | Team Grid |
| `/team/[barber-slug]` | Barber Profile |
| `/book/[barber-slug]` | Book with a Barber |
| `/booking-success` | Confirmation |
| `/contact` | Contact & Hours |
| `/faq` | FAQ |
| `/admin` | Admin Dashboard |
| `/admin/bookings` | Manage Bookings |
| `/admin/barbers` | Manage Barbers & Schedules |

## Customizing Content
- **Barbers/services:** Edit `prisma/seed.ts` → run `npm run db:reset`
- **About/FAQ copy:** Edit `src/data/content.ts`
- **Phone/address:** Search for placeholder values in codebase
- **Colors:** Edit CSS variables in `src/app/globals.css`

## Design Workflow (Screenshot Loop)
When building or refining pages:
1. Make the change
2. Screenshot with Puppeteer: `npx puppeteer screenshot <url> --fullpage`
3. Compare against reference image — note specific px-level differences
4. Fix every mismatch (spacing, colors, fonts, alignment)
5. Re-screenshot and compare again
6. Repeat until ≤2–3px difference

Always do **at least 2 comparison rounds**. Be specific about mismatches.

## Rules
- All booking logic lives in `src/lib/availability.ts` — do not duplicate
- Booking API at `src/app/api/bookings/route.ts` — always conflict-check before writing
- Prices stored as integers (cents): 3000 = $30
- Barber slugs must be URL-safe (e.g., `alem`, `carlos`, `mike`)
- NFC cards link to `/book/[barber-slug]`

## Email
`src/lib/email.ts` — logs to console in dev. Swap with Resend or Nodemailer for production.

## Production Database (PostgreSQL)
1. Update `.env`: `DATABASE_URL="postgresql://user:pass@host:5432/excelsior-barber-studio"`
2. Update `prisma/schema.prisma`: `provider = "postgresql"`
3. Run: `npx prisma migrate dev --name postgres`
4. Run: `npm run db:seed`
