"use client";

import { motion } from "framer-motion";

type ChartData = {
  label: string;
  value: number; // amount
};

type Props = {
  data?: ChartData[];
};

export default function SoftChart({ data = [] }: Props) {
  // Normalize data for height percentage (max 100%)
  const maxValue = Math.max(...data.map((d) => d.value), 1); // avoid divide by zero
  
  return (
    <div className="retro-card h-64 w-full p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="retro-badge inline-flex items-center gap-1">
            <span className="text-[13px] leading-none">❁</span>
            <span>Ritme Donasi</span>
          </div>
          <p className="text-xs text-[rgba(126,107,111,0.9)]">
            Aktivitas 7 hari terakhir.
          </p>
        </div>
        <div className="retro-chip text-[11px]">Weekly</div>
      </div>
      
      {data.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-2xl bg-[rgba(255,248,242,0.9)] text-xs text-[rgba(126,107,111,0.5)]">
          Belum ada data minggu ini
        </div>
      ) : (
        <div className="flex h-40 items-end gap-2 overflow-hidden rounded-2xl bg-[rgba(255,248,242,0.9)] px-3 pb-3 pt-4">
          {data.map((item, index) => {
            const heightPercent = Math.max((item.value / maxValue) * 100, 4); // min height 4%
            return (
              <motion.div
                key={item.label}
                className="flex flex-1 flex-col items-center gap-1"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 * index, type: "spring", stiffness: 260, damping: 22 }}
              >
                <div className="relative flex w-full flex-1 items-end justify-center">
                  <motion.div
                    whileHover={{ scaleX: 1.1 }}
                    className="w-full min-w-[8px] max-w-[24px] rounded-full bg-gradient-to-t from-[rgba(255,184,201,0.7)] via-[rgba(188,234,213,0.8)] to-[rgba(168,198,255,0.7)] shadow-[0_4px_12px_rgba(123,104,108,0.15)]"
                    style={{ height: `${heightPercent}%` }}
                  >
                    {/* Tooltip Value on Hover (Simple text inside if tall enough, or title attr) */}
                  </motion.div>
                </div>
                <span className="text-[10px] text-[rgba(126,107,111,0.9)] truncate w-full text-center">
                  {item.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
