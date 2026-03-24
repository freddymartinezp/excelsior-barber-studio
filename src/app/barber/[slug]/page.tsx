"use client";

import { useEffect, useState, use, useCallback } from "react";

interface Booking {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  service: { name: string; durationMinutes: number; price: number };
  customer: { fullName: string; phone: string | null };
}

interface BlockedSlot {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  reason: string | null;
}

interface BarberInfo {
  id: number;
  name: string;
  slug: string;
  photo: string | null;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function timeToMin(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

function pad2(n: number) { return String(n).padStart(2, "0"); }

const START_MIN = 9 * 60;
const END_MIN   = 18 * 60;
const SLOT_MIN  = 30;
const ROW_H     = 56;

const TIME_LABELS: string[] = [];
for (let m = START_MIN; m < END_MIN; m += SLOT_MIN) {
  TIME_LABELS.push(`${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`);
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeekDates(offset: number): Date[] {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1) + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function dateStr(d: Date) { return d.toISOString().split("T")[0]; }

const DURATIONS = [30, 45, 60, 90, 120];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function BarberSchedulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [barber, setBarber] = useState<BarberInfo | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blocked, setBlocked] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [dayOffset, setDayOffset] = useState(0); // mobile: days from today

  const [modal, setModal] = useState<{ date: string; startTime: string } | null>(null);
  const [blockDuration, setBlockDuration] = useState(60);
  const [blockReason, setBlockReason] = useState("");
  const [blocking, setBlocking] = useState(false);
  const [removeLoading, setRemoveLoading] = useState<number | null>(null);

  const fetchSchedule = useCallback(async () => {
    try {
      const res = await fetch(`/api/barber/${slug}/schedule`);
      if (!res.ok) return;
      const data = await res.json();
      setBarber(data.barber);
      setBookings(data.bookings);
      setBlocked(data.blocked);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { fetchSchedule(); }, [fetchSchedule]);

  const weekDates = getWeekDates(weekOffset);
  const today = dateStr(new Date());

  // Mobile: current day being viewed
  const mobileDateObj = new Date();
  mobileDateObj.setDate(mobileDateObj.getDate() + dayOffset);
  const mobileDate = dateStr(mobileDateObj);

  const bookingsByDate: Record<string, Booking[]> = {};
  const blockedByDate: Record<string, BlockedSlot[]> = {};
  bookings.forEach(b => {
    const d = b.date.split("T")[0];
    (bookingsByDate[d] ??= []).push(b);
  });
  blocked.forEach(b => {
    const d = b.date.split("T")[0];
    (blockedByDate[d] ??= []).push(b);
  });

  function topOffset(time: string) {
    return ((timeToMin(time) - START_MIN) / SLOT_MIN) * ROW_H;
  }
  function blockHeight(start: string, end: string) {
    return Math.max(((timeToMin(end) - timeToMin(start)) / SLOT_MIN) * ROW_H - 2, ROW_H - 2);
  }

  function openModal(date: string, slotTime: string) {
    setModal({ date, startTime: slotTime });
    setBlockDuration(60);
    setBlockReason("");
  }

  async function handleBlock() {
    if (!modal) return;
    setBlocking(true);
    await fetch(`/api/barber/${slug}/block`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: modal.date, startTime: modal.startTime, durationMinutes: blockDuration, reason: blockReason }),
    });
    setModal(null);
    await fetchSchedule();
    setBlocking(false);
  }

  async function handleRemoveBlock(id: number) {
    setRemoveLoading(id);
    await fetch(`/api/barber/${slug}/block/${id}`, { method: "DELETE" });
    await fetchSchedule();
    setRemoveLoading(null);
  }

  // ─── Shared: single-day calendar column ────────────────────────────────────
  function DayColumn({ ds }: { ds: string }) {
    const dayBookings = bookingsByDate[ds] ?? [];
    const dayBlocked = blockedByDate[ds] ?? [];
    const totalRows = (END_MIN - START_MIN) / SLOT_MIN;

    return (
      <div className="relative" style={{ height: totalRows * ROW_H }}>
        {TIME_LABELS.map((t, i) => (
          <div
            key={t}
            className="absolute w-full cursor-pointer hover:bg-[#C41E3A]/5 transition-colors group"
            style={{ top: i * ROW_H, height: ROW_H, borderBottom: "1px solid #1E2535" }}
            onClick={() => openModal(ds, t)}
          >
            <span className="absolute inset-0 flex items-center justify-center text-[9px] text-[#1E2535] opacity-0 group-hover:opacity-100 transition-opacity select-none">+ block</span>
          </div>
        ))}
        {dayBookings.map(b => (
          <div
            key={b.id}
            className="absolute left-0.5 right-0.5 bg-[#C41E3A]/20 border border-[#C41E3A]/50 px-1.5 overflow-hidden z-10 rounded-sm"
            style={{ top: topOffset(b.startTime) + 1, height: blockHeight(b.startTime, b.endTime) }}
          >
            <p className="text-[10px] font-semibold text-[#C41E3A] truncate leading-tight mt-0.5">{b.customer.fullName}</p>
            <p className="text-[9px] text-[#8A8680] truncate">{b.service.name}</p>
            <p className="text-[9px] text-[#5A5654]">{formatTime(b.startTime)} · {formatPrice(b.service.price)}</p>
            {b.customer.phone && (
              <a href={`tel:${b.customer.phone}`} className="text-[9px] text-[#C41E3A]/70 hover:text-[#C41E3A]" onClick={e => e.stopPropagation()}>
                {b.customer.phone}
              </a>
            )}
          </div>
        ))}
        {dayBlocked.map(b => (
          <div
            key={b.id}
            className="absolute left-0.5 right-0.5 bg-[#1E2535] border border-[#2E3545] border-dashed px-1.5 overflow-hidden z-10 rounded-sm group/block"
            style={{ top: topOffset(b.startTime) + 1, height: blockHeight(b.startTime, b.endTime) }}
          >
            <p className="text-[10px] text-[#5A5654] truncate leading-tight mt-0.5">Blocked</p>
            {b.reason && <p className="text-[9px] text-[#3A3A4A] truncate">{b.reason}</p>}
            <button
              onClick={(e) => { e.stopPropagation(); handleRemoveBlock(b.id); }}
              disabled={removeLoading === b.id}
              className="text-[9px] text-[#3A3A4A] hover:text-[#C41E3A] transition-colors opacity-0 group-hover/block:opacity-100"
            >
              {removeLoading === b.id ? "..." : "Remove"}
            </button>
          </div>
        ))}
      </div>
    );
  }

  if (loading) return (
    <div className="min-h-screen bg-[#080A0F] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[#C41E3A] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!barber) return (
    <div className="min-h-screen bg-[#080A0F] flex items-center justify-center">
      <p className="text-white">Barber not found.</p>
    </div>
  );

  const totalToday = (bookingsByDate[today] ?? []).length;

  return (
    <div className="min-h-screen bg-[#080A0F] py-6 md:py-10">
      <div className="max-w-5xl mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="bg-[#0D1117] border border-[#1E2535] px-4 md:px-6 py-4 mb-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#1E2535] bg-[#0D1117] flex-shrink-0">
              <img
                src={barber.photo ?? `https://placehold.co/36x36/0D1117/C41E3A?text=${barber.name.charAt(0)}`}
                alt={barber.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8680]">My Schedule</p>
              <h1 className="font-heading text-sm font-bold text-white">{barber.name}</h1>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[#8A8680]">Today</p>
              <p className="text-sm font-medium text-[#C41E3A]">{totalToday} appt{totalToday !== 1 ? "s" : ""}</p>
            </div>
          </div>
        </div>

        {/* ─── MOBILE: Day view ─────────────────────────────────────── */}
        <div className="md:hidden">
          {/* Day nav */}
          <div className="bg-[#0D1117] border border-[#1E2535] border-t-0 px-4 py-3 flex items-center justify-between mb-3">
            <button
              onClick={() => setDayOffset(d => d - 1)}
              className="text-xs text-[#8A8680] hover:text-white transition-colors px-3 py-1.5 border border-[#1E2535] hover:border-[#C41E3A]"
            >
              ← Prev
            </button>
            <div className="text-center">
              <p className={`text-sm font-semibold ${mobileDate === today ? "text-[#C41E3A]" : "text-white"}`}>
                {mobileDateObj.toLocaleDateString("en-US", { weekday: "long" })}
              </p>
              <p className="text-xs text-[#8A8680]">
                {mobileDateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                {mobileDate === today && <span className="ml-1 text-[#C41E3A]">· Today</span>}
              </p>
            </div>
            <button
              onClick={() => setDayOffset(d => d + 1)}
              className="text-xs text-[#8A8680] hover:text-white transition-colors px-3 py-1.5 border border-[#1E2535] hover:border-[#C41E3A]"
            >
              Next →
            </button>
          </div>

          {/* Single-day calendar */}
          <div className="border border-[#1E2535] overflow-auto">
            <div className="flex">
              <div className="flex-shrink-0 w-12 border-r border-[#1E2535]">
                <div className="h-0" />
                {TIME_LABELS.map((t, i) => (
                  <div key={t} className="flex items-start justify-end pr-1.5" style={{ height: ROW_H, borderBottom: "1px solid #1E2535" }}>
                    {i % 2 === 0 && (
                      <span className="text-[10px] text-[#3A3A4A] mt-1 tabular-nums">{formatTime(t)}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex-1">
                <DayColumn ds={mobileDate} />
              </div>
            </div>
          </div>
        </div>

        {/* ─── DESKTOP: Week view ───────────────────────────────────── */}
        <div className="hidden md:block">
          {/* Week nav */}
          <div className="bg-[#0D1117] border border-[#1E2535] border-t-0 px-6 py-3 flex items-center justify-between mb-3">
            <button onClick={() => setWeekOffset(w => w - 1)} className="text-xs text-[#8A8680] hover:text-white transition-colors px-3 py-1.5 border border-[#1E2535] hover:border-[#C41E3A]">← Prev</button>
            <p className="text-xs text-[#8A8680]">
              {weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              {" – "}
              {weekDates[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              {weekOffset === 0 && <span className="ml-2 text-[#C41E3A]">This Week</span>}
            </p>
            <button onClick={() => setWeekOffset(w => w + 1)} className="text-xs text-[#8A8680] hover:text-white transition-colors px-3 py-1.5 border border-[#1E2535] hover:border-[#C41E3A]">Next →</button>
          </div>

          <div className="border border-[#1E2535] overflow-auto">
            <div className="flex" style={{ minWidth: 600 }}>
              {/* Time labels */}
              <div className="flex-shrink-0 w-14 border-r border-[#1E2535]">
                <div className="h-12 border-b border-[#1E2535]" />
                {TIME_LABELS.map((t, i) => (
                  <div key={t} className="flex items-start justify-end pr-2" style={{ height: ROW_H, borderBottom: "1px solid #1E2535" }}>
                    {i % 2 === 0 && (
                      <span className="text-[10px] text-[#3A3A4A] mt-1 tabular-nums">{formatTime(t)}</span>
                    )}
                  </div>
                ))}
              </div>

              {weekDates.map((date, di) => {
                const ds = dateStr(date);
                const isToday = ds === today;
                return (
                  <div key={ds} className="flex-1 border-r border-[#1E2535]">
                    <div className={`h-12 flex flex-col items-center justify-center border-b border-[#1E2535] ${isToday ? "bg-[#C41E3A]/10" : ""}`}>
                      <p className={`text-[10px] font-medium uppercase tracking-[0.08em] ${isToday ? "text-[#C41E3A]" : "text-[#5A5654]"}`}>{DAYS[di]}</p>
                      <p className={`font-heading text-base font-semibold ${isToday ? "text-[#C41E3A]" : "text-[#8A8680]"}`}>{date.getDate()}</p>
                    </div>
                    <DayColumn ds={ds} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Block modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080A0F]/80 px-4" onClick={() => setModal(null)}>
          <div className="bg-[#0D1117] border border-[#1E2535] w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-heading text-base font-semibold text-white mb-1">Block Time Slot</h2>
            <p className="text-xs text-[#8A8680] mb-6">
              {new Date(modal.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              {" · "}{formatTime(modal.startTime)}
            </p>
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[10px] tracking-[0.1em] uppercase text-[#8A8680] mb-2">Duration</p>
                <div className="flex gap-1.5">
                  {DURATIONS.map(d => (
                    <button
                      key={d}
                      onClick={() => setBlockDuration(d)}
                      className={`flex-1 py-2 text-xs font-medium border transition-all ${blockDuration === d ? "border-[#C41E3A] bg-[#C41E3A]/10 text-[#C41E3A]" : "border-[#1E2535] text-[#8A8680] hover:border-[#C41E3A]/50 bg-[#080A0F]"}`}
                    >
                      {d < 60 ? `${d}m` : `${d / 60}h`}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.1em] uppercase text-[#8A8680] mb-2">Reason (optional)</p>
                <input
                  type="text"
                  value={blockReason}
                  onChange={e => setBlockReason(e.target.value)}
                  placeholder="Walk-in, lunch, personal..."
                  className="w-full bg-[#080A0F] border border-[#1E2535] focus:border-[#C41E3A] text-white px-3 py-2.5 text-sm outline-none transition-colors placeholder-[#3A3A4A]"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 text-xs border border-[#1E2535] text-[#8A8680] hover:border-[#C41E3A] transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleBlock}
                  disabled={blocking}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium bg-[#C41E3A] text-white hover:bg-[#E8304A] transition-colors disabled:opacity-50"
                >
                  {blocking && <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {blocking ? "Blocking..." : "Block Slot"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
