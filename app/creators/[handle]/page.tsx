"use client";

import React from "react";
import { notFound } from "next/navigation";
import RetroShell from "@/components/layout/RetroShell";
import ScrollFadeIn from "@/components/animations/ScrollFadeIn";

const creators = [
  {
    handle: "sketchnova",
    display: "@sketchnova",
    label: "Ilustrator harian",
    category: "Ilustrasi & komik",
    avgAmount: "Rp 32.000",
    supporters: 184,
    bio: "Sketsa lembut setiap hari, cocok menemani kopi sore dan malam yang tenang.",
  },
  {
    handle: "pixelbloom",
    display: "@pixelbloom",
    label: "Streamer santai",
    category: "Streaming & gaming",
    avgAmount: "Rp 27.000",
    supporters: 139,
    bio: "Streaming game pelan-pelan, obrolan hangat dan suasana cozy buat rebahan.",
  },
  {
    handle: "ceritakita",
    display: "@ceritakita",
    label: "Podcaster cerita malam",
    category: "Podcast & cerita",
    avgAmount: "Rp 18.500",
    supporters: 96,
    bio: "Cerita-cerita pendek sebelum tidur, dengan tone lembut dan penuh empati.",
  },
  {
    handle: "lofigarden",
    display: "@lofigarden",
    label: "Musisi lo-fi",
    category: "Musik & audio",
    avgAmount: "Rp 21.000",
    supporters: 112,
    bio: "Beat lo-fi bertema taman dan hujan kecil, dibuat untuk fokus dan istirahat.",
  },
];

function getCreator(handle: string) {
  return creators.find((c) => c.handle === handle);
}

export default function CreatorDetailPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = React.use(params);
  const creator = getCreator(handle);

  if (!creator) {
    notFound();
  }

  return (
    <RetroShell>
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <ScrollFadeIn as="section" className="retro-card p-4" amount={0.4}>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-3xl bg-[rgba(255,184,201,0.7)] text-sm font-semibold text-[rgba(59,47,50,0.98)]">
                {creator.display.charAt(1).toUpperCase()}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-[rgba(59,47,50,0.98)]">
                  {creator.display}
                </span>
                <span className="text-xs text-[rgba(126,107,111,0.95)]">
                  {creator.label}
                </span>
                <span className="text-[11px] text-[rgba(157,135,139,0.95)]">
                  {creator.category}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 text-[11px] text-[rgba(126,107,111,0.95)]">
              <span className="retro-chip border-none bg-transparent px-2 py-1 text-[11px]">
                Avg donasi {creator.avgAmount}
              </span>
              <span>{creator.supporters} pendukung total</span>
            </div>
          </div>
        </ScrollFadeIn>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <ScrollFadeIn as="section" className="retro-card p-4 flex flex-col gap-3" amount={0.35}>
            <div className="retro-badge inline-flex items-center gap-1">
              <span className="text-[13px] leading-none">✦</span>
              <span>Tentang kreator</span>
            </div>
            <p className="text-sm leading-relaxed text-[rgba(126,107,111,0.95)]">
              {creator.bio}
            </p>
            <p className="text-xs text-[rgba(157,135,139,0.95)]">
              Halaman ini masih dummy, tapi bisa diperluas menjadi profil lengkap
              dengan goals, rewards, dan riwayat donasi.
            </p>
          </ScrollFadeIn>

          <ScrollFadeIn as="section" className="retro-card p-4 flex flex-col gap-3" amount={0.35}>
            <div className="retro-badge inline-flex items-center gap-1">
              <span className="text-[13px] leading-none">☘</span>
              <span>Simulasi donasi</span>
            </div>
            <p className="text-xs text-[rgba(126,107,111,0.95)]">
              Bayangkan form donasi kreator di sini: nominal pilihan, pesan singkat,
              dan tombol dengan animasi lembut.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] text-[rgba(126,107,111,0.95)]">
              {["Rp 10.000", "Rp 25.000", "Rp 50.000", "Rp 100.000"].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  className="retro-chip hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(123,104,108,0.22)] transition-transform"
                >
                  {amount}
                </button>
              ))}
            </div>
          </ScrollFadeIn>
        </div>
      </div>
    </RetroShell>
  );
}
