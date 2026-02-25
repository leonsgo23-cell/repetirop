import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

const defaultState = {
  language: null,           // 'ru' | 'lv'
  studentName: '',
  grade: null,              // 1–12
  xp: 0,
  level: 1,
  streak: 0,
  lastLoginDate: null,
  completedTopics: [],      // ['math_numbers_1_20_1', ...]
  startedTopics: [],        // for weak-spot tracking
  achievements: [],
  totalSessions: 0,
  hasSeenGuide: false,
  // consumables
  streakShields: 0,
  xpBoostCharges: 0,
  hintTokens: 0,
  chatTokens: 0,
  // cosmetics
  boughtTitles: [],
  activeTitle: null,        // title id or null
  boughtThemes: ['default'],
  activeTheme: 'default',
};

export function AppProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem('zephyr-state');
      return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
    } catch {
      return defaultState;
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('zephyr-state', JSON.stringify(state));
  }, [state]);

  // Streak update on load (with shield protection)
  useEffect(() => {
    const today = new Date().toDateString();
    if (state.lastLoginDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const twoDaysAgo = new Date(Date.now() - 172800000).toDateString();
      setState((prev) => {
        if (prev.lastLoginDate === today) return prev;
        const missedOneDay = prev.lastLoginDate === twoDaysAgo;
        const hasShield = (prev.streakShields || 0) > 0;
        let newStreak;
        let consumeShield = false;
        if (prev.lastLoginDate === yesterday) {
          newStreak = prev.streak + 1;
        } else if (missedOneDay && hasShield) {
          newStreak = prev.streak + 1;
          consumeShield = true;
        } else {
          newStreak = 1;
        }
        return {
          ...prev,
          lastLoginDate: today,
          streak: newStreak,
          streakShields: consumeShield ? prev.streakShields - 1 : prev.streakShields,
        };
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateState = (updates) => setState((prev) => ({ ...prev, ...updates }));

  const addXP = (amount) => {
    setState((prev) => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 150) + 1;
      return { ...prev, xp: newXP, level: newLevel };
    });
  };

  const completeTopic = (subject, topicId, level) => {
    const key = `${subject}_${topicId}_${level}`;
    setState((prev) => {
      if (prev.completedTopics.includes(key)) return prev;
      const newCompleted = [...prev.completedTopics, key];
      const newAchievements = [...prev.achievements];
      if (!newAchievements.includes('first_lesson')) newAchievements.push('first_lesson');
      const allTopicIds = new Set(newCompleted.map((k) => k.split('_').slice(0, -1).join('_')));
      const fullDone = [...allTopicIds].filter((tid) =>
        [1, 2, 3, 4].every((l) => newCompleted.includes(`${tid}_${l}`))
      );
      const mathFull = fullDone.filter((k) => k.startsWith('math_')).length;
      const engFull  = fullDone.filter((k) => k.startsWith('english_')).length;
      const lvFull   = fullDone.filter((k) => k.startsWith('latvian_')).length;
      if (mathFull >= 3 && !newAchievements.includes('math_explorer')) newAchievements.push('math_explorer');
      if (engFull  >= 3 && !newAchievements.includes('english_explorer')) newAchievements.push('english_explorer');
      if (lvFull   >= 3 && !newAchievements.includes('latvian_explorer')) newAchievements.push('latvian_explorer');
      return { ...prev, completedTopics: newCompleted, achievements: newAchievements };
    });
  };

  const isLevelUnlocked = (subject, topicId, level) => {
    if (level === 1) return true;
    return state.completedTopics.includes(`${subject}_${topicId}_${level - 1}`);
  };

  const topicLevelsDone = (subject, topicId) =>
    [1, 2, 3, 4].filter((l) =>
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
    const costs = { streak_shield: 100, xp_boost: 75, hint_token: 40, chat_token: 30 };
    const cost = costs[itemId];
    if (!cost) return;
    setState((prev) => {
      if (prev.xp < cost) return prev;
      const newXp = prev.xp - cost;
      const updates = { xp: newXp, level: Math.max(1, Math.floor(newXp / 150) + 1) };
      if (itemId === 'streak_shield') updates.streakShields = (prev.streakShields || 0) + 1;
      if (itemId === 'xp_boost')      updates.xpBoostCharges = (prev.xpBoostCharges || 0) + 1;
      if (itemId === 'hint_token')    updates.hintTokens = (prev.hintTokens || 0) + 1;
      if (itemId === 'chat_token')    updates.chatTokens = (prev.chatTokens || 0) + 1;
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

  const useChatToken = () => {
    setState((prev) => ({
      ...prev,
      chatTokens: Math.max(0, (prev.chatTokens || 0) - 1),
    }));
  };

  // ── Titles ───────────────────────────────────────────────────────────────────

  const buyTitle = (id, cost) => {
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

  // ── Themes ───────────────────────────────────────────────────────────────────

  const buyTheme = (id, cost) => {
    setState((prev) => {
      if (cost > 0 && prev.xp < cost) return prev;
      if ((prev.boughtThemes || ['default']).includes(id)) return prev;
      const newXp = cost > 0 ? prev.xp - cost : prev.xp;
      return {
        ...prev,
        xp: newXp,
        level: cost > 0 ? Math.max(1, Math.floor(newXp / 150) + 1) : prev.level,
        boughtThemes: [...(prev.boughtThemes || ['default']), id],
      };
    });
  };

  const setActiveTheme = (id) => {
    setState((prev) => ({ ...prev, activeTheme: id }));
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
        useChatToken,
        // titles
        buyTitle,
        setActiveTitle,
        // themes
        buyTheme,
        setActiveTheme,
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
