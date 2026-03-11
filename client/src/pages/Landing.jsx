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

// CHANGE 12: restructured PLANS with monthlyPrice and totalLabel
const PLANS = [
  {
    id: '1mo',
    label: { ru: '1 месяц', uk: '1 місяць', lv: '1 mēnesis' },
    monthlyPrice: '€19',
    per: { ru: '/мес', uk: '/міс', lv: '/mēn' },
    totalLabel: null,
    badge: null,
  },
  {
    id: '6mo',
    label: { ru: '6 месяцев', uk: '6 місяців', lv: '6 mēneši' },
    monthlyPrice: '€15',
    per: { ru: '/мес', uk: '/міс', lv: '/mēn' },
    totalLabel: { ru: '€90 при единовременной оплате', uk: '€90 при одноразовій оплаті', lv: '€90 vienreizējā maksājumā' },
    badge: { ru: 'Популярный', uk: 'Популярний', lv: 'Populārs' },
    highlight: true,
  },
  {
    id: '12mo',
    label: { ru: '1 год', uk: '1 рік', lv: '1 gads' },
    monthlyPrice: '€9.99',
    per: { ru: '/мес', uk: '/міс', lv: '/mēn' },
    totalLabel: { ru: '€119.88 при единовременной оплате', uk: '€119.88 при одноразовій оплаті', lv: '€119.88 vienreizējā maksājumā' },
    badge: { ru: 'Лучшая цена', uk: 'Найкраща ціна', lv: 'Labākā cena' },
  },
];

// CHANGE 11: added exam prep feature at the end; CHANGE 7: updated 🕐 desc; CHANGE 2: "репетитор Орис" in homework desc
const FEATURES = [
  {
    icon: '🏛️',
    title: { ru: 'Наши преимущества', uk: 'Наші переваги', lv: 'Mūsu priekšrocības' },
    desc: {
      ru: 'Математика, английский и латышский — 3 предмета в одной подписке. Все темы строго по официальной программе Министерства образования Латвии (Skola2030). Ребёнок учится именно тому, что нужно в его школе.',
      uk: 'Математика, англійська та латиська — 3 предмети в одній підписці. Всі теми суворо за офіційною програмою Міністерства освіти Латвії (Skola2030). Дитина вчиться саме те, що потрібно в її школі.',
      lv: 'Matemātika, angļu un latviešu — 3 priekšmeti vienā abonementā. Visas tēmas pēc Latvijas IZM oficiālās programmas (Skola2030). Bērns mācās tieši to, kas vajadzīgs viņa skolā.',
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
      // CHANGE 7: updated description
      ru: 'В любое время — перед контрольной или в 18:00 после школы. Любые темы по программе обучения можно обсудить с репетитором в удобное время, без записи и ожидания.',
      uk: 'У будь-який час — перед контрольною або о 18:00 після школи. Будь-які теми навчальної програми можна обговорити з репетитором у зручний час, без запису та очікування.',
      lv: 'Jebkurā laikā — pirms kontroldarba vai 18:00 pēc skolas. Jebkuras mācību programmas tēmas var apspriest ar pasniedzēju ērtā laikā, bez pieraksta un gaidīšanas.',
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
      // CHANGE 2: "репетитор Орис разберёт"
      ru: 'Загрузите фото задания — репетитор Орис разберёт ход решения и объяснит шаг за шагом. Не просто даст ответ, а научит думать.',
      uk: 'Завантажте фото завдання — репетитор Оріс розбере хід розв\'язання і пояснить крок за кроком. Не просто дасть відповідь, а навчить думати.',
      lv: 'Ielādējiet uzdevuma foto — repetitors Oris izskaidros risinājuma gaitu soli pa solim. Ne tikai dos atbildi, bet iemācīs domāt.',
    },
  },
  {
    // CHANGE 11: new exam prep feature
    icon: '🎯',
    title: { ru: 'Подготовка к контрольным и ЦЭ', uk: 'Підготовка до контрольних та ЦЕ', lv: 'Sagatavošanās kontroldarbiem un CE' },
    desc: {
      ru: 'Завтра контрольная? Репетитор Орис поможет повторить тему, разобрать типичные ошибки и потренироваться на задачах нужного формата. Для 9 и 12 класса — подготовка по структуре централизованных экзаменов.',
      uk: 'Завтра контрольна? Репетитор Оріс допоможе повторити тему, розібрати типові помилки та потренуватись на завданнях потрібного формату. Для 9 і 12 класу — підготовка за структурою централізованих іспитів.',
      lv: 'Rīt kontroldarbs? Repetitors Oris palīdzēs atkārtot tēmu, izanalizēt tipiskās kļūdas un trenēties vajadzīgā formāta uzdevumos. 9. un 12. klasei — sagatavošanās pēc CE struktūras.',
    },
  },
];

// CHANGE 2: step 4 title updated
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
    // CHANGE 2: "Репетитор Орис начинает урок"
    title: { ru: 'Репетитор Орис начинает урок', uk: 'Репетитор Оріс починає урок', lv: 'Repetitors Oris sāk nodarbību' },
    desc: { ru: 'Диалог, вопросы, объяснения и XP — ребёнок растёт с каждым занятием', uk: 'Діалог, запитання, пояснення та XP — дитина зростає з кожним заняттям', lv: 'Dialogs, jautājumi, skaidrojumi un XP — bērns aug ar katru nodarbību' },
  },
];

// CHANGE 10: added new FAQ entry at the end
const FAQ = [
  {
    q: { ru: 'Что будет после 3 дней бесплатного доступа?', uk: 'Що буде після 3 днів безкоштовного доступу?', lv: 'Kas notiek pēc 3 dienu bezmaksas piekļuves?' },
    a: { ru: 'Выбранная вами подписка автоматически вступит в силу по истечении трёх дней бесплатного доступа. Но в течение этих трёх дней вы в любой момент сможете отказаться от услуги. Вы также можете отменить её в любое время через раздел «Аккаунт» — без звонков и ожиданий.', uk: 'Вибрана вами підписка автоматично набере чинності після закінчення трьох днів безкоштовного доступу. Але протягом цих трьох днів ви в будь-який момент зможете відмовитися від послуги. Ви також можете скасувати її в будь-який час через розділ «Акаунт» — без дзвінків і очікування.', lv: 'Jūsu izvēlētais abonements automātiski stāsies spēkā pēc trīs bezmaksas dienu beigām. Taču šo trīs dienu laikā jūs jebkurā brīdī varat atteikties no pakalpojuma. Tāpat varat atcelt abonementu jebkurā laikā sadaļā «Konts» — bez zvaniem un gaidīšanas.' },
  },
  {
    q: { ru: 'Заменит ли репетитор Орис живого репетитора полностью?', uk: 'Чи замінить репетитор Оріс живого репетитора повністю?', lv: 'Vai repetitors Oris pilnībā aizstās dzīvu pasniedzēju?' },
    a: { ru: 'Для большинства задач — да. Объяснение темы, отработка упражнений, подготовка к контрольной, домашние задания — репетитор Орис справляется отлично. Для сложных индивидуальных случаев (например, дислексия) живой специалист всё ещё полезен.', uk: 'Для більшості завдань — так. Пояснення теми, відпрацювання вправ, підготовка до контрольної, домашні завдання — репетитор Оріс справляється відмінно. Для складних індивідуальних випадків (наприклад, дислексія) живий фахівець ще корисний.', lv: 'Lielākajai daļai uzdevumu — jā. Tēmas skaidrojums, vingrinājumu izstrāde, gatavošanās kontroldarbam, mājas darbi — repetitors Oris tiek galā labi. Sarežģītiem individuāliem gadījumiem (piem., disleksija) dzīvs speciālists joprojām ir noderīgs.' },
  },
  {
    q: { ru: 'Безопасно ли это для ребёнка?', uk: 'Чи це безпечно для дитини?', lv: 'Vai tas ir droši bērnam?' },
    a: { ru: 'Да. Репетитор Орис запрограммирован использовать только нейтральный академический язык, без нежелательного контента. Все ответы проходят через безопасный фильтр. Ребёнок видит только учебные задания и пояснения.', uk: 'Так. Репетитор Оріс запрограмований використовувати лише нейтральну академічну мову, без небажаного контенту. Всі відповіді проходять через безпечний фільтр. Дитина бачить лише навчальні завдання та пояснення.', lv: 'Jā. Repetitors Oris ir ieprogrammēts lietot tikai neitrālu akadēmisku valodu, bez nevēlama satura. Visas atbildes iet caur drošu filtru. Bērns redz tikai mācību uzdevumus un paskaidrojumus.' },
  },
  {
    q: { ru: 'Подписка продлевается автоматически?', uk: 'Підписка поновлюється автоматично?', lv: 'Vai abonements tiek automātiski pagarināts?' },
    a: { ru: 'Да, подписка продлевается автоматически — это удобно: ребёнок не теряет доступ в разгар учёбы. Но вы можете отменить её в любое удобное время через раздел «Аккаунт» — без звонков и ожиданий.', uk: 'Так, підписка поновлюється автоматично — це зручно: дитина не втрачає доступ у розпал навчання. Але ви можете скасувати її в будь-який зручний час через розділ «Акаунт» — без дзвінків і очікування.', lv: 'Jā, abonements tiek automātiski pagarināts — tas ir ērti: bērns nezaudē piekļuvi mācību vidū. Taču jūs varat to atcelt jebkurā ērtā laikā sadaļā «Konts» — bez zvaniem un gaidīšanas.' },
  },
  {
    q: { ru: 'Мой ребёнок в 8-м классе, а программа для всех с 1 по 12?', uk: 'Моя дитина в 8 класі, а програма для всіх з 1 по 12?', lv: 'Mans bērns ir 8. klasē, bet programma ir visiem no 1. līdz 12.?' },
    a: { ru: 'Именно так. Вы выбираете один конкретный класс при подписке, и репетитор Орис полностью адаптируется под этот уровень. Темы, сложность, стиль общения — всё соответствует возрасту.', uk: 'Саме так. Ви обираєте один конкретний клас при підписці, і репетитор Оріс повністю адаптується під цей рівень. Теми, складність, стиль спілкування — все відповідає віку.', lv: 'Tieši tā. Jūs izvēlaties vienu konkrētu klasi abonējot, un repetitors Oris pilnībā pielāgojas šim līmenim. Tēmas, sarežģītība, saziņas stils — viss atbilst vecumam.' },
  },
  {
    q: { ru: 'Сколько тем доступно?', uk: 'Скільки тем доступно?', lv: 'Cik tēmu ir pieejams?' },
    a: { ru: 'Сотни тем по трём предметам — математика, английский, латышский. Полное покрытие школьной программы для каждого класса с 1 по 12.', uk: 'Сотні тем з трьох предметів — математика, англійська, латиська. Повне охоплення шкільної програми для кожного класу з 1 по 12.', lv: 'Simtiem tēmu trijos priekšmetos — matemātika, angļu, latviešu. Pilns skolas programmas aptvērums katrai klasei no 1. līdz 12.' },
  },
  {
    // CHANGE 10: new FAQ entry about curriculum
    q: { ru: 'Откуда берётся учебная программа?', uk: 'Звідки береться навчальна програма?', lv: 'No kurienes nāk mācību programma?' },
    a: {
      ru: 'Все темы и задания строго соответствуют официальной программе Министерства образования Латвии (Skola2030). Источники: IZM (izm.gov.lv), Skola2030 (skola2030.lv), VISC (visc.gov.lv). Ничего не придумано — только то, что нужно знать по школьной программе.',
      uk: 'Всі теми та завдання суворо відповідають офіційній програмі Міністерства освіти Латвії (Skola2030). Джерела: IZM (izm.gov.lv), Skola2030 (skola2030.lv), VISC (visc.gov.lv). Нічого не вигадано — лише те, що потрібно знати за шкільною програмою.',
      lv: 'Visas tēmas un uzdevumi stingri atbilst Latvijas IZM oficiālajai programmai (Skola2030). Avoti: IZM (izm.gov.lv), Skola2030 (skola2030.lv), VISC (visc.gov.lv). Nekas nav izdomāts — tikai tas, kas jāzina pēc skolas programmas.',
    },
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { state, updateState } = useApp();
  const [lang, setLang] = useState(state.language || 'lv');
  const [openFaq, setOpenFaq] = useState(null);
  const [showOtherLangs, setShowOtherLangs] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState(null); // null | 'sending' | 'ok' | 'err'

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
          {/* CHANGE 1: new h1 text */}
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
            {lang === 'lv' ? (
              <>Pasniedzējs jūsu bērnam —<br /><span className="text-indigo-300">mierīgi vakari vecākiem</span></>
            ) : lang === 'uk' ? (
              <>Репетитор для вашої дитини —<br /><span className="text-indigo-300">спокійні вечори для батьків</span></>
            ) : (
              <>Репетитор для вашего ребёнка —<br /><span className="text-indigo-300">спокойные вечера для родителей</span></>
            )}
          </h1>
          {/* CHANGE 1: new subtitle text */}
          <p className="text-white/70 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            {lang === 'lv'
              ? 'Pasniedzējs skolēniem, veidots ar mākslīgā intelekta iespējām. Palīdz bērnam pildīt mājas darbus, saprast skolas tēmas un mācīties viegli un bez stresa. Vecākiem — atdod brīvos vakarus. Viņš skaidro materialus vienkāršā un bērnam saprotamā valodā un strādā pēc Latvijas skolas programmas.'
              : lang === 'uk'
              ? 'Репетитор для школярів, створений за допомогою штучного інтелекту. Допомагає дитині виконувати домашні завдання, розуміти шкільні теми і вчитися легко та без нервів. Батькам — повертає вільні вечори. Він пояснює матеріал простою та зрозумілою для дитини мовою і працює за шкільною програмою Латвії.'
              : 'Репетитор для школьников, созданный с помощью искусственного интеллекта. Помогает ребёнку выполнять домашние задания, понимать школьные темы и учиться легко и без нервов. Родителям — возвращает свободные вечера. Он объясняет материал простым и понятным для ребёнка языком и работает по школьной программе Латвии.'}
          </p>
          {/* CHANGE 1: removed the white/40 small line */}
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
                onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
                className="bg-indigo-500 hover:bg-indigo-400 text-white font-black text-lg px-10 py-4 rounded-2xl shadow-2xl shadow-indigo-500/30 transition-colors"
              >
                {lang === 'lv' ? '🚀 Izmēģināt bez maksas — 3 dienas' : lang === 'uk' ? '🚀 Спробувати безкоштовно — 3 дні' : '🚀 Попробовать бесплатно — 3 дня'}
              </motion.button>
              <p className="text-white/30 text-sm mt-3">
                {lang === 'lv' ? '3 dienas bez maksas · Atcelšana jebkurā laikā' : lang === 'uk' ? '3 дні безкоштовно · Скасування в будь-який час' : '3 дня бесплатно · Отмена в любое время'}
              </p>
            </>
          )}
        </motion.div>
      </section>

      {/* ── Орис ── */}
      {/* CHANGE 2: "онлайн репетитор Орис" in h2 and description */}
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
            {lang === 'lv' ? 'Iepazīstieties — tiešsaistes repetitors Oris' : lang === 'uk' ? 'Знайомтесь — онлайн репетитор Оріс' : 'Знакомьтесь — онлайн репетитор Орис'}
          </h2>
          <p className="text-white/65 text-base leading-relaxed max-w-xl mx-auto">
            {lang === 'lv'
              ? 'Tiešsaistes repetitors Oris — jaunās paaudzes pasniedzējs, kas izmanto mākslīgā intelekta iespējas. Viņš skaidro sarežģītu vienkāršiem vārdiem, uzdod jautājumus un gaida atbildi — kā īsts skolotājs. Oris pielāgojas katram: pirmklasniekam runā silti un ar humoru, vidusskolēnam — skaidri un konkrēti. Mācības norisinās dzīva dialoga formātā: jautājums — atbilde — nākamais solis.'
              : lang === 'uk'
              ? 'Онлайн репетитор Оріс — репетитор нового покоління, який використовує можливості штучного інтелекту. Він пояснює складне простими словами, ставить запитання та чекає відповіді — як справжній учитель. Оріс адаптується під кожного: для першокласника говорить тепло і з гумором, для старшокласника — чітко і по суті. Навчання відбувається у форматі живого діалогу: запитання — відповідь — наступний крок.'
              : 'Онлайн репетитор Орис — репетитор нового поколения, который использует возможности искусственного интеллекта. Он объясняет сложное простыми словами, задаёт вопросы и ждёт ответа — как настоящий учитель. Орис адаптируется под каждого: для первоклассника говорит тепло и с юмором, для старшеклассника — чётко и по делу. Обучение идёт в формате живого диалога: вопрос — ответ — следующий шаг.'}
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

      {/* CHANGE 4: intro text before subjects section */}
      <p className="text-center text-white/60 text-base mb-4 max-w-2xl mx-auto px-6">
        {lang === 'lv'
          ? 'SmartSkola ar repetitoru Oris jūs varat mācīties 3 priekšmetus — matemātiku, latviešu un angļu valodu.'
          : lang === 'uk'
          ? 'У SmartSkola з репетитором Оріс ви можете займатися з 3 предметів — математика, латиська та англійська.'
          : 'В SmartSkola с репетитором Орис вы можете заниматься по 3 предметам — математика, латышский и английский.'}
      </p>

      {/* ── Subjects block ── */}
      <section className="relative z-10 px-6 pb-20 max-w-5xl mx-auto">
        {/* CHANGE 5: new subjects header */}
        <h2 className="text-center text-2xl font-black mb-2 text-white/80">
          {lang === 'lv' ? '3 galvenie Latvijas skolas priekšmeti' : lang === 'uk' ? '3 ключових предмети латвійської школи' : '3 ключевых предмета латвийской школы'}
        </h2>
        <p className="text-center text-white/40 text-sm mb-10">
          {lang === 'lv'
            ? 'Matemātika, latviešu un angļu valoda — trīs galvenie priekšmeti, kas veido skolas zināšanu pamatu un nosaka eksāmenu rezultātus Latvijā.'
            : lang === 'uk'
            ? 'Математика, латиська та англійська — три ключових предмети, які формують основу шкільних знань і визначають результати іспитів у Латвії.'
            : 'Математика, латышский и английский — три ключевых предмета, которые формируют основу школьных знаний и определяют результаты экзаменов в Латвии.'}
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
                // CHANGE 2: "Репетитор Орис объясняет"
                ru: 'Математика — фундамент всего точного мышления. Она нужна для поступления в большинство вузов, сдачи ЦЭ и ежедневной логики. Репетитор Орис объясняет арифметику, алгебру, геометрию и статистику — по шагам, с примерами и живым диалогом.',
                uk: 'Математика — фундамент точного мислення. Вона потрібна для вступу до більшості вузів, складання ЦЕ та щоденної логіки. Репетитор Оріс пояснює арифметику, алгебру, геометрію та статистику — покроково, з прикладами та живим діалогом.',
                lv: 'Matemātika ir precīzās domāšanas pamats. Tā nepieciešama uzņemšanai augstskolās, CE kārtošanai un ikdienas loģikai. Repetitors Oris skaidro aritmētiku, algebru, ģeometriju un statistiku — soli pa solim, ar piemēriem.',
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
                // CHANGE 2: "Репетитор Орис тренирует"
                ru: 'Английский — второй обязательный язык в латвийских школах с 1 класса. Без него невозможно высшее образование, карьера и путешествия. Репетитор Орис тренирует грамматику, лексику, чтение и разговорные конструкции — на каждом уровне.',
                uk: 'Англійська — друга обов\'язкова мова в латвійських школах з 1 класу. Без неї неможлива вища освіта, кар\'єра та подорожі. Репетитор Оріс тренує граматику, лексику, читання та розмовні конструкції — на кожному рівні.',
                lv: 'Angļu valoda ir otrā obligātā valoda Latvijas skolās no 1. klases. Bez tās nav iespējama augstākā izglītība, karjera un ceļošana. Repetitors Oris trenē gramatiku, leksiku, lasīšanu un sarunvalodas konstrukcijas.',
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
                // CHANGE 2: "Репетитор Орис помогает"
                ru: 'Латышский — государственный язык страны. Его знание обязательно для получения гражданства, работы в государственных структурах и сдачи всех ключевых экзаменов. Репетитор Орис помогает освоить грамматику, правописание и работу с текстами.',
                uk: 'Латиська — державна мова країни. Знання латиської обов\'язкове для отримання громадянства, роботи в державних структурах та складання всіх ключових іспитів. Репетитор Оріс допомагає засвоїти граматику, правопис і роботу з текстами.',
                lv: 'Latviešu valoda ir valsts valoda. Tās zināšanas ir obligātas pilsonības iegūšanai, darbam valsts struktūrās un visu galveno eksāmenu kārtošanai. Repetitors Oris palīdz apgūt gramatiku, pareizrakstību un darbu ar tekstiem.',
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

      {/* CHANGE 6: New curriculum block before Features section */}
      <section className="relative z-10 px-6 pb-20 max-w-3xl mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8"
        >
          <div className="text-4xl mb-4 text-center">📖</div>
          <h2 className="text-2xl font-black mb-4 text-center">
            {lang === 'lv' ? 'Kā ir organizētas mācības' : lang === 'uk' ? 'Як влаштоване навчання' : 'Как устроено обучение'}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            {lang === 'lv'
              ? 'Mācības SmartSkola ir veidotas pēc tēmām, kas pilnībā atbilst Latvijas IZM oficiālajai skolas programmai. Katrs priekšmets ir sadalīts ērtās tēmās un apakštēmās, lai bērnam būtu vieglāk saprast temu un pakāpeniski tikt galā pat ar sarežģītiem uzdevumiem.\n\nRepetitors skaidro tēmas caur secīgiem uzdevumiem un jautājumu un atbilžu dialoga formātā, pielāgojoties skolēna līmenim. Bērns var iet cauri programmai soli pa solim, kā skolā, vai izvēlēties tieši to tēmu, ar kuru radušās grūtības.\n\nTāpat skolēns var uzdot savus jautājumus un izanalizēt mājas darbus: pietiek ielādēt uzdevumu vai fotogrāfiju, un repetitors palīdzēs saprast risinājuma loģiku un kopā nonākt pie pareizās atbildes.'
              : lang === 'uk'
              ? 'Навчання у SmartSkola побудовано за темами, які повністю відповідають офіційній шкільній програмі Міністерства освіти Латвії. Кожен предмет поділено на зручні теми та підтеми, щоб дитині було легше зрозуміти матеріал і поступово розібратися навіть у складних завданнях.\n\nРепетитор пояснює теми через послідовні завдання та діалог у форматі запитань і відповідей, адаптуючись під рівень учня. Дитина може проходити програму крок за кроком, як у школі, або вибрати саме ту тему, з якою виникли труднощі.\n\nТакож учень може ставити власні запитання та розбирати домашні завдання: достатньо завантажити задачу або фотографію, і репетитор допоможе зрозуміти логіку розв\'язання і разом дійти до правильної відповіді.'
              : 'Обучение в SmartSkola построено по темам, которые полностью соответствуют официальной школьной программе Министерства образования Латвии. Каждый предмет разделён на удобные темы и подтемы, чтобы ребёнку было легче понять материал и постепенно разобраться даже в сложных заданиях.\n\nРепетитор объясняет темы через последовательные задания и диалог в формате вопросов и ответов, адаптируясь под уровень ученика. Ребёнок может проходить программу шаг за шагом, как в школе, или выбрать именно ту тему, с которой возникли трудности.\n\nТакже ученик может задавать собственные вопросы и разбирать домашние задания: достаточно загрузить задачу или фотографию, и репетитор поможет понять логику решения и вместе прийти к правильному ответу.'}
          </p>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            {[
              {
                icon: '⏱️',
                grade: { ru: '1–4 класс', uk: '1–4 клас', lv: '1.–4. klase' },
                time: { ru: '20–25 мин в день', uk: '20–25 хв на день', lv: '20–25 min dienā' },
              },
              {
                icon: '📚',
                grade: { ru: '5–8 класс', uk: '5–8 клас', lv: '5.–8. klase' },
                time: { ru: '30–35 мин в день', uk: '30–35 хв на день', lv: '30–35 min dienā' },
              },
              {
                icon: '🎓',
                grade: { ru: '9–12 класс', uk: '9–12 клас', lv: '9.–12. klase' },
                time: { ru: '40–45 мин в день', uk: '40–45 хв на день', lv: '40–45 min dienā' },
              },
            ].map((card) => (
              <div
                key={card.icon}
                className="bg-white/5 border border-white/10 rounded-2xl p-4"
              >
                <div className="text-2xl mb-2">{card.icon}</div>
                <p className="text-white/80 text-xs font-black mb-1">{t(card.grade)}</p>
                <p className="text-white/45 text-xs">{t(card.time)}</p>
              </div>
            ))}
          </div>
        </motion.div>
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
          {FEATURES.map((f, idx) => (
            <motion.div
              key={f.icon + idx}
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
      {/* CHANGE 2: comparison label "Репетитор Орис"; CHANGE 8: added travel time to cons */}
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
              {lang === 'lv' ? '👤 Dzīvs pasniedzējs' : lang === 'uk' ? '👤 Живий репетитор' : '👤 Живой репетитор'}
            </p>
            {(lang === 'lv'
              ? ['€20–40 par vienu stundu', 'Tikai pēc grafika', 'Viens priekšmets', 'Gaidāt brīvu laiku', 'Laiks ceļam uz pasniedzēju un atpakaļ']
              : lang === 'uk'
              ? ['€20–40 за один урок', 'Тільки за розкладом', 'Один предмет', 'Очікуєте вільного часу', 'Витрачається час на дорогу до репетитора і назад']
              : ['€20–40 за один урок', 'Только по расписанию', 'Один предмет', 'Ждёте свободного времени', 'Время на дорогу к репетитору и обратно']
            ).map((item) => (
              <p key={item} className="text-white/40 text-sm mb-2 flex items-start gap-2">
                <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>{item}
              </p>
            ))}
          </div>
          <div className="bg-indigo-600/15 border border-indigo-400/30 rounded-2xl p-5">
            <p className="font-black text-indigo-300 text-sm mb-4">
              🦉 {lang === 'lv' ? 'Repetitors Oris' : lang === 'uk' ? 'Репетитор Оріс' : 'Репетитор Орис'}
            </p>
            {(lang === 'lv'
              ? ['no €9.99 mēnesī', 'Jebkurā laikā 24/7', '3 priekšmeti abonementā', 'Tūlītējs starts', 'XP, līmeņi, sasniegumi', 'Skaidro 3 valodās', 'Nodarbību vēsture un progress']
              : lang === 'uk'
              ? ['від €9.99 на місяць', 'У будь-який час 24/7', '3 предмети у підписці', 'Старт миттєво', 'XP, рівні, досягнення', 'Пояснює 3 мовами', 'Статистика та прогрес']
              : ['от €9.99 в месяц', 'В любое время 24/7', '3 предмета в подписке', 'Старт мгновенно', 'XP, уровни, достижения', 'Объясняет на 3 языках', 'Статистика и прогресс']
            ).map((item) => (
              <p key={item} className="text-white/80 text-sm mb-2 flex items-start gap-2">
                <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>{item}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      {/* CHANGE 12: restructured price display; CHANGE 13: "Приобрести"; CHANGE 14: "3 дня бесплатно" */}
      <section id="pricing" className="relative z-10 px-6 pb-20 max-w-5xl mx-auto">
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
              <div className="text-4xl font-black mb-0.5">{p.monthlyPrice}</div>
              <div className="text-white/50 text-xs mb-1">{t(p.per)}</div>
              {p.totalLabel && <div className="text-white/30 text-xs mb-3">{t(p.totalLabel)}</div>}
              <ul className="text-white/40 text-xs mt-2 mb-4 flex flex-col gap-1">
                {/* CHANGE 14: "3 дня бесплатно" as first item */}
                <li>🎁 {lang === 'lv' ? '3 dienas bez maksas' : lang === 'uk' ? '3 дні безкоштовно' : '3 дня бесплатно'}</li>
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
                  {/* CHANGE 13: "Приобрести" */}
                  {lang === 'lv' ? 'Iegādāties' : lang === 'uk' ? 'Придбати' : 'Приобрести'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Future subjects promo block ── */}
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative rounded-2xl overflow-hidden border border-indigo-400/30"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.12) 50%, rgba(16,185,129,0.08) 100%)' }}
        >
          {/* Glow accent */}
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div className="relative z-10 p-8 sm:p-10">
            <div className="flex items-start gap-4">
              <div style={{ fontSize: '2.4rem', lineHeight: 1, flexShrink: 0 }}>🚀</div>
              <div>
                <p className="text-xs font-black tracking-widest uppercase text-indigo-300/70 mb-2">
                  {lang === 'lv' ? 'Projekts attīstās' : lang === 'uk' ? 'Проект розвивається' : 'Проект развивается'}
                </p>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-3 leading-snug">
                  {lang === 'lv'
                    ? 'Drīzumā: ķīmija, fizika, bioloģija un vēl vairāk'
                    : lang === 'uk'
                    ? 'Незабаром: хімія, фізика, біологія та інші предмети'
                    : 'Скоро: химия, физика, биология и другие предметы'}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed mb-6 max-w-2xl">
                  {lang === 'lv'
                    ? 'Mēs strādājam pie jaunu priekšmetu pievienošanas, kas palīdzēs Latvijas skolēniem sekmīgi mācīties un veiksmīgi kārtot eksāmenus. Tie, kas šodien iegādājas abonementu uz 6 vai 12 mēnešiem — saņem visus jaunos priekšmetus bez papildu maksas. Pārējiem tie būs pieejami par papildu samaksu.'
                    : lang === 'uk'
                    ? 'Ми активно розробляємо нові предмети, які допоможуть школярам Латвії впевнено вчитися та успішно складати іспити. Ті, хто придбає підписку на 6 або 12 місяців зараз, отримають усі нові предмети у складі своєї підписки без доплати. Для решти нові предмети будуть доступні за додаткову вартість.'
                    : 'Мы активно разрабатываем новые предметы, которые помогут школьникам Латвии уверенно учиться и успешно сдавать экзамены. Те, кто приобретёт подписку на 6 или 12 месяцев сейчас — получат все новые предметы в составе своей подписки без доплаты. Для остальных новые предметы будут доступны за дополнительную стоимость.'}
                </p>

                {/* Subject chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {['⚗️ ' + (lang === 'lv' ? 'Ķīmija' : lang === 'uk' ? 'Хімія' : 'Химия'),
                    '⚡ ' + (lang === 'lv' ? 'Fizika' : lang === 'uk' ? 'Фізика' : 'Физика'),
                    '🌿 ' + (lang === 'lv' ? 'Bioloģija' : lang === 'uk' ? 'Біологія' : 'Биология'),
                    '🗺️ ' + (lang === 'lv' ? 'Ģeogrāfija' : lang === 'uk' ? 'Географія' : 'География'),
                    '📖 ' + (lang === 'lv' ? 'Vēsture' : lang === 'uk' ? 'Історія' : 'История'),
                  ].map((s) => (
                    <span key={s} className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/60">
                      {s}
                    </span>
                  ))}
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/35">
                    {lang === 'lv' ? '+ vēl...' : lang === 'uk' ? '+ ще...' : '+ ещё...'}
                  </span>
                </div>

                {/* CTA row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <button
                    onClick={() => navigate('/register')}
                    className="px-8 py-3 rounded-xl font-black text-sm text-white transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}
                  >
                    {lang === 'lv' ? '🔒 Iegādāties izdevīgāk tagad' : lang === 'uk' ? '🔒 Обрати вигідні умови зараз' : '🔒 Выбрать выгодные условия сейчас'}
                  </button>
                  <p className="text-white/35 text-xs leading-relaxed">
                    {lang === 'lv'
                      ? '6 vai 12 mēneši — jaunie priekšmeti iekļauti bez maksas'
                      : lang === 'uk'
                      ? '6 або 12 місяців — нові предмети включені без доплати'
                      : '6 или 12 месяцев — новые предметы включены без доплаты'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

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
      {/* CHANGE 2: "Репетитор Орис уже ждёт вашего ребёнка." */}
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
                ? '3 dienas bez maksas — bez kartes, bez saistībām. Repetitors Oris jau gaida jūsu bērnu.'
                : lang === 'uk'
                ? '3 дні безкоштовно — без картки, без зобов\'язань. Репетитор Оріс вже чекає вашу дитину.'
                : '3 дня бесплатно — без карты, без обязательств. Репетитор Орис уже ждёт вашего ребёнка.'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
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

      {/* ── Contact form ── */}
      <section className="relative z-10 px-6 pb-20 max-w-2xl mx-auto">
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-10"
        >
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">💬</div>
            <h2 className="text-xl font-black text-white">
              {lang === 'lv' ? 'Palika jautājumi?' : lang === 'uk' ? 'Залишились питання?' : 'Остались вопросы?'}
            </h2>
            <p className="text-white/45 text-sm mt-1">
              {lang === 'lv' ? 'Rakstiet — atbildēsim tuvākajā laikā' : lang === 'uk' ? 'Напишіть — відповімо найближчим часом' : 'Напишите — ответим в ближайшее время'}
            </p>
          </div>

          {contactStatus === 'ok' ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-3">✅</div>
              <p className="text-green-400 font-black text-lg">
                {lang === 'lv' ? 'Ziņojums nosūtīts!' : lang === 'uk' ? 'Повідомлення надіслано!' : 'Сообщение отправлено!'}
              </p>
              <p className="text-white/40 text-sm mt-1">
                {lang === 'lv' ? 'Atbildēsim drīz.' : lang === 'uk' ? 'Відповімо найближчим часом.' : 'Ответим в ближайшее время.'}
              </p>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) return;
                setContactStatus('sending');
                try {
                  const r = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(contactForm),
                  });
                  setContactStatus(r.ok ? 'ok' : 'err');
                } catch {
                  setContactStatus('err');
                }
              }}
              className="flex flex-col gap-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder={lang === 'lv' ? 'Jūsu vārds' : lang === 'uk' ? 'Ваше ім\'я' : 'Ваше имя'}
                  value={contactForm.name}
                  onChange={(e) => setContactForm(f => ({ ...f, name: e.target.value }))}
                  required
                  className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-indigo-400 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(f => ({ ...f, email: e.target.value }))}
                  required
                  className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-indigo-400 transition-colors"
                />
              </div>
              <textarea
                placeholder={lang === 'lv' ? 'Jūsu jautājums vai ziņojums...' : lang === 'uk' ? 'Ваше питання або повідомлення...' : 'Ваш вопрос или сообщение...'}
                value={contactForm.message}
                onChange={(e) => setContactForm(f => ({ ...f, message: e.target.value }))}
                required
                rows={4}
                className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-indigo-400 transition-colors resize-none"
              />
              {contactStatus === 'err' && (
                <p className="text-red-400 text-xs text-center">
                  {lang === 'lv' ? 'Kļūda. Mēģiniet vēlreiz vai rakstiet uz e-pastu.' : lang === 'uk' ? 'Помилка. Спробуйте ще раз або напишіть на email.' : 'Ошибка. Попробуйте ещё раз или напишите на email.'}
                </p>
              )}
              <button
                type="submit"
                disabled={contactStatus === 'sending'}
                className="w-full py-3 rounded-xl font-black text-sm text-white transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 6px 20px rgba(99,102,241,0.35)' }}
              >
                {contactStatus === 'sending'
                  ? '⏳...'
                  : (lang === 'lv' ? '📨 Nosūtīt ziņojumu' : lang === 'uk' ? '📨 Надіслати повідомлення' : '📨 Отправить сообщение')}
              </button>
            </form>
          )}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 pb-10 pt-8 border-t border-white/10 mt-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-white/40 text-xs mb-8">
          {/* Company */}
          <div>
            <div className="text-white/70 font-black text-sm mb-2">SIA "AI Studija"</div>
            <div>Reģ. Nr. 40203671817</div>
            <div>Augusta Deglava iela 152 k-3 - 36</div>
            <div>Rīga, LV-1021</div>
          </div>
          {/* Contact */}
          <div>
            <div className="text-white/70 font-black text-sm mb-2">
              {lang === 'lv' ? 'Kontakti' : lang === 'uk' ? 'Контакти' : 'Контакты'}
            </div>
            <a href="mailto:ai.studija.riga@gmail.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              ai.studija.riga@gmail.com
            </a>
          </div>
          {/* Brand */}
          <div>
            <div className="text-white/70 font-black text-sm mb-2">SmartSkola</div>
            <div>
              {lang === 'lv'
                ? 'Veidots ar mākslīgā intelekta palīdzību · Izstrādāts Latvijai'
                : lang === 'uk'
                ? 'Створено за допомогою ШІ · Розроблено для Латвії'
                : 'Создан с помощью ИИ · Разработан для Латвии'}
            </div>
          </div>
        </div>
        <div className="text-center text-white/20 text-xs">
          © 2026 SIA "AI Studija" · SmartSkola
        </div>
      </footer>
    </div>
  );
}
