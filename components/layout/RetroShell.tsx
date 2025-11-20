"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RetroHeader from "@/components/layout/RetroHeader";
import RetroSidebar from "@/components/layout/RetroSidebar";

type Props = {
  children: React.ReactNode;
};

import RetroFooter from "@/components/layout/RetroFooter";

export default function RetroShell({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen retro-grid flex flex-col">
      <RetroHeader onMobileMenu={() => setMobileOpen(true)} />
      <div className="flex flex-1 items-start">
        <div className="sticky top-[57px] z-20 hidden h-[calc(100vh-57px)] shrink-0 md:block">
           <RetroSidebar />
        </div>
        
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="fixed inset-0 z-30 bg-[rgba(9,8,19,0.45)] backdrop-blur-sm sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            >
              <motion.div
                className="absolute inset-y-0 left-0 flex w-[260px] flex-col border-r border-[rgba(242,217,208,0.9)] bg-[rgba(255,249,237,0.98)] px-3 py-4 shadow-[0_18px_40px_rgba(9,8,19,0.5)]"
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="h-full overflow-y-auto">
                  <RetroSidebar />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.main
          className="flex-1 overflow-hidden"
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="min-h-full flex flex-col">
            <div className="flex-1 px-4 py-4 sm:px-5 sm:py-5 md:px-10 md:py-8">
              {children}
            </div>
            <RetroFooter />
          </div>
        </motion.main>
      </div>
    </div>
  );
}
