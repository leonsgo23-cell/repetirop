import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const LANGS = [
  { lang: 'lv', flag: '🇱🇻', label: 'Latviešu' },
  { lang: 'ru', flag: '🇷🇺', label: 'Русский' },
  { lang: 'uk', flag: '🇺🇦', label: 'Українська' },
];

const stars = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() > 0.7 ? 'text-base' : 'text-xs',
  delay: `${(Math.random() * 3).toFixed(1)}s`,
  duration: `${(2 + Math.random() * 2).toFixed(1)}s`,
}));

export default function Welcome() {
  const navigate = useNavigate();
  const { state, updateState } = useApp();
  const { user } = useAuth();
  const lang = state.language || 'ru';
  const [open, setOpen] = useState(false);

  const current = LANGS.find((l) => l.lang === lang) || LANGS[1];

  const pick = (l) => {
    setOpen(false);
    updateState({ language: l });
    if (state.studentName && state.grade) {
      navigate('/dashboard');
    } else {
      navigate('/setup');
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Decorative stars */}
      {stars.map((s) => (
        <span
          key={s.id}
          className={`absolute ${s.size} text-white/30 select-none pointer-events-none animate-pulse`}
          style={{ top: s.top, left: s.left, animationDelay: s.delay, animationDuration: s.duration }}
        >
          ✦
        </span>
      ))}

      {/* Logo / mascot */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        className="text-center mb-10 relative z-10"
      >
        <img src="/6.png" alt="SmartSkola" className="animate-float inline-block select-none mb-3" style={{ width: '120px', height: '120px', borderRadius: '28px' }} />
        <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-2">
          SmartSkola
        </h1>
        <p className="text-white/50 text-sm">
          Интерактивный репетитор · Латвия · 1–12 класс
        </p>
      </motion.div>

      {/* Language picker — compact dropdown */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="relative z-20 w-full max-w-xs"
      >
        <p className="text-center text-white/60 text-xs uppercase tracking-widest mb-3 font-bold">
          Izvēlies valodu / Язык / Мова
        </p>

        {/* Trigger button */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl px-5 py-4 text-white transition-colors shadow-xl"
        >
          <span className="flex items-center gap-3">
            <span className="text-3xl">{current.flag}</span>
            <span className="font-black text-lg">{current.label}</span>
          </span>
          <span className={`text-white/50 text-sm transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {/* Dropdown options */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 w-full bg-[#1e1b4b] border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
            >
              {LANGS.map(({ lang: l, flag, label }) => (
                <button
                  key={l}
                  onClick={() => pick(l)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-white hover:bg-white/10 transition-colors text-left ${l === lang ? 'bg-white/10' : ''}`}
                >
                  <span className="text-2xl">{flag}</span>
                  <span className="font-bold">{label}</span>
                  {l === lang && <span className="ml-auto text-indigo-400 text-sm">✓</span>}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Continue button — shows after language shown */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-5 relative z-10 w-full max-w-xs"
      >
        <button
          onClick={() => pick(lang)}
          className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-black py-4 rounded-2xl text-lg shadow-2xl shadow-indigo-500/30 transition-colors"
        >
          {lang === 'lv' ? 'Turpināt →' : lang === 'uk' ? 'Продовжити →' : 'Продолжить →'}
        </button>
      </motion.div>

      {/* Pay now link */}
      {user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-4 text-center relative z-10"
        >
          <button
            onClick={() => navigate('/subscribe')}
            className="text-white/30 hover:text-white/60 text-xs transition-colors"
          >
            {lang === 'lv' ? 'Apmaksāt abonementu uzreiz →' : lang === 'uk' ? 'Одразу оплатити підписку →' : 'Сразу оплатить подписку →'}
          </button>
        </motion.div>
      )}

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 text-white/20 text-xs text-center px-4"
      >
        Powered by Claude AI · Izstrādāts Latvijai
      </motion.p>
    </div>
  );
}
