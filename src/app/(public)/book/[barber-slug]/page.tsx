"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  slug: string;
}

interface Barber {
  id: number;
  name: string;
  slug: string;
  photo: string | null;
  specialties: string;
  services: { service: Service }[];
}

type Step = "service" | "date" | "time" | "info" | "confirm";
const STEPS: Step[] = ["service", "date", "time", "info", "confirm"];

function formatPrice(cents: number) { return `$${(cents / 100).toFixed(0)}`; }
function formatDate(d: Date): string { return d.toISOString().split("T")[0]; }
function formatDisplayDate(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}
function get14Days(): Date[] {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i); return d;
  });
}

export default function BookingPage({ params }: { params: Promise<{ "barber-slug": string }> }) {
  const { "barber-slug": barberSlug } = use(params);
  const router = useRouter();
  const [barber, setBarber] = useState<Barber | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>("service");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/barbers/${barberSlug}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => setBarber(data))
      .catch(() => setBarber(null))
      .finally(() => setLoading(false));
  }, [barberSlug]);

  useEffect(() => {
    if (!barber || !selectedService || !selectedDate) return;
    setSlotsLoading(true);
    setSelectedTime(null);
    fetch(`/api/availability?barberId=${barber.id}&date=${formatDate(selectedDate)}&serviceId=${selectedService.id}`)
      .then(r => r.json())
      .then(data => setSlots(data.slots ?? []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [barber, selectedService, selectedDate]);

  const stepIndex = STEPS.indexOf(step);

  function validateForm() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleConfirm() {
    if (!barber || !selectedService || !selectedDate || !selectedTime) return;
    if (!validateForm()) { setStep("info"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barberId: barber.id, serviceId: selectedService.id,
          date: formatDate(selectedDate), startTime: selectedTime,
          customerName: form.name, phone: form.phone, email: form.email,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/booking-success?barber=${encodeURIComponent(barber.name)}&service=${encodeURIComponent(selectedService.name)}&date=${formatDate(selectedDate)}&time=${selectedTime}&id=${data.bookingId}`);
      } else {
        alert(data.error ?? "Booking failed. Please try again.");
        setSubmitting(false);
      }
    } catch {
      alert("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (loading) return (
    <div className="min-h-[100dvh] bg-[#080A0F] flex items-center justify-center pt-20">
      <div className="w-6 h-6 border-2 border-[#C41E3A] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!barber) return (
    <div className="min-h-[100dvh] bg-[#080A0F] flex flex-col items-center justify-center pt-20 gap-6">
      <p className="text-white font-heading text-2xl">Barber not found</p>
      <Link href="/team" className="text-[#C41E3A] text-sm">← View all barbers</Link>
    </div>
  );

  return (
    <div className="min-h-[100dvh] pt-24 pb-20 relative">
      <div className="fixed inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: "url('/bg-cut-bw.webp')" }} />
      <div className="fixed inset-0 -z-10 bg-[#080A0F]/88" />
      <div className="max-w-2xl mx-auto px-6">
        {/* Barber header */}
        <div className="flex items-center gap-4 mb-10 pb-8 border-b border-[#1E2535]">
          <div className="w-14 h-14 rounded-full overflow-hidden border border-[#1E2535] flex-shrink-0 bg-[#0D1117]">
            <img src={barber.photo ?? `https://placehold.co/56x56/111111/C9A84C?text=${barber.name.charAt(0)}`} alt={barber.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#8A8680] mb-1">Booking with</p>
            <h1 className="font-heading text-xl font-bold text-white">{barber.name}</h1>
          </div>
          <Link href="/team" className="ml-auto text-xs text-[#8A8680] hover:text-[#C41E3A] transition-colors">Change barber</Link>
        </div>

        {/* Step indicator */}
        <div className="flex items-center mb-10">
          {["Service","Date","Time","Info","Confirm"].map((label, i) => (
            <div key={label} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center gap-1">
                <div className={`flex items-center justify-center w-8 h-8 text-xs font-medium transition-all duration-200 ${i < stepIndex ? "bg-[#C41E3A] text-[#080A0F]" : i === stepIndex ? "border-2 border-[#C41E3A] text-[#C41E3A]" : "border border-[#1E2535] text-[#5A5654]"}`}>
                  {i < stepIndex ? "✓" : i + 1}
                </div>
                <span className={`text-[10px] tracking-[0.05em] ${i === stepIndex ? "text-white" : "text-[#5A5654]"}`}>{label}</span>
              </div>
              {i < 4 && <div className="w-5 lg:w-8 h-px bg-[#1E2535] mx-1 mb-4" />}
            </div>
          ))}
        </div>

        {/* Step 1: Service */}
        {step === "service" && (
          <div>
            <h2 className="font-heading text-2xl font-semibold text-white mb-8">Choose a Service</h2>
            <div className="flex flex-col gap-3">
              {barber.services.map(({ service }) => (
                <button key={service.id} onClick={() => { setSelectedService(service); setStep("date"); }}
                  className="flex justify-between items-start p-5 border border-[#1E2535] text-left hover:border-[#C41E3A]/50 bg-[#0D1117] hover:bg-[#C41E3A]/5 group w-full transition-all duration-200">
                  <div className="flex-1 mr-4">
                    <p className="font-heading text-base font-semibold text-white group-hover:text-[#C41E3A] transition-colors">{service.name}</p>
                    <p className="text-xs text-[#8A8680] mt-1">{service.durationMinutes} min — {service.description}</p>
                  </div>
                  <span className="font-heading text-xl font-light text-[#C41E3A] flex-shrink-0">{formatPrice(service.price)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Date */}
        {step === "date" && (
          <div>
            <h2 className="font-heading text-2xl font-semibold text-white mb-2">Choose a Date</h2>
            <p className="text-sm text-[#8A8680] mb-8">{selectedService?.name} · {selectedService?.durationMinutes} min · {formatPrice(selectedService?.price ?? 0)}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {get14Days().map((d) => (
                <button key={formatDate(d)} onClick={() => { setSelectedDate(d); setStep("time"); }}
                  className={`p-4 border text-left transition-all duration-200 ${selectedDate && formatDate(selectedDate) === formatDate(d) ? "border-[#C41E3A] bg-[#C41E3A]/5" : "border-[#1E2535] hover:border-[#C41E3A]/50 bg-[#0D1117]"}`}>
                  <p className="text-[10px] uppercase tracking-[0.1em] text-[#8A8680]">{d.toLocaleDateString("en-US", { weekday: "short" })}</p>
                  <p className="font-heading text-2xl font-semibold text-white mt-0.5">{d.getDate()}</p>
                  <p className="text-xs text-[#8A8680]">{d.toLocaleDateString("en-US", { month: "short" })}</p>
                </button>
              ))}
            </div>
            <button onClick={() => setStep("service")} className="mt-8 text-sm text-[#8A8680] hover:text-white transition-colors">← Back</button>
          </div>
        )}

        {/* Step 3: Time */}
        {step === "time" && (
          <div>
            <h2 className="font-heading text-2xl font-semibold text-white mb-2">Choose a Time</h2>
            {selectedDate && <p className="text-sm text-[#8A8680] mb-8">{formatDisplayDate(selectedDate)}</p>}
            {slotsLoading ? (
              <div className="flex items-center gap-3 text-[#8A8680] text-sm">
                <div className="w-4 h-4 border-2 border-[#C41E3A] border-t-transparent rounded-full animate-spin" />
                Loading available times...
              </div>
            ) : slots.length === 0 ? (
              <div className="p-6 border border-[#1E2535] bg-[#0D1117]">
                <p className="text-[#8A8680] text-sm">No available slots for this day.</p>
                <button onClick={() => setStep("date")} className="mt-3 text-sm text-[#C41E3A] hover:text-[#E8304A] transition-colors">Choose another date →</button>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {slots.map((slot) => (
                  <button key={slot} onClick={() => { setSelectedTime(slot); setStep("info"); }}
                    className={`py-3 px-2 border text-sm font-medium transition-all duration-200 ${selectedTime === slot ? "border-[#C41E3A] bg-[#C41E3A]/5 text-[#C41E3A]" : "border-[#1E2535] hover:border-[#C41E3A]/50 text-[#8A8680] hover:text-white bg-[#0D1117]"}`}>
                    {formatTime(slot)}
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => setStep("date")} className="mt-8 text-sm text-[#8A8680] hover:text-white transition-colors">← Back</button>
          </div>
        )}

        {/* Step 4: Info */}
        {step === "info" && (
          <div>
            <h2 className="font-heading text-2xl font-semibold text-white mb-8">Your Information</h2>
            <div className="flex flex-col gap-5">
              {[
                { label: "Full Name *", key: "name", type: "text", placeholder: "John Smith" },
                { label: "Phone Number *", key: "phone", type: "tel", placeholder: "(555) 000-0000" },
                { label: "Email Address *", key: "email", type: "email", placeholder: "john@email.com" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs tracking-[0.1em] uppercase text-[#8A8680] mb-2">{label}</label>
                  <input
                    type={type}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className={`w-full bg-[#0D1117] border ${errors[key] ? "border-red-500" : "border-[#1E2535] focus:border-[#C41E3A]"} text-white px-4 py-3 text-sm outline-none transition-colors`}
                    placeholder={placeholder}
                  />
                  {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 border border-[#1E2535] bg-[#0D1117] flex flex-col gap-2 text-sm">
              <div className="flex justify-between"><span className="text-[#8A8680]">Barber</span><span className="text-white">{barber.name}</span></div>
              <div className="flex justify-between"><span className="text-[#8A8680]">Service</span><span className="text-white">{selectedService?.name}</span></div>
              <div className="flex justify-between"><span className="text-[#8A8680]">Date & Time</span><span className="text-white">{selectedDate ? formatDisplayDate(selectedDate) : ""}{selectedTime ? ` · ${formatTime(selectedTime)}` : ""}</span></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep("time")} className="px-6 py-3 text-sm border border-[#1E2535] text-[#8A8680] hover:border-[#C41E3A] hover:text-[#C41E3A] transition-all duration-200">← Back</button>
              <button onClick={() => { if (validateForm()) setStep("confirm"); }} className="flex-1 px-6 py-3 text-sm font-medium tracking-[0.08em] bg-[#C41E3A] text-[#080A0F] hover:bg-[#E8304A] transition-all duration-300">Review Booking</button>
            </div>
          </div>
        )}

        {/* Step 5: Confirm */}
        {step === "confirm" && barber && selectedService && selectedDate && selectedTime && (
          <div>
            <h2 className="font-heading text-2xl font-semibold text-white mb-8">Confirm Your Booking</h2>
            <div className="border border-[#1E2535] bg-[#0D1117] p-6 flex flex-col gap-5 mb-8">
              <div className="grid grid-cols-2 gap-4 pb-5 border-b border-[#1E2535]">
                <div><p className="text-[10px] tracking-[0.1em] uppercase text-[#8A8680] mb-1">Barber</p><p className="font-heading text-base font-semibold text-white">{barber.name}</p></div>
                <div><p className="text-[10px] tracking-[0.1em] uppercase text-[#8A8680] mb-1">Service</p><p className="font-heading text-base font-semibold text-[#C41E3A]">{selectedService.name}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-5 border-b border-[#1E2535]">
                <div><p className="text-[10px] tracking-[0.1em] uppercase text-[#8A8680] mb-1">Date</p><p className="text-white text-sm font-medium">{formatDisplayDate(selectedDate)}</p></div>
                <div><p className="text-[10px] tracking-[0.1em] uppercase text-[#8A8680] mb-1">Time</p><p className="text-white text-sm font-medium">{formatTime(selectedTime)}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-5 border-b border-[#1E2535]">
                <div><p className="text-[10px] tracking-[0.1em] uppercase text-[#8A8680] mb-1">Duration</p><p className="text-white text-sm">{selectedService.durationMinutes} min</p></div>
                <div><p className="text-[10px] tracking-[0.1em] uppercase text-[#8A8680] mb-1">Price</p><p className="font-heading text-lg text-[#C41E3A]">{formatPrice(selectedService.price)}</p></div>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.1em] uppercase text-[#8A8680] mb-2">Your Details</p>
                <p className="text-white text-sm">{form.name}</p>
                <p className="text-[#8A8680] text-xs mt-1">{form.phone} · {form.email}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep("info")} disabled={submitting} className="px-6 py-3 text-sm border border-[#1E2535] text-[#8A8680] hover:border-[#C41E3A] hover:text-[#C41E3A] transition-all duration-200">← Edit</button>
              <button onClick={handleConfirm} disabled={submitting} className="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium tracking-[0.1em] bg-[#C41E3A] text-[#080A0F] hover:bg-[#E8304A] transition-all duration-300 disabled:opacity-50">
                {submitting && <span className="w-4 h-4 border-2 border-[#080A0F] border-t-transparent rounded-full animate-spin" />}
                {submitting ? "Confirming..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
