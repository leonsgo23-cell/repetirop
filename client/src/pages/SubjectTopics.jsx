import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { SUBJECTS } from '../data/curriculum';
import { t } from '../data/i18n';
import { CHALLENGE_TYPES, CHALLENGE_COST } from '../data/shop';

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
  const { state, isLevelUnlocked, topicLevelsDone, completeTopic, isChallengeUnlocked, unlockChallenge } = useApp();
  const lang = state.language || 'ru';

  const [diagModal, setDiagModal] = useState(null);     // { topicId, topicName } | null
  const [challengeModal, setChallengeModal] = useState(null); // { topicId, topicName, challengeId } | null

  const subject = SUBJECTS[subjectId];
  if (!subject) return null;

  const topics = subject.topics[state.grade] || [];
  const levels = LEVEL_META[lang] || LEVEL_META.ru;

  const handleLevelClick = (topic, lvNum) => {
    const key1 = `${subjectId}_${topic.id}_1`;
    const isFirstTime = lvNum === 1
      && !(state.startedTopics || []).includes(key1)
      && !state.completedTopics.includes(key1);
    if (isFirstTime) {
      setDiagModal({ topicId: topic.id, topicName: topic.name[lang] });
    } else {
      navigate(`/tutor/${subjectId}/${topic.id}/${lvNum}`);
    }
  };

  const handleChallengeClick = (topic, challengeId) => {
    if (isChallengeUnlocked(subjectId, topic.id, challengeId)) {
      navigate(`/challenge/${subjectId}/${topic.id}/${challengeId}`);
    } else {
      setChallengeModal({ topicId: topic.id, topicName: topic.name[lang], challengeId });
    }
  };

  const handleUnlockConfirm = () => {
    if (!challengeModal) return;
    if (state.xp < CHALLENGE_COST) return;
    unlockChallenge(subjectId, challengeModal.topicId, challengeModal.challengeId);
    const { topicId, challengeId } = challengeModal;
    setChallengeModal(null);
    navigate(`/challenge/${subjectId}/${topicId}/${challengeId}`);
  };

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
                        : undefined,
                      backgroundImage: isFullyDone
                        ? undefined
                        : 'linear-gradient(135deg, #3b82f6, #6366f1)',
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
                        onClick={() => handleLevelClick(topic, lvNum)}
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

                {/* Challenge buttons — only for fully completed topics */}
                {isFullyDone && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                      {lang === 'ru' ? '⚔️ Челленджи' : '⚔️ Izaicinājumi'}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {CHALLENGE_TYPES.map((ch) => {
                        const unlocked = isChallengeUnlocked(subjectId, topic.id, ch.id);
                        return (
                          <button
                            key={ch.id}
                            onClick={() => handleChallengeClick(topic, ch.id)}
                            style={{
                              borderRadius: '12px', padding: '9px 10px',
                              border: unlocked
                                ? '2px solid rgba(245,158,11,0.5)'
                                : '2px solid rgba(255,255,255,0.1)',
                              background: unlocked
                                ? 'rgba(245,158,11,0.15)'
                                : 'rgba(255,255,255,0.04)',
                              cursor: 'pointer',
                              display: 'flex', alignItems: 'center', gap: '7px',
                              transition: 'all 0.15s',
                            }}
                          >
                            <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{ch.icon}</span>
                            <div style={{ textAlign: 'left' }}>
                              <p style={{ color: unlocked ? '#fbbf24' : 'rgba(255,255,255,0.5)', fontWeight: 800, fontSize: '0.72rem', margin: 0 }}>
                                {ch.name[lang]}
                              </p>
                              <p style={{ color: unlocked ? 'rgba(251,191,36,0.6)' : 'rgba(255,255,255,0.25)', fontSize: '0.62rem', margin: 0, fontWeight: 600 }}>
                                {unlocked
                                  ? (lang === 'ru' ? 'Играть →' : 'Spēlēt →')
                                  : `⭐ ${CHALLENGE_COST} XP`}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Diagnostic self-assessment modal */}
      <AnimatePresence>
        {diagModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDiagModal(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: 'linear-gradient(135deg, #1a1640, #24243e)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '24px', padding: '28px 22px', maxWidth: '380px', width: '100%' }}
            >
              <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                <span style={{ fontSize: '2.4rem' }}>🔍</span>
                <h3 style={{ color: 'white', fontWeight: 900, fontSize: '1.05rem', margin: '10px 0 4px' }}>
                  {lang === 'ru' ? 'Знаешь эту тему?' : 'Vai tu zini šo tēmu?'}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', margin: 0 }}>
                  {diagModal.topicName}
                </p>
              </div>

              {[
                {
                  emoji: '🌱',
                  label: lang === 'ru' ? 'Нет, учу первый раз' : 'Nē, mācos pirmo reizi',
                  sub:   lang === 'ru' ? 'Зефир объяснит с нуля' : 'Zefīrs sāks no sākuma',
                  action: () => { setDiagModal(null); navigate(`/tutor/${subjectId}/${diagModal.topicId}/1`); },
                },
                {
                  emoji: '⚡',
                  label: lang === 'ru' ? 'Немного знаю' : 'Zinu nedaudz',
                  sub:   lang === 'ru' ? 'Начнём с лёгкого повторения' : 'Sāksim ar atkārtojumu',
                  action: () => { setDiagModal(null); navigate(`/tutor/${subjectId}/${diagModal.topicId}/1`); },
                },
                {
                  emoji: '👑',
                  label: lang === 'ru' ? 'Знаю хорошо' : 'Zinu labi',
                  sub:   lang === 'ru' ? 'Перейдём сразу к практике (ур. 2)' : 'Uzreiz pie prakses (līm. 2)',
                  action: () => {
                    setDiagModal(null);
                    completeTopic(subjectId, diagModal.topicId, 1);
                    navigate(`/tutor/${subjectId}/${diagModal.topicId}/2`);
                  },
                },
              ].map((opt) => (
                <button
                  key={opt.emoji}
                  onClick={opt.action}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.07)',
                    border: '1.5px solid rgba(255,255,255,0.12)',
                    borderRadius: '14px', padding: '13px 16px', marginBottom: '10px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.2)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                >
                  <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{opt.emoji}</span>
                  <div>
                    <p style={{ color: 'white', fontWeight: 800, fontSize: '0.88rem', margin: 0 }}>{opt.label}</p>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.73rem', margin: '2px 0 0' }}>{opt.sub}</p>
                  </div>
                </button>
              ))}

              <button
                onClick={() => setDiagModal(null)}
                style={{ width: '100%', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', cursor: 'pointer', marginTop: '4px', padding: '6px' }}
              >
                {lang === 'ru' ? 'Отмена' : 'Atcelt'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Challenge unlock confirmation modal */}
      <AnimatePresence>
        {challengeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setChallengeModal(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: 'linear-gradient(135deg, #1a1640, #24243e)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '24px', padding: '28px 22px', maxWidth: '340px', width: '100%', textAlign: 'center' }}
            >
              {(() => {
                const ch = CHALLENGE_TYPES.find((c) => c.id === challengeModal.challengeId);
                const canAfford = state.xp >= CHALLENGE_COST;
                return (
                  <>
                    <span style={{ fontSize: '2.4rem' }}>{ch?.icon}</span>
                    <h3 style={{ color: 'white', fontWeight: 900, fontSize: '1rem', margin: '10px 0 4px' }}>
                      {lang === 'ru' ? 'Разблокировать челлендж?' : 'Atbloķēt izaicinājumu?'}
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', margin: '0 0 4px' }}>
                      {ch?.name[lang]} · {challengeModal.topicName}
                    </p>
                    <p style={{ color: canAfford ? '#fbbf24' : '#f87171', fontWeight: 800, fontSize: '0.9rem', margin: '0 0 20px' }}>
                      {canAfford
                        ? (lang === 'ru' ? `Стоит ${CHALLENGE_COST} XP (у тебя: ${state.xp})` : `Maksā ${CHALLENGE_COST} XP (tev: ${state.xp})`)
                        : (lang === 'ru' ? `Нужно ${CHALLENGE_COST} XP, у тебя только ${state.xp}` : `Vajag ${CHALLENGE_COST} XP, tev ir tikai ${state.xp}`)}
                    </p>
                    {canAfford ? (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => setChallengeModal(null)}
                          style={{ flex: 1, background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '12px', padding: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                        >
                          {lang === 'ru' ? 'Отмена' : 'Atcelt'}
                        </button>
                        <button
                          onClick={handleUnlockConfirm}
                          style={{ flex: 2, background: 'linear-gradient(135deg, #f59e0b, #ef4444)', border: 'none', borderRadius: '12px', padding: '12px', color: 'white', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(245,158,11,0.4)' }}
                        >
                          {lang === 'ru' ? `⭐ Разблокировать (−${CHALLENGE_COST} XP)` : `⭐ Atbloķēt (−${CHALLENGE_COST} XP)`}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setChallengeModal(null)}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '12px', padding: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                      >
                        {lang === 'ru' ? 'Понял, ок' : 'Sapratu'}
                      </button>
                    )}
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
