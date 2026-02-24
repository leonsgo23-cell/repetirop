import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

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

  const pick = (lang) => {
    updateState({ language: lang });
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
        <div className="text-8xl mb-5 animate-float inline-block select-none">🧙‍♂️</div>
        <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-2">
          Магия Знаний
        </h1>
        <p className="text-indigo-300 font-semibold text-lg mb-1">
          Zināšanu Maģija
        </p>
        <p className="text-white/50 text-sm">
          Интерактивный репетитор · Латвия · 1–12 класс
        </p>
      </motion.div>

      {/* Language picker */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="w-full max-w-xs relative z-10"
      >
        <p className="text-center text-white/60 text-sm uppercase tracking-widest mb-5 font-bold">
          Выбери язык · Izvēlies valodu
        </p>

        <div className="grid grid-cols-2 gap-4">
          {[
            { lang: 'ru', flag: '🇷🇺', label: 'Русский', sub: 'Russian' },
            { lang: 'lv', flag: '🇱🇻', label: 'Latviešu', sub: 'Latvian' },
          ].map(({ lang, flag, label, sub }) => (
            <motion.button
              key={lang}
              whileTap={{ scale: 0.93 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => pick(lang)}
              className="flex flex-col items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20
                         rounded-2xl py-7 px-4 text-white transition-colors duration-200 shadow-xl"
            >
              <span className="text-5xl">{flag}</span>
              <span className="font-black text-xl">{label}</span>
              <span className="text-white/50 text-xs">{sub}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

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
