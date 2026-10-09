import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Sparkles, Share2, Layers, History } from 'lucide-react';
import { Experience } from '../components/Experience';
import { ArtifactData } from '../types';
import { PageTransition } from '../components/PageTransition';
import { useArchive } from '../context/ArchiveContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const controlsRef = useRef<OrbitControlsType | null>(null);
  const { visitedCategories } = useArchive();

  // Cinematic opening sequence states: 'points-igniting' (0-1s) -> 'camera-pull' (1-2s) -> 'revealed' (2s+)
  const [openingPhase, setOpeningPhase] = useState<'igniting' | 'pulling' | 'revealed'>('igniting');

  useEffect(() => {
    // Check if user already saw opening this session
    const seenOpening = sessionStorage.getItem('archive_intro_seen');
    if (seenOpening) {
      setOpeningPhase('revealed');
      return;
    }

    const t1 = setTimeout(() => {
      setOpeningPhase('pulling');
    }, 900);

    const t2 = setTimeout(() => {
      setOpeningPhase('revealed');
      sessionStorage.setItem('archive_intro_seen', 'true');
    }, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const skipOpening = () => {
    setOpeningPhase('revealed');
    sessionStorage.setItem('archive_intro_seen', 'true');
  };

  const handleSelectArtifact = (artifact: ArtifactData) => {
    navigate(`/moment/moment-024?focus=${artifact.id}`);
  };

  return (
    <PageTransition variant="fade">
      <div className="relative w-screen h-screen overflow-hidden bg-[#08090c]">
        {/* Deep Space Background Vignette */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-75"
          style={{
            background:
              'radial-gradient(ellipse at 50% 40%, #171b26 0%, #0c0e14 45%, #050608 100%)',
          }}
        />

        {/* Subtle Archival Grid Layer */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-15"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* 3D WebGL Canvas Experience */}
        <motion.div
          animate={{
            scale: openingPhase === 'igniting' ? 1.35 : openingPhase === 'pulling' ? 1.1 : 1,
            opacity: openingPhase === 'igniting' ? 0.25 : 1,
          }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-1"
        >
          <Experience
            viewMode="explore"
            selectedArtifact={null}
            onSelectArtifact={handleSelectArtifact}
            activeMoment={null}
            selectedCategory={null}
            controlsRef={controlsRef}
          />
        </motion.div>

        {/* CINEMATIC OPENING INTRO OVERLAY (First 2 seconds) */}
        <AnimatePresence>
          {openingPhase !== 'revealed' && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center bg-black/90 text-white"
            >
              {/* Emerging moving data points */}
              {[...Array(18)].map((_, i) => {
                const angle = (i / 18) * Math.PI * 2;
                const dist = 60 + (i % 4) * 80;
                const endX = Math.cos(angle) * dist;
                const endY = Math.sin(angle) * dist;
                const colors = ['#d4af37', '#38bdf8', '#d946ef', '#14b8a6', '#f59e0b'];
                const color = colors[i % colors.length];

                return (
                  <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                    animate={{
                      x: endX,
                      y: endY,
                      scale: [0, 1.5, 1],
                      opacity: [0, 1, 0.7],
                    }}
                    transition={{
                      duration: 1.2,
                      delay: i * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="absolute w-2 h-2 rounded-full shadow-lg"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 10px ${color}`,
                    }}
                  />
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative z-10 text-center space-y-2 pointer-events-auto"
              >
                <div className="w-2 h-2 mx-auto rounded-full bg-[#d4af37] animate-ping" />
                <p className="text-xs font-mono tracking-[0.3em] uppercase text-[#d4af37]">
                  INITIALIZING STUDENT PRESSURE CONSTELLATION
                </p>
                <button
                  onClick={skipOpening}
                  className="text-[11px] font-mono text-white/40 hover:text-white underline underline-offset-4 pt-4 block mx-auto"
                >
                  Skip Intro ➔
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HERO EDITORIAL OVERLAY (Fades in when revealed) */}
        <AnimatePresence>
          {openingPhase === 'revealed' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-12 text-white"
            >
              {/* Top spacer for navbar */}
              <div className="pt-16" />

              {/* Hero Editorial Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-auto max-w-2xl space-y-4"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md text-xs font-mono tracking-widest text-[#d4af37]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>LIVING ARCHIVE // STUDENT LIFE PRESSURE</span>
                  </div>
                  {visitedCategories.length > 1 && (
                    <div
                      onClick={() => navigate('/explore')}
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-xs font-mono text-[#d4af37] backdrop-blur-md hover:bg-[#d4af37]/20 transition-colors"
                    >
                      <History className="w-3 h-3" />
                      <span>{visitedCategories.length} Domains Explored</span>
                    </div>
                  )}
                </div>

                {/* EXACT REQUIRED TITLE */}
                <h1
                  id="landing-hero-title"
                  className="text-4xl sm:text-6xl md:text-7xl font-editorial tracking-tight font-normal text-[#f5f2eb] leading-[1.05]"
                >
                  STUDENT LIFE,
                  <br />
                  <span className="italic font-light text-[#d4af37]">UNDER PRESSURE</span>
                </h1>

                {/* EXACT REQUIRED SUBTITLE */}
                <p className="text-xs sm:text-sm font-mono tracking-widest uppercase text-[#c5a059] font-medium pt-1">
                  ONE JOURNEY. COUNTLESS DEMANDS. THE UNSEEN WEIGHT OF STUDENT REALITY.
                </p>

                <p className="text-base sm:text-xl text-[#a3a6b2] italic font-light max-w-lg leading-relaxed">
                  “Turn silent struggles into an honest story.”
                </p>

                <p className="text-xs sm:text-sm text-[#777b8d] font-mono max-w-md">
                  Every late-night study sprint, tuition receipt, GPA calculation, and career comparison leaves an indelible trace.
                </p>

                {/* Main CTA */}
                <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* EXACT REQUIRED CTA */}
                  <button
                    id="hero-explore-cta"
                    onClick={() => navigate('/explore')}
                    className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#d4af37] hover:bg-[#e4be42] text-black font-mono text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-2xl shadow-[#d4af37]/30 hover:scale-[1.03] active:scale-95"
                  >
                    <Compass className="w-4 h-4 text-black group-hover:rotate-45 transition-transform duration-300" />
                    <span>ENTER THE ARCHIVE ➔</span>
                  </button>
                  <button
                    id="hero-moment-cta"
                    onClick={() => navigate('/moment/moment-024')}
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/5 hover:bg-white/10 text-[#d4d6e0] border border-white/15 hover:border-white/30 font-mono text-xs tracking-wider transition-all duration-300 backdrop-blur-md active:scale-95"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>VIEW MOMENT 024</span>
                  </button>
                </div>
              </motion.div>

              {/* Footer info */}
              <div className="pointer-events-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono text-[#6c7082] border-t border-white/5 pt-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400/80 animate-pulse" />
                  <span>Interactive 3D Universe Ready • Drag to Orbit • Click Artifacts</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate('/connections')}
                    className="hover:text-white transition-colors flex items-center gap-1 active:scale-95"
                  >
                    <Share2 className="w-3 h-3 text-[#d4af37]" />
                    <span>Relational Graph</span>
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => navigate('/story')}
                    className="hover:text-white transition-colors active:scale-95"
                  >
                    View Storyline
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};
