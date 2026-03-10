import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

function fmtDate(ms, lang) {
  if (!ms) return '—';
  const locale = lang === 'lv' ? 'lv-LV' : lang === 'uk' ? 'uk-UA' : 'ru-RU';
  return new Date(ms).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
}

function fmtCountdown(ms, lang) {
  const diff = ms - Date.now();
  if (diff <= 0) return null;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (lang === 'lv') {
    if (h > 0) return `${h} st ${m} min`;
    return `${m} min`;
  }
  if (h > 0) return `${h} ч ${m} мин`;
  return `${m} мин`;
}

const PLAN_LABELS = {
  ru: { '1mo': '1 месяц',   '6mo': '6 месяцев', '12mo': '1 год'     },
  uk: { '1mo': '1 місяць',  '6mo': '6 місяців', '12mo': '1 рік'     },
  lv: { '1mo': '1 mēnesis', '6mo': '6 mēneši',  '12mo': '1 gads'   },
};

export default function Account() {
  const navigate = useNavigate();
  const { user, logout, isTrialActive, cancelSubscription } = useAuth();
  const { state } = useApp();
  const lang = state.language || 'ru';
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const sub = user?.subscription;
  const trialCountdown = user ? fmtCountdown(user.trialEnd, lang) : null;
  const subActive = sub && sub.expiresAt > now;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center">
        <p className="text-white/50">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-6">
      <div className="max-w-md mx-auto">
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button onClick={() => navigate('/dashboard')} className="text-white/40 hover:text-white/70 transition-colors">
              ← {lang === 'lv' ? 'Atpakaļ' : lang === 'uk' ? 'Назад' : 'Назад'}
            </button>
          </div>

          <div className="text-center mb-8">
            <div className="text-5xl mb-3">👤</div>
            <h1 className="text-2xl font-black">{lang === 'lv' ? 'Mans konts' : lang === 'uk' ? 'Мій акаунт' : 'Мой аккаунт'}</h1>
            <p className="text-indigo-300 text-sm mt-1 break-all">{user.email}</p>
          </div>

          {/* Trial banner */}
          {isTrialActive() && trialCountdown && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 mb-4 text-center">
              <p className="text-yellow-300 font-black text-sm">
                ⏳ {lang === 'lv' ? 'Izmēģinājuma periods' : lang === 'uk' ? 'Пробний період' : 'Пробный период'}
              </p>
              <p className="text-yellow-200/70 text-xs mt-1">
                {lang === 'lv' ? `Atlikušais laiks: ${trialCountdown}` : lang === 'uk' ? `Залишилось: ${trialCountdown}` : `Осталось: ${trialCountdown}`}
              </p>
            </div>
          )}

          {/* Subscription card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-4">
            <h2 className="font-black text-white/80 mb-4">
              {lang === 'lv' ? '📋 Abonements' : lang === 'uk' ? '📋 Підписка' : '📋 Подписка'}
            </h2>
            {subActive ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">{lang === 'lv' ? 'Plāns' : lang === 'uk' ? 'План' : 'План'}</span>
                  <span className="font-black text-white">{(PLAN_LABELS[lang] || PLAN_LABELS.ru)[sub.plan] || sub.plan}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">{lang === 'lv' ? 'Klase' : lang === 'uk' ? 'Клас' : 'Класс'}</span>
                  <span className="font-black text-white">
                    {lang === 'lv' ? `${sub.grade}. klase` : lang === 'uk' ? `${sub.grade} клас` : `${sub.grade} класс`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">{lang === 'lv' ? 'Aktīvs līdz' : lang === 'uk' ? 'Активна до' : 'Активна до'}</span>
                  <span className="font-black text-indigo-300">{fmtDate(sub.expiresAt, lang)}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-xs font-black">
                    {lang === 'lv' ? 'Abonements aktīvs' : lang === 'uk' ? 'Підписка активна' : 'Подписка активна'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-white/40 text-sm mb-4">
                  {lang === 'lv' ? 'Nav aktīva abonementa' : lang === 'uk' ? 'Немає активної підписки' : 'Нет активной подписки'}
                </p>
                <button
                  onClick={() => navigate('/subscribe')}
                  className="bg-indigo-500 hover:bg-indigo-400 text-white font-black px-6 py-2 rounded-xl text-sm transition-colors"
                >
                  {lang === 'lv' ? 'Iegūt abonementu' : lang === 'uk' ? 'Оформити підписку' : 'Оформить подписку'}
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          {subActive && (
            <div className="space-y-3 mb-4">
              <button
                onClick={() => navigate('/subscribe')}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
              >
                {lang === 'lv' ? '🔄 Pagarināt abonementu' : lang === 'uk' ? '🔄 Продовжити підписку' : '🔄 Продлить подписку'}
              </button>
              <button
                disabled
                className="w-full bg-white/5 border border-white/10 text-white/30 font-semibold py-3 rounded-xl text-sm cursor-not-allowed"
              >
                {lang === 'lv' ? '➕ Pievienot klasi (drīz)' : lang === 'uk' ? '➕ Додати клас (скоро)' : '➕ Добавить класс (скоро)'}
              </button>
            </div>
          )}

          {/* Cancel subscription */}
          {subActive && (
            <button
              onClick={() => setCancelModal(true)}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/40 hover:text-white/60 font-semibold py-3 rounded-xl text-sm transition-colors mb-3"
            >
              {lang === 'lv' ? '❌ Atcelt abonementu' : lang === 'uk' ? '❌ Скасувати підписку' : '❌ Отменить подписку'}
            </button>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-black py-3 rounded-xl text-sm transition-colors"
          >
            {lang === 'lv' ? '🚪 Iziet no konta' : lang === 'uk' ? '🚪 Вийти з акаунту' : '🚪 Выйти из аккаунта'}
          </button>
        </motion.div>
      </div>

      {/* Cancel confirmation modal */}
      <AnimatePresence>
        {cancelModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50"
            onClick={() => setCancelModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1740] border border-white/20 rounded-2xl p-7 max-w-sm w-full text-center"
            >
              <div className="text-4xl mb-3">⚠️</div>
              <h2 className="text-xl font-black mb-2 text-white">
                {lang === 'lv' ? 'Atcelt abonementu?' : lang === 'uk' ? 'Скасувати підписку?' : 'Отменить подписку?'}
              </h2>
              <p className="text-white/50 text-sm mb-6">
                {lang === 'lv'
                  ? 'Piekļuve nodarbībām tiks slēgta uzreiz pēc atcelšanas.'
                  : lang === 'uk'
                  ? 'Доступ до уроків буде закрито одразу після скасування.'
                  : 'Доступ к урокам будет закрыт сразу после отмены.'}
              </p>
              <button
                onClick={async () => {
                  setCancelling(true);
                  try {
                    await cancelSubscription();
                    setCancelModal(false);
                    navigate('/subscribe');
                  } finally {
                    setCancelling(false);
                  }
                }}
                disabled={cancelling}
                className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-black py-3 rounded-xl mb-3 transition-colors"
              >
                {cancelling ? '...' : (lang === 'lv' ? 'Jā, atcelt' : lang === 'uk' ? 'Так, скасувати' : 'Да, отменить')}
              </button>
              <button onClick={() => setCancelModal(false)} className="w-full text-white/30 hover:text-white/50 text-sm py-2 transition-colors">
                {lang === 'lv' ? 'Paturēt abonementu' : lang === 'uk' ? 'Залишити підписку' : 'Оставить подписку'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
