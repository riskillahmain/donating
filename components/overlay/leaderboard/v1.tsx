"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";

type ThemeOption = 'pink' | 'blue' | 'green' | 'purple';

type Donor = {
  name: string;
  amount: number;
  avatar?: string;
};

type DonationLeaderboardProps = {
  title?: string;
  subtitle?: string;
  donors: Donor[];
  highlightTop?: number;
  compact?: boolean;
  theme?: ThemeOption;
};

const themes: Record<ThemeOption, {
  border: string;
  shadow: string;
  bg: string;
  title: string;
  subtitle: string;
  accent: string;
  accentLight: string;
  badge: { bg: string; text: string };
}> = {
  pink: {
    border: 'border-[#f7cfe0]',
    shadow: 'shadow-[#f4b4cf]',
    bg: 'bg-white',
    title: 'text-[#f26d9b]',
    subtitle: 'text-[#f7a1b8]',
    accent: 'text-[#f26d9b]',
    accentLight: 'text-[#f18faf]',
    badge: { bg: 'bg-[#ffe0f0]', text: 'text-[#f29bb2]' },
  },
  blue: {
    border: 'border-[#bce0fd]',
    shadow: 'shadow-[#a2d2f7]',
    bg: 'bg-[#f8fbff]',
    title: 'text-[#4a90e2]',
    subtitle: 'text-[#7aa8ff]',
    accent: 'text-[#4a90e2]',
    accentLight: 'text-[#7aa8ff]',
    badge: { bg: 'bg-[#d6edff]', text: 'text-[#4a90e2]' },
  },
  green: {
    border: 'border-[#bcead5]',
    shadow: 'shadow-[#98d6b9]',
    bg: 'bg-[#f9fdfb]',
    title: 'text-[#56ab81]',
    subtitle: 'text-[#84cca5]',
    accent: 'text-[#56ab81]',
    accentLight: 'text-[#84cca5]',
    badge: { bg: 'bg-[#d1f0e1]', text: 'text-[#46966e]' },
  },
  purple: {
    border: 'border-[#e0c3fc]',
    shadow: 'shadow-[#cbb2e8]',
    bg: 'bg-[#fbf7ff]',
    title: 'text-[#9b72cf]',
    subtitle: 'text-[#b392db]',
    accent: 'text-[#9b72cf]',
    accentLight: 'text-[#b392db]',
    badge: { bg: 'bg-[#eadbff]', text: 'text-[#8e60c9]' },
  }
};

// ... rowVariant ...
const rowVariant: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.05 * i,
      type: "spring",
      stiffness: 240,
      damping: 20,
    },
  }),
};

export default function DonationLeaderboard({
  title = "TOP DONORS",
  subtitle = "FLOWER FUND",
  donors,
  highlightTop = 3,
  compact = false,
  theme = 'pink',
}: DonationLeaderboardProps) {
  const sorted = [...donors].sort((a, b) => b.amount - a.amount);
  const t = themes[theme];

  return (
    <div className="flex min-h-screen items-center justify-center bg-white/0 px-4">
      <div className={`relative w-full max-w-xl rounded-3xl border-4 ${t.border} ${t.bg} p-6 shadow-[0_18px_0_0_rgba(0,0,0,0.05)]`}
           style={{ boxShadow: `0 18px 0 0 ${t.shadow.replace('shadow-', '')}` }}>
        
        <div className={`pointer-events-none absolute -top-6 left-6 flex gap-2 text-xs font-semibold tracking-[0.2em] ${t.badge.text}`}>
          <span className={`rounded-full ${t.badge.bg} px-3 py-1`}>RETRO</span>
          <span className="rounded-full bg-[#e4f2ff] px-3 py-1 text-[#7aa8ff]">DONATIONS</span>
        </div>

        <div className="absolute -top-7 right-6 flex gap-1 text-xs text-[#f4a261]">
          <span className="h-5 w-5 rounded-full bg-[#ffe6a7] shadow-[0_3px_0_0_#f4a261]" />
          <span className="h-5 w-5 rounded-full bg-[#ffd3e2] shadow-[0_3px_0_0_#f28482]" />
          <span className="h-5 w-5 rounded-full bg-[#cdeffd] shadow-[0_3px_0_0_#4ea8de]" />
        </div>

        <div className="mt-6 flex flex-col items-center gap-4">
          <h2 className={`text-center text-2xl font-extrabold tracking-[0.25em] ${t.title} sm:text-3xl`}>
            {title}
          </h2>
          <p className={`text-center text-xs font-medium uppercase tracking-[0.25em] ${t.subtitle}`}>
            {subtitle}
          </p>

          <div className="mt-2 w-full rounded-3xl bg-[rgba(255,255,255,0.5)] p-3 shadow-inner">
            <div className={`mb-2 flex items-center justify-between text-[11px] font-semibold tracking-[0.16em] ${t.accentLight}`}>
              <span className="pl-2">RANK</span>
              <span>DONOR</span>
              <span className="pr-2">AMOUNT</span>
            </div>

            <div className={`space-y-2 ${compact ? 'scale-95 -mt-2' : ''}`}>
              <AnimatePresence>
                {sorted.map((donor, index) => {
                  const rank = index + 1;
                  const isTop = rank <= highlightTop;
                  
                  // Dynamic styles based on theme could be more complex, 
                  // but keeping it simple for now, overriding the hardcoded ones slightly or keeping them as "classic retro"
                  // Ideally we map these too, but let's use the theme colors for text/borders at least.
                  
                  return (
                    <motion.div
                      key={donor.name}
                      custom={index}
                      variants={rowVariant}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: 10, scale: 0.97 }}
                      className={`relative flex items-center gap-3 rounded-2xl border bg-white px-3 py-2 shadow-[0_6px_0_0_rgba(0,0,0,0.05)]`}
                      style={{ 
                        borderColor: isTop ? t.border.replace('border-[', '').replace(']', '') : '#f0f0f0',
                        boxShadow: `0 6px 0 0 ${t.shadow.replace('shadow-', '')}`
                      }}
                    >
                      <motion.div
                        animate={isTop ? { y: [0, -2, 0] } : {}}
                        transition={isTop ? { duration: 2 + index * 0.3, repeat: Infinity, ease: "easeInOut" } : {}}
                        className={`flex h-8 w-8 items-center justify-center rounded-2xl ${t.badge.bg} text-xs font-black ${t.title} shadow-sm`}
                      >
                        #{rank}
                      </motion.div>

                      <div className="flex flex-1 items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#fff] text-sm font-bold ${t.accentLight} shadow-sm`}>
                            {donor.avatar ?? "🌸"}
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-sm font-semibold ${t.title}`}>{donor.name}</span>
                            <span className={`text-[10px] font-medium uppercase tracking-[0.16em] ${t.subtitle}`}>
                              SUPPORTER
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          <span className={`text-sm font-extrabold ${t.accent}`}>
                            Rp{donor.amount.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          <div className={`mt-4 flex flex-wrap items-center justify-center gap-2 text-[10px] font-medium ${t.accentLight}`}>
            <motion.span
              className={`rounded-full ${t.badge.bg} px-3 py-1`}
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              THANK YOU FOR SUPPORTING
            </motion.span>
          </div>
        </div>
        
        {/* Decorative Elements - tinted by theme */}
        <motion.div
          className={`pointer-events-none absolute -left-4 bottom-6 h-10 w-10 rounded-full ${t.badge.bg} shadow-lg`}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}