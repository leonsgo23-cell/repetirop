import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

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
      ru: 'Все темы строго по официальной программе Министерства образования Латвии (Skola2030). Ребёнок учится именно по тому, что нужно в его школе.',
      lv: 'Visas tēmas stingri pēc Latvijas IZM oficiālās programmas (Skola2030). Bērns mācās tieši to, kas vajadzīgs viņa skolā.',
    },
  },
  {
    icon: '⭐',
    title: { ru: 'Учёба как игра', lv: 'Mācības kā spēle' },
    desc: {
      ru: 'XP-баллы, уровни и достижения делают учёбу интересной. Дети занимаются добровольно — не потому что надо, а потому что хочется.',
      lv: 'XP punkti, līmeņi un sasniegumi padara mācības interesantas. Bērni mācās brīvprātīgi — ne tāpēc, ka vajag, bet tāpēc, ka grib.',
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
    title: { ru: 'Гибкость в выборе тем', lv: 'Elastība tēmu izvēlē' },
    desc: {
      ru: 'Можно проходить темы по порядку или выбрать только нужную — подтянуть слабое место перед контрольной. Вы решаете.',
      lv: 'Var iziet tēmas pēc kārtas vai izvēlēties tikai vajadzīgo — nostiprināt vājo vietu pirms kontroldarba. Jūs izlemjat.',
    },
  },
  {
    icon: '📝',
    title: { ru: 'Помощь с домашними заданиями', lv: 'Palīdzība ar mājas darbiem' },
    desc: {
      ru: 'Загрузите фото задания — Зефир разберёт ход решения и объяснит шаг за шагом. Не просто даст ответ, а научит думать.',
      lv: 'Ielādējiet uzdevuma foto — Zefīrs izskaidros risinājuma gaitu soli pa solim. Ne tikai dos atbildi, bet iemācīs domāt.',
    },
  },
];

const STEPS = [
  {
    num: '1',
    icon: '📋',
    title: { ru: 'Зарегистрируйтесь', lv: 'Reģistrējieties' },
    desc: { ru: '24 часа полного доступа бесплатно — оцените всё перед оплатой', lv: '24 stundas pilna piekļuve bez maksas — novērtējiet visu pirms maksāšanas' },
  },
  {
    num: '2',
    icon: '🎓',
    title: { ru: 'Выберите класс ребёнка', lv: 'Izvēlieties bērna klasi' },
    desc: { ru: 'Программа автоматически подстроится под уровень и предметы', lv: 'Programma automātiski pielāgosies līmenim un priekšmetiem' },
  },
  {
    num: '3',
    icon: '📖',
    title: { ru: 'Выберите тему', lv: 'Izvēlieties tēmu' },
    desc: { ru: 'По порядку или ту, что нужна прямо сейчас — решаете вы', lv: 'Pēc kārtas vai to, kas vajadzīga tieši tagad — izlemjat jūs' },
  },
  {
    num: '4',
    icon: '🚀',
    title: { ru: 'Зефир начинает урок', lv: 'Zefīrs sāk nodarbību' },
    desc: { ru: 'Диалог, вопросы, объяснения и XP — ребёнок растёт с каждым занятием', lv: 'Dialogs, jautājumi, skaidrojumi un XP — bērns aug ar katru nodarbību' },
  },
];

const FAQ = [
  {
    q: { ru: 'Что будет после 24 часов бесплатного доступа?', lv: 'Kas notiek pēc 24 stundu bezmaksas piekļuves?' },
    a: { ru: 'Доступ просто закроется. Никаких автоматических списаний — карту мы даже не просим при регистрации. Чтобы продолжить, нужно будет выбрать тариф вручную.', lv: 'Piekļuve vienkārši tiks slēgta. Nekādu automātisku maksājumu — kartes mēs pat neprasām reģistrācijā. Lai turpinātu, būs manuāli jāizvēlas tarifs.' },
  },
  {
    q: { ru: 'Заменит ли Зефир живого репетитора полностью?', lv: 'Vai Zefīrs pilnībā aizstās dzīvu pasniedzēju?' },
    a: { ru: 'Для большинства задач — да. Объяснение темы, отработка упражнений, подготовка к контрольной, домашние задания — Зефир справляется отлично. Для сложных индивидуальных случаев (например, дислексия) живой специалист всё ещё полезен.', lv: 'Lielākajai daļai uzdevumu — jā. Tēmas skaidrojums, vingrinājumu izstrāde, gatavošanās kontroldarbam, mājas darbi — Zefīrs tiek galā labi. Sarežģītiem individuāliem gadījumiem (piem., disleksija) dzīvs speciālists joprojām ir noderīgs.' },
  },
  {
    q: { ru: 'Безопасно ли это для ребёнка?', lv: 'Vai tas ir droši bērnam?' },
    a: { ru: 'Да. Зефир запрограммирован использовать только нейтральный академический язык, без нежелательного контента. Все ответы проходят через безопасный фильтр. Ребёнок видит только учебные задания и пояснения.', lv: 'Jā. Zefīrs ir ieprogrammēts lietot tikai neitrālu akadēmisku valodu, bez nevēlama satura. Visas atbildes iet caur drošu filtru. Bērns redz tikai mācību uzdevumus un paskaidrojumus.' },
  },
  {
    q: { ru: 'Подписка продлевается автоматически?', lv: 'Vai abonements tiek automātiski pagarināts?' },
    a: { ru: 'Да, подписка продлевается автоматически — это удобно: ребёнок не теряет доступ в разгар учёбы. Но вы можете отменить её в любое удобное время через раздел «Аккаунт» — без звонков и ожиданий.', lv: 'Jā, abonements tiek automātiski pagarināts — tas ir ērti: bērns nezaudē piekļuvi mācību vidū. Taču jūs varat to atcelt jebkurā ērtā laikā sadaļā «Konts» — bez zvaniem un gaidīšanas.' },
  },
  {
    q: { ru: 'Мой ребёнок в 8-м классе, а программа для всех с 1 по 12?', lv: 'Mans bērns ir 8. klasē, bet programma ir visiem no 1. līdz 12.?' },
    a: { ru: 'Именно так. Вы выбираете один конкретный класс при подписке, и Зефир полностью адаптируется под этот уровень. Темы, сложность, стиль общения — всё соответствует возрасту.', lv: 'Tieši tā. Jūs izvēlaties vienu konkrētu klasi abonējot, un Zefīrs pilnībā pielāgojas šim līmenim. Tēmas, sarežģītība, saziņas stils — viss atbilst vecumam.' },
  },
  {
    q: { ru: 'Сколько тем доступно?', lv: 'Cik tēmu ir pieejams?' },
    a: { ru: 'Сотни тем по трём предметам — математика, английский, латышский. Полное покрытие школьной программы для каждого класса с 1 по 12.', lv: 'Simtiem tēmu trijos priekšmetos — matemātika, angļu, latviešu. Pilns skolas programmas aptvērums katrai klasei no 1. līdz 12.' },
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { state, updateState } = useApp();
  const [lang, setLang] = useState(state.language || 'lv');
  const [openFaq, setOpenFaq] = useState(null);
  const [showOtherLangs, setShowOtherLangs] = useState(false);

  const changeLang = (newLang) => {
    setLang(newLang);
    updateState({ language: newLang });
    setShowOtherLangs(false);
  };

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
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <div className="text-xl font-black tracking-tight">🧙‍♂️ {lang === 'ru' ? 'Магия Знаний' : 'Zināšanu Maģija'}</div>
        <div className="flex items-center gap-3">
          {/* Language selector */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
            <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.04em' }}>
              {lang === 'lv' ? 'Valoda / Язык репетитора' : 'Язык репетитора / Valoda'}
            </span>
            <div style={{ display: 'flex', gap: '5px', position: 'relative' }}>
              <button
                onClick={() => changeLang('lv')}
                style={{
                  background: lang === 'lv' ? 'rgba(99,102,241,0.45)' : 'rgba(255,255,255,0.07)',
                  border: `1px solid ${lang === 'lv' ? 'rgba(129,140,248,0.5)' : 'rgba(255,255,255,0.12)'}`,
                  borderRadius: '8px', padding: '4px 10px',
                  color: lang === 'lv' ? 'white' : 'rgba(255,255,255,0.4)',
                  fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                🇱🇻 Latviešu
              </button>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowOtherLangs(!showOtherLangs)}
                  style={{
                    background: lang === 'ru' ? 'rgba(99,102,241,0.45)' : 'rgba(255,255,255,0.07)',
                    border: `1px solid ${lang === 'ru' ? 'rgba(129,140,248,0.5)' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: '8px', padding: '4px 10px',
                    color: lang === 'ru' ? 'white' : 'rgba(255,255,255,0.4)',
                    fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {lang === 'ru' ? '🇷🇺 Русский' : 'Citas valodas'} ▾
                </button>
                {showOtherLangs && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 4px)', right: 0,
                    background: '#1e1b4b', border: '1px solid rgba(129,140,248,0.3)',
                    borderRadius: '10px', padding: '4px', zIndex: 200, minWidth: '130px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                  }}>
                    <button
                      onClick={() => changeLang('ru')}
                      style={{
                        width: '100%', background: 'none', border: 'none',
                        color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem',
                        fontWeight: 700, padding: '8px 12px', cursor: 'pointer',
                        textAlign: 'left', borderRadius: '7px',
                      }}
                    >
                      🇷🇺 Русский
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
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
                {lang === 'ru' ? '🚀 Попробовать бесплатно — 24 часа' : '🚀 Izmēģināt bez maksas — 24 stundas'}
              </motion.button>
              <p className="text-white/30 text-sm mt-3">
                {lang === 'ru' ? '24 часа бесплатно · Отмена в любое время' : '24 stundas bez maksas · Atcelšana jebkurā laikā'}
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
          <div className="text-5xl mb-4">🧙‍♂️</div>
          <h2 className="text-2xl font-black mb-3">
            {lang === 'ru' ? 'Знакомьтесь — Зефир' : 'Iepazīstieties — Zefīrs'}
          </h2>
          <p className="text-white/65 text-base leading-relaxed max-w-xl mx-auto">
            {lang === 'ru'
              ? 'Зефир — персональный репетитор вашего ребёнка, созданный на базе искусственного интеллекта. Он объясняет сложное простыми словами, задаёт вопросы и ждёт ответа — как настоящий учитель. Зефир адаптируется под каждого: для первоклассника говорит тепло и с юмором, для старшеклассника — чётко и по делу. Обучение идёт в формате живого диалога — вопрос, ответ, следующий шаг.'
              : 'Zefīrs — jūsu bērna personīgais pasniedzējs, veidots uz mākslīgā intelekta bāzes. Viņš skaidro sarežģītu vienkāršiem vārdiem, uzdod jautājumus un gaida atbildi — kā īsts skolotājs. Zefīrs pielāgojas katram: pirmklasniekam runā silti un ar humoru, vidusskolēnam — skaidri un konkrēti. Mācības norisinās dzīva dialoga formātā — jautājums, atbilde, nākamais solis.'}
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

      {/* ── Subjects block ── */}
      <section className="relative z-10 px-6 pb-20 max-w-5xl mx-auto">
        <h2 className="text-center text-2xl font-black mb-2 text-white/80">
          {lang === 'ru' ? '3 предмета — почему именно они?' : '3 priekšmeti — kāpēc tieši šie?'}
        </h2>
        <p className="text-center text-white/40 text-sm mb-10">
          {lang === 'ru'
            ? 'Выбраны главные предметы, от которых зависит успех в латвийской школе'
            : 'Izvēlēti galvenie priekšmeti, no kuriem atkarīgi panākumi Latvijas skolā'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              icon: '📐',
              color: 'rgba(59,130,246,0.15)',
              border: 'rgba(59,130,246,0.35)',
              accent: '#93c5fd',
              title: { ru: 'Математика', lv: 'Matemātika' },
              why: { ru: 'Обязательна для поступления', lv: 'Obligāta uzņemšanai' },
              desc: {
                ru: 'Математика — фундамент всего точного мышления. Она нужна для поступления в большинство вузов, сдачи ЦЭ и ежедневной логики. Зефир объясняет арифметику, алгебру, геометрию и статистику — по шагам, с примерами и живым диалогом.',
                lv: 'Matemātika ir precīzās domāšanas pamats. Tā nepieciešama uzņemšanai augstskolās, CE kārtošanai un ikdienas loģikai. Zefīrs skaidro aritmētiku, algebru, ģeometriju un statistiku — soli pa solim, ar piemēriem.',
              },
              tags: {
                ru: ['Арифметика', 'Алгебра', 'Геометрия', 'Статистика', 'ЦЭ'],
                lv: ['Aritmētika', 'Algebra', 'Ģeometrija', 'Statistika', 'CE'],
              },
            },
            {
              icon: '🇬🇧',
              color: 'rgba(16,185,129,0.12)',
              border: 'rgba(16,185,129,0.35)',
              accent: '#6ee7b7',
              title: { ru: 'Английский язык', lv: 'Angļu valoda' },
              why: { ru: 'Язык международного общения', lv: 'Starptautiskās saziņas valoda' },
              desc: {
                ru: 'Английский — второй обязательный язык в латвийских школах с 1 класса. Без него невозможно высшее образование, карьера и путешествия. Зефир тренирует грамматику, лексику, чтение и разговорные конструкции — на каждом уровне.',
                lv: 'Angļu valoda ir otrā obligātā valoda Latvijas skolās no 1. klases. Bez tās nav iespējama augstākā izglītība, karjera un ceļošana. Zefīrs trenē gramatiku, leksiku, lasīšanu un sarunvalodas konstrukcijas.',
              },
              tags: {
                ru: ['Грамматика', 'Лексика', 'Чтение', 'Диалог', 'ЦЭ'],
                lv: ['Gramatika', 'Leksika', 'Lasīšana', 'Dialogs', 'CE'],
              },
            },
            {
              icon: '🇱🇻',
              color: 'rgba(239,68,68,0.12)',
              border: 'rgba(239,68,68,0.35)',
              accent: '#fca5a5',
              title: { ru: 'Латышский язык', lv: 'Latviešu valoda' },
              why: { ru: 'Государственный язык Латвии', lv: 'Latvijas valsts valoda' },
              desc: {
                ru: 'Латышский — государственный язык страны. Его знание обязательно для получения гражданства, работы в государственных структурах и сдачи всех ключевых экзаменов. Зефир помогает освоить грамматику, правописание и работу с текстами.',
                lv: 'Latviešu valoda ir valsts valoda. Tās zināšanas ir obligātas pilsonības iegūšanai, darbam valsts struktūrās un visu galveno eksāmenu kārtošanai. Zefīrs palīdz apgūt gramatiku, pareizrakstību un darbu ar tekstiem.',
              },
              tags: {
                ru: ['Грамматика', 'Правописание', 'Тексты', 'Диктант', 'ЦЭ'],
                lv: ['Gramatika', 'Pareizrakstība', 'Teksti', 'Diktāts', 'CE'],
              },
            },
          ].map((subj) => (
            <motion.div
              key={subj.icon}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ background: subj.color, border: `1px solid ${subj.border}`, borderRadius: '20px', padding: '24px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontSize: '2rem' }}>{subj.icon}</span>
                <div>
                  <p style={{ color: 'white', fontWeight: 900, fontSize: '1rem', margin: 0 }}>{t(subj.title)}</p>
                  <p style={{ color: subj.accent, fontSize: '0.72rem', fontWeight: 700, margin: 0 }}>{t(subj.why)}</p>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', lineHeight: 1.6, margin: '12px 0' }}>
                {t(subj.desc)}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
                {subj.tags[lang].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: 'rgba(255,255,255,0.08)', border: `1px solid ${subj.border}`,
                      borderRadius: '6px', padding: '3px 10px',
                      color: subj.accent, fontSize: '0.7rem', fontWeight: 700,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
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
        <h2 className="text-center text-2xl font-black mb-3 text-white/80">
          {lang === 'ru' ? 'Сравни с живым репетитором' : 'Salīdzini ar dzīvu pasniedzēju'}
        </h2>
        <p className="text-center text-white/40 text-sm mb-8">
          {lang === 'ru'
            ? 'Один час с живым репетитором = вся месячная подписка на Зефира'
            : 'Viena stunda ar dzīvu pasniedzēju = visa mēneša abonements Zefīram'}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="font-black text-white/50 text-sm mb-4">
              {lang === 'ru' ? '👤 Живой репетитор' : '👤 Dzīvs pasniedzējs'}
            </p>
            {(lang === 'ru'
              ? ['€20–40 за один урок', 'Только по расписанию', 'Один предмет', 'Ждёте свободного времени', 'Нет игровой мотивации']
              : ['€20–40 par vienu stundu', 'Tikai pēc grafika', 'Viens priekšmets', 'Gaidāt brīvu laiku', 'Nav spēļu motivācijas']
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

      {/* ── Программа обучения ── */}
      <section className="relative z-10 px-6 pb-20 max-w-3xl mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8"
        >
          <div className="text-4xl mb-4 text-center">🏛️</div>
          <h2 className="text-2xl font-black mb-3 text-center">
            {lang === 'ru' ? 'Откуда берётся программа?' : 'No kurienes nāk programma?'}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-6 text-center">
            {lang === 'ru'
              ? 'Все темы и задания строго соответствуют официальной учебной программе Латвии. Ничего не придумано — только то, что нужно знать по школьной программе.'
              : 'Visas tēmas un uzdevumi stingri atbilst Latvijas oficiālajai mācību programmai. Nekas nav izdomāts — tikai tas, kas jāzina pēc skolas programmas.'}
          </p>
          <div className="flex flex-col gap-3">
            {[
              {
                icon: '📋',
                name: { ru: 'Министерство образования и науки Латвии (IZM)', lv: 'Latvijas Izglītības un zinātnes ministrija (IZM)' },
                desc: { ru: 'Государственный орган, утверждающий стандарты образования', lv: 'Valsts iestāde, kas apstiprina izglītības standartus' },
                url: 'https://www.izm.gov.lv',
                label: 'izm.gov.lv',
              },
              {
                icon: '🎓',
                name: { ru: 'Проект реформы Skola2030', lv: 'Skola2030 reformas projekts' },
                desc: { ru: 'Современная программа обучения для всех классов Латвии', lv: 'Mūsdienīga mācību programma visām Latvijas klasēm' },
                url: 'https://www.skola2030.lv',
                label: 'skola2030.lv',
              },
              {
                icon: '📚',
                name: { ru: 'VISC — Национальный центр содержания образования', lv: 'VISC — Valsts izglītības satura centrs' },
                desc: { ru: 'Разрабатывает учебные планы и стандарты по каждому предмету', lv: 'Izstrādā mācību plānus un standartus katram priekšmetam' },
                url: 'https://visc.gov.lv',
                label: 'visc.gov.lv',
              },
            ].map((src) => (
              <div key={src.url} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                <span className="text-2xl flex-shrink-0 mt-0.5">{src.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm text-white/90 mb-0.5">{t(src.name)}</p>
                  <p className="text-white/40 text-xs mb-1">{t(src.desc)}</p>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold transition-colors"
                  >
                    🔗 {src.label}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Exam prep block ── */}
      <section className="relative z-10 px-6 pb-20 max-w-3xl mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'linear-gradient(135deg, rgba(234,179,8,0.1), rgba(239,68,68,0.08))',
            border: '1px solid rgba(234,179,8,0.3)',
            borderRadius: '28px', padding: '36px 32px',
          }}
        >
          <div className="text-center mb-6">
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎯</div>
            <h2 className="text-2xl font-black mb-2">
              {lang === 'ru' ? 'Подготовка к контрольным и экзаменам' : 'Sagatavošanās kontroldarbiem un eksāmeniem'}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto' }}>
              {lang === 'ru'
                ? 'Завтра контрольная — Зефир поможет за несколько часов повторить всю тему, разобрать типичные ошибки и потренироваться на задачах именно того формата, который будет на проверке.'
                : 'Rīt kontroldarbs — Zefīrs palīdzēs dažu stundu laikā atkārtot visu tēmu, izanalizēt tipiskās kļūdas un trenēties tieši tāda formāta uzdevumos, kādi būs pārbaudē.'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: '📝',
                title: { ru: 'Контрольные работы', lv: 'Kontroldarbi' },
                desc: {
                  ru: 'Повторение темы в диалоге, разбор типичных ошибок, тренировочные задания в формате школьных контрольных.',
                  lv: 'Tēmas atkārtošana dialogā, tipisku kļūdu analīze, treniņuzdevumi skolas kontroldarbu formātā.',
                },
                accent: 'rgba(234,179,8,0.8)',
                bg: 'rgba(234,179,8,0.08)',
                bd: 'rgba(234,179,8,0.25)',
              },
              {
                icon: '🏆',
                title: { ru: 'Годовые и итоговые экзамены', lv: 'Gada un noslēguma eksāmeni' },
                desc: {
                  ru: 'Систематическое повторение всего материала года. Зефир выявляет пробелы и укрепляет слабые места.',
                  lv: 'Sistemātiska visa gada materiāla atkārtošana. Zefīrs atklāj robus un nostiprina vājās vietas.',
                },
                accent: 'rgba(251,146,60,0.9)',
                bg: 'rgba(251,146,60,0.08)',
                bd: 'rgba(251,146,60,0.25)',
              },
              {
                icon: '🎓',
                title: { ru: 'Централизованные экзамены (ЦЭ)', lv: 'Centralizētie eksāmeni (CE)' },
                desc: {
                  ru: 'Для 9-го и 12-го класса — подготовка по структуре ЦЭ: формат заданий, типичные ошибки, уровни сложности.',
                  lv: '9. un 12. klasei — sagatavošanās pēc CE struktūras: uzdevumu formāts, tipiskās kļūdas, sarežģītības līmeņi.',
                },
                accent: 'rgba(239,68,68,0.9)',
                bg: 'rgba(239,68,68,0.08)',
                bd: 'rgba(239,68,68,0.25)',
              },
            ].map((item) => (
              <div
                key={item.icon}
                style={{
                  background: item.bg, border: `1px solid ${item.bd}`,
                  borderRadius: '16px', padding: '18px 16px',
                }}
              >
                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{item.icon}</div>
                <p style={{ color: item.accent, fontWeight: 900, fontSize: '0.88rem', margin: '0 0 6px' }}>
                  {t(item.title)}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', lineHeight: 1.55, margin: 0 }}>
                  {t(item.desc)}
                </p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(234,179,8,0.7)', fontSize: '0.8rem', fontWeight: 700 }}>
              ⚡ {lang === 'ru'
                ? 'Зефир доступен в 23:00 накануне контрольной — когда живой репетитор уже недоступен'
                : 'Zefīrs pieejams 23:00 kontroldarba priekšvakarā — kad dzīvs pasniedzējs jau nav pieejams'}
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── Pricing ── */}
      <section className="relative z-10 px-6 pb-20 max-w-5xl mx-auto">
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
                <li>✓ {lang === 'ru' ? 'Все темы вашего класса' : 'Visas jūsu klases tēmas'}</li>
                <li>✓ {lang === 'ru' ? 'Помощь с домашними заданиями' : 'Palīdzība ar mājas darbiem'}</li>
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
              ? 'Первые 24 часа — полностью бесплатно. Зарегистрируйтесь и оцените Зефира до оплаты.'
              : 'Pirmās 24 stundas — pilnīgi bez maksas. Reģistrējieties un novērtējiet Zefīru pirms maksāšanas.'}
          </p>
          <p className="text-white/35 text-xs mt-2">
            {lang === 'ru'
              ? 'Подписка продлевается автоматически · Отмена в любое время'
              : 'Abonements atjaunojas automātiski · Atcelšana jebkurā laikā'}
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative z-10 px-6 pb-20 max-w-3xl mx-auto">
        <h2 className="text-center text-2xl font-black mb-2 text-white/80">
          {lang === 'ru' ? 'Частые вопросы' : 'Biežāk uzdotie jautājumi'}
        </h2>
        <p className="text-center text-white/40 text-sm mb-10">
          {lang === 'ru' ? 'Отвечаем честно' : 'Atbildam godīgi'}
        </p>
        <div className="flex flex-col gap-3">
          {FAQ.map((item, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-3"
              >
                <span className="font-black text-sm text-white/90">{t(item.q)}</span>
                <span className={`text-indigo-400 text-lg flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4">
                  <p className="text-white/55 text-sm leading-relaxed">{t(item.a)}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Финальный CTA ── */}
      {!user && (
        <section className="relative z-10 px-6 pb-24 max-w-3xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-indigo-600/40 to-purple-600/30 border border-indigo-400/30 rounded-3xl p-10 text-center"
          >
            <div className="text-5xl mb-4">🧙‍♂️</div>
            <h2 className="text-2xl sm:text-3xl font-black mb-3">
              {lang === 'ru' ? 'Готовы попробовать?' : 'Gatavi izmēģināt?'}
            </h2>
            <p className="text-white/60 text-base mb-6 max-w-md mx-auto">
              {lang === 'ru'
                ? '24 часа бесплатно — без карты, без обязательств. Зефир уже ждёт вашего ребёнка.'
                : '24 stundas bez maksas — bez kartes, bez saistībām. Zefīrs jau gaida jūsu bērnu.'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/register')}
              className="bg-indigo-500 hover:bg-indigo-400 text-white font-black text-lg px-12 py-4 rounded-2xl shadow-2xl shadow-indigo-500/40 transition-colors"
            >
              {lang === 'ru' ? '🚀 Начать бесплатно' : '🚀 Sākt bez maksas'}
            </motion.button>
            <p className="text-white/25 text-xs mt-4">
              {lang === 'ru' ? '24 часа бесплатно · Подписка с автопродлением · Отмена в любое время' : '24 stundas bez maksas · Abonements ar automātisku atjaunošanu · Atcelšana jebkurā laikā'}
            </p>
          </motion.div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative z-10 text-center pb-8 text-white/20 text-xs px-4">
        {lang === 'ru'
          ? 'Создан с помощью искусственного интеллекта · Разработан для Латвии · © 2026 Магия Знаний'
          : 'Veidots ar mākslīgā intelekta palīdzību · Izstrādāts Latvijai · © 2026 Zināšanu Maģija'}
      </footer>
    </div>
  );
}
