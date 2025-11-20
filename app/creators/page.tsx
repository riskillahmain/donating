"use client";

import RetroShell from "@/components/layout/RetroShell";
import ScrollFadeIn from "@/components/animations/ScrollFadeIn";
import Link from "next/link";
import { motion } from "framer-motion";

const creators = [
  {
    id: 1,
    handle: "@sketchnova",
    label: "Ilustrator harian",
    category: "Ilustrasi & komik",
    avgAmount: "Rp 32.000",
    supporters: 184,
  },
  {
    id: 2,
    handle: "@pixelbloom",
    label: "Streamer santai",
    category: "Streaming & gaming",
    avgAmount: "Rp 27.000",
    supporters: 139,
  },
  {
    id: 3,
    handle: "@ceritakita",
    label: "Podcaster cerita malam",
    category: "Podcast & cerita",
    avgAmount: "Rp 18.500",
    supporters: 96,
  },
  {
    id: 4,
    handle: "@lofigarden",
    label: "Musisi lo-fi",
    category: "Musik & audio",
    avgAmount: "Rp 21.000",
    supporters: 112,
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export default function CreatorsPage() {
  return (
    <RetroShell>
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <ScrollFadeIn as="section" className="retro-card p-4" amount={0.4}>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="retro-badge mb-2 inline-flex items-center gap-1">
                <span className="text-[13px] leading-none">✿</span>
                <span>Daftar kreator</span>
              </div>
              <p className="text-sm text-[rgba(126,107,111,0.95)]">
                Jelajahi kreator yang aktif menerima donasi. Data masih dummy, tapi
                alurnya sudah mencerminkan platform donasi sungguhan.
              </p>
            </div>
            <div className="retro-chip mt-1 inline-flex items-center gap-1 text-[11px] md:mt-0">
              <span className="text-[13px] leading-none">◎</span>
              <span>Filter & sort coming soon</span>
            </div>
          </div>
        </ScrollFadeIn>

<motion.section
  className="grid gap-3 md:grid-cols-2"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.35 }}
  transition={{ staggerChildren: 0.06, delayChildren: 0.04 }}
>
  {creators.map((creator) => (
    <ScrollFadeIn key={creator.id} as="div" variants={itemVariants}>
      <Link
        href={`/creators/${creator.handle.replace("@", "")}`}
        className="flex w-full items-start justify-between gap-3 rounded-3xl border border-[rgba(242,217,208,0.9)] bg-[rgba(255,249,237,0.96)] px-4 py-3 text-left text-xs shadow-[0_6px_18px_rgba(123,104,108,0.16)] transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,184,201,0.8)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(255,249,237,0.96)]"
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-2xl bg-[rgba(255,184,201,0.6)] text-[13px] font-semibold text-[rgba(59,47,50,0.98)]">
            {creator.handle.charAt(1).toUpperCase()}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-semibold text-[rgba(59,47,50,0.98)]">
              {creator.handle}
            </span>
            <span className="text-[11px] text-[rgba(126,107,111,0.95)]">
              {creator.label}
            </span>
            <span className="text-[10px] text-[rgba(157,135,139,0.95)]">
              {creator.category}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-0.5 text-[11px] text-[rgba(126,107,111,0.95)]">
          <span className="retro-chip border-none bg-transparent px-0 py-0 text-[11px]">
            Avg donasi {creator.avgAmount}
          </span>
          <span className="text-[10px]">
            {creator.supporters} pendukung
          </span>
        </div>
      </Link>
    </ScrollFadeIn>
  ))}
</motion.section>
      </div>
    </RetroShell>
  );
}
