import React, { useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Calendar,
  Layers,
  Share2,
  Clock,
  ArrowRight,
  Disc,
  MapPin,
  Receipt,
  Film,
  Camera,
  MessageSquare,
  Search,
  StickyNote,
  Activity,
  Compass,
} from 'lucide-react';
import { CATEGORIES_DATA, ARCHIVE_ARTIFACTS } from '../data/artifacts';
import { ArchiveArtifact } from '../components/ArchiveArtifact';
import { PageTransition } from '../components/PageTransition';
import { useArchive } from '../context/ArchiveContext';

export const CategoryDetailPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { markCategoryVisited, markArtifactVisited } = useArchive();

  // Find category info
  const category = useMemo(() => {
    return (
      CATEGORIES_DATA.find(
        (c) => c.slug === categoryId || c.id === categoryId
      ) || CATEGORIES_DATA[0]
    );
  }, [categoryId]);

  // Find corresponding 3D artifact
  const primaryArtifact = useMemo(() => {
    return (
      ARCHIVE_ARTIFACTS.find((a) => a.id === category.primaryArtifactId) ||
      ARCHIVE_ARTIFACTS.find((a) => a.category === category.name) ||
      ARCHIVE_ARTIFACTS[0]
    );
  }, [category]);

  // Mark as visited in user journey
  useEffect(() => {
    markCategoryVisited(category.slug);
    markArtifactVisited(primaryArtifact.id);
  }, [category.slug, primaryArtifact.id]);

  // Connected / related traces
  const relatedArtifacts = useMemo(() => {
    return primaryArtifact.connectedTo
      .map((id) => ARCHIVE_ARTIFACTS.find((a) => a.id === id))
      .filter(Boolean);
  }, [primaryArtifact]);

  // Bespoke category visual motion & data preview for all 8 student pressure categories
  const renderCategorySpecialVisual = () => {
    switch (category.name) {
      case 'Academic Pressure':
        return (
          <div
            className="p-4 rounded-xl bg-black/40 border space-y-2"
            style={{ borderColor: `${category.accentColor}35` }}
          >
            <div
              className="flex items-center justify-between text-xs font-mono font-semibold"
              style={{ color: category.accentColor }}
            >
              <span className="flex items-center gap-1.5">
                <Disc className="w-3.5 h-3.5 animate-spin" />
                <span>40HZ BINAURAL FOCUS FREQUENCY</span>
              </span>
              <span>52 SPINS LOGGED</span>
            </div>
            {/* Animated audio bars with electric violet / magenta accent */}
            <div className="flex items-end gap-1 h-8 pt-1">
              {[40, 65, 85, 50, 95, 70, 45, 80, 100, 60, 75, 45, 90, 65, 50].map(
                (h, idx) => (
                  <motion.div
                    key={idx}
                    animate={{ height: [`${h * 0.35}%`, `${h}%`, `${h * 0.45}%`] }}
                    transition={{
                      duration: 0.8 + (idx % 4) * 0.2,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut',
                    }}
                    className="flex-1 rounded-t-sm"
                    style={{
                      background: `linear-gradient(to top, ${category.accentColor}40, ${category.accentColor})`,
                    }}
                  />
                )
              )}
            </div>
          </div>
        );
      case 'Career Anxiety':
        return (
          <div
            className="p-4 rounded-xl bg-black/40 border space-y-2 text-xs font-mono"
            style={{ borderColor: `${category.accentColor}35` }}
          >
            <div
              className="flex items-center justify-between font-semibold"
              style={{ color: category.accentColor }}
            >
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>SUPERDAY ON-SITE TRANSIT CORRIDOR</span>
              </span>
              <span>EXP #005</span>
            </div>
            <div className="flex items-center justify-between text-white/90 text-sm font-semibold pt-1">
              <span>CAMPUS STATION (TRACK 02)</span>
              <span className="text-xs font-normal" style={{ color: category.accentColor }}>
                ➔ 75m Technical Screen ➔
              </span>
              <span>TECH HUB (GATE 4)</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mt-1">
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: `linear-gradient(to right, ${category.accentColor}, #2dd4bf)`,
                }}
              />
            </div>
          </div>
        );
      case 'Financial Stress':
        return (
          <div
            className="p-4 rounded-xl bg-black/40 border space-y-2 text-xs font-mono"
            style={{ borderColor: `${category.accentColor}35` }}
          >
            <div
              className="flex items-center justify-between font-semibold"
              style={{ color: category.accentColor }}
            >
              <span className="flex items-center gap-1">
                <Receipt className="w-3.5 h-3.5" />
                <span>BOOKSTORE & COURSE PACK EXPENSE</span>
              </span>
              <span>TOTAL $25.31</span>
            </div>
            <div className="flex items-center justify-between text-white/80 pt-1">
              <span>Student Debit (•• 9812)</span>
              <span className="font-semibold" style={{ color: category.accentColor }}>
                AUTHORIZED & BILLED
              </span>
            </div>
          </div>
        );
      case 'Sleep & Burnout':
        return (
          <div
            className="p-4 rounded-xl bg-black/40 border space-y-2 text-xs font-mono"
            style={{ borderColor: `${category.accentColor}35` }}
          >
            <div
              className="flex items-center justify-between font-semibold"
              style={{ color: category.accentColor }}
            >
              <span className="flex items-center gap-1">
                <Film className="w-3.5 h-3.5" />
                <span>24-HOUR MAIN LIBRARY ACCESS PASS</span>
              </span>
              <span>ROW F • CARREL 14</span>
            </div>
            <div className="flex items-center justify-between text-white/80">
              <span>5th Floor Quiet Study Standoff</span>
              <span style={{ color: category.accentColor }}>23:15 OVERNIGHT STUB</span>
            </div>
          </div>
        );
      case 'Social Comparison':
        return (
          <div
            className="p-4 rounded-xl bg-black/40 border space-y-2 text-xs font-mono"
            style={{ borderColor: `${category.accentColor}35` }}
          >
            <div
              className="flex items-center justify-between font-semibold"
              style={{ color: category.accentColor }}
            >
              <span className="flex items-center gap-1">
                <Camera className="w-3.5 h-3.5" />
                <span>PEER MILESTONE VS REALITY TELEMETRY</span>
              </span>
              <span>19:42 FEED SPIKE</span>
            </div>
            <div className="flex items-center justify-between text-white/80">
              <span>LinkedIn Offer Posts (88 Viewed)</span>
              <span style={{ color: category.accentColor }}>IMPOSTER TRIGGER</span>
            </div>
          </div>
        );
      case 'Relationships':
        return (
          <div
            className="p-4 rounded-xl bg-black/40 border space-y-2 text-xs font-mono"
            style={{ borderColor: `${category.accentColor}35` }}
          >
            <div
              className="flex items-center justify-between font-semibold"
              style={{ color: category.accentColor }}
            >
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>ROOMMATE CARE CHECK-IN LOG</span>
              </span>
              <span>READ IN 45s</span>
            </div>
            <div className="flex items-center justify-between text-white/80">
              <span>Elena V. • Finals Week Support</span>
              <span style={{ color: category.accentColor }}>STATUS: DELIVERED</span>
            </div>
          </div>
        );
      case 'Family Expectations':
        return (
          <div
            className="p-4 rounded-xl bg-black/40 border space-y-2 text-xs font-mono"
            style={{ borderColor: `${category.accentColor}35` }}
          >
            <div
              className="flex items-center justify-between font-semibold"
              style={{ color: category.accentColor }}
            >
              <span className="flex items-center gap-1">
                <Search className="w-3.5 h-3.5" />
                <span>PARENTAL MAJOR EXPECTATION RADAR</span>
              </span>
              <span>840s (14 MIN)</span>
            </div>
            <div className="flex items-center justify-between text-white/80">
              <span>Career Fulfillment vs Filial Duty</span>
              <span style={{ color: category.accentColor }}>12 TABS OPENED</span>
            </div>
          </div>
        );
      case 'Balance':
        return (
          <div
            className="p-4 rounded-xl bg-black/40 border space-y-2 text-xs font-mono"
            style={{ borderColor: `${category.accentColor}35` }}
          >
            <div
              className="flex items-center justify-between font-semibold"
              style={{ color: category.accentColor }}
            >
              <span className="flex items-center gap-1">
                <StickyNote className="w-3.5 h-3.5" />
                <span>AFFIRMATION LAPTOP BEZEL SLIP</span>
              </span>
              <span>76x76MM CANARY</span>
            </div>
            <div className="flex items-center justify-between text-white/80">
              <span>0.38mm Black Gel Ink</span>
              <span style={{ color: category.accentColor }}>“REST IS REQUIRED”</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <PageTransition variant="drift">
      <div className="min-h-screen bg-[#08090c] text-white pt-24 pb-24 px-4 sm:px-8">
        {/* Dynamic radial glow tailored to category accent spreading into dark canvas */}
        <div
          className="fixed inset-0 pointer-events-none opacity-25 z-0 transition-all duration-700"
          style={{
            background: `radial-gradient(ellipse at 35% 25%, ${category.accentColor}30 0%, #08090c 70%)`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto space-y-10">
          {/* Navigation Bar / Breadcrumb */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <button
              id="category-back-btn"
              onClick={() => navigate('/explore')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/10 text-xs font-mono text-[#a0a4b5] hover:text-white border border-white/10 transition-colors active:scale-95 shadow-md"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to 3D Solar System</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-[#717688]">
              <Link to="/explore" className="hover:text-white transition-colors">
                Archive Orbit
              </Link>
              <span>/</span>
              <span style={{ color: category.accentColor }} className="font-semibold">
                {category.name}
              </span>
            </div>
          </div>

          {/* Hero Header with Cinematic Tagline */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-2 space-y-4"
            >
              {/* Category Small Label */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono tracking-widest uppercase"
                style={{
                  borderColor: `${category.accentColor}40`,
                  backgroundColor: `${category.accentColor}12`,
                  color: category.accentColor,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: category.accentColor }}
                />
                <span>PLANET // {category.name}</span>
              </div>

              {/* Cinematic Tagline in high-contrast editorial typography */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-editorial tracking-tight text-[#f5f2eb] leading-tight">
                “{category.tagline}”
              </h1>

              {/* Atmosphere Subtitle */}
              <div className="flex items-center gap-2 text-xs font-mono text-[#a0a4b5]">
                <Compass className="w-4 h-4" style={{ color: category.accentColor }} />
                <span>Atmosphere: {category.atmosphere}</span>
              </div>

              <p className="text-base sm:text-lg text-[#a3a6b2] font-light leading-relaxed max-w-2xl">
                {category.description}
              </p>

              {/* Category-Specific Visual Banner */}
              {renderCategorySpecialVisual()}

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#8b8f9e] pt-2">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" style={{ color: category.accentColor }} />
                  <span>Timeline: {category.dateRange}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" style={{ color: category.accentColor }} />
                  <span>Preserved Traces: {category.totalTraces} items</span>
                </div>
              </div>
            </motion.div>

            {/* Key Stat Cards with category accent hover responses */}
            <div
              className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#11131a]/85 border backdrop-blur-md shadow-xl transition-all"
              style={{ borderColor: `${category.accentColor}30` }}
            >
              {category.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 space-y-1 transition-all"
                >
                  <div className="text-[10px] font-mono text-[#777b8d] uppercase">
                    {stat.label}
                  </div>
                  <div
                    className="text-lg font-mono font-semibold"
                    style={{ color: category.accentColor }}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3D Physical Artifact & Representative Records Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: 3D Interactive Canvas Box */}
            <div className="lg:col-span-5 space-y-6">
              <div
                className="p-1 rounded-2xl border shadow-2xl transition-all duration-500"
                style={{
                  background: `linear-gradient(to bottom, ${category.accentColor}30, rgba(255,255,255,0.04))`,
                  borderColor: `${category.accentColor}40`,
                }}
              >
                <div className="relative h-[380px] rounded-xl overflow-hidden bg-[#0a0c10]">
                  {/* 3D Canvas */}
                  <Canvas
                    camera={{ position: [0, 0, 3.2], fov: 38 }}
                    gl={{ antialias: true, alpha: true }}
                  >
                    <ambientLight intensity={0.7} />
                    <directionalLight position={[3, 5, 2]} intensity={1.5} />
                    <pointLight
                      position={[-2, 1, 2]}
                      color={category.accentColor}
                      intensity={2.5}
                    />
                    <Float
                      speed={2}
                      rotationIntensity={0.2}
                      floatIntensity={0.2}
                      floatingRange={[-0.05, 0.05]}
                    >
                      <ArchiveArtifact
                        data={{
                          ...primaryArtifact,
                          position: [0, 0, 0],
                          rotation: [0, 0, 0],
                        }}
                        isSelected={false}
                        onSelect={() => {}}
                        isHighlighted={true}
                      />
                    </Float>
                    <OrbitControls
                      enableZoom={false}
                      enablePan={false}
                      autoRotate
                      autoRotateSpeed={1.5}
                      minPolarAngle={Math.PI / 4}
                      maxPolarAngle={Math.PI / 2 + 0.1}
                    />
                  </Canvas>

                  {/* 3D Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white/80">
                    Interactive 3D Physical Artifact • Drag to Rotate
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-xs font-mono">
                    <span className="text-[#f5f2eb] font-semibold truncate">
                      {primaryArtifact.title}
                    </span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-md border shrink-0 font-semibold"
                      style={{
                        borderColor: category.accentColor,
                        color: category.accentColor,
                        backgroundColor: `${category.accentColor}15`,
                      }}
                    >
                      Primary Trace
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Distribution Widget */}
              <div
                className="p-6 rounded-2xl bg-[#11131a]/85 border space-y-4 shadow-xl"
                style={{ borderColor: `${category.accentColor}30` }}
              >
                <h3
                  className="text-sm font-mono uppercase tracking-wider flex items-center gap-2 font-semibold"
                  style={{ color: category.accentColor }}
                >
                  <Activity className="w-4 h-4" />
                  <span>Orbital Distribution & Persistence</span>
                </h3>
                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <div className="flex justify-between text-[#8b8f9e] mb-1">
                      <span>Temporal Density</span>
                      <span className="text-white">Late Night (01:00 - 04:00)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: '76%',
                          backgroundColor: category.accentColor,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[#8b8f9e] mb-1">
                      <span>Preservation State</span>
                      <span className="text-white">Logged & Documented</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: '92%',
                          backgroundColor: category.accentColor,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[#8b8f9e] mb-1">
                      <span>Pressure Index</span>
                      <span className="text-white">High (Life Anchor)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: '85%',
                          backgroundColor: category.accentColor,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Representative Data & Related Traces */}
            <div className="lg:col-span-7 space-y-6">
              {/* Representative Items Catalog */}
              <div
                className="p-6 rounded-2xl bg-[#11131a]/85 border space-y-5 shadow-xl"
                style={{ borderColor: `${category.accentColor}30` }}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-editorial text-[#f5f2eb]">
                      Preserved Records & Physical Stubs
                    </h3>
                    <p className="text-xs text-[#8b8f9e] mt-0.5">
                      Physical paper trails and digital confirmations preserved in this planetary orbit.
                    </p>
                  </div>
                  <span
                    className="text-xs font-mono font-semibold"
                    style={{ color: category.accentColor }}
                  >
                    {category.representativeItems.length} Logged Traces
                  </span>
                </div>

                <div className="space-y-3">
                  {category.representativeItems.map((item, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ x: 3 }}
                      className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {item.badge && (
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold"
                              style={{
                                backgroundColor: `${category.accentColor}20`,
                                color: category.accentColor,
                              }}
                            >
                              {item.badge}
                            </span>
                          )}
                          <h4 className="text-sm font-mono font-semibold text-white">
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-xs text-[#9ea3b5] font-light">
                          {item.detail}
                        </p>
                      </div>
                      <span className="text-xs font-mono text-[#717688] shrink-0">
                        {item.timestamp}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Detailed Metadata Fields for Primary Artifact */}
              {primaryArtifact.detailedItems && (
                <div
                  className="p-6 rounded-2xl bg-[#11131a]/85 border space-y-4 shadow-xl"
                  style={{ borderColor: `${category.accentColor}25` }}
                >
                  <h3
                    className="text-sm font-mono uppercase tracking-wider font-semibold"
                    style={{ color: category.accentColor }}
                  >
                    Archival Spec Sheet // {primaryArtifact.title}
                  </h3>
                  <div className="divide-y divide-white/5 text-xs font-mono">
                    {primaryArtifact.detailedItems.map((field, idx) => (
                      <div
                        key={idx}
                        className="py-2.5 flex items-center justify-between gap-4"
                      >
                        <span className="text-[#8b8f9e]">{field.label}:</span>
                        <span className="text-[#f5f2eb] text-right font-medium">
                          {field.detail} {field.value && `• ${field.value}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Traces & Cross-Links */}
              <div
                className="p-6 rounded-2xl bg-gradient-to-r from-white/[0.04] to-white/[0.02] border space-y-4 shadow-xl"
                style={{ borderColor: `${category.accentColor}30` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4" style={{ color: category.accentColor }} />
                    <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-[#f5f2eb]">
                      Interconnected Demands ({relatedArtifacts.length})
                    </h3>
                  </div>
                  <Link
                    to="/connections"
                    className="text-xs font-mono hover:underline flex items-center gap-1 font-semibold"
                    style={{ color: category.accentColor }}
                  >
                    <span>Open 3D Connection Web</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {relatedArtifacts.map((trace) => {
                    if (!trace) return null;
                    return (
                      <div
                        key={trace.id}
                        onClick={() => navigate('/moment/moment-024')}
                        className="p-3 rounded-xl bg-black/40 hover:bg-black/70 border border-white/10 hover:border-white/25 cursor-pointer transition-all space-y-1.5 active:scale-98"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: trace.accentColor }}
                          />
                          <span className="text-[10px] font-mono text-[#717688]">
                            {trace.category}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-white font-medium truncate">
                          {trace.title}
                        </div>
                        <div className="text-[10px] font-mono text-[#8b8f9e] truncate">
                          {trace.timestamp}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Follow to Moment CTA */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-[#8b8f9e] font-light">
                    Woven into the primary sequence:
                  </span>
                  <Link
                    to="/moment/moment-024"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-black text-xs font-mono font-semibold transition-all shadow-md active:scale-95 hover:brightness-110"
                    style={{ backgroundColor: category.accentColor }}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>VIEW MOMENT 024</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
