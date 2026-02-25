import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { SUBJECTS } from '../data/curriculum';

const SPEED_SECONDS = 60;

function extractXP(text) {
  const match = text.match(/⭐\s*\+(\d+)\s*XP/i);
  return match ? parseInt(match[1], 10) : 0;
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
      <span style={{ fontSize: '1.5rem' }}>🧙‍♂️</span>
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
    const id = setTimeout(onDone, 1800);
    return () => clearTimeout(id);
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

export default function ChallengeSession() {
  const { subjectId, topicId, type } = useParams();
  const navigate = useNavigate();
  const { state, addXP } = useApp();
  const lang = state.language || 'ru';

  const subject = SUBJECTS[subjectId];
  const topics = subject?.topics[state.grade] || [];
  const topic = topics.find((tp) => tp.id === topicId);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [xpPopup, setXpPopup] = useState(null);
  const [sessionXP, setSessionXP] = useState(0);
  const [retryHistory, setRetryHistory] = useState(null);

  // Speed mode state
  const [timeLeft, setTimeLeft] = useState(SPEED_SECONDS);
  const [timerStarted, setTimerStarted] = useState(false);

  // Boss mode state
  const [hearts, setHearts] = useState(3);

  // Shared end state
  const [ended, setEnded] = useState(null); // { won: boolean } | null

  const messagesEndRef = useRef(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Speed timer
  useEffect(() => {
    if (type !== 'speed' || !timerStarted || ended) return;
    if (timeLeft === 0) {
      setEnded({ won: false });
      return;
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [type, timerStarted, timeLeft, ended]);

  const handleAIResponse = (text) => {
    setMessages((prev) => [...prev, { role: 'assistant', content: text }]);
    const earned = extractXP(text);
    if (earned > 0) {
      addXP(earned);
      setSessionXP((x) => x + earned);
      setXpPopup(earned);
    }

    if (type === 'speed') {
      if (!timerStarted) setTimerStarted(true);
      if (/⚡\s*(СКОРОСТНОЙ ВЫЗОВ ЗАВЕРШЁН|ĀTRUMA IZAICINĀJUMS PABEIGTS)/i.test(text)) {
        setEnded({ won: true });
      }
    }

    if (type === 'boss') {
      const lost = (text.match(/💔/g) || []).length;
      if (lost > 0) {
        setHearts((h) => {
          const next = Math.max(0, h - lost);
          if (next === 0) setEnded({ won: false });
          return next;
        });
      }
      if (/🏆\s*(БОСС ПОВЕРЖЕН|BOSS UZVARĒTS)/i.test(text)) setEnded({ won: true });
      if (/☠️\s*(ПРОВАЛ|NEVEIKSME)/i.test(text)) setEnded({ won: false });
    }
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
        mode: type === 'speed' ? 'challenge_speed' : 'challenge_boss',
      }),
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errData.error || `HTTP ${response.status}`);
    }
    const data = await response.json();
    return data.text || '';
  };

  const doCall = async (history, isRetry = false) => {
    setRetryHistory(null);
    setIsLoading(true);
    try {
      const text = await callTutor(history);
      handleAIResponse(text);
    } catch (err) {
      const msg = lang === 'ru'
        ? `❌ Ошибка: ${err.message}. Нажми «Повторить».`
        : `❌ Kļūda: ${err.message}. Nospied «Atkārtot».`;
      if (!isRetry) {
        setMessages((prev) => [...prev, { role: 'assistant', content: msg }]);
      } else {
        setMessages((prev) => { const c = [...prev]; c[c.length - 1] = { role: 'assistant', content: msg }; return c; });
      }
      setRetryHistory(history);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!topic || hasStarted.current) return;
    hasStarted.current = true;
    const startMsg = [{
      role: 'user',
      content: lang === 'ru' ? 'Начни!' : 'Sāc!',
    }];
    doCall(startMsg);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || ended) return;
    setInput('');
    const history = [...messages, { role: 'user', content: trimmed }];
    setMessages(history);
    await doCall(history);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  if (!subject || !topic) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f0c29', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        <p>{lang === 'ru' ? 'Тема не найдена.' : 'Tēma nav atrasta.'}</p>
      </div>
    );
  }

  const headerColor = type === 'speed'
    ? '#f59e0b, #ef4444'
    : '#7c3aed, #5b21b6';

  const timerColor = timeLeft > 20 ? '#4ade80' : timeLeft > 10 ? '#fbbf24' : '#f87171';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'linear-gradient(135deg, #0f0c29, #1a1640, #24243e)', overflow: 'hidden' }}>

      {/* Top bar */}
      <div style={{ background: `linear-gradient(135deg, ${headerColor})`, padding: '10px 16px', flexShrink: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <button
            onClick={() => navigate(`/topics/${subjectId}`)}
            style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 700, fontSize: '0.85rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            {lang === 'ru' ? '← К темам' : '← Uz tēmām'}
          </button>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'white', fontWeight: 900, fontSize: '0.88rem', margin: 0 }}>
              {type === 'speed'
                ? (lang === 'ru' ? '⚡ Скоростной вызов' : '⚡ Ātruma izaicinājums')
                : (lang === 'ru' ? '💀 Бой с боссом' : '💀 Bosss cīņa')}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem', margin: 0 }}>
              {topic.name[lang]}
            </p>
          </div>
          <div style={{ textAlign: 'right', minWidth: '54px' }}>
            <p style={{ color: '#fde68a', fontWeight: 900, fontSize: '0.9rem', margin: 0 }}>⭐ +{sessionXP}</p>
          </div>
        </div>

        {/* Mode indicator row */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', paddingBottom: '4px' }}>
          {type === 'speed' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem' }}>⏱</span>
              <span style={{ color: timerColor, fontWeight: 900, fontSize: '1rem', fontVariantNumeric: 'tabular-nums', transition: 'color 0.3s' }}>
                {timeLeft}s
              </span>
              {/* progress bar */}
              <div style={{ width: '80px', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${(timeLeft / SPEED_SECONDS) * 100}%`, height: '100%', background: timerColor, borderRadius: '3px', transition: 'width 1s linear, background 0.3s' }} />
              </div>
            </div>
          )}
          {type === 'boss' && (
            <div style={{ display: 'flex', gap: '4px', fontSize: '1.2rem' }}>
              {[1, 2, 3].map((i) => (
                <span key={i} style={{ opacity: i <= hearts ? 1 : 0.25, transition: 'opacity 0.3s' }}>❤️</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => <ChatBubble key={i} msg={msg} />)}
        </AnimatePresence>
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <AnimatePresence>
        {xpPopup !== null && <XPPopup amount={xpPopup} onDone={() => setXpPopup(null)} />}
      </AnimatePresence>

      {/* End banner */}
      <AnimatePresence>
        {ended && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              flexShrink: 0,
              background: ended.won
                ? 'linear-gradient(135deg, #16a34a, #15803d)'
                : 'linear-gradient(135deg, #7f1d1d, #991b1b)',
              borderTop: `2px solid ${ended.won ? 'rgba(74,222,128,0.4)' : 'rgba(248,113,113,0.4)'}`,
              padding: '18px 16px',
              textAlign: 'center',
            }}
          >
            <p style={{ color: 'white', fontWeight: 900, fontSize: '1.1rem', margin: '0 0 14px' }}>
              {ended.won
                ? (lang === 'ru' ? `🏆 Победа! +${sessionXP} XP` : `🏆 Uzvara! +${sessionXP} XP`)
                : type === 'speed'
                  ? (lang === 'ru' ? '⏰ Время вышло!' : '⏰ Laiks beidzies!')
                  : (lang === 'ru' ? '☠️ Попробуй ещё раз!' : '☠️ Mēģini vēlreiz!')}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => navigate(`/topics/${subjectId}`)}
                style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '12px', padding: '10px 18px', color: 'white', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                {lang === 'ru' ? '← К темам' : '← Uz tēmām'}
              </button>
              <button
                onClick={() => {
                  setMessages([]);
                  setInput('');
                  setEnded(null);
                  setSessionXP(0);
                  setXpPopup(null);
                  setRetryHistory(null);
                  setTimeLeft(SPEED_SECONDS);
                  setTimerStarted(false);
                  setHearts(3);
                  hasStarted.current = false;
                }}
                style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', border: 'none', borderRadius: '12px', padding: '10px 18px', color: 'white', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(245,158,11,0.4)' }}
              >
                {lang === 'ru' ? '🔄 Ещё раз' : '🔄 Vēlreiz'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      {!ended && (
        <div style={{ flexShrink: 0, background: 'rgba(255,255,255,0.05)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px 16px' }}>
          <div style={{ maxWidth: '520px', margin: '0 auto', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={lang === 'ru' ? 'Введи ответ...' : 'Ievadi atbildi...'}
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
                background: isLoading || !input.trim()
                  ? 'rgba(245,158,11,0.3)'
                  : `linear-gradient(135deg, ${headerColor})`,
                border: 'none', borderRadius: '14px',
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', color: 'white', flexShrink: 0,
                transition: 'all 0.15s',
              }}
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </div>
          {retryHistory && (
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <button
                onClick={() => doCall(retryHistory, true)}
                disabled={isLoading}
                style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', border: 'none', borderRadius: '12px', padding: '8px 20px', color: 'white', fontWeight: 800, fontSize: '0.85rem', cursor: isLoading ? 'not-allowed' : 'pointer' }}
              >
                {lang === 'ru' ? '🔄 Повторить' : '🔄 Atkārtot'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
