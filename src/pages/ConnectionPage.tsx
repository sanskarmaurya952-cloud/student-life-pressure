import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';
import { motion, AnimatePresence } from 'motion/react';
import {
  Share2,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { Experience } from '../components/Experience';
import { ARCHIVE_ARTIFACTS, MOMENTS_CATALOG } from '../data/artifacts';
import { ArtifactData } from '../types';
import { PageTransition } from '../components/PageTransition';
import { useArchive } from '../context/ArchiveContext';

export const ConnectionPage: React.FC = () => {
  const navigate = useNavigate();
  const controlsRef = useRef<OrbitControlsType | null>(null);
  const { markArtifactVisited } = useArchive();

  // Active moment context (Moment 024)
  const activeMoment = MOMENTS_CATALOG[0];

  // The 4 sequential nodes in the thread
  const threadArtifacts = activeMoment.traceIds
    .map((id) => ARCHIVE_ARTIFACTS.find((a) => a.id === id))
    .filter((a): a is ArtifactData => a !== undefined);

  // Active step in the journey (0 to 3)
  const [currentStep, setCurrentStep] = useState(0);
  const selectedArtifact = threadArtifacts[currentStep] || threadArtifacts[0];

  useEffect(() => {
    if (selectedArtifact) {
      markArtifactVisited(selectedArtifact.id);
    }
  }, [selectedArtifact]);

  const handleStepSelect = (index: number) => {
    setCurrentStep(index);
  };

  const handleNextStep = () => {
    if (currentStep < threadArtifacts.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/story');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <PageTransition variant="fade">
      <div className="relative w-screen h-screen overflow-hidden bg-[#08090c] text-white">
        {/* Background vignette */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-70"
          style={{
            background:
              'radial-gradient(ellipse at 50% 40%, #1a1e2b 0%, #0c0e14 50%, #050608 100%)',
          }}
        />

        {/* 3D WebGL Canvas in Connections View Mode */}
        <div className="absolute inset-0 z-1">
          <Experience
            viewMode="connections"
            selectedArtifact={selectedArtifact}
            onSelectArtifact={(art) => {
              const idx = threadArtifacts.findIndex((a) => a.id === art.id);
              if (idx !== -1) {
                setCurrentStep(idx);
              }
            }}
            activeMoment={activeMoment}
            selectedCategory={null}
            controlsRef={controlsRef}
          />
        </div>

        {/* UI Controls Overlay */}
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4 sm:p-8 pt-20">
          {/* Top Header Banner & RETURN TO MOMENT Control */}
          <div className="pointer-events-auto max-w-xl space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                id="return-to-moment-btn"
                onClick={() => navigate('/moment/moment-024')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 border border-white/15 text-xs font-mono text-[#d4af37] hover:text-white transition-all shadow-lg backdrop-blur-md active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>RETURN TO MOMENT</span>
              </button>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-xs font-mono tracking-widest text-[#d4af37]">
                <Share2 className="w-3 h-3 animate-pulse" />
                <span>PAGE 05 // LIVE CONNECTION JOURNEY</span>
              </div>
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl font-editorial tracking-tight text-[#f5f2eb]">
                The Illuminated Relational Web
              </h1>
              <p className="text-xs sm:text-sm text-[#9ea3b5] font-light leading-relaxed">
                Step through the thread below. Watch the camera glide along the glowing bezier connection line as each pressure artifact awakens.
              </p>
            </div>

            {/* Step-by-Step Thread Progression Rail */}
            <div className="pt-2 flex items-center gap-2 flex-wrap">
              {threadArtifacts.map((item, idx) => {
                const isCurrent = currentStep === idx;
                const isPast = idx < currentStep;
                return (
                  <button
                    key={item.id}
                    id={`thread-step-${idx}`}
                    onClick={() => handleStepSelect(idx)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all border active:scale-95 ${
                      isCurrent
                        ? 'bg-[#d4af37] text-black font-semibold border-[#d4af37] shadow-lg shadow-[#d4af37]/30 scale-105'
                        : isPast
                        ? 'bg-white/10 text-white border-white/20'
                        : 'bg-black/60 text-[#717688] border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.accentColor }}
                    />
                    <span>
                      0{idx + 1}. {item.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Area: Inspector Drawer & Step Actions */}
          <div className="flex flex-col sm:flex-row items-end justify-between gap-4 w-full max-w-7xl mx-auto">
            {/* Selected Artifact Inspection Card with AnimatePresence */}
            <AnimatePresence mode="wait">
              {selectedArtifact && (
                <motion.div
                  key={selectedArtifact.id}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="pointer-events-auto max-w-md w-full bg-[#11131a]/95 border border-white/15 backdrop-blur-2xl rounded-2xl p-5 shadow-2xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border"
                      style={{
                        color: selectedArtifact.accentColor,
                        borderColor: selectedArtifact.accentColor,
                        backgroundColor: `${selectedArtifact.accentColor}15`,
                      }}
                    >
                      Step 0{currentStep + 1} of 0{threadArtifacts.length}: {selectedArtifact.category}
                    </span>
                    <span className="text-[11px] font-mono text-[#8b8f9e]">
                      {selectedArtifact.timestamp}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-editorial text-white">
                      {selectedArtifact.title}
                    </h3>
                    <p className="text-xs text-[#a0a4b5] font-light leading-relaxed mt-1">
                      {selectedArtifact.subtitle}
                    </p>
                  </div>

                  {selectedArtifact.narrativeNote && (
                    <div className="text-xs text-[#d4af37]/90 italic bg-white/[0.03] p-2.5 rounded-lg border border-white/5">
                      “{selectedArtifact.narrativeNote}”
                    </div>
                  )}

                  {/* Step Control Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-mono">
                    <button
                      onClick={handlePrevStep}
                      disabled={currentStep === 0}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all ${
                        currentStep === 0
                          ? 'opacity-30 border-white/5 text-[#555] cursor-not-allowed'
                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                      }`}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Previous Step</span>
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#d4af37] text-black font-semibold hover:bg-[#e4be42] transition-all shadow-md active:scale-95"
                    >
                      <span>
                        {currentStep < threadArtifacts.length - 1
                          ? 'Next Step in Thread'
                          : 'Proceed to Story'}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Direct Link to Story */}
            <div className="pointer-events-auto flex flex-col items-end gap-2 shrink-0">
              <button
                id="continue-story-cta"
                onClick={() => navigate('/story')}
                className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#d4af37] hover:bg-[#e4be42] text-black font-mono text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-2xl shadow-[#d4af37]/30 hover:scale-[1.03] active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>CONTINUE TO STORY ➔</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
              </button>
              <span className="text-[11px] font-mono text-[#717688] bg-black/40 px-2.5 py-1 rounded-md">
                Zoom out to the macro synthesis
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
