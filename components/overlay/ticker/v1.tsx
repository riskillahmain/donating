"use client";

import { motion } from "framer-motion";

type ThemeOption = 'pink' | 'blue' | 'green' | 'purple';

type DonationTickerItem = {
  name: string;
  amount: number;
  message?: string;
  avatar?: string;
};

type DonationTickerProps = {
  items: DonationTickerItem[];
  speed?: number;
  theme?: ThemeOption;
  title?: string;
};

const themes: Record<ThemeOption, {
  border: string;
  bg: string;
  badge: { bg: string; text: string };
  card: { bg: string; shadow: string; text: string; subText: string };
  icon: { bg: string; text: string; shadow: string };
}> = {
  pink: {
    border: 'border-[#f7cfe0]',
    bg: 'bg-white',
    badge: { bg: 'bg-[#ffe0f0]', text: 'text-[#f29bb2]' },
    card: { bg: 'bg-[#ffffff]/80', shadow: 'shadow-[0_4px_0_0_rgba(244,180,207,0.8)]', text: 'text-[#f26d9b]', subText: 'text-[#f19bb4]' },
    icon: { bg: 'bg-[#fff0f7]', text: 'text-[#f18faf]', shadow: 'shadow-[0_2px_0_0_rgba(244,180,207,0.8)]' },
  },
  blue: {
    border: 'border-[#bce0fd]',
    bg: 'bg-[#f8fbff]',
    badge: { bg: 'bg-[#d6edff]', text: 'text-[#4a90e2]' },
    card: { bg: 'bg-[#ffffff]/90', shadow: 'shadow-[0_4px_0_0_rgba(162,210,247,0.8)]', text: 'text-[#4a90e2]', subText: 'text-[#7aa8ff]' },
    icon: { bg: 'bg-[#eff8ff]', text: 'text-[#7aa8ff]', shadow: 'shadow-[0_2px_0_0_rgba(162,210,247,0.8)]' },
  },
  green: {
    border: 'border-[#bcead5]',
    bg: 'bg-[#f9fdfb]',
    badge: { bg: 'bg-[#d1f0e1]', text: 'text-[#46966e]' },
    card: { bg: 'bg-[#ffffff]/90', shadow: 'shadow-[0_4px_0_0_rgba(152,214,185,0.8)]', text: 'text-[#56ab81]', subText: 'text-[#84cca5]' },
    icon: { bg: 'bg-[#effaf5]', text: 'text-[#84cca5]', shadow: 'shadow-[0_2px_0_0_rgba(152,214,185,0.8)]' },
  },
  purple: {
    border: 'border-[#e0c3fc]',
    bg: 'bg-[#fbf7ff]',
    badge: { bg: 'bg-[#eadbff]', text: 'text-[#8e60c9]' },
    card: { bg: 'bg-[#ffffff]/90', shadow: 'shadow-[0_4px_0_0_rgba(203,178,232,0.8)]', text: 'text-[#9b72cf]', subText: 'text-[#b392db]' },
    icon: { bg: 'bg-[#f5eaff]', text: 'text-[#b392db]', shadow: 'shadow-[0_2px_0_0_rgba(203,178,232,0.8)]' },
  }
};

export default function DonationTicker({ items, speed = 40, theme = 'pink', title = "LIVE DONATIONS" }: DonationTickerProps) {
  if (!items || items.length === 0) return null;

  const repeated = [...items, ...items];
  const t = themes[theme];

  return (
    <div className={`relative w-full overflow-hidden rounded-full border-2 ${t.border} ${t.bg} py-2`}>
      <div className={`pointer-events-none absolute -top-2 left-3 flex gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] ${t.badge.text}`}>
        <span className={`rounded-full ${t.badge.bg} px-2 py-0.5`}>{title}</span>
      </div>

      <div className={`pointer-events-none absolute -bottom-2 right-3 flex gap-1 text-[8px] font-medium uppercase tracking-[0.16em] ${t.badge.text}`}>
        <span className={`rounded-full ${t.badge.bg} px-2 py-0.5`}>THANK YOU</span>
      </div>

      <div className="relative flex items-center">
        <motion.div
          className="flex min-w-full items-center gap-6 px-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: speed,
          }}
        >
          {repeated.map((item, index) => (
            <div
              key={`${item.name}-${index}-${item.amount}`}
              className={`flex items-center gap-3 rounded-2xl ${t.card.bg} px-4 py-2 ${t.card.shadow}`}
            >
              <div className={`flex h-7 w-7 items-center justify-center rounded-full ${t.icon.bg} text-xs font-bold ${t.icon.text} ${t.icon.shadow}`}>
                {item.avatar ?? "🌸"}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${t.card.text}`}>{item.name}</span>
                  <span className={`rounded-full ${t.badge.bg} px-2 py-[2px] text-[9px] font-semibold uppercase tracking-[0.16em] ${t.card.subText}`}>
                    Rp{item.amount.toLocaleString("id-ID")}
                  </span>
                </div>
                {item.message && <span className={`text-[10px] ${t.card.subText}`}>“{item.message}”</span>}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}