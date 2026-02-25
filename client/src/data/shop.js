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
];

export const CHALLENGE_COST = 50;

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
