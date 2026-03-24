import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ "barber-slug": string }>;
}

export async function generateMetadata({ params }: Props) {
  const { "barber-slug": slug } = await params;
  const barber = await prisma.barber.findUnique({ where: { slug } });
  return { title: barber ? `${barber.name} | Excelsior Barber Shop` : "Barber | Excelsior Barber Shop" };
}

export default async function BarberProfilePage({ params }: Props) {
  const { "barber-slug": slug } = await params;
  const barber = await prisma.barber.findUnique({
    where: { slug },
    include: { services: { include: { service: true } } },
  });
  if (!barber) notFound();

  function formatPrice(cents: number) {
    return `$${(cents / 100).toFixed(0)}`;
  }

  return (
    <>
      <section className="pt-24 bg-[#080A0F]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start py-16">
            <div className="aspect-[3/4] overflow-hidden bg-[#0D1117] border border-[#1E2535]">
              <img
                src={barber.photo ?? `https://placehold.co/600x800/111111/C9A84C?text=${encodeURIComponent(barber.name)}`}
                alt={barber.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-8 lg:pt-8">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-[#C41E3A] font-medium mb-3">Excelsior Barber Shop Barber</p>
                <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">{barber.name}</h1>
                <div className="flex flex-wrap gap-2">
                  {barber.specialties.split(",").map((s) => (
                    <span key={s} className="text-xs tracking-[0.1em] uppercase text-[#C41E3A] border border-[#C41E3A]/30 px-3 py-1">{s.trim()}</span>
                  ))}
                </div>
              </div>
              <p className="text-[#8A8680] leading-relaxed text-base">{barber.bio}</p>
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[#8A8680] mb-4">Services Offered</p>
                <div className="flex flex-col divide-y divide-[#1E2535]">
                  {barber.services.map(({ service }) => (
                    <div key={service.id} className="flex justify-between items-center py-3">
                      <div>
                        <p className="text-sm text-white font-medium">{service.name}</p>
                        <p className="text-xs text-[#8A8680]">{service.durationMinutes} min</p>
                      </div>
                      <span className="text-[#C41E3A] font-heading text-lg font-light">{formatPrice(service.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link href={`/book/${barber.slug}`} className="flex-1 flex items-center justify-center px-6 py-4 text-sm font-medium tracking-[0.1em] bg-[#C41E3A] text-[#080A0F] hover:bg-[#E8304A] transition-all duration-300">
                  Book with {barber.name.split(" ")[0]}
                </Link>
                <Link href="/team" className="flex items-center justify-center px-6 py-4 text-sm font-medium tracking-[0.08em] border border-[#1E2535] text-[#8A8680] hover:border-[#C41E3A] hover:text-[#C41E3A] transition-all duration-300">
                  ← All Barbers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
