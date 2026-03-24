import Link from "next/link";
import { Suspense } from "react";

export const metadata = { title: "Booking Confirmed | Excelsior Barber Shop" };

export default function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ barber?: string; service?: string; date?: string; time?: string; id?: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-[#080A0F]" />}>
      <SuccessBody searchParams={searchParams} />
    </Suspense>
  );
}

async function SuccessBody({ searchParams }: { searchParams: Promise<{ barber?: string; service?: string; date?: string; time?: string; id?: string }> }) {
  const sp = await searchParams;

  function formatTime(t?: string) {
    if (!t) return "";
    const [h, m] = t.split(":").map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  }

  function formatDate(d?: string) {
    if (!d) return "";
    return new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  }

  return (
    <div className="min-h-[100dvh] bg-[#080A0F] flex items-center justify-center pt-20 px-6 pb-20">
      <div className="max-w-lg w-full text-center flex flex-col items-center gap-8">
        <div className="w-20 h-20 border border-[#C41E3A] flex items-center justify-center">
          <svg className="w-8 h-8 text-[#C41E3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-[#8A8680] mb-3">Booking Confirmed</p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">You&apos;re all set.</h1>
          <p className="text-[#8A8680] leading-relaxed">Your appointment has been booked. See you at Excelsior Barber Shop!</p>
        </div>
        {sp.barber && (
          <div className="w-full border border-[#1E2535] bg-[#0D1117] p-6 text-left flex flex-col gap-3">
            <div className="flex justify-between items-center pb-3 border-b border-[#1E2535]">
              <p className="text-xs tracking-[0.2em] uppercase text-[#8A8680]">Appointment Details</p>
              {sp.id && <span className="text-xs text-[#C41E3A] font-mono">#{sp.id}</span>}
            </div>
            {[
              { label: "Barber", value: sp.barber },
              { label: "Service", value: sp.service },
              { label: "Date", value: formatDate(sp.date) },
              { label: "Time", value: formatTime(sp.time) },
            ].filter(r => r.value).map(({ label, value }) => (
              <div key={label} className="flex justify-between py-1">
                <span className="text-sm text-[#8A8680]">{label}</span>
                <span className={`text-sm font-medium ${label === "Time" ? "text-[#C41E3A]" : "text-white"}`}>{value}</span>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-[#5A5654]">Questions? Call <a href="tel:+17207580268" className="text-[#C41E3A] hover:text-[#E8304A] transition-colors">(720) 758-0268</a></p>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link href="/team" className="flex-1 flex items-center justify-center px-6 py-3 text-sm font-medium tracking-[0.08em] bg-[#C41E3A] text-[#080A0F] hover:bg-[#E8304A] transition-all duration-300">Book Another</Link>
          <Link href="/" className="flex-1 flex items-center justify-center px-6 py-3 text-sm font-medium tracking-[0.08em] border border-[#1E2535] text-[#8A8680] hover:border-[#C41E3A] hover:text-[#C41E3A] transition-all duration-300">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
