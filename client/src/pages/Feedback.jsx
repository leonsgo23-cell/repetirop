import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = {
  ru: ['Проблема с уроком', 'Ошибка в задании', 'Технический сбой', 'Предложение', 'Другое'],
  lv: ['Problēma ar stundu', 'Kļūda uzdevumā', 'Tehniska kļūme', 'Ieteikums', 'Cits'],
};

export default function Feedback() {
  const navigate = useNavigate();
  const { state } = useApp();
  const { token } = useAuth();
  const lang = state.language || 'ru';

  const [category, setCategory] = useState(CATEGORIES[lang][0]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError('');
    try {
      const r = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ category, message }),
      });
      if (r.status === 503) throw new Error('not_configured');
      if (!r.ok) throw new Error('server_error');
      setSent(true);
    } catch (e) {
      if (e.message === 'not_configured') {
        setError(lang === 'ru' ? 'Служба поддержки ещё не настроена. Свяжитесь с нами напрямую.' : 'Atbalsta dienests vēl nav iestatīts. Sazinieties ar mums tieši.');
      } else {
        setError(lang === 'ru' ? 'Ошибка отправки. Попробуй ещё раз.' : 'Kļūda nosūtot. Mēģini vēlreiz.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #1a1640, #24243e)' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', padding: '14px 16px 18px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 700, fontSize: '0.85rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            ← {lang === 'ru' ? 'Назад' : 'Atpakaļ'}
          </button>
          <p style={{ color: 'white', fontWeight: 900, fontSize: '1rem', margin: '0 auto' }}>
            💬 {lang === 'ru' ? 'Обратная связь' : 'Atgriezeniskā saite'}
          </p>
          <div style={{ width: '60px' }} />
        </div>
      </div>

      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '24px 16px' }}>

        {sent ? (
          <div style={{
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: '20px', padding: '32px 24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✅</div>
            <p style={{ color: '#4ade80', fontWeight: 900, fontSize: '1.1rem', margin: '0 0 8px' }}>
              {lang === 'ru' ? 'Спасибо!' : 'Paldies!'}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', margin: '0 0 24px' }}>
              {lang === 'ru' ? 'Мы получили твоё сообщение.' : 'Mēs saņēmām tavu ziņojumu.'}
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: 'white',
                border: 'none', borderRadius: '14px', padding: '12px 28px',
                fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
              }}
            >
              {lang === 'ru' ? 'На главную' : 'Uz sākumu'}
            </button>
          </div>
        ) : (
          <div style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px', padding: '20px 18px',
          }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: '0 0 18px', lineHeight: 1.5 }}>
              {lang === 'ru'
                ? 'Заметил проблему или хочешь что-то предложить? Мы читаем каждое сообщение.'
                : 'Pamanīji problēmu vai gribi kaut ko ieteikt? Mēs lasām katru ziņojumu.'}
            </p>

            {/* Category */}
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem', fontWeight: 700, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {lang === 'ru' ? 'Категория' : 'Kategorija'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {CATEGORIES[lang].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: '6px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700,
                    cursor: 'pointer', border: '1px solid',
                    background: category === cat ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.05)',
                    borderColor: category === cat ? 'rgba(99,102,241,0.7)' : 'rgba(255,255,255,0.15)',
                    color: category === cat ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Message */}
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem', fontWeight: 700, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {lang === 'ru' ? 'Сообщение' : 'Ziņojums'}
            </p>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={5}
              placeholder={lang === 'ru' ? 'Напиши подробнее...' : 'Raksti sīkāk...'}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px', padding: '12px 14px', color: 'white',
                fontSize: '0.9rem', resize: 'vertical', outline: 'none',
                fontFamily: 'inherit', lineHeight: 1.5,
              }}
            />

            {error && (
              <p style={{ color: '#f87171', fontSize: '0.82rem', margin: '10px 0 0', fontWeight: 600 }}>{error}</p>
            )}

            <button
              onClick={submit}
              disabled={loading || !message.trim()}
              style={{
                marginTop: '16px', width: '100%',
                background: message.trim() ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'rgba(255,255,255,0.1)',
                color: message.trim() ? 'white' : 'rgba(255,255,255,0.3)',
                border: 'none', borderRadius: '14px', padding: '14px',
                fontWeight: 800, fontSize: '0.95rem', cursor: message.trim() ? 'pointer' : 'default',
                transition: 'all 0.2s',
              }}
            >
              {loading
                ? (lang === 'ru' ? 'Отправляем...' : 'Sūtam...')
                : (lang === 'ru' ? 'Отправить' : 'Nosūtīt')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
