"use client";

import { motion } from "framer-motion";

const donations = [
  {
    id: 1,
    supporter: "anonymouse",
    creator: "@sketchnova",
    amount: "Rp 50.000",
    message: "buat kopi dan terus berkarya ya!",
    ago: "2 menit lalu",
  },
  {
    id: 2,
    supporter: "suka_chill",
    creator: "@pixelbloom",
    amount: "Rp 120.000",
    message: "stream semalam calming banget",
    ago: "15 menit lalu",
  },
  {
    id: 3,
    supporter: "bintang.tiga",
    creator: "@ceritakita",
    amount: "Rp 25.000",
    message: "episode podcast hari ini relate parah",
    ago: "32 menit lalu",
  },
];

export default function RecentDonations() {
  return (
    <div className="retro-card flex h-full flex-col gap-3 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="retro-badge inline-flex items-center gap-1">
          <span className="text-[13px] leading-none">☘</span>
          <span>Donasi terbaru</span>
        </div>
        <span className="text-[11px] text-[rgba(126,107,111,0.9)]">Realtime dummy data</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-hidden">
        {donations.map((donation, index) => (
          <motion.div
            key={donation.id}
            className="flex items-start justify-between gap-2 rounded-2xl bg-[rgba(255,248,242,0.9)] px-3 py-2.5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index, type: "spring", stiffness: 280, damping: 22 }}
          >
            <div className="flex flex-1 flex-col gap-0.5">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-[rgba(59,47,50,0.98)]">{donation.supporter}</span>
                <span className="text-[10px] text-[rgba(126,107,111,0.9)]">→ {donation.creator}</span>
              </div>
              <p className="text-xs text-[rgba(126,107,111,0.95)] line-clamp-2">
                “{donation.message}”
              </p>
              <span className="text-[10px] text-[rgba(157,135,139,0.95)]">{donation.ago}</span>
            </div>
            <div className="shrink-0 text-right text-xs font-semibold text-[rgba(59,47,50,0.98)]">
              {donation.amount}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
