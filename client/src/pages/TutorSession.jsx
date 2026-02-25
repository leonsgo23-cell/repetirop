import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { SUBJECTS } from '../data/curriculum';
import { t } from '../data/i18n';

const LEVEL_INFO = {
  ru: [
    { emoji: '🌱', name: 'Знакомство' },
    { emoji: '⚔️', name: 'Практика'   },
    { emoji: '🏰', name: 'Применение' },
    { emoji: '👑', name: 'Мастер'     },
  ],
  lv: [
    { emoji: '🌱', name: 'Iepazīšana'  },
    { emoji: '⚔️', name: 'Prakse'      },
    { emoji: '🏰', name: 'Pielietojums'},
    { emoji: '👑', name: 'Meistars'    },
  ],
};

function extractXP(text) {
  const match = text.match(/⭐\s*\+(\d+)\s*XP/i);
  return match ? parseInt(match[1], 10) : 0;
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <span className="text-2xl">🧙‍♂️</span>
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

function ChatBubble({ msg }) {
  const isAI = msg.role === 'assistant';
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
      {isAI && <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>🧙‍♂️</span>}
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
        <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.6', margin: 0, color: '#ffffff' }}>
          {msg.content}
        </p>
      </div>
    </motion.div>
  );
}

export default function TutorSession() {
  const { subjectId, topicId, level: levelParam } = useParams();
  const level = parseInt(levelParam, 10) || 1;
  const navigate = useNavigate();
  const { state, addXP, completeTopic, startTopic, unlockAchievement } = useApp();
  const lang = state.language || 'ru';

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
  const hasStarted = useRef(false);
  const autoRetryHistRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const buildHistory = (existingMessages, newUserText, isStart) => {
    if (isStart) {
      return [{
        role: 'user',
        content: lang === 'ru'
          ? `Начни урок по теме: "${topic?.name?.ru || topicId}". ТОЛЬКО: одно короткое приветствие (1 предложение) — и сразу первый вопрос-задание ученику. Никаких объяснений до первого ответа.`
          : `Sāc nodarbību par tēmu: "${topic?.name?.lv || topicId}". TIKAI: viens īss sveiciens (1 teikums) — un uzreiz pirmais jautājums-uzdevums. Nekādu skaidrojumu pirms pirmās atbildes.`,
      }];
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
    const earned = extractXP(text);
    if (earned > 0) {
      addXP(earned);
      setSessionXP((x) => x + earned);
      setXpPopup(earned);
    }
    if (/уровень повышен/i.test(text) || /līmenis paaugstināts/i.test(text)) {
      completeTopic(subjectId, topicId, level);
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
    if (!topic || hasStarted.current) return;
    hasStarted.current = true;
    startTopic(subjectId, topicId, level);
    doCall(buildHistory([], '', true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem', margin: 0 }}>
              {levelMeta.emoji} {levelMeta.name} · {lang === 'ru' ? `Уровень ${level}/4` : `Līmenis ${level}/4`}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#fde68a', fontWeight: 900, fontSize: '0.9rem', margin: 0 }}>⭐ +{sessionXP}</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', margin: 0 }}>XP</p>
          </div>
        </div>

        {/* Level progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', paddingBottom: '10px' }}>
          {[1, 2, 3, 4].map((l) => (
            <div key={l} style={{
              width: l === level ? '24px' : '8px', height: '8px', borderRadius: '4px',
              background: l < level ? 'rgba(255,255,255,0.9)' : l === level ? 'white' : 'rgba(255,255,255,0.25)',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>
      </div>

      {/* ── Messages ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => <ChatBubble key={i} msg={msg} />)}
        </AnimatePresence>
        {isLoading && <TypingIndicator />}
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
              🏆 {levelMeta.emoji} {lang === 'ru' ? `Уровень ${level} пройден! +${sessionXP} XP` : `Līmenis ${level} pabeigts! +${sessionXP} XP`}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => navigate(`/topics/${subjectId}`)}
                style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '12px', padding: '10px 18px', color: 'white', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                {lang === 'ru' ? '← К темам' : '← Uz tēmām'}
              </button>
              {level < 4 && (
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
        <div style={{ flexShrink: 0, background: 'rgba(255,255,255,0.05)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px 16px' }}>
          <div style={{ maxWidth: '520px', margin: '0 auto', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <textarea
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
              {messages.length > 0 && messages[messages.length - 1]?.role === 'assistant' && !isLoading && (
                <button
                  onClick={() => handleQuickSend(lang === 'ru' ? 'Дай задание!' : 'Dod uzdevumu!')}
                  style={{
                    background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(99,102,241,0.45)',
                    borderRadius: '20px', padding: '4px 14px', color: 'rgba(255,255,255,0.75)',
                    fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  💡 {lang === 'ru' ? 'Дай задание!' : 'Dod uzdevumu!'}
                </button>
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
