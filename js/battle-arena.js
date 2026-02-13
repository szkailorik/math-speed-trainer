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

// v17.0: Monster type-based arena themes - changes per monster!
const MonsterTypeThemes = {
    fire: {
        bg: 'linear-gradient(180deg, #1a0500 0%, #4a1500 25%, #8b2500 50%, #4a1a00 80%, #1a0800 100%)',
        ground: 'linear-gradient(180deg, #5a2000 0%, #3a1200 50%, #2a0a00 100%)',
        ambientColor: 'rgba(255, 100, 0, 0.08)',
        particles: ['🔥', '🌋', '💥', '✨'],
        ambientClass: 'arena-fire'
    },
    water: {
        bg: 'linear-gradient(180deg, #001a33 0%, #003366 25%, #004488 50%, #002244 80%, #001122 100%)',
        ground: 'linear-gradient(180deg, #003355 0%, #002244 50%, #001a33 100%)',
        ambientColor: 'rgba(0, 120, 255, 0.08)',
        particles: ['💧', '🌊', '🐚', '✨'],
        ambientClass: 'arena-water'
    },
    ice: {
        bg: 'linear-gradient(180deg, #0a1a2a 0%, #1a3a5a 25%, #2a5a7a 50%, #1a3a5a 80%, #0a1520 100%)',
        ground: 'linear-gradient(180deg, #3a6a8a 0%, #2a4a6a 50%, #1a3050 100%)',
        ambientColor: 'rgba(150, 220, 255, 0.1)',
        particles: ['❄️', '🧊', '💎', '✨'],
        ambientClass: 'arena-ice'
    },
    thunder: {
        bg: 'linear-gradient(180deg, #0a0a15 0%, #1a1a30 25%, #2a2040 50%, #1a1525 80%, #050510 100%)',
        ground: 'linear-gradient(180deg, #2a2540 0%, #1a1530 50%, #0a0a20 100%)',
        ambientColor: 'rgba(255, 220, 50, 0.06)',
        particles: ['⚡', '🌩️', '💛', '✨'],
        ambientClass: 'arena-thunder'
    },
    electric: {
        bg: 'linear-gradient(180deg, #0a0a15 0%, #1a1a30 25%, #2a2040 50%, #1a1525 80%, #050510 100%)',
        ground: 'linear-gradient(180deg, #2a2540 0%, #1a1530 50%, #0a0a20 100%)',
        ambientColor: 'rgba(255, 220, 50, 0.06)',
        particles: ['⚡', '🌩️', '💛', '✨'],
        ambientClass: 'arena-thunder'
    },
    grass: {
        bg: 'linear-gradient(180deg, #0a1a0a 0%, #1a3a1a 25%, #2a5a2a 50%, #1a3a1a 80%, #0a150a 100%)',
        ground: 'linear-gradient(180deg, #2a5a30 0%, #1a4020 50%, #0a2a10 100%)',
        ambientColor: 'rgba(100, 200, 80, 0.08)',
        particles: ['🍃', '🌿', '🌱', '✨'],
        ambientClass: 'arena-grass'
    },
    dark: {
        bg: 'linear-gradient(180deg, #050005 0%, #150520 25%, #200830 50%, #100520 80%, #050005 100%)',
        ground: 'linear-gradient(180deg, #1a0a2a 0%, #0a0515 50%, #050008 100%)',
        ambientColor: 'rgba(100, 0, 150, 0.08)',
        particles: ['🌑', '💀', '🦇', '👁️'],
        ambientClass: 'arena-dark'
    },
    demon: {
        bg: 'linear-gradient(180deg, #1a0005 0%, #3a0010 25%, #5a0020 50%, #3a0010 80%, #100005 100%)',
        ground: 'linear-gradient(180deg, #3a0015 0%, #2a000a 50%, #150005 100%)',
        ambientColor: 'rgba(200, 0, 50, 0.08)',
        particles: ['👹', '🔥', '💀', '⛓️'],
        ambientClass: 'arena-demon'
    },
    ghost: {
        bg: 'linear-gradient(180deg, #0a0515 0%, #1a1035 25%, #251845 50%, #1a1035 80%, #080510 100%)',
        ground: 'linear-gradient(180deg, #201540 0%, #150a2a 50%, #0a0518 100%)',
        ambientColor: 'rgba(150, 100, 255, 0.08)',
        particles: ['👻', '🕯️', '💜', '✨'],
        ambientClass: 'arena-ghost'
    },
    spirit: {
        bg: 'linear-gradient(180deg, #0a0520 0%, #1a1040 25%, #2a1855 50%, #1a1040 80%, #080515 100%)',
        ground: 'linear-gradient(180deg, #251845 0%, #1a1035 50%, #0a0520 100%)',
        ambientColor: 'rgba(180, 130, 255, 0.08)',
        particles: ['🌙', '✨', '💫', '🔮'],
        ambientClass: 'arena-spirit'
    },
    psychic: {
        bg: 'linear-gradient(180deg, #150520 0%, #2a1040 25%, #3a1555 50%, #2a1040 80%, #100515 100%)',
        ground: 'linear-gradient(180deg, #301550 0%, #201040 50%, #100525 100%)',
        ambientColor: 'rgba(250, 100, 200, 0.08)',
        particles: ['🔮', '💫', '🧠', '✨'],
        ambientClass: 'arena-psychic'
    },
    dragon: {
        bg: 'linear-gradient(180deg, #0a0020 0%, #1a0050 25%, #2a0080 50%, #1a0050 80%, #050015 100%)',
        ground: 'linear-gradient(180deg, #2a1060 0%, #1a0840 50%, #0a0525 100%)',
        ambientColor: 'rgba(100, 50, 255, 0.1)',
        particles: ['🐉', '💎', '⚡', '🔥'],
        ambientClass: 'arena-dragon'
    },
    ancient: {
        bg: 'linear-gradient(180deg, #0a0a0a 0%, #1a1515 25%, #2a2525 50%, #1a1515 80%, #080808 100%)',
        ground: 'linear-gradient(180deg, #2a2520 0%, #1a1a15 50%, #0a0a08 100%)',
        ambientColor: 'rgba(150, 130, 100, 0.08)',
        particles: ['🏛️', '⚱️', '🗿', '✨'],
        ambientClass: 'arena-ancient'
    },
    fairy: {
        bg: 'linear-gradient(180deg, #150a1a 0%, #2a1535 25%, #3a2050 50%, #2a1535 80%, #100815 100%)',
        ground: 'linear-gradient(180deg, #352050 0%, #251540 50%, #150a2a 100%)',
        ambientColor: 'rgba(255, 150, 200, 0.1)',
        particles: ['🌸', '🦋', '💖', '✨'],
        ambientClass: 'arena-fairy'
    },
    light: {
        bg: 'linear-gradient(180deg, #1a1500 0%, #2a2510 25%, #3a3520 50%, #2a2510 80%, #151000 100%)',
        ground: 'linear-gradient(180deg, #3a3525 0%, #2a2518 50%, #1a1a0a 100%)',
        ambientColor: 'rgba(255, 240, 100, 0.1)',
        particles: ['⭐', '🌟', '💛', '✨'],
        ambientClass: 'arena-light'
    },
    poison: {
        bg: 'linear-gradient(180deg, #0a050a 0%, #1a0a1a 25%, #2a102a 50%, #1a0a1a 80%, #080508 100%)',
        ground: 'linear-gradient(180deg, #2a152a 0%, #1a0a1a 50%, #0a050a 100%)',
        ambientColor: 'rgba(180, 0, 200, 0.08)',
        particles: ['☠️', '🧪', '💜', '🫧'],
        ambientClass: 'arena-poison'
    },
    steel: {
        bg: 'linear-gradient(180deg, #0a0a0f 0%, #1a1a25 25%, #2a2a3a 50%, #1a1a25 80%, #0a0a10 100%)',
        ground: 'linear-gradient(180deg, #2a2a3a 0%, #1a1a2a 50%, #0a0a15 100%)',
        ambientColor: 'rgba(180, 180, 210, 0.08)',
        particles: ['⚙️', '🔩', '💠', '✨'],
        ambientClass: 'arena-steel'
    },
    rock: {
        bg: 'linear-gradient(180deg, #100a05 0%, #2a1a10 25%, #3a2a1a 50%, #2a1a10 80%, #0a0805 100%)',
        ground: 'linear-gradient(180deg, #3a2a1a 0%, #2a1a10 50%, #1a1008 100%)',
        ambientColor: 'rgba(180, 150, 80, 0.06)',
        particles: ['🪨', '💎', '⛏️', '✨'],
        ambientClass: 'arena-rock'
    },
    earth: {
        bg: 'linear-gradient(180deg, #100a05 0%, #2a1a10 25%, #3a2a18 50%, #2a1a10 80%, #0a0805 100%)',
        ground: 'linear-gradient(180deg, #3a2a18 0%, #2a1a10 50%, #1a1008 100%)',
        ambientColor: 'rgba(180, 150, 80, 0.06)',
        particles: ['🪨', '🌍', '🏔️', '✨'],
        ambientClass: 'arena-earth'
    },
    ground: {
        bg: 'linear-gradient(180deg, #100a05 0%, #2a1810 25%, #3a2818 50%, #2a1810 80%, #0a0805 100%)',
        ground: 'linear-gradient(180deg, #3a2818 0%, #2a1810 50%, #1a1008 100%)',
        ambientColor: 'rgba(220, 190, 100, 0.06)',
        particles: ['🏜️', '🪨', '💨', '✨'],
        ambientClass: 'arena-earth'
    },
    fighting: {
        bg: 'linear-gradient(180deg, #1a0505 0%, #3a1515 25%, #5a2020 50%, #3a1515 80%, #150505 100%)',
        ground: 'linear-gradient(180deg, #4a2020 0%, #3a1515 50%, #2a0a0a 100%)',
        ambientColor: 'rgba(255, 80, 50, 0.08)',
        particles: ['💪', '🥊', '💥', '🔥'],
        ambientClass: 'arena-fighting'
    },
    wind: {
        bg: 'linear-gradient(180deg, #0a1515 0%, #152a2a 25%, #1a3a3a 50%, #152a2a 80%, #0a1010 100%)',
        ground: 'linear-gradient(180deg, #1a3535 0%, #152525 50%, #0a1515 100%)',
        ambientColor: 'rgba(100, 220, 180, 0.08)',
        particles: ['🌪️', '🍃', '💨', '☁️'],
        ambientClass: 'arena-wind'
    },
    flying: {
        bg: 'linear-gradient(180deg, #0a1525 0%, #1a2a4a 25%, #2a4070 50%, #1a2a4a 80%, #0a1020 100%)',
        ground: 'linear-gradient(180deg, #2a4060 0%, #1a2a45 50%, #0a1525 100%)',
        ambientColor: 'rgba(150, 180, 255, 0.08)',
        particles: ['☁️', '🌤️', '🪶', '✨'],
        ambientClass: 'arena-wind'
    },
    beast: {
        bg: 'linear-gradient(180deg, #0a0a05 0%, #1a1a0a 25%, #2a2510 50%, #1a1a0a 80%, #080805 100%)',
        ground: 'linear-gradient(180deg, #2a2515 0%, #1a1a0a 50%, #0a0a05 100%)',
        ambientColor: 'rgba(150, 120, 80, 0.08)',
        particles: ['🐾', '🌿', '🍂', '🦴'],
        ambientClass: 'arena-beast'
    },
    creature: {
        bg: 'linear-gradient(180deg, #050a05 0%, #0a1a0a 25%, #102a15 50%, #0a1a0a 80%, #050a05 100%)',
        ground: 'linear-gradient(180deg, #1a2a1a 0%, #0a1a0a 50%, #050a05 100%)',
        ambientColor: 'rgba(80, 180, 80, 0.08)',
        particles: ['🌳', '🍄', '🐾', '✨'],
        ambientClass: 'arena-grass'
    },
    wizard: {
        bg: 'linear-gradient(180deg, #0a0520 0%, #1a1050 25%, #2a1870 50%, #1a1050 80%, #080515 100%)',
        ground: 'linear-gradient(180deg, #251560 0%, #1a0a45 50%, #0a0525 100%)',
        ambientColor: 'rgba(100, 80, 255, 0.1)',
        particles: ['🪄', '📖', '⭐', '✨'],
        ambientClass: 'arena-psychic'
    },
    bug: {
        bg: 'linear-gradient(180deg, #0a0a05 0%, #1a2010 25%, #2a3018 50%, #1a2010 80%, #080a05 100%)',
        ground: 'linear-gradient(180deg, #2a3018 0%, #1a2010 50%, #0a0a05 100%)',
        ambientColor: 'rgba(150, 180, 50, 0.08)',
        particles: ['🐛', '🍃', '🌿', '🪲'],
        ambientClass: 'arena-grass'
    },
    normal: {
        bg: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 80%, #0a0a0a 100%)',
        ground: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        ambientColor: 'rgba(180, 180, 180, 0.06)',
        particles: ['⭐', '✨', '💫'],
        ambientClass: 'arena-normal'
    }
};

window.MonsterTypeThemes = MonsterTypeThemes;

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

    // Show type tag + apply type-based background
    this.showMonsterType(monster);
    this.applyMonsterTheme(monster);
};

// ===== v17.0: Type-based Arena Background =====

BattleMode.applyMonsterTheme = function(monster) {
    const arena = document.querySelector('.battle-arena');
    if (!arena || !monster) return;

    const typeTheme = MonsterTypeThemes[monster.type] || MonsterTypeThemes.normal;
    const ground = arena.querySelector('.arena-ground');

    // Smooth transition for background change
    arena.style.transition = 'background 0.8s ease';
    arena.style.background = typeTheme.bg;
    if (ground) {
        ground.style.transition = 'background 0.8s ease';
        ground.style.background = typeTheme.ground;
    }

    // Remove old ambient class, add new
    var allAmbientClasses = [
        'arena-fire', 'arena-water', 'arena-ice', 'arena-thunder',
        'arena-grass', 'arena-dark', 'arena-demon', 'arena-ghost',
        'arena-spirit', 'arena-psychic', 'arena-dragon', 'arena-ancient',
        'arena-fairy', 'arena-light', 'arena-poison', 'arena-steel',
        'arena-rock', 'arena-earth', 'arena-fighting', 'arena-wind',
        'arena-beast', 'arena-normal'
    ];
    allAmbientClasses.forEach(function(cls) { arena.classList.remove(cls); });
    if (typeTheme.ambientClass) {
        arena.classList.add(typeTheme.ambientClass);
    }

    // Ambient color overlay
    var ambientOverlay = arena.querySelector('.arena-ambient-overlay');
    if (!ambientOverlay) {
        ambientOverlay = document.createElement('div');
        ambientOverlay.className = 'arena-ambient-overlay';
        arena.insertBefore(ambientOverlay, arena.firstChild);
    }
    ambientOverlay.style.background = typeTheme.ambientColor || 'transparent';

    // Spawn floating ambient particles
    this._spawnAmbientParticles(arena, typeTheme.particles || ['✨']);
};

// Spawn floating ambient particles in the arena background
BattleMode._spawnAmbientParticles = function(arena, particles) {
    // Remove old ambient particles
    arena.querySelectorAll('.arena-ambient-particle').forEach(function(el) { el.remove(); });

    // Create 6-8 floating particles at random positions
    var count = 6 + Math.floor(Math.random() * 3);
    for (var i = 0; i < count; i++) {
        var particle = document.createElement('div');
        particle.className = 'arena-ambient-particle';
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        particle.style.left = (5 + Math.random() * 90) + '%';
        particle.style.top = (5 + Math.random() * 75) + '%';
        particle.style.animationDelay = (Math.random() * 4) + 's';
        particle.style.animationDuration = (3 + Math.random() * 4) + 's';
        particle.style.fontSize = (10 + Math.random() * 8) + 'px';
        particle.style.opacity = (0.15 + Math.random() * 0.25).toString();
        arena.appendChild(particle);
    }
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
    // v16.2: Apply state to hero-char-layer (primary) when hero-layers exists,
    // and also to hero-emoji (fallback)
    const stateClasses = ['hero-idle', 'hero-attack', 'hero-cast_spell', 'hero-hit', 'hero-heal', 'hero-victory', 'hero-defeat'];

    const charLayer = document.querySelector('.hero-char-layer');
    if (charLayer) {
        charLayer.classList.remove(...stateClasses);
        charLayer.classList.add('hero-' + state);
    }

    const heroEmoji = document.querySelector('.hero-emoji');
    if (heroEmoji) {
        heroEmoji.classList.remove(...stateClasses);
        heroEmoji.classList.add('hero-' + state);
    }
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

    // v16.2: Remove hero layers and restore original hero-emoji
    const heroLayers = document.querySelector('.hero-layers');
    if (heroLayers) heroLayers.remove();
    const originalEmoji = document.querySelector('.hero-emoji');
    if (originalEmoji) originalEmoji.style.display = '';

    // Reset hero state
    this.setHeroState('idle');

    // Reset enemy state
    const enemyEmoji = document.getElementById('monster-emoji');
    if (enemyEmoji) {
        enemyEmoji.className = 'monster-emoji';
    }
};
