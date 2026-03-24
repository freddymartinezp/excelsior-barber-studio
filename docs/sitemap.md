# Flow2000 Sitemap

| Route | Page | Type |
|-------|------|------|
| `/` | Home | Server Component |
| `/about` | About / Story | Server Component |
| `/services` | Services & Pricing | Server Component |
| `/team` | Team Grid | Server Component |
| `/team/[barber-slug]` | Barber Profile | Server Component |
| `/book/[barber-slug]` | Booking Flow | Client Component |
| `/booking-success` | Confirmation | Server Component |
| `/contact` | Contact & Hours | Server Component |
| `/faq` | FAQ Accordion | Client Component |
| `/api/barbers/[slug]` | GET barber data | API Route |
| `/api/availability` | GET time slots | API Route |
| `/api/bookings` | POST new booking | API Route |

## NFC Card URLs
Each barber has a direct booking URL for NFC cards:
- `yourdomain.com/book/barber-1`
- `yourdomain.com/book/barber-2`
- etc.
