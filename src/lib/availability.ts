export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function generateSlots(
  startTime: string,
  endTime: string,
  durationMinutes: number
): string[] {
  const slots: string[] = [];
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  for (let t = start; t + durationMinutes <= end; t += durationMinutes) {
    slots.push(minutesToTime(t));
  }
  return slots;
}

export function isSlotAvailable(
  slotStart: string,
  durationMinutes: number,
  bookings: { startTime: string; endTime: string }[]
): boolean {
  const slotStartMin = timeToMinutes(slotStart);
  const slotEndMin = slotStartMin + durationMinutes;

  for (const booking of bookings) {
    const bookingStart = timeToMinutes(booking.startTime);
    const bookingEnd = timeToMinutes(booking.endTime);
    // Overlap: bookingStart < slotEnd AND bookingEnd > slotStart
    if (bookingStart < slotEndMin && bookingEnd > slotStartMin) {
      return false;
    }
  }
  return true;
}
