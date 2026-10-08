import React from 'react';
import brandLogoImg from '../assets/trikal_darshi_logo.png';

export default function BrandLogo() {
  return (
    <header className="brand-header" role="banner">
      <div className="brand-identity-wrapper">
        {/* Primary Celestial Brand Logo Lockup (TD Emblem + Trikal Darshi) */}
        <div className="brand-logo-image-box">
          <img
            src={brandLogoImg}
            alt="TRIKAL DARSHI"
            className="brand-logo-img"
            width="1000"
            height="214"
          />
        </div>
      </div>
    </header>
  );
}
