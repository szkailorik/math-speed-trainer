/**
 * core.js - UserManager + App state + utility functions + persistence
 */

// ===== User Management =====
const UserManager = {
    getUsers() {
        try {
            const users = localStorage.getItem('mathSpeedTrainer_users');
            if (users) {
                return JSON.parse(users);
            }
        } catch (e) {
            console.error('Failed to read users from localStorage', e);
        }
        const defaultUsers = [
            { id: 'lorik', name: 'Lorik', avatar: '\u2694\uFE0F', createdAt: Date.now() },
            { id: 'kai', name: 'Kai', avatar: '\uD83E\uDDD9', createdAt: Date.now() }
        ];
        this.saveUsers(defaultUsers);
        return defaultUsers;
    },

    saveUsers(users) {
        try {
            localStorage.setItem('mathSpeedTrainer_users', JSON.stringify(users));
        } catch (e) {
            console.error('Failed to save users to localStorage', e);
        }
    },

    getCurrentUser() {
        try {
            const userId = localStorage.getItem('mathSpeedTrainer_currentUser');
            const users = this.getUsers();
            if (userId) {
                const user = users.find(u => u.id === userId);
                if (user) return user;
            }
        } catch (e) {
            console.error('Failed to get current user', e);
        }
        return null;
    },

    setCurrentUser(userId) {
        try {
            localStorage.setItem('mathSpeedTrainer_currentUser', userId);
        } catch (e) {
            console.error('Failed to set current user', e);
        }
    },

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

    deleteUser(userId) {
        let users = this.getUsers();
        users = users.filter(u => u.id !== userId);
        this.saveUsers(users);
        try {
            localStorage.removeItem('mathSpeedTrainer_' + userId);
            if (localStorage.getItem('mathSpeedTrainer_currentUser') === userId) {
                localStorage.removeItem('mathSpeedTrainer_currentUser');
            }
        } catch (e) {
            console.error('Failed to clean up user data', e);
        }
    },

    getDataKey(userId) {
        return 'mathSpeedTrainer_' + userId;
    }
};

// ===== App State =====
const App = {
    currentPage: 'home',
    currentModule: null,
    difficulty: 'easy',
    fractionDifficulty: 'easy',
    decimalDifficulty: 'easy',
    unitDifficulty: 'easy',
    multiplyDifficulty: 'easy',
    timesDifficulty: 'easy',

    settings: {
        mode: 'choice',
        timer: 'off',
        count: 20,
        theme: 'light',
        sound: 'on'
    },

    stats: {
        totalScore: 0,
        maxStreak: 0,
        totalCorrect: 0,
        achievements: [],
        todayCount: 0,
        todayDate: null
    },

    wrongBook: [],

    practice: {
        questions: [],
        currentIndex: 0,
        correctCount: 0,
        streak: 0,
        startTime: null,
        timerInterval: null,
        timePerQuestion: 10,
    },

    daily: {
        questions: [],
        currentIndex: 0,
        results: [],
        startTime: null,
        timerInterval: null,
        completed: false
    },

    battle: {
        active: false,
        module: 'xiaojiujiu',
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
        healCounter: 0,
        currentMonster: null,
        monsterQueue: [],
        inventory: [],
        activeItem: null,
        shield: 0,
        hasRevive: false,
        itemsUsed: 0,
        itemsCollected: 0,
        // v15.0: behavior + card system fields
        turnCount: 0,
        monsterEnraged: false,
        monsterDefending: false,
        escapePending: false,
        summonActive: false,
        dodged: false,
        cardDropCount: 0,
        noDamageOnCurrentMonster: true,
        escapesPrevented: 0,
        survivedSelfDestruct: 0,
        bossWithSummonCleared: 0,
        // v16.0: combo stage system
        comboStage: 'normal',        // 'normal'|'awakened'|'will'|'godlike'|'invincible'
        comboShieldActive: false,     // combo >= 10 first wrong doesn't reset
        comboShieldUsed: false,       // shield used this battle
        lastAnswerWrong: false,       // for memory combo recovery
        // v16.0: new behavior states
        monsterShielded: false,       // monster has active shield
        monsterCursed: false,         // curse active (5 choices)
        curseRemainingTurns: 0,       // curse countdown
        monsterPhase: 1,             // boss phase (1 or 2)
        splitActive: false,           // split minion alive
        counterPending: false,        // counter attack next correct
        // v16.0: personality tracking
        behaviorsEncountered: [],     // track all behavior types seen
        personalitiesEncountered: []  // track all personality types seen
    },

    // v16.0: Trial Tower state
    tower: {
        active: false,
        currentFloor: 1,
        maxFloorReached: 0,
        playerHP: 5,
        playerMaxHP: 5,
        currentZone: 'intro',       // 'intro'|'trial'|'inferno'|'top'
        monstersDefeatedThisRun: 0,
        totalDamageThisRun: 0,
        startTime: null,
        lastAttemptTime: null,
        floorMonster: null,
        floorQuestions: [],
        floorIndex: 0,
        fusionQuestionsAnswered: 0
    },

    // v16.0: Math Crystal currency
    crystals: 0
};

// ===== Utility Functions =====

function formatFraction(text) {
    if (typeof text !== 'string') {
        text = String(text);
    }
    return text.replace(/(\d+)\/(\d+)/g, (match, numerator, denominator) => {
        return `<span class="fraction"><span class="numerator">${numerator}</span><span class="denominator">${denominator}</span></span>`;
    });
}

function containsFraction(text) {
    return /\d+\/\d+/.test(String(text));
}

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ===== Page Navigation =====
// B01 fix: clear all active timers when switching pages
function showPage(pageId) {
    // Clear practice timer
    if (App.practice.timerInterval) {
        clearInterval(App.practice.timerInterval);
        App.practice.timerInterval = null;
    }
    // Clear daily timer
    if (App.daily.timerInterval) {
        clearInterval(App.daily.timerInterval);
        App.daily.timerInterval = null;
    }

    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
        App.currentPage = pageId;
    }
}

// ===== Data Persistence =====
// B02 fix: all localStorage operations wrapped in try-catch

function saveProgress() {
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) return;

    const data = {
        stats: App.stats,
        wrongBook: App.wrongBook,
        settings: App.settings
    };
    try {
        localStorage.setItem(UserManager.getDataKey(currentUser.id), JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save progress', e);
    }
}

function loadProgress() {
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) return;

    try {
        const saved = localStorage.getItem(UserManager.getDataKey(currentUser.id));
        if (saved) {
            const data = JSON.parse(saved);
            App.stats = { ...App.stats, ...data.stats };
            App.wrongBook = data.wrongBook || [];
            App.settings = { ...App.settings, ...data.settings };
        } else {
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
    } catch (e) {
        console.error('Failed to load progress', e);
    }
    updateHomeStats();
    applySettings();
}

function resetProgress() {
    const currentUser = UserManager.getCurrentUser();
    const userName = currentUser ? currentUser.name : '\u5F53\u524D\u7528\u6237';
    if (confirm(`\u786E\u5B9A\u8981\u91CD\u7F6E ${userName} \u7684\u6240\u6709\u8FDB\u5EA6\u5417\uFF1F\u8FD9\u5C06\u6E05\u9664\u6240\u6709\u7EDF\u8BA1\u6570\u636E\u548C\u9B54\u6CD5\u6B8B\u9875\u3002`)) {
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
        alert('\u5DF2\u91CD\u7F6E\u6240\u6709\u8FDB\u5EA6');
    }
}
