import { aboutContent } from "@/data/content";
import Link from "next/link";

export const metadata = {
  title: "About | Excelsior Barber Shop",
};

export default function AboutPage() {
  return (
    <>
      {/* Fixed page background */}
      <div className="fixed inset-0 -z-10 bg-cover bg-center" style={{ willChange: "transform", backgroundImage: "url('/bg-cut-bw.webp')" }} />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#080A0F]/90">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.3em] uppercase text-[#C41E3A] font-medium mb-5">Our Story</p>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8">
              {aboutContent.headline}
            </h1>
            <p className="text-lg text-[#8A8680] leading-relaxed">
              {aboutContent.subheadline}
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-[#0D1117]/90">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="aspect-[4/3] bg-[#161B24] overflow-hidden">
              <img
                src="https://placehold.co/800x600/111111/C9A84C?text=Excelsior Barber Shop"
                alt="Excelsior Barber Shop"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-6 pt-4">
              {aboutContent.story.map((para, i) => (
                <p key={i} className="text-[#8A8680] leading-relaxed text-base">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 lg:py-32 bg-[#080A0F]/88">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-[#C41E3A] font-medium mb-4">What We Stand For</p>
            <h2 className="font-heading text-3xl lg:text-4xl font-light text-white">Built Different</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aboutContent.values.map((v, i) => (
              <div key={i} className="p-8 border border-[#1E2535] bg-[#0D1117] flex flex-col gap-4">
                <div className="w-10 h-px bg-[#C41E3A]" />
                <h3 className="font-heading text-xl font-semibold text-white">{v.title}</h3>
                <p className="text-sm text-[#8A8680] leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0D1117]/90 border-t border-[#1E2535]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center flex flex-col items-center gap-8">
          <h2 className="font-heading text-3xl lg:text-4xl font-light text-white">Ready to Experience It?</h2>
          <Link
            href="/team"
            className="inline-flex items-center px-8 py-4 text-sm font-medium tracking-[0.1em] bg-[#C41E3A] text-[#080A0F] hover:bg-[#E8304A] transition-all duration-300"
          >
            Book Your Appointment
          </Link>
        </div>
      </section>
    </>
  );
}
