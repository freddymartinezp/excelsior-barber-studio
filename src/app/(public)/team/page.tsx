import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Our Team | Excelsior Barber Shop",
};

export default async function TeamPage() {
  const barbers = await prisma.barber.findMany({
    where: { isActive: true },
    orderBy: { id: "asc" },
    include: {
      services: {
        include: { service: true },
        take: 3,
      },
    },
  });

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-cover bg-center" style={{ willChange: "transform", backgroundImage: "url('/bg-beard.webp')" }} />

      <section className="pt-32 pb-20 bg-[#080A0F]/90">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.3em] uppercase text-[#C41E3A] font-medium mb-5">The Crew</p>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Meet the Team
            </h1>
            <p className="text-lg text-[#8A8680] leading-relaxed">
              Every barber at Excelsior Barber Shop brings their own signature style. Find yours and book direct.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0D1117]/90">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {barbers.map((barber) => (
              <div key={barber.id} className="group flex flex-col border border-[#1E2535] hover:border-[#C41E3A] transition-all duration-300 bg-[#080A0F]">
                <div className="aspect-[3/4] overflow-hidden bg-[#161B24]">
                  <img
                    src={barber.photo ?? `https://placehold.co/400x500/111111/C9A84C?text=${encodeURIComponent(barber.name)}`}
                    alt={barber.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div>
                    <h2 className="font-heading text-lg font-semibold text-white">{barber.name}</h2>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {barber.specialties.split(",").slice(0, 2).map((s) => (
                        <span key={s} className="text-[10px] tracking-[0.1em] uppercase text-[#C41E3A] border border-[#C41E3A]/30 px-2 py-0.5">
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#8A8680] leading-relaxed flex-1 line-clamp-3">{barber.bio}</p>
                  <div className="flex flex-col gap-2 pt-2">
                    <Link href={`/book/${barber.slug}`} className="flex items-center justify-center px-4 py-3 text-xs font-medium tracking-[0.1em] bg-[#C41E3A] text-[#080A0F] hover:bg-[#E8304A] transition-all duration-300">
                      Book with {barber.name.split(" ")[0]}
                    </Link>
                    <Link href={`/team/${barber.slug}`} className="flex items-center justify-center px-4 py-2 text-xs font-medium tracking-[0.1em] border border-[#1E2535] text-[#8A8680] hover:border-[#C41E3A] hover:text-[#C41E3A] transition-all duration-300">
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#080A0F]/88 border-t border-[#1E2535]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center flex flex-col items-center gap-6">
          <p className="text-[#8A8680] text-base max-w-md">Not sure who to book with? Check out our services or give us a call.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/services" className="inline-flex items-center px-6 py-3 text-sm font-medium tracking-[0.08em] border border-[#1E2535] text-[#8A8680] hover:border-[#C41E3A] hover:text-[#C41E3A] transition-all duration-300">View Services</Link>
            <Link href="/contact" className="inline-flex items-center px-6 py-3 text-sm font-medium tracking-[0.08em] border border-[#C41E3A] text-[#C41E3A] hover:bg-[#C41E3A] hover:text-[#080A0F] transition-all duration-300">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
