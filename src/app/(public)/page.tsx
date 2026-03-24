import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { testimonials } from "@/data/content";

async function getBarbers() {
  return prisma.barber.findMany({
    where: { isActive: true },
    take: 4,
    orderBy: { id: "asc" },
  });
}

export default async function HomePage() {
  const barbers = await getBarbers();

  return (
    <>
      {/* GPU-composited fixed background — only visible in transparent sections below hero */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          willChange: "transform",
          backgroundImage: "url('/bg-back.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* HERO */}
      <section className="relative min-h-[100dvh] bg-[#0B0D14] flex flex-col items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/hero-saludo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#0B0D14]/70" />

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <img
              src="/excelsior-logo.png"
              alt="Excelsior Barber Shop"
              className="h-40 md:h-52 w-auto mx-auto drop-shadow-2xl"
            />
          </div>

          <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
            Custom Cuts for the Modern Man
          </h1>
          <p className="text-base md:text-lg text-white leading-relaxed mb-10 max-w-lg">
            Premium grooming, precision fades, and a vibe you won&apos;t find anywhere else.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link
              href="/team"
              className="inline-flex items-center px-8 py-4 text-sm font-medium tracking-[0.1em] bg-[#CC2229] text-white hover:bg-[#E8303A] transition-all duration-300"
            >
              Book an Appointment
            </Link>
            <Link
              href="/team"
              className="inline-flex items-center px-8 py-4 text-sm font-medium tracking-[0.1em] border border-[#1E2535] text-white hover:border-[#CC2229] hover:text-[#CC2229] transition-all duration-300"
            >
              Meet the Team
            </Link>
          </div>
        </div>
      </section>

      {/* TEAM PREVIEW — right after hero */}
      <section className="py-10 lg:py-14 bg-[#0D1117]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-8">
            <p className="text-xs tracking-[0.3em] uppercase text-[#C41E3A] font-medium mb-2">The Crew</p>
            <h2 className="font-heading text-2xl lg:text-3xl font-light text-white">Meet Your Barbers</h2>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-6">
            {barbers.map((barber) => (
              <Link key={barber.id} href={`/team/${barber.slug}`}
                className="group flex flex-col overflow-hidden border border-[#1E2535] hover:border-[#C41E3A] transition-colors duration-300"
              >
                <div className="aspect-square overflow-hidden bg-[#161B24]">
                  <img
                    src={barber.photo ?? `https://placehold.co/300x300/111111/C9A84C?text=${encodeURIComponent(barber.name)}`}
                    alt={barber.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="px-3 py-3 bg-[#0D1117]">
                  <p className="font-heading text-sm md:text-base font-semibold text-white truncate">{barber.name}</p>
                  <p className="text-xs text-[#8A8680] mt-0.5 truncate">{barber.specialties.split(",")[0]}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href="/team" className="inline-flex items-center px-6 py-2.5 text-xs font-medium tracking-[0.08em] border border-[#C41E3A] text-[#C41E3A] hover:bg-[#C41E3A] hover:text-[#080A0F] transition-all duration-300">
              View Full Team
            </Link>
          </div>
        </div>
      </section>

      {/* TAGLINE */}
      <section className="py-20 lg:py-24 bg-[#080A0F]/92">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <p className="font-heading text-2xl md:text-4xl lg:text-5xl font-light text-white leading-snug max-w-4xl mx-auto drop-shadow-lg">
            Come in for the cut,{" "}
            <span className="text-[#C41E3A]">walk out on top of your game.</span>
          </p>
        </div>
      </section>

      {/* FEATURE CARDS — solid section */}
      <section className="bg-[#080A0F] pb-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {[
              { title: "Complete Grooming", subtitle: "Haircuts, fades, shaves, beard work, and more.", img: "/bg-tools.webp" },
              { title: "Precision Fades",   subtitle: "Clean lines, sharp detail, every single time.",  img: "/bg-back.webp"  },
              { title: "Real Atmosphere",   subtitle: "Relax, connect, and be yourself. This is the culture.", img: "/bg-beard.webp" },
            ].map((card, i) => (
              <div key={i} className="relative overflow-hidden group aspect-[4/3]">
                <img src={card.img} alt={card.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080A0F] via-[#080A0F]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <h3 className="font-heading text-base font-semibold text-white mb-0.5">{card.title}</h3>
                  <p className="text-xs text-[#8A8680]">{card.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOK CTA STRIP — solid white */}
      <section className="py-8 bg-white border-y border-[#E5E5E5]">
        <div className="flex justify-center">
          <Link href="/team" className="inline-flex items-center px-10 py-4 text-sm font-medium tracking-[0.1em] border border-[#C41E3A] text-[#C41E3A] hover:bg-[#C41E3A] hover:text-white transition-all duration-300">
            Book an Appointment
          </Link>
        </div>
      </section>

      {/* PHONE CTA */}
      <section className="py-20 lg:py-24 bg-[#080A0F]/92">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <p className="text-sm tracking-[0.2em] uppercase text-[#8A8680] mb-3 drop-shadow">Want to book by phone?</p>
          <a href="tel:+17207580268" className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-[#C41E3A] hover:text-[#E8304A] transition-colors duration-300 tracking-wide drop-shadow-lg">
            (720) 758-0268
          </a>
        </div>
      </section>

      {/* TESTIMONIALS — solid */}
      <section className="py-14 lg:py-20 bg-[#080A0F]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.3em] uppercase text-[#C41E3A] font-medium mb-2">Client Reviews</p>
            <h2 className="font-heading text-2xl lg:text-3xl font-light text-white">What They&apos;re Saying</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 border border-[#1E2535] bg-[#0D1117] flex flex-col gap-4">
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-[#C41E3A] text-sm">★</span>
                  ))}
                </div>
                <p className="text-[#8A8680] text-sm leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
                <div className="pt-3 border-t border-[#1E2535]">
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-[#C41E3A] text-xs mt-0.5">{t.service}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAP — solid */}
      <section className="py-14 lg:py-20 bg-[#0D1117]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-8">
            <p className="text-xs tracking-[0.3em] uppercase text-[#C41E3A] font-medium mb-2">Find Us</p>
            <h2 className="font-heading text-2xl lg:text-3xl font-light text-white">Our Location</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[#C41E3A] mb-1">Address</p>
                <p className="text-white text-sm leading-relaxed">2243 Federal Blvd<br />Denver, CO</p>
              </div>
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[#C41E3A] mb-1">Hours</p>
                <p className="text-[#8A8680] text-sm">Mon – Sun: 9:00 AM – 7:00 PM</p>
              </div>
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[#C41E3A] mb-1">Phone</p>
                <a href="tel:+17207580268" className="text-white text-sm hover:text-[#C41E3A] transition-colors">(720) 758-0268</a>
              </div>
              <Link href="/team" className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium tracking-[0.08em] bg-[#C41E3A] text-[#080A0F] hover:bg-[#E8304A] transition-all duration-300">
                Book an Appointment
              </Link>
            </div>
            <div className="lg:col-span-2 overflow-hidden border border-[#1E2535]">
              <iframe
                title="Excelsior Barber Shop Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3072.5!2d-105.02!3d39.74!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876c7e1234567890%3A0x1!2s2243+Federal+Blvd%2C+Denver%2C+CO!5e0!3m2!1sen!2sus!4v1"
                width="100%"
                height="360"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
