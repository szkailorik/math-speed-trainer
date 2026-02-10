/**
 * ui-pages.js - User UI, home page, settings, wrong book, achievements, event bindings
 */

// ===== User Management UI =====

function renderUserList() {
    const users = UserManager.getUsers();
    const userList = document.getElementById('user-list');

    if (users.length === 0) {
        userList.innerHTML = '<p class="no-users">\u8FD8\u6CA1\u6709\u7528\u6237\uFF0C\u70B9\u51FB\u4E0B\u65B9\u6DFB\u52A0</p>';
        return;
    }

    userList.innerHTML = users.map(user => {
        const userData = localStorage.getItem(UserManager.getDataKey(user.id));
        let statsText = '\u65B0\u7528\u6237';
        if (userData) {
            try {
                const data = JSON.parse(userData);
                statsText = `\u603B\u5206: ${data.stats?.totalScore || 0}`;
            } catch (e) {}
        }

        return `
            <div class="user-card" data-user-id="${user.id}">
                <button class="delete-user" data-user-id="${user.id}" title="\u5220\u9664\u7528\u6237">\u00D7</button>
                <span class="avatar">${user.avatar}</span>
                <span class="name">${user.name}</span>
                <span class="user-stats">${statsText}</span>
            </div>
        `;
    }).join('');

    userList.querySelectorAll('.user-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-user')) return;
            const userId = card.dataset.userId;
            selectUser(userId);
        });
    });

    userList.querySelectorAll('.delete-user').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const userId = btn.dataset.userId;
            const users = UserManager.getUsers();
            const user = users.find(u => u.id === userId);
            if (user && confirm(`\u786E\u5B9A\u8981\u5220\u9664\u7528\u6237 "${user.name}" \u5417\uFF1F\u6240\u6709\u6570\u636E\u5C06\u88AB\u6E05\u9664\u3002`)) {
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
    document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelector('.avatar-option[data-avatar="\u2694\uFE0F"]').classList.add('selected');
}

function createNewUser() {
    const nameInput = document.getElementById('user-name-input');
    const name = nameInput.value.trim();

    if (!name) {
        alert('\u8BF7\u8F93\u5165\u540D\u5B57');
        nameInput.focus();
        return;
    }

    const selectedAvatar = document.querySelector('.avatar-option.selected');
    const avatar = selectedAvatar ? selectedAvatar.dataset.avatar : '\u2694\uFE0F';

    const newUser = UserManager.addUser(name, avatar);
    hideAddUserForm();
    renderUserList();

    selectUser(newUser.id);
}

function initUserPage() {
    renderUserList();

    document.getElementById('add-user-btn').addEventListener('click', showAddUserForm);
    document.getElementById('cancel-add-user').addEventListener('click', hideAddUserForm);
    document.getElementById('confirm-add-user').addEventListener('click', createNewUser);

    document.getElementById('user-name-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') createNewUser();
    });

    document.querySelectorAll('.avatar-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
        });
    });

    const currentUser = UserManager.getCurrentUser();
    if (currentUser) {
        loadProgress();
        updateCurrentUserBadge();
        showPage('home');
    }
}

// ===== Home Page Stats =====

function updateHomeStats() {
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

// ===== Settings =====

function applySettings() {
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

// ===== Learn Cards =====

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

    const tabNames = {
        xiaojiujiu: '\u5C0F\u4E5D\u4E5D\u901F\u7B97',
        times: '\u5927\u4E5D\u4E5D+\u5E73\u65B9',
        multiply: '\u4E58\u6CD5\u901F\u8BB0',
        fraction: '\u5206\u6570\u5C0F\u6570',
        decimal: '\u5C0F\u6570\u89C4\u5F8B',
        unit: '\u5355\u4F4D\u6362\u7B97'
    };

    const practiceBtn = `
        <button class="start-practice-btn" onclick="startPractice('${tab}'); showPage('practice');">
            \u5F00\u59CB\u7EC3\u4E60 ${tabNames[tab] || tab} \u2192
        </button>
    `;

    content.innerHTML = cardsHtml + practiceBtn;
}

// ===== Wrong Book =====

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
                ${item.monsterEmoji ? `<div class="wrong-battle-log">\uD83D\uDCA5 \u88AB ${item.monsterEmoji} <b>${item.monsterName || '\u602A\u517D'}</b> \u51FB\u4F24</div>` : ''}
                <div class="wrong-answer">
                    ${item.yourAnswer ? `<span class="wrong-your">${item.yourAnswer}</span>` : `<span class="wrong-timeout">\u23F1\uFE0F \u8D85\u65F6</span>`}
                    <span class="wrong-correct">${item.a}</span>
                </div>
            </div>
            <button class="delete-wrong-btn" onclick="deleteWrongItem(${index})">\u2715</button>
        </div>
    `).join('');
}

function clearWrongBook() {
    if (App.wrongBook.length === 0) return;

    if (confirm('\u786E\u5B9A\u8981\u6E05\u7A7A\u9B54\u6CD5\u6B8B\u9875\u5417\uFF1F')) {
        App.wrongBook = [];
        saveProgress();
        renderWrongBook();
        updateHomeStats();
    }
}

function deleteWrongItem(index) {
    App.wrongBook.splice(index, 1);
    saveProgress();
    renderWrongBook();
    updateHomeStats();
}

// ===== Achievements Display =====

function renderAchievements() {
    const grid = document.getElementById('achievements-grid');
    const summaryEl = document.getElementById('achievements-summary');
    const unlockedAchievements = App.stats.achievements || [];

    const unlocked = unlockedAchievements.length;
    const total = MathData.achievements.length;
    if (summaryEl) {
        summaryEl.innerHTML = `<span class="summary-count">${unlocked}/${total}</span><span class="summary-label">\u6210\u5C31\u5DF2\u89E3\u9501</span>`;
    }

    grid.innerHTML = MathData.achievements.map(achievement => {
        const isUnlocked = unlockedAchievements.includes(achievement.id);
        return `
            <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-card-icon">${isUnlocked ? achievement.icon : '\uD83D\uDD12'}</div>
                <div class="achievement-card-name">${achievement.name}</div>
                <div class="achievement-card-desc">${achievement.desc}</div>
            </div>
        `;
    }).join('');
}

// ===== Event Listeners =====
// B03 fix: use a flag to prevent duplicate binding
var _eventListenersBound = false;

function initEventListeners() {
    if (_eventListenersBound) return;
    _eventListenersBound = true;

    // Menu buttons
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const module = btn.dataset.module;

            if (module === 'learn') {
                showPage('learn');
                renderLearnContent('xiaojiujiu');
            } else if (module === 'daily') {
                App.currentModule = 'daily';
                showPage('daily');
                initDailyChallenge();
            } else if (module === 'wrong') {
                showPage('wrong');
                renderWrongBook();
            } else if (module === 'achievements') {
                renderAchievements();
                showPage('achievements');
            } else if (module === 'mixed') {
                // v16.0: Trial tower - handled by app.js event listener
                return;
            } else if (module) {
                startPractice(module);
            }
        });
    });

    // Back buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
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

    // Settings button
    document.getElementById('settings-btn').addEventListener('click', () => {
        showPage('settings');
    });

    // Setting options
    document.querySelectorAll('.setting-opt').forEach(btn => {
        btn.addEventListener('click', () => {
            changeSetting(btn.dataset.setting, btn.dataset.value);
        });
    });

    // Reset progress
    document.getElementById('reset-progress').addEventListener('click', resetProgress);

    // Difficulty buttons
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            App.difficulty = btn.dataset.diff;
        });
    });

    // Learn tabs
    document.querySelectorAll('.learn-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.learn-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderLearnContent(tab.dataset.tab);
        });
    });

    // Input answer submit
    document.getElementById('submit-btn').addEventListener('click', submitInputAnswer);
    document.getElementById('answer-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitInputAnswer();
        }
    });

    // Wrong book actions
    document.getElementById('clear-wrong').addEventListener('click', clearWrongBook);
    document.getElementById('practice-wrong').addEventListener('click', () => {
        startPractice('wrong');
    });

    // Result page buttons
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

    // Achievement popup close
    document.getElementById('achievement-popup').addEventListener('click', () => {
        const popup = document.getElementById('achievement-popup');
        popup.classList.remove('show');
        setTimeout(() => popup.classList.add('hidden'), 300);
    });
}
