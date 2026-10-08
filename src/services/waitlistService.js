/**
 * Trikal Darshi - Waitlist Service
 * Synchronizes early access entries with Google Spreadsheets via Google Apps Script Webhook.
 */

// Reads from .env (VITE_GOOGLE_SHEETS_URL) or can be configured directly below
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL || '';

const STORAGE_KEY = 'trikal_waitlist_entries';

/**
 * Persists an entry to localStorage as a safety backup
 */
function saveBackupEntry(entry) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    existing.unshift(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 500)));
  } catch (err) {
    console.warn('[Trikal Darshi] Could not store local backup:', err);
  }
}

/**
 * Submits waitlist details to the connected Google Spreadsheet
 * @param {Object} data - { name: string, email: string }
 * @returns {Promise<{ success: boolean, localBackup: boolean }>}
 */
export async function submitToWaitlist({ name, email }) {
  const timestamp = new Date().toISOString();
  const readableIST = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const record = {
    name: name.trim(),
    email: email.trim(),
    timestamp,
    readableIST,
    source: 'Trikal Darshi Portal',
  };

  // Always store local backup first
  saveBackupEntry(record);

  // If Google Script URL is configured, transmit to Google Sheets
  if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.trim().startsWith('http')) {
    const params = new URLSearchParams();
    params.append('name', record.name);
    params.append('email', record.email);
    params.append('timestamp', record.readableIST);

    try {
      // mode: 'no-cors' allows posting to Google Apps Script's 302-redirected endpoint
      // without getting blocked by browser CORS restrictions.
      await fetch(GOOGLE_SCRIPT_URL.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      console.info('[Trikal Darshi] ✨ Submission successfully transmitted to Google Sheets:', record.email);
      return { success: true, localBackup: true };
    } catch (networkError) {
      console.error('[Trikal Darshi] Network error posting to Google Sheets:', networkError);
      // Even if network fails, we saved locally. Re-throw if critical or resolve.
      throw new Error('Celestial connection disrupted. Please verify your connection.');
    }
  } else {
    // If Web App URL is not yet populated, log developer reminder and proceed
    console.info(
      '%c[Trikal Darshi Waitlist]%c Entry saved to browser backup! %cTo connect live to your Google Sheet:%c Follow the steps in google-apps-script.js and set VITE_GOOGLE_SHEETS_URL in .env',
      'color: #D7B46A; font-weight: bold;',
      'color: #E9D5A0;',
      'color: #929EB6; font-style: italic;',
      'color: #F7F1E5;'
    );
    // Simulate brief network alignment latency
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { success: true, localBackup: true };
  }
}

// Expose debug tool in window for easy inspection if needed
if (typeof window !== 'undefined') {
  window.trikalWaitlist = {
    getEntries: () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'),
    clearEntries: () => localStorage.removeItem(STORAGE_KEY),
  };
}
