/**
 * Latvia School Curriculum — Math & English
 * Based on: MK noteikumi Nr.747 (2018) + Skola2030 national standards
 * Sources: https://www.skola2030.lv  &  https://likumi.lv/ta/id/303768
 *
 * Complete topic coverage for grades 1–12.
 */

export const SUBJECTS = {
  // ─────────────────────────────────────────────────────────── MATHEMATICS ───
  math: {
    id: 'math',
    icon: '🔢',
    gradient: 'from-blue-500 to-indigo-600',
    glow: 'shadow-blue-500/40',
    name: { ru: 'Математика', lv: 'Matemātika' },
    topics: {

      // ── 1 класс ──────────────────────────────────────────────────────────
      1: [
        { id: 'numbers_1_10',         name: { ru: 'Числа 1–10',                    lv: 'Skaitļi 1–10'                        }, xp: 30 },
        { id: 'numbers_1_20',         name: { ru: 'Числа 1–20',                    lv: 'Skaitļi 1–20'                        }, xp: 35 },
        { id: 'number_composition_1', name: { ru: 'Состав числа',                  lv: 'Skaitļa sastāvs'                     }, xp: 35 },
        { id: 'comparison_1',         name: { ru: 'Сравнение чисел (>, <, =)',      lv: 'Skaitļu salīdzināšana'               }, xp: 30 },
        { id: 'addition_1',           name: { ru: 'Сложение (до 20)',               lv: 'Saskaitīšana (līdz 20)'              }, xp: 50 },
        { id: 'subtraction_1',        name: { ru: 'Вычитание (до 20)',              lv: 'Atņemšana (līdz 20)'                }, xp: 50 },
        { id: 'ordinal_numbers_1',    name: { ru: 'Порядковые числа',              lv: 'Kārtas skaitļi'                      }, xp: 35 },
        { id: 'shapes_1',             name: { ru: 'Геометрические фигуры',         lv: 'Ģeometriskas figūras'                }, xp: 40 },
        { id: 'measurement_1',        name: { ru: 'Измерение длины (см, м)',        lv: 'Garuma mērīšana (cm, m)'             }, xp: 40 },
        { id: 'money_1',              name: { ru: 'Деньги (евро и центы)',          lv: 'Nauda (eiro un centi)'               }, xp: 40 },
        { id: 'time_days_1',          name: { ru: 'Дни недели, месяцы, сезоны',    lv: 'Nedēļas dienas, mēneši, gadalaiki'  }, xp: 35 },
        { id: 'word_problems_1',      name: { ru: 'Простые задачи (+ и −)',        lv: 'Vienkārši tekstuzdevumi (+ un −)'   }, xp: 45 },
      ],

      // ── 2 класс ──────────────────────────────────────────────────────────
      2: [
        { id: 'numbers_1_100',        name: { ru: 'Числа 1–100',                   lv: 'Skaitļi 1–100'                       }, xp: 50 },
        { id: 'place_value_2',        name: { ru: 'Разрядность (десятки, единицы)',lv: 'Ciparu vērtība (desmiti, vieninieki)'}, xp: 50 },
        { id: 'addition_100',         name: { ru: 'Сложение (до 100)',              lv: 'Saskaitīšana (līdz 100)'             }, xp: 60 },
        { id: 'subtraction_100',      name: { ru: 'Вычитание (до 100)',             lv: 'Atņemšana (līdz 100)'               }, xp: 60 },
        { id: 'multiplication_table', name: { ru: 'Таблица умножения (2–5)',        lv: 'Reizināšanas tabula (2–5)'           }, xp: 90 },
        { id: 'division_intro_2',     name: { ru: 'Деление (введение)',             lv: 'Dalīšana (ievads)'                  }, xp: 70 },
        { id: 'even_odd_2',           name: { ru: 'Чётные и нечётные числа',        lv: 'Pāra un nepāra skaitļi'             }, xp: 40 },
        { id: 'length_2',             name: { ru: 'Длина (м, дм, см)',              lv: 'Garums (m, dm, cm)'                 }, xp: 50 },
        { id: 'mass_2',               name: { ru: 'Масса (кг, г)',                  lv: 'Masa (kg, g)'                       }, xp: 50 },
        { id: 'volume_2',             name: { ru: 'Объём (литр, дл)',               lv: 'Tilpums (litrs, dl)'                }, xp: 45 },
        { id: 'time_2',               name: { ru: 'Время и часы',                  lv: 'Laiks un pulkstenis'                 }, xp: 50 },
        { id: 'shapes_2',             name: { ru: 'Квадрат и прямоугольник',        lv: 'Kvadrāts un taisnstūris'            }, xp: 50 },
        { id: 'word_problems_2',      name: { ru: 'Задачи на + − × ÷',            lv: 'Tekstuzdevumi (+ − × ÷)'            }, xp: 65 },
      ],

      // ── 3 класс ──────────────────────────────────────────────────────────
      3: [
        { id: 'numbers_1000',         name: { ru: 'Числа до 1000',                 lv: 'Skaitļi līdz 1000'                  }, xp: 60 },
        { id: 'place_value_3',        name: { ru: 'Разрядность (сотни, дес., ед.)',lv: 'Ciparu vērtība (simti, desmiti, vieninieki)' }, xp: 60 },
        { id: 'addition_1000',        name: { ru: 'Сложение до 1000',              lv: 'Saskaitīšana līdz 1000'             }, xp: 65 },
        { id: 'subtraction_1000',     name: { ru: 'Вычитание до 1000',             lv: 'Atņemšana līdz 1000'               }, xp: 65 },
        { id: 'multiplication',       name: { ru: 'Таблица умножения (6–9)',        lv: 'Reizināšanas tabula (6–9)'          }, xp: 80 },
        { id: 'division',             name: { ru: 'Деление',                       lv: 'Dalīšana'                           }, xp: 80 },
        { id: 'fractions_intro',      name: { ru: 'Введение в дроби (½, ⅓, ¼)',   lv: 'Ievads daļskaitļos (½, ⅓, ¼)'     }, xp: 90 },
        { id: 'perimeter_3',          name: { ru: 'Периметр фигур',                lv: 'Figūru perimetrs'                   }, xp: 70 },
        { id: 'area_intro_3',         name: { ru: 'Площадь (введение)',             lv: 'Laukums (ievads)'                  }, xp: 70 },
        { id: 'measurement_units_3',  name: { ru: 'Единицы измерения (км, т, л)',  lv: 'Mērvienības (km, t, l)'            }, xp: 65 },
        { id: 'time_3',               name: { ru: 'Время (ч, мин, сек)',            lv: 'Laiks (st, min, sek)'               }, xp: 60 },
        { id: 'symmetry_3',           name: { ru: 'Симметрия (введение)',           lv: 'Simetrija (ievads)'                }, xp: 65 },
        { id: 'word_problems_3',      name: { ru: 'Составные задачи',              lv: 'Salikti tekstuzdevumi'              }, xp: 80 },
      ],

      // ── 4 класс ──────────────────────────────────────────────────────────
      4: [
        { id: 'large_numbers',        name: { ru: 'Числа до 1 000 000',            lv: 'Skaitļi līdz 1 000 000'             }, xp: 70 },
        { id: 'place_value_4',        name: { ru: 'Разрядность (до миллиона)',      lv: 'Ciparu vērtība (līdz miljonam)'    }, xp: 70 },
        { id: 'calculations_order_4', name: { ru: 'Порядок действий',              lv: 'Darbību secība'                     }, xp: 75 },
        { id: 'fractions_basic',      name: { ru: 'Обыкновенные дроби',            lv: 'Parastie daļskaitļi'               }, xp: 90 },
        { id: 'fractions_add_4',      name: { ru: 'Сложение и вычитание дробей',   lv: 'Daļu saskaitīšana un atņemšana'    }, xp: 95 },
        { id: 'fractions_mult_4',     name: { ru: 'Умножение дроби на целое число',lv: 'Daļas reizināšana ar veselu skaitli'}, xp: 95 },
        { id: 'decimals_intro_4',     name: { ru: 'Десятичные дроби (знакомство)', lv: 'Decimāldaļskaitļi (iepazīšana)'    }, xp: 90 },
        { id: 'area_4',               name: { ru: 'Площадь фигур',                lv: 'Figūru laukums'                     }, xp: 90 },
        { id: 'angles_4',             name: { ru: 'Углы (острый, прямой, тупой)',  lv: 'Leņķi (šaurs, taisns, plats)'      }, xp: 70 },
        { id: 'measurement_units_4',  name: { ru: 'Единицы измерения (перевод)',   lv: 'Mērvienību pārveidošana'           }, xp: 75 },
        { id: 'symmetry_4',           name: { ru: 'Симметрия и осевая симметрия',  lv: 'Simetrija un asu simetrija'        }, xp: 70 },
        { id: 'coordinates_intro_4',  name: { ru: 'Координатная плоскость (введение)', lv: 'Koordinātu plakne (ievads)'    }, xp: 80 },
        { id: 'negative_intro_4',     name: { ru: 'Отрицательные числа (знакомство)', lv: 'Negatīvie skaitļi (iepazīšana)' }, xp: 80 },
        { id: 'word_problems_4',      name: { ru: 'Составные текстовые задачи',    lv: 'Salikti tekstuzdevumi'             }, xp: 100 },
      ],

      // ── 5 класс ──────────────────────────────────────────────────────────
      5: [
        { id: 'fractions_ops',        name: { ru: 'Действия с дробями',            lv: 'Darbības ar daļskaitļiem'           }, xp: 110 },
        { id: 'decimals',             name: { ru: 'Десятичные дроби',              lv: 'Decimāldaļskaitļi'                  }, xp: 110 },
        { id: 'decimals_ops_5',       name: { ru: 'Действия с десятичными дробями',lv: 'Darbības ar decimāldaļskaitļiem'   }, xp: 115 },
        { id: 'percentages_intro',    name: { ru: 'Проценты',                      lv: 'Procenti'                           }, xp: 120 },
        { id: 'ratio_intro_5',        name: { ru: 'Отношения чисел',               lv: 'Skaitļu attiecības'                 }, xp: 110 },
        { id: 'negative_numbers_5',   name: { ru: 'Отрицательные числа',           lv: 'Negatīvie skaitļi'                 }, xp: 110 },
        { id: 'powers_intro_5',       name: { ru: 'Степень числа (введение)',      lv: 'Skaitļa pakāpe (ievads)'            }, xp: 110 },
        { id: 'expressions_intro_5',  name: { ru: 'Буквенные выражения',           lv: 'Burtu izteiksmes'                  }, xp: 115 },
        { id: 'geometry_5',           name: { ru: 'Площади (треугольник, параллелограмм)', lv: 'Laukumi (trijstūris, paralelograms)' }, xp: 110 },
        { id: 'volume_intro_5',       name: { ru: 'Объём (введение)',              lv: 'Tilpums (ievads)'                   }, xp: 105 },
        { id: 'coordinates_5',        name: { ru: 'Координатная плоскость',        lv: 'Koordinātu plakne'                 }, xp: 100 },
        { id: 'statistics_intro_5',   name: { ru: 'Статистика (среднее, мода)',    lv: 'Statistika (vidējais, moda)'        }, xp: 100 },
        { id: 'word_problems_5',      name: { ru: 'Задачи на дроби и проценты',   lv: 'Uzdevumi par daļskaitļiem un procentiem' }, xp: 120 },
      ],

      // ── 6 класс ──────────────────────────────────────────────────────────
      6: [
        { id: 'negative_numbers',     name: { ru: 'Отрицательные числа',           lv: 'Negatīvie skaitļi'                 }, xp: 120 },
        { id: 'powers_6',             name: { ru: 'Степени и стандартный вид',     lv: 'Pakāpes un standartforma'           }, xp: 125 },
        { id: 'ratios',               name: { ru: 'Отношения и пропорции',         lv: 'Attiecības un proporcijas'          }, xp: 130 },
        { id: 'percentages_6',        name: { ru: 'Процентные вычисления',         lv: 'Procentu aprēķini'                 }, xp: 130 },
        { id: 'algebra_intro',        name: { ru: 'Введение в алгебру',            lv: 'Ievads algebrā'                    }, xp: 140 },
        { id: 'equations_simple_6',   name: { ru: 'Простые уравнения',             lv: 'Vienkārši vienādojumi'             }, xp: 135 },
        { id: 'fractions_adv_6',      name: { ru: 'Дроби (углублённо)',            lv: 'Daļskaitļi (padziļināti)'          }, xp: 125 },
        { id: 'circle_6',             name: { ru: 'Окружность и круг',             lv: 'Aplis un riņķa līnija'             }, xp: 120 },
        { id: 'prism_6',              name: { ru: 'Прямоугольный параллелепипед',  lv: 'Taisnstūra paralēlskaldnis'        }, xp: 130 },
        { id: 'volume_6',             name: { ru: 'Объём тел',                     lv: 'Ķermeņu tilpums'                   }, xp: 130 },
        { id: 'statistics_6',         name: { ru: 'Статистика',                   lv: 'Statistika'                         }, xp: 110 },
        { id: 'transformations_6',    name: { ru: 'Преобразования фигур',          lv: 'Figūru transformācijas'            }, xp: 120 },
        { id: 'word_problems_6',      name: { ru: 'Задачи на пропорции и %',       lv: 'Uzdevumi par proporcijām un %'     }, xp: 130 },
      ],

      // ── 7 класс ──────────────────────────────────────────────────────────
      7: [
        { id: 'algebraic_expr_7',     name: { ru: 'Алгебраические выражения',      lv: 'Algebriskie izteiksmes'            }, xp: 145 },
        { id: 'linear_equations',     name: { ru: 'Линейные уравнения',            lv: 'Lineāri vienādojumi'               }, xp: 150 },
        { id: 'inequalities_7',       name: { ru: 'Неравенства',                   lv: 'Nevienādības'                      }, xp: 140 },
        { id: 'rational_nums',        name: { ru: 'Рациональные числа',            lv: 'Racionālie skaitļi'                }, xp: 130 },
        { id: 'roots_intro_7',        name: { ru: 'Квадратный корень (введение)',  lv: 'Kvadrātsakne (ievads)'             }, xp: 145 },
        { id: 'linear_functions',     name: { ru: 'Линейные функции',              lv: 'Lineārās funkcijas'                }, xp: 155 },
        { id: 'functions_intro',      name: { ru: 'Понятие функции',               lv: 'Funkcijas jēdziens'               }, xp: 160 },
        { id: 'geometry_angles',      name: { ru: 'Треугольники и углы',           lv: 'Trijstūri un leņķi'               }, xp: 140 },
        { id: 'parallel_lines_7',     name: { ru: 'Параллельные прямые',           lv: 'Paralēlas taisnes'                }, xp: 135 },
        { id: 'similar_figures_7',    name: { ru: 'Подобные фигуры',              lv: 'Līdzīgas figūras'                  }, xp: 140 },
        { id: 'area_volume_7',        name: { ru: 'Площади и объёмы (практика)',   lv: 'Laukumi un tilpumi (prakse)'       }, xp: 145 },
        { id: 'statistics_7',         name: { ru: 'Статистика и диаграммы',        lv: 'Statistika un diagrammas'          }, xp: 130 },
      ],

      // ── 8 класс ──────────────────────────────────────────────────────────
      8: [
        { id: 'algebraic_fractions_8',name: { ru: 'Алгебраические дроби',         lv: 'Algebriski daļskaitļi'             }, xp: 175 },
        { id: 'roots_powers',         name: { ru: 'Степени и корни',              lv: 'Pakāpes un saknes'                  }, xp: 170 },
        { id: 'quadratic_eq',         name: { ru: 'Квадратные уравнения',         lv: 'Kvadrātvienādojumi'                }, xp: 180 },
        { id: 'vieta_8',              name: { ru: 'Теорема Виета',                lv: 'Vjeta teorēma'                      }, xp: 175 },
        { id: 'quadratic_func_8',     name: { ru: 'Квадратичная функция',         lv: 'Kvadrātfunkcija'                   }, xp: 185 },
        { id: 'systems_eq',           name: { ru: 'Системы уравнений',            lv: 'Vienādojumu sistēmas'              }, xp: 190 },
        { id: 'pythagoras',           name: { ru: 'Теорема Пифагора',             lv: 'Pitagora teorēma'                  }, xp: 160 },
        { id: 'circle_geometry_8',    name: { ru: 'Геометрия круга',              lv: 'Apļa ģeometrija'                   }, xp: 165 },
        { id: 'solid_geometry_8',     name: { ru: 'Тела (цилиндр, конус, шар)',   lv: 'Ķermeņi (cilindrs, konuss, sfēra)' }, xp: 175 },
        { id: 'probability_8',        name: { ru: 'Вероятность',                  lv: 'Varbūtība'                         }, xp: 160 },
        { id: 'statistics_8',         name: { ru: 'Статистика (медиана, мода)',   lv: 'Statistika (mediāna, moda)'         }, xp: 155 },
        { id: 'word_problems_8',      name: { ru: 'Задачи (алгебра + геометрия)', lv: 'Uzdevumi (algebra + ģeometrija)'   }, xp: 185 },
      ],

      // ── 9 класс ──────────────────────────────────────────────────────────
      9: [
        { id: 'polynomials',          name: { ru: 'Многочлены',                   lv: 'Polinomi'                           }, xp: 200 },
        { id: 'factoring_9',          name: { ru: 'Разложение на множители',      lv: 'Sadalīšana reizinātājos'            }, xp: 195 },
        { id: 'quadratic_adv_9',      name: { ru: 'Квадратные уравнения (углублённо)', lv: 'Kvadrātvienādojumi (padziļināti)' }, xp: 205 },
        { id: 'exponential_eq_9',     name: { ru: 'Показательные уравнения',      lv: 'Eksponenciāli vienādojumi'         }, xp: 210 },
        { id: 'trigonometry_9',       name: { ru: 'Тригонометрия (основы)',       lv: 'Trigonometrija (pamati)'           }, xp: 210 },
        { id: 'sequences_9',          name: { ru: 'Последовательности',           lv: 'Virknes'                            }, xp: 190 },
        { id: 'solid_geometry_9',     name: { ru: 'Тела вращения',                lv: 'Rotācijas ķermeņi'                 }, xp: 200 },
        { id: 'logarithms_intro_9',   name: { ru: 'Введение в логарифмы',         lv: 'Ievads logaritmos'                 }, xp: 210 },
        { id: 'probability_adv_9',    name: { ru: 'Вероятность (углублённо)',     lv: 'Varbūtība (padziļināti)'           }, xp: 200 },
        { id: 'statistics_adv_9',     name: { ru: 'Статистика (продвинутая)',     lv: 'Statistika (padziļināta)'           }, xp: 195 },
        { id: 'functions_adv_9',      name: { ru: 'Функции (углублённо)',         lv: 'Funkcijas (padziļināti)'            }, xp: 205 },
        { id: 'exam_prep_9',          name: { ru: 'Подготовка к экзамену (9 кл.)',lv: 'Eksāmena sagatavošana (9. kl.)'    }, xp: 250 },
      ],

      // ── 10 класс ─────────────────────────────────────────────────────────
      10: [
        { id: 'functions_10',         name: { ru: 'Функции и графики',            lv: 'Funkcijas un grafiki'               }, xp: 220 },
        { id: 'exponential_10',       name: { ru: 'Показательная функция',        lv: 'Eksponenciālā funkcija'             }, xp: 225 },
        { id: 'logarithms',           name: { ru: 'Логарифмы',                    lv: 'Logaritmi'                         }, xp: 230 },
        { id: 'logarithm_func_10',    name: { ru: 'Логарифмическая функция',      lv: 'Logaritmiskā funkcija'             }, xp: 230 },
        { id: 'trig_circle',          name: { ru: 'Тригонометрический круг',      lv: 'Trigonometriskais aplis'           }, xp: 230 },
        { id: 'trig_equations_10',    name: { ru: 'Тригонометрические уравнения', lv: 'Trigonometriski vienādojumi'       }, xp: 235 },
        { id: 'vectors_10',           name: { ru: 'Векторы',                      lv: 'Vektori'                           }, xp: 220 },
        { id: 'analytical_geom_10',   name: { ru: 'Аналитическая геометрия',      lv: 'Analītiskā ģeometrija'            }, xp: 235 },
        { id: 'solid_geom_10',        name: { ru: 'Стереометрия',                 lv: 'Stereometrija'                     }, xp: 240 },
        { id: 'derivatives_intro_10', name: { ru: 'Производная (введение)',       lv: 'Atvasinājums (ievads)'              }, xp: 240 },
        { id: 'combinatorics_10',     name: { ru: 'Комбинаторика',                lv: 'Kombinatorika'                     }, xp: 220 },
        { id: 'probability_10',       name: { ru: 'Вероятность',                  lv: 'Varbūtība'                         }, xp: 215 },
      ],

      // ── 11 класс ─────────────────────────────────────────────────────────
      11: [
        { id: 'trig_adv',             name: { ru: 'Тригонометрия (углублённо)',    lv: 'Trigonometrija (padziļināta)'      }, xp: 250 },
        { id: 'trig_formulas_11',     name: { ru: 'Формулы тригонометрии',        lv: 'Trigonometrijas formulas'          }, xp: 255 },
        { id: 'combinatorics',        name: { ru: 'Комбинаторика',                lv: 'Kombinatorika'                     }, xp: 240 },
        { id: 'derivatives',          name: { ru: 'Производная функции',          lv: 'Funkcijas atvasinājums'            }, xp: 280 },
        { id: 'derivatives_apps_11',  name: { ru: 'Применение производной',       lv: 'Atvasinājuma pielietojumi'         }, xp: 275 },
        { id: 'integrals_intro_11',   name: { ru: 'Введение в интегралы',         lv: 'Ievads integrāļos'                 }, xp: 280 },
        { id: 'sequences_adv_11',     name: { ru: 'Прогрессии (арифм. и геом.)',  lv: 'Progresijas (aritmētiskā un ģeometriskā)' }, xp: 260 },
        { id: 'analytical_geom_11',   name: { ru: 'Аналитическая геометрия',      lv: 'Analītiskā ģeometrija'            }, xp: 265 },
        { id: 'probability_11',       name: { ru: 'Теория вероятностей',          lv: 'Varbūtību teorija'                 }, xp: 260 },
        { id: 'statistics_11',        name: { ru: 'Математическая статистика',    lv: 'Matemātiskā statistika'            }, xp: 250 },
        { id: 'complex_nums_intro_11',name: { ru: 'Комплексные числа (введение)', lv: 'Kompleksie skaitļi (ievads)'       }, xp: 265 },
      ],

      // ── 12 класс ─────────────────────────────────────────────────────────
      12: [
        { id: 'integrals',            name: { ru: 'Интегральное исчисление',       lv: 'Integrālrēķins'                   }, xp: 300 },
        { id: 'integral_apps_12',     name: { ru: 'Применение интегралов',         lv: 'Integrāļu pielietojumi'           }, xp: 295 },
        { id: 'complex_nums',         name: { ru: 'Комплексные числа',             lv: 'Kompleksie skaitļi'               }, xp: 290 },
        { id: 'diff_equations',       name: { ru: 'Дифференциальные уравнения',    lv: 'Diferenciālvienādojumi'            }, xp: 300 },
        { id: 'numerical_methods_12', name: { ru: 'Численные методы',             lv: 'Skaitliskās metodes'               }, xp: 285 },
        { id: 'algebra_ce_12',        name: { ru: 'ЦЭ — Алгебра',                 lv: 'CE — Algebra'                     }, xp: 295 },
        { id: 'geometry_ce_12',       name: { ru: 'ЦЭ — Геометрия',               lv: 'CE — Ģeometrija'                  }, xp: 295 },
        { id: 'probability_ce_12',    name: { ru: 'ЦЭ — Вероятность и статистика',lv: 'CE — Varbūtība un statistika'     }, xp: 290 },
        { id: 'functions_ce_12',      name: { ru: 'ЦЭ — Функции и графики',       lv: 'CE — Funkcijas un grafiki'        }, xp: 295 },
        { id: 'ce_math_prep',         name: { ru: 'Полная подготовка к ЦЭ',       lv: 'Pilna sagatavošana CE'            }, xp: 350 },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────── ENGLISH ───────
  english: {
    id: 'english',
    icon: '🌍',
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'shadow-emerald-500/40',
    name: { ru: 'Английский язык', lv: 'Angļu valoda' },
    topics: {

      // ── 1 класс — Pre-A1 ─────────────────────────────────────────────────
      1: [
        { id: 'alphabet',             name: { ru: 'Алфавит',                       lv: 'Alfabēts'                          }, xp: 40 },
        { id: 'phonics_1',            name: { ru: 'Звуки и буквы (фоника)',        lv: 'Skaņas un burti (fonika)'          }, xp: 40 },
        { id: 'greetings',            name: { ru: 'Приветствия и прощания',        lv: 'Sveicieni un atvadīšanās'          }, xp: 40 },
        { id: 'colors_numbers',       name: { ru: 'Цвета и цифры 1–10',            lv: 'Krāsas un cipari 1–10'             }, xp: 50 },
        { id: 'numbers_11_20_1',      name: { ru: 'Числа 11–20',                   lv: 'Skaitļi 11–20'                     }, xp: 45 },
        { id: 'classroom',            name: { ru: 'Предметы в классе',             lv: 'Klases priekšmeti'                 }, xp: 50 },
        { id: 'body_parts_1',         name: { ru: 'Части тела',                    lv: 'Ķermeņa daļas'                    }, xp: 50 },
        { id: 'animals_basic_1',      name: { ru: 'Животные (базовые)',            lv: 'Dzīvnieki (pamata)'               }, xp: 50 },
        { id: 'family_basic_1',       name: { ru: 'Семья (мама, папа, брат…)',     lv: 'Ģimene (māte, tēvs, brālis…)'     }, xp: 45 },
        { id: 'can_basic_1',          name: { ru: 'Can / Can\'t (я умею…)',        lv: 'Can / Can\'t (es protu…)'          }, xp: 50 },
        { id: 'question_words_1',     name: { ru: 'Вопросительные слова (What? Who?)', lv: 'Jautājuma vārdi (What? Who?)' }, xp: 45 },
        { id: 'actions_1',            name: { ru: 'Простые действия (run, jump…)', lv: 'Vienkāršas darbības (run, jump…)' }, xp: 45 },
      ],

      // ── 2 класс — A1 ─────────────────────────────────────────────────────
      2: [
        { id: 'family',               name: { ru: 'Семья',                         lv: 'Ģimene'                            }, xp: 60 },
        { id: 'animals',              name: { ru: 'Животные',                      lv: 'Dzīvnieki'                         }, xp: 60 },
        { id: 'food_basic_2',         name: { ru: 'Еда и напитки',                 lv: 'Ēdiens un dzērieni'               }, xp: 60 },
        { id: 'weather_seasons_2',    name: { ru: 'Погода и времена года',         lv: 'Laika apstākļi un gadalaiki'       }, xp: 55 },
        { id: 'days_months_2',        name: { ru: 'Дни недели и месяцы',           lv: 'Nedēļas dienas un mēneši'          }, xp: 55 },
        { id: 'to_be',                name: { ru: 'Глагол TO BE (am / is / are)',  lv: 'Darbības vārds TO BE'             }, xp: 70 },
        { id: 'have_has_2',           name: { ru: 'Have / Has (иметь)',            lv: 'Have / Has'                        }, xp: 65 },
        { id: 'can_ability_2',        name: { ru: 'Can (умение и разрешение)',     lv: 'Can (prasme un atļauja)'           }, xp: 65 },
        { id: 'like_dislike_2',       name: { ru: 'I like / I don\'t like',        lv: 'I like / I don\'t like'            }, xp: 60 },
        { id: 'this_that_2',          name: { ru: 'This / That / These / Those',  lv: 'This / That / These / Those'       }, xp: 60 },
        { id: 'prepositions_basic_2', name: { ru: 'Предлоги (in, on, under, next to)', lv: 'Prievārdi (in, on, under, next to)' }, xp: 65 },
        { id: 'simple_sent',          name: { ru: 'Простые предложения',           lv: 'Vienkārši teikumi'                }, xp: 70 },
      ],

      // ── 3 класс — A1 ─────────────────────────────────────────────────────
      3: [
        { id: 'present_simple',       name: { ru: 'Present Simple',               lv: 'Present Simple'                    }, xp: 90 },
        { id: 'frequency_adv_3',      name: { ru: 'Наречия частоты (always, never…)', lv: 'Biežuma apstākļa vārdi'        }, xp: 80 },
        { id: 'question_words_3',     name: { ru: 'Вопросительные слова (Where? When? Why?)', lv: 'Jautājuma vārdi'      }, xp: 75 },
        { id: 'house_rooms',          name: { ru: 'Дом и комнаты',                 lv: 'Māja un istabas'                  }, xp: 70 },
        { id: 'food',                 name: { ru: 'Еда и напитки',                 lv: 'Ēdiens un dzērieni'               }, xp: 70 },
        { id: 'hobbies_3',            name: { ru: 'Хобби и досуг',                 lv: 'Hobiji un brīvais laiks'          }, xp: 75 },
        { id: 'articles_3',           name: { ru: 'Артикли (a, an, the)',          lv: 'Artikli (a, an, the)'             }, xp: 80 },
        { id: 'adjectives_3',         name: { ru: 'Прилагательные',               lv: 'Īpašības vārdi'                   }, xp: 75 },
        { id: 'plurals_3',            name: { ru: 'Множественное число',           lv: 'Daudzskaitlis'                    }, xp: 75 },
        { id: 'possessives',          name: { ru: 'Притяжательные местоимения',    lv: 'Piederības vietniekvārdi'          }, xp: 80 },
        { id: 'prepositions_3',       name: { ru: 'Предлоги места и времени',     lv: 'Vietas un laika prievārdi'        }, xp: 75 },
        { id: 'short_answers_3',      name: { ru: 'Краткие ответы (Yes, I do / No, I don\'t)', lv: 'Īsas atbildes'      }, xp: 75 },
      ],

      // ── 4 класс — A1+ ────────────────────────────────────────────────────
      4: [
        { id: 'present_continuous',   name: { ru: 'Present Continuous',           lv: 'Present Continuous'               }, xp: 100 },
        { id: 'past_simple',          name: { ru: 'Past Simple',                  lv: 'Past Simple'                      }, xp: 110 },
        { id: 'irregular_verbs_4',    name: { ru: 'Неправильные глаголы',         lv: 'Neregulārie darbības vārdi'        }, xp: 110 },
        { id: 'was_were_4',           name: { ru: 'Was / Were (прошедшее BE)',     lv: 'Was / Were'                       }, xp: 95 },
        { id: 'could_4',              name: { ru: 'Could (мог, умел)',             lv: 'Could'                            }, xp: 90 },
        { id: 'would_like_4',         name: { ru: 'Would like (хотел бы)',         lv: 'Would like'                       }, xp: 90 },
        { id: 'there_is_are_4',       name: { ru: 'There is / There are',         lv: 'There is / There are'             }, xp: 90 },
        { id: 'comparison_adj_4',     name: { ru: 'Степени сравнения прилагательных', lv: 'Salīdzināšanas pakāpes'       }, xp: 100 },
        { id: 'plural_nouns',         name: { ru: 'Множественное число существительных', lv: 'Lietvārdu daudzskaitlis'    }, xp: 90 },
        { id: 'sports_hobbies_4',     name: { ru: 'Спорт и хобби',               lv: 'Sports un hobiji'                 }, xp: 90 },
        { id: 'transport_4',          name: { ru: 'Транспорт и путешествия',      lv: 'Transports un ceļošana'           }, xp: 90 },
        { id: 'reading_4',            name: { ru: 'Чтение (уровень A1)',           lv: 'Lasīšana (A1 līmenis)'            }, xp: 100 },
      ],

      // ── 5 класс — A2 ─────────────────────────────────────────────────────
      5: [
        { id: 'future_will',          name: { ru: 'Future Simple (will)',          lv: 'Future Simple (will)'             }, xp: 120 },
        { id: 'future_going_to_5',    name: { ru: 'Future (be going to)',          lv: 'Future (be going to)'             }, xp: 120 },
        { id: 'present_perfect',      name: { ru: 'Present Perfect',              lv: 'Present Perfect'                  }, xp: 130 },
        { id: 'past_continuous_5',    name: { ru: 'Past Continuous',              lv: 'Past Continuous'                  }, xp: 125 },
        { id: 'modal_verbs',          name: { ru: 'Модальные глаголы (must, should, might)', lv: 'Modālie darbības vārdi' }, xp: 130 },
        { id: 'countable_5',          name: { ru: 'Исчисляемые / неисчисляемые',  lv: 'Skaitāmie / neskaitāmie'         }, xp: 115 },
        { id: 'much_many_5',          name: { ru: 'Much / Many / A lot of / Few / Little', lv: 'Much / Many / A lot of'   }, xp: 115 },
        { id: 'too_enough_5',         name: { ru: 'Too / Enough',                 lv: 'Too / Enough'                     }, xp: 115 },
        { id: 'travel_5',             name: { ru: 'Путешествия и транспорт',      lv: 'Ceļošana un transports'           }, xp: 115 },
        { id: 'nature_5',             name: { ru: 'Природа и животные',           lv: 'Daba un dzīvnieki'                }, xp: 110 },
        { id: 'reading_5',            name: { ru: 'Чтение (A2)',                  lv: 'Lasīšana (A2)'                    }, xp: 115 },
        { id: 'vocabulary_5',         name: { ru: 'Тематическая лексика A2',      lv: 'Tematiskā vārdnīca A2'            }, xp: 110 },
      ],

      // ── 6 класс — A2+ ────────────────────────────────────────────────────
      6: [
        { id: 'conditionals_1',       name: { ru: 'Conditional I (реальное условие)', lv: 'Nosacījuma teikumi I'         }, xp: 140 },
        { id: 'passive_voice',        name: { ru: 'Пассивный залог',              lv: 'Pasīvā kārta'                     }, xp: 150 },
        { id: 'relative_clauses_6',   name: { ru: 'Относительные придаточные (who, which, that)', lv: 'Relatīvie palīgteikumi' }, xp: 145 },
        { id: 'question_tags_6',      name: { ru: 'Разделительные вопросы (isn\'t it?)', lv: 'Šķirošanas jautājumi'      }, xp: 135 },
        { id: 'used_to_6',            name: { ru: 'Used to (раньше делал)',        lv: 'Used to'                          }, xp: 135 },
        { id: 'past_perfect_6',       name: { ru: 'Past Perfect (введение)',      lv: 'Past Perfect (ievads)'            }, xp: 140 },
        { id: 'writing_letter',       name: { ru: 'Написание письма/имейла',      lv: 'Vēstules / e-pasta rakstīšana'    }, xp: 140 },
        { id: 'environment_6',        name: { ru: 'Лексика: Экология',            lv: 'Vārdnīca: Ekoloģija'             }, xp: 130 },
        { id: 'technology_6',         name: { ru: 'Лексика: Технологии',          lv: 'Vārdnīca: Tehnoloģijas'          }, xp: 130 },
        { id: 'reading_6',            name: { ru: 'Чтение (A2)',                  lv: 'Lasīšana (A2)'                    }, xp: 130 },
        { id: 'speaking_6',           name: { ru: 'Разговорная практика A2',      lv: 'Runāšanas prakse A2'              }, xp: 135 },
        { id: 'reported_intro_6',     name: { ru: 'Косвенная речь (введение)',    lv: 'Netiešā runa (ievads)'            }, xp: 140 },
      ],

      // ── 7 класс — B1 ─────────────────────────────────────────────────────
      7: [
        { id: 'past_perfect',         name: { ru: 'Past Perfect',                 lv: 'Past Perfect'                     }, xp: 160 },
        { id: 'reported_speech',      name: { ru: 'Косвенная речь',               lv: 'Netiešā runa'                     }, xp: 170 },
        { id: 'conditionals_2',       name: { ru: 'Conditional II (нереальное условие)', lv: 'Nosacījuma teikumi II'     }, xp: 170 },
        { id: 'gerunds_inf_7',        name: { ru: 'Герундий и инфинитив',         lv: 'Ģerundijs un infinitīvs'          }, xp: 165 },
        { id: 'phrasal_verbs_7',      name: { ru: 'Фразовые глаголы',             lv: 'Frazālie darbības vārdi'          }, xp: 160 },
        { id: 'linking_words_7',      name: { ru: 'Слова-связки (however, although…)', lv: 'Savienojuma vārdi'          }, xp: 155 },
        { id: 'b1_vocab',             name: { ru: 'Лексика B1 (общественные темы)',lv: 'Vārdnīca B1'                     }, xp: 150 },
        { id: 'society_7',            name: { ru: 'Лексика: Общество и культура', lv: 'Vārdnīca: Sabiedrība un kultūra' }, xp: 150 },
        { id: 'reading_b1_7',         name: { ru: 'Чтение B1',                   lv: 'Lasīšana B1'                      }, xp: 155 },
        { id: 'writing_essay_7',      name: { ru: 'Написание эссе (введение)',    lv: 'Esejas rakstīšana (ievads)'       }, xp: 165 },
        { id: 'listening_7',          name: { ru: 'Аудирование A2+',              lv: 'Klausīšanās A2+'                  }, xp: 155 },
        { id: 'speaking_b1_7',        name: { ru: 'Разговорная практика B1',      lv: 'Runāšanas prakse B1'              }, xp: 160 },
      ],

      // ── 8 класс — B1+ ────────────────────────────────────────────────────
      8: [
        { id: 'grammar_adv_8',        name: { ru: 'Смешанные времена',            lv: 'Jaukti laiki'                     }, xp: 190 },
        { id: 'wish_8',               name: { ru: 'Wish / If only',               lv: 'Wish / If only'                   }, xp: 185 },
        { id: 'mixed_cond_8',         name: { ru: 'Смешанные условные предложения',lv: 'Jaukti nosacījumi'               }, xp: 190 },
        { id: 'passive_adv_8',        name: { ru: 'Пассивный залог (все времена)', lv: 'Pasīvā kārta (visi laiki)'       }, xp: 190 },
        { id: 'inversion_8',          name: { ru: 'Инверсия в предложениях',      lv: 'Inversija teikumos'               }, xp: 185 },
        { id: 'formal_writing',       name: { ru: 'Официальный стиль письма',     lv: 'Formālais rakstīšanas stils'      }, xp: 200 },
        { id: 'writing_report_8',     name: { ru: 'Написание отчёта / рецензии',  lv: 'Ziņojuma / recenzijas rakstīšana' }, xp: 195 },
        { id: 'b1_plus_vocab_8',      name: { ru: 'Лексика B1+',                 lv: 'Vārdnīca B1+'                     }, xp: 185 },
        { id: 'reading_8',            name: { ru: 'Чтение (B1)',                  lv: 'Lasīšana (B1)'                    }, xp: 180 },
        { id: 'listening_8',          name: { ru: 'Аудирование',                  lv: 'Klausīšanās'                      }, xp: 170 },
        { id: 'speaking_8',           name: { ru: 'Разговорная практика B1+',     lv: 'Runāšanas prakse B1+'             }, xp: 185 },
        { id: 'media_literacy_8',     name: { ru: 'Лексика: СМИ и общество',     lv: 'Vārdnīca: Mediji un sabiedrība'   }, xp: 180 },
      ],

      // ── 9 класс — B1+/B2 (экзамен) ───────────────────────────────────────
      9: [
        { id: 'b2_grammar_9',         name: { ru: 'Грамматика B2 (введение)',     lv: 'Gramatika B2 (ievads)'            }, xp: 220 },
        { id: 'grammar_exam_9',       name: { ru: 'Грамматика к экзамену',        lv: 'Gramatika eksāmenam'              }, xp: 220 },
        { id: 'advanced_vocab_9',     name: { ru: 'Лексика к экзамену',           lv: 'Vārdnīca eksāmenam'              }, xp: 215 },
        { id: 'register_9',           name: { ru: 'Стиль и регистр речи',         lv: 'Runas stils un reģistrs'          }, xp: 210 },
        { id: 'reading_exam_9',       name: { ru: 'Чтение к экзамену',            lv: 'Lasīšana eksāmenam'              }, xp: 210 },
        { id: 'writing_exam_9',       name: { ru: 'Письмо к экзамену',            lv: 'Rakstīšana eksāmenam'            }, xp: 220 },
        { id: 'listening_exam_9',     name: { ru: 'Аудирование к экзамену',       lv: 'Klausīšanās eksāmenam'           }, xp: 210 },
        { id: 'speaking_9',           name: { ru: 'Устная речь',                  lv: 'Runāšana'                         }, xp: 230 },
        { id: 'global_topics_9',      name: { ru: 'Темы: Экология и технологии', lv: 'Tēmas: Ekoloģija un tehnoloģijas' }, xp: 215 },
        { id: 'culture_9',            name: { ru: 'Культура и традиции',          lv: 'Kultūra un tradīcijas'            }, xp: 210 },
        { id: 'test_strategies_9',    name: { ru: 'Стратегии выполнения заданий', lv: 'Uzdevumu izpildes stratēģijas'    }, xp: 220 },
        { id: 'practice_test_9',      name: { ru: 'Пробный экзамен',              lv: 'Izmēģinājuma eksāmens'           }, xp: 260 },
      ],

      // ── 10 класс — B2 ────────────────────────────────────────────────────
      10: [
        { id: 'advanced_gram_10',     name: { ru: 'Продвинутая грамматика B2',    lv: 'Padziļināta gramatika B2'         }, xp: 240 },
        { id: 'cleft_sentences_10',   name: { ru: 'Эмфатические конструкции',     lv: 'Uzsvertas konstrukcijas'          }, xp: 240 },
        { id: 'nominalization_10',    name: { ru: 'Номинализация и стиль',        lv: 'Nominalizācija un stils'          }, xp: 245 },
        { id: 'conditionals_3_10',    name: { ru: 'Conditional III',              lv: 'Nosacījuma teikumi III'           }, xp: 240 },
        { id: 'academic_writing',     name: { ru: 'Академическое эссе',           lv: 'Akadēmiskā eseja'                 }, xp: 260 },
        { id: 'literature_10',        name: { ru: 'Английская литература',        lv: 'Angļu literatūra'                 }, xp: 250 },
        { id: 'media_10',             name: { ru: 'СМИ и медиаграмотность',       lv: 'Mediji un medijpratība'           }, xp: 240 },
        { id: 'globalisation_10',     name: { ru: 'Глобализация и общество',      lv: 'Globalizācija un sabiedrība'      }, xp: 245 },
        { id: 'speaking_adv',         name: { ru: 'Дискуссия и аргументация',     lv: 'Diskusija un argumentācija'       }, xp: 250 },
        { id: 'reading_b2_10',        name: { ru: 'Чтение B2',                    lv: 'Lasīšana B2'                      }, xp: 245 },
        { id: 'listening_b2_10',      name: { ru: 'Аудирование B2',               lv: 'Klausīšanās B2'                   }, xp: 240 },
      ],

      // ── 11 класс — B2+/C1 ────────────────────────────────────────────────
      11: [
        { id: 'complex_grammar',      name: { ru: 'Комплексная грамматика',       lv: 'Kompleksā gramatika'              }, xp: 270 },
        { id: 'subjunctive_11',       name: { ru: 'Сослагательное наклонение',    lv: 'Konjunktīvs'                      }, xp: 270 },
        { id: 'advanced_vocab_11',    name: { ru: 'Продвинутая лексика C1',       lv: 'Padziļinātā vārdnīca C1'         }, xp: 275 },
        { id: 'world_lit',            name: { ru: 'Мировая литература на английском', lv: 'Pasaules literatūra angliski' }, xp: 280 },
        { id: 'ethics_society_11',    name: { ru: 'Этика и общество',             lv: 'Ētika un sabiedrība'              }, xp: 275 },
        { id: 'science_tech_11',      name: { ru: 'Наука и технологии',           lv: 'Zinātne un tehnoloģijas'          }, xp: 275 },
        { id: 'academic_register_11', name: { ru: 'Академический стиль',          lv: 'Akadēmiskais stils'              }, xp: 280 },
        { id: 'ce_writing_11',        name: { ru: 'Эссе для ЦЭ',                  lv: 'CE eseja'                         }, xp: 290 },
        { id: 'oral_prep_11',         name: { ru: 'Устная часть ЦЭ',              lv: 'CE mutiskā daļa'                  }, xp: 300 },
        { id: 'reading_c1_11',        name: { ru: 'Чтение C1',                    lv: 'Lasīšana C1'                      }, xp: 280 },
        { id: 'listening_c1_11',      name: { ru: 'Аудирование C1',               lv: 'Klausīšanās C1'                   }, xp: 280 },
        { id: 'presentation_11',      name: { ru: 'Презентация и публичная речь', lv: 'Prezentācija un publiski uzstājoties' }, xp: 285 },
      ],

      // ── 12 класс — C1/ЦЭ ────────────────────────────────────────────────
      12: [
        { id: 'ce_reading',           name: { ru: 'ЦЭ — Чтение',                  lv: 'CE — Lasīšana'                    }, xp: 320 },
        { id: 'ce_listening',         name: { ru: 'ЦЭ — Аудирование',             lv: 'CE — Klausīšanās'                 }, xp: 320 },
        { id: 'ce_writing',           name: { ru: 'ЦЭ — Письмо',                  lv: 'CE — Rakstīšana'                  }, xp: 330 },
        { id: 'ce_speaking',          name: { ru: 'ЦЭ — Устная речь',             lv: 'CE — Runāšana'                    }, xp: 320 },
        { id: 'ce_grammar_final',     name: { ru: 'ЦЭ — Грамматика',              lv: 'CE — Gramatika'                   }, xp: 320 },
        { id: 'ce_vocab_final',       name: { ru: 'ЦЭ — Лексика',                 lv: 'CE — Vārdnīca'                    }, xp: 315 },
        { id: 'literature_analysis',  name: { ru: 'Анализ литературного текста',  lv: 'Literārā teksta analīze'          }, xp: 330 },
        { id: 'current_affairs_12',   name: { ru: 'Актуальные темы (экзамен)',    lv: 'Aktuālas tēmas (eksāmens)'        }, xp: 315 },
        { id: 'formal_writing_12',    name: { ru: 'Официальный стиль (продвинутый)', lv: 'Formālais stils (padziļināts)' }, xp: 325 },
        { id: 'ce_full_prep',         name: { ru: 'Полная подготовка к ЦЭ',       lv: 'Pilna sagatavošana CE'            }, xp: 380 },
      ],
    },
  },
};

  // ───────────────────────────────────────────────── LATVIAN LANGUAGE ─────
  latvian: {
    id: 'latvian',
    icon: '🇱🇻',
    gradient: 'from-red-500 to-rose-700',
    glow: 'shadow-red-500/40',
    name: { ru: 'Латышский язык', lv: 'Latviešu valoda' },
    topics: {

      // ── 1 класс ──────────────────────────────────────────────────────────
      1: [
        { id: 'alfabets_1',        name: { ru: 'Алфавит и звуки',              lv: 'Alfabēts un skaņas'             }, xp: 35 },
        { id: 'patskanis_1',       name: { ru: 'Гласные: долгие и краткие',    lv: 'Patskaņi: garie un īsie'        }, xp: 35 },
        { id: 'zilbes_1',          name: { ru: 'Слоги',                        lv: 'Zilbes'                         }, xp: 35 },
        { id: 'lielie_burti_1',    name: { ru: 'Заглавные буквы',              lv: 'Lielie burti'                   }, xp: 35 },
        { id: 'vienk_teikumi_1',   name: { ru: 'Простые предложения',          lv: 'Vienkārši teikumi'              }, xp: 40 },
        { id: 'kas_ko_1',          name: { ru: 'Вопросы: Кто? Что?',           lv: 'Jautājumi: Kas? Ko?'            }, xp: 40 },
        { id: 'vardu_grupas_1',    name: { ru: 'Слова-предметы и действия',    lv: 'Lietu un darbību vārdi'         }, xp: 40 },
        { id: 'teksta_lasit_1',    name: { ru: 'Чтение текстов',               lv: 'Tekstu lasīšana'                }, xp: 45 },
        { id: 'rakstisana_1',      name: { ru: 'Письмо и списывание',          lv: 'Rakstīšana un norakstīšana'     }, xp: 40 },
        { id: 'divskanis_1',       name: { ru: 'Дифтонги',                     lv: 'Divskaņi'                       }, xp: 35 },
      ],

      // ── 2 класс ──────────────────────────────────────────────────────────
      2: [
        { id: 'lietvards_2',       name: { ru: 'Имя существительное',          lv: 'Lietvārds'                      }, xp: 55 },
        { id: 'darbibas_vards_2',  name: { ru: 'Глагол',                       lv: 'Darbības vārds'                 }, xp: 55 },
        { id: 'ipasibas_vards_2',  name: { ru: 'Прилагательное',               lv: 'Īpašības vārds'                 }, xp: 55 },
        { id: 'teikuma_veidi_2',   name: { ru: 'Виды предложений',             lv: 'Teikuma veidi'                  }, xp: 50 },
        { id: 'skaanezi_2',        name: { ru: 'Звонкие и глухие согласные',   lv: 'Skanēji un kurlie līdzskaņi'    }, xp: 50 },
        { id: 'lielie_burti_2',    name: { ru: 'Правила заглавных букв',       lv: 'Lielie burti (noteikumi)'        }, xp: 55 },
        { id: 'pieturzimes_2',     name: { ru: 'Знаки препинания',             lv: 'Pieturzīmes'                    }, xp: 50 },
        { id: 'teksta_saturs_2',   name: { ru: 'Содержание текста',            lv: 'Teksta saturs'                  }, xp: 50 },
        { id: 'garumi_mijas_2',    name: { ru: 'Долготы и чередования',        lv: 'Garumi un mijas'                }, xp: 50 },
        { id: 'radosa_rakst_2',    name: { ru: 'Творческое письмо',            lv: 'Radošā rakstīšana'              }, xp: 55 },
      ],

      // ── 3 класс ──────────────────────────────────────────────────────────
      3: [
        { id: 'locijumi_3',        name: { ru: 'Падежи',                       lv: 'Locījumi'                       }, xp: 70 },
        { id: 'darb_personas_3',   name: { ru: 'Лица глагола',                 lv: 'Darbības vārda personas'        }, xp: 70 },
        { id: 'teik_locekli_3',    name: { ru: 'Члены предложения',            lv: 'Teikuma locekļi'                }, xp: 65 },
        { id: 'priedekli_3',       name: { ru: 'Приставки',                    lv: 'Priedēkļi'                      }, xp: 70 },
        { id: 'piedekli_3',        name: { ru: 'Суффиксы',                     lv: 'Piedēkļi'                       }, xp: 65 },
        { id: 'teksta_veidi_3',    name: { ru: 'Виды текстов',                 lv: 'Teksta veidi'                   }, xp: 65 },
        { id: 'dialogs_3',         name: { ru: 'Диалог',                       lv: 'Dialogs'                        }, xp: 60 },
        { id: 'pieturzimes_3',     name: { ru: 'Знаки препинания',             lv: 'Pieturzīmes'                    }, xp: 65 },
        { id: 'literatura_3',      name: { ru: 'Литература',                   lv: 'Literatūra'                     }, xp: 65 },
        { id: 'atvasinati_3',      name: { ru: 'Производные слова',            lv: 'Atvasināti vārdi'               }, xp: 65 },
      ],

      // ── 4 класс ──────────────────────────────────────────────────────────
      4: [
        { id: 'visi_locijumi_4',   name: { ru: 'Все падежи (практика)',        lv: 'Visi locījumi (prakse)'         }, xp: 85 },
        { id: 'darb_laiki_4',      name: { ru: 'Времена глагола',              lv: 'Darbības vārda laiki'           }, xp: 85 },
        { id: 'vardskiras_4',      name: { ru: 'Части речи (обзор)',           lv: 'Vārdšķiru apskats'              }, xp: 80 },
        { id: 'salikts_teik_4',    name: { ru: 'Сложное предложение',          lv: 'Salikts teikums'                }, xp: 80 },
        { id: 'teksts_uzbuve_4',   name: { ru: 'Структура текста',             lv: 'Teksta uzbūve'                  }, xp: 75 },
        { id: 'tautasdziesmas_4',  name: { ru: 'Народные песни',               lv: 'Tautasdziesmas'                 }, xp: 75 },
        { id: 'literatura_4',      name: { ru: 'Латвийская литература',        lv: 'Latviešu literatūra'            }, xp: 80 },
        { id: 'sinonimi_4',        name: { ru: 'Синонимы и антонимы',          lv: 'Sinonīmi un antonīmi'           }, xp: 75 },
        { id: 'ortografija_4',     name: { ru: 'Орфография',                   lv: 'Ortogrāfija'                    }, xp: 85 },
        { id: 'radosa_rakst_4',    name: { ru: 'Творческое письмо',            lv: 'Radošā rakstīšana'              }, xp: 80 },
      ],

      // ── 5 класс ──────────────────────────────────────────────────────────
      5: [
        { id: 'lietvards_locis_5', name: { ru: 'Склонение существительных',    lv: 'Lietvārda locīšana'             }, xp: 105 },
        { id: 'ipas_saskan_5',     name: { ru: 'Согласование прилагательного', lv: 'Īpašības vārda saskaņošana'     }, xp: 105 },
        { id: 'darb_laiki_5',      name: { ru: 'Времена глагола (углублённо)', lv: 'Darbības vārda laiki'           }, xp: 110 },
        { id: 'teik_uzbuve_5',     name: { ru: 'Строение предложения',         lv: 'Teikuma uzbūve'                 }, xp: 105 },
        { id: 'teksta_anal_5',     name: { ru: 'Анализ текста',                lv: 'Teksta analīze'                 }, xp: 110 },
        { id: 'valodas_stili_5',   name: { ru: 'Стили речи',                   lv: 'Valodas stili'                  }, xp: 100 },
        { id: 'literatura_5',      name: { ru: 'Латвийская литература',        lv: 'Latviešu literatūra'            }, xp: 105 },
        { id: 'frazeolos_5',       name: { ru: 'Фразеологизмы',                lv: 'Frazeoloģismi'                  }, xp: 100 },
        { id: 'varddarinas_5',     name: { ru: 'Словообразование',             lv: 'Vārddarināšana'                 }, xp: 105 },
        { id: 'rakstisana_5',      name: { ru: 'Письменный текст',             lv: 'Rakstisks teksts'               }, xp: 105 },
      ],

      // ── 6 класс ──────────────────────────────────────────────────────────
      6: [
        { id: 'vardskiras_6',      name: { ru: 'Части речи (углублённо)',      lv: 'Vārdšķiras (padziļināti)'       }, xp: 120 },
        { id: 'atgriezenis_6',     name: { ru: 'Возвратные глаголы',           lv: 'Atgriezeniskie darbības vārdi'  }, xp: 125 },
        { id: 'divdabis_6',        name: { ru: 'Причастие',                    lv: 'Divdabis'                       }, xp: 125 },
        { id: 'salikts_pak_6',     name: { ru: 'Сложноподчинённое предложение',lv: 'Salikts pakārtots teikums'      }, xp: 130 },
        { id: 'apzimetajs_6',      name: { ru: 'Определение и пунктуация',     lv: 'Apzīmētājs un pieturzīmes'      }, xp: 125 },
        { id: 'literatura_6',      name: { ru: 'Латвийская литература',        lv: 'Latviešu literatūra'            }, xp: 120 },
        { id: 'teksta_interp_6',   name: { ru: 'Интерпретация текста',         lv: 'Teksta interpretācija'          }, xp: 120 },
        { id: 'sazinas_etik_6',    name: { ru: 'Речевой этикет',               lv: 'Saziņas etiķets'                }, xp: 110 },
        { id: 'frazeolos_6',       name: { ru: 'Фразеологизмы (углублённо)',   lv: 'Frazeoloģismi (padziļināti)'    }, xp: 115 },
        { id: 'valoda_sabied_6',   name: { ru: 'Язык и общество',              lv: 'Valoda un sabiedrība'           }, xp: 110 },
      ],

      // ── 7 класс ──────────────────────────────────────────────────────────
      7: [
        { id: 'divdabja_teic_7',   name: { ru: 'Причастный оборот',            lv: 'Divdabja teiciens'              }, xp: 150 },
        { id: 'apstakla_vards_7',  name: { ru: 'Наречие',                      lv: 'Apstākļa vārds'                 }, xp: 145 },
        { id: 'prievards_7',       name: { ru: 'Предлог',                      lv: 'Prievārds'                      }, xp: 140 },
        { id: 'saiklis_7',         name: { ru: 'Союзы и сложные предложения',  lv: 'Saiklis un salikti teikumi'     }, xp: 155 },
        { id: 'stila_kludas_7',    name: { ru: 'Стилистические ошибки',        lv: 'Stila kļūdas'                   }, xp: 145 },
        { id: 'eseja_7',           name: { ru: 'Написание эссе',               lv: 'Esejas rakstīšana'              }, xp: 160 },
        { id: 'literatura_7',      name: { ru: 'Латвийская литература',        lv: 'Latviešu literatūra'            }, xp: 150 },
        { id: 'argumentac_7',      name: { ru: 'Аргументация',                 lv: 'Argumentācija'                  }, xp: 155 },
        { id: 'interpunkc_7',      name: { ru: 'Пунктуация (углублённо)',      lv: 'Interpunkcija (padziļināta)'    }, xp: 150 },
        { id: 'valodas_anal_7',    name: { ru: 'Языковой анализ',              lv: 'Valodas analīze'                }, xp: 145 },
      ],

      // ── 8 класс ──────────────────────────────────────────────────────────
      8: [
        { id: 'tiesa_runa_8',      name: { ru: 'Прямая и косвенная речь',      lv: 'Tiešā un netiešā runa'          }, xp: 175 },
        { id: 'bezlocekla_8',      name: { ru: 'Безличные предложения',        lv: 'Bezlocekļa teikums'             }, xp: 175 },
        { id: 'retorika_8',        name: { ru: 'Риторика',                     lv: 'Retorika'                       }, xp: 180 },
        { id: 'teksta_veidi_8',    name: { ru: 'Виды текстов',                 lv: 'Teksta veidi'                   }, xp: 175 },
        { id: 'literatura_8',      name: { ru: 'Латвийская литература 20 в.',  lv: 'Latviešu literatūra 20. gs.'    }, xp: 170 },
        { id: 'retor_panem_8',     name: { ru: 'Риторические приёмы',          lv: 'Retoriskie paņēmieni'           }, xp: 180 },
        { id: 'argum_teksts_8',    name: { ru: 'Аргументативный текст',        lv: 'Argumentējošs teksts'           }, xp: 185 },
        { id: 'interpunkc_8',      name: { ru: 'Пунктуация (практика)',        lv: 'Interpunkcija (prakse)'         }, xp: 175 },
        { id: 'valsts_valoda_8',   name: { ru: 'Латышский — государственный язык', lv: 'Latviešu valoda — valsts valoda' }, xp: 165 },
        { id: 'akadem_rakst_8',    name: { ru: 'Академическое письмо',         lv: 'Akadēmiskā rakstīšana'          }, xp: 180 },
      ],

      // ── 9 класс ──────────────────────────────────────────────────────────
      9: [
        { id: 'varddarinas_9',     name: { ru: 'Словообразование',             lv: 'Vārddarināšana'                 }, xp: 195 },
        { id: 'ipasvardu_9',       name: { ru: 'Имена собственные',            lv: 'Īpašvārdi'                      }, xp: 190 },
        { id: 'interpunkc_ce_9',   name: { ru: 'Пунктуация к экзамену',       lv: 'Interpunkcija CE'                }, xp: 200 },
        { id: 'argum_raksts_9',    name: { ru: 'Аргументативное сочинение',   lv: 'Argumentējošs raksts'            }, xp: 205 },
        { id: 'lit_analise_9',     name: { ru: 'Анализ литературы',            lv: 'Literatūras analīze'            }, xp: 205 },
        { id: 'stilistika_9',      name: { ru: 'Стилистика',                   lv: 'Stilistika'                     }, xp: 200 },
        { id: 'teksta_anal_9',     name: { ru: 'Анализ текста',                lv: 'Teksta analīze'                 }, xp: 205 },
        { id: 'ce_valodniecs_9',   name: { ru: 'ЦЭ — языкознание',            lv: 'CE — valodniecība'               }, xp: 210 },
        { id: 'ce_rakstisana_9',   name: { ru: 'ЦЭ — письменная часть',       lv: 'CE — rakstīšana'                }, xp: 215 },
        { id: 'izmeg_ce_9',        name: { ru: 'Пробный экзамен (9 кл.)',      lv: 'Izmēģinājuma CE (9. kl.)'       }, xp: 250 },
      ],

      // ── 10 класс ─────────────────────────────────────────────────────────
      10: [
        { id: 'fonetika_10',       name: { ru: 'Фонетика и графика',           lv: 'Fonētika un grafika'            }, xp: 225 },
        { id: 'morfologija_10',    name: { ru: 'Морфология',                   lv: 'Morfoloģija'                    }, xp: 230 },
        { id: 'sintakse_10',       name: { ru: 'Синтаксис',                    lv: 'Sintakse'                       }, xp: 230 },
        { id: 'teksta_anal_10',    name: { ru: 'Анализ текста',                lv: 'Teksta analīze'                 }, xp: 235 },
        { id: 'lit_20gs_10',       name: { ru: 'Латвийская литература 20 в.',  lv: 'Latviešu literatūra 20. gs.'    }, xp: 230 },
        { id: 'retor_panem_10',    name: { ru: 'Риторические приёмы',          lv: 'Retoriskie paņēmieni'           }, xp: 225 },
        { id: 'valodas_stili_10',  name: { ru: 'Функциональные стили',         lv: 'Funkcionālie stili'             }, xp: 230 },
        { id: 'mediju_valoda_10',  name: { ru: 'Язык СМИ',                     lv: 'Mediju valoda'                  }, xp: 220 },
        { id: 'lit_teorija_10',    name: { ru: 'Теория литературы',            lv: 'Literatūras teorija'            }, xp: 235 },
        { id: 'eseja_10',          name: { ru: 'Академическое эссе',           lv: 'Akadēmiskā eseja'               }, xp: 240 },
      ],

      // ── 11 класс ─────────────────────────────────────────────────────────
      11: [
        { id: 'valodas_funk_11',   name: { ru: 'Функции языка',                lv: 'Valodas funkcijas'              }, xp: 255 },
        { id: 'semantika_11',      name: { ru: 'Семантика',                    lv: 'Semantika'                      }, xp: 255 },
        { id: 'pragmatika_11',     name: { ru: 'Прагматика',                   lv: 'Pragmatika'                     }, xp: 260 },
        { id: 'ce_eseja_11',       name: { ru: 'Эссе для ЦЭ',                  lv: 'CE esejas rakstīšana'           }, xp: 275 },
        { id: 'lit_klasika_11',    name: { ru: 'Латвийская классическая литература', lv: 'Latviešu klasiskā literatūra' }, xp: 265 },
        { id: 'sociolingv_11',     name: { ru: 'Социолингвистика',             lv: 'Sociolingvistika'               }, xp: 260 },
        { id: 'publiska_runa_11',  name: { ru: 'Публичная речь',               lv: 'Publiska runa'                  }, xp: 270 },
        { id: 'analit_teksts_11',  name: { ru: 'Аналитический текст',          lv: 'Analītisks teksts'              }, xp: 265 },
        { id: 'tekst_interp_11',   name: { ru: 'Интерпретация текстов',        lv: 'Tekstu interpretācija'          }, xp: 265 },
        { id: 'ce_sagat_11',       name: { ru: 'Подготовка к ЦЭ',             lv: 'CE sagatavošana'                 }, xp: 280 },
      ],

      // ── 12 класс ─────────────────────────────────────────────────────────
      12: [
        { id: 'ce_teksta_anal_12', name: { ru: 'ЦЭ — Анализ текста',           lv: 'CE — Teksta analīze'            }, xp: 310 },
        { id: 'ce_argum_12',       name: { ru: 'ЦЭ — Аргументативное сочинение', lv: 'CE — Argumentējošs raksts'    }, xp: 315 },
        { id: 'ce_valodniecs_12',  name: { ru: 'ЦЭ — Языкознание',             lv: 'CE — Valodniecība'              }, xp: 310 },
        { id: 'ce_literatura_12',  name: { ru: 'ЦЭ — Литература',              lv: 'CE — Literatūra'                }, xp: 315 },
        { id: 'ce_runasana_12',    name: { ru: 'ЦЭ — Устная речь',             lv: 'CE — Runāšana'                  }, xp: 310 },
        { id: 'ce_pilna_12',       name: { ru: 'Полная подготовка к ЦЭ',       lv: 'CE pilna sagatavošana'          }, xp: 370 },
      ],
    },
  },
};

/**
 * Achievement definitions
 */
export const ACHIEVEMENTS = {
  first_lesson:     { icon: '🌟', ru: 'Первый урок!',               lv: 'Pirmā nodarbība!'             },
  math_explorer:    { icon: '🔢', ru: 'Математик (3 темы)',          lv: 'Matemātiķis (3 tēmas)'        },
  english_explorer: { icon: '🌍', ru: 'Полиглот (3 темы)',           lv: 'Poliglots (3 tēmas)'          },
  latvian_explorer: { icon: '🇱🇻', ru: 'Знаток латышского (3 темы)', lv: 'Latviešu eksperts (3 tēmas)'  },
  level_5:          { icon: '⚡', ru: '5-й уровень',                 lv: '5. līmenis'                   },
  streak_7:         { icon: '🔥', ru: '7 дней подряд',               lv: '7 dienas pēc kārtas'          },
};
