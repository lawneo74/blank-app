/* Code Quest — the level map / progress screen. */
(function (global) {
  function guideMapMessage() {
    const state = global.CodeQuestProgress.getState();
    if (state.completedLevels.length === 0) {
      return [
        "Welcome to Code Quest! I'm Fenn, and I'll guide you through every island. 🦊",
        "Tap Hello Island to begin your very first Python adventure!",
      ];
    }
    if (state.completedLevels.length === global.CodeQuestProgress.TOTAL_LEVELS) {
      return [
        "WOW. You completed every island — you're a real Python coder now! 🎉🐍",
        "Feel free to revisit any island to play with your code again.",
      ];
    }
    return [
      `Great progress! You've completed ${state.completedLevels.length} of ${global.CodeQuestProgress.TOTAL_LEVELS} islands. 🌟`,
      "Ready for the next one?",
    ];
  }

  function buildGuide(lines) {
    const tpl = document.getElementById("guide-bubble-template");
    const node = tpl.content.cloneNode(true);
    const bubble = node.querySelector(".guide-bubble");
    lines.forEach((line) => {
      const p = document.createElement("p");
      p.textContent = line;
      bubble.appendChild(p);
    });
    return node;
  }

  function render(container, { onSelectLevel }) {
    const Progress = global.CodeQuestProgress;
    const lessons = global.CodeQuestLessons;

    container.innerHTML = "";

    const intro = document.createElement("div");
    intro.className = "map-intro";
    intro.innerHTML = "<h1>🗺️ Your Quest Map</h1><p>Tap an island to start (or continue!) your adventure.</p>";
    container.appendChild(intro);

    container.appendChild(buildGuide(guideMapMessage()));

    const track = document.createElement("div");
    track.className = "progress-track";
    const fill = document.createElement("div");
    fill.className = "progress-fill";
    fill.style.width = Progress.percentComplete() + "%";
    track.appendChild(fill);
    container.appendChild(track);

    const grid = document.createElement("div");
    grid.className = "island-path";

    lessons.forEach((lesson) => {
      const unlocked = Progress.isLevelUnlocked(lesson.id);
      const completed = Progress.isLevelCompleted(lesson.id);
      const isCurrent = unlocked && !completed;

      const card = document.createElement("button");
      card.type = "button";
      card.className =
        "island-card" +
        (unlocked ? "" : " locked") +
        (completed ? " completed" : "") +
        (isCurrent ? " current" : "");
      card.setAttribute("aria-disabled", unlocked ? "false" : "true");

      const statusIcon = completed ? '<div class="island-check">✅</div>' : !unlocked ? '<div class="island-lock">🔒</div>' : "";

      card.innerHTML = `
        <div class="island-number">${lesson.id}</div>
        <div class="island-emoji">${lesson.emoji}</div>
        <div class="island-title">${lesson.title}</div>
        <div class="island-sub">${lesson.islandName}</div>
        ${statusIcon}
      `;

      if (unlocked) {
        card.addEventListener("click", () => onSelectLevel(lesson.id));
      } else {
        card.disabled = true;
      }

      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  global.CodeQuestMapView = { render, buildGuide };
})(window);
