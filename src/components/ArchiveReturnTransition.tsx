import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { useArchive } from '../context/ArchiveContext';

const RETURN_STAGES = [
  { id: 'trace', label: 'TRACE', subtitle: 'Collapsing physical record' },
  { id: 'category', label: 'CATEGORY', subtitle: 'Leaving planetary atmosphere' },
  { id: 'orbit', label: 'ORBIT', subtitle: 'Exiting orbital plane' },
  { id: 'archive', label: 'ENTIRE ARCHIVE', subtitle: 'Reconnecting celestial constellation' },
  { id: 'home', label: 'HOME', subtitle: 'Arriving at central world' },
];

export const ArchiveReturnTransition: React.FC = () => {
  const { isReturningHome } = useArchive();
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  useEffect(() => {
    if (isReturningHome) {
      setCurrentStageIdx(0);
      const t1 = setTimeout(() => setCurrentStageIdx(1), 220);
      const t2 = setTimeout(() => setCurrentStageIdx(2), 440);
      const t3 = setTimeout(() => setCurrentStageIdx(3), 660);
      const t4 = setTimeout(() => setCurrentStageIdx(4), 880);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
  }, [isReturningHome]);

  return (
    <AnimatePresence>
      {isReturningHome && (
        <motion.div
          id="archive-return-transition-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden bg-[#08090c]/90 backdrop-blur-2xl text-white"
        >
          {/* Zoom-out camera pulse backdrop */}
          <motion.div
            initial={{ scale: 2.2, opacity: 0.2 }}
            animate={{ scale: [2.2, 1.0, 0.4], opacity: [0.3, 0.7, 0.95] }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-[600px] h-[600px] rounded-full bg-radial from-[#d4af37]/25 via-[#38bdf8]/15 to-transparent blur-3xl pointer-events-none"
          />

          {/* Shrinking points of light reconnecting with the central archive */}
          {[...Array(24)].map((_, i) => {
            const angle = (i / 24) * Math.PI * 2;
            const radius = 320 + (i % 6) * 40;
            const startX = Math.cos(angle) * radius;
            const startY = Math.sin(angle) * radius;
            const colors = ['#d946ef', '#14b8a6', '#f59e0b', '#06b6d4', '#d4af37', '#f43f5e'];
            const color = colors[i % colors.length];
            return (
              <motion.div
                key={i}
                initial={{
                  x: startX,
                  y: startY,
                  scale: 1.8,
                  opacity: 0.9,
                }}
                animate={{
                  x: 0,
                  y: 0,
                  scale: 0.1,
                  opacity: 0.1,
                }}
                transition={{
                  duration: 0.95,
                  delay: (i % 8) * 0.03,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute w-2.5 h-2.5 rounded-full shadow-lg pointer-events-none"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 12px ${color}`,
                }}
              />
            );
          })}

          {/* Central Sun Singularity Core */}
          <motion.div
            initial={{ scale: 0.3, opacity: 0.4 }}
            animate={{ scale: [0.3, 1.2, 0.9], opacity: [0.4, 0.9, 1] }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="absolute w-28 h-28 rounded-full bg-[#d4af37] blur-md opacity-70"
          />

          {/* Central 5-Stage Camera Zoom-Out Journey Indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex flex-col items-center gap-4 text-center px-6 max-w-lg"
          >
            <div className="w-12 h-12 rounded-full bg-black/60 border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] shadow-2xl backdrop-blur-xl animate-pulse">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-mono tracking-[0.25em] text-[#d4af37] uppercase font-semibold">
                RETURNING TO PRESSURE CONSTELLATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-editorial text-[#f5f2eb]">
                From Orbit to Universe
              </h2>
            </div>
            {/* 5-Step Zoom-Out Breadcrumb Rail */}
            <div className="p-2.5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md flex items-center gap-1.5 sm:gap-2 text-[11px] font-mono shadow-xl">
              {RETURN_STAGES.map((st, idx) => {
                const isPassed = currentStageIdx >= idx;
                const isCurrent = currentStageIdx === idx;
                return (
                  <React.Fragment key={st.id}>
                    <div
                      className={`px-2 py-1 rounded-lg transition-all duration-300 flex items-center gap-1 ${
                        isCurrent
                          ? 'bg-[#d4af37] text-black font-bold shadow-md scale-105'
                          : isPassed
                          ? 'text-[#d4af37] font-medium'
                          : 'text-[#555866]'
                      }`}
                    >
                      <span>{st.label}</span>
                    </div>
                    {idx < RETURN_STAGES.length - 1 && (
                      <span className="text-white/20 text-[10px]">➔</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            <p className="text-xs font-mono text-[#8b8f9e]">
              {RETURN_STAGES[currentStageIdx]?.subtitle || 'Reconnecting with central archive...'}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
