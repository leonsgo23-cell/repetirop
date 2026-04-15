import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

const T = {
  ru: {
    title: 'Бесплатная диагностика',
    subtitle: 'Узнайте, где пробелы у вашего ребёнка за 10 минут',
    grade_q: 'В каком классе учится ребёнок?',
    subject_q: 'Выберите предмет',
    start: 'Начать диагностику →',
    loading: 'Составляем задания для вашего класса...',
    q_of: 'из',
    next: 'Следующий вопрос →',
    finish: 'Завершить →',
    results_title: 'Результат диагностики',
    score_label: 'Правильных ответов',
    strong: '✅ Сильные темы',
    weak: '⚠️ Темы с пробелами',
    no_weak: 'Отличный результат — пробелов не обнаружено!',
    email_title: 'Получить полный отчёт с 30-дневным планом',
    email_sub: 'На почту пришлём: все вопросы с разбором, план занятий по слабым темам, рекомендации.',
    email_ph: 'ваш@email.com',
    send: 'Получить отчёт на почту →',
    sent: '✅ Отчёт отправлен! Проверьте почту.',
    skip: 'Пропустить',
    try_app: 'Попробовать SmartSkola бесплатно →',
    try_sub: '14 дней бесплатно · Без карты',
    error_load: 'Не удалось загрузить вопросы. Попробуйте ещё раз.',
    retry: 'Попробовать снова',
    grade_label: 'класс',
    back: '← Назад',
    subjects: {
      math:    { label: 'Математика',       icon: '📐' },
      english: { label: 'Английский язык',  icon: '🔤' },
      latvian: { label: 'Латышский язык',   icon: '📖' },
    },
  },
  uk: {
    title: 'Безкоштовна діагностика',
    subtitle: 'Дізнайтесь, де прогалини у вашої дитини за 10 хвилин',
    grade_q: 'В якому класі навчається дитина?',
    subject_q: 'Оберіть предмет',
    start: 'Почати діагностику →',
    loading: 'Складаємо завдання для вашого класу...',
    q_of: 'з',
    next: 'Наступне питання →',
    finish: 'Завершити →',
    results_title: 'Результат діагностики',
    score_label: 'Правильних відповідей',
    strong: '✅ Сильні теми',
    weak: '⚠️ Теми з прогалинами',
    no_weak: 'Відмінний результат — прогалин не виявлено!',
    email_title: 'Отримати повний звіт з 30-денним планом',
    email_sub: 'На пошту надішлемо: всі питання з розбором, план занять зі слабких тем, рекомендації.',
    email_ph: 'ваш@email.com',
    send: 'Отримати звіт на пошту →',
    sent: '✅ Звіт надіслано! Перевірте пошту.',
    skip: 'Пропустити',
    try_app: 'Спробувати SmartSkola безкоштовно →',
    try_sub: '14 днів безкоштовно · Без картки',
    error_load: 'Не вдалось завантажити питання. Спробуйте ще раз.',
    retry: 'Спробувати знову',
    grade_label: 'клас',
    back: '← Назад',
    subjects: {
      math:    { label: 'Математика',        icon: '📐' },
      english: { label: 'Англійська мова',   icon: '🔤' },
      latvian: { label: 'Латвійська мова',   icon: '📖' },
    },
  },
  lv: {
    title: 'Bezmaksas diagnostika',
    subtitle: 'Uzzini, kur ir nepilnības jūsu bērnam — 10 minūtēs',
    grade_q: 'Kurā klasē mācās bērns?',
    subject_q: 'Izvēlies mācību priekšmetu',
    start: 'Sākt diagnostiku →',
    loading: 'Veidojam uzdevumus jūsu klasei...',
    q_of: 'no',
    next: 'Nākamais jautājums →',
    finish: 'Pabeigt →',
    results_title: 'Diagnostikas rezultāts',
    score_label: 'Pareizas atbildes',
    strong: '✅ Stiprās tēmas',
    weak: '⚠️ Tēmas ar nepilnībām',
    no_weak: 'Lielisks rezultāts — nepilnību nav!',
    email_title: 'Saņemt pilnu pārskatu ar 30 dienu plānu',
    email_sub: 'E-pastā nosūtīsim: visus jautājumus ar skaidrojumiem, nodarbību plānu vājām tēmām, ieteikumus.',
    email_ph: 'jūsu@epasts.lv',
    send: 'Saņemt pārskatu uz e-pastu →',
    sent: '✅ Pārskats nosūtīts! Pārbaudiet e-pastu.',
    skip: 'Izlaist',
    try_app: 'Izmēģināt SmartSkola bez maksas →',
    try_sub: '14 dienas bez maksas · Bez kartes',
    error_load: 'Neizdevās ielādēt jautājumus. Mēģiniet vēlreiz.',
    retry: 'Mēģināt vēlreiz',
    grade_label: '. klase',
    back: '← Atpakaļ',
    subjects: {
      math:    { label: 'Matemātika',       icon: '📐' },
      english: { label: 'Angļu valoda',     icon: '🔤' },
      latvian: { label: 'Latviešu valoda',  icon: '📖' },
    },
  },
};

const PHASE = { GRADE: 'grade', SUBJECT: 'subject', LOADING: 'loading', TEST: 'test', RESULTS: 'results' };

export default function Diagnostic() {
  const { state } = useApp();
  const lang = state.language || 'ru';
  const t = T[lang] || T.ru;

  const [phase, setPhase] = useState(PHASE.GRADE);
  const [grade, setGrade] = useState(null);
  const [subject, setSubject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [brief, setBrief] = useState(null);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [loadError, setLoadError] = useState(false);

  function selectGrade(g) {
    setGrade(g);
    setPhase(PHASE.SUBJECT);
  }

  async function startTest(g, s) {
    setSubject(s);
    setPhase(PHASE.LOADING);
    setLoadError(false);
    try {
      const res = await fetch('/api/diagnostic/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade: g, subject: s, language: lang }),
      });
      const data = await res.json();
      if (!data.questions) throw new Error('no questions');
      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(-1));
      setCurrent(0);
      setSelected(null);
      setPhase(PHASE.TEST);
    } catch {
      setLoadError(true);
      setPhase(PHASE.GRADE);
    }
  }

  function selectOption(idx) {
    if (selected !== null) return;
    setSelected(idx);
    const newAnswers = [...answers];
    newAnswers[current] = idx;
    setAnswers(newAnswers);
  }

  async function nextQuestion() {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      // Done — get results
      try {
        const res = await fetch('/api/diagnostic/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ grade, language: lang, questions, answers }),
        });
        const data = await res.json();
        setBrief(data.brief);
      } catch {
        setBrief({ totalScore: 0, totalCorrect: 0, total: questions.length, strong: [], weak: [] });
      }
      setPhase(PHASE.RESULTS);
    }
  }

  async function sendEmail() {
    if (!email.includes('@')) return;
    setEmailSending(true);
    try {
      await fetch('/api/diagnostic/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade, language: lang, email, questions, answers }),
      });
      setEmailSent(true);
    } catch { /* silent */ }
    setEmailSending(false);
  }

  const scoreColor = brief
    ? brief.totalScore >= 70 ? '#22c55e' : brief.totalScore >= 50 ? '#f59e0b' : '#ef4444'
    : '#6366f1';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-4 pb-16">
      <div className="max-w-lg mx-auto pt-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="text-5xl mb-3">🦉</div>
          <h1 className="text-white font-black text-2xl">{t.title}</h1>
          <p className="text-white/50 text-sm mt-1">{t.subtitle}</p>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ── Phase: Grade selection ── */}
          {phase === PHASE.GRADE && (
            <motion.div key="grade" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <p className="text-white/70 text-center mb-5 font-medium">{t.grade_q}</p>
              {loadError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-center mb-4">
                  <p className="text-red-400 text-sm">{t.error_load}</p>
                </div>
              )}
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(g => (
                  <motion.button
                    key={g}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => selectGrade(g)}
                    className="bg-white/8 hover:bg-indigo-500/30 border border-white/15 hover:border-indigo-400/50 rounded-2xl py-4 text-white font-black text-lg transition-all"
                  >
                    {g}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Phase: Subject selection ── */}
          {phase === PHASE.SUBJECT && (
            <motion.div key="subject" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <p className="text-white/70 text-center mb-5 font-medium">{t.subject_q}</p>
              <div className="flex flex-col gap-3">
                {Object.entries(t.subjects).map(([key, { label, icon }]) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => startTest(grade, key)}
                    className="bg-white/8 hover:bg-indigo-500/30 border border-white/15 hover:border-indigo-400/50 rounded-2xl py-5 px-6 text-white font-bold text-lg transition-all flex items-center gap-4"
                  >
                    <span className="text-3xl">{icon}</span>
                    <span>{label}</span>
                  </motion.button>
                ))}
              </div>
              <button
                onClick={() => setPhase(PHASE.GRADE)}
                className="mt-4 text-white/30 hover:text-white/60 text-sm w-full text-center transition-colors"
              >
                {t.back}
              </button>
            </motion.div>
          )}

          {/* ── Phase: Loading ── */}
          {phase === PHASE.LOADING && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
              <div className="text-5xl mb-4 animate-pulse">⚙️</div>
              <p className="text-white/60">{t.loading}</p>
              <div className="flex justify-center gap-1 mt-4">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Phase: Test ── */}
          {phase === PHASE.TEST && questions[current] && (
            <motion.div key={`q-${current}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              {/* Progress */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                  />
                </div>
                <span className="text-white/40 text-sm shrink-0">{current + 1} {t.q_of} {questions.length}</span>
              </div>

              {/* Topic badge */}
              <div className="inline-block bg-indigo-500/20 text-indigo-300 text-xs font-medium px-3 py-1 rounded-full mb-3">
                {questions[current].topic}
              </div>

              {/* Question */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
                <p className="text-white font-bold text-lg leading-snug">{questions[current].question}</p>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-3 mb-5">
                {questions[current].options.map((opt, idx) => {
                  let cls = 'bg-white/5 border-white/15 text-white/80';
                  if (selected !== null) {
                    if (idx === questions[current].correct) cls = 'bg-green-500/20 border-green-400/60 text-green-300';
                    else if (idx === selected) cls = 'bg-red-500/20 border-red-400/60 text-red-300';
                    else cls = 'bg-white/3 border-white/8 text-white/40';
                  } else {
                    cls = 'bg-white/5 border-white/15 text-white/80 hover:bg-white/10 hover:border-indigo-400/40 cursor-pointer';
                  }
                  return (
                    <motion.button
                      key={idx}
                      whileTap={selected === null ? { scale: 0.98 } : {}}
                      onClick={() => selectOption(idx)}
                      className={`border rounded-xl p-4 text-left font-medium text-sm transition-all ${cls}`}
                    >
                      <span className="font-black text-white/40 mr-2">{String.fromCharCode(65 + idx)}.</span>
                      {opt}
                    </motion.button>
                  );
                })}
              </div>

              {/* Next button — only shown after selecting */}
              {selected !== null && (
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={nextQuestion}
                  className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-black py-3.5 rounded-xl transition-colors"
                >
                  {current < questions.length - 1 ? t.next : t.finish}
                </motion.button>
              )}
            </motion.div>
          )}

          {/* ── Phase: Results ── */}
          {phase === PHASE.RESULTS && brief && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

              {/* Score */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center mb-4">
                <p className="text-white/50 text-sm mb-1">{t.score_label}</p>
                <p className="font-black text-6xl mb-1" style={{ color: scoreColor }}>{brief.totalScore}%</p>
                <p className="text-white/40 text-sm">{brief.totalCorrect} / {brief.total}</p>
              </div>

              {/* Strong topics */}
              {brief.strong.length > 0 && (
                <div className="bg-green-500/8 border border-green-500/25 rounded-2xl p-4 mb-3">
                  <p className="text-green-400 font-black text-sm mb-3">{t.strong}</p>
                  {brief.strong.map(s => (
                    <div key={s.topic} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                      <span className="text-white/80 text-sm">{s.topic}</span>
                      <span className="text-green-400 font-black text-sm">{s.score}%</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Weak topics */}
              {brief.weak.length > 0 ? (
                <div className="bg-red-500/8 border border-red-500/25 rounded-2xl p-4 mb-4">
                  <p className="text-red-400 font-black text-sm mb-3">{t.weak}</p>
                  {brief.weak.map(w => (
                    <div key={w.topic} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                      <span className="text-white/80 text-sm">{w.topic}</span>
                      <span className="text-red-400 font-black text-sm">{w.score}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 text-center mb-4">
                  <p className="text-green-400 font-bold text-sm">{t.no_weak}</p>
                </div>
              )}

              {/* Email form */}
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-5 mb-4">
                <p className="text-white font-black mb-1">{t.email_title}</p>
                <p className="text-white/50 text-xs mb-4">{t.email_sub}</p>
                {emailSent ? (
                  <p className="text-green-400 font-bold text-center py-2">{t.sent}</p>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder={t.email_ph}
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 outline-none focus:border-indigo-400"
                    />
                    <button
                      onClick={sendEmail}
                      disabled={emailSending || !email.includes('@')}
                      className="bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shrink-0"
                    >
                      {emailSending ? '...' : '→'}
                    </button>
                  </div>
                )}
              </div>

              {/* CTA to register */}
              <a
                href="/register"
                className="block w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-black py-4 rounded-2xl text-center text-base transition-all mb-2"
              >
                {t.try_app}
              </a>
              <p className="text-white/30 text-xs text-center">{t.try_sub}</p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
