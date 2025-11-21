"use client";

import { motion } from "framer-motion";

const creators = [
  {
    id: 1,
    handle: "@sketchnova",
    label: "Ilustrator harian",
    trend: "+32%",
  },
  {
    id: 2,
    handle: "@pixelbloom",
    label: "Streamer santai",
    trend: "+18%",
  },
  {
    id: 3,
    handle: "@ceritakita",
    label: "Podcaster cerita malam",
    trend: "+9%",
  },
];

export default function FavoriteCreators() {
  return (
    <div className="retro-card flex h-full flex-col gap-3 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="retro-badge inline-flex items-center gap-1">
          <span className="text-[13px] leading-none">✦</span>
          <span>Kreator favorit</span>
        </div>
        <span className="text-[11px] text-[rgba(126,107,111,0.9)]">Top berdasarkan donasi</span>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {creators.map((creator, index) => (
          <motion.button
            key={creator.id}
            type="button"
            className="flex items-center justify-between gap-3 rounded-2xl border border-[rgba(242,217,208,0.9)] bg-[rgba(255,249,237,0.95)] px-3 py-2.5 text-left text-xs shadow-[0_3px_10px_rgba(123,104,108,0.18)] transition-transform hover:-translate-y-0.5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * index, type: "spring", stiffness: 300, damping: 22 }}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(255,184,201,0.5)] text-[11px] font-semibold text-[rgba(59,47,50,0.98)]">
                {index + 1}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-[rgba(59,47,50,0.98)]">{creator.handle}</span>
                <span className="text-[10px] text-[rgba(126,107,111,0.95)]">{creator.label}</span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-[rgba(59,47,50,0.98)]">
              {creator.trend}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
