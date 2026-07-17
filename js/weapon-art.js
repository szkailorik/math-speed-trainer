/**
 * weapon-art.js
 * Visual-only adapter for held weapons, projectiles, trajectories, and impacts.
 * It intentionally does not alter damage, timing, combo thresholds, or drops.
 */

var WeaponArt = (function() {
    var ROOT = 'assets/weapons/sprites/';

    var sprites = {
        knight: 'knight-sword.webp',
        mage: 'star-staff.webp',
        ranger: 'precision-crossbow.webp',
        guardian: 'guardian-hammer.webp',
        math: 'math-talisman-blade.webp',
        xiyou: 'xiyou-golden-cudgel.webp',
        fengshen: 'fengshen-thunder-whip.webp',
        liaozhai: 'liaozhai-talisman-sword.webp',
        academy: 'academy-crescent-wand.webp',
        fire: 'fire-orb.webp',
        ice: 'ice-arrow.webp',
        thunder: 'lightning-spear.webp',
        meteor: 'meteor-star.webp',
        rainbow: 'rainbow-prism.webp',
        bomb: 'arcane-bomb.webp',
        holy: 'holy-wind-disc.webp'
    };

    var roleByAvatar = {
        '⚔️': 'knight',
        '🧙': 'mage',
        '🏹': 'ranger',
        '🛡️': 'guardian',
        '🐉': 'guardian',
        '🦊': 'ranger',
        '🌟': 'mage',
        '🔮': 'mage'
    };

    var themeByModule = {
        xiaojiujiu: 'math',
        fraction: 'math',
        decimal: 'xiyou',
        unit: 'fengshen',
        multiply: 'liaozhai',
        times: 'academy',
        mixed: 'math'
    };

    var trajectoryById = {
        knight: 'slash',
        mage: 'wave',
        ranger: 'fast',
        guardian: 'lob',
        math: 'slash',
        xiyou: 'spin',
        fengshen: 'zigzag',
        liaozhai: 'wave',
        academy: 'arc',
        fire: 'direct',
        ice: 'fast',
        thunder: 'zigzag',
        meteor: 'arc',
        rainbow: 'wave',
        bomb: 'lob',
        holy: 'spiral'
    };

    var impactById = {
        fire: 'fire',
        ice: 'ice',
        thunder: 'thunder',
        fengshen: 'thunder',
        meteor: 'star',
        academy: 'star',
        rainbow: 'prism',
        bomb: 'bomb',
        holy: 'holy',
        liaozhai: 'spirit',
        xiyou: 'gold',
        math: 'gold'
    };

    function currentAvatar() {
        if (typeof UserManager !== 'undefined' && UserManager.getCurrentUser) {
            var user = UserManager.getCurrentUser();
            if (user && user.avatar) return user.avatar;
        }
        return '⚔️';
    }

    function currentModule(module) {
        if (module) return module;
        if (typeof App !== 'undefined' && App.battle && App.battle.module) {
            return App.battle.module;
        }
        return 'xiaojiujiu';
    }

    function idFromWeapon(weapon, module) {
        var mod = currentModule(module);
        if (weapon && weapon.art && sprites[weapon.art]) return weapon.art;
        var name = weapon && weapon.name ? weapon.name : '';
        var emoji = typeof weapon === 'string' ? weapon : (weapon && weapon.emoji) || '';
        var type = weapon && weapon.type ? weapon.type : '';

        var typeMap = {
            fire: 'fire',
            ice: 'ice',
            water: 'holy',
            thunder: 'thunder',
            electric: 'thunder',
            poison: 'liaozhai',
            ghost: 'liaozhai',
            spirit: 'liaozhai',
            dark: 'liaozhai',
            dragon: 'meteor',
            wizard: 'academy',
            psychic: 'academy',
            light: 'holy',
            rock: 'bomb',
            ground: 'bomb',
            earth: 'bomb'
        };
        if (typeMap[type]) return typeMap[type];

        if (name.indexOf('金箍') !== -1 || name.indexOf('七十二变') !== -1 || name.indexOf('紧箍') !== -1) return 'xiyou';
        if (name.indexOf('天雷') !== -1 || name.indexOf('土遁') !== -1 || name.indexOf('打神鞭') !== -1) return 'fengshen';
        if (name.indexOf('鬼火') !== -1 || name.indexOf('狐狸火') !== -1 || name.indexOf('聊斋') !== -1) return 'liaozhai';
        if (name.indexOf('守护神兽') !== -1 || name.indexOf('魔咒') !== -1 || name.indexOf('魔杖') !== -1) return 'academy';
        if (name.indexOf('神兽') !== -1 || name.indexOf('灵符') !== -1 || name.indexOf('算盘') !== -1 || name.indexOf('仙丹') !== -1) return 'math';

        var emojiMap = {
            '🔥': 'fire', '🧊': 'ice', '❄️': 'ice',
            '⚡': 'thunder', '🌩️': 'thunder',
            '⭐': 'meteor', '🌟': 'holy', '✨': 'meteor', '💫': 'meteor', '☄️': 'meteor',
            '🌈': 'rainbow', '💎': 'rainbow',
            '💣': 'bomb', '🌋': 'bomb',
            '🌀': 'holy', '🌊': 'holy',
            '🏹': 'ranger', '🔱': 'xiyou', '🪄': 'academy',
            '⚔️': 'knight', '🗡️': 'math'
        };
        if (emojiMap[emoji]) return emojiMap[emoji];
        var emojiKeys = Object.keys(emojiMap);
        for (var i = 0; i < emojiKeys.length; i++) {
            if (emoji.indexOf(emojiKeys[i]) !== -1) return emojiMap[emojiKeys[i]];
        }

        if (weapon && weapon.module && themeByModule[weapon.module]) return themeByModule[weapon.module];
        return themeByModule[mod] || 'knight';
    }

    function heldId(stage, module, avatar) {
        var comboIds = {
            awakened: 'fire',
            will: 'thunder',
            godlike: 'rainbow',
            invincible: 'holy'
        };
        if (comboIds[stage]) return comboIds[stage];

        var mod = currentModule(module);
        if (mod !== 'xiaojiujiu' && themeByModule[mod]) return themeByModule[mod];
        return roleByAvatar[avatar || currentAvatar()] || 'knight';
    }

    function source(id) {
        return ROOT + (sprites[id] || sprites.knight);
    }

    function markup(id, className, alt) {
        return '<img class="weapon-art ' + (className || '') + '" src="' + source(id) +
            '" alt="' + (alt || '攻击武器') + '" draggable="false">';
    }

    function setElement(element, id, className, alt) {
        if (!element) return;
        element.innerHTML = markup(id, className, alt);
        element.dataset.weaponArt = id;
    }

    function setHeld(element, stage, module, avatar) {
        var id = heldId(stage || 'normal', module, avatar);
        setElement(element, id, 'held-weapon-art', '冒险者武器');
        return id;
    }

    function setProjectile(element, weapon, module, sizeClass) {
        var id = idFromWeapon(weapon, module);
        var trajectory = trajectoryById[id] || 'direct';
        setElement(element, id, 'projectile-weapon-art ' + (sizeClass || ''), weapon && weapon.name ? weapon.name : '攻击武器');
        element.classList.add('weapon-' + trajectory);
        element.dataset.impactStyle = impactById[id] || 'steel';
        return id;
    }

    function spawnImpact(target, weapon, module, scale) {
        var arena = document.querySelector('.battle-arena');
        if (!arena) return;
        var id = idFromWeapon(weapon, module);
        var impact = document.createElement('div');
        impact.className = 'weapon-impact impact-' + (impactById[id] || 'steel');
        impact.style.setProperty('--impact-scale', String(scale || 1));

        var arenaRect = arena.getBoundingClientRect();
        var targetRect = target && target.getBoundingClientRect ? target.getBoundingClientRect() : null;
        if (targetRect) {
            impact.style.left = (targetRect.left - arenaRect.left + targetRect.width / 2) + 'px';
            impact.style.top = (targetRect.top - arenaRect.top + targetRect.height / 2) + 'px';
        } else {
            impact.style.left = '76%';
            impact.style.top = '40%';
        }
        impact.innerHTML = '<i></i><i></i><i></i><i></i><b></b>';
        arena.appendChild(impact);
        setTimeout(function() { impact.remove(); }, 420);
    }

    return {
        heldId: heldId,
        idFromWeapon: idFromWeapon,
        markup: markup,
        setElement: setElement,
        setHeld: setHeld,
        setProjectile: setProjectile,
        source: source,
        spawnImpact: spawnImpact
    };
})();
