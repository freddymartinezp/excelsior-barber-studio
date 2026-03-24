import Link from "next/link";

export const metadata = { title: "Contact & Hours | Excelsior Barber Shop" };

const hours = [
  { day: "Monday", h: "9:00 AM – 7:00 PM" },
  { day: "Tuesday", h: "9:00 AM – 7:00 PM" },
  { day: "Wednesday", h: "9:00 AM – 7:00 PM" },
  { day: "Thursday", h: "9:00 AM – 7:00 PM" },
  { day: "Friday", h: "9:00 AM – 7:00 PM" },
  { day: "Saturday", h: "9:00 AM – 7:00 PM" },
  { day: "Sunday", h: "9:00 AM – 7:00 PM" },
];

export default function ContactPage() {
  return (
    <>
      <div className="fixed inset-0 -z-10 bg-cover bg-center" style={{ willChange: "transform", backgroundImage: "url('/bg-cut-bw.webp')" }} />

      <section className="pt-32 pb-20 bg-[#080A0F]/90">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.3em] uppercase text-[#C41E3A] font-medium mb-5">Find Us</p>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">Contact & Location</h1>
            <p className="text-lg text-[#8A8680] leading-relaxed">Come visit us, give us a call, or book online. We&apos;re open 7 days a week.</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0D1117]/90">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="flex flex-col gap-10">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[#C41E3A] mb-4">Address</p>
                <p className="text-white text-xl font-medium">2243 Federal Blvd</p>
                <p className="text-[#C0BDB8] text-base mt-1">Denver, CO 80219</p>
                <a href="https://maps.google.com/?q=2243+Federal+Blvd+Denver+CO+80219" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-[#C41E3A] hover:text-[#E8304A] transition-colors mt-3">Get Directions →</a>
              </div>
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[#C41E3A] mb-4">Phone</p>
                <a href="tel:+17203977510" className="font-heading text-2xl text-[#C41E3A] hover:text-[#E8304A] transition-colors">(720) 397-7510</a>
              </div>
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[#C41E3A] mb-4">Follow Us</p>
                <a href="https://www.instagram.com/excelsiorbarber" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#C0BDB8] hover:text-white transition-colors group w-fit">
                  <span className="w-8 h-8 border border-[#1E2535] group-hover:border-[#C41E3A] flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </span>
                  @excelsiorbarber
                </a>
              </div>
              <Link href="/team" className="inline-flex items-center px-6 py-3 text-sm font-medium tracking-[0.08em] bg-[#C41E3A] text-[#080A0F] hover:bg-[#E8304A] transition-all duration-300 w-fit">Book an Appointment</Link>
            </div>
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-[#C41E3A] mb-6">Hours</p>
              <div className="flex flex-col divide-y divide-[#1E2535]">
                {hours.map(({ day, h }) => (
                  <div key={day} className="flex justify-between py-4">
                    <span className="text-base text-[#C0BDB8]">{day}</span>
                    <span className="text-base text-[#C0BDB8]">{h}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 aspect-video border border-[#1E2535] overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3072.5!2d-104.8!3d39.71!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s2243+Federal+Blvd%2C+Aurora%2C+CO+80012!5e0!3m2!1sen!2sus!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
