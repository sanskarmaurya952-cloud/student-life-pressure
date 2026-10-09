import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ZoomIn,
  RotateCcw,
  Sparkles,
  Share2,
  Layers,
  ArrowRight,
  Search,
  X,
  Calendar,
  MapPin,
  Eye,
  Activity,
  ChevronRight,
  Compass,
  Disc,
  Receipt,
  Film,
  Camera,
  MessageSquare,
  StickyNote,
} from 'lucide-react';
import { CATEGORY_ORBITS, ZoomLevel } from './SolarSystemScene';
import { CATEGORIES_DATA, ARCHIVE_ARTIFACTS } from '../data/artifacts';
import { ArtifactData, CategoryType, MomentData } from '../types';

interface SolarSystemHUDProps {
  zoomLevel: ZoomLevel;
  selectedCategory: CategoryType | null;
  selectedArtifact: ArtifactData | null;
  activeMoment: MomentData | null;
  activeTab: 'solar' | 'moment' | 'archive';
  onZoomChange: (level: ZoomLevel) => void;
  onSelectCategory: (category: CategoryType) => void;
  onSelectArtifact: (artifact: ArtifactData) => void;
  onResetToSystem: () => void;
  onTabChange: (tab: 'solar' | 'moment' | 'archive') => void;
  onFollowConnection: () => void;
}

export const SolarSystemHUD: React.FC<SolarSystemHUDProps> = ({
  zoomLevel,
  selectedCategory,
  selectedArtifact,
  activeTab,
  onZoomChange,
  onSelectCategory,
  onSelectArtifact,
  onResetToSystem,
  onTabChange,
  onFollowConnection,
}) => {
  const navigate = useNavigate();

  // Active Category Data & Accent Color
  const activeCategoryInfo = useMemo(() => {
    if (selectedCategory) {
      return CATEGORIES_DATA.find((c) => c.name === selectedCategory) || null;
    }
    if (selectedArtifact) {
      return CATEGORIES_DATA.find((c) => c.name === selectedArtifact.category) || null;
    }
    return null;
  }, [selectedCategory, selectedArtifact]);

  // Current dynamic accent color smoothly transitions
  const currentAccent = activeCategoryInfo ? activeCategoryInfo.accentColor : '#d4af37';

  // Search & Filter state for Archive View
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>('All');

  // Filtered artifacts for Archive View
  const filteredArtifacts = useMemo(() => {
    return ARCHIVE_ARTIFACTS.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory =
        activeFilterCategory === 'All' || item.category === activeFilterCategory;
      return matchSearch && matchCategory;
    });
  }, [searchQuery, activeFilterCategory]);

  // Connected artifacts for the selected trace
  const connectedTraces = useMemo(() => {
    if (!selectedArtifact) return [];
    return selectedArtifact.connectedTo
      .map((id) => ARCHIVE_ARTIFACTS.find((a) => a.id === id))
      .filter((a): a is ArtifactData => a !== undefined);
  }, [selectedArtifact]);

  // Data-driven mini insights computed from the student pressure dataset
  const miniInsights = useMemo(() => {
    if (!selectedArtifact) return null;
    switch (selectedArtifact.category) {
      case 'Academic Pressure':
        return [
          { label: 'Exam Sprints', value: '14 Midterms' },
          { label: 'Peak Cram Hour', value: '04:00 AM' },
          { label: 'Focus Audio', value: '40Hz Binaural' },
          { label: 'Grading Curve', value: 'Top 15% Prereq' },
        ];
      case 'Financial Stress':
        return [
          { label: 'Logged Receipts', value: '312 Items' },
          { label: 'Access Codes', value: '$840 / Term' },
          { label: 'Single-Use Pack', value: '$11.00 Lab Fee' },
          { label: 'Payment Mode', value: 'Work-Study Debit' },
        ];
      case 'Career Anxiety':
        return [
          { label: 'Portals Logged', value: '248 Portals' },
          { label: 'Ghosting Rate', value: '72% Silent' },
          { label: 'Interview Round', value: 'Superday Final' },
          { label: 'Transit Pass', value: 'Metro Express #005' },
        ];
      case 'Sleep & Burnout':
        return [
          { label: 'Sleep Deficit', value: '3.7 Hrs / Night' },
          { label: 'All-Nighters', value: '9 Logged' },
          { label: 'Carrel Spec', value: 'Carrel F-14' },
          { label: 'Burnout Alert', value: 'Critical Level' },
        ];
      case 'Social Comparison':
        return [
          { label: 'Milestone Feeds', value: '88 Offer Posts' },
          { label: 'Imposter Spike', value: 'Daily Trigger' },
          { label: 'Dwell Time', value: '45 Mins / Day' },
          { label: 'Reality Gap', value: 'Curated vs Real' },
        ];
      case 'Relationships':
        return [
          { label: 'Response Latency', value: '45 Seconds' },
          { label: 'Support Pings', value: '14 Check-ins' },
          { label: 'State', value: 'Delivered & Read' },
          { label: 'Sender', value: 'Elena V. (Roommate)' },
        ];
      case 'Family Expectations':
        return [
          { label: 'Session Dwell', value: '14 Minutes' },
          { label: 'Tabs Explored', value: '12 Opened' },
          { label: 'Domain Depth', value: 'Mental Health' },
          { label: 'Expectation', value: "Dean's List Prereq" },
        ];
      case 'Balance':
        return [
          { label: 'Sticky Reminders', value: '38 Pinned' },
          { label: 'Boundary Rule', value: 'No Email Post-9PM' },
          { label: 'Mindful Resets', value: '76 Sessions' },
          { label: 'Recovery Index', value: '78% Restored' },
        ];
      default:
        return [
          { label: 'Preserved State', value: 'Logged & Active' },
          { label: 'Cluster Affinity', value: 'Moment 024' },
        ];
    }
  }, [selectedArtifact]);

  // Category-specific visual artifact badge & icon helper
  const renderArtifactCategoryIcon = (category: CategoryType) => {
    switch (category) {
      case 'Academic Pressure':
        return <Disc className="w-4 h-4 animate-spin text-[#d946ef]" />;
      case 'Financial Stress':
        return <Receipt className="w-4 h-4 text-[#f59e0b]" />;
      case 'Career Anxiety':
        return <MapPin className="w-4 h-4 text-[#14b8a6]" />;
      case 'Social Comparison':
        return <Camera className="w-4 h-4 text-[#06b6d4]" />;
      case 'Relationships':
        return <MessageSquare className="w-4 h-4 text-[#fb7185]" />;
      case 'Family Expectations':
        return <Search className="w-4 h-4 text-[#3b82f6]" />;
      case 'Sleep & Burnout':
        return <Film className="w-4 h-4 text-[#f43f5e]" />;
      case 'Balance':
        return <StickyNote className="w-4 h-4 text-[#a78bfa]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#d4af37]" />;
    }
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-8 pt-20">
      {/* 1. TOP HEADER & MAIN VIEW MODE SWITCHER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full max-w-7xl mx-auto">
        <div className="pointer-events-auto space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full animate-pulse transition-colors duration-500"
              style={{ backgroundColor: currentAccent }}
            />
            <span
              className="text-xs font-mono tracking-widest uppercase font-semibold transition-colors duration-500"
              style={{ color: currentAccent }}
            >
              DATA SOLAR SYSTEM // STUDENT LIFE PRESSURE
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl font-editorial tracking-tight text-[#f5f2eb]">
            Interactive Celestial Data Universe
          </h1>
        </div>

        {/* View Mode Toggle: 3D Solar System | Moment View | Filterable Archive */}
        <div className="pointer-events-auto flex items-center p-1 rounded-full bg-black/80 backdrop-blur-xl border border-white/15 shadow-xl text-xs font-mono">
          <button
            id="tab-solar-system"
            onClick={() => onTabChange('solar')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all active:scale-95 ${
              activeTab === 'solar'
                ? 'text-black font-semibold shadow-md'
                : 'text-[#a0a4b5] hover:text-white'
            }`}
            style={{
              backgroundColor: activeTab === 'solar' ? currentAccent : 'transparent',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>3D Solar System</span>
          </button>
          <button
            id="tab-moment-view"
            onClick={() => onTabChange('moment')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all active:scale-95 ${
              activeTab === 'moment'
                ? 'text-black font-semibold shadow-md'
                : 'text-[#a0a4b5] hover:text-white'
            }`}
            style={{
              backgroundColor: activeTab === 'moment' ? currentAccent : 'transparent',
            }}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Moment View</span>
          </button>
          <button
            id="tab-archive-view"
            onClick={() => onTabChange('archive')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all active:scale-95 ${
              activeTab === 'archive'
                ? 'text-black font-semibold shadow-md'
                : 'text-[#a0a4b5] hover:text-white'
            }`}
            style={{
              backgroundColor: activeTab === 'archive' ? currentAccent : 'transparent',
            }}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Archive Search</span>
          </button>
        </div>
      </div>

      {/* 2. CINEMATIC CATEGORY ENTRANCE BANNER */}
      <AnimatePresence>
        {activeCategoryInfo && zoomLevel !== 'system' && activeTab === 'solar' && (
          <motion.div
            key={`banner-${activeCategoryInfo.id}`}
            initial={{ opacity: 0, y: -20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.94 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto mx-auto text-center space-y-1.5 py-3 px-6 sm:px-10 rounded-2xl bg-black/80 backdrop-blur-xl border shadow-2xl transition-all duration-500 max-w-2xl"
            style={{
              borderColor: `${activeCategoryInfo.accentColor}50`,
              boxShadow: `0 0 50px ${activeCategoryInfo.accentColor}25`,
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <span
                className="w-2 h-2 rounded-full animate-ping"
                style={{ backgroundColor: activeCategoryInfo.accentColor }}
              />
              <span
                className="text-[11px] font-mono uppercase tracking-[0.25em] font-semibold"
                style={{ color: activeCategoryInfo.accentColor }}
              >
                {activeCategoryInfo.name}
              </span>
            </div>
            {/* Cinematic Tagline in high-contrast editorial serif */}
            <motion.h2
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-2xl sm:text-4xl font-editorial tracking-wide text-white drop-shadow-lg"
            >
              “{activeCategoryInfo.tagline}”
            </motion.h2>
            <div className="flex items-center justify-center gap-3 text-xs font-mono text-[#a0a4b5]">
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" style={{ color: activeCategoryInfo.accentColor }} />
                <span>{activeCategoryInfo.atmosphere}</span>
              </span>
              <span>•</span>
              <button
                id="banner-detail-link"
                onClick={() => navigate(`/category/${activeCategoryInfo.slug}`)}
                className="inline-flex items-center gap-1 font-semibold underline underline-offset-4 hover:brightness-125 transition-all"
                style={{ color: activeCategoryInfo.accentColor }}
              >
                <span>Enter Planet World</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. CENTER OVERLAYS: MOMENT VIEW OR ARCHIVE VIEW */}
      <AnimatePresence>
        {activeTab === 'moment' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="pointer-events-auto max-w-4xl mx-auto w-full bg-[#11131a]/95 border border-white/15 backdrop-blur-2xl rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
                  <span className="text-xs font-mono tracking-widest uppercase font-semibold text-[#d4af37]">
                    A PRESSURE ARC EMERGES // OCTOBER 14
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-editorial text-white">
                  The Finals Week Pressure Arc
                </h2>
              </div>
              <button
                onClick={() => onTabChange('solar')}
                className="p-1 rounded-full text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#a0a4b5] font-light leading-relaxed">
              Instead of isolated demands, these four student experiences peaked together within a single 24-hour crunch. Spatial relational lines demonstrate how late-night cramming triggered sleep deprivation, interview stress, and café budget tallies.
            </p>

            {/* Spatial Relational Node Chain */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative pt-2">
              {ARCHIVE_ARTIFACTS.slice(0, 4).map((art, idx) => (
                <div
                  key={art.id}
                  onClick={() => {
                    onSelectArtifact(art);
                    onTabChange('solar');
                  }}
                  className="p-4 rounded-xl bg-white/[0.03] border hover:border-white/30 transition-all cursor-pointer space-y-2 hover:bg-white/[0.06] group"
                  style={{ borderColor: `${art.accentColor}40` }}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold" style={{ color: art.accentColor }}>
                      0{idx + 1}. {art.category}
                    </span>
                    <span className="text-[#6c7082] text-[10px]">{art.timestamp}</span>
                  </div>
                  <div className="font-semibold text-sm text-white group-hover:text-[#d4af37] transition-colors truncate">
                    {art.title}
                  </div>
                  <div className="text-xs text-[#8b8f9e] line-clamp-2 font-light">
                    {art.subtitle}
                  </div>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#717688]">
                    <span>Inspect Node</span>
                    <ChevronRight className="w-3 h-3 text-[#d4af37]" />
                  </div>
                </div>
              ))}
            </div>

            {/* Actions: View in 3D & View Dedicated Moment Page */}
            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
              <span className="text-[#8b8f9e]">
                Relationship validated: Consecutive timestamps across 4 distinct pressure domains.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onTabChange('solar')}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
                >
                  Inspect in 3D Solar Orbit
                </button>
                <button
                  onClick={() => navigate('/moment/moment-024')}
                  className="px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e4be42] text-black font-semibold shadow-lg transition-all flex items-center gap-1.5"
                >
                  <span>Open Full Moment Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Searchable Archive Catalog Overlay */}
        {activeTab === 'archive' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="pointer-events-auto max-w-4xl mx-auto w-full bg-[#11131a]/95 border border-white/15 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl space-y-4 my-auto max-h-[75vh] flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" style={{ color: currentAccent }} />
                <span
                  className="text-xs font-mono tracking-widest uppercase font-semibold"
                  style={{ color: currentAccent }}
                >
                  PRESSURE CATALOG // {filteredArtifacts.length} STUDENT ARTIFACTS
                </span>
              </div>
              <button
                onClick={() => onTabChange('solar')}
                className="p-1 rounded-full text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search receipt, study log, interview pass, major query, sticky note..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/30 font-mono"
                />
              </div>
              {/* Category Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs font-mono">
                {['All', ...CATEGORIES_DATA.map((c) => c.name)].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg shrink-0 transition-all ${
                      activeFilterCategory === cat
                        ? 'text-black font-semibold'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                    style={{
                      backgroundColor: activeFilterCategory === cat ? currentAccent : undefined,
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Records List */}
            <div className="overflow-y-auto space-y-2 pr-1 flex-1">
              {filteredArtifacts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectArtifact(item);
                    onTabChange('solar');
                  }}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.05] transition-all cursor-pointer flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.accentColor }}
                    />
                    <div>
                      <div className="font-semibold text-white">{item.title}</div>
                      <div className="text-[11px] text-[#8b8f9e] font-light">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] font-mono" style={{ color: item.accentColor }}>
                      {item.category}
                    </div>
                    <div className="text-[10px] text-[#717688]">{item.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. BOTTOM CONTROLS & RICH TRACE DETAIL EXPERIENCE */}
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-end justify-between gap-4">
        {/* Left: Zoom Controller & Quick Orbit Carousel */}
        <div className="pointer-events-auto space-y-3 w-full sm:w-auto">
          {/* Zoom Buttons & Breadcrumb */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/15 shadow-2xl text-xs font-mono">
            <button
              id="zoom-system-btn"
              onClick={onResetToSystem}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                zoomLevel === 'system'
                  ? 'text-black font-semibold shadow-md'
                  : 'text-[#a0a4b5] hover:text-white'
              }`}
              style={{
                backgroundColor: zoomLevel === 'system' ? currentAccent : 'transparent',
              }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Solar System View</span>
            </button>
            <button
              id="zoom-in-btn"
              onClick={() => onZoomChange('category')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                zoomLevel === 'category'
                  ? 'text-black font-semibold shadow-md'
                  : 'text-[#a0a4b5] hover:text-white'
              }`}
              style={{
                backgroundColor: zoomLevel === 'category' ? currentAccent : 'transparent',
              }}
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Category Orbit</span>
            </button>
            {selectedArtifact && (
              <button
                id="zoom-trace-btn"
                onClick={() => onZoomChange('trace')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                  zoomLevel === 'trace'
                    ? 'text-black font-semibold shadow-md'
                    : 'text-[#a0a4b5] hover:text-white'
                }`}
                style={{
                  backgroundColor: zoomLevel === 'trace' ? currentAccent : 'transparent',
                }}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Trace Focus</span>
              </button>
            )}
          </div>

          {/* Quick Category Planets Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full sm:max-w-xl pb-1 text-xs font-mono">
            {CATEGORY_ORBITS.map((orbit) => {
              const isSelected = selectedCategory === orbit.name;
              return (
                <button
                  key={orbit.id}
                  id={`orbit-pill-${orbit.id}`}
                  onClick={() => onSelectCategory(orbit.name)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl shrink-0 transition-all border active:scale-95 ${
                    isSelected
                      ? 'text-white font-semibold shadow-lg'
                      : 'bg-black/60 text-[#8b8f9e] border-white/10 hover:border-white/25 hover:text-white backdrop-blur-md'
                  }`}
                  style={{
                    borderColor: isSelected ? orbit.color : undefined,
                    backgroundColor: isSelected ? `${orbit.color}25` : undefined,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: orbit.color }}
                  />
                  <span>{orbit.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: PREMIUM TRACE DETAIL EXPERIENCE */}
        {selectedArtifact && (
          <motion.div
            key={selectedArtifact.id}
            initial={{ opacity: 0, x: 20, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.96 }}
            className="pointer-events-auto max-w-lg w-full bg-[#11131a]/95 border backdrop-blur-2xl rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 transition-colors duration-500 max-h-[85vh] overflow-y-auto"
            style={{
              borderColor: `${selectedArtifact.accentColor}50`,
              boxShadow: `0 0 35px ${selectedArtifact.accentColor}20`,
            }}
          >
            {/* Header with Artifact Category Badge */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                {renderArtifactCategoryIcon(selectedArtifact.category)}
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border uppercase tracking-wider"
                  style={{
                    color: selectedArtifact.accentColor,
                    borderColor: selectedArtifact.accentColor,
                    backgroundColor: `${selectedArtifact.accentColor}15`,
                  }}
                >
                  {selectedArtifact.category}
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#8b8f9e]">
                {selectedArtifact.timestamp}
              </span>
            </div>

            {/* Real Title & Subtitle */}
            <div>
              <h3 className="text-xl sm:text-2xl font-editorial text-white leading-snug">
                {selectedArtifact.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#a0a4b5] font-light leading-relaxed mt-1">
                {selectedArtifact.subtitle}
              </p>
            </div>

            {/* Narrative Note if Present */}
            {selectedArtifact.narrativeNote && (
              <div
                className="text-xs italic bg-white/[0.03] p-3 rounded-xl border border-white/5 font-light"
                style={{ color: `${selectedArtifact.accentColor}ee` }}
              >
                “{selectedArtifact.narrativeNote}”
              </div>
            )}

            {/* Preserved Metadata Fields */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-[#6c7082] uppercase tracking-wider">
                Preserved Metadata Fields
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {Object.entries(selectedArtifact.meta).map(([k, v]) => (
                  <div
                    key={k}
                    className="p-2 rounded-lg bg-white/[0.02] border border-white/5"
                  >
                    <div className="text-[10px] text-[#6c7082] uppercase">{k}</div>
                    <div className="text-white font-medium truncate mt-0.5">{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data-Driven Mini Insights */}
            {miniInsights && (
              <div className="space-y-2 pt-1">
                <div
                  className="text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 font-semibold"
                  style={{ color: selectedArtifact.accentColor }}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Orbital Mini Insights</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {miniInsights.map((insight, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-black/40 border border-white/5 space-y-0.5"
                    >
                      <div className="text-[10px] text-[#717688]">{insight.label}</div>
                      <div className="text-white font-semibold text-[11px] truncate">
                        {insight.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CONNECTION FOUND Discovery Experience */}
            {connectedTraces.length > 0 && (
              <div
                className="p-3.5 rounded-xl bg-black/50 border space-y-3"
                style={{ borderColor: `${selectedArtifact.accentColor}40` }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[11px] font-mono tracking-widest font-bold uppercase flex items-center gap-1.5"
                    style={{ color: selectedArtifact.accentColor }}
                  >
                    <Share2 className="w-3.5 h-3.5 animate-pulse" />
                    <span>PRESSURE LINK FOUND</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#8b8f9e]">
                    These demands occurred together
                  </span>
                </div>

                {/* Animated sequential nodes */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono py-1">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 text-white font-semibold shrink-0">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: selectedArtifact.accentColor }}
                    />
                    <span>{selectedArtifact.category}</span>
                  </div>
                  {connectedTraces.map((conn) => (
                    <React.Fragment key={conn.id}>
                      <span className="text-[#8b8f9e] text-xs">➔</span>
                      <button
                        onClick={() => onSelectArtifact(conn)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white shrink-0 transition-colors border border-white/5"
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: conn.accentColor }}
                        />
                        <span>{conn.category}</span>
                      </button>
                    </React.Fragment>
                  ))}
                </div>

                {/* Main Follow This Thread CTA */}
                <button
                  id="hud-follow-thread-btn"
                  onClick={onFollowConnection}
                  className="w-full py-2.5 px-4 rounded-xl text-black font-semibold text-xs font-mono flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 hover:brightness-110"
                  style={{ backgroundColor: selectedArtifact.accentColor }}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>FOLLOW THIS THREAD ➔</span>
                </button>
              </div>
            )}

            {/* Bottom Actions: View Full Record Page */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 text-xs font-mono">
              <button
                onClick={() => {
                  const cat = CATEGORIES_DATA.find(
                    (c) => c.name === selectedArtifact.category
                  );
                  if (cat) navigate(`/category/${cat.slug}`);
                }}
                className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 flex items-center justify-center gap-1.5"
              >
                <span>View Full Planet Record</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
