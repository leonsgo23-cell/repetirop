import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

const API = '';

export default function Promo() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { token, user, login, register } = useAuth();
  const { state } = useApp();
  const lang = state.language || 'lv';

  const [status, setStatus] = useState('checking'); // checking | valid | invalid | redeeming | done
  const [days, setDays] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const T = {
    checking:  { ru: 'Проверяем промокод...', uk: 'Перевіряємо промокод...', lv: 'Pārbaudām promo kodu...' },
    invalid:   { ru: 'Промокод недействителен', uk: 'Промокод недійсний', lv: 'Promo kods nav derīgs' },
    invalidSub:{ ru: 'Попробуйте другую ссылку или обратитесь к нам.', uk: 'Спробуйте іншу ссилку або зверніться до нас.', lv: 'Mēģiniet citu saiti vai sazinieties ar mums.' },
    title:     { ru: '🎁 Бесплатный доступ', uk: '🎁 Безкоштовний доступ', lv: '🎁 Bezmaksas piekļuve' },
    subtitle:  { ru: (d) => `${d} дней бесплатного доступа ко всем функциям`, uk: (d) => `${d} днів безкоштовного доступу до всіх функцій`, lv: (d) => `${d} dienas bezmaksas piekļuve visām funkcijām` },
    register:  { ru: 'Создать аккаунт и активировать', uk: 'Створити акаунт і активувати', lv: 'Izveidot kontu un aktivizēt' },
    login:     { ru: 'Войти и активировать', uk: 'Увійти і активувати', lv: 'Ieiet un aktivizēt' },
    hasAccount:{ ru: 'Уже есть аккаунт?', uk: 'Вже є акаунт?', lv: 'Jau ir konts?' },
    noAccount: { ru: 'Нет аккаунта?', uk: 'Немає акаунта?', lv: 'Nav konta?' },
    email:     { ru: 'Email', uk: 'Email', lv: 'E-pasts' },
    emailPh:   { ru: 'ваш@email.com', uk: 'ваш@email.com', lv: 'jūsu@epasts.lv' },
    pass:      { ru: 'Пароль', uk: 'Пароль', lv: 'Parole' },
    done:      { ru: '🎉 Доступ активирован!', uk: '🎉 Доступ активовано!', lv: '🎉 Piekļuve aktivizēta!' },
    doneSub:   { ru: (d) => `${d} дней бесплатного доступа добавлено`, uk: (d) => `${d} днів безкоштовного доступу додано`, lv: (d) => `${d} bezmaksas dienas pievienotas` },
    go:        { ru: 'Перейти в приложение →', uk: 'Перейти до застосунку →', lv: 'Doties uz lietotni →' },
  };
  const t = (k, arg) => {
    const val = T[k]?.[lang] || T[k]?.ru;
    return typeof val === 'function' ? val(arg) : val;
  };

  // Step 1: verify code with server
  useEffect(() => {
    fetch(`${API}/api/promo/${encodeURIComponent(code)}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => { setDays(data.days); setStatus('valid'); })
      .catch(() => setStatus('invalid'));
  }, [code]);

  // If already logged in — redeem immediately
  useEffect(() => {
    if (status === 'valid' && token && user) {
      redeemCode(token);
    }
  }, [status, token, user]);

  async function redeemCode(tkn) {
    setStatus('redeeming');
    try {
      const r = await fetch(`${API}/api/promo/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tkn}` },
        body: JSON.stringify({ code }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      setDays(data.days);
      setStatus('done');
    } catch (err) {
      setError(err.message);
      setStatus('valid');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let tkn;
      if (isLogin) {
        await login(email.trim(), password);
        tkn = localStorage.getItem('zephyr-token');
      } else {
        await register(email.trim(), password);
        tkn = localStorage.getItem('zephyr-token');
      }
      await redeemCode(tkn);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center">
        <p className="text-white/50">{t('checking')}</p>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-xl font-black text-white mb-2">{t('invalid')}</h1>
          <p className="text-white/40 text-sm">{t('invalidSub')}</p>
        </div>
      </div>
    );
  }

  if (status === 'done') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-sm">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-black text-white mb-2">{t('done')}</h1>
          <p className="text-green-400 text-sm mb-8">{t('doneSub', days)}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-black px-8 py-3 rounded-xl transition-colors"
          >
            {t('go')}
          </button>
        </motion.div>
      </div>
    );
  }

  // status === 'valid' and not logged in — show register/login form
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-6">
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎁</div>
          <h1 className="text-2xl font-black text-white">{t('title')}</h1>
          <p className="text-green-400 text-sm mt-2">{t('subtitle', days)}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1 block">{t('email')}</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPh')}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>
          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1 block">{t('pass')}</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 text-center">{error}</p>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading || status === 'redeeming'}
            className="bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-black py-3 rounded-xl transition-colors"
          >
            {loading || status === 'redeeming' ? '...' : (isLogin ? t('login') : t('register'))}
          </motion.button>
        </form>

        <p className="text-center text-white/40 text-sm mt-4">
          {isLogin ? t('noAccount') : t('hasAccount')}{' '}
          <button onClick={() => { setIsLogin((v) => !v); setError(''); }} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            {isLogin ? t('register') : t('login')}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
