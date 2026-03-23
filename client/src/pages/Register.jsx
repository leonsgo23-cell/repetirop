import { useState } from 'react';
import { useNavigate, useSearchParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { STRIPE_LINKS } from '../data/plans';
import { trackEvent } from '../lib/analytics';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, user, loading: authLoading } = useAuth();
  const { state } = useApp();
  const lang = state.language || 'lv';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already logged in → redirect immediately without flash
  if (!authLoading && user) return <Navigate to="/subscribe" replace />;

  const errMsgs = {
    short:     { ru: 'Пароль должен быть не менее 6 символов', uk: 'Пароль має бути не менше 6 символів', lv: 'Parolei jābūt vismaz 6 simboliem' },
    match:     { ru: 'Пароли не совпадают', uk: 'Паролі не збігаються', lv: 'Paroles nesakrīt' },
    duplicate: { ru: 'Этот email уже зарегистрирован. Войдите или используйте другой email.', uk: 'Цей email вже зареєстровано. Увійдіть або використайте інший email.', lv: 'Šis e-pasts jau reģistrēts. Ienāciet vai izmantojiet citu e-pastu.' },
  };
  const e = (key) => errMsgs[key][lang] || errMsgs[key].ru;

  const plan = searchParams.get('plan');

  const submit = async (ev) => {
    ev.preventDefault();
    setError('');
    if (password.length < 6) { setError(e('short')); return; }
    if (password !== confirm) { setError(e('match')); return; }
    setLoading(true);
    try {
      const trimmedEmail = email.trim();
      const noTrial = !!STRIPE_LINKS[plan];
      await register(trimmedEmail, password, noTrial);
      trackEvent('sign_up', { method: 'email', plan: plan || 'trial' });
      if (STRIPE_LINKS[plan]) {
        trackEvent('begin_checkout', { plan });
        window.location.href = `${STRIPE_LINKS[plan]}?prefilled_email=${encodeURIComponent(trimmedEmail)}`;
      } else {
        navigate(searchParams.get('next') === 'subscribe' ? '/subscribe' : '/welcome');
      }
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('already') || msg.includes('409') || msg.includes('registered')) {
        setError(e('duplicate'));
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const T = {
    title:    { ru: 'Регистрация', uk: 'Реєстрація', lv: 'Reģistrācija' },
    labelEmail: { ru: 'Электронная почта', uk: 'Електронна пошта', lv: 'E-pasts' },
    labelPass:  { ru: 'Пароль', uk: 'Пароль', lv: 'Parole' },
    labelConfirm: { ru: 'Повтор пароля', uk: 'Підтвердження пароля', lv: 'Atkārtot paroli' },
    placeholderPass: { ru: 'Минимум 6 символов', uk: 'Мінімум 6 символів', lv: 'Vismaz 6 simboli' },
    placeholderConfirm: { ru: 'Повтори пароль', uk: 'Повтори пароль', lv: 'Atkārto paroli' },
    btn:      { ru: 'Зарегистрироваться', uk: 'Зареєструватись', lv: 'Reģistrēties' },
    hasAccount: { ru: 'Уже есть аккаунт?', uk: 'Вже є акаунт?', lv: 'Jau ir konts?' },
    login:    { ru: 'Войти', uk: 'Увійти', lv: 'Ieiet' },
    trial:    { ru: '7 дней бесплатно · Без карты', uk: '7 днів безкоштовно · Без картки', lv: '7 dienas bez maksas · Bez kartes' },
  };
  const t = (key) => T[key][lang] || T[key].ru;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🦉</div>
          <h1 className="text-3xl font-black text-white">{t('title')}</h1>
        </div>

        <form onSubmit={submit} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1 block">{t('labelEmail')}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>
          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1 block">{t('labelPass')}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('placeholderPass')}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>
          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1 block">{t('labelConfirm')}</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder={t('placeholderConfirm')}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 text-center">
              {error}
            </p>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-black py-3 rounded-xl transition-colors"
          >
            {loading ? '...' : t('btn')}
          </motion.button>
        </form>

        <p className="text-center text-white/40 text-sm mt-5">
          {t('hasAccount')}{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            {t('login')}
          </Link>
        </p>
        {!plan && <p className="text-center text-white/20 text-xs mt-3">{t('trial')}</p>}
      </motion.div>
    </div>
  );
}
