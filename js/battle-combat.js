/**
 * battle-combat.js - Battle logic, init, battle UI, damage calculation
 */

// B04 fix: debounce flag for battle answers
var _battleAnswerLocked = false;

// ===== Battle Mode Init =====

BattleMode.init = function() {
    // Difficulty buttons
    document.querySelectorAll('.battle-diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.battle-diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            App.difficulty = btn.dataset.diff;
        });
    });

    // Mode selection buttons
    document.getElementById('select-battle-mode')?.addEventListener('click', () => {
        this.showDifficultyAndStart();
    });

    document.getElementById('select-classic-mode')?.addEventListener('click', () => {
        this.startClassicMode();
    });

    // Battle exit button
    document.querySelector('.battle-exit-btn')?.addEventListener('click', () => {
        this.exitBattle();
    });

    // Battle result buttons
    document.getElementById('battle-retry-btn')?.addEventListener('click', () => {
        this.startBattle(App.battle.difficulty, App.battle.module);
    });

    document.getElementById('battle-home-btn')?.addEventListener('click', () => {
        showPage('home');
    });

    // Battle fail buttons
    document.getElementById('battle-retry-fail-btn')?.addEventListener('click', () => {
        this.startBattle(App.battle.difficulty, App.battle.module);
    });

    document.getElementById('battle-home-fail-btn')?.addEventListener('click', () => {
        showPage('home');
    });

    // Battle submit button
    document.getElementById('battle-submit-btn')?.addEventListener('click', () => {
        this.submitAnswer();
    });

    // Battle input enter
    document.getElementById('battle-answer-input')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            this.submitAnswer();
        }
    });

    // Battle input keyboard handling
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

    // ===== Collection page events =====
    document.getElementById('open-collection')?.addEventListener('click', () => {
        this.openCollection();
    });

    document.getElementById('collection-back-btn')?.addEventListener('click', () => {
        showPage('xiaojiujiu-mode');
    });

    document.querySelectorAll('.collection-filter-btn:not(.shanhai-filter)').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.collection-filter-btn:not(.shanhai-filter)').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.renderCollection(btn.dataset.filter);
        });
    });

    document.getElementById('monster-detail-close')?.addEventListener('click', () => {
        this.closeMonsterDetail();
    });
    document.getElementById('monster-detail-overlay')?.addEventListener('click', () => {
        this.closeMonsterDetail();
    });
    document.getElementById('monster-detail-back')?.addEventListener('click', () => {
        this.closeMonsterDetail();
    });

    // ===== Fraction module events =====
    document.querySelectorAll('.fraction-diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.fraction-diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            App.fractionDifficulty = btn.dataset.diff;
        });
    });

    document.getElementById('select-fraction-battle-mode')?.addEventListener('click', () => {
        const diff = App.fractionDifficulty || 'easy';
        this.startBattle(diff, 'fraction');
    });

    document.getElementById('select-fraction-classic-mode')?.addEventListener('click', () => {
        App.currentModule = 'fraction';
        App.difficulty = App.fractionDifficulty || 'easy';
        const moduleData = MathData.fraction;
        const diffData = moduleData[App.difficulty] || moduleData.easy;
        const questions = shuffle([...diffData]).slice(0, Math.min(App.settings.count, diffData.length));
        App.practice = {
            questions: questions,
            currentIndex: 0,
            correctCount: 0,
            streak: 0,
            startTime: Date.now(),
            timerInterval: null,
            timePerQuestion: App.difficulty === 'easy' ? 15 : (App.difficulty === 'normal' ? 10 : 7)
        };
        showPage('practice');
        showQuestion();
    });

    document.getElementById('open-fraction-collection')?.addEventListener('click', () => {
        this.openShanhaiCollection();
    });

    document.getElementById('shanhai-collection-back-btn')?.addEventListener('click', () => {
        showPage('fraction-mode');
    });

    document.querySelectorAll('.shanhai-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.shanhai-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.renderShanhaiCollection(btn.dataset.filter);
        });
    });

    // ===== Decimal module events =====
    document.querySelectorAll('.decimal-diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.decimal-diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            App.decimalDifficulty = btn.dataset.diff;
        });
    });

    document.getElementById('select-decimal-battle-mode')?.addEventListener('click', () => {
        const diff = App.decimalDifficulty || 'easy';
        this.startBattle(diff, 'decimal');
    });

    document.getElementById('select-decimal-classic-mode')?.addEventListener('click', () => {
        App.currentModule = 'decimal';
        App.difficulty = App.decimalDifficulty || 'easy';
        const moduleData = MathData.decimal;
        const diffData = moduleData[App.difficulty] || moduleData.easy;
        const questions = shuffle([...diffData]).slice(0, Math.min(App.settings.count, diffData.length));
        App.practice = {
            questions: questions,
            currentIndex: 0,
            correctCount: 0,
            streak: 0,
            startTime: Date.now(),
            timerInterval: null,
            timePerQuestion: App.difficulty === 'easy' ? 15 : (App.difficulty === 'normal' ? 10 : 7)
        };
        document.getElementById('practice-title').textContent = '\u2797 \u5C0F\u6570\u89C4\u5F8B';
        document.getElementById('difficulty-selector').classList.remove('hidden');
        showPage('practice');
        showQuestion();
    });

    document.getElementById('open-decimal-collection')?.addEventListener('click', () => {
        this.openXiyoujiCollection();
    });

    document.getElementById('xiyouji-collection-back-btn')?.addEventListener('click', () => {
        showPage('decimal-mode');
    });

    document.querySelectorAll('.xiyouji-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.xiyouji-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.renderXiyoujiCollection(btn.dataset.filter);
        });
    });

    // ===== Unit module events =====
    document.querySelectorAll('.unit-diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.unit-diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            App.unitDifficulty = btn.dataset.diff;
        });
    });

    document.getElementById('select-unit-battle-mode')?.addEventListener('click', () => {
        const diff = App.unitDifficulty || 'easy';
        this.startBattle(diff, 'unit');
    });

    document.getElementById('open-unit-collection')?.addEventListener('click', () => {
        this.openFengshenCollection();
    });

    document.getElementById('fengshen-collection-back-btn')?.addEventListener('click', () => {
        showPage('unit-mode');
    });

    document.querySelectorAll('.fengshen-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.fengshen-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.renderFengshenCollection(btn.dataset.filter);
        });
    });

    // ===== Multiply module events =====
    document.querySelectorAll('.multiply-diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.multiply-diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            App.multiplyDifficulty = btn.dataset.diff;
        });
    });

    document.getElementById('select-multiply-battle-mode')?.addEventListener('click', () => {
        const diff = App.multiplyDifficulty || 'easy';
        this.startBattle(diff, 'multiply');
    });

    document.getElementById('select-multiply-classic-mode')?.addEventListener('click', () => {
        App.currentModule = 'multiply';
        App.difficulty = App.multiplyDifficulty || 'easy';
        const moduleData = MathData.multiply;
        const diffData = moduleData[App.difficulty] || moduleData.easy;
        const questions = shuffle([...diffData]).slice(0, Math.min(App.settings.count, diffData.length));
        App.practice = {
            questions: questions,
            currentIndex: 0,
            correctCount: 0,
            streak: 0,
            startTime: Date.now(),
            timePerQuestion: App.difficulty === 'easy' ? 15 : (App.difficulty === 'normal' ? 10 : 7)
        };
        document.getElementById('practice-title').textContent = '\uD83D\uDD22 \u4E58\u6CD5\u901F\u8BB0';
        document.getElementById('difficulty-selector').classList.remove('hidden');
        showPage('practice');
        showQuestion();
    });

    document.getElementById('open-multiply-collection')?.addEventListener('click', () => {
        this.openLiaozhaiCollection();
    });

    document.getElementById('liaozhai-collection-back-btn')?.addEventListener('click', () => {
        showPage('multiply-mode');
    });

    document.querySelectorAll('.liaozhai-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.liaozhai-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.renderLiaozhaiCollection(btn.dataset.filter);
        });
    });

    // ===== Times module events =====
    document.querySelectorAll('.times-diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.times-diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            App.timesDifficulty = btn.dataset.diff;
        });
    });

    document.getElementById('select-times-battle-mode')?.addEventListener('click', () => {
        const diff = App.timesDifficulty || 'easy';
        this.startBattle(diff, 'times');
    });

    document.getElementById('select-times-classic-mode')?.addEventListener('click', () => {
        App.currentModule = 'times';
        App.difficulty = App.timesDifficulty || 'easy';
        const moduleData = MathData.times;
        const diffData = moduleData[App.difficulty] || moduleData.easy;
        const questions = shuffle([...diffData]).slice(0, Math.min(App.settings.count, diffData.length));
        App.practice = {
            questions: questions,
            currentIndex: 0,
            correctCount: 0,
            streak: 0,
            startTime: Date.now(),
            timePerQuestion: App.difficulty === 'easy' ? 15 : (App.difficulty === 'normal' ? 10 : 7)
        };
        document.getElementById('practice-title').textContent = '\uD83D\uDCCA \u5927\u4E5D\u4E5D\u8868';
        document.getElementById('difficulty-selector').classList.remove('hidden');
        showPage('practice');
        showQuestion();
    });

    document.getElementById('open-times-collection')?.addEventListener('click', () => {
        this.openHpCollection();
    });

    document.getElementById('hp-collection-back-btn')?.addEventListener('click', () => {
        showPage('times-mode');
    });

    document.querySelectorAll('.hp-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.hp-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.renderHpCollection(btn.dataset.filter);
        });
    });
};

// ===== Battle Flow =====

BattleMode.showDifficultyAndStart = function() {
    this.startBattle(App.difficulty, 'xiaojiujiu');
};

BattleMode.startClassicMode = function() {
    App.currentModule = 'xiaojiujiu';

    const moduleData = MathData.xiaojiujiu;
    const diffData = moduleData[App.difficulty] || moduleData.easy;
    const questions = shuffle(diffData).slice(0, Math.min(App.settings.count, diffData.length));

    App.practice = {
        questions: questions,
        currentIndex: 0,
        correctCount: 0,
        streak: 0,
        startTime: Date.now(),
        timerInterval: null,
        timePerQuestion: App.difficulty === 'easy' ? 15 : (App.difficulty === 'normal' ? 10 : 7)
    };

    document.getElementById('practice-title').textContent = '\uD83D\uDD25 \u5C0F\u4E5D\u4E5D\u901F\u7B97';
    document.getElementById('difficulty-selector').classList.remove('hidden');
    showPage('practice');
    showQuestion();
};

BattleMode.startBattle = function(difficulty, module) {
    const battle = App.battle;
    battle.active = true;
    battle.difficulty = difficulty;
    battle.module = module || 'xiaojiujiu';
    battle.currentStage = 1;
    battle.monstersDefeated = 0;
    battle.combo = 0;
    battle.maxCombo = 0;
    battle.correctCount = 0;
    battle.totalDamage = 0;
    battle.noDamageTaken = true;
    battle.healCounter = 0;
    battle.startTime = Date.now();
    battle.currentIndex = 0;

    battle.inventory = [];
    battle.activeItem = null;
    battle.shield = 0;
    battle.hasRevive = false;
    battle.itemsUsed = 0;
    battle.itemsCollected = 0;

    // v15.0: Reset behavior + card state
    battle.turnCount = 0;
    battle.monsterEnraged = false;
    battle.monsterDefending = false;
    battle.escapePending = false;
    battle.summonActive = false;
    battle.dodged = false;
    battle.cardDropCount = 0;
    battle.noDamageOnCurrentMonster = true;
    battle.escapesPrevented = 0;
    battle.survivedSelfDestruct = 0;
    battle.bossWithSummonCleared = 0;

    this.generateMonsterQueue(difficulty);

    const diffSettings = {
        easy: { playerHP: 5, stages: 6 },
        normal: { playerHP: 5, stages: 10 },
        hard: { playerHP: 4, stages: 15 }
    };

    const settings = diffSettings[difficulty] || diffSettings.easy;
    battle.playerHP = settings.playerHP;
    battle.playerMaxHP = settings.playerHP;
    battle.totalStages = settings.stages;

    const dataKeyMap = { fraction: 'fraction', decimal: 'decimal', unit: 'unit', multiply: 'multiply', times: 'times' };
    const dataKey = dataKeyMap[battle.module] || 'xiaojiujiu';
    const moduleData = MathData[dataKey];
    const diffData = moduleData[difficulty] || moduleData.easy;
    const mainQuestions = shuffle([...diffData]);

    if (moduleData.warmup && moduleData.warmup.length > 0) {
        const warmupPool = shuffle([...moduleData.warmup]);
        const warmupCount = Math.max(3, Math.floor(mainQuestions.length * 0.25));
        const selectedWarmup = warmupPool.slice(0, Math.min(warmupCount, warmupPool.length));
        const mixed = [];
        const interval = Math.floor(mainQuestions.length / (selectedWarmup.length + 1));
        let warmupIdx = 0;
        for (let i = 0; i < mainQuestions.length; i++) {
            mixed.push(mainQuestions[i]);
            if (warmupIdx < selectedWarmup.length && (i + 1) % interval === 0) {
                mixed.push(selectedWarmup[warmupIdx++]);
            }
        }
        while (warmupIdx < selectedWarmup.length) {
            mixed.push(selectedWarmup[warmupIdx++]);
        }
        battle.questions = mixed;
    } else {
        battle.questions = mainQuestions;
    }

    showPage('battle');
    App.currentPage = 'battle';

    // v15.0: Initialize arena and card count display
    this.initArena();
    const cardCountEl = document.getElementById('battle-card-count');
    if (cardCountEl) cardCountEl.textContent = '🃏 ' + this.getCardCount();

    this.updateInventoryUI();
    this.initStage();
};

BattleMode.generateMonsterQueue = function(difficulty) {
    const battle = App.battle;
    battle.monsterQueue = [];

    const monsters = this.getModuleMonsters(battle.module);

    if (difficulty === 'easy') {
        battle.monsterQueue = shuffle([...monsters.easy]).slice(0, 6);
    } else if (difficulty === 'normal') {
        const easy = shuffle([...monsters.easy]).slice(0, 4);
        const normal = shuffle([...monsters.normal]).slice(0, 4);
        const hard = shuffle([...monsters.hard]).slice(0, 2);
        battle.monsterQueue = [...easy, ...normal, ...hard];
    } else {
        const easy = shuffle([...monsters.easy]).slice(0, 4);
        const normal = shuffle([...monsters.normal]).slice(0, 4);
        const hard = shuffle([...monsters.hard]).slice(0, 4);
        const boss = shuffle([...monsters.boss]).slice(0, 3);
        battle.monsterQueue = [...easy, ...normal, ...hard, ...boss];
    }
};

BattleMode.initStage = function() {
    const battle = App.battle;
    const stageIndex = battle.currentStage - 1;

    let monster = battle.monsterQueue[stageIndex];
    if (!monster) {
        const moduleMonsters = this.getModuleMonsters(battle.module);
        const allMonsters = [...moduleMonsters.easy, ...moduleMonsters.normal];
        monster = allMonsters[Math.floor(Math.random() * allMonsters.length)];
    }

    battle.monsterHP = monster.hp;
    battle.monsterMaxHP = monster.hp;
    battle.currentMonster = monster;

    // v15.0: Reset behavior state for new monster
    this.resetBehaviorState();

    this.updateUI();

    document.getElementById('monster-name').textContent = monster.name;
    const monsterEmoji = document.getElementById('monster-emoji');
    monsterEmoji.textContent = monster.emoji;
    monsterEmoji.className = 'monster-emoji enemy-idle';

    this.showMonsterType(monster);
    this.showStageTransition(battle.currentStage, monster);

    // v15.0: Update arena positions and animate enemy entrance
    this.updateArenaPositions();

    setTimeout(() => {
        this.enemyEnterAnimation(monster, () => {
            this.showBattleQuestion();
        });
    }, 1500);
};

BattleMode.showMonsterType = function(monster) {
    const typeColors = {
        grass: '#78c850', water: '#6890f0', fire: '#f08030', electric: '#f8d030',
        ghost: '#705898', ice: '#98d8d8', rock: '#b8a038', flying: '#a890f0',
        bug: '#a8b820', poison: '#a040a0', fighting: '#c03028', psychic: '#f85888',
        dragon: '#7038f8', steel: '#b8b8d0', dark: '#705848', fairy: '#ee99ac',
        ground: '#e0c068', normal: '#a8a878',
        earth: '#c4a54a', wind: '#81c784', thunder: '#fdd835', light: '#fff176',
        beast: '#8d6e63', spirit: '#ce93d8', ancient: '#78909c',
        demon: '#e53935', creature: '#43a047', wizard: '#5c6bc0'
    };
    const typeNames = {
        grass: '\u8349', water: '\u6C34', fire: '\u706B', electric: '\u7535', ghost: '\u5E7D\u7075',
        ice: '\u51B0', rock: '\u5CA9\u77F3', flying: '\u98DE\u884C', bug: '\u866B', poison: '\u6BD2',
        fighting: '\u683C\u6597', psychic: '\u8D85\u80FD', dragon: '\u9F99', steel: '\u94A2', dark: '\u6076',
        fairy: '\u5996\u7CBE', ground: '\u5730\u9762', normal: '\u666E\u901A',
        earth: '\u571F', wind: '\u98CE', thunder: '\u96F7', light: '\u5149',
        beast: '\u517D', spirit: '\u7075', ancient: '\u592A\u53E4',
        demon: '\u5996', creature: '\u751F\u7269', wizard: '\u5DEB\u5E08'
    };

    let typeTag = document.getElementById('monster-type-tag');
    if (!typeTag) {
        typeTag = document.createElement('div');
        typeTag.id = 'monster-type-tag';
        typeTag.className = 'monster-type-tag';
        (document.querySelector('.enemy-side') || document.querySelector('.monster-area'))?.appendChild(typeTag);
    }
    typeTag.textContent = typeNames[monster.type] || '\u666E\u901A';
    typeTag.style.background = typeColors[monster.type] || '#a8a878';
};

BattleMode.showStageTransition = function(stage, monster) {
    const typeNames = {
        grass: '\u8349\u7CFB', water: '\u6C34\u7CFB', fire: '\u706B\u7CFB', electric: '\u7535\u7CFB', ghost: '\u5E7D\u7075\u7CFB',
        ice: '\u51B0\u7CFB', rock: '\u5CA9\u77F3\u7CFB', flying: '\u98DE\u884C\u7CFB', bug: '\u866B\u7CFB', poison: '\u6BD2\u7CFB',
        fighting: '\u683C\u6597\u7CFB', psychic: '\u8D85\u80FD\u7CFB', dragon: '\u9F99\u7CFB', steel: '\u94A2\u7CFB', dark: '\u6076\u7CFB',
        fairy: '\u5996\u7CBE\u7CFB', ground: '\u5730\u9762\u7CFB', normal: '\u666E\u901A\u7CFB',
        earth: '\u571F\u7CFB', wind: '\u98CE\u7CFB', thunder: '\u96F7\u7CFB', light: '\u5149\u7CFB',
        beast: '\u517D\u7CFB', spirit: '\u7075\u7CFB', ancient: '\u592A\u53E4\u7CFB',
        demon: '\u5996\u7CFB', creature: '\u751F\u7269\u7CFB', wizard: '\u5DEB\u5E08\u7CFB'
    };

    let transition = document.querySelector('.stage-transition');
    if (!transition) {
        transition = document.createElement('div');
        transition.className = 'stage-transition';
        document.getElementById('battle-page').appendChild(transition);
    }

    transition.innerHTML = `
        <div class="stage-transition-text">\u5173\u5361 ${stage}</div>
        <div class="stage-transition-monster">${monster.emoji}</div>
        <div class="stage-transition-name">${monster.name}</div>
        <div class="stage-transition-type">${typeNames[monster.type] || '\u666E\u901A\u7CFB'}</div>
        <div class="stage-transition-attack">${monster.attack || '\uD83D\uDCA5'} ${monster.attackName || '\u653B\u51FB'}</div>
    `;

    transition.classList.add('show');

    setTimeout(() => {
        transition.classList.remove('show');
    }, 1200);
};

BattleMode.updateUI = function() {
    const battle = App.battle;

    document.getElementById('battle-stage').textContent = battle.currentStage;
    document.querySelector('.stage-total').textContent = '/' + battle.totalStages;

    let hearts = '';
    for (let i = 0; i < battle.playerMaxHP; i++) {
        hearts += i < battle.playerHP ? '\u2764\uFE0F' : '\uD83D\uDDA4';
    }
    document.getElementById('player-hearts').textContent = hearts;

    const hpPercent = (battle.monsterHP / battle.monsterMaxHP) * 100;
    document.getElementById('monster-hp-fill').style.width = hpPercent + '%';
    document.getElementById('monster-hp-text').textContent = battle.monsterHP + '/' + battle.monsterMaxHP;

    const comboEl = document.getElementById('battle-combo');
    if (battle.combo > 0) {
        comboEl.classList.add('show');
        document.getElementById('combo-count').textContent = battle.combo;
    } else {
        comboEl.classList.remove('show');
    }
};

BattleMode.showBattleQuestion = function() {
    const battle = App.battle;

    // Reset debounce lock for new question
    _battleAnswerLocked = false;

    if (battle.currentIndex >= battle.questions.length) {
        battle.questions = shuffle([...battle.questions]);
        battle.currentIndex = 0;
    }

    const question = battle.questions[battle.currentIndex];
    if (!question) {
        console.error('\u9898\u76EE\u4E3A\u7A7A');
        return;
    }

    document.getElementById('battle-question-text').textContent = question.q;

    document.getElementById('battle-choices').classList.remove('hidden');
    document.getElementById('battle-input-mode').classList.add('hidden');

    let choices;
    if (question.wrongChoices) {
        choices = shuffle([String(question.a), ...question.wrongChoices]);
    } else {
        choices = this.generateChoices(question.a);
    }
    const choicesContainer = document.getElementById('battle-choices');

    choicesContainer.innerHTML = '';

    choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'battle-choice-btn';
        btn.type = 'button';
        btn.textContent = choice;

        btn.onclick = function() {
            if (!btn.disabled) {
                BattleMode.checkAnswer(String(choice), btn);
            }
        };

        btn.addEventListener('touchend', function(e) {
            e.preventDefault();
            if (!btn.disabled) {
                BattleMode.checkAnswer(String(choice), btn);
            }
        }, { passive: false });

        choicesContainer.appendChild(btn);
    });
};

BattleMode.generateChoices = function(correctAnswer) {
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
};

BattleMode.submitAnswer = function() {
    const input = document.getElementById('battle-answer-input');
    const answer = input.value.trim();
    if (answer) {
        this.checkAnswer(answer, null);
    }
};

BattleMode.checkAnswer = function(answer, btnElement) {
    // B04 fix: prevent rapid double-clicks
    if (_battleAnswerLocked) return;
    _battleAnswerLocked = true;

    const battle = App.battle;
    const question = battle.questions[battle.currentIndex];
    const isCorrect = String(answer) === String(question.a);

    document.querySelectorAll('.battle-choice-btn').forEach(btn => {
        btn.disabled = true;
    });

    if (isCorrect) {
        this.handleCorrectAnswer(btnElement);
    } else {
        this.handleWrongAnswer(btnElement, question.a, answer);
    }
};

BattleMode.handleCorrectAnswer = function(btnElement) {
    const battle = App.battle;

    battle.combo++;
    battle.healCounter++;
    battle.correctCount++;
    if (battle.combo > battle.maxCombo) {
        battle.maxCombo = battle.combo;
    }

    if (btnElement) {
        btnElement.classList.add('correct');
    }

    playSound('correct');

    let feedbackText = '\u6B63\u786E!';
    if (battle.combo === 3) {
        feedbackText = '\uD83D\uDD25 \u4E09\u8FDE\u51FB!';
        playSound('streak');
    } else if (battle.combo === 5) {
        feedbackText = '\uD83D\uDD25\uD83D\uDD25 \u4E94\u8FDE\u51FB!';
        playSound('streak');
    } else if (battle.combo === 10) {
        feedbackText = '\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25 \u5341\u8FDE\u51FB!!';
        playSound('streak');
        createConfetti(20);
    } else if (battle.combo === 15) {
        feedbackText = '\uD83D\uDCA5 \u8D85\u795E\u8FDE\u51FB!!!';
        playSound('streak');
        createConfetti(30);
    }

    this.showBattleFeedback(true, feedbackText);

    let damage = 1;
    if (battle.combo >= 5) damage = 2;
    if (battle.combo >= 3 && battle.combo < 5) damage = battle.difficulty === 'easy' ? 1 : 2;

    if (battle.activeItem) {
        const item = battle.activeItem;
        if (item.effect.damage) {
            damage += item.effect.damage;
            feedbackText = `${item.emoji} ${item.name}! +${item.effect.damage}\u4F24\u5BB3`;
            this.showBattleFeedback(true, feedbackText);
        }
        if (item.effect.doubleHit) {
            damage *= 2;
            feedbackText = '\u2694\uFE0F \u53CC\u91CD\u6253\u51FB!';
        }
        if (item.effect.critChance && Math.random() < item.effect.critChance) {
            damage *= 2;
            feedbackText = '\uD83D\uDCA5 \u66B4\u51FB! x2';
            createConfetti(15);
        }
        battle.activeItem = null;
        this.updateInventoryUI();
    }

    const weapon = this.getRandomWeapon();
    if (weapon.emoji === '\uD83D\uDCA3') damage += 1;

    // v15.0: Check dodge behavior before applying damage
    const dodgeCheck = this.checkBehaviorTrigger('afterCorrect', { damage });
    if (dodgeCheck && dodgeCheck.behavior === 'dodge') {
        this.heroAttackAnimation(weapon, () => {
            this.executeBehavior('dodge', (result) => {
                // Dodged - skip damage, go to next question
                battle.currentIndex++;
                setTimeout(() => this.showBattleQuestion(), 600);
            });
        });
        return;
    }

    // v15.0: Check fear at combo threshold
    if (battle.combo >= 5) {
        const fearCheck = this.checkBehaviorTrigger('comboThreshold', {});
        if (fearCheck && fearCheck.behavior === 'fear') {
            this.executeBehavior('fear', () => {});
        }
    }

    // v15.0: Hero attack animation
    this.setHeroState('cast_spell');
    this.fireWeapon(weapon, damage);

    setTimeout(() => {
        this.setHeroState('idle');
        this.dealDamage(damage);

        if (battle.healCounter >= 5 && battle.playerHP < battle.playerMaxHP) {
            battle.playerHP++;
            battle.healCounter = 0;
            this.showHealEffect();
        }

        this.tryDropItem();
    }, 400);
};

BattleMode.tryDropItem = function() {
    const battle = App.battle;
    const config = this.itemDropConfig;

    let dropChance = config.baseChance + (battle.combo * config.comboBonus);
    if (battle.inventory.some(i => i.effect.itemDropUp)) {
        dropChance += 0.1;
    }
    dropChance = Math.min(dropChance, config.maxChance);

    if (Math.random() < dropChance) {
        const item = this.getRandomItem();
        if (item && battle.inventory.length < 6) {
            battle.inventory.push({ ...item });
            battle.itemsCollected++;
            this.showItemDrop(item);
            this.updateInventoryUI();

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
};

BattleMode.getRandomItem = function() {
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
};

BattleMode.showItemDrop = function(item) {
    const dropEl = document.createElement('div');
    dropEl.className = 'item-drop-animation';
    dropEl.innerHTML = `
        <div class="item-drop-emoji">${item.emoji}</div>
        <div class="item-drop-name">${item.name}</div>
    `;
    document.getElementById('battle-page').appendChild(dropEl);

    playSound('streak');

    setTimeout(() => dropEl.remove(), 1500);
};

BattleMode.updateInventoryUI = function() {
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
        inventoryEl.innerHTML = '<div class="inventory-empty">\u7B54\u9898\u83B7\u5F97\u9053\u5177</div>';
    } else {
        inventoryEl.innerHTML = battle.inventory.map((item, index) => `
            <button class="inventory-item ${battle.activeItem === item ? 'active' : ''}"
                    data-index="${index}" title="${item.name}: ${item.desc}">
                ${item.emoji}
            </button>
        `).join('');

        inventoryEl.querySelectorAll('.inventory-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                this.useItem(index);
            });
        });
    }
};

BattleMode.useItem = function(index) {
    const battle = App.battle;
    const item = battle.inventory[index];
    if (!item) return;

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
            this.showBattleFeedback(true, '\uD83C\uDF3F \u590D\u6D3B\u4FDD\u62A4\u5DF2\u6FC0\u6D3B!');
            this.updateInventoryUI();
            playSound('achievement');
        }
        return;
    }

    if (item.type === 'buff') {
        if (item.effect.shield) {
            battle.shield += item.effect.shield;
            this.showBattleFeedback(true, '\uD83D\uDEE1\uFE0F \u62A4\u76FE\u6FC0\u6D3B!');
            battle.inventory.splice(index, 1);
            battle.itemsUsed++;
            this.updateInventoryUI();
            playSound('correct');
            return;
        }
        if (item.effect.maxHpUp) {
            battle.playerMaxHP += item.effect.maxHpUp;
            battle.playerHP += item.effect.maxHpUp;
            this.showBattleFeedback(true, '\uD83D\uDC9B \u6700\u5927HP+1!');
            battle.inventory.splice(index, 1);
            battle.itemsUsed++;
            this.updateUI();
            this.updateInventoryUI();
            playSound('achievement');
            return;
        }
    }

    if (item.type === 'special') {
        if (item.effect.skipMonster) {
            battle.monstersDefeated++;
            battle.inventory.splice(index, 1);
            battle.itemsUsed++;
            this.showBattleFeedback(true, '\u23F3 \u65F6\u95F4\u8DF3\u8DC3!');
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
            this.showBattleFeedback(true, `\u2B50 +${item.effect.scoreBonus}\u5206!`);
            this.updateInventoryUI();
            playSound('correct');
            return;
        }
    }

    if (item.type === 'attack' || item.type === 'buff') {
        battle.activeItem = item;
        battle.inventory.splice(index, 1);
        this.showBattleFeedback(true, `${item.emoji} ${item.name}\u51C6\u5907\u5C31\u7EEA!`);
        this.updateInventoryUI();
        playSound('correct');
    }
};

BattleMode.handleWrongAnswer = function(btnElement, correctAnswer, userAnswer) {
    const battle = App.battle;

    battle.combo = 0;
    battle.healCounter = 0;
    battle.noDamageTaken = false;

    if (btnElement) {
        btnElement.classList.add('wrong');
    }

    playSound('wrong');

    // v15.0: Use enemy state system instead of raw class toggle
    this.setEnemyState('threaten');
    setTimeout(() => this.setEnemyState('idle'), 800);

    this.showBattleFeedback(false, '\u6B63\u786E\u7B54\u6848: ' + correctAnswer);

    // v15.0: Check taunt behavior
    const tauntCheck = this.checkBehaviorTrigger('afterWrong', {});
    if (tauntCheck && tauntCheck.behavior === 'taunt') {
        this.executeBehavior('taunt', () => {});
    }

    const question = battle.questions[battle.currentIndex];
    const wrongItem = {
        q: question.q,
        a: question.a,
        yourAnswer: userAnswer || null,
        timestamp: Date.now(),
        monsterEmoji: battle.currentMonster ? battle.currentMonster.emoji : null,
        monsterName: battle.currentMonster ? battle.currentMonster.name : null
    };
    const exists = App.wrongBook.some(item => item.q === wrongItem.q);
    if (!exists) {
        App.wrongBook.push(wrongItem);
        saveProgress();
    }

    setTimeout(() => {
        this.monsterAttack();
    }, 500);
};

// Battle-specific feedback (separate from practice feedback)
BattleMode.showBattleFeedback = function(isCorrect, text) {
    const feedback = document.getElementById('battle-feedback');
    feedback.className = 'battle-feedback ' + (isCorrect ? 'correct' : 'wrong');
    feedback.querySelector('.battle-feedback-icon').textContent = isCorrect ? '\u2713' : '\u2717';
    feedback.querySelector('.battle-feedback-text').textContent = text;
    feedback.classList.add('show');

    setTimeout(() => {
        feedback.classList.remove('show');
    }, 1000);
};

BattleMode.getRandomWeapon = function() {
    const battle = App.battle;

    if (battle.combo >= 10) {
        return Math.random() < 0.5 ? this.weapons[4] : this.weapons[5];
    }

    const totalWeight = this.weapons.reduce((sum, w) => sum + w.weight, 0);
    let random = Math.random() * totalWeight;

    for (const weapon of this.weapons) {
        random -= weapon.weight;
        if (random <= 0) return weapon;
    }

    return this.weapons[0];
};

BattleMode.fireWeapon = function(weapon, damage) {
    const battle = App.battle;
    const weaponArea = document.getElementById('weapon-area');
    const questionArea = document.querySelector('.battle-question-area');
    const rect = questionArea.getBoundingClientRect();

    playSound('attack');

    const weaponEl = document.createElement('div');
    weaponEl.className = 'weapon';
    weaponEl.textContent = weapon.emoji;

    if (damage >= 4) {
        weaponEl.classList.add('super-weapon');
    } else if (damage >= 2) {
        weaponEl.classList.add('strong-weapon');
    }

    const count = battle.combo >= 3 ? Math.min(battle.combo - 1, 3) : 1;

    for (let i = 0; i < count; i++) {
        const w = weaponEl.cloneNode(true);
        w.style.left = (rect.left + rect.width / 2 - 20 + (i - 1) * 30) + 'px';
        w.style.bottom = (window.innerHeight - rect.top) + 'px';

        if (battle.combo >= 5) {
            w.style.fontSize = '3rem';
        }

        if (damage >= 3) {
            w.style.filter = 'drop-shadow(0 0 10px gold)';
        }

        weaponArea.appendChild(w);

        setTimeout(() => w.remove(), 500);
    }

    if (damage >= 4) {
        this.showSuperAttackEffect(weapon);
    }
};

BattleMode.showSuperAttackEffect = function(weapon) {
    const effectEl = document.createElement('div');
    effectEl.className = 'super-attack-effect';
    effectEl.innerHTML = `
        <div class="super-attack-emoji">${weapon.emoji}</div>
        <div class="super-attack-name">${weapon.name}!</div>
    `;
    document.getElementById('battle-page').appendChild(effectEl);

    setTimeout(() => effectEl.remove(), 1000);
};

BattleMode.monsterQuips = ['\u54CE\u5466!', '\u597D\u75DB!', '\u545C\u545C...', '\u4F4F\u624B!', '\u4E0D\u8981!', '\u6551\u547D!'];

BattleMode.dealDamage = function(damage) {
    const battle = App.battle;

    // v15.0: Defend check - halve damage (round up)
    if (battle.monsterDefending) {
        damage = Math.ceil(damage / 2);
        battle.monsterDefending = false;
        this.showBattleFeedback(false, '🛡️ 防御! 伤害减半');
    }

    battle.monsterHP -= damage;
    battle.totalDamage += damage;
    battle.turnCount++;

    if (damage > 0) {
        battle.noDamageOnCurrentMonster = false;
    }

    playSound('hit');

    // v15.0: Use enemy hit animation
    this.enemyHitAnimation(() => {});

    this.showDamageNumber(damage);
    this.showMonsterQuip();

    this.updateUI();

    if (battle.monsterHP <= 0) {
        this.monsterDeath();
    } else {
        // v15.0: Check HP threshold behaviors (enrage, summon, escape)
        const hpPercent = battle.monsterHP / battle.monsterMaxHP;
        const hpCheck = this.checkBehaviorTrigger('hpThreshold', { hpPercent });
        if (hpCheck) {
            this.executeBehavior(hpCheck.behavior, () => {
                // v15.0: Check turn interval behaviors (defend, heal)
                const turnCheck = this.checkBehaviorTrigger('turnInterval', {});
                if (turnCheck) {
                    this.executeBehavior(turnCheck.behavior, () => {
                        battle.currentIndex++;
                        setTimeout(() => this.showBattleQuestion(), 400);
                    });
                } else {
                    battle.currentIndex++;
                    setTimeout(() => this.showBattleQuestion(), 400);
                }
            });
        } else {
            // v15.0: Check turn interval behaviors (defend, heal)
            const turnCheck = this.checkBehaviorTrigger('turnInterval', {});
            if (turnCheck) {
                this.executeBehavior(turnCheck.behavior, () => {
                    battle.currentIndex++;
                    setTimeout(() => this.showBattleQuestion(), 400);
                });
            } else {
                battle.currentIndex++;
                setTimeout(() => this.showBattleQuestion(), 800);
            }
        }
    }
};

BattleMode.showDamageNumber = function(damage) {
    const container = document.getElementById('damage-numbers');
    const dmgEl = document.createElement('div');
    dmgEl.className = 'damage-number';
    dmgEl.textContent = '-' + damage;
    dmgEl.style.left = (Math.random() * 60 - 30) + 'px';
    container.appendChild(dmgEl);

    setTimeout(() => dmgEl.remove(), 800);
};

BattleMode.showMonsterQuip = function() {
    const battle = App.battle;
    const container = document.getElementById('damage-numbers');
    const quipEl = document.createElement('div');
    quipEl.className = 'monster-quip';

    const quips = battle.currentMonster?.quips || this.monsterQuips;
    quipEl.textContent = quips[Math.floor(Math.random() * quips.length)];
    quipEl.style.left = (Math.random() * 40 - 20) + 'px';
    container.appendChild(quipEl);

    setTimeout(() => quipEl.remove(), 1000);
};

BattleMode.monsterAttack = function() {
    const battle = App.battle;
    const monster = battle.currentMonster;

    // v15.0: Enraged monsters deal +1 damage (applied in HP deduction below)
    const enrageDamage = battle.monsterEnraged ? 1 : 0;

    playSound('monsterAttack');

    this.showAttackName(monster);

    // v15.0: Use arena-based enemy attack animation
    this.enemyAttackAnimation(monster, () => {});

    if (battle.shield > 0) {
        battle.shield--;
        this.showBattleFeedback(true, '\uD83D\uDEE1\uFE0F \u62A4\u76FE\u62B5\u6321!');
        playSound('correct');
        battle.currentIndex++;
        setTimeout(() => this.showBattleQuestion(), 1000);
        return;
    }

    // v15.0: Hero hit animation
    this.heroHitAnimation(() => {});

    const screenFlash = document.getElementById('screen-flash');
    if (screenFlash) {
        screenFlash.classList.add('show');
        setTimeout(() => screenFlash.classList.remove('show'), 300);
    }

    // v15.0: Enraged monsters deal extra damage
    const hpLoss = 1 + enrageDamage;
    battle.playerHP = Math.max(0, battle.playerHP - hpLoss);
    this.updateUI();

    if (battle.playerHP <= 0) {
        if (battle.hasRevive) {
            battle.hasRevive = false;
            battle.playerHP = 1;
            this.showBattleFeedback(true, '\uD83C\uDF3F \u590D\u6D3B\u8349\u6551\u4E86\u4F60!');
            playSound('achievement');
            createConfetti(20);
            this.updateUI();
            battle.currentIndex++;

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
        battle.currentIndex++;
        setTimeout(() => this.showBattleQuestion(), 1000);
    }
};

BattleMode.showAttackName = function(monster) {
    if (!monster?.attackName) return;

    const attackNameEl = document.createElement('div');
    attackNameEl.className = 'monster-attack-name';
    attackNameEl.textContent = monster.attackName;
    document.getElementById('battle-page').appendChild(attackNameEl);

    setTimeout(() => attackNameEl.remove(), 1200);
};

BattleMode.monsterDeath = function() {
    const battle = App.battle;
    battle.monstersDefeated++;

    if (battle.currentMonster && battle.currentMonster.id) {
        const isNew = this.addToCollection(battle.currentMonster.id);
        if (isNew) {
            setTimeout(() => this.showNewCollectionToast(battle.currentMonster), 800);
            this.checkCollectionAchievements();
        }
    }

    // v15.0: Use enemy death state
    this.setEnemyState('death');

    playSound('defeat');

    createConfetti(40);

    // v15.0: Check death behaviors (selfDestruct) and card drop
    const deathCheck = this.checkBehaviorTrigger('onDeath', {});

    const afterDeath = () => {
        // v15.0: Try card drop
        this.tryDropCard();

        // v15.0: Track boss summon clear
        if (battle.currentMonster && battle.currentMonster.hp >= 8 && battle.summonActive) {
            battle.bossWithSummonCleared++;
        }

        // Update card count display
        const cardCountEl = document.getElementById('battle-card-count');
        if (cardCountEl) cardCountEl.textContent = '🃏 ' + this.getCardCount();

        setTimeout(() => {
            if (battle.currentStage >= battle.totalStages) {
                this.gameOver(true);
            } else {
                battle.currentStage++;
                battle.currentIndex++;
                this.initStage();
            }
        }, 800);
    };

    if (deathCheck && deathCheck.behavior === 'selfDestruct') {
        setTimeout(() => {
            this.executeBehavior('selfDestruct', () => afterDeath());
        }, 600);
    } else {
        setTimeout(() => afterDeath(), 1200);
    }
};

BattleMode.showHealEffect = function() {
    const heartsEl = document.getElementById('player-hearts');
    heartsEl.classList.add('hp-recover');
    setTimeout(() => heartsEl.classList.remove('hp-recover'), 500);

    this.showBattleFeedback(true, '\u2764\uFE0F +1 HP');
};

BattleMode.gameOver = function(isVictory) {
    const battle = App.battle;
    battle.active = false;

    if (isVictory) {
        // v15.0: Hero victory animation
        this.setHeroState('victory');

        let score = battle.monstersDefeated * 50;
        if (battle.noDamageTaken) score += 30;
        if (battle.maxCombo >= 10) score += 50;

        App.stats.totalScore += score;
        App.stats.totalCorrect += battle.correctCount;
        if (battle.maxCombo > App.stats.maxStreak) {
            App.stats.maxStreak = battle.maxCombo;
        }
        saveProgress();

        document.getElementById('result-monsters').textContent = battle.monstersDefeated;
        document.getElementById('result-answers').textContent = battle.correctCount;
        document.getElementById('result-max-combo').textContent = battle.maxCombo;
        document.getElementById('result-battle-score').textContent = '+' + score;

        showPage('battle-result');

        setTimeout(() => {
            createConfetti(100);
            playSound('complete');
        }, 300);

        this.checkBattleAchievements();

        checkAchievements(battle.maxCombo, App.stats.totalCorrect);
    } else {
        // v15.0: Hero defeat animation
        this.setHeroState('defeat');

        document.getElementById('fail-monsters').textContent = battle.monstersDefeated;
        document.getElementById('fail-answers').textContent = battle.correctCount;

        const encourages = [
            '\u5DEE\u4E00\u70B9\u5C31\u6210\u529F\u4E86\uFF01\u518D\u8BD5\u4E00\u6B21\uFF1F',
            '\u522B\u7070\u5FC3\uFF0C\u518D\u6765\u4E00\u6B21\uFF01',
            '\u4F60\u5DF2\u7ECF\u5F88\u68D2\u4E86\uFF0C\u7EE7\u7EED\u52A0\u6CB9\uFF01',
            '\u5931\u8D25\u662F\u6210\u529F\u4E4B\u6BCD\uFF0C\u518D\u6218\uFF01'
        ];
        document.getElementById('battle-fail-subtitle').textContent =
            encourages[Math.floor(Math.random() * encourages.length)];

        playSound('gameOver');

        showPage('battle-fail');
    }
};

BattleMode.checkBattleAchievements = function() {
    const battle = App.battle;
    const achievements = App.stats.achievements;

    if (!achievements.includes('battle_first_win')) {
        achievements.push('battle_first_win');
        saveProgress();
        const ach = MathData.achievements.find(a => a.id === 'battle_first_win');
        if (ach) showAchievement(ach);
    }

    if (battle.noDamageTaken && !achievements.includes('battle_no_damage')) {
        achievements.push('battle_no_damage');
        saveProgress();
        setTimeout(() => {
            const ach = MathData.achievements.find(a => a.id === 'battle_no_damage');
            if (ach) showAchievement(ach);
        }, 2000);
    }

    if (battle.monstersDefeated >= 4 && !achievements.includes('battle_dragon_slayer')) {
        achievements.push('battle_dragon_slayer');
        saveProgress();
        setTimeout(() => {
            const ach = MathData.achievements.find(a => a.id === 'battle_dragon_slayer');
            if (ach) showAchievement(ach);
        }, 3000);
    }

    if (battle.difficulty === 'hard' && battle.monstersDefeated >= 6 && !achievements.includes('battle_demon_king')) {
        achievements.push('battle_demon_king');
        saveProgress();
        setTimeout(() => {
            const ach = MathData.achievements.find(a => a.id === 'battle_demon_king');
            if (ach) showAchievement(ach);
        }, 4000);
    }

    if (battle.maxCombo >= 10 && !achievements.includes('battle_10_combo')) {
        achievements.push('battle_10_combo');
        saveProgress();
        setTimeout(() => {
            const ach = MathData.achievements.find(a => a.id === 'battle_10_combo');
            if (ach) showAchievement(ach);
        }, 5000);
    }

    const totalTime = (Date.now() - battle.startTime) / 1000;
    if (battle.difficulty === 'easy' && totalTime <= 180 && !achievements.includes('battle_speedrun')) {
        achievements.push('battle_speedrun');
        saveProgress();
        setTimeout(() => {
            const ach = MathData.achievements.find(a => a.id === 'battle_speedrun');
            if (ach) showAchievement(ach);
        }, 6000);
    }

    if (battle.itemsCollected >= 5 && !achievements.includes('item_collector')) {
        achievements.push('item_collector');
        saveProgress();
        setTimeout(() => {
            const ach = MathData.achievements.find(a => a.id === 'item_collector');
            if (ach) showAchievement(ach);
        }, 7000);
    }

    if (battle.itemsUsed >= 3 && !achievements.includes('item_master')) {
        achievements.push('item_master');
        saveProgress();
        setTimeout(() => {
            const ach = MathData.achievements.find(a => a.id === 'item_master');
            if (ach) showAchievement(ach);
        }, 8000);
    }

    // v15.0: Behavior-related achievements
    const behaviorChecks = [
        { id: 'dodge_master', condition: battle.dodged },
        { id: 'survive_destruct', condition: battle.survivedSelfDestruct > 0 },
        { id: 'no_escape', condition: battle.escapesPrevented > 0 },
        { id: 'boss_summon_clear', condition: battle.bossWithSummonCleared > 0 },
        { id: 'enrage_kill', condition: battle.monsterEnraged },
        { id: 'perfect_stage', condition: battle.noDamageTaken && battle.monstersDefeated >= battle.totalStages }
    ];

    let delay = 9000;
    for (const check of behaviorChecks) {
        if (check.condition && !achievements.includes(check.id)) {
            achievements.push(check.id);
            saveProgress();
            const achId = check.id;
            setTimeout(() => {
                const ach = MathData.achievements.find(a => a.id === achId);
                if (ach) showAchievement(ach);
            }, delay);
            delay += 1000;
        }
    }
};

BattleMode.exitBattle = function() {
    const module = App.battle.module;
    App.battle.active = false;

    // v15.0: Cleanup arena
    this.cleanupArena();
    if (module === 'fraction') {
        showPage('fraction-mode');
        this.updateFractionCollectionCount();
    } else if (module === 'decimal') {
        showPage('decimal-mode');
        this.updateDecimalCollectionCount();
    } else if (module === 'unit') {
        showPage('unit-mode');
        this.updateUnitCollectionCount();
    } else if (module === 'multiply') {
        showPage('multiply-mode');
        this.updateMultiplyCollectionCount();
    } else if (module === 'times') {
        showPage('times-mode');
        this.updateTimesCollectionCount();
    } else {
        showPage('xiaojiujiu-mode');
        this.updateCollectionCount();
    }
};
