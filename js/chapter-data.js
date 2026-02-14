/**
 * chapter-data.js - v23.0 Chapter system configuration
 * Defines chapter structure, BOSS monsters, exclusive items/weapons, and rewards
 */

// ===== Chapter BOSS Monsters =====
var chapterBossMonsters = {
    xiaojiujiu: [
        {
            id: 'xjj_ch1_boss',
            name: '口诀守门人',
            nameEn: 'Formula Gatekeeper',
            emoji: '🗿',
            hp: 6,
            type: 'rock',
            attack: '📖',
            attackName: '口诀压制',
            behaviors: ['defend'],
            personality: 'defensive',
            quips: ['口诀不熟，休想通过！', '我守了千年，无人能过！', '背不出来就回去！'],
            defendQuips: ['石墙坚不可摧！', '千年守护！', '挡！'],
            trait: '守护数学王国大门千年的石像，只放行掌握口诀的人',
            traitEn: 'An ancient stone guardian that only lets those who master multiplication pass',
            story: '传说口诀守门人原本是一位数学老师，因太执着于九九乘法表而化为石像，守护着数学王国的大门。只有真正掌握基础口诀的人，才能唤醒他心中残存的温柔。',
            storyEn: 'Legend says the Gatekeeper was once a math teacher, turned to stone by his obsession with multiplication tables.',
            isBoss: true,
            isChapterBoss: true,
            chapter: 'xjj_ch1'
        },
        {
            id: 'xjj_ch2_boss',
            name: '速算将军',
            nameEn: 'Speed General',
            emoji: '⚔️',
            hp: 8,
            type: 'fighting',
            attack: '💢',
            attackName: '疾风连斩',
            behaviors: ['enrage', 'counter'],
            personality: 'violent',
            quips: ['太慢了！', '速度就是力量！', '看我的疾风斩！', '算不快就别来！'],
            enrageQuips: ['还不够快！！', '让你见识真正的速度！', '怒！'],
            counterQuips: ['反击！', '太大意了！', '接招！'],
            trait: '以速度著称的武将，答错会遭到反击',
            traitEn: 'A general known for speed, who counterattacks when you answer wrong',
            story: '速算将军曾是王国最快的计算师，因追求极限速度而走火入魔。他挥舞双剑，只尊重能跟上他节奏的对手。',
            storyEn: 'The Speed General was once the kingdom\'s fastest calculator, driven mad by his pursuit of speed.',
            isBoss: true,
            isChapterBoss: true,
            chapter: 'xjj_ch2'
        },
        {
            id: 'xjj_ch3_boss',
            name: '九九魔帝',
            nameEn: 'Emperor of Nines',
            emoji: '👑',
            hp: 10,
            type: 'dragon',
            attack: '🌟',
            attackName: '九九归一',
            behaviors: ['defend', 'summon', 'enrage', 'counter'],
            personality: 'sinister',
            quips: ['九九归一，万法归宗！', '你敢挑战本帝？', '跪下！', '数学的极致在此！'],
            defendQuips: ['帝王之盾！', '不可能打穿！', '挡！'],
            summonQuips: ['来人！护驾！', '小的们，上！', '援军无穷无尽！'],
            enrageQuips: ['你激怒了本帝！', '死！', '天地变色！'],
            counterQuips: ['反击！感受帝王之怒！', '不自量力！', '回敬你！'],
            trait: '统治九九王国的最终BOSS，拥有两种形态',
            traitEn: 'The ultimate boss ruling the Kingdom of Nines, with two powerful forms',
            story: '九九魔帝是所有乘法口诀的化身，只有真正掌握九九乘法的勇者才能将其打败。传说他的两种形态分别代表乘法和除法的极致力量。',
            storyEn: 'The Emperor of Nines is the embodiment of all multiplication tables.',
            isBoss: true,
            isChapterBoss: true,
            chapter: 'xjj_ch3',
            // Phase 2 configuration
            phase2: true,
            phase2Emoji: '🐲',
            phase2Name: '真·九九魔帝',
            phase2HP: 6,
            phase2Attack: '💥',
            phase2AttackName: '九九归一·帝王版',
            phase2Behaviors: ['enrage', 'counter', 'summon', 'curse'],
            phase2Quips: ['这才是本帝的真面目！', '变身！感受绝望吧！', '没有人能打败真正的魔帝！']
        }
    ]
};

// ===== Chapter Exclusive Items =====
var chapterItems = {
    xiaojiujiu: [
        {
            id: 'xjj_ch1_stone_talisman',
            name: '石之护符',
            emoji: '🪨',
            type: 'buff',
            effect: { shield: 1 },
            desc: '口诀初试纪念：抵挡1次攻击',
            rarity: 'rare',
            chapter: 'xjj_ch1'
        },
        {
            id: 'xjj_ch2_speed_amulet',
            name: '疾风符',
            emoji: '💨',
            type: 'buff',
            effect: { timeBonus: 1500 },
            desc: '速算战场纪念：答题时间+1.5秒',
            rarity: 'epic',
            chapter: 'xjj_ch2'
        },
        {
            id: 'xjj_ch3_emperor_crown',
            name: '魔帝之冠',
            emoji: '👑',
            type: 'buff',
            effect: { allStatsUp: 2, comboBonus: 5 },
            desc: '魔王挑战纪念：全属性+2，连击+5',
            rarity: 'legendary',
            chapter: 'xjj_ch3'
        }
    ]
};

// ===== Chapter Exclusive Weapons =====
var chapterWeapons = {
    xiaojiujiu: [
        { emoji: '📖', name: '口诀之书', weight: 10, sound: 'holy', color: '#4a90d9', chapter: 'xjj_ch1' },
        { emoji: '⚔️', name: '将军之剑', weight: 10, sound: 'thunder', color: '#c0392b', chapter: 'xjj_ch2' },
        { emoji: '👑', name: '帝王权杖', weight: 12, sound: 'rainbow', color: '#f1c40f', chapter: 'xjj_ch3' }
    ]
};

// ===== Main Chapter Configuration =====
var ChapterConfig = {
    xiaojiujiu: {
        theme: '妖怪',
        chapters: [
            {
                id: 'xjj_ch1',
                name: '口诀初试',
                subtitle: '掌握基础口诀',
                icon: '📖',
                stageCount: 7,  // 6 normal + 1 boss
                monsterMix: { easy: 6 },
                questionPools: ['warmup', 'easy'],
                questionRatio: { warmup: 0.3, easy: 0.7 },
                playerHP: 5,
                baseDifficulty: 'easy',
                warmupFirst: 2,  // First 2 questions are warmup
                boss: chapterBossMonsters.xiaojiujiu[0],
                unlockCondition: null,  // Always unlocked
                rewards: {
                    firstClear: { score: 50, crystals: 5 },
                    star1: { item: 'xjj_ch1_stone_talisman' },
                    star2: { crystals: 10, guaranteedCardRarity: 'R' },
                    star3: { weapon: 'xjj_ch1_book', crystals: 20 }
                }
            },
            {
                id: 'xjj_ch2',
                name: '速算战场',
                subtitle: '考验速度与准确',
                icon: '⚔️',
                stageCount: 9,  // 8 normal + 1 boss
                monsterMix: { easy: 3, normal: 5 },
                questionPools: ['easy', 'normal'],
                questionRatio: { easy: 0.3, normal: 0.7 },
                playerHP: 5,
                baseDifficulty: 'normal',
                forceInputAfterStage: 5,  // From stage 5, 40% chance of forceInput
                forceInputChance: 0.4,
                boss: chapterBossMonsters.xiaojiujiu[1],
                unlockCondition: { chapter: 'xjj_ch1', minStars: 1 },
                rewards: {
                    firstClear: { score: 100, crystals: 10 },
                    star1: { item: 'xjj_ch2_speed_amulet' },
                    star2: { crystals: 20, guaranteedCardRarity: 'SR' },
                    star3: { weapon: 'xjj_ch2_sword', crystals: 30 }
                }
            },
            {
                id: 'xjj_ch3',
                name: '魔王挑战',
                subtitle: '终极速算大考验',
                icon: '👑',
                stageCount: 11,  // 10 normal + 1 boss
                monsterMix: { normal: 3, hard: 4, boss: 3 },
                questionPools: ['easy', 'normal', 'hard'],
                questionRatio: { easy: 0.1, normal: 0.25, hard: 0.65 },
                playerHP: 5,
                baseDifficulty: 'hard',
                forceInputEvery: 3,  // Every 3 questions, 1 is forceInput
                bossOnlyHard: true,  // Boss fight only uses hard questions
                boss: chapterBossMonsters.xiaojiujiu[2],
                unlockCondition: { chapter: 'xjj_ch2', minStars: 1 },
                rewards: {
                    firstClear: { score: 200, crystals: 20 },
                    star1: { item: 'xjj_ch3_emperor_crown' },
                    star2: { crystals: 40, guaranteedCardRarity: 'SSR' },
                    star3: { weapon: 'xjj_ch3_scepter', crystals: 50, title: '九九征服者' }
                }
            }
        ]
    }
    // Other modules (fraction, decimal, unit, multiply, times) will be added in future versions
};

// ===== Star Rating Configuration =====
var ChapterStarConfig = {
    // Star 1 (bronze): pass with >= 50% accuracy
    star1: { accuracy: 0.50 },
    // Star 2 (silver): >= 80% accuracy
    star2: { accuracy: 0.80 },
    // Star 3 (gold): >= 95% accuracy AND no death (HP never reached 0)
    star3: { accuracy: 0.95, noDeath: true }
};
