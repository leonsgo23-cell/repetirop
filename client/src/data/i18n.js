/**
 * UI translations — Russian & Latvian
 */
export const UI = {
  welcome: {
    title:      { ru: 'Магия Знаний',  lv: 'Zināšanu Maģija' },
    subtitle:   { ru: 'Интерактивный репетитор для школьников Латвии',
                  lv: 'Interaktīvs mācību palīgs Latvijas skolēniem' },
    pickLang:   { ru: 'Выбери язык обучения', lv: 'Izvēlies mācību valodu' },
  },
  setup: {
    title:        { ru: 'Расскажи о себе!', lv: 'Pastāsti par sevi!' },
    nameLabel:    { ru: 'Как тебя зовут?', lv: 'Kā tevi sauc?' },
    namePlaceholder: { ru: 'Введи своё имя…', lv: 'Ievadi savu vārdu…' },
    gradeLabel:   { ru: 'Выбери свой класс', lv: 'Izvēlies savu klasi' },
    gradeSuffix:  { ru: 'кл.', lv: 'kl.' },
    cta:          { ru: 'Начать приключение! 🚀', lv: 'Sākt piedzīvojumu! 🚀' },
  },
  dashboard: {
    hi:            { ru: 'Привет',       lv: 'Sveiki' },
    grade:         { ru: 'класс',        lv: 'klase' },
    level:         { ru: 'Уровень',      lv: 'Līmenis' },
    xp:            { ru: 'XP',           lv: 'XP' },
    streak:        { ru: 'Дней подряд',  lv: 'Dienas pēc kārtas' },
    subjects:      { ru: 'Выбери предмет', lv: 'Izvēlies priekšmetu' },
    achievements:  { ru: 'Достижения',   lv: 'Sasniegumi' },
    noAchievements:{ ru: 'Пройди первый урок!', lv: 'Pabeigt pirmo nodarbību!' },
    topicsCount:   { ru: 'тем',          lv: 'tēmas' },
    doneSuffix:    { ru: 'пройдено',     lv: 'pabeigtas' },
    changeLang:    { ru: 'Сменить язык', lv: 'Mainīt valodu' },
    changeGrade:   { ru: 'Сменить класс', lv: 'Mainīt klasi' },
  },
  topics: {
    back:       { ru: '← Назад',         lv: '← Atpakaļ' },
    start:      { ru: 'Начать урок →',   lv: 'Sākt nodarbību →' },
    completed:  { ru: '✓ Пройдено',      lv: '✓ Pabeigts' },
    xpReward:   { ru: 'до XP',           lv: 'XP' },
  },
  tutor: {
    back:        { ru: '← К темам',      lv: '← Uz tēmām' },
    placeholder: { ru: 'Напиши свой ответ…', lv: 'Raksti savu atbildi…' },
    send:        { ru: 'Отправить',      lv: 'Nosūtīt' },
    thinking:    { ru: 'Орис думает…',  lv: 'Oris domā…' },
    hint:        { ru: '💡 Подсказка',   lv: '💡 Mājiena' },
    exitConfirm: { ru: 'Выйти из урока? Прогресс будет сохранён.', lv: 'Iziet no nodarbības? Progress tiks saglabāts.' },
    session:     { ru: 'Урок',           lv: 'Nodarbība' },
  },
  achievements: {
    first_lesson:      { ru: '🌟 Первый урок!',    lv: '🌟 Pirmā nodarbība!' },
    math_explorer:     { ru: '🔢 Математик',        lv: '🔢 Matemātiķis' },
    english_explorer:  { ru: '🌍 Полиглот',         lv: '🌍 Poliglots'             },
    latvian_explorer:  { ru: '🇱🇻 Знаток латышского', lv: '🇱🇻 Latviešu eksperts' },
    level_5:           { ru: '⚡ Уровень 5',         lv: '⚡ 5. Līmenis' },
    streak_7:          { ru: '🔥 Неделя подряд',    lv: '🔥 Nedēļa pēc kārtas' },
    speed_demon:       { ru: '⚡ Молниеносный',      lv: '⚡ Ātrais' },
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
