"use client";

import * as React from "react";
import RetroShell from "@/components/layout/RetroShell";
import DonationTicker from "@/components/overlay/ticker/v1";
import { SettingRow, SoftToggle, SoftInput, ThemeSelector, type ThemeOption } from "@/components/settings/SettingsUI";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const baseItems = [
  { name: "Peach", amount: 500000, message: "For the flower kingdom!", avatar: "🍑" },
  { name: "Daisy", amount: 350000, message: "Bloom bloom bloom ✿", avatar: "🌼" },
  { name: "Yoshi", amount: 275000, message: "Jumping in to help!", avatar: "🦖" },
  { name: "Toad", amount: 150000, message: "Mushroom power!", avatar: "🍄" },
];

import OverlaySettingsSkeleton from "@/components/skeletons/OverlaySettingsSkeleton";

export default function TickerOverlaySettingsPage() {
  const [supabase] = React.useState(() => createClient());
  const router = useRouter();

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [overlayKey, setOverlayKey] = React.useState<string | null>(null);

  const [speed, setSpeed] = React.useState(35);
  const [repeatCount, setRepeatCount] = React.useState(2);
  const [showMessage, setShowMessage] = React.useState(true);
  const [title, setTitle] = React.useState("LIVE DONATIONS");
  const [theme, setTheme] = React.useState<ThemeOption>('pink');

  const items = React.useMemo(
    () =>
      Array.from({ length: repeatCount }, () => baseItems)
        .flat()
        .map((item) => ({ ...item, message: showMessage ? item.message : "" })),
    [repeatCount, showMessage]
  );

  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        const { data: existingData, error } = await supabase
          .from('overlay_tickers')
          .select('*')
          .eq('streamer_id', user.id)
          .single();

        let data = existingData;

        if (error && error.code === 'PGRST116') {
          const { data: newData, error: createError } = await supabase
            .from('overlay_tickers')
            .insert([{ 
              streamer_id: user.id,
              settings: {
                speed: 35,
                repeatCount: 2,
                showMessage: true,
                title: "LIVE DONATIONS",
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
            setSpeed(s.speed ?? 35);
            setRepeatCount(s.repeatCount ?? 2);
            setShowMessage(s.showMessage ?? true);
            setTitle(s.title ?? "LIVE DONATIONS");
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
        speed,
        repeatCount,
        showMessage,
        title,
        theme
      };

      const { error } = await supabase
        .from('overlay_tickers')
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
      const url = `${window.location.origin}/overlay/ticker?key=${overlayKey}`;
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
              <span>Pengaturan overlay ticker</span>
            </div>
            <p className="mb-4 text-sm text-[rgba(126,107,111,0.95)]">
              Atur kecepatan dan isi teks ticker donasi yang berjalan di bagian bawah
              layout OBS kamu.
            </p>
            <div className="space-y-4 text-xs text-[rgba(126,107,111,0.95)]">
              <SettingRow label="Tema warna" description="Pilih nuansa warna dasar.">
                <ThemeSelector value={theme} onChange={setTheme} />
              </SettingRow>

              <SettingRow label="Label ticker" description="Teks label kecil di pojok kiri atas ticker.">
                <SoftInput 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="LIVE DONATIONS"
                  className="w-32 text-right"
                />
              </SettingRow>

              <SettingRow label="Kecepatan" description="Semakin tinggi nilai, semakin cepat ticker bergerak.">
                <input
                  type="range"
                  min={15}
                  max={60}
                  step={1}
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-32 accent-[#ffb8c9]"
                />
                <span className="ml-2 w-16 text-right tabular-nums">{speed}</span>
              </SettingRow>

              <SettingRow label="Panjang loop" description="Berapa kali daftar donasi diulang dalam satu loop.">
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={repeatCount}
                  onChange={(e) => setRepeatCount(Math.max(1, Math.min(6, Number(e.target.value))))}
                  className="w-16 rounded-full border border-[rgba(242,217,208,0.9)] bg-[rgba(255,249,237,0.96)] px-2 py-1 text-right text-[11px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,184,201,0.8)]"
                />
              </SettingRow>

              <SettingRow label="Tampilkan pesan" description="Sembunyikan atau tampilkan pesan donasi di dalam ticker.">
                <SoftToggle on={showMessage} onChange={setShowMessage} />
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
              <DonationTicker items={items} speed={speed} theme={theme} title={title} />
            </div>
          </section>
        </div>
      </div>
    </RetroShell>
  );
}
