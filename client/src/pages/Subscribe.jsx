import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

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

export default function Subscribe() {
  const navigate = useNavigate();
  const { subscribe, user } = useAuth();
  const { state, updateState } = useApp();
  const lang = state.language || 'ru';
  const t = (obj) => (typeof obj === 'string' ? obj : obj[lang] || obj.ru);

  // Default grade: existing subscription grade → AppContext grade → 5
  const defaultGrade = user?.subscription?.grade || state.grade || 5;
  const [selectedPlan, setSelectedPlan] = useState(
    user?.subscription?.plan || '6mo'
  );
  const [selectedGrade, setSelectedGrade] = useState(defaultGrade);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePay = () => setShowModal(true);

  const activateTest = async () => {
    setLoading(true);
    setError('');
    try {
      await subscribe(selectedPlan, selectedGrade);
      // Sync grade to AppContext so the AI tutor uses the correct class level
      updateState({ grade: selectedGrade });
      // Navigate: go straight to dashboard if already set up, otherwise setup
      if (state.studentName && state.language) {
        navigate('/dashboard');
      } else {
        navigate('/welcome');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-10">
            <div className="text-5xl mb-3">🛒</div>
            <h1 className="text-3xl font-black">
              {lang === 'ru' ? 'Выбери план' : 'Izvēlies plānu'}
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
              {lang === 'ru' ? '📚 Выбери класс' : '📚 Izvēlies klasi'}
            </h2>
            <p className="text-white/40 text-xs mb-4">
              {lang === 'ru'
                ? 'На этот класс будет открыт доступ к урокам и репетитору'
                : 'Šai klasei tiks atvērta piekļuve nodarbībām un pasniedzējam'}
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
            {lang === 'ru' ? '💳 Оплатить' : '💳 Apmaksāt'}
          </motion.button>
          <p className="text-center text-white/30 text-xs mt-3">
            {lang === 'ru'
              ? 'Безопасная оплата · Отмена в любое время'
              : 'Droša maksājums · Atcelšana jebkurā laikā'}
          </p>
        </motion.div>
      </div>

      {/* Stripe placeholder modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1740] border border-white/20 rounded-2xl p-8 max-w-sm w-full text-center"
            >
              <div className="text-4xl mb-4">💳</div>
              <h2 className="text-xl font-black mb-2">
                {lang === 'ru' ? 'Оплата Stripe' : 'Stripe maksājums'}
              </h2>
              <p className="text-white/50 text-sm mb-6">
                {lang === 'ru'
                  ? 'Stripe будет подключен скоро. Сейчас вы можете активировать тестовый доступ, чтобы попробовать приложение.'
                  : 'Stripe tiks pievienots drīz. Tagad varat aktivizēt testa piekļuvi, lai izmēģinātu lietotni.'}
              </p>
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 mb-6 text-left">
                <div className="text-sm font-black text-indigo-300 mb-1">
                  {lang === 'ru' ? 'Выбранный план:' : 'Izvēlētais plāns:'}
                </div>
                <div className="text-white font-black">
                  {t(PLANS.find(p => p.id === selectedPlan)?.label)} · {PLANS.find(p => p.id === selectedPlan)?.price}
                </div>
                <div className="text-white/60 text-sm">
                  {lang === 'ru' ? `${selectedGrade} класс` : `${selectedGrade}. klase`}
                </div>
              </div>
              <button
                onClick={activateTest}
                disabled={loading}
                className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-black py-3 rounded-xl transition-colors mb-3"
              >
                {loading ? '...' : (lang === 'ru' ? '✅ Активировать тест' : '✅ Aktivizēt testu')}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full text-white/40 hover:text-white/60 text-sm py-2 transition-colors"
              >
                {lang === 'ru' ? 'Отмена' : 'Atcelt'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
