import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { timeToMinutes, minutesToTime } from "@/lib/availability";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const barber = await prisma.barber.findUnique({ where: { slug } });
  if (!barber) return NextResponse.json({ error: "Barber not found" }, { status: 404 });

  const body = await request.json();
  const { date, startTime, durationMinutes, reason } = body;

  if (!date || !startTime || !durationMinutes) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const endTime = minutesToTime(timeToMinutes(startTime) + Number(durationMinutes));

  const blocked = await prisma.blockedSlot.create({
    data: {
      barberId: barber.id,
      date: new Date(date + "T00:00:00"),
      startTime,
      endTime,
      reason: reason || null,
    },
  });

  return NextResponse.json({ blocked });
}
