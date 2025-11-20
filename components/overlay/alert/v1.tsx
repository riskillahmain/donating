"use client";

import { useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

type ThemeOption = 'pink' | 'blue' | 'green' | 'purple';

type DonationAlertProps = {
  name: string;
  amount: number;
  message?: string;
  avatar?: string;
  visible: boolean;
  onClose?: () => void;
  durationMs?: number;
  youtubeUrl?: string;
  tiktokUrl?: string;
  igUrl?: string;
  title?: string;
  footerText?: string;
  theme?: ThemeOption;
};

const themes: Record<ThemeOption, {
  border: string;
  shadow: string;
  bg: string;
  text: string;
  accent: string;
  subBg: string;
  badgeBg: string;
  badgeText: string;
}> = {
  pink: {
    border: 'border-[#f7cfe0]',
    shadow: 'shadow-[#f4b4cf]',
    bg: 'bg-white',
    text: 'text-[#f26d9b]',
    accent: 'text-[#f7a1b8]',
    subBg: 'bg-[#fef6ff]',
    badgeBg: 'bg-[#ffe0f0]',
    badgeText: 'text-[#f18faf]',
  },
  blue: {
    border: 'border-[#bce0fd]',
    shadow: 'shadow-[#a2d2f7]',
    bg: 'bg-[#f8fbff]',
    text: 'text-[#4a90e2]',
    accent: 'text-[#7aa8ff]',
    subBg: 'bg-[#eff8ff]',
    badgeBg: 'bg-[#d6edff]',
    badgeText: 'text-[#4a90e2]',
  },
  green: {
    border: 'border-[#bcead5]',
    shadow: 'shadow-[#98d6b9]',
    bg: 'bg-[#f9fdfb]',
    text: 'text-[#56ab81]',
    accent: 'text-[#84cca5]',
    subBg: 'bg-[#effaf5]',
    badgeBg: 'bg-[#d1f0e1]',
    badgeText: 'text-[#46966e]',
  },
  purple: {
    border: 'border-[#e0c3fc]',
    shadow: 'shadow-[#cbb2e8]',
    bg: 'bg-[#fbf7ff]',
    text: 'text-[#9b72cf]',
    accent: 'text-[#b392db]',
    subBg: 'bg-[#f5eaff]',
    badgeBg: 'bg-[#eadbff]',
    badgeText: 'text-[#8e60c9]',
  }
};

const alertVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    y: 30,
    scale: 0.96,
    transition: {
      duration: 0.25,
      ease: "easeInOut",
    },
  },
};

function getEmbedUrl(url?: string): string | undefined {
  if (!url) return undefined;

  // YouTube
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&controls=0&mute=0`;
  }

  // TikTok
  const ttMatch = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
  if (ttMatch) {
    return `https://www.tiktok.com/embed/v2/${ttMatch[1]}?autoplay=1`;
  }

  // Instagram
  // Instagram doesn't support direct video file embed easily without oEmbed or specific API, 
  // but we can try the /embed endpoint if available, or just return undefined for now if it's tricky.
  // Simplest valid IG embed usually requires script, iframe 'p' version is complex.
  // Let's support Reels via simple iframe if possible, otherwise skip to avoid broken UI.
  if (url.includes('instagram.com')) {
     // Naive attempt, IG often blocks simple iframes due to CSP.
     // Better to use a dedicated embed service or skip for MVP without API key.
     return undefined; 
  }

  return undefined;
}

export default function DonationAlert({
  name,
  amount,
  message,
  avatar,
  visible,
  onClose,
  durationMs = 4000,
  youtubeUrl,
  tiktokUrl,
  igUrl,
  title = "NEW DONATION",
  footerText = "THANK YOU FOR WATERING THE FLOWERS",
  theme = 'pink',
}: DonationAlertProps) {
  const t = themes[theme];
  
  // Prioritize video sources
  const videoEmbedUrl = getEmbedUrl(youtubeUrl || tiktokUrl || igUrl);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [visible, durationMs, onClose]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white/0 px-4">
      <AnimatePresence>
        {visible && (
          <motion.div
            variants={alertVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative w-full max-w-xl rounded-3xl border-4 ${t.border} ${t.bg} p-4 shadow-[0_18px_0_0_rgba(0,0,0,0.05)]`}
            style={{ boxShadow: `0 18px 0 0 ${t.shadow.replace('shadow-', '')}` }} // Fallback/hack if tailwind shadow-color utility is missing or different
          >
            {/* Custom shadow hack above because arbitrary shadow colors are tricky with dynamic classes in v3/v4 sometimes */}
            
            <div className={`pointer-events-none absolute -top-4 left-4 flex gap-2 text-[10px] font-semibold tracking-[0.2em] ${t.badgeText}`}>
              <span className={`rounded-full ${t.badgeBg} px-3 py-1`}>{title}</span>
            </div>

            <div className="absolute -top-5 right-5 flex gap-1 text-xs">
              <span className="h-4 w-4 rounded-full bg-[#ffe6a7] shadow-sm" />
              <span className="h-4 w-4 rounded-full bg-[#ffd3e2] shadow-sm" />
              <span className="h-4 w-4 rounded-full bg-[#cdeffd] shadow-sm" />
            </div>

            {videoEmbedUrl && (
              <div className={`mb-3 overflow-hidden rounded-2xl border-2 ${t.border} bg-black/5`}>
                <div className="relative w-full pb-[56.25%]">
                  <iframe
                    src={videoEmbedUrl}
                    title="Donation Alert Video"
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            <div className="mt-2 flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${t.subBg} text-2xl shadow-sm`}>
                {avatar ?? "🌸"}
              </div>
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-sm font-extrabold tracking-[0.18em] ${t.text}`}>
                    {name.toUpperCase()}
                  </span>
                  <span className={`rounded-full ${t.badgeBg} px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${t.badgeText}`}>
                    Rp{amount.toLocaleString("id-ID")}
                  </span>
                </div>
                <span className={`text-[10px] font-medium uppercase tracking-[0.2em] ${t.accent}`}>
                  {footerText}
                </span>
              </div>
            </div>

            {message && (
              <motion.div
                className={`mt-3 rounded-2xl ${t.subBg} px-4 py-2 text-xs ${t.accent}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                “{message}”
              </motion.div>
            )}

            <motion.div
              className={`mt-3 flex items-center justify-between text-[10px] font-medium ${t.badgeText}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className={`rounded-full ${t.badgeBg} px-3 py-1`}>KREASIPAY</span>
              <span className="rounded-full bg-[#e6f4ff] px-3 py-1 text-[#7aa8ff]">
                VERIFIED
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}