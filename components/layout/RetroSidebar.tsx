"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Overview", icon: "◎", badge: "Ringkasan" },
  { href: "/analytics", label: "Analytics", icon: "✦", badge: "Grafik" },
  { href: "/creators", label: "Creators", icon: "☺", badge: "Kreator" },
  { href: "/overlay/settings/alert", label: "Alert overlay", icon: "✿", badge: "OBS" },
  { href: "/overlay/settings/leaderboard", label: "Leaderboard overlay", icon: "❀", badge: "OBS" },
  { href: "/overlay/settings/ticker", label: "Ticker overlay", icon: "➝", badge: "OBS" },
];

type Props = {};

export default function RetroSidebar({}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
    setLoading(false);
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0, width: 244 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="relative hidden h-full flex-col border-r border-[rgba(242,217,208,0.9)] bg-[rgba(255,249,237,0.92)]/95 px-3 py-3 sm:flex"
    >
      <div className="mb-3 flex items-center justify-between gap-2 rounded-2xl border border-[rgba(242,217,208,0.9)] bg-[radial-gradient(circle_at_0%_0%,#fff9ed,transparent_55%),radial-gradient(circle_at_120%_140%,#f3f0ff,transparent_55%)] px-3 py-2 text-[11px] text-[rgba(80,65,68,0.85)] shadow-[0_8px_20px_rgba(123,104,108,0.16)]">
        <div className="flex flex-col">
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[rgba(126,107,111,0.9)]">
            KreasiPay
          </span>
          <span className="text-[11px] font-semibold text-[rgba(59,47,50,0.98)]">
            Dashboard donasi
          </span>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(242,217,208,0.9)] bg-[rgba(255,248,242,0.95)] text-[13px] shadow-[0_4px_10px_rgba(123,104,108,0.25)]">
          ✹
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5 text-sm font-medium text-[rgba(80,65,68,0.85)]">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="relative">
              <motion.div
                className="retro-card flex items-center justify-between gap-3 px-3 py-2.5"
                initial={false}
                animate={{
                  scale: active ? 1.02 : 1,
                  boxShadow: active
                    ? "0 10px 22px rgba(123,104,108,0.25)"
                    : "0 6px 18px rgba(92,76,79,0.08)",
                }}
                whileHover={{ scale: 1.03, translateY: -1 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(255,184,201,0.45)] text-[13px]">
                    {item.icon}
                  </span>
                  <div className="flex flex-col">
                    <motion.span
                      key="label"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.2 }}
                      className="truncate text-[13px]"
                    >
                      {item.label}
                    </motion.span>
                    {item.badge && (
                      <span className="mt-0.5 inline-flex w-fit items-center gap-1 rounded-full bg-[rgba(255,249,237,0.96)] px-2 py-[2px] text-[10px] font-normal text-[rgba(157,135,139,0.95)]">
                        <span className="text-[11px]">✸</span>
                        <span>{item.badge}</span>
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 space-y-2">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full rounded-2xl border border-[rgba(242,217,208,0.9)] bg-[rgba(255,248,242,0.95)] px-3 py-2.5 text-[11px] text-[rgba(126,107,111,0.9)] shadow-[0_6px_16px_rgba(123,104,108,0.16)] transition-transform hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(123,104,108,0.2)] active:scale-[0.98]"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(255,184,201,0.55)] text-[12px]">
              ←
            </span>
            <div className="flex flex-col items-start">
              <span className="text-[11px] font-semibold text-[rgba(59,47,50,0.96)]">
                {loading ? "Logging out..." : "Keluar"}
              </span>
              <p className="text-[10px] leading-snug">
                Sampai jumpa lagi nanti!
              </p>
            </div>
          </div>
        </button>
      </div>
    </motion.aside>
  );
}
