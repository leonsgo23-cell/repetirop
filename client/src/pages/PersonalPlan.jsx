import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const SUBJECT_LABELS = {
  math:     { ru: 'Математика',  lv: 'Matemātika',      uk: 'Математика'  },
  english:  { ru: 'Английский',  lv: 'Angļu valoda',    uk: 'Англійська'  },
  latvian:  { ru: 'Латышский',   lv: 'Latviešu valoda', uk: 'Латвійська'  },
  biology:  { ru: 'Биология',    lv: 'Bioloģija',       uk: 'Біологія'    },
  physics:  { ru: 'Физика',      lv: 'Fizika',          uk: 'Фізика'      },
  chemistry:{ ru: 'Химия',       lv: 'Ķīmija',          uk: 'Хімія'       },
};

const LEVEL_CONFIG = {
  weak:   { color: '#ef4444', bg: 'rgba(239,68,68,0.18)',   border: 'rgba(239,68,68,0.5)',   label: { ru: 'Слабый',  lv: 'Vājš',   uk: 'Слабкий'  } },
  medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.18)',  border: 'rgba(245,158,11,0.5)',  label: { ru: 'Средний', lv: 'Vidējs', uk: 'Середній' } },
  strong: { color: '#22c55e', bg: 'rgba(34,197,94,0.18)',   border: 'rgba(34,197,94,0.5)',   label: { ru: 'Сильный', lv: 'Stiprs', uk: 'Сильний'  } },
};

const SUBJECT_ICONS = {
  math: '🔢', english: '🇬🇧', latvian: '🇱🇻', biology: '🌿', physics: '⚡', chemistry: '⚗️',
};

const T = {
  title:        { ru: '📋 Персональная программа', lv: '📋 Personalizēts plāns',        uk: '📋 Персональна програма'    },
  subtitle:     { ru: 'Анализ и рекомендации для вашего ребёнка', lv: 'Analīze un ieteikumi jūsu bērnam', uk: 'Аналіз та рекомендації для вашої дитини' },
  inputTitle:   { ru: 'Расскажите об успехах ребёнка', lv: 'Pastāstiet par bērna sekmēm', uk: 'Розкажіть про успіхи дитини' },
  inputHint:    { ru: 'Опишите, что даётся легко, что вызывает трудности, как прошли последние контрольные, какие оценки по предметам. Чем подробнее — тем точнее план.', lv: 'Aprakstiet, kas padodas viegli, kas sagādā grūtības, kā gājušas pēdējās pārbaudes, kādas ir atzīmes. Jo sīkāk — jo precīzāks plāns.', uk: 'Опишіть, що дається легко, що викликає труднощі, як пройшли останні контрольні, які оцінки. Що детальніше — то точніший план.' },
  placeholder:  { ru: 'Например: «Маша учится в 6 классе. По математике слабовато — дроби никак не идут, геометрия получается лучше. По английскому оценки 7-8, читает хорошо, но грамматика хромает. Латышский на 5-6, словарный запас небольшой...»', lv: 'Piemēram: «Maija mācās 6. klasē. Matemātikā vāji — daļskaitļi neiet, ģeometrija labāk. Angļu valodā atzīmes 7-8, lasa labi, gramatika vāja. Latviešu valodā 5-6...»', uk: 'Наприклад: «Маша навчається в 6 класі. З математики слабувато — дроби ніяк не даються, геометрія краще. З англійської оцінки 7-8...»' },
  generate:     { ru: '✨ Составить программу',      lv: '✨ Sastādīt plānu',              uk: '✨ Скласти програму'         },
  generating:   { ru: 'ИИ анализирует...',           lv: 'Mākslīgais intelekts analizē...', uk: 'ШІ аналізує...'            },
  generatingHint:{ ru: 'Это займёт около 20–30 секунд', lv: 'Tas aizņems aptuveni 20–30 sekundes', uk: 'Це займе близько 20–30 секунд' },
  summary:      { ru: 'Педагогический анализ',       lv: 'Pedagoģiskā analīze',           uk: 'Педагогічний аналіз'        },
  subjects:     { ru: 'Предметы',                    lv: 'Priekšmeti',                    uk: 'Предмети'                   },
  weakTopics:   { ru: 'Слабые темы:',                lv: 'Vājās tēmas:',                  uk: 'Слабкі теми:'               },
  strongTopics: { ru: 'Сильные темы:',               lv: 'Stiprās tēmas:',                uk: 'Сильні теми:'               },
  schedule:     { ru: '🗓 Рекомендуемый план',        lv: '🗓 Ieteicamais plāns',           uk: '🗓 Рекомендований план'      },
  schedGoal:    { ru: 'Цель:',                       lv: 'Mērķis:',                       uk: 'Ціль:'                      },
  strengths:    { ru: '💪 Сильные стороны',          lv: '💪 Stiprās puses',              uk: '💪 Сильні сторони'           },
  improvements: { ru: '🎯 Над чем работать',         lv: '🎯 Ko uzlabot',                 uk: '🎯 Над чим працювати'        },
  motivation:   { ru: '⭐ Слово ободрения',          lv: '⭐ Iedrošinājums',              uk: '⭐ Слово підтримки'          },
  reset:        { ru: 'Обновить программу',           lv: 'Atjaunināt plānu',             uk: 'Оновити програму'           },
  back:         { ru: '← Назад',                     lv: '← Atpakaļ',                    uk: '← Назад'                    },
  priority:     { ru: 'Приоритет',                   lv: 'Prioritāte',                   uk: 'Пріоритет'                  },
  createdAt:    { ru: 'Составлено',                  lv: 'Sastādīts',                    uk: 'Складено'                   },
  noDescription:{ ru: 'Добавьте описание или прикрепите PDF', lv: 'Pievienojiet aprakstu vai PDF', uk: 'Додайте опис або прикріпіть PDF' },
  pdfLabel:     { ru: 'Прикрепить табель / отчёт учителя (PDF)', lv: 'Pievienot liecību / skolotāja ziņojumu (PDF)', uk: 'Прикріпити табель / звіт вчителя (PDF)' },
  pdfHint:      { ru: 'необязательно', lv: 'pēc izvēles', uk: 'необов\'язково' },
  pdfRemove:    { ru: '✕ Убрать', lv: '✕ Noņemt', uk: '✕ Прибрати' },
};

function tw(key, lang) { return T[key]?.[lang] || T[key]?.ru || key; }

const GO_LABEL = { ru: 'Перейти →', lv: 'Doties →', uk: 'Перейти →' };

function SubjectBar({ id, data, lang, index, onGo }) {
  const cfg = LEVEL_CONFIG[data.level] || LEVEL_CONFIG.medium;
  const label = SUBJECT_LABELS[id]?.[lang] || id;
  const icon = SUBJECT_ICONS[id] || '📚';
  const score = Math.min(100, Math.max(0, data.score || 50));

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07 }}
      style={{
        background: cfg.bg,
        border: `1.5px solid ${cfg.border}`,
        borderRadius: '14px',
        padding: '12px 14px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <span style={{
          width: '24px', height: '24px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.65rem', fontWeight: 900, color: 'rgba(255,255,255,0.7)', flexShrink: 0,
        }}>
          {data.priority}
        </span>
        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
        <span style={{ color: 'white', fontWeight: 800, fontSize: '0.9rem', flex: 1 }}>{label}</span>
        <span style={{
          background: cfg.color + '33',
          border: `1px solid ${cfg.color}88`,
          borderRadius: '8px', padding: '2px 8px',
          color: cfg.color, fontSize: '0.68rem', fontWeight: 800,
        }}>
          {cfg.label[lang]}
        </span>
      </div>

      {/* Score bar + go button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '6px', height: '7px', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.07 + 0.2 }}
            style={{ height: '100%', background: cfg.color, borderRadius: '6px' }}
          />
        </div>
        <button
          onClick={onGo}
          style={{
            background: cfg.color + '22', border: `1px solid ${cfg.color}66`,
            borderRadius: '8px', padding: '3px 10px',
            color: cfg.color, fontSize: '0.68rem', fontWeight: 800,
            cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
          }}
        >
          {GO_LABEL[lang] || GO_LABEL.ru}
        </button>
      </div>

      {/* Weak topics */}
      {data.weakTopics?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '4px' }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', fontWeight: 700, alignSelf: 'center' }}>
            {tw('weakTopics', lang)}
          </span>
          {data.weakTopics.map((tp, i) => (
            <span key={i} style={{
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '6px', padding: '1px 7px',
              color: '#fca5a5', fontSize: '0.65rem', fontWeight: 600,
            }}>
              {tp}
            </span>
          ))}
        </div>
      )}

      {/* Strong topics */}
      {data.strongTopics?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', fontWeight: 700, alignSelf: 'center' }}>
            {tw('strongTopics', lang)}
          </span>
          {data.strongTopics.map((tp, i) => (
            <span key={i} style={{
              background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: '6px', padding: '1px 7px',
              color: '#86efac', fontSize: '0.65rem', fontWeight: 600,
            }}>
              {tp}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function ScheduleBlock({ item, index, lang }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      style={{
        background: 'rgba(99,102,241,0.12)',
        border: '1px solid rgba(99,102,241,0.25)',
        borderRadius: '12px',
        padding: '11px 14px',
        display: 'flex', alignItems: 'flex-start', gap: '10px',
      }}
    >
      <div style={{
        background: 'rgba(99,102,241,0.3)', border: '1px solid rgba(99,102,241,0.5)',
        borderRadius: '8px', padding: '2px 8px',
        color: '#a5b4fc', fontSize: '0.65rem', fontWeight: 900,
        flexShrink: 0, marginTop: '2px', whiteSpace: 'nowrap',
      }}>
        {item.period}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ color: 'white', fontWeight: 700, fontSize: '0.82rem', margin: 0 }}>{item.focus}</p>
        {item.goal && (
          <p style={{ color: 'rgba(165,180,252,0.7)', fontSize: '0.7rem', margin: '3px 0 0' }}>
            {tw('schedGoal', lang)} {item.goal}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function PersonalPlan() {
  const navigate = useNavigate();
  const { state } = useApp();
  const { token } = useAuth();
  const lang = state.language || 'ru';
  const grade = state.grade;

  const [status, setStatus] = useState('loading'); // loading | empty | generating | plan
  const [plan, setPlan] = useState(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [resetting, setResetting] = useState(false);
  const [pdfBase64, setPdfBase64] = useState(null);
  const [pdfName, setPdfName] = useState('');

  useEffect(() => {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 8000);
    fetch('/api/personal-plan', { headers: { Authorization: `Bearer ${token}` }, signal: ctrl.signal })
      .then(r => r.json())
      .then(data => {
        clearTimeout(tid);
        if (data.plan) { setPlan(data.plan); setStatus('plan'); }
        else setStatus('empty');
      })
      .catch(() => { clearTimeout(tid); setStatus('empty'); });
  }, [token]);

  const handlePdf = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxMB = 10;
    if (file.size > maxMB * 1024 * 1024) {
      setError(lang === 'lv' ? `PDF pārāk liels (max ${maxMB}MB)` : lang === 'uk' ? `PDF завеликий (макс ${maxMB}МБ)` : `PDF слишком большой (макс ${maxMB}МБ)`);
      return;
    }
    setPdfName(file.name);
    setError('');
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result.split(',')[1];
      setPdfBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const generate = async () => {
    if (!description.trim() && !pdfBase64) { setError(tw('noDescription', lang)); return; }
    setError('');
    setStatus('generating');
    try {
      const r = await fetch('/api/personal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ description, grade, lang, ...(pdfBase64 ? { pdfBase64 } : {}) }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Error');
      setPlan(data.plan);
      setStatus('plan');
    } catch (e) {
      setError(e.message || 'Ошибка');
      setStatus('empty');
    }
  };

  const resetPlan = async () => {
    setResetting(true);
    await fetch('/api/personal-plan', { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    setPlan(null);
    setDescription('');
    setPdfBase64(null);
    setPdfName('');
    setError('');
    setResetting(false);
    setStatus('empty');
  };

  // Sort subjects by priority
  const sortedSubjects = plan
    ? Object.entries(plan.subjects || {}).sort((a, b) => (a[1].priority || 99) - (b[1].priority || 99))
    : [];

  const formatDate = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleDateString(lang === 'lv' ? 'lv-LV' : lang === 'uk' ? 'uk-UA' : 'ru-RU', { day: 'numeric', month: 'long' });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', paddingBottom: '50px' }}>

      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '14px 20px' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '10px', padding: '8px 14px',
              color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: '0.82rem',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            {tw('back', lang)}
          </button>
          <div>
            <p style={{ color: 'white', fontWeight: 900, fontSize: '1rem', margin: 0 }}>{tw('title', lang)}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', margin: 0 }}>{tw('subtitle', lang)}</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '24px 20px' }}>

        {/* LOADING */}
        {status === 'loading' && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1',
              animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* GENERATING */}
        {status === 'generating' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '60px 0' }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🧠</div>
            <p style={{ color: 'white', fontWeight: 900, fontSize: '1.1rem', margin: '0 0 8px' }}>
              {tw('generating', lang)}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: 0 }}>
              {tw('generatingHint', lang)}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '24px' }}>
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.25 }}
                  style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1' }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* EMPTY — input form */}
        {status === 'empty' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Intro card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))',
              border: '1.5px solid rgba(99,102,241,0.35)',
              borderRadius: '18px', padding: '18px',
              display: 'flex', alignItems: 'flex-start', gap: '14px',
            }}>
              <span style={{ fontSize: '2.2rem', flexShrink: 0 }}>🎓</span>
              <div>
                <p style={{ color: 'white', fontWeight: 900, fontSize: '0.95rem', margin: '0 0 6px' }}>
                  {tw('inputTitle', lang)}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.75rem', margin: 0, lineHeight: 1.5 }}>
                  {tw('inputHint', lang)}
                </p>
              </div>
            </div>

            {/* Textarea */}
            <div>
              <textarea
                value={description}
                onChange={e => { setDescription(e.target.value); setError(''); }}
                placeholder={tw('placeholder', lang)}
                rows={7}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.06)',
                  border: error ? '1.5px solid rgba(239,68,68,0.6)' : '1.5px solid rgba(255,255,255,0.15)',
                  borderRadius: '14px', padding: '14px 16px',
                  color: 'white', fontSize: '0.85rem', lineHeight: 1.6,
                  resize: 'vertical', outline: 'none',
                  fontFamily: 'inherit',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; }}
                onBlur={e => { e.target.style.borderColor = error ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.15)'; }}
              />
              {error && (
                <p style={{ color: '#f87171', fontSize: '0.75rem', margin: '6px 0 0 4px' }}>{error}</p>
              )}
            </div>

            {/* PDF upload */}
            <div>
              <label style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: pdfBase64 ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.05)',
                border: pdfBase64 ? '1.5px solid rgba(52,211,153,0.4)' : '1.5px dashed rgba(255,255,255,0.2)',
                borderRadius: '12px', padding: '12px 14px',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
                <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{pdfBase64 ? '📄' : '📎'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: pdfBase64 ? '#6ee7b7' : 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '0.8rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {pdfBase64 ? pdfName : tw('pdfLabel', lang)}
                  </p>
                  {!pdfBase64 && (
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem', margin: '2px 0 0' }}>
                      {tw('pdfHint', lang)}
                    </p>
                  )}
                </div>
                {pdfBase64 ? (
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); setPdfBase64(null); setPdfName(''); }}
                    style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '6px', padding: '2px 8px', color: '#f87171', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    {tw('pdfRemove', lang)}
                  </button>
                ) : null}
                <input type="file" accept="application/pdf" onChange={handlePdf} style={{ display: 'none' }} />
              </label>
            </div>

            {/* Generate button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={generate}
              disabled={!description.trim() && !pdfBase64}
              style={{
                width: '100%',
                background: (description.trim() || pdfBase64)
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : 'rgba(255,255,255,0.08)',
                border: 'none', borderRadius: '14px', padding: '16px',
                color: (description.trim() || pdfBase64) ? 'white' : 'rgba(255,255,255,0.3)',
                fontWeight: 900, fontSize: '1rem',
                cursor: (description.trim() || pdfBase64) ? 'pointer' : 'not-allowed',
                boxShadow: (description.trim() || pdfBase64) ? '0 8px 24px rgba(99,102,241,0.35)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {tw('generate', lang)}
            </motion.button>
          </motion.div>
        )}

        {/* PLAN — full results display */}
        {status === 'plan' && plan && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Created date */}
            {plan.createdAt && (
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', textAlign: 'center', margin: 0 }}>
                {tw('createdAt', lang)}: {formatDate(plan.createdAt)}
              </p>
            )}

            {/* Summary */}
            <div style={{
              background: 'rgba(99,102,241,0.15)', border: '1.5px solid rgba(99,102,241,0.3)',
              borderRadius: '16px', padding: '16px',
            }}>
              <p style={{ color: '#a5b4fc', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
                {tw('summary', lang)}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                {plan.summary}
              </p>
            </div>

            {/* Subject bars */}
            {sortedSubjects.length > 0 && (
              <div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 800, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
                  {tw('subjects', lang)}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {sortedSubjects.map(([id, data], i) => (
                    <SubjectBar key={id} id={id} data={data} lang={lang} index={i} onGo={() => navigate(`/topics/${id}`)} />
                  ))}
                </div>
              </div>
            )}

            {/* Schedule */}
            {plan.schedule?.length > 0 && (
              <div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 800, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
                  {tw('schedule', lang)}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {plan.schedule.map((item, i) => (
                    <ScheduleBlock key={i} item={item} index={i} lang={lang} />
                  ))}
                </div>
              </div>
            )}

            {/* Strengths & Improvements */}
            {(plan.strengths?.length > 0 || plan.improvements?.length > 0) && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {plan.strengths?.length > 0 && (
                  <div style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '14px', padding: '12px' }}>
                    <p style={{ color: '#4ade80', fontWeight: 900, fontSize: '0.75rem', margin: '0 0 8px' }}>
                      {tw('strengths', lang)}
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '14px' }}>
                      {plan.strengths.map((s, i) => (
                        <li key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', lineHeight: 1.5, marginBottom: '4px' }}>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {plan.improvements?.length > 0 && (
                  <div style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '14px', padding: '12px' }}>
                    <p style={{ color: '#fbbf24', fontWeight: 900, fontSize: '0.75rem', margin: '0 0 8px' }}>
                      {tw('improvements', lang)}
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '14px' }}>
                      {plan.improvements.map((s, i) => (
                        <li key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', lineHeight: 1.5, marginBottom: '4px' }}>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Motivation */}
            {plan.motivation && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(99,102,241,0.2))',
                border: '1.5px solid rgba(168,85,247,0.35)',
                borderRadius: '16px', padding: '16px', textAlign: 'center',
              }}>
                <p style={{ color: '#c4b5fd', fontWeight: 800, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
                  {tw('motivation', lang)}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>
                  "{plan.motivation}"
                </p>
              </div>
            )}

            {/* Reset button */}
            <button
              onClick={resetPlan}
              disabled={resetting}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px', padding: '13px',
                color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              🔄 {tw('reset', lang)}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
