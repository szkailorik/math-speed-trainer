/**
 * chapter-system.js - v23.1 Chapter system logic
 * Handles chapter battle flow, star calculation, progress tracking,
 * UI rendering, rewards, and achievement checking.
 * v23.1: Added perfectStreak tracking, consecutivePerfects unlock logic,
 *        chapter-exclusive monster queue, new weapon pool, streak UI.
 */

var ChapterSystem = {

    // ===== Progress Persistence =====

    getProgressKey: function() {
        var user = UserManager.getCurrentUser();
        return user ? ('chapterProgress_' + user.id) : 'chapterProgress_guest';
    },

    loadProgress: function() {
        try {
            var saved = localStorage.getItem(this.getProgressKey());
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error('Failed to load chapter progress', e);
        }
        return {};
    },

    saveProgressData: function(data) {
        try {
            localStorage.setItem(this.getProgressKey(), JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save chapter progress', e);
        }
    },

    getChapterProgress: function(module, chapterId) {
        var data = this.loadProgress();
        if (!data[module]) return null;
        return data[module][chapterId] || null;
    },

    // ===== Unlock Logic =====
    // v23.1: Rewritten to use consecutivePerfects instead of minStars

    isChapterUnlocked: function(module, chapterIndex) {
        if (!ChapterConfig[module]) return false;
        var config = ChapterConfig[module].chapters[chapterIndex];
        if (!config) return false;
        if (!config.unlockCondition) return true;  // No condition = always unlocked

        var cond = config.unlockCondition;
        var progress = this.getChapterProgress(module, cond.chapter);
        if (!progress) return false;

        // v23.1: Support new consecutivePerfects condition
        if (typeof cond.consecutivePerfects === 'number') {
            return (progress.perfectStreak || 0) >= cond.consecutivePerfects;
        }

        // Legacy fallback: minStars
        if (typeof cond.minStars === 'number') {
            return progress.stars >= cond.minStars;
        }

        return false;
    },

    // ===== Star Calculation =====

    calculateStars: function() {
        var chapter = App.chapter;
        if (!chapter.active) return 0;

        var total = chapter.totalQuestions;
        var correct = chapter.correctQuestions;
        var accuracy = total > 0 ? correct / total : 0;

        // Star 3: >= 95% accuracy AND player never died (HP never reached 0)
        if (accuracy >= ChapterStarConfig.star3.accuracy && !chapter.playerDied) {
            return 3;
        }
        // Star 2: >= 80% accuracy
        if (accuracy >= ChapterStarConfig.star2.accuracy) {
            return 2;
        }
        // Star 1: >= 50% accuracy (must have won the battle to get here)
        if (accuracy >= ChapterStarConfig.star1.accuracy) {
            return 1;
        }
        return 0;
    },

    // ===== Progress Update =====
    // v23.1: Added perfectStreak and totalPerfects tracking

    updateProgress: function(stars, isPerfect, isDefeat) {
        var chapter = App.chapter;
        var data = this.loadProgress();
        var module = chapter.module;
        var chapterId = chapter.chapterId;

        if (!data[module]) data[module] = {};

        var prev = data[module][chapterId] || {
            stars: 0,
            perfectStreak: 0,     // v23.1: current consecutive perfect count
            totalPerfects: 0,     // v23.1: cumulative perfect count
            bestAccuracy: 0,
            bestTime: Infinity,
            clearCount: 0,
            firstClearTime: null,
            noDamageCleared: false,
            rewardsClaimed: []
        };

        var elapsed = Date.now() - chapter.startTime;
        var accuracy = chapter.totalQuestions > 0 ? chapter.correctQuestions / chapter.totalQuestions : 0;

        var isFirstClear = prev.clearCount === 0;
        var improved = stars > prev.stars;

        // v23.1: Perfect streak logic
        // Only update streak for non-defeat scenarios (victory)
        if (!isDefeat) {
            if (isPerfect) {
                // 100% accuracy → perfectStreak + 1
                prev.perfectStreak = (prev.perfectStreak || 0) + 1;
                prev.totalPerfects = (prev.totalPerfects || 0) + 1;
            } else {
                // Cleared but had errors → perfectStreak - 1 (min 0)
                prev.perfectStreak = Math.max(0, (prev.perfectStreak || 0) - 1);
            }
        }
        // Defeat → perfectStreak unchanged (no penalty for losing)

        // Stars only go up (never down)
        prev.stars = Math.max(prev.stars, stars);
        prev.bestAccuracy = Math.max(prev.bestAccuracy, accuracy);
        prev.bestTime = Math.min(prev.bestTime === Infinity ? elapsed : prev.bestTime, elapsed);
        prev.clearCount++;
        if (!prev.firstClearTime) prev.firstClearTime = Date.now();
        if (chapter.playerDamageTaken === 0) prev.noDamageCleared = true;

        data[module][chapterId] = prev;
        this.saveProgressData(data);

        return { isFirstClear: isFirstClear, improved: improved, progress: prev, isPerfect: isPerfect };
    },

    // ===== Rewards =====

    claimRewards: function(stars, result) {
        var chapter = App.chapter;
        var config = this.getCurrentConfig();
        if (!config) return [];

        var data = this.loadProgress();
        var module = chapter.module;
        var chapterId = chapter.chapterId;
        var progress = data[module][chapterId];
        var claimed = progress.rewardsClaimed || [];
        var newRewards = [];

        // First clear rewards
        if (result.isFirstClear && claimed.indexOf('firstClear') === -1) {
            var fc = config.rewards.firstClear;
            if (fc.score) {
                App.stats.totalScore += fc.score;
                newRewards.push({ type: 'score', value: fc.score, label: '+' + fc.score + ' 积分' });
            }
            if (fc.crystals) {
                App.crystals = (App.crystals || 0) + fc.crystals;
                newRewards.push({ type: 'crystals', value: fc.crystals, label: '+' + fc.crystals + ' 💎 水晶' });
            }
            claimed.push('firstClear');
        }

        // Star 1 rewards
        if (stars >= 1 && claimed.indexOf('star1') === -1) {
            var s1 = config.rewards.star1;
            if (s1.item) {
                var item = this.findChapterItem(s1.item);
                if (item) {
                    newRewards.push({ type: 'item', value: item, label: item.emoji + ' ' + item.name + ' (首通奖励!)' });
                }
            }
            claimed.push('star1');
        }

        // Star 2 rewards
        if (stars >= 2 && claimed.indexOf('star2') === -1) {
            var s2 = config.rewards.star2;
            if (s2.crystals) {
                App.crystals = (App.crystals || 0) + s2.crystals;
                newRewards.push({ type: 'crystals', value: s2.crystals, label: '+' + s2.crystals + ' 💎 水晶' });
            }
            if (s2.guaranteedCardRarity) {
                newRewards.push({ type: 'card', value: s2.guaranteedCardRarity, label: '保底' + s2.guaranteedCardRarity + '卡' });
            }
            claimed.push('star2');
        }

        // Star 3 rewards
        if (stars >= 3 && claimed.indexOf('star3') === -1) {
            var s3 = config.rewards.star3;
            if (s3.weapon) {
                var weapon = this.findChapterWeapon(chapter.module, chapter.chapterIndex);
                if (weapon) {
                    newRewards.push({ type: 'weapon', value: weapon, label: weapon.emoji + ' ' + weapon.name });
                }
            }
            if (s3.crystals) {
                App.crystals = (App.crystals || 0) + s3.crystals;
                newRewards.push({ type: 'crystals', value: s3.crystals, label: '+' + s3.crystals + ' 💎 水晶' });
            }
            if (s3.title) {
                newRewards.push({ type: 'title', value: s3.title, label: '🏅 称号「' + s3.title + '」' });
            }
            claimed.push('star3');
        }

        // Save claimed rewards
        progress.rewardsClaimed = claimed;
        data[module][chapterId] = progress;
        this.saveProgressData(data);
        saveProgress();

        return newRewards;
    },

    findChapterItem: function(itemId) {
        for (var mod in chapterItems) {
            var items = chapterItems[mod];
            for (var i = 0; i < items.length; i++) {
                if (items[i].id === itemId) return items[i];
            }
        }
        return null;
    },

    findChapterWeapon: function(module, chapterIndex) {
        if (chapterWeapons[module] && chapterWeapons[module][chapterIndex]) {
            return chapterWeapons[module][chapterIndex];
        }
        return null;
    },

    // ===== Get Current Config =====

    getCurrentConfig: function() {
        var ch = App.chapter;
        if (!ch || !ch.module) return null;
        var moduleConfig = ChapterConfig[ch.module];
        if (!moduleConfig) return null;
        return moduleConfig.chapters[ch.chapterIndex] || null;
    },

    // ===== Total Stars for a Module =====

    getModuleTotalStars: function(module) {
        var data = this.loadProgress();
        if (!data[module]) return 0;
        var total = 0;
        var config = ChapterConfig[module];
        if (!config) return 0;
        for (var i = 0; i < config.chapters.length; i++) {
            var chId = config.chapters[i].id;
            if (data[module][chId]) {
                total += data[module][chId].stars;
            }
        }
        return total;
    },

    // ===== Chapter Battle Start =====

    startChapterBattle: function(module, chapterIndex) {
        var moduleConfig = ChapterConfig[module];
        if (!moduleConfig) return;
        var config = moduleConfig.chapters[chapterIndex];
        if (!config) return;

        // Check unlock
        if (!this.isChapterUnlocked(module, chapterIndex)) {
            return;
        }

        // Set chapter state
        App.chapter = {
            active: true,
            module: module,
            chapterId: config.id,
            chapterIndex: chapterIndex,
            totalQuestions: 0,
            correctQuestions: 0,
            playerDamageTaken: 0,
            playerDied: false,
            isBossFight: false,
            startTime: Date.now()
        };

        // Use existing battle system with chapter settings
        var battle = App.battle;
        battle.active = true;
        battle.difficulty = config.baseDifficulty;
        battle.module = module;
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

        // v15.0 reset
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

        // v17.0
        battle.lastMoveName = null;
        battle.desperateCounterUsed = 0;

        // v20.0
        battle.consecutiveWrong = 0;
        battle.guardianLight = false;
        battle.retried = false;
        battle.inCoyoteTime = false;
        battle.coyoteTimer = null;

        // v16.0 combo
        battle.comboStage = 'normal';
        battle.comboShieldActive = false;
        battle.comboShieldUsed = false;
        battle.lastAnswerWrong = false;

        // v16.0 behavior states
        battle.monsterShielded = false;
        battle.monsterCursed = false;
        battle.curseRemainingTurns = 0;
        battle.monsterPhase = 1;
        battle.splitActive = false;
        battle.counterPending = false;
        battle.behaviorsEncountered = [];
        battle.personalitiesEncountered = [];

        battle.playerHP = config.playerHP;
        battle.playerMaxHP = config.playerHP;
        battle.totalStages = config.stageCount;

        // Initialize momentum system
        if (typeof MomentumSystem !== 'undefined') {
            MomentumSystem.init(config.baseDifficulty);
        }

        // Generate chapter monster queue
        this.generateChapterMonsterQueue(config, module);

        // Load chapter questions
        this.loadChapterQuestions(config, module);

        showPage('battle');
        App.currentPage = 'battle';

        BattleMode.initArena();
        BattleMode.initHeroLayers();
        BattleMode.resetComboState();

        if (typeof BattleMode.startPerfMonitor === 'function') {
            BattleMode.startPerfMonitor();
        }

        var cardCountEl = document.getElementById('battle-card-count');
        if (cardCountEl) cardCountEl.textContent = '🃏 ' + BattleMode.getCardCount();

        BattleMode.updateInventoryUI();

        BattleMode.irisWipeIn();
        BattleMode.initStage();
    },

    // ===== Generate Chapter Monster Queue =====
    // v23.1: Rewritten to use chapter-exclusive monsters from chapterMonsters array

    generateChapterMonsterQueue: function(config, module) {
        var battle = App.battle;
        battle.monsterQueue = [];

        var queue = [];

        // v23.1: Use chapter-exclusive monsters if available
        if (config.chapterMonsters && config.chapterMonsters.length > 0) {
            // Use all chapter-exclusive monsters, shuffled
            queue = shuffle([].concat(config.chapterMonsters));
        } else {
            // Legacy fallback: use monsterMix from existing pool
            var monsters = BattleMode.getModuleMonsters(module);
            var mix = config.monsterMix;
            if (mix.easy) {
                var pool = shuffle([].concat(monsters.easy));
                queue = queue.concat(pool.slice(0, mix.easy));
            }
            if (mix.normal) {
                var pool = shuffle([].concat(monsters.normal));
                queue = queue.concat(pool.slice(0, mix.normal));
            }
            if (mix.hard) {
                var pool = shuffle([].concat(monsters.hard));
                queue = queue.concat(pool.slice(0, mix.hard));
            }
            if (mix.boss) {
                var pool = shuffle([].concat(monsters.boss));
                queue = queue.concat(pool.slice(0, mix.boss));
            }
            queue = shuffle(queue);
        }

        // Add chapter BOSS at the end
        queue.push(config.boss);

        battle.monsterQueue = queue;
    },

    // ===== Load Chapter Questions =====

    loadChapterQuestions: function(config, module) {
        var battle = App.battle;
        var dataKeyMap = { fraction: 'fraction', decimal: 'decimal', unit: 'unit', multiply: 'multiply', times: 'times' };
        var dataKey = dataKeyMap[module] || 'xiaojiujiu';
        var moduleData = MathData[dataKey];

        var allQuestions = [];
        var pools = config.questionPools;
        var ratio = config.questionRatio;

        // Collect questions from each pool
        for (var i = 0; i < pools.length; i++) {
            var poolName = pools[i];
            var poolData = moduleData[poolName];
            if (poolData && poolData.length > 0) {
                var r = ratio[poolName] || 0;
                // Calculate how many questions from this pool
                var targetCount = Math.ceil(poolData.length * r * 2);
                var selected;
                if (typeof QuestionEngine !== 'undefined' && typeof QuestionEngine.weightedSelect === 'function') {
                    selected = QuestionEngine.weightedSelect(poolData, targetCount, module);
                } else {
                    selected = shuffle([].concat(poolData)).slice(0, targetCount);
                }
                allQuestions = allQuestions.concat(selected);
            }
        }

        // Shuffle all questions
        allQuestions = shuffle(allQuestions);

        // For chapter 1: ensure first 2 questions are warmup
        if (config.warmupFirst && moduleData.warmup) {
            var warmupPool = shuffle([].concat(moduleData.warmup));
            var warmupFirst = warmupPool.slice(0, config.warmupFirst);
            // Remove any duplicates from main pool
            for (var w = 0; w < warmupFirst.length; w++) {
                for (var q = allQuestions.length - 1; q >= 0; q--) {
                    if (allQuestions[q].q === warmupFirst[w].q) {
                        allQuestions.splice(q, 1);
                        break;
                    }
                }
            }
            allQuestions = warmupFirst.concat(allQuestions);
        }

        battle.questions = allQuestions;
    },

    // ===== Chapter Victory Handler =====
    // v23.1: Updated to track perfectStreak

    onChapterVictory: function() {
        var chapter = App.chapter;
        var stars = this.calculateStars();

        // v23.1: Determine if this was a perfect (100% accuracy) run
        var accuracy = chapter.totalQuestions > 0 ? chapter.correctQuestions / chapter.totalQuestions : 0;
        var isPerfect = accuracy >= 1.0;

        var result = this.updateProgress(stars, isPerfect, false);
        var rewards = this.claimRewards(stars, result);

        // Check if next chapter just got unlocked
        var nextUnlocked = false;
        var nextIndex = chapter.chapterIndex + 1;
        var moduleConfig = ChapterConfig[chapter.module];
        if (moduleConfig && nextIndex < moduleConfig.chapters.length) {
            nextUnlocked = this.isChapterUnlocked(chapter.module, nextIndex);
        }

        // Render chapter result
        this.renderChapterResult(stars, result, rewards, nextUnlocked);

        // Check achievements
        this.checkChapterAchievements(stars, result);

        return { stars: stars, result: result, rewards: rewards, nextUnlocked: nextUnlocked };
    },

    // v23.1: Handle chapter defeat (HP = 0) — perfectStreak unchanged
    onChapterDefeat: function() {
        var chapter = App.chapter;
        if (!chapter.active) return;

        // On defeat, we still record the attempt but don't change perfectStreak
        // Pass isDefeat=true so updateProgress knows not to modify streak
        var stars = 0;
        this.updateProgress(stars, false, true);
    },

    // ===== Render Chapter Result Page =====

    renderChapterResult: function(stars, result, rewards, nextUnlocked) {
        var chapter = App.chapter;
        var config = this.getCurrentConfig();

        // Update result page content
        document.getElementById('battle-result-icon').textContent = '🎉';
        document.getElementById('battle-result-title').textContent = '胜利！';
        document.getElementById('battle-result-subtitle').textContent =
            '第' + (chapter.chapterIndex + 1) + '关 · ' + config.name;

        document.getElementById('result-monsters').textContent = App.battle.monstersDefeated;
        document.getElementById('result-answers').textContent = App.battle.correctCount;
        document.getElementById('result-max-combo').textContent = App.battle.maxCombo;

        var accuracy = chapter.totalQuestions > 0
            ? Math.round(chapter.correctQuestions / chapter.totalQuestions * 100)
            : 0;

        // Show score
        var score = App.battle.monstersDefeated * 50;
        if (App.battle.noDamageTaken) score += 30;
        if (App.battle.maxCombo >= 10) score += 50;
        document.getElementById('result-battle-score').textContent = '+' + score;

        // Render chapter star display
        var starContainer = document.getElementById('chapter-star-display');
        if (starContainer) {
            starContainer.innerHTML = '';
            starContainer.style.display = 'flex';
            for (var i = 0; i < 3; i++) {
                var starEl = document.createElement('span');
                starEl.className = 'chapter-star' + (i < stars ? ' earned' : ' empty');
                starEl.textContent = i < stars ? '⭐' : '☆';
                starEl.style.animationDelay = (i * 0.5) + 's';
                starContainer.appendChild(starEl);
            }
        }

        // Render accuracy display
        var accuracyEl = document.getElementById('chapter-accuracy-display');
        if (accuracyEl) {
            var elapsed = Date.now() - chapter.startTime;
            var minutes = Math.floor(elapsed / 60000);
            var seconds = Math.floor((elapsed % 60000) / 1000);
            accuracyEl.innerHTML = '📊 准确率 ' + accuracy + '%&nbsp;&nbsp;⏱️ 用时 ' + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
            accuracyEl.style.display = 'block';
        }

        // v23.1: Render perfectStreak progress
        var streakEl = document.getElementById('chapter-streak-display');
        if (streakEl) {
            var progress = result.progress;
            var streak = progress.perfectStreak || 0;
            var nextChapterIndex = chapter.chapterIndex + 1;
            var moduleConfig = ChapterConfig[chapter.module];
            var needed = 0;
            if (moduleConfig && nextChapterIndex < moduleConfig.chapters.length) {
                var nextConfig = moduleConfig.chapters[nextChapterIndex];
                if (nextConfig.unlockCondition && typeof nextConfig.unlockCondition.consecutivePerfects === 'number') {
                    needed = nextConfig.unlockCondition.consecutivePerfects;
                }
            }
            if (needed > 0) {
                var streakHtml = '';
                if (result.isPerfect) {
                    streakHtml = '<div class="streak-progress perfect">💯 全对！连续全对 ' + streak + '/' + needed;
                    if (streak >= needed) {
                        streakHtml += ' ✅ 下一关已解锁！';
                    }
                    streakHtml += '</div>';
                } else {
                    streakHtml = '<div class="streak-progress imperfect">连续全对 ' + streak + '/' + needed + ' — 差一点！继续加油</div>';
                }
                streakEl.innerHTML = streakHtml;
                streakEl.style.display = 'block';
            } else {
                streakEl.style.display = 'none';
            }
        }

        // Render rewards
        var rewardsContainer = document.getElementById('chapter-rewards-display');
        if (rewardsContainer) {
            if (rewards.length > 0) {
                rewardsContainer.style.display = 'block';
                var html = '<div class="chapter-rewards-title">获得奖励</div>';
                for (var r = 0; r < rewards.length; r++) {
                    var isNew = result.isFirstClear && r === 0;
                    html += '<div class="chapter-reward-item">' + rewards[r].label +
                            (isNew ? ' <span class="reward-new-tag">NEW!</span>' : '') + '</div>';
                }
                rewardsContainer.innerHTML = html;
            } else {
                rewardsContainer.style.display = 'none';
            }
        }

        // Setup action buttons
        var actionsContainer = document.getElementById('chapter-result-actions');
        if (actionsContainer) {
            actionsContainer.style.display = 'flex';
            var html = '';
            html += '<button class="battle-result-btn" onclick="ChapterSystem.retryChapter()">再战一次</button>';
            if (nextUnlocked) {
                html += '<button class="battle-result-btn primary chapter-next-btn" onclick="ChapterSystem.nextChapter()">下一关 →</button>';
            }
            html += '<button class="battle-result-btn" onclick="ChapterSystem.backToChapterSelect()">返回</button>';
            actionsContainer.innerHTML = html;
        }

        // Hide default buttons, show chapter buttons
        var defaultActions = document.getElementById('default-result-actions');
        if (defaultActions) defaultActions.style.display = 'none';
    },

    retryChapter: function() {
        var module = App.chapter.module;
        var index = App.chapter.chapterIndex;
        this.startChapterBattle(module, index);
    },

    nextChapter: function() {
        var module = App.chapter.module;
        var index = App.chapter.chapterIndex + 1;
        if (this.isChapterUnlocked(module, index)) {
            this.startChapterBattle(module, index);
        }
    },

    backToChapterSelect: function() {
        App.chapter.active = false;
        showPage('xiaojiujiu-mode');
        this.renderChapterSelect('xiaojiujiu');
    },

    // ===== Render Chapter Select UI =====
    // v23.1: Updated to show perfectStreak progress on locked cards

    renderChapterSelect: function(module) {
        var container = document.getElementById('chapter-cards-container');
        if (!container) return;
        var moduleConfig = ChapterConfig[module];
        if (!moduleConfig) return;

        var totalStars = this.getModuleTotalStars(module);
        var maxStars = moduleConfig.chapters.length * 3;

        var html = '';
        for (var i = 0; i < moduleConfig.chapters.length; i++) {
            var ch = moduleConfig.chapters[i];
            var unlocked = this.isChapterUnlocked(module, i);
            var progress = this.getChapterProgress(module, ch.id);
            var stars = progress ? progress.stars : 0;
            var cleared = progress && progress.clearCount > 0;

            var cardClass = 'chapter-card';
            if (!unlocked) {
                cardClass += ' locked';
            } else if (cleared) {
                cardClass += ' cleared';
            } else {
                cardClass += ' available';
            }

            html += '<div class="' + cardClass + '" data-chapter-index="' + i + '" data-module="' + module + '">';
            html += '<div class="chapter-card-icon">' + (unlocked ? ch.icon : '🔒') + '</div>';
            html += '<div class="chapter-card-name">关' + (i + 1) + '</div>';

            // Star display
            html += '<div class="chapter-card-stars">';
            for (var s = 0; s < 3; s++) {
                html += '<span class="mini-star ' + (s < stars ? 'earned' : 'empty') + '">';
                html += s < stars ? '⭐' : '☆';
                html += '</span>';
            }
            html += '</div>';

            html += '<div class="chapter-card-subtitle">' + ch.name + '</div>';

            // v23.1: Show perfectStreak progress on cards
            if (!unlocked && ch.unlockCondition && typeof ch.unlockCondition.consecutivePerfects === 'number') {
                // Show streak progress for the prerequisite chapter
                var prereqProgress = this.getChapterProgress(module, ch.unlockCondition.chapter);
                var streak = prereqProgress ? (prereqProgress.perfectStreak || 0) : 0;
                var needed = ch.unlockCondition.consecutivePerfects;
                html += '<div class="chapter-card-streak">连续全对 ' + streak + '/' + needed + ' ⭐</div>';
                if (streak > 0 && streak < needed) {
                    html += '<div class="chapter-card-encourage">差一点！继续加油</div>';
                }
            } else if (!unlocked) {
                html += '<div class="chapter-card-lock-text">通关上一关解锁</div>';
            }

            // v23.1: Show perfectStreak info for unlocked chapters with next-chapter requirements
            if (unlocked && i < moduleConfig.chapters.length - 1) {
                var nextCh = moduleConfig.chapters[i + 1];
                if (nextCh.unlockCondition && typeof nextCh.unlockCondition.consecutivePerfects === 'number') {
                    var currentProgress = this.getChapterProgress(module, ch.id);
                    var currentStreak = currentProgress ? (currentProgress.perfectStreak || 0) : 0;
                    var neededForNext = nextCh.unlockCondition.consecutivePerfects;
                    if (currentStreak < neededForNext) {
                        html += '<div class="chapter-card-streak-info">💯 ' + currentStreak + '/' + neededForNext + '</div>';
                    }
                }
            }

            html += '</div>';

            // Arrow between cards
            if (i < moduleConfig.chapters.length - 1) {
                html += '<div class="chapter-arrow">→</div>';
            }
        }

        container.innerHTML = html;

        // Update progress badge
        var progressEl = document.getElementById('chapter-progress-display');
        if (progressEl) {
            progressEl.textContent = totalStars + '/' + maxStars + ' ⭐';
        }

        // Bind click events
        var cards = container.querySelectorAll('.chapter-card:not(.locked)');
        for (var c = 0; c < cards.length; c++) {
            cards[c].addEventListener('click', function() {
                var idx = parseInt(this.getAttribute('data-chapter-index'));
                var mod = this.getAttribute('data-module');
                ChapterSystem.startChapterBattle(mod, idx);
            });
        }
    },

    // ===== Track Questions in Chapter Mode =====

    onQuestionAnswered: function(isCorrect) {
        if (!App.chapter.active) return;
        App.chapter.totalQuestions++;
        if (isCorrect) {
            App.chapter.correctQuestions++;
        }
    },

    onPlayerDamaged: function() {
        if (!App.chapter.active) return;
        App.chapter.playerDamageTaken++;
    },

    onPlayerDied: function() {
        if (!App.chapter.active) return;
        App.chapter.playerDied = true;
    },

    // Track if current stage is boss fight
    onStageInit: function(stageIndex) {
        if (!App.chapter.active) return;
        var config = this.getCurrentConfig();
        if (!config) return;
        App.chapter.isBossFight = (stageIndex >= config.stageCount - 1);
    },

    // ===== v23.1: Get chapter flying weapon for current chapter =====

    getChapterFlyingWeapon: function(module, chapterId) {
        if (typeof chapterFlyingWeapons === 'undefined') return null;
        var weapons = chapterFlyingWeapons[module];
        if (!weapons) return null;
        for (var i = 0; i < weapons.length; i++) {
            if (weapons[i].chapter === chapterId) return weapons[i];
        }
        return null;
    },

    // ===== v23.1: Get chapter drop items for current chapter =====

    getChapterDropItems: function(module, chapterId) {
        if (typeof chapterItems === 'undefined') return [];
        var items = chapterItems[module];
        if (!items) return [];
        var drops = [];
        for (var i = 0; i < items.length; i++) {
            if (items[i].isChapterDrop && items[i].chapter === chapterId) {
                drops.push(items[i]);
            }
        }
        return drops;
    },

    // ===== Achievement Checking =====

    checkChapterAchievements: function(stars, result) {
        var achievements = App.stats.achievements;
        var chapter = App.chapter;
        var module = chapter.module;
        var chapterIndex = chapter.chapterIndex;

        var self = this;
        var delay = 1000;

        function grantAch(achId) {
            if (achievements.indexOf(achId) !== -1) return;
            achievements.push(achId);
            saveProgress();
            var ach = MathData.achievements.find(function(a) { return a.id === achId; });
            if (ach) {
                setTimeout(function() { showAchievement(ach); }, delay);
                delay += 1500;
            }
        }

        // General chapter achievements
        if (chapterIndex === 0) grantAch('chapter_first_clear');
        if (stars >= 3 && chapterIndex === 0) grantAch('chapter_3star_ch1');
        if (stars >= 3 && chapterIndex === 1) grantAch('chapter_3star_ch2');
        if (stars >= 3 && chapterIndex === 2) grantAch('chapter_3star_ch3');

        // Perfect module (all 3 chapters 3 stars)
        var moduleConfig = ChapterConfig[module];
        if (moduleConfig && stars >= 3) {
            var allPerfect = true;
            for (var i = 0; i < moduleConfig.chapters.length; i++) {
                var p = this.getChapterProgress(module, moduleConfig.chapters[i].id);
                if (!p || p.stars < 3) { allPerfect = false; break; }
            }
            if (allPerfect) grantAch('chapter_perfect_module');
        }

        // Speedrun: chapter 1 cleared in under 2 minutes
        if (chapterIndex === 0) {
            var elapsed = Date.now() - chapter.startTime;
            if (elapsed < 120000) grantAch('chapter_speedrun');
        }

        // No damage chapter 3
        if (chapterIndex === 2 && chapter.playerDamageTaken === 0) {
            grantAch('chapter_no_damage_ch3');
        }

        // Boss combo 10
        if (App.battle.maxCombo >= 10) grantAch('chapter_boss_combo10');

        // Module-specific achievements
        if (module === 'xiaojiujiu') {
            if (chapterIndex === 0) grantAch('xjj_ch1_clear');
            if (chapterIndex === 1) grantAch('xjj_ch2_clear');
            if (chapterIndex === 2) {
                grantAch('xjj_ch3_clear');
                // Phase 2 slayer
                grantAch('xjj_phase2_slayer');
            }

            // 9 stars total
            var totalStars = this.getModuleTotalStars('xiaojiujiu');
            if (totalStars >= 9) grantAch('xjj_9stars');

            // First attempt 3 stars on chapter 3
            if (chapterIndex === 2 && stars >= 3 && result.isFirstClear) {
                grantAch('xjj_ch3_first_3star');
            }

            // Replay master: improved stars 3 times (tracked separately)
            if (result.improved) {
                var data = this.loadProgress();
                if (!data._replayImprovements) data._replayImprovements = {};
                if (!data._replayImprovements[module]) data._replayImprovements[module] = 0;
                data._replayImprovements[module]++;
                this.saveProgressData(data);
                if (data._replayImprovements[module] >= 3) grantAch('xjj_replay_master');
            }
        }

        // Cross-module achievements (check all modules)
        this.checkCrossModuleAchievements();
    },

    checkCrossModuleAchievements: function() {
        var achievements = App.stats.achievements;
        var modules = ['xiaojiujiu', 'fraction', 'decimal', 'unit', 'multiply', 'times'];
        var ch1Count = 0;
        var ch3Count = 0;
        var totalStars = 0;

        for (var i = 0; i < modules.length; i++) {
            var mod = modules[i];
            if (!ChapterConfig[mod]) continue;
            var config = ChapterConfig[mod];
            for (var j = 0; j < config.chapters.length; j++) {
                var p = this.getChapterProgress(mod, config.chapters[j].id);
                if (p && p.stars > 0) {
                    if (j === 0) ch1Count++;
                    if (j === 2) ch3Count++;
                    totalStars += p.stars;
                }
            }
        }

        function grantAch(achId) {
            if (achievements.indexOf(achId) !== -1) return;
            achievements.push(achId);
            saveProgress();
            var ach = MathData.achievements.find(function(a) { return a.id === achId; });
            if (ach) setTimeout(function() { showAchievement(ach); }, 3000);
        }

        if (ch1Count >= 6) grantAch('chapter_6mod_ch1');
        if (ch3Count >= 6) grantAch('chapter_6mod_ch3');
        if (totalStars >= 54) grantAch('chapter_54stars');
    }
};
