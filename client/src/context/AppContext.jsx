import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

const defaultState = {
  language: null,        // 'ru' | 'lv'
  studentName: '',
  grade: null,           // 1–12
  xp: 0,
  level: 1,
  streak: 0,
  lastLoginDate: null,
  completedTopics: [],   // ['math_numbers_1_20', ...]
  achievements: [],      // ['first_lesson', ...]
  totalSessions: 0,
  hasSeenGuide: false,   // показывать инструкцию при первом входе
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

  // Update streak on load
  useEffect(() => {
    const today = new Date().toDateString();
    if (state.lastLoginDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      setState((prev) => ({
        ...prev,
        lastLoginDate: today,
        streak: prev.lastLoginDate === yesterday ? prev.streak + 1 : 1,
      }));
    }
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

  const xpToNextLevel = (level) => level * 150;
  const xpInCurrentLevel = (xp, level) => xp - (level - 1) * 150;

  return (
    <AppContext.Provider
      value={{
        state,
        updateState,
        addXP,
        completeTopic,
        unlockAchievement,
        markGuideSeen,
        isLevelUnlocked,
        topicLevelsDone,
        xpToNextLevel,
        xpInCurrentLevel,
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
