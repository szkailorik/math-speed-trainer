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

// ===== v17.1: Scene-based Arena Background System =====

// All scene type names for class cleanup
var _allSceneTypes = [
    'fire', 'water', 'ice', 'thunder', 'electric', 'grass',
    'dark', 'demon', 'ghost', 'spirit', 'psychic', 'dragon',
    'ancient', 'fairy', 'light', 'poison', 'steel', 'rock',
    'earth', 'ground', 'fighting', 'wind', 'flying', 'beast',
    'creature', 'wizard', 'bug', 'normal'
];

// Map aliased types to canonical scene names
var _sceneTypeMap = {
    electric: 'thunder',
    ground: 'rock',
    earth: 'rock',
    flying: 'wind'
};

// v18.0: All mood filter class names for cleanup
var _allMoodClasses = [
    'mood-fire', 'mood-water', 'mood-ice', 'mood-thunder',
    'mood-grass', 'mood-dark', 'mood-demon', 'mood-ghost',
    'mood-spirit', 'mood-psychic', 'mood-dragon', 'mood-ancient',
    'mood-fairy', 'mood-light', 'mood-poison', 'mood-steel',
    'mood-rock', 'mood-fighting', 'mood-wind', 'mood-beast',
    'mood-creature', 'mood-wizard', 'mood-bug', 'mood-normal'
];

BattleMode.applyMonsterTheme = function(monster) {
    var arena = document.querySelector('.battle-arena');
    if (!arena || !monster) return;

    var monsterType = monster.type || 'normal';
    var sceneType = _sceneTypeMap[monsterType] || monsterType;
    var sceneClass = sceneType + '-scene';

    // v18.0: Get all 8 scene layers
    var sky = arena.querySelector('.scene-sky');
    var stars = arena.querySelector('.scene-stars');
    var far = arena.querySelector('.scene-far');
    var farDetail = arena.querySelector('.scene-far-detail');
    var mid = arena.querySelector('.scene-mid');
    var midDetail = arena.querySelector('.scene-mid-detail');
    var effects = arena.querySelector('.scene-effects');
    var atmosphere = arena.querySelector('.scene-atmosphere');
    var layers = [sky, stars, far, farDetail, mid, midDetail, effects, atmosphere];

    // Remove old scene classes from all layers
    layers.forEach(function(layer) {
        if (!layer) return;
        _allSceneTypes.forEach(function(t) {
            var cls = (_sceneTypeMap[t] || t) + '-scene';
            layer.classList.remove(cls);
        });
        layer.classList.remove('scene-entering');
    });

    // Apply new scene class + enter animation
    layers.forEach(function(layer) {
        if (!layer) return;
        layer.classList.add(sceneClass);
        layer.classList.add('scene-entering');
    });

    // Also update arena background from MonsterTypeThemes (base gradient)
    var typeTheme = MonsterTypeThemes[monsterType] || MonsterTypeThemes.normal;
    arena.style.transition = 'background 0.8s ease';
    arena.style.background = typeTheme.bg;
    var ground = arena.querySelector('.arena-ground');
    if (ground) {
        ground.style.transition = 'background 0.8s ease';
        ground.style.background = typeTheme.ground;
    }

    // v18.0: Apply mood filter
    _allMoodClasses.forEach(function(cls) { arena.classList.remove(cls); });
    arena.classList.add('mood-' + sceneType);

    // Update monster aura
    this._updateMonsterAura(monster, sceneType);

    // Remove old ambient overlay and particles (replaced by scene layers)
    var oldOverlay = arena.querySelector('.arena-ambient-overlay');
    if (oldOverlay) oldOverlay.remove();
    arena.querySelectorAll('.arena-ambient-particle').forEach(function(el) { el.remove(); });

    // Remove old arena-* ambient classes
    var oldAmbientClasses = [
        'arena-fire', 'arena-water', 'arena-ice', 'arena-thunder',
        'arena-grass', 'arena-dark', 'arena-demon', 'arena-ghost',
        'arena-spirit', 'arena-psychic', 'arena-dragon', 'arena-ancient',
        'arena-fairy', 'arena-light', 'arena-poison', 'arena-steel',
        'arena-rock', 'arena-earth', 'arena-fighting', 'arena-wind',
        'arena-beast', 'arena-normal'
    ];
    oldAmbientClasses.forEach(function(cls) { arena.classList.remove(cls); });

    // v17.1.1: Spawn dynamic scene elements
    this._spawnSceneElements(sceneType);
};

// Update monster aura glow under the monster
BattleMode._updateMonsterAura = function(monster, sceneType) {
    var aura = document.getElementById('monster-aura');
    if (!aura) return;

    // Remove old aura classes
    _allSceneTypes.forEach(function(t) {
        var cls = 'aura-' + (_sceneTypeMap[t] || t);
        aura.classList.remove(cls);
    });
    aura.classList.remove('aura-boss');

    // Apply new aura class
    aura.className = 'monster-aura aura-' + sceneType;

    // Boss enhancement: bigger + brighter aura
    if (monster.hp >= 8 || monster.isBoss) {
        aura.classList.add('aura-boss');
    }

    aura.style.display = 'block';
};

// ===== v17.1.1: Dynamic Scene Element Spawner =====

var SceneElementConfigs = {
    fire: [
        { emoji: '🔥', anim: 'float-up', x: '10%', bottom: 5, size: 22, opacity: 0.35, delay: 0, duration: 5 },
        { emoji: '🔥', anim: 'float-up', x: '50%', bottom: 2, size: 18, opacity: 0.3, delay: 1.5, duration: 6 },
        { emoji: '🔥', anim: 'float-up', x: '85%', bottom: 8, size: 24, opacity: 0.25, delay: 3, duration: 4.5 },
        { emoji: '🌋', anim: 'pulse', x: '75%', bottom: 3, size: 26, opacity: 0.2, delay: 0.5, duration: 7 },
        { emoji: '💥', anim: 'flicker', x: '30%', y: '40%', size: 16, opacity: 0.3, delay: 2, duration: 3.5 },
        { type: 'glow', x: '0', bottom: 0, width: '100%', height: '30%', color: 'rgba(255,80,0,0.25)', gradientPos: 'center bottom', blur: 12, opacity: 0.4, delay: 0, duration: 8, anim: 'pulse' },
        { type: 'glow', x: '70%', y: '30%', width: '40%', height: '50%', color: 'rgba(255,60,0,0.12)', gradientPos: 'center center', blur: 20, opacity: 0.25, delay: 1, duration: 6, anim: 'shimmer' }
    ],
    water: [
        { emoji: '🌊', anim: 'wave', x: '5%', bottom: 10, size: 24, opacity: 0.3, delay: 0, duration: 6 },
        { emoji: '🌊', anim: 'wave', x: '60%', bottom: 6, size: 20, opacity: 0.25, delay: 2, duration: 7 },
        { emoji: '💧', anim: 'float-up', x: '25%', bottom: 0, size: 16, opacity: 0.35, delay: 0.5, duration: 8 },
        { emoji: '💧', anim: 'float-up', x: '70%', bottom: 3, size: 14, opacity: 0.3, delay: 3, duration: 9 },
        { emoji: '🐚', anim: 'sway', x: '45%', bottom: 5, size: 18, opacity: 0.25, delay: 1, duration: 10 },
        { emoji: '🐟', anim: 'drift-right', x: '10%', y: '55%', size: 20, opacity: 0.2, delay: 2.5, duration: 12 },
        { type: 'glow', x: '0', bottom: 0, width: '100%', height: '30%', color: 'rgba(0,100,255,0.25)', gradientPos: 'center bottom', blur: 15, opacity: 0.35, delay: 0, duration: 7, anim: 'pulse' },
        { type: 'glow', x: '0', y: '0', width: '100%', height: '100%', color: 'rgba(80,180,255,0.08)', gradientPos: 'center center', blur: 25, opacity: 0.2, delay: 1.5, duration: 5, anim: 'shimmer' }
    ],
    ice: [
        { emoji: '❄️', anim: 'fall', x: '15%', y: '5%', size: 18, opacity: 0.35, delay: 0, duration: 7 },
        { emoji: '❄️', anim: 'fall', x: '50%', y: '0%', size: 14, opacity: 0.3, delay: 2, duration: 9 },
        { emoji: '❄️', anim: 'fall', x: '80%', y: '8%', size: 20, opacity: 0.25, delay: 4, duration: 6 },
        { emoji: '🧊', anim: 'sway', x: '35%', y: '45%', size: 22, opacity: 0.2, delay: 1, duration: 8 },
        { emoji: '💎', anim: 'pulse', x: '70%', y: '35%', size: 16, opacity: 0.3, delay: 3, duration: 5 },
        { type: 'glow', x: '10%', y: '10%', width: '80%', height: '40%', color: 'rgba(100,200,255,0.15)', gradientPos: 'center top', blur: 20, opacity: 0.3, delay: 0, duration: 10, anim: 'shimmer' },
        { type: 'glow', x: '0', bottom: 0, width: '100%', height: '25%', color: 'rgba(180,230,255,0.2)', gradientPos: 'center bottom', blur: 12, opacity: 0.35, delay: 1, duration: 7, anim: 'pulse' }
    ],
    thunder: [
        { emoji: '⚡', anim: 'flicker', x: '10%', y: '15%', size: 24, opacity: 0.4, delay: 0, duration: 3 },
        { emoji: '⚡', anim: 'flicker', x: '55%', y: '10%', size: 20, opacity: 0.35, delay: 1.5, duration: 3.5 },
        { emoji: '⚡', anim: 'flicker', x: '80%', y: '25%', size: 18, opacity: 0.3, delay: 3, duration: 4 },
        { emoji: '🌩️', anim: 'drift-left', x: '70%', y: '8%', size: 28, opacity: 0.2, delay: 0.5, duration: 12 },
        { emoji: '⚡', anim: 'shimmer', x: '35%', y: '50%', size: 14, opacity: 0.35, delay: 2, duration: 2.5 },
        { type: 'glow', x: '20%', y: '5%', width: '60%', height: '35%', color: 'rgba(255,220,50,0.2)', gradientPos: 'center top', blur: 18, opacity: 0.3, delay: 0, duration: 4, anim: 'flicker' },
        { type: 'glow', x: '0', y: '0', width: '100%', height: '50%', color: 'rgba(40,30,60,0.3)', gradientPos: 'center top', blur: 10, opacity: 0.4, delay: 0, duration: 8, anim: 'pulse' }
    ],
    grass: [
        { emoji: '🍃', anim: 'fall', x: '10%', y: '5%', size: 18, opacity: 0.35, delay: 0, duration: 8 },
        { emoji: '🍃', anim: 'fall', x: '45%', y: '0%', size: 16, opacity: 0.3, delay: 2.5, duration: 9 },
        { emoji: '🍃', anim: 'fall', x: '75%', y: '10%', size: 14, opacity: 0.25, delay: 5, duration: 7 },
        { emoji: '🌸', anim: 'sway', x: '60%', y: '30%', size: 20, opacity: 0.3, delay: 1, duration: 10 },
        { emoji: '🌙', anim: 'pulse', x: '85%', y: '8%', size: 22, opacity: 0.2, delay: 0, duration: 12 },
        { emoji: '🦋', anim: 'drift-right', x: '5%', y: '40%', size: 16, opacity: 0.3, delay: 3, duration: 11 },
        { type: 'glow', x: '0', bottom: 0, width: '100%', height: '25%', color: 'rgba(60,180,60,0.2)', gradientPos: 'center bottom', blur: 12, opacity: 0.35, delay: 0, duration: 7, anim: 'pulse' }
    ],
    dark: [
        { emoji: '👻', anim: 'sway', x: '15%', y: '25%', size: 22, opacity: 0.25, delay: 0, duration: 8 },
        { emoji: '👻', anim: 'float-up', x: '70%', y: '50%', size: 18, opacity: 0.2, delay: 3, duration: 10 },
        { emoji: '🦇', anim: 'drift-left', x: '80%', y: '15%', size: 20, opacity: 0.3, delay: 1, duration: 7 },
        { emoji: '🦇', anim: 'drift-right', x: '5%', y: '30%', size: 16, opacity: 0.25, delay: 4, duration: 9 },
        { emoji: '💀', anim: 'pulse', x: '45%', y: '40%', size: 18, opacity: 0.2, delay: 2, duration: 6 },
        { emoji: '🕯️', anim: 'flicker', x: '30%', bottom: 8, size: 16, opacity: 0.35, delay: 0.5, duration: 4 },
        { type: 'glow', x: '0', bottom: 0, width: '100%', height: '35%', color: 'rgba(100,0,150,0.2)', gradientPos: 'center bottom', blur: 18, opacity: 0.35, delay: 0, duration: 9, anim: 'pulse' }
    ],
    ghost: [
        { emoji: '👻', anim: 'sway', x: '20%', y: '20%', size: 22, opacity: 0.25, delay: 0, duration: 9 },
        { emoji: '👻', anim: 'float-up', x: '65%', y: '45%', size: 18, opacity: 0.2, delay: 2, duration: 11 },
        { emoji: '🔮', anim: 'pulse', x: '50%', y: '30%', size: 20, opacity: 0.3, delay: 1, duration: 6 },
        { emoji: '🕯️', anim: 'flicker', x: '10%', bottom: 10, size: 16, opacity: 0.35, delay: 0.5, duration: 3.5 },
        { emoji: '🕯️', anim: 'flicker', x: '85%', bottom: 12, size: 14, opacity: 0.3, delay: 2.5, duration: 4 },
        { emoji: '🌙', anim: 'pulse', x: '80%', y: '5%', size: 24, opacity: 0.2, delay: 0, duration: 12 },
        { type: 'glow', x: '0', bottom: 0, width: '100%', height: '30%', color: 'rgba(80,100,220,0.2)', gradientPos: 'center bottom', blur: 15, opacity: 0.3, delay: 0, duration: 8, anim: 'pulse' }
    ],
    dragon: [
        { emoji: '🐉', anim: 'pulse', x: '50%', y: '20%', size: 28, opacity: 0.2, delay: 0, duration: 8 },
        { emoji: '🔥', anim: 'float-up', x: '20%', bottom: 5, size: 18, opacity: 0.3, delay: 1, duration: 5 },
        { emoji: '🔥', anim: 'float-up', x: '75%', bottom: 3, size: 16, opacity: 0.25, delay: 3, duration: 6 },
        { emoji: '⭐', anim: 'shimmer', x: '10%', y: '15%', size: 14, opacity: 0.35, delay: 0.5, duration: 4 },
        { emoji: '⭐', anim: 'shimmer', x: '85%', y: '10%', size: 16, opacity: 0.3, delay: 2.5, duration: 5 },
        { emoji: '💎', anim: 'sway', x: '40%', bottom: 8, size: 20, opacity: 0.25, delay: 2, duration: 9 },
        { type: 'glow', x: '10%', bottom: 0, width: '80%', height: '30%', color: 'rgba(150,50,255,0.2)', gradientPos: 'center bottom', blur: 15, opacity: 0.35, delay: 0, duration: 7, anim: 'pulse' },
        { type: 'glow', x: '30%', y: '15%', width: '40%', height: '30%', color: 'rgba(255,200,50,0.1)', gradientPos: 'center center', blur: 20, opacity: 0.2, delay: 1, duration: 6, anim: 'shimmer' }
    ],
    fairy: [
        { emoji: '🌸', anim: 'fall', x: '15%', y: '5%', size: 18, opacity: 0.35, delay: 0, duration: 8 },
        { emoji: '🌸', anim: 'sway', x: '70%', y: '25%', size: 16, opacity: 0.3, delay: 2, duration: 10 },
        { emoji: '✨', anim: 'shimmer', x: '25%', y: '20%', size: 14, opacity: 0.4, delay: 0.5, duration: 3 },
        { emoji: '✨', anim: 'shimmer', x: '55%', y: '40%', size: 16, opacity: 0.35, delay: 1.5, duration: 4 },
        { emoji: '✨', anim: 'shimmer', x: '80%', y: '15%', size: 12, opacity: 0.3, delay: 3, duration: 3.5 },
        { emoji: '🍄', anim: 'sway', x: '40%', bottom: 5, size: 20, opacity: 0.25, delay: 1, duration: 7 },
        { emoji: '🦋', anim: 'drift-right', x: '5%', y: '35%', size: 18, opacity: 0.3, delay: 4, duration: 11 },
        { type: 'glow', x: '0', bottom: 0, width: '100%', height: '30%', color: 'rgba(255,150,200,0.2)', gradientPos: 'center bottom', blur: 15, opacity: 0.35, delay: 0, duration: 8, anim: 'pulse' }
    ],
    poison: [
        { emoji: '🧪', anim: 'sway', x: '20%', y: '35%', size: 20, opacity: 0.3, delay: 0, duration: 7 },
        { emoji: '☠️', anim: 'pulse', x: '55%', y: '25%', size: 18, opacity: 0.2, delay: 2, duration: 6 },
        { emoji: '🫧', anim: 'float-up', x: '15%', bottom: 2, size: 16, opacity: 0.35, delay: 0.5, duration: 8 },
        { emoji: '🫧', anim: 'float-up', x: '45%', bottom: 0, size: 14, opacity: 0.3, delay: 2.5, duration: 9 },
        { emoji: '🫧', anim: 'float-up', x: '75%', bottom: 5, size: 18, opacity: 0.25, delay: 4, duration: 7 },
        { emoji: '🐍', anim: 'sway', x: '70%', bottom: 8, size: 22, opacity: 0.2, delay: 1, duration: 10 },
        { type: 'glow', x: '0', bottom: 0, width: '100%', height: '35%', color: 'rgba(100,0,180,0.2)', gradientPos: 'center bottom', blur: 18, opacity: 0.35, delay: 0, duration: 8, anim: 'pulse' },
        { type: 'glow', x: '60%', y: '20%', width: '35%', height: '40%', color: 'rgba(0,200,0,0.1)', gradientPos: 'center center', blur: 22, opacity: 0.2, delay: 1, duration: 6, anim: 'shimmer' }
    ],
    rock: [
        { emoji: '🪨', anim: 'sway', x: '10%', bottom: 10, size: 24, opacity: 0.25, delay: 0, duration: 10 },
        { emoji: '🪨', anim: 'sway', x: '65%', bottom: 6, size: 20, opacity: 0.2, delay: 2, duration: 12 },
        { emoji: '⛰️', anim: 'pulse', x: '40%', bottom: 3, size: 28, opacity: 0.15, delay: 0, duration: 15 },
        { emoji: '💎', anim: 'pulse', x: '80%', y: '35%', size: 16, opacity: 0.3, delay: 1, duration: 5 },
        { emoji: '✨', anim: 'fall', x: '25%', y: '15%', size: 14, opacity: 0.25, delay: 3, duration: 7 },
        { emoji: '✨', anim: 'fall', x: '55%', y: '10%', size: 12, opacity: 0.2, delay: 5, duration: 8 },
        { type: 'glow', x: '0', bottom: 0, width: '100%', height: '25%', color: 'rgba(140,100,40,0.2)', gradientPos: 'center bottom', blur: 12, opacity: 0.35, delay: 0, duration: 8, anim: 'pulse' }
    ],
    psychic: [
        { emoji: '🔮', anim: 'orbit', x: '25%', y: '30%', size: 20, opacity: 0.35, delay: 0, duration: 8 },
        { emoji: '🔮', anim: 'orbit', x: '70%', y: '25%', size: 18, opacity: 0.3, delay: 3, duration: 9 },
        { emoji: '👁️', anim: 'pulse', x: '50%', y: '15%', size: 22, opacity: 0.2, delay: 1, duration: 6 },
        { emoji: '✨', anim: 'shimmer', x: '15%', y: '20%', size: 14, opacity: 0.35, delay: 0.5, duration: 4 },
        { emoji: '✨', anim: 'shimmer', x: '80%', y: '40%', size: 16, opacity: 0.3, delay: 2.5, duration: 3.5 },
        { emoji: '💫', anim: 'sway', x: '40%', y: '50%', size: 18, opacity: 0.25, delay: 2, duration: 7 },
        { type: 'glow', x: '10%', bottom: 0, width: '80%', height: '30%', color: 'rgba(220,80,200,0.2)', gradientPos: 'center bottom', blur: 18, opacity: 0.35, delay: 0, duration: 7, anim: 'pulse' },
        { type: 'glow', x: '30%', y: '10%', width: '40%', height: '40%', color: 'rgba(150,50,250,0.1)', gradientPos: 'center center', blur: 22, opacity: 0.2, delay: 1, duration: 6, anim: 'shimmer' }
    ],
    steel: [
        { emoji: '⚙️', anim: 'orbit', x: '15%', y: '25%', size: 22, opacity: 0.3, delay: 0, duration: 8 },
        { emoji: '⚙️', anim: 'orbit', x: '75%', y: '35%', size: 18, opacity: 0.25, delay: 2, duration: 10 },
        { emoji: '🔩', anim: 'sway', x: '45%', y: '45%', size: 16, opacity: 0.2, delay: 1, duration: 9 },
        { emoji: '⚡', anim: 'flicker', x: '30%', y: '20%', size: 14, opacity: 0.35, delay: 0.5, duration: 3 },
        { emoji: '⚡', anim: 'flicker', x: '65%', y: '15%', size: 16, opacity: 0.3, delay: 3, duration: 3.5 },
        { emoji: '🏗️', anim: 'pulse', x: '85%', bottom: 5, size: 24, opacity: 0.15, delay: 0, duration: 12 },
        { type: 'glow', x: '0', bottom: 0, width: '100%', height: '25%', color: 'rgba(180,190,220,0.2)', gradientPos: 'center bottom', blur: 12, opacity: 0.3, delay: 0, duration: 7, anim: 'pulse' }
    ],
    fighting: [
        { emoji: '🥊', anim: 'sway', x: '10%', y: '30%', size: 22, opacity: 0.3, delay: 0, duration: 5 },
        { emoji: '🥊', anim: 'sway', x: '80%', y: '40%', size: 20, opacity: 0.25, delay: 1.5, duration: 6 },
        { emoji: '💪', anim: 'pulse', x: '45%', y: '20%', size: 24, opacity: 0.2, delay: 1, duration: 7 },
        { emoji: '🔥', anim: 'flicker', x: '20%', bottom: 5, size: 16, opacity: 0.35, delay: 0.5, duration: 4 },
        { emoji: '🔥', anim: 'flicker', x: '70%', bottom: 8, size: 14, opacity: 0.3, delay: 3, duration: 3.5 },
        { emoji: '⭐', anim: 'shimmer', x: '55%', y: '15%', size: 14, opacity: 0.3, delay: 2, duration: 3 },
        { type: 'glow', x: '0', bottom: 0, width: '100%', height: '28%', color: 'rgba(220,40,30,0.2)', gradientPos: 'center bottom', blur: 14, opacity: 0.35, delay: 0, duration: 7, anim: 'pulse' }
    ],
    wind: [
        { emoji: '🌪️', anim: 'drift-right', x: '5%', y: '30%', size: 26, opacity: 0.2, delay: 0, duration: 10 },
        { emoji: '☁️', anim: 'drift-right', x: '10%', y: '10%', size: 22, opacity: 0.2, delay: 1, duration: 14 },
        { emoji: '☁️', anim: 'drift-left', x: '80%', y: '18%', size: 20, opacity: 0.15, delay: 4, duration: 12 },
        { emoji: '🍃', anim: 'fall', x: '30%', y: '0%', size: 16, opacity: 0.35, delay: 0.5, duration: 5 },
        { emoji: '🍃', anim: 'fall', x: '65%', y: '5%', size: 14, opacity: 0.3, delay: 3, duration: 6 },
        { emoji: '🪶', anim: 'sway', x: '50%', y: '35%', size: 18, opacity: 0.25, delay: 2, duration: 9 },
        { type: 'glow', x: '0', bottom: 0, width: '100%', height: '25%', color: 'rgba(80,200,180,0.18)', gradientPos: 'center bottom', blur: 15, opacity: 0.3, delay: 0, duration: 8, anim: 'pulse' }
    ],
    light: [
        { emoji: '⭐', anim: 'shimmer', x: '10%', y: '15%', size: 16, opacity: 0.4, delay: 0, duration: 3 },
        { emoji: '⭐', anim: 'shimmer', x: '45%', y: '10%', size: 18, opacity: 0.35, delay: 1, duration: 4 },
        { emoji: '⭐', anim: 'shimmer', x: '80%', y: '20%', size: 14, opacity: 0.3, delay: 2.5, duration: 3.5 },
        { emoji: '✨', anim: 'float-up', x: '25%', y: '40%', size: 16, opacity: 0.35, delay: 0.5, duration: 7 },
        { emoji: '✨', anim: 'sway', x: '65%', y: '35%', size: 14, opacity: 0.3, delay: 3, duration: 8 },
        { emoji: '☀️', anim: 'pulse', x: '50%', y: '5%', size: 28, opacity: 0.2, delay: 0, duration: 10 },
        { type: 'glow', x: '20%', y: '0', width: '60%', height: '50%', color: 'rgba(255,220,80,0.15)', gradientPos: 'center top', blur: 20, opacity: 0.3, delay: 0, duration: 6, anim: 'shimmer' },
        { type: 'glow', x: '0', bottom: 0, width: '100%', height: '25%', color: 'rgba(255,200,50,0.2)', gradientPos: 'center bottom', blur: 12, opacity: 0.35, delay: 0, duration: 7, anim: 'pulse' }
    ],
    demon: [
        { emoji: '😈', anim: 'pulse', x: '50%', y: '18%', size: 24, opacity: 0.2, delay: 0, duration: 7 },
        { emoji: '🔥', anim: 'float-up', x: '15%', bottom: 3, size: 18, opacity: 0.35, delay: 0.5, duration: 5 },
        { emoji: '🔥', anim: 'float-up', x: '80%', bottom: 5, size: 16, opacity: 0.3, delay: 2, duration: 6 },
        { emoji: '⛓️', anim: 'sway', x: '5%', y: '30%', size: 20, opacity: 0.2, delay: 1, duration: 9 },
        { emoji: '💀', anim: 'sway', x: '70%', y: '40%', size: 16, opacity: 0.25, delay: 3, duration: 8 },
        { emoji: '🩸', anim: 'fall', x: '40%', y: '5%', size: 14, opacity: 0.3, delay: 4, duration: 7 },
        { type: 'glow', x: '0', bottom: 0, width: '100%', height: '30%', color: 'rgba(180,0,20,0.25)', gradientPos: 'center bottom', blur: 15, opacity: 0.4, delay: 0, duration: 8, anim: 'pulse' }
    ],
    beast: [
        { emoji: '🐾', anim: 'sway', x: '15%', bottom: 8, size: 20, opacity: 0.25, delay: 0, duration: 9 },
        { emoji: '🐾', anim: 'sway', x: '60%', bottom: 12, size: 16, opacity: 0.2, delay: 2, duration: 10 },
        { emoji: '🌿', anim: 'sway', x: '5%', bottom: 5, size: 22, opacity: 0.3, delay: 0.5, duration: 7 },
        { emoji: '🌿', anim: 'sway', x: '85%', bottom: 3, size: 18, opacity: 0.25, delay: 3, duration: 8 },
        { emoji: '🌙', anim: 'pulse', x: '80%', y: '5%', size: 24, opacity: 0.2, delay: 0, duration: 12 },
        { emoji: '🦁', anim: 'pulse', x: '45%', y: '25%', size: 26, opacity: 0.15, delay: 1, duration: 10 },
        { type: 'glow', x: '0', bottom: 0, width: '100%', height: '25%', color: 'rgba(150,100,50,0.2)', gradientPos: 'center bottom', blur: 12, opacity: 0.35, delay: 0, duration: 8, anim: 'pulse' }
    ],
    ancient: [
        { emoji: '🏛️', anim: 'pulse', x: '45%', bottom: 5, size: 28, opacity: 0.15, delay: 0, duration: 12 },
        { emoji: '⚱️', anim: 'sway', x: '15%', y: '40%', size: 20, opacity: 0.25, delay: 1, duration: 9 },
        { emoji: '✨', anim: 'shimmer', x: '25%', y: '20%', size: 14, opacity: 0.35, delay: 0.5, duration: 4 },
        { emoji: '✨', anim: 'shimmer', x: '70%', y: '30%', size: 16, opacity: 0.3, delay: 2.5, duration: 3.5 },
        { emoji: '📜', anim: 'sway', x: '75%', y: '45%', size: 18, opacity: 0.2, delay: 2, duration: 8 },
        { emoji: '🔥', anim: 'flicker', x: '8%', bottom: 10, size: 16, opacity: 0.3, delay: 3, duration: 4 },
        { type: 'glow', x: '0', bottom: 0, width: '100%', height: '28%', color: 'rgba(200,170,50,0.2)', gradientPos: 'center bottom', blur: 14, opacity: 0.35, delay: 0, duration: 8, anim: 'pulse' }
    ],
    spirit: [
        { emoji: '👻', anim: 'sway', x: '20%', y: '25%', size: 20, opacity: 0.25, delay: 0, duration: 10 },
        { emoji: '👻', anim: 'float-up', x: '65%', y: '45%', size: 18, opacity: 0.2, delay: 3, duration: 11 },
        { emoji: '💫', anim: 'orbit', x: '35%', y: '30%', size: 16, opacity: 0.35, delay: 0.5, duration: 7 },
        { emoji: '💫', anim: 'orbit', x: '70%', y: '20%', size: 14, opacity: 0.3, delay: 2, duration: 8 },
        { emoji: '🌀', anim: 'orbit', x: '50%', y: '15%', size: 22, opacity: 0.2, delay: 1, duration: 9 },
        { emoji: '🔮', anim: 'pulse', x: '80%', y: '40%', size: 18, opacity: 0.3, delay: 4, duration: 6 },
        { type: 'glow', x: '0', bottom: 0, width: '100%', height: '30%', color: 'rgba(100,80,220,0.2)', gradientPos: 'center bottom', blur: 16, opacity: 0.35, delay: 0, duration: 8, anim: 'pulse' },
        { type: 'glow', x: '25%', y: '10%', width: '50%', height: '40%', color: 'rgba(180,100,255,0.08)', gradientPos: 'center center', blur: 22, opacity: 0.2, delay: 1, duration: 6, anim: 'shimmer' }
    ],
    creature: [
        { emoji: '🍄', anim: 'sway', x: '10%', bottom: 5, size: 22, opacity: 0.3, delay: 0, duration: 7 },
        { emoji: '🍄', anim: 'sway', x: '70%', bottom: 8, size: 18, opacity: 0.25, delay: 2, duration: 8 },
        { emoji: '🌿', anim: 'sway', x: '30%', bottom: 3, size: 20, opacity: 0.3, delay: 1, duration: 9 },
        { emoji: '🌿', anim: 'sway', x: '85%', bottom: 6, size: 16, opacity: 0.25, delay: 3, duration: 10 },
        { emoji: '🐛', anim: 'drift-right', x: '5%', y: '40%', size: 16, opacity: 0.2, delay: 2, duration: 12 },
        { emoji: '✨', anim: 'shimmer', x: '25%', y: '25%', size: 14, opacity: 0.35, delay: 0.5, duration: 4 },
        { emoji: '✨', anim: 'shimmer', x: '60%', y: '20%', size: 12, opacity: 0.3, delay: 3.5, duration: 3.5 },
        { type: 'glow', x: '0', bottom: 0, width: '100%', height: '28%', color: 'rgba(60,160,60,0.2)', gradientPos: 'center bottom', blur: 14, opacity: 0.35, delay: 0, duration: 8, anim: 'pulse' }
    ],
    wizard: [
        { emoji: '🪄', anim: 'sway', x: '15%', y: '35%', size: 22, opacity: 0.3, delay: 0, duration: 8 },
        { emoji: '📖', anim: 'sway', x: '70%', y: '42%', size: 20, opacity: 0.25, delay: 2, duration: 9 },
        { emoji: '⭐', anim: 'shimmer', x: '10%', y: '15%', size: 14, opacity: 0.35, delay: 0.5, duration: 3 },
        { emoji: '⭐', anim: 'shimmer', x: '50%', y: '10%', size: 16, opacity: 0.3, delay: 1.5, duration: 4 },
        { emoji: '⭐', anim: 'shimmer', x: '85%', y: '20%', size: 12, opacity: 0.4, delay: 3, duration: 3.5 },
        { emoji: '🔮', anim: 'pulse', x: '40%', y: '25%', size: 18, opacity: 0.25, delay: 1, duration: 6 },
        { type: 'glow', x: '0', bottom: 0, width: '100%', height: '30%', color: 'rgba(80,60,200,0.2)', gradientPos: 'center bottom', blur: 15, opacity: 0.35, delay: 0, duration: 7, anim: 'pulse' },
        { type: 'glow', x: '30%', y: '5%', width: '40%', height: '35%', color: 'rgba(150,80,255,0.08)', gradientPos: 'center center', blur: 20, opacity: 0.2, delay: 1, duration: 6, anim: 'shimmer' }
    ],
    bug: [
        { emoji: '🐛', anim: 'drift-right', x: '5%', y: '35%', size: 18, opacity: 0.25, delay: 0, duration: 11 },
        { emoji: '🪲', anim: 'sway', x: '60%', y: '30%', size: 16, opacity: 0.2, delay: 2, duration: 9 },
        { emoji: '🕸️', anim: 'pulse', x: '80%', y: '10%', size: 24, opacity: 0.15, delay: 0, duration: 12 },
        { emoji: '🌿', anim: 'sway', x: '15%', bottom: 5, size: 20, opacity: 0.3, delay: 1, duration: 8 },
        { emoji: '✨', anim: 'shimmer', x: '30%', y: '45%', size: 12, opacity: 0.35, delay: 0.5, duration: 3.5 },
        { emoji: '✨', anim: 'shimmer', x: '70%', y: '50%', size: 10, opacity: 0.3, delay: 3, duration: 4 },
        { type: 'glow', x: '0', bottom: 0, width: '100%', height: '25%', color: 'rgba(150,180,30,0.2)', gradientPos: 'center bottom', blur: 12, opacity: 0.35, delay: 0, duration: 8, anim: 'pulse' }
    ],
    normal: [
        { emoji: '⭐', anim: 'shimmer', x: '10%', y: '15%', size: 16, opacity: 0.3, delay: 0, duration: 4 },
        { emoji: '⭐', anim: 'shimmer', x: '50%', y: '10%', size: 14, opacity: 0.25, delay: 1.5, duration: 5 },
        { emoji: '⭐', anim: 'shimmer', x: '85%', y: '20%', size: 18, opacity: 0.3, delay: 3, duration: 3.5 },
        { emoji: '☁️', anim: 'drift-right', x: '5%', y: '12%', size: 22, opacity: 0.2, delay: 1, duration: 14 },
        { emoji: '🌙', anim: 'pulse', x: '80%', y: '5%', size: 24, opacity: 0.2, delay: 0, duration: 12 },
        { type: 'glow', x: '0', bottom: 0, width: '100%', height: '25%', color: 'rgba(150,150,150,0.15)', gradientPos: 'center bottom', blur: 12, opacity: 0.3, delay: 0, duration: 8, anim: 'pulse' }
    ]
};

BattleMode._spawnSceneElements = function(sceneType) {
    var arena = document.querySelector('.battle-arena');
    if (!arena) return;

    // Clear old elements
    this._clearSceneElements();

    var config = SceneElementConfigs[sceneType];
    if (!config) config = SceneElementConfigs['normal'];

    config.forEach(function(item) {
        var el = document.createElement('div');
        el.className = 'scene-element';

        if (item.type === 'glow') {
            el.classList.add('scene-glow');
            el.style.width = item.width || '100%';
            el.style.height = item.height || '25%';
            if (item.bottom !== null && item.bottom !== undefined) {
                el.style.bottom = (typeof item.bottom === 'number') ? item.bottom + '%' : item.bottom;
                el.style.top = 'auto';
            } else {
                el.style.top = item.y || '0';
            }
            el.style.left = item.x || '0';
            el.style.background = 'radial-gradient(ellipse at ' + (item.gradientPos || 'center bottom') + ', ' + (item.color || 'rgba(255,100,0,0.3)') + ', transparent 70%)';
            if (item.blur) el.style.filter = 'blur(' + item.blur + 'px)';
        } else {
            // Emoji element
            el.textContent = item.emoji || '';
            el.style.fontSize = (item.size || 20) + 'px';
            el.style.left = item.x || '50%';
            if (item.bottom !== null && item.bottom !== undefined) {
                el.style.bottom = (typeof item.bottom === 'number') ? item.bottom + '%' : item.bottom;
                el.style.top = 'auto';
            } else {
                el.style.top = item.y || '50%';
            }
        }

        el.style.opacity = item.opacity || 0.35;
        el.style.animationDuration = (item.duration || 5) + 's';
        el.style.animationDelay = (item.delay || 0) + 's';

        if (item.zIndex) el.style.zIndex = item.zIndex;

        if (item.anim) el.classList.add('se-' + item.anim);

        arena.appendChild(el);
    });
};

BattleMode._clearSceneElements = function() {
    var arena = document.querySelector('.battle-arena');
    if (!arena) return;
    var oldElements = arena.querySelectorAll('.scene-element');
    oldElements.forEach(function(el) { el.remove(); });
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
        }, 300);
    }, 150);
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
    }, 300);
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
        this.showSpeechBubble(enemyEmoji, quip, 800);
        enemySide.classList.remove('entered');
    }, 400);

    setTimeout(() => {
        this.setEnemyState('idle');
        if (callback) callback();
    }, 1200);
};

// ===== Enemy Hit Animation =====

BattleMode.enemyHitAnimation = function(callback) {
    this.setEnemyState('hit');

    setTimeout(() => {
        this.setEnemyState('idle');
        if (callback) callback();
    }, 300);
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
            }, 400);
        }
    }

    setTimeout(() => {
        this.setEnemyState('idle');
        if (callback) callback();
    }, 350);
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

// ===== v18.0: Smooth Scene Transition =====

BattleMode.transitionScene = function(oldType, newType) {
    var arena = document.querySelector('.battle-arena');
    if (!arena) return;

    var layers = arena.querySelectorAll('.scene-layer');

    // 1. Fade out old scene (0.3s)
    layers.forEach(function(l) {
        l.style.transition = 'opacity 0.3s ease';
        l.style.opacity = '0';
    });

    var self = this;
    setTimeout(function() {
        // 2. Apply new theme (triggers class swap)
        if (App.battle && App.battle.currentMonster) {
            self.applyMonsterTheme(App.battle.currentMonster);
        }
        // 3. Fade in new scene (0.5s)
        layers.forEach(function(l) {
            l.style.transition = 'opacity 0.5s ease';
            l.style.opacity = '1';
        });
        // 4. Clean up inline transition after animation
        setTimeout(function() {
            layers.forEach(function(l) {
                l.style.transition = '';
            });
        }, 600);
    }, 300);
};

// ===== v18.0: Boss Entrance Effect =====

BattleMode.bossEntranceEffect = function() {
    var arena = document.querySelector('.battle-arena');
    if (!arena) return;

    // Flash effect
    arena.classList.add('boss-entrance-flash');

    // Shake effect
    setTimeout(function() {
        arena.classList.add('boss-entrance-shake');
    }, 100);

    // Boost monster aura
    var aura = document.getElementById('monster-aura');
    if (aura) {
        aura.classList.add('aura-boss');
        aura.style.transform = 'translateX(-50%) scale(1.5)';
        setTimeout(function() {
            aura.style.transition = 'transform 0.5s ease';
            aura.style.transform = '';
        }, 500);
    }

    // Cleanup classes
    setTimeout(function() {
        arena.classList.remove('boss-entrance-flash', 'boss-entrance-shake');
    }, 800);
};

// ===== v18.0: Iris Wipe Transition =====

BattleMode.irisWipeIn = function(callback) {
    var arena = document.querySelector('.battle-arena');
    if (!arena) {
        if (callback) callback();
        return;
    }
    arena.classList.add('battle-iris-enter');
    setTimeout(function() {
        arena.classList.remove('battle-iris-enter');
        if (callback) callback();
    }, 650);
};

// ===== v18.0: Low-end Performance Detection =====

var _lowPerformance = false;
var _perfFrameCount = 0;
var _perfLastTime = 0;

BattleMode.startPerfMonitor = function() {
    _perfFrameCount = 0;
    _perfLastTime = performance.now();
    _lowPerformance = false;
    this._perfRAF = requestAnimationFrame(this._perfCheck.bind(this));
};

BattleMode._perfCheck = function() {
    _perfFrameCount++;
    var now = performance.now();
    if (now - _perfLastTime >= 2000) {
        var fps = _perfFrameCount / ((now - _perfLastTime) / 1000);
        if (fps < 30 && !_lowPerformance) {
            _lowPerformance = true;
            document.body.classList.add('low-perf');
        }
        _perfFrameCount = 0;
        _perfLastTime = now;
    }
    this._perfRAF = requestAnimationFrame(this._perfCheck.bind(this));
};

BattleMode.stopPerfMonitor = function() {
    if (this._perfRAF) {
        cancelAnimationFrame(this._perfRAF);
        this._perfRAF = null;
    }
};

// ===== Cleanup Arena =====

BattleMode.cleanupArena = function() {
    // Remove speech bubbles
    document.querySelectorAll('.speech-bubble').forEach(el => el.remove());

    // Remove projectiles
    document.querySelectorAll('.arena-attack-projectile').forEach(el => el.remove());

    // Remove damage numbers
    document.querySelectorAll('.damage-number').forEach(el => el.remove());

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

    // v18.0: Remove mood filter
    var arena = document.querySelector('.battle-arena');
    if (arena) {
        _allMoodClasses.forEach(function(cls) { arena.classList.remove(cls); });
        arena.classList.remove('battle-iris-enter', 'battle-iris-exit');
        arena.classList.remove('boss-entrance-flash', 'boss-entrance-shake');
    }

    // v18.0: Stop perf monitor
    this.stopPerfMonitor();
    document.body.classList.remove('low-perf');
};
