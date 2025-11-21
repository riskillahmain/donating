"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import { createClient } from "@/utils/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Password tidak sama. Cek lagi ya.");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }

      // Logout user after password change or redirect to home?
      // Usually better to redirect to home directly as they are logged in.
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      setError((err as Error).message || "Gagal memperbarui password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Password Baru"
      subtitle="Silakan buat password baru yang aman."
    >
      <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-4">
        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-600 border border-red-100">
            {error}
          </div>
        )}
        
        <div className="flex flex-col gap-1.5">
          <label className="ml-1 text-xs font-semibold text-[var(--text-main)] uppercase tracking-wider">
            Password Baru
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

        <div className="flex flex-col gap-1.5">
          <label className="ml-1 text-xs font-semibold text-[var(--text-main)] uppercase tracking-wider">
            Konfirmasi Password
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border border-[rgba(242,217,208,0.9)] bg-[rgba(255,255,255,0.7)] px-4 py-3 text-sm text-[var(--text-main)] placeholder-[rgba(126,107,111,0.4)] outline-none transition-all focus:border-[var(--accent-pink)] focus:bg-white focus:ring-4 focus:ring-[var(--accent-pink)]/10"
            placeholder="Ulangi password baru"
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
              Menyimpan...
            </span>
          ) : (
            "Simpan Password"
          )}
        </button>
      </form>
    </AuthLayout>
  );
}

