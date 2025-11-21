"use client";

import { motion } from "framer-motion";

const data = [
  { label: "Mon", value: 40 },
  { label: "Tue", value: 64 },
  { label: "Wed", value: 52 },
  { label: "Thu", value: 76 },
  { label: "Fri", value: 68 },
  { label: "Sat", value: 48 },
  { label: "Sun", value: 58 },
];

export default function SoftChart() {
  return (
    <div className="retro-card h-64 w-full p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="retro-badge inline-flex items-center gap-1">
            <span className="text-[13px] leading-none">❁</span>
            <span>Garden rhythm</span>
          </div>
          <p className="text-xs text-[rgba(126,107,111,0.9)]">
            Weekly soft-growth pattern.
          </p>
        </div>
        <div className="retro-chip text-[11px]">Past 7 days</div>
      </div>
      <div className="flex h-40 items-end gap-2 overflow-hidden rounded-2xl bg-[rgba(255,248,242,0.9)] px-3 pb-3 pt-4">
        {data.map((item, index) => (
          <motion.div
            key={item.label}
            className="flex flex-1 flex-col items-center gap-1"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.08 * index, type: "spring", stiffness: 260, damping: 22 }}
          >
            <motion.div
              whileHover={{ scaleY: 1.06, translateY: -4 }}
              className="w-full rounded-full bg-gradient-to-t from-[rgba(255,184,201,0.7)] via-[rgba(188,234,213,0.8)] to-[rgba(168,198,255,0.7)] shadow-[0_8px_16px_rgba(123,104,108,0.22)]"
              style={{ height: `${item.value}%` }}
            />
            <span className="text-[11px] text-[rgba(126,107,111,0.9)]">
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
