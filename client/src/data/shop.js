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
      ru: 'Кнопка «Намекни» в уроке — Орис поможет без штрафа',
      lv: 'Poga «Māj» nodarbībā — Oris palīdzēs bez soda',
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

