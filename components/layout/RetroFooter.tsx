import React from "react";
import Link from "next/link";

const footerLinks = {
  platform: [
    { label: "Tentang Kami", href: "/about" },
    { label: "Karir", href: "/careers", badge: "Hiring" },
    { label: "Blog Kreator", href: "/blog" },
    { label: "Press Kit", href: "/press" },
  ],
  resources: [
    { label: "Pusat Bantuan", href: "/help" },
    { label: "Panduan Komunitas", href: "/guidelines" },
    { label: "Laporan Transparansi", href: "/transparency" },
    { label: "Status Server", href: "/status", badge: "Online" },
  ],
  legal: [
    { label: "Syarat & Ketentuan", href: "/terms" },
    { label: "Kebijakan Privasi", href: "/privacy" },
    { label: "Cookies", href: "/cookies" },
  ],
};

export default function RetroFooter() {
  return (
    <footer className="relative mt-20 border-t border-[var(--border-soft)] bg-[rgba(255,249,237,0.6)] pt-16 pb-8 backdrop-blur-sm">
      {/* Decorative top border gradient */}
      <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[var(--border-soft)] to-transparent opacity-50" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-pink)] text-lg">
                ✿
              </div>
              <span className="font-serif text-xl font-bold text-[var(--text-main)] tracking-tight">
                Kreator<span className="text-[var(--text-soft)]">Dash</span>
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--text-soft)]">
              Platform donasi yang hangat dan nyaman untuk kreator konten. 
              Dukung karya favoritmu dengan nuansa retro yang menenangkan.
              Dibuat dengan cinta dan kopi hangat.
            </p>
            
            {/* Newsletter Dummy */}
            <div className="mt-2 flex flex-col gap-2">
              <span className="text-xs font-semibold text-[var(--text-main)] uppercase tracking-wider">
                Berlangganan Kabar
              </span>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="email@kamu.com" 
                  className="w-full max-w-[240px] rounded-full border border-[var(--border-soft)] bg-white/50 px-4 py-2 text-sm text-[var(--text-main)] placeholder-[var(--text-soft)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]/20"
                />
                <button className="retro-chip cursor-pointer hover:bg-white hover:shadow-sm transition-all active:scale-95">
                  Kirim
                </button>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-base font-semibold text-[var(--text-main)]">Platform</h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-[var(--text-soft)] hover:text-[var(--text-main)] transition-colors"
                  >
                    {link.label}
                    {link.badge && (
                      <span className="rounded-full bg-[var(--accent-mint)] px-1.5 py-0.5 text-[10px] font-medium text-[#2d4a3e]">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-base font-semibold text-[var(--text-main)]">Resource</h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-[var(--text-soft)] hover:text-[var(--text-main)] transition-colors"
                  >
                    {link.label}
                    {link.badge && (
                      <span className="rounded-full bg-[var(--accent-yellow)] px-1.5 py-0.5 text-[10px] font-medium text-[#5c4c2f]">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-base font-semibold text-[var(--text-main)]">Legal</h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-[var(--text-soft)] hover:text-[var(--text-main)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[var(--border-soft)] pt-8 md:flex-row">
          <div className="text-xs text-[var(--text-soft)]">
            &copy; {new Date().getFullYear()} KreatorDash Inc. Jakarta, Indonesia.
          </div>
          
          <div className="flex items-center gap-4">
            {['Twitter', 'Instagram', 'GitHub', 'Dribbble'].map((social) => (
              <a 
                key={social} 
                href="#" 
                className="text-xs font-medium text-[var(--text-soft)] hover:text-[var(--text-main)] hover:underline underline-offset-4 transition-all"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

