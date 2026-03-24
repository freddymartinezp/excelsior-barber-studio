import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const barber = await prisma.barber.findUnique({
    where: { slug },
    include: { services: { include: { service: true } } },
  });
  if (!barber) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(barber);
}
