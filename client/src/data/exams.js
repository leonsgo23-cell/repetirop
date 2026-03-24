/**
 * Latvia School Exams & Diagnostic Tests
 * Sources: visc.gov.lv, liis.lv
 *
 * Types:
 *  'ce'  — Centralizētais eksāmens (grades 9, 12)
 *  'dd'  — Diagnostiskais darbs (grades 3, 6)
 *  'kd'  — Kontroldarbs / training (grades 1-2, 4-5, 7-8, 10-11)
 */

// Question categories for progress tracking
export const CATEGORIES = {
  algebra:      { ru: 'Алгебра',        lv: 'Algebra',        uk: 'Алгебра'        },
  geometry:     { ru: 'Геометрия',      lv: 'Ģeometrija',     uk: 'Геометрія'      },
  statistics:   { ru: 'Статистика',     lv: 'Statistika',     uk: 'Статистика'     },
  arithmetic:   { ru: 'Арифметика',     lv: 'Aritmētika',     uk: 'Арифметика'     },
  functions:    { ru: 'Функции',        lv: 'Funkcijas',      uk: 'Функції'        },
  probability:  { ru: 'Вероятность',    lv: 'Varbūtība',      uk: 'Імовірність'    },
};

const q = (id, category, text_ru, text_lv, answer, points = 1, hint_ru = '') => ({
  id, category,
  text: { ru: text_ru, lv: text_lv, uk: text_ru },
  answer: String(answer),
  points,
  hint: { ru: hint_ru, lv: hint_ru, uk: hint_ru },
});

// ─────────────────────────────────────────────────────────── MATH GRADE 9 ───

const MATH_9_2024 = [
  q(1,  'algebra',    'Реши уравнение: 3x − 7 = 11', 'Atrisini vienādojumu: 3x − 7 = 11', '6', 1, 'Перенеси −7 вправо, затем раздели на 3'),
  q(2,  'algebra',    'Разложи на множители: x² − 9', 'Sadaliet reizinātājos: x² − 9', '(x-3)(x+3)', 1, 'Формула разности квадратов: a²−b² = (a−b)(a+b)'),
  q(3,  'arithmetic', 'Найди 30% от числа 240', 'Atrodiet 30% no skaitļa 240', '72', 1, '240 × 0,30 = ?'),
  q(4,  'geometry',   'Катеты прямоугольного треугольника равны 6 и 8. Найди гипотенузу.', 'Taisnleņķa trijstūra kateti ir 6 un 8. Atrodi hipotenūzu.', '10', 1, 'Теорема Пифагора: c² = a² + b²'),
  q(5,  'algebra',    'Реши неравенство: 2x − 5 > 7. Запиши наименьшее целое решение.', 'Atrisini nevienādību: 2x − 5 > 7. Ieraksti mazāko veselo atrisinājumu.', '7', 1, '2x > 12, x > 6, наименьшее целое = 7'),
  q(6,  'functions',  'Функция y = 2x + 3. При каком x значение y = 15?', 'Funkcija y = 2x + 3. Pie kāda x vērtība y = 15?', '6', 1, '2x + 3 = 15, 2x = 12'),
  q(7,  'geometry',   'Площадь квадрата равна 144 см². Найди его периметр (в см).', 'Kvadrāta laukums ir 144 cm². Atrodi tā perimetru (cm).', '48', 1, 'Сторона = √144 = 12, периметр = 4 × 12'),
  q(8,  'statistics', 'Средний балл пяти учеников: 7, 8, 6, 9, 5. Найди среднее арифметическое.', 'Piecu skolēnu vidējā atzīme: 7, 8, 6, 9, 5. Atrodi aritmētisko vidējo.', '7', 1, '(7+8+6+9+5) / 5 = ?'),
  q(9,  'algebra',    'Первые три члена арифметической прогрессии: 4, 9, 14. Найди 8-й член.', 'Aritmētiskās progresijas pirmie trīs locekļi: 4, 9, 14. Atrodi 8. locekli.', '39', 1, 'Разность d = 5, a₈ = 4 + 7×5'),
  q(10, 'probability','В коробке 4 красных и 6 синих шаров. Чему равна вероятность вытащить красный шар? Запиши в виде десятичной дроби.', 'Kastē ir 4 sarkanas un 6 zilas bumbiņas. Kāda ir varbūtība izvilkt sarkanu bumbiņu?', '0.4', 1, '4 / (4+6) = 4/10 = 0,4'),
  q(11, 'algebra',    'Реши систему уравнений: x + y = 10, x − y = 4. Найди x.', 'Atrisini vienādojumu sistēmu: x + y = 10, x − y = 4. Atrodi x.', '7', 2, 'Сложи оба уравнения: 2x = 14'),
  q(12, 'geometry',   'Радиус круга равен 5 см. Найди длину окружности. Используй π ≈ 3,14.', 'Apļa rādiuss ir 5 cm. Atrodi apkārtmēru. Izmanto π ≈ 3,14.', '31.4', 2, 'C = 2πr = 2 × 3,14 × 5'),
];

const MATH_9_2023 = [
  q(1,  'algebra',    'Реши уравнение: 5x + 3 = 28', 'Atrisini vienādojumu: 5x + 3 = 28', '5', 1, '5x = 25'),
  q(2,  'arithmetic', 'Число увеличили на 15% и получили 115. Найди исходное число.', 'Skaitli palielināja par 15% un ieguva 115. Atrodi sākotnējo skaitli.', '100', 1, '115 / 1,15 = ?'),
  q(3,  'algebra',    'Реши уравнение: x² − 16 = 0', 'Atrisini vienādojumu: x² − 16 = 0', '4', 1, 'x² = 16, x = ±4. Запиши положительный корень.'),
  q(4,  'geometry',   'В прямоугольнике длина 12 см, ширина 7 см. Найди площадь (в см²).', 'Taisnstūrī garums 12 cm, platums 7 cm. Atrodi laukumu (cm²).', '84', 1, 'S = a × b'),
  q(5,  'algebra',    'Упрости выражение: 3(x + 4) − 2(x − 1). Найди значение при x = 5.', 'Vienkāršo izteiksmi: 3(x + 4) − 2(x − 1). Atrodi vērtību, kad x = 5.', '19', 1, 'Сначала раскрой скобки: 3x + 12 − 2x + 2 = x + 14'),
  q(6,  'functions',  'График функции y = x² проходит через точку (3, y). Найди y.', 'Funkcijas y = x² grafiks iet caur punktu (3, y). Atrodi y.', '9', 1),
  q(7,  'geometry',   'Периметр равностороннего треугольника равен 27 см. Найди его сторону (в см).', 'Vienādmalu trijstūra perimetrs ir 27 cm. Atrodi tā malu (cm).', '9', 1),
  q(8,  'statistics', 'Найди медиану набора чисел: 3, 7, 2, 9, 5, 1, 8', 'Atrodi skaitļu kopas mediānu: 3, 7, 2, 9, 5, 1, 8', '5', 1, 'Упорядочи числа по возрастанию и найди средний элемент'),
  q(9,  'probability','Кубик бросают один раз. Какова вероятность выпадения чётного числа?', 'Kubi met vienu reizi. Kāda ir varbūtība, ka izkrīt pāra skaitlis?', '0.5', 1, 'Чётные: 2, 4, 6 — три из шести'),
  q(10, 'algebra',    'Геометрическая прогрессия: 2, 6, 18, ... Найди 5-й член.', 'Ģeometriskā progresija: 2, 6, 18, ... Atrodi 5. locekli.', '162', 1, 'Знаменатель q = 3, a₅ = 2 × 3⁴'),
  q(11, 'geometry',   'Объём куба равен 125 см³. Найди площадь одной грани (в см²).', 'Kuba tilpums ir 125 cm³. Atrodi vienas šķautnes laukumu (cm²).', '25', 2, 'Сторона куба = ³√125 = 5, площадь грани = 5² = 25'),
  q(12, 'algebra',    'В классе 30 учеников, из них 40% — мальчики. Сколько девочек?', 'Klasē ir 30 skolēni, no kuriem 40% ir zēni. Cik meitenēs?', '18', 1, '40% мальчиков = 12, девочек = 30 − 12'),
];

const MATH_9_2022 = [
  q(1,  'arithmetic', 'Вычисли: (−3) × (−4) + 6 ÷ 2', 'Aprēķini: (−3) × (−4) + 6 ÷ 2', '15', 1),
  q(2,  'algebra',    'Реши уравнение: 4(x − 2) = 12', 'Atrisini vienādojumu: 4(x − 2) = 12', '5', 1),
  q(3,  'algebra',    'При каком значении x выражение (x+3)/(x−2) не имеет смысла?', 'Pie kādas x vērtības izteiksmei (x+3)/(x−2) nav jēgas?', '2', 1, 'Знаменатель не может равняться нулю'),
  q(4,  'geometry',   'Угол при основании равнобедренного треугольника равен 65°. Найди угол при вершине.', 'Vienādkāju trijstūra leņķis pie pamata ir 65°. Atrodi leņķi pie virsotnes.', '50', 1, 'Сумма углов треугольника = 180°, два угла = 65°+65°'),
  q(5,  'algebra',    'Упрости: (a² − b²) / (a − b)', 'Vienkāršo: (a² − b²) / (a − b)', 'a+b', 1, 'Разность квадратов: a²−b² = (a−b)(a+b)'),
  q(6,  'functions',  'Функция задана формулой y = −x² + 4. При каком x функция принимает максимальное значение?', 'Funkcija dota ar formulu y = −x² + 4. Pie kāda x funkcija pieņem maksimālo vērtību?', '0', 1),
  q(7,  'statistics', 'Среднее двух чисел равно 15, одно из них 12. Найди второе.', 'Divu skaitļu vidējais ir 15, viens no tiem ir 12. Atrodi otro.', '18', 1),
  q(8,  'geometry',   'Площадь параллелограмма 48 см², основание 8 см. Найди высоту (в см).', 'Paralelograma laukums 48 cm², pamats 8 cm. Atrodi augstumu (cm).', '6', 1),
  q(9,  'algebra',    'Реши систему: 2x + y = 7, x − y = 2. Найди y.', 'Atrisini sistēmu: 2x + y = 7, x − y = 2. Atrodi y.', '1', 2),
  q(10, 'probability','Карточки с числами 1–10 перемешаны. Какова вероятность выбрать простое число?', 'Kartiņas ar skaitļiem 1–10 sajauktas. Kāda ir varbūtība izvēlēties pirmskaitli?', '0.4', 1, 'Простые: 2, 3, 5, 7 — четыре из десяти'),
  q(11, 'geometry',   'В прямоугольном треугольнике гипотенуза 13 см, один катет 5 см. Найди второй катет.', 'Taisnleņķa trijstūrī hipotenūza 13 cm, viens katets 5 cm. Atrodi otro katetu.', '12', 2, 'c² = a² + b², 13² = 5² + b²'),
  q(12, 'algebra',    'Найди НОД чисел 48 и 36.', 'Atrodi skaitļu 48 un 36 LKD.', '12', 1),
];

// ─────────────────────────────────────────────────────────── MATH GRADE 6 ───

const MATH_6_2024 = [
  q(1,  'arithmetic', 'Вычисли: 3/4 + 1/6', 'Aprēķini: 3/4 + 1/6', '11/12', 1, 'Общий знаменатель 12: 9/12 + 2/12'),
  q(2,  'arithmetic', 'Найди 25% от числа 80.', 'Atrodi 25% no skaitļa 80.', '20', 1, '80 × 0,25 = ?'),
  q(3,  'algebra',    'Реши уравнение: x / 4 = 7', 'Atrisini vienādojumu: x / 4 = 7', '28', 1),
  q(4,  'geometry',   'Периметр прямоугольника 36 см. Ширина 8 см. Найди длину (в см).', 'Taisnstūra perimetrs 36 cm. Platums 8 cm. Atrodi garumu (cm).', '10', 1, 'P = 2(a + b), 36 = 2(a + 8)'),
  q(5,  'arithmetic', 'Поезд прошёл 240 км за 3 часа. Найди скорость (км/ч).', 'Vilciens nobrauca 240 km 3 stundu laikā. Atrodi ātrumu (km/h).', '80', 1),
  q(6,  'arithmetic', 'Вычисли: 2³ × 5 − 10', 'Aprēķini: 2³ × 5 − 10', '30', 1, '2³ = 8, 8 × 5 = 40, 40 − 10 = 30'),
  q(7,  'statistics', 'Найди среднее значение: 12, 15, 9, 18, 6.', 'Atrodi vidējo vērtību: 12, 15, 9, 18, 6.', '12', 1),
  q(8,  'geometry',   'Площадь квадрата 81 см². Найди его периметр (в см).', 'Kvadrāta laukums 81 cm². Atrodi tā perimetru (cm).', '36', 1, 'Сторона = √81 = 9, P = 4 × 9'),
];

const MATH_6_2023 = [
  q(1,  'arithmetic', 'Вычисли: 2/3 + 3/4', 'Aprēķini: 2/3 + 3/4', '17/12', 1, 'Общий знаменатель 12'),
  q(2,  'arithmetic', 'Велосипедист проехал 60 км за 2,5 часа. Найди среднюю скорость (км/ч).', 'Riteņbraucējs nobrauca 60 km 2,5 stundu laikā. Atrodi vidējo ātrumu (km/h).', '24', 1),
  q(3,  'algebra',    'Реши уравнение: 3x − 4 = 11', 'Atrisini vienādojumu: 3x − 4 = 11', '5', 1),
  q(4,  'geometry',   'Площадь треугольника с основанием 10 см и высотой 8 см (в см²).', 'Trijstūra laukums ar pamatu 10 cm un augstumu 8 cm (cm²).', '40', 1, 'S = (a × h) / 2 = (10 × 8) / 2'),
  q(5,  'arithmetic', 'Из 45 учеников 60% присутствовали. Сколько человек пришли?', 'No 45 skolēniem 60% bija klāt. Cik skolēni ieradās?', '27', 1, '45 × 0,6 = ?'),
  q(6,  'arithmetic', 'Вычисли: 0,25 × 0,4', 'Aprēķini: 0,25 × 0,4', '0.1', 1),
  q(7,  'geometry',   'Длина комнаты 6 м, ширина 4 м. Найди площадь пола (в м²).', 'Istabas garums 6 m, platums 4 m. Atrodi grīdas laukumu (m²).', '24', 1),
  q(8,  'statistics', 'Температура за 5 дней: −3, +2, 0, −1, +4. Найди среднюю температуру.', 'Temperatūra 5 dienas: −3, +2, 0, −1, +4. Atrodi vidējo temperatūru.', '0.4', 1),
];

// ─────────────────────────────────────────────────────────── MATH GRADE 3 ───

const MATH_3_2024 = [
  q(1,  'arithmetic', 'Реши пример: 356 + 487', 'Atrisini: 356 + 487', '843', 1),
  q(2,  'arithmetic', 'Реши пример: 900 − 348', 'Atrisini: 900 − 348', '552', 1),
  q(3,  'arithmetic', 'Реши пример: 8 × 7', 'Atrisini: 8 × 7', '56', 1),
  q(4,  'arithmetic', 'Реши пример: 63 ÷ 9', 'Atrisini: 63 ÷ 9', '7', 1),
  q(5,  'geometry',   'Периметр квадрата со стороной 5 см (в см)?', 'Kvadrāta ar malu 5 cm perimetrs (cm)?', '20', 1),
  q(6,  'arithmetic', 'У Маши 24 конфеты. Она раздала поровну 4 друзьям. Сколько конфет получил каждый?', 'Mašai bija 24 konfektes. Viņa tās sadalīja 4 draugiem. Cik konfektes saņēma katrs?', '6', 1),
];

const MATH_3_2023 = [
  q(1,  'arithmetic', 'Реши пример: 248 + 365', 'Atrisini: 248 + 365', '613', 1),
  q(2,  'arithmetic', 'Реши пример: 700 − 253', 'Atrisini: 700 − 253', '447', 1),
  q(3,  'arithmetic', 'Реши пример: 9 × 6', 'Atrisini: 9 × 6', '54', 1),
  q(4,  'arithmetic', 'Реши пример: 45 ÷ 5', 'Atrisini: 45 ÷ 5', '9', 1),
  q(5,  'geometry',   'Длина прямоугольника 8 см, ширина 3 см. Найди периметр (в см).', 'Taisnstūra garums 8 cm, platums 3 cm. Atrodi perimetru (cm).', '22', 1, 'P = 2(8 + 3)'),
  q(6,  'arithmetic', 'В магазине 6 корзин, в каждой по 9 яблок. Сколько яблок всего?', 'Veikalā ir 6 grozs ar 9 āboliem katrā. Cik ābolu pavisam?', '54', 1),
];

// ─────────────────────────────────────────────────── EXAM CATALOG ───────────

export const EXAM_CATALOG = {
  'math-9-2024': {
    id: 'math-9-2024', subject: 'math', grade: 9, year: 2024,
    type: 'ce', duration: 60,
    title: { ru: 'Математика', lv: 'Matemātika', uk: 'Математика' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2024/ce_matematika_9_uzd.pdf',
    questions: MATH_9_2024,
  },
  'math-9-2023': {
    id: 'math-9-2023', subject: 'math', grade: 9, year: 2023,
    type: 'ce', duration: 60,
    title: { ru: 'Математика', lv: 'Matemātika', uk: 'Математика' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2023/ce_matematika_9_uzd.pdf',
    questions: MATH_9_2023,
  },
  'math-9-2022': {
    id: 'math-9-2022', subject: 'math', grade: 9, year: 2022,
    type: 'ce', duration: 60,
    title: { ru: 'Математика', lv: 'Matemātika', uk: 'Математика' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2022/ce_matematika_9_uzd.pdf',
    questions: MATH_9_2022,
  },
  'math-6-2024': {
    id: 'math-6-2024', subject: 'math', grade: 6, year: 2024,
    type: 'dd', duration: 45,
    title: { ru: 'Математика', lv: 'Matemātika', uk: 'Математика' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2024/dd_matematika_6.pdf',
    questions: MATH_6_2024,
  },
  'math-6-2023': {
    id: 'math-6-2023', subject: 'math', grade: 6, year: 2023,
    type: 'dd', duration: 45,
    title: { ru: 'Математика', lv: 'Matemātika', uk: 'Математика' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2023/dd_matematika_6.pdf',
    questions: MATH_6_2023,
  },
  'math-3-2024': {
    id: 'math-3-2024', subject: 'math', grade: 3, year: 2024,
    type: 'dd', duration: 40,
    title: { ru: 'Математика', lv: 'Matemātika', uk: 'Математика' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2024/dd_matematika_3.pdf',
    questions: MATH_3_2024,
  },
  'math-3-2023': {
    id: 'math-3-2023', subject: 'math', grade: 3, year: 2023,
    type: 'dd', duration: 40,
    title: { ru: 'Математика', lv: 'Matemātika', uk: 'Математика' },
    pdfUrl: 'https://visc.gov.lv/visc/images/eksameni/2023/dd_matematika_3.pdf',
    questions: MATH_3_2023,
  },
};

/** Get exams available for a given grade */
export function getExamsForGrade(grade) {
  return Object.values(EXAM_CATALOG).filter(e => e.grade === grade);
}

/** Get exams grouped by subject for a grade */
export function getExamsBySubject(grade) {
  const exams = getExamsForGrade(grade);
  const grouped = {};
  for (const exam of exams) {
    if (!grouped[exam.subject]) grouped[exam.subject] = [];
    grouped[exam.subject].push(exam);
  }
  return grouped;
}

/** Grade levels that have official exams/tests */
export const EXAM_GRADES = [3, 6, 9, 12];

/** Subject display info */
export const EXAM_SUBJECTS = {
  math:    { icon: '🔢', name: { ru: 'Математика',    lv: 'Matemātika', uk: 'Математика'    }, color: '#6366f1' },
  latvian: { icon: '📖', name: { ru: 'Латышский',     lv: 'Latviešu',   uk: 'Латвійська'    }, color: '#10b981' },
  english: { icon: '🇬🇧', name: { ru: 'Английский',   lv: 'Angļu val.', uk: 'Англійська'    }, color: '#f59e0b' },
};
