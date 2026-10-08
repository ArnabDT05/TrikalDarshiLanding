import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import bgMusic from '../assets/bg_music.mp3';

export default function AtmosphereControls() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const userMutedRef = useRef(false);

  const TARGET_VOLUME = 0.65;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = TARGET_VOLUME;

    // Helper to start playback
    const attemptPlay = () => {
      if (userMutedRef.current || !audio) return;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            // Crucial for Android: ONLY remove unlock listeners once playback is verified active!
            removeUnlockListeners();
          })
          .catch(() => {
            // Autoplay restricted on this event; keep listeners active so touchend/click will unlock it
            setIsPlaying(false);
          });
      }
    };

    // 1. Attempt immediately as soon as page loads
    attemptPlay();

    // 2. Android Chrome media activation listeners:
    // Android requires trusted 'touchend' or 'click' gestures to unlock audio playback.
    const onGesture = () => {
      if (!userMutedRef.current && audio && audio.paused) {
        attemptPlay();
      }
    };

    const gestureEvents = [
      'touchend',
      'click',
      'pointerup',
      'touchstart',
      'pointerdown',
      'keydown',
      'scroll'
    ];

    const addUnlockListeners = () => {
      gestureEvents.forEach((evt) => {
        window.addEventListener(evt, onGesture, { passive: true });
        document.addEventListener(evt, onGesture, { passive: true });
      });
    };

    const removeUnlockListeners = () => {
      gestureEvents.forEach((evt) => {
        window.removeEventListener(evt, onGesture);
        document.removeEventListener(evt, onGesture);
      });
    };

    addUnlockListeners();

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      removeUnlockListeners();
    };
  }, []);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      userMutedRef.current = true;
      audio.pause();
      setIsPlaying(false);
    } else {
      userMutedRef.current = false;
      audio.volume = TARGET_VOLUME;
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  return (
    <aside className="atmosphere-controls" aria-label="Celestial Music Controls">
      {/* DOM-attached audio element ensures Android Chrome hardware decoding & media session support */}
      <audio
        ref={audioRef}
        src={bgMusic}
        loop
        playsInline
        preload="auto"
      />
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
