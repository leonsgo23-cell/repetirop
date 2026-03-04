import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const SECTIONS_RU = [
  {
    icon: '🎮',
    title: 'Как проходит урок?',
    color: 'from-indigo-500 to-purple-600',
    items: [
      'Орис сам начинает урок — приветствует и сразу даёт первое задание',
      'Ты отвечаешь в чате — пишешь ответ и нажимаешь Enter или кнопку ➤',
      'Орис проверяет ответ: правильный — получаешь ⭐ XP, неправильный — помогает разобраться',
      'Всего 5–7 заданий нарастающей сложности: от лёгкого до «Босс-уровня»',
      'В конце темы Орис пишет 🏆 УРОВЕНЬ ПОВЫШЕН! — тема считается пройденной',
    ],
  },
  {
    icon: '⏱️',
    title: 'Сколько длится занятие?',
    color: 'from-blue-500 to-cyan-600',
    items: [
      '15–20 минут на одну тему — идеально для концентрации ребёнка',
      'Можно выйти в любой момент — прогресс XP сохраняется автоматически',
      'Если устал — просто закрой вкладку и вернись позже',
      'Нет таймера и давления — занимайся в своём темпе',
    ],
  },
  {
    icon: '📅',
    title: 'Как часто заниматься?',
    color: 'from-green-500 to-teal-600',
    items: [
      'Рекомендуем: 3–5 раз в неделю по 15–20 минут',
      'Ежедневные занятия дают стрик 🔥 и бонусные достижения',
      'Лучше короткие регулярные занятия, чем редкие длинные',
      '1 класс: 1–2 темы в неделю | 5–9 класс: 2–3 темы в неделю',
      'В период контрольных работ — повторяй пройденные темы для закрепления',
    ],
  },
  {
    icon: '🔀',
    title: 'Как переходить от урока к уроку?',
    color: 'from-orange-500 to-amber-600',
    items: [
      '1. Нажми «← К темам» в верхнем левом углу урока',
      '2. Выбери следующую тему из списка — темы идут по порядку сложности',
      '3. Пройденные темы отмечены галочкой ✓',
      '4. Нет ограничений — можно переходить к любой теме в любой момент',
      '5. Хочешь повторить пройденное? Просто зайди в тему снова',
    ],
  },
  {
    icon: '📚',
    title: 'С чего начать?',
    color: 'from-pink-500 to-rose-600',
    items: [
      'Математика: отлично для логики и счёта — начни с тем своего класса',
      'Английский: словарный запас, грамматика — Орис адаптирует уровень под твой класс',
      'Занимайся сначала тем предметом, который даётся сложнее — свежий мозг лучше усваивает',
      'Чередуй математику и английский — так не надоедает',
    ],
  },
  {
    icon: '👪',
    title: 'Для родителей',
    color: 'from-violet-500 to-purple-600',
    items: [
      'Орис — не замена учителю, а дополнительная практика дома',
      'Следите за разделом «Достижения» на главном экране — это покажет прогресс',
      'XP и уровни мотивируют ребёнка заниматься самостоятельно',
      'Программа строго соответствует стандартам МОН Латвии (Skola2030)',
      'Если ребёнок застрял — он может написать «не понимаю» и Орис объяснит иначе',
      'Оптимальный возраст для самостоятельного использования: 8–15 лет',
    ],
  },
];

const SECTIONS_LV = [
  {
    icon: '🎮',
    title: 'Kā notiek nodarbība?',
    color: 'from-indigo-500 to-purple-600',
    items: [
      'Oris pats sāk nodarbību — sveic un uzreiz dod pirmo uzdevumu',
      'Tu atbildi čatā — raksti atbildi un nospied Enter vai pogu ➤',
      'Oris pārbauda atbildi: pareiza — saņem ⭐ XP, nepareiza — palīdz saprast',
      'Kopā 5–7 uzdevumi ar pieaugošu sarežģītību: no viegliem līdz "Bosa līmenim"',
      'Tēmas beigās Oris raksta 🏆 LĪMENIS PAAUGSTINĀTS! — tēma ir apgūta',
    ],
  },
  {
    icon: '⏱️',
    title: 'Cik ilga ir nodarbība?',
    color: 'from-blue-500 to-cyan-600',
    items: [
      '15–20 minūtes vienai tēmai — ideāli bērna koncentrācijai',
      'Var iziet jebkurā brīdī — XP progress tiek saglabāts automātiski',
      'Ja noguri — vienkārši aizver cilni un atgriezies vēlāk',
      'Nav taimera un spiediena — mācies savā tempā',
    ],
  },
  {
    icon: '📅',
    title: 'Cik bieži mācīties?',
    color: 'from-green-500 to-teal-600',
    items: [
      'Ieteicams: 3–5 reizes nedēļā pa 15–20 minūtēm',
      'Ikdienas nodarbības dod sēriju 🔥 un bonusa sasniegumus',
      'Labāk īsas regulāras nodarbības nekā retas garas',
      '1. klase: 1–2 tēmas nedēļā | 5.–9. klase: 2–3 tēmas nedēļā',
    ],
  },
  {
    icon: '🔀',
    title: 'Kā pāriet no nodarbības uz nodarbību?',
    color: 'from-orange-500 to-amber-600',
    items: [
      '1. Nospied "← Uz tēmām" augšējā kreisajā stūrī',
      '2. Izvēlies nākamo tēmu no saraksta — tēmas ir sarindotas pēc sarežģītības',
      '3. Apgūtās tēmas atzīmētas ar ✓',
      '4. Nav ierobežojumu — var pāriet uz jebkuru tēmu jebkurā laikā',
    ],
  },
  {
    icon: '📚',
    title: 'Ar ko sākt?',
    color: 'from-pink-500 to-rose-600',
    items: [
      'Matemātika: lieliska loģikai un skaitīšanai — sāc ar savas klases tēmām',
      'Angļu valoda: vārdu krājums, gramatika — Oris pielāgo līmeni tavai klasei',
      'Sāc ar to priekšmetu, kas sagādā vairāk grūtību',
      'Mainiet matemātiku un angļu valodu — tā neapnīk',
    ],
  },
  {
    icon: '👪',
    title: 'Vecākiem',
    color: 'from-violet-500 to-purple-600',
    items: [
      'Oris nav skolotāja aizstājējs, bet papildu prakse mājās',
      'Sekojiet sadaļai "Sasniegumi" galvenajā ekrānā — tas parādīs progresu',
      'XP un līmeņi motivē bērnu mācīties patstāvīgi',
      'Programma stingri atbilst IZM Latvijas standartiem (Skola2030)',
      'Optimālais vecums patstāvīgai lietošanai: 8–15 gadi',
    ],
  },
];

export default function Guide() {
  const navigate = useNavigate();
  const { state, markGuideSeen } = useApp();
  const lang = state.language || 'ru';
  const sections = lang === 'ru' ? SECTIONS_RU : SECTIONS_LV;

  const handleStart = () => {
    markGuideSeen();
    navigate('/dashboard');
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'linear-gradient(135deg, #0f0c29, #1a1640, #24243e)',
        paddingBottom: '40px',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          padding: '20px 20px 24px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '2.5rem', margin: 0 }}>🦉</p>
        <h1
          style={{
            color: 'white',
            fontWeight: 900,
            fontSize: '1.4rem',
            margin: '8px 0 4px',
          }}
        >
          {lang === 'ru' ? 'Как работает Орис?' : 'Kā darbojas Oris?'}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', margin: 0 }}>
          {lang === 'ru'
            ? 'Прочитай — и сразу всё станет понятно!'
            : 'Izlasi — un viss kļūs skaidrs!'}
        </p>
      </div>

      {/* Sections */}
      <div
        style={{
          maxWidth: '560px',
          margin: '0 auto',
          padding: '20px 16px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {sections.map((sec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            {/* Section header */}
            <div
              style={{
                background: `linear-gradient(135deg, var(--from), var(--to))`,
                backgroundImage: `linear-gradient(135deg, ${sec.color.replace('from-', '').replace(/ to-/, ', ')})`,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>{sec.icon}</span>
              <h2
                style={{
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '1rem',
                  margin: 0,
                }}
              >
                {sec.title}
              </h2>
            </div>

            {/* Section items */}
            <ul style={{ margin: 0, padding: '12px 16px 14px 16px', listStyle: 'none' }}>
              {sec.items.map((item, j) => (
                <li
                  key={j}
                  style={{
                    color: 'rgba(255,255,255,0.82)',
                    fontSize: '0.875rem',
                    lineHeight: '1.55',
                    padding: '5px 0',
                    borderBottom:
                      j < sec.items.length - 1
                        ? '1px solid rgba(255,255,255,0.06)'
                        : 'none',
                    display: 'flex',
                    gap: '8px',
                  }}
                >
                  <span style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}

        {/* CTA button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleStart}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none',
            borderRadius: '16px',
            padding: '16px',
            color: 'white',
            fontWeight: 900,
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(99,102,241,0.45)',
            marginTop: '8px',
          }}
        >
          {lang === 'ru' ? '🚀 Понятно, начинаем!' : '🚀 Skaidrs, sākam!'}
        </motion.button>
      </div>
    </div>
  );
}
