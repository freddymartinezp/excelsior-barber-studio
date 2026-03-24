import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  const { slug, id } = await params;
  const blockId = parseInt(id);

  const barber = await prisma.barber.findUnique({ where: { slug } });
  if (!barber) return NextResponse.json({ error: "Barber not found" }, { status: 404 });

  await prisma.blockedSlot.delete({
    where: { id: blockId, barberId: barber.id },
  });

  return NextResponse.json({ success: true });
}
