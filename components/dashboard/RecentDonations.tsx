"use client";

import { motion } from "framer-motion";

type Donation = {
  id: string;
  sender_name: string;
  amount: number;
  message?: string;
  created_at: string;
};

type Props = {
  donations?: Donation[];
};

export default function RecentDonations({ donations = [] }: Props) {
  return (
    <div className="retro-card flex h-full flex-col gap-3 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="retro-badge inline-flex items-center gap-1">
          <span className="text-[13px] leading-none">☘</span>
          <span>Donasi terbaru</span>
        </div>
        <span className="text-[11px] text-[rgba(126,107,111,0.9)]">
          {donations.length} donasi terakhir
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto max-h-[300px] retro-scroll-soft pr-1">
        {donations.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-xs text-[rgba(126,107,111,0.6)]">
            Belum ada donasi.
          </div>
        ) : (
          donations.map((donation, index) => (
            <motion.div
              key={donation.id}
              className="flex items-start justify-between gap-2 rounded-2xl bg-[rgba(255,248,242,0.9)] px-3 py-2.5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.05 * index,
                type: "spring",
                stiffness: 280,
                damping: 22,
              }}
            >
              <div className="flex flex-1 flex-col gap-0.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-[rgba(59,47,50,0.98)]">
                    {donation.sender_name || "Anonim"}
                  </span>
                </div>
                {donation.message && (
                  <p className="text-xs text-[rgba(126,107,111,0.95)] line-clamp-2">
                    “{donation.message}”
                  </p>
                )}
                <span className="text-[10px] text-[rgba(157,135,139,0.95)]">
                  {new Date(donation.created_at).toLocaleDateString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="shrink-0 text-right text-xs font-semibold text-[rgba(59,47,50,0.98)]">
                Rp {donation.amount.toLocaleString("id-ID")}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
