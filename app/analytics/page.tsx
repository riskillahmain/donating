"use client";

import { motion } from "framer-motion";
import RetroShell from "@/components/layout/RetroShell";
import SoftChart from "@/components/dashboard/SoftChart";
import ScrollFadeIn from "@/components/animations/ScrollFadeIn";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AnalyticsPage() {
  return (
    <RetroShell>
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <ScrollFadeIn as={motion.section} className="retro-card p-4" amount={0.3}>
          <motion.div
            className="mb-2 flex items-center justify-between"
            variants={fadeUp}
            transition={{ duration: 0.35 }}
          >
            <div>
              <div className="retro-badge inline-flex items-center gap-1">
                <span className="text-[13px] leading-none">◎</span>
                <span>Analitik donasi</span>
              </div>
              <p className="mt-2 text-sm text-[rgba(126,107,111,0.95)]">
                Pola donasi mingguan lintas kreator, diringkas dengan gaya lembut.
              </p>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} transition={{ duration: 0.45 }}>
            <SoftChart />
          </motion.div>
        </ScrollFadeIn>
      </div>
    </RetroShell>
  );
}
