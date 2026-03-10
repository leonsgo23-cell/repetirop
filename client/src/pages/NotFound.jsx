import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function NotFound() {
  const navigate = useNavigate();
  const { state } = useApp();
  const lang = state.language || 'lv';

  const T = {
    title:  { ru: 'Страница не найдена', uk: 'Сторінку не знайдено', lv: 'Lapa nav atrasta' },
    sub:    { ru: 'Такой страницы не существует или она была перемещена.', uk: 'Такої сторінки не існує або вона була переміщена.', lv: 'Šādas lapas nav vai tā ir pārvietota.' },
    home:   { ru: 'На главную', uk: 'На головну', lv: 'Uz sākumu' },
    back:   { ru: 'Назад', uk: 'Назад', lv: 'Atpakaļ' },
  };
  const t = (k) => T[k][lang] || T[k].ru;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-6">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center max-w-sm"
      >
        <div className="text-7xl mb-4">🔍</div>
        <h1 className="text-4xl font-black text-white mb-2">404</h1>
        <p className="text-xl font-bold text-white/70 mb-2">{t('title')}</p>
        <p className="text-white/40 text-sm mb-8">{t('sub')}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-5 py-3 rounded-xl transition-colors"
          >
            ← {t('back')}
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-black px-5 py-3 rounded-xl transition-colors"
          >
            {t('home')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
