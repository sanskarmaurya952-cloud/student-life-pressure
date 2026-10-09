import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  Layers,
  Share2,
  BookOpen,
  ArrowLeft,
  Home,
} from 'lucide-react';
import { useArchive } from '../context/ArchiveContext';

interface NavbarProps {
  breadcrumbs?: Array<{ label: string; path?: string }>;
}

export const Navbar: React.FC<NavbarProps> = ({ breadcrumbs }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerReturnHome } = useArchive();
  const isHomePage = location.pathname === '/';

  const handleHomeClick = (e: React.MouseEvent) => {
    if (!isHomePage) {
      e.preventDefault();
      triggerReturnHome(() => navigate('/'));
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none px-4 sm:px-8 py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand & Left Navigation */}
        <div className="pointer-events-auto flex items-center gap-3">
          {!isHomePage && (
            <button
              id="global-back-btn"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 text-xs font-mono text-[#a0a4b5] hover:text-white transition-all shadow-lg backdrop-blur-md active:scale-95"
              title="Go Back"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          <NavLink
            to="/"
            onClick={handleHomeClick}
            id="brand-home-link"
            className="group flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md shadow-lg hover:border-white/20 transition-all active:scale-98"
          >
            <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-[#f5f2eb] font-medium group-hover:text-[#d4af37] transition-colors">
              STUDENT LIFE PRESSURE
            </span>
            <span className="hidden md:inline-block text-[10px] font-mono text-white/40">
              // ARCHIVE
            </span>
          </NavLink>

          {/* Breadcrumbs if provided */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav
              id="breadcrumb-trail"
              aria-label="Breadcrumb"
              className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-white/50 pl-2"
            >
              <span>/</span>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  {crumb.path ? (
                    <NavLink
                      to={crumb.path}
                      className="hover:text-white transition-colors"
                    >
                      {crumb.label}
                    </NavLink>
                  ) : (
                    <span className="text-[#d4af37] font-semibold">
                      {crumb.label}
                    </span>
                  )}
                  {idx < breadcrumbs.length - 1 && <span>/</span>}
                </React.Fragment>
              ))}
            </nav>
          )}
        </div>

        {/* Primary Persistent Nav Tabs */}
        <nav
          id="global-nav-tabs"
          className="pointer-events-auto flex items-center gap-1 p-1 rounded-full bg-black/70 backdrop-blur-xl border border-white/15 shadow-2xl"
        >
          <NavLink
            to="/"
            end
            onClick={handleHomeClick}
            id="nav-link-home"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-[#d4af37] text-black font-semibold shadow-md'
                  : 'text-[#9ea3b5] hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/explore"
            id="nav-link-explore"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-[#d4af37] text-black font-semibold shadow-md'
                  : 'text-[#9ea3b5] hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore</span>
          </NavLink>

          <NavLink
            to="/moment/moment-024"
            id="nav-link-moments"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-200 active:scale-95 ${
                isActive || location.pathname.startsWith('/moment')
                  ? 'bg-[#d4af37] text-black font-semibold shadow-md'
                  : 'text-[#9ea3b5] hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Moments</span>
          </NavLink>

          <NavLink
            to="/connections"
            id="nav-link-connections"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-[#d4af37] text-black font-semibold shadow-md'
                  : 'text-[#9ea3b5] hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Connections</span>
          </NavLink>

          <NavLink
            to="/story"
            id="nav-link-story"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-[#d4af37] text-black font-semibold shadow-md'
                  : 'text-[#9ea3b5] hover:text-white hover:bg-white/5'
              }`
            }
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Story</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
