# Flow2000 User Flows

## Booking Flow
1. Customer visits `/` → clicks "Book an Appointment" or "Meet the Team"
2. `/team` → browses barber cards, clicks "Book with [Name]"
3. `/book/[barber-slug]` Step 1 → selects service
4. Step 2 → picks a date from the next 14 days
5. Step 3 → picks an available time slot
6. Step 4 → enters name, phone, email
7. Step 5 → reviews and confirms
8. POST `/api/bookings` → booking saved, email logged
9. Redirect to `/booking-success` → shows confirmation details

## Barber Profile Flow
1. `/team` → clicks "View Profile"
2. `/team/[barber-slug]` → sees full bio, specialties, services
3. Clicks "Book with [Name]" → enters booking flow

## NFC Card Flow
1. Customer taps NFC card
2. Opens `/book/[barber-slug]` directly
3. Completes booking flow from Step 1

## Slot Generation Logic
- Load barber's AvailabilityRule for the selected day of week
- Generate slots: start_time to (end_time - duration), stepping by duration
- Load existing confirmed bookings for that barber on that date
- Remove any slot that overlaps: bookingStart < slotEnd AND bookingEnd > slotStart
- Return available slots array
