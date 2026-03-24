# Flow2000 Data Model

## Models

### Barber
| Field | Type | Notes |
|-------|------|-------|
| id | Int (PK) | Auto-increment |
| name | String | "Barber 1" etc. |
| slug | String (unique) | URL-safe, e.g. "barber-1" |
| bio | String | Short paragraph |
| specialties | String | Comma-separated list |
| photo | String? | URL to photo |
| isActive | Boolean | Default true |

### Service
| Field | Type | Notes |
|-------|------|-------|
| id | Int (PK) | Auto-increment |
| name | String | e.g. "Skin Fade" |
| slug | String (unique) | URL-safe |
| description | String | One-liner |
| price | Int | In cents (e.g. 3000 = $30) |
| durationMinutes | Int | Used for slot generation |

### Booking
| Field | Type | Notes |
|-------|------|-------|
| id | Int (PK) | Auto-increment |
| barberId | Int (FK) | References Barber |
| serviceId | Int (FK) | References Service |
| customerId | Int (FK) | References Customer |
| date | DateTime | Date of appointment |
| startTime | String | "10:00" |
| endTime | String | "10:30" |
| status | String | "confirmed" or "cancelled" |
| createdAt | DateTime | Auto |

### AvailabilityRule
| Field | Type | Notes |
|-------|------|-------|
| barberId | Int (FK) | References Barber |
| dayOfWeek | Int | 0=Sun, 6=Sat |
| startTime | String | "09:00" |
| endTime | String | "19:00" |

## Migration to PostgreSQL
1. Update `DATABASE_URL` in `.env` to a PostgreSQL connection string
2. Update `prisma/schema.prisma` datasource provider to `"postgresql"`
3. Run `npx prisma migrate dev --name postgres-migration`
4. Run seed again
