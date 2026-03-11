import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const API = '';

// Safe localStorage wrapper — some mobile in-app browsers (Telegram, WeChat) throw SecurityError
function lsGet(key) { try { return localStorage.getItem(key); } catch { return null; } }
function lsSet(key, val) { try { localStorage.setItem(key, val); } catch {} }
function lsRemove(key) { try { localStorage.removeItem(key); } catch {} }

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => lsGet('zephyr-token'));
  const [user, setUser] = useState(null); // { email, trialEnd, subscription, profile }
  const [loading, setLoading] = useState(!!lsGet('zephyr-token'));

  // Restore session on mount
  useEffect(() => {
    const t = lsGet('zephyr-token');
    if (!t) { setLoading(false); return; }
    fetch(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${t}` } })
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((u) => {
        lsSet('zephyr-user', u.email); // ensure AppContext loads correct per-user state
        setUser(u);
        setToken(t);
      })
      .catch(() => {
        lsRemove('zephyr-token');
        lsRemove('zephyr-user');
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
    lsSet('zephyr-token', data.token);
    lsSet('zephyr-user', data.user.email);
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
    lsSet('zephyr-token', data.token);
    lsSet('zephyr-user', data.user.email);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    lsRemove('zephyr-token');
    lsRemove('zephyr-user');
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
    if (data.token) {
      lsSet('zephyr-token', data.token);
      setToken(data.token);
    }
    setUser((prev) => ({ ...prev, subscription: data.subscription }));
    return data.subscription;
  };

  // Save grade/name/language to server so it persists across devices
  const saveProfile = useCallback((grade, studentName, language) => {
    if (!token) return;
    fetch(`${API}/api/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ grade, studentName, language }),
    })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.profile) setUser((prev) => ({ ...prev, profile: data.profile }));
      })
      .catch(() => {});
  }, [token]);

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
    const data = await r.json();
    // Keep subscription object (access until expiresAt), just mark cancelledAt
    setUser((prev) => ({ ...prev, subscription: data.subscription ?? null }));
  };

  const refreshUser = async () => {
    const t = lsGet('zephyr-token');
    if (!t) return;
    const r = await fetch(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${t}` } });
    if (!r.ok) return;
    const u = await r.json();
    setUser(u);
    return u;
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
    <AuthContext.Provider value={{ token, user, loading, register, login, logout, subscribe, cancelSubscription, trackEvent, saveProfile, isTrialActive, hasAccess, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
