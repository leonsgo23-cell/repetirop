import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { PLANS, STRIPE_LINKS } from '../data/plans';

export default function Subscribe() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state, updateState } = useApp();
  const lang = state.language || 'ru';
  const t = (obj) => (typeof obj === 'string' ? obj : obj[lang] || obj.ru);

  const now = Date.now();
  const subActive = user?.subscription?.expiresAt > now;

  // Default grade: existing subscription grade → AppContext grade → 5
  const defaultGrade = user?.subscription?.grade || state.grade || 5;
  const [selectedPlan, setSelectedPlan] = useState(
    user?.subscription?.plan || '6mo'
  );
  const [selectedGrade, setSelectedGrade] = useState(defaultGrade);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePay = () => {
    setLoading(true);
    setError('');
    try {
      updateState({ grade: selectedGrade });
      // Encode grade in client_reference_id so webhook can set it on activation
      const base = STRIPE_LINKS[selectedPlan];
      const email = user?.email || '';
      const cRef = `${email}|${selectedGrade}`;
      window.location.href = `${base}?prefilled_email=${encodeURIComponent(email)}&client_reference_id=${encodeURIComponent(cRef)}`;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          {/* Trial expired banner */}
          {!subActive && user?.trialEnd && user.trialEnd < now && (
            <div className="bg-amber-500/15 border border-amber-500/40 rounded-2xl px-5 py-4 mb-8 text-center">
              <p className="text-amber-300 font-black text-base mb-1">
                {lang === 'lv' ? '⏰ Izmēģinājuma periods beidzies' : lang === 'uk' ? '⏰ Пробний період завершено' : '⏰ Пробный период завершён'}
              </p>
              <p className="text-white/60 text-sm">
                {lang === 'lv'
                  ? 'Jūsu iestatījumi un progress saglabāti. Izvēlieties plānu, lai turpinātu.'
                  : lang === 'uk'
                  ? 'Ваші налаштування та прогрес збережено. Оберіть план, щоб продовжити.'
                  : 'Ваши настройки и прогресс сохранены. Выберите план, чтобы продолжить.'}
              </p>
            </div>
          )}

          <div className="text-center mb-10">
            <div className="text-5xl mb-3">{subActive ? '🔄' : '🛒'}</div>
            <h1 className="text-3xl font-black">
              {subActive
                ? (lang === 'lv' ? 'Pagarināt abonementu' : lang === 'uk' ? 'Продовжити підписку' : 'Продлить подписку')
                : (lang === 'lv' ? 'Izvēlies plānu' : lang === 'uk' ? 'Вибери план' : 'Выбери план')}
            </h1>
            {user && (
              <p className="text-white/40 text-sm mt-1">{user.email}</p>
            )}
          </div>

          {/* Plan selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {PLANS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlan(p.id)}
                className={`relative rounded-2xl p-5 border text-left transition-all ${
                  selectedPlan === p.id
                    ? p.highlight
                      ? 'bg-indigo-600/40 border-indigo-400 shadow-lg shadow-indigo-500/20'
                      : 'bg-white/15 border-indigo-400'
                    : 'bg-white/5 border-white/10 hover:border-white/30'
                }`}
              >
                {p.badge && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
                    {t(p.badge)}
                  </span>
                )}
                <div className="font-black text-base mb-0.5">{t(p.label)}</div>
                <div className="text-2xl font-black">{p.price}</div>
                <div className="text-white/50 text-xs">{t(p.per)}</div>
                {p.sub && <div className="text-indigo-300 text-xs mt-0.5">{t(p.sub)}</div>}
                {selectedPlan === p.id && (
                  <div className="absolute top-3 right-3 text-indigo-400 text-lg">✓</div>
                )}
              </button>
            ))}
          </div>

          {/* Grade selection */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
            <h2 className="font-black mb-4 text-white/80">
              {lang === 'lv' ? '📚 Izvēlies klasi' : lang === 'uk' ? '📚 Оберіть клас' : '📚 Выбери класс'}
            </h2>
            <p className="text-white/40 text-xs mb-4">
              {lang === 'lv'
                ? 'Šai klasei tiks atvērta piekļuve nodarbībām un pasniedzējam'
                : lang === 'uk'
                ? 'Для цього класу буде відкрито доступ до уроків та репетитора'
                : 'На этот класс будет открыт доступ к урокам и репетитору'}
            </p>
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`py-2 rounded-xl text-sm font-black transition-all ${
                    selectedGrade === g
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white/70'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handlePay}
            className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-black py-4 rounded-2xl text-lg shadow-2xl shadow-indigo-500/30 transition-colors"
          >
            {lang === 'lv' ? '💳 Apmaksāt' : lang === 'uk' ? '💳 Оплатити' : '💳 Оплатить'}
          </motion.button>
          <p className="text-center text-white/30 text-xs mt-3">
            {lang === 'lv'
              ? 'Droša maksājums · Atcelšana jebkurā laikā'
              : lang === 'uk'
              ? 'Безпечна оплата · Скасування будь-коли'
              : 'Безопасная оплата · Отмена в любое время'}
          </p>
        </motion.div>
      </div>

    </div>
  );
}
