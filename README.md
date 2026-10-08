# 🌌 TRIKAL DARSHI — Coming Soon Portal

> *A Cinematic Celestial Spiritual Gateway uniting Vedic Astrology, Numerology, and Tarot.*

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)](https://vercel.com)
[![React 19](https://img.shields.io/badge/React-19-61dafb?style=flat&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?style=flat&logo=vite)](https://vite.dev)

---

## ✨ Features

- **Continuous Loopless Video Engine**: Dual-track crossfade system with ping-pong frame transition, eliminating decoder stutters and pauses.
- **Single-Screen Immersive Stage**: Responsive across all phone screens and desktop monitors with zero vertical scrollbars (`100dvh`).
- **Celestial Countdown Timer**: Rolling drum digits counting down to the cosmic reveal.
- **Google Sheets VIP Waitlist**: Connected directly to Google Sheets via Google Apps Script Webhook with duplicate prevention and validation.
- **Atmospheric Celestial Ambiance**: Background audio with seamless browser autoplay support and user-gesture fallback.
- **Luxury Spiritual Typography**: Cinzel, Cormorant Garamond, and Outfit with gold foil gradients.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 8
- **Styling**: Vanilla CSS (Fluid clamp engine, luxury celestial design tokens)
- **Icons**: Lucide React
- **Animations**: CSS Keyframe Engines & GSAP
- **Backend / Integration**: Google Apps Script Web App -> Google Sheets

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/ArnabDT05/TrikalDarshiLanding.git
cd TrikalDarshiLanding
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the project root based on `.env.example`:
```bash
cp .env.example .env
```

Add your Google Apps Script Webhook URL:
```env
VITE_GOOGLE_SHEETS_URL="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

---

## ☁️ Deploying to Vercel

1. Push your repository to GitHub (or import your repo in [Vercel](https://vercel.com/new)).
2. In the Vercel project configuration:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. In **Settings -> Environment Variables**, add:
   - `VITE_GOOGLE_SHEETS_URL` = `your_google_apps_script_url`
4. Click **Deploy**!

---

## 📁 Project Structure

```
trikal-darshi/
├── google-apps-script.js       # Google Apps Script webhook for Google Sheets sync
├── public/                     # Public static assets & video/audio files
├── src/
│   ├── assets/                 # Component assets & brand media
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI primitives (flipping word swap, etc.)
│   │   ├── AtmosphereControls  # Background audio player & controls
│   │   ├── BrandLogo.jsx       # Header emblem lockup
│   │   ├── CountdownTimer.jsx  # Rolling unit countdown
│   │   ├── HeroContent.jsx     # Editorial typography
│   │   ├── VideoBackground.jsx # Gapless video background engine
│   │   └── WaitlistButton.jsx  # Waitlist modal & form handler
│   ├── services/
│   │   └── waitlistService.js  # API service connecting to Google Sheets
│   ├── App.css                 # Comprehensive responsive CSS design system
│   ├── App.jsx                 # Single-screen stage composition
│   ├── index.css               # Global tokens, typography, and reset
│   └── main.jsx                # Application root
├── vercel.json                 # Vercel SPA routing & build configuration
├── vite.config.js              # Vite configuration
└── package.json
```

---

## 📜 License

Private & Confidential © Trikal Darshi. All Rights Reserved.
