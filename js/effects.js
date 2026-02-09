/**
 * effects.js - Sound effects, visual effects, achievement popups
 */

// ===== Sound Effects =====
function playSound(type) {
    if (App.settings.sound !== 'on') return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    if (type === 'correct') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'wrong') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.setValueAtTime(150, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'streak') {
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
            gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
            gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.08 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.15);
            osc.start(ctx.currentTime + i * 0.08);
            osc.stop(ctx.currentTime + i * 0.08 + 0.2);
        });
    } else if (type === 'achievement') {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
            gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
            gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * 0.12 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.3);
            osc.start(ctx.currentTime + i * 0.12);
            osc.stop(ctx.currentTime + i * 0.12 + 0.35);
        });
    } else if (type === 'complete') {
        const melody = [
            { freq: 523.25, time: 0 },
            { freq: 587.33, time: 0.1 },
            { freq: 659.25, time: 0.2 },
            { freq: 783.99, time: 0.3 },
            { freq: 659.25, time: 0.45 },
            { freq: 783.99, time: 0.55 },
            { freq: 1046.5, time: 0.7 },
        ];
        melody.forEach(note => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);
            gain.gain.setValueAtTime(0, ctx.currentTime + note.time);
            gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + note.time + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + note.time + 0.2);
            osc.start(ctx.currentTime + note.time);
            osc.stop(ctx.currentTime + note.time + 0.25);
        });
    } else if (type === 'countdown') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.06);
    } else if (type === 'attack') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'hit') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'monsterAttack') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.setValueAtTime(200, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(150, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'defeat') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.type = 'sawtooth';
        osc2.type = 'square';
        osc1.frequency.setValueAtTime(400, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3);
        osc2.frequency.setValueAtTime(200, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc1.start(ctx.currentTime);
        osc2.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.45);
        osc2.stop(ctx.currentTime + 0.45);
    } else if (type === 'gameOver') {
        const notes = [392, 349.23, 329.63, 261.63];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.2);
            gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.2);
            gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.2 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.2 + 0.25);
            osc.start(ctx.currentTime + i * 0.2);
            osc.stop(ctx.currentTime + i * 0.2 + 0.3);
        });
    }
}

// ===== Vibration =====
function vibrate(pattern) {
    if (navigator.vibrate) {
        navigator.vibrate(pattern);
    }
}

// ===== Visual Feedback =====
function showFeedback(isCorrect, feedbackId = 'feedback') {
    const feedback = document.getElementById(feedbackId);
    const icon = feedback.querySelector('.feedback-icon');
    const text = feedback.querySelector('.feedback-text');

    feedback.classList.remove('correct', 'wrong', 'show');

    if (isCorrect) {
        feedback.classList.add('correct');
        icon.textContent = '\u2713';
        text.textContent = ['\u592A\u68D2\u4E86\uFF01', '\u6B63\u786E\uFF01', '\u5389\u5BB3\uFF01', '\u7EE7\u7EED\u4FDD\u6301\uFF01'][Math.floor(Math.random() * 4)];
    } else {
        feedback.classList.add('wrong');
        icon.textContent = '\u2717';
        text.textContent = ['\u518D\u60F3\u60F3', '\u52A0\u6CB9\uFF01', '\u4E0B\u6B21\u4E00\u5B9A\u884C'][Math.floor(Math.random() * 3)];
    }

    feedback.classList.add('show');

    setTimeout(() => {
        feedback.classList.remove('show');
    }, 1000);
}

// ===== Confetti & Particles =====
function createConfetti(count = 50) {
    const colors = ['#6C5CE7', '#34C759', '#FF9500', '#FF3B30', '#5AC8FA', '#AF52DE', '#FFD60A', '#FF6B6B', '#4ECDC4'];
    const shapes = ['square', 'circle', 'triangle'];
    const effectsLayer = document.getElementById('effects-layer');

    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';

        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const size = 6 + Math.random() * 10;

        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = color;
        confetti.style.color = color;
        confetti.style.animationDelay = Math.random() * 0.8 + 's';
        confetti.style.animationDuration = (2.5 + Math.random() * 2) + 's';
        confetti.style.width = size + 'px';
        confetti.style.height = size + 'px';

        if (shape === 'circle') {
            confetti.style.borderRadius = '50%';
        } else if (shape === 'triangle') {
            confetti.style.width = '0';
            confetti.style.height = '0';
            confetti.style.backgroundColor = 'transparent';
            confetti.style.borderLeft = size/2 + 'px solid transparent';
            confetti.style.borderRight = size/2 + 'px solid transparent';
            confetti.style.borderBottom = size + 'px solid ' + color;
        }

        effectsLayer.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }
}

function createStarBurst(x, y, count = 8) {
    const stars = ['\u2B50', '\u2728', '\uD83C\uDF1F', '\uD83D\uDCAB', '\u26A1', '\uD83D\uDCA5'];
    const effectsLayer = document.getElementById('effects-layer');

    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star-burst';
        star.textContent = stars[Math.floor(Math.random() * stars.length)];
        star.style.fontSize = (1 + Math.random() * 1.5) + 'rem';

        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        const distance = 40 + Math.random() * 60;

        star.style.left = x + 'px';
        star.style.top = y + 'px';
        star.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
        star.style.setProperty('--ty', Math.sin(angle) * distance + 'px');

        effectsLayer.appendChild(star);
        setTimeout(() => star.remove(), 800);
    }
}

function createEnergyWave(x, y) {
    const effectsLayer = document.getElementById('effects-layer');

    for (let i = 0; i < 3; i++) {
        const wave = document.createElement('div');
        wave.className = 'energy-wave';
        wave.style.left = (x - 50) + 'px';
        wave.style.top = (y - 50) + 'px';
        wave.style.animationDelay = (i * 0.15) + 's';
        effectsLayer.appendChild(wave);
        setTimeout(() => wave.remove(), 1000);
    }
}

function createFloatingHearts(x, y, count = 5) {
    const hearts = ['\u2764\uFE0F', '\uD83D\uDC96', '\uD83D\uDC95', '\uD83D\uDC97', '\uD83D\uDC9D'];
    const effectsLayer = document.getElementById('effects-layer');

    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = (x - 20 + Math.random() * 40) + 'px';
        heart.style.top = y + 'px';
        heart.style.animationDelay = (i * 0.1) + 's';
        effectsLayer.appendChild(heart);
        setTimeout(() => heart.remove(), 1200);
    }
}

function createComboText(streak) {
    const texts = {
        3: '\uD83D\uDD25 \u4E09\u8FDE!',
        5: '\u26A1 \u4E94\u8FDE\u51FB!',
        10: '\uD83D\uDCA5 \u5341\u8FDE\u65A9!',
        15: '\uD83C\uDF1F \u8D85\u795E!',
        20: '\uD83D\uDC51 \u65E0\u654C!'
    };

    const text = texts[streak];
    if (!text) return;

    const combo = document.createElement('div');
    combo.className = 'combo-text';
    combo.textContent = text;
    combo.style.left = '50%';
    combo.style.top = '30%';
    combo.style.transform = 'translateX(-50%)';

    document.body.appendChild(combo);
    setTimeout(() => combo.remove(), 1200);
}

function createScorePopup(element, score, isCorrect) {
    const popup = document.createElement('div');
    popup.className = 'score-popup ' + (isCorrect ? 'correct' : 'wrong');
    popup.textContent = isCorrect ? '+' + score : '\u00D7';

    const rect = element.getBoundingClientRect();
    popup.style.left = (rect.left + rect.width / 2) + 'px';
    popup.style.top = rect.top + 'px';

    document.body.appendChild(popup);

    if (isCorrect) {
        createEnergyWave(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    setTimeout(() => popup.remove(), 1000);
}

// ===== Achievements =====
function showAchievement(achievement) {
    const popup = document.getElementById('achievement-popup');
    const desc = document.getElementById('achievement-desc');
    const icon = popup.querySelector('.achievement-icon');

    icon.textContent = achievement.icon;
    desc.textContent = achievement.desc;

    popup.classList.remove('hidden');
    setTimeout(() => popup.classList.add('show'), 10);

    playSound('achievement');
    createConfetti();

    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.classList.add('hidden'), 300);
    }, 2500);
}

function checkAchievements(streak, totalCorrect) {
    MathData.achievements.forEach(achievement => {
        if (App.stats.achievements.includes(achievement.id)) return;

        if (achievement.condition && achievement.condition(streak, totalCorrect)) {
            App.stats.achievements.push(achievement.id);
            saveProgress();
            showAchievement(achievement);
        }
    });
}
