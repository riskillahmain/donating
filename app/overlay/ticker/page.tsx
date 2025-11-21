"use client";

import { useEffect, useState, Suspense } from "react";
import { createClient } from "@/utils/supabase/client";
import DonationTicker from "@/components/overlay/ticker/v1";
import { useSearchParams } from "next/navigation";

type TickerSettings = {
  speed: number;
  repeatCount: number;
  showMessage: boolean;
  title: string;
  theme: 'pink' | 'blue' | 'green' | 'purple';
};

type DonationTickerItem = {
  name: string;
  amount: number;
  message?: string;
  avatar?: string;
};

function TickerContent() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const supabase = createClient();

  const [settings, setSettings] = useState<TickerSettings | null>(null);
  const [items, setItems] = useState<DonationTickerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        .from('overlay_tickers')
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

      // 2. Fetch Last 20 Donations
      const fetchDonations = async () => {
        const { data: donations } = await supabase
          .from('donations')
          .select('sender_name, amount, message')
          .eq('streamer_id', streamerId)
          .order('created_at', { ascending: false })
          .limit(20);

        if (donations) {
          const mapped: DonationTickerItem[] = donations.map(d => ({
            name: d.sender_name || "Anonim",
            amount: d.amount,
            message: d.message || undefined,
            avatar: undefined
          }));
          setItems(mapped);
        }
      };

      fetchDonations();
      setLoading(false);

      // 3. Subscribe to Realtime
      const channel = supabase
        .channel('public:donations_ticker')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'donations',
            filter: `streamer_id=eq.${streamerId}`,
          },
          (payload) => {
            // Add new donation to top of list
            setItems((prev) => {
              const newItem: DonationTickerItem = {
                name: payload.new.sender_name || "Anonim",
                amount: payload.new.amount,
                message: payload.new.message || undefined,
                avatar: undefined
              };
              // Keep max 20 items
              return [newItem, ...prev].slice(0, 20);
            });
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

  // Filter message based on settings
  const displayItems = settings.showMessage 
    ? items 
    : items.map(i => ({ ...i, message: undefined }));

  return (
    <DonationTicker
      items={displayItems}
      speed={settings.speed}
      title={settings.title}
      theme={settings.theme}
    />
  );
}

export default function TickerOverlayPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <TickerContent />
    </Suspense>
  );
}
