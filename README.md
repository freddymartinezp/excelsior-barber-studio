# Alem Barber

Premium barbershop website + custom booking system built with Next.js 16, TypeScript, Tailwind CSS v4, and Prisma + SQLite.

## Quick Start

```bash
# Install dependencies
npm install

# Set up the database (creates dev.db, runs migrations, seeds barbers + services)
npx prisma migrate dev --name init

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run db:seed` | Re-seed the database |
| `npm run db:reset` | Reset + re-seed the database |
| `npm run db:studio` | Open Prisma Studio (GUI) |

## Routes

| URL | Page |
|-----|------|
| `/` | Home |
| `/about` | About |
| `/services` | Services & Pricing |
| `/team` | Team Grid |
| `/team/[barber-slug]` | Barber Profile |
| `/book/[barber-slug]` | Book with a Barber |
| `/booking-success` | Booking Confirmation |
| `/contact` | Contact & Hours |
| `/faq` | FAQ |
| `/admin` | Admin Dashboard |
| `/admin/bookings` | Manage Bookings |
| `/admin/barbers` | Manage Barbers & Schedules |

## Customizing Content

- **Barber names/bios:** Update `prisma/seed.ts`, then run `npm run db:reset`
- **Barber photos:** Add images to `public/images/team/`, update photo URLs in seed
- **Services:** Edit the `services` array in `prisma/seed.ts`
- **FAQ / About copy:** Edit `src/data/content.ts`
- **Phone / Address:** Search for placeholder values in the codebase

## Connecting Real Email

Edit `src/lib/email.ts` — the `sendConfirmationEmail` function logs to console in dev.
Swap the body with `resend.emails.send()` or `nodemailer.sendMail()` — same signature.

## Production Database (PostgreSQL)

1. Update `.env`: `DATABASE_URL="postgresql://user:pass@host:5432/alem-barber"`
2. Update `prisma/schema.prisma`: `provider = "postgresql"`
3. Run: `npx prisma migrate dev --name postgres`
4. Run: `npm run db:seed`

## NFC Card Booking Links

Each barber has a direct booking URL, ideal for NFC cards:
- `yourdomain.com/book/alem`
- `yourdomain.com/book/carlos`
- etc.
