import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { SUBJECTS } from '../data/curriculum';

// ── shared UI pieces ───────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
      <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>🧙‍♂️</span>
      <div style={{
        backgroundColor: 'rgba(124,58,237,0.8)',
        border: '1px solid rgba(167,139,250,0.3)',
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
        backgroundColor: 'rgba(124,58,237,0.85)',
        border: '1px solid rgba(167,139,250,0.3)',
        color: '#ffffff', borderRadius: '1rem', borderTopLeftRadius: '0.25rem',
        padding: '12px 16px', maxWidth: 'min(85vw, 420px)', wordBreak: 'break-word',
      } : {
        background: 'linear-gradient(135deg, #a855f7, #ec4899)',
        color: '#ffffff', borderRadius: '1rem', borderTopRightRadius: '0.25rem',
        padding: '12px 16px', maxWidth: 'min(75vw, 340px)', wordBreak: 'break-word',
      }}>
        {msg.imageUrl && (
          <img
            src={msg.imageUrl}
            alt="homework"
            style={{ width: '100%', maxWidth: '260px', borderRadius: '10px', marginBottom: msg.content ? '8px' : 0, display: 'block' }}
          />
        )}
        {msg.content ? (
          <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.6', margin: 0, color: '#ffffff' }}>
            {msg.content}
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}

// ── subject accent colors (since subj.gradient is Tailwind, not CSS) ──────────
const SUBJECT_STYLE = {
  math:    { active: 'linear-gradient(135deg, #3b82f6, #4f46e5)', glow: 'rgba(59,130,246,0.5)'  },
  english: { active: 'linear-gradient(135deg, #10b981, #0d9488)', glow: 'rgba(16,185,129,0.5)'  },
  latvian: { active: 'linear-gradient(135deg, #ef4444, #e11d48)', glow: 'rgba(239,68,68,0.5)'   },
};

// ── main component ────────────────────────────────────────────────────────────
export default function HomeworkHelper() {
  const navigate = useNavigate();
  const { state, isVip } = useApp();
  const lang = state.language || 'ru';

  if (!isVip()) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #1a1640, #24243e)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '14px 20px' }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.85rem' }}>
            ← {lang === 'ru' ? 'Назад' : 'Atpakaļ'}
          </button>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', textAlign: 'center' }}>
          <span style={{ fontSize: '3.5rem', marginBottom: '16px' }}>👑</span>
          <p style={{ color: 'white', fontWeight: 900, fontSize: '1.2rem', margin: '0 0 8px' }}>
            {lang === 'ru' ? 'Нужен ВИП' : 'Nepieciešams VIP'}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 28px', lineHeight: 1.5 }}>
            {lang === 'ru'
              ? 'Помощник с ДЗ доступен с ВИП-подпиской.\nКопи ⭐ XP за уроки и купи ВИП в магазине.'
              : 'Mājas darbu palīgs ir pieejams ar VIP abonementu.\nKrāj ⭐ XP par nodarbībām un nopērc VIP veikalā.'}
          </p>
          <button
            onClick={() => navigate('/shop')}
            style={{
              background: 'linear-gradient(135deg, #d946ef, #9333ea)',
              border: 'none', borderRadius: '16px', padding: '14px 32px',
              color: 'white', fontWeight: 900, fontSize: '1rem',
              cursor: 'pointer', boxShadow: '0 6px 20px rgba(217,70,239,0.4)',
            }}
          >
            {lang === 'ru' ? '🏪 В магазин' : '🏪 Uz veikalu'}
          </button>
        </div>
      </div>
    );
  }

  const [mode, setMode] = useState('form'); // 'form' | 'chat'
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [problem, setProblem] = useState('');
  const [imagePreview, setImagePreview] = useState(null);   // data URL for display
  const [imageBase64, setImageBase64] = useState(null);     // pure base64 for API
  const [imageMimeType, setImageMimeType] = useState(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [retryHistory, setRetryHistory] = useState(null);
  const [autoRetryIn, setAutoRetryIn] = useState(null);
  const [autoRetryCount, setAutoRetryCount] = useState(0);

  const messagesEndRef = useRef(null);
  const autoRetryHistRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const mime = file.type || 'image/jpeg';
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setImagePreview(dataUrl);
      setImageMimeType(mime);
      // Strip the "data:image/...;base64," prefix — Gemini needs raw base64
      setImageBase64(dataUrl.split(',')[1]);
    };
    reader.onerror = () => {
      alert(lang === 'ru' ? 'Не удалось прочитать файл. Попробуй другое изображение.' : 'Neizdevās nolasīt failu. Mēģini citu attēlu.');
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be re-selected after removal
    e.target.value = '';
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    setImageMimeType(null);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const callTutor = async (history) => {
    const response = await fetch('/api/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: history,
        grade: state.grade,
        subject: selectedSubject,
        language: lang,
        studentName: state.studentName,
        topicName: lang === 'ru' ? 'Домашнее задание' : 'Mājas darbs',
        level: 1,
        mode: 'homework',
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

  const doCall = async (history, isRetry = false, isAutoRetry = false) => {
    setRetryHistory(null);
    setAutoRetryIn(null);
    autoRetryHistRef.current = null;
    if (!isAutoRetry) setAutoRetryCount(0);
    setIsLoading(true);
    try {
      const text = await callTutor(history);
      if (isRetry) {
        setMessages((prev) => { const c = [...prev]; c[c.length - 1] = { role: 'assistant', content: text }; return c; });
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: text }]);
      }
    } catch (err) {
      const isQuota   = err.message?.includes('quota') || err.message?.includes('429');
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
        if (waitSec > 120 || nextCount > MAX_AUTO) {
          const waitMin = Math.ceil(waitSec / 60);
          const giveUpMsg = waitSec > 120
            ? (lang === 'ru' ? `😔 Квота API исчерпана. Попробуй через ~${waitMin} мин.` : `😔 API kvota izsmelts. Mēģini pēc ~${waitMin} min.`)
            : (lang === 'ru' ? '😔 Сервер перегружен. Подожди пару минут.' : '😔 Serveris pārslogots. Pagaidi pāris minūtes.');
          showMsg(giveUpMsg);
          setRetryHistory(history);
          setAutoRetryCount(0);
        } else {
          setAutoRetryCount(nextCount);
          showMsg(lang === 'ru'
            ? `⏳ Подождём ${waitSec} сек... (${nextCount}/${MAX_AUTO})`
            : `⏳ Gaidīsim ${waitSec} sek... (${nextCount}/${MAX_AUTO})`);
          autoRetryHistRef.current = history;
          setAutoRetryIn(waitSec);
        }
      } else if (isTimeout) {
        showMsg(lang === 'ru' ? '⏱ Сервер не ответил. Нажми «Повторить».' : '⏱ Serveris neatbildēja. Nospied «Atkārtot».');
        setRetryHistory(history);
      } else {
        showMsg(lang === 'ru'
          ? (isNetwork ? '📡 Нет связи с сервером.' : `❌ Ошибка: ${err.message}`)
          : (isNetwork ? '📡 Nav savienojuma.' : `❌ Kļūda: ${err.message}`));
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
      if (hist) { autoRetryHistRef.current = null; doCall(hist, true, true); }
      return;
    }
    const timer = setTimeout(() => setAutoRetryIn((prev) => (prev !== null ? prev - 1 : null)), 1000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRetryIn]);

  const handleSubmitProblem = () => {
    const trimmed = problem.trim();
    if (!trimmed && !imageBase64) return;

    const userText = trimmed || (lang === 'ru' ? 'Помоги с этим заданием.' : 'Palīdzi ar šo uzdevumu.');
    const firstMsg = { role: 'user', content: userText };
    if (imageBase64) {
      firstMsg.imageData = imageBase64;
      firstMsg.imageMimeType = imageMimeType || 'image/jpeg';
    }

    // For display: keep imageUrl in UI-only message (don't send imageUrl to API)
    const displayMsg = { role: 'user', content: trimmed, imageUrl: imagePreview || undefined };

    setMessages([displayMsg]);
    setMode('chat');
    doCall([firstMsg]);
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput('');
    if (retryHistory !== null) {
      setMessages((prev) => [...prev.slice(0, -1), { role: 'user', content: trimmed }]);
      await doCall([...retryHistory, { role: 'user', content: trimmed }]);
    } else {
      setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
      await doCall([...messages, { role: 'user', content: trimmed }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // ── FORM ────────────────────────────────────────────────────────────────────
  if (mode === 'form') {
    const subjects = Object.values(SUBJECTS);
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #1a1640, #24243e)' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', padding: '14px 16px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ maxWidth: '520px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 700, fontSize: '0.85rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}
            >
              ← {lang === 'ru' ? 'Назад' : 'Atpakaļ'}
            </button>
            <p style={{ color: 'white', fontWeight: 900, fontSize: '1rem', margin: 0, flex: 1, textAlign: 'center' }}>
              📚 {lang === 'ru' ? 'Помощь с домашним заданием' : 'Palīdzība ar mājas darbu'}
            </p>
            <div style={{ width: '60px' }} />
          </div>
        </div>

        {/* Form body */}
        <div style={{ maxWidth: '520px', margin: '0 auto', padding: '24px 16px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

            {/* Zephir greeting bubble */}
            <div style={{
              background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.35)',
              borderRadius: '16px', padding: '16px 20px', marginBottom: '28px',
              display: 'flex', gap: '12px', alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: '2.2rem' }}>🧙‍♂️</span>
              <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.92rem', lineHeight: 1.6 }}>
                {lang === 'ru'
                  ? `Привет, ${state.studentName}! Покажи мне своё задание — я разберу его по шагам и объясню метод решения.`
                  : `Sveiki, ${state.studentName}! Parādi man savu uzdevumu — es to izskaidrošu soli pa solim.`}
              </p>
            </div>

            {/* Subject picker */}
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 10px' }}>
              {lang === 'ru' ? 'Предмет' : 'Priekšmets'}
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {subjects.map((subj) => {
                const isActive = selectedSubject === subj.id;
                const s = SUBJECT_STYLE[subj.id] || SUBJECT_STYLE.math;
                return (
                  <button
                    key={subj.id}
                    onClick={() => setSelectedSubject(subj.id)}
                    style={{
                      background: isActive ? s.active : 'rgba(255,255,255,0.07)',
                      border: isActive ? 'none' : '1.5px solid rgba(255,255,255,0.15)',
                      boxShadow: isActive ? `0 4px 16px ${s.glow}` : 'none',
                      borderRadius: '12px', padding: '10px 18px', color: 'white',
                      fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '7px', transition: 'all 0.15s',
                    }}
                  >
                    {subj.icon} {subj.name[lang]}
                  </button>
                );
              })}
            </div>

            {/* Photo upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={handleImageSelect}
            />

            {/* Image preview */}
            {imagePreview ? (
              <div style={{ marginBottom: '16px', position: 'relative', display: 'inline-block' }}>
                <img
                  src={imagePreview}
                  alt="preview"
                  style={{ maxWidth: '100%', maxHeight: '220px', borderRadius: '14px', border: '2px solid rgba(167,139,250,0.5)', display: 'block' }}
                />
                <button
                  onClick={removeImage}
                  style={{
                    position: 'absolute', top: '8px', right: '8px',
                    background: 'rgba(0,0,0,0.65)', border: 'none', borderRadius: '50%',
                    width: '28px', height: '28px', color: 'white', fontSize: '0.85rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >✕</button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '100%', marginBottom: '12px',
                  background: 'rgba(124,58,237,0.12)',
                  border: '1.5px dashed rgba(167,139,250,0.4)',
                  borderRadius: '16px', padding: '16px',
                  color: 'rgba(167,139,250,0.85)', fontWeight: 700, fontSize: '0.92rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(124,58,237,0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(124,58,237,0.12)'; }}
              >
                <span style={{ fontSize: '1.4rem' }}>📷</span>
                {lang === 'ru' ? 'Сфотографировать задание' : 'Nofotografēt uzdevumu'}
              </button>
            )}

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontWeight: 700 }}>
                {lang === 'ru' ? 'или напиши текст' : 'vai ieraksti tekstu'}
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            </div>

            {/* Problem textarea */}
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder={lang === 'ru'
                ? 'Скопируй или напиши текст задания из учебника…\nНапример: «Реши уравнение: 2x + 5 = 13»'
                : 'Kopē vai ieraksti uzdevuma tekstu no mācību grāmatas…\nPiemēram: «Atrisini vienādojumu: 2x + 5 = 13»'}
              rows={4}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.18)',
                borderRadius: '16px', padding: '14px 16px', color: '#ffffff', fontSize: '0.9rem',
                fontFamily: 'Nunito, sans-serif', resize: 'vertical', outline: 'none',
                marginBottom: '20px', lineHeight: 1.6,
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(167,139,250,0.6)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.18)'; }}
            />

            {/* Submit button */}
            {(() => {
              const canSubmit = problem.trim() || imageBase64;
              return (
                <button
                  onClick={handleSubmitProblem}
                  disabled={!canSubmit}
                  style={{
                    width: '100%',
                    background: canSubmit
                      ? 'linear-gradient(135deg, #7c3aed, #5b21b6)'
                      : 'rgba(255,255,255,0.08)',
                    border: 'none', borderRadius: '16px', padding: '16px',
                    color: canSubmit ? 'white' : 'rgba(255,255,255,0.3)',
                    fontWeight: 900, fontSize: '1.05rem',
                    cursor: canSubmit ? 'pointer' : 'not-allowed',
                    boxShadow: canSubmit ? '0 4px 20px rgba(124,58,237,0.5)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  🧙‍♂️ {lang === 'ru' ? 'Разобраться с Зефиром →' : 'Risināt ar Zefīru →'}
                </button>
              );
            })()}

          </motion.div>
        </div>
      </div>
    );
  }

  // ── CHAT ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'linear-gradient(135deg, #0f0c29, #1a1640, #24243e)', overflow: 'hidden' }}>

      {/* Top bar */}
      <div style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', padding: '10px 16px', flexShrink: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => { setMode('form'); setMessages([]); setInput(''); setRetryHistory(null); setAutoRetryIn(null); }}
            style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 700, fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            ← {lang === 'ru' ? 'Новое задание' : 'Jauns uzdevums'}
          </button>
          <p style={{ color: 'white', fontWeight: 900, fontSize: '0.88rem', margin: 0 }}>
            📚 {lang === 'ru' ? 'Домашнее задание' : 'Mājas darbs'}
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 700, fontSize: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            {lang === 'ru' ? 'На главную' : 'Sākums'}
          </button>
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

      {/* Input */}
      <div style={{ flexShrink: 0, background: 'rgba(255,255,255,0.05)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px 16px' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={lang === 'ru' ? 'Напиши ответ или вопрос…' : 'Raksti atbildi vai jautājumu…'}
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
                ? 'rgba(124,58,237,0.3)'
                : 'linear-gradient(135deg, #7c3aed, #5b21b6)',
              border: 'none', borderRadius: '14px',
              cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', color: 'white', flexShrink: 0,
              boxShadow: '0 4px 15px rgba(124,58,237,0.4)', transition: 'all 0.15s',
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
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)', border: 'none',
                borderRadius: '12px', padding: '8px 20px', color: 'white',
                fontWeight: 800, fontSize: '0.85rem',
                cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.6 : 1,
              }}
            >
              {lang === 'ru' ? '🔄 Повторить' : '🔄 Atkārtot'}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
