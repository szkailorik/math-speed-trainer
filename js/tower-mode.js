/**
 * tower-mode.js - Trial Tower (试炼之塔) mode controller
 * Extends BattleMode with tower-specific flow: floor progression,
 * zone management, fusion questions, and tower lobby UI.
 */

// ===== Tower Progress Persistence =====

BattleMode.getTowerProgress = function() {
    var currentUser = UserManager.getCurrentUser();
    if (!currentUser) return null;
    try {
        var key = 'mathSpeedTrainer_tower_' + currentUser.id;
        var saved = localStorage.getItem(key);
        if (saved) return JSON.parse(saved);
    } catch (e) {
        console.error('Failed to load tower progress', e);
    }
    return null;
};

BattleMode.saveTowerProgress = function() {
    var currentUser = UserManager.getCurrentUser();
    if (!currentUser) return;
    var tower = App.tower;
    var data = {
        maxFloorReached: tower.maxFloorReached,
        lastAttemptTime: tower.lastAttemptTime
    };
    try {
        var key = 'mathSpeedTrainer_tower_' + currentUser.id;
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save tower progress', e);
    }
};

BattleMode.loadTowerProgress = function() {
    var saved = this.getTowerProgress();
    if (saved) {
        App.tower.maxFloorReached = saved.maxFloorReached || 0;
        App.tower.lastAttemptTime = saved.lastAttemptTime || null;
    }
};

// ===== Tower Unlock Check =====

BattleMode.isTowerUnlocked = function() {
    return App.stats.totalScore >= 500;
};

// ===== Tower Lobby =====

// v16.2: 10-minute cooldown constant (ms)
var TOWER_COOLDOWN_MS = 10 * 60 * 1000;

BattleMode.getTowerCooldownRemaining = function() {
    var tower = App.tower;
    if (!tower.lastAttemptTime) return 0;
    var elapsed = Date.now() - tower.lastAttemptTime;
    return Math.max(0, TOWER_COOLDOWN_MS - elapsed);
};

BattleMode.showTowerLobby = function() {
    this.loadTowerProgress();
    this.renderTowerLobby();
    showPage('tower-lobby');
    this._startTowerCooldownTimer();
};

BattleMode.renderTowerLobby = function() {
    var tower = App.tower;
    var maxFloor = tower.maxFloorReached;
    var lobbyContent = document.getElementById('tower-lobby-content');
    if (!lobbyContent) return;

    var progressPercent = Math.round((maxFloor / 30) * 100);

    var zones = [
        { name: '入门区', range: '1-9', icon: '📖', start: 1, end: 9 },
        { name: '门卫Boss', range: '10', icon: '🗿', start: 10, end: 10 },
        { name: '试炼区', range: '11-19', icon: '⚔️', start: 11, end: 19 },
        { name: '中Boss', range: '20', icon: '🛡️', start: 20, end: 20 },
        { name: '炼狱区', range: '21-29', icon: '🔥', start: 21, end: 29 },
        { name: '塔顶王座', range: '30', icon: '👑', start: 30, end: 30 }
    ];

    var zonesHtml = zones.map(function(zone) {
        var status, statusClass;
        if (maxFloor >= zone.end) {
            status = '✅完成';
            statusClass = 'completed';
        } else if (maxFloor >= zone.start - 1) {
            status = '🔥进行中';
            statusClass = 'active';
        } else {
            status = '🔒未解锁';
            statusClass = 'locked';
        }
        return '<div class="tower-zone-item ' + statusClass + '">' +
            '<span class="tower-zone-icon">' + zone.icon + '</span>' +
            '<span class="tower-zone-name">' + zone.name + ' (' + zone.range + ')</span>' +
            '<span class="tower-zone-status">' + status + '</span>' +
        '</div>';
    }).join('');

    var continueFloor = Math.min(maxFloor + 1, 30);
    var cooldownRemaining = this.getTowerCooldownRemaining();
    var inCooldown = cooldownRemaining > 0;
    var continueDisabled = inCooldown ? ' disabled' : '';
    var cooldownText = '';
    if (inCooldown) {
        var mins = Math.ceil(cooldownRemaining / 60000);
        cooldownText = '冷却中，' + mins + '分钟后可再次挑战';
    }

    lobbyContent.innerHTML =
        '<div class="tower-progress-section">' +
            '<div class="tower-progress-label">当前进度: 第 ' + maxFloor + ' 层 / 30</div>' +
            '<div class="tower-progress-bar">' +
                '<div class="tower-progress-fill" style="width:' + progressPercent + '%"></div>' +
            '</div>' +
        '</div>' +
        '<div class="tower-zones-list">' + zonesHtml + '</div>' +
        '<div class="tower-lobby-actions">' +
            '<button class="tower-action-btn primary" id="tower-continue-btn"' + continueDisabled + '>' +
                '继续挑战 第' + continueFloor + '层' +
            '</button>' +
            '<button class="tower-action-btn" id="tower-restart-btn"' + continueDisabled + '>' +
                '从头开始' +
            '</button>' +
            (cooldownText ? '<p class="tower-daily-note" id="tower-cooldown-text">' + cooldownText + '</p>' : '') +
        '</div>';

    var continueBtn = document.getElementById('tower-continue-btn');
    var restartBtn = document.getElementById('tower-restart-btn');

    if (continueBtn) {
        continueBtn.onclick = function() {
            BattleMode.startTowerRun(continueFloor);
        };
    }
    if (restartBtn) {
        restartBtn.onclick = function() {
            BattleMode.startTowerRun(1);
        };
    }
};

// ===== Cooldown Timer (updates lobby UI every second) =====

BattleMode._startTowerCooldownTimer = function() {
    if (this._towerCooldownInterval) {
        clearInterval(this._towerCooldownInterval);
        this._towerCooldownInterval = null;
    }
    var remaining = this.getTowerCooldownRemaining();
    if (remaining <= 0) return;

    var self = this;
    this._towerCooldownInterval = setInterval(function() {
        var left = self.getTowerCooldownRemaining();
        var textEl = document.getElementById('tower-cooldown-text');
        var contBtn = document.getElementById('tower-continue-btn');
        var restBtn = document.getElementById('tower-restart-btn');

        if (left <= 0) {
            clearInterval(self._towerCooldownInterval);
            self._towerCooldownInterval = null;
            if (textEl) textEl.textContent = '可以挑战了!';
            if (contBtn) contBtn.disabled = false;
            if (restBtn) restBtn.disabled = false;
            setTimeout(function() { if (textEl) textEl.style.display = 'none'; }, 1500);
            return;
        }
        var mins = Math.floor(left / 60000);
        var secs = Math.ceil((left % 60000) / 1000);
        if (textEl) textEl.textContent = '冷却中，' + mins + '分' + secs + '秒后可再次挑战';
    }, 1000);
};

// ===== Start Tower Run =====

BattleMode.startTowerRun = function(startFloor) {
    var tower = App.tower;
    tower.active = true;
    tower.currentFloor = startFloor;
    tower.playerHP = 5;
    tower.playerMaxHP = 5;
    tower.monstersDefeatedThisRun = 0;
    tower.totalDamageThisRun = 0;
    tower.startTime = Date.now();
    tower.fusionQuestionsAnswered = 0;

    tower.currentZone = this.getFloorZone(startFloor);

    tower.lastAttemptTime = Date.now();
    this.saveTowerProgress();

    if (typeof checkAchievement === 'function') {
        checkAchievement('tower_enter');
    }

    if (tower.maxFloorReached === 0) {
        this.awardTowerCard('tower_r_01');
    }

    this.startTowerFloor(startFloor);
};

BattleMode.getFloorZone = function(floor) {
    if (floor <= 10) return 'intro';
    if (floor <= 20) return 'trial';
    if (floor <= 29) return 'inferno';
    return 'top';
};

BattleMode.getZoneStartFloor = function(zone) {
    var starts = { intro: 1, trial: 11, inferno: 21, top: 30 };
    return starts[zone] || 1;
};

// ===== Start a Tower Floor =====

BattleMode.startTowerFloor = function(floorNum) {
    var tower = App.tower;
    var floorConfig = TowerData.floors[floorNum - 1];
    if (!floorConfig) {
        console.error('Invalid floor number:', floorNum);
        this.towerVictory();
        return;
    }

    tower.currentFloor = floorNum;
    tower.currentZone = this.getFloorZone(floorNum);

    var monsterId = floorConfig.monsterPool[Math.floor(Math.random() * floorConfig.monsterPool.length)];
    var monster = null;
    for (var i = 0; i < TowerData.monsters.length; i++) {
        if (TowerData.monsters[i].id === monsterId) {
            monster = Object.assign({}, TowerData.monsters[i]);
            break;
        }
    }
    if (!monster) {
        monster = Object.assign({}, TowerData.monsters[0]);
    }

    var questions = this.generateTowerQuestions(floorConfig);

    var battle = App.battle;
    battle.active = true;
    battle.difficulty = floorConfig.difficulty;
    battle.module = 'tower';
    battle.currentStage = 1;
    battle.totalStages = 1;
    battle.monstersDefeated = 0;
    battle.combo = battle.combo || 0;
    battle.maxCombo = battle.maxCombo || 0;
    battle.correctCount = 0;
    battle.totalDamage = 0;
    battle.noDamageTaken = true;
    battle.healCounter = 0;
    battle.startTime = battle.startTime || Date.now();
    battle.currentIndex = 0;
    battle.inventory = battle.inventory || [];
    battle.activeItem = null;
    battle.shield = battle.shield || 0;
    battle.hasRevive = battle.hasRevive || false;
    battle.itemsUsed = 0;
    battle.itemsCollected = 0;

    // v15.0 behavior reset
    battle.turnCount = 0;
    battle.monsterEnraged = false;
    battle.monsterDefending = false;
    battle.escapePending = false;
    battle.summonActive = false;
    battle.dodged = false;
    battle.noDamageOnCurrentMonster = true;
    battle.escapesPrevented = 0;
    battle.survivedSelfDestruct = 0;
    battle.bossWithSummonCleared = 0;

    battle.monsterQueue = [monster];
    battle.questions = questions;

    // Use tower HP (carries over)
    battle.playerHP = tower.playerHP;
    battle.playerMaxHP = tower.playerMaxHP;

    battle.monsterHP = monster.hp;
    battle.monsterMaxHP = monster.hp;
    battle.currentMonster = monster;

    showPage('battle');
    App.currentPage = 'battle';

    if (typeof this.initArena === 'function') {
        this.initArena();
    }

    this.updateTowerHeader();

    var cardCountEl = document.getElementById('battle-card-count');
    if (cardCountEl) cardCountEl.textContent = '🃏 ' + this.getCardCount();

    this.updateInventoryUI();

    if (typeof this.resetBehaviorState === 'function') {
        this.resetBehaviorState();
    }

    this.updateUI();

    document.getElementById('monster-name').textContent = monster.name;
    var monsterEmoji = document.getElementById('monster-emoji');
    monsterEmoji.textContent = monster.emoji;
    monsterEmoji.className = 'monster-emoji enemy-idle';

    this.showMonsterType(monster);
    this.showTowerFloorTransition(floorNum, floorConfig, monster);

    if (typeof this.updateArenaPositions === 'function') {
        this.updateArenaPositions();
    }

    setTimeout(function() {
        if (typeof BattleMode.enemyEnterAnimation === 'function') {
            BattleMode.enemyEnterAnimation(monster, function() {
                BattleMode.showBattleQuestion();
            });
        } else {
            BattleMode.showBattleQuestion();
        }
    }, 1800);
};

// ===== Tower Question Generation =====

BattleMode.generateTowerQuestions = function(floorConfig) {
    var questions = [];
    var count = floorConfig.questionCount;
    var modules = floorConfig.modules;
    var difficulty = floorConfig.difficulty;

    for (var i = 0; i < count; i++) {
        if (floorConfig.fusionChance > 0 && Math.random() < floorConfig.fusionChance) {
            var fusionQ = this.generateFusionQuestion();
            if (fusionQ) {
                questions.push(fusionQ);
                continue;
            }
        }

        var mod = modules[Math.floor(Math.random() * modules.length)];
        var q = this.getModuleQuestion(mod, difficulty);
        if (q) {
            questions.push(q);
        }
    }

    while (questions.length < count) {
        var fallbackMod = modules[Math.floor(Math.random() * modules.length)];
        var fallbackQ = this.getModuleQuestion(fallbackMod, difficulty);
        if (fallbackQ) questions.push(fallbackQ);
        else break;
    }

    return shuffle(questions);
};

BattleMode.getModuleQuestion = function(mod, difficulty) {
    var dataKeyMap = {
        xiaojiujiu: 'xiaojiujiu',
        fraction: 'fraction',
        decimal: 'decimal',
        unit: 'unit',
        multiply: 'multiply',
        times: 'times'
    };
    var dataKey = dataKeyMap[mod] || 'xiaojiujiu';
    var moduleData = MathData[dataKey];
    if (!moduleData) return null;

    var diffData = moduleData[difficulty] || moduleData.easy;
    if (!diffData || diffData.length === 0) return null;

    var q = diffData[Math.floor(Math.random() * diffData.length)];
    return q ? Object.assign({}, q) : null;
};

BattleMode.generateFusionQuestion = function() {
    if (!TowerData.fusionTemplates || TowerData.fusionTemplates.length === 0) return null;
    var template = TowerData.fusionTemplates[Math.floor(Math.random() * TowerData.fusionTemplates.length)];
    try {
        var q = template.generate();
        App.tower.fusionQuestionsAnswered++;
        return q;
    } catch (e) {
        console.error('Fusion question generation failed', e);
        return null;
    }
};

// ===== Tower Header Update =====

BattleMode.updateTowerHeader = function() {
    var tower = App.tower;
    if (!tower.active) return;

    var stageEl = document.getElementById('battle-stage');
    var totalEl = document.querySelector('.stage-total');
    var labelEl = document.querySelector('.stage-label');

    if (stageEl) stageEl.textContent = tower.currentFloor;
    if (totalEl) totalEl.textContent = '/30';
    if (labelEl) labelEl.textContent = '层';

    var zone = TowerData.zones[tower.currentZone];
    if (zone) {
        var arena = document.querySelector('.battle-arena');
        if (arena) {
            arena.style.background = zone.bgGradient;
        }
    }
};

// ===== Tower Floor Transition =====

BattleMode.showTowerFloorTransition = function(floorNum, floorConfig, monster) {
    var isBoss = floorConfig.isBoss;
    var zoneName = floorConfig.zoneName;

    var transition = document.querySelector('.stage-transition');
    if (!transition) {
        transition = document.createElement('div');
        transition.className = 'stage-transition';
        document.getElementById('battle-page').appendChild(transition);
    }

    if (isBoss) {
        transition.innerHTML =
            '<div class="stage-transition-text tower-boss-announce">⚠️ BOSS</div>' +
            '<div class="stage-transition-monster" style="font-size:4rem">' + monster.emoji + '</div>' +
            '<div class="stage-transition-name">' + monster.name + '</div>' +
            '<div class="stage-transition-type">' + zoneName + ' · 第' + floorNum + '层</div>';
        playSound('towerBossGate');
    } else {
        transition.innerHTML =
            '<div class="stage-transition-text">第 ' + floorNum + ' 层</div>' +
            '<div class="stage-transition-monster">' + monster.emoji + '</div>' +
            '<div class="stage-transition-name">' + monster.name + '</div>' +
            '<div class="stage-transition-type">' + zoneName + '</div>';
        playSound('towerFloorUp');
    }

    transition.classList.add('show');
    setTimeout(function() {
        transition.classList.remove('show');
    }, isBoss ? 1500 : 1200);
};

// ===== Tower Floor Complete (called from monsterDeath hook) =====

BattleMode.onTowerFloorComplete = function() {
    var tower = App.tower;
    var battle = App.battle;
    var floorNum = tower.currentFloor;
    var floorConfig = TowerData.floors[floorNum - 1];

    tower.monstersDefeatedThisRun++;

    // Sync HP from battle back to tower
    tower.playerHP = battle.playerHP;

    // Update max floor reached
    if (floorNum > tower.maxFloorReached) {
        tower.maxFloorReached = floorNum;
        this.saveTowerProgress();
    }

    this.checkTowerFloorRewards(floorNum);

    // Boss floor: full heal + item
    if (floorConfig && floorConfig.isBoss) {
        tower.playerHP = tower.playerMaxHP;
        battle.playerHP = tower.playerMaxHP;
        this.showBattleFeedback(true, '❤️ Boss击败！HP回满！');
        this.updateUI();
    }

    // Check if tower is complete
    if (floorNum >= 30) {
        setTimeout(function() {
            BattleMode.towerVictory();
        }, 1500);
        return;
    }

    // Advance to next floor
    var nextFloor = floorNum + 1;
    tower.currentFloor = nextFloor;

    // Card drop with tower bonus rates
    this.tryDropCard();

    var cardCountEl = document.getElementById('battle-card-count');
    if (cardCountEl) cardCountEl.textContent = '🃏 ' + this.getCardCount();

    setTimeout(function() {
        BattleMode.startTowerFloor(nextFloor);
    }, 1500);
};

// ===== Tower Floor Fail (called from gameOver hook) =====

BattleMode.onTowerFloorFail = function() {
    var tower = App.tower;
    tower.active = false;

    if (typeof this.setHeroState === 'function') {
        this.setHeroState('defeat');
    }

    var zone = this.getFloorZone(tower.currentFloor);

    var encourages = [
        '差一点就通过了！从' + TowerData.zones[zone].name + '重新开始吧！',
        '别灰心！试炼之塔等着你再次挑战！',
        '你已经到达了第' + tower.currentFloor + '层，很棒！',
        '失败是成功之母，再战一次！'
    ];
    var subtitle = encourages[Math.floor(Math.random() * encourages.length)];

    document.getElementById('fail-monsters').textContent = tower.monstersDefeatedThisRun;
    document.getElementById('fail-answers').textContent = App.battle.correctCount || 0;
    document.getElementById('battle-fail-subtitle').textContent = subtitle;

    playSound('towerDefeat');
    showPage('battle-fail');

    this.saveTowerProgress();
};

// ===== Tower Victory =====

BattleMode.towerVictory = function() {
    var tower = App.tower;
    tower.active = false;

    if (typeof this.setHeroState === 'function') {
        this.setHeroState('victory');
    }

    var elapsed = Date.now() - tower.startTime;
    var minutes = Math.round(elapsed / 60000);

    var score = tower.monstersDefeatedThisRun * 100;
    App.stats.totalScore += score;
    saveProgress();

    document.getElementById('battle-result-icon').textContent = '🗼';
    document.getElementById('battle-result-title').textContent = '试炼之塔 通关！';
    document.getElementById('battle-result-subtitle').textContent =
        '恭喜你征服了试炼之塔！用时 ' + minutes + ' 分钟';
    document.getElementById('result-monsters').textContent = tower.monstersDefeatedThisRun;
    document.getElementById('result-answers').textContent = App.battle.correctCount || 0;
    document.getElementById('result-max-combo').textContent = App.battle.maxCombo || 0;
    document.getElementById('result-battle-score').textContent = '+' + score;

    playSound('towerVictory');
    showPage('battle-result');

    setTimeout(function() {
        createConfetti(100);
    }, 300);

    this.checkTowerAchievements(minutes);
    this.saveTowerProgress();
};

// ===== Tower Floor Rewards =====

BattleMode.checkTowerFloorRewards = function(floorNum) {
    if (typeof checkAchievement === 'function') {
        if (floorNum >= 10) checkAchievement('tower_10');
        if (floorNum >= 20) checkAchievement('tower_20');
        if (floorNum >= 30) checkAchievement('tower_30');
    }

    if (floorNum === 10) this.awardTowerCard('tower_r_02');
    if (floorNum === 20) {
        this.awardTowerCard('tower_sr_01');
        this.awardTowerCard('tower_sr_02');
    }
    if (floorNum === 25) this.awardTowerCard('tower_sr_03');
    if (floorNum === 30) this.awardTowerCard('tower_ssr_01');
};

BattleMode.checkTowerAchievements = function(minutes) {
    if (typeof checkAchievement === 'function') {
        checkAchievement('tower_30');

        if (minutes <= 30) {
            checkAchievement('tower_speed');
            this.awardTowerCard('tower_ssr_03');
        }

        if (App.tower.totalDamageThisRun === 0 && App.tower.maxFloorReached >= 10) {
            checkAchievement('tower_flawless');
            this.awardTowerCard('tower_ssr_02');
        }

        checkAchievement('math_demon_slayer');
        this.awardTowerCard('tower_ur_01');
    }
};

BattleMode.awardTowerCard = function(cardId) {
    if (typeof this.getCardCollection !== 'function') return;
    var collection = this.getCardCollection();
    if (!collection.includes(cardId)) {
        collection.push(cardId);
        this.saveCardCollection(collection);

        var card = null;
        if (TowerData.cards) {
            for (var i = 0; i < TowerData.cards.length; i++) {
                if (TowerData.cards[i].id === cardId) {
                    card = TowerData.cards[i];
                    break;
                }
            }
        }
        if (card && typeof this.showCardDropAnimation === 'function') {
            setTimeout(function() {
                BattleMode.showCardDropAnimation(card);
            }, 800);
        }
    }
};

// ===== Tower Exit =====

BattleMode.exitTower = function() {
    App.tower.active = false;
    App.battle.active = false;

    if (typeof this.cleanupArena === 'function') {
        this.cleanupArena();
    }

    var arena = document.querySelector('.battle-arena');
    if (arena) {
        arena.style.background = '';
    }

    showPage('home');
    updateHomeStats();
};

// ===== Tower Drop Rate Override =====

BattleMode.getTowerDropRates = function() {
    return {
        baseRate: { easy: 0.25, normal: 0.30, hard: 0.40 },
        rarityWeights: {
            N: 45, R: 25, SR: 20, SSR: 10, UR: 5
        },
        bossGuaranteeRarity: 'SR',
        topBossGuaranteeRarity: 'SSR'
    };
};
