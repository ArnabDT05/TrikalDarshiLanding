import React, { useState, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { submitToWaitlist } from '../services/waitlistService';

export default function WaitlistButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      await submitToWaitlist({ name, email });
      setStatus('success');
    } catch (err) {
      console.error('[Trikal Darshi] Waitlist submission error:', err);
      setStatus('error');
      setErrorMessage(
        err.message || 'Celestial connection disrupted. Please try again in a moment.'
      );
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStatus('idle');
      setName('');
      setEmail('');
      setErrorMessage('');
    }, 300);
  };

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Primary Waitlist Action Trigger below the person's legs */}
      <div className="waitlist-trigger-zone" aria-label="Waitlist Access">
        <button
          type="button"
          className="waitlist-cta-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Join the Trikal Darshi Waitlist"
        >
          <span className="cta-sparkle" aria-hidden="true">✦</span>
          <span className="cta-text">Join The Waitlist</span>
          <span className="cta-sparkle" aria-hidden="true">✦</span>
        </button>
      </div>

      {/* Celestial Waitlist Dialog Modal */}
      {isOpen && (
        <div
          className="waitlist-modal-backdrop"
          onClick={handleClose}
          role="presentation"
        >
          <div
            className="waitlist-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="waitlist-title"
          >
            {/* Close Button */}
            <button
              type="button"
              className="waitlist-close-btn"
              onClick={handleClose}
              aria-label="Close waitlist modal"
            >
              <X size={17} />
            </button>

            {/* Modal Header */}
            <div className="modal-header">
              <h3 id="waitlist-title" className="modal-title">
                Join The Trikal Darshi
              </h3>
              <p className="modal-subtitle">
                Be among the first to unveil the secrets of your past, present, and future — and receive your personalized Vedic guidance upon our sacred awakening.
              </p>
            </div>

            {/* Form or Success State */}
            {status === 'success' ? (
              <div className="modal-success-box">
                <div className="success-icon-ring" aria-hidden="true">
                  <Check size={22} />
                </div>
                <h4 className="success-title">Your Place Is Reserved</h4>
                <p className="success-desc">
                  Your stars are aligned{name.trim() ? `, ${name.trim()}` : ''}. We will awaken you at{' '}
                  <span className="success-email">{email}</span> the moment the portal opens.
                </p>
                <button
                  type="button"
                  className="modal-submit-btn"
                  onClick={handleClose}
                >
                  Return To Portal
                </button>
              </div>
            ) : (
              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="input-field-wrapper">
                  <input
                    type="text"
                    required
                    disabled={status === 'submitting'}
                    placeholder="Enter your name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="waitlist-input"
                    autoFocus
                  />
                </div>
                <div className="input-field-wrapper">
                  <input
                    type="email"
                    required
                    disabled={status === 'submitting'}
                    placeholder="Enter your sacred email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="waitlist-input"
                  />
                </div>

                {errorMessage && (
                  <div className="modal-error-text" role="alert">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="modal-submit-btn"
                >
                  {status === 'submitting' ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                      <Loader2 size={16} className="spin-animation" />
                      Aligning With The Stars...
                    </span>
                  ) : (
                    'Secure Early Access'
                  )}
                </button>
                <span className="modal-disclaimer">
                  No spam. Strictly celestial wisdom and launch invitation.
                </span>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
