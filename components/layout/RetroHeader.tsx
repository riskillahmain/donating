"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" },
];

type Props = {
  onMobileMenu?: () => void;
};

export default function RetroHeader({ onMobileMenu }: Props) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-[rgba(242,217,208,0.9)] bg-[rgba(254,246,246,0.92)] backdrop-blur-md">
      <div className="mx-auto flex items-center justify-between px-4 py-3 md:px-8 md:py-4">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 rounded-2xl border border-[rgba(242,217,208,0.9)] bg-gradient-to-br from-[#ffe6a7] via-[#ffb8c9] to-[#bcead5] shadow-[0_6px_14px_rgba(123,104,108,0.36)]">
            <div className="absolute inset-[5px] rounded-2xl border border-[rgba(255,249,237,0.8)] bg-[radial-gradient(circle_at_30%_20%,#fff9ed,transparent_55%),radial-gradient(circle_at_70%_80%,#f3f0ff,transparent_55%)]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[rgba(80,65,68,0.72)]">
              KreasiPay
            </span>
            <span className="text-sm font-semibold text-[rgba(59,47,50,0.98)]">
              Kreator Donasi Dashboard
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onMobileMenu}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(242,217,208,0.9)] bg-[rgba(255,249,237,0.96)] text-[13px] text-[rgba(80,65,68,0.9)] shadow-[0_3px_8px_rgba(123,104,108,0.25)] sm:hidden"
        >
          ☰
        </button>
        <nav className="hidden items-center gap-1.5 rounded-full bg-[rgba(255,248,242,0.9)] p-1 text-[11px] font-medium text-[rgba(80,65,68,0.85)] shadow-[0_8px_24px_rgba(123,104,108,0.16)] sm:flex md:gap-2 md:p-1.5 md:text-xs">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative rounded-full px-3.5 py-1.5"
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-[rgba(255,184,201,0.45)] shadow-[0_4px_10px_rgba(123,104,108,0.25)]"
                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  />
                )}
                <span className="relative z-10 px-1 mix-blend-multiply">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
