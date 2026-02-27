import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { t } from '../data/i18n';

export default function Setup() {
  const navigate = useNavigate();
  const { state, updateState } = useApp();
  const { user, saveProfile } = useAuth();
  const lang = state.language || 'ru';

  // Grade is locked if: active subscription (to sub grade) OR already chosen before (to chosen grade)
  const subGrade = user?.subscription?.expiresAt > Date.now() ? user.subscription.grade : null;
  const lockedGrade = subGrade ?? (state.grade ?? null);

  const [name, setName] = useState(state.studentName || '');
  const [grade, setGrade] = useState(lockedGrade || null);

  const canContinue = name.trim().length >= 2 && grade !== null;

  const handleSubmit = () => {
    if (!canContinue) return;
    const isFirstTime = !state.hasSeenGuide;
    updateState({ studentName: name.trim(), grade });
    // Save to server so it persists on other devices
    saveProfile(grade, name.trim(), state.language || 'ru');
    navigate(isFirstTime ? '/guide' : '/dashboard');
  };

  const gradeGroups = [
    { label: { ru: 'Начальная школа', lv: 'Sākumskola' }, grades: [1, 2, 3, 4] },
    { label: { ru: 'Основная школа',  lv: 'Pamatskola'  }, grades: [5, 6, 7, 8, 9] },
    { label: { ru: 'Средняя школа',   lv: 'Vidusskola'  }, grades: [10, 11, 12] },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex flex-col p-5 pb-10">
      {/* Back */}
      <button
        onClick={() => navigate('/')}
        className="text-white/50 hover:text-white text-sm font-bold mb-6 self-start transition-colors"
      >
        ← {lang === 'ru' ? 'Назад' : 'Atpakaļ'}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto w-full"
      >
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">👋</div>
          <h1 className="text-3xl font-black text-white">{t('setup.title', lang)}</h1>
        </div>

        {/* Name input */}
        <div className="mb-8">
          <label className="block text-indigo-300 font-bold mb-3 text-sm uppercase tracking-wider">
            {t('setup.nameLabel', lang)}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('setup.namePlaceholder', lang)}
            maxLength={30}
            className="w-full bg-white/10 border-2 border-white/20 focus:border-indigo-400 rounded-2xl
                       px-5 py-4 text-white text-lg font-bold placeholder-white/30 outline-none
                       transition-colors duration-200"
          />
        </div>

        {/* Grade picker */}
        <div className="mb-8">
          <label className="block text-indigo-300 font-bold mb-4 text-sm uppercase tracking-wider">
            {t('setup.gradeLabel', lang)}
          </label>

          {lockedGrade && (
            <p className="text-yellow-300/70 text-xs mb-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-2">
              🔒 {lang === 'ru'
                ? `Класс зафиксирован (${lockedGrade} класс)`
                : `Klase ir fiksēta (${lockedGrade}. klase)`}
            </p>
          )}

          <div className="space-y-4">
            {gradeGroups.map((group) => (
              <div key={group.label.ru}>
                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">
                  {group.label[lang]}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.grades.map((g) => {
                    const locked = lockedGrade !== null && g !== lockedGrade;
                    return (
                      <motion.button
                        key={g}
                        whileTap={locked ? {} : { scale: 0.9 }}
                        onClick={() => !locked && setGrade(g)}
                        disabled={locked}
                        className={`w-14 h-14 rounded-xl font-black text-lg transition-all duration-150
                          ${grade === g
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/40 scale-110'
                            : locked
                            ? 'bg-white/5 text-white/20 cursor-not-allowed'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                      >
                        {g}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <AnimatePresence>
          {canContinue && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              className="w-full btn-primary text-xl py-5"
            >
              {t('setup.cta', lang)}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
