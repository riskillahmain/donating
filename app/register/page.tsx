"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import { createClient } from "@/utils/supabase/client";

export default function RegisterPage() {
  const supabase = createClient();
  
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const reserved = ['settings', 'login', 'register', 'auth', 'dashboard', 'analytics', 'overlay', 'creators', 'api', 'admin'];
    if (reserved.includes(username.toLowerCase())) {
      setError("Username ini tidak tersedia. Ganti yang lain ya.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
          data: {
            username: username,
          }
        },
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError((err as Error).message || "Gagal mendaftar. Coba lagi ya.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout
        title="Cek Emailmu!"
        subtitle="Link konfirmasi ajaib sudah dikirim."
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-2xl bg-green-50 p-4 text-green-700 border border-green-100">
            <p className="text-sm">
              Kami telah mengirimkan email konfirmasi ke <strong>{email}</strong>. 
              Klik link di dalamnya untuk mulai berkarya!
            </p>
          </div>
          <Link 
            href="/login"
            className="mt-2 text-xs font-semibold text-[var(--text-main)] hover:underline"
          >
            Kembali ke halaman masuk
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Bergabunglah"
      subtitle="Mulai perjalanan kreatormu di sini. Gratis dan ramah."
    >
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-600 border border-red-100">
            {error}
          </div>
        )}
        
        <div className="flex flex-col gap-1.5">
          <label className="ml-1 text-xs font-semibold text-[var(--text-main)] uppercase tracking-wider">
            Username
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            className="w-full rounded-xl border border-[rgba(242,217,208,0.9)] bg-[rgba(255,255,255,0.7)] px-4 py-3 text-sm text-[var(--text-main)] placeholder-[rgba(126,107,111,0.4)] outline-none transition-all focus:border-[var(--accent-pink)] focus:bg-white focus:ring-4 focus:ring-[var(--accent-pink)]/10"
            placeholder="contoh: peach_lover"
            minLength={3}
          />
          <p className="ml-1 text-[10px] text-[var(--text-soft)]">
            Hanya huruf kecil, angka, dan underscore.
          </p>
        </div>

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
            placeholder="Minimal 6 karakter"
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full cursor-pointer rounded-xl bg-[var(--text-main)] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[rgba(59,47,50,0.15)] transition-all hover:-translate-y-0.5 hover:bg-[#503e42] hover:shadow-xl active:scale-[0.98] active:shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Mendaftar...
            </span>
          ) : (
            "Buat Akun Baru"
          )}
        </button>

        <p className="mt-2 text-center text-xs text-[var(--text-soft)]">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-[var(--text-main)] hover:underline">
            Masuk aja
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
