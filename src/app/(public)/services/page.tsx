import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Services | Excelsior Barber Shop",
};

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { price: "asc" } });

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-cover bg-center" style={{ willChange: "transform", backgroundImage: "url('/bg-tools.webp')" }} />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#080A0F]/90">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.3em] uppercase text-[#C41E3A] font-medium mb-5">What We Offer</p>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Services & Pricing
            </h1>
            <p className="text-lg text-[#8A8680] leading-relaxed">
              Every service is executed with precision and care. Pick your cut, book your barber.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20 bg-[#0D1117]/90">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col divide-y divide-[#1E2535]">
            {services.map((service) => (
              <div key={service.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-8 gap-4 group">
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-4">
                    <h3 className="font-heading text-xl font-semibold text-white group-hover:text-[#C41E3A] transition-colors">
                      {service.name}
                    </h3>
                    <span className="text-xs tracking-[0.1em] text-[#8A8680] border border-[#1E2535] px-2 py-0.5">
                      {service.durationMinutes} min
                    </span>
                  </div>
                  <p className="text-sm text-[#8A8680] leading-relaxed max-w-xl">{service.description}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-heading text-2xl font-light text-[#C41E3A]">
                    {formatPrice(service.price)}
                  </span>
                  <Link
                    href="/team"
                    className="px-5 py-2.5 text-xs font-medium tracking-[0.1em] border border-[#C41E3A] text-[#C41E3A] hover:bg-[#C41E3A] hover:text-[#080A0F] transition-all duration-300 whitespace-nowrap"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#080A0F]/88 border-t border-[#1E2535]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center flex flex-col items-center gap-6">
          <h2 className="font-heading text-3xl lg:text-4xl font-light text-white">Choose Your Barber</h2>
          <p className="text-[#8A8680] max-w-md">
            Book directly with the barber you trust. Each pro has their own calendar.
          </p>
          <Link
            href="/team"
            className="inline-flex items-center px-8 py-4 text-sm font-medium tracking-[0.1em] bg-[#C41E3A] text-[#080A0F] hover:bg-[#E8304A] transition-all duration-300"
          >
            Meet the Team
          </Link>
        </div>
      </section>
    </>
  );
}
