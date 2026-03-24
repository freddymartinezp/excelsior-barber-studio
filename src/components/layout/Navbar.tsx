"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-start group">
            <span className="font-heading text-xl font-bold tracking-[0.2em] text-text group-hover:text-gold transition-colors duration-300">
              EXCELSIOR BARBER SHOP
            </span>
            <span className="text-[9px] tracking-[0.3em] text-text-muted uppercase -mt-0.5">
              Gentlemen&apos;s Barbershop
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm tracking-[0.08em] text-white hover:text-[#C41E3A] transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Book Now + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/team"
              className="hidden lg:inline-flex items-center px-5 py-2.5 text-sm font-medium tracking-[0.08em] border border-gold text-gold hover:bg-gold hover:text-background transition-all duration-300"
            >
              Book Now
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden flex flex-col gap-1.5 p-2 text-text-muted hover:text-text transition-colors"
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-px bg-current transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-6 h-px bg-current transition-all duration-300 ${open ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-px bg-current transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-surface border-b border-border">
          <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base tracking-[0.05em] text-white hover:text-[#C41E3A] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/team"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium tracking-[0.08em] border border-gold text-gold hover:bg-gold hover:text-background transition-all duration-300 mt-2"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
