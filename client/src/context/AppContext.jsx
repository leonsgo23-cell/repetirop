import { createContext, useContext, useState, useEffect, useRef } from 'react';

const AppContext = createContext(null);

const defaultState = {
  language: null,           // 'ru' | 'lv'
  studentName: '',
  grade: null,              // 1–12
  xp: 0,
  level: 1,
  streak: 0,
  lastLoginDate: null,
  lastLessonDate: null,     // streak is based on lesson completions, not logins
  completedTopics: [],      // ['math_numbers_1_20_1', ...]
  startedTopics: [],        // for weak-spot tracking
  achievements: [],
  totalSessions: 0,
  hasSeenGuide: false,
  // consumables
  streakShields: 0,
  xpBoostCharges: 0,
  hintTokens: 0,
  // premium
  vipExpiry: null,       // ms timestamp, null = no VIP
  // streak repair
  streakRepairInfo: null,   // { prevStreak, brokenAt } | null
  // cosmetics
  boughtTitles: [],
  activeTitle: null,        // title id or null
};

function getStateKey() {
  const u = localStorage.getItem('zephyr-user');
  return u ? `zephyr-state-${u}` : 'zephyr-state';
}

export function AppProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(getStateKey());
      return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
    } catch {
      return defaultState;
    }
  });

  // Persist to localStorage under user-specific key
  useEffect(() => {
    localStorage.setItem(getStateKey(), JSON.stringify(state));
  }, [state]);

  // Track login date (streak is now updated only on lesson completion)
  useEffect(() => {
    const today = new Date().toDateString();
    if (state.lastLoginDate !== today) {
      setState((prev) => {
        if (prev.lastLoginDate === today) return prev;
        return { ...prev, lastLoginDate: today };
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateState = (updates) => setState((prev) => ({ ...prev, ...updates }));

  // Purchase lock — prevents double-buying on rapid double-clicks
  const purchaseLock = useRef(false);

  const addXP = (amount) => {
    setState((prev) => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 150) + 1;
      return { ...prev, xp: newXP, level: newLevel };
    });
  };

  const completeTopic = (subject, topicId, level) => {
    const key = `${subject}_${topicId}_${level}`;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const twoDaysAgo = new Date(Date.now() - 172800000).toDateString();
    const threeDaysAgo = new Date(Date.now() - 259200000).toDateString();
    setState((prev) => {
      if (prev.completedTopics.includes(key)) return prev;
      const newCompleted = [...prev.completedTopics, key];
      const newAchievements = [...prev.achievements];
      if (!newAchievements.includes('first_lesson')) newAchievements.push('first_lesson');
      const allTopicIds = new Set(newCompleted.map((k) => k.split('_').slice(0, -1).join('_')));
      const fullDone = [...allTopicIds].filter((tid) =>
        [1, 2, 3, 4, 5].every((l) => newCompleted.includes(`${tid}_${l}`))
      );
      const mathFull = fullDone.filter((k) => k.startsWith('math_')).length;
      const engFull  = fullDone.filter((k) => k.startsWith('english_')).length;
      const lvFull   = fullDone.filter((k) => k.startsWith('latvian_')).length;
      if (mathFull >= 3 && !newAchievements.includes('math_explorer')) newAchievements.push('math_explorer');
      if (engFull  >= 3 && !newAchievements.includes('english_explorer')) newAchievements.push('english_explorer');
      if (lvFull   >= 3 && !newAchievements.includes('latvian_explorer')) newAchievements.push('latvian_explorer');

      // Update streak based on lesson completion (not login)
      let streakUpdate = {};
      if (prev.lastLessonDate !== today) {
        const shields = prev.streakShields || 0;
        const oldStreak = prev.streak || 0;
        let newStreak;
        let shieldsConsumed = 0;
        let newRepairInfo = prev.streakRepairInfo; // keep existing unless streak breaks

        if (prev.lastLessonDate === yesterday) {
          // consecutive day — streak continues
          newStreak = oldStreak + 1;
        } else if (prev.lastLessonDate === twoDaysAgo && shields >= 1) {
          // missed 1 day, 1 shield protects it
          newStreak = oldStreak + 1;
          shieldsConsumed = 1;
        } else if (prev.lastLessonDate === threeDaysAgo && shields >= 2) {
          // missed 2 days, 2 shields protect both
          newStreak = oldStreak + 1;
          shieldsConsumed = 2;
        } else {
          // streak breaks — record repair opportunity if streak was meaningful
          newStreak = 1;
          if (oldStreak >= 2) {
            newRepairInfo = { prevStreak: oldStreak, brokenAt: Date.now() };
          }
        }
        streakUpdate = {
          lastLessonDate: today,
          streak: newStreak,
          streakShields: Math.max(0, shields - shieldsConsumed),
          streakRepairInfo: newRepairInfo,
        };
      }

      return { ...prev, completedTopics: newCompleted, achievements: newAchievements, ...streakUpdate };
    });
  };

  const isLevelUnlocked = (subject, topicId, level) => {
    if (level === 1) return true;
    return state.completedTopics.includes(`${subject}_${topicId}_${level - 1}`);
  };

  const topicLevelsDone = (subject, topicId) =>
    [1, 2, 3, 4, 5].filter((l) =>
      state.completedTopics.includes(`${subject}_${topicId}_${l}`)
    ).length;

  const unlockAchievement = (id) => {
    setState((prev) => {
      if (prev.achievements.includes(id)) return prev;
      return { ...prev, achievements: [...prev.achievements, id] };
    });
  };

  const markGuideSeen = () => setState((prev) => ({ ...prev, hasSeenGuide: true }));

  const startTopic = (subject, topicId, level) => {
    const key = `${subject}_${topicId}_${level}`;
    setState((prev) => {
      const started = prev.startedTopics || [];
      if (started.includes(key)) return prev;
      return { ...prev, startedTopics: [...started, key] };
    });
  };

  // ── Consumables ──────────────────────────────────────────────────────────────

  const buyItem = (itemId) => {
    if (purchaseLock.current) return;
    const costs = { streak_shield: 100, xp_boost: 75, hint_token: 40 };
    const cost = costs[itemId];
    if (!cost) return;
    purchaseLock.current = true;
    setTimeout(() => { purchaseLock.current = false; }, 500);
    setState((prev) => {
      if (prev.xp < cost) return prev;
      const newXp = prev.xp - cost;
      const updates = { xp: newXp, level: Math.max(1, Math.floor(newXp / 150) + 1) };
      if (itemId === 'streak_shield') updates.streakShields = (prev.streakShields || 0) + 1;
      if (itemId === 'xp_boost')      updates.xpBoostCharges = (prev.xpBoostCharges || 0) + 1;
      if (itemId === 'hint_token')    updates.hintTokens = (prev.hintTokens || 0) + 1;
      return { ...prev, ...updates };
    });
  };

  const consumeXPBoost = () => {
    setState((prev) => ({
      ...prev,
      xpBoostCharges: Math.max(0, (prev.xpBoostCharges || 0) - 1),
    }));
  };

  const useHintToken = () => {
    setState((prev) => ({
      ...prev,
      hintTokens: Math.max(0, (prev.hintTokens || 0) - 1),
    }));
  };

  const repairStreak = () => {
    const info = state.streakRepairInfo;
    if (!info) return false;
    // Cost: 75 XP fixed
    const cost = 75;
    if (state.xp < cost) return false;
    setState((prev) => {
      if (!prev.streakRepairInfo || prev.xp < cost) return prev;
      const newXp = prev.xp - cost;
      return {
        ...prev,
        xp: newXp,
        level: Math.max(1, Math.floor(newXp / 150) + 1),
        streak: prev.streakRepairInfo.prevStreak,
        streakRepairInfo: null,
      };
    });
    return true;
  };

  const dismissStreakRepair = () => {
    setState((prev) => ({ ...prev, streakRepairInfo: null }));
  };

  // ── Titles ───────────────────────────────────────────────────────────────────

  const buyTitle = (id, cost) => {
    if (purchaseLock.current) return;
    purchaseLock.current = true;
    setTimeout(() => { purchaseLock.current = false; }, 500);
    setState((prev) => {
      if (prev.xp < cost) return prev;
      if ((prev.boughtTitles || []).includes(id)) return prev;
      const newXp = prev.xp - cost;
      return {
        ...prev,
        xp: newXp,
        level: Math.max(1, Math.floor(newXp / 150) + 1),
        boughtTitles: [...(prev.boughtTitles || []), id],
      };
    });
  };

  const setActiveTitle = (id) => {
    setState((prev) => ({
      ...prev,
      activeTitle: prev.activeTitle === id ? null : id,
    }));
  };

  // ── XP helpers ───────────────────────────────────────────────────────────────

  const xpToNextLevel = (level) => level * 150;
  const xpInCurrentLevel = (xp, level) => xp - (level - 1) * 150;

  return (
    <AppContext.Provider
      value={{
        state,
        updateState,
        addXP,
        completeTopic,
        startTopic,
        unlockAchievement,
        markGuideSeen,
        isLevelUnlocked,
        topicLevelsDone,
        xpToNextLevel,
        xpInCurrentLevel,
        // consumables
        buyItem,
        consumeXPBoost,
        useHintToken,
        // streak repair
        repairStreak,
        dismissStreakRepair,
        // titles
        buyTitle,
        setActiveTitle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
