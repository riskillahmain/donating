"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import { createClient } from "@/utils/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/auth/reset-password`,
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Gagal mengirim permintaan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout
        title="Cek Emailmu"
        subtitle="Instruksi reset password sudah dikirim."
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-2xl bg-green-50 p-4 text-green-700 border border-green-100">
            <p className="text-sm">
              Link untuk mereset password telah dikirim ke <strong>{email}</strong>. 
              Silakan cek inbox (atau spam) Anda.
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
      title="Lupa Password?"
      subtitle="Tenang, kami akan bantu memulihkannya."
    >
      <form onSubmit={handleResetRequest} className="flex flex-col gap-4">
        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-600 border border-red-100">
            {error}
          </div>
        )}
        
        <div className="flex flex-col gap-1.5">
          <label className="ml-1 text-xs font-semibold text-[var(--text-main)] uppercase tracking-wider">
            Email Terdaftar
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

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full cursor-pointer rounded-xl bg-[var(--text-main)] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[rgba(59,47,50,0.15)] transition-all hover:-translate-y-0.5 hover:bg-[#503e42] hover:shadow-xl active:scale-[0.98] active:shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Mengirim...
            </span>
          ) : (
            "Kirim Link Reset"
          )}
        </button>

        <p className="mt-2 text-center text-xs text-[var(--text-soft)]">
          Ingat password?{" "}
          <Link href="/login" className="font-semibold text-[var(--text-main)] hover:underline">
            Masuk kembali
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

