import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { state, updateState } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already logged in → skip login
  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      const now = Date.now();
      const trialActive = user.trialEnd > now;
      const subActive = user.subscription && user.subscription.expiresAt > now;

      // No access at all → go to subscribe
      if (!trialActive && !subActive) {
        navigate('/subscribe');
        return;
      }

      // Sync server profile — server is source of truth, subscription grade takes priority
      if (user.profile || (subActive && user.subscription.grade)) {
        const p = user.profile || {};
        const subGrade = subActive ? user.subscription.grade : null;
        const targetGrade = subGrade ?? p.grade;
        const updates = {};
        if (targetGrade && state.grade !== targetGrade) updates.grade = targetGrade;
        if (p.studentName && !state.studentName) updates.studentName = p.studentName;
        if (p.language && !state.language) updates.language = p.language;
        if (Object.keys(updates).length > 0) updateState(updates);
      }

      // No profile set up yet → go to welcome/setup
      const hasProfile = state.studentName || user.profile?.studentName;
      const hasLang = state.language || user.profile?.language;
      if (!hasLang || !hasProfile) {
        navigate('/welcome');
        return;
      }

      navigate('/dashboard');
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
          <div className="text-5xl mb-3">🧙‍♂️</div>
          <h1 className="text-3xl font-black text-white">Вход</h1>
          <p className="text-indigo-300 text-sm mt-1">Ieiet</p>
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
              placeholder="Пароль"
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
            {loading ? '...' : 'Войти · Ieiet'}
          </motion.button>
        </form>

        <p className="text-center text-white/40 text-sm mt-5">
          Нет аккаунта? · Nav konta?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Зарегистрироваться · Reģistrēties
          </Link>
        </p>
        <button
          onClick={() => navigate('/')}
          className="block mx-auto mt-3 text-white/20 hover:text-white/40 text-xs transition-colors"
        >
          ← Назад · Atpakaļ
        </button>
      </motion.div>
    </div>
  );
}
