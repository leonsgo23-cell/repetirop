import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { SUBJECTS } from '../data/curriculum';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function ZephirChat() {
  const navigate = useNavigate();
  const { state } = useApp();
  const lang = state.language || 'ru';
  const grade = state.grade;
  
  const zephirName = lang !== 'lv' ? 'Орис' : 'Oris';
  const zephirIcon = '🦉';

  // Step: 'subject' | 'topic' | 'chat'
  const [step, setStep] = useState('subject');
  const [selectedSubject, setSelectedSubject] = useState(null); // subject object
  const [topicName, setTopicName] = useState('');               // final topic string
  const [customInput, setCustomInput] = useState('');           // user-typed topic

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [failedHistory, setFailedHistory] = useState(null);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const subjectList = Object.values(SUBJECTS);

  // ── Start chat with a chosen topic name ──
  const startChat = (subject, chosenTopic) => {
    setSelectedSubject(subject);
    setTopicName(chosenTopic);
    const greeting = lang !== 'lv'
      ? `✨ Отлично, разберёмся с «${chosenTopic}». Что именно хочешь — объяснение, разбор примера или есть конкретный вопрос?`
      : `✨ Lieliski, izpētīsim «${chosenTopic}». Ko tieši vēlies — skaidrojumu, piemēru vai ir konkrēts jautājums?`;
    setMessages([{ role: 'assistant', content: greeting }]);
    setStep('chat');
  };

  // ── API call ──
  const doSend = async (history, isRetry = false) => {
    setFailedHistory(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/tutor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          grade,
          subject: selectedSubject?.id,
          topicName,
          language: lang,
          mode: 'topic_help',
          studentName: state.studentName,
        }),
      });
      const data = await res.json();
      const reply = data.text;
      if (!reply) throw new Error('empty');
      if (isRetry) {
        setMessages((prev) => { const c = [...prev]; c[c.length - 1] = { role: 'assistant', content: reply }; return c; });
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      }
    } catch {
      const errMsg = lang !== 'lv'
        ? '⚠️ Не удалось связаться с сервером. Нажми «Повторить».'
        : '⚠️ Neizdevās sazināties ar serveri. Nospied «Atkārtot».';
      if (isRetry) {
        setMessages((prev) => { const c = [...prev]; c[c.length - 1] = { role: 'assistant', content: errMsg }; return c; });
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: errMsg }]);
      }
      setFailedHistory(history);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');
    const userMsg = { role: 'user', content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    await doSend(history);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ════════════════════════════════════════
  // STEP 1 — Subject picker
  // ════════════════════════════════════════
  if (step === 'subject') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #1a1640, #24243e)', display: 'flex', flexDirection: 'column' }}>
        <ZephirHeader
          onBack={() => navigate('/dashboard')}
          backLabel={lang !== 'lv' ? 'Назад' : 'Atpakaļ'}
          subtitle={lang !== 'lv' ? 'Выбери предмет' : 'Izvēlies priekšmetu'}
          zephirName={zephirName}
          defaultIcon={zephirIcon}
        />
        <div style={{ flex: 1, padding: '24px 20px', maxWidth: '600px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', marginBottom: '16px', textAlign: 'center' }}>
            {lang !== 'lv' ? 'По какому предмету нужна помощь?' : 'Par kuru priekšmetu vajadzīga palīdzība?'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {subjectList.map((subject) => (
              <motion.button
                key={subject.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => { setSelectedSubject(subject); setStep('topic'); }}
                style={{
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '14px', padding: '16px 18px',
                  display: 'flex', alignItems: 'center', gap: '14px',
                  color: 'white', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '1.8rem' }}>{subject.icon}</span>
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>{subject.name[lang]}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════
  // STEP 2 — Topic picker
  // ════════════════════════════════════════
  if (step === 'topic') {
    const topics = selectedSubject?.topics[grade] || [];
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #1a1640, #24243e)', display: 'flex', flexDirection: 'column' }}>
        <ZephirHeader
          onBack={() => setStep('subject')}
          backLabel={lang !== 'lv' ? 'Назад' : 'Atpakaļ'}
          icon={selectedSubject?.icon}
          subtitle={`${selectedSubject?.name[lang]} · ${lang !== 'lv' ? 'выбери тему' : 'izvēlies tēmu'}`}
          zephirName={zephirName}
          defaultIcon={zephirIcon}
        />
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 24px', maxWidth: '600px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>

          {/* Curriculum topics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '20px' }}>
            {topics.map((topic, i) => (
              <motion.button
                key={topic.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => startChat(selectedSubject, topic.name[lang])}
                style={{
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', padding: '11px 15px',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  color: 'white', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem', minWidth: '18px', textAlign: 'right' }}>{i + 1}</span>
                <span style={{ fontWeight: 600, fontSize: '0.87rem' }}>{topic.name[lang]}</span>
              </motion.button>
            ))}
          </div>

          {/* Custom topic input */}
          <div style={{
            background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.25)',
            borderRadius: '14px', padding: '14px 16px',
          }}>
            <p style={{ color: 'rgba(52,211,153,0.8)', fontSize: '0.75rem', fontWeight: 700, margin: '0 0 10px' }}>
              {lang !== 'lv' ? '✏️ Или напиши свою тему / вопрос:' : '✏️ Vai raksti savu tēmu / jautājumu:'}
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customInput.trim()) startChat(selectedSubject, customInput.trim());
                }}
                placeholder={lang !== 'lv' ? 'Например: дроби, Present Perfect...' : 'Piemēram: daļskaitļi, Present Perfect...'}
                style={{
                  flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '10px', padding: '10px 12px',
                  color: 'white', fontSize: '0.87rem', outline: 'none', fontFamily: 'inherit',
                }}
              />
              <button
                onClick={() => customInput.trim() && startChat(selectedSubject, customInput.trim())}
                disabled={!customInput.trim()}
                style={{
                  background: customInput.trim() ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.08)',
                  border: 'none', borderRadius: '10px', padding: '0 16px',
                  color: 'white', fontWeight: 800, fontSize: '0.85rem',
                  cursor: customInput.trim() ? 'pointer' : 'not-allowed',
                  opacity: customInput.trim() ? 1 : 0.4, transition: 'all 0.15s',
                }}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════
  // STEP 3 — Chat
  // ════════════════════════════════════════
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #1a1640, #24243e)', display: 'flex', flexDirection: 'column' }}>
      <ZephirHeader
        onBack={() => { setStep('topic'); setMessages([]); setCustomInput(''); }}
        backLabel={lang !== 'lv' ? 'Темы' : 'Tēmas'}
        icon={selectedSubject?.icon}
        subtitle={topicName}
        zephirName={zephirName}
        defaultIcon={zephirIcon}
      />

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', maxWidth: '600px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '12px' }}
            >
              {msg.role === 'assistant' && (
                <span style={{ fontSize: '1.3rem', marginRight: '8px', marginTop: '2px', flexShrink: 0 }}>{zephirIcon}</span>
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
                {i === messages.length - 1 && failedHistory && !isLoading && (
                  <button
                    onClick={() => doSend(failedHistory, true)}
                    style={{
                      display: 'block', marginTop: '8px',
                      background: 'rgba(245,158,11,0.25)', border: '1px solid rgba(245,158,11,0.5)',
                      borderRadius: '8px', padding: '5px 12px',
                      color: '#fbbf24', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer',
                    }}
                  >
                    🔄 {lang !== 'lv' ? 'Повторить' : 'Atkārtot'}
                  </button>
                )}
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
            <span style={{ fontSize: '1.3rem' }}>{zephirIcon}</span>
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

      {/* Input */}
      <div style={{ padding: '12px 20px calc(24px + env(safe-area-inset-bottom))', maxWidth: '600px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={isLoading}
            placeholder={lang !== 'lv' ? 'Задай вопрос по теме...' : 'Uzdod jautājumu par tēmu...'}
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
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            style={{
              width: '44px', height: '44px', flexShrink: 0,
              borderRadius: '12px',
              background: input.trim() && !isLoading
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'rgba(255,255,255,0.08)',
              border: 'none',
              color: 'white', fontSize: '1.1rem',
              cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
              opacity: !input.trim() || isLoading ? 0.4 : 1,
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Shared header ──
function ZephirHeader({ onBack, backLabel, icon, subtitle, zephirName, defaultIcon = '🦉' }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '14px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.85rem', padding: 0, whiteSpace: 'nowrap' }}
        >
          ← {backLabel}
        </button>
        <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{icon || defaultIcon}</span>
          <div style={{ minWidth: 0 }}>
            <p style={{ color: 'white', fontWeight: 900, fontSize: '0.9rem', margin: 0 }}>{zephirName}</p>
            {subtitle && (
              <p style={{ color: 'rgba(52,211,153,0.8)', fontSize: '0.68rem', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
