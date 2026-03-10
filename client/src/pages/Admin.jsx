import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const API = '';
const AP = import.meta.env.VITE_ADMIN_PATH || 'admin';

function fmt(ms) {
  if (!ms) return '—';
  return new Date(ms).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' });
}
function fmtTime(ms) {
  if (!ms) return '—';
  const d = new Date(ms);
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }) + ' ' +
    d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

const FILTERS = [
  { id: 'all', label: 'Все' },
  { id: 'trial', label: 'Пробный' },
  { id: 'active', label: 'Подписка' },
  { id: 'expired', label: 'Истекло' },
];

export default function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const token = sessionStorage.getItem('admin-token');

  useEffect(() => {
    if (!token) { navigate(`/${AP}/login`); return; }
    fetch(`${API}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        if (r.status === 401 || r.status === 403) { navigate(`/${AP}/login`); return null; }
        return r.json();
      })
      .then((data) => { if (data) setUsers(data); })
      .catch(() => setError('Ошибка загрузки'))
      .finally(() => setLoading(false));
  }, []);

  const now = Date.now();

  const filtered = users.filter((u) => {
    if (search && !u.email.includes(search.toLowerCase())) return false;
    if (filter === 'trial') return u.trialActive;
    if (filter === 'active') return u.subscriptionActive;
    if (filter === 'expired') return !u.trialActive && !u.subscriptionActive;
    return true;
  });

  const stats = {
    total: users.length,
    trial: users.filter(u => u.trialActive).length,
    active: users.filter(u => u.subscriptionActive).length,
    expired: users.filter(u => !u.trialActive && !u.subscriptionActive).length,
  };

  const statusBadge = (u) => {
    if (u.subscriptionActive) return <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-black">Подписка</span>;
    if (u.trialActive) return <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full font-black">Пробный</span>;
    return <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-black">Истёк</span>;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black">🏢 CRM · Магия Знаний</h1>
            <p className="text-white/30 text-sm">Панель администратора</p>
          </div>
          <button
            onClick={() => { sessionStorage.removeItem('admin-token'); navigate(`/${AP}/login`); }}
            className="text-white/30 hover:text-white/60 text-sm transition-colors"
          >
            Выйти
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Всего', value: stats.total, color: 'text-white' },
            { label: 'Пробный', value: stats.trial, color: 'text-yellow-400' },
            { label: 'Подписка', value: stats.active, color: 'text-green-400' },
            { label: 'Истёк', value: stats.expired, color: 'text-red-400' },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-white/40 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters + search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  filter === f.id ? 'bg-indigo-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по email..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-indigo-400"
          />
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {/* Table */}
        {loading ? (
          <p className="text-white/30 text-center py-10">Загрузка...</p>
        ) : (
          <div className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
                    <th className="text-left px-4 py-3">Email</th>
                    <th className="text-left px-4 py-3">Статус</th>
                    <th className="text-left px-4 py-3">Зарег.</th>
                    <th className="text-left px-4 py-3">Пробный до</th>
                    <th className="text-left px-4 py-3">План</th>
                    <th className="text-left px-4 py-3">Класс</th>
                    <th className="text-left px-4 py-3">Подписка до</th>
                    <th className="text-left px-4 py-3">Уроков</th>
                    <th className="text-left px-4 py-3">Посл. активность</th>
                    <th className="text-left px-4 py-3">Стр.</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={10} className="text-center text-white/30 py-8">Нет пользователей</td></tr>
                  )}
                  {filtered.map((u) => (
                    <tr
                      key={u.email}
                      onClick={() => navigate(`/${AP}/user/${encodeURIComponent(u.email)}`)}
                      className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-indigo-300 text-xs">{u.email}</td>
                      <td className="px-4 py-3">{statusBadge(u)}</td>
                      <td className="px-4 py-3 text-white/50">{fmt(u.createdAt)}</td>
                      <td className="px-4 py-3 text-white/50">{fmt(u.trialEnd)}</td>
                      <td className="px-4 py-3 text-white/70">{u.subscription?.plan || '—'}</td>
                      <td className="px-4 py-3 text-white/70">{u.subscription?.grade || u.profile?.grade || '—'}</td>
                      <td className="px-4 py-3 text-white/50">{fmt(u.subscription?.expiresAt)}</td>
                      <td className="px-4 py-3 text-white/70 font-black">{u.completedLessons}</td>
                      <td className="px-4 py-3 text-white/40 text-xs">{fmtTime(u.lastActivity)}</td>
                      <td className="px-4 py-3 text-white/30 text-xs max-w-[120px] truncate">{u.lastPage || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <p className="text-white/20 text-xs mt-3 text-right">{filtered.length} из {users.length}</p>
      </div>
    </div>
  );
}
