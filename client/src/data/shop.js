export const SHOP_ITEMS = [
  {
    id: 'streak_shield',
    icon: '🛡️',
    cost: 100,
    stateKey: 'streakShields',
    name: { ru: 'Щит серии', uk: 'Щит серії', lv: 'Sērijas vairogs' },
    desc: {
      ru: 'Защитит серию, если пропустишь 1 день',
      uk: 'Захистить серію, якщо пропустиш 1 день',
      lv: 'Pasargās sēriju, ja izlaidīsi 1 dienu',
    },
  },
  {
    id: 'xp_boost',
    icon: '⚡',
    cost: 75,
    stateKey: 'xpBoostCharges',
    name: { ru: 'Буст XP ×2', uk: 'Буст XP ×2', lv: 'XP Uzlabojums ×2' },
    desc: {
      ru: 'Удвоит XP в следующей сессии',
      uk: 'Подвоїть XP у наступній сесії',
      lv: 'Dubultos XP nākamajā sesijā',
    },
  },
  {
    id: 'hint_token',
    icon: '💡',
    cost: 40,
    stateKey: 'hintTokens',
    name: { ru: 'Жетон подсказки', uk: 'Жетон підказки', lv: 'Mājiena žetons' },
    desc: {
      ru: 'Кнопка «Намекни» в уроке — Орис поможет без штрафа',
      uk: 'Кнопка «Підкажи» в уроці — Оріс допоможе без штрафу',
      lv: 'Poga «Māj» nodarbībā — Oris palīdzēs bez soda',
    },
  },
];

export const TITLES = [
  { id: 'spark',    icon: '⚡', cost: 80,  name: { ru: 'Искра',    uk: 'Іскра',    lv: 'Dzirkstele' } },
  { id: 'scholar',  icon: '📚', cost: 120, name: { ru: 'Знаток',   uk: 'Знавець',  lv: 'Zinātājs'   } },
  { id: 'star',     icon: '⭐', cost: 180, name: { ru: 'Звезда',   uk: 'Зірка',    lv: 'Zvaigzne'   } },
  { id: 'genius',   icon: '🧠', cost: 250, name: { ru: 'Гений',    uk: 'Геній',    lv: 'Ģēnijs'     } },
  { id: 'champion', icon: '🏆', cost: 350, name: { ru: 'Чемпион',  uk: 'Чемпіон',  lv: 'Čempions'   } },
  { id: 'legend',   icon: '👑', cost: 500, name: { ru: 'Легенда',  uk: 'Легенда',  lv: 'Leģenda'    } },
];
