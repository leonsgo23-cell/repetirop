/**
 * UI translations — Russian, Ukrainian & Latvian
 */
export const UI = {
  welcome: {
    title:      { ru: 'SmartШкола',  uk: 'SmartШкола',  lv: 'SmartSkola' },
    subtitle:   { ru: 'Интерактивный репетитор для школьников Латвии',
                  uk: 'Інтерактивний репетитор для школярів Латвії',
                  lv: 'Interaktīvs mācību palīgs Latvijas skolēniem' },
    pickLang:   { ru: 'Выбери язык обучения', uk: 'Вибери мову навчання', lv: 'Izvēlies mācību valodu' },
  },
  setup: {
    title:        { ru: 'Расскажи о себе!',    uk: 'Розкажи про себе!',     lv: 'Pastāsti par sevi!' },
    nameLabel:    { ru: 'Как тебя зовут?',     uk: 'Як тебе звати?',        lv: 'Kā tevi sauc?' },
    namePlaceholder: { ru: 'Введи своё имя…',  uk: 'Введи своє ім\'я…',     lv: 'Ievadi savu vārdu…' },
    gradeLabel:   { ru: 'Выбери свой класс',   uk: 'Вибери свій клас',      lv: 'Izvēlies savu klasi' },
    gradeSuffix:  { ru: 'кл.',                 uk: 'кл.',                   lv: 'kl.' },
    cta:          { ru: 'Начать приключение! 🚀', uk: 'Почати пригоду! 🚀', lv: 'Sākt piedzīvojumu! 🚀' },
  },
  dashboard: {
    hi:            { ru: 'Привет',          uk: 'Привіт',           lv: 'Sveiki' },
    grade:         { ru: 'класс',           uk: 'клас',             lv: 'klase' },
    level:         { ru: 'Уровень',         uk: 'Рівень',           lv: 'Līmenis' },
    xp:            { ru: 'XP',              uk: 'XP',               lv: 'XP' },
    streak:        { ru: 'Дней подряд',     uk: 'Днів поспіль',     lv: 'Dienas pēc kārtas' },
    subjects:      { ru: 'Выбери предмет',  uk: 'Вибери предмет',   lv: 'Izvēlies priekšmetu' },
    achievements:  { ru: 'Достижения',      uk: 'Досягнення',       lv: 'Sasniegumi' },
    noAchievements:{ ru: 'Пройди первый урок!', uk: 'Пройди перший урок!', lv: 'Pabeigt pirmo nodarbību!' },
    topicsCount:   { ru: 'тем',             uk: 'тем',              lv: 'tēmas' },
    doneSuffix:    { ru: 'пройдено',        uk: 'пройдено',         lv: 'pabeigtas' },
    changeLang:    { ru: 'Сменить язык',    uk: 'Змінити мову',     lv: 'Mainīt valodu' },
    changeGrade:   { ru: 'Сменить класс',   uk: 'Змінити клас',     lv: 'Mainīt klasi' },
  },
  topics: {
    back:       { ru: '← Назад',           uk: '← Назад',          lv: '← Atpakaļ' },
    start:      { ru: 'Начать урок →',     uk: 'Почати урок →',    lv: 'Sākt nodarbību →' },
    completed:  { ru: '✓ Пройдено',        uk: '✓ Пройдено',       lv: '✓ Pabeigts' },
    xpReward:   { ru: 'до XP',             uk: 'до XP',            lv: 'XP' },
  },
  tutor: {
    back:        { ru: '← К темам',        uk: '← До тем',         lv: '← Uz tēmām' },
    placeholder: { ru: 'Напиши свой ответ…', uk: 'Напиши свою відповідь…', lv: 'Raksti savu atbildi…' },
    send:        { ru: 'Отправить',        uk: 'Надіслати',         lv: 'Nosūtīt' },
    thinking:    { ru: 'Орис думает…',     uk: 'Оріс думає…',      lv: 'Oris domā…' },
    hint:        { ru: '💡 Подсказка',     uk: '💡 Підказка',      lv: '💡 Mājiena' },
    exitConfirm: { ru: 'Выйти из урока? Прогресс будет сохранён.', uk: 'Вийти з уроку? Прогрес буде збережено.', lv: 'Iziet no nodarbības? Progress tiks saglabāts.' },
    session:     { ru: 'Урок',             uk: 'Урок',              lv: 'Nodarbība' },
  },
  achievements: {
    first_lesson:      { ru: '🌟 Первый урок!',          uk: '🌟 Перший урок!',         lv: '🌟 Pirmā nodarbība!' },
    math_explorer:     { ru: '🔢 Математик',              uk: '🔢 Математик',             lv: '🔢 Matemātiķis' },
    english_explorer:  { ru: '🌍 Полиглот',               uk: '🌍 Поліглот',              lv: '🌍 Poliglots' },
    latvian_explorer:  { ru: '🇱🇻 Знаток латышского',     uk: '🇱🇻 Знавець латиської',    lv: '🇱🇻 Latviešu eksperts' },
    level_5:           { ru: '⚡ Уровень 5',               uk: '⚡ Рівень 5',              lv: '⚡ 5. Līmenis' },
    streak_7:          { ru: '🔥 Неделя подряд',          uk: '🔥 Тиждень поспіль',       lv: '🔥 Nedēļa pēc kārtas' },
    speed_demon:       { ru: '⚡ Молниеносный',            uk: '⚡ Блискавичний',           lv: '⚡ Ātrais' },
  },
};

export const t = (path, lang = 'ru') => {
  const keys = path.split('.');
  let node = UI;
  for (const k of keys) {
    node = node?.[k];
    if (node === undefined) return path;
  }
  return node?.[lang] ?? node?.ru ?? path;
};
