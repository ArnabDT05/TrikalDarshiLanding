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

  // Listen for changes to reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
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
