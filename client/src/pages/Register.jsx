import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already logged in → skip registration
  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Пароль должен быть не менее 6 символов · Пароль має бути не менше 6 символів · Parolei jābūt vismaz 6 simboliem'); return; }
    if (password !== confirm) { setError('Пароли не совпадают · Паролі не збігаються · Paroles nesakrīt'); return; }
    setLoading(true);
    try {
      await register(email.trim(), password);
      navigate('/welcome');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-black text-white">Регистрация</h1>
          <p className="text-indigo-300 text-sm mt-1">Reģistrācija</p>
        </div>

        <form onSubmit={submit} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1 block">Email</label>
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
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1 block">
              Пароль · Parole
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>
          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1 block">
              Повтор пароля · Atkārtot paroli
            </label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Повтори пароль"
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
            {loading ? '...' : 'Зарегистрироваться · Reģistrēties'}
          </motion.button>
        </form>

        <p className="text-center text-white/40 text-sm mt-5">
          Уже есть аккаунт? · Jau ir konts?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Войти · Ieiet
          </Link>
        </p>
        <p className="text-center text-white/20 text-xs mt-3">
          3 дня бесплатного доступа · Без карты ·
          Pēc reģistrācijas — 3 dienas bezmaksas piekļuve
        </p>
      </motion.div>
    </div>
  );
}
