import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { SUBJECTS, ACHIEVEMENTS } from '../data/curriculum';
import { t } from '../data/i18n';

function XPBar({ current, total }) {
  const pct = Math.min(100, (current / total) * 100);
  return (
    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
      />
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="card flex flex-col items-center gap-1 flex-1">
      <span className="text-2xl">{icon}</span>
      <span className="text-white font-black text-xl">{value}</span>
      <span className="text-white/50 text-xs text-center leading-tight">{label}</span>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { state, xpToNextLevel, xpInCurrentLevel, topicLevelsDone } = useApp();
  const lang = state.language || 'ru';

  // Weak topics = started (entered a session) but not yet completed that level
  const startedTopics = state.startedTopics || [];
  const completedTopics = state.completedTopics || [];
  const weakTopics = startedTopics
    .filter((k) => !completedTopics.includes(k))
    .slice(0, 3)
    .map((key) => {
      const parts = key.split('_');
      const lvNum = parseInt(parts[parts.length - 1], 10);
      const subjectId = parts[0];
      const topicId = parts.slice(1, -1).join('_');
      const subject = SUBJECTS[subjectId];
      const topics = subject?.topics[state.grade] || [];
      const topic = topics.find((tp) => tp.id === topicId);
      return topic ? { key, subjectId, topicId, level: lvNum, name: topic.name[lang], icon: subject.icon } : null;
    })
    .filter(Boolean);

  const xpNext = xpToNextLevel(state.level);
  const xpCurr = xpInCurrentLevel(state.xp, state.level);

  const subjectList = Object.values(SUBJECTS);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] pb-10">
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 px-5 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <p className="text-white/50 text-sm">
              {t('dashboard.hi', lang)}, <span className="text-white font-bold">{state.studentName}</span>!
            </p>
            <p className="text-indigo-300 text-xs font-bold">
              {state.grade} {t('dashboard.grade', lang)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/guide')}
              title={lang === 'ru' ? 'Как это работает?' : 'Kā tas darbojas?'}
              style={{
                width: '30px', height: '30px',
                borderRadius: '50%',
                background: 'rgba(99,102,241,0.3)',
                border: '1.5px solid rgba(99,102,241,0.5)',
                color: 'rgba(255,255,255,0.8)',
                fontWeight: 900, fontSize: '0.85rem',
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              ?
            </button>
            <button
              onClick={() => navigate('/setup')}
              className="text-white/40 hover:text-white text-xs transition-colors"
            >
              ✏️ {t('dashboard.changeGrade', lang)}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 pt-6 space-y-7">

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3"
        >
          <StatCard icon="⚡" value={`${t('dashboard.level', lang)} ${state.level}`} label={`${state.xp} XP`} />
          <StatCard icon="🔥" value={state.streak} label={t('dashboard.streak', lang)} />
          <StatCard icon="🏆" value={state.achievements.length} label={t('dashboard.achievements', lang)} />
        </motion.div>

        {/* XP progress bar */}
        <div className="card">
          <div className="flex justify-between text-xs text-white/50 mb-2">
            <span className="font-bold text-yellow-400">{xpCurr} / 150 XP</span>
            <span>{xpNext - state.xp} XP → {t('dashboard.level', lang)} {state.level + 1}</span>
          </div>
          <XPBar current={xpCurr} total={150} />
        </div>

        {/* Quick actions row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}
        >
          {/* Homework helper */}
          <button
            onClick={() => navigate('/homework')}
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(91,33,182,0.25))',
              border: '1.5px solid rgba(167,139,250,0.35)',
              borderRadius: '16px', padding: '14px 14px',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px',
              cursor: 'pointer', textAlign: 'left',
              boxShadow: '0 4px 16px rgba(124,58,237,0.15)',
            }}
          >
            <span style={{ fontSize: '1.7rem' }}>📚</span>
            <p style={{ color: 'white', fontWeight: 900, fontSize: '0.85rem', margin: 0, lineHeight: 1.2 }}>
              {lang === 'ru' ? 'Домашнее задание' : 'Mājas darbs'}
            </p>
            <p style={{ color: 'rgba(167,139,250,0.8)', fontSize: '0.72rem', margin: 0, fontWeight: 600 }}>
              {lang === 'ru' ? 'Решить с Зефиром' : 'Risināt ar Zefīru'}
            </p>
          </button>

          {/* Progress */}
          <button
            onClick={() => navigate('/progress')}
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(79,70,229,0.25))',
              border: '1.5px solid rgba(129,140,248,0.35)',
              borderRadius: '16px', padding: '14px 14px',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px',
              cursor: 'pointer', textAlign: 'left',
              boxShadow: '0 4px 16px rgba(99,102,241,0.15)',
            }}
          >
            <span style={{ fontSize: '1.7rem' }}>📊</span>
            <p style={{ color: 'white', fontWeight: 900, fontSize: '0.85rem', margin: 0, lineHeight: 1.2 }}>
              {lang === 'ru' ? 'Мой прогресс' : 'Mans progress'}
            </p>
            <p style={{ color: 'rgba(129,140,248,0.8)', fontSize: '0.72rem', margin: 0, fontWeight: 600 }}>
              {lang === 'ru' ? 'Сильные и слабые места' : 'Stiprās un vājās vietas'}
            </p>
          </button>
        </motion.div>

        {/* Weak topics — repeat recommendations */}
        {weakTopics.length > 0 && (
          <div>
            <h2 className="text-white/70 font-black uppercase tracking-widest text-xs mb-3">
              {lang === 'ru' ? '🔁 Повтори' : '🔁 Atkārto'}
            </h2>
            <div className="flex flex-col gap-2">
              {weakTopics.map((wt) => (
                <motion.button
                  key={wt.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/tutor/${wt.subjectId}/${wt.topicId}/${wt.level}`)}
                  style={{
                    background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
                    borderRadius: '14px', padding: '11px 16px',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{wt.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 700, fontSize: '0.85rem', margin: 0 }}>
                      {wt.name}
                    </p>
                    <p style={{ color: 'rgba(245,158,11,0.8)', fontSize: '0.72rem', margin: '1px 0 0', fontWeight: 600 }}>
                      {lang === 'ru' ? `Уровень ${wt.level} не завершён` : `${wt.level}. līmenis nav pabeigts`}
                    </p>
                  </div>
                  <span style={{ color: 'rgba(245,158,11,0.6)', fontSize: '0.75rem', fontWeight: 800 }}>
                    {lang === 'ru' ? 'Продолжить →' : 'Turpināt →'}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Subject cards */}
        <div>
          <h2 className="text-white/70 font-black uppercase tracking-widest text-xs mb-4">
            {t('dashboard.subjects', lang)}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subjectList.map((subj, i) => {
              const topics = subj.topics[state.grade] || [];
              const done = topics.filter((tp) =>
                topicLevelsDone(subj.id, tp.id) > 0
              ).length;

              return (
                <motion.button
                  key={subj.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate(`/topics/${subj.id}`)}
                  className={`relative overflow-hidden bg-gradient-to-br ${subj.gradient}
                    rounded-2xl p-5 text-left shadow-xl ${subj.glow} shadow-lg
                    hover:opacity-90 transition-opacity duration-200`}
                >
                  {/* Decorative circle */}
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
                  <div className="absolute -right-2 -bottom-8 w-20 h-20 bg-white/10 rounded-full" />

                  <div className="relative z-10">
                    <span className="text-4xl">{subj.icon}</span>
                    <h3 className="text-white font-black text-xl mt-2">
                      {subj.name[lang]}
                    </h3>
                    <p className="text-white/70 text-sm mt-1">
                      {done} / {topics.length} {t('dashboard.topicsCount', lang)}
                    </p>

                    {/* Progress bar */}
                    {topics.length > 0 && (
                      <div className="mt-3 bg-white/20 rounded-full h-2">
                        <div
                          className="h-full bg-white rounded-full transition-all duration-500"
                          style={{ width: `${(done / topics.length) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        {state.achievements.length > 0 && (
          <div>
            <h2 className="text-white/70 font-black uppercase tracking-widest text-xs mb-4">
              {t('dashboard.achievements', lang)}
            </h2>
            <div className="flex flex-wrap gap-3">
              {state.achievements.map((id) => {
                const ach = ACHIEVEMENTS[id];
                if (!ach) return null;
                return (
                  <motion.div
                    key={id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="card flex items-center gap-2 px-4 py-2"
                  >
                    <span className="text-2xl">{ach.icon}</span>
                    <span className="text-white text-sm font-bold">{ach[lang]}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Change language */}
        <div className="text-center pt-2">
          <button
            onClick={() => navigate('/')}
            className="text-white/30 hover:text-white/60 text-sm transition-colors"
          >
            🌐 {t('dashboard.changeLang', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
