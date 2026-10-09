import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ArchiveProvider } from './context/ArchiveContext';
import { Navbar } from './components/Navbar';
import { ScrollToTop } from './components/ScrollToTop';
import { ArchiveReturnTransition } from './components/ArchiveReturnTransition';

// Attempt 2 Pages
import { LandingPage } from './pages/LandingPage';
import { ExplorePage } from './pages/ExplorePage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { MomentDetailPage } from './pages/MomentDetailPage';
import { ConnectionPage } from './pages/ConnectionPage';
import { StoryPage } from './pages/StoryPage';

export default function App() {
  return (
    <BrowserRouter>
      <ArchiveProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-[#08090c] text-[#f5f2eb] antialiased selection:bg-[#d4af37] selection:text-black">
          {/* Universal Archival Navigation Header */}
          <Navbar />

          {/* Cinematic Archival Return Transition Effect */}
          <ArchiveReturnTransition />

          {/* Core Journey Routes */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/category/:categoryId" element={<CategoryDetailPage />} />
            <Route path="/moment/:momentId" element={<MomentDetailPage />} />
            <Route path="/connections" element={<ConnectionPage />} />
            <Route path="/story" element={<StoryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </ArchiveProvider>
    </BrowserRouter>
  );
}
