/**
 * 数学速算训练营 - 主应用逻辑
 */

// ===== 用户管理 =====
const UserManager = {
    // 获取所有用户列表
    getUsers() {
        const users = localStorage.getItem('mathSpeedTrainer_users');
        if (users) {
            return JSON.parse(users);
        }
        // 默认创建 Lorik 和 Kai 两个用户
        const defaultUsers = [
            { id: 'lorik', name: 'Lorik', avatar: '👦', createdAt: Date.now() },
            { id: 'kai', name: 'Kai', avatar: '🧒', createdAt: Date.now() }
        ];
        this.saveUsers(defaultUsers);
        return defaultUsers;
    },

    // 保存用户列表
    saveUsers(users) {
        localStorage.setItem('mathSpeedTrainer_users', JSON.stringify(users));
    },

    // 获取当前用户
    getCurrentUser() {
        const userId = localStorage.getItem('mathSpeedTrainer_currentUser');
        const users = this.getUsers();
        if (userId) {
            const user = users.find(u => u.id === userId);
            if (user) return user;
        }
        return null; // 没有选择用户
    },

    // 设置当前用户
    setCurrentUser(userId) {
        localStorage.setItem('mathSpeedTrainer_currentUser', userId);
    },

    // 添加新用户
    addUser(name, avatar) {
        const users = this.getUsers();
        const id = name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
        const newUser = {
            id: id,
            name: name,
            avatar: avatar,
            createdAt: Date.now()
        };
        users.push(newUser);
        this.saveUsers(users);
        return newUser;
    },

    // 删除用户
    deleteUser(userId) {
        let users = this.getUsers();
        users = users.filter(u => u.id !== userId);
        this.saveUsers(users);
        // 删除该用户的数据
        localStorage.removeItem('mathSpeedTrainer_' + userId);
        // 如果删除的是当前用户，清除当前用户
        if (localStorage.getItem('mathSpeedTrainer_currentUser') === userId) {
            localStorage.removeItem('mathSpeedTrainer_currentUser');
        }
    },

    // 获取用户数据的存储 key
    getDataKey(userId) {
        return 'mathSpeedTrainer_' + userId;
    }
};

// ===== 应用状态 =====
const App = {
    // 当前页面
    currentPage: 'home',

    // 当前训练模块
    currentModule: null,

    // 当前难度
    difficulty: 'easy',

    // 设置
    settings: {
        mode: 'choice',      // choice | input
        timer: 'off',        // on | off
        count: 20,           // 每轮题数
        theme: 'light',      // light | dark
        sound: 'on'          // on | off
    },

    // 统计数据
    stats: {
        totalScore: 0,       // 总分
        maxStreak: 0,        // 最大连胜
        totalCorrect: 0,     // 总答对数
        achievements: [],    // 已获得成就
        todayCount: 0,       // 今日练习题数
        todayDate: null      // 今日日期
    },

    // 错题本
    wrongBook: [],

    // 当前训练状态
    practice: {
        questions: [],       // 当前题目列表
        currentIndex: 0,     // 当前题目索引
        correctCount: 0,     // 当前正确数
        streak: 0,           // 当前连胜
        startTime: null,     // 开始时间
        timerInterval: null, // 计时器
        timePerQuestion: 10, // 每题时间(秒)
    },

    // 每日挑战状态
    daily: {
        questions: [],
        currentIndex: 0,
        results: [],         // 每题结果
        startTime: null,
        timerInterval: null,
        completed: false
    },

    // 战斗模式状态
    battle: {
        active: false,
        difficulty: 'easy',
        currentStage: 1,
        totalStages: 4,
        playerHP: 5,
        playerMaxHP: 5,
        monsterHP: 5,
        monsterMaxHP: 5,
        combo: 0,
        maxCombo: 0,
        correctCount: 0,
        totalDamage: 0,
        noDamageTaken: true,
        startTime: null,
        questions: [],
        currentIndex: 0,
        monstersDefeated: 0,
        healCounter: 0,          // 连续答对计数，用于恢复血量
        currentMonster: null,    // 当前怪兽引用
        monsterQueue: [],        // 怪兽队列
        inventory: [],           // 道具背包
        activeItem: null,        // 激活的道具
        shield: 0,               // 护盾层数
        hasRevive: false,        // 是否有复活保护
        itemsUsed: 0,            // 使用道具次数
        itemsCollected: 0        // 收集道具次数
    }
};

// ===== 工具函数 =====

// 将分数字符串转换为HTML格式（上下显示）
function formatFraction(text) {
    if (typeof text !== 'string') {
        text = String(text);
    }

    // 匹配分数格式：数字/数字
    return text.replace(/(\d+)\/(\d+)/g, (match, numerator, denominator) => {
        return `<span class="fraction"><span class="numerator">${numerator}</span><span class="denominator">${denominator}</span></span>`;
    });
}

// 检查文本是否包含分数
function containsFraction(text) {
    return /\d+\/\d+/.test(String(text));
}

// 播放音效
function playSound(type) {
    if (App.settings.sound !== 'on') return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    if (type === 'correct') {
        // 清脆的正确音效 - 上升的两个音
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.1); // G5
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'wrong') {
        // 低沉的错误音效
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
        // 连胜音效 - 快速上升的三个音
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
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
        // 成就音效 - 胜利的旋律
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
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
        // 完成挑战音效 - 欢快的旋律
        const melody = [
            { freq: 523.25, time: 0 },      // C5
            { freq: 587.33, time: 0.1 },    // D5
            { freq: 659.25, time: 0.2 },    // E5
            { freq: 783.99, time: 0.3 },    // G5
            { freq: 659.25, time: 0.45 },   // E5
            { freq: 783.99, time: 0.55 },   // G5
            { freq: 1046.5, time: 0.7 },    // C6
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
        // 倒计时提示音
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'click') {
        // 点击音效
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
        // 攻击音效 - 快速"嗖"声
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
        // 命中音效 - 撞击声
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
        // 怪兽攻击音效 - 危险警告
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
        // 怪兽死亡音效 - 爆炸消散
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
        // 游戏失败音效 - 低沉下降
        const notes = [392, 349.23, 329.63, 261.63]; // G4, F4, E4, C4
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

// 震动反馈
function vibrate(pattern) {
    if (navigator.vibrate) {
        navigator.vibrate(pattern);
    }
}

// 显示反馈
function showFeedback(isCorrect, feedbackId = 'feedback') {
    const feedback = document.getElementById(feedbackId);
    const icon = feedback.querySelector('.feedback-icon');
    const text = feedback.querySelector('.feedback-text');

    feedback.classList.remove('correct', 'wrong', 'show');

    if (isCorrect) {
        feedback.classList.add('correct');
        icon.textContent = '✓';
        text.textContent = ['太棒了！', '正确！', '厉害！', '继续保持！'][Math.floor(Math.random() * 4)];
    } else {
        feedback.classList.add('wrong');
        icon.textContent = '✗';
        text.textContent = ['再想想', '加油！', '下次一定行'][Math.floor(Math.random() * 3)];
    }

    feedback.classList.add('show');

    setTimeout(() => {
        feedback.classList.remove('show');
    }, 1000);
}

// 创建彩色纸屑特效 - 更华丽版本
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

// 创建星星爆炸效果 - 更多星星
function createStarBurst(x, y, count = 8) {
    const stars = ['⭐', '✨', '🌟', '💫', '⚡', '💥'];
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

// 创建能量波纹效果
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

// 创建漂浮爱心（连胜奖励）
function createFloatingHearts(x, y, count = 5) {
    const hearts = ['❤️', '💖', '💕', '💗', '💝'];
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

// 创建连击文字效果
function createComboText(streak) {
    const texts = {
        3: '🔥 三连!',
        5: '⚡ 五连击!',
        10: '💥 十连斩!',
        15: '🌟 超神!',
        20: '👑 无敌!'
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

// 创建+分数飘浮效果 - 更华丽
function createScorePopup(element, score, isCorrect) {
    const popup = document.createElement('div');
    popup.className = 'score-popup ' + (isCorrect ? 'correct' : 'wrong');
    popup.textContent = isCorrect ? '+' + score : '×';

    const rect = element.getBoundingClientRect();
    popup.style.left = (rect.left + rect.width / 2) + 'px';
    popup.style.top = rect.top + 'px';

    document.body.appendChild(popup);

    // 答对时添加能量波纹
    if (isCorrect) {
        createEnergyWave(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    setTimeout(() => popup.remove(), 1000);
}

// 显示成就弹窗
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

// 检查成就
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

// 打乱数组
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ===== 页面导航 =====

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
        App.currentPage = pageId;
    }
}

// ===== 数据持久化 =====

function saveProgress() {
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) return;

    const data = {
        stats: App.stats,
        wrongBook: App.wrongBook,
        settings: App.settings
    };
    localStorage.setItem(UserManager.getDataKey(currentUser.id), JSON.stringify(data));
}

function loadProgress() {
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) return;

    const saved = localStorage.getItem(UserManager.getDataKey(currentUser.id));
    if (saved) {
        try {
            const data = JSON.parse(saved);
            App.stats = { ...App.stats, ...data.stats };
            App.wrongBook = data.wrongBook || [];
            App.settings = { ...App.settings, ...data.settings };
        } catch (e) {
            console.error('加载数据失败', e);
        }
    } else {
        // 新用户，重置数据
        App.stats = {
            totalScore: 0,
            maxStreak: 0,
            totalCorrect: 0,
            achievements: [],
            todayCount: 0,
            todayDate: null
        };
        App.wrongBook = [];
    }
    updateHomeStats();
    applySettings();
}

function resetProgress() {
    const currentUser = UserManager.getCurrentUser();
    const userName = currentUser ? currentUser.name : '当前用户';
    if (confirm(`确定要重置 ${userName} 的所有进度吗？这将清除所有统计数据和错题本。`)) {
        App.stats = {
            totalScore: 0,
            maxStreak: 0,
            totalCorrect: 0,
            achievements: [],
            todayCount: 0,
            todayDate: null
        };
        App.wrongBook = [];
        saveProgress();
        updateHomeStats();
        alert('已重置所有进度');
    }
}

// ===== 用户界面 =====

function renderUserList() {
    const users = UserManager.getUsers();
    const userList = document.getElementById('user-list');

    if (users.length === 0) {
        userList.innerHTML = '<p class="no-users">还没有用户，点击下方添加</p>';
        return;
    }

    userList.innerHTML = users.map(user => {
        // 获取该用户的统计数据
        const userData = localStorage.getItem(UserManager.getDataKey(user.id));
        let statsText = '新用户';
        if (userData) {
            try {
                const data = JSON.parse(userData);
                statsText = `总分: ${data.stats?.totalScore || 0}`;
            } catch (e) {}
        }

        return `
            <div class="user-card" data-user-id="${user.id}">
                <button class="delete-user" data-user-id="${user.id}" title="删除用户">×</button>
                <span class="avatar">${user.avatar}</span>
                <span class="name">${user.name}</span>
                <span class="user-stats">${statsText}</span>
            </div>
        `;
    }).join('');

    // 绑定点击事件
    userList.querySelectorAll('.user-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-user')) return;
            const userId = card.dataset.userId;
            selectUser(userId);
        });
    });

    // 绑定删除按钮
    userList.querySelectorAll('.delete-user').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const userId = btn.dataset.userId;
            const users = UserManager.getUsers();
            const user = users.find(u => u.id === userId);
            if (user && confirm(`确定要删除用户 "${user.name}" 吗？所有数据将被清除。`)) {
                UserManager.deleteUser(userId);
                renderUserList();
            }
        });
    });
}

function selectUser(userId) {
    UserManager.setCurrentUser(userId);
    loadProgress();
    updateCurrentUserBadge();
    showPage('home');
}

function updateCurrentUserBadge() {
    const currentUser = UserManager.getCurrentUser();
    if (currentUser) {
        document.getElementById('current-avatar').textContent = currentUser.avatar;
        document.getElementById('current-name').textContent = currentUser.name;
    }
}

function showAddUserForm() {
    document.getElementById('new-user-form').classList.remove('hidden');
    document.getElementById('add-user-btn').style.display = 'none';
    document.getElementById('user-name-input').focus();
}

function hideAddUserForm() {
    document.getElementById('new-user-form').classList.add('hidden');
    document.getElementById('add-user-btn').style.display = 'flex';
    document.getElementById('user-name-input').value = '';
    // 重置头像选择
    document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelector('.avatar-option[data-avatar="👦"]').classList.add('selected');
}

function createNewUser() {
    const nameInput = document.getElementById('user-name-input');
    const name = nameInput.value.trim();

    if (!name) {
        alert('请输入名字');
        nameInput.focus();
        return;
    }

    const selectedAvatar = document.querySelector('.avatar-option.selected');
    const avatar = selectedAvatar ? selectedAvatar.dataset.avatar : '👦';

    const newUser = UserManager.addUser(name, avatar);
    hideAddUserForm();
    renderUserList();

    // 自动选择新用户
    selectUser(newUser.id);
}

function initUserPage() {
    renderUserList();

    // 添加用户按钮
    document.getElementById('add-user-btn').addEventListener('click', showAddUserForm);

    // 取消添加
    document.getElementById('cancel-add-user').addEventListener('click', hideAddUserForm);

    // 确认添加
    document.getElementById('confirm-add-user').addEventListener('click', createNewUser);

    // 回车键确认
    document.getElementById('user-name-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') createNewUser();
    });

    // 头像选择
    document.querySelectorAll('.avatar-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
        });
    });

    // 检查是否已有当前用户
    const currentUser = UserManager.getCurrentUser();
    if (currentUser) {
        // 直接进入首页
        loadProgress();
        updateCurrentUserBadge();
        showPage('home');
    }
}

// ===== 首页 =====

function updateHomeStats() {
    // 检查是否是新的一天，重置今日计数
    const today = new Date().toDateString();
    if (App.stats.todayDate !== today) {
        App.stats.todayDate = today;
        App.stats.todayCount = 0;
        saveProgress();
    }

    document.getElementById('streak-count').textContent = App.stats.maxStreak;
    document.getElementById('today-count').textContent = App.stats.todayCount;
    document.getElementById('total-score').textContent = App.stats.totalScore;
    document.getElementById('wrong-count').textContent = App.wrongBook.length;
}

// ===== 设置 =====

function applySettings() {
    // 主题
    document.documentElement.setAttribute('data-theme', App.settings.theme);

    // 更新设置页面的选中状态
    document.querySelectorAll('.setting-opt').forEach(btn => {
        const setting = btn.dataset.setting;
        const value = btn.dataset.value;
        btn.classList.toggle('active', App.settings[setting] === value);
    });
}

function changeSetting(setting, value) {
    App.settings[setting] = value;

    if (setting === 'count') {
        App.settings.count = parseInt(value);
    }

    saveProgress();
    applySettings();
}

// ===== 学习卡片 =====

function renderLearnContent(tab) {
    const content = document.getElementById('learn-content');
    const cards = MathData.learnCards[tab] || [];

    const cardsHtml = cards.map(card => `
        <div class="learn-card">
            <div class="learn-card-title">${card.title}</div>
            <div class="learn-card-content">
                ${card.items.map(item => `<span class="learn-item">${item}</span>`).join('')}
            </div>
        </div>
    `).join('');

    // 标签名称映射
    const tabNames = {
        xiaojiujiu: '小九九速算',
        times: '大九九表',
        multiply: '乘法速记',
        fraction: '分数小数',
        decimal: '小数规律',
        square: '平方数'
    };

    // 添加开始练习按钮
    const practiceBtn = `
        <button class="start-practice-btn" onclick="startPractice('${tab}'); showPage('practice');">
            开始练习 ${tabNames[tab] || tab} →
        </button>
    `;

    content.innerHTML = cardsHtml + practiceBtn;
}

// ===== 训练模块 =====

function startPractice(module) {
    App.currentModule = module;

    // 小九九模块显示模式选择页
    if (module === 'xiaojiujiu') {
        showPage('xiaojiujiu-mode');
        return;
    }

    // 获取题目
    let questions = [];

    if (module === 'wrong') {
        // 错题练习
        if (App.wrongBook.length === 0) {
            alert('错题本是空的，太棒了！');
            return;
        }
        questions = shuffle(App.wrongBook).slice(0, Math.min(App.settings.count, App.wrongBook.length));
    } else if (module === 'mixed') {
        // 综合训练 - 从所有模块随机抽取
        const allModules = ['xiaojiujiu', 'times', 'multiply', 'fraction', 'decimal', 'square'];
        allModules.forEach(m => {
            const moduleData = MathData[m][App.difficulty] || MathData[m].easy;
            questions.push(...moduleData);
        });
        questions = shuffle(questions).slice(0, App.settings.count);
    } else {
        // 单模块训练
        const moduleData = MathData[module];
        if (!moduleData) {
            alert('错误：找不到模块 ' + module + '\n请刷新页面重试');
            return;
        }

        const diffData = moduleData[App.difficulty] || moduleData.easy;
        questions = shuffle(diffData).slice(0, Math.min(App.settings.count, diffData.length));
    }

    // 初始化训练状态
    App.practice = {
        questions: questions,
        currentIndex: 0,
        correctCount: 0,
        streak: 0,
        startTime: Date.now(),
        timerInterval: null,
        timePerQuestion: App.difficulty === 'easy' ? 15 : (App.difficulty === 'normal' ? 10 : 7)
    };

    // 设置标题
    const titles = {
        xiaojiujiu: '🔥 小九九速算',
        times: '📊 大九九表',
        multiply: '🔢 乘法速记',
        fraction: '🔄 分数小数',
        decimal: '➗ 小数规律',
        square: '✖️ 平方数',
        mixed: '🎯 综合训练',
        wrong: '📖 错题练习'
    };
    document.getElementById('practice-title').textContent = titles[module] || '训练';

    // 显示/隐藏难度选择器
    document.getElementById('difficulty-selector').classList.toggle('hidden', module === 'wrong');

    // 显示训练页面
    showPage('practice');

    // 显示第一题
    showQuestion();
}

function showQuestion() {
    const { questions, currentIndex } = App.practice;

    if (currentIndex >= questions.length) {
        endPractice();
        return;
    }

    const question = questions[currentIndex];
    const questionCard = document.getElementById('question-card');
    const questionText = document.getElementById('question-text');
    const choices = document.getElementById('choices');
    const inputMode = document.getElementById('input-mode');

    // 更新进度（显示当前题号）
    document.getElementById('correct-count').textContent = currentIndex + 1;
    document.getElementById('total-count').textContent = questions.length;

    // 重置卡片状态
    questionCard.classList.remove('correct', 'wrong');

    // 显示题目（分数用上下格式显示）
    let questionHtml = formatFraction(question.q);

    // 如果是分数题，添加提示
    if (containsFraction(question.q) && App.currentModule === 'fraction') {
        const fractionMatch = question.q.match(/(\d+)\/(\d+)/);
        if (fractionMatch) {
            const num = fractionMatch[1];
            const den = fractionMatch[2];
            questionHtml += `<span class="fraction-hint">💡 提示：${num}÷${den}</span>`;
        }
    }

    questionText.innerHTML = questionHtml;

    // 更新连胜指示器
    const streakIndicator = document.getElementById('streak-indicator');
    const currentStreak = document.getElementById('current-streak');
    if (App.practice.streak >= 3) {
        streakIndicator.classList.add('active');
        currentStreak.textContent = App.practice.streak;
    } else {
        streakIndicator.classList.remove('active');
    }

    // 根据模式显示选项（forceInput 强制使用输入模式）
    const useInputMode = question.forceInput || App.settings.mode === 'input';

    if (!useInputMode) {
        // 选择题模式
        inputMode.classList.add('hidden');
        choices.classList.remove('hidden');

        const isDecimal = typeof question.a === 'number' && !Number.isInteger(question.a);
        const options = generateOptions(question.display || question.a, isDecimal, question.isText);

        // 选项也使用分数格式
        choices.innerHTML = options.map((opt, idx) =>
            `<button class="choice-btn" data-answer="${opt}"><span class="choice-num">${idx + 1}</span>${formatFraction(String(opt))}</button>`
        ).join('');

        // 绑定点击事件
        choices.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', () => checkAnswer(btn.dataset.answer, btn));
        });
    } else {
        // 填空题模式（输入答案）
        choices.classList.add('hidden');
        inputMode.classList.remove('hidden');

        const input = document.getElementById('answer-input');
        input.value = '';
        input.placeholder = question.forceInput ? '填写 ? 等于几' : '输入答案';

        // 添加填空题提示标签
        let hintLabel = questionCard.querySelector('.input-hint');
        if (question.forceInput) {
            if (!hintLabel) {
                hintLabel = document.createElement('div');
                hintLabel.className = 'input-hint';
                questionCard.insertBefore(hintLabel, questionCard.firstChild);
            }
            hintLabel.textContent = '✏️ 填空题';
            hintLabel.style.display = 'block';
        } else if (hintLabel) {
            hintLabel.style.display = 'none';
        }

        // 延迟聚焦，让动画完成后再弹出键盘
        setTimeout(() => {
            input.focus();
        }, 400);
    }

    // 移除选择题模式的提示标签
    if (!useInputMode) {
        const hintLabel = questionCard.querySelector('.input-hint');
        if (hintLabel) {
            hintLabel.style.display = 'none';
        }
    }

    // 计时器
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
            // 超时算错
            handleWrongAnswer(null);
        }
    }, 50);
}

function checkAnswer(userAnswer, btnElement) {
    const question = App.practice.questions[App.practice.currentIndex];
    const correctAnswer = question.display || question.a;

    // 停止计时器
    if (App.practice.timerInterval) {
        clearInterval(App.practice.timerInterval);
        document.getElementById('timer-bar').classList.remove('active');
    }

    // 禁用所有按钮
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.disabled = true;
        if (String(btn.dataset.answer) === String(correctAnswer)) {
            btn.classList.add('correct');
        }
    });

    // 判断对错
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

    // 显示+10分数飘浮
    if (btnElement) {
        createScorePopup(btnElement, 10, true);
    }

    // 更新连胜数字动画
    const streakNum = document.getElementById('current-streak');
    if (streakNum) {
        streakNum.classList.remove('pop');
        void streakNum.offsetWidth; // 强制重排以重新触发动画
        streakNum.classList.add('pop');
    }

    // 检查成就
    checkAchievements(App.practice.streak, App.stats.totalCorrect);

    // 连胜指示器里程碑效果
    const streakIndicator = document.getElementById('streak-indicator');
    if (App.practice.streak > 0 && App.practice.streak % 5 === 0) {
        streakIndicator.classList.add('milestone');
        setTimeout(() => streakIndicator.classList.remove('milestone'), 2000);
    }

    // 连胜特效 - 更丰富的庆祝
    const streak = App.practice.streak;

    if (streak === 3) {
        // 首次达到3连胜
        playSound('streak');
        createConfetti(25);
        createComboText(3);
    } else if (streak === 5) {
        // 5连胜
        playSound('streak');
        createConfetti(40);
        createComboText(5);
        if (btnElement) {
            const rect = btnElement.getBoundingClientRect();
            createStarBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);
        }
    } else if (streak === 10) {
        // 10连胜 - 超级庆祝
        playSound('achievement');
        createConfetti(80);
        createComboText(10);
        if (btnElement) {
            const rect = btnElement.getBoundingClientRect();
            createStarBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 15);
            createFloatingHearts(rect.left + rect.width / 2, rect.top, 8);
        }
    } else if (streak === 15) {
        // 15连胜 - 超神
        playSound('achievement');
        createConfetti(100);
        createComboText(15);
        if (btnElement) {
            const rect = btnElement.getBoundingClientRect();
            createStarBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
            createFloatingHearts(rect.left + rect.width / 2, rect.top, 12);
        }
    } else if (streak === 20) {
        // 20连胜 - 无敌
        playSound('complete');
        createConfetti(150);
        createComboText(20);
        if (btnElement) {
            const rect = btnElement.getBoundingClientRect();
            createStarBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
            createFloatingHearts(rect.left + rect.width / 2, rect.top, 15);
        }
    } else if (streak > 0 && streak % 5 === 0) {
        // 其他5的倍数
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

    // 显示正确答案（使用分数格式）
    const formattedQuestion = formatFraction(question.q);
    const formattedAnswer = formatFraction(String(correctAnswer));
    questionText.innerHTML = `${formattedQuestion}<br><span style="color: var(--success); font-size: 1.5rem;">正确答案: ${formattedAnswer}</span>`;

    App.practice.streak = 0;

    // 添加到错题本
    const wrongItem = {
        q: question.q,
        a: question.display || question.a,
        yourAnswer: userAnswer,
        timestamp: Date.now()
    };

    // 避免重复添加
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

    // 停止计时器
    if (App.practice.timerInterval) {
        clearInterval(App.practice.timerInterval);
        document.getElementById('timer-bar').classList.remove('active');
    }

    // 判断对错（数值比较或字符串比较）
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

    // 更新结果页
    document.getElementById('result-correct').textContent = correctCount;
    document.getElementById('result-total').textContent = questions.length;
    document.getElementById('result-time').textContent = totalTime + 's';
    document.getElementById('accuracy-fill').style.width = accuracy + '%';
    document.getElementById('accuracy-text').textContent = `正确率 ${accuracy}%`;

    // 根据正确率显示不同的表情、标题和鼓励语
    const resultIcon = document.getElementById('result-icon');
    const resultTitle = document.getElementById('result-title');
    const resultEncourage = document.getElementById('result-encourage');

    const encouragements = {
        excellent: [
            '你就是速算小天才！',
            '太厉害了，继续保持！',
            '数学王者非你莫属！'
        ],
        good: [
            '做得很棒，再接再厉！',
            '离满分只差一点点了！',
            '进步神速，为你点赞！'
        ],
        okay: [
            '每天进步一点点！',
            '坚持就是胜利！',
            '熟能生巧，继续练习！'
        ],
        needWork: [
            '先去看看速算秘籍吧！',
            '多练几次就会了！',
            '不要灰心，加油！'
        ]
    };

    if (accuracy >= 90) {
        resultIcon.textContent = '🎉';
        resultTitle.textContent = '太棒了！';
        resultEncourage.textContent = encouragements.excellent[Math.floor(Math.random() * 3)];
    } else if (accuracy >= 70) {
        resultIcon.textContent = '😊';
        resultTitle.textContent = '做得不错！';
        resultEncourage.textContent = encouragements.good[Math.floor(Math.random() * 3)];
    } else if (accuracy >= 50) {
        resultIcon.textContent = '💪';
        resultTitle.textContent = '继续加油！';
        resultEncourage.textContent = encouragements.okay[Math.floor(Math.random() * 3)];
    } else {
        resultIcon.textContent = '📚';
        resultTitle.textContent = '需要多练习';
        resultEncourage.textContent = encouragements.needWork[Math.floor(Math.random() * 3)];
    }

    updateHomeStats();
    showPage('result');

    // 根据成绩播放不同的音效和动画
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

// ===== 每日挑战 =====

function initDailyChallenge() {
    // 生成10道混合题目
    const allQuestions = [];
    const modules = ['xiaojiujiu', 'times', 'multiply', 'fraction', 'decimal', 'square'];

    modules.forEach(m => {
        const data = MathData[m].normal || MathData[m].easy;
        allQuestions.push(...data);
    });

    App.daily = {
        questions: shuffle(allQuestions).slice(0, 10),
        currentIndex: 0,
        results: [],
        startTime: null,
        timerInterval: null,
        completed: false
    };

    // 渲染进度点
    const dots = document.getElementById('progress-dots');
    dots.innerHTML = Array(10).fill(0).map((_, i) =>
        `<div class="progress-dot" data-index="${i}">${i + 1}</div>`
    ).join('');

    // 重置显示
    document.getElementById('daily-question-text').textContent = '准备好了吗？';
    document.getElementById('daily-timer').textContent = '00:00';
    document.getElementById('daily-choices').innerHTML =
        '<button class="start-daily-btn" id="start-daily">开始挑战！</button>';

    // 绑定开始按钮
    document.getElementById('start-daily').addEventListener('click', startDailyChallenge);
}

function startDailyChallenge() {
    App.daily.startTime = Date.now();

    // 开始计时
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

    // 更新进度点
    document.querySelectorAll('.progress-dot').forEach((dot, i) => {
        dot.classList.remove('current');
        if (i === currentIndex) {
            dot.classList.add('current');
        }
    });

    // 重置卡片状态
    questionCard.classList.remove('correct', 'wrong');

    // 显示题目（分数用上下格式显示）
    let questionHtml = formatFraction(question.q);

    // 如果是分数题，添加提示
    if (containsFraction(question.q)) {
        const fractionMatch = question.q.match(/(\d+)\/(\d+)/);
        if (fractionMatch) {
            const num = fractionMatch[1];
            const den = fractionMatch[2];
            questionHtml += `<span class="fraction-hint">💡 提示：${num}÷${den}</span>`;
        }
    }

    questionText.innerHTML = questionHtml;

    // 生成选项
    const isDecimal = typeof question.a === 'number' && !Number.isInteger(question.a);
    const options = generateOptions(question.display || question.a, isDecimal, question.isText);

    // 选项也使用分数格式
    choices.innerHTML = options.map((opt, idx) =>
        `<button class="choice-btn" data-answer="${opt}"><span class="choice-num">${idx + 1}</span>${formatFraction(String(opt))}</button>`
    ).join('');

    // 绑定点击事件
    choices.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => checkDailyAnswer(btn.dataset.answer, btn));
    });
}

function checkDailyAnswer(userAnswer, btnElement) {
    const question = App.daily.questions[App.daily.currentIndex];
    const correctAnswer = question.display || question.a;
    const questionCard = document.getElementById('daily-question-card');

    // 禁用所有按钮
    document.querySelectorAll('#daily-choices .choice-btn').forEach(btn => {
        btn.disabled = true;
        if (String(btn.dataset.answer) === String(correctAnswer)) {
            btn.classList.add('correct');
        }
    });

    const isCorrect = String(userAnswer) === String(correctAnswer);

    // 记录结果
    App.daily.results.push(isCorrect);

    // 更新进度点
    const dot = document.querySelector(`.progress-dot[data-index="${App.daily.currentIndex}"]`);
    dot.classList.remove('current');
    dot.classList.add(isCorrect ? 'correct' : 'wrong');

    // 视觉反馈
    questionCard.classList.add(isCorrect ? 'correct' : 'wrong');
    if (!isCorrect && btnElement) {
        btnElement.classList.add('wrong');

        // 添加到错题本
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

    // 下一题
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

    // 检查每日挑战成就
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

    // 更新统计
    App.stats.totalScore += correctCount * 15;
    App.stats.totalCorrect += correctCount;
    App.stats.todayCount += 10; // 更新今日练习计数
    saveProgress();
    updateHomeStats();

    // 显示结果
    document.getElementById('result-correct').textContent = correctCount;
    document.getElementById('result-total').textContent = 10;
    document.getElementById('result-time').textContent = totalTime + 's';
    document.getElementById('accuracy-fill').style.width = accuracy + '%';
    document.getElementById('accuracy-text').textContent = `正确率 ${accuracy}%`;

    const resultIcon = document.getElementById('result-icon');
    const resultTitle = document.getElementById('result-title');
    const resultEncourage = document.getElementById('result-encourage');

    const encouragements = {
        perfect: [
            '你就是速算小天才！',
            '无人能敌，太完美了！',
            '数学王者非你莫属！'
        ],
        excellent: [
            '太厉害了，继续保持！',
            '离满分只差一点点！',
            '进步神速，为你点赞！'
        ],
        good: [
            '做得很棒，再接再厉！',
            '每天进步一点点！',
            '坚持就是胜利！'
        ],
        needWork: [
            '先去看看速算秘籍吧！',
            '多练几次就会了！',
            '不要灰心，加油！'
        ]
    };

    if (correctCount === 10) {
        resultIcon.textContent = '👑';
        resultTitle.textContent = '完美通关！';
        resultEncourage.textContent = encouragements.perfect[Math.floor(Math.random() * 3)];
    } else if (correctCount >= 8) {
        resultIcon.textContent = '🎉';
        resultTitle.textContent = '挑战成功！';
        resultEncourage.textContent = encouragements.excellent[Math.floor(Math.random() * 3)];
    } else if (correctCount >= 6) {
        resultIcon.textContent = '💪';
        resultTitle.textContent = '表现不错！';
        resultEncourage.textContent = encouragements.good[Math.floor(Math.random() * 3)];
    } else {
        resultIcon.textContent = '📚';
        resultTitle.textContent = '继续努力！';
        resultEncourage.textContent = encouragements.needWork[Math.floor(Math.random() * 3)];
    }

    showPage('result');

    // 根据成绩播放不同的音效和动画
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

// ===== 错题本 =====

function renderWrongBook() {
    const list = document.getElementById('wrong-list');
    const empty = document.getElementById('wrong-empty');
    const actions = document.getElementById('wrong-actions');

    if (App.wrongBook.length === 0) {
        list.innerHTML = '';
        empty.classList.remove('hidden');
        actions.classList.add('hidden');
        return;
    }

    empty.classList.add('hidden');
    actions.classList.remove('hidden');

    list.innerHTML = App.wrongBook.map((item, index) => `
        <div class="wrong-item" data-index="${index}">
            <div class="wrong-info">
                <span class="wrong-question">${item.q}</span>
                <div class="wrong-answer">
                    <span class="wrong-your">${item.yourAnswer || '超时'}</span>
                    <span class="wrong-correct">${item.a}</span>
                </div>
            </div>
            <button class="delete-wrong-btn" onclick="deleteWrongItem(${index})">✕</button>
        </div>
    `).join('');
}

function clearWrongBook() {
    if (App.wrongBook.length === 0) return;

    if (confirm('确定要清空错题本吗？')) {
        App.wrongBook = [];
        saveProgress();
        renderWrongBook();
        updateHomeStats();
    }
}

// 删除单个错题
function deleteWrongItem(index) {
    App.wrongBook.splice(index, 1);
    saveProgress();
    renderWrongBook();
    updateHomeStats();
}

// 渲染成就页面
function renderAchievements() {
    const grid = document.getElementById('achievements-grid');
    const unlockedAchievements = App.stats.achievements || [];

    grid.innerHTML = MathData.achievements.map(achievement => {
        const isUnlocked = unlockedAchievements.includes(achievement.id);
        return `
            <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-card-icon">${isUnlocked ? achievement.icon : '🔒'}</div>
                <div class="achievement-card-name">${achievement.name}</div>
                <div class="achievement-card-desc">${achievement.desc}</div>
            </div>
        `;
    }).join('');
}

// ===== 事件绑定 =====

function initEventListeners() {
    // 菜单按钮
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const module = btn.dataset.module;

            if (module === 'learn') {
                showPage('learn');
                renderLearnContent('xiaojiujiu');
            } else if (module === 'daily') {
                App.currentModule = 'daily'; // 设置 currentModule
                showPage('daily');
                initDailyChallenge();
            } else if (module === 'wrong') {
                showPage('wrong');
                renderWrongBook();
            } else {
                startPractice(module);
            }
        });
    });

    // 返回按钮
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // 清理计时器
            if (App.practice.timerInterval) {
                clearInterval(App.practice.timerInterval);
            }
            if (App.daily.timerInterval) {
                clearInterval(App.daily.timerInterval);
            }

            showPage(btn.dataset.target);
            updateHomeStats();
        });
    });

    // 快速开始按钮
    document.getElementById('quick-start').addEventListener('click', () => {
        const modules = ['multiply', 'fraction', 'decimal', 'square', 'mixed'];
        const randomModule = modules[Math.floor(Math.random() * modules.length)];
        startPractice(randomModule);
    });

    // 成就按钮
    document.getElementById('achievements-btn').addEventListener('click', () => {
        renderAchievements();
        showPage('achievements');
    });

    // 设置按钮
    document.getElementById('settings-btn').addEventListener('click', () => {
        showPage('settings');
    });

    // 设置选项
    document.querySelectorAll('.setting-opt').forEach(btn => {
        btn.addEventListener('click', () => {
            changeSetting(btn.dataset.setting, btn.dataset.value);
        });
    });

    // 重置进度
    document.getElementById('reset-progress').addEventListener('click', resetProgress);

    // 难度选择
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            App.difficulty = btn.dataset.diff;
        });
    });

    // 学习页面标签
    document.querySelectorAll('.learn-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.learn-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderLearnContent(tab.dataset.tab);
        });
    });

    // 填空题提交
    document.getElementById('submit-btn').addEventListener('click', submitInputAnswer);
    document.getElementById('answer-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitInputAnswer();
        }
    });

    // 错题本操作
    document.getElementById('clear-wrong').addEventListener('click', clearWrongBook);
    document.getElementById('practice-wrong').addEventListener('click', () => {
        startPractice('wrong');
    });

    // 结果页按钮
    document.getElementById('retry-btn').addEventListener('click', () => {
        if (App.currentModule === 'daily') {
            showPage('daily');
            initDailyChallenge();
        } else {
            startPractice(App.currentModule);
        }
    });

    document.getElementById('home-btn').addEventListener('click', () => {
        showPage('home');
        updateHomeStats();
    });

    // 成就弹窗点击关闭
    document.getElementById('achievement-popup').addEventListener('click', () => {
        const popup = document.getElementById('achievement-popup');
        popup.classList.remove('show');
        setTimeout(() => popup.classList.add('hidden'), 300);
    });
}

// ===== 初始化 =====

document.addEventListener('DOMContentLoaded', () => {
    // 初始化用户页面
    initUserPage();
    initEventListeners();

    // 点击用户徽章切换用户
    document.getElementById('current-user-badge').addEventListener('click', () => {
        showPage('user');
        renderUserList();
    });

    // 防止iOS双击缩放
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // 防止iOS Safari下拉刷新
    document.body.addEventListener('touchmove', (e) => {
        if (e.target.closest('.learn-content, .wrong-list, .settings-list, .achievements-grid')) {
            return; // 允许这些区域滚动
        }
        if (document.body.scrollTop === 0) {
            // e.preventDefault(); // 顶部时阻止
        }
    }, { passive: true });

    // iOS 独立模式检测
    if (window.navigator.standalone === true) {
        document.body.classList.add('ios-standalone');
    }

    // 处理 iOS 软键盘 - 增强版
    const answerInput = document.getElementById('answer-input');

    // 使用 visualViewport API 检测键盘
    if (window.visualViewport) {
        let initialHeight = window.visualViewport.height;

        window.visualViewport.addEventListener('resize', () => {
            const currentHeight = window.visualViewport.height;
            const heightDiff = initialHeight - currentHeight;

            // 如果高度差超过150px，认为键盘弹出了
            if (heightDiff > 150) {
                document.body.classList.add('keyboard-active');
                // 滚动到输入框
                if (document.activeElement === answerInput) {
                    setTimeout(() => {
                        answerInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                }
            } else {
                document.body.classList.remove('keyboard-active');
            }
        });
    }

    // 输入框焦点处理
    if (answerInput) {
        answerInput.addEventListener('focus', () => {
            document.body.classList.add('keyboard-active');
            // 延迟滚动，等待键盘完全弹出
            setTimeout(() => {
                // 确保输入框可见
                const questionCard = document.getElementById('question-card');
                if (questionCard) {
                    questionCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                setTimeout(() => {
                    answerInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 150);
            }, 300);
        });

        answerInput.addEventListener('blur', () => {
            // 延迟移除，避免闪烁
            setTimeout(() => {
                if (document.activeElement !== answerInput) {
                    document.body.classList.remove('keyboard-active');
                    // 恢复滚动位置
                    window.scrollTo(0, 0);
                }
            }, 100);
        });
    }

    // 处理其他输入框
    document.querySelectorAll('input:not(#answer-input)').forEach(input => {
        input.addEventListener('focus', () => {
            setTimeout(() => {
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });

    // 键盘快捷键支持（1234选择答案）
    document.addEventListener('keydown', (e) => {
        if (App.currentPage === 'practice' || App.currentPage === 'daily' || App.currentPage === 'battle') {
            const key = e.key;
            if (['1', '2', '3', '4'].includes(key)) {
                let choicesContainer;
                if (App.currentPage === 'battle') {
                    choicesContainer = document.getElementById('battle-choices');
                } else if (App.currentPage === 'daily') {
                    choicesContainer = document.getElementById('daily-choices');
                } else {
                    choicesContainer = document.getElementById('choices');
                }
                const buttons = choicesContainer.querySelectorAll('.battle-choice-btn:not(:disabled), .choice-btn:not(:disabled)');
                const index = parseInt(key) - 1;
                if (buttons[index]) {
                    buttons[index].click();
                }
            }
        }
    });

    // ===== 战斗模式初始化 =====
    BattleMode.init();
});

// ===== 战斗模式模块 =====
const BattleMode = {
    // ===== 宝可梦风格怪兽 - 有点恐怖又有点可爱 =====
    // 参考宝可梦的命名风格和角色设计

    // 初级怪兽（简单模式用）- HP 3-4
    easyMonsters: [
        // 幽灵可爱系
        {
            id: 'pupu_ghost', name: '噗噗鬼', nameEn: 'Pupu Ghost', emoji: '👻', hp: 3, type: 'ghost',
            attack: '👅', attackName: '舔舔攻击', quips: ['噗噗~', '舔舔你~', '嘻嘻嘻!'],
            trait: '喜欢恶作剧的小幽灵', traitEn: 'A mischievous little ghost who loves pranks',
            story: '噗噗鬼是数学世界里最可爱的小幽灵。它总是躲在算式后面，等小朋友一答对题目就开心地跳出来说"噗噗"！据说它最怕的就是乘法表背得特别熟的小朋友。',
            storyEn: 'Pupu Ghost is the cutest little ghost in Math World. It always hides behind equations and happily jumps out saying "Pupu" when kids answer correctly! Legend says it fears children who have memorized their times tables.'
        },
        {
            id: 'blinky', name: '眨眨眼', nameEn: 'Blinky', emoji: '👁️', hp: 3, type: 'psychic',
            attack: '💫', attackName: '瞪眼术', quips: ['看着你~', '眨眨~', '盯——'],
            trait: '能看穿一切的神秘眼睛', traitEn: 'A mysterious eye that sees everything',
            story: '眨眨眼其实是一只害羞的小妖怪。它用大眼睛盯着你看，其实只是想交朋友！当你做对数学题时，它会开心地眨眨眼表示称赞。',
            storyEn: 'Blinky is actually a shy little monster. When it stares at you with its big eye, it just wants to make friends! It blinks happily to praise you when you solve math problems correctly.'
        },
        {
            id: 'shadow_kid', name: '小黑影', nameEn: 'Shadow Kid', emoji: '🫥', hp: 3, type: 'dark',
            attack: '🖤', attackName: '影子偷袭', quips: ['嘿嘿~', '找不到我~', '在这里!'],
            trait: '爱玩捉迷藏的影子精灵', traitEn: 'A shadow spirit who loves hide and seek',
            story: '小黑影住在每个人的影子里。它最喜欢在你做数学题时偷偷出来玩。如果你算得又快又准，它就会害羞地躲回影子里，因为它觉得你太厉害了！',
            storyEn: 'Shadow Kid lives in everyone\'s shadow. It loves to come out and play when you\'re doing math. If you calculate fast and accurately, it shyly hides back in your shadow because it thinks you\'re amazing!'
        },
        {
            id: 'fortune_ball', name: '咕噜球', nameEn: 'Fortune Ball', emoji: '🔮', hp: 4, type: 'psychic',
            attack: '✨', attackName: '神秘光线', quips: ['咕噜噜~', '预言中...', '命运呀~'],
            trait: '能预测答案的水晶球', traitEn: 'A crystal ball that predicts answers',
            story: '咕噜球是一个会预言的小水晶球妖怪。它总是说"我看到你的未来...你会算对这道题！"虽然有时候预言不太准，但它的鼓励总能给小朋友信心。',
            storyEn: 'Fortune Ball is a fortune-telling crystal ball monster. It always says "I see your future... you will solve this problem!" Though its predictions aren\'t always accurate, its encouragement gives kids confidence.'
        },
        // 毒系可爱
        {
            id: 'toxic_shroom', name: '毒毒菇', nameEn: 'Toxic Shroom', emoji: '🍄', hp: 3, type: 'poison',
            attack: '☁️', attackName: '毒孢子', quips: ['毒毒~', '别吃我!', '孢子喷!'],
            trait: '颜色鲜艳但心地善良', traitEn: 'Colorful but kind-hearted',
            story: '毒毒菇看起来很危险，但其实它的"毒"只是让人打喷嚏而已。它住在数学森林里，用彩色的帽子吸引小朋友来做算术题。答对了就能摘到美味的无毒小蘑菇当奖励！',
            storyEn: 'Toxic Shroom looks dangerous, but its "poison" only makes you sneeze. Living in Math Forest, it uses its colorful cap to attract kids to do arithmetic. Answer correctly and you can pick delicious non-toxic mushrooms as a reward!'
        },
        {
            id: 'hissy', name: '嘶嘶蛇', nameEn: 'Hissy', emoji: '🐍', hp: 4, type: 'poison',
            attack: '💜', attackName: '毒牙咬', quips: ['嘶嘶~', '咬一口~', '毒毒哒!'],
            trait: '其实很怕冷的小蛇', traitEn: 'A little snake that\'s actually afraid of cold',
            story: '嘶嘶蛇喜欢用身体摆出数字的形状。它最拿手的就是摆出"8"，因为那是它盘起来睡觉的姿势！冬天的时候它会请求小朋友多做几道题，用脑袋发热来给它取暖。',
            storyEn: 'Hissy loves to shape numbers with its body. It\'s best at making "8" because that\'s how it curls up to sleep! In winter, it asks kids to solve more problems so the heat from thinking can keep it warm.'
        },
        {
            id: 'stinky_flower', name: '臭臭花', nameEn: 'Stinky Flower', emoji: '🌸', hp: 3, type: 'poison',
            attack: '💨', attackName: '臭气弹', quips: ['臭臭~', '闻闻看~', '香香的?'],
            trait: '以为自己很香的小花', traitEn: 'A flower that thinks it smells nice',
            story: '臭臭花一直以为自己是世界上最香的花。每次放出"香气"时都很得意，完全不知道大家都在捂鼻子。但只要你答对题目，它就会收起臭气，送你一朵真正香香的小花！',
            storyEn: 'Stinky Flower always thinks it\'s the most fragrant flower in the world. It\'s proud when releasing its "perfume," not knowing everyone is holding their noses. But answer correctly, and it gives you a truly fragrant flower!'
        },
        // 火系小怪
        {
            id: 'puff_flame', name: '呼呼焰', nameEn: 'Puff Flame', emoji: '🔥', hp: 3, type: 'fire',
            attack: '✨', attackName: '火星溅', quips: ['呼呼~', '烫烫!', '着火啦!'],
            trait: '一激动就冒火星', traitEn: 'Sparks fly when excited',
            story: '呼呼焰是从计算器里蹦出来的小火苗。当小朋友按计算器按得太快时，它就会被"算"出来！它最喜欢9×9=81这道题，因为答案让它感觉暖暖的。',
            storyEn: 'Puff Flame is a little flame that bounced out of a calculator. When kids press calculator buttons too fast, it gets "calculated" out! Its favorite is 9×9=81 because the answer makes it feel warm.'
        },
        {
            id: 'fire_monkey', name: '烈烈猴', nameEn: 'Fire Monkey', emoji: '🐒', hp: 4, type: 'fire',
            attack: '🔥', attackName: '火焰拳', quips: ['吱吱!', '猴拳!', '跳跳烧!'],
            trait: '永远充满活力的火猴', traitEn: 'An energetic fire monkey',
            story: '烈烈猴一刻也停不下来，它用跳来跳去消耗身上的火焰能量。如果不动就会越来越热！它发明了"火焰算术操"，边跳边背乘法表，现在已经是数学体操冠军了。',
            storyEn: 'Fire Monkey can\'t stop moving - it jumps around to burn off its flame energy. If it stops, it gets hotter! It invented "Flame Math Exercise," doing multiplication while jumping, and is now the Math Gymnastics champion.'
        },
        // 水系小怪
        {
            id: 'bubbles', name: '泡泡怪', nameEn: 'Bubbles', emoji: '🫧', hp: 3, type: 'water',
            attack: '💦', attackName: '泡泡攻击', quips: ['泡泡~', '咕噜噜~', '湿湿的!'],
            trait: '住在泡泡里的小精灵', traitEn: 'A sprite living in bubbles',
            story: '泡泡怪住在一个永远不会破的魔法泡泡里。它喜欢把数学题写在泡泡上飘给小朋友。如果你算对了，它会开心地吹出彩虹泡泡作为奖励！',
            storyEn: 'Bubbles lives in a magic bubble that never pops. It loves writing math problems on bubbles and floating them to kids. Answer correctly, and it happily blows rainbow bubbles as a reward!'
        },
        {
            id: 'inky', name: '墨墨鱼', nameEn: 'Inky', emoji: '🦑', hp: 4, type: 'water',
            attack: '🖤', attackName: '墨汁喷射', quips: ['喷喷~', '墨墨黑~', '缠住你!'],
            trait: '用墨汁写字的小章鱼', traitEn: 'A squid that writes with ink',
            story: '墨墨鱼有八只触手，可以同时写八道算式！它是海底学校的数学老师，用自己的墨汁当墨水。据说它喷出的特殊墨汁写的答案永远不会错。',
            storyEn: 'Inky has eight tentacles that can write eight equations at once! It\'s a math teacher at the underwater school, using its own ink. Legend says answers written with its special ink are never wrong.'
        },
        // 恐怖可爱混合
        {
            id: 'fang_monster', name: '牙牙怪', nameEn: 'Fang Monster', emoji: '👹', hp: 4, type: 'dark',
            attack: '🦷', attackName: '獠牙撕咬', quips: ['嘿嘿~', '牙痒痒~', '咬咬!'],
            trait: '其实是素食主义者', traitEn: 'Actually a vegetarian',
            story: '牙牙怪有着吓人的大獠牙，但其实它只吃蔬菜！那些大牙齿是用来嚼胡萝卜的。它装凶只是想提醒小朋友："要像我咬蔬菜一样，一口一口'咬'掉数学题！"',
            storyEn: 'Fang Monster has scary big fangs, but actually only eats vegetables! Those big teeth are for chewing carrots. It acts fierce to remind kids: "Bite through math problems like I bite vegetables - one bite at a time!"'
        },
        {
            id: 'bone_boy', name: '骨骨仔', nameEn: 'Bone Boy', emoji: '💀', hp: 3, type: 'ghost',
            attack: '🦴', attackName: '骨头飞', quips: ['咔咔~', '骨头响~', '接骨头!'],
            trait: '爱跳骨头舞的小骷髅', traitEn: 'A skeleton who loves bone dancing',
            story: '骨骨仔是个爱跳舞的小骷髅。它的骨头可以拆下来拼成数字！它最喜欢的游戏是用骨头拼出算式答案，但有时候会把自己拼错，变成奇怪的形状，逗得大家哈哈大笑。',
            storyEn: 'Bone Boy is a dancing skeleton. Its bones can be removed and arranged into numbers! Its favorite game is spelling answers with bones, but sometimes it arranges itself wrong into funny shapes, making everyone laugh.'
        },
        {
            id: 'batty', name: '蝙蝙侠', nameEn: 'Batty', emoji: '🦇', hp: 4, type: 'flying',
            attack: '🔊', attackName: '超声尖叫', quips: ['吱吱~', '黑夜来~', '听到了吗?'],
            trait: '喜欢倒挂着做题', traitEn: 'Likes to solve problems upside down',
            story: '蝙蝙侠总是倒挂着，所以它看数字都是反的！6变成9，9变成6。这让它做乘法时总是搞混。但正因为如此，它发明了"倒立数学法"，帮助小朋友记住6和9的区别。',
            storyEn: 'Batty always hangs upside down, so it sees numbers reversed! 6 becomes 9, 9 becomes 6. This confuses its multiplication. But because of this, it invented "Upside-Down Math" to help kids tell 6 and 9 apart.'
        },
        {
            id: 'weird_ball', name: '怪怪球', nameEn: 'Weird Ball', emoji: '👾', hp: 3, type: 'normal',
            attack: '💫', attackName: '怪异冲撞', quips: ['哔哔~', '外星来的~', '变形!'],
            trait: '来自外星的数学迷', traitEn: 'A math fan from outer space',
            story: '怪怪球是从外星来地球学习"地球数学"的小外星人。在它的星球上，1+1=3！所以它来地球重新学习数学。现在它已经是九九乘法表的专家了，经常发信息回母星分享学习心得。',
            storyEn: 'Weird Ball is an alien who came to Earth to learn "Earth Math." On its planet, 1+1=3! So it came to relearn math. Now it\'s an expert at times tables and often sends messages home sharing what it learned.'
        },
    ],

    // 中级怪兽（普通模式用）- HP 4-6
    normalMonsters: [
        // 幽灵恐怖系
        {
            id: 'ghost_lantern', name: '幽幽灯', nameEn: 'Ghost Lantern', emoji: '🕯️', hp: 4, type: 'ghost',
            attack: '🔥', attackName: '鬼火焚烧', quips: ['幽幽~', '灵魂之火~', '别吹灭!'],
            trait: '照亮黑暗中的数学题', traitEn: 'Illuminates math problems in the dark',
            story: '幽幽灯是由100根用完的铅笔变成的。这些铅笔都曾被小朋友用来做数学作业，写完最后一个字就化作幽幽灯的火焰。它的光能让任何隐藏的数学题显形。',
            storyEn: 'Ghost Lantern formed from 100 used-up pencils. These pencils were all used by kids for math homework, becoming flames after writing their last word. Its light can reveal any hidden math problem.'
        },
        {
            id: 'pumpkin_king', name: '南瓜王', nameEn: 'Pumpkin King', emoji: '🎃', hp: 5, type: 'ghost',
            attack: '🔮', attackName: '暗影球', quips: ['嘿嘿~', '万圣节到!', '南瓜炸弹!'],
            trait: '万圣节数学派对主持人', traitEn: 'Host of the Halloween Math Party',
            story: '每年万圣节，南瓜王都会举办数学派对。它会在南瓜里塞满糖果，只要答对乘法题就能拿一颗！它的头可以摘下来当计算器用，按它的鼻子就会显示答案。',
            storyEn: 'Every Halloween, Pumpkin King hosts a math party. It fills pumpkins with candy - solve multiplication problems to get one! Its head can be removed and used as a calculator - press its nose to show the answer.'
        },
        {
            id: 'curse_doll', name: '咒咒娃', nameEn: 'Curse Doll', emoji: '🪆', hp: 5, type: 'ghost',
            attack: '📍', attackName: '诅咒针', quips: ['咒咒~', '戳戳你~', '痛不痛?'],
            trait: '被遗弃的玩具变成的妖怪', traitEn: 'A monster from an abandoned toy',
            story: '咒咒娃原本是一个被遗忘在阁楼里的套娃。它太孤单了，就学会了数学来打发时间。现在它会用"诅咒"帮助粗心的小朋友——如果你计算错误，它会让你的手"不由自主"地写出正确答案！',
            storyEn: 'Curse Doll was a nesting doll forgotten in an attic. So lonely, it learned math to pass time. Now it uses "curses" to help careless kids - if you calculate wrong, it makes your hand "involuntarily" write the correct answer!'
        },
        {
            id: 'night_owl', name: '夜哭鸟', nameEn: 'Night Owl', emoji: '🦉', hp: 4, type: 'ghost',
            attack: '🌙', attackName: '夜啼', quips: ['咕咕~', '夜深了~', '失眠吧!'],
            trait: '专门守护夜间学习的猫头鹰', traitEn: 'An owl guarding night study sessions',
            story: '夜哭鸟是所有熬夜做作业的小朋友的守护神。它的叫声听起来很吓人，但其实是在提醒："太晚了，明天再做！"如果你非要熬夜，它会陪着你，用咕咕声报出正确答案。',
            storyEn: 'Night Owl is the guardian of all kids doing late-night homework. Its cry sounds scary but actually reminds you: "Too late, do it tomorrow!" If you must stay up, it keeps you company, hooting out correct answers.'
        },
        // 毒系恐怖
        {
            id: 'toxic_slime', name: '毒液怪', nameEn: 'Toxic Slime', emoji: '🧪', hp: 5, type: 'poison',
            attack: '💜', attackName: '腐蚀液', quips: ['滋滋~', '溶解你~', '酸酸的!'],
            trait: '能溶解错误答案', traitEn: 'Can dissolve wrong answers',
            story: '毒液怪是从化学实验室逃出来的实验品。它的液体只会溶解写错的答案，正确答案反而会变得更清晰！很多小朋友都偷偷请它帮忙检查作业。',
            storyEn: 'Toxic Slime escaped from a chemistry lab. Its liquid only dissolves wrong answers while making correct ones clearer! Many kids secretly ask it to check their homework.'
        },
        {
            id: 'spider_lady', name: '蜘蛛娘', nameEn: 'Spider Lady', emoji: '🕷️', hp: 5, type: 'bug',
            attack: '🕸️', attackName: '蛛网陷阱', quips: ['丝丝~', '网住你~', '逃不掉!'],
            trait: '用蛛丝编织知识网', traitEn: 'Weaves knowledge webs with silk',
            story: '蜘蛛娘用银色的蛛丝编织"知识网"。每当小朋友学会新的数学知识，她就在网上加一根新丝线。她说学得越多，网就越大越美丽，还能用来接住从天上掉下来的灵感！',
            storyEn: 'Spider Lady weaves "knowledge webs" with silver silk. When kids learn new math, she adds a new thread. She says the more you learn, the bigger and more beautiful the web becomes, and it can catch inspiration falling from the sky!'
        },
        {
            id: 'nightmare_beast', name: '噩梦兽', nameEn: 'Nightmare Beast', emoji: '😱', hp: 5, type: 'dark',
            attack: '💭', attackName: '恐惧波', quips: ['怕怕~', '做噩梦~', '哈哈哈!'],
            trait: '吃掉数学恐惧的怪兽', traitEn: 'A monster that eats math fear',
            story: '噩梦兽其实是个好妖怪！它专门吃小朋友对数学的恐惧。每当有人害怕数学考试，它就会出现把恐惧吃掉。吃完后它会打个大大的嗝，然后你就会觉得数学其实很有趣！',
            storyEn: 'Nightmare Beast is actually a good monster! It eats kids\' fear of math. When someone fears a math test, it appears to eat that fear. After eating, it burps loudly, and you\'ll find math is actually fun!'
        },
        // 冰系恐怖
        {
            id: 'ice_spirit', name: '冰魂灵', nameEn: 'Ice Spirit', emoji: '🥶', hp: 4, type: 'ice',
            attack: '❄️', attackName: '冰冻吐息', quips: ['冷冷~', '冻僵吧~', '好冰!'],
            trait: '来自北极的数学精灵', traitEn: 'A math spirit from the Arctic',
            story: '冰魂灵来自北极，身体由永不融化的魔法冰晶组成。它最喜欢把数学题冻在冰块里，让小朋友用脑袋的热量把冰融化来看题目。它说这样可以让大脑"热身"！',
            storyEn: 'Ice Spirit is from the Arctic, made of magic ice that never melts. It loves freezing math problems in ice blocks, letting kids melt them with brain heat to see the problems. It says this "warms up" the brain!'
        },
        {
            id: 'snow_fairy', name: '雪妖精', nameEn: 'Snow Fairy', emoji: '⛄', hp: 5, type: 'ice',
            attack: '🌨️', attackName: '暴风雪', quips: ['飘飘~', '雪花飞~', '白茫茫!'],
            trait: '用雪花写字的妖精', traitEn: 'A fairy that writes with snowflakes',
            story: '雪妖精可以控制每一片雪花的形状。它把数学公式写在雪花上从天上飘下来，整个冬天都像是一场"数学雪"。收集够100片公式雪花，就能堆出一个会说话的智慧雪人！',
            storyEn: 'Snow Fairy controls each snowflake\'s shape. It writes math formulas on snowflakes that float down from the sky, making winter a "math snow." Collect 100 formula snowflakes to build a talking wisdom snowman!'
        },
        // 格斗恶系
        {
            id: 'fury_fist', name: '怒怒拳', nameEn: 'Fury Fist', emoji: '👊', hp: 5, type: 'fighting',
            attack: '💢', attackName: '愤怒连击', quips: ['嘿哈!', '生气了!', '揍你!'],
            trait: '越算越有力气', traitEn: 'Gets stronger with each calculation',
            story: '怒怒拳是个超级热血的小妖怪。它相信"数学就是力量"！每算对一道题，它的拳头就会变大一点。它的梦想是算够10000道题，那时候它的拳头就能打碎小行星！',
            storyEn: 'Fury Fist is a super passionate little monster. It believes "Math is Power!" With each correct answer, its fists grow bigger. Its dream is to solve 10,000 problems - then its fists can smash asteroids!'
        },
        {
            id: 'shadow_ninja', name: '影忍者', nameEn: 'Shadow Ninja', emoji: '🥷', hp: 5, type: 'dark',
            attack: '🗡️', attackName: '暗影斩', quips: ['嘘...', '无声无息~', '背后!'],
            trait: '来无影去无踪的数学高手', traitEn: 'A math master who comes and goes silently',
            story: '影忍者是数学忍者学院的优等生。它可以在0.1秒内算出任何乘法，然后消失在影子里。它教导小朋友："速算就像忍术，要快、准、狠！"',
            storyEn: 'Shadow Ninja is a top student at the Math Ninja Academy. It can calculate any multiplication in 0.1 seconds, then vanish into shadows. It teaches kids: "Speed math is like ninjutsu - fast, accurate, and decisive!"'
        },
        // 岩石系
        {
            id: 'stone_face', name: '石头精', nameEn: 'Stone Face', emoji: '🗿', hp: 6, type: 'rock',
            attack: '💥', attackName: '岩石崩', quips: ['石头脸~', '硬邦邦~', '砸!'],
            trait: '世界上最有耐心的老师', traitEn: 'The most patient teacher in the world',
            story: '石头精已经在数学山上站了一万年，见证了无数小朋友学习数学。它的表情永远不变，因为它知道：学数学需要耐心，就像石头一样稳定。它会一直等到你算出正确答案。',
            storyEn: 'Stone Face has stood on Math Mountain for 10,000 years, witnessing countless kids learn math. Its expression never changes because it knows: learning math needs patience, stable like stone. It will wait until you find the correct answer.'
        },
        {
            id: 'diamond_beast', name: '钻石兽', nameEn: 'Diamond Beast', emoji: '💎', hp: 5, type: 'rock',
            attack: '✨', attackName: '钻石风暴', quips: ['闪闪~', '最硬的~', '切割!'],
            trait: '全身由正确答案组成', traitEn: 'Made entirely of correct answers',
            story: '钻石兽的身体是由无数正确答案结晶而成的。每个闪亮的切面都刻着一道算式。据说集齐它身上所有的算式，就能获得"数学之心"——永远不会算错的神奇能力！',
            storyEn: 'Diamond Beast\'s body crystallized from countless correct answers. Each shiny facet has an equation carved in it. Legend says collecting all its equations grants the "Math Heart" - the magical ability to never calculate wrong!'
        },
        // 电系
        {
            id: 'thunder_mouse', name: '雷雷鼠', nameEn: 'Thunder Mouse', emoji: '🐭', hp: 4, type: 'electric',
            attack: '⚡', attackName: '十万伏特', quips: ['嗞嗞~', '来电了~', '麻麻!'],
            trait: '用电流传递知识', traitEn: 'Transmits knowledge through electricity',
            story: '雷雷鼠的胡须能接收"知识电波"。当它的脸颊发光时，就是在给你发送答案提示！但要小心，如果你不认真听，它会轻轻电你一下，让你的头发竖起来提醒你专心。',
            storyEn: 'Thunder Mouse\'s whiskers receive "knowledge waves." When its cheeks glow, it\'s sending you answer hints! But be careful - if you don\'t pay attention, it gives a little zap to make your hair stand up as a reminder to focus.'
        },
        {
            id: 'electric_demon', name: '电鬼怪', nameEn: 'Electric Demon', emoji: '👿', hp: 5, type: 'electric',
            attack: '💛', attackName: '雷电冲击', quips: ['嘿嘿~', '电死你~', '滋滋滋!'],
            trait: '住在插座里的小恶魔', traitEn: 'A little demon living in power outlets',
            story: '电鬼怪住在家里的插座中，它喜欢在小朋友用计算器时偷偷帮忙。如果你按错了数字，它会故意让计算器短路，逼你用脑子算。它说："要相信自己的大脑，不是计算器！"',
            storyEn: 'Electric Demon lives in home outlets and loves helping when kids use calculators. If you press wrong numbers, it short-circuits the calculator, forcing you to use your brain. It says: "Trust your brain, not the calculator!"'
        },
        // 超能力
        {
            id: 'fortune_cat', name: '占卜猫', nameEn: 'Fortune Cat', emoji: '🐱', hp: 5, type: 'psychic',
            attack: '👁️', attackName: '预知未来', quips: ['喵~', '命运已定~', '逃不掉~'],
            trait: '能预见考试题目的神猫', traitEn: 'A mystical cat that foresees test questions',
            story: '占卜猫有九条命，每条命都用来学习不同的数学知识。它能预测第二天的数学考试会考什么，但它只会给你三个神秘的提示。据说认真思考提示的孩子都能考满分！',
            storyEn: 'Fortune Cat has nine lives, each used to learn different math. It can predict what\'s on tomorrow\'s test but gives only three mysterious hints. Legend says kids who think carefully about the hints always get perfect scores!'
        },
        {
            id: 'mind_baby', name: '念力娃', nameEn: 'Mind Baby', emoji: '🧠', hp: 5, type: 'psychic',
            attack: '💫', attackName: '精神冲击', quips: ['嗡嗡~', '读心术~', '我知道!'],
            trait: '可以读取知识的小精灵', traitEn: 'A sprite that can read knowledge',
            story: '念力娃的头很大，因为里面装满了从别人脑袋里"借"来的知识。它不会偷走知识，只是复制一份。如果你遇到难题，它会把历史上所有数学家的解题方法都传给你！',
            storyEn: 'Mind Baby has a big head because it\'s full of knowledge "borrowed" from others. It doesn\'t steal, just copies. When you face a hard problem, it can transmit solving methods from all mathematicians in history!'
        },
        // 虫系恐怖
        {
            id: 'giant_mantis', name: '巨螳螂', nameEn: 'Giant Mantis', emoji: '🦗', hp: 5, type: 'bug',
            attack: '🔪', attackName: '镰刀斩', quips: ['咔嚓~', '切切切~', '锋利!'],
            trait: '用镰刀切分数字', traitEn: 'Divides numbers with its scythes',
            story: '巨螳螂的两把镰刀可以把任何数字一分为二。它是除法运算的专家！不过它很善良，从不伤害任何生物，只切数学题。它的梦想是成为"除法武士"。',
            storyEn: 'Giant Mantis can split any number in two with its scythes. It\'s a division expert! But it\'s kind, never hurting any creature, only cutting math problems. Its dream is to become a "Division Samurai."'
        },
        {
            id: 'bee_queen', name: '毒蜂王', nameEn: 'Bee Queen', emoji: '🐝', hp: 6, type: 'bug',
            attack: '📍', attackName: '毒针乱射', quips: ['嗡嗡~', '蜂群来袭~', '刺刺刺!'],
            trait: '统领数学蜜蜂军团', traitEn: 'Commands an army of math bees',
            story: '毒蜂王统领着一万只工蜂，每只工蜂都负责记住一个算式。需要答案时，蜜蜂们就会排列成正确的数字形状！它们酿的"知识蜜"喝一口就能记住一整页公式。',
            storyEn: 'Bee Queen commands 10,000 worker bees, each memorizing one equation. When an answer is needed, bees arrange into the correct number shape! Their "knowledge honey" helps you memorize a whole page of formulas with one sip.'
        },
    ],

    // 高级怪兽（困难模式用）- HP 6-8
    hardMonsters: [
        // 龙系恐怖
        {
            id: 'flame_dragon', name: '炎龙兽', nameEn: 'Flame Dragon', emoji: '🐲', hp: 6, type: 'dragon',
            attack: '🔥', attackName: '龙焰吐息', quips: ['吼!', '烧成灰~', '龙之怒!'],
            trait: '守护数学宝藏的火龙', traitEn: 'Fire dragon guarding math treasures',
            story: '炎龙兽守护着传说中的"数学宝藏"——一本记载了所有数学奥秘的金色书籍。只有击败它才能翻开书的一页。据说整本书有99页，对应九九乘法表的每一个答案。',
            storyEn: 'Flame Dragon guards the legendary "Math Treasure" - a golden book containing all math secrets. Only by defeating it can you turn a page. The book has 99 pages, one for each answer in the times tables.'
        },
        {
            id: 'sea_dragon', name: '海龙王', nameEn: 'Sea Dragon King', emoji: '🐉', hp: 7, type: 'dragon',
            attack: '🌊', attackName: '深渊漩涡', quips: ['哗哗~', '海啸来了~', '淹没你!'],
            trait: '深海数学迷宫的主人', traitEn: 'Master of the deep sea math maze',
            story: '海龙王住在深海的数学迷宫里。迷宫的每条路都是一道算式，只有选择正确答案的路才能前进。它看起来凶猛，但其实很欢迎勇敢来挑战的小朋友。',
            storyEn: 'Sea Dragon King lives in a deep sea math maze. Each path is an equation - only choosing the correct answer lets you advance. It looks fierce but actually welcomes brave kids who come to challenge.'
        },
        {
            id: 'bone_dragon', name: '骨龙魔', nameEn: 'Bone Dragon', emoji: '🦴', hp: 7, type: 'dragon',
            attack: '💀', attackName: '亡灵之息', quips: ['咔咔咔~', '死亡降临~', '化为骨~'],
            trait: '由错误答案堆积而成', traitEn: 'Formed from accumulated wrong answers',
            story: '骨龙魔是由无数被丢弃的错误答案组成的。它很悲伤，因为没人喜欢错误。但它告诉小朋友："错误不可怕，每个错误都是通向正确的阶梯。"它希望有一天能变回正确答案。',
            storyEn: 'Bone Dragon formed from countless discarded wrong answers. It\'s sad because nobody likes mistakes. But it tells kids: "Mistakes aren\'t scary - each one is a step toward being right." It hopes to become a correct answer someday.'
        },
        // 恶系Boss级
        {
            id: 'night_wolf', name: '暗夜狼', nameEn: 'Night Wolf', emoji: '🐺', hp: 7, type: 'dark',
            attack: '🌙', attackName: '月下猎杀', quips: ['嗷呜~', '月圆之夜~', '撕碎你!'],
            trait: '月圆之夜最强的狼', traitEn: 'The strongest wolf under a full moon',
            story: '暗夜狼只在月圆之夜出现。它用嚎叫把数学问题传向月球，再把答案反射回来。它说月亮是最大的"计算器"，因为月亮表面的环形山就像键盘上的按钮。',
            storyEn: 'Night Wolf only appears on full moons. It howls math problems to the moon and receives answers reflected back. It says the moon is the biggest "calculator" because its craters are like keyboard buttons.'
        },
        {
            id: 'demon_king', name: '恶魔王', nameEn: 'Demon King', emoji: '😈', hp: 7, type: 'dark',
            attack: '🔥', attackName: '地狱之火', quips: ['嘿嘿嘿~', '堕落吧~', '灵魂归我!'],
            trait: '收集数学灵魂的恶魔', traitEn: 'A demon collecting math souls',
            story: '恶魔王喜欢收集"数学灵魂"——小朋友做对题目时散发出的智慧光芒。但它不是坏人，收集灵魂是为了在数学世界停电时用来照明。它是数学世界的"灯塔守护者"。',
            storyEn: 'Demon King collects "math souls" - the wisdom light kids emit when solving problems correctly. But it\'s not evil - it collects souls to light up Math World during blackouts. It\'s the "lighthouse keeper" of Math World.'
        },
        {
            id: 'death_bird', name: '死神鸟', nameEn: 'Death Bird', emoji: '🦅', hp: 6, type: 'dark',
            attack: '💀', attackName: '死亡俯冲', quips: ['咕咕~', '死神来了~', '带你走!'],
            trait: '带走错误答案的使者', traitEn: 'Messenger that carries away wrong answers',
            story: '死神鸟其实是个清洁工！它专门把作业本上的错误答案叼走，带到"错误回收站"处理。处理完的错误会变成新的知识种子，种下去就能长出正确答案！',
            storyEn: 'Death Bird is actually a cleaner! It carries wrong answers from homework to the "Error Recycling Center." Processed errors become knowledge seeds that grow into correct answers when planted!'
        },
        // 钢铁机械
        {
            id: 'steel_mech', name: '钢铁魔', nameEn: 'Steel Mech', emoji: '🤖', hp: 7, type: 'steel',
            attack: '🔩', attackName: '金属风暴', quips: ['嘀嘀~', '系统启动~', '消灭目标!'],
            trait: '最精确的计算机器人', traitEn: 'The most accurate calculating robot',
            story: '钢铁魔是古代数学家用青铜和魔法制作的计算机器人。它的芯片里存储了所有数学公式，但它很羡慕人类可以"理解"数学，而不只是"计算"数学。',
            storyEn: 'Steel Mech is a calculating robot made by ancient mathematicians with bronze and magic. Its chip stores all math formulas, but it envies humans who can "understand" math, not just "calculate" it.'
        },
        {
            id: 'gear_beast', name: '齿轮兽', nameEn: 'Gear Beast', emoji: '⚙️', hp: 6, type: 'steel',
            attack: '🔧', attackName: '齿轮绞杀', quips: ['咔嚓~', '旋转粉碎~', '碾碎你!'],
            trait: '由无数齿轮组成的生物', traitEn: 'A creature made of countless gears',
            story: '齿轮兽的身体由大大小小的齿轮组成，每个齿轮代表一个数字。当你做对算式时，它的齿轮就会完美咬合，发出美妙的机械音乐。做错了...它就会卡住，需要你帮它修好！',
            storyEn: 'Gear Beast\'s body has gears of all sizes, each representing a number. When you solve correctly, its gears mesh perfectly, making beautiful mechanical music. Get it wrong... it jams and needs your help to fix!'
        },
        // 妖精恐怖
        {
            id: 'dark_elf', name: '暗精灵', nameEn: 'Dark Elf', emoji: '🧝', hp: 6, type: 'fairy',
            attack: '✨', attackName: '黑暗祝福', quips: ['呵呵~', '诅咒你~', '永眠吧!'],
            trait: '被误解的善良精灵', traitEn: 'A kind elf who is misunderstood',
            story: '暗精灵不是坏精灵！它的"黑暗祝福"其实是让你在黑暗中也能看到数学题的魔法。它生活在没有阳光的地下，用这个魔法帮助很多迷路的孩子找到回家的数学路。',
            storyEn: 'Dark Elf isn\'t evil! Its "dark blessing" is actually magic to see math problems in the dark. Living underground without sunlight, it uses this magic to help lost children find their way home through math paths.'
        },
        {
            id: 'nightmare_horse', name: '噩梦马', nameEn: 'Nightmare Horse', emoji: '🐴', hp: 7, type: 'fairy',
            attack: '🌙', attackName: '噩梦踏蹄', quips: ['嘶嘶~', '噩梦开始~', '踏碎你!'],
            trait: '在梦中教数学的神马', traitEn: 'A divine horse that teaches math in dreams',
            story: '噩梦马其实是"好梦马"！它会在你睡觉时进入你的梦境，把白天没学会的数学变成好玩的冒险故事。很多孩子早上醒来突然会做难题，都是噩梦马的功劳！',
            storyEn: 'Nightmare Horse is actually a "Good Dream Horse!" It enters your dreams while sleeping, turning unlearned math into fun adventures. Many kids suddenly solve hard problems in the morning - all thanks to Nightmare Horse!'
        },
        // 地面毒系
        {
            id: 'scorpion_king', name: '沙蝎王', nameEn: 'Scorpion King', emoji: '🦂', hp: 7, type: 'ground',
            attack: '💜', attackName: '剧毒尾刺', quips: ['沙沙~', '毒尾一击~', '中毒了!'],
            trait: '沙漠数学王国的统治者', traitEn: 'Ruler of the Desert Math Kingdom',
            story: '沙蝎王统治着沙漠中的数学金字塔。金字塔的每一层都藏着数学谜题，从底层的加减法到顶层的乘除法。它的毒刺不会伤人，只会让被刺中的人暂时只能思考数学题！',
            storyEn: 'Scorpion King rules the math pyramid in the desert. Each level holds math puzzles, from addition at the bottom to division at the top. Its stinger doesn\'t hurt - it just makes you temporarily think only about math!'
        },
    ],

    // Boss怪兽（困难模式最终关卡）- HP 8-12 - 恐怖但可爱的终极Boss
    bossMonsters: [
        {
            id: 'fossil_rex', name: '骨骨霸龙', nameEn: 'Fossil Rex', emoji: '🦖', hp: 8, type: 'dragon',
            attack: '🦴', attackName: '化石咆哮', quips: ['吼吼吼!', '亿年前的王!', '骨头砸!'],
            trait: '来自远古的数学恐龙', traitEn: 'An ancient math dinosaur',
            story: '骨骨霸龙是一亿年前的数学老师转化而成的化石恐龙。那时候的数学只有加法，所以它一直在学习新的运算。它是数学世界年纪最大的居民，知道数学发展的全部历史。',
            storyEn: 'Fossil Rex was a math teacher from 100 million years ago, turned into a fossil dinosaur. Back then, only addition existed, so it keeps learning new operations. It\'s the oldest resident of Math World, knowing all of math\'s history.'
        },
        {
            id: 'phoenix', name: '炎炎鸟王', nameEn: 'Phoenix King', emoji: '🐦‍🔥', hp: 9, type: 'fire',
            attack: '🔥', attackName: '涅槃烈焰', quips: ['燃燃燃!', '不死鸟!', '化为灰烬!'],
            trait: '从错误中重生的神鸟', traitEn: 'Divine bird reborn from mistakes',
            story: '炎炎鸟王每次被击败都会从灰烬中重生，变得更强大。它代表了学习数学的精神——失败了不要紧，从错误中学习，你就会变得更强！它的羽毛燃烧时会显示鼓励的话语。',
            storyEn: 'Phoenix King is reborn from ashes each time it\'s defeated, becoming stronger. It represents the spirit of learning math - failure is okay, learn from mistakes and grow stronger! Its burning feathers display encouraging words.'
        },
        {
            id: 'ice_lord', name: '冷冷魔君', nameEn: 'Ice Lord', emoji: '🥶', hp: 9, type: 'ice',
            attack: '❄️', attackName: '冰封万里', quips: ['好冷呀~', '冻冻你~', '变冰棍!'],
            trait: '冷静思考的化身', traitEn: 'Embodiment of cool-headed thinking',
            story: '冷冷魔君代表"冷静"的力量。它教导大家：做数学题时不要慌张，像冰一样冷静才能算得准。它的城堡全是冰做的，每块冰砖上都刻着让人冷静的数学口诀。',
            storyEn: 'Ice Lord represents the power of "staying cool." It teaches: don\'t panic with math problems, be cool like ice to calculate accurately. Its castle is all ice, with calming math rhymes carved on every ice brick.'
        },
        {
            id: 'thunder_king', name: '雷雷大王', nameEn: 'Thunder King', emoji: '⚡', hp: 9, type: 'electric',
            attack: '💛', attackName: '万雷轰顶', quips: ['劈里啪啦!', '电电电!', '麻痹吧!'],
            trait: '速度与准确的代言人', traitEn: 'Ambassador of speed and accuracy',
            story: '雷雷大王代表"快速准确"。它的闪电比任何东西都快，但从不出错。它说："不要追求快而丢了准，也不要追求准而忘了快。像闪电一样，又快又准才是最棒的！"',
            storyEn: 'Thunder King represents "fast and accurate." Its lightning is faster than anything but never wrong. It says: "Don\'t sacrifice accuracy for speed, or speed for accuracy. Be like lightning - fast AND accurate is the best!"'
        },
        {
            id: 'alien_eye', name: '外星大眼', nameEn: 'Alien Eye', emoji: '👽', hp: 10, type: 'psychic',
            attack: '🛸', attackName: '脑电波', quips: ['嗡嗡~', '读取中~', '交出答案!'],
            trait: '跨星际的数学研究者', traitEn: 'Interstellar math researcher',
            story: '外星大眼来自数学星球，那里的生物用数学作为语言。它来地球是为了研究为什么地球小朋友能把枯燥的数字变成有趣的游戏。它最感动的发现是：原来"快乐"可以让学习变简单！',
            storyEn: 'Alien Eye is from Math Planet where creatures speak in math. It came to Earth to study why kids can turn boring numbers into fun games. Its most touching discovery: "happiness" can make learning easier!'
        },
        {
            id: 'math_demon_king', name: '九九魔王', nameEn: 'Times Table King', emoji: '👹', hp: 12, type: 'dark',
            attack: '💀', attackName: '九九归一', quips: ['哈哈哈!', '算不出来吧!', '乖乖受死!'],
            trait: '九九乘法表的终极守护者', traitEn: 'Ultimate guardian of the times tables',
            story: '九九魔王是数学世界最强的Boss，但它其实是个老好人！它故意装得很凶，是为了激励小朋友努力学习打败它。每次被击败它都很开心，因为这意味着又有一个孩子掌握了乘法表。它的愿望是被全世界的小朋友都打败！',
            storyEn: 'Times Table King is Math World\'s strongest boss, but it\'s actually a nice guy! It acts fierce to motivate kids to study hard and defeat it. It\'s happy when beaten because it means another child mastered times tables. Its wish is to be defeated by every child in the world!'
        },
    ],

    // 为了兼容性保留的旧数组（会在运行时动态生成）
    monsters: [],

    // ===== 妖怪图鉴收集系统 =====
    // 获取所有妖怪列表
    getAllMonsters() {
        return [
            ...this.easyMonsters,
            ...this.normalMonsters,
            ...this.hardMonsters,
            ...this.bossMonsters
        ];
    },

    // 获取收集记录
    getCollection() {
        const currentUser = UserManager.getCurrentUser();
        if (!currentUser) return [];
        const key = 'monsterCollection_' + currentUser.id;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },

    // 保存收集记录
    saveCollection(collection) {
        const currentUser = UserManager.getCurrentUser();
        if (!currentUser) return;
        const key = 'monsterCollection_' + currentUser.id;
        localStorage.setItem(key, JSON.stringify(collection));
    },

    // 添加妖怪到收集
    addToCollection(monsterId) {
        const collection = this.getCollection();
        if (!collection.includes(monsterId)) {
            collection.push(monsterId);
            this.saveCollection(collection);
            return true; // 新收集
        }
        return false; // 已经收集过
    },

    // 检查妖怪是否已收集
    isCollected(monsterId) {
        return this.getCollection().includes(monsterId);
    },

    // 获取收集统计
    getCollectionStats() {
        const all = this.getAllMonsters();
        const collected = this.getCollection();
        return {
            total: all.length,
            collected: collected.length,
            percentage: Math.round((collected.length / all.length) * 100)
        };
    },

    // 显示新收集提示
    showNewCollectionToast(monster) {
        const toast = document.createElement('div');
        toast.className = 'collection-toast';
        toast.innerHTML = `
            <div class="collection-toast-content">
                <span class="collection-toast-icon">📖</span>
                <span class="collection-toast-text">
                    <strong>图鉴更新!</strong><br>
                    ${monster.emoji} ${monster.name} 已收录
                </span>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    },

    // ===== 道具系统 =====
    items: [
        // 攻击道具 - 造成额外伤害
        { id: 'fire_crystal', name: '火焰水晶', emoji: '🔴', type: 'attack', effect: { damage: 2 }, desc: '下次攻击+2伤害', rarity: 'common' },
        { id: 'ice_shard', name: '寒冰碎片', emoji: '🔵', type: 'attack', effect: { damage: 2, freeze: true }, desc: '冰冻攻击+2伤害', rarity: 'common' },
        { id: 'thunder_stone', name: '雷电宝石', emoji: '🟡', type: 'attack', effect: { damage: 3 }, desc: '闪电攻击+3伤害', rarity: 'rare' },
        { id: 'dragon_fang', name: '龙牙', emoji: '🦷', type: 'attack', effect: { damage: 4 }, desc: '龙之力量+4伤害', rarity: 'epic' },
        { id: 'ultimate_orb', name: '究极宝珠', emoji: '🔮', type: 'attack', effect: { damage: 5, pierce: true }, desc: '究极攻击+5穿透伤害', rarity: 'legendary' },

        // 治疗道具 - 恢复生命
        { id: 'potion', name: '红色药水', emoji: '🧪', type: 'heal', effect: { hp: 1 }, desc: '恢复1点HP', rarity: 'common' },
        { id: 'super_potion', name: '超级药水', emoji: '💊', type: 'heal', effect: { hp: 2 }, desc: '恢复2点HP', rarity: 'rare' },
        { id: 'max_potion', name: '全满药水', emoji: '💉', type: 'heal', effect: { hpFull: true }, desc: '完全恢复HP', rarity: 'epic' },
        { id: 'revive', name: '复活草', emoji: '🌿', type: 'heal', effect: { revive: true }, desc: '防止一次死亡', rarity: 'legendary' },

        // 增益道具 - 临时增强
        { id: 'combo_boost', name: '连击护符', emoji: '📿', type: 'buff', effect: { comboBonus: 2 }, desc: '连击伤害+2', rarity: 'rare' },
        { id: 'double_strike', name: '双重打击', emoji: '⚔️', type: 'buff', effect: { doubleHit: true }, desc: '下次攻击命中两次', rarity: 'rare' },
        { id: 'critical_gem', name: '暴击宝石', emoji: '💎', type: 'buff', effect: { critChance: 0.5 }, desc: '50%暴击(双倍伤害)', rarity: 'epic' },
        { id: 'shield', name: '护盾结界', emoji: '🛡️', type: 'buff', effect: { shield: 1 }, desc: '抵挡1次攻击', rarity: 'rare' },
        { id: 'golden_apple', name: '黄金苹果', emoji: '🍎', type: 'buff', effect: { maxHpUp: 1 }, desc: '最大HP+1', rarity: 'legendary' },

        // 特殊道具 - 独特效果
        { id: 'star_piece', name: '星星碎片', emoji: '⭐', type: 'special', effect: { scoreBonus: 50 }, desc: '额外获得50分', rarity: 'common' },
        { id: 'lucky_coin', name: '幸运金币', emoji: '🪙', type: 'special', effect: { itemDropUp: true }, desc: '提高道具掉落率', rarity: 'rare' },
        { id: 'time_hourglass', name: '时间沙漏', emoji: '⏳', type: 'special', effect: { skipMonster: true }, desc: '跳过当前怪兽', rarity: 'legendary' },
    ],

    // 道具掉落配置
    itemDropConfig: {
        baseChance: 0.15,  // 基础掉落率15%
        comboBonus: 0.02,  // 每连击增加2%
        maxChance: 0.4,    // 最大掉落率40%
        rarityWeights: {
            common: 50,
            rare: 30,
            epic: 15,
            legendary: 5
        }
    },

    // ===== 特殊武器系统 =====
    // 武器配置 - 更丰富的攻击方式
    weapons: [
        { emoji: '🔥', name: '火球术', weight: 20, sound: 'fire', color: '#ff6b35' },
        { emoji: '🧊', name: '冰冻箭', weight: 15, sound: 'ice', color: '#74b9ff' },
        { emoji: '⚡', name: '闪电链', weight: 15, sound: 'thunder', color: '#ffeaa7' },
        { emoji: '⭐', name: '流星雨', weight: 15, sound: 'star', color: '#fdcb6e' },
        { emoji: '🌈', name: '彩虹光', weight: 10, sound: 'rainbow', color: '#a29bfe' },
        { emoji: '💣', name: '超级炸弹', weight: 5, sound: 'bomb', color: '#2d3436' },
        { emoji: '🌟', name: '圣光术', weight: 10, sound: 'holy', color: '#fff9c4' },
        { emoji: '🌀', name: '龙卷风', weight: 10, sound: 'wind', color: '#81ecec' }
    ],

    // 道具增强武器
    specialWeapons: [
        { emoji: '🐉', name: '神龙怒吼', damage: 5, color: '#e74c3c' },
        { emoji: '☄️', name: '陨石撞击', damage: 6, color: '#e67e22' },
        { emoji: '🌋', name: '火山爆发', damage: 7, color: '#c0392b' },
        { emoji: '🌊', name: '海啸狂澜', damage: 5, color: '#3498db' },
        { emoji: '💫', name: '星辰坠落', damage: 8, color: '#9b59b6' },
    ],

    // 初始化
    init() {
        // 难度选择按钮
        document.querySelectorAll('.battle-diff-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.battle-diff-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                App.difficulty = btn.dataset.diff;
            });
        });

        // 模式选择按钮
        document.getElementById('select-battle-mode')?.addEventListener('click', () => {
            this.showDifficultyAndStart();
        });

        document.getElementById('select-classic-mode')?.addEventListener('click', () => {
            this.startClassicMode();
        });

        // 战斗页返回按钮
        document.querySelector('#battle-page .back-btn')?.addEventListener('click', () => {
            this.exitBattle();
        });

        // 战斗结果页按钮
        document.getElementById('battle-retry-btn')?.addEventListener('click', () => {
            this.startBattle(App.battle.difficulty);
        });

        document.getElementById('battle-home-btn')?.addEventListener('click', () => {
            showPage('home');
        });

        // 战斗失败页按钮
        document.getElementById('battle-retry-fail-btn')?.addEventListener('click', () => {
            this.startBattle(App.battle.difficulty);
        });

        document.getElementById('battle-home-fail-btn')?.addEventListener('click', () => {
            showPage('home');
        });

        // 战斗提交按钮
        document.getElementById('battle-submit-btn')?.addEventListener('click', () => {
            this.submitAnswer();
        });

        // 战斗输入框回车提交
        document.getElementById('battle-answer-input')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.submitAnswer();
            }
        });

        // 战斗输入框键盘处理
        const battleInput = document.getElementById('battle-answer-input');
        if (battleInput) {
            battleInput.addEventListener('focus', () => {
                document.body.classList.add('keyboard-active');
                setTimeout(() => {
                    battleInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });

            battleInput.addEventListener('blur', () => {
                setTimeout(() => {
                    if (document.activeElement !== battleInput) {
                        document.body.classList.remove('keyboard-active');
                    }
                }, 100);
            });
        }

        // ===== 图鉴页面事件 =====
        // 打开图鉴
        document.getElementById('open-collection')?.addEventListener('click', () => {
            this.openCollection();
        });

        // 图鉴返回按钮
        document.querySelector('#collection-page .back-btn')?.addEventListener('click', () => {
            showPage('xiaojiujiu-mode');
        });

        // 图鉴筛选按钮
        document.querySelectorAll('.collection-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.collection-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderCollection(btn.dataset.filter);
            });
        });

        // 关闭详情弹窗
        document.getElementById('monster-detail-close')?.addEventListener('click', () => {
            this.closeMonsterDetail();
        });
        document.querySelector('.monster-detail-overlay')?.addEventListener('click', () => {
            this.closeMonsterDetail();
        });
    },

    // 打开图鉴页面
    openCollection() {
        this.renderCollection('all');
        this.updateCollectionCount();
        showPage('collection');
    },

    // 更新图鉴计数（用于首页显示）
    updateCollectionCount() {
        const stats = this.getCollectionStats();
        const countEl = document.getElementById('collection-count');
        if (countEl) {
            countEl.textContent = `${stats.collected}/${stats.total}`;
        }
        const statsEl = document.getElementById('collection-stats');
        if (statsEl) {
            statsEl.textContent = `${stats.collected}/${stats.total}`;
        }
        const progressFill = document.getElementById('collection-progress-fill');
        if (progressFill) {
            progressFill.style.width = `${stats.percentage}%`;
        }
        const progressText = document.getElementById('collection-progress-text');
        if (progressText) {
            progressText.textContent = `收集进度: ${stats.percentage}%`;
        }
    },

    // 渲染图鉴列表
    renderCollection(filter = 'all') {
        const grid = document.getElementById('collection-grid');
        if (!grid) return;

        const allMonsters = this.getAllMonsters();
        const collection = this.getCollection();

        const typeNames = {
            ghost: '幽灵', psychic: '超能', dark: '恶', poison: '毒',
            fire: '火', water: '水', flying: '飞行', normal: '普通',
            ice: '冰', fighting: '格斗', rock: '岩石', electric: '电',
            bug: '虫', dragon: '龙', steel: '钢', fairy: '妖精', ground: '地面'
        };

        let html = '';
        let visibleCount = 0;

        allMonsters.forEach(monster => {
            const isCollected = collection.includes(monster.id);

            // 筛选
            if (filter === 'collected' && !isCollected) return;
            if (filter === 'locked' && isCollected) return;

            visibleCount++;

            if (isCollected) {
                html += `
                    <div class="collection-card collected" data-id="${monster.id}">
                        <span class="collection-card-emoji">${monster.emoji}</span>
                        <span class="collection-card-name">${monster.name}</span>
                        <span class="collection-card-type type-${monster.type}">${typeNames[monster.type] || '普通'}</span>
                    </div>
                `;
            } else {
                html += `
                    <div class="collection-card locked">
                        <span class="collection-card-emoji">❓</span>
                        <span class="collection-card-name">???</span>
                        <span class="collection-card-type">未解锁</span>
                    </div>
                `;
            }
        });

        // 空状态处理
        if (visibleCount === 0) {
            if (filter === 'collected') {
                html = `
                    <div class="collection-empty">
                        <div class="collection-empty-icon">📖</div>
                        <div class="collection-empty-text">还没有收集到任何妖怪<br>快去战斗收集吧!</div>
                    </div>
                `;
            } else if (filter === 'locked') {
                html = `
                    <div class="collection-empty">
                        <div class="collection-empty-icon">🎉</div>
                        <div class="collection-empty-text">恭喜! 你已经收集了全部妖怪!</div>
                    </div>
                `;
            }
        }

        grid.innerHTML = html;

        // 绑定点击事件
        grid.querySelectorAll('.collection-card.collected').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                const monster = allMonsters.find(m => m.id === id);
                if (monster) {
                    this.showMonsterDetail(monster);
                }
            });
        });

        // 检查是否全收集
        const collectionPage = document.getElementById('collection-page');
        if (collection.length >= allMonsters.length) {
            collectionPage?.classList.add('collection-complete');
        } else {
            collectionPage?.classList.remove('collection-complete');
        }

        this.updateCollectionCount();
    },

    // 显示妖怪详情
    showMonsterDetail(monster) {
        const typeNames = {
            ghost: '幽灵系', psychic: '超能系', dark: '恶系', poison: '毒系',
            fire: '火系', water: '水系', flying: '飞行系', normal: '普通系',
            ice: '冰系', fighting: '格斗系', rock: '岩石系', electric: '电系',
            bug: '虫系', dragon: '龙系', steel: '钢系', fairy: '妖精系', ground: '地面系'
        };

        document.getElementById('detail-emoji').textContent = monster.emoji;
        document.getElementById('detail-name').textContent = monster.name;
        document.getElementById('detail-name-en').textContent = monster.nameEn;
        document.getElementById('detail-type').innerHTML = `<span class="type-badge ${monster.type}">${typeNames[monster.type] || '普通系'}</span>`;
        document.getElementById('detail-hp').textContent = monster.hp;
        document.getElementById('detail-attack').textContent = `${monster.attack} ${monster.attackName}`;
        document.getElementById('detail-trait').textContent = monster.trait;
        document.getElementById('detail-trait-en').textContent = monster.traitEn;
        document.getElementById('detail-story').textContent = monster.story;
        document.getElementById('detail-story-en').textContent = monster.storyEn;

        document.getElementById('monster-detail-modal').classList.remove('hidden');
    },

    // 关闭妖怪详情
    closeMonsterDetail() {
        document.getElementById('monster-detail-modal').classList.add('hidden');
    },

    // 显示难度选择并开始战斗
    showDifficultyAndStart() {
        // 使用当前难度设置
        this.startBattle(App.difficulty);
    },

    // 开始经典模式
    startClassicMode() {
        App.currentModule = 'xiaojiujiu';

        // 获取题目
        const moduleData = MathData.xiaojiujiu;
        const diffData = moduleData[App.difficulty] || moduleData.easy;
        const questions = shuffle(diffData).slice(0, Math.min(App.settings.count, diffData.length));

        // 初始化训练状态
        App.practice = {
            questions: questions,
            currentIndex: 0,
            correctCount: 0,
            streak: 0,
            startTime: Date.now(),
            timerInterval: null,
            timePerQuestion: App.difficulty === 'easy' ? 15 : (App.difficulty === 'normal' ? 10 : 7)
        };

        document.getElementById('practice-title').textContent = '🔥 小九九速算';
        document.getElementById('difficulty-selector').classList.remove('hidden');
        showPage('practice');
        showQuestion();
    },

    // 开始战斗
    startBattle(difficulty) {
        const battle = App.battle;
        battle.active = true;
        battle.difficulty = difficulty;
        battle.currentStage = 1;
        battle.monstersDefeated = 0;
        battle.combo = 0;
        battle.maxCombo = 0;
        battle.correctCount = 0;
        battle.noDamageTaken = true;
        battle.healCounter = 0;
        battle.startTime = Date.now();
        battle.currentIndex = 0;

        // 初始化道具系统
        battle.inventory = [];      // 玩家背包
        battle.activeItem = null;   // 当前激活的道具
        battle.shield = 0;          // 护盾层数
        battle.hasRevive = false;   // 复活道具
        battle.itemsUsed = 0;       // 使用道具次数
        battle.itemsCollected = 0;  // 收集道具次数

        // 根据难度生成怪兽队列
        this.generateMonsterQueue(difficulty);

        // 根据难度设置
        const diffSettings = {
            easy: { playerHP: 5, stages: 6 },    // 6个简单怪兽
            normal: { playerHP: 5, stages: 10 }, // 6简单 + 4中级怪兽
            hard: { playerHP: 4, stages: 15 }    // 6简单 + 6中级 + 3Boss
        };

        const settings = diffSettings[difficulty] || diffSettings.easy;
        battle.playerHP = settings.playerHP;
        battle.playerMaxHP = settings.playerHP;
        battle.totalStages = settings.stages;

        // 获取题目
        const moduleData = MathData.xiaojiujiu;
        const diffData = moduleData[difficulty] || moduleData.easy;
        battle.questions = shuffle([...diffData]);

        // 显示战斗页面
        showPage('battle');
        App.currentPage = 'battle';

        // 更新道具UI
        this.updateInventoryUI();

        // 初始化第一关怪兽
        this.initStage();
    },

    // 生成怪兽队列
    generateMonsterQueue(difficulty) {
        const battle = App.battle;
        battle.monsterQueue = [];

        if (difficulty === 'easy') {
            // 简单模式：随机6个初级怪兽
            battle.monsterQueue = shuffle([...this.easyMonsters]).slice(0, 6);
        } else if (difficulty === 'normal') {
            // 普通模式：6个初级 + 4个中级
            const easy = shuffle([...this.easyMonsters]).slice(0, 6);
            const normal = shuffle([...this.normalMonsters]).slice(0, 4);
            battle.monsterQueue = [...easy, ...normal];
        } else {
            // 困难模式：6个初级 + 6个中级 + 3个Boss
            const easy = shuffle([...this.easyMonsters]).slice(0, 6);
            const normal = shuffle([...this.normalMonsters]).slice(0, 6);
            const boss = shuffle([...this.bossMonsters]).slice(0, 3);
            battle.monsterQueue = [...easy, ...normal, ...boss];
        }
    },

    // 初始化关卡
    initStage() {
        const battle = App.battle;
        const stageIndex = battle.currentStage - 1;

        // 从队列获取怪兽
        let monster = battle.monsterQueue[stageIndex];
        if (!monster) {
            // 如果队列用完，随机选一个
            const allMonsters = [...this.easyMonsters, ...this.normalMonsters];
            monster = allMonsters[Math.floor(Math.random() * allMonsters.length)];
        }

        battle.monsterHP = monster.hp;
        battle.monsterMaxHP = monster.hp;
        battle.currentMonster = monster; // 存储当前怪兽引用

        // 更新UI
        this.updateUI();

        // 显示怪兽
        document.getElementById('monster-name').textContent = monster.name;
        const monsterEmoji = document.getElementById('monster-emoji');
        monsterEmoji.textContent = monster.emoji;
        monsterEmoji.className = 'monster-emoji';

        // 显示怪兽类型标签
        this.showMonsterType(monster);

        // 显示关卡过渡动画
        this.showStageTransition(battle.currentStage, monster);

        // 延迟显示第一题
        setTimeout(() => {
            this.showBattleQuestion();
        }, 1500);
    },

    // 显示怪兽类型
    showMonsterType(monster) {
        const typeColors = {
            grass: '#78c850', water: '#6890f0', fire: '#f08030', electric: '#f8d030',
            ghost: '#705898', ice: '#98d8d8', rock: '#b8a038', flying: '#a890f0',
            bug: '#a8b820', poison: '#a040a0', fighting: '#c03028', psychic: '#f85888',
            dragon: '#7038f8', steel: '#b8b8d0', dark: '#705848', fairy: '#ee99ac',
            ground: '#e0c068', normal: '#a8a878'
        };
        const typeNames = {
            grass: '草', water: '水', fire: '火', electric: '电', ghost: '幽灵',
            ice: '冰', rock: '岩石', flying: '飞行', bug: '虫', poison: '毒',
            fighting: '格斗', psychic: '超能', dragon: '龙', steel: '钢', dark: '恶',
            fairy: '妖精', ground: '地面', normal: '普通'
        };

        let typeTag = document.getElementById('monster-type-tag');
        if (!typeTag) {
            typeTag = document.createElement('div');
            typeTag.id = 'monster-type-tag';
            typeTag.className = 'monster-type-tag';
            document.querySelector('.monster-area')?.appendChild(typeTag);
        }
        typeTag.textContent = typeNames[monster.type] || '普通';
        typeTag.style.background = typeColors[monster.type] || '#a8a878';
    },

    // 显示关卡过渡
    showStageTransition(stage, monster) {
        const typeNames = {
            grass: '草系', water: '水系', fire: '火系', electric: '电系', ghost: '幽灵系',
            ice: '冰系', rock: '岩石系', flying: '飞行系', bug: '虫系', poison: '毒系',
            fighting: '格斗系', psychic: '超能系', dragon: '龙系', steel: '钢系', dark: '恶系',
            fairy: '妖精系', ground: '地面系', normal: '普通系'
        };

        // 创建过渡元素
        let transition = document.querySelector('.stage-transition');
        if (!transition) {
            transition = document.createElement('div');
            transition.className = 'stage-transition';
            document.getElementById('battle-page').appendChild(transition);
        }

        transition.innerHTML = `
            <div class="stage-transition-text">关卡 ${stage}</div>
            <div class="stage-transition-monster">${monster.emoji}</div>
            <div class="stage-transition-name">${monster.name}</div>
            <div class="stage-transition-type">${typeNames[monster.type] || '普通系'}</div>
            <div class="stage-transition-attack">${monster.attack || '💥'} ${monster.attackName || '攻击'}</div>
        `;

        transition.classList.add('show');

        setTimeout(() => {
            transition.classList.remove('show');
        }, 1200);
    },

    // 更新UI
    updateUI() {
        const battle = App.battle;

        // 更新关卡
        document.getElementById('battle-stage').textContent = battle.currentStage;
        document.querySelector('.stage-total').textContent = '/' + battle.totalStages;

        // 更新玩家血量
        let hearts = '';
        for (let i = 0; i < battle.playerMaxHP; i++) {
            hearts += i < battle.playerHP ? '❤️' : '🖤';
        }
        document.getElementById('player-hearts').textContent = hearts;

        // 更新怪兽血量
        const hpPercent = (battle.monsterHP / battle.monsterMaxHP) * 100;
        document.getElementById('monster-hp-fill').style.width = hpPercent + '%';
        document.getElementById('monster-hp-text').textContent = battle.monsterHP + '/' + battle.monsterMaxHP;

        // 更新连击
        const comboEl = document.getElementById('battle-combo');
        if (battle.combo > 0) {
            comboEl.classList.add('show');
            document.getElementById('combo-count').textContent = battle.combo;
        } else {
            comboEl.classList.remove('show');
        }
    },

    // 显示战斗题目
    showBattleQuestion() {
        const battle = App.battle;

        // 循环题目
        if (battle.currentIndex >= battle.questions.length) {
            battle.questions = shuffle([...battle.questions]);
            battle.currentIndex = 0;
        }

        const question = battle.questions[battle.currentIndex];
        if (!question) {
            console.error('题目为空');
            return;
        }

        // 显示题目
        document.getElementById('battle-question-text').textContent = question.q;

        // 战斗模式强制使用选择题
        document.getElementById('battle-choices').classList.remove('hidden');
        document.getElementById('battle-input-mode').classList.add('hidden');

        // 生成选项
        const choices = this.generateChoices(question.a);
        const choicesContainer = document.getElementById('battle-choices');

        // 清空并重新创建按钮
        choicesContainer.innerHTML = '';

        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'battle-choice-btn';
            btn.type = 'button';
            btn.textContent = choice;

            // 直接绑定点击事件到每个按钮
            btn.onclick = function() {
                if (!btn.disabled) {
                    BattleMode.checkAnswer(String(choice), btn);
                }
            };

            // 同时添加 touchend 事件（移动设备）
            btn.addEventListener('touchend', function(e) {
                e.preventDefault();
                if (!btn.disabled) {
                    BattleMode.checkAnswer(String(choice), btn);
                }
            }, { passive: false });

            choicesContainer.appendChild(btn);
        });
    },

    // 生成选项
    generateChoices(correctAnswer) {
        const choices = [correctAnswer];
        const numAnswer = parseFloat(correctAnswer);

        while (choices.length < 4) {
            let wrong;
            const variation = Math.random();

            if (variation < 0.3) {
                wrong = numAnswer + Math.floor(Math.random() * 10) - 5;
            } else if (variation < 0.6) {
                wrong = numAnswer + (Math.random() < 0.5 ? 1 : -1) * Math.floor(Math.random() * 3 + 1);
            } else {
                wrong = Math.floor(Math.random() * 81) + 1;
            }

            if (wrong > 0 && wrong !== numAnswer && !choices.includes(wrong)) {
                choices.push(wrong);
            }
        }

        return shuffle(choices);
    },

    // 提交输入答案
    submitAnswer() {
        const input = document.getElementById('battle-answer-input');
        const answer = input.value.trim();
        if (answer) {
            this.checkAnswer(answer, null);
        }
    },

    // 检查答案
    checkAnswer(answer, btnElement) {
        const battle = App.battle;
        const question = battle.questions[battle.currentIndex];
        const isCorrect = String(answer) === String(question.a);

        // 禁用所有按钮
        document.querySelectorAll('.battle-choice-btn').forEach(btn => {
            btn.disabled = true;
        });

        if (isCorrect) {
            this.handleCorrectAnswer(btnElement);
        } else {
            this.handleWrongAnswer(btnElement, question.a);
        }
    },

    // 处理正确答案
    handleCorrectAnswer(btnElement) {
        const battle = App.battle;

        battle.combo++;
        battle.healCounter++;
        battle.correctCount++;
        if (battle.combo > battle.maxCombo) {
            battle.maxCombo = battle.combo;
        }

        // 按钮反馈
        if (btnElement) {
            btnElement.classList.add('correct');
        }

        // 播放音效
        playSound('correct');

        // 连击里程碑反馈
        let feedbackText = '正确!';
        if (battle.combo === 3) {
            feedbackText = '🔥 三连击!';
            playSound('streak');
        } else if (battle.combo === 5) {
            feedbackText = '🔥🔥 五连击!';
            playSound('streak');
        } else if (battle.combo === 10) {
            feedbackText = '🔥🔥🔥 十连击!!';
            playSound('streak');
            createConfetti(20);
        } else if (battle.combo === 15) {
            feedbackText = '💥 超神连击!!!';
            playSound('streak');
            createConfetti(30);
        }

        // 显示反馈
        this.showFeedback(true, feedbackText);

        // 计算伤害
        let damage = 1;
        if (battle.combo >= 5) damage = 2;
        if (battle.combo >= 3 && battle.combo < 5) damage = battle.difficulty === 'easy' ? 1 : 2;

        // 检查激活道具效果
        if (battle.activeItem) {
            const item = battle.activeItem;
            if (item.effect.damage) {
                damage += item.effect.damage;
                feedbackText = `${item.emoji} ${item.name}! +${item.effect.damage}伤害`;
                this.showFeedback(true, feedbackText);
            }
            if (item.effect.doubleHit) {
                damage *= 2;
                feedbackText = '⚔️ 双重打击!';
            }
            if (item.effect.critChance && Math.random() < item.effect.critChance) {
                damage *= 2;
                feedbackText = '💥 暴击! x2';
                createConfetti(15);
            }
            battle.activeItem = null;
            this.updateInventoryUI();
        }

        // 检查炸弹武器
        const weapon = this.getRandomWeapon();
        if (weapon.emoji === '💣') damage += 1;

        // 发射武器
        this.fireWeapon(weapon, damage);

        // 延迟处理伤害
        setTimeout(() => {
            this.dealDamage(damage);

            // 检查血量恢复（连续答对5题）
            if (battle.healCounter >= 5 && battle.playerHP < battle.playerMaxHP) {
                battle.playerHP++;
                battle.healCounter = 0;
                this.showHealEffect();
            }

            // 尝试掉落道具
            this.tryDropItem();
        }, 400);
    },

    // 尝试掉落道具
    tryDropItem() {
        const battle = App.battle;
        const config = this.itemDropConfig;

        // 计算掉落率
        let dropChance = config.baseChance + (battle.combo * config.comboBonus);
        if (battle.inventory.some(i => i.effect.itemDropUp)) {
            dropChance += 0.1; // 幸运金币增加10%
        }
        dropChance = Math.min(dropChance, config.maxChance);

        if (Math.random() < dropChance) {
            // 根据稀有度权重选择道具
            const item = this.getRandomItem();
            if (item && battle.inventory.length < 6) { // 最多6个道具
                battle.inventory.push({ ...item });
                battle.itemsCollected++;
                this.showItemDrop(item);
                this.updateInventoryUI();

                // 检查传奇道具成就
                if (item.rarity === 'legendary') {
                    const achievements = App.stats.achievements;
                    if (!achievements.includes('legendary_drop')) {
                        achievements.push('legendary_drop');
                        saveProgress();
                        setTimeout(() => {
                            const ach = MathData.achievements.find(a => a.id === 'legendary_drop');
                            if (ach) showAchievement(ach);
                        }, 2000);
                    }
                }
            }
        }
    },

    // 获取随机道具
    getRandomItem() {
        const weights = this.itemDropConfig.rarityWeights;
        const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;

        let selectedRarity = 'common';
        for (const [rarity, weight] of Object.entries(weights)) {
            random -= weight;
            if (random <= 0) {
                selectedRarity = rarity;
                break;
            }
        }

        const itemsOfRarity = this.items.filter(i => i.rarity === selectedRarity);
        return itemsOfRarity[Math.floor(Math.random() * itemsOfRarity.length)];
    },

    // 显示道具掉落动画
    showItemDrop(item) {
        const dropEl = document.createElement('div');
        dropEl.className = 'item-drop-animation';
        dropEl.innerHTML = `
            <div class="item-drop-emoji">${item.emoji}</div>
            <div class="item-drop-name">${item.name}</div>
        `;
        document.getElementById('battle-page').appendChild(dropEl);

        playSound('streak');

        setTimeout(() => dropEl.remove(), 1500);
    },

    // 更新道具栏UI
    updateInventoryUI() {
        const battle = App.battle;
        let inventoryEl = document.getElementById('battle-inventory');

        if (!inventoryEl) {
            inventoryEl = document.createElement('div');
            inventoryEl.id = 'battle-inventory';
            inventoryEl.className = 'battle-inventory';
            const questionArea = document.querySelector('.battle-question-area');
            const questionCard = document.getElementById('battle-question-card');
            if (questionArea && questionCard) {
                questionArea.insertBefore(inventoryEl, questionCard);
            } else if (questionArea) {
                questionArea.prepend(inventoryEl);
            }
        }

        if (battle.inventory.length === 0) {
            inventoryEl.innerHTML = '<div class="inventory-empty">答题获得道具</div>';
        } else {
            inventoryEl.innerHTML = battle.inventory.map((item, index) => `
                <button class="inventory-item ${battle.activeItem === item ? 'active' : ''}"
                        data-index="${index}" title="${item.name}: ${item.desc}">
                    ${item.emoji}
                </button>
            `).join('');

            // 绑定点击事件
            inventoryEl.querySelectorAll('.inventory-item').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.dataset.index);
                    this.useItem(index);
                });
            });
        }
    },

    // 使用道具
    useItem(index) {
        const battle = App.battle;
        const item = battle.inventory[index];
        if (!item) return;

        // 治疗道具立即生效
        if (item.type === 'heal') {
            if (item.effect.hp && battle.playerHP < battle.playerMaxHP) {
                battle.playerHP = Math.min(battle.playerMaxHP, battle.playerHP + item.effect.hp);
                this.showHealEffect();
                battle.inventory.splice(index, 1);
                battle.itemsUsed++;
                this.updateUI();
                this.updateInventoryUI();
                playSound('correct');
            } else if (item.effect.hpFull && battle.playerHP < battle.playerMaxHP) {
                battle.playerHP = battle.playerMaxHP;
                this.showHealEffect();
                battle.inventory.splice(index, 1);
                battle.itemsUsed++;
                this.updateUI();
                this.updateInventoryUI();
                playSound('achievement');
            } else if (item.effect.revive && !battle.hasRevive) {
                battle.hasRevive = true;
                battle.inventory.splice(index, 1);
                battle.itemsUsed++;
                this.showFeedback(true, '🌿 复活保护已激活!');
                this.updateInventoryUI();
                playSound('achievement');
            }
            return;
        }

        // 增益道具立即生效
        if (item.type === 'buff') {
            if (item.effect.shield) {
                battle.shield += item.effect.shield;
                this.showFeedback(true, '🛡️ 护盾激活!');
                battle.inventory.splice(index, 1);
                battle.itemsUsed++;
                this.updateInventoryUI();
                playSound('correct');
                return;
            }
            if (item.effect.maxHpUp) {
                battle.playerMaxHP += item.effect.maxHpUp;
                battle.playerHP += item.effect.maxHpUp;
                this.showFeedback(true, '💛 最大HP+1!');
                battle.inventory.splice(index, 1);
                battle.itemsUsed++;
                this.updateUI();
                this.updateInventoryUI();
                playSound('achievement');
                return;
            }
        }

        // 特殊道具
        if (item.type === 'special') {
            if (item.effect.skipMonster) {
                // 跳过当前怪兽
                battle.monstersDefeated++;
                battle.inventory.splice(index, 1);
                battle.itemsUsed++;
                this.showFeedback(true, '⏳ 时间跳跃!');
                this.updateInventoryUI();
                playSound('achievement');
                setTimeout(() => {
                    if (battle.currentStage >= battle.totalStages) {
                        this.gameOver(true);
                    } else {
                        battle.currentStage++;
                        this.initStage();
                    }
                }, 1000);
                return;
            }
            if (item.effect.scoreBonus) {
                App.stats.totalScore += item.effect.scoreBonus;
                battle.inventory.splice(index, 1);
                battle.itemsUsed++;
                this.showFeedback(true, `⭐ +${item.effect.scoreBonus}分!`);
                this.updateInventoryUI();
                playSound('correct');
                return;
            }
        }

        // 攻击道具和其他增益道具设为激活状态（下次攻击时使用）
        if (item.type === 'attack' || item.type === 'buff') {
            battle.activeItem = item;
            battle.inventory.splice(index, 1);
            this.showFeedback(true, `${item.emoji} ${item.name}准备就绪!`);
            this.updateInventoryUI();
            playSound('correct');
        }
    },

    // 处理错误答案
    handleWrongAnswer(btnElement, correctAnswer) {
        const battle = App.battle;

        battle.combo = 0;
        battle.healCounter = 0;
        battle.noDamageTaken = false;

        // 按钮反馈
        if (btnElement) {
            btnElement.classList.add('wrong');
        }

        // 播放音效
        playSound('wrong');

        // 怪兽威胁动画
        const monsterEmoji = document.getElementById('monster-emoji');
        monsterEmoji.classList.add('threaten');
        setTimeout(() => monsterEmoji.classList.remove('threaten'), 800);

        // 显示反馈
        this.showFeedback(false, '正确答案: ' + correctAnswer);

        // 添加到错题本
        const question = battle.questions[battle.currentIndex];
        const wrongItem = {
            q: question.q,
            a: question.a,
            yourAnswer: null,
            timestamp: Date.now()
        };
        const exists = App.wrongBook.some(item => item.q === wrongItem.q);
        if (!exists) {
            App.wrongBook.push(wrongItem);
            saveProgress();
        }

        // 怪兽攻击
        setTimeout(() => {
            this.monsterAttack();
        }, 500);
    },

    // 显示反馈
    showFeedback(isCorrect, text) {
        const feedback = document.getElementById('battle-feedback');
        feedback.className = 'battle-feedback ' + (isCorrect ? 'correct' : 'wrong');
        feedback.querySelector('.battle-feedback-icon').textContent = isCorrect ? '✓' : '✗';
        feedback.querySelector('.battle-feedback-text').textContent = text;
        feedback.classList.add('show');

        setTimeout(() => {
            feedback.classList.remove('show');
        }, 1000);
    },

    // 获取随机武器
    getRandomWeapon() {
        const battle = App.battle;

        // 10连击必出稀有武器
        if (battle.combo >= 10) {
            return Math.random() < 0.5 ? this.weapons[4] : this.weapons[5]; // 彩虹或炸弹
        }

        // 权重随机
        const totalWeight = this.weapons.reduce((sum, w) => sum + w.weight, 0);
        let random = Math.random() * totalWeight;

        for (const weapon of this.weapons) {
            random -= weapon.weight;
            if (random <= 0) return weapon;
        }

        return this.weapons[0];
    },

    // 发射武器
    fireWeapon(weapon, damage = 1) {
        const battle = App.battle;
        const weaponArea = document.getElementById('weapon-area');
        const questionArea = document.querySelector('.battle-question-area');
        const rect = questionArea.getBoundingClientRect();

        // 播放攻击音效
        playSound('attack');

        // 创建武器元素
        const weaponEl = document.createElement('div');
        weaponEl.className = 'weapon';
        weaponEl.textContent = weapon.emoji;

        // 根据伤害量决定武器大小和颜色
        if (damage >= 4) {
            weaponEl.classList.add('super-weapon');
        } else if (damage >= 2) {
            weaponEl.classList.add('strong-weapon');
        }

        // 连击时发射多个武器
        const count = battle.combo >= 3 ? Math.min(battle.combo - 1, 3) : 1;

        for (let i = 0; i < count; i++) {
            const w = weaponEl.cloneNode(true);
            w.style.left = (rect.left + rect.width / 2 - 20 + (i - 1) * 30) + 'px';
            w.style.bottom = (window.innerHeight - rect.top) + 'px';

            // 连击时放大
            if (battle.combo >= 5) {
                w.style.fontSize = '3rem';
            }

            // 高伤害时额外效果
            if (damage >= 3) {
                w.style.filter = 'drop-shadow(0 0 10px gold)';
            }

            weaponArea.appendChild(w);

            setTimeout(() => w.remove(), 500);
        }

        // 高伤害时显示特效
        if (damage >= 4) {
            this.showSuperAttackEffect(weapon);
        }
    },

    // 超级攻击特效
    showSuperAttackEffect(weapon) {
        const effectEl = document.createElement('div');
        effectEl.className = 'super-attack-effect';
        effectEl.innerHTML = `
            <div class="super-attack-emoji">${weapon.emoji}</div>
            <div class="super-attack-name">${weapon.name}!</div>
        `;
        document.getElementById('battle-page').appendChild(effectEl);

        setTimeout(() => effectEl.remove(), 1000);
    },

    // 怪兽受击台词
    monsterQuips: ['哎呦!', '好痛!', '呜呜...', '住手!', '不要!', '救命!'],

    // 造成伤害
    dealDamage(damage) {
        const battle = App.battle;
        battle.monsterHP -= damage;
        battle.totalDamage += damage;

        // 播放命中音效
        playSound('hit');

        // 怪兽受击动画
        const monsterEmoji = document.getElementById('monster-emoji');
        monsterEmoji.classList.remove('hit');
        void monsterEmoji.offsetWidth; // 触发重绘
        monsterEmoji.classList.add('hit');

        // 显示伤害数字和怪兽台词
        this.showDamageNumber(damage);
        this.showMonsterQuip();

        // 更新UI
        this.updateUI();

        // 检查怪兽是否死亡
        if (battle.monsterHP <= 0) {
            this.monsterDeath();
        } else {
            // 下一题
            battle.currentIndex++;
            setTimeout(() => this.showBattleQuestion(), 800);
        }
    },

    // 显示伤害数字
    showDamageNumber(damage) {
        const container = document.getElementById('damage-numbers');
        const dmgEl = document.createElement('div');
        dmgEl.className = 'damage-number';
        dmgEl.textContent = '-' + damage;
        dmgEl.style.left = (Math.random() * 60 - 30) + 'px';
        container.appendChild(dmgEl);

        setTimeout(() => dmgEl.remove(), 800);
    },

    // 显示怪兽受击台词
    showMonsterQuip() {
        const battle = App.battle;
        const container = document.getElementById('damage-numbers');
        const quipEl = document.createElement('div');
        quipEl.className = 'monster-quip';

        // 使用当前怪兽的专属台词
        const quips = battle.currentMonster?.quips || this.monsterQuips;
        quipEl.textContent = quips[Math.floor(Math.random() * quips.length)];
        quipEl.style.left = (Math.random() * 40 - 20) + 'px';
        container.appendChild(quipEl);

        setTimeout(() => quipEl.remove(), 1000);
    },

    // 怪兽攻击
    monsterAttack() {
        const battle = App.battle;
        const monster = battle.currentMonster;

        // 播放怪兽攻击音效
        playSound('monsterAttack');

        // 怪兽攻击动画
        const monsterEmoji = document.getElementById('monster-emoji');
        monsterEmoji.classList.add('attack');

        // 显示怪兽攻击技能名称
        this.showAttackName(monster);

        // 发射怪兽专属攻击emoji
        const monsterArea = document.querySelector('.monster-area');
        const rect = monsterArea.getBoundingClientRect();
        const attackEmoji = document.createElement('div');
        attackEmoji.className = 'monster-attack-emoji';
        // 使用怪兽专属攻击图标
        attackEmoji.textContent = monster?.attack || '💥';
        attackEmoji.style.left = (rect.left + rect.width / 2 - 20) + 'px';
        attackEmoji.style.top = (rect.bottom) + 'px';
        document.getElementById('battle-page').appendChild(attackEmoji);

        setTimeout(() => {
            attackEmoji.remove();
            monsterEmoji.classList.remove('attack');
        }, 500);

        // 检查护盾
        if (battle.shield > 0) {
            battle.shield--;
            this.showFeedback(true, '🛡️ 护盾抵挡!');
            playSound('correct');
            // 下一题
            battle.currentIndex++;
            setTimeout(() => this.showBattleQuestion(), 1000);
            return;
        }

        // 屏幕闪红
        const screenFlash = document.getElementById('screen-flash');
        screenFlash.classList.add('show');
        setTimeout(() => screenFlash.classList.remove('show'), 300);

        // 扣血
        battle.playerHP--;
        this.updateUI();

        // 检查游戏结束
        if (battle.playerHP <= 0) {
            // 检查复活道具
            if (battle.hasRevive) {
                battle.hasRevive = false;
                battle.playerHP = 1;
                this.showFeedback(true, '🌿 复活草救了你!');
                playSound('achievement');
                createConfetti(20);
                this.updateUI();
                battle.currentIndex++;

                // 检查复活英雄成就
                const achievements = App.stats.achievements;
                if (!achievements.includes('revive_hero')) {
                    achievements.push('revive_hero');
                    saveProgress();
                    setTimeout(() => {
                        const ach = MathData.achievements.find(a => a.id === 'revive_hero');
                        if (ach) showAchievement(ach);
                    }, 2000);
                }

                setTimeout(() => this.showBattleQuestion(), 1500);
            } else {
                setTimeout(() => this.gameOver(false), 800);
            }
        } else {
            // 下一题
            battle.currentIndex++;
            setTimeout(() => this.showBattleQuestion(), 1000);
        }
    },

    // 显示怪兽攻击技能名称
    showAttackName(monster) {
        if (!monster?.attackName) return;

        const attackNameEl = document.createElement('div');
        attackNameEl.className = 'monster-attack-name';
        attackNameEl.textContent = monster.attackName;
        document.getElementById('battle-page').appendChild(attackNameEl);

        setTimeout(() => attackNameEl.remove(), 1200);
    },

    // 怪兽死亡
    monsterDeath() {
        const battle = App.battle;
        battle.monstersDefeated++;

        // 添加到图鉴收集
        if (battle.currentMonster && battle.currentMonster.id) {
            const isNew = this.addToCollection(battle.currentMonster.id);
            if (isNew) {
                setTimeout(() => this.showNewCollectionToast(battle.currentMonster), 800);
            }
        }

        // 死亡动画
        const monsterEmoji = document.getElementById('monster-emoji');
        monsterEmoji.classList.add('death');

        // 播放击败音效
        playSound('defeat');

        // 爆炸特效
        createConfetti(40);

        setTimeout(() => {
            // 检查是否通关
            if (battle.currentStage >= battle.totalStages) {
                this.gameOver(true);
            } else {
                // 下一关
                battle.currentStage++;
                battle.currentIndex++;
                this.initStage();
            }
        }, 1200);
    },

    // 显示恢复特效
    showHealEffect() {
        const heartsEl = document.getElementById('player-hearts');
        heartsEl.classList.add('hp-recover');
        setTimeout(() => heartsEl.classList.remove('hp-recover'), 500);

        // 显示恢复提示
        this.showFeedback(true, '❤️ +1 HP');
    },

    // 游戏结束
    gameOver(isVictory) {
        const battle = App.battle;
        battle.active = false;

        if (isVictory) {
            // 计算得分
            let score = battle.monstersDefeated * 50;
            if (battle.noDamageTaken) score += 30;
            if (battle.maxCombo >= 10) score += 50;

            // 更新统计
            App.stats.totalScore += score;
            App.stats.totalCorrect += battle.correctCount;
            if (battle.maxCombo > App.stats.maxStreak) {
                App.stats.maxStreak = battle.maxCombo;
            }
            saveProgress();

            // 显示胜利页面
            document.getElementById('result-monsters').textContent = battle.monstersDefeated;
            document.getElementById('result-answers').textContent = battle.correctCount;
            document.getElementById('result-max-combo').textContent = battle.maxCombo;
            document.getElementById('result-battle-score').textContent = '+' + score;

            showPage('battle-result');

            // 庆祝特效
            setTimeout(() => {
                createConfetti(100);
                playSound('complete');
            }, 300);

            // 检查战斗专属成就
            this.checkBattleAchievements();

            // 检查通用成就
            checkAchievements(battle.maxCombo, App.stats.totalCorrect);
        } else {
            // 显示失败页面
            document.getElementById('fail-monsters').textContent = battle.monstersDefeated;
            document.getElementById('fail-answers').textContent = battle.correctCount;

            // 鼓励文案
            const encourages = [
                '差一点就成功了！再试一次？',
                '别灰心，再来一次！',
                '你已经很棒了，继续加油！',
                '失败是成功之母，再战！'
            ];
            document.getElementById('battle-fail-subtitle').textContent =
                encourages[Math.floor(Math.random() * encourages.length)];

            // 播放失败音效
            playSound('gameOver');

            showPage('battle-fail');
        }
    },

    // 检查战斗专属成就
    checkBattleAchievements() {
        const battle = App.battle;
        const achievements = App.stats.achievements;

        // 初战告捷：首次完成战斗模式
        if (!achievements.includes('battle_first_win')) {
            achievements.push('battle_first_win');
            saveProgress();
            const ach = MathData.achievements.find(a => a.id === 'battle_first_win');
            if (ach) showAchievement(ach);
        }

        // 毫发无损：无伤通关
        if (battle.noDamageTaken && !achievements.includes('battle_no_damage')) {
            achievements.push('battle_no_damage');
            saveProgress();
            setTimeout(() => {
                const ach = MathData.achievements.find(a => a.id === 'battle_no_damage');
                if (ach) showAchievement(ach);
            }, 2000);
        }

        // 屠龙勇士：击败火焰龙宝宝（第4关）
        if (battle.monstersDefeated >= 4 && !achievements.includes('battle_dragon_slayer')) {
            achievements.push('battle_dragon_slayer');
            saveProgress();
            setTimeout(() => {
                const ach = MathData.achievements.find(a => a.id === 'battle_dragon_slayer');
                if (ach) showAchievement(ach);
            }, 3000);
        }

        // 魔王终结者：击败九九魔王（困难模式第6关）
        if (battle.difficulty === 'hard' && battle.monstersDefeated >= 6 && !achievements.includes('battle_demon_king')) {
            achievements.push('battle_demon_king');
            saveProgress();
            setTimeout(() => {
                const ach = MathData.achievements.find(a => a.id === 'battle_demon_king');
                if (ach) showAchievement(ach);
            }, 4000);
        }

        // 连击大师：战斗中达成10连击
        if (battle.maxCombo >= 10 && !achievements.includes('battle_10_combo')) {
            achievements.push('battle_10_combo');
            saveProgress();
            setTimeout(() => {
                const ach = MathData.achievements.find(a => a.id === 'battle_10_combo');
                if (ach) showAchievement(ach);
            }, 5000);
        }

        // 速战速决：3分钟内通关简单难度
        const totalTime = (Date.now() - battle.startTime) / 1000;
        if (battle.difficulty === 'easy' && totalTime <= 180 && !achievements.includes('battle_speedrun')) {
            achievements.push('battle_speedrun');
            saveProgress();
            setTimeout(() => {
                const ach = MathData.achievements.find(a => a.id === 'battle_speedrun');
                if (ach) showAchievement(ach);
            }, 6000);
        }

        // 收集达人：单局收集5个道具
        if (battle.itemsCollected >= 5 && !achievements.includes('item_collector')) {
            achievements.push('item_collector');
            saveProgress();
            setTimeout(() => {
                const ach = MathData.achievements.find(a => a.id === 'item_collector');
                if (ach) showAchievement(ach);
            }, 7000);
        }

        // 道具大师：使用3个以上道具通关
        if (battle.itemsUsed >= 3 && !achievements.includes('item_master')) {
            achievements.push('item_master');
            saveProgress();
            setTimeout(() => {
                const ach = MathData.achievements.find(a => a.id === 'item_master');
                if (ach) showAchievement(ach);
            }, 8000);
        }
    },

    // 退出战斗
    exitBattle() {
        App.battle.active = false;
        showPage('xiaojiujiu-mode');
    }
};
