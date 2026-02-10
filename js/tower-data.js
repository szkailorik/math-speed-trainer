/**
 * tower-data.js - Pure data definitions for Trial Tower (试炼之塔) mode
 * 30-floor mixed-module challenge with chaos-themed monsters,
 * exclusive cards, and fusion questions.
 *
 * No DOM manipulation, no animations - just data.
 */

const TowerData = {

    // ===== Unlock condition =====
    unlockCondition: {
        type: 'modules_cleared',
        count: 2,
        difficulty: 'normal',
        desc: '通关任意2个模块Normal难度'
    },

    // ===== Zone visual configurations =====
    zones: {
        intro: { name: '入门区', bgGradient: 'linear-gradient(180deg, #1a1a2e, #2d2d44)', ambientColor: '#3a3a5c', floorRange: [1, 9] },
        trial: { name: '试炼区', bgGradient: 'linear-gradient(180deg, #2e1a1a, #443030)', ambientColor: '#5c3a3a', floorRange: [11, 19] },
        inferno: { name: '炼狱区', bgGradient: 'linear-gradient(180deg, #2e0a0a, #441515)', ambientColor: '#5c2a2a', floorRange: [21, 29] },
        top: { name: '塔顶王座', bgGradient: 'linear-gradient(180deg, #0a0a2e, #1a0a3e)', ambientColor: '#3a2a5c', floorRange: [30, 30] }
    },

    // ===== 30 Floor configurations =====
    floors: [
        // --- Floors 1-3: Intro Zone - xiaojiujiu + decimal, Easy, 3 questions, HP 3 ---
        {
            floor: 1,
            zone: 'intro',
            zoneName: '入门区',
            modules: ['xiaojiujiu', 'decimal'],
            difficulty: 'easy',
            questionCount: 3,
            monsterPool: ['tower_brick', 'tower_moth'],
            isBoss: false,
            fusionChance: 0,
            specialRule: null
        },
        {
            floor: 2,
            zone: 'intro',
            zoneName: '入门区',
            modules: ['xiaojiujiu', 'decimal'],
            difficulty: 'easy',
            questionCount: 3,
            monsterPool: ['tower_brick', 'tower_moth', 'tower_spider'],
            isBoss: false,
            fusionChance: 0,
            specialRule: null
        },
        {
            floor: 3,
            zone: 'intro',
            zoneName: '入门区',
            modules: ['xiaojiujiu', 'decimal'],
            difficulty: 'easy',
            questionCount: 3,
            monsterPool: ['tower_moth', 'tower_spider', 'tower_ghost'],
            isBoss: false,
            fusionChance: 0,
            specialRule: null
        },

        // --- Floors 4-6: + fraction + unit, Easy+Normal mix, 3-4 questions, HP 4 ---
        {
            floor: 4,
            zone: 'intro',
            zoneName: '入门区',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit'],
            difficulty: 'easy',
            questionCount: 3,
            monsterPool: ['tower_spider', 'tower_ghost', 'tower_rat'],
            isBoss: false,
            fusionChance: 0,
            specialRule: null
        },
        {
            floor: 5,
            zone: 'intro',
            zoneName: '入门区',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit'],
            difficulty: 'normal',
            questionCount: 4,
            monsterPool: ['tower_ghost', 'tower_rat', 'tower_spider'],
            isBoss: false,
            fusionChance: 0,
            specialRule: null
        },
        {
            floor: 6,
            zone: 'intro',
            zoneName: '入门区',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit'],
            difficulty: 'normal',
            questionCount: 4,
            monsterPool: ['tower_rat', 'tower_ghost', 'tower_spider'],
            isBoss: false,
            fusionChance: 0,
            specialRule: null
        },

        // --- Floors 7-9: all 6 modules, Normal, 4 questions, HP 4-5 ---
        {
            floor: 7,
            zone: 'intro',
            zoneName: '入门区',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit', 'times', 'multiply'],
            difficulty: 'normal',
            questionCount: 4,
            monsterPool: ['tower_spider', 'tower_ghost', 'tower_rat', 'tower_stone_soldier'],
            isBoss: false,
            fusionChance: 0,
            specialRule: null
        },
        {
            floor: 8,
            zone: 'intro',
            zoneName: '入门区',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit', 'times', 'multiply'],
            difficulty: 'normal',
            questionCount: 4,
            monsterPool: ['tower_ghost', 'tower_rat', 'tower_stone_soldier'],
            isBoss: false,
            fusionChance: 0,
            specialRule: null
        },
        {
            floor: 9,
            zone: 'intro',
            zoneName: '入门区',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit', 'times', 'multiply'],
            difficulty: 'normal',
            questionCount: 4,
            monsterPool: ['tower_rat', 'tower_stone_soldier', 'tower_shadow_sword'],
            isBoss: false,
            fusionChance: 0,
            specialRule: null
        },

        // --- Floor 10: BOSS - all 6, Normal, 5 questions, 看门石像 HP 8 ---
        {
            floor: 10,
            zone: 'intro',
            zoneName: '入门区',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit', 'times', 'multiply'],
            difficulty: 'normal',
            questionCount: 5,
            monsterPool: ['tower_boss_gatekeeper'],
            isBoss: true,
            fusionChance: 0,
            specialRule: '看门石像会召唤石砖精援军'
        },

        // --- Floors 11-13: all 6, Normal, 4 questions, HP 5-6 ---
        {
            floor: 11,
            zone: 'trial',
            zoneName: '试炼区',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit', 'times', 'multiply'],
            difficulty: 'normal',
            questionCount: 4,
            monsterPool: ['tower_stone_soldier', 'tower_shadow_sword', 'tower_chaos_mage'],
            isBoss: false,
            fusionChance: 0,
            specialRule: null
        },
        {
            floor: 12,
            zone: 'trial',
            zoneName: '试炼区',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit', 'times', 'multiply'],
            difficulty: 'normal',
            questionCount: 4,
            monsterPool: ['tower_shadow_sword', 'tower_chaos_mage', 'tower_mirror'],
            isBoss: false,
            fusionChance: 0,
            specialRule: null
        },
        {
            floor: 13,
            zone: 'trial',
            zoneName: '试炼区',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit', 'times', 'multiply'],
            difficulty: 'normal',
            questionCount: 4,
            monsterPool: ['tower_chaos_mage', 'tower_mirror', 'tower_venom_snake'],
            isBoss: false,
            fusionChance: 0,
            specialRule: null
        },

        // --- Floors 14-16: all 6, Normal+Hard mix, 4 questions, HP 6 ---
        {
            floor: 14,
            zone: 'trial',
            zoneName: '试炼区',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit', 'times', 'multiply'],
            difficulty: 'normal',
            questionCount: 4,
            monsterPool: ['tower_mirror', 'tower_venom_snake', 'tower_shadow_sword'],
            isBoss: false,
            fusionChance: 0,
            specialRule: null
        },
        {
            floor: 15,
            zone: 'trial',
            zoneName: '试炼区',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit', 'times', 'multiply'],
            difficulty: 'hard',
            questionCount: 4,
            monsterPool: ['tower_venom_snake', 'tower_chaos_mage', 'tower_mirror'],
            isBoss: false,
            fusionChance: 0,
            specialRule: null
        },
        {
            floor: 16,
            zone: 'trial',
            zoneName: '试炼区',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit', 'times', 'multiply'],
            difficulty: 'hard',
            questionCount: 4,
            monsterPool: ['tower_shadow_sword', 'tower_venom_snake', 'tower_stone_soldier'],
            isBoss: false,
            fusionChance: 0,
            specialRule: null
        },

        // --- Floors 17-19: all 6, Hard dominant (70%), 5 questions, HP 6-7 ---
        {
            floor: 17,
            zone: 'trial',
            zoneName: '试炼区',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit', 'times', 'multiply'],
            difficulty: 'hard',
            questionCount: 5,
            monsterPool: ['tower_venom_snake', 'tower_chaos_mage', 'tower_flame_guard'],
            isBoss: false,
            fusionChance: 0,
            specialRule: '70%概率出Hard题'
        },
        {
            floor: 18,
            zone: 'trial',
            zoneName: '试炼区',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit', 'times', 'multiply'],
            difficulty: 'hard',
            questionCount: 5,
            monsterPool: ['tower_chaos_mage', 'tower_mirror', 'tower_flame_guard'],
            isBoss: false,
            fusionChance: 0,
            specialRule: '70%概率出Hard题'
        },
        {
            floor: 19,
            zone: 'trial',
            zoneName: '试炼区',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit', 'times', 'multiply'],
            difficulty: 'hard',
            questionCount: 5,
            monsterPool: ['tower_venom_snake', 'tower_flame_guard', 'tower_frost_wizard'],
            isBoss: false,
            fusionChance: 0,
            specialRule: '70%概率出Hard题'
        },

        // --- Floor 20: BOSS - all 6 Hard, 6 questions, 混沌守卫 HP 12 ---
        {
            floor: 20,
            zone: 'trial',
            zoneName: '试炼区',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit', 'times', 'multiply'],
            difficulty: 'hard',
            questionCount: 6,
            monsterPool: ['tower_boss_chaos_guard'],
            isBoss: true,
            fusionChance: 0,
            specialRule: '混沌守卫会在HP低于50%时变身为真形'
        },

        // --- Floors 21-23: all 6, Hard, 4 questions, HP 7-8 ---
        {
            floor: 21,
            zone: 'inferno',
            zoneName: '炼狱区',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit', 'times', 'multiply'],
            difficulty: 'hard',
            questionCount: 4,
            monsterPool: ['tower_flame_guard', 'tower_frost_wizard', 'tower_thunder'],
            isBoss: false,
            fusionChance: 0,
            specialRule: null
        },
        {
            floor: 22,
            zone: 'inferno',
            zoneName: '炼狱区',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit', 'times', 'multiply'],
            difficulty: 'hard',
            questionCount: 4,
            monsterPool: ['tower_frost_wizard', 'tower_thunder', 'tower_void_walker'],
            isBoss: false,
            fusionChance: 0,
            specialRule: null
        },
        {
            floor: 23,
            zone: 'inferno',
            zoneName: '炼狱区',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit', 'times', 'multiply'],
            difficulty: 'hard',
            questionCount: 4,
            monsterPool: ['tower_thunder', 'tower_void_walker', 'tower_death_knight'],
            isBoss: false,
            fusionChance: 0,
            specialRule: null
        },

        // --- Floors 24-26: all 6, Hard + fusion, 5 questions, HP 8, fusionChance 0.3 ---
        {
            floor: 24,
            zone: 'inferno',
            zoneName: '炼狱区',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit', 'times', 'multiply'],
            difficulty: 'hard',
            questionCount: 5,
            monsterPool: ['tower_void_walker', 'tower_death_knight', 'tower_flame_guard'],
            isBoss: false,
            fusionChance: 0.3,
            specialRule: '30%概率出现融合题'
        },
        {
            floor: 25,
            zone: 'inferno',
            zoneName: '炼狱区',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit', 'times', 'multiply'],
            difficulty: 'hard',
            questionCount: 5,
            monsterPool: ['tower_death_knight', 'tower_thunder', 'tower_void_walker'],
            isBoss: false,
            fusionChance: 0.3,
            specialRule: '30%概率出现融合题'
        },
        {
            floor: 26,
            zone: 'inferno',
            zoneName: '炼狱区',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit', 'times', 'multiply'],
            difficulty: 'hard',
            questionCount: 5,
            monsterPool: ['tower_flame_guard', 'tower_frost_wizard', 'tower_death_knight'],
            isBoss: false,
            fusionChance: 0.3,
            specialRule: '30%概率出现融合题'
        },

        // --- Floors 27-29: all 6, Hard + fusion, 5 questions, HP 8-9, fusionChance 0.5 ---
        {
            floor: 27,
            zone: 'inferno',
            zoneName: '炼狱区',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit', 'times', 'multiply'],
            difficulty: 'hard',
            questionCount: 5,
            monsterPool: ['tower_death_knight', 'tower_void_walker', 'tower_thunder'],
            isBoss: false,
            fusionChance: 0.5,
            specialRule: '50%概率出现融合题'
        },
        {
            floor: 28,
            zone: 'inferno',
            zoneName: '炼狱区',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit', 'times', 'multiply'],
            difficulty: 'hard',
            questionCount: 5,
            monsterPool: ['tower_void_walker', 'tower_death_knight', 'tower_flame_guard'],
            isBoss: false,
            fusionChance: 0.5,
            specialRule: '50%概率出现融合题'
        },
        {
            floor: 29,
            zone: 'inferno',
            zoneName: '炼狱区',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit', 'times', 'multiply'],
            difficulty: 'hard',
            questionCount: 5,
            monsterPool: ['tower_thunder', 'tower_frost_wizard', 'tower_death_knight'],
            isBoss: false,
            fusionChance: 0.5,
            specialRule: '50%概率出现融合题'
        },

        // --- Floor 30: BOSS - all 6 Hard + fusion, 8 questions, 数学魔神 HP 15 (3 phases) ---
        {
            floor: 30,
            zone: 'top',
            zoneName: '塔顶王座',
            modules: ['xiaojiujiu', 'decimal', 'fraction', 'unit', 'times', 'multiply'],
            difficulty: 'hard',
            questionCount: 8,
            monsterPool: ['tower_boss_demon_p1'],
            isBoss: true,
            fusionChance: 0.5,
            specialRule: '数学魔神共三个阶段，每阶段HP10，击败后进入下一形态'
        }
    ],

    // ===== 20 Chaos-themed Tower Monsters =====
    monsters: [
        // ==========================================
        // Intro Zone (5 monsters) - HP 3-4
        // ==========================================
        {
            id: 'tower_brick',
            name: '石砖精',
            emoji: '🧱',
            hp: 3,
            difficulty: 'easy',
            type: 'rock',
            personality: 'defensive',
            story: '试炼之塔最底层的守卫，由古老的魔法石砖凝聚而成。虽然行动迟缓，但防御力极强，每一块砖石都蕴含着数学的力量。据说只有答对算术题才能让它的砖体出现裂缝。',
            enterQuips: ['吾乃...石砖精...不可通过...', '此路...不通...'],
            deathQuips: ['碎...碎了...', '砖...散了...'],
            tauntQuips: ['你...太弱了...', '打不动...的...'],
            fearQuips: ['不...不要...', '好...好快...'],
            behaviors: ['defend'],
            attackEmoji: '🧱'
        },
        {
            id: 'tower_moth',
            name: '火把蛾',
            emoji: '🔥',
            hp: 3,
            difficulty: 'easy',
            type: 'fire',
            personality: 'timid',
            story: '塔内火把上聚集的飞蛾精灵，它们被永不熄灭的魔法火焰所吸引，久而久之也获得了火的力量。胆小怕事，一遇到强者就想逃跑。',
            enterQuips: ['火光...好温暖...', '别靠近我的火把！'],
            deathQuips: ['火...灭了...', '好冷...'],
            tauntQuips: ['你的速度还不够快~', '我可以逃得更远哦~'],
            fearQuips: ['救命啊！太厉害了！', '不要灭掉我的火...'],
            behaviors: ['escape'],
            attackEmoji: '🔥'
        },
        {
            id: 'tower_spider',
            name: '蜘蛛丝',
            emoji: '🕸️',
            hp: 4,
            difficulty: 'easy',
            type: 'bug',
            personality: 'cunning',
            story: '潜伏在塔内阴暗角落的巨型蜘蛛，用数字编织成的蛛网来困住冒险者。它的蛛丝上写满了数学题，只有答对才能挣脱束缚。',
            enterQuips: ['嘻嘻...掉进我的网了...', '我的数字丝线...无人能断！'],
            deathQuips: ['我的网...破了...', '丝...断了...'],
            tauntQuips: ['越挣扎缠得越紧哦~', '你被困住了~'],
            fearQuips: ['不！我的网！', '怎么可能这么快...'],
            behaviors: ['dodge'],
            attackEmoji: '🕸️'
        },
        {
            id: 'tower_ghost',
            name: '迷路鬼',
            emoji: '👻',
            hp: 4,
            difficulty: 'easy',
            type: 'ghost',
            personality: 'sinister',
            story: '曾经在塔中迷路的冒险者的怨灵，它们漫无目的地在楼层间游荡，用诅咒迷惑后来的挑战者，让他们也永远迷失在这座塔里。',
            enterQuips: ['和我一起...迷路吧...', '你也会留在这里的...永远...'],
            deathQuips: ['终于...可以离开了...', '谢谢...带我出去...'],
            tauntQuips: ['你已经迷路了...', '出口？不存在的...'],
            fearQuips: ['不...不要带走我...', '我不想消失...'],
            behaviors: ['taunt'],
            attackEmoji: '👻'
        },
        {
            id: 'tower_rat',
            name: '塔鼠',
            emoji: '🐀',
            hp: 4,
            difficulty: 'easy',
            type: 'beast',
            personality: 'timid',
            story: '试炼之塔里繁殖的巨型老鼠，它们以掉落的数学符号为食。虽然单只很弱，但是喜欢成群结队地出现。受到威胁时会分裂成更多的小老鼠。',
            enterQuips: ['吱吱！一起上！', '吱...好多好多的我！'],
            deathQuips: ['吱...吱...', '同伴们...快逃...'],
            tauntQuips: ['我们人多势众！', '吱吱~你打不完的~'],
            fearQuips: ['吱！快跑！', '太...太厉害了吱！'],
            behaviors: ['escape'],
            attackEmoji: '🐀'
        },

        // ==========================================
        // Trial Zone (5 monsters) - HP 5-6
        // ==========================================
        {
            id: 'tower_stone_soldier',
            name: '石像兵',
            emoji: '🗿',
            hp: 5,
            difficulty: 'normal',
            type: 'rock',
            personality: 'defensive',
            story: '试炼区的石像守卫，它们曾经是塔的建造者所雕刻的装饰品，在混沌魔力的浸染下获得了生命。行动缓慢但坚不可摧，需要精准的数学攻击才能击碎它们的防御。',
            enterQuips: ['守护...是吾等...使命...', '不可...通行...', '石之墙...不可破...'],
            deathQuips: ['使命...完成了...', '碎...成沙...'],
            tauntQuips: ['打不穿的...', '坚如磐石...'],
            fearQuips: ['裂...裂缝...', '不可能...'],
            behaviors: ['defend', 'taunt'],
            attackEmoji: '🗿'
        },
        {
            id: 'tower_shadow_sword',
            name: '暗影剑士',
            emoji: '⚔️',
            hp: 6,
            difficulty: 'normal',
            type: 'dark',
            personality: 'violent',
            story: '穿行于试炼区阴影中的剑士亡灵，生前是挑战塔的勇者，死后被混沌力量复活成了塔的守卫。它的剑术依然凌厉，会在你答题犹豫时发动反击。',
            enterQuips: ['我曾是挑战者...如今是守护者...', '拔剑吧！', '影之剑...斩断一切犹豫！'],
            deathQuips: ['终于...解脱了...', '好剑术...后生可畏...'],
            tauntQuips: ['太慢了！再快一点！', '犹豫就会败北！'],
            fearQuips: ['这个速度...不可能...', '比我当年...还快...'],
            behaviors: ['enrage'],
            attackEmoji: '⚔️'
        },
        {
            id: 'tower_chaos_mage',
            name: '混沌法师',
            emoji: '🧙',
            hp: 6,
            difficulty: 'normal',
            type: 'demon',
            personality: 'sinister',
            story: '研究混沌数学的邪恶法师，它试图用扭曲的算式来改写数学法则。它能召唤小型混沌生物来干扰挑战者，还会施放诅咒让题目变得更加混乱。',
            enterQuips: ['混沌之力！颤抖吧！', '数学法则？由我改写！', '让算式疯狂起来！'],
            deathQuips: ['我的研究...还没完成...', '混沌...终将降临...'],
            tauntQuips: ['我的魔法会扰乱你的思维！', '感受混沌的力量吧！'],
            fearQuips: ['不...不可能！我的混沌术...', '秩序的力量...竟如此强大...'],
            behaviors: ['taunt', 'heal'],
            attackEmoji: '🧙'
        },
        {
            id: 'tower_mirror',
            name: '镜像怪',
            emoji: '🪞',
            hp: 5,
            difficulty: 'normal',
            type: 'psychic',
            personality: 'cunning',
            story: '塔内古老魔镜中诞生的怪物，能复制挑战者的数学能力。它最擅长闪避和分身术，当你以为打中了它，其实只是打碎了一面镜子的影像。',
            enterQuips: ['看看你自己的倒影吧~', '你在打我，还是在打自己？', '镜花水月...孰真孰假？'],
            deathQuips: ['碎...碎了...七年霉运...', '真...真的被打碎了...'],
            tauntQuips: ['你打中的只是影子哦~', '哪个才是真的我呢？'],
            fearQuips: ['不...不要打碎真正的我...', '我分不清自己了...'],
            behaviors: ['dodge', 'escape'],
            attackEmoji: '🪞'
        },
        {
            id: 'tower_venom_snake',
            name: '毒雾蛇',
            emoji: '🐍',
            hp: 6,
            difficulty: 'normal',
            type: 'poison',
            personality: 'sinister',
            story: '盘踞在试炼区走廊中的巨蛇，它喷出的毒雾能让数字变得模糊不清。最危险的是它的自爆毒囊——被逼急了会释放浓缩毒液，与挑战者同归于尽。',
            enterQuips: ['嘶嘶...猎物来了...', '我的毒雾...会让你看不清数字...', '小心脚下...嘶嘶...'],
            deathQuips: ['嘶...毒囊...要爆了...', '与你...同归于尽...嘶...'],
            tauntQuips: ['视线开始模糊了吧？嘶嘶...', '毒已入体...来不及了...'],
            fearQuips: ['嘶！好疼！', '解毒...解毒术...'],
            behaviors: ['selfDestruct', 'taunt'],
            attackEmoji: '🐍'
        },

        // ==========================================
        // Inferno Zone (5 monsters) - HP 7-9
        // ==========================================
        {
            id: 'tower_flame_guard',
            name: '烈焰卫士',
            emoji: '🔥',
            hp: 7,
            difficulty: 'hard',
            type: 'fire',
            personality: 'violent',
            story: '炼狱区的精锐守卫，全身包裹着不灭的混沌之火。它的战斗风格极其暴烈，每次被击中都会变得更加狂暴。火焰的温度随着它的愤怒不断攀升，据说最高能达到让数字融化的程度。',
            enterQuips: ['烈焰审判！通过我才能前进！', '炼狱之火不会放过任何人！', '燃烧吧！一切都会化为灰烬！'],
            deathQuips: ['火...灭了...炼狱之门...', '我的火焰...传承给下一个守卫...'],
            tauntQuips: ['我越打越强！你感受到热量了吗？', '火焰不灭！'],
            fearQuips: ['不...不可能浇灭我的火！', '谁...谁能冷却炼狱？'],
            behaviors: ['enrage', 'selfDestruct'],
            attackEmoji: '🔥'
        },
        {
            id: 'tower_frost_wizard',
            name: '冰霜巫师',
            emoji: '❄️',
            hp: 7,
            difficulty: 'hard',
            type: 'ice',
            personality: 'defensive',
            story: '与烈焰卫士对立的冰之守护者，用极寒的魔法冻结一切。它能为自己和同伴织起冰之护盾，还能用治愈冰晶恢复体力。冷静而理智，是炼狱区最难缠的对手。',
            enterQuips: ['万物冻结...冰之审判开始...', '寒冰封印...让时间停止...', '感受绝对零度的恐惧吧...'],
            deathQuips: ['冰...融了...春天来了...', '我的冰...守不住了...'],
            tauntQuips: ['冰盾不破，你的攻击无效...', '冰冷的数学...没有温度...'],
            fearQuips: ['融...融化了...', '不...我的冰晶...'],
            behaviors: ['defend', 'heal'],
            attackEmoji: '❄️'
        },
        {
            id: 'tower_thunder',
            name: '雷电元素',
            emoji: '⚡',
            hp: 8,
            difficulty: 'hard',
            type: 'electric',
            personality: 'violent',
            story: '纯粹的雷电能量凝聚而成的元素生命体，在炼狱区的高塔间不断放电。它的攻击力随着愤怒值飙升，狂暴状态下一击就能劈碎挑战者的护盾。速度极快，几乎无法闪避。',
            enterQuips: ['轰隆！！！雷霆万钧！！！', '电闪雷鸣！无处可逃！', '我就是雷电本身！'],
            deathQuips: ['滋...滋...短路了...', '电...消散了...'],
            tauntQuips: ['闪电不会等你思考！', '哈哈哈！更多的电！'],
            fearQuips: ['接...接地了...', '电量不足...不...'],
            behaviors: ['enrage', 'dodge'],
            attackEmoji: '⚡'
        },
        {
            id: 'tower_void_walker',
            name: '虚空行者',
            emoji: '🌑',
            hp: 8,
            difficulty: 'hard',
            type: 'psychic',
            personality: 'cunning',
            story: '能够穿梭于虚空维度的神秘存在，没人见过它的真面目。它的战斗方式令人抓狂——在虚空中瞬移闪避，分出虚影迷惑敌人，危急时刻还能遁入虚空逃跑。据说它来自数学世界尽头的虚无之境。',
            enterQuips: ['虚空无界...你的数学到得了那里吗？', '从虚无中来...到虚无中去...', '看清我了吗？不...那只是残影...'],
            deathQuips: ['虚空...回收了我...', '消散于...无尽之中...'],
            tauntQuips: ['你以为打到我了？那是虚影~', '虚空不可触及...'],
            fearQuips: ['被...被看穿了...', '我的虚空裂缝...封住了...'],
            behaviors: ['dodge', 'escape'],
            attackEmoji: '🌑'
        },
        {
            id: 'tower_death_knight',
            name: '死亡骑士',
            emoji: '💀',
            hp: 9,
            difficulty: 'hard',
            type: 'demon',
            personality: 'sinister',
            story: '炼狱区最恐怖的存在，穿着漆黑铠甲的亡灵骑士。它原是试炼之塔最优秀的守护骑士，在一次混沌入侵中被腐化堕落。如今它用诅咒和亡灵之力守护着通往塔顶的道路，任何人都无法安然通过。',
            enterQuips: ['死亡...是唯一的终点...', '吾之铠甲，以亡灵之骨铸就...', '跪下！或者倒下！'],
            deathQuips: ['铠甲...碎了...灵魂...自由了...', '感谢你...终结了我的诅咒...'],
            tauntQuips: ['诅咒已附身，你感觉到了吗？', '亡灵不知疲倦...你呢？'],
            fearQuips: ['不...诅咒...在消散...', '光...好刺眼...'],
            behaviors: ['taunt', 'selfDestruct', 'enrage'],
            attackEmoji: '💀'
        },

        // ==========================================
        // Bosses (5 monsters)
        // ==========================================
        {
            id: 'tower_boss_gatekeeper',
            name: '看门石像',
            emoji: '🗿',
            hp: 8,
            difficulty: 'boss',
            type: 'rock',
            personality: 'domineering',
            story: '试炼之塔第十层的守护者，由塔的建造者亲手雕刻的巨大石像。它在入口处沉睡了千年，只有当挑战者踏上第十层时才会苏醒。它的石身坚不可摧，能召唤石砖精作为援军，据说还从未被任何挑战者击败过。它不是要阻止你，而是在考验你是否有资格继续攀登。',
            enterQuips: ['千年之眠...终于被唤醒...', '考验...开始了...证明你的资格！', '吾乃看门石像...入门之试...最终之壁！'],
            deathQuips: ['合格...继续前进吧...勇者...', '千年来...第一个通过的人...了不起...', '石碎了...但你的意志...比石头更硬...'],
            tauntQuips: ['你的攻击...如同挠痒...', '石之守护...不可动摇！', '千年不破的防御...你能打穿吗？'],
            fearQuips: ['裂缝...在扩大...', '这个力量...不可能...'],
            behaviors: ['defend', 'heal', 'taunt'],
            attackEmoji: '🗿'
        },
        {
            id: 'tower_boss_chaos_guard',
            name: '混沌守卫',
            emoji: '⚔️',
            hp: 12,
            difficulty: 'boss',
            type: 'demon',
            personality: 'domineering',
            phase2Name: '混沌守卫·真形',
            phase2Emoji: '👿',
            story: '试炼区的终极守护者，一个被混沌力量完全支配的古代战士。平时以人形姿态战斗，当生命值降低时会露出真正的混沌魔物形态。它的真形拥有远超人形时的力量和速度，无数挑战者都倒在了它的变身一击之下。传说只有数学天才才能在它变身后存活。',
            enterQuips: ['试炼区的尽头...就是我！', '我有两张面孔...你能承受得住吗？', '混沌之力灌注于身...无人可挡！'],
            deathQuips: ['混沌之力...被净化了...', '真形...也败了...你确实...够格...', '吾...认输...前方的路...更加凶险...'],
            tauntQuips: ['这只是我的人形而已！', '等着看我的真面目吧！', '混沌不灭！'],
            fearQuips: ['真形...也挡不住你？', '不...混沌之力在消退...'],
            behaviors: ['enrage', 'defend', 'taunt'],
            attackEmoji: '⚔️'
        },
        {
            id: 'tower_boss_demon_p1',
            name: '数学魔神·第一形态',
            emoji: '😈',
            hp: 10,
            difficulty: 'boss',
            type: 'demon',
            personality: 'domineering',
            phase2Name: '数学魔神·第二形态',
            phase2Emoji: '👿',
            story: '试炼之塔的最终Boss，一个企图用混沌力量颠覆所有数学法则的远古魔神。第一形态时它还保持着理性，用强大的防御和召唤术来消耗挑战者的体力。它相信数学是宇宙的基石，而混沌才是数学的终极答案。只有最优秀的数学勇者才有资格见到它的真面目。',
            enterQuips: ['终于有人来到了塔顶...', '我是数学世界的终极考验！', '三十层的旅途...在此画上句号！'],
            deathQuips: ['第一形态...不过是前菜...', '很好...你值得面对真正的我...'],
            tauntQuips: ['我的防御如同数学公理...不可撼动！', '看看我召唤的大军吧！', '这只是开始！'],
            fearQuips: ['居然突破了第一层防御？', '不...不可能这么快...'],
            behaviors: ['defend', 'heal', 'enrage'],
            attackEmoji: '😈'
        },
        {
            id: 'tower_boss_demon_p2',
            name: '数学魔神·第二形态',
            emoji: '👿',
            hp: 10,
            difficulty: 'boss',
            type: 'demon',
            personality: 'violent',
            phase2Name: '数学魔神·最终形态',
            phase2Emoji: '🔮',
            story: '数学魔神褪去伪装后露出的战斗形态，全身散发着暴戾的混沌能量。这个形态放弃了防御，转而用狂暴的攻击力碾压对手。它的反击会让答错题的代价加倍，还会施放诅咒扰乱思维。无数到达塔顶的勇者都在这个形态前功尽弃。',
            enterQuips: ['褪去伪装...这才是真正的力量！', '暴怒模式...启动！！！', '混沌的暴风雨...席卷一切！'],
            deathQuips: ['还...还有最终形态...', '你逼我使出了...真正的力量...'],
            tauntQuips: ['每一击都更加猛烈！感受到了吗？', '反击之刃！答错的代价加倍！'],
            fearQuips: ['连这个形态...也不行吗？', '人类的数学...竟如此强大...'],
            behaviors: ['enrage', 'selfDestruct', 'taunt'],
            attackEmoji: '👿'
        },
        {
            id: 'tower_boss_demon_p3',
            name: '数学魔神·最终形态',
            emoji: '🔮',
            hp: 10,
            difficulty: 'boss',
            type: 'demon',
            personality: 'sinister',
            story: '数学魔神的终极形态，超越了物质界限的纯粹混沌意识体。这个形态精通一切战斗技巧——能防御，能闪避，能召唤，能治愈，能狂暴，能诅咒，甚至能自爆重生。它是试炼之塔有史以来最强大的存在，也是每一个数学勇者的终极梦想对手。击败它，就是征服了混沌本身。',
            enterQuips: ['这是...最终形态...超越一切的混沌之力...', '宇宙的终极方程...就是我本身！', '数学的尽头...是混沌...也是秩序！来吧！'],
            deathQuips: ['混沌...归于秩序...', '恭喜你...征服了混沌...征服了数学...征服了自己...', '试炼之塔...认可你为...真正的数学勇者！'],
            tauntQuips: ['我掌握一切技巧！你怎么赢？', '召唤！防御！反击！治愈！这就是最终之力！', '没有人...没有人打败过这个形态！'],
            fearQuips: ['不...混沌...在崩解...', '人类的心算...竟能战胜混沌？'],
            behaviors: ['defend', 'dodge', 'heal', 'enrage', 'taunt', 'selfDestruct', 'escape'],
            attackEmoji: '🔮'
        }
    ],

    // ===== Fusion Question Templates =====
    fusionTemplates: [
        // 1. fraction + multiply: e.g., "3/4 x 400 = ?"
        {
            id: 'fraction_multiply',
            name: '分数x乘法',
            modules: ['fraction', 'multiply'],
            generate: function() {
                var templates = [
                    { q: '1/4 \u00d7 400 = ?', a: 100 },
                    { q: '3/4 \u00d7 400 = ?', a: 300 },
                    { q: '1/5 \u00d7 500 = ?', a: 100 },
                    { q: '2/5 \u00d7 500 = ?', a: 200 },
                    { q: '1/2 \u00d7 360 = ?', a: 180 },
                    { q: '3/8 \u00d7 800 = ?', a: 300 },
                    { q: '1/3 \u00d7 900 = ?', a: 300 },
                    { q: '2/3 \u00d7 600 = ?', a: 400 },
                    { q: '1/4 \u00d7 240 = ?', a: 60 },
                    { q: '3/5 \u00d7 250 = ?', a: 150 }
                ];
                var t = templates[Math.floor(Math.random() * templates.length)];
                return { q: t.q, a: t.a, fusionType: 'fraction_multiply' };
            }
        },

        // 2. unit + decimal: e.g., "2.5km = ?m"
        {
            id: 'unit_decimal',
            name: '单位x小数',
            modules: ['unit', 'decimal'],
            generate: function() {
                var templates = [
                    { q: '2.5km = ?m', a: 2500 },
                    { q: '0.8kg = ?g', a: 800 },
                    { q: '1.5\u5c0f\u65f6 = ?\u5206\u949f', a: 90 },
                    { q: '3.2m = ?cm', a: 320 },
                    { q: '0.25kg = ?g', a: 250 },
                    { q: '0.5km = ?m', a: 500 },
                    { q: '4.5L = ?mL', a: 4500 },
                    { q: '0.75m = ?cm', a: 75 },
                    { q: '1.2\u5c0f\u65f6 = ?\u5206\u949f', a: 72 },
                    { q: '0.6kg = ?g', a: 600 }
                ];
                var t = templates[Math.floor(Math.random() * templates.length)];
                return { q: t.q, a: t.a, fusionType: 'unit_decimal' };
            }
        },

        // 3. xiaojiujiu + fraction: e.g., "7x8的结果的1/4是多少?"
        {
            id: 'xiaojiujiu_fraction',
            name: '九九x分数',
            modules: ['xiaojiujiu', 'fraction'],
            generate: function() {
                var templates = [
                    { q: '7\u00d78\u7684\u7ed3\u679c\u76841/4\u662f\u591a\u5c11?', a: 14 },
                    { q: '6\u00d79\u7684\u7ed3\u679c\u76841/3\u662f\u591a\u5c11?', a: 18 },
                    { q: '8\u00d78\u7684\u7ed3\u679c\u76841/2\u662f\u591a\u5c11?', a: 32 },
                    { q: '5\u00d76\u7684\u7ed3\u679c\u76841/5\u662f\u591a\u5c11?', a: 6 },
                    { q: '9\u00d79\u7684\u7ed3\u679c\u76841/3\u662f\u591a\u5c11?', a: 27 },
                    { q: '4\u00d79\u7684\u7ed3\u679c\u76841/4\u662f\u591a\u5c11?', a: 9 },
                    { q: '6\u00d78\u7684\u7ed3\u679c\u76841/2\u662f\u591a\u5c11?', a: 24 },
                    { q: '8\u00d75\u7684\u7ed3\u679c\u76841/4\u662f\u591a\u5c11?', a: 10 }
                ];
                var t = templates[Math.floor(Math.random() * templates.length)];
                return { q: t.q, a: t.a, fusionType: 'xiaojiujiu_fraction' };
            }
        },

        // 4. times + unit: e.g., "12x15分钟 = ?小时"
        {
            id: 'times_unit',
            name: '大九九x单位',
            modules: ['times', 'unit'],
            generate: function() {
                var templates = [
                    { q: '12\u00d715\u5206\u949f = ?\u5c0f\u65f6', a: 3 },
                    { q: '15\u00d720\u5206\u949f = ?\u5c0f\u65f6', a: 5 },
                    { q: '25\u00d74cm = ?m', a: 1 },
                    { q: '20\u00d75\u5206\u949f = ?\u5c0f\u65f6', hint: '100\u5206\u949f', a: 100 },
                    { q: '50\u00d720g = ?kg', a: 1 },
                    { q: '12\u00d710\u5206\u949f = ?\u5c0f\u65f6', a: 2 },
                    { q: '15\u00d74cm = ?cm', a: 60 },
                    { q: '25\u00d74cm = ?m', a: 1 }
                ];
                var t = templates[Math.floor(Math.random() * templates.length)];
                return { q: t.q, a: t.a, fusionType: 'times_unit' };
            }
        },

        // 5. multiply + decimal: e.g., "25x0.04 = ?"
        {
            id: 'multiply_decimal',
            name: '乘法x小数',
            modules: ['multiply', 'decimal'],
            generate: function() {
                var templates = [
                    { q: '25 \u00d7 0.04 = ?', a: 1 },
                    { q: '50 \u00d7 0.2 = ?', a: 10 },
                    { q: '125 \u00d7 0.8 = ?', a: 100 },
                    { q: '200 \u00d7 0.05 = ?', a: 10 },
                    { q: '40 \u00d7 0.25 = ?', a: 10 },
                    { q: '500 \u00d7 0.02 = ?', a: 10 },
                    { q: '75 \u00d7 0.4 = ?', a: 30 },
                    { q: '250 \u00d7 0.04 = ?', a: 10 },
                    { q: '150 \u00d7 0.2 = ?', a: 30 },
                    { q: '80 \u00d7 0.5 = ?', a: 40 }
                ];
                var t = templates[Math.floor(Math.random() * templates.length)];
                return { q: t.q, a: t.a, fusionType: 'multiply_decimal' };
            }
        },

        // 6. fraction + decimal + multiply: e.g., "把3/8化成小数再x1000等于多少?"
        {
            id: 'fraction_decimal_multiply',
            name: '分数x小数x乘法',
            modules: ['fraction', 'decimal', 'multiply'],
            generate: function() {
                var templates = [
                    { q: '\u628a3/8\u5316\u6210\u5c0f\u6570\u518d\u00d71000\u7b49\u4e8e\u591a\u5c11?', a: 375 },
                    { q: '\u628a1/4\u5316\u6210\u5c0f\u6570\u518d\u00d71000\u7b49\u4e8e\u591a\u5c11?', a: 250 },
                    { q: '\u628a1/8\u5316\u6210\u5c0f\u6570\u518d\u00d71000\u7b49\u4e8e\u591a\u5c11?', a: 125 },
                    { q: '\u628a3/4\u5316\u6210\u5c0f\u6570\u518d\u00d7100\u7b49\u4e8e\u591a\u5c11?', a: 75 },
                    { q: '\u628a1/5\u5316\u6210\u5c0f\u6570\u518d\u00d71000\u7b49\u4e8e\u591a\u5c11?', a: 200 },
                    { q: '\u628a2/5\u5316\u6210\u5c0f\u6570\u518d\u00d7100\u7b49\u4e8e\u591a\u5c11?', a: 40 },
                    { q: '\u628a1/2\u5316\u6210\u5c0f\u6570\u518d\u00d7200\u7b49\u4e8e\u591a\u5c11?', a: 100 },
                    { q: '\u628a5/8\u5316\u6210\u5c0f\u6570\u518d\u00d7800\u7b49\u4e8e\u591a\u5c11?', a: 500 }
                ];
                var t = templates[Math.floor(Math.random() * templates.length)];
                return { q: t.q, a: t.a, fusionType: 'fraction_decimal_multiply' };
            }
        }
    ],

    // ===== 10 Exclusive Tower Cards =====
    cards: [
        {
            id: 'tower_r_01',
            name: '塔之入场券',
            rarity: 'R',
            module: 'tower',
            emoji: '🎟️',
            category: 'knowledge',
            flavor: '踏入试炼之塔的通行证',
            desc: '首次进入试炼之塔时获得',
            story: '这张泛黄的入场券据说是塔的建造者留下的。上面写着一行小字："数学的试炼永无止境，但勇气是最好的开始。"每一位踏入试炼之塔的勇者都会收到这张券，它散发着淡淡的温暖光芒。',
            obtainMethod: '首次进入试炼之塔',
            atk: null,
            def: null,
            element: null,
            effect: null,
            sortOrder: 1
        },
        {
            id: 'tower_r_02',
            name: '石像碎片',
            rarity: 'R',
            module: 'tower',
            emoji: '🗿',
            category: 'monster',
            flavor: '沉睡千年的守卫的遗物',
            desc: '击败看门石像后获得',
            story: '从看门石像身上掉落的一块碎片，摸起来冰凉沉重。如果仔细观察，会发现碎片表面刻着密密麻麻的数学公式，那是千年前塔的建造者赋予石像力量的铭文。',
            obtainMethod: '击败看门石像（第10层Boss）',
            atk: null,
            def: null,
            element: null,
            effect: null,
            sortOrder: 2
        },
        {
            id: 'tower_sr_01',
            name: '混沌之刃',
            rarity: 'SR',
            module: 'tower',
            emoji: '⚔️',
            category: 'weapon',
            flavor: '混沌守卫的佩剑，蕴含两种形态的力量',
            desc: '击败混沌守卫后获得',
            story: '混沌守卫真形被击败后遗留的暗黑之剑，剑身不断在实体与虚幻之间切换。据说握住它的人能感受到守卫生前的记忆——一个为了守护塔而放弃人性的战士的悲壮故事。',
            obtainMethod: '击败混沌守卫（第20层Boss）',
            atk: 2,
            def: null,
            element: 'dark',
            effect: { type: 'bonusDamage', condition: 'tower_boss', bonus: 1 },
            sortOrder: 3
        },
        {
            id: 'tower_sr_02',
            name: '试炼之证',
            rarity: 'SR',
            module: 'tower',
            emoji: '📜',
            category: 'achievement',
            flavor: '通过二十层试炼的荣耀证明',
            desc: '通关第20层后获得',
            story: '一张散发着金色光芒的古老卷轴，上面自动记录了勇者通过前二十层的战斗历程。每一笔每一划都在诉说着勇者的坚持与智慧，是试炼区毕业的最高荣誉。',
            obtainMethod: '通关第20层',
            atk: null,
            def: null,
            element: null,
            effect: null,
            sortOrder: 4
        },
        {
            id: 'tower_sr_03',
            name: '炼狱火花',
            rarity: 'SR',
            module: 'tower',
            emoji: '🔥',
            category: 'element',
            flavor: '炼狱区永不熄灭的混沌之火的碎片',
            desc: '通关第25层后获得',
            story: '从炼狱区核心采集的一簇永恒火花，它在掌心中跳动却不灼人。这团火蕴含着混沌的原始力量，传说是塔被建造时留下的创世之火的余烬，至今仍在燃烧。',
            obtainMethod: '通关第25层',
            atk: 1,
            def: null,
            element: 'fire',
            effect: { type: 'bonusDamage', condition: 'fire_attack', bonus: 1 },
            sortOrder: 5
        },
        {
            id: 'tower_ssr_01',
            name: '混沌核心',
            rarity: 'SSR',
            module: 'tower',
            emoji: '💎',
            category: 'artifact',
            flavor: '数学魔神体内的混沌能量结晶',
            desc: '击败数学魔神后获得',
            story: '从数学魔神体内取出的混沌能量核心，它在手中不断变幻着形状——时而是球体，时而是立方体，时而是不规则的分形几何。据说这颗核心蕴含着混沌的终极秘密：混沌并非无序，而是更高维度的数学秩序。',
            obtainMethod: '击败数学魔神（任意形态）',
            atk: 2,
            def: 2,
            element: 'dark',
            effect: { type: 'allBoost', bonus: 1 },
            sortOrder: 6
        },
        {
            id: 'tower_ssr_02',
            name: '塔之征服者',
            rarity: 'SSR',
            module: 'tower',
            emoji: '🏆',
            category: 'achievement',
            flavor: '前十层全对的传奇勇者之证',
            desc: '前10层全部满分通过获得',
            story: '一座精致的金色奖杯，底座上刻着挑战者的名字。只有在前十层每一道题都答对、不犯任何错误的完美勇者才能获得。奖杯散发的光芒据说能照亮整座试炼之塔，让所有怪物都为之敬畏。',
            obtainMethod: '前10层全部满分（零失误）通过',
            atk: null,
            def: null,
            element: null,
            effect: null,
            sortOrder: 7
        },
        {
            id: 'tower_ssr_03',
            name: '时间领主',
            rarity: 'SSR',
            module: 'tower',
            emoji: '⏰',
            category: 'achievement',
            flavor: '在时间的洪流中掌控一切的传说',
            desc: '30分钟内通关试炼之塔获得',
            story: '一块永远在倒转的怀表，指针以极快的速度逆时针旋转。据说拥有它的人可以感受到时间的流动。这是对那些心算速度快到扭曲时间之人的至高褒奖，因为只有极致的速度才能在三十分钟内征服三十层。',
            obtainMethod: '30分钟内通关全部30层',
            atk: null,
            def: null,
            element: null,
            effect: null,
            sortOrder: 8
        },
        {
            id: 'tower_ur_01',
            name: '数学之心\u00b7混沌',
            rarity: 'UR',
            module: 'tower',
            emoji: '🌀',
            category: 'ultimate',
            flavor: '混沌中孕育的数学终极结晶',
            desc: '击败数学魔神最终形态获得',
            story: '击败数学魔神最终形态后，从混沌的废墟中升起的璀璨结晶。它是第七颗数学之心，也是最特殊的一颗——不属于任何模块，却包含着所有模块的精华。持有它意味着你已经征服了数学世界的终极试炼，是真正的数学之心系列的完结者。',
            obtainMethod: '击败数学魔神最终形态（第30层最终Boss）',
            atk: 3,
            def: 3,
            element: 'chaos',
            effect: { type: 'ultimateBoost', bonus: 2 },
            sortOrder: 9
        },
        {
            id: 'tower_ur_02',
            name: '全知之眼',
            rarity: 'UR',
            module: 'tower',
            emoji: '👁️',
            category: 'ultimate',
            flavor: '看透数学万象的至高之眼',
            desc: '集齐全部6颗数学之心并通关试炼之塔',
            story: '当六颗数学之心齐聚于征服试炼之塔的勇者手中时，它们会共鸣融合，在勇者额头浮现出这只全知之眼。拥有全知之眼的人能看透一切数学的本质，无论多复杂的算式在眼中都如同呼吸般自然。这是整个数学世界的最终收藏品，传说中只有真正的数学之神才配拥有。',
            obtainMethod: '集齐6颗数学之心 + 通关试炼之塔',
            atk: 5,
            def: 5,
            element: 'all',
            effect: { type: 'omniscience', bonus: 3 },
            sortOrder: 10
        }
    ]
};

window.TowerData = TowerData;
