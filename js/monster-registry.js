/**
 * monster-registry.js - v26.3 canonical monster records.
 * Stages, battle, collection and artwork resolve the same stable ID record.
 */
var MonsterRegistry = (function () {
    'use strict';

    var records = Object.create(null);
    var idOwners = Object.create(null);

    function fallbackId(monster, module) {
        var seed = String((monster && monster.name) || 'monster').replace(/\s+/g, '-').toLowerCase();
        return (module || 'xiaojiujiu') + '-legacy-' + seed;
    }

    function inferAttackType(monster, creatureType) {
        var text = String((monster && monster.attackName) || '');
        if (/箭|射|喷|波|术|法|火|冰|霜|雷|电|风|光|弹|网/.test(text)) return 'ranged';
        if (creatureType === 'flying' || creatureType === 'bird') return 'aerial';
        return 'melee';
    }

    function normalize(monster, module, difficulty) {
        if (!monster) return monster;
        module = module || monster.module || 'xiaojiujiu';
        var id = String(monster.id || fallbackId(monster, module));
        var resolution = typeof CharacterArt !== 'undefined' && CharacterArt.monsterResolution ? CharacterArt.monsterResolution(monster, module) : { src: monster.image || '', status: 'unresolved' };
        var creatureType = monster.type || resolution.creatureType || 'magic';
        var isBoss = !!(monster.isBoss || monster.isChapterBoss || difficulty === 'boss' || Number(monster.hp) >= 8);
        var normalized = Object.assign({}, monster, {
            id: id,
            monsterId: id,
            module: module,
            name: monster.name || '未命名怪物',
            image: resolution.src,
            assetStatus: resolution.status,
            animation: monster.animation || (inferAttackType(monster, creatureType) === 'ranged' ? 'ranged-cast' : 'melee-lunge'),
            description: monster.description || monster.story || monster.trait || '来自数学六境的挑战者。',
            type: creatureType,
            maxHealth: Math.max(1, Number(monster.maxHealth || monster.hp) || 1),
            hp: Math.max(1, Number(monster.hp || monster.maxHealth) || 1),
            attackIcon: typeof monster.attack === 'string' ? monster.attack : (monster.attackEmoji || '💥'),
            attackPower: Math.max(1, Number(monster.attackPower) || 1),
            heartDamage: Math.max(1, Number(monster.heartDamage) || 1),
            defense: Math.max(0, Number(monster.defense) || (isBoss ? 1 : 0)),
            attackType: monster.attackType || inferAttackType(monster, creatureType),
            rewards: monster.rewards || monster.reward || monster.drops || [],
            specialAbility: monster.specialAbility || (Array.isArray(monster.behaviors) ? monster.behaviors.join('、') : monster.behavior || '无')
        });
        if (idOwners[id] && idOwners[id] !== normalized.name) {
            console.warn('[MonsterRegistry] duplicate monster ID', id, idOwners[id], normalized.name);
        } else {
            idOwners[id] = normalized.name;
        }
        records[id] = normalized;
        return normalized;
    }

    function normalizeList(list, module, difficulty) {
        return (list || []).map(function (monster) { return normalize(monster, module, difficulty); });
    }

    function normalizePools(pools, module) {
        if (!pools) return pools;
        return {
            easy: normalizeList(pools.easy, module, 'easy'),
            normal: normalizeList(pools.normal, module, 'normal'),
            hard: normalizeList(pools.hard, module, 'hard'),
            boss: normalizeList(pools.boss, module, 'boss')
        };
    }

    function validate(list, module) {
        var seen = Object.create(null), issues = [];
        normalizeList(list, module).forEach(function (monster) {
            if (seen[monster.id] && seen[monster.id] !== monster.name) issues.push({ type: 'duplicate-id', id: monster.id, names: [seen[monster.id], monster.name] });
            seen[monster.id] = monster.name;
            if (!monster.image) issues.push({ type: 'missing-image', id: monster.id, name: monster.name });
            if ((/凤凰|不死鸟|福克斯/.test(monster.name) || /(^|_)phoenix($|_)/i.test(monster.id)) && monster.image.indexOf('special/phoenix.png') === -1) issues.push({ type: 'phoenix-mismatch', id: monster.id, image: monster.image });
        });
        return issues;
    }

    return {
        normalize: normalize,
        normalizeList: normalizeList,
        normalizePools: normalizePools,
        validate: validate,
        get: function (id) { return records[id] || null; },
        all: function () { return Object.keys(records).map(function (id) { return records[id]; }); }
    };
}());
