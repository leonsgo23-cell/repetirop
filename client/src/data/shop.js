export const SHOP_ITEMS = [
  {
    id: 'streak_shield',
    icon: '🛡️',
    cost: 100,
    stateKey: 'streakShields',
    name: { ru: 'Щит серии', lv: 'Sērijas vairogs' },
    desc: {
      ru: 'Защитит серию, если пропустишь 1 день',
      lv: 'Pasargās sēriju, ja izlaidīsi 1 dienu',
    },
  },
  {
    id: 'xp_boost',
    icon: '⚡',
    cost: 75,
    stateKey: 'xpBoostCharges',
    name: { ru: 'Буст XP ×2', lv: 'XP Uzlabojums ×2' },
    desc: {
      ru: 'Удвоит XP в следующей сессии',
      lv: 'Dubultos XP nākamajā sesijā',
    },
  },
  {
    id: 'hint_token',
    icon: '💡',
    cost: 40,
    stateKey: 'hintTokens',
    name: { ru: 'Жетон подсказки', lv: 'Mājiena žetons' },
    desc: {
      ru: 'Кнопка «Намекни» в уроке — Зефир поможет без штрафа',
      lv: 'Poga «Māj» nodarbībā — Zefīrs palīdzēs bez soda',
    },
  },
  {
    id: 'chat_token',
    icon: '💬',
    cost: 30,
    stateKey: 'chatTokens',
    name: { ru: 'Жетон чата', lv: 'Tērzēšanas žetons' },
    desc: {
      ru: 'Поговори с Зефиром о чём угодно — загадки, факты, истории',
      lv: 'Runā ar Zefīru par jebko — mīklas, fakti, stāsti',
    },
  },
];

export const TITLES = [
  { id: 'spark',    icon: '⚡', cost: 80,  name: { ru: 'Искра',    lv: 'Dzirkstele' } },
  { id: 'scholar',  icon: '📚', cost: 120, name: { ru: 'Знаток',   lv: 'Zinātājs'   } },
  { id: 'star',     icon: '⭐', cost: 180, name: { ru: 'Звезда',   lv: 'Zvaigzne'   } },
  { id: 'genius',   icon: '🧠', cost: 250, name: { ru: 'Гений',    lv: 'Ģēnijs'     } },
  { id: 'champion', icon: '🏆', cost: 350, name: { ru: 'Чемпион',  lv: 'Čempions'   } },
  { id: 'legend',   icon: '👑', cost: 500, name: { ru: 'Легенда',  lv: 'Leģenda'    } },
];

export const THEMES = [
  {
    id: 'default',
    icon: '🟣',
    cost: 0,
    bg: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    name: { ru: 'Стандарт', lv: 'Standarts' },
  },
  {
    id: 'ocean',
    icon: '🌊',
    cost: 150,
    bg: 'linear-gradient(135deg, #0c1445, #1a4b7a, #0d3b5e)',
    name: { ru: 'Океан', lv: 'Okeāns' },
  },
  {
    id: 'fire',
    icon: '🔥',
    cost: 150,
    bg: 'linear-gradient(135deg, #2d0800, #7c1c0a, #3d1200)',
    name: { ru: 'Огонь', lv: 'Uguns' },
  },
  {
    id: 'forest',
    icon: '🌿',
    cost: 200,
    bg: 'linear-gradient(135deg, #0a1f0c, #1a4020, #0d2814)',
    name: { ru: 'Лес', lv: 'Mežs' },
  },
  {
    id: 'galaxy',
    icon: '🌌',
    cost: 300,
    bg: 'linear-gradient(135deg, #080018, #1e0052, #0d001e)',
    name: { ru: 'Галактика', lv: 'Galaktika' },
  },
];

// Challenges — free when topic 4/4 completed (no purchase needed)
export const CHALLENGE_TYPES = [
  {
    id: 'speed',
    icon: '⚡',
    name: { ru: 'Скоростной вызов', lv: 'Ātruma izaicinājums' },
    desc: { ru: '5 вопросов · 60 сек · двойной XP', lv: '5 jautājumi · 60 sek · dubults XP' },
  },
  {
    id: 'boss',
    icon: '💀',
    name: { ru: 'Бой с боссом', lv: 'Bosss cīņa' },
    desc: { ru: '3 жизни · сложные вопросы · +75 XP', lv: '3 dzīvības · grūti jautājumi · +75 XP' },
  },
];
