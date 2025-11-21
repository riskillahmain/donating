"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import DonationAlert from "@/components/overlay/alert/v1";
import { useSearchParams } from "next/navigation";

type AlertSettings = {
  showVideo: boolean;
  durationMs: number;
  enableSocialLinks: boolean;
  title: string;
  footerText: string;
  theme: 'pink' | 'blue' | 'green' | 'purple';
};

export default function AlertOverlayPage() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const supabase = createClient();

  const [settings, setSettings] = useState<AlertSettings | null>(null);
  const [currentDonation, setCurrentDonation] = useState<any>(null);
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Settings & Streamer ID by Key
  useEffect(() => {
    if (!key) {
      const timer = setTimeout(() => {
        setError("Missing overlay key");
        setLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    const init = async () => {
      const { data, error } = await supabase
        .from('overlay_alerts')
        .select('streamer_id, settings')
        .eq('key', key)
        .single();

      if (error || !data) {
        setError("Invalid overlay key");
        setLoading(false);
        return;
      }

      setSettings(data.settings);
      const streamerId = data.streamer_id;
      setLoading(false);

      // 2. Subscribe to Realtime Donations
      console.log('Subscribing to donations for streamer:', streamerId);
      
      const channel = supabase
        .channel('public:donations')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'donations',
            filter: `streamer_id=eq.${streamerId}`,
          },
          (payload) => {
            console.log('New donation received:', payload);
            setQueue((prev) => [...prev, payload.new]);
          }
        )
        .subscribe((status) => {
          console.log('Subscription status:', status);
        });

      return () => {
        supabase.removeChannel(channel);
      };
    };

    init();
  }, [key, supabase]);

  // 3. Process Queue
  useEffect(() => {
    if (!currentDonation && queue.length > 0) {
      const timer = setTimeout(() => {
        const next = queue[0];
        setCurrentDonation(next);
        setQueue((prev) => prev.slice(1));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentDonation, queue]);

  const handleClose = () => {
    setCurrentDonation(null);
  };

  if (loading) return <div className="text-white">Loading config...</div>;
  if (error) return <div className="text-red-500 bg-black p-4">{error}</div>;
  if (!settings) return null;

  return (
    <DonationAlert
      visible={!!currentDonation}
      name={currentDonation?.sender_name || "Anonymous"}
      amount={currentDonation?.amount || 0}
      message={currentDonation?.message}
      avatar={currentDonation?.avatar_url} // Belum ada di tabel donations, mungkin perlu fetch profile sender jika registered user
      durationMs={settings.durationMs}
      onClose={handleClose}
      youtubeUrl={settings.showVideo ? currentDonation?.youtube_url : undefined}
      tiktokUrl={settings.showVideo ? currentDonation?.tiktok_url : undefined}
      igUrl={settings.showVideo ? currentDonation?.instagram_url : undefined}
      title={settings.title}
      footerText={settings.footerText}
      theme={settings.theme}
    />
  );
}
