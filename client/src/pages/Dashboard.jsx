import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { SUBJECTS, ACHIEVEMENTS } from '../data/curriculum';
import { t } from '../data/i18n';
import { TITLES } from '../data/shop';

function XPBar({ current, total }) {
  const pct = Math.min(100, (current / total) * 100);
  return (
    <div style={{ flex: 1, background: 'rgba(255,255,255,0.12)', borderRadius: '10px', height: '10px', overflow: 'hidden' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{ height: '100%', borderRadius: '10px', background: 'linear-gradient(90deg, #fbbf24, #f59e0b)' }}
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
  const { state, xpToNextLevel, xpInCurrentLevel, topicLevelsDone, isLevelUnlocked, isVip, repairStreak, dismissStreakRepair } = useApp();
  const { trackEvent } = useAuth();
  const vipActive = isVip();

  useEffect(() => { trackEvent('page_view', { page: '/dashboard' }); }, []);
  const [repairResult, setRepairResult] = useState(null); // 'ok' | 'fail'
  const lang = state.language || 'ru';

  // Weak topics = started (entered a session) but not yet completed that level
  const startedTopics = state.startedTopics || [];
  const completedTopics = state.completedTopics || [];
  const weakTopics = startedTopics
    .filter((k) => !completedTopics.includes(k))
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
    .filter(Boolean)
    .filter((wt) => isLevelUnlocked(wt.subjectId, wt.topicId, wt.level))
    .slice(0, 3);

  const xpNext = xpToNextLevel(state.level);
  const xpCurr = xpInCurrentLevel(state.xp, state.level);

  const subjectList = Object.values(SUBJECTS);

  const activeTitle = state.activeTitle ? TITLES.find((t) => t.id === state.activeTitle) : null;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', paddingBottom: '40px' }}>
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 px-5 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <p className="text-white/50 text-sm">
              {t('dashboard.hi', lang)}, <span className="text-white font-bold">{state.studentName}</span>!
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <p className="text-indigo-300 text-xs font-bold" style={{ margin: 0 }}>
                {state.grade} {t('dashboard.grade', lang)}
              </p>
              {activeTitle && (
                <span style={{
                  background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.4)',
                  borderRadius: '8px', padding: '1px 7px',
                  color: '#a78bfa', fontSize: '0.68rem', fontWeight: 800,
                }}>
                  {activeTitle.icon} {activeTitle.name[lang]}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/guide')}
              title={lang === 'ru' ? 'Как это работает?' : 'Kā tas darbojas?'}
              style={{
                width: '44px', height: '44px',
                borderRadius: '50%',
                background: 'rgba(99,102,241,0.3)',
                border: '1.5px solid rgba(99,102,241,0.5)',
                color: 'rgba(255,255,255,0.8)',
                fontWeight: 900, fontSize: '0.9rem',
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              ?
            </button>
            <button
              onClick={() => navigate('/setup')}
              className="text-white/40 hover:text-white text-xs transition-colors py-2 px-1"
            >
              ✏️ {t('dashboard.changeGrade', lang)}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 pt-6 space-y-7">

        {/* Streak repair banner */}
        <AnimatePresence>
          {state.streakRepairInfo && !repairResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(245,158,11,0.2))',
                border: '1.5px solid rgba(239,68,68,0.4)',
                borderRadius: '16px', padding: '14px 16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '1.8rem' }}>💔</span>
                <div>
                  <p style={{ color: 'white', fontWeight: 900, fontSize: '0.9rem', margin: 0 }}>
                    {lang === 'ru' ? 'Серия прервана!' : 'Sērija pārtraukta!'}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.75rem', margin: 0 }}>
                    {lang === 'ru'
                      ? `Серия ${state.streakRepairInfo.prevStreak} дн. — восстановить за 75 XP?`
                      : `Sērija ${state.streakRepairInfo.prevStreak} d. — atjaunot par 75 XP?`}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    const ok = repairStreak();
                    setRepairResult(ok ? 'ok' : 'fail');
                    setTimeout(() => setRepairResult(null), 2000);
                  }}
                  disabled={state.xp < 75}
                  style={{
                    flex: 1,
                    background: state.xp >= 75 ? 'linear-gradient(135deg, #ef4444, #f59e0b)' : 'rgba(255,255,255,0.1)',
                    border: 'none', borderRadius: '12px', padding: '10px',
                    color: state.xp >= 75 ? 'white' : 'rgba(255,255,255,0.3)',
                    fontWeight: 900, fontSize: '0.85rem', cursor: state.xp >= 75 ? 'pointer' : 'not-allowed',
                  }}
                >
                  🔥 {lang === 'ru' ? 'Восстановить (−75 XP)' : 'Atjaunot (−75 XP)'}
                </button>
                <button
                  onClick={dismissStreakRepair}
                  style={{
                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '12px', padding: '10px 14px',
                    color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
                  }}
                >
                  {lang === 'ru' ? 'Позже' : 'Vēlāk'}
                </button>
              </div>
            </motion.div>
          )}
          {repairResult === 'ok' && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: '14px', padding: '12px 16px', textAlign: 'center' }}
            >
              <p style={{ color: '#4ade80', fontWeight: 900, margin: 0 }}>
                🔥 {lang === 'ru' ? 'Серия восстановлена!' : 'Sērija atjaunota!'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3"
        >
          <StatCard icon="⚡" value={`${t('dashboard.level', lang)} ${state.level}`} label={`${state.xp} XP`} />
          <StatCard
            icon="🔥"
            value={state.streak}
            label={`${t('dashboard.streak', lang)}${(state.streakShields || 0) > 0 ? ` 🛡️×${state.streakShields}` : ''}`}
          />
          <StatCard icon="🏆" value={state.achievements.length} label={t('dashboard.achievements', lang)} />
        </motion.div>

        {/* XP progress bar — level N → bar → level N+1 */}
        <div className="card" style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{
              color: '#fbbf24', fontWeight: 900, fontSize: '1rem',
              minWidth: '30px', textAlign: 'center',
            }}>
              {state.level}
            </span>
            <XPBar current={xpCurr} total={150} />
            <span style={{
              color: 'rgba(255,255,255,0.35)', fontWeight: 900, fontSize: '1rem',
              minWidth: '30px', textAlign: 'center',
            }}>
              {state.level + 1}
            </span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textAlign: 'center', margin: 0 }}>
            {xpCurr} / 150 XP · {lang === 'ru' ? `ещё ${150 - xpCurr} XP` : `vēl ${150 - xpCurr} XP`}
          </p>
        </div>

        {/* Quick actions row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}
        >
          {/* Homework helper */}
          <button
            onClick={() => navigate('/homework')}
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(91,33,182,0.25))',
              border: '1.5px solid rgba(167,139,250,0.35)',
              borderRadius: '16px', padding: '12px 14px',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '5px',
              cursor: 'pointer', textAlign: 'left',
              boxShadow: '0 4px 16px rgba(124,58,237,0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.5rem' }}>📚</span>
              {!vipActive && <span style={{ fontSize: '0.7rem', background: 'rgba(217,70,239,0.3)', border: '1px solid rgba(217,70,239,0.5)', borderRadius: '6px', padding: '1px 5px', color: '#e879f9', fontWeight: 800 }}>👑</span>}
            </div>
            <p style={{ color: 'white', fontWeight: 900, fontSize: '0.82rem', margin: 0, lineHeight: 1.2 }}>
              {lang === 'ru' ? 'Дом. задание' : 'Mājas darbs'}
            </p>
            <p style={{ color: 'rgba(167,139,250,0.8)', fontSize: '0.7rem', margin: 0, fontWeight: 600 }}>
              {lang === 'ru' ? 'С Зефиром' : 'Ar Zefīru'}
            </p>
          </button>

          {/* Progress */}
          <button
            onClick={() => navigate('/progress')}
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(79,70,229,0.25))',
              border: '1.5px solid rgba(129,140,248,0.35)',
              borderRadius: '16px', padding: '12px 14px',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '5px',
              cursor: 'pointer', textAlign: 'left',
              boxShadow: '0 4px 16px rgba(99,102,241,0.15)',
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>📊</span>
            <p style={{ color: 'white', fontWeight: 900, fontSize: '0.82rem', margin: 0, lineHeight: 1.2 }}>
              {lang === 'ru' ? 'Прогресс' : 'Progress'}
            </p>
            <p style={{ color: 'rgba(129,140,248,0.8)', fontSize: '0.7rem', margin: 0, fontWeight: 600 }}>
              {lang === 'ru' ? 'Где слабости' : 'Stiprās vietas'}
            </p>
          </button>

          {/* Shop */}
          <button
            onClick={() => navigate('/shop')}
            style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(239,68,68,0.2))',
              border: '1.5px solid rgba(245,158,11,0.35)',
              borderRadius: '16px', padding: '12px 14px',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '5px',
              cursor: 'pointer', textAlign: 'left',
              boxShadow: '0 4px 16px rgba(245,158,11,0.12)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '1.5rem' }}>🏪</span>
              {((state.streakShields || 0) > 0 || (state.xpBoostCharges || 0) > 0) && (
                <span style={{ background: 'rgba(251,191,36,0.3)', border: '1px solid rgba(251,191,36,0.5)', borderRadius: '6px', padding: '0 4px', color: '#fbbf24', fontSize: '0.6rem', fontWeight: 900 }}>
                  {(state.streakShields || 0) + (state.xpBoostCharges || 0)}
                </span>
              )}
            </div>
            <p style={{ color: 'white', fontWeight: 900, fontSize: '0.82rem', margin: 0, lineHeight: 1.2 }}>
              {lang === 'ru' ? 'Магазин' : 'Veikals'}
            </p>
            <p style={{ color: 'rgba(245,158,11,0.8)', fontSize: '0.7rem', margin: 0, fontWeight: 600 }}>
              {lang === 'ru' ? 'Тратить XP' : 'Tērēt XP'}
            </p>
          </button>

          {/* Zephir free chat */}
          <button
            onClick={() => navigate('/zephir')}
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.2))',
              border: '1.5px solid rgba(52,211,153,0.35)',
              borderRadius: '16px', padding: '12px 14px',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '5px',
              cursor: 'pointer', textAlign: 'left',
              boxShadow: '0 4px 16px rgba(16,185,129,0.12)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.5rem' }}>🧙‍♂️</span>
              {!vipActive && <span style={{ fontSize: '0.7rem', background: 'rgba(217,70,239,0.3)', border: '1px solid rgba(217,70,239,0.5)', borderRadius: '6px', padding: '1px 5px', color: '#e879f9', fontWeight: 800 }}>👑</span>}
            </div>
            <p style={{ color: 'white', fontWeight: 900, fontSize: '0.82rem', margin: 0, lineHeight: 1.2 }}>
              {lang === 'ru' ? 'Зефир-чат' : 'Zefīrs-čats'}
            </p>
            <p style={{ color: 'rgba(52,211,153,0.8)', fontSize: '0.7rem', margin: 0, fontWeight: 600 }}>
              {vipActive ? (lang === 'ru' ? '👑 ВИП активен' : '👑 VIP aktīvs') : (lang === 'ru' ? 'Помощь по темам' : 'Palīdzība tēmās')}
            </p>
          </button>
        </motion.div>

        {/* Weak topics — repeat recommendations */}
        {weakTopics.length > 0 && (
          <div>
            <div className="mb-3">
              <h2 className="text-white/70 font-black uppercase tracking-widest text-xs" style={{ margin: 0 }}>
                {lang === 'ru' ? '🔁 Повтори' : '🔁 Atkārto'}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem', margin: '2px 0 0' }}>
                {lang === 'ru' ? 'Незаконченные темы — продолжи с того места' : 'Nepabeigtas tēmas — turpini no vietas'}
              </p>
            </div>
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
