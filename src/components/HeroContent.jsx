import React from 'react';
import { FlippingWordSwap } from './ui/flipping-word-swap';

export default function HeroContent() {
  return (
    <section className="hero-center-zone" aria-label="Coming Soon Announcement">
      {/* Main Editorial Headline */}
      <h2 className="hero-headline">
        <span className="headline-lead">
          Something{' '}
          <FlippingWordSwap
            words={["Cosmic", "Sacred", "Divine"]}
            className="headline-accent headline-swap"
            interval={3400}
          />{' '}
          Is
        </span>{' '}
        <span className="headline-tail">Coming.</span>
      </h2>
    </section>
  );
}

