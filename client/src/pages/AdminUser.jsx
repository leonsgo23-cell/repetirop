import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const API = 'http://localhost:3001';

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

export default function AdminUser() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = sessionStorage.getItem('admin-token');

  useEffect(() => {
    if (!token) { navigate('/admin/login'); return; }
    fetch(`${API}/api/admin/users/${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401 || r.status === 403) { navigate('/admin/login'); return null; }
        return r.json();
      })
      .then((data) => { if (data) setUser(data); })
      .catch(() => setError('Ошибка загрузки'))
      .finally(() => setLoading(false));
  }, [email]);

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
        <button onClick={() => navigate('/admin')} className="text-white/30 hover:text-white/60 text-sm mb-6 transition-colors">
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
