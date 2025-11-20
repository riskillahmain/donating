"use client";

import { motion } from "framer-motion";

type Supporter = {
  name: string;
  amount: number;
};

type Props = {
  supporters?: Supporter[];
};

export default function TopSupporters({ supporters = [] }: Props) {
  return (
    <div className="retro-card flex h-full flex-col gap-3 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="retro-badge inline-flex items-center gap-1">
          <span className="text-[13px] leading-none">✦</span>
          <span>Top Supporters</span>
        </div>
        <span className="text-[11px] text-[rgba(126,107,111,0.9)]">Bulan ini</span>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {supporters.length === 0 ? (
           <div className="flex flex-1 items-center justify-center text-xs text-[rgba(126,107,111,0.6)]">
             Belum ada data.
           </div>
        ) : (
          supporters.map((supporter, index) => (
            <motion.div
              key={supporter.name + index}
              className="flex items-center justify-between gap-3 rounded-2xl border border-[rgba(242,217,208,0.9)] bg-[rgba(255,249,237,0.95)] px-3 py-2.5 text-left text-xs shadow-[0_3px_10px_rgba(123,104,108,0.18)]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * index, type: "spring", stiffness: 300, damping: 22 }}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(255,184,201,0.5)] text-[11px] font-semibold text-[rgba(59,47,50,0.98)]">
                  {index + 1}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[rgba(59,47,50,0.98)]">{supporter.name}</span>
                  <span className="text-[10px] text-[rgba(126,107,111,0.95)]">Supporter</span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[rgba(59,47,50,0.98)]">
                Rp {supporter.amount.toLocaleString("id-ID")}
              </span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

