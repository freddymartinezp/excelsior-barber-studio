import Link from "next/link";
import type { ReactNode } from "react";

const navLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/barbers", label: "Barbers" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#080A0F] flex">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-[#0D1117] border-r border-[#1E2535] flex flex-col">
        <div className="px-5 py-6 border-b border-[#1E2535]">
          <p className="font-heading text-sm font-bold text-white tracking-[0.15em]">EXCELSIOR BARBER STUDIO</p>
          <p className="text-[10px] tracking-[0.2em] text-[#C41E3A] uppercase mt-0.5">Admin</p>
        </div>
        <nav className="flex-1 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center px-5 py-3 text-sm text-[#8A8680] hover:text-white hover:bg-[#C41E3A]/10 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-[#1E2535]">
          <Link href="/" className="text-xs text-[#8A8680] hover:text-[#C41E3A] transition-colors">
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
