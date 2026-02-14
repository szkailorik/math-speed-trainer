/**
 * practice.js - Practice mode full flow
 */

// B04 fix: debounce flag to prevent rapid clicking
var _practiceAnswerLocked = false;

function startPractice(module) {
    App.currentModule = module;

    if (module === 'xiaojiujiu') {
        showPage('xiaojiujiu-mode');
        BattleMode.updateCollectionCount();
        // v23.0: Render chapter select cards
        if (typeof ChapterSystem !== 'undefined') {
            ChapterSystem.renderChapterSelect('xiaojiujiu');
        }
        return;
    }
    if (module === 'fraction') {
        showPage('fraction-mode');
        BattleMode.updateFractionCollectionCount();
        return;
    }
    if (module === 'decimal') {
        showPage('decimal-mode');
        BattleMode.updateDecimalCollectionCount();
        return;
    }
    if (module === 'unit') {
        showPage('unit-mode');
        BattleMode.updateUnitCollectionCount();
        return;
    }
    if (module === 'multiply') {
        showPage('multiply-mode');
        BattleMode.updateMultiplyCollectionCount();
        return;
    }
    if (module === 'times') {
        showPage('times-mode');
        BattleMode.updateTimesCollectionCount();
        return;
    }

    let questions = [];

    if (module === 'wrong') {
        if (App.wrongBook.length === 0) {
            alert('\u9B54\u6CD5\u6B8B\u9875\u662F\u7A7A\u7684\uFF0C\u592A\u68D2\u4E86\uFF01');
            return;
        }
        questions = shuffle(App.wrongBook).slice(0, Math.min(App.settings.count, App.wrongBook.length));
    } else if (module === 'mixed') {
        const allModules = ['xiaojiujiu', 'times', 'multiply', 'fraction', 'decimal', 'unit'];
        allModules.forEach(m => {
            const moduleData = MathData[m][App.difficulty] || MathData[m].easy;
            questions.push(...moduleData);
        });
        questions = shuffle(questions).slice(0, App.settings.count);
    } else {
        const moduleData = MathData[module];
        if (!moduleData) {
            alert('\u9519\u8BEF\uFF1A\u627E\u4E0D\u5230\u6A21\u5757 ' + module + '\n\u8BF7\u5237\u65B0\u9875\u9762\u91CD\u8BD5');
            return;
        }
        const diffData = moduleData[App.difficulty] || moduleData.easy;
        // v16.2: Use weighted selection if available
        if (typeof QuestionEngine !== 'undefined' && typeof QuestionEngine.weightedSelect === 'function') {
            questions = QuestionEngine.weightedSelect(diffData, Math.min(App.settings.count, diffData.length), module);
        } else {
            questions = shuffle(diffData).slice(0, Math.min(App.settings.count, diffData.length));
        }
    }

    // B05 fix: clear any leftover timer before starting new practice
    if (App.practice.timerInterval) {
        clearInterval(App.practice.timerInterval);
        App.practice.timerInterval = null;
    }

    App.practice = {
        questions: questions,
        currentIndex: 0,
        correctCount: 0,
        streak: 0,
        startTime: Date.now(),
        timerInterval: null,
        // v20.0: Recalibrated practice timers (Easy 12s, Normal 8s, Hard 5s)
        timePerQuestion: App.difficulty === 'easy' ? 12 : (App.difficulty === 'normal' ? 8 : 5)
    };

    const titles = {
        xiaojiujiu: '\uD83D\uDD25 \u5C0F\u4E5D\u4E5D\u901F\u7B97',
        times: '\uD83D\uDCCA \u5927\u4E5D\u4E5D\u8868',
        multiply: '\uD83D\uDD22 \u4E58\u6CD5\u901F\u8BB0',
        fraction: '\uD83D\uDD04 \u5206\u6570\u5C0F\u6570',
        decimal: '\u2797 \u5C0F\u6570\u89C4\u5F8B',
        unit: '\uD83D\uDCD0 \u5355\u4F4D\u6362\u7B97',
        mixed: '\uD83D\uDDFC \u8BD5\u70BC\u4E4B\u5854',
        wrong: '\uD83D\uDCD6 \u9B54\u6CD5\u6B8B\u9875\u4FEE\u590D'
    };
    document.getElementById('practice-title').textContent = titles[module] || '\u8BAD\u7EC3';

    document.getElementById('difficulty-selector').classList.toggle('hidden', module === 'wrong');

    showPage('practice');
    showQuestion();
}

function showQuestion() {
    const { questions, currentIndex } = App.practice;

    if (currentIndex >= questions.length) {
        endPractice();
        return;
    }

    // Reset debounce lock
    _practiceAnswerLocked = false;

    const question = questions[currentIndex];
    const questionCard = document.getElementById('question-card');
    const questionText = document.getElementById('question-text');
    const choices = document.getElementById('choices');
    const inputMode = document.getElementById('input-mode');

    document.getElementById('correct-count').textContent = currentIndex + 1;
    document.getElementById('total-count').textContent = questions.length;

    questionCard.classList.remove('correct', 'wrong');

    let questionHtml = formatFraction(question.q);

    if (containsFraction(question.q) && App.currentModule === 'fraction') {
        const fractionMatch = question.q.match(/(\d+)\/(\d+)/);
        if (fractionMatch) {
            const num = fractionMatch[1];
            const den = fractionMatch[2];
            questionHtml += `<span class="fraction-hint">\uD83D\uDCA1 \u63D0\u793A\uFF1A${num}\u00F7${den}</span>`;
        }
    }

    questionText.innerHTML = questionHtml;

    const streakIndicator = document.getElementById('streak-indicator');
    const currentStreak = document.getElementById('current-streak');
    if (App.practice.streak >= 3) {
        streakIndicator.classList.add('active');
        currentStreak.textContent = App.practice.streak;
    } else {
        streakIndicator.classList.remove('active');
    }

    const useInputMode = question.forceInput || App.settings.mode === 'input';

    if (!useInputMode) {
        inputMode.classList.add('hidden');
        choices.classList.remove('hidden');

        const isDecimal = typeof question.a === 'number' && !Number.isInteger(question.a);
        const options = generateOptions(question.display || question.a, isDecimal, question.isText);

        choices.innerHTML = options.map((opt, idx) =>
            `<button class="choice-btn" data-answer="${opt}"><span class="choice-num">${idx + 1}</span>${formatFraction(String(opt))}</button>`
        ).join('');

        choices.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', () => checkAnswer(btn.dataset.answer, btn));
        });
    } else {
        choices.classList.add('hidden');
        inputMode.classList.remove('hidden');

        const input = document.getElementById('answer-input');
        input.value = '';
        input.placeholder = question.forceInput ? '\u586B\u5199 ? \u7B49\u4E8E\u51E0' : '\u8F93\u5165\u7B54\u6848';

        let hintLabel = questionCard.querySelector('.input-hint');
        if (question.forceInput) {
            if (!hintLabel) {
                hintLabel = document.createElement('div');
                hintLabel.className = 'input-hint';
                questionCard.insertBefore(hintLabel, questionCard.firstChild);
            }
            hintLabel.textContent = '\u270F\uFE0F \u586B\u7A7A\u9898';
            hintLabel.style.display = 'block';
        } else if (hintLabel) {
            hintLabel.style.display = 'none';
        }

        setTimeout(() => {
            input.focus();
        }, 400);
    }

    if (!useInputMode) {
        const hintLabel = questionCard.querySelector('.input-hint');
        if (hintLabel) {
            hintLabel.style.display = 'none';
        }
    }

    if (App.settings.timer === 'on') {
        startQuestionTimer();
    }
}

function startQuestionTimer() {
    const timerBar = document.getElementById('timer-bar');
    const timerProgress = document.getElementById('timer-progress');

    timerBar.classList.add('active');
    timerProgress.style.width = '100%';

    const startTime = Date.now();
    const duration = App.practice.timePerQuestion * 1000;

    if (App.practice.timerInterval) {
        clearInterval(App.practice.timerInterval);
    }

    App.practice.timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 1 - elapsed / duration);
        timerProgress.style.width = (remaining * 100) + '%';

        if (remaining <= 0) {
            clearInterval(App.practice.timerInterval);
            // v16.1: Check debounce lock to prevent race with user click
            if (!_practiceAnswerLocked) {
                _practiceAnswerLocked = true;
                handleWrongAnswer(null);
            }
        }
    }, 50);
}

function checkAnswer(userAnswer, btnElement) {
    // B04 fix: prevent rapid double-clicks
    if (_practiceAnswerLocked) return;
    _practiceAnswerLocked = true;

    const question = App.practice.questions[App.practice.currentIndex];
    const correctAnswer = question.display || question.a;

    if (App.practice.timerInterval) {
        clearInterval(App.practice.timerInterval);
        document.getElementById('timer-bar').classList.remove('active');
    }

    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.disabled = true;
        if (String(btn.dataset.answer) === String(correctAnswer)) {
            btn.classList.add('correct');
        }
    });

    const isCorrect = String(userAnswer) === String(correctAnswer);

    if (isCorrect) {
        handleCorrectAnswer(btnElement);
    } else {
        if (btnElement) btnElement.classList.add('wrong');
        handleWrongAnswer(userAnswer);
    }
}

function handleCorrectAnswer(btnElement) {
    const questionCard = document.getElementById('question-card');
    questionCard.classList.add('correct');

    // v16.2: Update question weight
    var question = App.practice.questions[App.practice.currentIndex];
    if (typeof QuestionEngine !== 'undefined' && typeof QuestionEngine.updateWeight === 'function') {
        QuestionEngine.updateWeight(App.currentModule || 'xiaojiujiu', question.q, true, false);
    }

    // v19.0: Knowledge tracker
    if (typeof KnowledgeTracker !== 'undefined') {
        KnowledgeTracker.recordAnswer(App.currentModule || 'xiaojiujiu', question.q, true, 2);
    }

    App.practice.correctCount++;
    App.practice.streak++;
    App.stats.totalCorrect++;
    App.stats.totalScore += 10;
    App.stats.todayCount++;

    if (App.practice.streak > App.stats.maxStreak) {
        App.stats.maxStreak = App.practice.streak;
    }

    playSound('correct');
    vibrate(50);
    showFeedback(true);

    if (btnElement) {
        createScorePopup(btnElement, 10, true);
    }

    const streakNum = document.getElementById('current-streak');
    if (streakNum) {
        streakNum.classList.remove('pop');
        void streakNum.offsetWidth;
        streakNum.classList.add('pop');
    }

    checkAchievements(App.practice.streak, App.stats.totalCorrect);

    const streakIndicator = document.getElementById('streak-indicator');
    if (App.practice.streak > 0 && App.practice.streak % 5 === 0) {
        streakIndicator.classList.add('milestone');
        setTimeout(() => streakIndicator.classList.remove('milestone'), 2000);
    }

    const streak = App.practice.streak;

    if (streak === 3) {
        playSound('streak');
        createConfetti(25);
        createComboText(3);
    } else if (streak === 5) {
        playSound('streak');
        createConfetti(40);
        createComboText(5);
        if (btnElement) {
            const rect = btnElement.getBoundingClientRect();
            createStarBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);
        }
    } else if (streak === 10) {
        playSound('achievement');
        createConfetti(80);
        createComboText(10);
        if (btnElement) {
            const rect = btnElement.getBoundingClientRect();
            createStarBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 15);
            createFloatingHearts(rect.left + rect.width / 2, rect.top, 8);
        }
    } else if (streak === 15) {
        playSound('achievement');
        createConfetti(100);
        createComboText(15);
        if (btnElement) {
            const rect = btnElement.getBoundingClientRect();
            createStarBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
            createFloatingHearts(rect.left + rect.width / 2, rect.top, 12);
        }
    } else if (streak === 20) {
        playSound('complete');
        createConfetti(150);
        createComboText(20);
        if (btnElement) {
            const rect = btnElement.getBoundingClientRect();
            createStarBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
            createFloatingHearts(rect.left + rect.width / 2, rect.top, 15);
        }
    } else if (streak > 0 && streak % 5 === 0) {
        playSound('streak');
        createConfetti(50);
        if (btnElement) {
            const rect = btnElement.getBoundingClientRect();
            createStarBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);
        }
    }

    saveProgress();

    setTimeout(() => {
        App.practice.currentIndex++;
        showQuestion();
    }, 800);
}

function handleWrongAnswer(userAnswer) {
    const questionCard = document.getElementById('question-card');
    const questionText = document.getElementById('question-text');
    const question = App.practice.questions[App.practice.currentIndex];
    const correctAnswer = question.display || question.a;

    questionCard.classList.add('wrong');

    // v16.2: Update question weight
    if (typeof QuestionEngine !== 'undefined' && typeof QuestionEngine.updateWeight === 'function') {
        QuestionEngine.updateWeight(App.currentModule || 'xiaojiujiu', question.q, false, false);
    }

    // v19.0: Knowledge tracker
    if (typeof KnowledgeTracker !== 'undefined') {
        KnowledgeTracker.recordAnswer(App.currentModule || 'xiaojiujiu', question.q, false, 0);
    }

    const formattedQuestion = formatFraction(question.q);
    const formattedAnswer = formatFraction(String(correctAnswer));
    questionText.innerHTML = `${formattedQuestion}<br><span style="color: var(--success); font-size: 1.5rem;">\u6B63\u786E\u7B54\u6848: ${formattedAnswer}</span>`;

    App.practice.streak = 0;

    const wrongItem = {
        q: question.q,
        a: question.display || question.a,
        yourAnswer: userAnswer,
        module: App.currentModule || 'xiaojiujiu',
        timestamp: Date.now()
    };

    const exists = App.wrongBook.some(item => item.q === wrongItem.q);
    if (!exists) {
        App.wrongBook.push(wrongItem);
    }

    playSound('wrong');
    vibrate([50, 50, 50]);
    showFeedback(false);

    saveProgress();

    setTimeout(() => {
        App.practice.currentIndex++;
        showQuestion();
    }, 1200);
}

function submitInputAnswer() {
    const input = document.getElementById('answer-input');
    const userAnswer = input.value.trim();

    if (!userAnswer) return;

    const question = App.practice.questions[App.practice.currentIndex];
    const correctAnswer = question.display || question.a;

    if (App.practice.timerInterval) {
        clearInterval(App.practice.timerInterval);
        document.getElementById('timer-bar').classList.remove('active');
    }

    let isCorrect = false;
    if (question.isText) {
        isCorrect = userAnswer.replace(/\s/g, '') === String(correctAnswer).replace(/\s/g, '');
    } else {
        isCorrect = parseFloat(userAnswer) === parseFloat(correctAnswer);
    }

    if (isCorrect) {
        handleCorrectAnswer(null);
    } else {
        handleWrongAnswer(userAnswer);
    }
}

function endPractice() {
    const { correctCount, questions, startTime } = App.practice;
    const totalTime = Math.round((Date.now() - startTime) / 1000);
    const accuracy = Math.round((correctCount / questions.length) * 100);

    document.getElementById('result-correct').textContent = correctCount;
    document.getElementById('result-total').textContent = questions.length;
    document.getElementById('result-time').textContent = totalTime + 's';
    document.getElementById('accuracy-fill').style.width = accuracy + '%';
    document.getElementById('accuracy-text').textContent = `\u6B63\u786E\u7387 ${accuracy}%`;

    const resultIcon = document.getElementById('result-icon');
    const resultTitle = document.getElementById('result-title');
    const resultEncourage = document.getElementById('result-encourage');

    const encouragements = {
        excellent: [
            '\u4F60\u5C31\u662F\u901F\u7B97\u5C0F\u5929\u624D\uFF01',
            '\u592A\u5389\u5BB3\u4E86\uFF0C\u7EE7\u7EED\u4FDD\u6301\uFF01',
            '\u6570\u5B66\u738B\u8005\u975E\u4F60\u83AB\u5C5E\uFF01'
        ],
        good: [
            '\u505A\u5F97\u5F88\u68D2\uFF0C\u518D\u63A5\u518D\u53B1\uFF01',
            '\u79BB\u6EE1\u5206\u53EA\u5DEE\u4E00\u70B9\u70B9\u4E86\uFF01',
            '\u8FDB\u6B65\u795E\u901F\uFF0C\u4E3A\u4F60\u70B9\u8D5E\uFF01'
        ],
        okay: [
            '\u6BCF\u5929\u8FDB\u6B65\u4E00\u70B9\u70B9\uFF01',
            '\u575A\u6301\u5C31\u662F\u80DC\u5229\uFF01',
            '\u719F\u80FD\u751F\u5DE7\uFF0C\u7EE7\u7EED\u7EC3\u4E60\uFF01'
        ],
        needWork: [
            '\u5148\u53BB\u770B\u770B\u901F\u7B97\u79D8\u7C4D\u5427\uFF01',
            '\u591A\u7EC3\u51E0\u6B21\u5C31\u4F1A\u4E86\uFF01',
            '\u4E0D\u8981\u7070\u5FC3\uFF0C\u52A0\u6CB9\uFF01'
        ]
    };

    if (accuracy >= 90) {
        resultIcon.textContent = '\uD83C\uDF89';
        resultTitle.textContent = '\u592A\u68D2\u4E86\uFF01';
        resultEncourage.textContent = encouragements.excellent[Math.floor(Math.random() * 3)];
    } else if (accuracy >= 70) {
        resultIcon.textContent = '\uD83D\uDE0A';
        resultTitle.textContent = '\u505A\u5F97\u4E0D\u9519\uFF01';
        resultEncourage.textContent = encouragements.good[Math.floor(Math.random() * 3)];
    } else if (accuracy >= 50) {
        resultIcon.textContent = '\uD83D\uDCAA';
        resultTitle.textContent = '\u7EE7\u7EED\u52A0\u6CB9\uFF01';
        resultEncourage.textContent = encouragements.okay[Math.floor(Math.random() * 3)];
    } else {
        resultIcon.textContent = '\uD83D\uDCDA';
        resultTitle.textContent = '\u9700\u8981\u591A\u7EC3\u4E60';
        resultEncourage.textContent = encouragements.needWork[Math.floor(Math.random() * 3)];
    }

    updateHomeStats();
    showPage('result');

    if (accuracy >= 90) {
        playSound('complete');
        createConfetti(80);
    } else if (accuracy >= 70) {
        playSound('achievement');
        createConfetti(50);
    } else if (accuracy >= 50) {
        createConfetti(30);
    }
}
