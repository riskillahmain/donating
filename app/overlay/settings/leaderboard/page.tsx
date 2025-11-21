"use client";

import * as React from "react";
import RetroShell from "@/components/layout/RetroShell";
import DonationLeaderboard from "@/components/overlay/leaderboard/v1";
import { SettingRow, SoftToggle, SoftInput, ThemeSelector, type ThemeOption } from "@/components/settings/SettingsUI";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const defaultDonors = [
  { name: "Peach", amount: 500000, avatar: "🍑" },
  { name: "Daisy", amount: 350000, avatar: "🌼" },
  { name: "Yoshi", amount: 275000, avatar: "🦖" },
  { name: "Toad", amount: 150000, avatar: "🍄" },
  { name: "Luigi", amount: 120000, avatar: "🌿" },
];

import OverlaySettingsSkeleton from "@/components/skeletons/OverlaySettingsSkeleton";

export default function LeaderboardOverlaySettingsPage() {
  const [supabase] = React.useState(() => createClient());
  const router = useRouter();

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [overlayKey, setOverlayKey] = React.useState<string | null>(null);

  const [highlightTop, setHighlightTop] = React.useState(3);
  const [compactMode, setCompactMode] = React.useState(false);
  const [showAvatar, setShowAvatar] = React.useState(true);
  const [title, setTitle] = React.useState("TOP DONORS");
  const [subtitle, setSubtitle] = React.useState("FLOWER FUND");
  const [theme, setTheme] = React.useState<ThemeOption>('pink');

  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        const { data: existingData, error } = await supabase
          .from('overlay_leaderboards')
          .select('*')
          .eq('streamer_id', user.id)
          .single();

        let data = existingData;

        if (error && error.code === 'PGRST116') {
          const { data: newData, error: createError } = await supabase
            .from('overlay_leaderboards')
            .insert([{ 
              streamer_id: user.id,
              settings: {
                highlightTop: 3,
                compactMode: false,
                showAvatar: true,
                title: "TOP DONORS",
                subtitle: "FLOWER FUND",
                theme: 'pink'
              }
            }])
            .select()
            .single();
            
          if (createError) throw createError;
          data = newData;
        } else if (error) {
          throw error;
        }

        if (data) {
          setOverlayKey(data.key);
          const s = data.settings;
          if (s) {
            setHighlightTop(s.highlightTop ?? 3);
            setCompactMode(s.compactMode ?? false);
            setShowAvatar(s.showAvatar ?? true);
            setTitle(s.title ?? "TOP DONORS");
            setSubtitle(s.subtitle ?? "FLOWER FUND");
            setTheme(s.theme ?? 'pink');
          }
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [supabase, router]);

  const saveSettings = async () => {
    if (loading) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const settings = {
        highlightTop,
        compactMode,
        showAvatar,
        title,
        subtitle,
        theme
      };

      const { error } = await supabase
        .from('overlay_leaderboards')
        .update({ settings })
        .eq('streamer_id', user.id);

      if (error) throw error;
    } catch (err) {
      console.error("Error saving settings:", err);
    } finally {
      setSaving(false);
    }
  };

  const copyUrl = () => {
    if (overlayKey) {
      const url = `${window.location.origin}/overlay/leaderboard?key=${overlayKey}`;
      navigator.clipboard.writeText(url);
      alert("URL OBS berhasil disalin!");
    }
  };

  if (loading) return <OverlaySettingsSkeleton />;

  return (
    <RetroShell>
      <div className="mx-auto flex max-w-5xl flex-col gap-6 md:flex-row">
        <div className="flex-1 space-y-4">
          <section className="retro-card p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="retro-badge mb-2 inline-flex items-center gap-1">
              <span className="text-[13px] leading-none">⚙</span>
              <span>Pengaturan overlay leaderboard</span>
            </div>
            <p className="mb-4 text-sm text-[rgba(126,107,111,0.95)]">
              Atur cara leaderboard donasi tampil di overlay. Fokus pada highlight
              pendukung utama dan gaya visual yang tetap lembut.
            </p>
            <div className="space-y-4 text-xs text-[rgba(126,107,111,0.95)]">
              <SettingRow label="Tema warna" description="Pilih nuansa warna dasar.">
                <ThemeSelector value={theme} onChange={setTheme} />
              </SettingRow>

              <SettingRow label="Judul" description="Teks judul utama di atas leaderboard.">
                <SoftInput 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="TOP DONORS"
                  className="w-32 text-right"
                />
              </SettingRow>

              <SettingRow label="Sub-judul" description="Teks dekoratif di bawah judul.">
                <SoftInput 
                  value={subtitle} 
                  onChange={(e) => setSubtitle(e.target.value)} 
                  placeholder="FLOWER FUND"
                  className="w-32 text-right"
                />
              </SettingRow>

              <SettingRow label="Highlight top N" description="Jumlah pendukung teratas yang diberi penekanan khusus.">
                <input
                  type="number"
                  min={1}
                  max={defaultDonors.length}
                  value={highlightTop}
                  onChange={(e) => setHighlightTop(Math.max(1, Math.min(defaultDonors.length, Number(e.target.value))))}
                  className="w-16 rounded-full border border-[rgba(242,217,208,0.9)] bg-[rgba(255,249,237,0.96)] px-2 py-1 text-right text-[11px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,184,201,0.8)]"
                />
              </SettingRow>

              <SettingRow label="Mode compact" description="Gunakan layout yang lebih rapat untuk scene yang padat.">
                <SoftToggle on={compactMode} onChange={setCompactMode} />
              </SettingRow>

              <SettingRow label="Tampilkan avatar" description="Tampilkan icon/emoji avatar di samping nama pendukung.">
                <SoftToggle on={showAvatar} onChange={setShowAvatar} />
              </SettingRow>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={saveSettings}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--text-main)] px-4 py-1.5 text-[11px] font-medium text-white shadow-lg transition-transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-70"
                >
                  {saving ? "Menyimpan..." : "Simpan Pengaturan"}
                </button>

                <button
                  type="button"
                  onClick={copyUrl}
                  className="inline-flex items-center gap-2 rounded-full bg-[rgba(59,47,50,0.05)] px-3 py-1.5 text-[11px] font-medium text-[rgba(80,65,68,0.6)] hover:bg-[rgba(59,47,50,0.1)] transition-colors"
                >
                  <span>Copy OBS URL</span>
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="flex-1">
          <section className="retro-card flex items-center justify-center bg-[rgba(9,8,19,0.96)] p-3 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            <div className="w-full max-w-xl scale-90 transform md:scale-100">
              <DonationLeaderboard
                donors={defaultDonors.map((d) => ({ ...d, avatar: showAvatar ? d.avatar : undefined }))}
                highlightTop={highlightTop}
                compact={compactMode}
                title={title}
                subtitle={subtitle}
                theme={theme}
              />
            </div>
          </section>
        </div>
      </div>
    </RetroShell>
  );
}
