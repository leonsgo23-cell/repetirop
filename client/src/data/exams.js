/**
 * Latvia School Exams & Diagnostic Tests
 * Sources: visc.gov.lv, liis.lv
 *
 * Types:
 *  'ce'  — Centralizētais eksāmens (grades 9, 12)
 *  'dd'  — Diagnostiskais darbs (grades 3, 6)
 */

export const CATEGORIES = {
  algebra:      { ru: 'Алгебра',        lv: 'Algebra',        uk: 'Алгебра'        },
  geometry:     { ru: 'Геометрия',      lv: 'Ģeometrija',     uk: 'Геометрія'      },
  statistics:   { ru: 'Статистика',     lv: 'Statistika',     uk: 'Статистика'     },
  arithmetic:   { ru: 'Арифметика',     lv: 'Aritmētika',     uk: 'Арифметика'     },
  functions:    { ru: 'Функции',        lv: 'Funkcijas',      uk: 'Функції'        },
  probability:  { ru: 'Вероятность',    lv: 'Varbūtība',      uk: 'Імовірність'    },
  grammar:      { ru: 'Грамматика',     lv: 'Gramatika',      uk: 'Граматика'      },
  vocabulary:   { ru: 'Лексика',        lv: 'Leksika',        uk: 'Лексика'        },
  spelling:     { ru: 'Орфография',     lv: 'Pareizrakstība', uk: 'Орфографія'     },
  reading:      { ru: 'Чтение',         lv: 'Lasīšana',       uk: 'Читання'        },
  punctuation:  { ru: 'Пунктуация',     lv: 'Interpunkcija',  uk: 'Пунктуація'     },
};

// Numeric question (text input)
const q = (id, category, text_ru, text_lv, answer, points = 1, hint_ru = '') => ({
  id, category,
  text: { ru: text_ru, lv: text_lv, uk: text_ru },
  answer: String(answer), points,
  hint: { ru: hint_ru, lv: hint_ru, uk: hint_ru },
});

// Multiple choice question
const qc = (id, category, text_ru, text_lv, options, answer, points = 1, hint_ru = '') => ({
  id, category, type: 'choice',
  text: { ru: text_ru, lv: text_lv, uk: text_ru },
  options, answer: String(answer), points,
  hint: { ru: hint_ru, lv: hint_ru, uk: hint_ru },
});

const O = (...arr) => arr.map((text, i) => ({ key: String.fromCharCode(65 + i), text }));

// ═══════════════════════════════════════════════════════ МАТЕМАТИКА 9 КЛАСС ══

const MATH_9_2025 = [
  q(1,  'algebra',    'Реши уравнение: 4x + 9 = 25', 'Atrisini: 4x + 9 = 25', '4', 1, '4x = 16'),
  q(2,  'algebra',    'Разложи на множители: x² − 6x + 9. Запиши в виде (x − a)².', 'Sadaliet reizinātājos: x² − 6x + 9.', '(x-3)^2', 1, 'Полный квадрат: (x − 3)²'),
  q(3,  'arithmetic', 'Найди 15% от числа 340.', 'Atrodi 15% no skaitļa 340.', '51', 1, '340 × 0,15'),
  q(4,  'geometry',   'Катеты прямоугольного треугольника равны 5 и 12. Найди гипотенузу.', 'Taisnleņķa trijstūra kateti ir 5 un 12. Atrodi hipotenūzu.', '13', 1, '5² + 12² = 169 = 13²'),
  q(5,  'algebra',    'Реши неравенство: 3x + 2 > 11. Запиши наименьшее целое решение.', 'Atrisini: 3x + 2 > 11. Ieraksti mazāko veselo skaitli.', '4', 1, '3x > 9, x > 3 — наименьшее целое 4'),
  q(6,  'functions',  'Функция y = 3x − 1. При каком x значение y = 11?', 'Funkcija y = 3x − 1. Pie kāda x vērtība y = 11?', '4', 1),
  q(7,  'geometry',   'Площадь круга при r = 6 см. Используй π ≈ 3,14. Ответ в см².', 'Apļa laukums, ja r = 6 cm. Izmanto π ≈ 3,14.', '113.04', 2, 'S = πr² = 3,14 × 36'),
  q(8,  'algebra',    'Арифметическая прогрессия: 5, 11, 17, … Найди 6-й член.', 'Aritmētiskā progresija: 5, 11, 17, … Atrodi 6. locekli.', '35', 1, 'd = 6, a₆ = 5 + 5×6'),
  q(9,  'algebra',    'Реши систему: x + 2y = 8, x − y = 2. Найди y.', 'Atrisini sistēmu: x + 2y = 8, x − y = 2. Atrodi y.', '2', 2, 'Вычти второе из первого: 3y = 6'),
  q(10, 'probability','В мешке 3 красных и 7 синих шаров. Вероятность вытащить синий шар?', 'Maisā 3 sarkanas un 7 zilas bumbiņas. Varbūtība izvilkt zilu?', '0.7', 1, '7 / (3+7)'),
  q(11, 'geometry',   'Прямоугольник: периметр 46 см, длина на 7 см больше ширины. Найди площадь (см²).', 'Taisnstūris: perimetrs 46 cm, garums par 7 cm lielāks. Atrodi laukumu (cm²).', '120', 2, '2(a + a−7) = 46, a = 15, b = 8'),
  q(12, 'arithmetic', 'Найди НОД чисел 56 и 84.', 'Atrodi skaitļu 56 un 84 LKD.', '28', 1, 'Разложи оба числа на простые множители'),
];

const MATH_9_2024 = [
  q(1,  'algebra',    'Реши уравнение: 3x − 7 = 11', 'Atrisini: 3x − 7 = 11', '6', 1),
  q(2,  'algebra',    'Разложи на множители: x² − 9', 'Sadaliet reizinātājos: x² − 9', '(x-3)(x+3)', 1, '(x−3)(x+3) — разность квадратов'),
  q(3,  'arithmetic', 'Найди 30% от числа 240.', 'Atrodi 30% no skaitļa 240.', '72', 1),
  q(4,  'geometry',   'Катеты 6 и 8. Найди гипотенузу.', 'Kateti 6 un 8. Atrodi hipotenūzu.', '10', 1, '6² + 8² = 100'),
  q(5,  'algebra',    'Реши неравенство: 2x − 5 > 7. Запиши наименьшее целое решение.', 'Atrisini: 2x − 5 > 7.', '7', 1, '2x > 12, x > 6'),
  q(6,  'functions',  'Функция y = 2x + 3. При каком x значение y = 15?', 'Funkcija y = 2x + 3. Pie kāda x: y = 15?', '6', 1),
  q(7,  'geometry',   'Площадь квадрата 144 см². Найди периметр (см).', 'Kvadrāta laukums 144 cm². Atrodi perimetru (cm).', '48', 1, '√144 = 12, P = 4×12'),
  q(8,  'statistics', 'Средний балл: 7, 8, 6, 9, 5.', 'Vidējā atzīme: 7, 8, 6, 9, 5.', '7', 1),
  q(9,  'algebra',    'Арифметическая прогрессия: 4, 9, 14. Найди 8-й член.', 'Aritmētiskā progresija: 4, 9, 14. 8. loceklis?', '39', 1, 'd = 5, a₈ = 4 + 7×5'),
  q(10, 'probability','В коробке 4 красных и 6 синих шаров. P(красный)?', 'Kastē 4 sarkanas, 6 zilas. P(sarkana)?', '0.4', 1),
  q(11, 'algebra',    'Реши систему: x + y = 10, x − y = 4. Найди x.', 'Atrisini: x + y = 10, x − y = 4. Atrodi x.', '7', 2),
  q(12, 'geometry',   'Длина окружности при r = 5 см. π ≈ 3,14.', 'Apkārtmērs, r = 5 cm, π ≈ 3,14.', '31.4', 2, 'C = 2πr'),
];

const MATH_9_2023 = [
  q(1,  'algebra',    'Реши уравнение: 5x + 3 = 28', 'Atrisini: 5x + 3 = 28', '5', 1),
  q(2,  'arithmetic', 'Число увеличили на 15% и получили 115. Исходное число?', 'Skaitli palielināja par 15% un ieguva 115. Sākotnējais?', '100', 1, '115 / 1,15'),
  q(3,  'algebra',    'Реши: x² − 16 = 0. Запиши положительный корень.', 'Atrisini: x² − 16 = 0. Ieraksti pozitīvo sakni.', '4', 1),
  q(4,  'geometry',   'Прямоугольник 12 × 7. Площадь (см²)?', 'Taisnstūris 12 × 7. Laukums (cm²)?', '84', 1),
  q(5,  'algebra',    'Упрости: 3(x + 4) − 2(x − 1). Найди при x = 5.', 'Vienkāršo: 3(x + 4) − 2(x − 1). Pie x = 5.', '19', 1, 'x + 14, при x=5 → 19'),
  q(6,  'functions',  'y = x². Найди y при x = 3.', 'y = x². Atrodi y, kad x = 3.', '9', 1),
  q(7,  'geometry',   'Периметр равностороннего треугольника 27 см. Сторона?', 'Vienādmalu trijstūra perimetrs 27 cm. Mala?', '9', 1),
  q(8,  'statistics', 'Медиана набора: 3, 7, 2, 9, 5, 1, 8', 'Mediāna: 3, 7, 2, 9, 5, 1, 8', '5', 1, 'Упорядочи: 1,2,3,5,7,8,9 — средний = 5'),
  q(9,  'probability','Кубик бросают раз. P(чётное)?', 'Kubi met reizi. P(pāra skaitlis)?', '0.5', 1),
  q(10, 'algebra',    'Геометрическая прогрессия: 2, 6, 18. Найди 5-й член.', 'Ģeometriskā progresija: 2, 6, 18. 5. loceklis?', '162', 1, 'q = 3, a₅ = 2 × 3⁴'),
  q(11, 'geometry',   'Объём куба 125 см³. Площадь одной грани (см²)?', 'Kuba tilpums 125 cm³. Vienas šķautnes laukums (cm²)?', '25', 2),
  q(12, 'arithmetic', 'В классе 30 учеников, 40% мальчики. Сколько девочек?', 'Klasē 30 skolēni, 40% zēni. Cik meiteņu?', '18', 1),
];

const MATH_9_2022 = [
  q(1,  'arithmetic', 'Вычисли: (−3) × (−4) + 6 ÷ 2', 'Aprēķini: (−3) × (−4) + 6 ÷ 2', '15', 1),
  q(2,  'algebra',    'Реши: 4(x − 2) = 12', 'Atrisini: 4(x − 2) = 12', '5', 1),
  q(3,  'algebra',    'При каком x выражение (x+3)/(x−2) не имеет смысла?', 'Pie kāda x izteiksmei (x+3)/(x−2) nav jēgas?', '2', 1),
  q(4,  'geometry',   'Угол при основании равнобедренного треугольника 65°. Угол при вершине?', 'Vienādkāju trijstūra leņķis pie pamata 65°. Leņķis pie virsotnes?', '50', 1),
  q(5,  'algebra',    'Упрости: (a² − b²) / (a − b)', 'Vienkāršo: (a² − b²) / (a − b)', 'a+b', 1),
  q(6,  'functions',  'y = −x² + 4. При каком x максимум?', 'y = −x² + 4. Pie kāda x ir maksimums?', '0', 1),
  q(7,  'statistics', 'Среднее двух чисел 15, одно из них 12. Второе?', 'Divu skaitļu vidējais 15, viens ir 12. Otrais?', '18', 1),
  q(8,  'geometry',   'Площадь параллелограмма 48 см², основание 8 см. Высота?', 'Paralelograma laukums 48 cm², pamats 8 cm. Augstums?', '6', 1),
  q(9,  'algebra',    'Система: 2x + y = 7, x − y = 2. Найди y.', 'Sistēma: 2x + y = 7, x − y = 2. Atrodi y.', '1', 2),
  q(10, 'probability','Карточки 1–10. P(простое число)?', 'Kartītes 1–10. P(pirmskaitlis)?', '0.4', 1, '2,3,5,7 — четыре простых из десяти'),
  q(11, 'geometry',   'Гипотенуза 13 см, один катет 5 см. Второй катет?', 'Hipotenūza 13 cm, katets 5 cm. Otrais katets?', '12', 2),
  q(12, 'arithmetic', 'НОД чисел 48 и 36.', 'LKD skaitļiem 48 un 36.', '12', 1),
];

// ═══════════════════════════════════════════════════════ МАТЕМАТИКА 6 КЛАСС ══

const MATH_6_2025 = [
  q(1,  'arithmetic', 'Вычисли: 5/6 − 1/4', 'Aprēķini: 5/6 − 1/4', '7/12', 1, 'Общий знаменатель 12: 10/12 − 3/12'),
  q(2,  'arithmetic', 'Найди 20% от числа 150.', 'Atrodi 20% no skaitļa 150.', '30', 1),
  q(3,  'algebra',    'Реши уравнение: 4x + 5 = 25', 'Atrisini: 4x + 5 = 25', '5', 1),
  q(4,  'geometry',   'Периметр треугольника со сторонами 7, 9, 11.', 'Trijstūra perimetrs ar malām 7, 9, 11.', '27', 1),
  q(5,  'arithmetic', 'Велосипедист проехал 180 км за 2,5 ч. Скорость (км/ч)?', 'Riteņbraucējs nobrauca 180 km 2,5 st. laikā. Ātrums?', '72', 1),
  q(6,  'arithmetic', 'Вычисли: 3² + 4²', 'Aprēķini: 3² + 4²', '25', 1),
  q(7,  'statistics', 'Среднее значение: 14, 8, 11, 17, 5.', 'Vidējā vērtība: 14, 8, 11, 17, 5.', '11', 1),
  q(8,  'geometry',   'Площадь прямоугольника 9 м × 6 м (м²).', 'Taisnstūra laukums 9 m × 6 m (m²).', '54', 1),
];

const MATH_6_2024 = [
  q(1,  'arithmetic', 'Вычисли: 3/4 + 1/6', 'Aprēķini: 3/4 + 1/6', '11/12', 1),
  q(2,  'arithmetic', 'Найди 25% от числа 80.', 'Atrodi 25% no 80.', '20', 1),
  q(3,  'algebra',    'Реши: x / 4 = 7', 'Atrisini: x / 4 = 7', '28', 1),
  q(4,  'geometry',   'Периметр прямоугольника 36 см, ширина 8 см. Длина?', 'Perimetrs 36 cm, platums 8 cm. Garums?', '10', 1),
  q(5,  'arithmetic', 'Поезд: 240 км за 3 часа. Скорость?', 'Vilciens 240 km 3 st. Ātrums?', '80', 1),
  q(6,  'arithmetic', 'Вычисли: 2³ × 5 − 10', 'Aprēķini: 2³ × 5 − 10', '30', 1),
  q(7,  'statistics', 'Среднее: 12, 15, 9, 18, 6.', 'Vidējais: 12, 15, 9, 18, 6.', '12', 1),
  q(8,  'geometry',   'Площадь квадрата 81 см². Периметр (см)?', 'Kvadrāta laukums 81 cm². Perimetrs (cm)?', '36', 1),
];

const MATH_6_2023 = [
  q(1,  'arithmetic', 'Вычисли: 2/3 + 3/4', 'Aprēķini: 2/3 + 3/4', '17/12', 1),
  q(2,  'arithmetic', 'Велосипедист: 60 км за 2,5 ч. Скорость?', 'Riteņbraucējs: 60 km 2,5 st. Ātrums?', '24', 1),
  q(3,  'algebra',    'Реши: 3x − 4 = 11', 'Atrisini: 3x − 4 = 11', '5', 1),
  q(4,  'geometry',   'Треугольник: основание 10 см, высота 8 см. Площадь (см²)?', 'Trijstūris: pamats 10 cm, augstums 8 cm. Laukums?', '40', 1),
  q(5,  'arithmetic', '45 учеников, 60% присутствовали. Сколько пришли?', 'No 45 skolēniem 60% bija klāt. Cik skolēni?', '27', 1),
  q(6,  'arithmetic', 'Вычисли: 0,25 × 0,4', 'Aprēķini: 0,25 × 0,4', '0.1', 1),
  q(7,  'geometry',   'Комната 6 м × 4 м. Площадь (м²)?', 'Istaba 6 m × 4 m. Laukums (m²)?', '24', 1),
  q(8,  'statistics', 'Температура: −3, +2, 0, −1, +4. Среднее?', 'Temperatūra: −3, +2, 0, −1, +4. Vidējais?', '0.4', 1),
];

// ═══════════════════════════════════════════════════════ МАТЕМАТИКА 3 КЛАСС ══

const MATH_3_2025 = [
  q(1, 'arithmetic', 'Реши: 427 + 356', 'Atrisini: 427 + 356', '783', 1),
  q(2, 'arithmetic', 'Реши: 600 − 247', 'Atrisini: 600 − 247', '353', 1),
  q(3, 'arithmetic', 'Реши: 7 × 8', 'Atrisini: 7 × 8', '56', 1),
  q(4, 'arithmetic', 'Реши: 72 ÷ 8', 'Atrisini: 72 ÷ 8', '9', 1),
  q(5, 'geometry',   'Периметр прямоугольника: длина 7 см, ширина 4 см (см).', 'Taisnstūra perimetrs: garums 7 cm, platums 4 cm (cm).', '22', 1),
  q(6, 'arithmetic', 'В магазине 5 корзин по 8 яблок. Яблок всего?', 'Veikalā 5 grozi ar 8 āboliem. Cik ābolu?', '40', 1),
];

const MATH_3_2024 = [
  q(1, 'arithmetic', 'Реши: 356 + 487', 'Atrisini: 356 + 487', '843', 1),
  q(2, 'arithmetic', 'Реши: 900 − 348', 'Atrisini: 900 − 348', '552', 1),
  q(3, 'arithmetic', 'Реши: 8 × 7', 'Atrisini: 8 × 7', '56', 1),
  q(4, 'arithmetic', 'Реши: 63 ÷ 9', 'Atrisini: 63 ÷ 9', '7', 1),
  q(5, 'geometry',   'Периметр квадрата со стороной 5 см?', 'Kvadrāta ar malu 5 cm perimetrs?', '20', 1),
  q(6, 'arithmetic', 'Маша раздала 24 конфеты 4 друзьям поровну. Сколько каждому?', 'Maša sadalīja 24 konfektes 4 draugiem. Cik katram?', '6', 1),
];

const MATH_3_2023 = [
  q(1, 'arithmetic', 'Реши: 248 + 365', 'Atrisini: 248 + 365', '613', 1),
  q(2, 'arithmetic', 'Реши: 700 − 253', 'Atrisini: 700 − 253', '447', 1),
  q(3, 'arithmetic', 'Реши: 9 × 6', 'Atrisini: 9 × 6', '54', 1),
  q(4, 'arithmetic', 'Реши: 45 ÷ 5', 'Atrisini: 45 ÷ 5', '9', 1),
  q(5, 'geometry',   'Прямоугольник 8 см × 3 см. Периметр (см)?', 'Taisnstūris 8 cm × 3 cm. Perimetrs (cm)?', '22', 1),
  q(6, 'arithmetic', '6 корзин по 9 яблок. Всего яблок?', '6 grozi ar 9 āboliem. Cik ābolu?', '54', 1),
];

// ═══════════════════════════════════════════════════════ ЛАТЫШСКИЙ ЯЗЫК 9 ════

const LAT_9_2025 = [
  qc(1, 'grammar', 'Kuru vārdformu lieto šajā teikumā?\n"Viņa nopirka __ maizi."',
    'Kuru vārdformu lieto šajā teikumā?\n"Viņa nopirka __ maizi."',
    O('garumu','garo','garā','garas'), 'B', 1, 'Akuzatīvs (vin.loc.) — garO maizi'),
  qc(2, 'punctuation', 'Kurā teikumā interpunkcija ir pareiza?',
    'Kurā teikumā interpunkcija ir pareiza?',
    O('Rīt, iestāsies pavasaris.','Rīt iestāsies pavasaris.','Rīt iestāsies, pavasaris.','Rīt; iestāsies pavasaris.'), 'B', 1, 'Komats pirms laika apstākļa netiek likts'),
  qc(3, 'vocabulary', 'Kura vārda nozīme ir "ātri, steidzīgi"?',
    'Kura vārda nozīme ir "ātri, steidzīgi"?',
    O('lēnām','pamazām','steidzīgi','klusu'), 'C', 1),
  qc(4, 'grammar', 'Kurā rindā visi vārdi rakstīti pareizi?',
    'Kurā rindā visi vārdi rakstīti pareizi?',
    O('braukt, rākt, skrēt','braukt, rakt, skriet','braukt, rakt, skriet','braukt, rākt, skriet'), 'C', 1, 'rakt (rakstu), skriet (skrienu)'),
  qc(5, 'grammar', 'Kāda vārdšķira ir vārds "ātri" teikumā "Viņš ātri skrēja"?',
    'Kāda vārdšķira ir vārds "ātri" teikumā "Viņš ātri skrēja"?',
    O('Īpašības vārds','Apstākļa vārds','Darbības vārds','Lietvārds'), 'B', 1, 'Ātri — apstākļa vārds (kā?)'),
  qc(6, 'spelling', 'Kurā vārdā ir pareiza rakstība?',
    'Kurā vārdā ir pareiza rakstība?',
    O('zāle (трава)','sāle','zāļe','zale'), 'A', 1, 'zāle — трава, зала'),
  qc(7, 'grammar', 'Kurā teikumā ir gramatiska kļūda?',
    'Kurā teikumā ir gramatiska kļūda?',
    O('Viņš lasīja grāmatu.','Es ēd maizi.','Mēs ejam uz skolu.','Viņi spēlēja futbolu.'), 'B', 1, '"ēd" jābūt "ēdu" (1. pers. viensk.)'),
  qc(8, 'vocabulary', 'Kurš vārds ir sinonīms vārdam "priecīgs"?',
    'Kurš vārds ir sinonīms vārdam "priecīgs"?',
    O('skumjš','laimīgs','dusmīgs','noguris'), 'B', 1),
  qc(9, 'grammar', 'Kādā locījumā ir vārds "skolā" teikumā "Viņa mācās skolā"?',
    'Kādā locījumā ir vārds "skolā" teikumā "Viņa mācās skolā"?',
    O('Nominatīvs','Ģenitīvs','Datīvs','Lokatīvs'), 'D', 1, 'skolā — kur? lokatīvs'),
  qc(10, 'reading', 'Kuru vārdu var aizstāt ar "tomēr"?',
    'Kuru vārdu var aizstāt ar "tomēr"?',
    O('turklāt','tāpēc','taču','tādēļ'), 'C', 1),
];

const LAT_9_2024 = [
  qc(1, 'grammar', 'Kurā teikumā darbības vārds lietots pareizajā formā?\n"Mēs __ uz skolu."',
    'Kurā teikumā darbības vārds lietots pareizajā formā?\n"Mēs __ uz skolu."',
    O('iet','eju','ejam','iet'), 'C', 1, 'Mēs — 1. pers. daudzsk. — ejam'),
  qc(2, 'spelling', 'Kurā vārdā ir garais patskanis?',
    'Kurā vārdā ir garais patskanis?',
    O('suns','māja','cilvēks','vārds... (māja)'), 'B', 1, 'māja — ā ir garais patskanis'),
  qc(3, 'punctuation', 'Kurā teikumā komats lietots pareizi?',
    'Kurā teikumā komats lietots pareizi?',
    O('Viņš nāca, un apsēdās.','Es lasīju grāmatu, kad ienāca māte.','Rīt iestāsies, vasara.','Viņa dzied, un dejo.'), 'B', 1, 'Komats pirms "kad" — saikļa subordinatīvā teikumā'),
  qc(4, 'vocabulary', 'Kāda ir vārda "acīmredzot" nozīme?',
    'Kāda ir vārda "acīmredzot" nozīme?',
    O('slēpti','iespējams','acīmredzami','negaidīti'), 'C', 1),
  qc(5, 'grammar', 'Kurš teikuma loceklis ir "ātri" teikumā "Viņš ātri rakstīja"?',
    'Kurš teikuma loceklis ir "ātri" teikumā "Viņš ātri rakstīja"?',
    O('Teikuma priekšmets','Izteicējs','Apstāklis','Papildinātājs'), 'C', 1),
  qc(6, 'grammar', 'Kādā skaitlī un dzimtē ir lietvārds "skolotājas"?',
    'Kādā skaitlī un dzimtē ir lietvārds "skolotājas"?',
    O('vienskaitlis, vīriešu dz.','daudzskaitlis, sieviešu dz.','vienskaitlis, sieviešu dz.','daudzskaitlis, vīriešu dz.'), 'B', 1),
  qc(7, 'spelling', 'Kurā rindā visi vārdi pareizi?',
    'Kurā rindā visi vārdi pareizi?',
    O('sirdis, putnis, ceļš','sirds, putnis, cels','sirds, putnis, ceļš','sirdis, putnis, cels'), 'C', 1),
  qc(8, 'vocabulary', 'Kurš vārds ir antonīms vārdam "tumšs"?',
    'Kurš vārds ir antonīms vārdam "tumšs"?',
    O('melns','gaišs','pelēks','zilgans'), 'B', 1),
  qc(9, 'grammar', '"Viņi nāca no skolas." — kādā locījumā ir "skolas"?',
    '"Viņi nāca no skolas." — kādā locījumā ir "skolas"?',
    O('Nominatīvs','Ģenitīvs','Akuzatīvs','Lokatīvs'), 'B', 1, 'no + ģenitīvs'),
  qc(10, 'reading', 'Kurš teikums ir jautājuma teikums?',
    'Kurš teikums ir jautājuma teikums?',
    O('Ej uz māju!','Vai tu nāksi?','Es gribētu iet.','Kāda laba ideja.'), 'B', 1),
];

const LAT_9_2023 = [
  qc(1, 'grammar', 'Kuru formu lieto: "Es __ grāmatu" (lasīt)?',
    'Kuru formu lieto: "Es __ grāmatu" (lasīt)?',
    O('lasa','lasu','lasīja','lasīs'), 'B', 1, '1. pers. vienskaitlis tagadnē — lasu'),
  qc(2, 'spelling', 'Kurā vārdā lietots "ā"?',
    'Kurā vārdā lietots "ā"?',
    O('pats','māte','tēvs','bērns'), 'B', 1),
  qc(3, 'vocabulary', 'Ko nozīmē vārds "glezna"?',
    'Ko nozīmē vārds "glezna"?',
    O('grāmata','attēls/bilde','mūzika','stāsts'), 'B', 1),
  qc(4, 'punctuation', 'Kur liek komatu?',
    'Kur liek komatu?',
    O('"Viņš ēda, un gulēja."','"Viņš lasīja, kamēr māte gatavoja."','"Viņš nāca, pēc stundas."','"Rīt, viņš atnāks."'), 'B', 1, 'Pirms pakārtojuma saikļa "kamēr"'),
  qc(5, 'grammar', 'Kurš ir darbības vārda "rakstīt" pagātnē 3. pers. daudzsk.?',
    'Kurš ir darbības vārda "rakstīt" pagātnē 3. pers. daudzsk.?',
    O('raksta','rakstīja','rakstīs','rakstiet'), 'B', 1),
  qc(6, 'grammar', 'Kāda vārdšķira ir "skaists" teikumā "Skaists zēns"?',
    'Kāda vārdšķira ir "skaists" teikumā "Skaists zēns"?',
    O('Lietvārds','Darbības vārds','Īpašības vārds','Apstākļa vārds'), 'C', 1),
  qc(7, 'vocabulary', 'Sinonīms vārdam "liels"?',
    'Sinonīms vārdam "liels"?',
    O('mazs','plašs','tuvs','šaurs'), 'B', 1),
  qc(8, 'spelling', 'Kurā vārdā ir mīkstinājuma zīme?',
    'Kurā vārdā ir mīkstinājuma zīme?',
    O('gads','ģimene','māja','laiks'), 'B', 1, 'ģimene — ģ ir mīkstinātais g'),
  qc(9, 'grammar', '"Mēs ejam uz __ (skola)." Kādu formu lieto?',
    '"Mēs ejam uz __ (skola)." Kādu formu lieto?',
    O('skola','skolā','skolas','skolai'), 'B', 1, 'uz kur? — lokatīvs: skolā'),
  qc(10, 'reading', 'Ko nozīmē izteiciens "aiziet kā pa dūmiem"?',
    'Ko nozīmē izteiciens "aiziet kā pa dūmiem"?',
    O('Ļoti lēni','Ļoti ātri','Nepareizi','Klusi'), 'B', 1),
];

const LAT_9_2022 = [
  qc(1, 'grammar', 'Kurā teikumā lietvārds lietots datīvā?\n',
    'Kurā teikumā lietvārds lietots datīvā?',
    O('"Es redzu skolotāju."','"Es dodu grāmatu skolotājam."','"Es eju uz skolu."','"Skolotāja ir šeit."'), 'B', 1, 'Datīvs — kam? skolotājam'),
  qc(2, 'spelling', 'Kur lieto "dz"?',
    'Kur lieto "dz"?',
    O('dziedāt','ciedāt','ziedāt','sjedāt'), 'A', 1),
  qc(3, 'vocabulary', 'Antonīms vārdam "sākums"?',
    'Antonīms vārdam "sākums"?',
    O('vidus','beigas','gals','otrpuse'), 'B', 1),
  qc(4, 'punctuation', '"__ viņš nāca, mēs sākām strādāt." Kāds pieturzīmes?',
    '"__ viņš nāca, mēs sākām strādāt." Kāds saiklis un pieturzīme?',
    O('Kad — komats','Ja — komats','Bet — semikols','Un — komats'), 'A', 1),
  qc(5, 'grammar', 'Kāds ir darbības vārda "iet" 1. pers. vienskaitlī tagadnē?',
    'Kāds ir darbības vārda "iet" 1. pers. vienskaitlī tagadnē?',
    O('iet','eju','ejam','ies'), 'B', 1),
  qc(6, 'grammar', 'Kāds teikuma loceklis ir "grāmatu" teikumā "Viņš lasa grāmatu"?',
    'Kāds teikuma loceklis ir "grāmatu"?',
    O('Teikuma priekšmets','Izteicējs','Papildinātājs','Apstāklis'), 'C', 1),
  qc(7, 'spelling', 'Kurā rindā visi vārdi ar "ie"?',
    'Kurā rindā visi vārdi ar "ie"?',
    O('liels, siets, diena','liels, sēts, diena','liels, siets, dena','lels, siets, diena'), 'A', 1),
  qc(8, 'vocabulary', 'Ko nozīmē "rīkoties"?',
    'Ko nozīmē "rīkoties"?',
    O('gulēt','darboties/rīkoties','ēst','lasīt'), 'B', 1),
  qc(9, 'grammar', 'Kāda dzimte ir lietvārdam "tēvs"?',
    'Kāda dzimte ir lietvārdam "tēvs"?',
    O('Sieviešu','Vīriešu','Vidus','Nav dzimtes'), 'B', 1),
  qc(10, 'reading', 'Kurš no šiem ir saliktenis?',
    'Kurš no šiem ir saliktenis?',
    O('skola','skolotājs','sarkanbaltssarkans','grāmata'), 'C', 1, 'Saliktenis — vārds no diviem vai vairāk vārdiem'),
];

// ═══════════════════════════════════════════════════ LATVIEŠU VAL. 6. KLASE ══

const LAT_6_2024 = [
  qc(1, 'grammar', '"Es __ (rakstīt) vēstuli." Kādu formu lieto?',
    '"Es __ (rakstīt) vēstuli." Kādu formu lieto?',
    O('raksta','rakstu','rakstīja','rakstīs'), 'B', 1, '1. pers. tagadnē — rakstu'),
  qc(2, 'spelling', 'Kurā vārdā ir "ū"?',
    'Kurā vārdā ir "ū"?',
    O('suns','zupa','sūna','vista'), 'C', 1),
  qc(3, 'vocabulary', 'Ko nozīmē vārds "ēka"?',
    'Ko nozīmē vārds "ēka"?',
    O('koks','māja/būve','upe','lauks'), 'B', 1),
  qc(4, 'grammar', 'Kāda vārdšķira ir "skaisti" teikumā "Viņa dzied skaisti"?',
    'Kāda vārdšķira ir "skaisti"?',
    O('Lietvārds','Īpašības vārds','Apstākļa vārds','Darbības vārds'), 'C', 1),
  qc(5, 'punctuation', 'Kur liek izsaukuma zīmi?',
    'Kur liek izsaukuma zīmi?',
    O('Kāds laiks rīt?','Cik jauki!','Es domāju.','Vai tu nāksi.'), 'B', 1),
  qc(6, 'grammar', 'Kāds ir skaitlis lietvārdam "bērni"?',
    'Kāds ir skaitlis lietvārdam "bērni"?',
    O('Vienskaitlis','Daudzskaitlis'), 'B', 1),
];

const LAT_6_2023 = [
  qc(1, 'grammar', '"Viņš __ (iet) uz skolu." Kādu formu lieto?',
    '"Viņš __ (iet) uz skolu." Kādu formu lieto?',
    O('eju','iet','ejam','iesi'), 'B', 1, '3. pers. vienskaitlī tagadnē — iet'),
  qc(2, 'spelling', 'Kurā vārdā ir "ī"?',
    'Kurā vārdā ir "ī"?',
    O('bērns','rīts','ceļš','putns'), 'B', 1),
  qc(3, 'vocabulary', 'Sinonīms vārdam "sākt"?',
    'Sinonīms vārdam "sākt"?',
    O('beigt','turpināt','iesākt','atcerēties'), 'C', 1),
  qc(4, 'grammar', 'Kāda vārdšķira ir "es"?',
    'Kāda vārdšķira ir "es"?',
    O('Lietvārds','Vietniekvārds','Darbības vārds','Saiklis'), 'B', 1),
  qc(5, 'punctuation', 'Kurā teikumā punkts lietots pareizi?',
    'Kurā teikumā punkts lietots pareizi?',
    O('Vai tu nāksi.','Es lasīju grāmatu.','Ej projām!','Kāds laiks.'), 'B', 1),
  qc(6, 'spelling', 'Kā pareizi raksta?',
    'Kā pareizi raksta?',
    O('skuola','skola','skoala','skools'), 'B', 1),
];

// ═══════════════════════════════════════════════════════ LATVIEŠU VAL. 3. KL. ══

const LAT_3_2024 = [
  qc(1, 'grammar', 'Kāda vārdšķira ir "suns"?',
    'Kāda vārdšķira ir "suns"?',
    O('Darbības vārds','Lietvārds','Īpašības vārds','Apstākļa vārds'), 'B', 1),
  qc(2, 'spelling', 'Kurā vārdā ir garais "ā"?',
    'Kurā vārdā ir garais "ā"?',
    O('tas','māja','mans','tēvs'), 'B', 1),
  qc(3, 'vocabulary', 'Ko nozīmē "priecīgs"?',
    'Ko nozīmē "priecīgs"?',
    O('skumjš','dusmīgs','laimīgs','noguris'), 'C', 1),
  qc(4, 'grammar', 'Kurš vārds ir darbības vārds?',
    'Kurš vārds ir darbības vārds?',
    O('liels','skriet','suns','ātri'), 'B', 1),
  qc(5, 'punctuation', 'Kur liek jautājuma zīmi?',
    'Kur liek jautājuma zīmi?',
    O('Es eju uz skolu.','Vai tu nāksi?','Ej projām!','Kāda diena.'), 'B', 1),
];

const LAT_3_2023 = [
  qc(1, 'grammar', 'Kurš ir lietvārds?',
    'Kurš ir lietvārds?',
    O('ātri','skaists','māja','iet'), 'C', 1),
  qc(2, 'spelling', 'Kā pareizi raksta?',
    'Kā pareizi raksta?',
    O('māte','mate','maate','mātte'), 'A', 1),
  qc(3, 'vocabulary', 'Antonīms vārdam "liels"?',
    'Antonīms vārdam "liels"?',
    O('garš','mazs','plats','augsts'), 'B', 1),
  qc(4, 'grammar', 'Kāds ir darbības vārda "rakstīt" pagātnē vienskaitlī?',
    'Kāds ir darbības vārda "rakstīt" pagātnē?',
    O('rakstu','rakstīja','rakstīs','raksta'), 'B', 1),
  qc(5, 'punctuation', 'Kur liek izsaukuma zīmi?',
    'Kur liek izsaukuma zīmi?',
    O('Vai tu nāksi?','Cik jauki!','Es eju uz skolu.','Kāds laiks rīt?'), 'B', 1),
];

// ═══════════════════════════════════════════════════════ ANGĻU VALODA 9 KL. ══

const ENG_9_2025 = [
  qc(1, 'grammar', 'Choose the correct form:\n"She ___ to school every day."',
    'Choose the correct form:\n"She ___ to school every day."',
    O('go','goes','going','gone'), 'B', 1, '3rd person singular present simple → goes'),
  qc(2, 'grammar', '"I ___ my homework yet." Choose correct.',
    '"I ___ my homework yet." Choose correct.',
    O("didn't finish","haven't finished","don't finish","wasn't finishing"), 'B', 1, '"Yet" → Present Perfect'),
  qc(3, 'vocabulary', 'What does "enormous" mean?',
    'What does "enormous" mean?',
    O('very small','very large','very fast','very quiet'), 'B', 1),
  qc(4, 'grammar', '"If it ___ tomorrow, we will stay home."',
    '"If it ___ tomorrow, we will stay home."',
    O('rained','rains','will rain','is raining'), 'B', 1, '1st conditional: If + present simple, will + verb'),
  qc(5, 'grammar', 'The book ___ written in 1984.',
    'The book ___ written in 1984.',
    O('is','was','were','has been'), 'B', 1, 'Past passive: was + past participle'),
  qc(6, 'vocabulary', 'Choose the synonym of "happy":',
    'Choose the synonym of "happy":',
    O('sad','joyful','angry','tired'), 'B', 1),
  qc(7, 'grammar', '"___ she speak French?" — "Yes, she ___."',
    '"___ she speak French?" — "Yes, she ___."',
    O('Does / does','Do / do','Is / is','Has / has'), 'A', 1),
  qc(8, 'grammar', '"He is taller ___ his brother."',
    '"He is taller ___ his brother."',
    O('that','then','than','as'), 'C', 1, 'Comparatives use "than"'),
  qc(9, 'vocabulary', 'What is the opposite of "ancient"?',
    'What is the opposite of "ancient"?',
    O('old','modern','historical','traditional'), 'B', 1),
  qc(10, 'grammar', '"They ___ football when it started to rain."',
    '"They ___ football when it started to rain."',
    O('played','were playing','play','have played'), 'B', 1, 'Past Continuous — action in progress when interrupted'),
];

const ENG_9_2024 = [
  qc(1, 'grammar', '"___ you ever ___ to Paris?" Choose correct.',
    '"___ you ever ___ to Paris?"',
    O('Did / go','Have / been','Do / go','Were / going'), 'B', 1, 'Present Perfect with "ever"'),
  qc(2, 'grammar', '"The letter ___ sent yesterday."',
    '"The letter ___ sent yesterday."',
    O('is','was','were','has'), 'B', 1, 'Past passive'),
  qc(3, 'vocabulary', '"Enormous" means:',
    '"Enormous" means:',
    O('tiny','very big','colorful','dangerous'), 'B', 1),
  qc(4, 'grammar', '"She ___ TV when I called her."',
    '"She ___ TV when I called her."',
    O('watched','was watching','watches','has watched'), 'B', 1),
  qc(5, 'grammar', '"___ faster: a car or a bicycle?"',
    '"___ faster: a car or a bicycle?"',
    O('Which is','What is','Who is','How is'), 'A', 1),
  qc(6, 'vocabulary', 'Synonym of "begin":',
    'Synonym of "begin":',
    O('end','finish','start','stop'), 'C', 1),
  qc(7, 'grammar', '"You ___ wear a seatbelt. It\'s the law."',
    '"You ___ wear a seatbelt. It\'s the law."',
    O('should','must','might','could'), 'B', 1, 'must = obligation/law'),
  qc(8, 'grammar', '"This is ___ book I\'ve ever read."',
    '"This is ___ book I\'ve ever read."',
    O('a good','the better','the best','better'), 'C', 1, 'Superlative with "the"'),
  qc(9, 'vocabulary', 'What does "exhausted" mean?',
    'What does "exhausted" mean?',
    O('very happy','very tired','very hungry','very cold'), 'B', 1),
  qc(10, 'grammar', '"If I ___ more money, I would buy a new phone."',
    '"If I ___ more money, I would buy a new phone."',
    O('have','had','has','will have'), 'B', 1, '2nd conditional: If + past simple, would + verb'),
];

const ENG_9_2023 = [
  qc(1, 'grammar', '"She ___ in London for 5 years." (live)',
    '"She ___ in London for 5 years."',
    O('lives','lived','has lived','is living'), 'C', 1, '"For" + duration → Present Perfect'),
  qc(2, 'vocabulary', 'What does "journey" mean?',
    'What does "journey" mean?',
    O('a place','a trip','a person','a food'), 'B', 1),
  qc(3, 'grammar', '"___ he like pizza?" — "No, he ___."',
    '"___ he like pizza?" — "No, he ___."',
    O("Does / doesn't","Do / don't","Is / isn't","Has / hasn't"), 'A', 1),
  qc(4, 'grammar', '"The homework ___ by all students."',
    '"The homework ___ by all students."',
    O('was done','did','is do','done'), 'A', 1),
  qc(5, 'vocabulary', 'Antonym of "remember":',
    'Antonym of "remember":',
    O('recall','remind','forget','think'), 'C', 1),
  qc(6, 'grammar', '"___ the biggest country in the world?" Choose correct question.',
    '"___ the biggest country in the world?"',
    O('What is','Which is','Who is','Where is'), 'A', 1),
  qc(7, 'grammar', '"You ___ eat here. It\'s not allowed."',
    '"You ___ eat here. It\'s not allowed."',
    O('should','must','mustn\'t','might'), 'C', 1, "mustn't = prohibition"),
  qc(8, 'vocabulary', '"Brave" means:',
    '"Brave" means:',
    O('afraid','courageous','lazy','clever'), 'B', 1),
  qc(9, 'grammar', '"I wish I ___ fly like a bird."',
    '"I wish I ___ fly like a bird."',
    O('can','could','will','would'), 'B', 1, '"I wish" + past tense'),
  qc(10, 'grammar', 'Choose the correct preposition: "She\'s good ___ math."',
    'Choose: "She\'s good ___ math."',
    O('in','at','on','for'), 'B', 1, 'good at something'),
];

const ENG_9_2022 = [
  qc(1, 'grammar', '"We ___ football last Sunday."',
    '"We ___ football last Sunday."',
    O('play','played','were play','have played'), 'B', 1, 'Last Sunday → Past Simple'),
  qc(2, 'vocabulary', 'Synonym of "tired":',
    'Synonym of "tired":',
    O('energetic','exhausted','happy','hungry'), 'B', 1),
  qc(3, 'grammar', '"There ___ a lot of students in the class."',
    '"There ___ a lot of students in the class."',
    O('is','are','was','am'), 'B', 1, '"students" is plural → are'),
  qc(4, 'grammar', '"___ she at home yesterday?" — "No, she ___."',
    '"___ she at home yesterday?"',
    O("Was / wasn't","Is / isn't","Were / weren't","Does / doesn't"), 'A', 1),
  qc(5, 'vocabulary', '"Purchase" means:',
    '"Purchase" means:',
    O('sell','buy','give','take'), 'B', 1),
  qc(6, 'grammar', '"This is ___ mountain in Europe."',
    '"This is ___ mountain in Europe."',
    O('high','higher','the highest','most high'), 'C', 1),
  qc(7, 'grammar', '"You ___ be quiet in the library."',
    '"You ___ be quiet in the library."',
    O('can','must','might','would'), 'B', 1),
  qc(8, 'vocabulary', 'Antonym of "noisy":',
    'Antonym of "noisy":',
    O('loud','quiet','bright','dark'), 'B', 1),
  qc(9, 'grammar', '"I ___ my keys. I can\'t find them."',
    '"I ___ my keys. I can\'t find them."',
    O("lost","have lost","lose","was losing"), 'B', 1, 'Result in present → Present Perfect'),
  qc(10, 'grammar', '"He said that he ___ tired."',
    '"He said that he ___ tired."',
    O('is','was','were','had been'), 'B', 1, 'Reported speech — past simple'),
];

// ═══════════════════════════════════════════════════ ENGLISH 6. KLASE ════════

const ENG_6_2024 = [
  qc(1, 'grammar', '"___ you like ice cream?" — "Yes, I ___."',
    '"___ you like ice cream?"',
    O('Do / do','Does / does','Are / am','Is / is'), 'A', 1),
  qc(2, 'vocabulary', '"Big" means the same as:',
    '"Big" means the same as:',
    O('small','large','fast','slow'), 'B', 1),
  qc(3, 'grammar', '"She ___ to school by bus every day."',
    '"She ___ to school by bus every day."',
    O('go','goes','going','gone'), 'B', 1),
  qc(4, 'vocabulary', 'What colour is the sky on a sunny day?',
    'What colour is the sky on a sunny day?',
    O('green','red','blue','yellow'), 'C', 1),
  qc(5, 'grammar', '"___ is your name?" — "My name is Anna."',
    '"___ is your name?"',
    O('Where','Who','What','How'), 'C', 1),
  qc(6, 'grammar', '"There ___ two cats in the garden."',
    '"There ___ two cats in the garden."',
    O('is','are','am','be'), 'B', 1),
];

const ENG_6_2023 = [
  qc(1, 'grammar', '"___ she have a pet?" — "Yes, she ___."',
    '"___ she have a pet?"',
    O('Do / do','Does / does','Is / is','Has / has'), 'B', 1),
  qc(2, 'vocabulary', 'Opposite of "hot":',
    'Opposite of "hot":',
    O('warm','cool','cold','nice'), 'C', 1),
  qc(3, 'grammar', '"___ old are you?" — "I\'m 12."',
    '"___ old are you?"',
    O('What','How','Who','Where'), 'B', 1),
  qc(4, 'vocabulary', 'What do you use to write?',
    'What do you use to write?',
    O('fork','pencil','spoon','cup'), 'B', 1),
  qc(5, 'grammar', '"He ___ TV right now."',
    '"He ___ TV right now."',
    O('watch','watches','is watching','watched'), 'C', 1, 'Right now → Present Continuous'),
  qc(6, 'vocabulary', '"Happy" means:',
    '"Happy" means:',
    O('sad','angry','joyful','tired'), 'C', 1),
];

// ══════════════════════════════════════════════════════════ EXAM CATALOG ══════

export const EXAM_CATALOG = {
  // Math grade 9
  'math-9-2025': { id: 'math-9-2025', subject: 'math', grade: 9, year: 2025, type: 'ce', duration: 60,
    title: { ru: 'Математика', lv: 'Matemātika', uk: 'Математика' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2025/ce_matematika_9_uzd.pdf', questions: MATH_9_2025 },
  'math-9-2024': { id: 'math-9-2024', subject: 'math', grade: 9, year: 2024, type: 'ce', duration: 60,
    title: { ru: 'Математика', lv: 'Matemātika', uk: 'Математика' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2024/ce_matematika_9_uzd.pdf', questions: MATH_9_2024 },
  'math-9-2023': { id: 'math-9-2023', subject: 'math', grade: 9, year: 2023, type: 'ce', duration: 60,
    title: { ru: 'Математика', lv: 'Matemātika', uk: 'Математика' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2023/ce_matematika_9_uzd.pdf', questions: MATH_9_2023 },
  'math-9-2022': { id: 'math-9-2022', subject: 'math', grade: 9, year: 2022, type: 'ce', duration: 60,
    title: { ru: 'Математика', lv: 'Matemātika', uk: 'Математика' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2022/ce_matematika_9_uzd.pdf', questions: MATH_9_2022 },
  // Math grade 6
  'math-6-2025': { id: 'math-6-2025', subject: 'math', grade: 6, year: 2025, type: 'dd', duration: 45,
    title: { ru: 'Математика', lv: 'Matemātika', uk: 'Математика' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2025/dd_matematika_6.pdf', questions: MATH_6_2025 },
  'math-6-2024': { id: 'math-6-2024', subject: 'math', grade: 6, year: 2024, type: 'dd', duration: 45,
    title: { ru: 'Математика', lv: 'Matemātika', uk: 'Математика' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2024/dd_matematika_6.pdf', questions: MATH_6_2024 },
  'math-6-2023': { id: 'math-6-2023', subject: 'math', grade: 6, year: 2023, type: 'dd', duration: 45,
    title: { ru: 'Математика', lv: 'Matemātika', uk: 'Математика' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2023/dd_matematika_6.pdf', questions: MATH_6_2023 },
  // Math grade 3
  'math-3-2025': { id: 'math-3-2025', subject: 'math', grade: 3, year: 2025, type: 'dd', duration: 40,
    title: { ru: 'Математика', lv: 'Matemātika', uk: 'Математика' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2025/dd_matematika_3.pdf', questions: MATH_3_2025 },
  'math-3-2024': { id: 'math-3-2024', subject: 'math', grade: 3, year: 2024, type: 'dd', duration: 40,
    title: { ru: 'Математика', lv: 'Matemātika', uk: 'Математика' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2024/dd_matematika_3.pdf', questions: MATH_3_2024 },
  'math-3-2023': { id: 'math-3-2023', subject: 'math', grade: 3, year: 2023, type: 'dd', duration: 40,
    title: { ru: 'Математика', lv: 'Matemātika', uk: 'Математика' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2023/dd_matematika_3.pdf', questions: MATH_3_2023 },
  // Latvian language grade 9
  'latvian-9-2025': { id: 'latvian-9-2025', subject: 'latvian', grade: 9, year: 2025, type: 'ce', duration: 90,
    title: { ru: 'Латышский язык', lv: 'Latviešu valoda', uk: 'Латвійська мова' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2025/ce_latviesu_val_9_uzd.pdf', questions: LAT_9_2025 },
  'latvian-9-2024': { id: 'latvian-9-2024', subject: 'latvian', grade: 9, year: 2024, type: 'ce', duration: 90,
    title: { ru: 'Латышский язык', lv: 'Latviešu valoda', uk: 'Латвійська мова' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2024/ce_latviesu_val_9_uzd.pdf', questions: LAT_9_2024 },
  'latvian-9-2023': { id: 'latvian-9-2023', subject: 'latvian', grade: 9, year: 2023, type: 'ce', duration: 90,
    title: { ru: 'Латышский язык', lv: 'Latviešu valoda', uk: 'Латвійська мова' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2023/ce_latviesu_val_9_uzd.pdf', questions: LAT_9_2023 },
  'latvian-9-2022': { id: 'latvian-9-2022', subject: 'latvian', grade: 9, year: 2022, type: 'ce', duration: 90,
    title: { ru: 'Латышский язык', lv: 'Latviešu valoda', uk: 'Латвійська мова' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2022/ce_latviesu_val_9_uzd.pdf', questions: LAT_9_2022 },
  // Latvian language grade 6
  'latvian-6-2024': { id: 'latvian-6-2024', subject: 'latvian', grade: 6, year: 2024, type: 'dd', duration: 60,
    title: { ru: 'Латышский язык', lv: 'Latviešu valoda', uk: 'Латвійська мова' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2024/dd_latviesu_val_6.pdf', questions: LAT_6_2024 },
  'latvian-6-2023': { id: 'latvian-6-2023', subject: 'latvian', grade: 6, year: 2023, type: 'dd', duration: 60,
    title: { ru: 'Латышский язык', lv: 'Latviešu valoda', uk: 'Латвійська мова' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2023/dd_latviesu_val_6.pdf', questions: LAT_6_2023 },
  // Latvian language grade 3
  'latvian-3-2024': { id: 'latvian-3-2024', subject: 'latvian', grade: 3, year: 2024, type: 'dd', duration: 45,
    title: { ru: 'Латышский язык', lv: 'Latviešu valoda', uk: 'Латвійська мова' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2024/dd_latviesu_val_3.pdf', questions: LAT_3_2024 },
  'latvian-3-2023': { id: 'latvian-3-2023', subject: 'latvian', grade: 3, year: 2023, type: 'dd', duration: 45,
    title: { ru: 'Латышский язык', lv: 'Latviešu valoda', uk: 'Латвійська мова' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2023/dd_latviesu_val_3.pdf', questions: LAT_3_2023 },
  // English grade 9
  'english-9-2025': { id: 'english-9-2025', subject: 'english', grade: 9, year: 2025, type: 'ce', duration: 90,
    title: { ru: 'Английский язык', lv: 'Angļu valoda', uk: 'Англійська мова' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2025/ce_anglu_val_9_uzd.pdf', questions: ENG_9_2025 },
  'english-9-2024': { id: 'english-9-2024', subject: 'english', grade: 9, year: 2024, type: 'ce', duration: 90,
    title: { ru: 'Английский язык', lv: 'Angļu valoda', uk: 'Англійська мова' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2024/ce_anglu_val_9_uzd.pdf', questions: ENG_9_2024 },
  'english-9-2023': { id: 'english-9-2023', subject: 'english', grade: 9, year: 2023, type: 'ce', duration: 90,
    title: { ru: 'Английский язык', lv: 'Angļu valoda', uk: 'Англійська мова' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2023/ce_anglu_val_9_uzd.pdf', questions: ENG_9_2023 },
  'english-9-2022': { id: 'english-9-2022', subject: 'english', grade: 9, year: 2022, type: 'ce', duration: 90,
    title: { ru: 'Английский язык', lv: 'Angļu valoda', uk: 'Англійська мова' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2022/ce_anglu_val_9_uzd.pdf', questions: ENG_9_2022 },
  // English grade 6
  'english-6-2024': { id: 'english-6-2024', subject: 'english', grade: 6, year: 2024, type: 'dd', duration: 60,
    title: { ru: 'Английский язык', lv: 'Angļu valoda', uk: 'Англійська мова' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2024/dd_anglu_val_6.pdf', questions: ENG_6_2024 },
  'english-6-2023': { id: 'english-6-2023', subject: 'english', grade: 6, year: 2023, type: 'dd', duration: 60,
    title: { ru: 'Английский язык', lv: 'Angļu valoda', uk: 'Англійська мова' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2023/dd_anglu_val_6.pdf', questions: ENG_6_2023 },
};

export function getExamsForGrade(grade) {
  return Object.values(EXAM_CATALOG).filter(e => e.grade === grade);
}

export function getExamsBySubject(grade) {
  const exams = getExamsForGrade(grade);
  const grouped = {};
  for (const exam of exams) {
    if (!grouped[exam.subject]) grouped[exam.subject] = [];
    grouped[exam.subject].push(exam);
  }
  return grouped;
}

export const EXAM_GRADES = [3, 6, 9, 12];

export const EXAM_SUBJECTS = {
  math:    { icon: '🔢', name: { ru: 'Математика',      lv: 'Matemātika',    uk: 'Математика'    }, color: '#6366f1' },
  latvian: { icon: '📖', name: { ru: 'Латышский язык',  lv: 'Latviešu val.', uk: 'Латвійська'    }, color: '#10b981' },
  english: { icon: '🇬🇧', name: { ru: 'Английский язык', lv: 'Angļu valoda',  uk: 'Англійська'    }, color: '#f59e0b' },
};
