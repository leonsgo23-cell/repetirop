import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { SHOP_ITEMS, TITLES, THEMES } from '../data/shop';

const SECTIONS = ['consumables', 'titles', 'themes'];
const SECTION_LABELS = {
  consumables: { ru: '🧪 Расходники', lv: '🧪 Patēriņa preces' },
  titles:      { ru: '🏷️ Титулы',     lv: '🏷️ Nosaukumi'      },
  themes:      { ru: '🎨 Темы',        lv: '🎨 Tēmas'           },
};

export default function Shop() {
  const navigate = useNavigate();
  const { state, buyItem, buyTitle, setActiveTitle, buyTheme, setActiveTheme } = useApp();
  const lang = state.language || 'ru';

  const [section, setSection] = useState('consumables');
  const [flash, setFlash] = useState(null); // { id, type: 'ok'|'fail' }

  const showFlash = (id, type) => {
    setFlash({ id, type });
    setTimeout(() => setFlash(null), 1100);
  };

  const handleBuyConsumable = (item) => {
    if (state.xp < item.cost) { showFlash(item.id, 'fail'); return; }
    buyItem(item.id);
    showFlash(item.id, 'ok');
  };

  const handleBuyTitle = (title) => {
    const owned = (state.boughtTitles || []).includes(title.id);
    if (owned) { setActiveTitle(title.id); return; }
    if (state.xp < title.cost) { showFlash(title.id, 'fail'); return; }
    buyTitle(title.id, title.cost);
    setActiveTitle(title.id);
    showFlash(title.id, 'ok');
  };

  const handleBuyTheme = (theme) => {
    const owned = (state.boughtThemes || ['default']).includes(theme.id);
    if (owned) { setActiveTheme(theme.id); return; }
    if (state.xp < theme.cost) { showFlash(theme.id, 'fail'); return; }
    buyTheme(theme.id, theme.cost);
    setActiveTheme(theme.id);
    showFlash(theme.id, 'ok');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', paddingBottom: '40px' }}>

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

      {/* Tab bar */}
      <div style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex' }}>
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                borderBottom: s === section ? '3px solid #a78bfa' : '3px solid transparent',
                color: s === section ? '#a78bfa' : 'rgba(255,255,255,0.4)',
                fontWeight: s === section ? 800 : 600,
                fontSize: '0.75rem',
                padding: '12px 4px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {SECTION_LABELS[s][lang]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* ── Consumables ─────────────────────────────────────────────────── */}
        {section === 'consumables' && SHOP_ITEMS.map((item) => {
          const isFlash = flash?.id === item.id;
          const count = state[item.stateKey] || 0;
          const canAfford = state.xp >= item.cost;
          return (
            <motion.div
              key={item.id}
              animate={isFlash && flash.type === 'fail' ? { x: [-6, 6, -4, 4, 0] } : {}}
              transition={{ duration: 0.3 }}
              style={{
                background: isFlash && flash.type === 'ok'
                  ? 'rgba(34,197,94,0.15)' : isFlash && flash.type === 'fail'
                  ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)',
                border: `1.5px solid ${isFlash && flash.type === 'ok' ? 'rgba(34,197,94,0.5)' : isFlash && flash.type === 'fail' ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '18px', padding: '15px',
                display: 'flex', alignItems: 'center', gap: '12px',
                transition: 'background 0.2s, border-color 0.2s',
              }}
            >
              <span style={{ fontSize: '2rem', flexShrink: 0 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontWeight: 800, fontSize: '0.92rem', margin: 0 }}>
                  {item.name[lang]}
                  {count > 0 && <span style={{ color: '#a78bfa', fontSize: '0.75rem', marginLeft: '8px', fontWeight: 700 }}>×{count}</span>}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.74rem', margin: '2px 0 0' }}>{item.desc[lang]}</p>
              </div>
              <button
                onClick={() => handleBuyConsumable(item)}
                style={{
                  background: canAfford ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'rgba(255,255,255,0.08)',
                  border: 'none', borderRadius: '12px', padding: '9px 13px',
                  color: canAfford ? 'white' : 'rgba(255,255,255,0.3)',
                  fontWeight: 800, fontSize: '0.8rem', cursor: canAfford ? 'pointer' : 'not-allowed',
                  whiteSpace: 'nowrap', flexShrink: 0,
                  boxShadow: canAfford ? '0 4px 12px rgba(124,58,237,0.4)' : 'none',
                }}
              >
                {isFlash && flash.type === 'ok' ? '✓'
                  : isFlash && flash.type === 'fail' ? (lang === 'ru' ? 'Мало XP' : 'Maz XP')
                  : `⭐ ${item.cost}`}
              </button>
            </motion.div>
          );
        })}

        {/* ── Titles ──────────────────────────────────────────────────────── */}
        {section === 'titles' && (
          <>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', margin: '0 0 4px', textAlign: 'center' }}>
              {lang === 'ru'
                ? 'Купи и надень — будет виден на дашборде рядом с именем'
                : 'Nopērc un uzvelc — redzams uz informācijas paneļa blakus vārdam'}
            </p>
            {TITLES.map((title) => {
              const owned = (state.boughtTitles || []).includes(title.id);
              const isActive = state.activeTitle === title.id;
              const isFlash = flash?.id === title.id;
              const canAfford = state.xp >= title.cost;
              return (
                <motion.div
                  key={title.id}
                  animate={isFlash && flash.type === 'fail' ? { x: [-6, 6, -4, 4, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: isActive
                      ? 'rgba(167,139,250,0.15)' : isFlash && flash.type === 'ok'
                      ? 'rgba(34,197,94,0.15)'   : 'rgba(255,255,255,0.06)',
                    border: `1.5px solid ${isActive ? 'rgba(167,139,250,0.5)' : isFlash && flash.type === 'fail' ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '18px', padding: '15px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    transition: 'background 0.2s, border-color 0.2s',
                  }}
                >
                  <span style={{ fontSize: '2rem', flexShrink: 0 }}>{title.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'white', fontWeight: 900, fontSize: '0.95rem', margin: 0 }}>
                      {title.name[lang]}
                      {isActive && <span style={{ color: '#a78bfa', fontSize: '0.7rem', marginLeft: '8px', fontWeight: 700 }}>✓ {lang === 'ru' ? 'Надет' : 'Uzvilkts'}</span>}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.73rem', margin: '2px 0 0' }}>
                      {owned
                        ? (lang === 'ru' ? 'Куплен · нажми чтобы надеть / снять' : 'Nopirkts · nospied, lai uzvilktu / novilktu')
                        : `⭐ ${title.cost} XP`}
                    </p>
                  </div>
                  <button
                    onClick={() => handleBuyTitle(title)}
                    style={{
                      background: owned
                        ? (isActive ? 'rgba(167,139,250,0.3)' : 'rgba(167,139,250,0.15)')
                        : canAfford ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'rgba(255,255,255,0.08)',
                      border: owned ? '1.5px solid rgba(167,139,250,0.4)' : 'none',
                      borderRadius: '12px', padding: '9px 13px',
                      color: owned ? '#a78bfa' : canAfford ? 'white' : 'rgba(255,255,255,0.3)',
                      fontWeight: 800, fontSize: '0.8rem',
                      cursor: (!owned && !canAfford) ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap', flexShrink: 0,
                    }}
                  >
                    {isFlash && flash.type === 'ok' ? '✓'
                      : isFlash && flash.type === 'fail' ? (lang === 'ru' ? 'Мало XP' : 'Maz XP')
                      : owned ? (isActive ? (lang === 'ru' ? 'Снять' : 'Novilkt') : (lang === 'ru' ? 'Надеть' : 'Uzvilkt'))
                      : `⭐ ${title.cost}`}
                  </button>
                </motion.div>
              );
            })}
          </>
        )}

        {/* ── Themes ──────────────────────────────────────────────────────── */}
        {section === 'themes' && (
          <>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', margin: '0 0 4px', textAlign: 'center' }}>
              {lang === 'ru'
                ? 'Меняет фон дашборда — покупается один раз, навсегда'
                : 'Maina informācijas paneļa fonu — noperkams vienu reizi uz visiem laikiem'}
            </p>
            {THEMES.map((theme) => {
              const owned = (state.boughtThemes || ['default']).includes(theme.id);
              const isActive = state.activeTheme === theme.id;
              const isFlash = flash?.id === theme.id;
              const canAfford = state.xp >= theme.cost;
              return (
                <motion.div
                  key={theme.id}
                  animate={isFlash && flash.type === 'fail' ? { x: [-6, 6, -4, 4, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: isActive
                      ? 'rgba(167,139,250,0.12)' : 'rgba(255,255,255,0.06)',
                    border: `1.5px solid ${isActive ? 'rgba(167,139,250,0.45)' : isFlash && flash.type === 'fail' ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '18px', padding: '15px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                  }}
                >
                  {/* Theme preview swatch */}
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: theme.bg, flexShrink: 0,
                    border: isActive ? '2px solid rgba(167,139,250,0.7)' : '2px solid rgba(255,255,255,0.15)',
                    boxShadow: isActive ? '0 0 12px rgba(167,139,250,0.4)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem',
                  }}>
                    {isActive ? '✓' : theme.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'white', fontWeight: 900, fontSize: '0.95rem', margin: 0 }}>
                      {theme.name[lang]}
                      {isActive && <span style={{ color: '#a78bfa', fontSize: '0.7rem', marginLeft: '8px', fontWeight: 700 }}>✓ {lang === 'ru' ? 'Активна' : 'Aktīva'}</span>}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.73rem', margin: '2px 0 0' }}>
                      {owned
                        ? (lang === 'ru' ? 'Куплена · нажми чтобы применить' : 'Nopirkta · nospied, lai piemērotu')
                        : theme.cost === 0 ? (lang === 'ru' ? 'Бесплатно' : 'Bez maksas')
                        : `⭐ ${theme.cost} XP`}
                    </p>
                  </div>
                  <button
                    onClick={() => handleBuyTheme(theme)}
                    style={{
                      background: owned
                        ? (isActive ? 'rgba(167,139,250,0.3)' : 'rgba(167,139,250,0.15)')
                        : canAfford ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'rgba(255,255,255,0.08)',
                      border: owned ? '1.5px solid rgba(167,139,250,0.4)' : 'none',
                      borderRadius: '12px', padding: '9px 13px',
                      color: owned ? '#a78bfa' : canAfford ? 'white' : 'rgba(255,255,255,0.3)',
                      fontWeight: 800, fontSize: '0.8rem',
                      cursor: (!owned && !canAfford) ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap', flexShrink: 0,
                    }}
                  >
                    {isFlash && flash.type === 'ok' ? '✓'
                      : isFlash && flash.type === 'fail' ? (lang === 'ru' ? 'Мало XP' : 'Maz XP')
                      : owned ? (isActive ? (lang === 'ru' ? 'Надета' : 'Uzlikta') : (lang === 'ru' ? 'Применить' : 'Piemērot'))
                      : theme.cost === 0 ? (lang === 'ru' ? 'Применить' : 'Piemērot')
                      : `⭐ ${theme.cost}`}
                  </button>
                </motion.div>
              );
            })}
          </>
        )}

        {/* Active items reminder */}
        <AnimatePresence>
          {section === 'consumables' && ((state.streakShields || 0) > 0 || (state.xpBoostCharges || 0) > 0 || (state.hintTokens || 0) > 0 || (state.chatTokens || 0) > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '14px', padding: '12px 16px' }}
            >
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>
                {lang === 'ru' ? '✅ В запасе' : '✅ Rezervē'}
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { key: 'streakShields', icon: '🛡️', val: state.streakShields },
                  { key: 'xpBoostCharges', icon: '⚡', val: state.xpBoostCharges },
                  { key: 'hintTokens', icon: '💡', val: state.hintTokens },
                  { key: 'chatTokens', icon: '💬', val: state.chatTokens },
                ].filter(({ val }) => (val || 0) > 0).map(({ key, icon, val }) => (
                  <span key={key} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '4px 10px', color: 'white', fontSize: '0.82rem', fontWeight: 800 }}>
                    {icon} ×{val}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
