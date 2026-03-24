import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const barber = await prisma.barber.findUnique({ where: { slug } });
  if (!barber) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const now = new Date();
  const in30Days = new Date(now);
  in30Days.setDate(in30Days.getDate() + 30);

  const [bookings, blocked] = await Promise.all([
    prisma.booking.findMany({
      where: {
        barberId: barber.id,
        status: "confirmed",
        date: { gte: now },
      },
      include: {
        service: { select: { name: true, durationMinutes: true, price: true } },
        customer: { select: { fullName: true, phone: true } },
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    }),
    prisma.blockedSlot.findMany({
      where: {
        barberId: barber.id,
        date: { gte: now },
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    }),
  ]);

  return NextResponse.json({
    barber: { id: barber.id, name: barber.name, slug: barber.slug, photo: barber.photo },
    bookings,
    blocked,
  });
}
