import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { state } = useApp();
  const lang = state.language || 'lv';

  const [dots, setDots] = useState('');
  const [ready, setReady] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  const T = {
    title:    { ru: 'Оплата прошла!', uk: 'Оплата пройшла!', lv: 'Maksājums veikts!' },
    checking: { ru: 'Активируем доступ', uk: 'Активуємо доступ', lv: 'Aktivizējam piekļuvi' },
    ready:    { ru: '🎉 Доступ активирован!', uk: '🎉 Доступ активовано!', lv: '🎉 Piekļuve aktivizēta!' },
    timeout:  { ru: 'Это займёт чуть дольше. Нажми кнопку ниже, когда будешь готов.', uk: 'Це займе трохи більше часу. Натисни кнопку нижче, коли будеш готовий.', lv: 'Tas aizņems nedaudz vairāk laika. Nospied pogu zemāk, kad būsi gatavs.' },
    btn:      { ru: 'Начать →', uk: 'Почати →', lv: 'Sākt →' },
  };
  const t = (k) => T[k][lang] || T[k].ru;

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 15; // 30 seconds

    const dotsInterval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 500);

    const pollInterval = setInterval(async () => {
      attempts++;
      try {
        await refreshUser();
      } catch (_) { /* ignore */ }

      const sub = user?.subscription;
      if (sub && sub.expiresAt > Date.now()) {
        setReady(true);
        clearInterval(pollInterval);
        clearInterval(dotsInterval);
        // Redirect after brief celebration
        setTimeout(() => {
          const hasProfile = state.studentName;
          const hasLang = state.language;
          if (!hasLang || !hasProfile) {
            navigate('/welcome', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        }, 1500);
        return;
      }

      if (attempts >= maxAttempts) {
        setTimedOut(true);
        clearInterval(pollInterval);
        clearInterval(dotsInterval);
      }
    }, 2000);

    return () => {
      clearInterval(pollInterval);
      clearInterval(dotsInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-check whenever user updates (from refreshUser)
  useEffect(() => {
    if (!ready && user?.subscription?.expiresAt > Date.now()) {
      setReady(true);
      setTimeout(() => {
        const hasProfile = state.studentName;
        const hasLang = state.language;
        navigate(!hasLang || !hasProfile ? '/welcome' : '/dashboard', { replace: true });
      }, 1500);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleContinue = () => {
    const hasProfile = state.studentName;
    const hasLang = state.language;
    navigate(!hasLang || !hasProfile ? '/welcome' : '/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-6">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center max-w-sm"
      >
        <motion.div
          animate={ready ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.5 }}
          className="text-7xl mb-6"
        >
          {ready ? '🎉' : '✅'}
        </motion.div>

        <h1 className="text-3xl font-black text-white mb-3">{t('title')}</h1>

        {ready ? (
          <p className="text-green-400 font-black text-lg">{t('ready')}</p>
        ) : timedOut ? (
          <div>
            <p className="text-white/50 text-sm mb-6">{t('timeout')}</p>
            <button
              onClick={handleContinue}
              className="bg-indigo-500 hover:bg-indigo-400 text-white font-black px-8 py-3 rounded-xl transition-colors"
            >
              {t('btn')}
            </button>
          </div>
        ) : (
          <p className="text-white/50 text-sm">
            {t('checking')}{dots}
          </p>
        )}
      </motion.div>
    </div>
  );
}
