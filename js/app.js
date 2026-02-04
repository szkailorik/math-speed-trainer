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

// 创建彩色纸屑特效
function createConfetti(count = 50) {
    const colors = ['#6C5CE7', '#34C759', '#FF9500', '#FF3B30', '#5AC8FA', '#AF52DE', '#FFD60A'];
    const effectsLayer = document.getElementById('effects-layer');

    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
        confetti.style.width = (6 + Math.random() * 8) + 'px';
        confetti.style.height = (6 + Math.random() * 8) + 'px';
        effectsLayer.appendChild(confetti);

        setTimeout(() => confetti.remove(), 4000);
    }
}

// 创建星星爆炸效果
function createStarBurst(x, y) {
    const stars = ['⭐', '✨', '🌟', '💫'];
    const effectsLayer = document.getElementById('effects-layer');

    for (let i = 0; i < 6; i++) {
        const star = document.createElement('div');
        star.className = 'star-burst';
        star.textContent = stars[Math.floor(Math.random() * stars.length)];

        const angle = (i / 6) * Math.PI * 2;
        const distance = 50 + Math.random() * 30;
        const endX = x + Math.cos(angle) * distance;
        const endY = y + Math.sin(angle) * distance;

        star.style.left = x + 'px';
        star.style.top = y + 'px';
        star.style.setProperty('--end-x', endX + 'px');
        star.style.setProperty('--end-y', endY + 'px');

        effectsLayer.appendChild(star);
        setTimeout(() => star.remove(), 600);
    }
}

// 创建+分数飘浮效果
function createScorePopup(element, score, isCorrect) {
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: absolute;
        font-size: 1.5rem;
        font-weight: 700;
        color: ${isCorrect ? '#34C759' : '#FF3B30'};
        pointer-events: none;
        z-index: 1000;
        animation: score-float 0.8s ease-out forwards;
    `;
    popup.textContent = isCorrect ? '+10' : '×';

    const rect = element.getBoundingClientRect();
    popup.style.left = rect.left + rect.width / 2 - 20 + 'px';
    popup.style.top = rect.top + 'px';

    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 800);
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
        if (!moduleData) return;

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

    // 根据模式显示选项
    if (App.settings.mode === 'choice') {
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
        choices.classList.add('hidden');
        inputMode.classList.remove('hidden');

        const input = document.getElementById('answer-input');
        input.value = '';
        input.focus();
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

    // 连胜特效
    if (App.practice.streak === 3) {
        // 首次达到3连胜
        playSound('streak');
        createConfetti(20);
    } else if (App.practice.streak > 0 && App.practice.streak % 5 === 0) {
        // 每5连胜
        playSound('streak');
        createConfetti(40);
        // 在按钮位置显示星星爆炸
        if (btnElement) {
            const rect = btnElement.getBoundingClientRect();
            createStarBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
    } else if (App.practice.streak === 10 || App.practice.streak === 20) {
        // 10连胜和20连胜特别庆祝
        playSound('achievement');
        createConfetti(60);
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
    const modules = ['times', 'multiply', 'fraction', 'decimal', 'square'];

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

    // 处理 iOS 软键盘
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            setTimeout(() => {
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });

    // 键盘快捷键支持（1234选择答案）
    document.addEventListener('keydown', (e) => {
        if (App.currentPage === 'practice' || App.currentPage === 'daily') {
            const key = e.key;
            if (['1', '2', '3', '4'].includes(key)) {
                const choicesContainer = App.currentPage === 'daily'
                    ? document.getElementById('daily-choices')
                    : document.getElementById('choices');
                const buttons = choicesContainer.querySelectorAll('.choice-btn:not(:disabled)');
                const index = parseInt(key) - 1;
                if (buttons[index]) {
                    buttons[index].click();
                }
            }
        }
    });
});
