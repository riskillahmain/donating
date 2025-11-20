"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Gagal masuk. Coba lagi ya.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Selamat Datang Kembali"
      subtitle="Masuk untuk melihat dashboard dan menyapa pendukungmu."
    >
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-600 border border-red-100">
            {error}
          </div>
        )}
        
        <div className="flex flex-col gap-1.5">
          <label className="ml-1 text-xs font-semibold text-[var(--text-main)] uppercase tracking-wider">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[rgba(242,217,208,0.9)] bg-[rgba(255,255,255,0.7)] px-4 py-3 text-sm text-[var(--text-main)] placeholder-[rgba(126,107,111,0.4)] outline-none transition-all focus:border-[var(--accent-pink)] focus:bg-white focus:ring-4 focus:ring-[var(--accent-pink)]/10"
            placeholder="kamu@kreator.com"
          />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="ml-1 text-xs font-semibold text-[var(--text-main)] uppercase tracking-wider">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[rgba(242,217,208,0.9)] bg-[rgba(255,255,255,0.7)] px-4 py-3 text-sm text-[var(--text-main)] placeholder-[rgba(126,107,111,0.4)] outline-none transition-all focus:border-[var(--accent-pink)] focus:bg-white focus:ring-4 focus:ring-[var(--accent-pink)]/10"
            placeholder="••••••••"
          />
          <div className="text-right">
            <Link href="/forgot-password" className="text-[10px] text-[var(--text-soft)] hover:text-[var(--text-main)] hover:underline">
              Lupa password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full cursor-pointer rounded-xl bg-[var(--text-main)] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[rgba(59,47,50,0.15)] transition-all hover:-translate-y-0.5 hover:bg-[#503e42] hover:shadow-xl active:scale-[0.98] active:shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Memproses...
            </span>
          ) : (
            "Masuk Sekarang"
          )}
        </button>

        <p className="mt-2 text-center text-xs text-[var(--text-soft)]">
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-[var(--text-main)] hover:underline">
            Daftar dulu yuk
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

