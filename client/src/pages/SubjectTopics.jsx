import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { SUBJECTS } from '../data/curriculum';
import { t } from '../data/i18n';

const LEVEL_META = {
  ru: [
    { label: '🌱 Знакомство',  short: '🌱' },
    { label: '⚔️ Практика',    short: '⚔️' },
    { label: '🏰 Применение',  short: '🏰' },
    { label: '👑 Мастер',      short: '👑' },
  ],
  lv: [
    { label: '🌱 Iepazīšana',  short: '🌱' },
    { label: '⚔️ Prakse',      short: '⚔️' },
    { label: '🏰 Pielietojums',short: '🏰' },
    { label: '👑 Meistars',    short: '👑' },
  ],
};

export default function SubjectTopics() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { state, isLevelUnlocked, topicLevelsDone } = useApp();
  const lang = state.language || 'ru';

  const subject = SUBJECTS[subjectId];
  if (!subject) return null;

  const topics = subject.topics[state.grade] || [];
  const levels = LEVEL_META[lang] || LEVEL_META.ru;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] pb-10">
      {/* Header */}
      <div className={`bg-gradient-to-r ${subject.gradient} px-5 py-6 shadow-xl`}>
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-white/70 hover:text-white text-sm font-bold mb-4 block transition-colors"
          >
            {t('topics.back', lang)}
          </button>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{subject.icon}</span>
            <div>
              <h1 className="text-3xl font-black text-white">{subject.name[lang]}</h1>
              <p className="text-white/70">
                {state.grade} {t('dashboard.grade', lang)} · {topics.length} {t('dashboard.topicsCount', lang)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Topics list */}
      <div className="max-w-lg mx-auto px-5 pt-6 space-y-4">
        {topics.length === 0 ? (
          <p className="text-white/40 text-center py-20">
            {lang === 'ru' ? 'Темы для этого класса скоро появятся...' : 'Tēmas šai klasei drīz tiks pievienotas...'}
          </p>
        ) : (
          topics.map((topic, i) => {
            const done = topicLevelsDone(subjectId, topic.id);
            const isFullyDone = done === 4;

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  background: isFullyDone ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${isFullyDone ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '20px',
                  padding: '16px',
                }}
              >
                {/* Topic header */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    style={{
                      width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 900, fontSize: '0.85rem',
                      background: isFullyDone
                        ? 'rgba(34,197,94,0.3)'
                        : `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`,
                      backgroundImage: isFullyDone
                        ? undefined
                        : `linear-gradient(135deg, #3b82f6, #6366f1)`,
                      color: isFullyDone ? '#4ade80' : 'white',
                    }}
                  >
                    {isFullyDone ? '✓' : i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      color: isFullyDone ? 'rgba(255,255,255,0.6)' : 'white',
                      fontWeight: 800, fontSize: '0.95rem', margin: 0,
                    }}>
                      {topic.name[lang]}
                    </p>
                    <p style={{ color: '#fbbf24', fontSize: '0.72rem', fontWeight: 700, margin: 0 }}>
                      ⭐ до {topic.xp * 4} XP · {done}/4 {lang === 'ru' ? 'уровней' : 'līmeņi'}
                    </p>
                  </div>
                </div>

                {/* 4 level buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {levels.map((lv, lvIdx) => {
                    const lvNum = lvIdx + 1;
                    const isDone = state.completedTopics.includes(`${subjectId}_${topic.id}_${lvNum}`);
                    const unlocked = isLevelUnlocked(subjectId, topic.id, lvNum);
                    const isCurrent = !isDone && unlocked;

                    return (
                      <button
                        key={lvNum}
                        disabled={!unlocked}
                        onClick={() => navigate(`/tutor/${subjectId}/${topic.id}/${lvNum}`)}
                        style={{
                          borderRadius: '12px',
                          padding: '8px 4px',
                          border: isDone
                            ? '2px solid rgba(34,197,94,0.5)'
                            : isCurrent
                              ? '2px solid rgba(99,102,241,0.7)'
                              : '2px solid rgba(255,255,255,0.08)',
                          background: isDone
                            ? 'rgba(34,197,94,0.15)'
                            : isCurrent
                              ? 'rgba(99,102,241,0.25)'
                              : 'rgba(255,255,255,0.03)',
                          cursor: unlocked ? 'pointer' : 'not-allowed',
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', gap: '3px',
                          opacity: unlocked ? 1 : 0.35,
                          transition: 'all 0.15s',
                        }}
                      >
                        <span style={{ fontSize: '1rem' }}>
                          {isDone ? '✅' : unlocked ? lv.short : '🔒'}
                        </span>
                        <span style={{
                          fontSize: '0.62rem', fontWeight: 700,
                          color: isDone ? '#4ade80' : isCurrent ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                          textAlign: 'center', lineHeight: 1.2,
                        }}>
                          {lang === 'ru' ? `Ур. ${lvNum}` : `Līm. ${lvNum}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
