import React, { useEffect, useRef, useState } from 'react';
import seamlessVideo from '../assets/Animating_meditating_figure_seamless.mp4';
import originalVideo from '../assets/Animating_meditating_figure_moti_1080p_20261008060933.mp4';

/**
 * Continuous Loopless Video Background
 * Uses a Dual-Video Element Crossfade Engine + Seamless Ping-Pong Temporal Flow
 * to eliminate all browser decoder pauses, black flashes, and jump cuts.
 */
export default function VideoBackground({ reducedMotion = false }) {
  const videoRefA = useRef(null);
  const videoRefB = useRef(null);
  const [activeVideo, setActiveVideo] = useState('A'); // 'A' or 'B'

  // Crossfade transition time in seconds before video reaches end
  const CROSSFADE_TIME = 1.2;

  useEffect(() => {
    const vA = videoRefA.current;
    const vB = videoRefB.current;
    if (!vA || !vB) return;

    // Browser autoplay policy requirements
    vA.muted = true;
    vA.defaultMuted = true;
    vB.muted = true;
    vB.defaultMuted = true;

    if (reducedMotion) {
      vA.pause();
      vB.pause();
      return;
    }

    let isCrossfading = false;
    let animId;

    const startPlayback = async () => {
      try {
        await vA.play();
      } catch (err) {
        console.warn('Initial autoplay prevented; awaiting interaction', err);
        const handleUserInteraction = () => {
          vA.play().catch(() => {});
          window.removeEventListener('click', handleUserInteraction);
          window.removeEventListener('touchstart', handleUserInteraction);
        };
        window.addEventListener('click', handleUserInteraction);
        window.addEventListener('touchstart', handleUserInteraction);
      }
    };

    startPlayback();

    // Monitor playback frame-by-frame for exact, seamless cross-dissolve
    const checkCrossfade = () => {
      const active = activeVideo === 'A' ? vA : vB;
      const inactive = activeVideo === 'A' ? vB : vA;

      if (active && active.duration && !reducedMotion) {
        const timeLeft = active.duration - active.currentTime;

        // When active video approaches the end, awaken and crossfade the secondary video
        if (timeLeft <= CROSSFADE_TIME && !isCrossfading && timeLeft > 0.05) {
          isCrossfading = true;

          // Prepare inactive video from beginning and start playing
          inactive.currentTime = 0;
          inactive.play().then(() => {
            // Switch active video target
            setActiveVideo((prev) => (prev === 'A' ? 'B' : 'A'));

            // After crossfade transition finishes, pause and reset old video
            setTimeout(() => {
              try {
                active.pause();
                active.currentTime = 0;
              } catch {}
              isCrossfading = false;
            }, (CROSSFADE_TIME + 0.1) * 1000);
          }).catch(() => {
            isCrossfading = false;
          });
        }
      }

      animId = requestAnimationFrame(checkCrossfade);
    };

    animId = requestAnimationFrame(checkCrossfade);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [reducedMotion, activeVideo]);

  return (
    <div className="video-background-container" aria-hidden="true">
      {/* Primary Video Element (Track A) */}
      <video
        ref={videoRefA}
        className={`bg-video ${activeVideo === 'A' ? 'video-visible' : 'video-hidden'}`}
        src={seamlessVideo || originalVideo}
        poster="/poster.webp"
        playsInline
        muted
        autoPlay
        preload="auto"
      />

      {/* Secondary Video Element (Track B - for gapless crossfade, loaded only when needed) */}
      <video
        ref={videoRefB}
        className={`bg-video ${activeVideo === 'B' ? 'video-visible' : 'video-hidden'}`}
        src={seamlessVideo || originalVideo}
        poster="/poster.webp"
        playsInline
        muted
        preload="none"
      />

      {/* Atmospheric Cinematic Veil: Enhances contrast for central typography */}
      <div className="video-cinematic-veil" />
      <div className="video-center-shield" />
      <div className="video-edge-vignette" />
    </div>
  );
}
