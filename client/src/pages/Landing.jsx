import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const stars = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() > 0.7 ? 'text-base' : 'text-xs',
  delay: `${(Math.random() * 4).toFixed(1)}s`,
  dur: `${(2 + Math.random() * 3).toFixed(1)}s`,
}));

const PLANS = [
  {
    id: '1mo',
    label: { ru: '1 месяц', lv: '1 mēnesis' },
    price: '€9.90',
    per: { ru: '/мес', lv: '/mēn' },
    badge: null,
  },
  {
    id: '6mo',
    label: { ru: '6 месяцев', lv: '6 mēneši' },
    price: '€49.90',
    per: { ru: '/полгода', lv: '/pusgads' },
    sub: { ru: '≈ €8.32/мес', lv: '≈ €8.32/mēn' },
    badge: { ru: 'Популярный', lv: 'Populārs' },
    highlight: true,
  },
  {
    id: '12mo',
    label: { ru: '1 год', lv: '1 gads' },
    price: '€89.90',
    per: { ru: '/год', lv: '/gadā' },
    sub: { ru: '≈ €7.49/мес', lv: '≈ €7.49/mēn' },
    badge: { ru: 'Лучшая цена', lv: 'Labākā cena' },
  },
];

const FEATURES = [
  {
    icon: '📚',
    title: { ru: '3 предмета в одной подписке', lv: '3 priekšmeti vienā abonementā' },
    desc: {
      ru: 'Математика, английский и латышский — всё включено для вашего класса. Не нужно платить за каждый предмет отдельно.',
      lv: 'Matemātika, angļu un latviešu valoda — viss iekļauts jūsu klasei. Nav jāmaksā par katru priekšmetu atsevišķi.',
    },
  },
  {
    icon: '🏛️',
    title: { ru: 'По программе МО Латвии', lv: 'Pēc IZM programmas' },
    desc: {
      ru: 'Все темы строго по официальной программе Министерства образования Латвии (Skola2030). Учишься именно по тому, что нужно в школе.',
      lv: 'Visas tēmas stingri pēc Latvijas IZM oficiālās programmas (Skola2030). Mācies tieši to, kas vajadzīgs skolā.',
    },
  },
  {
    icon: '⭐',
    title: { ru: 'Учёба как игра', lv: 'Mācības kā spēle' },
    desc: {
      ru: 'Зарабатывай XP-баллы за правильные ответы, открывай новые уровни и получай достижения. Дети учатся охотнее, когда это интересно.',
      lv: 'Pelni XP punktus par pareizām atbildēm, atver jaunus līmeņus un saņem sasniegumus. Bērni mācās labprātāk, kad tas ir interesanti.',
    },
  },
  {
    icon: '🕐',
    title: { ru: 'Доступен 24/7', lv: 'Pieejams 24/7' },
    desc: {
      ru: 'В любое время — перед контрольной в 23:00, после школы или в выходной. Никакого расписания, никакого ожидания.',
      lv: 'Jebkurā laikā — pirms kontroldarba 23:00, pēc skolas vai brīvdienā. Nav grafika, nav gaidīšanas.',
    },
  },
  {
    icon: '🎯',
    title: { ru: 'Ты выбираешь темп', lv: 'Tu izvēlies tempu' },
    desc: {
      ru: 'Проходи темы по порядку или выбери только нужную — подтянуть слабое место перед экзаменом. Полная гибкость.',
      lv: 'Iziet tēmas pēc kārtas vai izvēlies tikai vajadzīgo — nostiprināt vājo vietu pirms eksāmena. Pilna elastība.',
    },
  },
  {
    icon: '📝',
    title: { ru: 'Помощь с домашними заданиями', lv: 'Palīdzība ar mājas darbiem' },
    desc: {
      ru: 'Загрузи фото задания — Зефир разберёт ход решения и объяснит, как прийти к ответу. Не просто даст ответ, а научит.',
      lv: 'Ielādē uzdevuma foto — Zefīrs izskaidros risinājuma gaitu un parādīs, kā tikt pie atbildes. Ne tikai dos atbildi, bet iemācīs.',
    },
  },
];

const STEPS = [
  {
    num: '1',
    icon: '📋',
    title: { ru: 'Зарегистрируйся', lv: 'Reģistrējies' },
    desc: { ru: '24 часа полного доступа — бесплатно, без банковской карты', lv: '24 stundas pilna piekļuve — bez maksas, bez bankas kartes' },
  },
  {
    num: '2',
    icon: '🎓',
    title: { ru: 'Выбери свой класс', lv: 'Izvēlies savu klasi' },
    desc: { ru: 'Программа автоматически подстроится под твой уровень и предметы', lv: 'Programma automātiski pielāgosies tavam līmenim un priekšmetiem' },
  },
  {
    num: '3',
    icon: '📖',
    title: { ru: 'Выбери тему', lv: 'Izvēlies tēmu' },
    desc: { ru: 'По порядку или ту, что нужна прямо сейчас — решаешь ты', lv: 'Pēc kārtas vai to, kas vajadzīga tieši tagad — izlemj tu' },
  },
  {
    num: '4',
    icon: '🚀',
    title: { ru: 'Учись с Зефиром', lv: 'Mācies ar Zefīru' },
    desc: { ru: 'Диалог, задания, XP — и ты растёшь с каждым уроком', lv: 'Dialogs, uzdevumi, XP — un tu augi ar katru nodarbību' },
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [lang, setLang] = useState('ru');

  const t = (obj) => (typeof obj === 'string' ? obj : obj[lang] || obj.ru);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white overflow-x-hidden">
      {/* Stars */}
      {stars.map((s) => (
        <span
          key={s.id}
          className={`fixed ${s.size} text-white/20 select-none pointer-events-none animate-pulse`}
          style={{ top: s.top, left: s.left, animationDelay: s.delay, animationDuration: s.dur }}
        >✦</span>
      ))}

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <div className="text-xl font-black tracking-tight">🧙‍♂️ Магия Знаний</div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'ru' ? 'lv' : 'ru')}
            className="text-white/50 hover:text-white text-sm font-semibold transition-colors"
          >
            {lang === 'ru' ? '🇱🇻 LV' : '🇷🇺 RU'}
          </button>
          {user ? (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-white/70 hover:text-white text-sm font-medium px-4 py-2 rounded-xl border border-white/20 hover:border-white/40 transition-all"
              >
                {lang === 'ru' ? 'Приложение' : 'Lietotne'}
              </button>
              <button
                onClick={() => { logout(); }}
                className="text-red-400/70 hover:text-red-400 text-sm font-medium px-4 py-2 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-all"
              >
                {lang === 'ru' ? 'Выйти' : 'Iziet'}
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-white/70 hover:text-white text-sm font-medium px-4 py-2 rounded-xl border border-white/20 hover:border-white/40 transition-all"
            >
              {lang === 'ru' ? 'Войти' : 'Ieiet'}
            </button>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 text-center px-6 pt-12 pb-20 max-w-3xl mx-auto">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}>
          <div className="text-7xl mb-5 inline-block">🧙‍♂️</div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
            {lang === 'ru' ? (
              <>Репетитор для вашего ребёнка —<br /><span className="text-indigo-300">всегда рядом, в любое время</span></>
            ) : (
              <>Pasniedzējs jūsu bērnam —<br /><span className="text-indigo-300">vienmēr klāt, jebkurā laikā</span></>
            )}
          </h1>
          <p className="text-white/70 text-base sm:text-lg mb-3 max-w-xl mx-auto leading-relaxed">
            {lang === 'ru'
              ? 'Зефир — персональный репетитор на базе искусственного интеллекта. Математика, английский, латышский — 1–12 класс, по официальной программе Министерства образования Латвии.'
              : 'Zefīrs — personīgais mākslīgā intelekta pasniedzējs. Matemātika, angļu, latviešu — 1.–12. klase, pēc Latvijas IZM oficiālās programmas.'}
          </p>
          <p className="text-white/40 text-sm mb-8">
            {lang === 'ru'
              ? 'В разы дешевле живого репетитора · Доступен 24/7 · Учёба в формате игры'
              : 'Daudz lētāks par dzīvu pasniedzēju · Pieejams 24/7 · Mācības spēles formātā'}
          </p>
          {user ? (
            <div className="flex flex-col items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/dashboard')}
                className="bg-indigo-500 hover:bg-indigo-400 text-white font-black text-lg px-10 py-4 rounded-2xl shadow-2xl shadow-indigo-500/30 transition-colors"
              >
                {lang === 'ru' ? '📚 Перейти в приложение' : '📚 Doties uz lietotni'}
              </motion.button>
              <p className="text-white/30 text-sm">
                {lang === 'ru' ? `Вы вошли как ${user.email}` : `Jūs esat pieteicies kā ${user.email}`}
              </p>
              <button
                onClick={() => logout()}
                className="text-white/30 hover:text-white/60 text-xs underline transition-colors"
              >
                {lang === 'ru' ? 'Выйти и войти в другой аккаунт' : 'Iziet un pieteikties citā kontā'}
              </button>
            </div>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/register')}
                className="bg-indigo-500 hover:bg-indigo-400 text-white font-black text-lg px-10 py-4 rounded-2xl shadow-2xl shadow-indigo-500/30 transition-colors"
              >
                {lang === 'ru' ? '🚀 Попробовать бесплатно' : '🚀 Izmēģināt bez maksas'}
              </motion.button>
              <p className="text-white/30 text-sm mt-4">
                {lang === 'ru' ? '24 часа бесплатно · Без банковской карты' : '24 stundas bez maksas · Bez bankas kartes'}
              </p>
            </>
          )}
        </motion.div>
      </section>

      {/* ── Зефир ── */}
      <section className="relative z-10 px-6 pb-20 max-w-3xl mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 border border-indigo-400/20 rounded-3xl p-8 text-center"
        >
          <div className="text-5xl mb-4">✨</div>
          <h2 className="text-2xl font-black mb-3">
            {lang === 'ru' ? 'Знакомьтесь — Зефир' : 'Iepazīstieties — Zefīrs'}
          </h2>
          <p className="text-white/65 text-base leading-relaxed max-w-xl mx-auto">
            {lang === 'ru'
              ? 'Зефир — ваш персональный репетитор, созданный на базе искусственного интеллекта. Он объясняет сложное простыми словами, задаёт вопросы и ждёт ответа — как настоящий учитель. Зефир адаптируется под каждого: для первоклассника говорит тепло и с юмором, для старшеклассника — чётко и по делу. Обучение идёт в формате живого диалога — вопрос, ответ, следующий шаг.'
              : 'Zefīrs — jūsu personīgais pasniedzējs, veidots uz mākslīgā intelekta bāzes. Viņš skaidro sarežģītu vienkāršiem vārdiem, uzdod jautājumus un gaida atbildi — kā īsts skolotājs. Zefīrs pielāgojas katram: pirmklasniekam runā silti un ar humoru, vidusskolēnam — skaidri un konkrēti. Mācības norisinās dzīva dialoga formātā — jautājums, atbilde, nākamais solis.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-2 justify-center">
            {(lang === 'ru'
              ? ['💬 Диалог, не лекция', '🎓 1–12 класс', '🌍 Русский и латышский', '🧠 Адаптируется под уровень', '📐 По школьной программе']
              : ['💬 Dialogs, ne lekcija', '🎓 1.–12. klase', '🌍 Krieviski un latviski', '🧠 Pielāgojas līmenim', '📐 Pēc skolas programmas']
            ).map((tag) => (
              <span key={tag} className="bg-indigo-500/15 border border-indigo-400/20 text-indigo-200 text-xs font-semibold px-3 py-1.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 px-6 pb-20 max-w-5xl mx-auto">
        <h2 className="text-center text-2xl font-black mb-2 text-white/80">
          {lang === 'ru' ? 'Почему Магия Знаний?' : 'Kāpēc Zināšanu Maģija?'}
        </h2>
        <p className="text-center text-white/40 text-sm mb-10">
          {lang === 'ru' ? 'Всё, что нужно для учёбы — в одном месте' : 'Viss mācībām vajadzīgais — vienā vietā'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <motion.div
              key={f.icon}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-black text-base mb-2">{t(f.title)}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{t(f.desc)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Как это работает ── */}
      <section className="relative z-10 px-6 pb-20 max-w-3xl mx-auto">
        <h2 className="text-center text-2xl font-black mb-10 text-white/80">
          {lang === 'ru' ? 'Как это работает' : 'Kā tas darbojas'}
        </h2>
        <div className="flex flex-col gap-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/30 flex items-center justify-center font-black text-indigo-300 text-lg flex-shrink-0">
                {step.num}
              </div>
              <div>
                <p className="font-black text-base mb-0.5">{step.icon} {t(step.title)}</p>
                <p className="text-white/45 text-sm">{t(step.desc)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Сравнение ── */}
      <section className="relative z-10 px-6 pb-20 max-w-3xl mx-auto">
        <h2 className="text-center text-2xl font-black mb-10 text-white/80">
          {lang === 'ru' ? 'Сравни с живым репетитором' : 'Salīdzini ar dzīvu pasniedzēju'}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="font-black text-white/50 text-sm mb-4">
              {lang === 'ru' ? '👤 Живой репетитор' : '👤 Dzīvs pasniedzējs'}
            </p>
            {(lang === 'ru'
              ? ['€20–40 за один урок', 'Только по расписанию', 'Один предмет', 'Ждёшь свободного времени', 'Нет игровой мотивации']
              : ['€20–40 par vienu stundu', 'Tikai pēc grafika', 'Viens priekšmets', 'Gaidi brīvu laiku', 'Nav spēļu motivācijas']
            ).map((item) => (
              <p key={item} className="text-white/40 text-sm mb-2 flex items-start gap-2">
                <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>{item}
              </p>
            ))}
          </div>
          <div className="bg-indigo-600/15 border border-indigo-400/30 rounded-2xl p-5">
            <p className="font-black text-indigo-300 text-sm mb-4">
              🧙‍♂️ {lang === 'ru' ? 'Зефир' : 'Zefīrs'}
            </p>
            {(lang === 'ru'
              ? ['от €7.49 в месяц', 'В любое время 24/7', '3 предмета в подписке', 'Старт мгновенно', 'XP, уровни, достижения']
              : ['no €7.49 mēnesī', 'Jebkurā laikā 24/7', '3 priekšmeti abonementā', 'Tūlītējs starts', 'XP, līmeņi, sasniegumi']
            ).map((item) => (
              <p key={item} className="text-white/80 text-sm mb-2 flex items-start gap-2">
                <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>{item}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="relative z-10 px-6 pb-32 max-w-5xl mx-auto">
        <h2 className="text-center text-2xl font-black mb-2 text-white/80">
          {lang === 'ru' ? 'Тарифы' : 'Tarifi'}
        </h2>
        <p className="text-center text-white/60 text-sm mb-1">
          {lang === 'ru'
            ? 'Подписка оформляется на один класс — вы получаете сразу 3 предмета'
            : 'Abonements tiek noformēts vienai klasei — jūs saņemat uzreiz 3 priekšmetus'}
        </p>
        <p className="text-center text-indigo-300/60 text-xs font-semibold mb-10">
          {lang === 'ru'
            ? '📐 Математика · 🇬🇧 Английский язык · 🇱🇻 Латышский язык'
            : '📐 Matemātika · 🇬🇧 Angļu valoda · 🇱🇻 Latviešu valoda'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          {PLANS.map((p) => (
            <motion.div
              key={p.id}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`relative rounded-2xl p-7 border flex flex-col ${
                p.highlight
                  ? 'bg-indigo-600/30 border-indigo-400/60 shadow-2xl shadow-indigo-500/20'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              {p.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-black px-3 py-1 rounded-full">
                  {t(p.badge)}
                </span>
              )}
              <div className="text-lg font-black mb-1">{t(p.label)}</div>
              <div className="text-4xl font-black mb-1">{p.price}</div>
              <div className="text-white/50 text-sm mb-1">{t(p.per)}</div>
              {p.sub && <div className="text-indigo-300 text-xs mb-4">{t(p.sub)}</div>}
              <ul className="text-white/40 text-xs mt-2 mb-4 flex flex-col gap-1">
                <li>✓ {lang === 'ru' ? '3 предмета' : '3 priekšmeti'}</li>
                <li>✓ {lang === 'ru' ? 'Все темы 1–12 класс' : 'Visas tēmas 1.–12. klase'}</li>
                <li>✓ {lang === 'ru' ? 'Помощь с ДЗ' : 'Mājas darbu palīdzība'}</li>
                <li>✓ {lang === 'ru' ? 'Доступ 24/7' : 'Piekļuve 24/7'}</li>
              </ul>
              <div className="mt-auto">
                <button
                  onClick={() => navigate('/register')}
                  className={`w-full py-3 rounded-xl font-black text-sm transition-all ${
                    p.highlight
                      ? 'bg-indigo-500 hover:bg-indigo-400 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {lang === 'ru' ? 'Начать' : 'Sākt'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
          <p className="text-white/60 text-sm">
            🎁 {lang === 'ru'
              ? 'Первые 24 часа — полностью бесплатно. Зарегистрируйтесь и начните прямо сейчас без карты.'
              : 'Pirmās 24 stundas — pilnīgi bez maksas. Reģistrējieties un sāciet tūlīt bez kartes.'}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-8 text-white/20 text-xs px-4">
        {lang === 'ru'
          ? 'Создан с помощью искусственного интеллекта · Разработан для Латвии · © 2025 Магия Знаний'
          : 'Veidots ar mākslīgā intelekta palīdzību · Izstrādāts Latvijai · © 2025 Zināšanu Maģija'}
      </footer>
    </div>
  );
}
