/**
 * Google Analytics 4 — lazy-loaded only after cookie consent.
 * Measurement ID comes from VITE_GA_ID env var.
 */

const GA_ID = import.meta.env.VITE_GA_ID;

let initialized = false;

export function initGA() {
  if (initialized || !GA_ID) return;
  initialized = true;

  // Inject gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, {
    anonymize_ip: true,
    send_page_view: true,
  });
}

export function trackEvent(name, params = {}) {
  if (!initialized || !window.gtag) return;
  window.gtag('event', name, params);
}

export function trackPageView(path) {
  if (!initialized || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
  });
}
