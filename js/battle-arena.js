/**
 * battle-arena.js - Third-person battle arena rendering + hero/enemy animation system
 */

// Arena theme configurations per module
const ArenaThemes = {
    xiaojiujiu: {
        name: '魔法城堡',
        bg: 'linear-gradient(180deg, #1a0533 0%, #2d1b69 40%, #1a1a2e 100%)',
        ground: 'linear-gradient(180deg, #3d2b5a 0%, #2a1a4a 100%)',
        particles: ['✨', '⭐', '💫']
    },
    fraction: {
        name: '山海秘境',
        bg: 'linear-gradient(180deg, #0a2e1f 0%, #1a4a3a 40%, #0d3320 100%)',
        ground: 'linear-gradient(180deg, #2a5a40 0%, #1a3a2a 100%)',
        particles: ['🍃', '🌿', '🪨']
    },
    decimal: {
        name: '云海仙境',
        bg: 'linear-gradient(180deg, #1a2a4a 0%, #2a4a7a 40%, #1a3a6a 100%)',
        ground: 'linear-gradient(180deg, #3a5a8a 0%, #2a4a6a 100%)',
        particles: ['☁️', '🌤️', '✨']
    },
    unit: {
        name: '商周殿堂',
        bg: 'linear-gradient(180deg, #3a1a0a 0%, #5a2a1a 40%, #2a1505 100%)',
        ground: 'linear-gradient(180deg, #6a3a2a 0%, #4a2a1a 100%)',
        particles: ['🏛️', '⚱️', '🔥']
    },
    multiply: {
        name: '月夜古宅',
        bg: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 40%, #0a0a2a 100%)',
        ground: 'linear-gradient(180deg, #2a2a4a 0%, #1a1a3a 100%)',
        particles: ['🌙', '👻', '🕯️']
    },
    times: {
        name: '魔法走廊',
        bg: 'linear-gradient(180deg, #1a0a2a 0%, #2a1a4a 40%, #1a0a3a 100%)',
        ground: 'linear-gradient(180deg, #3a2a5a 0%, #2a1a4a 100%)',
        particles: ['🪄', '⚡', '🌟']
    }
};

window.ArenaThemes = ArenaThemes;

// ===== Arena Initialization =====

BattleMode.initArena = function() {
    const arena = document.querySelector('.battle-arena');
    if (!arena) return;

    // Set theme
    const theme = ArenaThemes[App.battle.module] || ArenaThemes.xiaojiujiu;
    arena.style.background = theme.bg;

    const ground = arena.querySelector('.arena-ground');
    if (ground) ground.style.background = theme.ground;

    // Set hero name
    const heroName = arena.querySelector('.hero-name');
    if (heroName) {
        const user = UserManager.getCurrentUser();
        heroName.textContent = user ? user.name : '勇者';
    }

    // Set hero emoji
    const heroEmoji = arena.querySelector('.hero-emoji');
    if (heroEmoji) {
        heroEmoji.textContent = '🧙';
        heroEmoji.className = 'hero-emoji hero-idle';
    }

    // Reset enemy state
    const enemyEmoji = document.getElementById('monster-emoji');
    if (enemyEmoji) {
        enemyEmoji.className = 'monster-emoji enemy-idle';
    }
};

// ===== Update Arena Positions =====

BattleMode.updateArenaPositions = function() {
    const battle = App.battle;
    const monster = battle.currentMonster;
    if (!monster) return;

    // Update monster emoji and name (reusing existing IDs)
    const monsterEmoji = document.getElementById('monster-emoji');
    const monsterName = document.getElementById('monster-name');

    if (monsterEmoji) {
        monsterEmoji.textContent = monster.emoji;
        monsterEmoji.className = 'monster-emoji enemy-idle';
        monsterEmoji.style.fontSize = this.getEnemySize(monster);
    }

    if (monsterName) {
        monsterName.textContent = monster.name;
    }

    // Update HP displays
    this.updateUI();

    // Show type tag
    this.showMonsterType(monster);
};

// ===== Hero Attack Animation =====

BattleMode.heroAttackAnimation = function(weapon, callback) {
    const heroEmoji = document.querySelector('.hero-emoji');
    const weaponLayer = document.querySelector('.hero-weapon-layer');
    if (!heroEmoji) {
        if (callback) callback();
        return;
    }

    // Phase 1: Raise weapon (0.2s)
    if (weaponLayer) {
        weaponLayer.textContent = weapon.emoji;
        weaponLayer.classList.add('weapon-raise');
    }
    this.setHeroState('cast_spell');

    setTimeout(() => {
        // Phase 2: Swing weapon (0.3s)
        if (weaponLayer) {
            weaponLayer.classList.remove('weapon-raise');
            weaponLayer.classList.add('weapon-swing');
        }
        this.fireWeaponHorizontal(weapon);

        setTimeout(() => {
            if (weaponLayer) weaponLayer.classList.remove('weapon-swing');
            this.setHeroState('idle');
            if (callback) callback();
        }, 400);
    }, 200);
};

// ===== Hero Hit Animation =====

BattleMode.heroHitAnimation = function(callback) {
    const heroEmoji = document.querySelector('.hero-emoji');
    if (!heroEmoji) {
        if (callback) callback();
        return;
    }

    this.setHeroState('hit');

    setTimeout(() => {
        this.setHeroState('idle');
        if (callback) callback();
    }, 400);
};

// ===== Enemy Enter Animation =====

BattleMode.enemyEnterAnimation = function(monster, callback) {
    const enemyEmoji = document.getElementById('monster-emoji');
    const enemySide = document.querySelector('.enemy-side');
    if (!enemyEmoji || !enemySide) {
        if (callback) callback();
        return;
    }

    // Start offscreen
    enemySide.classList.add('entering');
    enemyEmoji.textContent = monster.emoji;
    enemyEmoji.style.fontSize = this.getEnemySize(monster);

    // Slide in
    setTimeout(() => {
        enemySide.classList.remove('entering');
        enemySide.classList.add('entered');
    }, 50);

    // Show enter quip
    const enterQuips = monster.enterQuips || ['来挑战我吧!', '你准备好了吗?', '战斗开始!'];
    const quip = enterQuips[Math.floor(Math.random() * enterQuips.length)];

    setTimeout(() => {
        this.showSpeechBubble(enemyEmoji, quip, 1200);
        enemySide.classList.remove('entered');
    }, 500);

    setTimeout(() => {
        this.setEnemyState('idle');
        if (callback) callback();
    }, 1800);
};

// ===== Enemy Hit Animation =====

BattleMode.enemyHitAnimation = function(callback) {
    this.setEnemyState('hit');

    setTimeout(() => {
        this.setEnemyState('idle');
        if (callback) callback();
    }, 400);
};

// ===== Enemy Attack Animation =====

BattleMode.enemyAttackAnimation = function(monster, callback) {
    const enemyEmoji = document.getElementById('monster-emoji');
    if (!enemyEmoji) {
        if (callback) callback();
        return;
    }

    this.setEnemyState('attack');

    // Create attack projectile flying right to left
    const enemySide = document.querySelector('.enemy-side');
    const heroSide = document.querySelector('.hero-side');

    if (enemySide && heroSide) {
        const attackEl = document.createElement('div');
        attackEl.className = 'arena-attack-projectile enemy-projectile';
        attackEl.textContent = monster?.attack || '💥';

        const arena = document.querySelector('.battle-arena');
        if (arena) {
            arena.appendChild(attackEl);

            // Animate from right to left
            requestAnimationFrame(() => {
                attackEl.classList.add('fly');
            });

            setTimeout(() => {
                attackEl.remove();
            }, 600);
        }
    }

    setTimeout(() => {
        this.setEnemyState('idle');
        if (callback) callback();
    }, 500);
};

// ===== Speech Bubble =====

BattleMode.showSpeechBubble = function(targetEl, text, duration) {
    if (!targetEl) return;

    // Remove existing bubble
    const existing = targetEl.parentElement?.querySelector('.speech-bubble');
    if (existing) existing.remove();

    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble';
    bubble.textContent = text;

    const parent = targetEl.parentElement;
    if (parent) {
        parent.appendChild(bubble);

        requestAnimationFrame(() => {
            bubble.classList.add('show');
        });

        setTimeout(() => {
            bubble.classList.remove('show');
            setTimeout(() => bubble.remove(), 300);
        }, duration || 2000);
    }
};

// ===== Hero State Management =====

BattleMode.setHeroState = function(state) {
    const heroEmoji = document.querySelector('.hero-emoji');
    if (!heroEmoji) return;

    // Remove all state classes
    heroEmoji.classList.remove('hero-idle', 'hero-attack', 'hero-cast_spell', 'hero-hit', 'hero-heal', 'hero-victory', 'hero-defeat');

    // Add new state
    heroEmoji.classList.add('hero-' + state);
};

// ===== Enemy State Management =====

BattleMode.setEnemyState = function(state) {
    const enemyEmoji = document.getElementById('monster-emoji');
    if (!enemyEmoji) return;

    // Remove all state classes
    enemyEmoji.classList.remove('enemy-idle', 'enemy-hit', 'enemy-attack', 'enemy-threaten', 'enemy-weak', 'enemy-enrage', 'enemy-death', 'enemy-dodge', 'enemy-defend', 'enemy-fear', 'enemy-charge');

    // Add new state
    enemyEmoji.classList.add('enemy-' + state);
};

// ===== Get Enemy Size =====

BattleMode.getEnemySize = function(monster) {
    if (!monster) return '4rem';
    const hp = monster.hp || 3;
    if (hp >= 8) return '5rem';   // Boss
    if (hp >= 6) return '4.5rem'; // Hard
    if (hp >= 4) return '4rem';   // Normal
    return '3.5rem';              // Easy
};

// ===== Horizontal Weapon Fire =====

BattleMode.fireWeaponHorizontal = function(weapon) {
    const arena = document.querySelector('.battle-arena');
    if (!arena) return;

    const weaponEl = document.createElement('div');
    weaponEl.className = 'arena-attack-projectile hero-projectile';
    weaponEl.textContent = weapon.emoji;

    if (weapon.color) {
        weaponEl.style.filter = `drop-shadow(0 0 8px ${weapon.color})`;
    }

    arena.appendChild(weaponEl);

    requestAnimationFrame(() => {
        weaponEl.classList.add('fly');
    });

    // Create trail particles
    if (typeof createWeaponTrail === 'function') {
        createWeaponTrail(weapon.color || '#ffaa00');
    }

    setTimeout(() => weaponEl.remove(), 600);
};

// ===== Cleanup Arena =====

BattleMode.cleanupArena = function() {
    // Remove speech bubbles
    document.querySelectorAll('.speech-bubble').forEach(el => el.remove());

    // Remove projectiles
    document.querySelectorAll('.arena-attack-projectile').forEach(el => el.remove());

    // v16.2: Remove hero layers
    const heroLayers = document.querySelector('.hero-layers');
    if (heroLayers) heroLayers.remove();

    // Reset hero state
    this.setHeroState('idle');

    // Reset enemy state
    const enemyEmoji = document.getElementById('monster-emoji');
    if (enemyEmoji) {
        enemyEmoji.className = 'monster-emoji';
    }
};
