import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isSlotAvailable, timeToMinutes, minutesToTime } from "@/lib/availability";
import { sendConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { barberId, serviceId, date, startTime, customerName, phone, email } = body;

    if (!barberId || !serviceId || !date || !startTime || !customerName || !phone || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate service exists and get duration
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Validate barber exists
    const barber = await prisma.barber.findUnique({ where: { id: barberId } });
    if (!barber) {
      return NextResponse.json({ error: "Barber not found" }, { status: 404 });
    }

    // Calculate end time
    const startMin = timeToMinutes(startTime);
    const endTime = minutesToTime(startMin + service.durationMinutes);

    // Check for conflicts
    const dateObj = new Date(date + "T00:00:00");
    const dayStart = new Date(date + "T00:00:00.000Z");
    const dayEnd = new Date(date + "T23:59:59.999Z");

    const [existingBookings, blockedSlots] = await Promise.all([
      prisma.booking.findMany({
        where: { barberId, status: "confirmed", date: { gte: dayStart, lte: dayEnd } },
        select: { startTime: true, endTime: true },
      }),
      prisma.blockedSlot.findMany({
        where: { barberId, date: { gte: dayStart, lte: dayEnd } },
        select: { startTime: true, endTime: true },
      }),
    ]);

    if (!isSlotAvailable(startTime, service.durationMinutes, [...existingBookings, ...blockedSlots])) {
      return NextResponse.json({ error: "This time slot is no longer available" }, { status: 409 });
    }

    // Upsert customer
    let customer = await prisma.customer.findFirst({ where: { email } });
    if (!customer) {
      customer = await prisma.customer.create({
        data: { fullName: customerName, phone, email },
      });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        barberId,
        serviceId,
        customerId: customer.id,
        date: dateObj,
        startTime,
        endTime,
        status: "confirmed",
      },
    });

    // Send confirmation email (console log for MVP)
    await sendConfirmationEmail({
      customerName,
      customerEmail: email,
      barberName: barber.name,
      barberSlug: barber.slug,
      serviceName: service.name,
      date,
      time: startTime,
      bookingId: booking.id,
    });

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      barber: barber.name,
      service: service.name,
      date,
      time: startTime,
    });
  } catch (err) {
    console.error("[POST /api/bookings]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
