/* Code Quest — app entry point: routing between the map and lesson screens,
   top bar stats, and the level-complete celebration. */
(function () {
  const Progress = window.CodeQuestProgress;
  const viewRoot = document.getElementById("view-root");
  const pointsValue = document.getElementById("points-value");
  const badgesValue = document.getElementById("badges-value");
  const mapButton = document.getElementById("map-button");

  const overlay = document.getElementById("celebration-overlay");
  const celebrationBadgeEmoji = document.getElementById("celebration-badge-emoji");
  const celebrationTitle = document.getElementById("celebration-title");
  const celebrationMessage = document.getElementById("celebration-message");
  const celebrationPoints = document.getElementById("celebration-points");
  const celebrationContinueBtn = document.getElementById("celebration-continue");
  const celebrationMapBtn = document.getElementById("celebration-map");

  function updateStats() {
    const state = Progress.getState();
    pointsValue.textContent = state.points;
    badgesValue.textContent = state.badges.length;
  }

  function goToMap(pushHash) {
    if (pushHash !== false) location.hash = "#map";
    window.CodeQuestMapView.render(viewRoot, { onSelectLevel: goToLevel });
    updateStats();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToLevel(levelId, pushHash) {
    if (!Progress.isLevelUnlocked(levelId)) {
      goToMap();
      return;
    }
    if (pushHash !== false) location.hash = "#level-" + levelId;
    window.CodeQuestLessonView.render(viewRoot, levelId, {
      onBack: () => goToMap(),
      onLevelComplete: (lesson, info) => showCelebration(lesson, info),
    });
    updateStats();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showCelebration(lesson, info) {
    updateStats();
    const isLast = lesson.id >= Progress.TOTAL_LEVELS;
    celebrationBadgeEmoji.textContent = lesson.emoji;
    celebrationTitle.textContent = info.alreadyDone ? "Nice replay!" : "Level Complete!";
    celebrationMessage.textContent = isLast
      ? "You finished the whole quest! You're officially a Python coder! 🐍🎉"
      : `You earned the ${lesson.islandName} badge!`;
    celebrationPoints.textContent = info.alreadyDone ? "Badge already in your collection 🏅" : `+${info.pointsAwarded} ⭐`;
    celebrationContinueBtn.classList.toggle("hidden", isLast);
    celebrationContinueBtn.onclick = () => {
      overlay.classList.add("hidden");
      goToLevel(Math.min(lesson.id + 1, Progress.TOTAL_LEVELS));
    };
    celebrationMapBtn.onclick = () => {
      overlay.classList.add("hidden");
      goToMap();
    };
    overlay.classList.remove("hidden");
    window.CodeQuestConfetti.burst();
  }

  mapButton.addEventListener("click", () => goToMap());

  function routeFromHash() {
    const hash = location.hash.replace("#", "");
    const match = hash.match(/^level-(\d+)$/);
    if (match) {
      const levelId = parseInt(match[1], 10);
      if (levelId >= 1 && levelId <= Progress.TOTAL_LEVELS && Progress.isLevelUnlocked(levelId)) {
        goToLevel(levelId, false);
        return;
      }
    }
    goToMap(false);
  }

  window.addEventListener("hashchange", routeFromHash);

  // Kick off the Python engine load in the background right away so it's
  // likely ready by the time a learner presses Run for the first time.
  window.CodeQuestPyodide.init().catch((err) => {
    console.error("Pyodide failed to load", err);
  });

  routeFromHash();
})();
