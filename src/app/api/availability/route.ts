import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSlots, isSlotAvailable } from "@/lib/availability";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const barberId = parseInt(searchParams.get("barberId") ?? "0");
  const date = searchParams.get("date"); // YYYY-MM-DD
  const serviceId = parseInt(searchParams.get("serviceId") ?? "0");

  if (!barberId || !date || !serviceId) {
    return NextResponse.json({ error: "Missing required params" }, { status: 400 });
  }

  const dateObj = new Date(date + "T00:00:00");
  const dayOfWeek = dateObj.getDay();

  // Get availability rule for this barber on this day
  const rule = await prisma.availabilityRule.findFirst({
    where: { barberId, dayOfWeek },
  });

  if (!rule) {
    return NextResponse.json({ slots: [] });
  }

  // Get service duration
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  // Get existing bookings for this barber on this date
  const dayStart = new Date(date + "T00:00:00.000Z");
  const dayEnd = new Date(date + "T23:59:59.999Z");

  const [existingBookings, blockedSlots] = await Promise.all([
    prisma.booking.findMany({
      where: {
        barberId,
        status: "confirmed",
        date: { gte: dayStart, lte: dayEnd },
      },
      select: { startTime: true, endTime: true },
    }),
    prisma.blockedSlot.findMany({
      where: { barberId, date: { gte: dayStart, lte: dayEnd } },
      select: { startTime: true, endTime: true },
    }),
  ]);

  const takenSlots = [...existingBookings, ...blockedSlots];

  // Generate all possible slots
  const allSlots = generateSlots(rule.startTime, rule.endTime, service.durationMinutes);

  // Filter out unavailable slots
  const availableSlots = allSlots.filter((slot) =>
    isSlotAvailable(slot, service.durationMinutes, takenSlots)
  );

  return NextResponse.json({ slots: availableSlots });
}
