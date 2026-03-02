import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { SUBJECTS } from '../data/curriculum';
import { t } from '../data/i18n';

const LEVEL_INFO = {
  ru: [
    { emoji: '🌱', name: 'Знакомство'  },
    { emoji: '⚔️', name: 'Практика'    },
    { emoji: '🏰', name: 'Применение'  },
    { emoji: '👑', name: 'Мастер'      },
    { emoji: '📝', name: 'Контрольная' },
  ],
  lv: [
    { emoji: '🌱', name: 'Iepazīšana'  },
    { emoji: '⚔️', name: 'Prakse'      },
    { emoji: '🏰', name: 'Pielietojums'},
    { emoji: '👑', name: 'Meistars'    },
    { emoji: '📝', name: 'Eksāmens'    },
  ],
};

// Approximate number of tasks per level (shown as progress to the student)
const LEVEL_TASK_TARGETS = { 1: 10, 2: 10, 3: 10, 4: 12, 5: 5 };

function extractXP(text) {
  const match = text.match(/⭐\s*\+(\d+)\s*XP/i);
  return match ? parseInt(match[1], 10) : 0;
}

function TutorAvatar({ isOris }) {
  if (isOris) {
    return (
      <div style={{
        width: '34px', height: '34px', flexShrink: 0, borderRadius: '50%',
        background: 'linear-gradient(135deg, #3b0764, #5b21b6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.1rem',
        boxShadow: '0 0 10px rgba(139,92,246,0.5)',
        border: '1.5px solid rgba(139,92,246,0.35)',
      }}>🦉</div>
    );
  }
  return <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>🧙‍♂️</span>;
}

function TypingIndicator({ isOris }) {
  return (
    <div className="flex items-end gap-2">
      <TutorAvatar isOris={isOris} />
      <div style={{
        backgroundColor: 'rgba(79,70,229,0.8)',
        border: '1px solid rgba(129,140,248,0.3)',
        borderRadius: '1rem', borderTopLeftRadius: '0.25rem',
        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '6px',
      }}>
        <span className="typing-dot w-2 h-2 bg-white/70 rounded-full inline-block" />
        <span className="typing-dot w-2 h-2 bg-white/70 rounded-full inline-block" />
        <span className="typing-dot w-2 h-2 bg-white/70 rounded-full inline-block" />
      </div>
    </div>
  );
}

function XPPopup({ amount, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 0.8 }}
      animate={{ opacity: 0, y: -70, scale: 1.3 }}
      transition={{ duration: 1.8, ease: 'easeOut' }}
      style={{
        position: 'fixed', bottom: '90px', right: '20px', zIndex: 50,
        background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
        color: 'white', fontWeight: 900, fontSize: '1.1rem',
        padding: '10px 18px', borderRadius: '16px',
        boxShadow: '0 8px 25px rgba(245,158,11,0.5)', pointerEvents: 'none',
      }}
    >
      ⭐ +{amount} XP
    </motion.div>
  );
}

function parseCalcBlocks(text) {
  const parts = [];
  const regex = /\[CALC\]([\s\S]*?)\[\/CALC\]/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'calc', content: match[1].trim() });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }
  return parts;
}

function ChatBubble({ msg, isOris }) {
  const isAI = msg.role === 'assistant';
  const parts = isAI ? parseCalcBlocks(msg.content) : null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex', alignItems: 'flex-end', gap: '8px',
        flexDirection: isAI ? 'row' : 'row-reverse',
      }}
    >
      {isAI && <TutorAvatar isOris={isOris} />}
      <div style={isAI ? {
        backgroundColor: 'rgba(79,70,229,0.85)',
        border: '1px solid rgba(129,140,248,0.3)',
        color: '#ffffff', borderRadius: '1rem', borderTopLeftRadius: '0.25rem',
        padding: '12px 16px', maxWidth: 'min(85vw, 420px)', wordBreak: 'break-word',
      } : {
        background: 'linear-gradient(135deg, #a855f7, #ec4899)',
        color: '#ffffff', borderRadius: '1rem', borderTopRightRadius: '0.25rem',
        padding: '12px 16px', maxWidth: 'min(75vw, 340px)', wordBreak: 'break-word',
      }}>
        {isAI ? parts.map((part, i) =>
          part.type === 'calc' ? (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.13)',
              border: '2px solid rgba(255,255,255,0.35)',
              borderRadius: '12px',
              padding: '10px 18px',
              margin: '8px 0',
              fontFamily: 'monospace',
              fontSize: '1.25rem',
              fontWeight: 900,
              textAlign: 'center',
              letterSpacing: '0.04em',
              color: '#ffffff',
            }}>
              {part.content}
            </div>
          ) : (
            <p key={i} style={{ whiteSpace: 'pre-wrap', fontSize: '1rem', lineHeight: '1.65', margin: 0, color: '#ffffff' }}>
              {part.content}
            </p>
          )
        ) : (
          <p style={{ whiteSpace: 'pre-wrap', fontSize: '1rem', lineHeight: '1.65', margin: 0, color: '#ffffff' }}>
            {msg.content}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function TutorSession() {
  const { subjectId, topicId, level: levelParam } = useParams();
  const level = parseInt(levelParam, 10) || 1;
  const navigate = useNavigate();
  const location = useLocation();
  const quickCheck = !!location.state?.quickCheck;
  const { state, addXP, completeTopic, startTopic, unlockAchievement, consumeXPBoost, useHintToken } = useApp();
  const { trackEvent } = useAuth();
  const lang = state.language || 'ru';
  const isOris = state.grade <= 2;

  const subject = SUBJECTS[subjectId];
  const topics = subject?.topics[state.grade] || [];
  const topic = topics.find((tp) => tp.id === topicId);

  const levelMeta = (LEVEL_INFO[lang] || LEVEL_INFO.ru)[level - 1] || LEVEL_INFO.ru[0];

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [xpPopup, setXpPopup] = useState(null);
  const [sessionXP, setSessionXP] = useState(0);
  const [retryHistory, setRetryHistory] = useState(null);
  const [levelDone, setLevelDone] = useState(false);
  const [autoRetryIn, setAutoRetryIn] = useState(null);
  const [autoRetryCount, setAutoRetryCount] = useState(0);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const hasStarted = useRef(false);
  const autoRetryHistRef = useRef(null);
  const sessionBoost = useRef(false); // set at mount: was XP boost active when session began?

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const isExam = level === 5;

  const buildHistory = (existingMessages, newUserText, isStart) => {
    if (isStart) {
      let content;
      if (isExam) {
        content = lang === 'ru'
          ? `Начни контрольную по теме: "${topic?.name?.ru || topicId}". Без вступлений — сразу задание №1.`
          : `Sāc eksāmenu par tēmu: "${topic?.name?.lv || topicId}". Bez ievada — uzreiz 1. uzdevums.`;
      } else if (quickCheck) {
        content = lang === 'ru'
          ? `Ученик думает, что уже знает тему "${topic?.name?.ru || topicId}". Дай ему ровно 2 задания, чтобы быстро проверить. После обоих ответов скажи: если справился — «уровень повышен», если не справился — объясни ошибки и предложи разобрать тему с нуля.`
          : `Skolēns domā, ka jau zina tēmu "${topic?.name?.lv || topicId}". Dod tieši 2 uzdevumus, lai ātri pārbaudītu. Pēc abām atbildēm saki: ja veicās — «līmenis paaugstināts», ja neveicās — izskaidro kļūdas un piedāvā sākt tēmu no sākuma.`;
      } else {
        content = lang === 'ru'
          ? `Начни урок по теме: "${topic?.name?.ru || topicId}". ТОЛЬКО: одно короткое приветствие (1 предложение) — и сразу первый вопрос-задание ученику. Никаких объяснений до первого ответа.`
          : `Sāc nodarbību par tēmu: "${topic?.name?.lv || topicId}". TIKAI: viens īss sveiciens (1 teikums) — un uzreiz pirmais jautājums-uzdevums. Nekādu skaidrojumu pirms pirmās atbildes.`;
      }
      return [{ role: 'user', content }];
    }
    return [...existingMessages, { role: 'user', content: newUserText }];
  };

  const callTutor = async (history) => {
    const response = await fetch('/api/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: history,
        grade: state.grade,
        subject: subjectId,
        language: lang,
        studentName: state.studentName,
        topicName: topic?.name?.[lang] || topicId,
        level,
        ...(isExam ? { mode: 'exam' } : {}),
      }),
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({ error: 'Network error' }));
      const e = new Error(errData.error || `HTTP ${response.status}`);
      if (errData.retryAfter) e.retryAfter = errData.retryAfter;
      throw e;
    }
    const data = await response.json();
    return data.text || '';
  };

  const handleAIResponse = (text) => {
    setMessages((prev) => [...prev, { role: 'assistant', content: text }]);
    const base = extractXP(text);
    const earned = sessionBoost.current ? base * 2 : base;
    if (earned > 0) {
      addXP(earned);
      setSessionXP((x) => x + earned);
      setXpPopup(earned);
    }
    if (/уровень повышен/i.test(text) || /līmenis paaugstināts/i.test(text)) {
      completeTopic(subjectId, topicId, level);
      trackEvent('lesson_complete', { subject: subjectId, topicId, level });
      setLevelDone(true);
    }
  };

  const doCall = async (history, isRetry = false, isAutoRetry = false) => {
    setRetryHistory(null);
    setAutoRetryIn(null);
    autoRetryHistRef.current = null;
    if (!isAutoRetry) setAutoRetryCount(0);
    setIsLoading(true);
    try {
      const text = await callTutor(history);
      handleAIResponse(text);
    } catch (err) {
      const isQuota = err.message?.includes('quota') || err.message?.includes('429');
      const isTimeout = err.message?.includes('timeout') || err.message?.includes('Timeout');
      const isNetwork = err.message?.includes('Network error') || err.message?.includes('Failed to fetch');

      const showMsg = (msg) => {
        if (!isRetry) {
          setMessages((prev) => [...prev, { role: 'assistant', content: msg }]);
        } else {
          setMessages((prev) => { const c = [...prev]; c[c.length - 1] = { role: 'assistant', content: msg }; return c; });
        }
      };

      if (isQuota) {
        const waitSec = err.retryAfter || 30;
        const MAX_AUTO = 3;
        const nextCount = autoRetryCount + 1;

        // Long wait (daily quota exhausted) or too many retries → manual retry
        if (waitSec > 120 || nextCount > MAX_AUTO) {
          const waitMin = Math.ceil(waitSec / 60);
          const giveUpMsg = waitSec > 120
            ? (lang === 'ru'
                ? `😔 Квота API исчерпана. Попробуй через ~${waitMin} мин. и нажми «Повторить».`
                : `😔 API kvota izsmelts. Mēģini pēc ~${waitMin} min. un nospied «Atkārtot».`)
            : (lang === 'ru'
                ? '😔 Сервер перегружен. Подожди пару минут и нажми «Повторить».'
                : '😔 Serveris ir pārslogots. Pagaidi pāris minūtes un nospied «Atkārtot».');
          showMsg(giveUpMsg);
          setRetryHistory(history);
          setAutoRetryCount(0);
        } else {
          // Short wait → auto-retry countdown
          setAutoRetryCount(nextCount);
          const waitMsg = lang === 'ru'
            ? `⏳ Подождём ${waitSec} сек и продолжим автоматически... (${nextCount}/${MAX_AUTO})`
            : `⏳ Gaidīsim ${waitSec} sek un turpināsim automātiski... (${nextCount}/${MAX_AUTO})`;
          showMsg(waitMsg);
          autoRetryHistRef.current = history;
          setAutoRetryIn(waitSec);
        }
      } else if (isTimeout) {
        const msg = lang === 'ru'
          ? '⏱ Сервер не ответил за 30 сек. Нажми «Повторить».'
          : '⏱ Serveris neatbildēja 30 sekunžu laikā. Nospied «Atkārtot».';
        showMsg(msg);
        setRetryHistory(history);
      } else {
        const msg = isNetwork
          ? (lang === 'ru'
              ? '📡 Нет связи с сервером. Проверь, что сервер запущен, и нажми «Повторить»'
              : '📡 Nav savienojuma ar serveri. Nospied «Atkārtot»')
          : (lang === 'ru' ? `❌ Ошибка: ${err.message}` : `❌ Kļūda: ${err.message}`);
        showMsg(msg);
        setRetryHistory(history);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-retry countdown
  useEffect(() => {
    if (autoRetryIn === null) return;
    if (autoRetryIn === 0) {
      setAutoRetryIn(null);
      const hist = autoRetryHistRef.current;
      if (hist) {
        autoRetryHistRef.current = null;
        doCall(hist, true, true);
      }
      return;
    }
    const timer = setTimeout(() => setAutoRetryIn((prev) => (prev !== null ? prev - 1 : null)), 1000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRetryIn]);

  useEffect(() => {
    if (!subject || !topic) { navigate('/dashboard', { replace: true }); return; }
    if (hasStarted.current) return;
    hasStarted.current = true;
    if ((state.xpBoostCharges || 0) > 0) {
      sessionBoost.current = true;
      consumeXPBoost();
    }
    startTopic(subjectId, topicId, level);
    trackEvent('lesson_start', { subject: subjectId, topicId, level });
    doCall(buildHistory([], '', true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const insertSymbol = (sym) => {
    const el = textareaRef.current;
    if (!el) { setInput(prev => prev + sym); return; }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const next = input.slice(0, start) + sym + input.slice(end);
    setInput(next);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + sym.length, start + sym.length);
    }, 0);
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput('');
    unlockAchievement('first_lesson');
    if (retryHistory !== null) {
      // Error message is at the end of messages — remove it and use pre-error history as base
      setMessages((prev) => [...prev.slice(0, -1), { role: 'user', content: trimmed }]);
      await doCall([...retryHistory, { role: 'user', content: trimmed }]);
    } else {
      setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
      await doCall(buildHistory(messages, trimmed, false));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleQuickSend = async (text) => {
    if (isLoading) return;
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    await doCall(buildHistory(messages, text, false));
  };

  if (!subject || !topic) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f0c29', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        <p>Тема не найдена.</p>
      </div>
    );
  }

  const headerGrad = subjectId === 'math' ? '#3b82f6, #4f46e5' : '#10b981, #0d9488';
  const taskNum = Math.min(
    messages.filter((m) => m.role === 'assistant' && extractXP(m.content) > 0).length,
    LEVEL_TASK_TARGETS[level] || 10
  );
  const taskTarget = LEVEL_TASK_TARGETS[level] || 10;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'linear-gradient(135deg, #0f0c29, #1a1640, #24243e)', overflow: 'hidden' }}>

      {/* ── Top bar ── */}
      <div style={{ background: `linear-gradient(135deg, ${headerGrad})`, padding: '10px 16px 0', flexShrink: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <button
            onClick={() => navigate(`/topics/${subjectId}`)}
            style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 700, fontSize: '0.85rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            {t('tutor.back', lang)}
          </button>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'white', fontWeight: 900, fontSize: '0.88rem', margin: 0 }}>{topic.name[lang]}</p>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem', margin: '1px 0 0' }}>
              {levelMeta.emoji} {levelMeta.name} · {lang === 'ru' ? `Ур. ${level}/5` : `Līm. ${level}/5`}
              {taskNum > 0 && (
                <span style={{ color: 'rgba(251,191,36,0.85)', fontWeight: 800 }}>
                  {' '}· {lang === 'ru' ? `Зад. ${taskNum}/${taskTarget}` : `Uzd. ${taskNum}/${taskTarget}`}
                </span>
              )}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#fde68a', fontWeight: 900, fontSize: '0.9rem', margin: 0 }}>⭐ +{sessionXP}</p>
            {sessionBoost.current
              ? <p style={{ color: '#fbbf24', fontSize: '0.68rem', fontWeight: 800, margin: 0 }}>⚡ ×2 Boost!</p>
              : <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', margin: 0 }}>XP</p>}
          </div>
        </div>

        {/* Level progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', paddingBottom: '10px' }}>
          {[1, 2, 3, 4, 5].map((l) => (
            <div key={l} style={{
              width: l === level ? '24px' : '8px', height: '8px', borderRadius: '4px',
              background: l < level ? 'rgba(255,255,255,0.9)' : l === level ? (isExam ? '#fbbf24' : 'white') : 'rgba(255,255,255,0.25)',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>
      </div>

      {/* ── Messages ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => <ChatBubble key={i} msg={msg} isOris={isOris} />)}
        </AnimatePresence>
        {isLoading && <TypingIndicator isOris={isOris} />}
        <div ref={messagesEndRef} />
      </div>

      {/* ── XP popup ── */}
      <AnimatePresence>
        {xpPopup !== null && <XPPopup amount={xpPopup} onDone={() => setXpPopup(null)} />}
      </AnimatePresence>

      {/* ── Level complete banner ── */}
      <AnimatePresence>
        {levelDone && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              flexShrink: 0,
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              borderTop: '2px solid rgba(74,222,128,0.4)',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <p style={{ color: 'white', fontWeight: 900, fontSize: '1rem', margin: '0 0 12px' }}>
              {isExam ? '🎓' : '🏆'} {levelMeta.emoji} {lang === 'ru'
                ? (isExam ? `Контрольная пройдена! +${sessionXP} XP` : `Уровень ${level} пройден! +${sessionXP} XP`)
                : (isExam ? `Eksāmens nokārtots! +${sessionXP} XP` : `Līmenis ${level} pabeigts! +${sessionXP} XP`)}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => navigate(`/topics/${subjectId}`)}
                style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '12px', padding: '10px 18px', color: 'white', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                {lang === 'ru' ? '← К темам' : '← Uz tēmām'}
              </button>
              {level < 5 && (
                <button
                  onClick={() => navigate(`/tutor/${subjectId}/${topicId}/${level + 1}`)}
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '12px', padding: '10px 18px', color: 'white', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.5)' }}
                >
                  {(LEVEL_INFO[lang] || LEVEL_INFO.ru)[level]?.emoji} {lang === 'ru' ? `Уровень ${level + 1} →` : `Līmenis ${level + 1} →`}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Input ── */}
      {!levelDone && (
        <div style={{ flexShrink: 0, background: 'rgba(255,255,255,0.05)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px calc(16px + env(safe-area-inset-bottom))' }}>
          {/* Math symbol panel — math subject only */}
          {subjectId === 'math' && (
            <div style={{ maxWidth: '520px', margin: '0 auto 8px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {['√', '²', '³', '×', '÷', '±', '≤', '≥', '≠', 'π', '%', '½', '¼', '¾'].map(sym => (
                <button
                  key={sym}
                  onClick={() => insertSymbol(sym)}
                  style={{
                    padding: '5px 10px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700,
                    background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)',
                    color: 'rgba(255,255,255,0.85)', cursor: 'pointer', lineHeight: 1.2,
                    fontFamily: 'monospace',
                  }}
                >
                  {sym}
                </button>
              ))}
            </div>
          )}
          <div style={{ maxWidth: '520px', margin: '0 auto', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('tutor.placeholder', lang)}
              rows={1}
              disabled={isLoading}
              style={{
                flex: 1, background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.2)',
                borderRadius: '16px', padding: '12px 16px', color: '#ffffff', fontSize: '0.9rem',
                fontFamily: 'Nunito, sans-serif', resize: 'none', outline: 'none',
                maxHeight: '120px', opacity: isLoading ? 0.5 : 1,
              }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              style={{
                width: '48px', height: '48px',
                background: isLoading || !input.trim() ? 'rgba(99,102,241,0.3)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none', borderRadius: '14px',
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', color: 'white', flexShrink: 0,
                boxShadow: '0 4px 15px rgba(99,102,241,0.4)', transition: 'all 0.15s',
              }}
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </div>
          {autoRetryIn !== null ? (
            <p style={{ textAlign: 'center', color: 'rgba(255,200,80,0.9)', fontSize: '0.78rem', margin: '8px 0 0', fontWeight: 700 }}>
              ⏳ {lang === 'ru' ? `Повтор через ${autoRetryIn} сек...` : `Atkārtojums pēc ${autoRetryIn} sek...`}
            </p>
          ) : retryHistory ? (
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <button
                onClick={() => doCall(retryHistory, true)}
                disabled={isLoading}
                style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', border: 'none', borderRadius: '12px', padding: '8px 20px', color: 'white', fontWeight: 800, fontSize: '0.85rem', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.6 : 1 }}
              >
                {isLoading ? '⏳' : (lang === 'ru' ? '🔄 Повторить' : '🔄 Atkārtot')}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '6px' }}>
              {messages.length > 0 && messages[messages.length - 1]?.role === 'assistant' && !isLoading && !isExam && (
                <>
                  <button
                    onClick={() => handleQuickSend(lang === 'ru' ? 'Дай задание!' : 'Dod uzdevumu!')}
                    style={{
                      background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(99,102,241,0.45)',
                      borderRadius: '20px', padding: '8px 14px', color: 'rgba(255,255,255,0.75)',
                      fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    💡 {lang === 'ru' ? 'Дай задание!' : 'Dod uzdevumu!'}
                  </button>
                  {(() => {
                    const hintCount = state.hintTokens || 0;
                    return (
                      <button
                        onClick={() => {
                          if (hintCount <= 0) return;
                          useHintToken();
                          handleQuickSend(lang === 'ru' ? 'Намекни на решение, но не давай ответ целиком' : 'Māj uz atrisinājumu, bet nedod pilnu atbildi');
                        }}
                        title={hintCount <= 0 ? (lang === 'ru' ? 'Купить в магазине за 40 XP' : 'Nopērc veikalā par 40 XP') : undefined}
                        style={{
                          background: hintCount > 0 ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.06)',
                          border: `1px solid ${hintCount > 0 ? 'rgba(251,191,36,0.45)' : 'rgba(255,255,255,0.12)'}`,
                          borderRadius: '20px', padding: '8px 14px',
                          color: hintCount > 0 ? 'rgba(251,191,36,0.9)' : 'rgba(255,255,255,0.3)',
                          fontSize: '0.78rem', fontWeight: 700,
                          cursor: hintCount > 0 ? 'pointer' : 'not-allowed',
                        }}
                      >
                        💡 {hintCount > 0
                          ? (lang === 'ru' ? `Намёк (×${hintCount})` : `Mājiens (×${hintCount})`)
                          : (lang === 'ru' ? 'Намёк · 40 XP в магазине' : 'Mājiens · 40 XP veikalā')}
                      </button>
                    );
                  })()}
                </>
              )}
              {isExam && messages.length > 0 && !isLoading && (
                <p style={{ color: 'rgba(251,191,36,0.6)', fontSize: '0.7rem', fontWeight: 700, margin: 0 }}>
                  📝 {lang === 'ru' ? 'Контрольная — подсказки недоступны' : 'Eksāmens — padomi nav pieejami'}
                </p>
              )}
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', margin: 0 }}>
                Enter — {lang === 'ru' ? 'отправить' : 'nosūtīt'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
