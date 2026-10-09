import React, { useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowDown,
  ArrowRight,
  Share2,
  Sparkles,
  MapPin,
  Calendar,
} from 'lucide-react';
import { MOMENTS_CATALOG, ARCHIVE_ARTIFACTS } from '../data/artifacts';
import { ArchiveArtifact } from '../components/ArchiveArtifact';
import { ArtifactData } from '../types';
import { PageTransition } from '../components/PageTransition';
import { useArchive } from '../context/ArchiveContext';

export const MomentDetailPage: React.FC = () => {
  const { momentId } = useParams<{ momentId: string }>();
  const navigate = useNavigate();
  const { markArtifactVisited } = useArchive();

  const moment = useMemo(() => {
    return (
      MOMENTS_CATALOG.find(
        (m) => m.id === momentId || m.code.toLowerCase().replace(/\s+/g, '-') === momentId
      ) || MOMENTS_CATALOG[0]
    );
  }, [momentId]);

  // Resolve traces in sequential order
  const traces = useMemo(() => {
    return moment.traceIds
      .map((id) => ARCHIVE_ARTIFACTS.find((a) => a.id === id))
      .filter((a): a is ArtifactData => a !== undefined);
  }, [moment]);

  useEffect(() => {
    if (traces[0]) {
      markArtifactVisited(traces[0].id);
    }
  }, [traces]);

  return (
    <PageTransition variant="stagger">
      <div className="min-h-screen bg-[#08090c] text-white pt-24 pb-28 px-4 sm:px-8">
        {/* Cinematic subtle glow */}
        <div
          className="fixed inset-0 pointer-events-none opacity-25 z-0"
          style={{
            background: `radial-gradient(ellipse at 50% 10%, ${moment.themeColor}30 0%, #08090c 70%)`,
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto space-y-12">
          {/* Top Breadcrumbs & Moment Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <button
              id="moment-back-btn"
              onClick={() => navigate('/explore')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/10 text-xs font-mono text-[#a0a4b5] hover:text-white border border-white/10 transition-colors w-fit active:scale-95 shadow-md"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Explorer</span>
            </button>

            {/* Quick Moment Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#717688] mr-1 hidden sm:inline">
                Available Moments:
              </span>
              {MOMENTS_CATALOG.map((m) => (
                <Link
                  key={m.id}
                  to={`/moment/${m.id}`}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all border active:scale-95 ${
                    m.id === moment.id
                      ? 'bg-[#d4af37] text-black font-semibold border-[#d4af37]'
                      : 'bg-white/[0.04] text-[#a0a4b5] border-white/10 hover:border-white/25 hover:text-white'
                  }`}
                >
                  {m.code}
                </Link>
              ))}
            </div>
          </div>

          {/* Moment Headline */}
          <div className="space-y-4 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-[#d4af37]/40 text-xs font-mono tracking-widest text-[#d4af37] shadow-lg">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-semibold">{moment.code}</span>
              <span>// PRESSURE SEQUENCE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-editorial tracking-tight text-[#f5f2eb]">
              {moment.title}
            </h1>

            <p className="text-sm sm:text-base text-[#a3a6b2] font-light leading-relaxed">
              {moment.narrative}
            </p>

            <div className="flex items-center justify-center gap-4 text-xs font-mono text-[#8b8f9e] pt-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{moment.date}</span>
              </div>
              {moment.location && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>{moment.location}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Narrative Chain Breakdown: Music -> Place -> Purchase -> Event */}
          <div className="space-y-8">
            <div className="text-center">
              <span className="text-xs font-mono tracking-widest text-[#d4af37] uppercase">
                REPRESENTATIVE SEQUENCE FLOW
              </span>
              <h2 className="text-xl sm:text-2xl font-editorial text-white mt-1">
                {moment.tagline}
              </h2>
            </div>

            {/* Sequential Trace Nodes */}
            <div className="space-y-6">
              {traces.map((trace, index) => {
                const isLast = index === traces.length - 1;

                return (
                  <motion.div
                    key={trace.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="relative"
                  >
                    {/* Trace Item Card */}
                    <div className="group p-6 sm:p-8 rounded-2xl bg-[#11131a]/90 border border-white/10 hover:border-white/25 transition-all duration-300 shadow-xl hover:shadow-black/60">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        {/* Left: Step Index & Category Tag */}
                        <div className="lg:col-span-3 space-y-2">
                          <div className="flex items-center gap-3">
                            <span
                              className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold text-black shadow-md"
                              style={{ backgroundColor: trace.accentColor }}
                            >
                              0{index + 1}
                            </span>
                            <span
                              className="text-xs font-mono tracking-wider uppercase font-semibold"
                              style={{ color: trace.accentColor }}
                            >
                              {trace.category}
                            </span>
                          </div>
                          <div className="text-xs font-mono text-[#717688]">
                            {trace.timestamp}
                          </div>
                        </div>

                        {/* Middle: Content & Specs */}
                        <div className="lg:col-span-6 space-y-2">
                          <h3 className="text-xl font-editorial text-white">
                            {trace.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#9ea3b5] font-light leading-relaxed">
                            {trace.subtitle}
                          </p>
                          {trace.narrativeNote && (
                            <div className="text-xs text-[#d4af37]/80 italic pt-1">
                              “{trace.narrativeNote}”
                            </div>
                          )}
                          <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-mono">
                            {Object.entries(trace.meta).slice(0, 3).map(([k, v]) => (
                              <span
                                key={k}
                                className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/5 text-[#b4b8c7]"
                              >
                                <span className="text-[#6c7082]">{k}:</span> {v}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Right: Interactive 3D Miniature Preview */}
                        <div className="lg:col-span-3 flex justify-center">
                          <div className="relative w-36 h-36 rounded-xl overflow-hidden bg-black/50 border border-white/10 shadow-inner">
                            <Canvas
                              camera={{ position: [0, 0, 2.5], fov: 36 }}
                              gl={{ antialias: true, alpha: true }}
                            >
                              <ambientLight intensity={0.8} />
                              <directionalLight position={[2, 3, 2]} intensity={1.5} />
                              <Float speed={2} floatIntensity={0.25}>
                                <ArchiveArtifact
                                  data={{
                                    ...trace,
                                    position: [0, 0, 0],
                                    rotation: [0, 0, 0],
                                  }}
                                  isSelected={false}
                                  onSelect={() => {}}
                                  isHighlighted={true}
                                />
                              </Float>
                            </Canvas>
                            <div className="absolute bottom-1 right-2 text-[9px] font-mono text-white/50">
                              3D Token
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Vertical Connector Line & Arrow */}
                    {!isLast && (
                      <div className="flex flex-col items-center py-3">
                        <div className="w-0.5 h-6 bg-gradient-to-b from-[#d4af37] to-white/20" />
                        <div className="p-1 rounded-full bg-black border border-white/20 text-[#d4af37] my-1 shadow-lg">
                          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                        </div>
                        <div className="w-0.5 h-6 bg-gradient-to-b from-white/20 to-[#d4af37]" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Main Journey Action: FOLLOW THIS THREAD -> */}
          <div className="pt-8 border-t border-white/10 flex flex-col items-center text-center space-y-4">
            <div className="text-xs font-mono text-[#a0a4b5]">
              Ready to visualize how these four pressures physically link across space?
            </div>
            <button
              id="follow-thread-cta"
              onClick={() => navigate('/connections')}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#d4af37] hover:bg-[#e4be42] text-black font-mono text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-2xl shadow-[#d4af37]/30 hover:scale-[1.03] active:scale-95"
            >
              <Share2 className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
              <span>FOLLOW THIS THREAD ➔</span>
              <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
