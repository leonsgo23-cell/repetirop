import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const API = '';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('zephyr-token'));
  const [user, setUser] = useState(null); // { email, trialEnd, subscription }
  const [loading, setLoading] = useState(!!localStorage.getItem('zephyr-token'));

  // Restore session on mount
  useEffect(() => {
    const t = localStorage.getItem('zephyr-token');
    if (!t) { setLoading(false); return; }
    fetch(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${t}` } })
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((u) => {
        localStorage.setItem('zephyr-user', u.email); // ensure AppContext loads correct per-user state
        setUser(u);
        setToken(t);
      })
      .catch(() => {
        localStorage.removeItem('zephyr-token');
        localStorage.removeItem('zephyr-user');
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const register = async (email, password) => {
    const r = await fetch(`${API}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Registration failed');
    localStorage.setItem('zephyr-token', data.token);
    localStorage.setItem('zephyr-user', data.user.email);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const login = async (email, password) => {
    const r = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Login failed');
    localStorage.setItem('zephyr-token', data.token);
    localStorage.setItem('zephyr-user', data.user.email);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('zephyr-token');
    localStorage.removeItem('zephyr-user');
    setToken(null);
    setUser(null);
  };

  const subscribe = async (plan, grade) => {
    const r = await fetch(`${API}/api/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ plan, grade }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Subscribe failed');
    // Update token (subscription baked in server side)
    if (data.token) {
      localStorage.setItem('zephyr-token', data.token);
      setToken(data.token);
    }
    setUser((prev) => ({ ...prev, subscription: data.subscription }));
    return data.subscription;
  };

  const trackEvent = useCallback((type, extra = {}) => {
    if (!token) return;
    fetch(`${API}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ type, ...extra }),
    }).catch(() => {});
  }, [token]);

  const cancelSubscription = async () => {
    const r = await fetch(`${API}/api/subscribe/cancel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!r.ok) throw new Error('Cancel failed');
    setUser((prev) => ({ ...prev, subscription: null }));
  };

  const isTrialActive = () => user && user.trialEnd > Date.now();

  const hasAccess = (grade) => {
    if (!user) return false;
    if (isTrialActive()) return true;
    const sub = user.subscription;
    if (!sub || sub.expiresAt < Date.now()) return false;
    return sub.grade === Number(grade);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, register, login, logout, subscribe, cancelSubscription, trackEvent, isTrialActive, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
