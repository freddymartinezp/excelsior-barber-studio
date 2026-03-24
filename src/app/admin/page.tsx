import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });
}

export default async function AdminPage() {
  const today = new Date();
  const todayStart = new Date(today.toISOString().split("T")[0] + "T00:00:00.000Z");
  const todayEnd = new Date(today.toISOString().split("T")[0] + "T23:59:59.999Z");

  const [totalBookings, todayBookings, totalCustomers, recentBookings] = await Promise.all([
    prisma.booking.count({ where: { status: "confirmed" } }),
    prisma.booking.findMany({
      where: { status: "confirmed", date: { gte: todayStart, lte: todayEnd } },
      include: { barber: true, service: true, customer: true },
      orderBy: { startTime: "asc" },
    }),
    prisma.customer.count(),
    prisma.booking.findMany({
      where: { status: "confirmed" },
      include: { barber: true, service: true, customer: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const todayRevenue = todayBookings.reduce((sum, b) => sum + b.service.price, 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-[#8A8680] mt-1">
          {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {[
          { label: "Today's Appointments", value: todayBookings.length, accent: true },
          { label: "Today's Revenue", value: formatPrice(todayRevenue) },
          { label: "Total Bookings", value: totalBookings },
          { label: "Total Customers", value: totalCustomers },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#0D1117] border border-[#1E2535] p-5">
            <p className="text-xs tracking-[0.15em] uppercase text-[#8A8680] mb-3">{stat.label}</p>
            <p className={`font-heading text-3xl font-bold ${stat.accent ? "text-[#C41E3A]" : "text-white"}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Today's schedule */}
        <div className="bg-[#0D1117] border border-[#1E2535]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E2535]">
            <h2 className="font-heading text-sm font-semibold text-white tracking-[0.05em]">Today&apos;s Schedule</h2>
            <Link href="/admin/bookings" className="text-xs text-[#C41E3A] hover:text-[#E8304A] transition-colors">View all →</Link>
          </div>
          <div className="divide-y divide-[#1E2535]">
            {todayBookings.length === 0 ? (
              <p className="px-5 py-8 text-sm text-[#8A8680] text-center">No appointments today.</p>
            ) : (
              todayBookings.map((b) => (
                <div key={b.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="text-right flex-shrink-0 w-14">
                    <p className="text-xs font-medium text-[#C41E3A]">{formatTime(b.startTime)}</p>
                    <p className="text-[10px] text-[#5A5654]">{formatTime(b.endTime)}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{b.customer.fullName}</p>
                    <p className="text-xs text-[#8A8680] truncate">{b.service.name} · {b.barber.name}</p>
                  </div>
                  <span className="text-xs text-[#8A8680]">{formatPrice(b.service.price)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent bookings */}
        <div className="bg-[#0D1117] border border-[#1E2535]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E2535]">
            <h2 className="font-heading text-sm font-semibold text-white tracking-[0.05em]">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-xs text-[#C41E3A] hover:text-[#E8304A] transition-colors">View all →</Link>
          </div>
          <div className="divide-y divide-[#1E2535]">
            {recentBookings.length === 0 ? (
              <p className="px-5 py-8 text-sm text-[#8A8680] text-center">No bookings yet.</p>
            ) : (
              recentBookings.map((b) => (
                <div key={b.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{b.customer.fullName}</p>
                    <p className="text-xs text-[#8A8680] truncate">{b.service.name} · {b.barber.name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-[#8A8680]">{formatDate(b.date)}</p>
                    <p className="text-xs text-[#C41E3A] mt-0.5">{formatTime(b.startTime)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
