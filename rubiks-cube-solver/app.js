(function () {
    const locale = window.CUBE_TOOL_LOCALE === "zh" ? "zh" : "en";

    const translations = {
        en: {
            langLabel: "English",
            otherLangLabel: "中文",
            otherLangHref: "zh/index.html",
            heroKicker: "3x3 Rubik's Cube Solver",
            heroTitle: "Paint any scrambled cube, solve it, and watch every turn.",
            heroSubtitle: "Enter your unsolved 3x3 cube with clickable stickers or a 54-character facelet string. The tool validates the cube, finds a solution, and shows both full playback and one-move step animations.",
            heroPoint1Title: "Manual cube input",
            heroPoint1Body: "Click stickers to match your real cube. Center stickers stay locked to preserve face identity.",
            heroPoint2Title: "Real solver engine",
            heroPoint2Body: "Uses a browser-side 3x3 solving algorithm, so the solve happens directly on the page.",
            heroPoint3Title: "Step-by-step playback",
            heroPoint3Body: "Read the moves, preview each turn, and replay the whole solve with interactive controls.",
            heroBadge1Value: "54",
            heroBadge1Label: "stickers validated",
            heroBadge2Value: "3D",
            heroBadge2Label: "animated playback",
            heroBadge3Value: "URFDLB",
            heroBadge3Label: "facelet order supported",
            heroBadge4Value: "22",
            heroBadge4Label: "moves or fewer typical solve",
            heroNote: "Tip: if this is your first solve on the page, the solver may take a few seconds to warm up before it answers.",
            statusTitle: "Status",
            readyTitle: "Ready to solve",
            readyBody: "Paint your cube or paste a facelet string, then click Solve Cube.",
            updatedTitle: "Cube updated",
            updatedBody: "The cube state changed. Solve again to refresh the instructions.",
            warmupTitle: "Warming up the solver",
            warmupBody: "Preparing the 3x3 solving tables. The first solve is slower than the next ones.",
            solvingTitle: "Solving cube",
            solvingBody: "Validating your state and computing a move sequence.",
            solvedTitle: "Solution ready",
            solvedBody: "Review the move list, replay the full solve, or inspect one turn at a time.",
            paletteTitle: "Choose a color, then click stickers",
            inputTitle: "Cube editor",
            inputCopy: "Centers are fixed. Every non-center sticker must be painted so the final state has exactly nine stickers of each face color.",
            faceletTitle: "Facelet string",
            faceletHelp: "Accepted order is <code>U R F D L B</code>, nine stickers per face, for a total of 54 characters. Example solved string: <code>UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB</code>.",
            solveButton: "Solve Cube",
            solvedButton: "Use Solved Cube",
            demoButton: "Load Demo Scramble",
            loadStringButton: "Load String",
            copyStringButton: "Copy String",
            clearSolutionButton: "Reset Results",
            summaryTitle: "Solution summary",
            solutionLength: "Moves",
            currentStepLabel: "Current step",
            remainingLabel: "Remaining",
            notationLabel: "Notation",
            fullPlaybackTitle: "Full solution playback",
            fullPlaybackCopy: "Use the embedded controls to replay the full solve from your scrambled state to the solved cube.",
            stepPlaybackTitle: "Single-step animation",
            stepPlaybackCopy: "Click a move below to animate just that turn from the correct cube state.",
            afterStepTitle: "Cube state after the selected move",
            stepPlaceholder: "Solve the cube to see the step list and previews.",
            stepOf: "Step",
            remainingMovesSuffix: "moves left",
            prevStep: "Previous Step",
            nextStep: "Next Step",
            copySolution: "Copy Solution",
            howToTitle: "How to use this solver",
            howTo1: "Match the sticker colors to your physical 3x3 cube. The fixed centers define which side is U, R, F, D, L, and B.",
            howTo2: "If you already have a facelet string, paste it into the string box and click Load String.",
            howTo3: "Click Solve Cube. The tool checks color counts and cube validity before solving.",
            howTo4: "Use the full playback to see the entire solve or click individual moves for turn-by-turn animation.",
            notationTitle: "Notation quick guide",
            notation1: "<code>R</code>, <code>U</code>, <code>F</code>, <code>L</code>, <code>D</code>, <code>B</code> mean clockwise quarter-turns of those faces.",
            notation2: "A prime mark like <code>R'</code> means a counterclockwise quarter-turn.",
            notation3: "A <code>2</code> suffix like <code>U2</code> means a 180-degree turn.",
            errorLibrary: "The cube libraries did not load. Refresh the page and try again.",
            errorLength: "The facelet string must contain exactly 54 characters after removing spaces.",
            errorChars: "Use only the face letters U, R, F, D, L, and B in the facelet string.",
            errorCounts: "Each face letter must appear exactly 9 times.",
            errorCenters: "The six center stickers must stay U, R, F, D, L, and B.",
            errorInvalidCube: "That cube state is not solvable. Check the sticker colors and orientation.",
            errorClipboard: "Clipboard access was blocked. You can still copy the text manually.",
            copiedString: "Facelet string copied to the clipboard.",
            copiedSolution: "Solution copied to the clipboard.",
            solveTimeLabel: "Solve time",
            moveFaceU: "Up",
            moveFaceR: "Right",
            moveFaceF: "Front",
            moveFaceD: "Down",
            moveFaceL: "Left",
            moveFaceB: "Back",
            moveClockwise: "clockwise quarter-turn",
            moveCounter: "counterclockwise quarter-turn",
            moveDouble: "180-degree turn"
        },
        zh: {
            langLabel: "中文",
            otherLangLabel: "English",
            otherLangHref: "../index.html",
            heroKicker: "三阶魔方求解器",
            heroTitle: "把打乱的魔方涂出来，直接求解，还能逐步看动画。",
            heroSubtitle: "支持点击贴纸录入未复原的 3x3 魔方，也支持粘贴 54 位面片字符串。页面会先校验状态，再给出解法，并提供整段播放和单步动画。",
            heroPoint1Title: "手动录入魔方",
            heroPoint1Body: "先选颜色，再点击贴纸。中心块会锁定，保证每个面的身份不变。",
            heroPoint2Title: "浏览器内求解",
            heroPoint2Body: "使用浏览器端 3x3 求解算法，不需要安装，不需要上传图片。",
            heroPoint3Title: "逐步动画讲解",
            heroPoint3Body: "既能看完整复原过程，也能点每一步单独播放动作。",
            heroBadge1Value: "54",
            heroBadge1Label: "个贴纸校验",
            heroBadge2Value: "3D",
            heroBadge2Label: "动画回放",
            heroBadge3Value: "URFDLB",
            heroBadge3Label: "面片顺序支持",
            heroBadge4Value: "22",
            heroBadge4Label: "步内常见解",
            heroNote: "提示：第一次求解时需要先预热求解器，所以会比后续求解慢一点。",
            statusTitle: "状态",
            readyTitle: "可以开始求解",
            readyBody: "先录入魔方或粘贴面片字符串，然后点击“开始求解”。",
            updatedTitle: "魔方状态已更新",
            updatedBody: "你修改了贴纸颜色，需要重新求解才能刷新步骤。",
            warmupTitle: "正在预热求解器",
            warmupBody: "正在准备三阶魔方求解表，第一次求解会稍慢一些。",
            solvingTitle: "正在求解",
            solvingBody: "正在校验魔方状态并计算解法步骤。",
            solvedTitle: "解法已生成",
            solvedBody: "可以查看步骤列表、播放完整复原过程，或者逐步看每一个动作。",
            paletteTitle: "先选颜色，再点击贴纸",
            inputTitle: "魔方录入区",
            inputCopy: "中心块固定不变。所有非中心贴纸都要填满，最终每种颜色必须正好出现 9 次。",
            faceletTitle: "面片字符串",
            faceletHelp: "支持 <code>U R F D L B</code> 顺序输入，每个面 9 个字符，总共 54 个字符。已复原示例：<code>UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB</code>。",
            solveButton: "开始求解",
            solvedButton: "切换为已复原",
            demoButton: "加载演示打乱",
            loadStringButton: "导入字符串",
            copyStringButton: "复制字符串",
            clearSolutionButton: "清空结果",
            summaryTitle: "解法摘要",
            solutionLength: "总步数",
            currentStepLabel: "当前步骤",
            remainingLabel: "剩余步骤",
            notationLabel: "符号",
            fullPlaybackTitle: "完整复原动画",
            fullPlaybackCopy: "使用内置控制条回放整个复原过程，从当前打乱状态一直到复原完成。",
            stepPlaybackTitle: "单步动作动画",
            stepPlaybackCopy: "点击下面任意一步，只播放那一个动作，而且会从正确的魔方状态开始。",
            afterStepTitle: "所选动作执行后的魔方状态",
            stepPlaceholder: "先完成求解，步骤列表和预览才会显示。",
            stepOf: "第",
            remainingMovesSuffix: "步剩余",
            prevStep: "上一步",
            nextStep: "下一步",
            copySolution: "复制解法",
            howToTitle: "使用方法",
            howTo1: "按你的真实三阶魔方给贴纸上色。固定中心块分别代表 U、R、F、D、L、B 六个面。",
            howTo2: "如果你已经有面片字符串，直接粘贴到输入框里，再点“导入字符串”。",
            howTo3: "点击“开始求解”。工具会先检查颜色数量和魔方合法性，再计算解法。",
            howTo4: "完整播放适合看全流程，点单步则适合逐步跟着拧。",
            notationTitle: "符号速查",
            notation1: "<code>R</code>、<code>U</code>、<code>F</code>、<code>L</code>、<code>D</code>、<code>B</code> 表示对应面的顺时针 90 度。",
            notation2: "带撇号如 <code>R'</code> 表示逆时针 90 度。",
            notation3: "带 <code>2</code> 的如 <code>U2</code> 表示转 180 度。",
            errorLibrary: "魔方库加载失败。请刷新页面后重试。",
            errorLength: "去掉空格后，面片字符串必须正好是 54 个字符。",
            errorChars: "面片字符串只能使用 U、R、F、D、L、B 这六个字母。",
            errorCounts: "每个面字母必须正好出现 9 次。",
            errorCenters: "六个中心块必须保持为 U、R、F、D、L、B。",
            errorInvalidCube: "这个魔方状态无法复原。请检查贴纸颜色是否录入正确。",
            errorClipboard: "浏览器不允许访问剪贴板，你也可以手动复制文本。",
            copiedString: "面片字符串已复制。",
            copiedSolution: "解法已复制。",
            solveTimeLabel: "求解耗时",
            moveFaceU: "上面",
            moveFaceR: "右面",
            moveFaceF: "前面",
            moveFaceD: "下面",
            moveFaceL: "左面",
            moveFaceB: "后面",
            moveClockwise: "顺时针四分之一圈",
            moveCounter: "逆时针四分之一圈",
            moveDouble: "旋转 180 度"
        }
    };

    const t = translations[locale];
    const faceOrder = ["U", "R", "F", "D", "L", "B"];
    const solvedState = "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";
    const faceColors = {
        U: "#f8fafc",
        R: "#ef4444",
        F: "#22c55e",
        D: "#facc15",
        L: "#fb923c",
        B: "#3b82f6"
    };
    const faceText = {
        U: "#132238",
        R: "#ffffff",
        F: "#ffffff",
        D: "#132238",
        L: "#ffffff",
        B: "#ffffff"
    };

    let selectedFace = "F";
    let faceletState = solvedState.split("");
    let solverReady = false;
    let solutionMoves = [];
    let stepStates = [];
    let currentStepIndex = 0;

    const root = document.getElementById("app");
    if (!root) {
        return;
    }

    root.innerHTML = `
        <div class="page-shell">
            <div class="lang-switch">
                <a href="${t.otherLangHref}">${t.otherLangLabel}</a>
                <a href="#" class="current">${t.langLabel}</a>
            </div>

            <section class="hero">
                <div class="hero-card">
                    <div class="hero-kicker">${t.heroKicker}</div>
                    <h1>${t.heroTitle}</h1>
                    <p>${t.heroSubtitle}</p>
                    <div class="hero-points">
                        <div class="hero-point">
                            <strong>${t.heroPoint1Title}</strong>
                            <span>${t.heroPoint1Body}</span>
                        </div>
                        <div class="hero-point">
                            <strong>${t.heroPoint2Title}</strong>
                            <span>${t.heroPoint2Body}</span>
                        </div>
                        <div class="hero-point">
                            <strong>${t.heroPoint3Title}</strong>
                            <span>${t.heroPoint3Body}</span>
                        </div>
                    </div>
                </div>
                <aside class="hero-card hero-aside">
                    <div class="hero-badge-grid">
                        <div class="hero-badge">
                            <div class="value">${t.heroBadge1Value}</div>
                            <div class="label">${t.heroBadge1Label}</div>
                        </div>
                        <div class="hero-badge">
                            <div class="value">${t.heroBadge2Value}</div>
                            <div class="label">${t.heroBadge2Label}</div>
                        </div>
                        <div class="hero-badge">
                            <div class="value">${t.heroBadge3Value}</div>
                            <div class="label">${t.heroBadge3Label}</div>
                        </div>
                        <div class="hero-badge">
                            <div class="value">${t.heroBadge4Value}</div>
                            <div class="label">${t.heroBadge4Label}</div>
                        </div>
                    </div>
                    <div class="hero-note">${t.heroNote}</div>
                </aside>
            </section>

            <div class="main-grid">
                <section class="panel">
                    <div id="statusBox" class="status-box info">
                        <div>
                            <strong>${t.readyTitle}</strong>
                            <div>${t.readyBody}</div>
                        </div>
                    </div>

                    <h2>${t.inputTitle}</h2>
                    <div class="panel-copy">${t.inputCopy}</div>

                    <h3>${t.paletteTitle}</h3>
                    <div id="palette" class="palette"></div>

                    <div id="editorNet" class="editor-net"></div>

                    <div class="controls-row">
                        <button id="solveButton" class="button">${t.solveButton}</button>
                        <button id="demoButton" class="button-secondary">${t.demoButton}</button>
                        <button id="solvedButton" class="button-ghost">${t.solvedButton}</button>
                        <button id="clearSolutionButton" class="button-ghost">${t.clearSolutionButton}</button>
                    </div>

                    <h3>${t.faceletTitle}</h3>
                    <textarea id="faceletInput" class="string-box" spellcheck="false"></textarea>
                    <div class="string-help">${t.faceletHelp}</div>
                    <div class="io-actions">
                        <button id="loadStringButton" class="button-ghost">${t.loadStringButton}</button>
                        <button id="copyStringButton" class="button-ghost">${t.copyStringButton}</button>
                    </div>
                </section>

                <section class="panel">
                    <h2>${t.summaryTitle}</h2>
                    <div id="summaryGrid" class="summary-grid">
                        <div class="summary-card">
                            <div class="label">${t.solutionLength}</div>
                            <div id="summaryMoves" class="value">0</div>
                        </div>
                        <div class="summary-card">
                            <div class="label">${t.currentStepLabel}</div>
                            <div id="summaryCurrent" class="value">-</div>
                        </div>
                        <div class="summary-card">
                            <div class="label">${t.remainingLabel}</div>
                            <div id="summaryRemaining" class="value">0</div>
                        </div>
                        <div class="summary-card">
                            <div class="label">${t.solveTimeLabel}</div>
                            <div id="summaryTime" class="value">-</div>
                        </div>
                    </div>

                    <div class="player-stack">
                        <div>
                            <h3>${t.fullPlaybackTitle}</h3>
                            <div class="panel-copy">${t.fullPlaybackCopy}</div>
                            <div id="fullPlayerHost" class="player-host"></div>
                        </div>
                        <div>
                            <div class="step-meta">
                                <div>
                                    <strong>${t.stepPlaybackTitle}</strong>
                                    <span id="stepMetaText">${t.stepPlaceholder}</span>
                                </div>
                                <button id="copySolutionButton" class="button-ghost">${t.copySolution}</button>
                            </div>
                            <div class="panel-copy">${t.stepPlaybackCopy}</div>
                            <div id="stepPlayerHost" class="player-host"></div>
                            <div class="step-controls">
                                <button id="prevStepButton" class="button-ghost" disabled>${t.prevStep}</button>
                                <button id="nextStepButton" class="button-ghost" disabled>${t.nextStep}</button>
                            </div>
                        </div>
                        <div>
                            <h3>${t.afterStepTitle}</h3>
                            <div id="previewNet" class="preview-net"></div>
                        </div>
                    </div>

                    <div id="stepList" class="step-list" aria-live="polite">
                        <div class="placeholder">${t.stepPlaceholder}</div>
                    </div>
                </section>
            </div>

            <section class="info-grid">
                <article class="info-card">
                    <h3>${t.howToTitle}</h3>
                    <ol>
                        <li>${t.howTo1}</li>
                        <li>${t.howTo2}</li>
                        <li>${t.howTo3}</li>
                        <li>${t.howTo4}</li>
                    </ol>
                </article>
                <article class="info-card">
                    <h3>${t.notationTitle}</h3>
                    <ul>
                        <li>${t.notation1}</li>
                        <li>${t.notation2}</li>
                        <li>${t.notation3}</li>
                    </ul>
                </article>
            </section>
        </div>
    `;

    const elements = {
        palette: document.getElementById("palette"),
        editorNet: document.getElementById("editorNet"),
        previewNet: document.getElementById("previewNet"),
        statusBox: document.getElementById("statusBox"),
        faceletInput: document.getElementById("faceletInput"),
        solveButton: document.getElementById("solveButton"),
        demoButton: document.getElementById("demoButton"),
        solvedButton: document.getElementById("solvedButton"),
        clearSolutionButton: document.getElementById("clearSolutionButton"),
        loadStringButton: document.getElementById("loadStringButton"),
        copyStringButton: document.getElementById("copyStringButton"),
        copySolutionButton: document.getElementById("copySolutionButton"),
        fullPlayerHost: document.getElementById("fullPlayerHost"),
        stepPlayerHost: document.getElementById("stepPlayerHost"),
        stepList: document.getElementById("stepList"),
        stepMetaText: document.getElementById("stepMetaText"),
        prevStepButton: document.getElementById("prevStepButton"),
        nextStepButton: document.getElementById("nextStepButton"),
        summaryMoves: document.getElementById("summaryMoves"),
        summaryCurrent: document.getElementById("summaryCurrent"),
        summaryRemaining: document.getElementById("summaryRemaining"),
        summaryTime: document.getElementById("summaryTime")
    };

    elements.faceletInput.value = solvedState;

    buildPalette();
    renderCube(elements.editorNet, faceletState.join(""), false);
    renderCube(elements.previewNet, solvedState, true);
    renderPlaceholderPlayers();

    elements.solveButton.addEventListener("click", solveCube);
    elements.demoButton.addEventListener("click", loadDemoScramble);
    elements.solvedButton.addEventListener("click", () => setCubeState(solvedState, true));
    elements.clearSolutionButton.addEventListener("click", clearSolutionResults);
    elements.loadStringButton.addEventListener("click", loadFromFaceletInput);
    elements.copyStringButton.addEventListener("click", () => copyText(elements.faceletInput.value, t.copiedString));
    elements.copySolutionButton.addEventListener("click", () => {
        if (solutionMoves.length) {
            copyText(solutionMoves.join(" "), t.copiedSolution);
        }
    });
    elements.prevStepButton.addEventListener("click", () => {
        if (currentStepIndex > 0) {
            updateSelectedStep(currentStepIndex - 1);
        }
    });
    elements.nextStepButton.addEventListener("click", () => {
        if (currentStepIndex < solutionMoves.length - 1) {
            updateSelectedStep(currentStepIndex + 1);
        }
    });

    function buildPalette() {
        elements.palette.innerHTML = "";
        faceOrder.forEach((face) => {
            const button = document.createElement("button");
            button.type = "button";
            button.dataset.face = face;
            if (face === selectedFace) {
                button.classList.add("active");
            }
            button.innerHTML = `<span class="swatch" style="background:${faceColors[face]}"></span><span>${face} · ${moveFaceLabel(face)}</span>`;
            button.addEventListener("click", () => {
                selectedFace = face;
                buildPalette();
            });
            elements.palette.appendChild(button);
        });
    }

    function renderCube(host, stateString, isPreview) {
        host.innerHTML = "";
        faceOrder.forEach((face, faceIndex) => {
            const panel = document.createElement("div");
            panel.className = "face-panel";
            panel.dataset.face = face;
            panel.innerHTML = `
                <div class="face-header">
                    <span>${face}</span>
                    <span>${moveFaceLabel(face)}</span>
                </div>
                <div class="face-grid"></div>
            `;
            const grid = panel.querySelector(".face-grid");
            for (let offset = 0; offset < 9; offset += 1) {
                const globalIndex = faceIndex * 9 + offset;
                const sticker = document.createElement("button");
                sticker.type = "button";
                const value = stateString[globalIndex];
                sticker.className = isPreview ? "preview-sticker" : "sticker";
                sticker.style.background = faceColors[value];
                sticker.style.color = faceText[value];
                sticker.title = `${face}${offset + 1}: ${value}`;
                if (!isPreview && offset === 4) {
                    sticker.classList.add("center");
                }
                if (!isPreview) {
                    sticker.addEventListener("click", () => {
                        if (offset === 4) {
                            return;
                        }
                        faceletState[globalIndex] = selectedFace;
                        syncFaceletInput();
                        renderCube(elements.editorNet, faceletState.join(""), false);
                        markCubeChanged();
                    });
                } else {
                    sticker.disabled = true;
                }
                grid.appendChild(sticker);
            }
            host.appendChild(panel);
        });
    }

    function syncFaceletInput() {
        elements.faceletInput.value = faceletState.join("");
    }

    function setStatus(kind, title, body) {
        elements.statusBox.className = `status-box ${kind}`;
        elements.statusBox.innerHTML = `<div><strong>${title}</strong><div>${body}</div></div>`;
    }

    function markCubeChanged() {
        if (solutionMoves.length) {
            setStatus("warning", t.updatedTitle, t.updatedBody);
        }
    }

    function setCubeState(stateString, resetResults) {
        faceletState = stateString.split("");
        syncFaceletInput();
        renderCube(elements.editorNet, faceletState.join(""), false);
        if (resetResults) {
            clearSolutionResults();
        } else {
            markCubeChanged();
        }
    }

    function clearSolutionResults() {
        solutionMoves = [];
        stepStates = [];
        currentStepIndex = 0;
        elements.summaryMoves.textContent = "0";
        elements.summaryCurrent.textContent = "-";
        elements.summaryRemaining.textContent = "0";
        elements.summaryTime.textContent = "-";
        elements.stepMetaText.textContent = t.stepPlaceholder;
        elements.stepList.innerHTML = `<div class="placeholder">${t.stepPlaceholder}</div>`;
        elements.prevStepButton.disabled = true;
        elements.nextStepButton.disabled = true;
        renderCube(elements.previewNet, solvedState, true);
        renderPlaceholderPlayers();
        setStatus("info", t.readyTitle, t.readyBody);
    }

    function renderPlaceholderPlayers() {
        elements.fullPlayerHost.innerHTML = `<div class="placeholder">${t.stepPlaceholder}</div>`;
        elements.stepPlayerHost.innerHTML = `<div class="placeholder">${t.stepPlaceholder}</div>`;
    }

    function loadDemoScramble() {
        try {
            ensureCubeLibrary();
            const cube = new Cube();
            cube.move("R U R' U' F2 D L2 B' U R2");
            setCubeState(cube.asString(), true);
        } catch (error) {
            setStatus("error", t.errorLibrary, t.errorLibrary);
        }
    }

    function loadFromFaceletInput() {
        const candidate = normalizeFaceletInput(elements.faceletInput.value);
        const errorMessage = validateFaceletString(candidate);
        if (errorMessage) {
            setStatus("error", t.statusTitle, errorMessage);
            return;
        }
        setCubeState(candidate, true);
    }

    function normalizeFaceletInput(raw) {
        return raw.toUpperCase().replace(/\s+/g, "");
    }

    function validateFaceletString(faceletString) {
        if (faceletString.length !== 54) {
            return t.errorLength;
        }
        if (!/^[URFDLB]+$/.test(faceletString)) {
            return t.errorChars;
        }
        for (const face of faceOrder) {
            const count = faceletString.split("").filter((char) => char === face).length;
            if (count !== 9) {
                return t.errorCounts;
            }
        }
        for (let faceIndex = 0; faceIndex < faceOrder.length; faceIndex += 1) {
            if (faceletString[(faceIndex * 9) + 4] !== faceOrder[faceIndex]) {
                return t.errorCenters;
            }
        }
        return "";
    }

    function ensureCubeLibrary() {
        if (typeof Cube === "undefined") {
            throw new Error("Cube library missing");
        }
    }

    async function ensureSolverReady() {
        ensureCubeLibrary();
        if (solverReady) {
            return;
        }
        setStatus("warning", t.warmupTitle, t.warmupBody);
        await new Promise((resolve) => window.setTimeout(resolve, 30));
        Cube.initSolver();
        solverReady = true;
    }

    async function solveCube() {
        const faceletString = normalizeFaceletInput(elements.faceletInput.value);
        const validationError = validateFaceletString(faceletString);
        if (validationError) {
            setStatus("error", t.statusTitle, validationError);
            return;
        }

        try {
            ensureCubeLibrary();
        } catch (error) {
            setStatus("error", t.errorLibrary, t.errorLibrary);
            return;
        }

        const start = performance.now();
        setStatus("info", t.solvingTitle, t.solvingBody);

        try {
            await ensureSolverReady();
            const cube = Cube.fromString(faceletString);
            const solution = cube.solve();
            const moves = solution.trim() ? solution.trim().split(/\s+/) : [];
            const states = [faceletString];
            const tracker = Cube.fromString(faceletString);
            moves.forEach((move) => {
                tracker.move(move);
                states.push(tracker.asString());
            });
            if (!tracker.isSolved()) {
                throw new Error("Cube not solved");
            }

            solutionMoves = moves;
            stepStates = states;
            const solveTime = ((performance.now() - start) / 1000).toFixed(2);
            elements.summaryMoves.textContent = String(moves.length);
            elements.summaryTime.textContent = `${solveTime}s`;

            renderFullPlayer(solution);
            renderStepList();
            updateSelectedStep(0);
            setStatus("success", t.solvedTitle, t.solvedBody);
        } catch (error) {
            solutionMoves = [];
            stepStates = [];
            renderPlaceholderPlayers();
            elements.stepList.innerHTML = `<div class="placeholder">${t.stepPlaceholder}</div>`;
            setStatus("error", t.statusTitle, t.errorInvalidCube);
        }
    }

    function renderFullPlayer(solution) {
        const player = document.createElement("twisty-player");
        player.setAttribute("puzzle", "3x3x3");
        player.setAttribute("alg", solution);
        player.setAttribute("experimental-setup-anchor", "end");
        player.setAttribute("background", "none");
        player.setAttribute("hint-facelets", "floating");
        player.setAttribute("control-panel", "bottom-row");
        elements.fullPlayerHost.innerHTML = "";
        elements.fullPlayerHost.appendChild(player);
    }

    function renderStepPlayer(stepIndex) {
        if (!solutionMoves.length) {
            return;
        }
        const currentMove = solutionMoves[stepIndex];
        const remaining = solutionMoves.slice(stepIndex).join(" ");
        const setupAlg = invertAlgorithm(remaining);
        const player = document.createElement("twisty-player");
        player.setAttribute("puzzle", "3x3x3");
        player.setAttribute("alg", currentMove);
        player.setAttribute("experimental-setup-alg", setupAlg);
        player.setAttribute("background", "none");
        player.setAttribute("hint-facelets", "floating");
        player.setAttribute("control-panel", "bottom-row");
        elements.stepPlayerHost.innerHTML = "";
        elements.stepPlayerHost.appendChild(player);
        if (window.customElements && typeof window.customElements.whenDefined === "function") {
            window.customElements.whenDefined("twisty-player").then(() => {
                if (typeof player.play === "function") {
                    player.play();
                }
            });
        }
    }

    function renderStepList() {
        if (!solutionMoves.length) {
            elements.stepList.innerHTML = `<div class="placeholder">${t.stepPlaceholder}</div>`;
            return;
        }
        elements.stepList.innerHTML = "";
        solutionMoves.forEach((move, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "step-item";
            button.dataset.index = String(index);
            button.innerHTML = `
                <strong>${stepLabel(index)} · ${move}</strong>
                <span>${moveDescription(move)}</span>
            `;
            button.addEventListener("click", () => updateSelectedStep(index));
            elements.stepList.appendChild(button);
        });
    }

    function updateSelectedStep(stepIndex) {
        if (!solutionMoves.length) {
            return;
        }
        currentStepIndex = stepIndex;
        elements.summaryCurrent.textContent = `${stepIndex + 1}`;
        elements.summaryRemaining.textContent = String(solutionMoves.length - stepIndex - 1);
        elements.stepMetaText.textContent = `${stepLabel(stepIndex)} · ${solutionMoves[stepIndex]} · ${moveDescription(solutionMoves[stepIndex])}`;
        renderStepPlayer(stepIndex);
        renderCube(elements.previewNet, stepStates[stepIndex + 1], true);
        elements.prevStepButton.disabled = stepIndex === 0;
        elements.nextStepButton.disabled = stepIndex === solutionMoves.length - 1;
        elements.stepList.querySelectorAll(".step-item").forEach((item) => {
            item.classList.toggle("active", Number(item.dataset.index) === stepIndex);
        });
    }

    function stepLabel(index) {
        return locale === "zh" ? `${t.stepOf}${index + 1}步` : `${t.stepOf} ${index + 1}`;
    }

    function moveFaceLabel(face) {
        return t[`moveFace${face}`];
    }

    function moveDescription(move) {
        const face = move[0];
        if (move.endsWith("2")) {
            return `${moveFaceLabel(face)} ${t.moveDouble}`;
        }
        if (move.endsWith("'")) {
            return `${moveFaceLabel(face)} ${t.moveCounter}`;
        }
        return `${moveFaceLabel(face)} ${t.moveClockwise}`;
    }

    function invertAlgorithm(algorithm) {
        return algorithm
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .reverse()
            .map(invertMove)
            .join(" ");
    }

    function invertMove(move) {
        if (move.endsWith("2")) {
            return move;
        }
        if (move.endsWith("'")) {
            return move.slice(0, -1);
        }
        return `${move}'`;
    }

    async function copyText(text, successMessage) {
        try {
            await navigator.clipboard.writeText(text);
            setStatus("success", t.statusTitle, successMessage);
        } catch (error) {
            setStatus("warning", t.statusTitle, t.errorClipboard);
        }
    }
})();
