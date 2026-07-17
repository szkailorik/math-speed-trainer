/**
 * move-system.js - 招式池系统 (Move Pool System)
 *
 * 基于答题速度、连击阶段和战斗状态，动态选择英雄攻击招式。
 * 扩展全局 BattleMode 对象。
 *
 * 依赖：
 *   - BattleMode (battle-data.js)
 *   - App.battle 状态字段 (core.js)
 *   - playSound(type) (effects.js)
 *   - BattleMode.setHeroState(state) (battle-arena.js)
 *   - BattleMode.setEnemyState(state) (battle-arena.js)
 *   - BattleMode.heroAttackAnimation(weapon, cb) (battle-arena.js)
 *   - BattleMode.fireWeaponHorizontal(weapon) (battle-arena.js)
 *   - BattleMode.screenShake(intensity) (hero-system.js)
 *   - BattleMode.executeComboAttack(combo, targetEl, cb) (hero-system.js)
 */

// =====================================================================
// 1. SpeedRankConfig - 速度评级阈值（毫秒），按难度分级
// =====================================================================

// v20.0: Recalibrated speed rank thresholds for children aged 7-12
var SpeedRankConfig = {
    easy:   { S: 2000, A: 4000, B: 6000 },
    normal: { S: 1500, A: 3000, B: 4500 },
    hard:   { S: 1000, A: 2000, B: 3000 }
};

// =====================================================================
// 2. SpeedRankDisplay - 各评级的视觉配置
// =====================================================================

var SpeedRankDisplay = {
    S: { icon: '\u26A1',          text: '极速!',  color: '#FFD700', scale: 1.5 },  // ⚡
    A: { icon: '\uD83D\uDCA8',   text: '迅捷',   color: '#4A90D9', scale: 1.2 },  // 💨
    B: { icon: '\u2713',          text: '普通',   color: '#FFFFFF', scale: 1.0 },  // ✓
    C: { icon: '\uD83D\uDC22',   text: '慢慢来', color: '#888888', scale: 0.9 }   // 🐢
};

// =====================================================================
// 3. MovePool - 招式池，按评级分组 (C/B/A/S) + 特殊招式
// =====================================================================

var MovePool = {

    // ----- C 级招式：可爱轻柔，不丢人 -----
    C: [
        {
            name: '轻拍',
            emoji: '\uD83D\uDC4B',     // 👋
            type: 'physical',
            sound: 'correct',
            particles: [],
            particleCount: 0,
            screenShake: 'none',
            screenFlash: false,
            damageMultiplier: 0.8
        },
        {
            name: '扔石头',
            emoji: '\uD83E\uDEA8',     // 🪨
            type: 'physical',
            sound: 'correct',
            particles: [],
            particleCount: 0,
            screenShake: 'light',
            screenFlash: false,
            damageMultiplier: 0.9
        },
        {
            name: '魔法飞沫',
            emoji: '\u2728',            // ✨
            type: 'magic',
            sound: 'correct',
            particles: ['\u2728'],      // ✨
            particleCount: 3,
            screenShake: 'none',
            screenFlash: false,
            damageMultiplier: 0.85
        },
        {
            name: '书本砸',
            emoji: '\uD83D\uDCD6',     // 📖
            type: 'physical',
            sound: 'correct',
            particles: [],
            particleCount: 0,
            screenShake: 'light',
            screenFlash: false,
            damageMultiplier: 0.9
        }
    ],

    // ----- B 级招式：标准攻击 -----
    B: [
        {
            name: '火球术',
            emoji: '\uD83D\uDD25',     // 🔥
            type: 'fire',
            sound: 'fire',
            particles: ['\uD83D\uDD25'],  // 🔥
            particleCount: 3,
            screenShake: 'light',
            screenFlash: false,
            damageMultiplier: 1.0
        },
        {
            name: '冰冻箭',
            emoji: '\uD83E\uDDCA',     // 🧊
            type: 'ice',
            sound: 'ice',
            particles: ['\u2744\uFE0F'],  // ❄️
            particleCount: 3,
            screenShake: 'light',
            screenFlash: false,
            damageMultiplier: 1.0
        },
        {
            name: '闪电链',
            emoji: '\u26A1',            // ⚡
            type: 'thunder',
            sound: 'thunder',
            particles: ['\u26A1'],      // ⚡
            particleCount: 4,
            screenShake: 'light',
            screenFlash: false,
            damageMultiplier: 1.0
        },
        {
            name: '旋风斩',
            emoji: '\uD83C\uDF00',     // 🌀
            type: 'wind',
            sound: 'wind',
            particles: ['\uD83C\uDF00'],  // 🌀
            particleCount: 4,
            screenShake: 'medium',
            screenFlash: false,
            damageMultiplier: 1.1
        }
    ],

    // ----- A 级招式：强力攻击 -----
    A: [
        {
            name: '流星冲击',
            emoji: '\u2604\uFE0F',      // ☄️
            type: 'cosmic',
            sound: 'star',
            particles: ['\u2604\uFE0F', '\uD83D\uDCA5'],  // ☄️💥
            particleCount: 6,
            screenShake: 'medium',
            screenFlash: true,
            damageMultiplier: 1.3
        },
        {
            name: '光之箭雨',
            emoji: '\uD83C\uDFF9',     // 🏹
            type: 'holy',
            sound: 'holy',
            particles: ['\uD83C\uDFF9'],  // 🏹
            particleCount: 5,
            screenShake: 'medium',
            screenFlash: false,
            damageMultiplier: 1.25
        },
        {
            name: '雷神之锤',
            emoji: '\uD83D\uDD28',     // 🔨
            type: 'thunder',
            sound: 'thunder',
            particles: ['\u26A1', '\uD83D\uDCA5'],  // ⚡💥
            particleCount: 6,
            screenShake: 'heavy',
            screenFlash: true,
            damageMultiplier: 1.35
        },
        {
            name: '彩虹光束',
            emoji: '\uD83C\uDF08',     // 🌈
            type: 'rainbow',
            sound: 'rainbow',
            particles: ['\uD83C\uDF08', '\u2728'],  // 🌈✨
            particleCount: 5,
            screenShake: 'medium',
            screenFlash: false,
            damageMultiplier: 1.2
        }
    ],

    // ----- S 级招式：终极大招 -----
    S: [
        {
            name: '星辰爆发',
            emoji: '\uD83C\uDF1F',     // 🌟
            type: 'cosmic',
            sound: 'star',
            particles: ['\uD83C\uDF1F', '\u2B50', '\uD83D\uDCAB', '\u2728'],  // 🌟⭐💫✨
            particleCount: 15,
            screenShake: 'heavy',
            screenFlash: true,
            damageMultiplier: 1.8
        },
        {
            name: '凤凰烈焰',
            emoji: '\uD83D\uDD25',     // 🔥
            type: 'fire',
            sound: 'fire',
            particles: ['\uD83D\uDD25', '\uD83D\uDD25', '\u2728'],  // 🔥🔥✨
            particleCount: 12,
            screenShake: 'heavy',
            screenFlash: true,
            damageMultiplier: 1.7
        },
        {
            name: '龙卷万刃',
            emoji: '\uD83D\uDC09',     // 🐉
            type: 'dragon',
            sound: 'bomb',
            particles: ['\uD83D\uDC09', '\u26A1', '\uD83D\uDCA5'],  // 🐉⚡💥
            particleCount: 12,
            screenShake: 'heavy',
            screenFlash: true,
            damageMultiplier: 1.75
        },
        {
            name: '天降正义',
            emoji: '\u2696\uFE0F',     // ⚖️
            type: 'holy',
            sound: 'holy',
            particles: ['\u2696\uFE0F', '\u2728', '\uD83D\uDC9B'],  // ⚖️✨💛
            particleCount: 15,
            screenShake: 'heavy',
            screenFlash: true,
            damageMultiplier: 1.85
        }
    ],

    // ----- 特殊招式 -----
    special: {
        desperateCounter: {
            name: '绝境反击',
            emoji: '\uD83D\uDCA2',     // 💢
            type: 'special',
            sound: 'streak',
            particles: ['\uD83D\uDCA2'],  // 💢
            particleCount: 12,
            screenShake: 'heavy',
            screenFlash: true,
            damageMultiplier: 2
        },
        finishingBlow: {
            name: '绝杀一击',
            emoji: '\uD83D\uDC80',     // 💀
            type: 'special',
            sound: 'bomb',
            particles: ['\uD83D\uDC80', '\u2694\uFE0F'],  // 💀⚔️
            particleCount: 8,
            screenShake: 'heavy',
            screenFlash: true,
            damageMultiplier: 1.5
        },
        comboFinisher: {
            name: '连击终结',
            emoji: '\u2B50',            // ⭐
            type: 'special',
            sound: 'achievement',
            particles: ['\u2B50', '\uD83C\uDF1F'],  // ⭐🌟
            particleCount: 20,
            screenShake: 'heavy',
            screenFlash: true,
            damageMultiplier: 2.5
        },
        shieldBash: {
            name: '护盾冲撞',
            emoji: '\uD83D\uDEE1\uFE0F',  // 🛡️
            type: 'special',
            sound: 'correct',
            particles: ['\uD83D\uDEE1\uFE0F', '\uD83D\uDCA5'],  // 🛡️💥
            particleCount: 6,
            screenShake: 'medium',
            screenFlash: false,
            damageMultiplier: 1.2
        }
    }
};

// =====================================================================
// 4. BattleMode.getSpeedRank - 根据答题时间和难度返回速度评级
// =====================================================================

/**
 * 根据答题时间（毫秒）和难度，返回速度评级。
 *
 * @param {number} answerTime - 答题耗时（毫秒）
 * @param {string} difficulty - 难度级别 ('easy' | 'normal' | 'hard')
 * @returns {string} 速度评级 'S' | 'A' | 'B' | 'C'
 */
BattleMode.getSpeedRank = function(answerTime, difficulty) {
    var config = SpeedRankConfig[difficulty] || SpeedRankConfig.normal;

    if (answerTime <= config.S) return 'S';
    if (answerTime <= config.A) return 'A';
    if (answerTime <= config.B) return 'B';
    return 'C';
};

// =====================================================================
// 5. BattleMode.selectMove - 招式选择算法
// =====================================================================

/**
 * 辅助函数：获取下一个更高评级
 * C → B, B → A, A → S, S → S
 */
function _nextRank(rank) {
    var map = { C: 'B', B: 'A', A: 'S', S: 'S' };
    return map[rank] || rank;
}

/**
 * 根据速度评级、连击阶段和战斗状态选择招式。
 *
 * 选择优先级：
 *   1. 特殊触发条件检测
 *   2. 基于速度评级的招式池
 *   3. 连击升级概率（combo 5+ 时 30% 概率升一级）
 *   4. 防重复机制（上次同招则重新随机一次）
 *
 * @param {string} speedRank - 速度评级 'S' | 'A' | 'B' | 'C'
 * @param {string} comboStage - 连击阶段名
 * @param {Object} battle - 战斗状态对象 (App.battle)
 * @returns {Object} 招式对象
 */
BattleMode.selectMove = function(speedRank, comboStage, battle) {
    var specials = MovePool.special;

    // --- 特殊触发检测 ---

    // 绝境反击：玩家 HP 为 1 时触发（每场最多 3 次）
    if (battle.playerHP === 1) {
        if (!battle.desperateCounterUsed) {
            battle.desperateCounterUsed = 0;
        }
        if (battle.desperateCounterUsed < 3) {
            battle.lastMoveName = specials.desperateCounter.name;
            return specials.desperateCounter;
        }
    }

    // 绝杀一击：怪物 HP 为 1 时触发
    if (battle.monsterHP === 1) {
        battle.lastMoveName = specials.finishingBlow.name;
        return specials.finishingBlow;
    }

    // 连击终结：combo >= 10 且速度评级为 S 时触发
    if (battle.combo >= 10 && speedRank === 'S') {
        battle.lastMoveName = specials.comboFinisher.name;
        return specials.comboFinisher;
    }

    // 护盾冲撞：拥有护盾时 20% 概率触发
    if (battle.shield && battle.shield > 0 && Math.random() < 0.2) {
        battle.lastMoveName = specials.shieldBash.name;
        return specials.shieldBash;
    }

    // --- 从速度评级对应的招式池中选择 ---

    var rank = speedRank;
    var pool = MovePool[rank];

    // 连击升级：comboStage >= 'will'（combo 5+）且不是 S 级时，30% 概率升级
    var willAndAbove = ['will', 'godlike', 'invincible'];
    if (willAndAbove.indexOf(comboStage) !== -1 && rank !== 'S') {
        if (Math.random() < 0.3) {
            rank = _nextRank(rank);
            pool = MovePool[rank];
        }
    }

    // 安全检查：确保招式池存在且非空
    if (!pool || pool.length === 0) {
        pool = MovePool.B;
    }

    // 随机选择一个招式
    var selected = pool[Math.floor(Math.random() * pool.length)];

    // 防重复：如果与上次招式相同，重新随机一次
    if (battle.lastMoveName && selected.name === battle.lastMoveName && pool.length > 1) {
        selected = pool[Math.floor(Math.random() * pool.length)];
    }

    // 记录本次招式名称
    battle.lastMoveName = selected.name;

    return selected;
};

// =====================================================================
// 6. BattleMode.showSpeedRank - 显示速度评级 UI
// =====================================================================

/**
 * 显示速度评级弹出标签。
 * 不阻塞执行（fire and forget）。
 *
 * @param {string} rank - 评级 'S' | 'A' | 'B' | 'C'
 */
BattleMode.showSpeedRank = function(rank) {
    var display = SpeedRankDisplay[rank];
    if (!display) return;

    var el = document.getElementById('speed-rank-display');
    if (!el) {
        // 如果元素不存在则动态创建
        el = document.createElement('div');
        el.className = 'speed-rank-display';
        el.id = 'speed-rank-display';
        el.innerHTML = '<span class="speed-rank-icon" id="speed-rank-icon"></span>' +
                        '<span class="speed-rank-text" id="speed-rank-text"></span>';
        var arena = document.querySelector('.battle-arena');
        if (arena) {
            arena.appendChild(el);
        } else {
            document.body.appendChild(el);
        }
    }

    var iconEl = document.getElementById('speed-rank-icon');
    var textEl = document.getElementById('speed-rank-text');

    if (iconEl) iconEl.textContent = display.icon;
    if (textEl) textEl.textContent = display.text;

    // 设置评级颜色
    el.style.color = display.color;
    el.style.transform = 'scale(' + display.scale + ')';

    // 清除之前的样式类
    el.classList.remove('show', 'rank-S', 'rank-A', 'rank-B', 'rank-C');

    // 添加当前评级样式类
    el.classList.add('show', 'rank-' + rank);

    // 800ms 后移除显示（fire and forget）
    setTimeout(function() {
        el.classList.remove('show', 'rank-S', 'rank-A', 'rank-B', 'rank-C');
    }, 800);
};

// =====================================================================
// 7. BattleMode.showMoveName - 显示招式名称弹出
// =====================================================================

/**
 * 在英雄上方显示招式名称弹出。
 *
 * @param {Object} move - 招式对象 { emoji, name, ... }
 */
BattleMode.showMoveName = function(move) {
    if (!move) return;

    var el = document.getElementById('move-name-popup');
    if (!el) {
        // 如果元素不存在则动态创建
        el = document.createElement('div');
        el.className = 'move-name-popup';
        el.id = 'move-name-popup';
        var heroSide = document.querySelector('.hero-side');
        if (heroSide) {
            heroSide.appendChild(el);
        } else {
            var arena = document.querySelector('.battle-arena');
            if (arena) {
                arena.appendChild(el);
            } else {
                document.body.appendChild(el);
            }
        }
    }

    // 设置招式文字：emoji + 名称
    el.textContent = move.emoji + ' ' + move.name;

    // 清除并重新添加显示类
    el.classList.remove('show');

    // 强制重排以重新触发动画
    void el.offsetWidth;

    el.classList.add('show');

    // 1000ms 后移除显示
    setTimeout(function() {
        el.classList.remove('show');
    }, 1000);
};

// =====================================================================
// 8. BattleMode.executeMove - 主招式执行调度器
// =====================================================================

/**
 * 执行招式的主调度函数。
 *
 * 流程：
 *   1. 显示招式名称弹出
 *   2. 根据招式等级确定动画类型
 *   3. 播放音效
 *   4. 生成粒子效果
 *   5. 屏幕特效（震动/闪白）
 *   6. 动画完成后调用回调
 *
 * @param {Object} move - 招式对象
 * @param {Object} weapon - 武器对象 { emoji, color, ... }
 * @param {Element} targetEl - 目标 DOM 元素（敌人）
 * @param {Function} callback - 动画完成回调
 */
BattleMode.executeMove = function(move, weapon, targetEl, callback) {
    var self = this;

    // 1. 显示招式名称
    self.showMoveName(move);

    // 2. 播放音效
    if (typeof playSound === 'function' && move.sound) {
        playSound(move.sound);
    }

    // 3. 执行动画序列（根据招式等级分类处理）
    self.executeMoveAnimation(move, weapon, targetEl, function() {
        // 4. 动画完成后生成粒子
        if (move.particleCount > 0 && move.particles && move.particles.length > 0) {
            self.spawnMoveParticles(targetEl, move.particles, move.particleCount);
        }

        // 5. 屏幕震动
        if (move.screenShake && move.screenShake !== 'none') {
            self.screenShake(move.screenShake);
        }

        // 6. 屏幕闪白
        if (move.screenFlash) {
            self.screenFlashEffect('#FFFFFF', 200);
        }

        // 7. 回调
        if (callback) callback();
    });
};

// =====================================================================
// 9. BattleMode.executeMoveAnimation - 底层动画执行器
// =====================================================================

/**
 * 判定招式所属评级（用于确定动画级别）。
 * 遍历 MovePool 各级招式池查找匹配。
 *
 * @param {Object} move - 招式对象
 * @returns {string} 评级 'C' | 'B' | 'A' | 'S' | 'special'
 */
function _getMoveRank(move) {
    var ranks = ['C', 'B', 'A', 'S'];
    for (var r = 0; r < ranks.length; r++) {
        var pool = MovePool[ranks[r]];
        for (var i = 0; i < pool.length; i++) {
            if (pool[i].name === move.name) return ranks[r];
        }
    }
    // 检查特殊招式
    var specials = MovePool.special;
    for (var key in specials) {
        if (specials.hasOwnProperty(key) && specials[key].name === move.name) {
            return 'special_' + key;
        }
    }
    return 'B'; // 默认按 B 级处理
}

/**
 * 底层动画执行器：根据招式级别执行不同的视觉动画序列。
 *
 * 动画时长：
 *   C 级：~0.6s
 *   B 级：~0.7s
 *   A 级：~0.9s
 *   S 级：~1.3s
 *   特殊：~1.5s
 *
 * @param {Object} move - 招式对象
 * @param {Object} weapon - 武器对象
 * @param {Element} targetEl - 目标 DOM 元素
 * @param {Function} callback - 完成回调
 */
BattleMode.executeMoveAnimation = function(move, weapon, targetEl, callback) {
    var self = this;
    var rank = _getMoveRank(move);
    var arena = document.querySelector('.battle-arena');
    var heroEmoji = document.querySelector('.hero-emoji');

    // ----- C 级动画：简单攻击（~0.6s）-----
    if (rank === 'C') {
        // 英雄施法姿态
        self.setHeroState('cast_spell');

        // 发射小型弹丸
        self._fireSmallProjectile(move.emoji, targetEl);

        // 小型命中效果
        setTimeout(function() {
            self._showSmallHitEffect(targetEl);
            self.setEnemyState('hit');
        }, 350);

        // 恢复待机
        setTimeout(function() {
            self.setHeroState('idle');
            self.setEnemyState('idle');
            if (callback) callback();
        }, 600);

        return;
    }

    // ----- B 级动画：标准攻击（~0.7s）-----
    if (rank === 'B') {
        // 使用已有的 heroAttackAnimation 执行标准武器攻击
        var weaponObj = { emoji: move.emoji, color: self._getMoveColor(move) };
        self.heroAttackAnimation(weaponObj, function() {
            // 标准命中效果
            self._showStandardHitEffect(targetEl, move.emoji);
            self.setEnemyState('hit');

            setTimeout(function() {
                self.setEnemyState('idle');
                if (callback) callback();
            }, 100);
        });

        return;
    }

    // ----- A 级动画：强力攻击（~0.9s）-----
    if (rank === 'A') {
        // 英雄冲刺
        if (heroEmoji) heroEmoji.classList.add('hero-dash');
        self.setHeroState('cast_spell');

        // 发射大型弹丸 + 拖尾粒子
        setTimeout(function() {
            self._fireLargeProjectile(move.emoji, targetEl, self._getMoveColor(move));
            self._spawnTrailParticles(move.particles, 3);
        }, 200);

        // 敌人命中闪烁 + 震动
        setTimeout(function() {
            self.setEnemyState('hit');
            if (targetEl) targetEl.classList.add('enemy-flash');
            self.screenShake('medium');
        }, 550);

        // 清理并回调
        setTimeout(function() {
            if (heroEmoji) heroEmoji.classList.remove('hero-dash');
            self.setHeroState('idle');
            self.setEnemyState('idle');
            if (targetEl) targetEl.classList.remove('enemy-flash');
            if (callback) callback();
        }, 900);

        return;
    }

    // ----- S 级动画：终极大招（~1.3s）-----
    if (rank === 'S') {
        // 场景变暗
        if (arena) arena.classList.add('arena-dimmed');

        // 英雄蓄力（缩放动画）
        self.setHeroState('cast_spell');
        if (heroEmoji) heroEmoji.classList.add('hero-charge-scale');

        // 蓄力完成，发射巨型弹丸
        setTimeout(function() {
            if (heroEmoji) heroEmoji.classList.remove('hero-charge-scale');
            self._fireGiantProjectile(move.emoji, targetEl, self._getMoveColor(move));
        }, 400);

        // 爆炸粒子 + 重度震动 + 闪屏
        setTimeout(function() {
            self.setEnemyState('hit');
            self.spawnMoveParticles(targetEl, move.particles, move.particleCount);
            self.screenShake('heavy');
            self.screenFlashEffect('#FFFFFF', 250);
        }, 800);

        // 清理并回调
        setTimeout(function() {
            if (arena) arena.classList.remove('arena-dimmed');
            self.setHeroState('idle');
            self.setEnemyState('idle');
            if (callback) callback();
        }, 1300);

        return;
    }

    // ----- 特殊招式：绝境反击 (~1.5s) -----
    if (rank === 'special_desperateCounter') {
        var battle = App.battle;

        // 屏幕红色闪烁
        self.screenFlashEffect('#FF0000', 300);

        // 英雄蓄力 + 红色怒气粒子
        self.setHeroState('cast_spell');
        if (heroEmoji) heroEmoji.classList.add('hero-charge-scale');
        self._spawnAuraParticles(heroEmoji, ['\uD83D\uDCA2'], 6, '#FF0000');  // 💢

        // 英雄冲向敌人
        setTimeout(function() {
            if (heroEmoji) {
                heroEmoji.classList.remove('hero-charge-scale');
                heroEmoji.classList.add('hero-dash');
            }
        }, 400);

        // 重击命中
        setTimeout(function() {
            self.setEnemyState('hit');
            self.spawnMoveParticles(targetEl, move.particles, move.particleCount);
            self.screenShake('heavy');
            self.screenFlashEffect('#FF4444', 200);
        }, 700);

        // 英雄归位 + 显示文字 + 恢复 1 HP
        setTimeout(function() {
            if (heroEmoji) heroEmoji.classList.remove('hero-dash');
            self.setHeroState('idle');
            self.setEnemyState('idle');

            // 显示 "绝境反击!" 文字
            self._showBattleText('\uD83D\uDCA2 绝境反击!', '#FF4444');  // 💢

            // 恢复 1 点 HP（不超过最大值）
            if (battle.playerHP < (battle.playerMaxHP || 5)) {
                battle.playerHP++;
            }

            // 记录使用次数
            if (!battle.desperateCounterUsed) {
                battle.desperateCounterUsed = 0;
            }
            battle.desperateCounterUsed++;

            if (callback) callback();
        }, 1500);

        return;
    }

    // ----- 特殊招式：绝杀一击 (~1.5s) -----
    if (rank === 'special_finishingBlow') {
        // 慢动作效果
        if (arena) arena.classList.add('arena-slow-motion');

        // 显示 "致命一击!" 文字
        self._showBattleText('\uD83D\uDC80 致命一击!', '#FF0000');  // 💀

        self.setHeroState('cast_spell');

        // 大型武器飞行
        setTimeout(function() {
            self._fireGiantProjectile(move.emoji, targetEl, '#FF0000');
        }, 400);

        // 💀 闪烁命中
        setTimeout(function() {
            self.setEnemyState('hit');
            if (targetEl) {
                targetEl.classList.add('enemy-flash');
                // 骷髅闪烁叠加
                self._showSkullFlash(targetEl);
            }
            self.screenShake('heavy');
        }, 800);

        // 清理
        setTimeout(function() {
            if (arena) arena.classList.remove('arena-slow-motion');
            self.setHeroState('idle');
            self.setEnemyState('idle');
            if (targetEl) targetEl.classList.remove('enemy-flash');
            if (callback) callback();
        }, 1500);

        return;
    }

    // ----- 特殊招式：连击终结 (~1.5s) -----
    if (rank === 'special_comboFinisher') {
        // 连击数字爆炸效果
        self._explodeComboNumber();

        // 英雄蓄力
        self.setHeroState('cast_spell');
        if (heroEmoji) heroEmoji.classList.add('hero-charge-scale');

        // 巨型武器 + 彩虹光束
        setTimeout(function() {
            if (heroEmoji) heroEmoji.classList.remove('hero-charge-scale');
            self._fireGiantProjectile(move.emoji, targetEl, '#FFD700');
            self._fireRainbowBeam(targetEl);
        }, 500);

        // 全屏粒子爆炸
        setTimeout(function() {
            self.setEnemyState('hit');
            self.spawnMoveParticles(targetEl, move.particles, move.particleCount);

            // 全屏粒子（在整个竞技场内散布）
            self._spawnFullScreenParticles(move.particles, 15);
            self.screenShake('heavy');
            self.screenFlashEffect('#FFD700', 300);
        }, 900);

        // 清理
        setTimeout(function() {
            self.setHeroState('idle');
            self.setEnemyState('idle');
            if (callback) callback();
        }, 1500);

        return;
    }

    // ----- 特殊招式：护盾冲撞 (~1.5s) -----
    if (rank === 'special_shieldBash') {
        self.setHeroState('cast_spell');

        // 盾牌飞出
        setTimeout(function() {
            self._fireLargeProjectile('\uD83D\uDEE1\uFE0F', targetEl, '#4A90D9');  // 🛡️
        }, 200);

        // 敌人被击退动画
        setTimeout(function() {
            self.setEnemyState('hit');
            if (targetEl) targetEl.classList.add('enemy-knockback');
            self.spawnMoveParticles(targetEl, move.particles, move.particleCount);
            self.screenShake('medium');
        }, 600);

        // 清理
        setTimeout(function() {
            self.setHeroState('idle');
            self.setEnemyState('idle');
            if (targetEl) targetEl.classList.remove('enemy-knockback');
            if (callback) callback();
        }, 1500);

        return;
    }

    // ----- 兜底：未识别的招式，使用 B 级标准动画 -----
    var fallbackWeapon = { emoji: move.emoji, color: self._getMoveColor(move) };
    self.heroAttackAnimation(fallbackWeapon, function() {
        self.setEnemyState('hit');
        setTimeout(function() {
            self.setEnemyState('idle');
            if (callback) callback();
        }, 200);
    });
};

// =====================================================================
// 10. BattleMode.spawnMoveParticles - 招式粒子生成器
// =====================================================================

/**
 * 在目标元素周围生成飞散粒子效果。
 * 每个粒子随机偏移、随机选择 emoji，向外飞出后淡出消失。
 *
 * @param {Element} targetEl - 目标 DOM 元素
 * @param {Array<string>} particles - 可用的 emoji 粒子数组
 * @param {number} count - 生成粒子数量
 */
BattleMode.spawnMoveParticles = function(targetEl, particles, count) {
    if (!targetEl || !particles || particles.length === 0 || !count) return;

    var arena = document.querySelector('.battle-arena');
    if (!arena) return;

    // 获取目标元素相对于竞技场的位置
    var targetRect = targetEl.getBoundingClientRect();
    var arenaRect = arena.getBoundingClientRect();

    var centerX = targetRect.left - arenaRect.left + targetRect.width / 2;
    var centerY = targetRect.top - arenaRect.top + targetRect.height / 2;

    for (var i = 0; i < count; i++) {
        (function(index) {
            var particle = document.createElement('div');
            particle.className = 'move-particle';
            particle.textContent = particles[index % particles.length];

            // 随机起始位置偏移（-20px ~ +20px）
            var offsetX = (Math.random() - 0.5) * 40;
            var offsetY = (Math.random() - 0.5) * 40;

            particle.style.position = 'absolute';
            particle.style.left = (centerX + offsetX) + 'px';
            particle.style.top = (centerY + offsetY) + 'px';
            particle.style.fontSize = (0.8 + Math.random() * 0.8) + 'rem';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '100';
            particle.style.opacity = '1';
            particle.style.transition = 'all 0.6s ease-out';

            arena.appendChild(particle);

            // 随机飞散方向和距离
            var flyX = (Math.random() - 0.5) * 120;
            var flyY = (Math.random() - 0.5) * 120 - 30;  // 略微偏上

            // 下一帧触发动画
            requestAnimationFrame(function() {
                particle.style.transform = 'translate(' + flyX + 'px, ' + flyY + 'px) scale(0.3)';
                particle.style.opacity = '0';
            });

            // 动画结束后移除
            setTimeout(function() {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 650);
        })(i);
    }
};

// =====================================================================
// 11. BattleMode.screenFlashEffect - 全屏闪光效果
// =====================================================================

/**
 * 创建全屏闪光覆盖层，在指定时间内淡出。
 *
 * @param {string} color - 闪光颜色（CSS 颜色值）
 * @param {number} duration - 淡出持续时间（毫秒）
 */
BattleMode.screenFlashEffect = function(color, duration) {
    var overlay = document.createElement('div');
    overlay.className = 'screen-flash-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = color || '#FFFFFF';
    overlay.style.opacity = '0.6';
    overlay.style.zIndex = '9999';
    overlay.style.pointerEvents = 'none';
    overlay.style.transition = 'opacity ' + (duration || 200) + 'ms ease-out';

    document.body.appendChild(overlay);

    // 下一帧开始淡出
    requestAnimationFrame(function() {
        overlay.style.opacity = '0';
    });

    // 淡出完成后移除
    setTimeout(function() {
        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }, (duration || 200) + 50);
};

// =====================================================================
// 12. BattleMode.getAdjustedWeaponWeights - 按速度评级调整武器权重
// =====================================================================

/**
 * 根据速度评级调整基础武器池的权重。
 * 快速回答时增加稀有武器权重，慢速回答时增加基础武器权重。
 *
 * @param {string} speedRank - 速度评级 'S' | 'A' | 'B' | 'C'
 * @returns {Array<Object>} 调整后的武器数组（含修改后的 weight）
 */
BattleMode.getAdjustedWeaponWeights = function(speedRank) {
    var baseWeapons = BattleMode.weapons;
    if (!baseWeapons || !baseWeapons.length) return [];

    // 深拷贝武器数组，避免修改原始数据
    var adjusted = [];
    for (var i = 0; i < baseWeapons.length; i++) {
        var w = baseWeapons[i];
        adjusted.push({
            emoji: w.emoji,
            name: w.name,
            weight: w.weight,
            sound: w.sound,
            color: w.color
        });
    }

    // S 级：⭐🌈💣 权重 ×3
    if (speedRank === 'S') {
        var sBoost = ['\u2B50', '\uD83C\uDF08', '\uD83D\uDCA3'];  // ⭐🌈💣
        for (var i = 0; i < adjusted.length; i++) {
            if (sBoost.indexOf(adjusted[i].emoji) !== -1) {
                adjusted[i].weight *= 3;
            }
        }
    }

    // A 级：⭐🌈 权重 ×2
    if (speedRank === 'A') {
        var aBoost = ['\u2B50', '\uD83C\uDF08'];  // ⭐🌈
        for (var i = 0; i < adjusted.length; i++) {
            if (aBoost.indexOf(adjusted[i].emoji) !== -1) {
                adjusted[i].weight *= 2;
            }
        }
    }

    // B 级：正常权重，无调整

    // C 级：🔥🧊 权重 ×2
    if (speedRank === 'C') {
        var cBoost = ['\uD83D\uDD25', '\uD83E\uDDCA'];  // 🔥🧊
        for (var i = 0; i < adjusted.length; i++) {
            if (cBoost.indexOf(adjusted[i].emoji) !== -1) {
                adjusted[i].weight *= 2;
            }
        }
    }

    return adjusted;
};

// =====================================================================
// 内部辅助方法 - 动画元素创建
// =====================================================================

/**
 * 获取招式对应的颜色（基于类型映射）
 */
BattleMode._getMoveColor = function(move) {
    var colorMap = {
        fire: '#ff6b35',
        ice: '#74b9ff',
        thunder: '#ffeaa7',
        wind: '#81ecec',
        cosmic: '#fdcb6e',
        holy: '#fff9c4',
        rainbow: '#a29bfe',
        dragon: '#e74c3c',
        physical: '#cccccc',
        magic: '#bb99ff',
        special: '#ff4444'
    };
    return colorMap[move.type] || '#ffaa00';
};

/**
 * 发射小型弹丸（C 级使用）
 */
BattleMode._fireSmallProjectile = function(emoji, targetEl) {
    var arena = document.querySelector('.battle-arena');
    if (!arena) return;

    var projectile = document.createElement('div');
    projectile.className = 'arena-attack-projectile hero-projectile move-projectile-small';
    WeaponArt.setProjectile(projectile, { emoji: emoji, name: '轻型招式' }, App.battle.module, 'move-weapon-small');
    projectile.style.fontSize = '1.2rem';

    arena.appendChild(projectile);

    requestAnimationFrame(function() {
        projectile.classList.add('fly');
    });

    setTimeout(function() {
        WeaponArt.spawnImpact(targetEl, { emoji: emoji, name: '轻型招式' }, App.battle.module, 0.65);
        if (projectile.parentNode) projectile.parentNode.removeChild(projectile);
    }, 500);
};

/**
 * 发射大型弹丸（A 级使用）
 */
BattleMode._fireLargeProjectile = function(emoji, targetEl, color) {
    var arena = document.querySelector('.battle-arena');
    if (!arena) return;

    var projectile = document.createElement('div');
    projectile.className = 'arena-attack-projectile hero-projectile move-projectile-large';
    WeaponArt.setProjectile(projectile, { emoji: emoji, name: '强化招式' }, App.battle.module, 'move-weapon-large');
    projectile.style.fontSize = '2rem';

    if (color) {
        projectile.style.filter = 'drop-shadow(0 0 12px ' + color + ')';
    }

    arena.appendChild(projectile);

    requestAnimationFrame(function() {
        projectile.classList.add('fly');
    });

    setTimeout(function() {
        WeaponArt.spawnImpact(targetEl, { emoji: emoji, name: '强化招式' }, App.battle.module, 1);
        if (projectile.parentNode) projectile.parentNode.removeChild(projectile);
    }, 600);
};

/**
 * 发射巨型弹丸（S 级 / 终结技使用）
 */
BattleMode._fireGiantProjectile = function(emoji, targetEl, color) {
    var arena = document.querySelector('.battle-arena');
    if (!arena) return;

    var projectile = document.createElement('div');
    projectile.className = 'arena-attack-projectile hero-projectile move-projectile-giant';
    WeaponArt.setProjectile(projectile, { emoji: emoji, name: '终结招式' }, App.battle.module, 'move-weapon-giant');
    projectile.style.fontSize = '3.5rem';

    if (color) {
        projectile.style.filter = 'drop-shadow(0 0 20px ' + color + ') drop-shadow(0 0 40px ' + color + ')';
    }

    arena.appendChild(projectile);

    requestAnimationFrame(function() {
        projectile.classList.add('fly');
    });

    setTimeout(function() {
        WeaponArt.spawnImpact(targetEl, { emoji: emoji, name: '终结招式' }, App.battle.module, 1.35);
        if (projectile.parentNode) projectile.parentNode.removeChild(projectile);
    }, 700);
};

/**
 * 显示小型命中效果（C 级使用）
 */
BattleMode._showSmallHitEffect = function(targetEl) {
    if (!targetEl) return;

    var hit = document.createElement('div');
    hit.className = 'move-hit-effect small';
    hit.textContent = '\uD83D\uDCA5';  // 💥
    hit.style.position = 'absolute';
    hit.style.fontSize = '1.5rem';
    hit.style.pointerEvents = 'none';
    hit.style.zIndex = '90';
    hit.style.opacity = '1';
    hit.style.transition = 'all 0.3s ease-out';

    var parent = targetEl.parentElement;
    if (parent) {
        parent.appendChild(hit);

        requestAnimationFrame(function() {
            hit.style.transform = 'scale(1.5)';
            hit.style.opacity = '0';
        });

        setTimeout(function() {
            if (hit.parentNode) hit.parentNode.removeChild(hit);
        }, 350);
    }
};

/**
 * 显示标准命中效果（B 级使用）
 */
BattleMode._showStandardHitEffect = function(targetEl, emoji) {
    if (!targetEl) return;

    var hit = document.createElement('div');
    hit.className = 'move-hit-effect standard';
    hit.textContent = emoji || '\uD83D\uDCA5';  // 💥
    hit.style.position = 'absolute';
    hit.style.fontSize = '2rem';
    hit.style.pointerEvents = 'none';
    hit.style.zIndex = '90';
    hit.style.opacity = '1';
    hit.style.transition = 'all 0.4s ease-out';

    var parent = targetEl.parentElement;
    if (parent) {
        parent.appendChild(hit);

        requestAnimationFrame(function() {
            hit.style.transform = 'scale(2)';
            hit.style.opacity = '0';
        });

        setTimeout(function() {
            if (hit.parentNode) hit.parentNode.removeChild(hit);
        }, 450);
    }
};

/**
 * 生成拖尾粒子（A 级攻击时使用）
 */
BattleMode._spawnTrailParticles = function(particles, count) {
    var arena = document.querySelector('.battle-arena');
    var heroEmoji = document.querySelector('.hero-emoji');
    if (!arena || !heroEmoji || !particles || particles.length === 0) return;

    var heroRect = heroEmoji.getBoundingClientRect();
    var arenaRect = arena.getBoundingClientRect();

    var startX = heroRect.left - arenaRect.left + heroRect.width / 2;
    var startY = heroRect.top - arenaRect.top + heroRect.height / 2;

    for (var i = 0; i < count; i++) {
        (function(index) {
            var trail = document.createElement('div');
            trail.className = 'move-trail-particle';
            trail.textContent = particles[index % particles.length];
            trail.style.position = 'absolute';
            trail.style.left = (startX + Math.random() * 30) + 'px';
            trail.style.top = (startY + (Math.random() - 0.5) * 20) + 'px';
            trail.style.fontSize = '0.9rem';
            trail.style.pointerEvents = 'none';
            trail.style.zIndex = '80';
            trail.style.opacity = '0.8';
            trail.style.transition = 'all 0.5s ease-out';

            arena.appendChild(trail);

            requestAnimationFrame(function() {
                trail.style.transform = 'translateX(' + (40 + Math.random() * 30) + 'px) translateY(' + ((Math.random() - 0.5) * 40) + 'px)';
                trail.style.opacity = '0';
            });

            setTimeout(function() {
                if (trail.parentNode) trail.parentNode.removeChild(trail);
            }, 550);
        })(i);
    }
};

/**
 * 在英雄周围生成光环粒子（绝境反击使用）
 */
BattleMode._spawnAuraParticles = function(targetEl, particles, count, color) {
    if (!targetEl || !particles || particles.length === 0) return;

    var parent = targetEl.parentElement;
    if (!parent) return;

    for (var i = 0; i < count; i++) {
        (function(index) {
            var aura = document.createElement('div');
            aura.className = 'move-aura-particle';
            aura.textContent = particles[index % particles.length];
            aura.style.position = 'absolute';
            aura.style.fontSize = '0.8rem';
            aura.style.pointerEvents = 'none';
            aura.style.zIndex = '85';
            aura.style.opacity = '0.9';
            aura.style.transition = 'all 0.6s ease-out';

            // 围绕目标随机分布
            var angle = (index / count) * Math.PI * 2;
            var radius = 20 + Math.random() * 15;
            aura.style.left = (50 + Math.cos(angle) * radius) + '%';
            aura.style.top = (50 + Math.sin(angle) * radius) + '%';

            if (color) {
                aura.style.textShadow = '0 0 8px ' + color;
            }

            parent.appendChild(aura);

            // 向外扩散
            requestAnimationFrame(function() {
                var expandRadius = radius + 20;
                aura.style.left = (50 + Math.cos(angle) * expandRadius) + '%';
                aura.style.top = (50 + Math.sin(angle) * expandRadius) + '%';
                aura.style.opacity = '0';
                aura.style.transform = 'scale(1.5)';
            });

            setTimeout(function() {
                if (aura.parentNode) aura.parentNode.removeChild(aura);
            }, 650);
        })(i);
    }
};

/**
 * 显示战斗文字提示（如 "绝境反击!" "致命一击!"）
 */
BattleMode._showBattleText = function(text, color) {
    var arena = document.querySelector('.battle-arena');
    if (!arena) return;

    var textEl = document.createElement('div');
    textEl.className = 'move-battle-text';
    textEl.textContent = text;
    textEl.style.position = 'absolute';
    textEl.style.left = '50%';
    textEl.style.top = '30%';
    textEl.style.transform = 'translateX(-50%) scale(0.5)';
    textEl.style.fontSize = '1.6rem';
    textEl.style.fontWeight = 'bold';
    textEl.style.color = color || '#FFD700';
    textEl.style.textShadow = '0 0 10px ' + (color || '#FFD700') + ', 0 2px 4px rgba(0,0,0,0.8)';
    textEl.style.pointerEvents = 'none';
    textEl.style.zIndex = '110';
    textEl.style.opacity = '0';
    textEl.style.transition = 'all 0.3s ease-out';
    textEl.style.whiteSpace = 'nowrap';

    arena.appendChild(textEl);

    // 弹入动画
    requestAnimationFrame(function() {
        textEl.style.opacity = '1';
        textEl.style.transform = 'translateX(-50%) scale(1.2)';
    });

    // 缩回正常大小
    setTimeout(function() {
        textEl.style.transform = 'translateX(-50%) scale(1)';
    }, 200);

    // 淡出并移除
    setTimeout(function() {
        textEl.style.opacity = '0';
        textEl.style.transform = 'translateX(-50%) translateY(-20px) scale(0.8)';
    }, 800);

    setTimeout(function() {
        if (textEl.parentNode) textEl.parentNode.removeChild(textEl);
    }, 1100);
};

/**
 * 在目标上显示骷髅闪烁效果（绝杀一击使用）
 */
BattleMode._showSkullFlash = function(targetEl) {
    if (!targetEl) return;

    var parent = targetEl.parentElement;
    if (!parent) return;

    var skull = document.createElement('div');
    skull.className = 'move-skull-flash';
    skull.textContent = '\uD83D\uDC80';  // 💀
    skull.style.position = 'absolute';
    skull.style.left = '50%';
    skull.style.top = '50%';
    skull.style.transform = 'translate(-50%, -50%) scale(0.5)';
    skull.style.fontSize = '3rem';
    skull.style.pointerEvents = 'none';
    skull.style.zIndex = '95';
    skull.style.opacity = '0';
    skull.style.transition = 'all 0.3s ease-out';

    parent.appendChild(skull);

    // 闪烁出现
    requestAnimationFrame(function() {
        skull.style.opacity = '1';
        skull.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });

    // 快速闪烁效果
    setTimeout(function() {
        skull.style.opacity = '0.3';
    }, 150);
    setTimeout(function() {
        skull.style.opacity = '1';
    }, 250);
    setTimeout(function() {
        skull.style.opacity = '0';
        skull.style.transform = 'translate(-50%, -50%) scale(2)';
    }, 400);

    setTimeout(function() {
        if (skull.parentNode) skull.parentNode.removeChild(skull);
    }, 500);
};

/**
 * 连击数字爆炸效果（连击终结使用）
 */
BattleMode._explodeComboNumber = function() {
    var comboDisplay = document.querySelector('.combo-display') ||
                       document.querySelector('.combo-count');
    if (!comboDisplay) return;

    // 添加爆炸动画类
    comboDisplay.classList.add('combo-explode');

    setTimeout(function() {
        comboDisplay.classList.remove('combo-explode');
    }, 600);
};

/**
 * 发射彩虹光束（连击终结使用）
 */
BattleMode._fireRainbowBeam = function(targetEl) {
    var arena = document.querySelector('.battle-arena');
    if (!arena) return;

    var beam = document.createElement('div');
    beam.className = 'move-rainbow-beam';
    beam.style.position = 'absolute';
    beam.style.left = '20%';
    beam.style.top = '45%';
    beam.style.width = '0';
    beam.style.height = '6px';
    beam.style.background = 'linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)';
    beam.style.borderRadius = '3px';
    beam.style.boxShadow = '0 0 15px rgba(255,215,0,0.8), 0 0 30px rgba(255,215,0,0.4)';
    beam.style.pointerEvents = 'none';
    beam.style.zIndex = '85';
    beam.style.opacity = '0.9';
    beam.style.transition = 'width 0.3s ease-out, opacity 0.2s ease-out';

    arena.appendChild(beam);

    // 光束延伸
    requestAnimationFrame(function() {
        beam.style.width = '60%';
    });

    // 淡出
    setTimeout(function() {
        beam.style.opacity = '0';
    }, 400);

    setTimeout(function() {
        if (beam.parentNode) beam.parentNode.removeChild(beam);
    }, 600);
};

/**
 * 全屏粒子散布（连击终结使用）
 */
BattleMode._spawnFullScreenParticles = function(particles, count) {
    var arena = document.querySelector('.battle-arena');
    if (!arena || !particles || particles.length === 0) return;

    for (var i = 0; i < count; i++) {
        (function(index) {
            var particle = document.createElement('div');
            particle.className = 'move-particle fullscreen';
            particle.textContent = particles[index % particles.length];

            // 随机起始位置（覆盖全屏）
            particle.style.position = 'absolute';
            particle.style.left = (Math.random() * 100) + '%';
            particle.style.top = (Math.random() * 100) + '%';
            particle.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '100';
            particle.style.opacity = '1';
            particle.style.transition = 'all 0.8s ease-out';

            arena.appendChild(particle);

            // 随机飞散
            var flyX = (Math.random() - 0.5) * 80;
            var flyY = -30 - Math.random() * 60;  // 向上飞

            requestAnimationFrame(function() {
                particle.style.transform = 'translate(' + flyX + 'px, ' + flyY + 'px) rotate(' + (Math.random() * 360) + 'deg)';
                particle.style.opacity = '0';
            });

            setTimeout(function() {
                if (particle.parentNode) particle.parentNode.removeChild(particle);
            }, 850);
        })(i);
    }
};

// =====================================================================
// 13. 设置全局变量
// =====================================================================

window.SpeedRankConfig = SpeedRankConfig;
window.SpeedRankDisplay = SpeedRankDisplay;
window.MovePool = MovePool;
