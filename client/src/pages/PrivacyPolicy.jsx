import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-indigo-600 hover:underline text-sm mb-6 inline-block">
          ← Назад / Atpakaļ
        </Link>

        <h1 className="text-3xl font-black mb-2 text-gray-900">Privacy Policy / Политика конфиденциальности / Privātuma politika</h1>
        <p className="text-gray-500 text-sm mb-8">Последнее обновление: март 2025</p>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-gray-900">🇷🇺 Русский</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p><strong>1. Кто мы</strong><br />SmartSkola — образовательный сервис для школьников (Латвия). Сайт: smartskola.lv. Контакт: info@smartskola.lv</p>
            <p><strong>2. Какие данные мы собираем</strong><br />Email адрес и пароль (при регистрации); класс и имя ученика; данные об использовании уроков и прогрессе; аналитические данные (Google Analytics 4) при вашем согласии.</p>
            <p><strong>3. Как используются данные</strong><br />Для предоставления доступа к сервису и персонализации уроков; для обработки платежей (через Stripe); для улучшения качества сервиса. Мы не продаём ваши данные третьим лицам.</p>
            <p><strong>4. Файлы cookie</strong><br />Мы используем только необходимые cookie для работы сервиса и, с вашего согласия, аналитические cookie (Google Analytics 4) для понимания, как используется сайт.</p>
            <p><strong>5. Хранение данных</strong><br />Данные хранятся на серверах Railway (EU-совместимая инфраструктура). Пароли хранятся в зашифрованном виде (bcrypt).</p>
            <p><strong>6. Ваши права (GDPR)</strong><br />Вы можете запросить удаление аккаунта и всех данных, написав на info@smartskola.lv. Запрос будет выполнен в течение 30 дней.</p>
            <p><strong>7. Дети</strong><br />Сервис предназначен для использования под контролем родителей. Регистрацию для детей до 16 лет должны оформлять родители или законные представители.</p>
          </div>
        </section>

        <hr className="border-gray-200 mb-8" />

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-gray-900">🇱🇻 Latviešu</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p><strong>1. Kas mēs esam</strong><br />SmartSkola ir izglītības pakalpojums skolēniem (Latvija). Vietne: smartskola.lv. Kontakts: info@smartskola.lv</p>
            <p><strong>2. Kādus datus mēs vācam</strong><br />E-pasta adrese un parole (reģistrējoties); klase un skolēna vārds; dati par nodarbību izmantošanu un progresu; analītiskie dati (Google Analytics 4) ar jūsu piekrišanu.</p>
            <p><strong>3. Kā dati tiek izmantoti</strong><br />Lai nodrošinātu piekļuvi pakalpojumam un personalizētu nodarbības; lai apstrādātu maksājumus (caur Stripe); lai uzlabotu pakalpojuma kvalitāti. Mēs nepārdodam jūsu datus trešajām pusēm.</p>
            <p><strong>4. Sīkdatnes</strong><br />Mēs izmantojam tikai nepieciešamās sīkdatnes pakalpojuma darbībai un, ar jūsu piekrišanu, analītiskās sīkdatnes (Google Analytics 4).</p>
            <p><strong>5. Datu glabāšana</strong><br />Dati tiek glabāti Railway serveros (ES saderīga infrastruktūra). Paroles tiek glabātas šifrētā veidā (bcrypt).</p>
            <p><strong>6. Jūsu tiesības (VDAR)</strong><br />Jūs varat pieprasīt konta un visu datu dzēšanu, rakstot uz info@smartskola.lv. Pieprasījums tiks izpildīts 30 dienu laikā.</p>
            <p><strong>7. Bērni</strong><br />Pakalpojums paredzēts lietošanai vecāku uzraudzībā. Bērniem līdz 16 gadiem reģistrācija jāveic vecākiem vai likumiskajiem pārstāvjiem.</p>
          </div>
        </section>

        <hr className="border-gray-200 mb-8" />

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-gray-900">🇺🇦 Українська</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p><strong>1. Хто ми</strong><br />SmartSkola — освітній сервіс для школярів (Латвія). Сайт: smartskola.lv. Контакт: info@smartskola.lv</p>
            <p><strong>2. Які дані ми збираємо</strong><br />Email адреса та пароль (при реєстрації); клас та ім'я учня; дані про використання уроків та прогрес; аналітичні дані (Google Analytics 4) за вашою згодою.</p>
            <p><strong>3. Як використовуються дані</strong><br />Для надання доступу до сервісу та персоналізації уроків; для обробки платежів (через Stripe); для покращення якості сервісу. Ми не продаємо ваші дані третім особам.</p>
            <p><strong>4. Файли cookie</strong><br />Ми використовуємо лише необхідні cookie для роботи сервісу та, за вашою згодою, аналітичні cookie (Google Analytics 4).</p>
            <p><strong>5. Зберігання даних</strong><br />Дані зберігаються на серверах Railway (EU-сумісна інфраструктура). Паролі зберігаються у зашифрованому вигляді (bcrypt).</p>
            <p><strong>6. Ваші права (GDPR)</strong><br />Ви можете запросити видалення акаунту та всіх даних, написавши на info@smartskola.lv. Запит буде виконано протягом 30 днів.</p>
            <p><strong>7. Діти</strong><br />Сервіс призначений для використання під контролем батьків. Реєстрацію для дітей до 16 років повинні здійснювати батьки або законні представники.</p>
          </div>
        </section>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-400 text-sm">
          SmartSkola · info@smartskola.lv · Latvija
        </div>
      </div>
    </div>
  );
}
