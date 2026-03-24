import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export default async function AdminBarbersPage() {
  const barbers = await prisma.barber.findMany({
    include: {
      availabilityRules: { orderBy: { dayOfWeek: "asc" } },
      timeOff: { orderBy: { startDate: "asc" } },
      _count: { select: { bookings: true } },
    },
    orderBy: { id: "asc" },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-white">Barbers</h1>
        <p className="text-sm text-[#8A8680] mt-1">{barbers.length} barber{barbers.length !== 1 ? "s" : ""} on the team</p>
      </div>

      <div className="flex flex-col gap-4">
        {barbers.map((barber) => (
          <div key={barber.id} className="bg-[#0D1117] border border-[#1E2535]">
            {/* Barber header */}
            <div className="flex items-center gap-4 px-5 py-4 border-b border-[#1E2535]">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-[#1A1A2E] border border-[#1E2535]">
                <img
                  src={barber.photo ?? `https://placehold.co/40x40/0D1117/C41E3A?text=${barber.name.charAt(0)}`}
                  alt={barber.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-heading text-sm font-semibold text-white">{barber.name}</p>
                <p className="text-xs text-[#8A8680]">{barber.specialties.split(",")[0]} · {barber._count.bookings} bookings</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex px-2 py-0.5 text-[10px] tracking-[0.08em] uppercase font-medium ${barber.isActive ? "bg-[#C41E3A]/15 text-[#C41E3A]" : "bg-[#1E2535] text-[#5A5654]"}`}>
                  {barber.isActive ? "Active" : "Inactive"}
                </span>
                <Link
                  href={`/book/${barber.slug}`}
                  target="_blank"
                  className="text-xs text-[#8A8680] hover:text-[#C41E3A] transition-colors"
                >
                  /book/{barber.slug} →
                </Link>
              </div>
            </div>

            {/* Schedule grid */}
            <div className="px-5 py-4">
              <p className="text-[10px] tracking-[0.15em] uppercase text-[#5A5654] mb-3">Weekly Schedule</p>
              <div className="flex gap-1.5">
                {DAYS.map((day, i) => {
                  const rule = barber.availabilityRules.find((r) => r.dayOfWeek === i);
                  return (
                    <div
                      key={day}
                      className={`flex-1 text-center py-2.5 px-1 border ${rule ? "border-[#C41E3A]/30 bg-[#C41E3A]/5" : "border-[#1E2535] bg-transparent"}`}
                    >
                      <p className={`text-[10px] font-medium uppercase tracking-[0.05em] ${rule ? "text-[#C41E3A]" : "text-[#5A5654]"}`}>{day}</p>
                      {rule ? (
                        <p className="text-[9px] text-[#8A8680] mt-0.5 leading-tight">
                          {formatTime(rule.startTime)}<br />–<br />{formatTime(rule.endTime)}
                        </p>
                      ) : (
                        <p className="text-[9px] text-[#3A3A4A] mt-0.5">Off</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Time off */}
            {barber.timeOff.length > 0 && (
              <div className="px-5 pb-4">
                <p className="text-[10px] tracking-[0.15em] uppercase text-[#5A5654] mb-2">Upcoming Time Off</p>
                <div className="flex flex-wrap gap-2">
                  {barber.timeOff.map((t) => (
                    <span key={t.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#8A8680] border border-[#1E2535] bg-[#080A0F]">
                      {new Date(t.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      {" – "}
                      {new Date(t.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      {t.reason && <span className="text-[#5A5654]">· {t.reason}</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
