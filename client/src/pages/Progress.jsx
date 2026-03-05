import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { SUBJECTS, ACHIEVEMENTS } from '../data/curriculum';

// ── helpers ───────────────────────────────────────────────────────────────────

function pct(n, total) {
  return total === 0 ? 0 : Math.round((n / total) * 100);
}

function Bar({ value, color = '#6366f1' }) {
  return (
    <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '6px', height: '8px', overflow: 'hidden' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ height: '100%', borderRadius: '6px', background: color }}
      />
    </div>
  );
}

// Map subject id → header gradient CSS color stops
const SUBJECT_COLORS = {
  math:    { bar: '#3b82f6', light: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.35)'  },
  english: { bar: '#10b981', light: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.35)'  },
  latvian: { bar: '#ef4444', light: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.35)'   },
};

// ── achievement progress hint ─────────────────────────────────────────────────
function achProgress(id, state) {
  const done = state.achievements.includes(id);
  const completed = state.completedTopics || [];

  const fullDone = (subj) => {
    const prefix = `${subj}_`;
    const ids = new Set(completed.filter(k => k.startsWith(prefix)).map(k => k.split('_').slice(0, -1).join('_')));
    return [...ids].filter(tid => [1,2,3,4,5].every(l => completed.includes(`${tid}_${l}`))).length;
  };

  switch (id) {
    case 'first_lesson':  return { done, cur: done ? 1 : 0, max: 1 };
    case 'math_explorer': { const c = fullDone('math');    return { done, cur: Math.min(c,3), max: 3 }; }
    case 'english_explorer': { const c = fullDone('english'); return { done, cur: Math.min(c,3), max: 3 }; }
    case 'latvian_explorer': { const c = fullDone('latvian'); return { done, cur: Math.min(c,3), max: 3 }; }
    case 'level_5':  return { done, cur: Math.min(state.level, 5), max: 5 };
    case 'streak_7': return { done, cur: Math.min(state.streak, 7), max: 7 };
    default:         return { done, cur: 0, max: 1 };
  }
}

// ── main component ────────────────────────────────────────────────────────────
export default function Progress() {
  const navigate = useNavigate();
  const { state, topicLevelsDone } = useApp();
  const { token } = useAuth();
  const lang = state.language || 'ru';

  const [activity, setActivity] = useState([]);
  useEffect(() => {
    if (!token) return;
    fetch('/api/me/activity', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setActivity(data); })
      .catch(() => {});
  }, [token]);

  const subjectList = Object.values(SUBJECTS);

  // Build per-subject topic stats
  const subjectStats = subjectList.map((subj) => {
    const topics = subj.topics[state.grade] || [];
    const topicData = topics.map((tp) => {
      const levels = topicLevelsDone(subj.id, tp.id); // 0–5
      return { tp, levels, isFullyDone: levels === 5, isStarted: levels > 0 };
    });
    const fullCount = topicData.filter(t => t.isFullyDone).length;
    const startedCount = topicData.filter(t => t.isStarted).length;
    return { subj, topics: topicData, total: topics.length, fullCount, startedCount };
  });

  // Strengths: fully done (4/4 levels) across all subjects
  const strengths = subjectStats.flatMap(ss =>
    ss.topics.filter(t => t.isFullyDone).map(t => ({
      name: t.tp.name[lang], icon: ss.subj.icon, subjectId: ss.subj.id,
    }))
  );

  // Weaknesses: started (1–3 levels) or never started after being unlocked
  const weaknesses = subjectStats.flatMap(ss =>
    ss.topics.filter(t => t.isStarted && !t.isFullyDone).map(t => ({
      name: t.tp.name[lang], icon: ss.subj.icon, subjectId: ss.subj.id,
      topicId: t.tp.id, levels: t.levels,
    }))
  );

  const totalTopics  = subjectStats.reduce((s, ss) => s + ss.total, 0);
  const totalDone    = subjectStats.reduce((s, ss) => s + ss.fullCount, 0);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #1a1640, #24243e)', paddingBottom: '40px' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', padding: '14px 16px 18px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 700, fontSize: '0.85rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              ← {lang === 'lv' ? 'Atpakaļ' : lang === 'uk' ? 'Назад' : 'Назад'}
            </button>
            <p style={{ color: 'white', fontWeight: 900, fontSize: '1rem', margin: '0 auto' }}>
              📊 {lang === 'lv' ? 'Mans progress' : lang === 'uk' ? 'Мій прогрес' : 'Мой прогресс'}
            </p>
            <div style={{ width: '60px' }} />
          </div>

          {/* Student summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1.4rem', fontWeight: 900, color: 'white',
              flexShrink: 0,
            }}>
              {state.studentName?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p style={{ color: 'white', fontWeight: 900, fontSize: '1rem', margin: 0 }}>{state.studentName}</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', margin: 0 }}>
                {state.grade} {lang === 'lv' ? 'klase' : lang === 'uk' ? 'клас' : 'класс'} · ⚡ {lang === 'lv' ? 'Līmenis' : lang === 'uk' ? 'Рівень' : 'Уровень'} {state.level} · ⭐ {state.xp} XP · 🔥 {state.streak}
              </p>
            </div>
          </div>

          {/* Overall completion */}
          <div style={{ marginTop: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>
                {lang === 'lv' ? 'Kopā pabeigts' : lang === 'uk' ? 'Всього завершено' : 'Всего завершено'}
              </span>
              <span style={{ color: 'white', fontWeight: 800, fontSize: '0.78rem' }}>
                {totalDone}/{totalTopics} {lang === 'lv' ? 'tēmas' : lang === 'uk' ? 'тем' : 'тем'} · {pct(totalDone, totalTopics)}%
              </span>
            </div>
            <Bar value={pct(totalDone, totalTopics)} color="rgba(255,255,255,0.9)" />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '20px 16px' }}>

        {/* ── 📅 Activity chart (14 days) ──────────────────────────────────── */}
        {activity.length > 0 && (() => {
          const maxLessons = Math.max(...activity.map(d => d.lessons), 1);
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '20px', padding: '16px 18px', marginBottom: '16px' }}
            >
              <p style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 14px' }}>
                📅 {lang === 'lv' ? 'Aktivitāte 14 dienas' : lang === 'uk' ? 'Активність за 14 днів' : 'Активность за 14 дней'}
              </p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '64px' }}>
                {activity.map((d, i) => {
                  const barH = d.lessons === 0 ? 4 : Math.max(8, Math.round((d.lessons / maxLessons) * 58));
                  const isToday = i === activity.length - 1;
                  const label = new Date(d.date + 'T00:00:00Z').toLocaleDateString(lang === 'lv' ? 'lv-LV' : lang === 'uk' ? 'uk-UA' : 'ru-RU', { day: 'numeric', month: 'numeric', timeZone: 'UTC' });
                  return (
                    <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', position: 'relative' }}>
                      {d.lessons > 0 && (
                        <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.62rem', fontWeight: 700, position: 'absolute', top: 0, transform: 'translateY(-14px)' }}>
                          {d.lessons}
                        </span>
                      )}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${barH}px` }}
                        transition={{ duration: 0.6, delay: i * 0.03, ease: 'easeOut' }}
                        style={{
                          width: '100%', borderRadius: '4px 4px 2px 2px',
                          background: d.lessons === 0
                            ? 'rgba(255,255,255,0.08)'
                            : isToday
                              ? 'linear-gradient(180deg,#a78bfa,#6366f1)'
                              : 'rgba(99,102,241,0.65)',
                          boxShadow: isToday && d.lessons > 0 ? '0 0 8px rgba(99,102,241,0.6)' : 'none',
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.62rem' }}>
                  {new Date(activity[0]?.date + 'T00:00:00Z').toLocaleDateString(lang === 'lv' ? 'lv-LV' : lang === 'uk' ? 'uk-UA' : 'ru-RU', { day: 'numeric', month: 'short', timeZone: 'UTC' })}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.62rem', fontWeight: 700 }}>
                  {lang === 'lv' ? 'Šodien' : lang === 'uk' ? 'Сьогодні' : 'Сегодня'}
                </span>
              </div>
            </motion.div>
          );
        })()}

        {/* ── Per-subject breakdown ────────────────────────────────────────── */}
        {subjectStats.map((ss, si) => {
          const c = SUBJECT_COLORS[ss.subj.id] || SUBJECT_COLORS.math;
          return (
            <motion.div
              key={ss.subj.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.1 }}
              style={{
                background: c.light, border: `1px solid ${c.border}`,
                borderRadius: '20px', padding: '16px 18px', marginBottom: '16px',
              }}
            >
              {/* Subject header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.8rem' }}>{ss.subj.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'white', fontWeight: 900, fontSize: '0.95rem', margin: 0 }}>
                    {ss.subj.name[lang]}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.73rem', margin: '1px 0 0' }}>
                    {ss.fullCount}/{ss.total} {lang === 'lv' ? 'tēmas pabeigtas' : lang === 'uk' ? 'тем пройдено' : 'тем пройдено'}
                  </p>
                </div>
                <span style={{ color: 'white', fontWeight: 900, fontSize: '1.1rem' }}>
                  {pct(ss.fullCount, ss.total)}%
                </span>
              </div>
              <Bar value={pct(ss.fullCount, ss.total)} color={c.bar} />

              {/* Topic list */}
              <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {ss.topics.map((t) => {
                  const statusIcon = t.isFullyDone ? '✅' : t.levels > 0 ? '🟡' : '⬜';
                  return (
                    <div
                      key={t.tp.id}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>{statusIcon}</span>
                      <span style={{
                        flex: 1, color: t.isFullyDone ? 'rgba(255,255,255,0.6)' : t.levels > 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)',
                        fontSize: '0.82rem', fontWeight: t.levels > 0 ? 600 : 400,
                      }}>
                        {t.tp.name[lang]}
                      </span>
                      {/* 5 tiny level dots */}
                      <div style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
                        {[1,2,3,4,5].map((l) => (
                          <div key={l} style={{
                            width: '7px', height: '7px', borderRadius: '2px',
                            background: l <= t.levels
                              ? (t.isFullyDone ? '#4ade80' : c.bar)
                              : 'rgba(255,255,255,0.12)',
                          }} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {/* ── 💪 Strengths ─────────────────────────────────────────────────── */}
        {strengths.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '20px', padding: '16px 18px', marginBottom: '16px' }}
          >
            <p style={{ color: '#4ade80', fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 12px' }}>
              💪 {lang === 'lv' ? 'Stiprās puses' : lang === 'uk' ? 'Сильні сторони' : 'Сильные стороны'} ({strengths.length})
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {strengths.map((s, i) => (
                <div key={i} style={{
                  background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)',
                  borderRadius: '10px', padding: '6px 12px',
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}>
                  <span style={{ fontSize: '0.9rem' }}>{s.icon}</span>
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.78rem', fontWeight: 600 }}>{s.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── ⚠️ Needs work ─────────────────────────────────────────────────── */}
        {weaknesses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '20px', padding: '16px 18px', marginBottom: '16px' }}
          >
            <p style={{ color: '#fbbf24', fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 12px' }}>
              ⚠️ {lang === 'lv' ? 'Jāpilnveido' : lang === 'uk' ? 'Потрібно доопрацювати' : 'Нужно доработать'} ({weaknesses.length})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {weaknesses.map((w, i) => (
                <button
                  key={i}
                  onClick={() => navigate(`/tutor/${w.subjectId}/${w.topicId}/${w.levels + 1}`)}
                  style={{
                    background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
                    borderRadius: '12px', padding: '10px 14px',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{w.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: '0.85rem', margin: 0 }}>{w.name}</p>
                    <p style={{ color: 'rgba(245,158,11,0.8)', fontSize: '0.72rem', margin: '2px 0 0', fontWeight: 600 }}>
                      {w.levels}/5 {lang === 'lv' ? 'līmeņi' : lang === 'uk' ? 'рівнів' : 'уровней'}
                    </p>
                  </div>
                  <span style={{ color: 'rgba(245,158,11,0.7)', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
                    {lang === 'lv' ? 'Turpināt →' : lang === 'uk' ? 'Продовжити →' : 'Продолжить →'}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Achievements ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '16px 18px' }}
        >
          <p style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 14px' }}>
            🏆 {lang === 'lv' ? 'Sasniegumi' : lang === 'uk' ? 'Досягнення' : 'Достижения'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(ACHIEVEMENTS).map(([id, ach]) => {
              const { done, cur, max } = achProgress(id, state);
              return (
                <div key={id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  opacity: done ? 1 : 0.55,
                }}>
                  <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{ach.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: done ? 'white' : 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: '0.85rem', margin: 0 }}>
                      {ach[lang]}
                    </p>
                    {!done && max > 1 && (
                      <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '4px', height: '5px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct(cur, max)}%`, height: '100%', background: '#6366f1', borderRadius: '4px' }} />
                        </div>
                        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem', flexShrink: 0 }}>{cur}/{max}</span>
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>{done ? '✅' : '🔒'}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
