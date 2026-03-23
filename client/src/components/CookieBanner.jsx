import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initGA } from '../lib/analytics';

const STORAGE_KEY = 'cookie-consent';

const T = {
  text: {
    ru: 'Мы используем файлы cookie для аналитики и улучшения сервиса. Продолжая пользоваться сайтом, вы соглашаетесь с их использованием.',
    uk: 'Ми використовуємо файли cookie для аналітики та покращення сервісу. Продовжуючи користуватися сайтом, ви погоджуєтесь з їх використанням.',
    lv: 'Mēs izmantojam sīkdatnes analīzei un pakalpojuma uzlabošanai. Turpinot lietot vietni, jūs piekrītat to izmantošanai.',
  },
  privacy: { ru: 'Политика конфиденциальности', uk: 'Політика конфіденційності', lv: 'Privātuma politika' },
  accept: { ru: 'Принять', uk: 'Прийняти', lv: 'Pieņemt' },
  decline: { ru: 'Только необходимые', uk: 'Лише необхідні', lv: 'Tikai nepieciešamie' },
};

function detectLang() {
  const nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
  if (nav.startsWith('lv')) return 'lv';
  if (nav.startsWith('uk')) return 'uk';
  return 'ru';
}

export default function CookieBanner({ onConsent }) {
  const [visible, setVisible] = useState(false);
  const lang = detectLang();
  const t = (key) => T[key][lang];

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) setVisible(true);
  }, []);

  const handle = (value) => {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
    if (value === 'accepted') initGA();
    if (onConsent) onConsent(value);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="max-w-3xl mx-auto bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="flex-1 text-sm text-gray-300 leading-relaxed">
          <span className="mr-1">🍪</span>
          {t('text')}{' '}
          <Link to="/privacy" className="text-indigo-400 hover:underline whitespace-nowrap">
            {t('privacy')}
          </Link>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => handle('essential')}
            className="text-sm text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 px-4 py-2 rounded-xl transition-colors"
          >
            {t('decline')}
          </button>
          <button
            onClick={() => handle('accepted')}
            className="text-sm bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-5 py-2 rounded-xl transition-colors"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Returns stored consent: 'accepted' | 'essential' | null */
export function getCookieConsent() {
  return localStorage.getItem(STORAGE_KEY);
}
