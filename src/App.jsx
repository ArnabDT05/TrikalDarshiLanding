import React, { useState, useEffect } from 'react';
import VideoBackground from './components/VideoBackground';
import BrandLogo from './components/BrandLogo';
import HeroContent from './components/HeroContent';
import CountdownTimer from './components/CountdownTimer';
import WaitlistButton from './components/WaitlistButton';
import AtmosphereControls from './components/AtmosphereControls';
import './App.css';

export default function App() {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  // Global Media & Asset Protection (Anti-Inspect & Anti-Download)
  useEffect(() => {
    // 1. Disable right-click / context menu across the portal
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // 2. Block DevTools inspection shortcuts and view-source
    const handleKeyDown = (e) => {
      // F12
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return false;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl/Cmd + Shift + I/J/C (Devtools & Inspect Element)
      if (
        cmdOrCtrl &&
        e.shiftKey &&
        ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)
      ) {
        e.preventDefault();
        return false;
      }

      // Mac Option+Cmd+I / Option+Cmd+J / Option+Cmd+C
      if (
        isMac &&
        e.metaKey &&
        e.altKey &&
        ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)
      ) {
        e.preventDefault();
        return false;
      }

      // Ctrl/Cmd + U (View Source)
      if (cmdOrCtrl && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        return false;
      }

      // Ctrl/Cmd + S (Save Webpage)
      if (cmdOrCtrl && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        return false;
      }
    };

    // 3. Block dragging of video/audio/image media
    const handleDragStart = (e) => {
      if (['VIDEO', 'AUDIO', 'IMG'].includes(e.target.tagName)) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return (
    <main
      className={`app-viewport ${reducedMotion ? 'reduced-motion' : ''}`}
      id="trikal-darshi-portal"
    >
      {/* 1. Continuous Loopless Video Background (Meditating Figure & Zodiac Wheel) */}
      <VideoBackground reducedMotion={reducedMotion} />

      {/* 2. Single-Screen Viewport Stage (100dvh, Strictly No Scroll) */}
      <div className="single-screen-stage">
        {/* Top Zone: Minimal Brand Logo & Wordmark */}
        <BrandLogo />

        {/* Center Zone: Central Hero Typography & Vedic Disciplines */}
        <HeroContent />

        {/* Bottom Zone: Prominent Countdown Timer & Waitlist CTA */}
        <div className="portal-bottom-zone">
          <CountdownTimer />
          <WaitlistButton />
        </div>
      </div>

      {/* Discrete Sensory Atmosphere Control */}
      <AtmosphereControls />
    </main>
  );
}
