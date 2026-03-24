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

export default function ExamSession() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { state } = useApp();
  const lang = state.language || 'ru';
  const t = (obj) => (typeof obj === 'string' ? obj : obj[lang] || obj.ru);

  const exam = EXAM_CATALOG[examId];

  const totalSeconds = (exam?.duration || 60) * 60;
  const [phase, setPhase] = useState('intro'); // intro | exam | review | result
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex flex-col items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <button onClick={() => navigate('/exams')} className="text-white/40 hover:text-white/70 text-sm mb-6 flex items-center gap-1 transition-colors">
            ← {lang === 'lv' ? 'Atpakaļ' : 'Назад'}
          </button>
          <div className="text-center mb-8">
            <div className="text-6xl mb-3">{subj.icon || '📝'}</div>
            <h1 className="text-white font-black text-2xl">{t(exam.title)}</h1>
            <p className="text-white/50 text-sm mt-1">{t(typeLabel)} · {exam.grade} {lang === 'lv' ? '. klase' : 'класс'} · {exam.year}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 flex flex-col gap-3">
            {[
              { icon: '⏱', label: { ru: `${exam.duration} минут`, lv: `${exam.duration} minūtes`, uk: `${exam.duration} хвилин` } },
              { icon: '📋', label: { ru: `${questions.length} заданий`, lv: `${questions.length} uzdevumi`, uk: `${questions.length} завдань` } },
              { icon: '✏️', label: { ru: 'Введи ответ числом или выражением', lv: 'Ievadi atbildi ar skaitli vai izteiksmi', uk: 'Введи відповідь числом або виразом' } },
              { icon: '🤖', label: { ru: 'Орис объяснит ошибки после', lv: 'Oris paskaidros kļūdas pēcāk', uk: 'Оріс поясне помилки після' } },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-white/70 text-sm">{t(item.label)}</span>
              </div>
            ))}
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setPhase('exam')}
            className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-black py-4 rounded-2xl text-lg transition-colors"
          >
            {lang === 'lv' ? '▶ Sākt eksāmenu' : lang === 'uk' ? '▶ Почати іспит' : '▶ Начать экзамен'}
          </motion.button>
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
