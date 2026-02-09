/**
 * monster-behavior.js - Monster intelligent behavior state machine
 * 9 behaviors: dodge, taunt, enrage, fear, defend, summon, escape, selfDestruct, heal
 */

// Default behaviors by monster type
const DefaultBehaviors = {
    ghost: ['taunt', 'dodge'],
    dark: ['taunt', 'enrage'],
    poison: ['taunt', 'selfDestruct'],
    fire: ['enrage', 'selfDestruct'],
    ice: ['defend', 'fear'],
    psychic: ['dodge', 'fear'],
    fairy: ['heal', 'fear'],
    dragon: ['enrage', 'defend'],
    fighting: ['enrage', 'taunt'],
    electric: ['dodge', 'taunt'],
    water: ['heal', 'dodge'],
    bug: ['dodge', 'escape'],
    rock: ['defend', 'enrage'],
    steel: ['defend', 'enrage'],
    flying: ['dodge', 'escape'],
    ground: ['defend', 'taunt'],
    normal: ['taunt'],
    // Extended types from monster files
    earth: ['defend', 'taunt'],
    wind: ['dodge', 'escape'],
    thunder: ['enrage', 'dodge'],
    light: ['heal', 'fear'],
    beast: ['enrage', 'taunt'],
    spirit: ['heal', 'dodge'],
    ancient: ['defend', 'enrage'],
    demon: ['enrage', 'taunt', 'selfDestruct'],
    creature: ['dodge', 'fear'],
    wizard: ['defend', 'heal']
};

// Default quips for each behavior type
const DefaultQuips = {
    taunt: ['哈哈~太弱了!', '就这？', '再来啊~', '你不行的~'],
    fear: ['好...好厉害...', '不要过来!', '救命啊!', '太强了吧...'],
    death: ['下次不会输的...', '记住我!', '可恶...', '我会回来的!'],
    enter: ['来挑战我吧!', '你准备好了吗?', '战斗开始!', '看我的厉害!'],
    enrage: ['可恶!!', '我生气了!', '不会放过你!', '啊啊啊!!'],
    dodge: ['闪!', '太慢了~', '没打中~', '嘿嘿~'],
    defend: ['挡!', '别想过来!', '铜墙铁壁!', '打不穿的!'],
    summon: ['小的们！上！', '援军来了！', '别想单挑！'],
    escape: ['溜了溜了~', '跑路啦~', '三十六计走为上~', '拜拜~'],
    selfDestruct: ['同归于尽!', '一起走吧!', '爆炸!', '砰!!!'],
    heal: ['回复!', '好多了~', '治愈之力!', '续上一口!']
};

window.DefaultBehaviors = DefaultBehaviors;
window.DefaultQuips = DefaultQuips;

// ===== Get monster's available behaviors =====

BattleMode.getMonsterBehaviors = function(monster) {
    if (!monster) return [];
    if (monster.behaviors && monster.behaviors.length > 0) {
        return monster.behaviors;
    }
    return DefaultBehaviors[monster.type] || ['taunt'];
};

// ===== Get quips for a behavior =====

BattleMode.getBehaviorQuips = function(monster, behaviorType) {
    if (!monster) return DefaultQuips[behaviorType] || ['...'];

    const quipMap = {
        taunt: monster.tauntQuips,
        fear: monster.fearQuips,
        death: monster.deathQuips,
        enter: monster.enterQuips,
        enrage: monster.enrageQuips,
        dodge: monster.dodgeQuips,
        defend: monster.defendQuips,
        summon: monster.summonQuips,
        escape: monster.escapeQuips,
        selfDestruct: monster.selfDestructQuips,
        heal: monster.healQuips
    };

    return quipMap[behaviorType] || DefaultQuips[behaviorType] || ['...'];
};

// ===== Check Behavior Trigger =====
// phase: 'afterCorrect' | 'afterWrong' | 'onDeath' | 'hpThreshold' | 'comboThreshold' | 'turnInterval'
// Returns: { behavior, triggered } or null

BattleMode.checkBehaviorTrigger = function(phase, context) {
    const battle = App.battle;
    const monster = battle.currentMonster;
    if (!monster) return null;

    const behaviors = this.getMonsterBehaviors(monster);
    const hpPercent = battle.monsterHP / battle.monsterMaxHP;

    // Priority order: dodge > defend > enrage > fear > taunt > heal > summon > escape > selfDestruct
    const priorityOrder = ['dodge', 'defend', 'enrage', 'fear', 'taunt', 'heal', 'summon', 'escape', 'selfDestruct'];

    for (const behavior of priorityOrder) {
        if (!behaviors.includes(behavior) && !this._isBossBehavior(monster, behavior)) continue;

        const shouldTrigger = this._checkBehaviorCondition(behavior, phase, monster, battle, hpPercent, context);
        if (shouldTrigger) {
            return { behavior: behavior, triggered: true };
        }
    }

    return null;
};

// Check if boss has innate behaviors
BattleMode._isBossBehavior = function(monster, behavior) {
    if (!monster || monster.hp < 8) return false; // Not a boss
    // Bosses always have defend and summon
    if (behavior === 'defend' || behavior === 'summon') return true;
    return false;
};

// Check specific behavior conditions
BattleMode._checkBehaviorCondition = function(behavior, phase, monster, battle, hpPercent, context) {
    switch (behavior) {
        case 'dodge':
            // After correct answer, 15% chance for tricky monsters
            if (phase !== 'afterCorrect') return false;
            if (battle.dodged) return false; // Max once per monster
            return Math.random() < 0.15;

        case 'taunt':
            // After wrong answer
            if (phase !== 'afterWrong') return false;
            return Math.random() < 0.6; // 60% chance to taunt

        case 'enrage':
            // HP below 50%, triggers once
            if (phase !== 'hpThreshold') return false;
            if (battle.monsterEnraged) return false;
            return hpPercent <= 0.5 && hpPercent > 0;

        case 'fear':
            // Player combo >= 5
            if (phase !== 'comboThreshold') return false;
            return battle.combo >= 5 && Math.random() < 0.4;

        case 'defend':
            // Boss every 3 turns
            if (phase !== 'turnInterval') return false;
            if (monster.hp < 8) return false; // Boss only
            return battle.turnCount > 0 && battle.turnCount % 3 === 0;

        case 'summon':
            // Boss HP < 30%, trigger once
            if (phase !== 'hpThreshold') return false;
            if (monster.hp < 8) return false;
            if (battle.summonActive) return false;
            return hpPercent <= 0.3 && hpPercent > 0;

        case 'escape':
            // Easy monster HP = 1, 30% chance
            if (phase !== 'hpThreshold') return false;
            if (battle.difficulty !== 'easy') return false;
            if (battle.escapePending) return false;
            return battle.monsterHP === 1 && Math.random() < 0.3;

        case 'selfDestruct':
            // Poison/fire type on death
            if (phase !== 'onDeath') return false;
            return (monster.type === 'poison' || monster.type === 'fire' || monster.type === 'demon');

        case 'heal':
            // Fairy/spirit type every 5 turns
            if (phase !== 'turnInterval') return false;
            return battle.turnCount > 0 && battle.turnCount % 5 === 0;
    }
    return false;
};

// ===== Execute Behavior =====

BattleMode.executeBehavior = function(behavior, callback) {
    switch (behavior) {
        case 'dodge': this.executeDodge(callback); break;
        case 'taunt': this.executeTaunt(callback); break;
        case 'enrage': this.executeEnrage(callback); break;
        case 'fear': this.executeFear(callback); break;
        case 'defend': this.executeDefend(callback); break;
        case 'summon': this.executeSummon(callback); break;
        case 'escape': this.executeEscape(callback); break;
        case 'selfDestruct': this.executeSelfDestruct(callback); break;
        case 'heal': this.executeHeal(callback); break;
        default: if (callback) callback(); break;
    }
};

// ===== Dodge =====
BattleMode.executeDodge = function(cb) {
    const battle = App.battle;
    const monster = battle.currentMonster;
    battle.dodged = true;

    playSound('dodge');
    this.setEnemyState('dodge');

    const quips = this.getBehaviorQuips(monster, 'dodge');
    const quip = quips[Math.floor(Math.random() * quips.length)];

    const enemyEmoji = document.getElementById('monster-emoji');
    this.showSpeechBubble(enemyEmoji, quip, 1000);
    this.showBattleFeedback(false, '💨 闪避! 伤害无效!');

    setTimeout(() => {
        this.setEnemyState('idle');
        if (cb) cb({ dodged: true });
    }, 1000);
};

// ===== Taunt =====
BattleMode.executeTaunt = function(cb) {
    const monster = App.battle.currentMonster;

    this.setEnemyState('threaten');

    const quips = this.getBehaviorQuips(monster, 'taunt');
    const quip = quips[Math.floor(Math.random() * quips.length)];

    const enemyEmoji = document.getElementById('monster-emoji');
    this.showSpeechBubble(enemyEmoji, quip, 1200);

    setTimeout(() => {
        this.setEnemyState('idle');
        if (cb) cb();
    }, 1200);
};

// ===== Enrage =====
BattleMode.executeEnrage = function(cb) {
    const battle = App.battle;
    const monster = battle.currentMonster;
    battle.monsterEnraged = true;

    playSound('enrage');
    this.setEnemyState('enrage');

    const quips = this.getBehaviorQuips(monster, 'enrage');
    const quip = quips[Math.floor(Math.random() * quips.length)];

    const enemyEmoji = document.getElementById('monster-emoji');
    this.showSpeechBubble(enemyEmoji, quip, 1500);

    this.showBattleFeedback(false, '😡 怪物愤怒了! 攻击+1');

    setTimeout(() => {
        // Stay in enraged visual state
        if (cb) cb();
    }, 1500);
};

// ===== Fear =====
BattleMode.executeFear = function(cb) {
    const monster = App.battle.currentMonster;

    this.setEnemyState('fear');

    const quips = this.getBehaviorQuips(monster, 'fear');
    const quip = quips[Math.floor(Math.random() * quips.length)];

    const enemyEmoji = document.getElementById('monster-emoji');
    this.showSpeechBubble(enemyEmoji, quip, 1200);
    this.showBattleFeedback(true, '😰 怪物害怕了!');

    setTimeout(() => {
        this.setEnemyState('idle');
        if (cb) cb();
    }, 1200);
};

// ===== Defend =====
BattleMode.executeDefend = function(cb) {
    const battle = App.battle;
    const monster = battle.currentMonster;
    battle.monsterDefending = true;

    playSound('defend');
    this.setEnemyState('defend');

    const quips = this.getBehaviorQuips(monster, 'defend');
    const quip = quips[Math.floor(Math.random() * quips.length)];

    const enemyEmoji = document.getElementById('monster-emoji');
    this.showSpeechBubble(enemyEmoji, '🛡️ ' + quip, 1200);
    this.showBattleFeedback(false, '🛡️ 防御姿态! 伤害减半!');

    setTimeout(() => {
        if (cb) cb();
    }, 1200);
};

// ===== Summon =====
BattleMode.executeSummon = function(cb) {
    const battle = App.battle;
    const monster = battle.currentMonster;
    battle.summonActive = true;

    playSound('summon');

    const quips = this.getBehaviorQuips(monster, 'summon');
    const quip = quips[Math.floor(Math.random() * quips.length)];

    const enemyEmoji = document.getElementById('monster-emoji');
    this.showSpeechBubble(enemyEmoji, quip, 1500);
    this.showBattleFeedback(false, '👾 召唤小弟! 需要额外答题!');

    // Create summon visual effect
    const arena = document.querySelector('.battle-arena');
    if (arena) {
        const summonEl = document.createElement('div');
        summonEl.className = 'summon-minion';
        summonEl.textContent = '👾';
        arena.appendChild(summonEl);
        setTimeout(() => summonEl.remove(), 2000);
    }

    setTimeout(() => {
        if (cb) cb({ summonActive: true });
    }, 1500);
};

// ===== Escape =====
BattleMode.executeEscape = function(cb) {
    const battle = App.battle;
    const monster = battle.currentMonster;
    battle.escapePending = true;

    const quips = this.getBehaviorQuips(monster, 'escape');
    const quip = quips[Math.floor(Math.random() * quips.length)];

    const enemyEmoji = document.getElementById('monster-emoji');
    this.showSpeechBubble(enemyEmoji, quip, 1500);
    this.showBattleFeedback(false, '🏃 怪物想逃跑! 答对下题阻止!');

    // Visual: monster turns away
    if (enemyEmoji) {
        enemyEmoji.style.transform = 'scaleX(-1)';
    }

    setTimeout(() => {
        if (cb) cb({ escapePending: true });
    }, 1500);
};

// ===== Self Destruct =====
BattleMode.executeSelfDestruct = function(cb) {
    const battle = App.battle;
    const monster = battle.currentMonster;

    const quips = this.getBehaviorQuips(monster, 'selfDestruct');
    const quip = quips[Math.floor(Math.random() * quips.length)];

    const enemyEmoji = document.getElementById('monster-emoji');
    this.showSpeechBubble(enemyEmoji, quip, 1000);

    setTimeout(() => {
        // Check if shield blocks
        if (battle.shield > 0) {
            battle.shield--;
            this.showBattleFeedback(true, '🛡️ 护盾挡住了自爆!');
            playSound('defend');
            battle.survivedSelfDestruct++;
        } else {
            battle.playerHP = Math.max(0, battle.playerHP - 1);
            battle.noDamageTaken = false;
            this.showBattleFeedback(false, '💥 自爆! -1 HP');

            const screenFlash = document.getElementById('screen-flash');
            if (screenFlash) {
                screenFlash.classList.add('show');
                setTimeout(() => screenFlash.classList.remove('show'), 300);
            }

            playSound('hit');
            battle.survivedSelfDestruct++;
        }

        this.updateUI();

        if (cb) cb({ selfDestructed: true });
    }, 1000);
};

// ===== Heal =====
BattleMode.executeHeal = function(cb) {
    const battle = App.battle;
    const monster = battle.currentMonster;

    const quips = this.getBehaviorQuips(monster, 'heal');
    const quip = quips[Math.floor(Math.random() * quips.length)];

    const enemyEmoji = document.getElementById('monster-emoji');
    this.showSpeechBubble(enemyEmoji, '💚 ' + quip, 1200);

    // Heal 1 HP (not exceeding max)
    const healAmount = 1;
    battle.monsterHP = Math.min(battle.monsterMaxHP, battle.monsterHP + healAmount);

    this.showBattleFeedback(false, '💚 怪物回复了 ' + healAmount + ' HP!');
    this.updateUI();

    // Green glow effect on enemy
    if (enemyEmoji) {
        enemyEmoji.classList.add('healing');
        setTimeout(() => enemyEmoji.classList.remove('healing'), 1000);
    }

    setTimeout(() => {
        if (cb) cb();
    }, 1200);
};

// ===== Reset behavior state for new monster =====
BattleMode.resetBehaviorState = function() {
    const battle = App.battle;
    battle.turnCount = 0;
    battle.monsterEnraged = false;
    battle.monsterDefending = false;
    battle.escapePending = false;
    battle.summonActive = false;
    battle.dodged = false;
    battle.noDamageOnCurrentMonster = true;
};
