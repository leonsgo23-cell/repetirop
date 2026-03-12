import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const API = '';
const AP = import.meta.env.VITE_ADMIN_PATH || 'admin';

function fmtFull(ms) {
  if (!ms) return '—';
  return new Date(ms).toLocaleString('ru-RU');
}
function fmtDate(ms) {
  if (!ms) return '—';
  return new Date(ms).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

const EVENT_ICONS = {
  register: '🆕',
  login: '🔑',
  page_view: '👁',
  lesson_start: '▶️',
  lesson_complete: '✅',
  subscribe: '💳',
  trial_start: '⏳',
};

const EVENT_LABELS = {
  register: 'Регистрация',
  login: 'Вход',
  page_view: 'Страница',
  lesson_start: 'Урок начат',
  lesson_complete: 'Урок завершён',
  subscribe: 'Подписка',
  trial_start: 'Пробный период',
};

const PLAN_LABELS = { '1mo': '1 месяц', '6mo': '6 месяцев', '12mo': '1 год' };
const PLAN_DAYS  = { '1mo': 30, '6mo': 183, '12mo': 365 };

export default function AdminUser() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mgmtPlan, setMgmtPlan] = useState('1mo');
  const [mgmtGrade, setMgmtGrade] = useState(5);
  const [mgmtDays, setMgmtDays] = useState('');
  const [mgmtLoading, setMgmtLoading] = useState(false);
  const [mgmtMsg, setMgmtMsg] = useState('');

  const token = sessionStorage.getItem('admin-token');

  useEffect(() => {
    if (!token) { navigate(`/${AP}/login`); return; }
    fetch(`${API}/api/admin/users/${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401 || r.status === 403) { navigate(`/${AP}/login`); return null; }
        return r.json();
      })
      .then((data) => { if (data) setUser(data); })
      .catch(() => setError('Ошибка загрузки'))
      .finally(() => setLoading(false));
  }, [email]);

  const reloadUser = () => {
    fetch(`${API}/api/admin/users/${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()).then(data => setUser(data)).catch(() => {});
  };

  const grantSub = async () => {
    setMgmtLoading(true); setMgmtMsg('');
    const days = mgmtDays ? Number(mgmtDays) : PLAN_DAYS[mgmtPlan];
    try {
      const r = await fetch(`${API}/api/admin/users/${encodeURIComponent(email)}/subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan: mgmtPlan, grade: mgmtGrade, days }),
      });
      const d = await r.json();
      if (!r.ok) { setMgmtMsg('Ошибка: ' + (d.error || r.status)); }
      else { setMgmtMsg('✅ Подписка выдана'); reloadUser(); }
    } catch { setMgmtMsg('Сетевая ошибка'); }
    finally { setMgmtLoading(false); }
  };

  const expireTrial = async () => {
    if (!confirm('Истечь пробный период прямо сейчас?')) return;
    setMgmtLoading(true); setMgmtMsg('');
    try {
      const r = await fetch(`${API}/api/admin/users/${encodeURIComponent(email)}/trial`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({}),
      });
      const d = await r.json();
      if (!r.ok) { setMgmtMsg('Ошибка: ' + (d.error || r.status)); }
      else { setMgmtMsg('✅ Трайл истёк'); reloadUser(); }
    } catch { setMgmtMsg('Сетевая ошибка'); }
    finally { setMgmtLoading(false); }
  };

  const removeSub = async () => {
    if (!confirm('Удалить подписку?')) return;
    setMgmtLoading(true); setMgmtMsg('');
    try {
      const r = await fetch(`${API}/api/admin/users/${encodeURIComponent(email)}/subscription`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = await r.json();
      if (!r.ok) { setMgmtMsg('Ошибка: ' + (d.error || r.status)); }
      else { setMgmtMsg('✅ Подписка удалена'); reloadUser(); }
    } catch { setMgmtMsg('Сетевая ошибка'); }
    finally { setMgmtLoading(false); }
  };

  if (loading) return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-white/30">Загрузка...</div>;
  if (error) return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-red-400">{error}</div>;
  if (!user) return null;

  const now = Date.now();
  const sub = user.subscription;
  const subActive = sub && sub.expiresAt > now;
  const trialActive = user.trialEnd > now;

  const completedLessons = (user.events || []).filter(e => e.type === 'lesson_complete');
  const logins = (user.events || []).filter(e => e.type === 'login').length;
  const pageViews = (user.events || []).filter(e => e.type === 'page_view').length;

  // Funnel
  const funnelSteps = [
    { label: 'Зарегистрировался', done: true },
    { label: 'Начал урок', done: (user.events || []).some(e => e.type === 'lesson_start') },
    { label: 'Завершил урок', done: completedLessons.length > 0 },
    { label: 'Оформил подписку', done: (user.events || []).some(e => e.type === 'subscribe') },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(`/${AP}`)} className="text-white/30 hover:text-white/60 text-sm mb-6 transition-colors">
          ← Назад к списку
        </button>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          {/* User header */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="font-mono text-indigo-300 text-lg font-black break-all">{user.email}</div>
                <div className="text-white/40 text-sm mt-1">Зарег. {fmtDate(user.createdAt)}</div>
              </div>
              <div className="flex flex-col gap-1 text-right">
                {subActive && <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full font-black">Подписка активна</span>}
                {!subActive && trialActive && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full font-black">Пробный период</span>}
                {!subActive && !trialActive && <span className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full font-black">Истёк</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              {[
                { label: 'Уроков', value: completedLessons.length },
                { label: 'Входов', value: logins },
                { label: 'Просмотров', value: pageViews },
                { label: 'События', value: (user.events || []).length },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-2xl font-black text-white">{s.value}</div>
                  <div className="text-white/40 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription info */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-5">
            <h2 className="font-black text-white/70 text-sm uppercase tracking-wider mb-3">Подписка</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-white/40">Пробный до:</span> <span className="text-yellow-300">{fmtFull(user.trialEnd)}</span></div>
              <div><span className="text-white/40">Статус:</span> <span>{trialActive ? '⏳ Активен' : '❌ Истёк'}</span></div>
              {sub ? (
                <>
                  <div><span className="text-white/40">План:</span> <span>{PLAN_LABELS[sub.plan] || sub.plan}</span></div>
                  <div><span className="text-white/40">Класс:</span> <span>{sub.grade} кл.</span></div>
                  <div><span className="text-white/40">Начало:</span> <span>{fmtDate(sub.startedAt)}</span></div>
                  <div><span className="text-white/40">Истекает:</span> <span className={subActive ? 'text-green-400' : 'text-red-400'}>{fmtDate(sub.expiresAt)}</span></div>
                </>
              ) : (
                <div className="col-span-2 text-white/30">Нет подписки</div>
              )}
            </div>
          </div>

          {/* Subscription management */}
          <div className="bg-white/5 border border-indigo-500/30 rounded-2xl p-5 mb-5">
            <h2 className="font-black text-indigo-300 text-sm uppercase tracking-wider mb-4">⚙️ Управление подпиской</h2>
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="text-white/40 text-xs block mb-1">План</label>
                <select
                  value={mgmtPlan}
                  onChange={e => setMgmtPlan(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-400"
                >
                  <option value="1mo">1 месяц (30 дн.)</option>
                  <option value="6mo">6 месяцев (183 дн.)</option>
                  <option value="12mo">1 год (365 дн.)</option>
                </select>
              </div>
              <div>
                <label className="text-white/40 text-xs block mb-1">Класс</label>
                <select
                  value={mgmtGrade}
                  onChange={e => setMgmtGrade(Number(e.target.value))}
                  className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-400"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(g => (
                    <option key={g} value={g}>{g} класс</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-white/40 text-xs block mb-1">Дней (своё)</label>
                <input
                  type="number"
                  min="1"
                  placeholder="авто"
                  value={mgmtDays}
                  onChange={e => setMgmtDays(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm w-24 focus:outline-none focus:border-indigo-400 placeholder-white/20"
                />
              </div>
              <button
                onClick={grantSub}
                disabled={mgmtLoading}
                className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-black px-4 py-2 rounded-xl text-sm transition-colors"
              >
                {mgmtLoading ? '...' : '✅ Выдать'}
              </button>
              <button
                onClick={expireTrial}
                disabled={mgmtLoading}
                className="bg-amber-600/80 hover:bg-amber-500 disabled:opacity-50 text-white font-black px-4 py-2 rounded-xl text-sm transition-colors"
              >
                ⏰ Истечь трайл
              </button>
              {sub && (
                <button
                  onClick={removeSub}
                  disabled={mgmtLoading}
                  className="bg-red-600/80 hover:bg-red-500 disabled:opacity-50 text-white font-black px-4 py-2 rounded-xl text-sm transition-colors"
                >
                  🗑 Удалить подписку
                </button>
              )}
            </div>
            {mgmtMsg && <p className="text-sm mt-3 text-indigo-300">{mgmtMsg}</p>}
          </div>

          {/* Funnel */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-5">
            <h2 className="font-black text-white/70 text-sm uppercase tracking-wider mb-3">Воронка</h2>
            <div className="flex flex-wrap gap-2">
              {funnelSteps.map((step, i) => (
                <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold ${step.done ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-white/5 text-white/30 border border-white/10'}`}>
                  <span>{step.done ? '✅' : '○'}</span>
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Events log */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="font-black text-white/70 text-sm uppercase tracking-wider mb-3">
              История событий ({(user.events || []).length})
            </h2>
            <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
              {[...(user.events || [])].reverse().map((ev, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-white/5 text-sm">
                  <span className="text-base shrink-0">{EVENT_ICONS[ev.type] || '•'}</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-white/80">{EVENT_LABELS[ev.type] || ev.type}</span>
                    {ev.page && <span className="text-white/40 ml-2 font-mono text-xs">{ev.page}</span>}
                    {ev.subject && <span className="text-white/40 ml-2 text-xs">{ev.subject} / {ev.topicId} / lv{ev.level}</span>}
                    {ev.plan && <span className="text-indigo-300 ml-2 text-xs">{ev.plan} · {ev.grade} кл.</span>}
                    {ev.score !== undefined && <span className="text-green-400 ml-2 text-xs">★ {ev.score}</span>}
                  </div>
                  <span className="text-white/20 text-xs shrink-0 whitespace-nowrap">{fmtFull(ev.at)}</span>
                </div>
              ))}
              {(user.events || []).length === 0 && <p className="text-white/30 text-center py-4">Нет событий</p>}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
