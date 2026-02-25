import { createContext, useContext, useState, useEffect } from 'react';
import { CHALLENGE_COST } from '../data/shop';

const AppContext = createContext(null);

const defaultState = {
  language: null,           // 'ru' | 'lv'
  studentName: '',
  grade: null,              // 1–12
  xp: 0,
  level: 1,
  streak: 0,
  lastLoginDate: null,
  completedTopics: [],      // ['math_numbers_1_20', ...]
  startedTopics: [],        // topics entered at least once (for weak-spot tracking)
  achievements: [],         // ['first_lesson', ...]
  totalSessions: 0,
  hasSeenGuide: false,
  // consumables
  streakShields: 0,         // number of streak shield charges
  xpBoostCharges: 0,        // number of XP ×2 boost charges
  // challenges
  unlockedChallenges: [],   // ['math_multiplication_speed', 'math_multiplication_boss', ...]
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

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('zephyr-state', JSON.stringify(state));
  }, [state]);

  // Update streak on load (with shield protection)
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

  // key format: `${subject}_${topicId}_${level}`  e.g. "math_multiplication_2"
  const completeTopic = (subject, topicId, level) => {
    const key = `${subject}_${topicId}_${level}`;
    setState((prev) => {
      if (prev.completedTopics.includes(key)) return prev;
      const newCompleted = [...prev.completedTopics, key];
      const newAchievements = [...prev.achievements];

      // First lesson achievement (any level 1)
      if (!newAchievements.includes('first_lesson')) {
        newAchievements.push('first_lesson');
      }
      // Count fully completed topics (all 4 levels done)
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

  // Check if a specific level is unlocked (level 1 always; level N requires N-1 done)
  const isLevelUnlocked = (subject, topicId, level) => {
    if (level === 1) return true;
    return state.completedTopics.includes(`${subject}_${topicId}_${level - 1}`);
  };

  // How many levels of a topic are completed (0–4)
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

  // ── Shop / consumables ──────────────────────────────────────────────────────

  const buyItem = (itemId) => {
    const costs = { streak_shield: 100, xp_boost: 75 };
    const cost = costs[itemId];
    if (!cost) return;
    setState((prev) => {
      if (prev.xp < cost) return prev;
      const updates = { xp: prev.xp - cost };
      if (itemId === 'streak_shield') updates.streakShields = (prev.streakShields || 0) + 1;
      if (itemId === 'xp_boost') updates.xpBoostCharges = (prev.xpBoostCharges || 0) + 1;
      return { ...prev, ...updates };
    });
  };

  const consumeXPBoost = () => {
    setState((prev) => ({
      ...prev,
      xpBoostCharges: Math.max(0, (prev.xpBoostCharges || 0) - 1),
    }));
  };

  // ── Challenges ─────────────────────────────────────────────────────────────

  const isChallengeUnlocked = (subjectId, topicId, type) => {
    const key = `${subjectId}_${topicId}_${type}`;
    return (state.unlockedChallenges || []).includes(key);
  };

  const unlockChallenge = (subjectId, topicId, type) => {
    const key = `${subjectId}_${topicId}_${type}`;
    setState((prev) => {
      if ((prev.unlockedChallenges || []).includes(key)) return prev;
      if (prev.xp < CHALLENGE_COST) return prev;
      return {
        ...prev,
        xp: prev.xp - CHALLENGE_COST,
        unlockedChallenges: [...(prev.unlockedChallenges || []), key],
      };
    });
  };

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
        // shop
        buyItem,
        consumeXPBoost,
        // challenges
        isChallengeUnlocked,
        unlockChallenge,
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
