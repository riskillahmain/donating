import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fef6f6] p-4 retro-grid">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md overflow-hidden rounded-[32px] border border-[rgba(242,217,208,0.8)] bg-[rgba(255,255,255,0.85)] p-1 shadow-[0_20px_40px_rgba(92,76,79,0.08)] backdrop-blur-sm"
      >
        <div className="flex flex-col items-center bg-gradient-to-b from-[rgba(255,249,237,0.6)] to-transparent px-8 pb-10 pt-12">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#ffb8c9] to-[#ffe6a7] text-3xl shadow-[0_8px_20px_rgba(255,184,201,0.4)]">
            ✿
          </div>
          <h1 className="mb-2 text-center font-serif text-2xl font-bold text-[var(--text-main)] tracking-tight">
            {title}
          </h1>
          <p className="mb-8 text-center text-sm text-[var(--text-soft)] leading-relaxed">
            {subtitle}
          </p>
          
          <div className="w-full">{children}</div>
        </div>
      </motion.div>
      
      <div className="mt-8 text-center text-xs text-[rgba(126,107,111,0.7)]">
        <Link href="/" className="hover:underline hover:text-[var(--text-main)] transition-colors">
          &larr; Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

