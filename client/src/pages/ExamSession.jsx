import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { EXAM_CATALOG, EXAM_SUBJECTS } from '../data/exams';

function normalizeAnswer(s) {
  return String(s).trim().toLowerCase().replace(',', '.').replace(/\s/g, '');
}

function checkAnswer(userAns, correctAns) {
  const u = normalizeAnswer(userAns);
  const c = normalizeAnswer(correctAns);
  if (u === c) return true;
  // Numeric tolerance ±0.01
  const un = parseFloat(u), cn = parseFloat(c);
  if (!isNaN(un) && !isNaN(cn)) return Math.abs(un - cn) < 0.011;
  return false;
}

function Timer({ seconds, total }) {
  const pct = (seconds / total) * 100;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const color = seconds < 300 ? '#ef4444' : seconds < 600 ? '#f59e0b' : '#6366f1';
  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="font-black text-white text-lg leading-none" style={{ color }}>
          {mins}:{String(secs).padStart(2, '0')}
        </p>
        <p className="text-white/30 text-xs">{Math.round(pct)}%</p>
      </div>
      <div className="w-2 h-10 bg-white/10 rounded-full overflow-hidden">
        <div className="w-full rounded-full transition-all duration-1000" style={{ height: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ── EXAM REVIEW WITH ORIS ─────────────────────────────────────────────────
function ExamReview({ exam, lang, onBack }) {
  const navigate = useNavigate();
  const t = (obj) => (typeof obj === 'string' ? obj : obj[lang] || obj.ru);
  const questions = exam.questions;
  const subj = EXAM_SUBJECTS[exam.subject] || {};

  const [current, setCurrent] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [chats, setChats] = useState({}); // { qId: [{role,text}] }
  const [loadingQ, setLoadingQ] = useState(null);
  const [followUp, setFollowUp] = useState('');
  const [understood, setUnderstood] = useState({}); // { qId: true|false }
  const [phase, setPhase] = useState('review'); // 'review' | 'done'
  const chatEndRef = useRef(null);

  const q = questions[current];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, current]);

  async function askOris(extraMessage) {
    const qid = q.id;
    const existing = chats[qid] || [];
    const isFirst = existing.length === 0;

    const questionContext = `${lang === 'lv' ? 'Uzdevums' : lang === 'uk' ? 'Завдання' : 'Задание'} (${q.category}): "${t(q.text)}"` +
      (q.type === 'choice' ? `\n${lang === 'lv' ? 'Varianti' : lang === 'uk' ? 'Варіанти' : 'Варианты'}: ${q.options.map(o => `${o.key}) ${o.text}`).join(', ')}` : '') +
      `\n${lang === 'lv' ? 'Pareizā atbilde' : lang === 'uk' ? 'Правильна відповідь' : 'Правильный ответ'}: ${q.answer}${q.type === 'choice' ? ` — ${q.options?.find(o => o.key === q.answer)?.text || ''}` : ''}` +
      (userAnswers[qid] ? `\n${lang === 'lv' ? 'Skolēna atbilde' : lang === 'uk' ? 'Відповідь учня' : 'Ответ ученика'}: ${userAnswers[qid]}` : '');

    const userMsg = isFirst
      ? (lang === 'lv' ? `${questionContext}\n\nIzskaidro, kā risināt šo uzdevumu soli pa solim.`
        : lang === 'uk' ? `${questionContext}\n\nПоясни, як розв'язати це завдання крок за кроком.`
        : `${questionContext}\n\nОбъясни пошагово, как решается это задание.`)
      : extraMessage;

    const displayMsg = isFirst
      ? (lang === 'lv' ? '🦉 Izskaidro risinājumu' : lang === 'uk' ? '🦉 Поясни рішення' : '🦉 Объясни решение')
      : extraMessage;

    const newChat = [...existing, { role: 'user', text: displayMsg }];
    setChats(prev => ({ ...prev, [qid]: newChat }));
    setLoadingQ(qid);
    setFollowUp('');

    try {
      const apiMessages = isFirst
        ? [{ role: 'user', content: userMsg }]
        : [
            { role: 'user', content: `${questionContext}\n\nОбъясни это задание.` },
            ...existing.slice(1).map(m => ({ role: m.role, content: m.text })),
            { role: 'user', content: extraMessage },
          ];

      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('zephyr-token')}`,
        },
        body: JSON.stringify({
          mode: 'homework',
          subject: exam.subject,
          grade: exam.grade,
          language: lang,
          messages: apiMessages,
        }),
      });
      const data = await res.json();
      const reply = data.reply || data.text || '...';
      setChats(prev => ({ ...prev, [qid]: [...(prev[qid] || []), { role: 'assistant', text: reply }] }));
    } catch {
      setChats(prev => ({ ...prev, [qid]: [...(prev[qid] || []), { role: 'assistant', text: '⚠️ Ошибка соединения' }] }));
    } finally {
      setLoadingQ(null);
    }
  }

  if (phase === 'done') {
    const total = questions.length;
    const understoodCount = Object.values(understood).filter(Boolean).length;
    const notUnderstood = questions.filter(q => understood[q.id] === false);
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-4 pb-10">
        <div className="max-w-lg mx-auto pt-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-8">
              <div className="text-6xl mb-3">{understoodCount >= total * 0.8 ? '🏆' : understoodCount >= total * 0.5 ? '📚' : '💪'}</div>
              <h1 className="text-white font-black text-2xl">
                {lang === 'lv' ? 'Analīze pabeigta!' : lang === 'uk' ? 'Розбір завершено!' : 'Разбор завершён!'}
              </h1>
              <p className="text-white/50 mt-1 text-sm">
                {lang === 'lv' ? `Sapratu: ${understoodCount} / ${total}` : lang === 'uk' ? `Зрозумів: ${understoodCount} / ${total}` : `Понял: ${understoodCount} / ${total}`}
              </p>
            </div>

            {notUnderstood.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-4">
                <p className="text-amber-300 font-black text-xs uppercase tracking-wider mb-2">
                  {lang === 'lv' ? '⚠️ Vēl jāmācās' : lang === 'uk' ? '⚠️ Ще вчити' : '⚠️ Ещё нужно изучить'}
                </p>
                {notUnderstood.map(qq => (
                  <p key={qq.id} className="text-white/60 text-sm py-1 border-b border-white/5 last:border-0">{t(qq.text)}</p>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/oris')}
                className="w-full bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-emerald-300 font-black py-3.5 rounded-2xl transition-colors"
              >
                🦉 {lang === 'lv' ? 'Turpināt ar Oris' : lang === 'uk' ? 'Продовжити з Орісом' : 'Продолжить с Орисом'}
              </button>
              <button onClick={onBack} className="w-full bg-white/10 hover:bg-white/15 text-white font-bold py-3 rounded-2xl transition-colors">
                ← {lang === 'lv' ? 'Atpakaļ' : lang === 'uk' ? 'Назад' : 'Назад'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const chatMsgs = chats[q.id] || [];
  const hasExplanation = chatMsgs.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20 shrink-0">
        <div>
          <p className="text-white font-black text-sm">{subj.icon || '📝'} {t(exam.title)} · {exam.year}</p>
          <p className="text-emerald-400/70 text-xs">🦉 {lang === 'lv' ? 'Analīzes režīms' : lang === 'uk' ? 'Режим розбору' : 'Режим разбора'}</p>
        </div>
        <button onClick={onBack} className="text-white/40 hover:text-white/70 text-sm transition-colors">✕</button>
      </div>

      {/* Question dots */}
      <div className="flex gap-1.5 p-3 overflow-x-auto border-b border-white/5 bg-black/10 shrink-0">
        {questions.map((qq, i) => {
          const u = understood[qq.id];
          return (
            <button
              key={qq.id}
              onClick={() => setCurrent(i)}
              className="shrink-0 w-7 h-7 rounded-lg text-xs font-black transition-all"
              style={{
                background: current === i ? '#6366f1' : u === true ? 'rgba(52,211,153,0.3)' : u === false ? 'rgba(248,113,113,0.3)' : (chats[qq.id]?.length ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)'),
                color: current === i ? 'white' : u === true ? '#6ee7b7' : u === false ? '#fca5a5' : 'rgba(255,255,255,0.4)',
                border: current === i ? '2px solid #818cf8' : '2px solid transparent',
              }}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            {/* Question number + category */}
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-emerald-500 text-white font-black text-xs px-2.5 py-1 rounded-full">{current + 1} / {questions.length}</span>
              <span className="text-white/30 text-xs uppercase tracking-wider">{q.category}</span>
              <span className="text-white/30 text-xs">· {q.points} {lang === 'lv' ? 'p.' : 'б.'}</span>
            </div>

            {/* Question text */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
              <p className="text-white text-base leading-relaxed font-medium">{t(q.text)}</p>
              {q.type === 'choice' && (
                <div className="mt-3 flex flex-col gap-1.5">
                  {q.options.map(opt => (
                    <div key={opt.key} className="flex items-center gap-2 text-white/60 text-sm">
                      <span className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center font-black text-xs shrink-0">{opt.key}</span>
                      <span>{opt.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Student answer input (optional) */}
            {!hasExplanation && (
              <div className="mb-4">
                <label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">
                  {lang === 'lv' ? 'Tava atbilde (nav obligāta)' : lang === 'uk' ? 'Твоя відповідь (необов\'язково)' : 'Твой ответ (необязательно)'}
                </label>
                {q.type === 'choice' ? (
                  <div className="flex gap-2 flex-wrap">
                    {q.options.map(opt => {
                      const sel = userAnswers[q.id] === opt.key;
                      return (
                        <button
                          key={opt.key}
                          onClick={() => setUserAnswers(prev => ({ ...prev, [q.id]: opt.key }))}
                          className="px-4 py-2 rounded-xl font-black text-sm transition-all"
                          style={{
                            background: sel ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.08)',
                            border: sel ? '2px solid #818cf8' : '2px solid rgba(255,255,255,0.1)',
                            color: sel ? '#c7d2fe' : 'rgba(255,255,255,0.5)',
                          }}
                        >
                          {opt.key}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={userAnswers[q.id] || ''}
                    onChange={e => setUserAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    placeholder={lang === 'lv' ? 'Mēģini atbildēt...' : lang === 'uk' ? 'Спробуй відповісти...' : 'Попробуй ответить...'}
                    className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white text-base font-medium placeholder-white/20 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                )}
              </div>
            )}

            {/* Explain button */}
            {!hasExplanation && (
              <button
                onClick={() => askOris(null)}
                disabled={loadingQ === q.id}
                className="w-full py-3.5 rounded-2xl font-black text-base transition-all mb-4"
                style={{ background: 'rgba(16,185,129,0.2)', border: '2px solid rgba(16,185,129,0.5)', color: '#6ee7b7' }}
              >
                {loadingQ === q.id
                  ? '🦉 ...'
                  : (lang === 'lv' ? '🦉 Izskaidro risinājumu' : lang === 'uk' ? '🦉 Поясни рішення' : '🦉 Объясни решение')}
              </button>
            )}

            {/* Chat messages */}
            {chatMsgs.length > 0 && (
              <div className="flex flex-col gap-3 mb-4">
                {chatMsgs.map((msg, mi) => (
                  <div
                    key={mi}
                    className={`rounded-2xl p-3 text-sm leading-relaxed ${msg.role === 'assistant' ? 'bg-emerald-500/10 border border-emerald-500/20 text-white/90' : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-right ml-8'}`}
                  >
                    {msg.role === 'assistant' && <p className="text-emerald-400 font-black text-xs mb-1">🦉 Орис</p>}
                    <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                  </div>
                ))}
                {loadingQ === q.id && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3">
                    <p className="text-emerald-400 font-black text-xs mb-1">🦉 Орис</p>
                    <div className="flex gap-1 mt-1">
                      {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-emerald-400/60 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}

            {/* Follow-up input */}
            {hasExplanation && loadingQ !== q.id && (
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={followUp}
                  onChange={e => setFollowUp(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && followUp.trim()) askOris(followUp.trim()); }}
                  placeholder={lang === 'lv' ? 'Uzdod jautājumu...' : lang === 'uk' ? 'Задай питання...' : 'Задай вопрос...'}
                  className="flex-1 bg-white/8 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-400 transition-colors"
                />
                <button
                  onClick={() => { if (followUp.trim()) askOris(followUp.trim()); }}
                  className="bg-emerald-500/30 hover:bg-emerald-500/50 text-emerald-300 px-4 rounded-xl font-bold transition-colors"
                >
                  →
                </button>
              </div>
            )}

            {/* Understood / Not understood */}
            {hasExplanation && (
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => setUnderstood(prev => ({ ...prev, [q.id]: true }))}
                  className="flex-1 py-2.5 rounded-xl font-black text-sm transition-all"
                  style={{
                    background: understood[q.id] === true ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.06)',
                    border: understood[q.id] === true ? '2px solid #34d399' : '2px solid rgba(255,255,255,0.1)',
                    color: understood[q.id] === true ? '#6ee7b7' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  ✓ {lang === 'lv' ? 'Sapratu' : lang === 'uk' ? 'Зрозумів' : 'Понял'}
                </button>
                <button
                  onClick={() => setUnderstood(prev => ({ ...prev, [q.id]: false }))}
                  className="flex-1 py-2.5 rounded-xl font-black text-sm transition-all"
                  style={{
                    background: understood[q.id] === false ? 'rgba(248,113,113,0.3)' : 'rgba(255,255,255,0.06)',
                    border: understood[q.id] === false ? '2px solid #f87171' : '2px solid rgba(255,255,255,0.1)',
                    color: understood[q.id] === false ? '#fca5a5' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  ✗ {lang === 'lv' ? 'Vēl neskaidrs' : lang === 'uk' ? 'Ще не зрозуміло' : 'Ещё не понял'}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div className="p-4 border-t border-white/10 bg-black/20 flex gap-3 shrink-0">
        <button
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
          className="flex-1 bg-white/8 hover:bg-white/15 disabled:opacity-30 text-white font-bold py-3 rounded-xl transition-colors"
        >
          ←
        </button>
        {current < questions.length - 1 ? (
          <button
            onClick={() => setCurrent(current + 1)}
            className="flex-2 flex-grow bg-emerald-500/80 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors px-6"
          >
            {lang === 'lv' ? 'Nākamais →' : lang === 'uk' ? 'Далі →' : 'Далее →'}
          </button>
        ) : (
          <button
            onClick={() => setPhase('done')}
            className="flex-2 flex-grow bg-emerald-500 hover:bg-emerald-400 text-white font-black py-3 rounded-xl transition-colors px-6"
          >
            {lang === 'lv' ? '✓ Pabeigt' : lang === 'uk' ? '✓ Завершити' : '✓ Завершить'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ExamSession() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { state } = useApp();
  const lang = state.language || 'ru';
  const t = (obj) => (typeof obj === 'string' ? obj : obj[lang] || obj.ru);

  const exam = EXAM_CATALOG[examId];

  const totalSeconds = (exam?.duration || 60) * 60;
  const [mode, setMode] = useState(null); // null | 'simulator' | 'review'
  const [phase, setPhase] = useState('intro'); // intro | exam | result
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [current, setCurrent] = useState(0);
  const [checked, setChecked] = useState({}); // { qId: true/false }
  const timerRef = useRef(null);

  useEffect(() => {
    if (phase === 'exam' && !submitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { clearInterval(timerRef.current); handleSubmit(); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase, submitted]);

  if (!exam) return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-6">
      <div className="text-center text-white">
        <p className="text-5xl mb-4">😕</p>
        <p className="font-black text-xl mb-4">{lang === 'lv' ? 'Eksāmens nav atrasts' : 'Экзамен не найден'}</p>
        <button onClick={() => navigate('/exams')} className="bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold">Назад</button>
      </div>
    </div>
  );

  const questions = exam.questions;
  const subj = EXAM_SUBJECTS[exam.subject] || {};
  const typeLabel = exam.type === 'ce'
    ? { ru: 'Централизованный экзамен', lv: 'Centralizētais eksāmens', uk: 'Централізований іспит' }
    : { ru: 'Диагностическая работа',  lv: 'Diagnostiskais darbs',     uk: 'Діагностична робота'  };

  function handleSubmit() {
    clearInterval(timerRef.current);
    setSubmitted(true);
    // Check all answers
    const results = {};
    for (const q of questions) {
      results[q.id] = checkAnswer(answers[q.id] || '', q.answer);
    }
    setChecked(results);
    // Save result
    const totalPoints = questions.reduce((s, q) => s + q.points, 0);
    const earned = questions.reduce((s, q) => s + (results[q.id] ? q.points : 0), 0);
    const percent = Math.round((earned / totalPoints) * 100);
    const saved = JSON.parse(localStorage.getItem('exam-results') || '{}');
    if (!saved[examId]) saved[examId] = [];
    saved[examId].push({ date: Date.now(), percent, earned, total: totalPoints, timeUsed: totalSeconds - timeLeft });
    localStorage.setItem('exam-results', JSON.stringify(saved));
    setPhase('result');
  }

  // ── INTRO ─────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    // If review mode selected, render ExamReview
    if (mode === 'review') {
      return <ExamReview exam={exam} lang={lang} state={state} onBack={() => setMode(null)} />;
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex flex-col items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <button onClick={() => navigate('/exams')} className="text-white/40 hover:text-white/70 text-sm mb-6 flex items-center gap-1 transition-colors">
            ← {lang === 'lv' ? 'Atpakaļ' : 'Назад'}
          </button>
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">{subj.icon || '📝'}</div>
            <h1 className="text-white font-black text-2xl">{t(exam.title)}</h1>
            <p className="text-white/50 text-sm mt-1">{t(typeLabel)} · {exam.grade} {lang === 'lv' ? '. klase' : 'класс'} · {exam.year}</p>
            <p className="text-white/30 text-xs mt-1">{questions.length} {lang === 'lv' ? 'uzd.' : 'задан.'} · {exam.duration} {lang === 'lv' ? 'min' : 'мин'}</p>
          </div>

          {/* Mode selection */}
          <p className="text-white/40 text-xs text-center uppercase tracking-wider mb-3">
            {lang === 'lv' ? 'Izvēlies režīmu' : lang === 'uk' ? 'Обери режим' : 'Выбери режим'}
          </p>
          <div className="flex flex-col gap-3 mb-4">
            {/* Simulator */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => { setMode('simulator'); setPhase('exam'); }}
              className="w-full text-left rounded-2xl p-4 border transition-all"
              style={{ background: 'rgba(99,102,241,0.15)', border: '2px solid rgba(99,102,241,0.5)' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">⏱</span>
                <div>
                  <p className="text-white font-black text-base">
                    {lang === 'lv' ? 'Eksāmena simulators' : lang === 'uk' ? 'Симулятор іспиту' : 'Симулятор экзамена'}
                  </p>
                  <p className="text-indigo-300/70 text-xs mt-0.5">
                    {lang === 'lv' ? 'Taimeris · Pats risini · Rezultāts beigās'
                     : lang === 'uk' ? 'Таймер · Вирішуєш сам · Результат в кінці'
                     : 'Таймер · Решаешь сам · Результат в конце'}
                  </p>
                </div>
              </div>
            </motion.button>

            {/* Review with tutor */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setMode('review')}
              className="w-full text-left rounded-2xl p-4 border transition-all"
              style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.5)' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🦉</span>
                <div>
                  <p className="text-white font-black text-base">
                    {lang === 'lv' ? 'Analīze ar Oris' : lang === 'uk' ? 'Розбір з Орісом' : 'Разбор с Орисом'}
                  </p>
                  <p className="text-emerald-300/70 text-xs mt-0.5">
                    {lang === 'lv' ? 'Bez taimera · Oris skaidro katru uzdevumu'
                     : lang === 'uk' ? 'Без таймера · Оріс пояснює кожне завдання'
                     : 'Без таймера · Орис объясняет каждое задание'}
                  </p>
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── RESULT ────────────────────────────────────────────────────────────────
  if (phase === 'result') {
    const totalPoints = questions.reduce((s, q) => s + q.points, 0);
    const earned = questions.reduce((s, q) => s + (checked[q.id] ? q.points : 0), 0);
    const percent = Math.round((earned / totalPoints) * 100);
    const emoji = percent >= 80 ? '🏆' : percent >= 60 ? '👍' : percent >= 40 ? '📚' : '💪';
    const grade = percent >= 90 ? 10 : percent >= 75 ? 8 : percent >= 60 ? 7 : percent >= 45 ? 6 : percent >= 30 ? 5 : 4;

    // Group errors by category
    const errorsByCategory = {};
    for (const q of questions) {
      if (!checked[q.id]) {
        if (!errorsByCategory[q.category]) errorsByCategory[q.category] = 0;
        errorsByCategory[q.category]++;
      }
    }

    const wrongQuestions = questions.filter(q => !checked[q.id]);

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-4 pb-10">
        <div className="max-w-lg mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="pt-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-3">{emoji}</div>
              <h1 className="text-white font-black text-3xl">{percent}%</h1>
              <p className="text-white/50 mt-1">
                {earned} / {totalPoints} {lang === 'lv' ? 'punkti' : lang === 'uk' ? 'балів' : 'баллов'}
                {' · '}
                {lang === 'lv' ? 'Aptuveni' : lang === 'uk' ? 'Орієнтовно' : 'Примерно'} {grade} {lang === 'lv' ? 'balles' : lang === 'uk' ? 'балів' : 'баллов'}
              </p>
            </div>

            {/* Category breakdown */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
              <h2 className="text-white/60 font-black text-xs uppercase tracking-wider mb-3">
                {lang === 'lv' ? 'Pa tēmām' : lang === 'uk' ? 'По темах' : 'По темам'}
              </h2>
              {Array.from(new Set(questions.map(q => q.category))).map(cat => {
                const total = questions.filter(q => q.category === cat).length;
                const correct = questions.filter(q => q.category === cat && checked[q.id]).length;
                const pct = Math.round((correct / total) * 100);
                return (
                  <div key={cat} className="flex items-center gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-white/70 text-xs font-semibold capitalize">{cat}</span>
                        <span className="text-white/50 text-xs">{correct}/{total}</span>
                      </div>
                      <div className="bg-white/10 rounded-full h-1.5">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct >= 70 ? '#4ade80' : pct >= 40 ? '#fbbf24' : '#f87171' }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Errors detail */}
            {wrongQuestions.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
                <h2 className="text-white/60 font-black text-xs uppercase tracking-wider mb-3">
                  {lang === 'lv' ? '❌ Kļūdas' : lang === 'uk' ? '❌ Помилки' : '❌ Ошибки'}
                </h2>
                <div className="flex flex-col gap-3">
                  {wrongQuestions.map(q => (
                    <div key={q.id} className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                      <p className="text-white/80 text-sm mb-1">{t(q.text)}</p>
                      <div className="flex gap-4 text-xs mt-1">
                        <span className="text-red-400">✗ {lang === 'lv' ? 'Tavs' : lang === 'uk' ? 'Твоя' : 'Твой'}: {answers[q.id] || '—'}</span>
                        <span className="text-green-400">✓ {lang === 'lv' ? 'Pareizi' : lang === 'uk' ? 'Правильно' : 'Правильно'}: {q.answer}{q.type === 'choice' ? ` — ${q.options?.find(o => o.key === q.answer)?.text || ''}` : ''}</span>
                      </div>
                      {t(q.hint) && <p className="text-white/40 text-xs mt-1">💡 {t(q.hint)}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {wrongQuestions.length > 0 && (
                <button
                  onClick={() => {
                    const prompt = `Я решил экзамен "${t(exam.title)}" ${exam.year} года для ${exam.grade} класса. Разбери мои ошибки:\n` +
                      wrongQuestions.map(q => `Задание ${q.id}: "${t(q.text)}" — я ответил "${answers[q.id] || 'ничего'}", правильный ответ: "${q.answer}"`).join('\n');
                    navigate('/oris', { state: { initialMessage: prompt } });
                  }}
                  className="w-full bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-emerald-300 font-black py-3.5 rounded-2xl transition-colors"
                >
                  🦉 {lang === 'lv' ? 'Izskaidrot kļūdas ar Oris' : lang === 'uk' ? 'Розібрати помилки з Орісом' : 'Разобрать ошибки с Орисом'}
                </button>
              )}
              <button
                onClick={() => { setPhase('intro'); setAnswers({}); setChecked({}); setTimeLeft(totalSeconds); setSubmitted(false); setCurrent(0); }}
                className="w-full bg-white/10 hover:bg-white/15 text-white font-bold py-3 rounded-2xl transition-colors"
              >
                🔁 {lang === 'lv' ? 'Atkārtot' : lang === 'uk' ? 'Повторити' : 'Повторить'}
              </button>
              <button
                onClick={() => navigate('/exams')}
                className="w-full bg-white/5 hover:bg-white/10 text-white/60 font-bold py-3 rounded-2xl transition-colors"
              >
                ← {lang === 'lv' ? 'Uz eksāmenu sarakstu' : lang === 'uk' ? 'До списку іспитів' : 'К списку экзаменов'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── EXAM ──────────────────────────────────────────────────────────────────
  const q = questions[current];
  const answered = Object.keys(answers).filter(k => answers[k].trim()).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
        <div>
          <p className="text-white font-black text-sm">{t(exam.title)} · {exam.year}</p>
          <p className="text-white/40 text-xs">{answered}/{questions.length} {lang === 'lv' ? 'atbildēts' : lang === 'uk' ? 'відповідей' : 'ответов'}</p>
        </div>
        <Timer seconds={timeLeft} total={totalSeconds} />
      </div>

      {/* Question navigation dots */}
      <div className="flex gap-1.5 p-3 overflow-x-auto border-b border-white/5 bg-black/10">
        {questions.map((qq, i) => {
          const hasAnswer = answers[qq.id]?.trim();
          return (
            <button
              key={qq.id}
              onClick={() => setCurrent(i)}
              className="shrink-0 w-7 h-7 rounded-lg text-xs font-black transition-all"
              style={{
                background: current === i
                  ? '#6366f1'
                  : hasAnswer
                  ? 'rgba(99,102,241,0.3)'
                  : 'rgba(255,255,255,0.08)',
                color: current === i ? 'white' : hasAnswer ? '#a5b4fc' : 'rgba(255,255,255,0.4)',
                border: current === i ? '2px solid #818cf8' : '2px solid transparent',
              }}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Question */}
      <div className="flex-1 p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-indigo-500 text-white font-black text-xs px-2.5 py-1 rounded-full">
                {current + 1} / {questions.length}
              </span>
              <span className="text-white/30 text-xs uppercase tracking-wider">{q.category}</span>
              <span className="text-white/30 text-xs">· {q.points} {q.points === 1 ? (lang === 'lv' ? 'p.' : 'б.') : (lang === 'lv' ? 'p.' : 'б.')}</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-5">
              <p className="text-white text-base leading-relaxed font-medium">{t(q.text)}</p>
            </div>

            <div className="mb-4">
              <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block">
                {lang === 'lv' ? 'Atbilde' : lang === 'uk' ? 'Відповідь' : 'Ответ'}
              </label>
              {q.type === 'choice' ? (
                <div className="flex flex-col gap-2">
                  {q.options.map(opt => {
                    const selected = answers[q.id] === opt.key;
                    return (
                      <button
                        key={opt.key}
                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt.key }))}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all"
                        style={{
                          background: selected ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.06)',
                          border: selected ? '2px solid #818cf8' : '2px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        <span className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm"
                          style={{ background: selected ? '#6366f1' : 'rgba(255,255,255,0.1)', color: 'white' }}>
                          {opt.key}
                        </span>
                        <span className="text-white/90 text-sm">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <input
                  type="text"
                  value={answers[q.id] || ''}
                  onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                  onKeyDown={e => { if (e.key === 'Enter' && current < questions.length - 1) setCurrent(current + 1); }}
                  placeholder={lang === 'lv' ? 'Ievadi atbildi...' : lang === 'uk' ? 'Введи відповідь...' : 'Введи ответ...'}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-lg font-bold placeholder-white/20 focus:outline-none focus:border-indigo-400 transition-colors"
                  autoFocus
                />
              )}
              {t(q.hint) && (
                <p className="text-white/25 text-xs mt-2">💡 {t(q.hint)}</p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="p-4 border-t border-white/10 bg-black/20 flex gap-3">
        <button
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
          className="flex-1 bg-white/8 hover:bg-white/15 disabled:opacity-30 text-white font-bold py-3 rounded-xl transition-colors"
        >
          ←
        </button>
        {current < questions.length - 1 ? (
          <button
            onClick={() => setCurrent(current + 1)}
            className="flex-2 flex-grow bg-indigo-500/80 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors px-6"
          >
            {lang === 'lv' ? 'Nākamais →' : lang === 'uk' ? 'Далі →' : 'Далее →'}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex-2 flex-grow bg-emerald-500 hover:bg-emerald-400 text-white font-black py-3 rounded-xl transition-colors px-6"
          >
            {lang === 'lv' ? '✓ Iesniegt' : lang === 'uk' ? '✓ Здати' : '✓ Сдать'}
          </button>
        )}
      </div>
    </div>
  );
}
