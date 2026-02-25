import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { SHOP_ITEMS, CHALLENGE_TYPES, CHALLENGE_COST } from '../data/shop';

export default function Shop() {
  const navigate = useNavigate();
  const { state, buyItem } = useApp();
  const lang = state.language || 'ru';

  const [flash, setFlash] = useState(null); // { id, type: 'ok' | 'fail' }

  const handleBuy = (item) => {
    if (state.xp < item.cost) {
      setFlash({ id: item.id, type: 'fail' });
      setTimeout(() => setFlash(null), 1200);
      return;
    }
    buyItem(item.id);
    setFlash({ id: item.id, type: 'ok' });
    setTimeout(() => setFlash(null), 1200);
  };

  const owned = (key) => state[key] || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] pb-10">

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', padding: '16px 20px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700, fontSize: '0.85rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '12px', display: 'block' }}
          >
            {lang === 'ru' ? '← Назад' : '← Atpakaļ'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ color: 'white', fontWeight: 900, fontSize: '1.5rem', margin: 0 }}>
                🏪 {lang === 'ru' ? 'Магазин' : 'Veikals'}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', margin: '2px 0 0' }}>
                {lang === 'ru' ? 'Тратить XP с умом' : 'Tērēt XP gudri'}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#fde68a', fontWeight: 900, fontSize: '1.3rem', margin: 0 }}>⭐ {state.xp}</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', margin: 0 }}>XP</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* ── Consumables ─────────────────────────────────────────────────── */}
        <section>
          <h2 style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 900, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
            {lang === 'ru' ? '🧪 Расходники' : '🧪 Patēriņa preces'}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {SHOP_ITEMS.map((item) => {
              const isFlash = flash?.id === item.id;
              const count = owned(item.stateKey);
              return (
                <motion.div
                  key={item.id}
                  animate={isFlash ? { x: flash.type === 'fail' ? [-6, 6, -4, 4, 0] : [0] } : {}}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: isFlash && flash.type === 'ok'
                      ? 'rgba(34,197,94,0.15)'
                      : isFlash && flash.type === 'fail'
                        ? 'rgba(239,68,68,0.15)'
                        : 'rgba(255,255,255,0.06)',
                    border: `1.5px solid ${isFlash && flash.type === 'ok' ? 'rgba(34,197,94,0.5)' : isFlash && flash.type === 'fail' ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '18px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    transition: 'background 0.2s, border-color 0.2s',
                  }}
                >
                  <span style={{ fontSize: '2.2rem', flexShrink: 0 }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', margin: 0 }}>
                      {item.name[lang]}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', margin: '2px 0 0' }}>
                      {item.desc[lang]}
                    </p>
                    {count > 0 && (
                      <p style={{ color: '#a78bfa', fontSize: '0.72rem', fontWeight: 700, margin: '4px 0 0' }}>
                        {lang === 'ru' ? `У тебя: ${count} шт.` : `Tev ir: ${count} gab.`}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleBuy(item)}
                    style={{
                      background: state.xp >= item.cost
                        ? 'linear-gradient(135deg, #7c3aed, #5b21b6)'
                        : 'rgba(255,255,255,0.08)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      color: state.xp >= item.cost ? 'white' : 'rgba(255,255,255,0.3)',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: state.xp >= item.cost ? 'pointer' : 'not-allowed',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      boxShadow: state.xp >= item.cost ? '0 4px 12px rgba(124,58,237,0.4)' : 'none',
                    }}
                  >
                    {isFlash && flash.type === 'ok'
                      ? '✓'
                      : isFlash && flash.type === 'fail'
                        ? (lang === 'ru' ? 'Мало XP' : 'Maz XP')
                        : `⭐ ${item.cost} XP`}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Challenges info ─────────────────────────────────────────────── */}
        <section>
          <h2 style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 900, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
            {lang === 'ru' ? '⚔️ Челленджи' : '⚔️ Izaicinājumi'}
          </h2>

          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '14px 16px', marginBottom: '12px' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', margin: 0, lineHeight: 1.5 }}>
              {lang === 'ru'
                ? `Разблокируй челленджи прямо со страниц тем. Каждый стоит ${CHALLENGE_COST} XP — после разблокировки играй бесплатно сколько угодно.`
                : `Atbloķē izaicinājumus tieši no tēmu lapām. Katrs maksā ${CHALLENGE_COST} XP — pēc atbloķēšanas spēlē bezmaksas cik vēlies.`}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {CHALLENGE_TYPES.map((ch) => (
              <div
                key={ch.id}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1.5px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <span style={{ fontSize: '2rem', flexShrink: 0 }}>{ch.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'white', fontWeight: 800, fontSize: '0.92rem', margin: 0 }}>
                    {ch.name[lang]}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', margin: '2px 0 0' }}>
                    {ch.desc[lang]}
                  </p>
                </div>
                <span style={{ color: 'rgba(167,139,250,0.8)', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>
                  ⭐ {CHALLENGE_COST} XP
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Active items reminder */}
        <AnimatePresence>
          {((state.streakShields || 0) > 0 || (state.xpBoostCharges || 0) > 0) && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 900, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
                {lang === 'ru' ? '✅ Есть в запасе' : '✅ Pieejams'}
              </h2>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {(state.streakShields || 0) > 0 && (
                  <div style={{ background: 'rgba(34,197,94,0.12)', border: '1.5px solid rgba(34,197,94,0.3)', borderRadius: '14px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.3rem' }}>🛡️</span>
                    <span style={{ color: '#4ade80', fontWeight: 800, fontSize: '0.9rem' }}>×{state.streakShields}</span>
                  </div>
                )}
                {(state.xpBoostCharges || 0) > 0 && (
                  <div style={{ background: 'rgba(251,191,36,0.12)', border: '1.5px solid rgba(251,191,36,0.3)', borderRadius: '14px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.3rem' }}>⚡</span>
                    <span style={{ color: '#fbbf24', fontWeight: 800, fontSize: '0.9rem' }}>×{state.xpBoostCharges}</span>
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
