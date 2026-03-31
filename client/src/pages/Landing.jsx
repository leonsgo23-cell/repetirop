import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { STRIPE_LINKS } from '../data/plans';
import './landing-light.css';

const T = {
  lv: {
    nav_how:'Kā darbojas', nav_subj:'Priekšmeti', nav_price:'Tarifi', nav_cta:'Izmēģināt bez maksas →',
    nav_login:'Ieiet', nav_dashboard:'Lietotne', nav_logout:'Iziet',
    hero_pill:'🎓 AI pēc Latvijas skolu programmas · 1.–12. klase',
    hero_live:'🟢 Šobrīd mācās 47 bērni',
    hero_h1_1:'Bērns sāks saprast tēmas', hero_h1_2:'atzīmes sāks augt',
    hero_desc:'SmartSkola — viedā mācību sistēma, kas pielāgojas tavam bērnam, palīdz ar mājas darbiem un padara mācīšanos interesantu.',
    hero_guar:'<strong>Mūsu garantija:</strong> ja bērns mācās regulāri pēc mūsu sistēmas — atzīmes sāks augt. Tas nav solījums — tas ir sistēmas rezultāts.',
    diag_btn:'🔍 Bezmaksas diagnostika — uzzini nepilnības 10 minūtēs',
    hero_btn1:'Izmēģināt bez maksas 🎯', hero_btn2:'Kā tas darbojas ↓',
    hero_social:'jau uzticas SmartSkola',
    stat1:'apmierinātu vecāku', stat2:'vecāku vērtējums', stat3:'piekļuve', stat4:'klases',
    card_name:'Artjoms, 10 gadi', card_grade:'📐 Matemātika · 4. klase', card_badge:'+2 atzīmes',
    pr1:'Daļskaitļi', pr2:'Ģeometrija', pr3:'Vienādojumi',
    b_streak:'12 dienu sērija', b_lvl:'Līm. 7', b_sparks:'340 dzirkst.',
    fl1_t:'📈 Vidējā atzīme auga', fl1_s:'6.1 → 8.2 mēnesī',
    fl2_t:'🏆 Uzrakstīja kontroldarbu!', fl2_s:'Daļskaitļi — atzīme 8',
    tr1:'skolēnu', tr2:'apmierinātu vecāku', tr3:'priekšmeti', tr4:'klases', tr5:'piekļuve',
    what_tag:'Kas tas ir',
    what_title:'Viedais repetitors tavam bērnam — vienmēr klāt',
    what_sub:'SmartSkola nav vienkāršs AI čats. Tā ir pilnvērtīga mācību sistēma pēc Latvijas skolu programmas, kas darbojas kā personīgais repetitors: skaidro, pārbauda, atceras progresu.',
    wp1h:'AI skaidro — kā dzīvs repetitors', wp1p:'Uzdod jautājumus, skaidro pa soļiem, izvēlas piemērus tieši šim bērnam. Ne no mācību grāmatas — no dzīves.',
    wp2h:'Palīdz ar mājas darbiem', wp2p:'Bērns raksta savu uzdevumu — Oris skaidro kā atrisināt, ne tikai dod atbildi. Izpratne paliek.',
    wp3h:'Vecāki redz visu', wp3p:'Cik ilgi mācījās, kādas tēmas apguva, kur nepilnības. Bez jautājumiem «kā gāja skolā».',
    subj_lbl:'Līdz 6 priekšmetiem pēc Latvijas programmas',
    s1n:'Matemātika', s1d:'Daļskaitļi, vienādojumi, ģeometrija, uzdevumi',
    s2n:'Angļu valoda', s2d:'Gramatika, leksika, lasīšana, uzdevumi',
    s3n:'Latviešu valoda', s3d:'Locījumi, darbības vārdi, sacerējumi, diktāti',
    s4n:'Bioloģija', s4d:'Šūnas, augi, dzīvnieki, ekoloģija — no 5. klases',
    s5n:'Fizika', s5d:'Mehānika, elektrostatika, optika — no 7. klases',
    s6n:'Ķīmija', s6d:'Elementi, reakcijas, maisījumi — no 7. klases',
    subj_note:'✨ Viens abonements = visi priekšmeti jūsu klases programmai',
    ba_tag:'Reāli rezultāti', ba_title:'Kā bērni mainās pirmajā mēnesī', ba_sub:'Dzīves situācijas, kuras atrisināja SmartSkola.',
    was:'❌ Bija', now:'✅ Kļuva',
    ba1w:'Izlaida 2 nedēļas slimības dēļ. Atgriezās — nesaprot tēmu. Kontroldarbs pēc 3 dienām',
    ba1n:'3 vakaros SmartSkola izskaidroja visu ko izlaida. Uzrakstīja kontroldarbu uz 8',
    ba1s:'📐 Matemātika · 4. klase · Artjoms, 10 gadi',
    ba2w:'Nekādi nesaprata latviešu locījumus. Mamma skaidroja atkal un atkal — bez rezultāta',
    ba2n:'Repetitors izskaidroja citādi — ar kartītēm. Nedēļas laikā tēma apgūta',
    ba2s:'🇱🇻 Latviešu · 3. klase · Alīna, 9 gadi',
    ba3w:'40 minūtes uz mājas darbiem, skandāli katru vakaru. «Negribu mācīties» — katru dienu',
    ba3n:'15 minūtes, pats, bez palīdzības. Vēl arī lūdz «vēl vienu stundu»',
    ba3s:'🇬🇧 Angļu · 6. klase · Dins, 12 gadi',
    guar_title_1:'Mēs garantējam rezultātu —', guar_title_2:'ar vienu nosacījumu',
    guar_p:'Ja jūsu bērns mācās SmartSkola vismaz 3 reizes nedēļā un izpilda sistēmas uzdevumus — atzīmes sāks augt. Mēs atbildam par mācību kvalitāti. Bērns atbild par centību.',
    g1h:'Mēs garantējam', g1p:'Katra tēmas izskaidrojums pēc Latvijas skolas programmas',
    g2h:'Mēs garantējam', g2p:'Palīdzība ar jebkuru mājas darbu — 24/7',
    g3h:'Rezultāts — ja', g3p:'Bērns mācās regulāri un izpilda sistēmas uzdevumus',
    g4h:'Izmēģinājuma periods', g4p:'7 dienas bez maksas — pārliecinieties paši pirms maksāšanas',
    meth_tag:'Mācību sistēma', meth_title:'SmartSkola metodika',
    meth_sub:'Ne tikai AI čats. Pilnvērtīga sistēma, kas ved bērnu no nezināšanas līdz rezultātam — soli pa solim.',
    meth_why_h:'💡 Kāpēc tas darbojas',
    meth_why_p:'Parastie repetitori skaidro vienā veidā. SmartSkola izmēģina dažādas pieejas, kamēr bērns saprot. Sistēma atceras kas bija grūti un atgriežas pie tā.',
    st1h:'Zināšanu diagnostika', st1p:'Pārbaudām visu klases materiālu 10 minūtēs. Redzam precīzi — ko zina, ko nē.',
    st2h:'Personīgais maršruts', st2p:'Veidojam individuālo plānu: no vājām tēmām uz stiprām. Konkrēti jūsu bērnam.',
    st3h:'Izskaidrojums pa soļiem', st3p:'AI skaidro tā, kā saprot tieši šis bērns — ar dzīves piemēriem, bez garlaicīgām grāmatām.',
    st4h:'Pārbaude un nostiprināšana', st4p:'Pēc izskaidrojuma — uzdevumi. Sistēma redz vai bērns saprata, vai jāskaidro citādi.',
    st5h:'Pārskats vecākiem', st5p:'Vecāki redz progresu: kuras tēmas apgūtas, kur nepilnības, cik ilgi mācījās bērns.',
    test_tag:'Vecāku atsauksmes', test_title:'Vecāki stāsta',
    t1sit:'🏥 Bērns slimoja un izlaida tēmas',
    t1txt:'«Meita izlaida gandrīz mēnesi. Skolotāji gāja tālāk, viņa nesaprata. SmartSkola izskaidroja visu ko izlaida — 5 dienās. Uzrakstīja pārbaudes darbu uz 9, lai gan mēs pat necerējām.»',
    t1name:'Marina K.', t1role:'Mamma · meita 5. klase · Rīga',
    t2sit:'😤 Nekādi nevarēja saprast tēmu pats',
    t2txt:'«Dēls cīnījās ar daļskaitļiem divus mēnešus. Pats mēģināju skaidrot — nedevās. Repetitors tiešsaistē maksāja €25/h. SmartSkola izskaidroja citādi — un pēc 3 dienām dēls visu saprata. Atzīme: 4 → 7.»',
    t2name:'Andrejs L.', t2role:'Tētis · dēls 4. klase · Jūrmala',
    t3sit:'😰 Baidījās no kontroldarbiem',
    t3txt:'«Meitai bija bailes no kontroldarbiem — panika, asaras. SmartSkola kļuva par viņas treniņu laukumu: mācījās katru dienu, kļuva pārliecināta par sevi. Eksāmenu latviešu valodā nokārtoja uz 8.»',
    t3name:'Svetlana V.', t3role:'Mamma · meita 9. klase · Daugavpils',
    game_tag:'Bērniem', game_title:'Mācīšanās kā mīļākā spēle',
    game_sub:'Bērni mācās paši — jo ir interesanti, jo redz izaugsmi, jo grib nākamo līmeni.',
    g_1h:'Līmeņi un pieredze', g_1p:'Par katru pareizo atbildi — XP. Līmenis aug, bērns redz progresu katru dienu.', g_1lvl:'Līmenis 7',
    g_2h:'Zināšanu dzirksteles', g_2p:'Virtuālā valūta par stundām. Tērē uz vairogiem, padomiem un īpašām iespējām.', g_2val:'340 dzirksteles', g_2sub:'+15 par pēdējo stundu',
    g_3h:'Sērijas', g_3p:'Neizlaid dienas — sērija aug. Vairogi aizsargā, ja izlaiž vienu dienu.', g_3d1:'dienas', g_3d2:'vairogi', g_3d3:'rekords',
    g_4h:'Sasniegumi', g_4p:'Nozīmītes par panākumiem: pirmais pieci, nedēļa bez izlaidumiem, 100 pareizas atbildes.',
    dash_tag:'Vecākiem', dash_title:'Jūs vienmēr zināt kā iet skolā',
    dash_sub:'Progress reāllaikā — bez jautājumiem «kā gāja» un pārsteiguma kontroldarbiem.',
    dash_li1:'Pārskats par katru priekšmetu — reizi nedēļā',
    dash_li2:'Vājās tēmas — sistēma izceļ pati',
    dash_li3:'Cik ilgi bērns mācījās',
    dash_li4:'Zināšanu dinamika pa mēnešiem',
    dash_head:'📊 Progress · Artjoms, 4. klase', dash_period:'30 dienas',
    dm1:'Vidējā atzīme', dm2:'Tēmas apgūtas', dm3:'Dienu sērija', dm4:'Nedēļā',
    dash_weak:'⚠️ Vājās tēmas', dw1:'Daļskaitļu reizināšana', dw2:'Latviešu locījumi',
    price_tag:'Tarifi', price_title:'Izvēlieties plānu savam bērnam',
    price_sub:'Viens abonements — visi priekšmeti izvēlētajai klasei (līdz 6). Bez slēptiem maksājumiem.',
    p1period:'1 mēnesis', p1sub:'/mēnesī',
    pop_tag:'🔥 Populārākais', p2period:'6 mēneši', p2save:'✅ Ietaupa €24 vs mēneša plāns', p2sub:'/mēn · €90 apmaksājot',
    best_tag:'⭐ Labākā cena', p3period:'1 gads', p3save:'✅ Ietaupa €108 vs mēneša plāns', p3sub:'/mēn · €119.88 apmaksājot',
    pf1:'Visi klases priekšmeti (līdz 6)', pf2:'Visas klases tēmas', pf3:'Palīdzība ar mājas darbiem',
    pf4:'Piekļuve 24/7', pf5:'Pārskati vecākiem', pf6:'Prioritārais atbalsts', pbtn:'Sākt mācīties',
    trial_title_1:'Sāciet uzlabot atzīmes', trial_title_2:'jau šodien',
    trial_p:'Pirmās 7 dienas — bez maksas. Pirmās stundas, mājas darbu palīdzība un pilna piekļuve visiem priekšmetiem. Jūs redzēsiet rezultātu pirms maksāšanas.',
    tl1h:'1. diena', tl1p:'Zināšanu diagnostika', tl2h:'2.–4. diena', tl2p:'Pirmās stundas',
    tl3h:'5. diena', tl3p:'Palīdzība ar MD', tl4h:'7. diena', tl4p:'Pirmais progress',
    trial_ph:'jūsu@epasts.lv', trial_btn:'Izmēģināt 7 dienas bez maksas →', trial_note:'Bez kartes · Atcelšana jebkurā laikā · Dati aizsargāti',
    faq_tag:'BUJ', faq_title:'Jautājumi un atbildes',
    fq1:'Vai SmartSkola aizstāj skolas skolotāju?',
    fa1:'Nē. SmartSkola ir papildinājums skolai — tas palīdz bērnam labāk saprast tēmas un nostiprināt zināšanas mājās. Sistēma strādā tieši pēc Latvijas skolu programmas.',
    fq2:'Kas notiek, ja bērnam neinteresē mācīties?',
    fa2:'Tieši tāpēc SmartSkola izmanto spēlifikāciju — līmeņi, dzirksteles, sērijas un sasniegumi. Bērni sāk mācīties paši, jo tas ir interesanti. 94% vecāku atzīst, ka motivācija uzlabojās jau pirmajās 2 nedēļās.',
    fq3:'Cik daudz laika dienā vajag?',
    fa3:'Pietiek ar 15–20 minūtēm dienā. Sistēma pati nosaka ko atkārtot un ko apgūt tālāk. Mājas darbu palīdzībai — cik vajadzīgs.',
    fq4:'Vai varu atcelt abonementu jebkurā laikā?',
    fa4:'Jā, jebkurā laikā — bez sodiem un slēptajiem maksājumiem. Atceļot abonementu, piekļuve saglabājas līdz apmaksātā perioda beigām.',
    foot1:'© 2025 SmartSkola · AI-mācīšanās pēc Latvijas skolu programmas',
    foot2:'smartskola.lv · info@smartskola.lv',
  },
  ru: {
    nav_how:'Как работает', nav_subj:'Предметы', nav_price:'Тарифы', nav_cta:'Попробовать бесплатно →',
    nav_login:'Войти', nav_dashboard:'Приложение', nav_logout:'Выйти',
    hero_pill:'🎓 AI по программе школ Латвии · 1–12 класс',
    hero_live:'🟢 Сейчас занимаются 47 детей',
    hero_h1_1:'Ребёнок начнёт понимать темы', hero_h1_2:'оценки начнут расти',
    hero_desc:'SmartSkola — умная система обучения, которая адаптируется под вашего ребёнка, помогает с домашними заданиями и делает учёбу интересной.',
    hero_guar:'<strong>Наша гарантия:</strong> если ребёнок занимается по нашей системе регулярно — оценки начнут расти. Это не обещание — это результат системы.',
    diag_btn:'🔍 Бесплатная диагностика — узнай пробелы за 10 минут',
    hero_btn1:'Попробовать бесплатно 🎯', hero_btn2:'Как это работает ↓',
    hero_social:'уже доверяют SmartSkola',
    stat1:'довольных родителей', stat2:'рейтинг родителей', stat3:'доступ', stat4:'классы',
    card_name:'Артём, 10 лет', card_grade:'📐 Математика · 4 класс', card_badge:'+2 балла',
    pr1:'Дроби', pr2:'Геометрия', pr3:'Уравнения',
    b_streak:'12-дн. стрик', b_lvl:'Ур. 7', b_sparks:'340 искр',
    fl1_t:'📈 Средний балл вырос', fl1_s:'6.1 → 8.2 за месяц',
    fl2_t:'🏆 Написал контрольную!', fl2_s:'Дроби — оценка 8',
    tr1:'учеников', tr2:'довольных родителей', tr3:'предмета', tr4:'классы', tr5:'доступ',
    what_tag:'Что это такое',
    what_title:'Умный репетитор для вашего ребёнка — всегда рядом',
    what_sub:'SmartSkola — это не просто AI-чат. Это полноценная система обучения по программе школ Латвии, которая работает как персональный репетитор: объясняет, проверяет, запоминает прогресс.',
    wp1h:'AI объясняет — как живой репетитор', wp1p:'Задаёт вопросы, объясняет шагами, подбирает примеры под конкретного ребёнка. Не из учебника — из жизни.',
    wp2h:'Помогает с домашними заданиями', wp2p:'Ребёнок пишет своё задание — Орис объясняет как решить, не просто даёт ответ. Понимание остаётся.',
    wp3h:'Родитель видит всё', wp3p:'Сколько занимался, какие темы прошёл, где пробелы. Без вопросов «как дела в школе».',
    subj_lbl:'До 6 предметов по программе школ Латвии',
    s1n:'Математика', s1d:'Дроби, уравнения, геометрия, задачи',
    s2n:'Английский язык', s2d:'Грамматика, лексика, чтение, задания',
    s3n:'Латышский язык', s3d:'Падежи, глаголы, сочинения, диктанты',
    s4n:'Биология', s4d:'Клетки, растения, животные, экология — с 5 класса',
    s5n:'Физика', s5d:'Механика, электростатика, оптика — с 7 класса',
    s6n:'Химия', s6d:'Элементы, реакции, смеси — с 7 класса',
    subj_note:'✨ Одна подписка = все предметы для вашего класса',
    ba_tag:'Реальные результаты', ba_title:'Как меняются дети за первый месяц', ba_sub:'Жизненные ситуации, которые решила SmartSkola.',
    was:'❌ Было', now:'✅ Стало',
    ba1w:'Пропустил 2 недели из-за болезни. Вернулся — не понимает тему. Контрольная через 3 дня',
    ba1n:'За 3 вечера SmartSkola объяснил всё что пропустил. Написал контрольную на 8',
    ba1s:'📐 Математика · 4 класс · Артём, 10 лет',
    ba2w:'Никак не понимала падежи латышского. Мама объясняла снова и снова — безрезультатно',
    ba2n:'Репетитор объяснил иначе — с карточками. Через неделю тема закрыта',
    ba2s:'🇱🇻 Латышский · 3 класс · Алина, 9 лет',
    ba3w:'40 минут на ДЗ, скандалы каждый вечер. «Не хочу учиться» — каждый день',
    ba3n:'15 минут, сам, без помощи. Ещё и просит «ещё один урок»',
    ba3s:'🇬🇧 Английский · 6 класс · Дима, 12 лет',
    guar_title_1:'Мы гарантируем результат —', guar_title_2:'при одном условии',
    guar_p:'Если ваш ребёнок занимается в SmartSkola хотя бы 3 раза в неделю и выполняет задания системы — оценки начнут расти. Мы отвечаем за качество обучения. Ребёнок отвечает за старание.',
    g1h:'Мы гарантируем', g1p:'Объяснение каждой темы по программе школы Латвии',
    g2h:'Мы гарантируем', g2p:'Помощь с любым домашним заданием — 24/7',
    g3h:'Результат — если', g3p:'Ребёнок занимается регулярно и выполняет задания системы',
    g4h:'Пробный период', g4p:'7 дней бесплатно — убедитесь сами до оплаты',
    meth_tag:'Система обучения', meth_title:'Методология SmartSkola',
    meth_sub:'Не просто AI-чат. Полноценная система, которая ведёт ребёнка от незнания к результату — шаг за шагом.',
    meth_why_h:'💡 Почему это работает',
    meth_why_p:'Обычные репетиторы объясняют одним способом. SmartSkola пробует разные подходы, пока ребёнок не поймёт. Система помнит что было сложно и возвращается к этому.',
    st1h:'Диагностика знаний', st1p:'Проверяем весь материал класса за 10 минут. Видим точно — что знает, что нет.',
    st2h:'Персональный маршрут', st2p:'Строим индивидуальный план: от слабых тем к сильным. Конкретно для вашего ребёнка.',
    st3h:'Объяснение шагами', st3p:'AI объясняет так, как понимает именно этот ребёнок — с примерами из жизни, без скучных учебников.',
    st4h:'Проверка и закрепление', st4p:'После объяснения — задания. Система видит понял ли ребёнок, или надо объяснить по-другому.',
    st5h:'Отчёт родителям', st5p:'Родитель видит прогресс: какие темы закрыты, где пробелы, сколько времени занимался ребёнок.',
    test_tag:'Отзывы родителей', test_title:'Родители говорят',
    t1sit:'🏥 Ребёнок болел и пропустил темы',
    t1txt:'«Дочка пропустила почти месяц. Учителя шли дальше, она не понимала. SmartSkola объяснил всё что пропустила — за 5 дней. Написала проверочную на 9, хотя мы даже не надеялись.»',
    t1name:'Марина К.', t1role:'Мама · дочь 5 класс · Рига',
    t2sit:'😤 Никак не мог понять тему сам',
    t2txt:'«Сын бился с дробями два месяца. Я сам пытался объяснять — не шло. Репетитор онлайн €25/ч. SmartSkola объяснил иначе — через 3 дня сын всё понял. Оценка: 4 → 7.»',
    t2name:'Андрей Л.', t2role:'Папа · сын 4 класс · Юрмала',
    t3sit:'😰 Боялась контрольных и экзаменов',
    t3txt:'«У дочки был страх перед контрольными — паника, слёзы. SmartSkola стал её тренировочным полигоном: занималась каждый день, стала уверена в себе. Экзамен по латышскому сдала на 8.»',
    t3name:'Светлана В.', t3role:'Мама · дочь 9 класс · Даугавпилс',
    game_tag:'Для детей', game_title:'Учёба как любимая игра',
    game_sub:'Дети занимаются сами — потому что интересно, потому что видят рост, потому что хотят следующий уровень.',
    g_1h:'Уровни и опыт', g_1p:'За каждый правильный ответ — XP. Уровень растёт, ребёнок видит прогресс каждый день.', g_1lvl:'Уровень 7',
    g_2h:'Искры знаний', g_2p:'Виртуальная валюта за уроки. Тратится на щиты, подсказки и особые возможности.', g_2val:'340 искр', g_2sub:'+15 за последний урок',
    g_3h:'Стрики', g_3p:'Не пропускай дни — стрик растёт. Щиты защищают при пропуске одного дня.', g_3d1:'дней', g_3d2:'щита', g_3d3:'рекорд',
    g_4h:'Достижения', g_4p:'Значки за успехи: первая пятёрка, неделя без пропусков, 100 правильных ответов подряд.',
    dash_tag:'Для родителей', dash_title:'Вы всегда знаете как дела в школе',
    dash_sub:'Прогресс в реальном времени — без вопросов «как дела» и контрольных как сюрприз.',
    dash_li1:'Отчёт по каждому предмету — раз в неделю',
    dash_li2:'Слабые темы — система выделяет сама',
    dash_li3:'Сколько времени ребёнок занимался',
    dash_li4:'Динамика знаний по месяцам',
    dash_head:'📊 Прогресс · Артём, 4 класс', dash_period:'30 дней',
    dm1:'Средний балл', dm2:'Тем пройдено', dm3:'Стрик дней', dm4:'За неделю',
    dash_weak:'⚠️ Слабые темы', dw1:'Умножение дробей', dw2:'Падежи латышского',
    price_tag:'Тарифы', price_title:'Выберите план для вашего ребёнка',
    price_sub:'Одна подписка — все предметы для вашего класса (до 6). Без скрытых платежей.',
    p1period:'1 месяц', p1sub:'/месяц',
    pop_tag:'🔥 Популярный', p2period:'6 месяцев', p2save:'✅ Экономия €24 vs месячного плана', p2sub:'/мес · €90 при оплате',
    best_tag:'⭐ Лучшая цена', p3period:'1 год', p3save:'✅ Экономия €108 vs месячного плана', p3sub:'/мес · €119.88 при оплате',
    pf1:'Все предметы вашего класса (до 6)', pf2:'Все темы вашего класса', pf3:'Помощь с домашними заданиями',
    pf4:'Доступ 24/7', pf5:'Отчёты для родителей', pf6:'Приоритетная поддержка', pbtn:'Начать обучение',
    trial_title_1:'Начните улучшать оценки', trial_title_2:'уже сегодня',
    trial_p:'Первые 7 дней — бесплатно. Первые уроки, помощь с ДЗ и полный доступ ко всем предметам вашего класса. Вы увидите результат до оплаты.',
    tl1h:'День 1', tl1p:'Диагностика знаний', tl2h:'Дни 2–4', tl2p:'Первые уроки',
    tl3h:'День 5', tl3p:'Помощь с ДЗ', tl4h:'День 7', tl4p:'Первый прогресс',
    trial_ph:'ваш@email.ru', trial_btn:'Попробовать 7 дней бесплатно →', trial_note:'Без карты · Отмена в любое время · Данные защищены',
    faq_tag:'Частые вопросы', faq_title:'Вопросы и ответы',
    fq1:'SmartSkola заменяет школьного учителя?',
    fa1:'Нет. SmartSkola — дополнение к школе. Помогает ребёнку лучше понять темы и закрепить знания дома. Работает строго по программе школ Латвии.',
    fq2:'Что если ребёнок не хочет учиться?',
    fa2:'Именно поэтому SmartSkola использует геймификацию — уровни, искры, стрики и достижения. Дети начинают учиться сами, потому что это интересно. 94% родителей отмечают рост мотивации уже в первые 2 недели.',
    fq3:'Сколько времени нужно в день?',
    fa3:'Достаточно 15–20 минут в день. Система сама определяет что повторить и что изучать дальше. На помощь с домашними заданиями — столько сколько нужно.',
    fq4:'Могу ли я отменить подписку в любое время?',
    fa4:'Да, в любое время — без штрафов и скрытых платежей. При отмене подписки доступ сохраняется до конца оплаченного периода.',
    foot1:'© 2025 SmartSkola · AI-обучение по программе школ Латвии',
    foot2:'smartskola.lv · info@smartskola.lv',
  },
  uk: {
    nav_how:'Як працює', nav_subj:'Предмети', nav_price:'Тарифи', nav_cta:'Спробувати безкоштовно →',
    nav_login:'Увійти', nav_dashboard:'Застосунок', nav_logout:'Вийти',
    hero_pill:'🎓 AI за програмою шкіл Латвії · 1–12 клас',
    hero_live:'🟢 Зараз навчаються 47 дітей',
    hero_h1_1:'Дитина почне розуміти теми', hero_h1_2:'оцінки почнуть рости',
    hero_desc:'SmartSkola — розумна система навчання, що адаптується під вашу дитину, допомагає з домашніми завданнями і робить навчання цікавим.',
    hero_guar:'<strong>Наша гарантія:</strong> якщо дитина займається за нашою системою регулярно — оцінки почнуть рости. Це не обіцянка — це результат системи.',
    diag_btn:'🔍 Безкоштовна діагностика — дізнайся прогалини за 10 хвилин',
    hero_btn1:'Спробувати безкоштовно 🎯', hero_btn2:'Як це працює ↓',
    hero_social:'вже довіряють SmartSkola',
    stat1:'задоволених батьків', stat2:'рейтинг батьків', stat3:'доступ', stat4:'класи',
    card_name:'Артем, 10 років', card_grade:'📐 Математика · 4 клас', card_badge:'+2 бали',
    pr1:'Дроби', pr2:'Геометрія', pr3:'Рівняння',
    b_streak:'12-дн. стрік', b_lvl:'Рів. 7', b_sparks:'340 іскор',
    fl1_t:'📈 Середній бал виріс', fl1_s:'6.1 → 8.2 за місяць',
    fl2_t:'🏆 Написав контрольну!', fl2_s:'Дроби — оцінка 8',
    tr1:'учнів', tr2:'задоволених батьків', tr3:'предмети', tr4:'класи', tr5:'доступ',
    what_tag:'Що це таке',
    what_title:'Розумний репетитор для вашої дитини — завжди поруч',
    what_sub:'SmartSkola — це не просто AI-чат. Це повноцінна система навчання за програмою шкіл Латвії, яка працює як персональний репетитор: пояснює, перевіряє, запам\'ятовує прогрес.',
    wp1h:'AI пояснює — як живий репетитор', wp1p:'Ставить запитання, пояснює покроково, підбирає приклади під конкретну дитину. Не з підручника — з життя.',
    wp2h:'Допомагає з домашніми завданнями', wp2p:'Дитина пише своє завдання — Оріс пояснює як вирішити, не просто дає відповідь. Розуміння залишається.',
    wp3h:'Батьки бачать все', wp3p:'Скільки займалась, які теми пройшла, де прогалини. Без питань «як справи в школі».',
    subj_lbl:'До 6 предметів за програмою шкіл Латвії',
    s1n:'Математика', s1d:'Дроби, рівняння, геометрія, задачі',
    s2n:'Англійська мова', s2d:'Граматика, лексика, читання, завдання',
    s3n:'Латиська мова', s3d:'Відмінки, дієслова, твори, диктанти',
    s4n:'Біологія', s4d:'Клітини, рослини, тварини, екологія — з 5 класу',
    s5n:'Фізика', s5d:'Механіка, електростатика, оптика — з 7 класу',
    s6n:'Хімія', s6d:'Елементи, реакції, суміші — з 7 класу',
    subj_note:'✨ Одна підписка = всі предмети для обраного класу',
    ba_tag:'Реальні результати', ba_title:'Як змінюються діти за перший місяць', ba_sub:'Життєві ситуації, які вирішила SmartSkola.',
    was:'❌ Було', now:'✅ Стало',
    ba1w:'Пропустив 2 тижні через хворобу. Повернувся — не розуміє тему. Контрольна через 3 дні',
    ba1n:'За 3 вечори SmartSkola пояснила все що пропустив. Написав контрольну на 8',
    ba1s:'📐 Математика · 4 клас · Артем, 10 років',
    ba2w:'Ніяк не розуміла відмінки латиської. Мама пояснювала знову і знову — без результату',
    ba2n:'Репетитор пояснив інакше — з картками. Через тиждень тему закрито',
    ba2s:'🇱🇻 Латиська · 3 клас · Аліна, 9 років',
    ba3w:'40 хвилин на ДЗ, сварки щовечора. «Не хочу вчитися» — щодня',
    ba3n:'15 хвилин, сам, без допомоги. Ще й просить «ще один урок»',
    ba3s:'🇬🇧 Англійська · 6 клас · Діма, 12 років',
    guar_title_1:'Ми гарантуємо результат —', guar_title_2:'за однієї умови',
    guar_p:'Якщо ваша дитина займається в SmartSkola хоча б 3 рази на тиждень і виконує завдання системи — оцінки почнуть рости. Ми відповідаємо за якість навчання. Дитина відповідає за старання.',
    g1h:'Ми гарантуємо', g1p:'Пояснення кожної теми за програмою шкіл Латвії',
    g2h:'Ми гарантуємо', g2p:'Допомога з будь-яким домашнім завданням — 24/7',
    g3h:'Результат — якщо', g3p:'Дитина займається регулярно і виконує завдання системи',
    g4h:'Пробний період', g4p:'7 днів безкоштовно — переконайтеся самі до оплати',
    meth_tag:'Система навчання', meth_title:'Методологія SmartSkola',
    meth_sub:'Не просто AI-чат. Повноцінна система, яка веде дитину від незнання до результату — крок за кроком.',
    meth_why_h:'💡 Чому це працює',
    meth_why_p:'Звичайні репетитори пояснюють одним способом. SmartSkola пробує різні підходи, поки дитина не зрозуміє. Система пам\'ятає що було важко і повертається до цього.',
    st1h:'Діагностика знань', st1p:'Перевіряємо весь матеріал класу за 10 хвилин. Бачимо точно — що знає, що ні.',
    st2h:'Персональний маршрут', st2p:'Будуємо індивідуальний план: від слабких тем до сильних. Конкретно для вашої дитини.',
    st3h:'Пояснення покроково', st3p:'AI пояснює так, як розуміє саме ця дитина — з прикладами з життя, без нудних підручників.',
    st4h:'Перевірка і закріплення', st4p:'Після пояснення — завдання. Система бачить чи дитина зрозуміла, чи треба пояснити інакше.',
    st5h:'Звіт батькам', st5p:'Батьки бачать прогрес: які теми закрито, де прогалини, скільки часу займалась дитина.',
    test_tag:'Відгуки батьків', test_title:'Батьки розповідають',
    t1sit:'🏥 Дитина хворіла і пропустила теми',
    t1txt:'«Донька пропустила майже місяць. Вчителі йшли далі, вона не розуміла. SmartSkola пояснила все що пропустила — за 5 днів. Написала перевірну на 9, хоча ми навіть не сподівалися.»',
    t1name:'Марина К.', t1role:'Мама · донька 5 клас · Рига',
    t2sit:'😤 Ніяк не міг зрозуміти тему сам',
    t2txt:'«Син бився з дробами два місяці. Я сам намагався пояснювати — не виходило. Репетитор онлайн €25/год. SmartSkola пояснила інакше — через 3 дні syn все зрозумів. Оцінка: 4 → 7.»',
    t2name:'Андрій Л.', t2role:'Тато · син 4 клас · Юрмала',
    t3sit:'😰 Боялася контрольних і екзаменів',
    t3txt:'«У доньки був страх перед контрольними — паніка, сльози. SmartSkola стала її тренувальним майданчиком: займалася щодня, стала впевнена в собі. Екзамен з латиської склала на 8.»',
    t3name:'Світлана В.', t3role:'Мама · донька 9 клас · Даугавпілс',
    game_tag:'Для дітей', game_title:'Навчання як улюблена гра',
    game_sub:'Діти займаються самі — бо цікаво, бо бачать ріст, бо хочуть наступний рівень.',
    g_1h:'Рівні та досвід', g_1p:'За кожну правильну відповідь — XP. Рівень росте, дитина бачить прогрес щодня.', g_1lvl:'Рівень 7',
    g_2h:'Іскри знань', g_2p:'Віртуальна валюта за уроки. Витрачається на щити, підказки та особливі можливості.', g_2val:'340 іскор', g_2sub:'+15 за останній урок',
    g_3h:'Стріки', g_3p:'Не пропускай дні — стрік росте. Щити захищають при пропуску одного дня.', g_3d1:'днів', g_3d2:'щити', g_3d3:'рекорд',
    g_4h:'Досягнення', g_4p:'Значки за успіхи: перша п\'ятірка, тиждень без пропусків, 100 правильних відповідей підряд.',
    dash_tag:'Для батьків', dash_title:'Ви завжди знаєте як справи в школі',
    dash_sub:'Прогрес у реальному часі — без питань «як справи» і контрольних як сюрприз.',
    dash_li1:'Звіт по кожному предмету — раз на тиждень',
    dash_li2:'Слабкі теми — система виділяє сама',
    dash_li3:'Скільки часу дитина займалась',
    dash_li4:'Динаміка знань по місяцях',
    dash_head:'📊 Прогрес · Артем, 4 клас', dash_period:'30 днів',
    dm1:'Середній бал', dm2:'Тем пройдено', dm3:'Стрік днів', dm4:'За тиждень',
    dash_weak:'⚠️ Слабкі теми', dw1:'Множення дробів', dw2:'Відмінки латиської',
    price_tag:'Тарифи', price_title:'Виберіть план для вашої дитини',
    price_sub:'Одна підписка — всі предмети для обраного класу (до 6). Без прихованих платежів.',
    p1period:'1 місяць', p1sub:'/місяць',
    pop_tag:'🔥 Популярний', p2period:'6 місяців', p2save:'✅ Економія €24 vs місячного плану', p2sub:'/міс · €90 при оплаті',
    best_tag:'⭐ Найкраща ціна', p3period:'1 рік', p3save:'✅ Економія €108 vs місячного плану', p3sub:'/міс · €119.88 при оплаті',
    pf1:'Всі предмети вашого класу (до 6)', pf2:'Всі теми вашого класу', pf3:'Допомога з домашніми завданнями',
    pf4:'Доступ 24/7', pf5:'Звіти для батьків', pf6:'Пріоритетна підтримка', pbtn:'Почати навчання',
    trial_title_1:'Почніть покращувати оцінки', trial_title_2:'вже сьогодні',
    trial_p:'Перші 7 днів — безкоштовно. Перші уроки, допомога з ДЗ і повний доступ до всіх предметів вашого класу. Ви побачите результат до оплати.',
    tl1h:'День 1', tl1p:'Діагностика знань', tl2h:'Дні 2–4', tl2p:'Перші уроки',
    tl3h:'День 5', tl3p:'Допомога з ДЗ', tl4h:'День 7', tl4p:'Перший прогрес',
    trial_ph:'ваш@email.ua', trial_btn:'Спробувати 7 днів безкоштовно →', trial_note:'Без карти · Скасування будь-коли · Дані захищені',
    faq_tag:'Часті запитання', faq_title:'Запитання і відповіді',
    fq1:'SmartSkola замінює шкільного вчителя?',
    fa1:'Ні. SmartSkola — доповнення до школи. Допомагає дитині краще зрозуміти теми і закріпити знання вдома. Працює строго за програмою шкіл Латвії.',
    fq2:'Що якщо дитина не хоче вчитися?',
    fa2:'Саме тому SmartSkola використовує гейміфікацію — рівні, іскри, стріки і досягнення. Діти починають вчитися самі, бо це цікаво. 94% батьків відзначають зростання мотивації вже в перші 2 тижні.',
    fq3:'Скільки часу потрібно на день?',
    fa3:'Достатньо 15–20 хвилин на день. Система сама визначає що повторити і що вивчати далі. На допомогу з домашніми завданнями — стільки скільки потрібно.',
    fq4:'Чи можу я скасувати підписку в будь-який час?',
    fa4:'Так, будь-коли — без штрафів і прихованих платежів. При скасуванні підписки доступ зберігається до кінця оплаченого періоду.',
    foot1:'© 2025 SmartSkola · AI-навчання за програмою шкіл Латвії',
    foot2:'smartskola.lv · info@smartskola.lv',
  },
};

const FAQ_KEYS = ['fq1','fq2','fq3','fq4'];
const FA_KEYS  = ['fa1','fa2','fa3','fa4'];

export default function Landing() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { state, updateState } = useApp();
  const [lang, setLangState] = useState(state.language || 'lv');
  const [openFaq, setOpenFaq] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [trialEmail, setTrialEmail] = useState('');

  const changeLang = (l) => { setLangState(l); updateState({ language: l }); setMobileOpen(false); };
  const d = T[lang] || T.ru;

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const handleTrialBtn = () => {
    if (trialEmail.trim()) {
      navigate(`/register?email=${encodeURIComponent(trialEmail.trim())}`);
    } else {
      navigate('/register');
    }
  };

  const handleBuyPlan = (planId) => {
    const link = STRIPE_LINKS[planId];
    if (user?.email) {
      window.open(`${link}?prefilled_email=${encodeURIComponent(user.email)}`, '_blank');
    } else {
      navigate(`/register?plan=${planId}`);
    }
  };

  return (
    <div className="lp">
      {/* NAV */}
      <nav>
        <div className="nav-inner">
          <div className="lp-logo">
            <img src="/6.png" alt="SmartSkola" style={{ width:32, height:32, borderRadius:8 }} />
            Smart<em>Skola</em>
          </div>
          <div className="nav-links">
            <a onClick={() => scrollTo('methodology')}>{d.nav_how}</a>
            <a onClick={() => scrollTo('subjects')}>{d.nav_subj}</a>
            <a onClick={() => scrollTo('pricing')}>{d.nav_price}</a>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div className="lp-lang">
              {['lv','ru','uk'].map(l => (
                <button key={l} className={`lp-lang-btn${lang===l?' active':''}`} onClick={() => changeLang(l)}>{l.toUpperCase()}</button>
              ))}
            </div>
            {user ? (
              <>
                <button className="lp-nav-login" onClick={() => navigate('/dashboard')}>{d.nav_dashboard}</button>
                <button className="lp-nav-cta" onClick={() => { logout(); }}>{d.nav_logout}</button>
              </>
            ) : (
              <>
                <button className="lp-nav-login" onClick={() => navigate('/login')}>{d.nav_login}</button>
                <button className="lp-nav-cta" onClick={() => navigate('/register')}>{d.nav_cta}</button>
              </>
            )}
            <button className="lp-hamburger" onClick={() => setMobileOpen(v => !v)} aria-label="Menu">☰</button>
          </div>
        </div>
        <div className={`lp-mobile-nav${mobileOpen ? ' open' : ''}`}>
          <a onClick={() => scrollTo('methodology')}>{d.nav_how}</a>
          <a onClick={() => scrollTo('subjects')}>{d.nav_subj}</a>
          <a onClick={() => scrollTo('pricing')}>{d.nav_price}</a>
          {user
            ? <a onClick={() => navigate('/dashboard')}>{d.nav_dashboard}</a>
            : <a onClick={() => navigate('/register')}>{d.nav_cta}</a>
          }
        </div>
      </nav>

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div>
            <div className="lp-hero-pills">
              <div className="lp-hero-pill">{d.hero_pill}</div>
              <div className="lp-hero-live">{d.hero_live}</div>
            </div>
            <h1>{d.hero_h1_1}<br />и <span>{d.hero_h1_2}</span></h1>
            <p className="lp-hero-desc">{d.hero_desc}</p>
            <div className="lp-hero-guar">
              <span>✅</span>
              <p dangerouslySetInnerHTML={{ __html: d.hero_guar }} />
            </div>
            <button
              className="lp-btn-diag"
              onClick={() => navigate('/diagnostic')}
            >
              {d.diag_btn}
            </button>
            <div className="lp-hero-btns">
              <button className="lp-btn-primary" onClick={() => navigate('/register')}>{d.hero_btn1}</button>
              <button className="lp-btn-ghost" onClick={() => scrollTo('methodology')}>{d.hero_btn2}</button>
            </div>
            <div className="lp-hero-social">
              <div className="lp-avatars">
                {['👩','👨','👩‍🦱','👨‍🦳'].map((e,i) => <div key={i} className="lp-av">{e}</div>)}
              </div>
              <div className="lp-hero-social-text">
                <strong>1200+</strong>
                <span>{d.hero_social}</span>
              </div>
            </div>
            <div className="lp-hero-stats">
              <div className="lp-hero-stat"><strong>94%</strong><span>{d.stat1}</span></div>
              <div className="lp-hero-stat"><strong>4.9★</strong><span>{d.stat2}</span></div>
              <div className="lp-hero-stat"><strong>24/7</strong><span>{d.stat3}</span></div>
              <div className="lp-hero-stat"><strong>1–12</strong><span>{d.stat4}</span></div>
            </div>
          </div>
          <div className="lp-hero-right">
            <div style={{ position:'relative', borderRadius:24, overflow:'hidden', boxShadow:'0 16px 48px rgba(0,0,0,0.3)', aspectRatio:'4/3' }}>
              <img src="/photo3.png" alt="SmartSkola" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', display:'block' }} />
            </div>
            <div className="lp-float lp-float-1"><div className="lp-float-t">{d.fl1_t}</div><div className="lp-float-s">{d.fl1_s}</div></div>
            <div className="lp-float lp-float-2"><div className="lp-float-t">{d.fl2_t}</div><div className="lp-float-s">{d.fl2_s}</div></div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="lp-trust">
        <div className="lp-trust-inner">
          <div className="lp-trust-item"><strong>1200+</strong><span>{d.tr1}</span></div>
          <div className="lp-trust-item"><strong>94%</strong><span>{d.tr2}</span></div>
          <div className="lp-trust-item"><strong>6</strong><span>{d.tr3}</span></div>
          <div className="lp-trust-item"><strong>1–12</strong><span>{d.tr4}</span></div>
          <div className="lp-trust-item"><strong>24/7</strong><span>{d.tr5}</span></div>
        </div>
      </div>

      {/* WHAT IS */}
      <section className="lp-section" style={{ background:'var(--lp-bg2)' }} id="subjects">
        <div className="lp-container">
          <div className="lp-what-grid">
            <div>
              <div className="lp-tag">{d.what_tag}</div>
              <h2 className="lp-title">{d.what_title}</h2>
              <p className="lp-sub">{d.what_sub}</p>
              <div className="lp-what-pts">
                {[['🤖','wp1h','wp1p'],['📋','wp2h','wp2p'],['📊','wp3h','wp3p']].map(([ico,h,p]) => (
                  <div key={h} className="lp-what-pt">
                    <div className="lp-what-ico">{ico}</div>
                    <div><h4>{d[h]}</h4><p>{d[p]}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lp-what-visual">
              <div style={{ borderRadius:14, overflow:'hidden', margin:'-28px -28px 16px -28px' }}>
                <img src="/subjects-banner.png" alt="SmartSkola subjects" style={{ width:'100%', display:'block' }} />
              </div>
              <div className="lp-subj-lbl">{d.subj_lbl}</div>
              {[['📐','s1n','s1d','1–12'],['🇬🇧','s2n','s2d','1–12'],['🇱🇻','s3n','s3d','1–12'],['🧬','s4n','s4d','5–12'],['⚡','s5n','s5d','7–12'],['⚗️','s6n','s6d','7–12']].map(([ico,n,desc,grades]) => (
                <div key={n} className="lp-subj-card">
                  <span className="lp-subj-em">{ico}</span>
                  <div><div className="lp-subj-name">{d[n]}</div><div className="lp-subj-desc">{d[desc]}</div></div>
                  <span className="lp-subj-lvl">{grades}</span>
                </div>
              ))}
              <div className="lp-subj-note">{d.subj_note}</div>
            </div>
          </div>
        </div>
      </section>

      {/* BEFORE/AFTER */}
      <section className="lp-section" style={{ background:'var(--lp-bg)' }}>
        <div className="lp-container">
          <div className="lp-tag">{d.ba_tag}</div>
          <h2 className="lp-title">{d.ba_title}</h2>
          <p className="lp-sub">{d.ba_sub}</p>
          <div className="lp-ba-grid">
            {[['ba1w','ba1n','ba1s'],['ba2w','ba2n','ba2s'],['ba3w','ba3n','ba3s']].map(([w,n,s]) => (
              <div key={s} className="lp-ba-card">
                <div className="lp-ba-row">
                  <div className="lp-ba-b"><div className="lp-ba-lbl was">{d.was}</div><div className="lp-ba-txt">{d[w]}</div></div>
                  <div className="lp-ba-a"><div className="lp-ba-lbl now">{d.now}</div><div className="lp-ba-txt">{d[n]}</div></div>
                </div>
                <div className="lp-ba-bot">{d[s]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="lp-guar">
        <div className="lp-guar-inner">
          <h2>{d.guar_title_1}<br />{d.guar_title_2}</h2>
          <p>{d.guar_p}</p>
          <div className="lp-guar-cards">
            {[['📚','g1h','g1p'],['✏️','g2h','g2p'],['📈','g3h','g3p'],['🛡️','g4h','g4p']].map(([ico,h,p]) => (
              <div key={h} className="lp-g-card"><div className="lp-gi">{ico}</div><h4>{d[h]}</h4><p>{d[p]}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section className="lp-section lp-method" id="methodology">
        <div className="lp-container">
          <div className="lp-method-wrap">
            <div>
              <div className="lp-tag">{d.meth_tag}</div>
              <h2 className="lp-title">{d.meth_title}</h2>
              <p className="lp-sub">{d.meth_sub}</p>
              <div className="lp-method-why">
                <h5>{d.meth_why_h}</h5>
                <p>{d.meth_why_p}</p>
              </div>
              <div style={{ borderRadius:20, overflow:'hidden', marginTop:24, boxShadow:'0 8px 32px rgba(0,0,0,0.18)' }}>
                <img src="/photo1.png" alt="SmartSkola lesson" style={{ width:'100%', display:'block' }} />
              </div>
            </div>
            <div className="lp-method-steps">
              {[['st1h','st1p'],['st2h','st2p'],['st3h','st3p'],['st4h','st4p'],['st5h','st5p']].map(([h,p],i) => (
                <div key={h} className="lp-m-step" style={i===4?{paddingBottom:0}:{}}>
                  <div className="lp-m-num">{i+1}</div>
                  <div className="lp-m-body"><h3>{d[h]}</h3><p>{d[p]}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="lp-section" style={{ background:'var(--lp-bg)' }}>
        <div className="lp-container">
          <div className="lp-tag">{d.test_tag}</div>
          <h2 className="lp-title">{d.test_title}</h2>
          <div className="lp-test-grid">
            {[
              ['t1sit','t1txt','👩','t1name','t1role'],
              ['t2sit','t2txt','👨','t2name','t2role'],
              ['t3sit','t3txt','👩‍🦱','t3name','t3role'],
            ].map(([sit,txt,av,name,role]) => (
              <div key={sit} className="lp-test-card">
                <div className="lp-test-sit">{d[sit]}</div>
                <div className="lp-test-stars">★★★★★</div>
                <p className="lp-test-txt">{d[txt]}</p>
                <div className="lp-test-auth">
                  <div className="lp-test-av">{av}</div>
                  <div><div className="lp-test-name">{d[name]}</div><div className="lp-test-role">{d[role]}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* GAMIFICATION */}
      <section className="lp-section lp-game">
        <div className="lp-container">
          <div className="lp-tag">{d.game_tag}</div>
          <h2 className="lp-title">{d.game_title}</h2>
          <p className="lp-sub">{d.game_sub}</p>
          <div className="lp-game-grid">
            <div className="lp-game-card">
              <div className="lp-game-ico">⚡</div>
              <h3>{d.g_1h}</h3><p>{d.g_1p}</p>
              <div style={{ marginTop:14, background:'var(--lp-bg3)', borderRadius:11, padding:11 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, fontWeight:600, marginBottom:5 }}><span>{d.g_1lvl}</span><span style={{ color:'var(--lp-accent)' }}>680/1000 XP</span></div>
                <div style={{ background:'var(--lp-border)', borderRadius:999, height:7, overflow:'hidden' }}><div style={{ height:'100%', width:'68%', background:'linear-gradient(90deg,var(--lp-accent),var(--lp-accent2))', borderRadius:999 }} /></div>
              </div>
            </div>
            <div className="lp-game-card">
              <div className="lp-game-ico">✨</div>
              <h3>{d.g_2h}</h3><p>{d.g_2p}</p>
              <div style={{ marginTop:14, background:'var(--lp-gold-light)', borderRadius:11, padding:11, display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:26 }}>✨</span>
                <div><div style={{ fontWeight:800, fontSize:18, color:'var(--lp-gold)' }}>{d.g_2val}</div><div style={{ fontSize:11, color:'var(--lp-muted)' }}>{d.g_2sub}</div></div>
              </div>
            </div>
            <div className="lp-game-card">
              <div className="lp-game-ico">🔥</div>
              <h3>{d.g_3h}</h3><p>{d.g_3p}</p>
              <div style={{ display:'flex', gap:8, marginTop:14 }}>
                {[['🔥',12,'g_3d1'],['🛡️',3,'g_3d2'],['⭐',21,'g_3d3']].map(([e,n,k]) => (
                  <div key={k} style={{ flex:1, textAlign:'center', background:'var(--lp-bg3)', borderRadius:10, padding:9 }}>
                    <div style={{ fontSize:22 }}>{e}</div><div style={{ fontWeight:700 }}>{n}</div><div style={{ fontSize:11, color:'var(--lp-muted)' }}>{d[k]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lp-game-card">
              <div className="lp-game-ico">🏆</div>
              <h3>{d.g_4h}</h3><p>{d.g_4p}</p>
              <div style={{ display:'flex', gap:7, marginTop:14, flexWrap:'wrap' }}>
                {[['🧠','var(--lp-accent-light)'],['⚡','var(--lp-accent-light)'],['🎯','var(--lp-accent-light)'],['🌟','var(--lp-gold-light)'],['🔒','var(--lp-bg3)']].map(([e,bg],i) => (
                  <div key={i} style={{ background:bg, borderRadius:9, padding:'7px 9px', fontSize:20, opacity:i===4?0.35:1 }}>{e}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD */}
      <section className="lp-section" style={{ background:'var(--lp-bg2)' }}>
        <div className="lp-container">
          <div className="lp-dash-layout">
            <div>
              <div className="lp-tag">{d.dash_tag}</div>
              <h2 className="lp-title">{d.dash_title}</h2>
              <p className="lp-sub">{d.dash_sub}</p>
              <ul className="lp-dash-pts">
                {['dash_li1','dash_li2','dash_li3','dash_li4'].map((k,i) => (
                  <li key={k}><span className="lp-di">{['📊','⚠️','⏱️','📈'][i]}</span><span>{d[k]}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{ borderRadius:20, overflow:'hidden', marginBottom:16, boxShadow:'0 8px 32px rgba(0,0,0,0.18)', height:360 }}>
                <img src="/photo2.png" alt="SmartSkola parent dashboard" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', display:'block' }} />
              </div>
              <div className="lp-dash-card">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
                <div style={{ fontWeight:700, fontSize:14 }}>{d.dash_head}</div>
                <div style={{ fontSize:11, color:'var(--lp-muted)', background:'var(--lp-bg3)', padding:'4px 10px', borderRadius:7 }}>{d.dash_period}</div>
              </div>
              <div className="lp-dash-metrics">
                <div className="lp-metric"><div className="lp-mv green">+2.1</div><div className="lp-ml">{d.dm1}</div></div>
                <div className="lp-metric"><div className="lp-mv purple">47</div><div className="lp-ml">{d.dm2}</div></div>
                <div className="lp-metric"><div className="lp-mv gold">12🔥</div><div className="lp-ml">{d.dm3}</div></div>
                <div className="lp-metric"><div className="lp-mv" style={{ color:'var(--lp-accent)' }}>3.2ч</div><div className="lp-ml">{d.dm4}</div></div>
              </div>
              <div style={{ fontSize:12, fontWeight:600, color:'var(--lp-muted)', marginBottom:8 }}>{d.dash_weak}</div>
              <div className="lp-weak-item"><span style={{ flex:1 }}>{d.dw1}</span><div className="lp-wb"><div style={{ height:'100%', width:'35%', background:'#ef4444', borderRadius:999 }} /></div><span style={{ color:'#ef4444', fontWeight:600, width:34, textAlign:'right', fontSize:12 }}>35%</span></div>
              <div className="lp-weak-item"><span style={{ flex:1 }}>{d.dw2}</span><div className="lp-wb"><div style={{ height:'100%', width:'52%', background:'#f59e0b', borderRadius:999 }} /></div><span style={{ color:'#f59e0b', fontWeight:600, width:34, textAlign:'right', fontSize:12 }}>52%</span></div>
              <div className="lp-weak-item"><span style={{ flex:1 }}>Present Perfect</span><div className="lp-wb"><div style={{ height:'100%', width:'68%', background:'#22c55e', borderRadius:999 }} /></div><span style={{ color:'#22c55e', fontWeight:600, width:34, textAlign:'right', fontSize:12 }}>68%</span></div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="lp-section lp-pricing" id="pricing">
        <div className="lp-container" style={{ textAlign:'center' }}>
          <div className="lp-tag">{d.price_tag}</div>
          <h2 className="lp-title">{d.price_title}</h2>
          <p className="lp-sub" style={{ margin:'0 auto 44px' }}>{d.price_sub}</p>
          <div className="lp-price-grid">
            {/* 1 month */}
            <div className="lp-price-card">
              <div className="lp-price-period">{d.p1period}</div>
              <div className="lp-price-amt"><sup>€</sup>19</div>
              <div className="lp-price-sub">{d.p1sub}</div>
              <ul className="lp-price-feats">
                {['pf1','pf2','pf3','pf4'].map(k => <li key={k}>{d[k]}</li>)}
              </ul>
              <button className="lp-btn-buy ghost" onClick={() => handleBuyPlan('1mo')}>{d.pbtn}</button>
            </div>
            {/* 6 months */}
            <div className="lp-price-card pop">
              <div className="lp-pop-tag">{d.pop_tag}</div>
              <div className="lp-price-period">{d.p2period}</div>
              <div className="lp-price-amt"><sup>€</sup>15</div>
              <div className="lp-price-save">{d.p2save}</div>
              <div className="lp-price-sub">{d.p2sub}</div>
              <ul className="lp-price-feats">
                {['pf1','pf2','pf3','pf4','pf5'].map(k => <li key={k}>{d[k]}</li>)}
              </ul>
              <button className="lp-btn-buy primary" onClick={() => handleBuyPlan('6mo')}>{d.pbtn}</button>
            </div>
            {/* 12 months */}
            <div className="lp-price-card">
              <div className="lp-pop-tag" style={{ background:'linear-gradient(135deg,#d97706,#f59e0b)' }}>{d.best_tag}</div>
              <div className="lp-price-period">{d.p3period}</div>
              <div className="lp-price-amt"><sup>€</sup>9<span style={{ fontSize:26, fontWeight:700 }}>.99</span></div>
              <div className="lp-price-save">{d.p3save}</div>
              <div className="lp-price-sub">{d.p3sub}</div>
              <ul className="lp-price-feats">
                {['pf1','pf2','pf3','pf4','pf5','pf6'].map(k => <li key={k}>{d[k]}</li>)}
              </ul>
              <button className="lp-btn-buy gold" onClick={() => handleBuyPlan('12mo')}>{d.pbtn}</button>
            </div>
          </div>
        </div>
      </section>

      {/* TRIAL CTA */}
      <section className="lp-trial">
        <div className="lp-container">
          <h2>{d.trial_title_1}<br /><span>{d.trial_title_2}</span></h2>
          <p className="lp-trial-p">{d.trial_p}</p>
          <div className="lp-trial-tl">
            {[['🎯','tl1h','tl1p'],['📚','tl2h','tl2p'],['✏️','tl3h','tl3p'],['📈','tl4h','tl4p']].map(([ico,h,p],i) => (
              <>
                <div key={h} className="lp-tl-step">
                  <div className="lp-tl-ico">{ico}</div>
                  <h4>{d[h]}</h4><p>{d[p]}</p>
                </div>
                {i < 3 && <div className="lp-tl-arr">→</div>}
              </>
            ))}
          </div>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginBottom:14 }}>
            <input
              type="email"
              className="lp-trial-email"
              placeholder={d.trial_ph}
              value={trialEmail}
              onChange={e => setTrialEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleTrialBtn()}
            />
            <button className="lp-btn-trial" onClick={handleTrialBtn}>{d.trial_btn}</button>
          </div>
          <p style={{ fontSize:12, color:'var(--lp-muted)' }}>{d.trial_note}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="lp-faq">
        <div className="lp-container">
          <div className="lp-tag">{d.faq_tag}</div>
          <h2 className="lp-title">{d.faq_title}</h2>
          <div className="lp-faq-list">
            {FAQ_KEYS.map((qk, i) => (
              <div key={qk} className="lp-faq-item">
                <button className="lp-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{d[qk]}</span>
                  <span className="lp-faq-arr" style={openFaq===i?{transform:'rotate(180deg)'}:{}}>▾</span>
                </button>
                {openFaq === i && <div className="lp-faq-a">{d[FA_KEYS[i]]}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p>{d.foot1}</p>
        <p>{d.foot2}</p>
        <p style={{ marginTop: '8px', fontSize: '0.75rem', opacity: 0.6 }}>
          <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'underline' }}>
            {lang === 'lv' ? 'Privātuma politika' : lang === 'uk' ? 'Політика конфіденційності' : 'Политика конфиденциальности'}
          </Link>
        </p>
      </footer>
    </div>
  );
}
