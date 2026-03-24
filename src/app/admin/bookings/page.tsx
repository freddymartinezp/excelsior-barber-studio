"use client";

import { useEffect, useState, useCallback } from "react";

interface Booking {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  customer: { fullName: string; email: string; phone: string | null };
  barber: { name: string };
  service: { name: string; price: number; durationMinutes: number };
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
}

type StatusFilter = "all" | "confirmed" | "cancelled" | "completed";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("confirmed");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const params = filter !== "all" ? `?status=${filter}` : "";
    const res = await fetch(`/api/admin/bookings${params}`);
    const data = await res.json();
    setBookings(data.bookings ?? []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  async function updateStatus(id: number, status: string) {
    setActionLoading(id);
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await fetchBookings();
    setActionLoading(null);
  }

  const filters: { value: StatusFilter; label: string }[] = [
    { value: "confirmed", label: "Confirmed" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "all", label: "All" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">Bookings</h1>
          <p className="text-sm text-[#8A8680] mt-1">{bookings.length} {filter === "all" ? "total" : filter} booking{bookings.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#1E2535]">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2.5 text-xs font-medium tracking-[0.08em] uppercase transition-colors duration-200 border-b-2 -mb-px ${
              filter === f.value
                ? "border-[#C41E3A] text-[#C41E3A]"
                : "border-transparent text-[#8A8680] hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#C41E3A] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-[#8A8680] text-sm">No {filter === "all" ? "" : filter + " "}bookings found.</p>
        </div>
      ) : (
        <div className="bg-[#0D1117] border border-[#1E2535]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E2535]">
                {["Customer", "Barber", "Service", "Date & Time", "Price", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[#5A5654] font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2535]">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-[#C41E3A]/5 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm text-white">{b.customer.fullName}</p>
                    <p className="text-xs text-[#8A8680] mt-0.5">{b.customer.phone ?? b.customer.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#8A8680]">{b.barber.name}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-[#8A8680]">{b.service.name}</p>
                    <p className="text-xs text-[#5A5654]">{b.service.durationMinutes} min</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-white">{formatDate(b.date)}</p>
                    <p className="text-xs text-[#C41E3A] mt-0.5">{formatTime(b.startTime)} – {formatTime(b.endTime)}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{formatPrice(b.service.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 text-[10px] tracking-[0.08em] uppercase font-medium ${
                      b.status === "confirmed" ? "bg-[#C41E3A]/15 text-[#C41E3A]"
                      : b.status === "completed" ? "bg-green-900/30 text-green-400"
                      : "bg-[#1E2535] text-[#5A5654]"
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {actionLoading === b.id ? (
                      <div className="w-4 h-4 border-2 border-[#C41E3A] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div className="flex gap-2">
                        {b.status === "confirmed" && (
                          <>
                            <button
                              onClick={() => updateStatus(b.id, "completed")}
                              className="text-xs text-green-400 hover:text-green-300 transition-colors"
                            >
                              Complete
                            </button>
                            <span className="text-[#1E2535]">·</span>
                            <button
                              onClick={() => updateStatus(b.id, "cancelled")}
                              className="text-xs text-[#8A8680] hover:text-[#C41E3A] transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {b.status !== "confirmed" && (
                          <button
                            onClick={() => updateStatus(b.id, "confirmed")}
                            className="text-xs text-[#8A8680] hover:text-white transition-colors"
                          >
                            Restore
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
