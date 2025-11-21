"use client";

import RetroShell from "@/components/layout/RetroShell";
import { motion } from "framer-motion";
import Link from "next/link";

const overlays = [
    {
        id: "alert",
        title: "Alert Box",
        description: "Tampilkan notifikasi donasi, sub, dan follow secara realtime di stream Anda.",
        color: "var(--accent-pink)",
        icon: "✨",
        href: "/overlay/settings/alert",
    },
    {
        id: "leaderboard",
        title: "Leaderboard",
        description: "Tampilkan klasemen donatur terbanyak mingguan atau bulanan.",
        color: "var(--accent-yellow)",
        icon: "🏆",
        href: "/overlay/settings/leaderboard",
    },
    {
        id: "ticker",
        title: "Running Text",
        description: "Teks berjalan untuk menampilkan pesan terbaru atau promosi.",
        color: "var(--accent-mint)",
        icon: "📢",
        href: "/overlay/settings/ticker",
    },
];

export default function OverlayPage() {
    return (
        <RetroShell>
            <div className="mx-auto max-w-5xl">
                <div className="mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--bg-elevated)] px-3 py-1 text-xs font-medium uppercase tracking-wider text-[var(--text-soft)]"
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-blue)]"></span>
                        Overlay Manager
                    </motion.div>
                    <h1 className="mt-4 text-3xl font-bold text-[var(--text-main)] sm:text-4xl">
                        Galeri Overlay
                    </h1>
                    <p className="mt-3 max-w-2xl text-[var(--text-soft)]">
                        Pilih overlay yang ingin Anda gunakan, atur tampilannya, dan pasang di OBS atau software streaming favorit Anda.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {overlays.map((overlay, index) => (
                        <motion.div
                            key={overlay.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.1 }}
                            className="retro-card group relative flex flex-col overflow-hidden p-6 transition-all hover:shadow-md"
                        >
                            {/* Decorative Blob */}
                            <div
                                className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-2xl transition-transform duration-500 group-hover:scale-150"
                                style={{ backgroundColor: overlay.color }}
                            />

                            <div className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-main)] shadow-sm transition-transform duration-300 group-hover:-rotate-6">
                                <span className="text-2xl">{overlay.icon}</span>
                            </div>

                            <h3 className="relative z-10 mb-2 text-lg font-bold text-[var(--text-main)]">
                                {overlay.title}
                            </h3>

                            <p className="relative z-10 mb-8 flex-1 text-sm leading-relaxed text-[var(--text-soft)]">
                                {overlay.description}
                            </p>

                            <Link
                                href={overlay.href}
                                className="relative z-10 flex items-center justify-center gap-2 rounded-xl bg-[var(--text-main)] py-3 text-sm font-semibold text-[#fff9ed] transition-transform active:scale-[0.98]"
                            >
                                <span>Atur Overlay</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </RetroShell>
    );
}
