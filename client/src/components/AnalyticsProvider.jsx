import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getCookieConsent } from './CookieBanner';
import { initGA, trackPageView } from '../lib/analytics';

/**
 * Initializes GA4 if consent was already given (on page load),
 * and tracks page views on route changes.
 * Must be rendered inside <BrowserRouter>.
 */
export default function AnalyticsProvider() {
  const location = useLocation();
  const isFirst = useRef(true);

  // Init on mount if consent already stored
  useEffect(() => {
    if (getCookieConsent() === 'accepted') initGA();
  }, []);

  // Track page views on route change (skip first — GA4 sends it automatically on init)
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    if (getCookieConsent() === 'accepted') {
      trackPageView(location.pathname + location.search);
    }
  }, [location]);

  return null;
}
