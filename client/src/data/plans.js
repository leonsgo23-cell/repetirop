// Centralized plan definitions — used by Subscribe.jsx and Landing.jsx

export const STRIPE_LINKS = {
  '1mo':  'https://buy.stripe.com/4gM3cpcbX6wY6ho0df5Rm04',
  '6mo':  'https://buy.stripe.com/4gMaER7VH2gIgW2aRT5Rm05',
  '12mo': 'https://buy.stripe.com/4gMeV7dg15sU35c4tv5Rm06',
};

export const PLANS = [
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
