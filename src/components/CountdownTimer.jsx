import React, { useState, useEffect } from 'react';

// Configurable Launch Target Time: October 17, 2026 at 05:55:00
// Month index in JavaScript Date is 0-indexed (9 = October)
const DEFAULT_TARGET_TIME = new Date(2026, 9, 17, 5, 55, 0).getTime();

function RollingDigit({ digit }) {
  const [current, setCurrent] = useState(digit);
  const [previous, setPrevious] = useState(null);

  // Adjust state during render when prop changes (React recommended pattern)
  if (digit !== current) {
    setPrevious(current);
    setCurrent(digit);
  }

  useEffect(() => {
    if (previous !== null) {
      const timer = setTimeout(() => {
        setPrevious(null);
      }, 520);
      return () => clearTimeout(timer);
    }
  }, [previous]);

  const isRolling = previous !== null;

  return (
    <span className="rolling-digit-box">
      {isRolling && (
        <span className="rolling-digit-item rolling-digit-out" aria-hidden="true">
          {previous}
        </span>
      )}
      <span
        className={`rolling-digit-item ${
          isRolling ? 'rolling-digit-in' : 'rolling-digit-static'
        }`}
      >
        {current}
      </span>
    </span>
  );
}

function RollingNumber({ value }) {
  const digits = String(value).split('');
  return (
    <div className="countdown-num rolling-num-container">
      {digits.map((digit, idx) => (
        <RollingDigit key={idx} digit={digit} />
      ))}
    </div>
  );
}

export default function CountdownTimer({ targetDate }) {
  const targetTimestamp = targetDate
    ? new Date(targetDate).getTime()
    : DEFAULT_TARGET_TIME;

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetTimestamp));

  function calculateTimeLeft(targetMs) {
    const now = Date.now();
    const difference = targetMs - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isCompleted: true,
      };
    }

    // Exact mathematical difference calculation matching Python divmod logic
    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
      isCompleted: false,
    };
  }

  useEffect(() => {
    // Live 1-second interval ticker
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetTimestamp));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTimestamp]);

  const formatNum = (val) => String(val).padStart(2, '0');

  const units = [
    { label: 'DAYS', value: formatNum(timeLeft.days) },
    { label: 'HOURS', value: formatNum(timeLeft.hours) },
    { label: 'MINUTES', value: formatNum(timeLeft.minutes) },
    { label: 'SECONDS', value: formatNum(timeLeft.seconds) },
  ];

  return (
    <footer className="countdown-zone" role="contentinfo" aria-label="Launch Countdown">
      {/* Eyebrow Label */}
      <div className="countdown-eyebrow">
        <span className="countdown-eyebrow-line" aria-hidden="true" />
        <span className="countdown-eyebrow-text">THE COUNTDOWN BEGINS</span>
        <span className="countdown-eyebrow-line" aria-hidden="true" />
      </div>

      {timeLeft.isCompleted ? (
        /* Zero-state design */
        <div className="countdown-zero-state">
          <p className="zero-state-title">THE CELESTIAL PORTAL HAS AWAKENED</p>
          <p className="zero-state-sub">Vedic Alignment in Progress</p>
        </div>
      ) : (
        /* Four countdown units with subtle gold separators */
        <div className="countdown-units-cluster">
          {units.map((unit, index) => (
            <React.Fragment key={unit.label}>
              <div className="countdown-unit-box">
                <div className="countdown-num-wrapper">
                  <RollingNumber value={unit.value} />
                </div>
                <span className="countdown-label">{unit.label}</span>
              </div>

              {index < units.length - 1 && (
                <div className="countdown-separator" aria-hidden="true">
                  <span className="separator-dot top-dot" />
                  <span className="separator-line" />
                  <span className="separator-dot bottom-dot" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </footer>
  );
}
