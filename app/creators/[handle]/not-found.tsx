"use client";

import RetroShell from "@/components/layout/RetroShell";
import ScrollFadeIn from "@/components/animations/ScrollFadeIn";

export default function CreatorNotFound() {
  return (
    <RetroShell>
      <div className="mx-auto flex max-w-md flex-col gap-4">
        <ScrollFadeIn as="section" className="retro-card p-4" amount={0.4}>
          <div className="retro-badge mb-2 inline-flex items-center gap-1">
            <span className="text-[13px] leading-none">?</span>
            <span>Kreator tidak ditemukan</span>
          </div>
          <p className="text-sm text-[rgba(126,107,111,0.95)]">
            Kami tidak menemukan halaman kreator yang kamu cari. Coba cek lagi link
            atau kembali ke daftar kreator.
          </p>
        </ScrollFadeIn>
      </div>
    </RetroShell>
  );
}
