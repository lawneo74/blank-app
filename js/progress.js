/* Code Quest — localStorage-backed progress tracking. No accounts, no network. */
(function (global) {
  const STORAGE_KEY = "codequest.progress.v1";
  const TOTAL_LEVELS = 8;
  const POINTS_PER_LEVEL = 10;

  function defaultState() {
    return {
      completedLevels: [],   // array of level ids, e.g. "level-1"
      points: 0,
      badges: [],            // array of badge ids (same as level ids)
      currentLevel: 1,       // highest unlocked level number
      lastPlayed: null,
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      const base = defaultState();
      return Object.assign(base, parsed);
    } catch (e) {
      console.warn("Progress: could not read saved game, starting fresh.", e);
      return defaultState();
    }
  }

  function save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Progress: could not save game (storage may be full/disabled).", e);
    }
  }

  let state = load();

  const Progress = {
    TOTAL_LEVELS,

    getState() {
      return state;
    },

    isLevelUnlocked(levelNumber) {
      if (levelNumber === 1) return true;
      return state.completedLevels.includes(levelId(levelNumber - 1));
    },

    isLevelCompleted(levelNumber) {
      return state.completedLevels.includes(levelId(levelNumber));
    },

    completeLevel(levelNumber) {
      const id = levelId(levelNumber);
      const alreadyDone = state.completedLevels.includes(id);
      if (!alreadyDone) {
        state.completedLevels.push(id);
        state.points += POINTS_PER_LEVEL;
        if (!state.badges.includes(id)) state.badges.push(id);
        state.currentLevel = Math.max(state.currentLevel, Math.min(levelNumber + 1, TOTAL_LEVELS));
      }
      state.lastPlayed = new Date().toISOString();
      save(state);
      return { alreadyDone, pointsAwarded: alreadyDone ? 0 : POINTS_PER_LEVEL };
    },

    resetAll() {
      state = defaultState();
      save(state);
    },

    percentComplete() {
      return Math.round((state.completedLevels.length / TOTAL_LEVELS) * 100);
    },
  };

  function levelId(n) {
    return "level-" + n;
  }

  Progress.levelId = levelId;

  global.CodeQuestProgress = Progress;
})(window);
