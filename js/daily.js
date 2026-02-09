/**
 * daily.js - Daily challenge mode
 */

function initDailyChallenge() {
    const allQuestions = [];
    const modules = ['xiaojiujiu', 'times', 'multiply', 'fraction', 'decimal', 'unit'];

    modules.forEach(m => {
        const data = MathData[m].normal || MathData[m].easy;
        const picked = shuffle([...data]).slice(0, 3);
        allQuestions.push(...picked);
    });

    App.daily = {
        questions: shuffle(allQuestions).slice(0, 10),
        currentIndex: 0,
        results: [],
        startTime: null,
        timerInterval: null,
        completed: false
    };

    const dots = document.getElementById('progress-dots');
    dots.innerHTML = Array(10).fill(0).map((_, i) =>
        `<div class="progress-dot" data-index="${i}">${i + 1}</div>`
    ).join('');

    document.getElementById('daily-question-text').textContent = '\u51C6\u5907\u597D\u4E86\u5417\uFF1F';
    document.getElementById('daily-timer').textContent = '00:00';
    document.getElementById('daily-choices').innerHTML =
        '<button class="start-daily-btn" id="start-daily">\u51FA\u53D1\u95EF\u5173\uFF01</button>';

    document.getElementById('start-daily').addEventListener('click', startDailyChallenge);
}

function startDailyChallenge() {
    App.daily.startTime = Date.now();

    App.daily.timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - App.daily.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        document.getElementById('daily-timer').textContent = `${minutes}:${seconds}`;
    }, 1000);

    showDailyQuestion();
}

function showDailyQuestion() {
    const { questions, currentIndex } = App.daily;

    if (currentIndex >= questions.length) {
        endDailyChallenge();
        return;
    }

    const question = questions[currentIndex];
    const questionCard = document.getElementById('daily-question-card');
    const questionText = document.getElementById('daily-question-text');
    const choices = document.getElementById('daily-choices');

    document.querySelectorAll('.progress-dot').forEach((dot, i) => {
        dot.classList.remove('current');
        if (i === currentIndex) {
            dot.classList.add('current');
        }
    });

    questionCard.classList.remove('correct', 'wrong');

    let questionHtml = formatFraction(question.q);

    if (containsFraction(question.q)) {
        const fractionMatch = question.q.match(/(\d+)\/(\d+)/);
        if (fractionMatch) {
            const num = fractionMatch[1];
            const den = fractionMatch[2];
            questionHtml += `<span class="fraction-hint">\uD83D\uDCA1 \u63D0\u793A\uFF1A${num}\u00F7${den}</span>`;
        }
    }

    questionText.innerHTML = questionHtml;

    const isDecimal = typeof question.a === 'number' && !Number.isInteger(question.a);
    const options = generateOptions(question.display || question.a, isDecimal, question.isText);

    choices.innerHTML = options.map((opt, idx) =>
        `<button class="choice-btn" data-answer="${opt}"><span class="choice-num">${idx + 1}</span>${formatFraction(String(opt))}</button>`
    ).join('');

    choices.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => checkDailyAnswer(btn.dataset.answer, btn));
    });
}

function checkDailyAnswer(userAnswer, btnElement) {
    const question = App.daily.questions[App.daily.currentIndex];
    const correctAnswer = question.display || question.a;
    const questionCard = document.getElementById('daily-question-card');

    document.querySelectorAll('#daily-choices .choice-btn').forEach(btn => {
        btn.disabled = true;
        if (String(btn.dataset.answer) === String(correctAnswer)) {
            btn.classList.add('correct');
        }
    });

    const isCorrect = String(userAnswer) === String(correctAnswer);

    App.daily.results.push(isCorrect);

    const dot = document.querySelector(`.progress-dot[data-index="${App.daily.currentIndex}"]`);
    dot.classList.remove('current');
    dot.classList.add(isCorrect ? 'correct' : 'wrong');

    questionCard.classList.add(isCorrect ? 'correct' : 'wrong');
    if (!isCorrect && btnElement) {
        btnElement.classList.add('wrong');

        const wrongItem = {
            q: question.q,
            a: question.display || question.a,
            yourAnswer: userAnswer,
            timestamp: Date.now()
        };
        const exists = App.wrongBook.some(item => item.q === wrongItem.q);
        if (!exists) {
            App.wrongBook.push(wrongItem);
        }
    }

    playSound(isCorrect ? 'correct' : 'wrong');
    vibrate(isCorrect ? 50 : [50, 50, 50]);
    showFeedback(isCorrect, 'daily-feedback');

    setTimeout(() => {
        App.daily.currentIndex++;
        showDailyQuestion();
    }, 800);
}

function endDailyChallenge() {
    clearInterval(App.daily.timerInterval);

    const correctCount = App.daily.results.filter(r => r).length;
    const totalTime = Math.round((Date.now() - App.daily.startTime) / 1000);
    const accuracy = Math.round((correctCount / 10) * 100);

    if (correctCount === 10 && !App.stats.achievements.includes('daily_perfect')) {
        App.stats.achievements.push('daily_perfect');
        saveProgress();
        setTimeout(() => {
            showAchievement(MathData.achievements.find(a => a.id === 'daily_perfect'));
        }, 500);
    }

    if (totalTime <= 30 && correctCount >= 8 && !App.stats.achievements.includes('daily_fast')) {
        App.stats.achievements.push('daily_fast');
        saveProgress();
        setTimeout(() => {
            showAchievement(MathData.achievements.find(a => a.id === 'daily_fast'));
        }, 1500);
    }

    App.stats.totalScore += correctCount * 15;
    App.stats.totalCorrect += correctCount;
    App.stats.todayCount += 10;
    saveProgress();
    updateHomeStats();

    document.getElementById('result-correct').textContent = correctCount;
    document.getElementById('result-total').textContent = 10;
    document.getElementById('result-time').textContent = totalTime + 's';
    document.getElementById('accuracy-fill').style.width = accuracy + '%';
    document.getElementById('accuracy-text').textContent = `\u6B63\u786E\u7387 ${accuracy}%`;

    const resultIcon = document.getElementById('result-icon');
    const resultTitle = document.getElementById('result-title');
    const resultEncourage = document.getElementById('result-encourage');

    const encouragements = {
        perfect: [
            '\u4F60\u5C31\u662F\u901F\u7B97\u5C0F\u5929\u624D\uFF01',
            '\u65E0\u4EBA\u80FD\u654C\uFF0C\u592A\u5B8C\u7F8E\u4E86\uFF01',
            '\u6570\u5B66\u738B\u8005\u975E\u4F60\u83AB\u5C5E\uFF01'
        ],
        excellent: [
            '\u592A\u5389\u5BB3\u4E86\uFF0C\u7EE7\u7EED\u4FDD\u6301\uFF01',
            '\u79BB\u6EE1\u5206\u53EA\u5DEE\u4E00\u70B9\u70B9\uFF01',
            '\u8FDB\u6B65\u795E\u901F\uFF0C\u4E3A\u4F60\u70B9\u8D5E\uFF01'
        ],
        good: [
            '\u505A\u5F97\u5F88\u68D2\uFF0C\u518D\u63A5\u518D\u53B1\uFF01',
            '\u6BCF\u5929\u8FDB\u6B65\u4E00\u70B9\u70B9\uFF01',
            '\u575A\u6301\u5C31\u662F\u80DC\u5229\uFF01'
        ],
        needWork: [
            '\u5148\u53BB\u770B\u770B\u901F\u7B97\u79D8\u7C4D\u5427\uFF01',
            '\u591A\u7EC3\u51E0\u6B21\u5C31\u4F1A\u4E86\uFF01',
            '\u4E0D\u8981\u7070\u5FC3\uFF0C\u52A0\u6CB9\uFF01'
        ]
    };

    if (correctCount === 10) {
        resultIcon.textContent = '\uD83D\uDC51';
        resultTitle.textContent = '\u526F\u672C\u5B8C\u6210\uFF01';
        resultEncourage.textContent = encouragements.perfect[Math.floor(Math.random() * 3)];
    } else if (correctCount >= 8) {
        resultIcon.textContent = '\uD83C\uDF89';
        resultTitle.textContent = '\u526F\u672C\u5B8C\u6210\uFF01';
        resultEncourage.textContent = encouragements.excellent[Math.floor(Math.random() * 3)];
    } else if (correctCount >= 6) {
        resultIcon.textContent = '\uD83D\uDCAA';
        resultTitle.textContent = '\u8868\u73B0\u4E0D\u9519\uFF01';
        resultEncourage.textContent = encouragements.good[Math.floor(Math.random() * 3)];
    } else {
        resultIcon.textContent = '\uD83D\uDCDA';
        resultTitle.textContent = '\u7EE7\u7EED\u52AA\u529B\uFF01';
        resultEncourage.textContent = encouragements.needWork[Math.floor(Math.random() * 3)];
    }

    showPage('result');

    if (correctCount === 10) {
        playSound('complete');
        createConfetti(100);
    } else if (correctCount >= 8) {
        playSound('achievement');
        createConfetti(60);
    } else if (correctCount >= 6) {
        playSound('streak');
        createConfetti(30);
    }
}
