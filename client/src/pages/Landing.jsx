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
    label: { ru: '1 месяц', uk: '1 місяць', lv: '1 mēnesis' },
    price: '€19',
    per: { ru: '/мес', uk: '/міс', lv: '/mēn' },
    badge: null,
  },
  {
    id: '6mo',
    label: { ru: '6 месяцев', uk: '6 місяців', lv: '6 mēneši' },
    price: '€90',
    per: { ru: '/полгода', uk: '/півроку', lv: '/pusgads' },
    sub: { ru: '≈ €15/мес', uk: '≈ €15/міс', lv: '≈ €15/mēn' },
    badge: { ru: 'Популярный', uk: 'Популярний', lv: 'Populārs' },
    highlight: true,
  },
  {
    id: '12mo',
    label: { ru: '1 год', uk: '1 рік', lv: '1 gads' },
    price: '€119.88',
    per: { ru: '/год', uk: '/рік', lv: '/gadā' },
    sub: { ru: '≈ €9.99/мес', uk: '≈ €9.99/міс', lv: '≈ €9.99/mēn' },
    badge: { ru: 'Лучшая цена', uk: 'Найкраща ціна', lv: 'Labākā cena' },
  },
];

const FEATURES = [
  {
    icon: '📚',
    title: { ru: '3 предмета в одной подписке', uk: '3 предмети в одній підписці', lv: '3 priekšmeti vienā abonementā' },
    desc: {
      ru: 'Математика, английский и латышский — всё включено для вашего класса. Не нужно платить за каждый предмет отдельно.',
      uk: 'Математика, англійська та латиська — все включено для вашого класу. Не потрібно платити за кожен предмет окремо.',
      lv: 'Matemātika, angļu un latviešu valoda — viss iekļauts jūsu klasei. Nav jāmaksā par katru priekšmetu atsevišķi.',
    },
  },
  {
    icon: '🏛️',
    title: { ru: 'По программе МО Латвии', uk: 'За програмою МО Латвії', lv: 'Pēc IZM programmas' },
    desc: {
      ru: 'Все темы строго по официальной программе Министерства образования Латвии (Skola2030). Ребёнок учится именно по тому, что нужно в его школе.',
      uk: 'Всі теми суворо за офіційною програмою Міністерства освіти Латвії (Skola2030). Дитина вчиться саме те, що потрібно в її школі.',
      lv: 'Visas tēmas stingri pēc Latvijas IZM oficiālās programmas (Skola2030). Bērns mācās tieši to, kas vajadzīgs viņa skolā.',
    },
  },
  {
    icon: '⭐',
    title: { ru: 'Учёба как игра', uk: 'Навчання як гра', lv: 'Mācības kā spēle' },
    desc: {
      ru: 'XP-баллы, уровни и достижения делают учёбу интересной. Дети занимаются добровольно — не потому что надо, а потому что хочется.',
      uk: 'XP-бали, рівні та досягнення роблять навчання цікавим. Діти займаються добровільно — не тому що треба, а тому що хочеться.',
      lv: 'XP punkti, līmeņi un sasniegumi padara mācības interesantas. Bērni mācās brīvprātīgi — ne tāpēc, ka vajag, bet tāpēc, ka grib.',
    },
  },
  {
    icon: '🕐',
    title: { ru: 'Доступен 24/7', uk: 'Доступний 24/7', lv: 'Pieejams 24/7' },
    desc: {
      ru: 'В любое время — перед контрольной в 23:00, после школы или в выходной. Никакого расписания, никакого ожидания.',
      uk: 'У будь-який час — перед контрольною о 23:00, після школи або у вихідний. Ніякого розкладу, ніякого очікування.',
      lv: 'Jebkurā laikā — pirms kontroldarba 23:00, pēc skolas vai brīvdienā. Nav grafika, nav gaidīšanas.',
    },
  },
  {
    icon: '🎯',
    title: { ru: 'Гибкость в выборе тем', uk: 'Гнучкість у виборі тем', lv: 'Elastība tēmu izvēlē' },
    desc: {
      ru: 'Можно проходить темы по порядку или выбрать только нужную — подтянуть слабое место перед контрольной. Вы решаете.',
      uk: 'Можна проходити теми по порядку або вибрати лише потрібну — підтягнути слабке місце перед контрольною. Ви вирішуєте.',
      lv: 'Var iziet tēmas pēc kārtas vai izvēlēties tikai vajadzīgo — nostiprināt vājo vietu pirms kontroldarba. Jūs izlemjat.',
    },
  },
  {
    icon: '📝',
    title: { ru: 'Помощь с домашними заданиями', uk: 'Допомога з домашніми завданнями', lv: 'Palīdzība ar mājas darbiem' },
    desc: {
      ru: 'Загрузите фото задания — Орис разберёт ход решения и объяснит шаг за шагом. Не просто даст ответ, а научит думать.',
      uk: 'Завантажте фото завдання — Оріс розбере хід розв\'язання і пояснить крок за кроком. Не просто дасть відповідь, а навчить думати.',
      lv: 'Ielādējiet uzdevuma foto — Oris izskaidros risinājuma gaitu soli pa solim. Ne tikai dos atbildi, bet iemācīs domāt.',
    },
  },
];

const STEPS = [
  {
    num: '1',
    icon: '📋',
    title: { ru: 'Зарегистрируйтесь', uk: 'Зареєструйтесь', lv: 'Reģistrējieties' },
    desc: { ru: '3 дня полного доступа бесплатно — оцените всё перед оплатой', uk: '3 дні повного доступу безкоштовно — оцініть все перед оплатою', lv: '3 dienas pilna piekļuve bez maksas — novērtējiet visu pirms maksāšanas' },
  },
  {
    num: '2',
    icon: '🎓',
    title: { ru: 'Выберите класс ребёнка', uk: 'Виберіть клас дитини', lv: 'Izvēlieties bērna klasi' },
    desc: { ru: 'Программа автоматически подстроится под уровень и предметы', uk: 'Програма автоматично підлаштується під рівень і предмети', lv: 'Programma automātiski pielāgosies līmenim un priekšmetiem' },
  },
  {
    num: '3',
    icon: '📖',
    title: { ru: 'Выберите тему', uk: 'Виберіть тему', lv: 'Izvēlieties tēmu' },
    desc: { ru: 'По порядку или ту, что нужна прямо сейчас — решаете вы', uk: 'По порядку або ту, що потрібна прямо зараз — вирішуєте ви', lv: 'Pēc kārtas vai to, kas vajadzīga tieši tagad — izlemjat jūs' },
  },
  {
    num: '4',
    icon: '🚀',
    title: { ru: 'Орис начинает урок', uk: 'Оріс починає урок', lv: 'Oris sāk nodarbību' },
    desc: { ru: 'Диалог, вопросы, объяснения и XP — ребёнок растёт с каждым занятием', uk: 'Діалог, запитання, пояснення та XP — дитина зростає з кожним заняттям', lv: 'Dialogs, jautājumi, skaidrojumi un XP — bērns aug ar katru nodarbību' },
  },
];

const FAQ = [
  {
    q: { ru: 'Что будет после 3 дней бесплатного доступа?', uk: 'Що буде після 3 днів безкоштовного доступу?', lv: 'Kas notiek pēc 3 dienu bezmaksas piekļuves?' },
    a: { ru: 'Доступ просто закроется. Никаких автоматических списаний — карту мы даже не просим при регистрации. Чтобы продолжить, нужно будет выбрать тариф вручную.', uk: 'Доступ просто закриється. Жодних автоматичних списань — картку ми навіть не просимо при реєстрації. Щоб продовжити, потрібно буде вибрати тариф вручну.', lv: 'Piekļuve vienkārši tiks slēgta. Nekādu automātisku maksājumu — kartes mēs pat neprasām reģistrācijā. Lai turpinātu, būs manuāli jāizvēlas tarifs.' },
  },
  {
    q: { ru: 'Заменит ли Орис живого репетитора полностью?', uk: 'Чи замінить Оріс живого репетитора повністю?', lv: 'Vai Oris pilnībā aizstās dzīvu pasniedzēju?' },
    a: { ru: 'Для большинства задач — да. Объяснение темы, отработка упражнений, подготовка к контрольной, домашние задания — Орис справляется отлично. Для сложных индивидуальных случаев (например, дислексия) живой специалист всё ещё полезен.', uk: 'Для більшості завдань — так. Пояснення теми, відпрацювання вправ, підготовка до контрольної, домашні завдання — Оріс справляється відмінно. Для складних індивідуальних випадків (наприклад, дислексія) живий фахівець ще корисний.', lv: 'Lielākajai daļai uzdevumu — jā. Tēmas skaidrojums, vingrinājumu izstrāde, gatavošanās kontroldarbam, mājas darbi — Oris tiek galā labi. Sarežģītiem individuāliem gadījumiem (piem., disleksija) dzīvs speciālists joprojām ir noderīgs.' },
  },
  {
    q: { ru: 'Безопасно ли это для ребёнка?', uk: 'Чи це безпечно для дитини?', lv: 'Vai tas ir droši bērnam?' },
    a: { ru: 'Да. Орис запрограммирован использовать только нейтральный академический язык, без нежелательного контента. Все ответы проходят через безопасный фильтр. Ребёнок видит только учебные задания и пояснения.', uk: 'Так. Оріс запрограмований використовувати лише нейтральну академічну мову, без небажаного контенту. Всі відповіді проходять через безпечний фільтр. Дитина бачить лише навчальні завдання та пояснення.', lv: 'Jā. Oris ir ieprogrammēts lietot tikai neitrālu akadēmisku valodu, bez nevēlama satura. Visas atbildes iet caur drošu filtru. Bērns redz tikai mācību uzdevumus un paskaidrojumus.' },
  },
  {
    q: { ru: 'Подписка продлевается автоматически?', uk: 'Підписка поновлюється автоматично?', lv: 'Vai abonements tiek automātiski pagarināts?' },
    a: { ru: 'Да, подписка продлевается автоматически — это удобно: ребёнок не теряет доступ в разгар учёбы. Но вы можете отменить её в любое удобное время через раздел «Аккаунт» — без звонков и ожиданий.', uk: 'Так, підписка поновлюється автоматично — це зручно: дитина не втрачає доступ у розпал навчання. Але ви можете скасувати її в будь-який зручний час через розділ «Акаунт» — без дзвінків і очікування.', lv: 'Jā, abonements tiek automātiski pagarināts — tas ir ērti: bērns nezaudē piekļuvi mācību vidū. Taču jūs varat to atcelt jebkurā ērtā laikā sadaļā «Konts» — bez zvaniem un gaidīšanas.' },
  },
  {
    q: { ru: 'Мой ребёнок в 8-м классе, а программа для всех с 1 по 12?', uk: 'Моя дитина в 8 класі, а програма для всіх з 1 по 12?', lv: 'Mans bērns ir 8. klasē, bet programma ir visiem no 1. līdz 12.?' },
    a: { ru: 'Именно так. Вы выбираете один конкретный класс при подписке, и Орис полностью адаптируется под этот уровень. Темы, сложность, стиль общения — всё соответствует возрасту.', uk: 'Саме так. Ви обираєте один конкретний клас при підписці, і Оріс повністю адаптується під цей рівень. Теми, складність, стиль спілкування — все відповідає віку.', lv: 'Tieši tā. Jūs izvēlaties vienu konkrētu klasi abonējot, un Oris pilnībā pielāgojas šim līmenim. Tēmas, sarežģītība, saziņas stils — viss atbilst vecumam.' },
  },
  {
    q: { ru: 'Сколько тем доступно?', uk: 'Скільки тем доступно?', lv: 'Cik tēmu ir pieejams?' },
    a: { ru: 'Сотни тем по трём предметам — математика, английский, латышский. Полное покрытие школьной программы для каждого класса с 1 по 12.', uk: 'Сотні тем з трьох предметів — математика, англійська, латиська. Повне охоплення шкільної програми для кожного класу з 1 по 12.', lv: 'Simtiem tēmu trijos priekšmetos — matemātika, angļu, latviešu. Pilns skolas programmas aptvērums katrai klasei no 1. līdz 12.' },
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
        <div className="text-xl font-black tracking-tight">🦉 {lang === 'lv' ? 'SmartSkola' : 'SmartШкола'}</div>
        <div className="flex items-center gap-3">
          {/* Language selector */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
            <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.04em' }}>
              {lang === 'lv' ? 'Valoda / Язык' : lang === 'uk' ? 'Мова навчання' : 'Язык репетитора'}
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
                    background: lang !== 'lv' ? 'rgba(99,102,241,0.45)' : 'rgba(255,255,255,0.07)',
                    border: `1px solid ${lang !== 'lv' ? 'rgba(129,140,248,0.5)' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: '8px', padding: '4px 10px',
                    color: lang !== 'lv' ? 'white' : 'rgba(255,255,255,0.4)',
                    fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {lang === 'ru' ? '🇷🇺 Русский' : lang === 'uk' ? '🇺🇦 Українська' : 'Citas valodas'} ▾
                </button>
                {showOtherLangs && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 4px)', right: 0,
                    background: '#1e1b4b', border: '1px solid rgba(129,140,248,0.3)',
                    borderRadius: '10px', padding: '4px', zIndex: 200, minWidth: '150px',
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
                    <button
                      onClick={() => changeLang('uk')}
                      style={{
                        width: '100%', background: 'none', border: 'none',
                        color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem',
                        fontWeight: 700, padding: '8px 12px', cursor: 'pointer',
                        textAlign: 'left', borderRadius: '7px',
                      }}
                    >
                      🇺🇦 Українська
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
                {lang === 'lv' ? 'Lietotne' : lang === 'uk' ? 'Застосунок' : 'Приложение'}
              </button>
              <button
                onClick={() => { logout(); }}
                className="text-red-400/70 hover:text-red-400 text-sm font-medium px-4 py-2 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-all"
              >
                {lang === 'lv' ? 'Iziet' : lang === 'uk' ? 'Вийти' : 'Выйти'}
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-white/70 hover:text-white text-sm font-medium px-4 py-2 rounded-xl border border-white/20 hover:border-white/40 transition-all"
            >
              {lang === 'lv' ? 'Ieiet' : lang === 'uk' ? 'Увійти' : 'Войти'}
            </button>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 text-center px-6 pt-12 pb-20 max-w-3xl mx-auto">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}>
          <div className="text-7xl mb-5 inline-block">🦉</div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
            {lang === 'lv' ? (
              <>Pasniedzējs jūsu bērnam —<br /><span className="text-indigo-300">vienmēr klāt, jebkurā laikā</span></>
            ) : lang === 'uk' ? (
              <>Репетитор для вашої дитини —<br /><span className="text-indigo-300">завжди поруч, у будь-який час</span></>
            ) : (
              <>Репетитор для вашего ребёнка —<br /><span className="text-indigo-300">всегда рядом, в любое время</span></>
            )}
          </h1>
          <p className="text-white/70 text-base sm:text-lg mb-3 max-w-xl mx-auto leading-relaxed">
            {lang === 'lv'
              ? 'Pasniedzējs skolēniem, veidots ar mākslīgā intelekta iespējām. Palīdz bērnam pildīt mājas darbus, saprast skolas tēmas un mācīties mierīgi. Vecākiem — atdod brīvos vakarus.'
              : lang === 'uk'
              ? 'Репетитор для школярів, створений за допомогою штучного інтелекту. Допомагає дитині виконувати домашні завдання, розуміти шкільні теми і вчитися спокійно. Батькам — повертає вільні вечори.'
              : 'Репетитор для школьников, созданный с помощью искусственного интеллекта. Помогает ребёнку делать домашние задания, понимать школьные темы и учиться спокойно. Родителям — возвращает свободные вечера.'}
          </p>
          <p className="text-white/40 text-sm mb-8">
            {lang === 'lv'
              ? 'Daudz lētāks par dzīvu pasniedzēju · Pieejams 24/7 · Mācības spēles formātā'
              : lang === 'uk'
              ? 'У рази дешевше живого репетитора · Доступний 24/7 · Навчання у форматі гри'
              : 'В разы дешевле живого репетитора · Доступен 24/7 · Учёба в формате игры'}
          </p>
          {user ? (
            <div className="flex flex-col items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/dashboard')}
                className="bg-indigo-500 hover:bg-indigo-400 text-white font-black text-lg px-10 py-4 rounded-2xl shadow-2xl shadow-indigo-500/30 transition-colors"
              >
                {lang === 'lv' ? '📚 Doties uz lietotni' : lang === 'uk' ? '📚 Перейти до застосунку' : '📚 Перейти в приложение'}
              </motion.button>
              <p className="text-white/30 text-sm">
                {lang === 'lv' ? `Jūs esat pieteicies kā ${user.email}` : lang === 'uk' ? `Ви увійшли як ${user.email}` : `Вы вошли как ${user.email}`}
              </p>
              <button
                onClick={() => logout()}
                className="text-white/30 hover:text-white/60 text-xs underline transition-colors"
              >
                {lang === 'lv' ? 'Iziet un pieteikties citā kontā' : lang === 'uk' ? 'Вийти і увійти в інший акаунт' : 'Выйти и войти в другой аккаунт'}
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
                {lang === 'lv' ? '🚀 Izmēģināt bez maksas — 3 dienas' : lang === 'uk' ? '🚀 Спробувати безкоштовно — 3 дні' : '🚀 Попробовать бесплатно — 3 дня'}
              </motion.button>
              <p className="text-white/30 text-sm mt-3">
                {lang === 'lv' ? '3 dienas bez maksas · Bez kartes · Atcelšana jebkurā laikā' : lang === 'uk' ? '3 дні безкоштовно · Без картки · Скасування в будь-який час' : '3 дня бесплатно · Без карты · Отмена в любое время'}
              </p>
            </>
          )}
        </motion.div>
      </section>

      {/* ── Орис ── */}
      <section className="relative z-10 px-6 pb-20 max-w-3xl mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 border border-indigo-400/20 rounded-3xl p-8 text-center"
        >
          <div className="text-5xl mb-4">🦉</div>
          <h2 className="text-2xl font-black mb-3">
            {lang === 'lv' ? 'Iepazīstieties — Oris' : lang === 'uk' ? 'Знайомтесь — Оріс' : 'Знакомьтесь — Орис'}
          </h2>
          <p className="text-white/65 text-base leading-relaxed max-w-xl mx-auto">
            {lang === 'lv'
              ? 'Oris — jaunās paaudzes pasniedzējs, kas izmanto mākslīgā intelekta iespējas. Viņš skaidro sarežģītu vienkāršiem vārdiem, uzdod jautājumus un gaida atbildi — kā īsts skolotājs. Oris pielāgojas katram: pirmklasniekam runā silti un ar humoru, vidusskolēnam — skaidri un konkrēti. Mācības norisinās dzīva dialoga formātā — jautājums, atbilde, nākamais solis.'
              : lang === 'uk'
              ? 'Оріс — репетитор нового покоління, який використовує можливості штучного інтелекту. Він пояснює складне простими словами, ставить запитання та чекає відповіді — як справжній учитель. Оріс адаптується під кожного: для першокласника говорить тепло і з гумором, для старшокласника — чітко і по суті. Навчання відбувається у форматі живого діалогу — запитання, відповідь, наступний крок.'
              : 'Орис — репетитор нового поколения, который использует возможности искусственного интеллекта. Он объясняет сложное простыми словами, задаёт вопросы и ждёт ответа — как настоящий учитель. Орис адаптируется под каждого: для первоклассника говорит тепло и с юмором, для старшеклассника — чётко и по делу. Обучение идёт в формате живого диалога — вопрос, ответ, следующий шаг.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-2 justify-center">
            {(lang === 'lv'
              ? ['💬 Dialogs, ne lekcija', '🎓 1.–12. klase', '🌍 Krieviski un latviski', '🧠 Pielāgojas līmenim', '📐 Pēc skolas programmas', '📝 Palīdzība ar mājas darbiem']
              : lang === 'uk'
              ? ['💬 Діалог, не лекція', '🎓 1–12 клас', '🌍 Українська та латиська', '🧠 Адаптується під рівень', '📐 За шкільною програмою', '📝 Допомога з домашніми завданнями']
              : ['💬 Диалог, не лекция', '🎓 1–12 класс', '🌍 Русский и латышский', '🧠 Адаптируется под уровень', '📐 По школьной программе', '📝 Помощь с домашними заданиями']
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
          {lang === 'lv' ? '3 priekšmeti — kāpēc tieši šie?' : lang === 'uk' ? '3 предмети — чому саме вони?' : '3 предмета — почему именно они?'}
        </h2>
        <p className="text-center text-white/40 text-sm mb-10">
          {lang === 'lv'
            ? 'Izvēlēti galvenie priekšmeti, no kuriem atkarīgi panākumi Latvijas skolā'
            : lang === 'uk'
            ? 'Вибрані головні предмети, від яких залежить успіх у латвійській школі'
            : 'Выбраны главные предметы, от которых зависит успех в латвийской школе'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              icon: '📐',
              color: 'rgba(59,130,246,0.15)',
              border: 'rgba(59,130,246,0.35)',
              accent: '#93c5fd',
              title: { ru: 'Математика', uk: 'Математика', lv: 'Matemātika' },
              why: { ru: 'Обязательна для поступления', uk: 'Обов\'язкова для вступу', lv: 'Obligāta uzņemšanai' },
              desc: {
                ru: 'Математика — фундамент всего точного мышления. Она нужна для поступления в большинство вузов, сдачи ЦЭ и ежедневной логики. Орис объясняет арифметику, алгебру, геометрию и статистику — по шагам, с примерами и живым диалогом.',
                uk: 'Математика — фундамент точного мислення. Вона потрібна для вступу до більшості вузів, складання ЦЕ та щоденної логіки. Оріс пояснює арифметику, алгебру, геометрію та статистику — покроково, з прикладами та живим діалогом.',
                lv: 'Matemātika ir precīzās domāšanas pamats. Tā nepieciešama uzņemšanai augstskolās, CE kārtošanai un ikdienas loģikai. Oris skaidro aritmētiku, algebru, ģeometriju un statistiku — soli pa solim, ar piemēriem.',
              },
              tags: {
                ru: ['Арифметика', 'Алгебра', 'Геометрия', 'Статистика', 'ЦЭ'],
                uk: ['Арифметика', 'Алгебра', 'Геометрія', 'Статистика', 'ЦЕ'],
                lv: ['Aritmētika', 'Algebra', 'Ģeometrija', 'Statistika', 'CE'],
              },
            },
            {
              icon: '🇬🇧',
              color: 'rgba(16,185,129,0.12)',
              border: 'rgba(16,185,129,0.35)',
              accent: '#6ee7b7',
              title: { ru: 'Английский язык', uk: 'Англійська мова', lv: 'Angļu valoda' },
              why: { ru: 'Язык международного общения', uk: 'Мова міжнародного спілкування', lv: 'Starptautiskās saziņas valoda' },
              desc: {
                ru: 'Английский — второй обязательный язык в латвийских школах с 1 класса. Без него невозможно высшее образование, карьера и путешествия. Орис тренирует грамматику, лексику, чтение и разговорные конструкции — на каждом уровне.',
                uk: 'Англійська — друга обов\'язкова мова в латвійських школах з 1 класу. Без неї неможлива вища освіта, кар\'єра та подорожі. Оріс тренує граматику, лексику, читання та розмовні конструкції — на кожному рівні.',
                lv: 'Angļu valoda ir otrā obligātā valoda Latvijas skolās no 1. klases. Bez tās nav iespējama augstākā izglītība, karjera un ceļošana. Oris trenē gramatiku, leksiku, lasīšanu un sarunvalodas konstrukcijas.',
              },
              tags: {
                ru: ['Грамматика', 'Лексика', 'Чтение', 'Диалог', 'ЦЭ'],
                uk: ['Граматика', 'Лексика', 'Читання', 'Діалог', 'ЦЕ'],
                lv: ['Gramatika', 'Leksika', 'Lasīšana', 'Dialogs', 'CE'],
              },
            },
            {
              icon: '🇱🇻',
              color: 'rgba(239,68,68,0.12)',
              border: 'rgba(239,68,68,0.35)',
              accent: '#fca5a5',
              title: { ru: 'Латышский язык', uk: 'Латиська мова', lv: 'Latviešu valoda' },
              why: { ru: 'Государственный язык Латвии', uk: 'Державна мова Латвії', lv: 'Latvijas valsts valoda' },
              desc: {
                ru: 'Латышский — государственный язык страны. Его знание обязательно для получения гражданства, работы в государственных структурах и сдачи всех ключевых экзаменов. Орис помогает освоить грамматику, правописание и работу с текстами.',
                uk: 'Латиська — державна мова країни. Знання латиської обов\'язкове для отримання громадянства, роботи в державних структурах та складання всіх ключових іспитів. Оріс допомагає засвоїти граматику, правопис і роботу з текстами.',
                lv: 'Latviešu valoda ir valsts valoda. Tās zināšanas ir obligātas pilsonības iegūšanai, darbam valsts struktūrās un visu galveno eksāmenu kārtošanai. Oris palīdz apgūt gramatiku, pareizrakstību un darbu ar tekstiem.',
              },
              tags: {
                ru: ['Грамматика', 'Правописание', 'Тексты', 'Диктант', 'ЦЭ'],
                uk: ['Граматика', 'Правопис', 'Тексти', 'Диктант', 'ЦЕ'],
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
                {(subj.tags[lang] || subj.tags.ru).map((tag) => (
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
          {lang === 'lv' ? 'Kāpēc SmartSkola?' : lang === 'uk' ? 'Чому SmartШкола?' : 'Почему SmartШкола?'}
        </h2>
        <p className="text-center text-white/40 text-sm mb-10">
          {lang === 'lv' ? 'Viss mācībām vajadzīgais — vienā vietā' : lang === 'uk' ? 'Все, що потрібно для навчання — в одному місці' : 'Всё, что нужно для учёбы — в одном месте'}
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
          {lang === 'lv' ? 'Kā tas darbojas' : lang === 'uk' ? 'Як це працює' : 'Как это работает'}
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
          {lang === 'lv' ? 'Salīdzini ar dzīvu pasniedzēju' : lang === 'uk' ? 'Порівняй з живим репетитором' : 'Сравни с живым репетитором'}
        </h2>
        <p className="text-center text-white/40 text-sm mb-8">
          {lang === 'lv'
            ? 'Viena stunda ar dzīvu pasniedzēju = visa mēneša abonements Orim'
            : lang === 'uk'
            ? 'Одна година з живим репетитором = вся місячна підписка на Оріса'
            : 'Один час с живым репетитором = вся месячная подписка на Ориса'}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="font-black text-white/50 text-sm mb-4">
              {lang === 'lv' ? '👤 Dzīvs pasniedzējs' : '👤 Живий репетитор'}
            </p>
            {(lang === 'lv'
              ? ['€20–40 par vienu stundu', 'Tikai pēc grafika', 'Viens priekšmets', 'Gaidāt brīvu laiku', 'Nav spēļu motivācijas']
              : lang === 'uk'
              ? ['€20–40 за один урок', 'Тільки за розкладом', 'Один предмет', 'Очікуєте вільного часу', 'Немає ігрової мотивації']
              : ['€20–40 за один урок', 'Только по расписанию', 'Один предмет', 'Ждёте свободного времени', 'Нет игровой мотивации']
            ).map((item) => (
              <p key={item} className="text-white/40 text-sm mb-2 flex items-start gap-2">
                <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>{item}
              </p>
            ))}
          </div>
          <div className="bg-indigo-600/15 border border-indigo-400/30 rounded-2xl p-5">
            <p className="font-black text-indigo-300 text-sm mb-4">
              🦉 {lang === 'lv' ? 'Oris' : lang === 'uk' ? 'Оріс' : 'Орис'}
            </p>
            {(lang === 'lv'
              ? ['no €9.99 mēnesī', 'Jebkurā laikā 24/7', '3 priekšmeti abonementā', 'Tūlītējs starts', 'XP, līmeņi, sasniegumi']
              : lang === 'uk'
              ? ['від €9.99 на місяць', 'У будь-який час 24/7', '3 предмети у підписці', 'Старт миттєво', 'XP, рівні, досягнення']
              : ['от €9.99 в месяц', 'В любое время 24/7', '3 предмета в подписке', 'Старт мгновенно', 'XP, уровни, достижения']
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
            {lang === 'lv' ? 'No kurienes nāk programma?' : lang === 'uk' ? 'Звідки береться програма?' : 'Откуда берётся программа?'}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-6 text-center">
            {lang === 'lv'
              ? 'Visas tēmas un uzdevumi stingri atbilst Latvijas oficiālajai mācību programmai. Nekas nav izdomāts — tikai tas, kas jāzina pēc skolas programmas.'
              : lang === 'uk'
              ? 'Всі теми та завдання суворо відповідають офіційній навчальній програмі Латвії. Нічого не вигадано — лише те, що потрібно знати за шкільною програмою.'
              : 'Все темы и задания строго соответствуют официальной учебной программе Латвии. Ничего не придумано — только то, что нужно знать по школьной программе.'}
          </p>
          <div className="flex flex-col gap-3">
            {[
              {
                icon: '📋',
                name: { ru: 'Министерство образования и науки Латвии (IZM)', uk: 'Міністерство освіти і науки Латвії (IZM)', lv: 'Latvijas Izglītības un zinātnes ministrija (IZM)' },
                desc: { ru: 'Государственный орган, утверждающий стандарты образования', uk: 'Державний орган, що затверджує стандарти освіти', lv: 'Valsts iestāde, kas apstiprina izglītības standartus' },
                url: 'https://www.izm.gov.lv',
                label: 'izm.gov.lv',
              },
              {
                icon: '🎓',
                name: { ru: 'Проект реформы Skola2030', uk: 'Проект реформи Skola2030', lv: 'Skola2030 reformas projekts' },
                desc: { ru: 'Современная программа обучения для всех классов Латвии', uk: 'Сучасна програма навчання для всіх класів Латвії', lv: 'Mūsdienīga mācību programma visām Latvijas klasēm' },
                url: 'https://www.skola2030.lv',
                label: 'skola2030.lv',
              },
              {
                icon: '📚',
                name: { ru: 'VISC — Национальный центр содержания образования', uk: 'VISC — Національний центр змісту освіти', lv: 'VISC — Valsts izglītības satura centrs' },
                desc: { ru: 'Разрабатывает учебные планы и стандарты по каждому предмету', uk: 'Розробляє навчальні плани та стандарти з кожного предмета', lv: 'Izstrādā mācību plānus un standartus katram priekšmetam' },
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
              {lang === 'lv' ? 'Sagatavošanās kontroldarbiem un eksāmeniem' : lang === 'uk' ? 'Підготовка до контрольних та іспитів' : 'Подготовка к контрольным и экзаменам'}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto' }}>
              {lang === 'lv'
                ? 'Rīt kontroldarbs — Oris palīdzēs dažu stundu laikā atkārtot visu tēmu, izanalizēt tipiskās kļūdas un trenēties tieši tāda formāta uzdevumos, kādi būs pārbaudē.'
                : lang === 'uk'
                ? 'Завтра контрольна — Оріс допоможе за кілька годин повторити всю тему, розібрати типові помилки та потренуватись на завданнях саме того формату, який буде на перевірці.'
                : 'Завтра контрольная — Орис поможет за несколько часов повторить всю тему, разобрать типичные ошибки и потренироваться на задачах именно того формата, который будет на проверке.'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: '📝',
                title: { ru: 'Контрольные работы', uk: 'Контрольні роботи', lv: 'Kontroldarbi' },
                desc: {
                  ru: 'Повторение темы в диалоге, разбор типичных ошибок, тренировочные задания в формате школьных контрольных.',
                  uk: 'Повторення теми в діалозі, аналіз типових помилок, тренувальні завдання у форматі шкільних контрольних.',
                  lv: 'Tēmas atkārtošana dialogā, tipisku kļūdu analīze, treniņuzdevumi skolas kontroldarbu formātā.',
                },
                accent: 'rgba(234,179,8,0.8)',
                bg: 'rgba(234,179,8,0.08)',
                bd: 'rgba(234,179,8,0.25)',
              },
              {
                icon: '🏆',
                title: { ru: 'Годовые и итоговые экзамены', uk: 'Річні та підсумкові іспити', lv: 'Gada un noslēguma eksāmeni' },
                desc: {
                  ru: 'Систематическое повторение всего материала года. Орис выявляет пробелы и укрепляет слабые места.',
                  uk: 'Систематичне повторення всього матеріалу року. Оріс виявляє прогалини та зміцнює слабкі місця.',
                  lv: 'Sistemātiska visa gada materiāla atkārtošana. Oris atklāj robus un nostiprina vājās vietas.',
                },
                accent: 'rgba(251,146,60,0.9)',
                bg: 'rgba(251,146,60,0.08)',
                bd: 'rgba(251,146,60,0.25)',
              },
              {
                icon: '🎓',
                title: { ru: 'Централизованные экзамены (ЦЭ)', uk: 'Централізовані іспити (ЦЕ)', lv: 'Centralizētie eksāmeni (CE)' },
                desc: {
                  ru: 'Для 9-го и 12-го класса — подготовка по структуре ЦЭ: формат заданий, типичные ошибки, уровни сложности.',
                  uk: 'Для 9-го та 12-го класу — підготовка за структурою ЦЕ: формат завдань, типові помилки, рівні складності.',
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
              ⚡ {lang === 'lv'
                ? 'Oris pieejams 23:00 kontroldarba priekšvakarā — kad dzīvs pasniedzējs jau nav pieejams'
                : lang === 'uk'
                ? 'Оріс доступний о 23:00 напередодні контрольної — коли живий репетитор вже недоступний'
                : 'Орис доступен в 23:00 накануне контрольной — когда живой репетитор уже недоступен'}
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── Pricing ── */}
      <section className="relative z-10 px-6 pb-20 max-w-5xl mx-auto">
        <h2 className="text-center text-2xl font-black mb-2 text-white/80">
          {lang === 'lv' ? 'Tarifi' : lang === 'uk' ? 'Тарифи' : 'Тарифы'}
        </h2>
        <p className="text-center text-white/60 text-sm mb-1">
          {lang === 'lv'
            ? 'Abonements tiek noformēts vienai klasei — jūs saņemat uzreiz 3 priekšmetus'
            : lang === 'uk'
            ? 'Підписка оформляється на один клас — ви отримуєте одразу 3 предмети'
            : 'Подписка оформляется на один класс — вы получаете сразу 3 предмета'}
        </p>
        <p className="text-center text-indigo-300/60 text-xs font-semibold mb-10">
          {lang === 'lv'
            ? '📐 Matemātika · 🇬🇧 Angļu valoda · 🇱🇻 Latviešu valoda'
            : lang === 'uk'
            ? '📐 Математика · 🇬🇧 Англійська мова · 🇱🇻 Латиська мова'
            : '📐 Математика · 🇬🇧 Английский язык · 🇱🇻 Латышский язык'}
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
                <li>✓ {lang === 'lv' ? '3 priekšmeti' : lang === 'uk' ? '3 предмети' : '3 предмета'}</li>
                <li>✓ {lang === 'lv' ? 'Visas jūsu klases tēmas' : lang === 'uk' ? 'Всі теми вашого класу' : 'Все темы вашего класса'}</li>
                <li>✓ {lang === 'lv' ? 'Palīdzība ar mājas darbiem' : lang === 'uk' ? 'Допомога з домашніми завданнями' : 'Помощь с домашними заданиями'}</li>
                <li>✓ {lang === 'lv' ? 'Piekļuve 24/7' : 'Доступ 24/7'}</li>
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
                  {lang === 'lv' ? 'Sākt' : lang === 'uk' ? 'Почати' : 'Начать'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Savings breakdown */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            {
              label: { ru: '1 месяц', uk: '1 місяць', lv: '1 mēnesis' },
              price: '€19',
              per: { ru: '€19/мес', uk: '€19/міс', lv: '€19/mēn' },
              color: 'rgba(255,255,255,0.06)',
              border: 'rgba(255,255,255,0.1)',
              accent: 'rgba(255,255,255,0.4)',
            },
            {
              label: { ru: '6 месяцев', uk: '6 місяців', lv: '6 mēneši' },
              price: '€90',
              per: { ru: '€15/мес', uk: '€15/міс', lv: '€15/mēn' },
              saving: { ru: 'Экономия €24', uk: 'Економія €24', lv: 'Ietaupījums €24' },
              color: 'rgba(99,102,241,0.12)',
              border: 'rgba(99,102,241,0.35)',
              accent: '#a5b4fc',
            },
            {
              label: { ru: '1 год', uk: '1 рік', lv: '1 gads' },
              price: '€119.88',
              per: { ru: '€9.99/мес', uk: '€9.99/міс', lv: '€9.99/mēn' },
              saving: { ru: 'Экономия €108', uk: 'Економія €108', lv: 'Ietaupījums €108' },
              color: 'rgba(16,185,129,0.1)',
              border: 'rgba(52,211,153,0.35)',
              accent: '#6ee7b7',
            },
          ].map((item) => (
            <div key={item.price} style={{
              background: item.color, border: `1px solid ${item.border}`,
              borderRadius: '14px', padding: '14px 12px', textAlign: 'center',
            }}>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem', fontWeight: 700, margin: '0 0 4px' }}>{t(item.label)}</p>
              <p style={{ color: 'white', fontWeight: 900, fontSize: '1.1rem', margin: '0 0 2px' }}>{item.price}</p>
              <p style={{ color: item.accent, fontSize: '0.72rem', fontWeight: 800, margin: 0 }}>{t(item.per)}</p>
              {item.saving && <p style={{ color: item.accent, fontSize: '0.65rem', fontWeight: 700, margin: '4px 0 0', opacity: 0.8 }}>✓ {t(item.saving)}</p>}
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
          <p className="text-white/60 text-sm">
            🎁 {lang === 'lv'
              ? 'Pirmās 3 dienas — pilnīgi bez maksas. Reģistrējieties un novērtējiet Oris pirms maksāšanas.'
              : lang === 'uk'
              ? 'Перші 3 дні — повністю безкоштовно. Зареєструйтесь і оцініть Оріса до оплати.'
              : 'Первые 3 дня — полностью бесплатно. Зарегистрируйтесь и оцените Ориса до оплаты.'}
          </p>
          <p className="text-white/35 text-xs mt-2">
            {lang === 'lv'
              ? 'Abonements atjaunojas automātiski · Atcelšana jebkurā laikā'
              : lang === 'uk'
              ? 'Підписка поновлюється автоматично · Скасування в будь-який час'
              : 'Подписка продлевается автоматически · Отмена в любое время'}
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative z-10 px-6 pb-20 max-w-3xl mx-auto">
        <h2 className="text-center text-2xl font-black mb-2 text-white/80">
          {lang === 'lv' ? 'Biežāk uzdotie jautājumi' : lang === 'uk' ? 'Часті питання' : 'Частые вопросы'}
        </h2>
        <p className="text-center text-white/40 text-sm mb-10">
          {lang === 'lv' ? 'Atbildam godīgi' : lang === 'uk' ? 'Відповідаємо чесно' : 'Отвечаем честно'}
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
            <div className="text-5xl mb-4">🦉</div>
            <h2 className="text-2xl sm:text-3xl font-black mb-3">
              {lang === 'lv' ? 'Gatavi izmēģināt?' : lang === 'uk' ? 'Готові спробувати?' : 'Готовы попробовать?'}
            </h2>
            <p className="text-white/60 text-base mb-6 max-w-md mx-auto">
              {lang === 'lv'
                ? '3 dienas bez maksas — bez kartes, bez saistībām. Oris jau gaida jūsu bērnu.'
                : lang === 'uk'
                ? '3 дні безкоштовно — без картки, без зобов\'язань. Оріс вже чекає вашу дитину.'
                : '3 дня бесплатно — без карты, без обязательств. Орис уже ждёт вашего ребёнка.'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/register')}
              className="bg-indigo-500 hover:bg-indigo-400 text-white font-black text-lg px-12 py-4 rounded-2xl shadow-2xl shadow-indigo-500/40 transition-colors"
            >
              {lang === 'lv' ? '🚀 Sākt bez maksas' : lang === 'uk' ? '🚀 Почати безкоштовно' : '🚀 Начать бесплатно'}
            </motion.button>
            <p className="text-white/25 text-xs mt-4">
              {lang === 'lv'
                ? '3 dienas bez maksas · Abonements ar automātisku atjaunošanu · Atcelšana jebkurā laikā'
                : lang === 'uk'
                ? '3 дні безкоштовно · Підписка з автопоновленням · Скасування в будь-який час'
                : '3 дня бесплатно · Подписка с автопродлением · Отмена в любое время'}
            </p>
          </motion.div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative z-10 text-center pb-8 text-white/20 text-xs px-4">
        {lang === 'lv'
          ? 'Veidots ar mākslīgā intelekta palīdzību · Izstrādāts Latvijai · © 2026 SmartSkola'
          : lang === 'uk'
          ? 'Створено за допомогою штучного інтелекту · Розроблено для Латвії · © 2026 SmartШкола'
          : 'Создан с помощью искусственного интеллекта · Разработан для Латвии · © 2026 SmartШкола'}
      </footer>
    </div>
  );
}
