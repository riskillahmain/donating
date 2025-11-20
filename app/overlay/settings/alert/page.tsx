"use client";

import * as React from "react";
import RetroShell from "@/components/layout/RetroShell";
import ScrollFadeIn from "@/components/animations/ScrollFadeIn";
import DonationAlert from "@/components/overlay/alert/v1";
import { SettingRow, SoftToggle, SoftInput, ThemeSelector, type ThemeOption } from "@/components/settings/SettingsUI";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const demoAlert = {
  name: "Peach",
  amount: 250000,
  message: "For the flower kingdom!",
  avatar: "🍑",
};

import OverlaySettingsSkeleton from "@/components/skeletons/OverlaySettingsSkeleton";

export default function AlertOverlaySettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [overlayKey, setOverlayKey] = React.useState<string | null>(null);

  // Settings State
  const [visible, setVisible] = React.useState(true);
  const [showVideo, setShowVideo] = React.useState(true);
  const [durationMs, setDurationMs] = React.useState(4000);
  const [enableSocialLinks, setEnableSocialLinks] = React.useState(true);
  const [title, setTitle] = React.useState("NEW DONATION");
  const [footerText, setFooterText] = React.useState("THANK YOU FOR WATERING THE FLOWERS");
  const [theme, setTheme] = React.useState<ThemeOption>('pink');

  // Fetch settings on load
  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        // Fetch existing settings
        let { data, error } = await supabase
          .from('overlay_alerts')
          .select('*')
          .eq('streamer_id', user.id)
          .single();

        if (error && error.code === 'PGRST116') {
          // Not found, create default
          const { data: newData, error: createError } = await supabase
            .from('overlay_alerts')
            .insert([{ 
              streamer_id: user.id,
              settings: {
                showVideo: true,
                durationMs: 4000,
                enableSocialLinks: true,
                title: "NEW DONATION",
                footerText: "THANK YOU FOR WATERING THE FLOWERS",
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

        // Apply settings
        if (data) {
          setOverlayKey(data.key);
          const s = data.settings;
          if (s) {
            setShowVideo(s.showVideo ?? true);
            setDurationMs(s.durationMs ?? 4000);
            setEnableSocialLinks(s.enableSocialLinks ?? true);
            setTitle(s.title ?? "NEW DONATION");
            setFooterText(s.footerText ?? "THANK YOU FOR WATERING THE FLOWERS");
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
  }, []);

  // Auto-save when settings change (debounced ideally, but direct for now)
  const saveSettings = async () => {
    if (loading) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const settings = {
        showVideo,
        durationMs,
        enableSocialLinks,
        title,
        footerText,
        theme
      };

      const { error } = await supabase
        .from('overlay_alerts')
        .update({ settings })
        .eq('streamer_id', user.id);

      if (error) throw error;
    } catch (err) {
      console.error("Error saving settings:", err);
    } finally {
      setSaving(false);
    }
  };

  // Trigger save on change (manual trigger via useEffect is risky for loops, so we'll use a save button or effect dependency)
  // For better UX, let's add a "Simpan" button or auto-save with debounce. 
  // But since the request didn't specify, let's use a manual Save button for clarity.
  
  const handleTest = () => {
    setVisible(false);
    setTimeout(() => setVisible(true), 20);
  };

  const copyUrl = () => {
    if (overlayKey) {
      const url = `${window.location.origin}/overlay/alert?key=${overlayKey}`;
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
              <span>Pengaturan overlay alert</span>
            </div>
            <p className="mb-4 text-sm text-[rgba(126,107,111,0.95)]">
              Atur perilaku dan tampilan alert donasi yang muncul di OBS.
            </p>
            <div className="space-y-4 text-xs text-[rgba(126,107,111,0.95)]">
              <SettingRow label="Tema warna" description="Pilih nuansa warna dasar untuk alert.">
                <ThemeSelector value={theme} onChange={setTheme} />
              </SettingRow>

              <SettingRow label="Judul alert" description="Teks kecil di pojok kiri atas alert.">
                <SoftInput 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="NEW DONATION"
                  className="w-32 text-right"
                />
              </SettingRow>

              <SettingRow label="Pesan footer" description="Teks dekoratif di bawah nama donatur.">
                <SoftInput 
                  value={footerText} 
                  onChange={(e) => setFooterText(e.target.value)} 
                  placeholder="THANK YOU..."
                  className="w-48 text-right"
                />
              </SettingRow>

              <SettingRow label="Durasi tampil" description="Berapa lama alert tampil sebelum menghilang.">
                <input
                  type="range"
                  min={2000}
                  max={8000}
                  step={500}
                  value={durationMs}
                  onChange={(e) => setDurationMs(Number(e.target.value))}
                  className="w-32 accent-[#ffb8c9]"
                />
                <span className="ml-2 w-16 text-right tabular-nums">
                  {(durationMs / 1000).toFixed(1)}s
                </span>
              </SettingRow>

              <SettingRow label="Tampilkan video" description="Tampilkan embed video (YouTube, TikTok, dll) di bawah alert.">
                <SoftToggle on={showVideo} onChange={setShowVideo} />
              </SettingRow>

              <SettingRow label="Link sosial" description="Tampilkan link ke sosial media kreator di dalam alert.">
                <SoftToggle on={enableSocialLinks} onChange={setEnableSocialLinks} />
              </SettingRow>

              <div className="pt-4 flex items-center justify-between gap-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleTest}
                    className="inline-flex items-center gap-2 rounded-full border border-[rgba(242,217,208,0.9)] bg-[rgba(255,249,237,0.96)] px-3 py-1.5 text-[11px] font-medium text-[rgba(80,65,68,0.9)] shadow-[0_3px_8px_rgba(123,104,108,0.25)] transition-transform hover:-translate-y-0.5 active:scale-95"
                  >
                    <span className="text-[13px]">▶</span>
                    <span>Test</span>
                  </button>

                  <button
                    type="button"
                    onClick={saveSettings}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--text-main)] px-4 py-1.5 text-[11px] font-medium text-white shadow-lg transition-transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-70"
                  >
                    {saving ? "Menyimpan..." : "Simpan Pengaturan"}
                  </button>
                </div>

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
          <section className="retro-card flex min-h-[500px] items-center justify-center bg-[rgba(9,8,19,0.96)] p-3 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            <div className="w-full max-w-xl scale-90 transform md:scale-100">
              <DonationAlert
                name={demoAlert.name}
                amount={demoAlert.amount}
                message={demoAlert.message}
                avatar={demoAlert.avatar}
                visible={visible}
                durationMs={durationMs}
                onClose={() => setVisible(false)}
                youtubeUrl={showVideo ? "https://youtu.be/sVTBz2FFbp8?si=GPYA91v8ERfj-L8U" : undefined}
                tiktokUrl={enableSocialLinks ? "https://www.tiktok.com/@peach/video/7353423222845442310" : undefined}
                igUrl={enableSocialLinks ? "https://www.instagram.com/peach/" : undefined}
                title={title}
                footerText={footerText}
                theme={theme}
              />
            </div>
          </section>
        </div>
      </div>
    </RetroShell>
  );
}
