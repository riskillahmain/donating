"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

const PRESET_AMOUNTS = [10000, 25000, 50000, 100000];
const PAYMENTS = [
  { id: "qris", label: "QRIS", color: "bg-black text-white" },
  { id: "gopay", label: "GoPay", color: "bg-[#00aeb0] text-white" },
  { id: "ovo", label: "OVO", color: "bg-[#4c3494] text-white" },
  { id: "dana", label: "DANA", color: "bg-[#118eea] text-white" },
  { id: "linkaja", label: "LinkAja", color: "bg-[#e32326] text-white" },
];

interface DonationFormProps {
  streamerName: string;
  streamerId: string;
  allowMedia?: boolean;
}

export default function DonationForm({ streamerName, streamerId, allowMedia = true }: DonationFormProps) {
  const supabase = createClient();
  
  const [amount, setAmount] = useState<number>(25000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("qris");
  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [loading, setLoading] = useState(false);

  const handlePresetClick = (val: number) => {
    setAmount(val);
    setCustomAmount("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setCustomAmount(val);
    setAmount(Number(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < 1000) {
      alert("Minimal donasi Rp 1.000 ya!");
      return;
    }
    
    setStep("payment");
    setLoading(true);
    
    // Simulate payment processing time
    await new Promise(r => setTimeout(r, 1500));

    try {
      // Insert to database
      const donationData: Record<string, string | number | undefined> = {
        streamer_id: streamerId,
        sender_name: senderName || "Anonim",
        message: message,
        amount: amount,
        status: 'completed', // Mock payment status
      };

      // Add media URL based on domain detection ONLY if allowed
      if (allowMedia && mediaUrl) {
        if (mediaUrl.includes('tiktok.com')) {
          donationData.tiktok_url = mediaUrl;
        } else if (mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be')) {
          donationData.youtube_url = mediaUrl;
        } else if (mediaUrl.includes('instagram.com')) {
          donationData.instagram_url = mediaUrl;
        }
      }

      const { error } = await supabase
        .from('donations')
        .insert(donationData);

      if (error) throw error;

      setStep("success");
    } catch (err) {
      console.error("Donation error:", err);
      alert("Gagal memproses donasi. Silakan coba lagi.");
      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
          className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#d1f0e1] text-4xl"
        >
          🎉
        </motion.div>
        <h3 className="text-xl font-bold text-[#2d4a3e]">Terima Kasih!</h3>
        <p className="mt-2 text-sm text-[#7e6b6f]">
          Donasi sebesar <span className="font-semibold">Rp {amount.toLocaleString("id-ID")}</span> telah terkirim ke {streamerName}.
        </p>
        <button
          onClick={() => {
            setStep("form");
            setMessage("");
            setMediaUrl("");
          }}
          className="mt-8 text-xs font-semibold text-[#3b2f32] underline decoration-dashed underline-offset-4"
        >
          Kirim dukungan lagi
        </button>
      </div>
    );
  }

  if (step === "payment") {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-[#f2d9d0] border-t-[#ffb8c9]" />
        <h3 className="text-lg font-semibold text-[#3b2f32]">Memproses Pembayaran...</h3>
        <p className="text-sm text-[#7e6b6f]">
          Membuka aplikasi {PAYMENTS.find(p => p.id === selectedPayment)?.label}...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Amount Section */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-[#3b2f32] uppercase tracking-wider">
          Nominal Dukungan
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PRESET_AMOUNTS.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => handlePresetClick(val)}
              className={`rounded-xl border py-2 text-xs font-medium transition-all ${
                amount === val && !customAmount
                  ? "border-[#ffb8c9] bg-[#fff0f5] text-[#f26d9b] shadow-sm"
                  : "border-[#f2d9d0] bg-white text-[#7e6b6f] hover:border-[#e0c3fc]"
              }`}
            >
              {val / 1000}k
            </button>
          ))}
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#9d878b]">
            Rp
          </span>
          <input
            type="text"
            value={customAmount || (amount && !PRESET_AMOUNTS.includes(amount) ? amount : "")}
            onChange={handleCustomChange}
            placeholder="Atau ketik nominal lain..."
            className="w-full rounded-xl border border-[#f2d9d0] bg-[#fdfbfb] py-3 pl-10 pr-4 text-sm font-semibold text-[#3b2f32] outline-none focus:border-[#ffb8c9] focus:ring-2 focus:ring-[#ffb8c9]/20"
          />
        </div>
      </div>

      {/* Identity Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#3b2f32] uppercase tracking-wider">
            Dari (Opsional)
          </label>
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Nama kamu / Anonim"
            className="w-full rounded-xl border border-[#f2d9d0] bg-[#fdfbfb] px-4 py-3 text-sm text-[#3b2f32] outline-none focus:border-[#ffb8c9]"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#3b2f32] uppercase tracking-wider">
            Email (Opsional)
          </label>
          <input
            type="email"
            placeholder="Untuk bukti bayar"
            className="w-full rounded-xl border border-[#f2d9d0] bg-[#fdfbfb] px-4 py-3 text-sm text-[#3b2f32] outline-none focus:border-[#ffb8c9]"
          />
        </div>
      </div>

      {/* Message & Media Section */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#3b2f32] uppercase tracking-wider">
            Pesan Dukungan
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder={`Semangat terus ${streamerName}!`}
            className="w-full rounded-xl border border-[#f2d9d0] bg-[#fdfbfb] px-4 py-3 text-sm text-[#3b2f32] outline-none focus:border-[#ffb8c9]"
          />
        </div>

        {allowMedia && (
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-xs font-semibold text-[#3b2f32] uppercase tracking-wider">
              <span>Media Share (Opsional)</span>
              <span className="text-[9px] text-[#9d878b] normal-case tracking-normal">TikTok / YouTube / Instagram</span>
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#9d878b]">
                🔗
              </div>
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://tiktok.com/@user/video/..."
                className="w-full rounded-xl border border-[#f2d9d0] bg-[#fdfbfb] py-3 pl-10 pr-4 text-sm text-[#3b2f32] outline-none focus:border-[#ffb8c9] focus:ring-2 focus:ring-[#ffb8c9]/20"
              />
            </div>
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-[#3b2f32] uppercase tracking-wider">
          Metode Pembayaran
        </label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {PAYMENTS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPayment(p.id)}
              className={`flex h-12 items-center justify-center rounded-xl border text-[10px] font-bold transition-all ${
                selectedPayment === p.id
                  ? `border-transparent ${p.color} shadow-md scale-[1.02]`
                  : "border-[#f2d9d0] bg-white text-[#9d878b] hover:bg-gray-50"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-xl bg-[#3b2f32] py-4 text-sm font-bold text-white shadow-lg shadow-[#3b2f32]/10 transition-all hover:-translate-y-0.5 hover:bg-[#503e42] hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? "Memproses..." : `Dukung Rp ${amount.toLocaleString("id-ID")}`}
      </button>
    </form>
  );
}
