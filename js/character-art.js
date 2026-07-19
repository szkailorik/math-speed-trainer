/**
 * character-art.js
 * Generated character artwork adapter. Keeps game data and mechanics intact while
 * replacing emoji-only heroes and monsters with verified themed sprites.
 */

var CharacterArt = (function() {
    var avatarIndexes = {
        '⚔️': 0,
        '🧙': 1,
        '🏹': 2,
        '🛡️': 3,
        '🐉': 4,
        '🦊': 5,
        '🌟': 6,
        '🔮': 7
    };

    var groups = {
        xiaojiujiu: { folder: 'math', count: 16 },
        fraction: { folder: 'shanhai', count: 16 },
        decimal: { folder: 'xiyou', count: 12 },
        unit: { folder: 'fengshen', count: 8 },
        multiply: { folder: 'liaozhai', count: 8 },
        times: { folder: 'academy', count: 8 },
        mixed: { folder: 'math', count: 16 }
    };

    var namedIndexes = {
        math: [
            ['噗噗鬼', 0], ['眨眨眼', 1], ['小黑影', 2], ['咕噜球', 3],
            ['毒毒菇', 4], ['嘶嘶蛇', 5], ['臭臭花', 6], ['呼呼焰', 7],
            ['烈烈猴', 8], ['泡泡怪', 9], ['墨墨鱼', 10], ['牙牙怪', 11],
            ['骨骨仔', 12], ['蝙蝙侠', 13], ['南瓜王', 14], ['咒咒娃', 15],
            ['口诀守门人', 12], ['速算将军', 13], ['九九魔帝', 14], ['九九魔王', 14]
        ],
        shanhai: [
            ['白泽', 0], ['精卫', 1], ['九尾', 2], ['青鸟', 3],
            ['鹿蜀', 4], ['猼訑', 5], ['当康', 6], ['讹兽', 7],
            ['夔', 8], ['英招', 9], ['毕方', 10], ['穷奇', 11],
            ['饕餮', 12], ['梼杌', 13], ['混沌', 14], ['烛龙', 15]
        ],
        xiyou: [
            ['花果山', 0], ['白骨', 1], ['黑熊', 2], ['黄风', 3],
            ['红孩儿', 4], ['铁扇', 5], ['蜘蛛', 6], ['蝎', 7],
            ['牛魔王', 8], ['金角', 9], ['虎力', 10], ['天帝', 11]
        ],
        fengshen: [
            ['朝歌守将', 0], ['哪吒', 1], ['杨戬', 2], ['姜子牙', 3],
            ['雷震子', 4], ['赵公明', 4], ['土行孙', 5], ['魔礼', 6], ['通天', 7]
        ],
        liaozhai: [
            ['婴宁', 0], ['花', 0], ['小翠', 1], ['灯笼', 1],
            ['小倩', 2], ['月', 2], ['画皮', 3], ['燕赤霞', 4],
            ['钟馗', 4], ['道士', 4], ['黑山', 5], ['姥姥', 5],
            ['九尾', 6], ['狐仙', 6], ['阎罗', 7], ['判官', 7], ['幽冥帝君', 7], ['书斋守灵', 1]
        ],
        academy: [
            ['海德薇', 0], ['猫头鹰', 0], ['小仙', 1], ['矮妖', 1],
            ['嗅嗅', 2], ['护树', 3], ['树', 3], ['蒲绒', 4],
            ['曼德拉', 5], ['幽灵', 6], ['尼克', 6], ['桃金娘', 6], ['城堡守护灵', 6],
            ['黑魔', 7], ['摄魂', 7], ['巫师', 7], ['魔王', 7], ['阿拉戈克', 7]
        ]
    };

    // Unmatched monsters must use a resource from the same creature family.
    // The old stable hash could turn a phoenix into a skeleton simply because
    // two unrelated IDs had the same remainder.
    var typeIndexes = {
        math: { fire: 7, water: 9, ice: 9, poison: 4, plant: 6, undead: 12, flying: 13, insect: 5, dark: 2, ghost: 0, beast: 11, rock: 11, magic: 3, default: 3 },
        shanhai: { fire: 10, water: 8, flying: 3, fox: 2, dragon: 15, beast: 11, rock: 8, magic: 0, default: 0 },
        xiyou: { fire: 4, wind: 3, undead: 1, insect: 6, poison: 7, beast: 2, giant: 8, magic: 9, default: 9 },
        fengshen: { fire: 1, lightning: 4, rock: 5, warrior: 0, dark: 6, magic: 3, default: 3 },
        liaozhai: { plant: 0, lantern: 1, ghost: 2, fox: 6, undead: 7, dark: 5, warrior: 4, magic: 3, default: 3 },
        academy: { flying: 0, bird: 0, magic: 1, beast: 2, plant: 3, earth: 5, ghost: 6, undead: 6, dark: 7, default: 1 }
    };

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function inferModule(monster, module) {
        if (groups[module]) return module;
        var id = monster && monster.id ? monster.id : '';
        if (id.indexOf('sh_') === 0) return 'fraction';
        if (id.indexOf('xy_') === 0) return 'decimal';
        if (id.indexOf('fs_') === 0) return 'unit';
        if (id.indexOf('lz_') === 0) return 'multiply';
        if (id.indexOf('hp_') === 0) return 'times';
        if (typeof App !== 'undefined' && App.battle && groups[App.battle.module]) {
            return App.battle.module;
        }
        return 'xiaojiujiu';
    }

    function findNamedIndex(monster, folder) {
        var rules = namedIndexes[folder] || [];
        var name = monster && monster.name ? monster.name : '';
        for (var i = 0; i < rules.length; i++) {
            if (name.indexOf(rules[i][0]) !== -1) return rules[i][1];
        }
        return null;
    }

    function inferCreatureType(monster) {
        var text = [monster && monster.type, monster && monster.name, monster && monster.attackName, monster && monster.story, monster && monster.description].filter(Boolean).join(' ').toLowerCase();
        var rules = [
            ['fire', /火|炎|焰|凤凰|不死鸟|phoenix/], ['ice', /冰|雪|霜/], ['water', /水|海|泡|河|湖|鱼|虾|蟹/],
            ['lightning', /雷|电/], ['poison', /毒|菇|蝎|蛇/], ['plant', /花|树|木|藤|草|叶/],
            ['undead', /骷髅|骨|尸|僵|亡灵/], ['ghost', /鬼|幽灵|魂|魅/], ['flying', /鸟|鹰|蝙蝠|飞|翼|蜂|蛾|蝶/],
            ['insect', /虫|蛛|蜂|蚁|螳螂/], ['fox', /狐|九尾/], ['dragon', /龙/], ['rock', /石|岩|土|山/],
            ['lantern', /灯|烛/], ['warrior', /将|兵|骑士|守卫|战士/], ['dark', /暗|影|魔王|摄魂/],
            ['beast', /兽|狼|虎|熊|猴|鹿|猪|牛|龟|鼹鼠/], ['magic', /法|巫|术|咒|仙|精灵/]
        ];
        for (var i = 0; i < rules.length; i++) if (rules[i][1].test(text)) return rules[i][0];
        return 'default';
    }

    function monsterResolution(monster, module) {
        if (monster && monster.image) return { src: monster.image, status: monster.assetStatus || 'explicit' };
        var name = monster && monster.name ? monster.name : '';
        var id = monster && monster.id ? monster.id : '';
        if (/凤凰|不死鸟|福克斯/.test(name) || /(^|_)phoenix($|_)/i.test(id)) {
            return { src: 'assets/characters/special/phoenix.png', status: 'exact-special' };
        }
        if (monster && monster.artGroup && Number.isInteger(monster.artIndex)) {
            return { src: 'assets/characters/expansion/' + monster.artGroup + '/' + monster.artGroup + '-' + String(monster.artIndex).padStart(2, '0') + '.webp', status: 'exact-expansion' };
        }
        var resolvedModule = inferModule(monster, module);
        var group = groups[resolvedModule] || groups.xiaojiujiu;
        var index = findNamedIndex(monster, group.folder);
        if (index !== null) return { src: 'assets/characters/' + group.folder + '/' + group.folder + '-' + String(index).padStart(2, '0') + '.webp', status: 'named-lineage' };
        var creatureType = inferCreatureType(monster);
        var typeMap = typeIndexes[group.folder] || typeIndexes.math;
        index = Object.prototype.hasOwnProperty.call(typeMap, creatureType) ? typeMap[creatureType] : typeMap.default;
        return { src: 'assets/characters/' + group.folder + '/' + group.folder + '-' + String(index).padStart(2, '0') + '.webp', status: 'type-fallback', creatureType: creatureType };
    }

    function monsterSource(monster, module) {
        return monsterResolution(monster, module).src;
    }

    function avatarSource(avatar) {
        var index = Object.prototype.hasOwnProperty.call(avatarIndexes, avatar) ? avatarIndexes[avatar] : 0;
        return 'assets/characters/heroes/heroes-' + String(index).padStart(2, '0') + '.webp';
    }

    function imageMarkup(src, alt, className) {
        return '<img class="character-art ' + escapeHtml(className || '') + '" src="' +
            escapeHtml(src) + '" alt="' + escapeHtml(alt) + '" draggable="false">';
    }

    function monsterMarkup(monster, module, className) {
        return imageMarkup(monsterSource(monster, module), monster && monster.name ? monster.name : '妖怪', className || 'monster-art');
    }

    function avatarMarkup(avatar, className) {
        return imageMarkup(avatarSource(avatar), '冒险者头像', className || 'avatar-art');
    }

    function cardMarkup(card, className) {
        if (!card) return '';
        var characterCategories = { monster: true };
        var isBossTrophy = card.category === 'legend' && /魔王|妖|兽|鬼|龙|神|精/.test(card.name || '');
        if (!characterCategories[card.category] && !isBossTrophy) {
            return escapeHtml(card.emoji || '🃏');
        }
        var cardMonster = {
            id: 'card-' + (card.id || card.name || 'monster'),
            name: card.name || '怪物卡'
        };
        return monsterMarkup(cardMonster, card.module || 'xiaojiujiu', className || 'card-character-art');
    }

    function setMonster(element, monster, module) {
        if (!element || !monster) return;
        element.innerHTML = monsterMarkup(monster, module, 'monster-art');
        element.classList.toggle('boss-art', !!(monster.isBoss || monster.isChapterBoss));
    }

    function setAvatar(element, avatar, className) {
        if (!element) return;
        element.innerHTML = avatarMarkup(avatar, className || 'avatar-art');
    }

    return {
        avatarMarkup: avatarMarkup,
        avatarSource: avatarSource,
        cardMarkup: cardMarkup,
        monsterMarkup: monsterMarkup,
        monsterResolution: monsterResolution,
        monsterSource: monsterSource,
        setAvatar: setAvatar,
        setMonster: setMonster
    };
})();
