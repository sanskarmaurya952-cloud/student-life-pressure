import React from 'react';
import {
  Compass,
  Sparkles,
  X,
  ChevronRight,
  Share2,
  Layers,
  BookOpen,
  Archive,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { ArtifactData, CategoryType, MomentData, ViewMode } from '../types';
import { ARCHIVE_ARTIFACTS, MOMENTS_CATALOG } from '../data/artifacts';

interface UIOverlayProps {
  viewMode: ViewMode;
  onViewChange: (view: ViewMode) => void;
  isExploring: boolean;
  onExploreToggle: () => void;
  selectedArtifact: ArtifactData | null;
  onSelectArtifact: (artifact: ArtifactData | null) => void;
  activeMoment: MomentData | null;
  onSelectMoment: (moment: MomentData) => void;
  selectedCategory: CategoryType | null;
  onSelectCategory: (category: CategoryType | null) => void;
  storyStep: number;
  onStoryStepChange: (step: number) => void;
}

const CATEGORIES: CategoryType[] = [
  'Academic Pressure',
  'Career Anxiety',
  'Family Expectations',
  'Financial Stress',
  'Social Comparison',
  'Sleep & Burnout',
  'Relationships',
  'Balance',
];

const STORY_STEPS = [
  {
    stage: 'RAW DATA',
    tagline: 'The Unspoken Demands',
    description:
      'Every day, dozens of silent assignment deadlines, tuition fees, GPA notifications, and internship portal updates accumulate in the background.',
  },
  {
    stage: 'TRACES',
    tagline: 'Tangible Pressures',
    description:
      'Bookstore receipts, 4:00 AM binaural focus audio, 24-hour library night passes, and sticky note reminders transform invisible stress into physical traces.',
  },
  {
    stage: 'CONNECTIONS',
    tagline: 'The Web of Student Life',
    description:
      'No pressure exists in a vacuum. A late-night organic chemistry cram session directly triggers sleep deprivation, fuels career anxiety, and strains personal relationships.',
  },
  {
    stage: 'STORY',
    tagline: 'Student Life Pressure',
    description:
      'Stepping back reveals the whole archipelago: an honest, compassionate constellation that turns the quiet student struggle into a shared story of resilience.',
  },
];

export const UIOverlay: React.FC<UIOverlayProps> = ({
  viewMode,
  onViewChange,
  isExploring,
  onExploreToggle,
  selectedArtifact,
  onSelectArtifact,
  activeMoment,
  onSelectMoment,
  selectedCategory,
  onSelectCategory,
  storyStep,
  onStoryStepChange,
}) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4 sm:p-8 text-white">
      {/* Top Header & Navigation Bar */}
      <header className="flex flex-col gap-4 max-w-7xl w-full mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand & Collection Badge */}
          <div className="flex items-center gap-3 self-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md text-[11px] font-mono tracking-widest text-[#d4af37]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
              LIVING 3D ARCHIVE // STUDENT REALITIES
            </div>
            <span className="hidden sm:inline-block text-xs font-mono text-white/40">
              STUDENT LIFE PRESSURE
            </span>
          </div>

          {/* Minimal View Navigation Tabs */}
          <nav
            id="view-navigation"
            className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-full bg-black/65 backdrop-blur-xl border border-white/10 shadow-2xl self-center sm:self-auto"
          >
            <button
              id="nav-explore"
              onClick={() => onViewChange('explore')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-200 ${
                viewMode === 'explore'
                  ? 'bg-[#d4af37] text-black font-semibold shadow-md'
                  : 'text-[#9ea3b5] hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>EXPLORE</span>
            </button>
            <button
              id="nav-moments"
              onClick={() => onViewChange('moments')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-200 ${
                viewMode === 'moments'
                  ? 'bg-[#d4af37] text-black font-semibold shadow-md'
                  : 'text-[#9ea3b5] hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>MOMENTS</span>
            </button>
            <button
              id="nav-connections"
              onClick={() => onViewChange('connections')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-200 ${
                viewMode === 'connections'
                  ? 'bg-[#d4af37] text-black font-semibold shadow-md'
                  : 'text-[#9ea3b5] hover:text-white hover:bg-white/5'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>CONNECTIONS</span>
            </button>
            <button
              id="nav-archive"
              onClick={() => onViewChange('archive')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-200 ${
                viewMode === 'archive'
                  ? 'bg-[#d4af37] text-black font-semibold shadow-md'
                  : 'text-[#9ea3b5] hover:text-white hover:bg-white/5'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>ARCHIVE</span>
            </button>
            <button
              id="nav-story"
              onClick={() => onViewChange('story')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-200 ${
                viewMode === 'story'
                  ? 'bg-[#d4af37] text-black font-semibold shadow-md'
                  : 'text-[#9ea3b5] hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>STORY</span>
            </button>
          </nav>
        </div>

        {/* View-Specific Title & Quick Action */}
        {viewMode === 'explore' && (
          <div className="pointer-events-auto max-w-lg space-y-2 mt-2">
            <h1
              id="main-title"
              className="text-3xl sm:text-5xl font-editorial tracking-tight font-normal text-[#f5f2eb] leading-tight drop-shadow-sm"
            >
              STUDENT LIFE PRESSURE
            </h1>
            <p className="text-sm sm:text-base text-[#a3a6b2] italic font-light">
              “Turn silent struggles into an honest story.”
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                id="explore-action-btn"
                onClick={onExploreToggle}
                className={`group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 border shadow-lg ${
                  isExploring
                    ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-[#d4af37]/20 font-semibold'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40'
                }`}
              >
                <Compass
                  className={`w-4 h-4 transition-transform duration-500 ${
                    isExploring ? 'rotate-180 text-black' : 'group-hover:rotate-45 text-[#d4af37]'
                  }`}
                />
                <span>{isExploring ? 'ORBITING ARCHIVE' : 'EXPLORE'}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <span className="text-[11px] font-mono text-[#777b8d] hidden sm:inline">
                Click any 3D artifact to inspect
              </span>
            </div>
          </div>
        )}

        {viewMode === 'moments' && (
          <div className="pointer-events-auto max-w-xl space-y-2 mt-1">
            <div className="text-[11px] font-mono tracking-wider text-[#d4af37] uppercase">
              MOMENT DISCOVERY // PRESSURE SEQUENCES
            </div>
            <h2 className="text-2xl sm:text-4xl font-editorial text-[#f5f2eb]">
              Pressure Constellations
            </h2>
            <p className="text-xs sm:text-sm text-[#a3a6b2] italic">
              Experience how individual everyday pressures weave into interconnected storylines.
            </p>
            {/* Moment Selection Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {MOMENTS_CATALOG.map((moment) => {
                const isActive = activeMoment?.id === moment.id;
                return (
                  <button
                    key={moment.id}
                    id={`moment-tab-${moment.id}`}
                    onClick={() => onSelectMoment(moment)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                      isActive
                        ? 'bg-[#d4af37]/20 border-[#d4af37] text-white shadow-lg shadow-[#d4af37]/10 font-semibold'
                        : 'bg-black/40 border-white/10 text-[#9ea3b5] hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: moment.themeColor }}
                    />
                    <span>{moment.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === 'connections' && (
          <div className="pointer-events-auto max-w-lg space-y-2 mt-1">
            <div className="text-[11px] font-mono tracking-wider text-[#d4af37] uppercase">
              RELATIONAL NETWORK // 3D GRAPH
            </div>
            <h2 className="text-2xl sm:text-4xl font-editorial text-[#f5f2eb]">
              Pressure Interconnections
            </h2>
            <p className="text-xs sm:text-sm text-[#a3a6b2] italic">
              Select an artifact to animate glowing relational arcs across the student universe.
            </p>
          </div>
        )}

        {viewMode === 'archive' && (
          <div className="pointer-events-auto max-w-lg space-y-2 mt-1">
            <div className="text-[11px] font-mono tracking-wider text-[#d4af37] uppercase">
              CATALOG INDEX // ALL PRESSURE DOMAINS
            </div>
            <h2 className="text-2xl sm:text-4xl font-editorial text-[#f5f2eb]">
              Archival Registry
            </h2>
            <p className="text-xs sm:text-sm text-[#a3a6b2] italic">
              Browse bookstore receipts, focus frequencies, commuter passes, and affirmations.
            </p>
          </div>
        )}

        {viewMode === 'story' && (
          <div className="pointer-events-auto max-w-2xl space-y-3 mt-1">
            <div className="text-[11px] font-mono tracking-wider text-[#d4af37] uppercase flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CINEMATIC ARCHIVE REVEAL</span>
            </div>
            {/* Story Chain Progression Pill */}
            <div
              id="story-progression-bar"
              className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs sm:text-sm font-mono tracking-widest text-[#f5f2eb]"
            >
              {STORY_STEPS.map((step, idx) => (
                <button
                  key={step.stage}
                  id={`story-step-${idx}`}
                  onClick={() => onStoryStepChange(idx)}
                  className={`flex items-center gap-1.5 transition-all ${
                    storyStep === idx
                      ? 'text-[#d4af37] font-bold underline underline-offset-4'
                      : 'text-[#777b8d] hover:text-white'
                  }`}
                >
                  <span>{step.stage}</span>
                  {idx < STORY_STEPS.length - 1 && (
                    <span className="text-white/30 text-xs font-normal">➔</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Middle Floating Context Cards based on active view */}
      <div className="flex justify-between items-end w-full max-w-7xl mx-auto pointer-events-none">
        {/* Moments Detailed Breakdown Card */}
        {viewMode === 'moments' && activeMoment && (
          <div className="pointer-events-auto max-w-md w-full bg-[#11131a]/95 border border-white/15 backdrop-blur-2xl rounded-2xl p-5 shadow-2xl space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="flex items-center justify-between">
              <span
                className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border"
                style={{
                  color: activeMoment.themeColor,
                  borderColor: activeMoment.themeColor,
                  backgroundColor: `${activeMoment.themeColor}15`,
                }}
              >
                {activeMoment.tagline}
              </span>
              <span className="text-[11px] font-mono text-[#8b8f9e]">
                {activeMoment.date}
              </span>
            </div>
            <h3 className="text-xl font-editorial text-white">
              {activeMoment.title}
            </h3>
            <p className="text-xs text-[#a0a4b5] leading-relaxed font-light">
              {activeMoment.narrative}
            </p>

            {/* Trace Step Nodes */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <div className="text-[10px] font-mono text-[#777b8d] uppercase tracking-wider">
                Sequential Trace Chain:
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {activeMoment.traceIds.map((tid, idx) => {
                  const trace = ARCHIVE_ARTIFACTS.find((a) => a.id === tid);
                  if (!trace) return null;
                  return (
                    <button
                      key={tid}
                      id={`moment-node-${tid}`}
                      onClick={() => onSelectArtifact(trace)}
                      className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/15 border border-white/10 text-[11px] font-mono text-white transition-colors"
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-white/20 text-white flex items-center justify-center text-[9px]">
                        {idx + 1}
                      </span>
                      <span>{trace.category}</span>
                      <ChevronRight className="w-3 h-3 text-white/40 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Connections Detailed Breakdown Card */}
        {viewMode === 'connections' && (
          <div className="pointer-events-auto max-w-sm w-full bg-[#11131a]/95 border border-white/15 backdrop-blur-2xl rounded-2xl p-5 shadow-2xl space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {selectedArtifact ? (
              <>
                <div className="flex items-center justify-between">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border"
                    style={{
                      color: selectedArtifact.accentColor,
                      borderColor: selectedArtifact.accentColor,
                      backgroundColor: `${selectedArtifact.accentColor}15`,
                    }}
                  >
                    Origin: {selectedArtifact.category}
                  </span>
                  <span className="text-[11px] font-mono text-[#8b8f9e]">
                    {selectedArtifact.connectedTo.length} Connections
                  </span>
                </div>
                <h3 className="text-lg font-editorial text-white">
                  {selectedArtifact.title}
                </h3>
                <p className="text-xs text-[#a0a4b5] leading-relaxed">
                  {selectedArtifact.narrativeNote || selectedArtifact.subtitle}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <div className="text-[10px] font-mono text-[#777b8d] uppercase tracking-wider">
                    Connected Traces in 3D:
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {selectedArtifact.connectedTo.map((targetId) => {
                      const target = ARCHIVE_ARTIFACTS.find(
                        (a) => a.id === targetId
                      );
                      if (!target) return null;
                      return (
                        <button
                          key={target.id}
                          id={`conn-link-${target.id}`}
                          onClick={() => onSelectArtifact(target)}
                          className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-xs font-mono transition-all text-left"
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: target.accentColor }}
                            />
                            <span className="text-white">{target.title}</span>
                          </span>
                          <span className="text-[#888c9d] text-[10px]">
                            {target.category}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2 text-center py-3">
                <Share2 className="w-8 h-8 text-[#d4af37] mx-auto opacity-80" />
                <h4 className="text-base font-editorial text-white">
                  Explore Relational Threads
                </h4>
                <p className="text-xs text-[#9ea3b5] leading-relaxed">
                  Click any object in the 3D world to trace animated light paths to its connected demands.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-1.5">
                  {ARCHIVE_ARTIFACTS.slice(0, 4).map((a) => (
                    <button
                      key={a.id}
                      id={`conn-quick-${a.id}`}
                      onClick={() => onSelectArtifact(a)}
                      className="px-2.5 py-1 rounded-md bg-white/[0.06] hover:bg-white/15 text-[11px] font-mono text-[#d4af37] border border-white/10"
                    >
                      {a.category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Story Step Card */}
        {viewMode === 'story' && (
          <div className="pointer-events-auto max-w-lg w-full bg-[#11131a]/95 border border-[#d4af37]/30 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/30 font-semibold">
                CHAPTER 0{storyStep + 1} // {STORY_STEPS[storyStep].stage}
              </span>
              <span className="text-xs font-mono text-[#8b8f9e]">
                {storyStep + 1} of {STORY_STEPS.length}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-editorial text-white">
                {STORY_STEPS[storyStep].tagline}
              </h3>
              <p className="text-sm text-[#c4c7d5] leading-relaxed font-light mt-2">
                {STORY_STEPS[storyStep].description}
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                id="story-prev-btn"
                onClick={() =>
                  onStoryStepChange(Math.max(0, storyStep - 1))
                }
                disabled={storyStep === 0}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wide border transition-all ${
                  storyStep === 0
                    ? 'opacity-30 border-white/5 cursor-not-allowed'
                    : 'border-white/20 hover:border-white text-white hover:bg-white/10'
                }`}
              >
                Previous
              </button>
              <button
                id="story-next-btn"
                onClick={() =>
                  onStoryStepChange(
                    (storyStep + 1) % STORY_STEPS.length
                  )
                }
                className="flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-mono tracking-wide bg-[#d4af37] text-black font-semibold shadow-md hover:bg-[#e6c14b] transition-colors"
              >
                <span>
                  {storyStep === STORY_STEPS.length - 1
                    ? 'Replay Journey'
                    : 'Next Stage'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Selected Artifact Detail Inspector (for Explore & Archive views) */}
        {(viewMode === 'explore' || viewMode === 'archive') && selectedArtifact && (
          <div className="pointer-events-auto self-end max-w-sm w-full bg-[#11131a]/95 border border-white/15 backdrop-blur-2xl rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between">
              <div
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border"
                style={{
                  borderColor: selectedArtifact.accentColor,
                  color: selectedArtifact.accentColor,
                  backgroundColor: `${selectedArtifact.accentColor}15`,
                }}
              >
                {selectedArtifact.category}
              </div>
              <button
                id="close-detail-button"
                onClick={() => onSelectArtifact(null)}
                className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="text-xl font-editorial text-[#f5f2eb] leading-snug">
                {selectedArtifact.title}
              </h3>
              <p className="text-xs text-[#a0a4b5] mt-1 font-light leading-relaxed">
                {selectedArtifact.subtitle}
              </p>
            </div>
            <div className="space-y-2 pt-2 border-t border-white/10 text-xs font-mono">
              <div className="flex justify-between text-[#85899a]">
                <span>Recorded Trace:</span>
                <span className="text-[#e2dfd7]">
                  {selectedArtifact.timestamp}
                </span>
              </div>
              {Object.entries(selectedArtifact.meta).map(([key, value]) => (
                <div key={key} className="flex justify-between text-[#85899a]">
                  <span>{key}:</span>
                  <span className="text-[#e2dfd7]">{value}</span>
                </div>
              ))}
            </div>
            {/* Quick jump to Connections from Inspector */}
            <div className="pt-1 flex items-center justify-between">
              <button
                id="view-connections-shortcut"
                onClick={() => onViewChange('connections')}
                className="text-xs font-mono text-[#d4af37] hover:underline flex items-center gap-1"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>View {selectedArtifact.connectedTo.length} connections</span>
              </button>
              <button
                id="reset-cam-shortcut"
                onClick={() => onSelectArtifact(null)}
                className="text-[11px] font-mono text-[#717688] hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Unfocus</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Category Filter / Legend Bar */}
      <footer className="w-full max-w-7xl mx-auto flex flex-col items-center gap-3">
        <div className="pointer-events-auto flex items-center justify-center flex-wrap gap-2 px-3 py-2 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 shadow-2xl">
          <button
            id="filter-all"
            onClick={() => onSelectCategory(null)}
            className={`px-3 py-1 rounded-full text-xs font-mono tracking-wide transition-all duration-200 border ${
              selectedCategory === null
                ? 'bg-white text-black border-white shadow-md font-semibold'
                : 'bg-white/[0.04] text-[#b8bcc8] border-white/5 hover:border-white/25 hover:text-white'
            }`}
          >
            All Traces
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = ARCHIVE_ARTIFACTS.filter((a) => a.category === cat).length;
            return (
              <button
                key={cat}
                id={`filter-${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                onClick={() => {
                  onSelectCategory(isSelected ? null : cat);
                  // Also select the first artifact of this category if switching in Archive view
                  if (viewMode === 'archive') {
                    const match = ARCHIVE_ARTIFACTS.find((a) => a.category === cat);
                    if (match) onSelectArtifact(match);
                  }
                }}
                className={`px-3 py-1 rounded-full text-xs font-mono tracking-wide transition-all duration-200 border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-md font-semibold'
                    : 'bg-white/[0.04] text-[#b8bcc8] border-white/5 hover:border-white/25 hover:text-white'
                }`}
              >
                <span>{cat}</span>
                <span className="text-[10px] opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
        <div className="text-[10px] font-mono text-[#626679] tracking-wider uppercase flex items-center gap-3">
          <span>Student Life Pressure</span>
          <span>•</span>
          <span>View: {viewMode.toUpperCase()}</span>
          <span>•</span>
          <span>Interactive 3D Foundation</span>
        </div>
      </footer>
    </div>
  );
};
