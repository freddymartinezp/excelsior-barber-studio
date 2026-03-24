import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Locations & Hours" },
  { href: "/faq", label: "FAQ" },
];

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-heading text-2xl font-bold tracking-[0.2em] text-text">EXCELSIOR BARBER STUDIO</p>
              <p className="text-[10px] tracking-[0.3em] text-text-muted uppercase mt-1">Gentlemen&apos;s Barbershop</p>
            </div>
            <p className="text-sm text-text-muted leading-relaxed max-w-xs">
              Premium cuts, precision fades, and the kind of atmosphere that keeps you coming back. Walk in fresh. Walk out sharper.
            </p>
          </div>

          {/* Nav Links */}
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-text-muted mb-5">Navigation</p>
            <nav className="grid grid-cols-2 gap-x-6 gap-y-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gold hover:text-gold-light transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social + CTA */}
          <div className="flex flex-col gap-5">
            <p className="text-xs tracking-[0.2em] uppercase text-text-muted">Follow Us</p>
            <div className="flex flex-col gap-3">
              <a
                href="https://www.instagram.com/excelsiorbarber"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-text-muted hover:text-text transition-colors group"
              >
                <span className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-gold transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </span>
                @excelsiorbarber
              </a>
              <a
                href="#"
                className="flex items-center gap-3 text-sm text-text-muted hover:text-text transition-colors group"
              >
                <span className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-gold transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </span>
                Excelsior Barber Shop
              </a>
            </div>
            <Link
              href="/team"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium tracking-[0.08em] bg-gold text-background hover:bg-gold-light transition-all duration-300 mt-2"
            >
              Book an Appointment
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-dim">
            © {new Date().getFullYear()} Excelsior Barber Shop. All Rights Reserved.
          </p>
          <p className="text-xs text-text-dim">
            Built for the culture.
          </p>
        </div>
      </div>
    </footer>
  );
}
