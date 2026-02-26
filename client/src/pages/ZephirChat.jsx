import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function ZephirChat() {
  const navigate = useNavigate();
  const { state, useChatToken } = useApp();
  const lang = state.language || 'ru';

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: lang === 'ru'
        ? 'А, гость пожаловал... ✨ Я Зефир — маг, проживший достаточно долго, чтобы знать ответы на большинство вопросов. И достаточно мудрый, чтобы понимать: самые интересные вопросы — это те, которые ещё не заданы. Чем могу помочь или о чём поболтать?'
        : 'Ak, viesis ieradies... ✨ Es esmu Zefīrs — burvis, kurš nodzīvojis pietiekami ilgi, lai zinātu atbildes uz lielāko daļu jautājumu. Un pietiekami gudrs, lai saprastu: interesantākie jautājumi ir tie, kas vēl nav uzdoti. Ar ko varu palīdzēt vai par ko parunāt?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const tokensLeft = state.chatTokens || 0;
  const hasTokens = tokensLeft > 0;

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading || !hasTokens) return;

    useChatToken();
    setInput('');
    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/tutor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          grade: state.grade,
          language: lang,
          mode: 'free_chat',
          studentName: state.studentName,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.text || '...' }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: lang === 'ru' ? 'Что-то пошло не так. Попробуй ещё раз!' : 'Kaut kas nogāja greizi. Mēģini vēlreiz!' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #1a1640, #24243e)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '14px 20px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}
            >
              ← {lang === 'ru' ? 'Назад' : 'Atpakaļ'}
            </button>
            <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>🧙</span>
              <div>
                <p style={{ color: 'white', fontWeight: 900, fontSize: '0.9rem', margin: 0 }}>Зефир</p>
                <p style={{ color: 'rgba(52,211,153,0.8)', fontSize: '0.68rem', fontWeight: 600, margin: 0 }}>
                  {lang === 'ru' ? 'Свободный чат' : 'Brīvā saruna'}
                </p>
              </div>
            </div>
          </div>
          {/* Token counter */}
          <div style={{
            background: tokensLeft > 0 ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.07)',
            border: `1px solid ${tokensLeft > 0 ? 'rgba(52,211,153,0.4)' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: '10px', padding: '4px 10px',
            color: tokensLeft > 0 ? '#34d399' : 'rgba(255,255,255,0.3)',
            fontSize: '0.75rem', fontWeight: 800,
          }}>
            💬 ×{tokensLeft}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', maxWidth: '600px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '12px',
              }}
            >
              {msg.role === 'assistant' && (
                <span style={{ fontSize: '1.3rem', marginRight: '8px', marginTop: '2px', flexShrink: 0 }}>🧙</span>
              )}
              <div style={{
                maxWidth: '78%',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(79,70,229,0.4))'
                  : 'rgba(255,255,255,0.07)',
                border: msg.role === 'user'
                  ? '1px solid rgba(99,102,241,0.4)'
                  : '1px solid rgba(255,255,255,0.1)',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                padding: '10px 14px',
                color: 'rgba(255,255,255,0.92)',
                fontSize: '0.88rem',
                lineHeight: 1.55,
                whiteSpace: 'pre-wrap',
              }}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}
          >
            <span style={{ fontSize: '1.3rem' }}>🧙</span>
            <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px 18px 18px 4px', padding: '10px 14px' }}>
              <div style={{ display: 'flex', gap: '5px' }}>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'rgba(52,211,153,0.7)' }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* No tokens banner */}
      {!hasTokens && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: '0 20px 12px', maxWidth: '600px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}
        >
          <div style={{
            background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)',
            borderRadius: '14px', padding: '14px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
          }}>
            <div>
              <p style={{ color: '#fbbf24', fontWeight: 800, fontSize: '0.85rem', margin: 0 }}>
                {lang === 'ru' ? 'Жетоны кончились' : 'Žetoni beigušies'}
              </p>
              <p style={{ color: 'rgba(251,191,36,0.6)', fontSize: '0.72rem', margin: '2px 0 0', fontWeight: 600 }}>
                {lang === 'ru' ? '1 жетон = 30 XP в магазине' : '1 žetons = 30 XP veikalā'}
              </p>
            </div>
            <button
              onClick={() => navigate('/shop')}
              style={{
                background: 'rgba(245,158,11,0.25)', border: '1px solid rgba(245,158,11,0.5)',
                borderRadius: '10px', padding: '8px 14px',
                color: '#fbbf24', fontWeight: 900, fontSize: '0.78rem',
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              {lang === 'ru' ? '🏪 В магазин' : '🏪 Uz veikalu'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Input area */}
      <div style={{ padding: '12px 20px 24px', maxWidth: '600px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={!hasTokens || isLoading}
            placeholder={
              !hasTokens
                ? (lang === 'ru' ? 'Нет жетонов...' : 'Nav žetonu...')
                : (lang === 'ru' ? 'Напиши что-нибудь...' : 'Raksti kaut ko...')
            }
            rows={1}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.07)',
              border: '1.5px solid rgba(255,255,255,0.15)',
              borderRadius: '14px',
              padding: '12px 14px',
              color: 'white',
              fontSize: '0.9rem',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              lineHeight: 1.4,
              opacity: !hasTokens ? 0.4 : 1,
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading || !hasTokens}
            style={{
              width: '44px', height: '44px', flexShrink: 0,
              borderRadius: '12px',
              background: input.trim() && hasTokens && !isLoading
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'rgba(255,255,255,0.08)',
              border: 'none',
              color: 'white', fontSize: '1.1rem',
              cursor: input.trim() && hasTokens && !isLoading ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
              opacity: !input.trim() || !hasTokens || isLoading ? 0.4 : 1,
            }}
          >
            ↑
          </button>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem', margin: '6px 0 0', textAlign: 'center' }}>
          {lang === 'ru'
            ? 'Каждое сообщение = 1 жетон · Enter для отправки'
            : 'Katrs ziņojums = 1 žetons · Enter, lai nosūtītu'}
        </p>
      </div>
    </div>
  );
}
