import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { SUBJECTS } from '../data/curriculum';

// ── shared UI pieces ───────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
      <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>🦉</span>
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
      {isAI && <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>🦉</span>}
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
          <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.6', margin: 0, color: '#ffffff' }}
            dangerouslySetInnerHTML={{ __html: msg.content
              .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
              .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.+?)\*/g, '<em>$1</em>')
            }}
          />
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
  const { state } = useApp();
  const lang = state.language || 'ru';

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
  const [showCanvas, setShowCanvas] = useState(false);
  const [canvasHasContent, setCanvasHasContent] = useState(false);

  const messagesEndRef = useRef(null);
  const autoRetryHistRef = useRef(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef(null);

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
      alert(lang === 'lv' ? 'Neizdevās nolasīt failu. Mēģini citu attēlu.' : lang === 'uk' ? 'Не вдалося прочитати файл. Спробуй інше зображення.' : 'Не удалось прочитать файл. Попробуй другое изображение.');
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

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDraw = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    isDrawingRef.current = true;
    lastPointRef.current = getPos(e, canvas);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPointRef.current = pos;
    setCanvasHasContent(true);
  };

  const stopDraw = (e) => {
    e?.preventDefault();
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setCanvasHasContent(false);
  };

  const captureCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !canvasHasContent) return null;
    const dataUrl = canvas.toDataURL('image/png');
    return { base64: dataUrl.split(',')[1], mime: 'image/png', preview: dataUrl };
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
        topicName: lang === 'lv' ? 'Mājas darbs' : lang === 'uk' ? 'Домашнє завдання' : 'Домашнее задание',
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
            ? (lang === 'lv' ? `😔 API kvota izsmelts. Mēģini pēc ~${waitMin} min.` : lang === 'uk' ? `😔 Квота API вичерпана. Спробуй через ~${waitMin} хв.` : `😔 Квота API исчерпана. Попробуй через ~${waitMin} мин.`)
            : (lang === 'lv' ? '😔 Serveris pārslogots. Pagaidi pāris minūtes.' : lang === 'uk' ? '😔 Сервер перевантажений. Зачекай кілька хвилин.' : '😔 Сервер перегружен. Подожди пару минут.');
          showMsg(giveUpMsg);
          setRetryHistory(history);
          setAutoRetryCount(0);
        } else {
          setAutoRetryCount(nextCount);
          showMsg(lang === 'lv'
            ? `⏳ Gaidīsim ${waitSec} sek... (${nextCount}/${MAX_AUTO})`
            : lang === 'uk'
            ? `⏳ Зачекаємо ${waitSec} сек... (${nextCount}/${MAX_AUTO})`
            : `⏳ Подождём ${waitSec} сек... (${nextCount}/${MAX_AUTO})`);
          autoRetryHistRef.current = history;
          setAutoRetryIn(waitSec);
        }
      } else if (isTimeout) {
        showMsg(lang === 'lv' ? '⏱ Serveris neatbildēja. Nospied «Atkārtot».' : lang === 'uk' ? '⏱ Сервер не відповів. Натисни «Повторити».' : '⏱ Сервер не ответил. Нажми «Повторить».');
        setRetryHistory(history);
      } else {
        showMsg(lang === 'lv'
          ? (isNetwork ? '📡 Nav savienojuma.' : `❌ Kļūda: ${err.message}`)
          : lang === 'uk'
          ? (isNetwork ? '📡 Немає зв\'язку з сервером.' : `❌ Помилка: ${err.message}`)
          : (isNetwork ? '📡 Нет связи с сервером.' : `❌ Ошибка: ${err.message}`));
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
    let imgBase64 = imageBase64;
    let imgMime = imageMimeType;
    let imgPreview = imagePreview;

    // Use canvas drawing if no file image
    if (!imgBase64 && canvasHasContent) {
      const cap = captureCanvas();
      if (cap) { imgBase64 = cap.base64; imgMime = cap.mime; imgPreview = cap.preview; }
    }

    if (!trimmed && !imgBase64) return;

    const userText = trimmed || (lang === 'lv' ? 'Palīdzi ar šo uzdevumu.' : lang === 'uk' ? 'Допоможи з цим завданням.' : 'Помоги с этим заданием.');
    const firstMsg = { role: 'user', content: userText };
    if (imgBase64) {
      firstMsg.imageData = imgBase64;
      firstMsg.imageMimeType = imgMime || 'image/jpeg';
    }

    // For display: keep imageUrl in UI-only message (don't send imageUrl to API)
    const displayMsg = { role: 'user', content: trimmed, imageUrl: imgPreview || undefined };

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
              ← {lang === 'lv' ? 'Atpakaļ' : lang === 'uk' ? 'Назад' : 'Назад'}
            </button>
            <p style={{ color: 'white', fontWeight: 900, fontSize: '1rem', margin: 0, flex: 1, textAlign: 'center' }}>
              📚 {lang === 'lv' ? 'Palīdzība ar mājas darbu' : lang === 'uk' ? 'Допомога з домашнім завданням' : 'Помощь с домашним заданием'}
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
              <span style={{ fontSize: '2.2rem' }}>🦉</span>
              <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.92rem', lineHeight: 1.6 }}>
                {lang === 'lv'
                  ? `Sveiki, ${state.studentName}! Parādi man savu uzdevumu — es to izskaidrošu soli pa solim.`
                  : lang === 'uk'
                  ? `Привіт, ${state.studentName}! Покажи мені своє завдання — я розберу його покроково і поясню метод розв'язання.`
                  : `Привет, ${state.studentName}! Покажи мне своё задание — я разберу его по шагам и объясню метод решения.`}
              </p>
            </div>

            {/* How-to steps */}
            <div style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px', padding: '14px 16px', marginBottom: '24px',
              display: 'flex', flexDirection: 'column', gap: '8px',
            }}>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px' }}>
                {lang === 'lv' ? 'Kā lietot' : lang === 'uk' ? 'Як користуватись' : 'Как пользоваться'}
              </p>
              {[
                {
                  icon: '📷',
                  ru: 'Сфотографируй задание или напиши его текст',
                  uk: 'Сфотографуй завдання або напиши його текст',
                  lv: 'Nofotografē uzdevumu vai ieraksti tā tekstu',
                },
                {
                  icon: '🦉',
                  ru: 'Нажми «Разобраться с Орисом» — он изучит задание',
                  uk: 'Натисни «Розібратись з Орисом» — він вивчить завдання',
                  lv: 'Nospied «Risināt ar Oris» — viņš izpētīs uzdevumu',
                },
                {
                  icon: '💬',
                  ru: 'Отвечай на вопросы Ориса — он объяснит шаг за шагом',
                  uk: 'Відповідай на запитання Ориса — він пояснить крок за кроком',
                  lv: 'Atbildi uz Oris jautājumiem — viņš izskaidros soli pa solim',
                },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: '1px' }}>{step.icon}</span>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.83rem', margin: 0, lineHeight: 1.5 }}>
                    {step[lang] || step.ru}
                  </p>
                </div>
              ))}
            </div>

            {/* Subject picker */}
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 10px' }}>
              {lang === 'lv' ? 'Priekšmets' : lang === 'uk' ? 'Предмет' : 'Предмет'}
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
                    position: 'absolute', top: '6px', right: '6px',
                    background: 'rgba(0,0,0,0.65)', border: 'none', borderRadius: '50%',
                    width: '36px', height: '36px', color: 'white', fontSize: '1rem',
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
                {lang === 'lv' ? 'Nofotografēt uzdevumu' : lang === 'uk' ? 'Сфотографувати завдання' : 'Сфотографировать задание'}
              </button>
            )}

            {/* Draw button */}
            {!imagePreview && (
              <button
                onClick={() => { setShowCanvas(v => !v); if (showCanvas) clearCanvas(); }}
                style={{
                  width: '100%', marginBottom: '12px',
                  background: showCanvas ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.05)',
                  border: `1.5px dashed ${showCanvas ? 'rgba(167,139,250,0.7)' : 'rgba(255,255,255,0.2)'}`,
                  borderRadius: '16px', padding: '14px',
                  color: showCanvas ? 'rgba(167,139,250,0.95)' : 'rgba(255,255,255,0.45)',
                  fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                }}
              >
                <span style={{ fontSize: '1.3rem' }}>✏️</span>
                {lang === 'lv'
                  ? (showCanvas ? 'Paslēpt audeklu' : 'Zīmēt uzdevumu')
                  : lang === 'uk'
                  ? (showCanvas ? 'Сховати полотно' : 'Намалювати завдання')
                  : (showCanvas ? 'Скрыть холст' : 'Нарисовать задание')}
              </button>
            )}

            {/* Drawing canvas */}
            {showCanvas && !imagePreview && (
              <div style={{ marginBottom: '16px' }}>
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={300}
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={stopDraw}
                  onMouseLeave={stopDraw}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={stopDraw}
                  style={{
                    width: '100%', height: '180px', display: 'block',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1.5px solid rgba(167,139,250,0.4)',
                    borderRadius: '14px', cursor: 'crosshair', touchAction: 'none',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>
                    {lang === 'lv' ? 'Zīmē ar pirkstu vai peli' : lang === 'uk' ? 'Малюй пальцем або мишею' : 'Рисуй пальцем или мышью'}
                  </span>
                  <button
                    onClick={clearCanvas}
                    style={{
                      background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: '8px', padding: '4px 12px', color: 'rgba(239,68,68,0.8)',
                      fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    {lang === 'lv' ? 'Notīrīt' : lang === 'uk' ? 'Очистити' : 'Очистить'}
                  </button>
                </div>
              </div>
            )}

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontWeight: 700 }}>
                {lang === 'lv' ? 'vai ieraksti tekstu' : lang === 'uk' ? 'або напиши текст' : 'или напиши текст'}
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            </div>

            {/* Problem textarea */}
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder={lang === 'lv'
                ? 'Kopē vai ieraksti uzdevuma tekstu no mācību grāmatas…\nPiemēram: «Atrisini vienādojumu: 2x + 5 = 13»'
                : lang === 'uk'
                ? 'Скопіюй або напиши текст завдання з підручника…\nНаприклад: «Розв\'яжи рівняння: 2x + 5 = 13»'
                : 'Скопируй или напиши текст задания из учебника…\nНапример: «Реши уравнение: 2x + 5 = 13»'}
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
              const canSubmit = problem.trim() || imageBase64 || canvasHasContent;
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
                  🦉 {lang === 'lv' ? 'Risināt ar Oris →' : lang === 'uk' ? 'Розібратись з Орисом →' : 'Разобраться с Орисом →'}
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
            ← {lang === 'lv' ? 'Jauns uzdevums' : lang === 'uk' ? 'Нове завдання' : 'Новое задание'}
          </button>
          <p style={{ color: 'white', fontWeight: 900, fontSize: '0.88rem', margin: 0 }}>
            📚 {lang === 'lv' ? 'Mājas darbs' : lang === 'uk' ? 'Домашнє завдання' : 'Домашнее задание'}
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 700, fontSize: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            {lang === 'lv' ? 'Sākums' : lang === 'uk' ? 'На головну' : 'На главную'}
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
      <div style={{ flexShrink: 0, background: 'rgba(255,255,255,0.05)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px calc(16px + env(safe-area-inset-bottom))' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={lang === 'lv' ? 'Raksti atbildi vai jautājumu…' : lang === 'uk' ? 'Напиши відповідь або запитання…' : 'Напиши ответ или вопрос…'}
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
            ⏳ {lang === 'lv' ? `Atkārtojums pēc ${autoRetryIn} sek...` : lang === 'uk' ? `Повтор через ${autoRetryIn} сек...` : `Повтор через ${autoRetryIn} сек...`}
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
              {lang === 'lv' ? '🔄 Atkārtot' : lang === 'uk' ? '🔄 Повторити' : '🔄 Повторить'}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
