import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

const graphemeSegmenter =
  typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null;

function segmentCharacters(text) {
  if (!text) return [];
  if (!graphemeSegmenter) return Array.from(text);
  return Array.from(graphemeSegmenter.segment(text), ({ segment }) => segment);
}

export function FlippingWordSwap({
  words,
  word1,
  word2,
  word3,
  duration = 400,
  stagger = 35,
  interval = 3400,
  className,
  toClassName,
  style,
  toStyle,
}) {
  // Normalize words array
  const wordsList = useMemo(() => {
    if (Array.isArray(words) && words.length > 0) {
      return words.filter(Boolean);
    }
    const legacy = [word1, word2, word3].filter(Boolean);
    return legacy.length > 0 ? legacy : ['Cosmic', 'Sacred', 'Divine'];
  }, [words, word1, word2, word3]);

  const containerRef = useRef(null);
  const activeIdxRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const isHoveredRef = useRef(false);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const resolvedDuration = prefersReducedMotion
    ? 0
    : Math.max(180, duration) / 1000;
  const resolvedStagger = prefersReducedMotion
    ? 0
    : Math.max(0, stagger) / 1000;

  // Initialize initial 3D positions on mount (pure GSAP, zero re-render lag)
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    wordsList.forEach((_, idx) => {
      const chars = containerRef.current.querySelectorAll(`[data-word-idx="${idx}"]`);
      if (idx === 0) {
        gsap.set(chars, {
          rotationX: 0,
          opacity: 1,
          transformOrigin: 'center top',
        });
      } else {
        gsap.set(chars, {
          rotationX: -82,
          opacity: 0,
          transformOrigin: 'center bottom',
        });
      }
    });
  }, [wordsList]);

  // Buttery-smooth GSAP trigger with ZERO React re-renders and ZERO phrase width rearrangement
  const triggerFlip = useCallback(() => {
    if (isAnimatingRef.current || wordsList.length <= 1) return;
    if (!containerRef.current) return;

    const currentIdx = activeIdxRef.current;
    const nextIdx = (currentIdx + 1) % wordsList.length;

    const currentChars = containerRef.current.querySelectorAll(`[data-word-idx="${currentIdx}"]`);
    const nextChars = containerRef.current.querySelectorAll(`[data-word-idx="${nextIdx}"]`);
    if (!currentChars.length || !nextChars.length) return;

    isAnimatingRef.current = true;
    activeIdxRef.current = nextIdx;

    // Reset incoming characters state cleanly
    gsap.set(nextChars, {
      rotationX: -82,
      opacity: 0,
      transformOrigin: 'center bottom',
    });

    const tl = gsap.timeline({
      onComplete: () => {
        // Reset old characters off-screen for next rotation
        gsap.set(currentChars, {
          rotationX: -82,
          opacity: 0,
          transformOrigin: 'center bottom',
        });
        if (containerRef.current) {
          containerRef.current.setAttribute('aria-label', `Word: ${wordsList[nextIdx]}`);
        }
        isAnimatingRef.current = false;
      },
    });

    tl.to(currentChars, {
      rotationX: 82,
      opacity: 0,
      duration: resolvedDuration,
      stagger: resolvedStagger,
      ease: 'power2.in',
      transformOrigin: 'center top',
    }, 0).to(
      nextChars,
      {
        rotationX: 0,
        opacity: 1,
        duration: resolvedDuration,
        stagger: resolvedStagger,
        ease: 'power2.out',
        transformOrigin: 'center bottom',
      },
      `<${resolvedDuration * 0.52}`
    );
  }, [wordsList, resolvedDuration, resolvedStagger]);

  // Automatic cosmic cycle interval
  useEffect(() => {
    if (!interval || interval <= 0 || wordsList.length <= 1) return;

    const timer = setInterval(() => {
      if (!isHoveredRef.current) {
        triggerFlip();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [interval, triggerFlip, wordsList.length]);

  // Clean up GSAP animations on unmount
  useEffect(() => {
    const node = containerRef.current;
    return () => {
      if (node) {
        const chars = node.querySelectorAll('[data-flip-char]');
        gsap.killTweensOf(chars);
      }
    };
  }, []);

  const renderCharacters = (text, wordIdx) =>
    segmentCharacters(text).map((character, charIdx) => (
      <span
        key={`${wordIdx}-${charIdx}-${character}`}
        data-word-idx={wordIdx}
        data-flip-char="true"
        className="inline-block whitespace-pre"
        style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          willChange: 'transform, opacity',
        }}
      >
        {character === ' ' ? '\u00a0' : character}
      </span>
    ));

  return (
    <button
      ref={containerRef}
      type="button"
      className={cn('flipping-word-swap-btn', className)}
      aria-label={`Word: ${wordsList[0]}`}
      style={style}
      onMouseEnter={() => {
        isHoveredRef.current = true;
        triggerFlip();
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      onClick={(e) => {
        e.preventDefault();
        triggerFlip();
      }}
      onFocus={(event) => {
        if (event.currentTarget.matches(':focus-visible')) {
          triggerFlip();
        }
      }}
    >
      <span
        className="flipping-word-swap-grid"
        style={{ perspective: 800 }}
      >
        {wordsList.map((word, wordIdx) => (
          <span
            key={`word-${wordIdx}-${word}`}
            className={cn(
              'flipping-word-swap-layer',
              wordIdx > 0 && toClassName
            )}
            style={wordIdx > 0 ? toStyle : undefined}
            aria-hidden={wordIdx !== 0}
          >
            {renderCharacters(word, wordIdx)}
          </span>
        ))}
      </span>
    </button>
  );
}

export default FlippingWordSwap;
