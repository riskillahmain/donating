"use client";

import { motion } from "framer-motion";

type Props = {
  title: string;
  value: string;
  subtitle?: string;
  accent?: "blue" | "pink" | "yellow" | "mint";
};

const accentMap: Record<NonNullable<Props["accent"]>, string> = {
  blue: "from-[rgba(168,198,255,0.7)] to-[rgba(243,240,255,0.7)]",
  pink: "from-[rgba(255,184,201,0.7)] to-[rgba(255,246,242,0.7)]",
  yellow: "from-[rgba(255,230,167,0.7)] to-[rgba(255,249,237,0.7)]",
  mint: "from-[rgba(188,234,213,0.7)] to-[rgba(243,252,248,0.7)]",
};

export default function InfoCard({ title, value, subtitle, accent = "pink" }: Props) {
  const accentClass = accentMap[accent];

  return (
    <motion.div
      className="retro-card flex flex-col gap-2 p-4"
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 340, damping: 22 }}
    >
      <div
        className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${accentClass} px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[rgba(80,65,68,0.85)]`}
      >
        <span className="text-xs">✿</span>
        <span>{title}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-[rgba(59,47,50,0.98)]">
          {value}
        </span>
        {subtitle && (
          <span className="text-xs text-[rgba(126,107,111,0.9)]">{subtitle}</span>
        )}
      </div>
    </motion.div>
  );
}
