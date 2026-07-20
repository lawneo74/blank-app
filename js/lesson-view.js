/* Code Quest — renders a single lesson: explanation, worked example,
   hands-on challenge (real Pyodide editor + Run), and friendly feedback. */
(function (global) {
    let turtleShimSourcePromise = null;
    function getTurtleShimSource() {
        if (!turtleShimSourcePromise) {
            // A host page that can't serve relative files (e.g. the Streamlit
            // wrapper) embeds the shim source as a global instead.
            turtleShimSourcePromise = global.CODEQUEST_TURTLE_SHIM
                ? Promise.resolve(global.CODEQUEST_TURTLE_SHIM)
                : fetch("python/turtle_shim.py").then((res) => res.text());
        }
        return turtleShimSourcePromise;
    }

    function createCodeBlock({ initialCode, isCapstone, buttonLabel, onAfterRun }) {
        const wrap = document.createElement("div");

        const editorWrap = document.createElement("div");
        editorWrap.className = "editor-wrap";
        const textarea = document.createElement("textarea");
        editorWrap.appendChild(textarea);
        wrap.appendChild(editorWrap);

        const runRow = document.createElement("div");
        runRow.className = "run-row";
        const runBtn = document.createElement("button");
        runBtn.type = "button";
        runBtn.className = "big-button primary";
        const defaultLabel = buttonLabel || "▶ Run";
        runBtn.textContent = defaultLabel;
        runRow.appendChild(runBtn);
        wrap.appendChild(runRow);

        const outputLabel = document.createElement("div");
        outputLabel.className = "output-label";
        outputLabel.textContent = "🖥️ Output";
        wrap.appendChild(outputLabel);

        const output = document.createElement("div");
        output.className = "output-panel empty";
        wrap.appendChild(output);

        const cm = CodeMirror.fromTextArea(textarea, {
            value: initialCode,
            mode: "python",
            theme: "dracula",
            lineNumbers: true,
            indentUnit: 4,
            tabSize: 4,
            matchBrackets: true,
            viewportMargin: Infinity,
        });
        cm.setValue(initialCode);

        async function run() {
            runBtn.disabled = true;
            runBtn.innerHTML = '<span class="spinner"></span> Running...';
            output.className = "output-panel";
            output.textContent = "";
            const code = cm.getValue();
            let result;
            try {
                if (isCapstone) {
                    const setup = await getTurtleShimSource();
                    result = await global.CodeQuestPyodide.runWithSetup(code, setup);
                } else {
                    result = await global.CodeQuestPyodide.run(code);
                }
            } finally {
                runBtn.disabled = false;
                runBtn.textContent = defaultLabel;
            }

            if (result.success) {
                if (result.stdout) {
                    output.className = "output-panel";
                    output.textContent = result.stdout;
                } else {
                    output.className = "output-panel success-note";
                    output.textContent = "✅ Your code ran with no errors! (It didn't print anything to show here.)";
                }
            } else {
                output.className = "output-panel friendly-error";
                output.textContent = "🤔 " + result.friendlyError;
            }

            if (onAfterRun) onAfterRun(result, code);
            return result;
        }

        runBtn.addEventListener("click", run);

        return { element: wrap, run, cm };
    }

    function buildHintWidget(hints) {
        const section = document.createElement("div");
        const hintBtn = document.createElement("button");
        hintBtn.type = "button";
        hintBtn.className = "big-button";
        hintBtn.textContent = "💡 Need a hint?";
        const hintBox = document.createElement("div");
        hintBox.className = "hint-box hidden";
        let hintIndex = 0;

        hintBtn.addEventListener("click", () => {
            hintBox.classList.remove("hidden");
            if (hintIndex < hints.length) {
                const p = document.createElement("p");
                p.textContent = "💡 " + hints[hintIndex];
                hintBox.appendChild(p);
                hintIndex++;
            }
            if (hintIndex >= hints.length) {
                hintBtn.disabled = true;
                hintBtn.textContent = "That's all the hints I've got!";
            }
        });

        section.appendChild(hintBtn);
        section.appendChild(hintBox);
        return section;
    }

    function render(container, levelId, callbacks) {
        const lesson = global.CodeQuestLessons.find((l) => l.id === levelId);
        const Progress = global.CodeQuestProgress;
        if (!lesson) {
            callbacks.onBack();
            return;
        }

        container.innerHTML = "";

        const header = document.createElement("div");
        header.className = "lesson-header";
        const backBtn = document.createElement("button");
        backBtn.type = "button";
        backBtn.className = "back-button";
        backBtn.textContent = "⬅ Map";
        backBtn.addEventListener("click", callbacks.onBack);
        const title = document.createElement("h1");
        title.className = "lesson-title";
        title.textContent = `${lesson.emoji} ${lesson.title}`;
        const tag = document.createElement("span");
        tag.className = "lesson-island-tag";
        tag.textContent = lesson.islandName;
        header.appendChild(backBtn);
        header.appendChild(title);
        header.appendChild(tag);
        container.appendChild(header);

        container.appendChild(global.CodeQuestMapView.buildGuide(lesson.guideIntro));

        // ---- Section 1: explanation ----
        const explainSection = document.createElement("section");
        explainSection.className = "lesson-section";
        const explainHeading = document.createElement("h2");
        explainHeading.textContent = "💡 " + lesson.explanation.heading;
        const analogyBox = document.createElement("div");
        analogyBox.className = "analogy-box";
        analogyBox.textContent = lesson.explanation.analogy;
        const pointsList = document.createElement("ul");
        lesson.explanation.points.forEach((point) => {
            const li = document.createElement("li");
            li.textContent = point;
            pointsList.appendChild(li);
        });
        explainSection.appendChild(explainHeading);
        explainSection.appendChild(analogyBox);
        explainSection.appendChild(pointsList);
        container.appendChild(explainSection);

        if (lesson.isCapstone) {
            const canvasSection = document.createElement("section");
            canvasSection.className = "lesson-section";
            const canvasHeading = document.createElement("h2");
            canvasHeading.textContent = "🐢 Turtle's Canvas";
            const canvasNote = document.createElement("p");
            canvasNote.textContent = "This is shared by both boxes below — press Run in either one and watch it draw here!";
            const turtleWrap = document.createElement("div");
            turtleWrap.className = "turtle-canvas-wrap";
            const canvasStack = document.createElement("div");
            canvasStack.style.position = "relative";
            canvasStack.innerHTML =
                '<canvas id="turtle-canvas" width="420" height="420"></canvas>' +
                '<canvas id="turtle-canvas-overlay" width="420" height="420" style="position:absolute;top:0;left:0;pointer-events:none;"></canvas>';
            turtleWrap.appendChild(canvasStack);
            canvasSection.appendChild(canvasHeading);
            canvasSection.appendChild(canvasNote);
            canvasSection.appendChild(turtleWrap);
            container.appendChild(canvasSection);
        }

        // ---- Section 2: worked example ----
        const exampleSection = document.createElement("section");
        exampleSection.className = "lesson-section";
        const exampleHeading = document.createElement("h2");
        exampleHeading.textContent = "👀 See It In Action";
        const exampleNote = document.createElement("p");
        exampleNote.textContent = lesson.example.note;
        exampleSection.appendChild(exampleHeading);
        exampleSection.appendChild(exampleNote);
        const exampleBlock = createCodeBlock({
            initialCode: lesson.example.code,
            isCapstone: lesson.isCapstone,
            buttonLabel: "▶ Run Example",
        });
        exampleSection.appendChild(exampleBlock.element);
        container.appendChild(exampleSection);

        // ---- Section 3: challenge ----
        const challengeSection = document.createElement("section");
        challengeSection.className = "lesson-section";
        const challengeHeading = document.createElement("h2");
        challengeHeading.textContent = "🎯 Your Challenge";
        const challengeInstructions = document.createElement("p");
        challengeInstructions.textContent = lesson.challenge.instructions;
        challengeSection.appendChild(challengeHeading);
        challengeSection.appendChild(challengeInstructions);

        const continueBtn = document.createElement("button");
        continueBtn.type = "button";
        continueBtn.className = "big-button hidden";
        continueBtn.style.marginTop = "10px";
        continueBtn.textContent = "That's OK — Continue Anyway ➜";
        continueBtn.addEventListener("click", () => completeAndCelebrate());

        const tipNote = document.createElement("div");
        tipNote.className = "hint-box hidden";
        tipNote.style.marginTop = "10px";

        const challengeBlock = createCodeBlock({
            initialCode: lesson.challenge.starterCode,
            isCapstone: lesson.isCapstone,
            buttonLabel: "▶ Run My Code",
            onAfterRun: (result) => {
                tipNote.classList.add("hidden");
                if (!result.success) {
                    continueBtn.classList.add("hidden");
                    return;
                }
                const checked = lesson.challenge.check ? lesson.challenge.check(result) : { pass: true };
                if (checked.pass) {
                    // Let the learner actually see their output before the
                    // celebration overlay takes over the whole screen. Skip it
                    // if they've already navigated away from this lesson.
                    setTimeout(() => {
                        if (continueBtn.isConnected) completeAndCelebrate();
                    }, 1100);
                } else {
                    continueBtn.classList.remove("hidden");
                    if (checked.tip) {
                        tipNote.classList.remove("hidden");
                        tipNote.textContent = "🔎 " + checked.tip;
                    }
                }
            },
        });
        challengeSection.appendChild(challengeBlock.element);
        challengeSection.appendChild(tipNote);
        challengeSection.appendChild(buildHintWidget(lesson.challenge.hints || []));
        challengeSection.appendChild(continueBtn);

        if (Progress.isLevelCompleted(lesson.id)) {
            const doneNote = document.createElement("div");
            doneNote.className = "output-panel success-note";
            doneNote.style.marginTop = "10px";
            doneNote.textContent = "🏅 You already earned this badge! Feel free to play with the code some more.";
            challengeSection.appendChild(doneNote);
        }

        container.appendChild(challengeSection);

        // CodeMirror measures itself using layout, so it must be attached to the
        // live document before refresh() — otherwise it renders blank/collapsed.
        exampleBlock.cm.refresh();
        challengeBlock.cm.refresh();

        function completeAndCelebrate() {
            const { alreadyDone, pointsAwarded } = Progress.completeLevel(lesson.id);
            callbacks.onLevelComplete(lesson, { alreadyDone, pointsAwarded });
        }
    }

    global.CodeQuestLessonView = { render };
})(window);
