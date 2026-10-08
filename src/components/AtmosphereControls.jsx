import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import bgMusic from '../assets/bg_music.mp3';

// Singleton audio instance persists across React StrictMode remounts & HMR
let sharedAudio = null;
let userManuallyMuted = false;

export default function AtmosphereControls() {
  const [isPlaying, setIsPlaying] = useState(false);
  const fadeIntervalRef = useRef(null);

  const TARGET_VOLUME = 0.65;

  useEffect(() => {
    // Create audio singleton if not yet created
    if (!sharedAudio) {
      sharedAudio = new Audio(bgMusic);
      sharedAudio.loop = true;
      sharedAudio.volume = TARGET_VOLUME;
      sharedAudio.preload = 'auto';
    }

    const audio = sharedAudio;

    const startAudio = () => {
      if (userManuallyMuted || !audio) return;
      audio.volume = TARGET_VOLUME;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            removeInteractionListeners();
          })
          .catch(() => {
            // Autoplay restricted by browser policy; wait for first user gesture
            setIsPlaying(false);
          });
      }
    };

    const handleFirstGesture = () => {
      if (!userManuallyMuted && audio && audio.paused) {
        startAudio();
      }
      removeInteractionListeners();
    };

    const interactionEvents = ['pointerdown', 'touchstart', 'touchend', 'click', 'keydown', 'scroll'];

    const attachInteractionListeners = () => {
      interactionEvents.forEach((evt) => {
        window.addEventListener(evt, handleFirstGesture, { passive: true });
        document.addEventListener(evt, handleFirstGesture, { passive: true });
      });
    };

    const removeInteractionListeners = () => {
      interactionEvents.forEach((evt) => {
        window.removeEventListener(evt, handleFirstGesture);
        document.removeEventListener(evt, handleFirstGesture);
      });
    };

    // If audio is already playing from previous session / navigation
    if (!audio.paused) {
      setIsPlaying(true);
    } else if (!userManuallyMuted) {
      // 1. Try playing immediately as soon as page loads
      startAudio();
      // 2. Also attach first-gesture listener so ANY touch/click/scroll unlocks it instantly
      attachInteractionListeners();
    }

    const handleEnded = () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };
    audio.addEventListener('ended', handleEnded);

    const handlePlayState = () => {
      setIsPlaying(!audio.paused);
    };
    audio.addEventListener('play', handlePlayState);
    audio.addEventListener('pause', handlePlayState);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlayState);
      audio.removeEventListener('pause', handlePlayState);
      removeInteractionListeners();
    };
  }, []);

  const fadeIn = (audio) => {
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    audio.volume = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }

    const step = TARGET_VOLUME / 15;
    fadeIntervalRef.current = setInterval(() => {
      if (!audio) return;
      if (audio.volume + step >= TARGET_VOLUME) {
        audio.volume = TARGET_VOLUME;
        clearInterval(fadeIntervalRef.current);
      } else {
        audio.volume = Math.min(TARGET_VOLUME, audio.volume + step);
      }
    }, 40);
  };

  const fadeOut = (audio) => {
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    const step = audio.volume / 12;
    fadeIntervalRef.current = setInterval(() => {
      if (!audio) return;
      if (audio.volume - step <= 0.02) {
        audio.volume = 0;
        audio.pause();
        clearInterval(fadeIntervalRef.current);
      } else {
        audio.volume = Math.max(0, audio.volume - step);
      }
    }, 40);
  };

  const toggleAudio = () => {
    const audio = sharedAudio;
    if (!audio) return;

    if (!audio.paused) {
      userManuallyMuted = true;
      fadeOut(audio);
      setIsPlaying(false);
    } else {
      userManuallyMuted = false;
      fadeIn(audio);
      setIsPlaying(true);
    }
  };

  return (
    <aside className="atmosphere-controls" aria-label="Celestial Music Controls">
      <button
        type="button"
        className={`atmosphere-btn ${isPlaying ? 'active' : ''}`}
        onClick={toggleAudio}
        title={isPlaying ? "Mute Celestial Music" : "Play Celestial Ambiance Music"}
        aria-label={isPlaying ? "Mute Celestial Music" : "Play Celestial Ambiance Music"}
      >
        {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>
    </aside>
  );
}
