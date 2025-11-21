"use client";

import * as React from "react";
import RetroShell from "@/components/layout/RetroShell";
import ScrollFadeIn from "@/components/animations/ScrollFadeIn";
import { createClient } from "@/utils/supabase/client";
import { SettingRow, SoftInput, SoftToggle } from "@/components/settings/SettingsUI";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import Image from "next/image";

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  
  // Form State
  const [username, setUsername] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);

  // Fetch profile on load
  React.useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        setUser(user);

        const { data, error } = await supabase
          .from("profiles")
          .select("username, display_name, bio, avatar_url")
          .eq("id", user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.warn("Error loading profile:", error.message);
        }

        if (data) {
          setUsername(data.username || "");
          setDisplayName(data.display_name || "");
          setBio(data.bio || "");
          setAvatarUrl(data.avatar_url);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [supabase, router]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    const file = e.target.files[0];
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const updateProfile = async () => {
    try {
      setSaving(true);
      if (!user) throw new Error("No user");

      const reserved = ['settings', 'login', 'register', 'auth', 'dashboard', 'analytics', 'overlay', 'creators', 'api', 'admin'];
      if (reserved.includes(username.toLowerCase())) {
        throw new Error("Username ini tidak tersedia (reserved).");
      }

      let newAvatarPath = avatarUrl;

      // 1. Upload Avatar if changed
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile);

        if (uploadError) throw uploadError;

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);
        newAvatarPath = publicUrl;
      }

      // 2. Update Profile Data
      const updates = {
        id: user.id,
        username,
        display_name: displayName,
        bio,
        avatar_url: newAvatarPath,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) throw error;

      alert("Profil berhasil diperbarui!");
    } catch (error: unknown) {
      alert((error as Error).message || "Gagal memperbarui profil.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <RetroShell>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <ScrollFadeIn as="section" className="retro-card p-6" amount={0.4}>
          <div className="retro-badge mb-4 inline-flex items-center gap-1">
            <span className="text-[13px] leading-none">☻</span>
            <span>Profil Kreator</span>
          </div>
          
          <p className="mb-6 text-sm text-[rgba(126,107,111,0.95)]">
            Informasi ini akan tampil di halaman publik dan overlay donasi kamu.
            Buatlah semenarik dan sehangat mungkin.
          </p>

          <div className="flex flex-col gap-6 sm:flex-row">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-3 sm:items-start">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-[rgba(255,255,255,0.8)] bg-[rgba(255,249,237,1)] shadow-lg shadow-[rgba(123,104,108,0.15)]">
                {avatarPreview || avatarUrl ? (
                  <Image
                    src={avatarPreview || avatarUrl!}
                    alt="Avatar"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl text-[rgba(255,184,201,0.8)]">
                    ✿
                  </div>
                )}
                
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/0 text-transparent transition-all hover:bg-black/20 hover:text-white/90"
                >
                  <span className="text-xs font-medium">Ubah</span>
                </label>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <span className="text-[10px] text-[rgba(157,135,139,0.95)]">
                Klik gambar untuk mengganti
              </span>
            </div>

            {/* Form Fields */}
            <div className="flex-1 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-main)] uppercase tracking-wider">
                  Username (Handle)
                </label>
                <SoftInput
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="username_unik"
                  className="w-full bg-white"
                />
                <p className="text-[10px] text-[rgba(157,135,139,0.95)]">
                  kreasipay.com/creators/<strong>{username || "username"}</strong>
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-main)] uppercase tracking-wider">
                  Nama Tampilan
                </label>
                <SoftInput
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Nama Keren Kamu"
                  className="w-full bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-main)] uppercase tracking-wider">
                  Bio Singkat
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-[rgba(242,217,208,0.9)] bg-white px-3 py-2 text-sm text-[var(--text-main)] placeholder-[rgba(126,107,111,0.4)] outline-none focus:border-[var(--accent-pink)] focus:ring-1 focus:ring-[var(--accent-pink)]"
                  placeholder="Ceritakan sedikit tentang dirimu..."
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={updateProfile}
                  disabled={saving || loading}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--text-main)] px-6 py-2 text-xs font-semibold text-white shadow-lg shadow-[rgba(59,47,50,0.15)] transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Perubahan"
                  )}
                </button>
              </div>
            </div>
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn as="section" className="retro-card p-4 opacity-70" amount={0.4}>
           <SettingRow label="Reduce motion" description="Kurangi animasi untuk pengalaman donasi yang lebih tenang.">
             <SoftToggle on={false} onChange={() => {}} />
           </SettingRow>
        </ScrollFadeIn>
      </div>
    </RetroShell>
  );
}
