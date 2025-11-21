import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DonationForm from "@/components/donation/DonationForm";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// Force dynamic rendering because we depend on dynamic params
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ username: string }>;
};

async function getProfile(username: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, display_name, bio, avatar_url")
    .eq("username", username)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

async function getAlertSettings(streamerId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("overlay_alerts")
    .select("settings")
    .eq("streamer_id", streamerId)
    .single();

  if (error || !data) {
    // Default jika belum ada setting: anggap boleh (true) atau ikuti default platform
    return { showVideo: true }; 
  }

  return data.settings;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfile(username);

  if (!profile) {
    return {
      title: "Kreator Tidak Ditemukan",
    };
  }

  return {
    title: `Dukung ${profile.display_name || profile.username} di KreasiPay`,
    description: profile.bio || `Dukung karya ${profile.display_name} dengan donasi.`,
  };
}

export default async function PublicCreatorPage({ params }: Props) {
  const { username } = await params;
  
  // Reserved routes check (security measure if middleware fails)
  const reserved = ['settings', 'login', 'register', 'auth', 'dashboard', 'analytics', 'overlay', 'creators'];
  if (reserved.includes(username)) {
    notFound();
  }

  const profile = await getProfile(username);

  if (!profile) {
    notFound();
  }

  const alertSettings = await getAlertSettings(profile.id);
  const allowMedia = alertSettings?.showVideo ?? true;

  return (
    <div className="min-h-screen bg-[#fef6f6] px-4 py-12 retro-grid">
      <div className="mx-auto max-w-lg">
        {/* Profile Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-[#fff0f5] shadow-[0_8px_20px_rgba(123,104,108,0.15)]">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.username}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl text-[rgba(255,184,201,0.8)]">
                ✿
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-[#3b2f32] font-serif tracking-tight">
            {profile.display_name || profile.username}
          </h1>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="text-sm text-[#7e6b6f]">@{profile.username}</span>
            <span className="rounded-full bg-[#d6edff] px-2 py-0.5 text-[10px] font-semibold text-[#4a90e2]">
              VERIFIED
            </span>
          </div>
          {profile.bio && (
            <p className="mt-4 text-sm leading-relaxed text-[#7e6b6f] max-w-xs mx-auto">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Donation Card */}
        <div className="relative overflow-hidden rounded-[32px] border border-[#f2d9d0] bg-white/90 p-6 shadow-[0_20px_40px_rgba(92,76,79,0.06)] backdrop-blur-sm sm:p-8">
           <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#ffb8c9] via-[#ffe6a7] to-[#bcead5]" />
           
           <div className="mb-6 text-center">
             <h2 className="text-lg font-semibold text-[#3b2f32]">Kirim Dukungan</h2>
             <p className="text-xs text-[#9d878b]">
               Dukunganmu membantu mereka terus berkarya.
             </p>
           </div>

           <DonationForm 
             streamerName={profile.display_name || profile.username} 
             streamerId={profile.id}
             allowMedia={allowMedia}
           />
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-xs font-medium text-[#9d878b] hover:text-[#3b2f32] transition-colors">
            Powered by <span className="font-serif">KreasiPay</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
