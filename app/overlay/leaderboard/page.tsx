"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import DonationLeaderboard from "@/components/overlay/leaderboard/v1";
import { useSearchParams } from "next/navigation";

type LeaderboardSettings = {
  highlightTop: number;
  compactMode: boolean;
  showAvatar: boolean;
  title: string;
  subtitle: string;
  theme: 'pink' | 'blue' | 'green' | 'purple';
};

type Donor = {
  name: string;
  amount: number;
  avatar?: string;
};

export default function LeaderboardOverlayPage() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const supabase = createClient();

  const [settings, setSettings] = useState<LeaderboardSettings | null>(null);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawDonations, setRawDonations] = useState<any[]>([]);

  // Recalculate donors whenever raw data changes
  useEffect(() => {
    const map: Record<string, number> = {};
    rawDonations.forEach((d) => {
      const name = d.sender_name || "Anonim";
      map[name] = (map[name] || 0) + d.amount;
    });

    const aggregated: Donor[] = Object.entries(map)
      .map(([name, amount]) => ({
        name,
        amount,
        avatar: undefined
      }))
      .sort((a, b) => b.amount - a.amount); // Sort by highest amount

    setDonors(aggregated);
  }, [rawDonations]);

  useEffect(() => {
    if (!key) {
      const timer = setTimeout(() => {
        setError("Missing overlay key");
        setLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    const init = async () => {
      // 1. Get Settings
      const { data, error } = await supabase
        .from('overlay_leaderboards')
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

      // 2. Fetch Initial Donations
      const fetchDonations = async () => {
        const { data: donations } = await supabase
          .from('donations')
          .select('sender_name, amount')
          .eq('streamer_id', streamerId);

        if (donations) {
          setRawDonations(donations);
        }
      };

      fetchDonations();
      setLoading(false);

      // 3. Subscribe to Realtime
      const channel = supabase
        .channel('public:donations_leaderboard')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'donations',
            filter: `streamer_id=eq.${streamerId}`,
          },
          (payload) => {
            setRawDonations((prev) => [...prev, payload.new]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    init();
  }, [key, supabase]);

  if (loading) return <div className="text-white">Loading config...</div>;
  if (error) return <div className="text-red-500 bg-black p-4">{error}</div>;
  if (!settings) return null;

  return (
    <DonationLeaderboard
      donors={donors}
      highlightTop={settings.highlightTop}
      compact={settings.compactMode}
      title={settings.title}
      subtitle={settings.subtitle}
      theme={settings.theme}
    />
  );
}
