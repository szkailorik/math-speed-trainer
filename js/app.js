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
        healCounter: 0  // 连续答对计数，用于恢复血量
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
    // 怪兽配置
    monsters: [
        { name: '数字史莱姆', emoji: '🟢', hp: 3 },
        { name: '调皮小鬼', emoji: '👻', hp: 4 },
        { name: '骷髅数学家', emoji: '💀', hp: 5 },
        { name: '火焰龙宝宝', emoji: '🐲', hp: 6 }
    ],

    // 困难模式额外怪兽
    hardMonsters: [
        { name: '冰霜巨人', emoji: '🧊', hp: 7 },
        { name: '九九魔王', emoji: '👹', hp: 8 }
    ],

    // 武器配置
    weapons: [
        { emoji: '🔥', name: '火球', weight: 25 },
        { emoji: '🧊', name: '冰箭', weight: 20 },
        { emoji: '⚡', name: '雷电', weight: 20 },
        { emoji: '⭐', name: '星星', weight: 20 },
        { emoji: '🌈', name: '彩虹', weight: 10 },
        { emoji: '💣', name: '炸弹', weight: 5 }
    ],

    // 初始化
    init() {
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

        // 根据难度设置
        const diffSettings = {
            easy: { playerHP: 5, stages: 4 },
            normal: { playerHP: 4, stages: 4 },
            hard: { playerHP: 3, stages: 6 }
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

        // 初始化第一关怪兽
        this.initStage();
    },

    // 初始化关卡
    initStage() {
        const battle = App.battle;
        const stageIndex = battle.currentStage - 1;

        // 获取怪兽
        let monster;
        if (battle.difficulty === 'hard' && stageIndex >= 4) {
            monster = this.hardMonsters[stageIndex - 4];
        } else {
            monster = this.monsters[Math.min(stageIndex, this.monsters.length - 1)];
        }

        battle.monsterHP = monster.hp;
        battle.monsterMaxHP = monster.hp;

        // 更新UI
        this.updateUI();

        // 显示怪兽
        document.getElementById('monster-name').textContent = monster.name;
        const monsterEmoji = document.getElementById('monster-emoji');
        monsterEmoji.textContent = monster.emoji;
        monsterEmoji.className = 'monster-emoji';

        // 显示关卡过渡动画
        this.showStageTransition(battle.currentStage, monster);

        // 延迟显示第一题
        setTimeout(() => {
            this.showBattleQuestion();
        }, 1500);
    },

    // 显示关卡过渡
    showStageTransition(stage, monster) {
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

        // 显示题目
        document.getElementById('battle-question-text').textContent = question.q;

        // 根据设置或题目属性决定模式
        const useInputMode = question.forceInput || App.settings.mode === 'input';

        if (useInputMode) {
            document.getElementById('battle-choices').classList.add('hidden');
            document.getElementById('battle-input-mode').classList.remove('hidden');
            const input = document.getElementById('battle-answer-input');
            input.value = '';
            setTimeout(() => input.focus(), 100);
        } else {
            document.getElementById('battle-choices').classList.remove('hidden');
            document.getElementById('battle-input-mode').classList.add('hidden');

            // 生成选项
            const choices = this.generateChoices(question.a);
            const choicesContainer = document.getElementById('battle-choices');
            choicesContainer.innerHTML = choices.map(c =>
                `<button class="battle-choice-btn">${c}</button>`
            ).join('');

            // 绑定点击事件
            choicesContainer.querySelectorAll('.battle-choice-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (!btn.disabled) {
                        this.checkAnswer(btn.textContent, btn);
                    }
                });
            });
        }
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

        // 显示反馈
        this.showFeedback(true, '正确!');

        // 计算伤害
        let damage = 1;
        if (battle.combo >= 5) damage = 2;
        if (battle.combo >= 3 && battle.combo < 5) damage = battle.difficulty === 'easy' ? 1 : 2;

        // 检查炸弹武器
        const weapon = this.getRandomWeapon();
        if (weapon.emoji === '💣') damage += 1;

        // 发射武器
        this.fireWeapon(weapon);

        // 延迟处理伤害
        setTimeout(() => {
            this.dealDamage(damage);

            // 检查血量恢复（连续答对5题）
            if (battle.healCounter >= 5 && battle.playerHP < battle.playerMaxHP) {
                battle.playerHP++;
                battle.healCounter = 0;
                this.showHealEffect();
            }
        }, 400);
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

        // 显示反馈
        this.showFeedback(false, '正确答案: ' + correctAnswer);

        // 添加到错题本
        const question = battle.questions[battle.currentIndex];
        addToWrongBook(question);

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
    fireWeapon(weapon) {
        const battle = App.battle;
        const weaponArea = document.getElementById('weapon-area');
        const questionArea = document.querySelector('.battle-question-area');
        const rect = questionArea.getBoundingClientRect();

        // 创建武器元素
        const weaponEl = document.createElement('div');
        weaponEl.className = 'weapon';
        weaponEl.textContent = weapon.emoji;

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

            weaponArea.appendChild(w);

            setTimeout(() => w.remove(), 500);
        }
    },

    // 造成伤害
    dealDamage(damage) {
        const battle = App.battle;
        battle.monsterHP -= damage;
        battle.totalDamage += damage;

        // 怪兽受击动画
        const monsterEmoji = document.getElementById('monster-emoji');
        monsterEmoji.classList.remove('hit');
        void monsterEmoji.offsetWidth; // 触发重绘
        monsterEmoji.classList.add('hit');

        // 显示伤害数字
        this.showDamageNumber(damage);

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

    // 怪兽攻击
    monsterAttack() {
        const battle = App.battle;

        // 怪兽攻击动画
        const monsterEmoji = document.getElementById('monster-emoji');
        monsterEmoji.classList.add('attack');

        // 发射攻击emoji
        const monsterArea = document.querySelector('.monster-area');
        const rect = monsterArea.getBoundingClientRect();
        const attackEmoji = document.createElement('div');
        attackEmoji.className = 'monster-attack-emoji';
        attackEmoji.textContent = '💥';
        attackEmoji.style.left = (rect.left + rect.width / 2 - 20) + 'px';
        attackEmoji.style.top = (rect.bottom) + 'px';
        document.getElementById('battle-page').appendChild(attackEmoji);

        setTimeout(() => {
            attackEmoji.remove();
            monsterEmoji.classList.remove('attack');
        }, 500);

        // 屏幕闪红
        const screenFlash = document.getElementById('screen-flash');
        screenFlash.classList.add('show');
        setTimeout(() => screenFlash.classList.remove('show'), 300);

        // 扣血
        battle.playerHP--;
        this.updateUI();

        // 检查游戏结束
        if (battle.playerHP <= 0) {
            setTimeout(() => this.gameOver(false), 800);
        } else {
            // 下一题
            battle.currentIndex++;
            setTimeout(() => this.showBattleQuestion(), 1000);
        }
    },

    // 怪兽死亡
    monsterDeath() {
        const battle = App.battle;
        battle.monstersDefeated++;

        // 死亡动画
        const monsterEmoji = document.getElementById('monster-emoji');
        monsterEmoji.classList.add('death');

        // 播放音效
        playSound('streak');

        // 爆炸特效
        createConfetti(30);

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
            saveData();

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

            // 检查成就
            checkAchievements();
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

            showPage('battle-fail');
        }
    },

    // 退出战斗
    exitBattle() {
        App.battle.active = false;
        showPage('xiaojiujiu-mode');
    }
};
