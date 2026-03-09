import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

const STRIPE_LINKS = {
  '1mo':  'https://buy.stripe.com/7sYbIU0itgRV62y7Cm0ZW08',
  '6mo':  'https://buy.stripe.com/bJe00c8OZatxbmS6yi0ZW09',
  '12mo': 'https://buy.stripe.com/bJefZa0it9ptcqWaOy0ZW0a',
};

const PLANS = [
  {
    id: '1mo',
    label: { ru: '1 месяц', uk: '1 місяць', lv: '1 mēnesis' },
    price: '€19',
    per: { ru: '/мес', uk: '/міс', lv: '/mēn' },
    badge: null,
  },
  {
    id: '6mo',
    label: { ru: '6 месяцев', uk: '6 місяців', lv: '6 mēneši' },
    price: '€90',
    per: { ru: '/полгода', uk: '/півроку', lv: '/pusgads' },
    sub: { ru: '≈ €15/мес', uk: '≈ €15/міс', lv: '≈ €15/mēn' },
    badge: { ru: 'Популярный', uk: 'Популярний', lv: 'Populārs' },
    highlight: true,
  },
  {
    id: '12mo',
    label: { ru: '1 год', uk: '1 рік', lv: '1 gads' },
    price: '€119.88',
    per: { ru: '/год', uk: '/рік', lv: '/gadā' },
    sub: { ru: '≈ €9.99/мес', uk: '≈ €9.99/міс', lv: '≈ €9.99/mēn' },
    badge: { ru: 'Лучшая цена', uk: 'Найкраща ціна', lv: 'Labākā cena' },
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async () => {
    setLoading(true);
    setError('');
    try {
      // Save grade/plan to server before redirecting to Stripe
      await subscribe(selectedPlan, selectedGrade);
      updateState({ grade: selectedGrade });
      // Redirect to Stripe with prefilled email
      const base = STRIPE_LINKS[selectedPlan];
      const email = user?.email || '';
      window.location.href = `${base}?prefilled_email=${encodeURIComponent(email)}&client_reference_id=${encodeURIComponent(email)}`;
    } catch (err) {
      setError(err.message);
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
              {lang === 'lv' ? 'Izvēlies plānu' : lang === 'uk' ? 'Вибери план' : 'Выбери план'}
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
