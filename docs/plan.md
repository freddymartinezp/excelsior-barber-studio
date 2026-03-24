# Flow2000 Barbershop — Project Plan

## Project Summary
A premium marketing website + custom booking web app for Flow2000 Barbershop. Built with Next.js 16, TypeScript, Tailwind CSS v4, and Prisma + SQLite.

## Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **ORM:** Prisma v5 + SQLite (migrate to PostgreSQL for production)
- **Email:** Console log (MVP) → swap for Resend/Nodemailer

## Design System
- Background: `#0A0A0A`, Surface: `#111111`
- Gold accent: `#C9A84C`
- Fonts: Outfit (headings) + Geist (body)
- Soft-Skill: generous whitespace, double-bezel cards, mobile-first

## MVP Scope
- Public website (Home, About, Services, Team, Contact, FAQ)
- Individual barber profile pages
- Custom booking system (per-barber, per-service, date+time selection)
- Booking success confirmation
- No: admin dashboard, payments, SMS, loyalty, CRM

## Production Checklist
- [ ] Replace placeholder phone/address with real info
- [ ] Upload real barber photos to `/public/images/team/`
- [ ] Update barber names and bios
- [ ] Switch DATABASE_URL to PostgreSQL
- [ ] Connect Resend or Nodemailer in `src/lib/email.ts`
- [ ] Configure real Google Maps embed on Contact page
- [ ] Set up domain + deploy to Vercel
