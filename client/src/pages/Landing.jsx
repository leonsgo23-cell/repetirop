import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const stars = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() > 0.7 ? 'text-base' : 'text-xs',
  delay: `${(Math.random() * 4).toFixed(1)}s`,
  dur: `${(2 + Math.random() * 3).toFixed(1)}s`,
}));

const PLANS = [
  {
    id: '1mo',
    label: { ru: '1 месяц', lv: '1 mēnesis' },
    price: '€9.90',
    per: { ru: '/мес', lv: '/mēn' },
    badge: null,
  },
  {
    id: '6mo',
    label: { ru: '6 месяцев', lv: '6 mēneši' },
    price: '€49.90',
    per: { ru: '/полгода', lv: '/pusgads' },
    sub: { ru: '≈ €8.32/мес', lv: '≈ €8.32/mēn' },
    badge: { ru: 'Популярный', lv: 'Populārs' },
    highlight: true,
  },
  {
    id: '12mo',
    label: { ru: '1 год', lv: '1 gads' },
    price: '€89.90',
    per: { ru: '/год', lv: '/gadā' },
    sub: { ru: '≈ €7.49/мес', lv: '≈ €7.49/mēn' },
    badge: { ru: 'Лучшая цена', lv: 'Labākā cena' },
  },
];

const FEATURES = [
  {
    icon: '🤖',
    title: { ru: 'AI-репетитор 24/7', lv: 'AI pasniedzējs 24/7' },
    desc: {
      ru: 'Персональный репетитор на базе Gemini отвечает на любые вопросы по школьной программе',
      lv: 'Personīgais Gemini pasniedzējs atbild uz jebkuriem skolas jautājumiem',
    },
  },
  {
    icon: '🎮',
    title: { ru: 'Геймификация', lv: 'Gamifikācija' },
    desc: {
      ru: 'XP, уровни, стрики, достижения и магазин — учёба становится игрой',
      lv: 'XP, līmeņi, sērijas, sasniegumi un veikals — mācības kļūst par spēli',
    },
  },
  {
    icon: '📊',
    title: { ru: 'Прогресс и слабые места', lv: 'Progress un vājās vietas' },
    desc: {
      ru: 'Отслеживай прогресс по каждой теме, находи пробелы и исправляй их',
      lv: 'Seko progresam katrā tēmā, atrod robus un labo tos',
    },
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [lang, setLang] = useState('ru');

  const t = (obj) => (typeof obj === 'string' ? obj : obj[lang] || obj.ru);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white overflow-x-hidden">
      {/* Stars */}
      {stars.map((s) => (
        <span
          key={s.id}
          className={`fixed ${s.size} text-white/20 select-none pointer-events-none animate-pulse`}
          style={{ top: s.top, left: s.left, animationDelay: s.delay, animationDuration: s.dur }}
        >✦</span>
      ))}

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <div className="text-xl font-black tracking-tight">🧙‍♂️ Магия Знаний</div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'ru' ? 'lv' : 'ru')}
            className="text-white/50 hover:text-white text-sm font-semibold transition-colors"
          >
            {lang === 'ru' ? '🇱🇻 LV' : '🇷🇺 RU'}
          </button>
          {user ? (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-white/70 hover:text-white text-sm font-medium px-4 py-2 rounded-xl border border-white/20 hover:border-white/40 transition-all"
              >
                {lang === 'ru' ? 'Приложение' : 'Lietotne'}
              </button>
              <button
                onClick={() => { logout(); }}
                className="text-red-400/70 hover:text-red-400 text-sm font-medium px-4 py-2 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-all"
              >
                {lang === 'ru' ? 'Выйти' : 'Iziet'}
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-white/70 hover:text-white text-sm font-medium px-4 py-2 rounded-xl border border-white/20 hover:border-white/40 transition-all"
            >
              {lang === 'ru' ? 'Войти' : 'Ieiet'}
            </button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-16 pb-24 max-w-3xl mx-auto">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}>
          <div className="text-7xl mb-6 inline-block">🧙‍♂️</div>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-3">
            {lang === 'ru' ? 'Магия Знаний' : 'Zināšanu Maģija'}
          </h1>
          <p className="text-indigo-300 font-semibold text-xl mb-2">
            {lang === 'ru' ? 'Zināšanu Maģija' : 'Магия Знаний'}
          </p>
          <p className="text-white/50 text-base mb-10">
            {lang === 'ru'
              ? 'Интерактивный AI-репетитор для школьников Латвии · 1–12 класс'
              : 'Interaktīvs AI pasniedzējs Latvijas skolēniem · 1.–12. klase'}
          </p>
          {user ? (
            <div className="flex flex-col items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/dashboard')}
                className="bg-indigo-500 hover:bg-indigo-400 text-white font-black text-lg px-10 py-4 rounded-2xl shadow-2xl shadow-indigo-500/30 transition-colors"
              >
                {lang === 'ru' ? '📚 Перейти в приложение' : '📚 Doties uz lietotni'}
              </motion.button>
              <p className="text-white/30 text-sm">
                {lang === 'ru' ? `Вы вошли как ${user.email}` : `Jūs esat pieteicies kā ${user.email}`}
              </p>
              <button
                onClick={() => logout()}
                className="text-white/30 hover:text-white/60 text-xs underline transition-colors"
              >
                {lang === 'ru' ? 'Выйти и войти в другой аккаунт' : 'Iziet un pieteikties citā kontā'}
              </button>
            </div>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/register')}
                className="bg-indigo-500 hover:bg-indigo-400 text-white font-black text-lg px-10 py-4 rounded-2xl shadow-2xl shadow-indigo-500/30 transition-colors"
              >
                {lang === 'ru' ? '🚀 Начать бесплатно' : '🚀 Sākt bez maksas'}
              </motion.button>
              <p className="text-white/30 text-sm mt-4">
                {lang === 'ru' ? '24 часа бесплатно · Без карты' : '24 stundas bez maksas · Bez kartes'}
              </p>
            </>
          )}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 pb-24 max-w-5xl mx-auto">
        <h2 className="text-center text-2xl font-black mb-10 text-white/80">
          {lang === 'ru' ? 'Почему Магия Знаний?' : 'Kāpēc Zināšanu Maģija?'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <motion.div
              key={f.icon}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
            >
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-black text-lg mb-2">{t(f.title)}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{t(f.desc)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 px-6 pb-32 max-w-5xl mx-auto">
        <h2 className="text-center text-2xl font-black mb-2 text-white/80">
          {lang === 'ru' ? 'Тарифы' : 'Tarifi'}
        </h2>
        <p className="text-center text-white/40 text-sm mb-10">
          {lang === 'ru'
            ? 'Один класс на подписку. Дополнительные классы — добавляются отдельно.'
            : 'Viena klase uz abonementu. Papildu klases — pievieno atsevišķi.'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {PLANS.map((p) => (
            <motion.div
              key={p.id}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`relative rounded-2xl p-7 border flex flex-col ${
                p.highlight
                  ? 'bg-indigo-600/30 border-indigo-400/60 shadow-2xl shadow-indigo-500/20'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              {p.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-black px-3 py-1 rounded-full">
                  {t(p.badge)}
                </span>
              )}
              <div className="text-lg font-black mb-1">{t(p.label)}</div>
              <div className="text-4xl font-black mb-1">{p.price}</div>
              <div className="text-white/50 text-sm mb-1">{t(p.per)}</div>
              {p.sub && <div className="text-indigo-300 text-xs mb-4">{t(p.sub)}</div>}
              <div className="mt-auto pt-4">
                <button
                  onClick={() => navigate('/register')}
                  className={`w-full py-3 rounded-xl font-black text-sm transition-all ${
                    p.highlight
                      ? 'bg-indigo-500 hover:bg-indigo-400 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {lang === 'ru' ? 'Выбрать' : 'Izvēlēties'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-8 text-white/20 text-xs px-4">
        Powered by Gemini AI · Izstrādāts Latvijai · © 2025 Магия Знаний
      </footer>
    </div>
  );
}

