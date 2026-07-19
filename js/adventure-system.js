/**
 * adventure-system.js - v26.3 player profile, tactical equipment and adventure map.
 * All state lives inside the existing per-user save object (App.adventure).
 */
(function () {
    'use strict';

    // Keep the original art, but classify it by the character that is actually
    // drawn. The previous four/four split put two girl characters in the boy
    // list, which made a saved "male" profile visibly female.
    var HEROES = {
        male: [
            { file: 'heroes-00.webp', name: '守护骑士', note: '近战与盾牌' },
            { file: 'heroes-02.webp', name: '森林射手', note: '弓箭与探索' }
        ],
        female: [
            { file: 'heroes-01.webp', name: '星辉魔法师', note: '星光魔法' },
            { file: 'heroes-03.webp', name: '日耀骑士', note: '剑盾守护' },
            { file: 'heroes-04.webp', name: '驭龙探险家', note: '伙伴协作' },
            { file: 'heroes-05.webp', name: '灵狐游侠', note: '敏捷双刃' },
            { file: 'heroes-06.webp', name: '星象术士', note: '星球法术' },
            { file: 'heroes-07.webp', name: '水晶女王', note: '水晶魔法' }
        ]
    };
    var HAIRS = { short: '利落短发', wave: '冒险卷发', braid: '守护长辫', crest: '星辉发冠' };
    var OUTFITS = { azure: '苍蓝学徒服', crimson: '赤焰勇者服', forest: '森林游侠服', royal: '皇家守护服' };
    var HATS = { none: '不戴帽子', cap: '探险帽', crown: '星辉冠', hood: '夜行兜帽' };
    var SHOES = { traveler: '轻便旅靴', iron: '精铁战靴', wind: '疾风鞋', snow: '雪原长靴' };

    // Combat equipment has one source of truth. UI, persistence and battle
    // calculations all read these values; switch timing is never duplicated.
    var EQUIPMENT_CONFIG = {
        weaponSwitchCooldown: 60 * 1000,
        minimumOutgoingDamage: 1,
        minimumIncomingDamage: 0
    };
    var quickbarTimer = null;

    var CATALOG = [
        { id: 'outfit_azure', type: 'outfit', value: 'azure', name: '苍蓝学徒服', price: 0, rarity: '普通', icon: '🧥', description: '冒险者的基础服装，轻便醒目。' },
        { id: 'outfit_forest', type: 'outfit', value: 'forest', name: '森林游侠服', price: 240, rarity: '普通', icon: '🥋', description: '低语森林系列的绿色轻装。' },
        { id: 'outfit_crimson', type: 'outfit', value: 'crimson', name: '赤焰勇者服', price: 520, rarity: '稀有', icon: '🦺', description: '带有火山纹路的赤色战衣。' },
        { id: 'outfit_royal', type: 'outfit', value: 'royal', name: '皇家守护服', price: 900, rarity: '史诗', icon: '👘', description: '王城守护者的典礼战衣。' },
        { id: 'hat_none', type: 'hat', value: 'none', name: '不戴帽子', price: 0, rarity: '普通', icon: '✨', description: '展示角色原本的发型。' },
        { id: 'hat_cap', type: 'hat', value: 'cap', name: '探险帽', price: 180, rarity: '普通', icon: '🧢', description: '适合地图探索的轻便帽。' },
        { id: 'hat_hood', type: 'hat', value: 'hood', name: '夜行兜帽', price: 420, rarity: '稀有', icon: '🌙', description: '暗夜行动时使用的游侠兜帽。' },
        { id: 'hat_crown', type: 'hat', value: 'crown', name: '星辉冠', price: 780, rarity: '史诗', icon: '👑', description: '星辉套装的核心外观。' },
        { id: 'shoes_traveler', type: 'shoes', value: 'traveler', name: '轻便旅靴', price: 0, rarity: '普通', icon: '🥾', description: '适合所有地区的基础旅靴。' },
        { id: 'shoes_iron', type: 'shoes', value: 'iron', name: '精铁战靴', price: 220, rarity: '普通', icon: '👢', description: '城堡铁匠打造的结实战靴。' },
        { id: 'shoes_wind', type: 'shoes', value: 'wind', name: '疾风鞋', price: 480, rarity: '稀有', icon: '💨', description: '与疾风连击式组成游侠套装。' },
        { id: 'shoes_snow', type: 'shoes', value: 'snow', name: '雪原长靴', price: 620, rarity: '稀有', icon: '❄️', description: '来自星辉雪峰的冰晶长靴。' },
        { id: 'weapon_sword', type: 'weapon', value: 'sword', name: '守护者长剑', price: 0, rarity: '普通', icon: '⚔️', sprite: 'knight-sword.webp', attack: 1, speed: '均衡', action: '挥剑突进', description: '挥剑、突进并在接触怪物时命中。' },
        { id: 'weapon_bow', type: 'weapon', value: 'bow', name: '精准连弩', price: 360, rarity: '普通', icon: '🏹', sprite: 'precision-crossbow.webp', attack: 2, speed: '快速', action: '拉弓射击', special: '远程命中', description: '拉弓后从武器位置射出箭矢。' },
        { id: 'weapon_staff', type: 'weapon', value: 'staff', name: '星辉法杖', price: 560, rarity: '稀有', icon: '🪄', sprite: 'star-staff.webp', attack: 3, speed: '均衡', action: '蓄力施法', special: '强化魔法', description: '蓄力后发射星光法术弹。' },
        { id: 'weapon_hammer', type: 'weapon', value: 'hammer', name: '守护战锤', price: 820, rarity: '史诗', icon: '🔨', sprite: 'guardian-hammer.webp', attack: 4, speed: '较慢', action: '跃进重击', special: '高基础伤害', description: '高举战锤，跃近怪物后重击。' },
        { id: 'shield_blue', type: 'shield', value: 'blue', name: '学徒盾', price: 0, rarity: '普通', icon: '🛡️', defense: 0, reduction: 0, action: '举盾格挡', description: '基础格挡动作与蓝色防御反馈。' },
        { id: 'shield_sun', type: 'shield', value: 'sun', name: '日耀盾', price: 440, rarity: '稀有', icon: '🌞', defense: 1, reduction: 1, action: '日耀格挡', description: '每次受到攻击最多减少1点伤害。' },
        { id: 'shield_dragon', type: 'shield', value: 'dragon', name: '龙纹盾', price: 760, rarity: '史诗', icon: '🐉', defense: 2, reduction: 2, action: '龙纹重盾格挡', description: '每次受到攻击最多减少2点伤害。' },
        { id: 'magic_spark', type: 'magic', value: 'spark', name: '星光弹', price: 0, rarity: '普通', icon: '✨', magicAttack: 1, cooldown: 8, effect: '星光伤害', description: '答对题目时自动附加1点星光伤害。' },
        { id: 'magic_frost', type: 'magic', value: 'frost', name: '霜晶术', price: 380, rarity: '稀有', icon: '❄️', magicAttack: 2, cooldown: 12, effect: '霜晶伤害', description: '答对题目时自动附加2点霜晶伤害。' },
        { id: 'magic_flame', type: 'magic', value: 'flame', name: '赤焰术', price: 620, rarity: '史诗', icon: '🔥', magicAttack: 3, cooldown: 15, effect: '火焰伤害', description: '答对题目时自动附加3点火焰伤害。' },
        { id: 'magic_lightning', type: 'magic', value: 'lightning', name: '雷鸣术', price: 900, rarity: '传说', icon: '⚡', magicAttack: 4, cooldown: 20, effect: '雷电伤害', description: '答对题目时自动附加4点雷电伤害。' },
        { id: 'combo_guardian', type: 'combo', value: 'guardian', name: '守护基础式', price: 0, rarity: '普通', icon: '📘', description: '稳定的基础武器动作，无连击门槛。', activation: '随时发动' },
        { id: 'combo_gale', type: 'combo', value: 'gale', name: '疾风三连式', price: 420, rarity: '稀有', icon: '🌪️', description: '连击达到3时追加两道疾风残影。', activation: '3连击激活', comboRequired: 3 },
        { id: 'combo_starfall', type: 'combo', value: 'starfall', name: '星落五芒阵', price: 720, rarity: '史诗', icon: '🌠', description: '连击达到5时召出环绕怪物的星阵。', activation: '5连击激活', comboRequired: 5 },
        { id: 'combo_dragon', type: 'combo', value: 'dragon', name: '龙魂终结式', price: 1100, rarity: '传说', icon: '🐲', description: '连击达到10时释放龙魂终结演出。', activation: '10连击激活', comboRequired: 10 },
        { id: 'effect_none', type: 'effect', value: 'none', name: '经典命中', price: 0, rarity: '普通', icon: '✦', description: '清晰简洁的经典碰撞火花。' },
        { id: 'effect_stars', type: 'effect', value: 'stars', name: '星光命中特效', price: 300, rarity: '稀有', icon: '🌟', description: '每次命中都会绽放金色星光。' },
        { id: 'effect_frost', type: 'effect', value: 'frost', name: '霜晶命中特效', price: 460, rarity: '稀有', icon: '❄️', description: '命中位置迸发蓝白色霜晶。' },
        { id: 'effect_flame', type: 'effect', value: 'flame', name: '赤焰命中特效', price: 560, rarity: '史诗', icon: '🔥', description: '命中位置出现温和的火焰爆闪。' },
        { id: 'effect_lightning', type: 'effect', value: 'lightning', name: '雷鸣命中特效', price: 680, rarity: '史诗', icon: '⚡', description: '命中时出现紫蓝色雷鸣闪光。' }
    ];

    var SHOP_CATEGORIES = [
        { id: 'all', label: '全部商品', icon: '🏪' },
        { id: 'appearance', label: '外观穿搭', icon: '👕', types: ['outfit', 'hat', 'shoes'] },
        { id: 'weapon', label: '战斗武器', icon: '⚔️', types: ['weapon'] },
        { id: 'defense', label: '守护防具', icon: '🛡️', types: ['shield'] },
        { id: 'magic', label: '战斗魔法', icon: '🔮', types: ['magic'] },
        { id: 'combo', label: '连击战技', icon: '📚', types: ['combo'] },
        { id: 'effect', label: '命中特效', icon: '✨', types: ['effect'] }
    ];

    var EQUIPMENT_SETS = [
        { name: '森林疾风套装', icon: '🌲', items: ['outfit_forest', 'shoes_wind', 'weapon_bow', 'combo_gale'], note: '集齐并装备后出现绿色疾风套装光环。' },
        { name: '皇家星落套装', icon: '🌟', items: ['outfit_royal', 'hat_crown', 'weapon_staff', 'combo_starfall', 'effect_stars'], note: '集齐并装备后出现星辉套装光环。' },
        { name: '赤焰龙魂套装', icon: '🐉', items: ['outfit_crimson', 'weapon_hammer', 'shield_dragon', 'combo_dragon', 'effect_flame'], note: '集齐并装备后出现龙焰套装光环。' }
    ];
    var STARTER_ITEMS = ['outfit_azure', 'hat_none', 'shoes_traveler', 'weapon_sword', 'shield_blue', 'magic_spark', 'combo_guardian', 'effect_none'];

    var LOCATIONS = [
        { id: 'village', name: '晨光村', icon: '🏡', module: 'xiaojiujiu', mission: '帮助村民修复九九能量灯', reward: '铜钥匙', enemies: '数字史莱姆、符号蝙蝠', difficulty: '入门' },
        { id: 'forest', name: '低语森林', icon: '🌲', module: 'times', mission: '找回被偷走的乘法路标', reward: '1颗宝石', enemies: '藤蔓精、时钟灵', difficulty: '简单' },
        { id: 'cave', name: '水晶洞穴', icon: '💎', module: 'fraction', mission: '拼合破碎的分数水晶', reward: '银钥匙', enemies: '岩甲兽、分数幽灵', difficulty: '普通' },
        { id: 'desert', name: '流沙荒漠', icon: '🏜️', module: 'decimal', mission: '追回装着小数星尘的商队', reward: '1颗宝石', enemies: '沙尘妖、云路怪', difficulty: '普通' },
        { id: 'castle', name: '封印城堡', icon: '🏰', module: 'unit', mission: '用正确单位开启城门机关', reward: '金钥匙', enemies: '机关守卫、雷纹怪', difficulty: '困难' },
        { id: 'snowpeak', name: '星辉雪峰', icon: '🏔️', module: 'multiply', mission: '点亮通往塔顶的最后信标', reward: '1颗宝石', enemies: '雪影精、幻境妖', difficulty: '困难' },
        { id: 'tower', name: '怪物塔', icon: '🗼', module: 'tower', mission: '逐层救出居民并夺回能量宝石', reward: '塔层宝箱与卡牌', enemies: '塔卫、首领与暗影王', difficulty: '递增' }
    ];

    function defaultState() {
        var user = UserManager.getCurrentUser();
        var initialProfile = user && user.profile ? user.profile : {};
        var legacyTowerEligible = (Number(App.stats.totalScore) || 0) >= 500;
        return {
            version: 1,
            profile: Object.assign({
                name: user ? user.name : '小勇士', gender: 'male', face: 0,
                hair: 'short', outfit: 'azure', hat: 'none', shoes: 'traveler',
                weapon: 'sword', shield: 'blue', magic: 'spark', combo: 'guardian', effect: 'none'
            }, initialProfile, { name: user ? user.name : (initialProfile.name || '小勇士') }),
            coins: Math.max(0, Number(App.stats.totalScore) || 0),
            owned: STARTER_ITEMS.slice(),
            storySeen: false,
            currentLocation: 'village',
            unlocked: legacyTowerEligible ? ['village', 'tower'] : ['village'], completed: [],
            // Preserve the old 500-point tower entitlement during migration by
            // converting it to one bronze key; new players earn it on the map.
            keys: { bronze: legacyTowerEligible ? 1 : 0, silver: 0, gold: 0 }, gems: 0,
            towerGates: { floor1: false, floor11: false, floor21: false, floor30: false },
            cooldowns: { weaponSwitchUntil: 0, magicReadyAt: {} }
        };
    }

    function escapeHtml(text) {
        return String(text == null ? '' : text).replace(/[&<>'"]/g, function (c) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[c];
        });
    }

    var AdventureSystem = {
        catalog: CATALOG,
        config: EQUIPMENT_CONFIG,
        locations: LOCATIONS,

        ensureState: function (reset) {
            if (reset || !App.adventure) App.adventure = defaultState();
            var base = defaultState();
            var baseProfile = Object.assign({}, base.profile);
            var baseKeys = Object.assign({}, base.keys);
            var baseTowerGates = Object.assign({}, base.towerGates);
            var baseCooldowns = Object.assign({}, base.cooldowns);
            App.adventure = Object.assign(base, App.adventure || {});
            App.adventure.profile = Object.assign(baseProfile, App.adventure.profile || {});
            App.adventure.profile.gender = App.adventure.profile.gender === 'female' ? 'female' : 'male';
            var availableRoles = HEROES[App.adventure.profile.gender];
            var savedRole = Number(App.adventure.profile.face);
            App.adventure.profile.face = Number.isInteger(savedRole) && savedRole >= 0 && savedRole < availableRoles.length ? savedRole : 0;
            App.adventure.keys = Object.assign(baseKeys, App.adventure.keys || {});
            App.adventure.towerGates = Object.assign(baseTowerGates, App.adventure.towerGates || {});
            App.adventure.cooldowns = Object.assign(baseCooldowns, App.adventure.cooldowns || {});
            App.adventure.cooldowns.magicReadyAt = Object.assign({}, (App.adventure.cooldowns && App.adventure.cooldowns.magicReadyAt) || {});
            App.adventure.owned = Array.isArray(App.adventure.owned) ? App.adventure.owned : base.owned;
            STARTER_ITEMS.forEach(function (id) { if (!App.adventure.owned.includes(id)) App.adventure.owned.push(id); });
            App.adventure.unlocked = Array.isArray(App.adventure.unlocked) ? App.adventure.unlocked : ['village'];
            App.adventure.completed = Array.isArray(App.adventure.completed) ? App.adventure.completed : [];
            if (!Number.isFinite(Number(App.adventure.coins))) App.adventure.coins = Number(App.stats.totalScore) || 0;
            return App.adventure;
        },

        creditCoins: function (amount) {
            this.ensureState();
            App.adventure.coins += Math.max(0, Number(amount) || 0);
            this.updateBalances();
        },

        getProfile: function () { return this.ensureState().profile; },
        getItem: function (id) { return CATALOG.find(function (item) { return item.id === id; }); },
        getEquippedItem: function (type) {
            var value = this.getProfile()[type];
            return CATALOG.find(function (item) { return item.type === type && item.value === value; });
        },

        getOwnedItems: function (type) {
            var state = this.ensureState();
            return CATALOG.filter(function (item) { return item.type === type && state.owned.includes(item.id); });
        },

        weaponSwitchRemaining: function () {
            return Math.max(0, Number(this.ensureState().cooldowns.weaponSwitchUntil) - Date.now());
        },

        itemStats: function (item) {
            if (!item) return [];
            if (item.type === 'weapon') return ['基础攻击 +' + item.attack, '动作：' + item.action, '速度：' + item.speed].concat(item.special ? ['特性：' + item.special] : []);
            if (item.type === 'shield') return ['防御力 ' + item.defense, '最多减伤 ' + item.reduction, '动作：' + item.action];
            if (item.type === 'magic') return ['魔法攻击 +' + item.magicAttack, '冷却 ' + item.cooldown + '秒', '效果：' + item.effect];
            return item.activation ? [item.activation] : [];
        },

        itemStatsMarkup: function (item) {
            var stats = this.itemStats(item);
            return stats.length ? '<ul class="equipment-stat-list">' + stats.map(function (stat) { return '<li>' + escapeHtml(stat) + '</li>'; }).join('') + '</ul>' : '';
        },

        getCombatWeapon: function () {
            var item = this.getEquippedItem('weapon') || this.getItem('weapon_sword');
            return { id: item.id, name: item.name, emoji: item.icon, icon: item.icon, attack: item.attack, sprite: item.sprite, action: item.action, weight: 1 };
        },

        calculateOutgoingDamage: function (learningDamage, monster, consumeMagic) {
            var weapon = this.getEquippedItem('weapon') || this.getItem('weapon_sword');
            var magic = this.getEquippedItem('magic') || this.getItem('magic_spark');
            var state = this.ensureState();
            var now = Date.now();
            var magicReadyAt = Number(state.cooldowns.magicReadyAt[magic.id]) || 0;
            var magicUsed = !!consumeMagic && now >= magicReadyAt;
            var magicDamage = magicUsed ? Number(magic.magicAttack) || 0 : 0;
            var weaponBonus = Math.max(0, (Number(weapon.attack) || 1) - 1);
            var monsterDefense = Math.max(0, Number(monster && monster.defense) || 0);
            var rawDamage = Math.max(1, Number(learningDamage) || 1) + weaponBonus + magicDamage;
            var finalDamage = Math.max(EQUIPMENT_CONFIG.minimumOutgoingDamage, rawDamage - monsterDefense);
            if (magicUsed) {
                state.cooldowns.magicReadyAt[magic.id] = now + (Number(magic.cooldown) || 0) * 1000;
                saveProgress();
            }
            var result = {
                learningDamage: Number(learningDamage) || 1,
                weapon: weapon,
                weaponBonus: weaponBonus,
                magic: magic,
                magicUsed: magicUsed,
                magicDamage: magicDamage,
                magicRemaining: Math.max(0, magicReadyAt - now),
                monsterDefense: monsterDefense,
                rawDamage: rawDamage,
                finalDamage: finalDamage
            };
            if (App.battle) App.battle.lastEquipmentAttack = result;
            this.renderBattleQuickbar();
            return result;
        },

        calculateIncomingDamage: function (rawDamage) {
            var shield = this.getEquippedItem('shield') || this.getItem('shield_blue');
            var raw = Math.max(0, Number(rawDamage) || 0);
            var reduction = Math.min(raw, Math.max(0, Number(shield.reduction) || 0));
            return { rawDamage: raw, shield: shield, reduction: reduction, finalDamage: Math.max(EQUIPMENT_CONFIG.minimumIncomingDamage, raw - reduction) };
        },

        itemTypeName: function (type) {
            return ({ outfit: '衣服', shoes: '鞋子', hat: '帽子', weapon: '武器', shield: '盾牌', magic: '魔法', combo: '连击战技', effect: '命中特效' })[type] || '装备';
        },

        activeSet: function (profile) {
            profile = profile || this.getProfile();
            return EQUIPMENT_SETS.find(function (set) {
                return set.items.every(function (id) {
                    var item = CATALOG.find(function (entry) { return entry.id === id; });
                    return item && profile[item.type] === item.value;
                });
            }) || null;
        },

        heroMarkup: function (profile, className) {
            profile = profile || this.getProfile();
            var gender = profile.gender === 'female' ? 'female' : 'male';
            var roles = HEROES[gender];
            var requestedFace = Number(profile.face);
            var face = Number.isInteger(requestedFace) && requestedFace >= 0 && requestedFace < roles.length ? requestedFace : 0;
            var role = roles[face];
            var weapon = CATALOG.find(function (item) { return item.type === 'weapon' && item.value === profile.weapon; }) || CATALOG[12];
            var hatIcon = { none: '', cap: '🧢', crown: '👑', hood: '◾' }[profile.hat] || '';
            var hairIcon = { short: '✦', wave: '〰', braid: '❧', crest: '✧' }[profile.hair] || '✦';
            var shieldIcon = { blue: '🛡️', sun: '🔆', dragon: '🐲' }[profile.shield] || '🛡️';
            var activeSet = this.activeSet(profile);
            return '<span class="adventure-hero-composite outfit-' + escapeHtml(profile.outfit) + ' shoes-' + escapeHtml(profile.shoes) + ' combo-' + escapeHtml(profile.combo) + (activeSet ? ' active-equipment-set' : '') + ' ' + (className || '') + '">' +
                '<img class="adventure-hero-base" src="assets/characters/heroes/' + role.file + '" alt="' + escapeHtml(profile.name) + '，' + escapeHtml(role.name) + '">' +
                '<span class="adventure-hair hair-' + escapeHtml(profile.hair) + '">' + hairIcon + '</span>' +
                (hatIcon ? '<span class="adventure-hat hat-' + escapeHtml(profile.hat) + '">' + hatIcon + '</span>' : '') +
                '<span class="adventure-shield shield-' + escapeHtml(profile.shield) + '">' + shieldIcon + '</span>' +
                '<img class="adventure-equipped-weapon weapon-' + escapeHtml(profile.weapon) + '" src="assets/weapons/sprites/' + weapon.sprite + '" alt="' + escapeHtml(weapon.name) + '">' +
                '<span class="adventure-shoes-mark">◆</span></span>';
        },

        renderCurrentHero: function (target, className) {
            if (!target) return;
            target.innerHTML = this.heroMarkup(this.getProfile(), className);
        },

        updateBalances: function () {
            this.ensureState();
            var nodes = [document.getElementById('total-score'), document.getElementById('shop-balance')];
            nodes.forEach(function (node) { if (node) node.textContent = App.adventure.coins; });
        },

        syncUser: function () {
            var current = UserManager.getCurrentUser();
            if (!current) return;
            var profile = this.getProfile();
            var users = UserManager.getUsers();
            var user = users.find(function (entry) { return entry.id === current.id; });
            if (user) {
                user.name = profile.name;
                user.profile = Object.assign({}, profile);
                user.avatar = profile.gender === 'female' ? '🏹' : '⚔️';
                UserManager.saveUsers(users);
            }
            saveProgress();
            if (typeof updateCurrentUserBadge === 'function') updateCurrentUserBadge();
        },

        openCharacter: function () { this.renderCharacter(); showPage('character'); },
        renderCharacter: function () {
            var state = this.ensureState(), p = state.profile;
            var selectedRole = HEROES[p.gender][p.face] || HEROES[p.gender][0];
            var content = document.getElementById('character-editor-content');
            if (!content) return;
            content.innerHTML = '<div class="character-studio">' +
                '<section class="character-preview-panel"><div id="character-live-preview" class="character-live-preview">' + this.heroMarkup(p, 'editor-hero') + '</div>' +
                '<strong id="character-preview-name">' + escapeHtml(p.name) + '</strong><span id="character-preview-role">' + escapeHtml(selectedRole.name) + ' · 战斗形象会同步更新</span></section>' +
                '<form id="character-form" class="character-form">' +
                '<label class="character-field"><span>玩家名字</span><input id="profile-name" maxlength="16" value="' + escapeHtml(p.name) + '" required></label>' +
                this.genderChoiceGroup(p.gender) +
                '<div id="character-role-step">' + this.roleChoiceGroup(p.gender, p.face) + '</div>' +
                this.choiceGroup('hair', '发型', HAIRS, p.hair) +
                this.ownedChoiceGroup('outfit', '衣服', OUTFITS, p.outfit) +
                this.ownedChoiceGroup('hat', '帽子', HATS, p.hat) +
                this.ownedChoiceGroup('shoes', '鞋子', SHOES, p.shoes) +
                this.ownedItemGroup('weapon', '武器', p.weapon) +
                this.ownedItemGroup('shield', '盾牌', p.shield) +
                this.ownedItemGroup('magic', '魔法', p.magic) +
                this.ownedItemGroup('combo', '连击战技', p.combo) +
                this.ownedItemGroup('effect', '命中特效', p.effect) +
                '<div class="character-actions"><button type="submit" class="adventure-primary-btn">保存并装备</button><button type="button" id="character-go-shop" class="adventure-secondary-btn">去商店解锁更多</button></div>' +
                '</form></div>';
            var self = this;
            content.querySelector('#character-form').addEventListener('change', function (event) {
                if (event.target && event.target.name === 'gender') self.renderRoleChoices(event.target.value);
                self.previewCharacter();
            });
            content.querySelector('#profile-name').addEventListener('input', function () { self.previewCharacter(); });
            content.querySelector('#character-form').addEventListener('submit', function (event) { event.preventDefault(); self.saveCharacter(); });
            content.querySelector('#character-go-shop').onclick = function () { self.openShop(); };
        },

        choiceGroup: function (name, title, options, selected) {
            return '<fieldset class="character-field"><legend>' + title + '</legend><div class="appearance-options">' + Object.keys(options).map(function (value) {
                return '<label><input type="radio" name="' + name + '" value="' + value + '" ' + (String(value) === String(selected) ? 'checked' : '') + '><span>' + options[value] + '</span></label>';
            }).join('') + '</div></fieldset>';
        },

        genderChoiceGroup: function (selected) {
            var genders = [
                { value: 'male', icon: '👦', english: 'Boy', chinese: '男孩', note: '显示男孩角色' },
                { value: 'female', icon: '👧', english: 'Girl', chinese: '女孩', note: '显示女孩角色' }
            ];
            return '<fieldset class="character-field character-gender-step"><legend><b>第 1 步</b> 选择 Boy / Girl</legend><div class="gender-options">' + genders.map(function (gender) {
                return '<label><input type="radio" name="gender" value="' + gender.value + '" ' + (gender.value === selected ? 'checked' : '') + '><span><i>' + gender.icon + '</i><strong>' + gender.english + ' · ' + gender.chinese + '</strong><small>' + gender.note + '</small></span></label>';
            }).join('') + '</div></fieldset>';
        },

        roleChoiceGroup: function (gender, selected) {
            gender = gender === 'female' ? 'female' : 'male';
            var roles = HEROES[gender];
            var chosen = Number(selected);
            if (!Number.isInteger(chosen) || chosen < 0 || chosen >= roles.length) chosen = 0;
            return '<fieldset class="character-field character-role-field"><legend><b>第 2 步</b> 选择具体的' + (gender === 'female' ? '女孩' : '男孩') + '角色</legend><p class="role-step-hint">选择角色基础形象，之后还可以继续更换发型和装备。</p><div class="role-options">' + roles.map(function (role, index) {
                return '<label><input type="radio" name="face" value="' + index + '" ' + (index === chosen ? 'checked' : '') + '><span class="role-option-card"><img src="assets/characters/heroes/' + role.file + '" alt="' + escapeHtml(role.name) + '"><strong>' + escapeHtml(role.name) + '</strong><small>' + escapeHtml(role.note) + '</small></span></label>';
            }).join('') + '</div></fieldset>';
        },

        renderRoleChoices: function (gender) {
            var target = document.getElementById('character-role-step');
            if (!target) return;
            target.innerHTML = this.roleChoiceGroup(gender, 0);
        },

        ownedChoiceGroup: function (type, title, labels, selected) {
            var ownedValues = CATALOG.filter(function (item) { return item.type === type && App.adventure.owned.includes(item.id); }).map(function (item) { return item.value; });
            var choices = {};
            Object.keys(labels).forEach(function (value) { if (ownedValues.includes(value)) choices[value] = labels[value]; });
            return this.choiceGroup(type, title, choices, selected);
        },

        ownedItemGroup: function (type, title, selected) {
            var self = this;
            var items = CATALOG.filter(function (item) { return item.type === type && App.adventure.owned.includes(item.id); });
            return '<fieldset class="character-field"><legend>' + title + '</legend><div class="appearance-options equipment-choice-options">' + items.map(function (item) {
                return '<label><input type="radio" name="' + type + '" value="' + item.value + '" ' + (String(item.value) === String(selected) ? 'checked' : '') + '><span><b>' + item.icon + ' ' + escapeHtml(item.name) + '</b><small>' + escapeHtml(self.itemStats(item).join(' · ')) + '</small></span></label>';
            }).join('') + '</div></fieldset>';
        },

        formProfile: function () {
            var form = document.getElementById('character-form'), old = this.getProfile();
            function val(name) { var n = form && form.querySelector('[name="' + name + '"]:checked'); return n ? n.value : old[name]; }
            return Object.assign({}, old, {
                name: ((document.getElementById('profile-name') || {}).value || old.name).trim().slice(0, 16),
                gender: val('gender'), face: Number(val('face')), hair: val('hair'), outfit: val('outfit'),
                hat: val('hat'), shoes: val('shoes'), weapon: val('weapon'), shield: val('shield'),
                magic: val('magic'), combo: val('combo'), effect: val('effect')
            });
        },

        previewCharacter: function () {
            var profile = this.formProfile(), preview = document.getElementById('character-live-preview');
            if (preview) preview.innerHTML = this.heroMarkup(profile, 'editor-hero');
            var name = document.getElementById('character-preview-name'); if (name) name.textContent = profile.name || '小勇士';
            var role = HEROES[profile.gender][profile.face] || HEROES[profile.gender][0];
            var roleName = document.getElementById('character-preview-role');
            if (roleName) roleName.textContent = role.name + ' · 战斗形象会同步更新';
        },

        saveCharacter: function () {
            var previous = Object.assign({}, this.getProfile());
            var profile = this.formProfile();
            if (!profile.name) { alert('请先输入玩家名字'); return; }
            var blockedWeaponSwitch = profile.weapon !== previous.weapon && this.weaponSwitchRemaining() > 0;
            if (blockedWeaponSwitch) profile.weapon = previous.weapon;
            App.adventure.profile = profile;
            this.syncUser();
            this.updateBattleHero();
            this.renderCharacter();
            this.toast(blockedWeaponSwitch ? '武器切换冷却中；其他角色设置已经保存' : '✅ ' + profile.name + ' 的角色和装备已经保存');
        },

        openShop: function () { this.renderShop(this.shopFilter || 'all'); showPage('shop'); },
        renderShop: function (filter) {
            this.updateBalances();
            var content = document.getElementById('shop-content'); if (!content) return;
            var p = this.getProfile(), state = App.adventure, self = this;
            filter = SHOP_CATEGORIES.some(function (category) { return category.id === filter; }) ? filter : 'all';
            this.shopFilter = filter;
            var category = SHOP_CATEGORIES.find(function (entry) { return entry.id === filter; });
            var visibleItems = CATALOG.filter(function (item) { return filter === 'all' || category.types.includes(item.type); });
            var loadoutTypes = ['weapon', 'shield', 'magic', 'combo', 'effect'];
            var loadout = loadoutTypes.map(function (type) { var item = self.getEquippedItem(type); return item ? '<span><i>' + item.icon + '</i><small>' + self.itemTypeName(type) + '</small><strong>' + escapeHtml(item.name) + '</strong></span>' : ''; }).join('');
            var sets = EQUIPMENT_SETS.map(function (set) {
                var ownedCount = set.items.filter(function (id) { return state.owned.includes(id); }).length;
                var equipped = set.items.every(function (id) { var item = self.getItem(id); return item && p[item.type] === item.value; });
                return '<article class="shop-set-card ' + (equipped ? 'complete' : '') + '"><b>' + set.icon + ' ' + set.name + '</b><span>' + (equipped ? '套装已装备' : '已收藏 ' + ownedCount + '/' + set.items.length) + '</span><div><i style="width:' + Math.round(ownedCount / set.items.length * 100) + '%"></i></div><small>' + set.note + '</small></article>';
            }).join('');
            content.innerHTML = '<section class="shop-command-center"><div class="shop-hero-stage">' + this.heroMarkup(p, 'shop-preview-hero') + '</div><div class="shop-command-copy"><span class="shop-eyebrow">冒险者补给中心</span><h3>' + escapeHtml(p.name) + '的战斗配置</h3><p>武器决定攻击与动作，盾牌参与实际减伤，魔法拥有独立伤害和冷却；这里显示的属性就是战斗读取的数据。</p><div class="shop-loadout">' + loadout + '</div></div><div class="shop-wallet"><small>可用积分</small><strong>⭐ ' + state.coins + '</strong><span>终身总分 ' + App.stats.totalScore + ' 不会减少</span></div></section>' +
                '<nav class="shop-category-tabs" aria-label="商品分类">' + SHOP_CATEGORIES.map(function (entry) { var count = CATALOG.filter(function (item) { return entry.id === 'all' || entry.types.includes(item.type); }).length; return '<button class="shop-category-btn ' + (entry.id === filter ? 'active' : '') + '" data-shop-filter="' + entry.id + '"><span>' + entry.icon + '</span>' + entry.label + '<small>' + count + '</small></button>'; }).join('') + '</nav>' +
                '<section class="shop-set-section"><div class="shop-section-heading"><div><span>组合收藏</span><h3>主题套装进度</h3></div><p>套装改变形象和战斗演出；单件武器、盾牌和魔法的属性会真实参与计算。</p></div><div class="shop-set-grid">' + sets + '</div></section>' +
                '<div class="shop-section-heading shop-products-heading"><div><span>' + category.icon + '</span><h3>' + category.label + '</h3></div><p>购买后自动装备，也可在“角色与装备”页面随时切换。</p></div><div class="shop-grid">' + visibleItems.map(function (item) {
                var owned = state.owned.includes(item.id), equipped = p[item.type] === item.value;
                return '<article class="shop-item rarity-' + item.rarity + ' ' + (owned ? 'owned' : '') + '"><div class="shop-item-icon">' + (item.sprite ? '<img src="assets/weapons/sprites/' + item.sprite + '" alt="' + escapeHtml(item.name) + '">' : item.icon) + '</div><div class="shop-item-copy"><div class="shop-item-meta"><span class="shop-rarity">' + item.rarity + '</span><span>' + self.itemTypeName(item.type) + '</span></div><h3>' + item.name + '</h3><p>' + item.description + '</p>' + self.itemStatsMarkup(item) + (item.activation ? '<em>⚡ ' + item.activation + '</em>' : '') + '</div>' +
                    '<div class="shop-item-footer"><span>' + (owned ? '✓ 已拥有' : item.price === 0 ? '新手赠送' : '价格 ⭐ ' + item.price) + '</span><button class="shop-action-btn" data-item="' + item.id + '" ' + (equipped ? 'disabled' : '') + '>' + (equipped ? '正在使用' : owned ? '立即装备' : '购买并装备') + '</button></div></article>';
            }).join('') + '</div>';
            content.querySelectorAll('.shop-category-btn').forEach(function (button) { button.onclick = function () { self.renderShop(button.dataset.shopFilter); }; });
            content.querySelectorAll('.shop-action-btn[data-item]').forEach(function (button) { button.onclick = function () { self.buyOrEquip(button.dataset.item); }; });
        },

        buyOrEquip: function (id) {
            var item = this.getItem(id), state = this.ensureState(); if (!item) return;
            var purchasedNow = false;
            if (!state.owned.includes(id)) {
                if (state.coins < item.price) { this.toast('积分不足，还差 ' + (item.price - state.coins) + ' 分'); return; }
                state.coins -= item.price; state.owned.push(id);
                purchasedNow = true;
            }
            if (item.type === 'weapon' && state.profile.weapon !== item.value && this.weaponSwitchRemaining() > 0) {
                saveProgress(); this.renderShop(this.shopFilter || 'all'); this.updateBalances();
                this.toast((purchasedNow ? '🎉 已购买；' : '') + '武器切换冷却结束后才能装备');
                return;
            }
            state.profile[item.type] = item.value;
            this.syncUser(); this.updateBattleHero(); this.renderShop(this.shopFilter || 'all'); this.updateBalances();
            this.toast((purchasedNow ? '🎉 购买成功，' : '✅ ') + '已装备' + item.name);
        },

        openStory: function (firstVisit) {
            this.renderStory(firstVisit); showPage('story');
        },
        renderStory: function (firstVisit) {
            var content = document.getElementById('story-content'); if (!content) return;
            var panels = [
                ['🌟', '能量宝石守护着六境', '晨光村、森林和雪峰原本充满光明，孩子们用数学魔法让机关运转。'],
                ['🌑', '暗影王偷走了宝石', '怪物占领了高塔，路标熄灭，居民被困。它们不是普通小动物，而是暗影王制造的魔法守卫。'],
                ['🗝️', '你的任务', '完成各地数学任务，找回三把钥匙与三颗宝石，逐层打开怪物塔，救出居民并让六境重现光明。']
            ];
            content.innerHTML = '<div class="story-comic">' + panels.map(function (panel, i) { return '<article class="story-panel"><span class="story-number">' + (i + 1) + '</span><div class="story-panel-art">' + panel[0] + '</div><h3>' + panel[1] + '</h3><p>' + panel[2] + '</p></article>'; }).join('') + '</div><div class="story-actions"><button id="story-start-map" class="adventure-primary-btn">' + (firstVisit ? '接受任务，创建我的角色' : '查看冒险地图') + '</button></div>';
            var self = this;
            document.getElementById('story-start-map').onclick = function () { self.markStorySeen(); if (firstVisit) self.openCharacter(); else self.openMap(); };
            document.getElementById('story-skip').onclick = function () { self.markStorySeen(); showPage('home'); };
        },
        markStorySeen: function () { this.ensureState().storySeen = true; saveProgress(); },

        openMap: function () { this.renderMap(); showPage('map'); },
        renderMap: function () {
            var content = document.getElementById('map-content'), state = this.ensureState(); if (!content) return;
            content.innerHTML = '<div class="map-inventory"><span>🗝️ 铜 ' + state.keys.bronze + '</span><span>🗝️ 银 ' + state.keys.silver + '</span><span>🗝️ 金 ' + state.keys.gold + '</span><span>💎 宝石 ' + state.gems + '/3</span></div>' +
                '<div class="adventure-map" aria-label="冒险关卡地图">' + LOCATIONS.map(function (loc, index) {
                    var done = state.completed.includes(loc.id), open = state.unlocked.includes(loc.id) || loc.id === 'tower' && state.keys.bronze > 0;
                    var status = done ? '已完成' : open ? '可以进入' : '尚未解锁';
                    return '<button class="map-node ' + (done ? 'completed' : open ? 'available' : 'locked') + ' map-node-' + index + '" data-location="' + loc.id + '" ' + (!open ? 'disabled' : '') + '><span class="map-node-icon">' + loc.icon + '</span><strong>' + loc.name + '</strong><small>' + status + '</small></button>';
                }).join('') + '<div class="map-route" aria-hidden="true"></div></div><div id="map-mission-detail" class="map-mission-detail"><p>点击一个已解锁地点查看任务。</p></div>';
            var self = this;
            content.querySelectorAll('.map-node:not(:disabled)').forEach(function (node) { node.onclick = function () { self.showLocation(node.dataset.location); }; });
            var current = LOCATIONS.find(function (loc) { return loc.id === state.currentLocation && (state.unlocked.includes(loc.id) || loc.id === 'tower'); }) || LOCATIONS[0];
            this.showLocation(current.id);
        },

        showLocation: function (id) {
            var loc = LOCATIONS.find(function (entry) { return entry.id === id; }); if (!loc) return;
            App.adventure.currentLocation = id; saveProgress();
            document.querySelectorAll('.map-node').forEach(function (node) { node.classList.toggle('current', node.dataset.location === id); });
            var detail = document.getElementById('map-mission-detail'); if (!detail) return;
            var requirement = id === 'tower' ? '需要：铜钥匙打开第1层；更高区域需要银钥匙、金钥匙和宝石。' : '完成本任务后自动解锁下一地区。';
            detail.innerHTML = '<div class="mission-location-icon">' + loc.icon + '</div><div><span class="mission-difficulty">' + loc.difficulty + '</span><h3>' + loc.name + '：' + loc.mission + '</h3><p>可能遇到：' + loc.enemies + '</p><p>奖励：' + loc.reward + '</p><p class="mission-requirement">' + requirement + '</p></div><button id="start-map-mission" class="adventure-primary-btn">' + (id === 'tower' ? '进入怪物塔' : '开始任务') + '</button>';
            document.getElementById('start-map-mission').onclick = function () {
                if (id === 'tower') { if (typeof BattleMode !== 'undefined') BattleMode.showTowerLobby(); }
                else { App.currentModule = loc.module; startPractice(loc.module); }
            };
        },

        completeModuleMission: function (module) {
            var state = this.ensureState(), index = LOCATIONS.findIndex(function (loc) { return loc.module === module; });
            if (index < 0 || LOCATIONS[index].id === 'tower') return;
            var loc = LOCATIONS[index];
            if (!state.completed.includes(loc.id)) {
                state.completed.push(loc.id);
                var next = LOCATIONS[index + 1]; if (next && !state.unlocked.includes(next.id)) state.unlocked.push(next.id);
                if (loc.id === 'village') state.keys.bronze++;
                if (loc.id === 'cave') state.keys.silver++;
                if (loc.id === 'castle') state.keys.gold++;
                if (['forest', 'desert', 'snowpeak'].includes(loc.id)) state.gems++;
                this.toast('🗺️ 地图任务完成：获得' + loc.reward + '，新地区已解锁！');
                saveProgress();
            }
        },

        towerGateRequirement: function (floor) {
            if (floor === 1) return { gate: 'floor1', type: 'key', key: 'bronze', amount: 1, label: '铜钥匙' };
            if (floor === 11) return { gate: 'floor11', type: 'key', key: 'silver', amount: 1, label: '银钥匙' };
            if (floor === 21) return { gate: 'floor21', type: 'key', key: 'gold', amount: 1, label: '金钥匙' };
            if (floor === 30) return { gate: 'floor30', type: 'gems', amount: 3, label: '3颗宝石' };
            return null;
        },
        canOpenTowerFloor: function (floor) {
            var req = this.towerGateRequirement(floor), state = this.ensureState();
            if (!req || state.towerGates[req.gate]) return true;
            return req.type === 'gems' ? state.gems >= req.amount : state.keys[req.key] >= req.amount;
        },
        unlockTowerFloor: function (floor) {
            var req = this.towerGateRequirement(floor), state = this.ensureState();
            if (!req || state.towerGates[req.gate]) return true;
            if (!this.canOpenTowerFloor(floor)) { this.toast('还需要 ' + req.label + '，先去地图完成任务吧'); return false; }
            if (req.type === 'gems') state.gems -= req.amount; else state.keys[req.key] -= req.amount;
            state.towerGates[req.gate] = true; saveProgress(); this.toast('🔓 ' + req.label + ' 已开启第' + floor + '层区域'); return true;
        },
        rewardTowerFloor: function (floor) {
            var reward = 20 + floor * 5; this.creditCoins(reward);
            if ([10, 20, 29].includes(floor)) App.adventure.gems++;
            saveProgress();
            return reward;
        },

        updateBattleHero: function () {
            var layer = document.querySelector('.hero-char-layer'); if (layer) layer.innerHTML = this.heroMarkup(this.getProfile(), 'battle-profile-hero');
            var weaponLayer = document.querySelector('.hero-weapon-layer'); if (weaponLayer) {
                var item = this.getEquippedItem('weapon');
                weaponLayer.innerHTML = item && item.sprite ? '<img class="equipped-battle-weapon" src="assets/weapons/sprites/' + item.sprite + '" alt="' + item.name + '">' : '';
            }
            this.updateBattleLoadout();
        },

        updateBattleLoadout: function () {
            var heroSide = document.querySelector('.hero-side'); if (!heroSide) return;
            var badge = heroSide.querySelector('.battle-loadout-badge');
            if (!badge) { badge = document.createElement('div'); badge.className = 'battle-loadout-badge'; heroSide.appendChild(badge); }
            var combo = this.getEquippedItem('combo'), count = Number(App.battle && App.battle.combo) || 0;
            var required = Number(combo && combo.comboRequired) || 0;
            badge.classList.toggle('ready', count >= required);
            badge.innerHTML = '<span>' + (combo ? combo.icon : '📘') + '</span><div><strong>' + escapeHtml(combo ? combo.name : '守护基础式') + '</strong><small>' + (required ? (count >= required ? '连击已激活' : count + '/' + required + ' 连击') : '基础战技') + '</small></div>';
        },

        initBattleEquipment: function () {
            var battlePage = document.getElementById('battle-page');
            var arena = battlePage && battlePage.querySelector('.battle-arena');
            if (!battlePage || !arena) return;
            var quickbar = document.getElementById('battle-equipment-quickbar');
            if (!quickbar) {
                quickbar = document.createElement('section');
                quickbar.id = 'battle-equipment-quickbar';
                quickbar.className = 'battle-equipment-quickbar';
                quickbar.setAttribute('aria-label', '战斗装备快捷切换');
                arena.insertAdjacentElement('afterend', quickbar);
            }
            this.updateBattleHero();
            this.renderBattleQuickbar();
            if (quickbarTimer) clearInterval(quickbarTimer);
            var self = this;
            quickbarTimer = setInterval(function () {
                if (!App.battle || !App.battle.active || App.currentPage !== 'battle') return;
                self.renderBattleQuickbar();
            }, 1000);
        },

        equipmentButtonIcon: function (item) {
            return item.sprite ? '<img src="assets/weapons/sprites/' + item.sprite + '" alt="">' : '<span>' + item.icon + '</span>';
        },

        renderBattleQuickbar: function () {
            var target = document.getElementById('battle-equipment-quickbar');
            if (!target) return;
            var self = this, state = this.ensureState(), profile = state.profile, now = Date.now();
            var weaponRemaining = Math.max(0, Number(state.cooldowns.weaponSwitchUntil) - now);
            var groups = [
                { type: 'weapon', label: '武器', icon: '⚔️' },
                { type: 'shield', label: '盾牌', icon: '🛡️' },
                { type: 'magic', label: '魔法', icon: '🔮' }
            ];
            target.innerHTML = groups.map(function (group) {
                var items = self.getOwnedItems(group.type);
                return '<div class="battle-quick-group quick-' + group.type + '"><div class="battle-quick-label"><span>' + group.icon + ' ' + group.label + '</span>' +
                    (group.type === 'weapon' && weaponRemaining > 0 ? '<small>切换冷却 ' + Math.ceil(weaponRemaining / 1000) + 's</small>' : '') + '</div><div class="battle-quick-items">' + items.map(function (item) {
                    var current = profile[group.type] === item.value;
                    var magicRemaining = group.type === 'magic' ? Math.max(0, Number(state.cooldowns.magicReadyAt[item.id]) - now) : 0;
                    var disabled = group.type === 'weapon' && weaponRemaining > 0 && !current;
                    var status = current ? '正在使用' : group.type === 'weapon' && disabled ? Math.ceil(weaponRemaining / 1000) + 's' : group.type === 'magic' && magicRemaining > 0 ? Math.ceil(magicRemaining / 1000) + 's' : '可切换';
                    return '<button class="battle-quick-btn ' + (current ? 'active' : '') + '" data-equipment-type="' + group.type + '" data-equipment-value="' + item.value + '" title="' + escapeHtml(item.name + '｜' + self.itemStats(item).join('；')) + '" ' + (disabled ? 'disabled' : '') + '>' + self.equipmentButtonIcon(item) + '<b>' + escapeHtml(item.name) + '</b><small>' + status + '</small></button>';
                }).join('') + '</div></div>';
            }).join('') + '<div class="battle-current-stats">' + groups.map(function (group) {
                var item = self.getEquippedItem(group.type);
                return item ? '<span><b>' + item.icon + ' ' + escapeHtml(item.name) + '</b><small>' + escapeHtml(self.itemStats(item).join(' · ')) + '</small></span>' : '';
            }).join('') + '</div>';
            target.querySelectorAll('.battle-quick-btn').forEach(function (button) {
                button.onclick = function () { self.switchBattleEquipment(button.dataset.equipmentType, button.dataset.equipmentValue); };
            });
        },

        switchBattleEquipment: function (type, value) {
            if (!['weapon', 'shield', 'magic'].includes(type)) return false;
            var state = this.ensureState();
            var item = CATALOG.find(function (entry) { return entry.type === type && entry.value === value && state.owned.includes(entry.id); });
            if (!item) { this.toast('这件装备还没有购买'); return false; }
            if (state.profile[type] === value) { this.toast(item.name + ' 已经在使用'); return true; }
            var now = Date.now();
            if (type === 'weapon' && Number(state.cooldowns.weaponSwitchUntil) > now) {
                this.toast('武器切换还需 ' + Math.ceil((state.cooldowns.weaponSwitchUntil - now) / 1000) + ' 秒');
                this.renderBattleQuickbar();
                return false;
            }
            state.profile[type] = value;
            if (type === 'weapon') state.cooldowns.weaponSwitchUntil = now + EQUIPMENT_CONFIG.weaponSwitchCooldown;
            this.syncUser();
            this.updateBattleHero();
            this.renderBattleQuickbar();
            this.toast('✅ 已装备' + item.name + (type === 'weapon' ? '，' + Math.ceil(EQUIPMENT_CONFIG.weaponSwitchCooldown / 1000) + '秒后可再次切换' : ''));
            return true;
        },

        init: function () {
            this.ensureState(); this.updateBalances();
            var self = this;
            var map = document.getElementById('open-adventure-map'); if (map) map.onclick = function (e) { e.stopPropagation(); self.openMap(); };
            var character = document.getElementById('open-character-editor'); if (character) character.onclick = function (e) { e.stopPropagation(); self.openCharacter(); };
            var shop = document.getElementById('open-adventure-shop'); if (shop) shop.onclick = function (e) { e.stopPropagation(); self.openShop(); };
            var story = document.getElementById('open-story-book'); if (story) story.onclick = function (e) { e.stopPropagation(); self.openStory(false); };
        },

        toast: function (text) {
            var old = document.querySelector('.adventure-toast'); if (old) old.remove();
            var node = document.createElement('div'); node.className = 'adventure-toast'; node.textContent = text; document.body.appendChild(node);
            requestAnimationFrame(function () { node.classList.add('show'); });
            setTimeout(function () { node.classList.remove('show'); setTimeout(function () { node.remove(); }, 250); }, 2400);
        }
    };

    // Physical weapon choreography. All projectiles originate at the held
    // weapon layer; melee weapons make the hero close distance before impact.
    if (typeof BattleMode !== 'undefined') {
        BattleMode.performEquippedAttack = function (move, rank, targetEl, callback) {
            var profile = AdventureSystem.getProfile();
            var type = profile.weapon || 'sword';
            var heroSide = document.querySelector('.hero-side');
            var weaponLayer = document.querySelector('.hero-weapon-layer');
            var arena = document.querySelector('.battle-arena');
            var comboItem = AdventureSystem.getEquippedItem('combo');
            var comboStyle = profile.combo || 'guardian';
            var comboCount = Number(App.battle && App.battle.combo) || 0;
            var comboRequired = Number(comboItem && comboItem.comboRequired) || 0;
            var comboActive = comboCount >= comboRequired;
            var attackData = App.battle && App.battle.lastEquipmentAttack;
            var activeMagic = attackData && attackData.magicUsed ? attackData.magic : null;
            var strength = { C: 'light', B: 'normal', A: 'strong', S: 'critical' }[rank] || 'strong';
            AdventureSystem.updateBattleLoadout();
            if (typeof playBattleSound === 'function') playBattleSound('ready', { type: type, rank: rank, module: App.battle.module });
            this.setHeroState(type === 'staff' || type === 'bow' ? 'cast_spell' : 'attack');
            if (heroSide) {
                heroSide.classList.remove('equipped-attack-sword', 'equipped-attack-bow', 'equipped-attack-staff', 'equipped-attack-hammer');
                void heroSide.offsetWidth;
                heroSide.classList.add('equipped-attack-' + type, 'attack-strength-' + strength);
                if (comboActive && comboStyle !== 'guardian') heroSide.classList.add('combo-casting-' + comboStyle);
            }
            if (weaponLayer) weaponLayer.classList.add(type === 'bow' ? 'weapon-draw' : type === 'staff' ? 'weapon-cast' : 'weapon-swing-real');

            var impactAt = type === 'sword' ? 430 : type === 'hammer' ? 560 : 600;
            var projectile = null;
            if ((type === 'bow' || type === 'staff') && arena) {
                projectile = document.createElement('div');
                projectile.className = 'equipped-projectile projectile-' + type + ' projectile-' + strength;
                projectile.innerHTML = type === 'bow' ? '<span>➶</span>' : '<span>' + (activeMagic ? activeMagic.icon : '✦') + '</span>';
                arena.appendChild(projectile);
                setTimeout(function () { projectile.classList.add('fly'); }, 180);
            }
            if (comboActive && comboStyle !== 'guardian' && arena) {
                var callout = document.createElement('div');
                callout.className = 'equipped-combo-callout combo-callout-' + comboStyle;
                callout.innerHTML = '<span>' + comboItem.icon + '</span><strong>' + comboItem.name + '</strong>';
                arena.appendChild(callout);
                setTimeout(function () { callout.classList.add('show'); }, 40);
                setTimeout(function () { callout.remove(); }, 1050);
            }
            setTimeout(function () {
                if (typeof playBattleSound === 'function') playBattleSound('release', { type: type, rank: rank, module: App.battle.module });
            }, type === 'sword' ? 150 : type === 'hammer' ? 230 : 180);

            setTimeout(function () {
                if (targetEl) {
                    targetEl.classList.add('equipped-impact-target');
                    setTimeout(function () { targetEl.classList.remove('equipped-impact-target'); }, 260);
                }
                var hit = document.createElement('span');
                hit.className = 'equipped-hit-effect hit-' + type + ' effect-' + (activeMagic ? activeMagic.value : profile.effect);
                hit.textContent = activeMagic ? activeMagic.icon : (({ stars: '🌟', lightning: '⚡', frost: '❄', flame: '🔥' })[profile.effect] || (type === 'sword' ? '╳' : type === 'hammer' ? '💥' : type === 'bow' ? '✹' : '✦'));
                if (targetEl) targetEl.appendChild(hit);
                setTimeout(function () { hit.remove(); }, 520);
                if (comboActive && comboStyle !== 'guardian' && targetEl) {
                    var echoCount = comboStyle === 'gale' ? 2 : comboStyle === 'starfall' ? 5 : 3;
                    var echoSymbol = comboStyle === 'gale' ? '〽' : comboStyle === 'starfall' ? '✦' : '🐲';
                    for (var echoIndex = 0; echoIndex < echoCount; echoIndex++) {
                        (function (index) {
                            setTimeout(function () {
                                var echo = document.createElement('span');
                                echo.className = 'combo-impact-echo combo-impact-' + comboStyle + ' echo-' + index;
                                echo.textContent = echoSymbol;
                                targetEl.appendChild(echo);
                                setTimeout(function () { echo.remove(); }, 650);
                            }, index * 70);
                        }(echoIndex));
                    }
                }
                if (projectile) projectile.remove();
                if (typeof playBattleSound === 'function') playBattleSound('impact', { type: type, rank: rank, module: App.battle.module });
                // Damage is resolved exactly once by the combat callback using
                // this same equipped weapon and magic data.
                if (callback) callback();
            }, impactAt);

            setTimeout(function () {
                if (heroSide) heroSide.classList.remove('equipped-attack-' + type, 'attack-strength-' + strength, 'combo-casting-' + comboStyle);
                if (weaponLayer) weaponLayer.classList.remove('weapon-draw', 'weapon-cast', 'weapon-swing-real');
                BattleMode.setHeroState('idle');
            }, impactAt + 300);
        };

        BattleMode.performEquippedDefense = function (callback) {
            var heroSide = document.querySelector('.hero-side');
            if (heroSide) { heroSide.classList.add('equipped-shield-block'); setTimeout(function () { heroSide.classList.remove('equipped-shield-block'); }, 520); }
            var layer = document.querySelector('.hero-char-layer');
            if (layer) {
                var shieldType = AdventureSystem.getProfile().shield || 'blue';
                var shield = document.createElement('span'); shield.className = 'active-shield-impact active-shield-' + shieldType; shield.textContent = shieldType === 'sun' ? '🌞' : shieldType === 'dragon' ? '🐉' : '🛡️'; layer.appendChild(shield);
                setTimeout(function () { shield.remove(); }, 520);
            }
            setTimeout(function () { if (callback) callback(); }, 180);
        };
    }

    window.AdventureSystem = AdventureSystem;
    document.addEventListener('DOMContentLoaded', function () { AdventureSystem.init(); });
}());
