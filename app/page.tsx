import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import RetroShell from "@/components/layout/RetroShell";
import InfoCard from "@/components/dashboard/InfoCard";
import SoftChart from "@/components/dashboard/SoftChart";
import RecentDonations from "@/components/dashboard/RecentDonations";
import TopSupporters from "@/components/dashboard/TopSupporters";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // --- QUERIES ---

  // 1. Weekly Donations (for Chart)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const { data: weeklyData } = await supabase
    .from('donations')
    .select('amount, created_at')
    .eq('streamer_id', user.id)
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: true });

  // Aggregate for Chart
  const chartData = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue...

    // Filter data for this day
    const dayAmount = weeklyData
      ?.filter(item => item.created_at.startsWith(dateStr))
      .reduce((sum, item) => sum + item.amount, 0) || 0;

    chartData.push({ label: dayLabel, value: dayAmount });
  }

  // 2. Monthly Donations (for Stats & Top Supporters)
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const { data: monthData } = await supabase
    .from('donations')
    .select('amount, sender_name, created_at')
    .eq('streamer_id', user.id)
    .gte('created_at', firstDayOfMonth.toISOString());

  // Stats: Total Month
  const totalMonth = monthData?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

  // Top Supporters Aggregation
  const supportersMap: Record<string, number> = {};
  monthData?.forEach((d) => {
    const name = d.sender_name || "Anonim";
    supportersMap[name] = (supportersMap[name] || 0) + d.amount;
  });

  const topSupporters = Object.entries(supportersMap)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3); // Top 3

  // 3. Today Stats
  const todayStr = today.toISOString().split('T')[0];
  const todayDonations = monthData?.filter(d => d.created_at.startsWith(todayStr)) || [];
  const totalToday = todayDonations.reduce((acc, curr) => acc + curr.amount, 0);
  const countToday = todayDonations.length;

  // 4. Recent Donations
  const { data: recentDonations } = await supabase
    .from('donations')
    .select('*')
    .eq('streamer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <RetroShell>
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="grid gap-4 md:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <InfoCard 
            title="Total Hari Ini" 
            value={`Rp ${totalToday.toLocaleString('id-ID')}`} 
            subtitle="Donasi masuk" 
            accent="pink" 
          />
          <InfoCard 
            title="Transaksi Hari Ini" 
            value={countToday.toString()} 
            subtitle="Kali donasi" 
            accent="mint" 
          />
          <InfoCard 
            title="Total Bulan Ini" 
            value={`Rp ${totalMonth.toLocaleString('id-ID')}`} 
            subtitle="Akumulasi donasi" 
            accent="yellow" 
          />
        </section>

        <section className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <SoftChart data={chartData} />
          
          <div className="retro-card flex flex-col justify-between gap-4 p-4">
            <div>
              <div className="retro-badge mb-2 inline-flex items-center gap-1">
                <span className="text-[13px] leading-none">❀</span>
                <span>Ringkasan donasi</span>
              </div>
              <p className="text-sm leading-relaxed text-[rgba(126,107,111,0.95)]">
                Grafik di samping menunjukkan tren donasi Anda dalam 7 hari terakhir.
                Semoga terus bertumbuh ya!
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-[rgba(126,107,111,0.95)]">
              <div className="retro-chip flex flex-col gap-1">
                <span className="font-semibold text-[rgba(59,47,50,0.98)]">Top Supporter</span>
                <span>{topSupporters[0]?.name || "-"}</span>
              </div>
              <div className="retro-chip flex flex-col gap-1">
                <span className="font-semibold text-[rgba(59,47,50,0.98)]">Rata-rata</span>
                <span>Rp {countToday > 0 ? Math.round(totalToday / countToday).toLocaleString('id-ID') : 0}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <RecentDonations donations={recentDonations || []} />
          
          <TopSupporters supporters={topSupporters} />
        </section>
      </div>
    </RetroShell>
  );
}
