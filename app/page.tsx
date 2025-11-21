"use client";

import { motion } from "framer-motion";
import RetroShell from "@/components/layout/RetroShell";
import InfoCard from "@/components/dashboard/InfoCard";
import SoftChart from "@/components/dashboard/SoftChart";
import RecentDonations from "@/components/dashboard/RecentDonations";
import FavoriteCreators from "@/components/dashboard/FavoriteCreators";
import ScrollFadeIn from "@/components/animations/ScrollFadeIn";

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <RetroShell>
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <motion.section
          className="grid gap-4 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ staggerChildren: 0.08, delayChildren: 0.05 }}
        >
          <ScrollFadeIn as="div" variants={sectionVariants}>
            <InfoCard title="Total donasi hari ini" value="Rp 2,48 jt" subtitle="Semua kreator" accent="pink" />
          </ScrollFadeIn>
          <ScrollFadeIn as="div" variants={sectionVariants}>
            <InfoCard title="Pendukung baru" value="73" subtitle="24 jam terakhir" accent="mint" />
          </ScrollFadeIn>
          <ScrollFadeIn as="div" variants={sectionVariants}>
            <InfoCard title="Kreator aktif" value="92" subtitle="Dalam 7 hari" accent="yellow" />
          </ScrollFadeIn>
        </motion.section>
        <motion.section
          className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.08 }}
>
          <ScrollFadeIn as="div" variants={sectionVariants}>
            <SoftChart />
          </ScrollFadeIn>
          <ScrollFadeIn as="div" variants={sectionVariants}>
            <div className="retro-card flex flex-col justify-between gap-4 p-4">
              <div>
                <div className="retro-badge mb-2 inline-flex items-center gap-1">
                  <span className="text-[13px] leading-none">❀</span>
                  <span>Ringkasan donasi</span>
                </div>
                <p className="text-sm leading-relaxed text-[rgba(126,107,111,0.95)]">
                  Overview menampilkan detak lembut aktivitas donasi di platform. Angka-angka
                  dirancang agar terasa ringan, bukan mengintimidasi.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-[rgba(126,107,111,0.95)]">
                <div className="retro-chip flex flex-col gap-1">
                  <span className="font-semibold text-[rgba(59,47,50,0.98)]">Kreator trending</span>
                  <span>4 kampanye naik daun</span>
                </div>
                <div className="retro-chip flex flex-col gap-1">
                  <span className="font-semibold text-[rgba(59,47,50,0.98)]">Jam rame</span>
                  <span>19:00 - 22:00 paling banyak donasi</span>
                </div>
              </div>
            </div>
          </ScrollFadeIn>
        </motion.section>
        <motion.section
          className="grid gap-4 md:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          transition={{ staggerChildren: 0.08, delayChildren: 0.05 }}
        >
          <ScrollFadeIn as="div" variants={sectionVariants}>
            <RecentDonations />
          </ScrollFadeIn>
          <ScrollFadeIn as="div" variants={sectionVariants}>
            <FavoriteCreators />
          </ScrollFadeIn>
        </motion.section>
      </div>
    </RetroShell>
  );
}
