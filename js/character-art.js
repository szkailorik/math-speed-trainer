/**
 * character-art.js
 * Generated character artwork adapter. Keeps game data and mechanics intact while
 * replacing emoji-only heroes and monsters with deterministic themed sprites.
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

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function stableHash(value) {
        var hash = 2166136261;
        var text = String(value || 'monster');
        for (var i = 0; i < text.length; i++) {
            hash ^= text.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0;
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

    function monsterSource(monster, module) {
        if (monster && monster.artGroup && Number.isInteger(monster.artIndex)) {
            return 'assets/characters/expansion/' + monster.artGroup + '/' + monster.artGroup + '-' +
                String(monster.artIndex).padStart(2, '0') + '.webp';
        }
        var resolvedModule = inferModule(monster, module);
        var group = groups[resolvedModule] || groups.xiaojiujiu;
        var index = findNamedIndex(monster, group.folder);
        if (index === null) {
            index = stableHash((monster && monster.id) || (monster && monster.name)) % group.count;
        }
        return 'assets/characters/' + group.folder + '/' + group.folder + '-' + String(index).padStart(2, '0') + '.webp';
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
        monsterSource: monsterSource,
        setAvatar: setAvatar,
        setMonster: setMonster
    };
})();
