/**
 * card-data.js - 143 card definitions for the card collection system
 * Updated with: category, story, mathTip, obtainMethod, atk, def, element, sortOrder
 */

const CardData = {
    // Rarity configuration
    rarityConfig: {
        N: { name: 'N', label: '普通', color: '#888', borderColor: '#aaa', glow: 'none' },
        R: { name: 'R', label: '稀有', color: '#4a90d9', borderColor: '#6ab0ff', glow: '0 0 10px rgba(74,144,217,0.5)' },
        SR: { name: 'SR', label: '史诗', color: '#9b59b6', borderColor: '#b47cc8', glow: '0 0 15px rgba(155,89,182,0.6)' },
        SSR: { name: 'SSR', label: '传说', color: '#f39c12', borderColor: '#f1c40f', glow: '0 0 20px rgba(243,156,18,0.7)' },
        UR: { name: 'UR', label: '神话', color: '#e74c3c', borderColor: '#ff6b6b', glow: '0 0 25px rgba(231,76,60,0.8)' }
    },

    // Drop rates by difficulty
    dropRates: {
        easy: 0.10,
        normal: 0.15,
        hard: 0.20
    },

    // Rarity weights for rolling
    rarityWeights: {
        N: 50,
        R: 30,
        SR: 13,
        SSR: 5,
        UR: 2
    },

    // Boss-specific weights (guaranteed R+)
    bossRarityWeights: {
        R: 40,
        SR: 30,
        SSR: 20,
        UR: 10
    },

    // All 143 cards
    cards: [
        // ===== 小九九模块 (19张) =====
        // N级 (8张) - 基础知识卡
        {
            id: 'xjj_n_01', name: '九九口诀', rarity: 'N', module: 'xiaojiujiu',
            emoji: '📖', flavor: '一一得一，一二得二...', desc: '九九乘法表的起源',
            category: 'knowledge',
            story: '传说在古老的数学王国里，智者将乘法的秘密编成了朗朗上口的口诀，代代相传，成为每一位小数学家的必修之路。',
            mathTip: '九九乘法口诀从一一得一开始，到九九八十一结束，共有45句',
            obtainMethod: '在小九九模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 1
        },
        {
            id: 'xjj_n_02', name: '乘法小能手', rarity: 'N', module: 'xiaojiujiu',
            emoji: '✏️', flavor: '熟能生巧', desc: '练习是最好的老师',
            category: 'knowledge',
            story: '一支小小的铅笔，在无数次的练习中磨短了笔尖，却磨出了对乘法的深刻理解。每一个乘法小能手都知道：熟能生巧。',
            mathTip: '多练习口算，速度和准确率都会提高，目标是看到题目立刻想到答案',
            obtainMethod: '在小九九模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 2
        },
        {
            id: 'xjj_n_03', name: '除法逆运算', rarity: 'N', module: 'xiaojiujiu',
            emoji: '🔄', flavor: '乘法的反面', desc: '42÷6=7, 因为6×7=42',
            category: 'knowledge',
            story: '乘法和除法是一对双胞胎，一个负责合并，一个负责分割。知道了乘法，除法自然就懂了。',
            mathTip: '除法是乘法的逆运算：a×b=c 可以推出 c÷a=b 和 c÷b=a',
            obtainMethod: '在小九九模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 3
        },
        {
            id: 'xjj_n_04', name: '交换律', rarity: 'N', module: 'xiaojiujiu',
            emoji: '🔀', flavor: '3×4 = 4×3', desc: '交换因数，积不变',
            category: 'knowledge',
            story: '在数学的世界里，有一条神奇的法则：不管谁先谁后，结果都一样。3排4个和4排3个，数量永远相等。',
            mathTip: '乘法交换律：a×b = b×a，利用这个规律可以少记一半的口诀',
            obtainMethod: '在小九九模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 4
        },
        {
            id: 'xjj_n_05', name: '连击之力', rarity: 'N', module: 'xiaojiujiu',
            emoji: '🔥', flavor: '连续答对的快感', desc: '连击越多伤害越高',
            category: 'knowledge',
            story: '当你连续答对题目时，一股火焰般的力量在心中燃烧。连击越多，这股力量就越强大！',
            mathTip: '连续答对可以积累连击数，连击数越高攻击力越强，保持专注是关键',
            obtainMethod: '在小九九模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 5
        },
        {
            id: 'xjj_n_06', name: '速算入门', rarity: 'N', module: 'xiaojiujiu',
            emoji: '⚡', flavor: '快而准', desc: '速度是训练出来的',
            category: 'knowledge',
            story: '闪电般的速度不是天生的，而是日复一日训练的成果。每一位速算高手都从最基础的口诀开始。',
            mathTip: '速算的关键是熟练掌握基础口诀，做到脱口而出，不需要思考就能给出答案',
            obtainMethod: '在小九九模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 6
        },
        {
            id: 'xjj_n_07', name: '5的乘法表', rarity: 'N', module: 'xiaojiujiu',
            emoji: '🖐️', flavor: '5,10,15,20...', desc: '尾数规律：5和0交替',
            category: 'knowledge',
            story: '伸开五个手指头，5的倍数就藏在你手中。5、10、15、20——尾数总是5和0在交替跳舞。',
            mathTip: '5的乘法表规律：结果尾数是5和0交替出现，奇数×5尾数为5，偶数×5尾数为0',
            obtainMethod: '在小九九模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 7
        },
        {
            id: 'xjj_n_08', name: '9的乘法规律', rarity: 'N', module: 'xiaojiujiu',
            emoji: '9️⃣', flavor: '十位加个位等于9', desc: '18,27,36,45,54,63,72,81',
            category: 'knowledge',
            story: '数字9是最神秘的数字，它的乘法结果有一个隐藏的秘密——十位和个位加起来永远等于9！',
            mathTip: '9的倍数规律：各位数字之和为9。例如9×3=27，2+7=9；9×7=63，6+3=9',
            obtainMethod: '在小九九模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 8
        },
        // R级 (5张) - 怪物专属卡
        {
            id: 'xjj_r_01', name: '噗噗鬼之魂', rarity: 'R', module: 'xiaojiujiu',
            emoji: '👻', flavor: '噗噗~别怕我~', desc: '数学世界最可爱的小幽灵', effect: null,
            category: 'monster',
            story: '噗噗鬼原本只是一个被遗忘的算术符号，在数学世界的角落里游荡了很久。它虽然看起来有点吓人，但其实特别怕寂寞，总想找人一起做数学题玩。',
            mathTip: null,
            obtainMethod: '在小九九模块击败噗噗鬼后掉落',
            atk: 2, def: 1, element: 'fire', sortOrder: 9
        },
        {
            id: 'xjj_r_02', name: '眨眨眼之瞳', rarity: 'R', module: 'xiaojiujiu',
            emoji: '👁️', flavor: '看穿一切的目光', desc: '害羞的神秘眼睛妖怪', effect: null,
            category: 'monster',
            story: '眨眨眼是数学迷宫的守门人，它用那只大大的眼睛注视着每一个路过的学生。只有正确回答它的乘法题目，它才会害羞地眨眨眼让你通过。',
            mathTip: null,
            obtainMethod: '在小九九模块击败眨眨眼后掉落',
            atk: 2, def: 2, element: 'fire', sortOrder: 10
        },
        {
            id: 'xjj_r_03', name: '毒毒菇之孢', rarity: 'R', module: 'xiaojiujiu',
            emoji: '🍄', flavor: '其实只会让你打喷嚏', desc: '颜色鲜艳但心地善良', effect: null,
            category: 'monster',
            story: '毒毒菇生长在乘法森林的深处，它鲜艳的颜色其实是为了吸引小朋友来做题。回答错误会喷出让人打喷嚏的孢子，但绝对无害。',
            mathTip: null,
            obtainMethod: '在小九九模块击败毒毒菇后掉落',
            atk: 3, def: 1, element: 'earth', sortOrder: 11
        },
        {
            id: 'xjj_r_04', name: '烈烈猴之焰', rarity: 'R', module: 'xiaojiujiu',
            emoji: '🐒', flavor: '永不停歇的热血', desc: '用火焰算术操锻炼身体', effect: null,
            category: 'monster',
            story: '烈烈猴住在火山口旁边，每天用火焰做乘法体操。它相信运动和数学是世界上最棒的两件事，梦想是教会所有小朋友边运动边背口诀。',
            mathTip: null,
            obtainMethod: '在小九九模块击败烈烈猴后掉落',
            atk: 3, def: 1, element: 'fire', sortOrder: 12
        },
        {
            id: 'xjj_r_05', name: '蝙蝙侠之声', rarity: 'R', module: 'xiaojiujiu',
            emoji: '🦇', flavor: '6和9，傻傻分不清', desc: '倒着看世界的小蝙蝠', effect: null,
            category: 'monster',
            story: '蝙蝙侠总是倒挂在树上看世界，所以经常把6看成9、把9看成6。它守护着乘法洞穴的入口，喜欢考你能不能分清颠倒的数字。',
            mathTip: null,
            obtainMethod: '在小九九模块击败蝙蝙侠后掉落',
            atk: 2, def: 2, element: 'earth', sortOrder: 13
        },
        // SR级 (3张) - 武器技能卡
        {
            id: 'xjj_sr_01', name: '火球术精通', rarity: 'SR', module: 'xiaojiujiu',
            emoji: '🔥', flavor: '一击必杀的魔法', desc: '火球术伤害+1',
            effect: { type: 'weaponBoost', weapon: 'fire', bonus: 1 },
            category: 'spell',
            story: '远古时代，数学圣者将乘法口诀的力量灌注到火焰之中，创造出了这门强大的火球术。只有真正掌握乘法的人才能施展它的全部威力。',
            mathTip: null,
            obtainMethod: '在小九九模块Hard难度中掉落',
            atk: 4, def: 2, element: 'fire', sortOrder: 14
        },
        {
            id: 'xjj_sr_02', name: '闪电连锁', rarity: 'SR', module: 'xiaojiujiu',
            emoji: '⚡', flavor: '连击时放出闪电', desc: '5连击时触发额外闪电',
            effect: { type: 'comboTrigger', threshold: 5 },
            category: 'spell',
            story: '这道闪电蕴含着连续答对的力量。当勇者连续正确回答5道乘法题时，天空会降下连锁闪电，给予敌人毁灭性的打击。',
            mathTip: null,
            obtainMethod: '在小九九模块Hard难度中掉落',
            atk: 3, def: 2, element: 'fire', sortOrder: 15
        },
        {
            id: 'xjj_sr_03', name: '乘法护盾', rarity: 'SR', module: 'xiaojiujiu',
            emoji: '🛡️', flavor: '九九归一，护身不败', desc: '每局开始获得1层护盾',
            effect: { type: 'startShield', value: 1 },
            category: 'spell',
            story: '由81个乘法算式编织而成的金色护盾，"九九归一"的古老咒语赋予它坚不可摧的防御力。只要你记住所有口诀，这面盾牌就永远不会碎裂。',
            mathTip: null,
            obtainMethod: '在小九九模块Hard难度中掉落',
            atk: 3, def: 3, element: 'earth', sortOrder: 16
        },
        // SSR级 (2张)
        {
            id: 'xjj_ssr_01', name: '九九魔王印', rarity: 'SSR', module: 'xiaojiujiu',
            emoji: '👹', flavor: '吾乃九九乘法之终极守护者！', desc: '击败九九魔王获得的勋章',
            category: 'legend',
            story: '九九魔王是乘法世界的终极守护者，它用九九八十一道难题考验每一位挑战者。传说中只有连续答对所有题目的勇者，才能获得魔王亲手盖上的这枚金印，成为乘法世界公认的大师。',
            mathTip: null,
            obtainMethod: '击败小九九Boss后概率掉落',
            atk: 5, def: 3, element: 'fire', sortOrder: 17
        },
        {
            id: 'xjj_ssr_02', name: '连击大师之证', rarity: 'SSR', module: 'xiaojiujiu',
            emoji: '💫', flavor: '连续15击的传奇时刻', desc: '达成15连击的荣耀证明',
            category: 'legend',
            story: '当一位数学勇者达成15连击的壮举时，整个乘法世界都会为之震动。天空绽放金色光芒，大地发出欢呼。这枚证章记录了那个传奇的瞬间，是速算能力登峰造极的象征。',
            mathTip: null,
            obtainMethod: '击败小九九Boss后概率掉落',
            atk: 4, def: 4, element: 'earth', sortOrder: 18
        },
        // UR级 (1张)
        {
            id: 'xjj_ur_01', name: '数学之心·乘法', rarity: 'UR', module: 'xiaojiujiu',
            emoji: '💎', flavor: '蕴含着乘法终极奥义的结晶', desc: '小九九模块的至高收藏',
            category: 'mythic',
            story: '在数学宇宙的中心，六颗数学之心静静地旋转着。乘法之心是其中最古老的一颗，它诞生于人类第一次领悟"几个几"的那个瞬间。传说集齐六颗数学之心的人，将获得理解万物的终极智慧。这颗心脏散发着炽热的红色光芒，承载着从一一得一到九九八十一的全部奥义。',
            mathTip: null,
            obtainMethod: '收集小九九全部卡牌后解锁',
            atk: 6, def: 5, element: 'fire', sortOrder: 19
        },

        // ===== 分数模块 (19张) =====
        {
            id: 'fs_n_01', name: '分子与分母', rarity: 'N', module: 'fraction',
            emoji: '📐', flavor: '上面是分子，下面是分母', desc: '分数的基本构成',
            category: 'knowledge',
            story: '分数就像一栋小房子，分母住在楼下决定分成几份，分子住在楼上告诉你要取几份。这两兄弟缺一不可。',
            mathTip: '分数由分子和分母组成，分母表示等分的份数，分子表示取的份数',
            obtainMethod: '在分数模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 1
        },
        {
            id: 'fs_n_02', name: '约分之道', rarity: 'N', module: 'fraction',
            emoji: '✂️', flavor: '化繁为简', desc: '找到最大公因数',
            category: 'knowledge',
            story: '约分就像给分数"减肥"，把复杂的分数变成最简单的样子。秘诀就是找到分子和分母的最大公因数。',
            mathTip: '约分：分子和分母同时除以它们的最大公因数，如6/8 → 3/4',
            obtainMethod: '在分数模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 2
        },
        {
            id: 'fs_n_03', name: '通分之术', rarity: 'N', module: 'fraction',
            emoji: '🔗', flavor: '统一分母', desc: '找到最小公倍数',
            category: 'knowledge',
            story: '分母不同的分数无法直接比较大小，通分之术就是让它们"穿上同样的衣服"，这样谁大谁小一目了然。',
            mathTip: '通分：找到两个分母的最小公倍数作为公分母，然后分别调整分子',
            obtainMethod: '在分数模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 3
        },
        {
            id: 'fs_n_04', name: '十分之规律', rarity: 'N', module: 'fraction',
            emoji: '🔟', flavor: '十分之几等于零点几', desc: '分母是10的分数规律',
            category: 'knowledge',
            story: '当分母是10的时候，分数和小数之间有一座魔法桥梁——只需要加上一个小数点就行了！',
            mathTip: '分母是10的分数可以直接转化为一位小数：1/10=0.1，3/10=0.3',
            obtainMethod: '在分数模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 4
        },
        {
            id: 'fs_n_05', name: '百分之规律', rarity: 'N', module: 'fraction',
            emoji: '💯', flavor: '百分之几等于零点零几', desc: '分母是100的分数规律',
            category: 'knowledge',
            story: '百分之一就是一个小小的"百分点"，一百个百分点合起来才等于1。百分数在生活中无处不在。',
            mathTip: '分母是100的分数转化为两位小数：1/100=0.01，25/100=0.25',
            obtainMethod: '在分数模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 5
        },
        {
            id: 'fs_n_06', name: '二分之一', rarity: 'N', module: 'fraction',
            emoji: '½', flavor: '0.5，一半的力量', desc: '最常用的分数',
            category: 'knowledge',
            story: '二分之一是所有分数的老大哥，一个苹果切两半，一张纸对折一次，到处都有它的身影。',
            mathTip: '1/2 = 0.5，是最基础也最常用的分数，一半的意思',
            obtainMethod: '在分数模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 6
        },
        {
            id: 'fs_n_07', name: '四分之系列', rarity: 'N', module: 'fraction',
            emoji: '🍕', flavor: '0.25, 0.5, 0.75', desc: '四分之一到四分之三',
            category: 'knowledge',
            story: '把一块披萨切成四份，四分之一、四分之二、四分之三——这就是四分之系列的全部秘密。',
            mathTip: '1/4=0.25，2/4=0.5，3/4=0.75，记住这三个常用的分数小数对应关系',
            obtainMethod: '在分数模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 7
        },
        {
            id: 'fs_n_08', name: '五分之系列', rarity: 'N', module: 'fraction',
            emoji: '⭐', flavor: '0.2的倍数', desc: '五分之一到五分之四',
            category: 'knowledge',
            story: '五角星有五个角，每个角代表五分之一。五分之系列的小数都是0.2的倍数，记起来特别方便。',
            mathTip: '1/5=0.2，2/5=0.4，3/5=0.6，4/5=0.8，都是0.2的倍数',
            obtainMethod: '在分数模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 8
        },
        {
            id: 'fs_r_01', name: '精卫填海图', rarity: 'R', module: 'fraction',
            emoji: '🐦', flavor: '不屈不挠的精神', desc: '小精卫的英姿',
            category: 'monster',
            story: '精卫小鸟虽然身体很小，但是它有着不屈不挠的精神。每天衔着一块小石子飞向大海，一点一点地填，就像学分数一样，一步一步来，总能学会。',
            mathTip: null,
            obtainMethod: '在分数模块击败精卫后掉落',
            atk: 2, def: 1, element: 'ice', sortOrder: 9
        },
        {
            id: 'fs_r_02', name: '九尾狐之尾', rarity: 'R', module: 'fraction',
            emoji: '🦊', flavor: '九条尾巴九份力', desc: '传说中的九尾之力',
            category: 'monster',
            story: '九尾狐每修炼一百年就多长出一条尾巴。九条尾巴正好可以用来理解九分之几——每条尾巴都是九分之一的力量，九条合起来就是完整的1。',
            mathTip: null,
            obtainMethod: '在分数模块击败九尾狐后掉落',
            atk: 3, def: 1, element: 'ice', sortOrder: 10
        },
        {
            id: 'fs_r_03', name: '应龙鳞片', rarity: 'R', module: 'fraction',
            emoji: '🐲', flavor: '古老的龙鳞散发光芒', desc: '应龙脱落的一片鳞',
            category: 'monster',
            story: '应龙是山海经中最古老的龙族，它浑身覆盖着闪亮的鳞片。每一片鳞片上都刻着一个分数，据说集齐所有鳞片就能拼出分数世界的终极公式。',
            mathTip: null,
            obtainMethod: '在分数模块击败应龙后掉落',
            atk: 2, def: 2, element: 'ice', sortOrder: 11
        },
        {
            id: 'fs_r_04', name: '麒麟祥云', rarity: 'R', module: 'fraction',
            emoji: '☁️', flavor: '瑞兽脚下的祥云', desc: '太平盛世的象征',
            category: 'monster',
            story: '麒麟是瑞兽之首，脚踏祥云巡视数学世界。它只在有人完美解出分数题目时才会出现，带来好运和祝福。谁能得到麒麟的认可，就说明分数学得棒极了。',
            mathTip: null,
            obtainMethod: '在分数模块击败麒麟后掉落',
            atk: 2, def: 2, element: 'ice', sortOrder: 12
        },
        {
            id: 'fs_r_05', name: '凤凰羽毛', rarity: 'R', module: 'fraction',
            emoji: '🪶', flavor: '百鸟之王的赐福', desc: '闪耀七彩的神羽',
            category: 'monster',
            story: '凤凰是百鸟之王，它的每根羽毛都闪耀着七种颜色。传说凤凰用羽毛当作分数线，把天空分成无数份美丽的彩虹。得到一根神羽便是极大的福气。',
            mathTip: null,
            obtainMethod: '在分数模块击败凤凰后掉落',
            atk: 3, def: 2, element: 'ice', sortOrder: 13
        },
        {
            id: 'fs_sr_01', name: '八分之秘术', rarity: 'SR', module: 'fraction',
            emoji: '🔮', flavor: '0.125的魔力', desc: '掌握八分之系列',
            effect: { type: 'bonusDamage', condition: 'fraction_8', bonus: 1 },
            category: 'spell',
            story: '八分之秘术是分数世界最难掌握的魔法之一，因为0.125这个数字并不直观。但是一旦领悟了它的规律，就能轻松推算出所有八分之几的小数值。',
            mathTip: null,
            obtainMethod: '在分数模块Hard难度中掉落',
            atk: 3, def: 2, element: 'ice', sortOrder: 14
        },
        {
            id: 'fs_sr_02', name: '山海经·图鉴', rarity: 'SR', module: 'fraction',
            emoji: '📜', flavor: '记载万物的古籍', desc: '山海经妖怪图鉴完成度+',
            effect: { type: 'collectionBoost' },
            category: 'spell',
            story: '这本山海经图鉴记载了分数世界中所有神兽妖怪的信息。拥有它之后，遇到的每一只怪物都会自动记录在册，帮助冒险者更好地了解对手的弱点。',
            mathTip: null,
            obtainMethod: '在分数模块Hard难度中掉落',
            atk: 3, def: 3, element: 'ice', sortOrder: 15
        },
        {
            id: 'fs_sr_03', name: '分数互换术', rarity: 'SR', module: 'fraction',
            emoji: '🔄', flavor: '分数与小数自由转换', desc: '分数小数互换伤害+1',
            effect: { type: 'bonusDamage', condition: 'convert', bonus: 1 },
            category: 'spell',
            story: '分数互换术是连接分数世界和小数世界的桥梁魔法。掌握了这门魔法，分数和小数就能在你手中自由变换，再也没有什么能难倒你了。',
            mathTip: null,
            obtainMethod: '在分数模块Hard难度中掉落',
            atk: 4, def: 2, element: 'ice', sortOrder: 16
        },
        {
            id: 'fs_ssr_01', name: '山海经·封印', rarity: 'SSR', module: 'fraction',
            emoji: '🏔️', flavor: '封印着远古力量的山海宝卷', desc: '来自山海经的至高秘宝',
            category: 'legend',
            story: '山海经封印是一卷被远古圣者用分数密码封印的宝卷。卷中记载着分数世界的创世秘密——原来所有的数字都可以用分数来表达。破解封印需要同时精通分数和小数的转换之道，至今只有极少数人做到过。',
            mathTip: null,
            obtainMethod: '击败分数Boss后概率掉落',
            atk: 5, def: 3, element: 'ice', sortOrder: 17
        },
        {
            id: 'fs_ssr_02', name: '混沌之心', rarity: 'SSR', module: 'fraction',
            emoji: '🌀', flavor: '天地未分之前的力量', desc: '传说中的混沌结晶',
            category: 'legend',
            story: '在天地尚未分开的混沌时代，所有的数字都混在一起无法分辨。后来，分数的力量将混沌劈开——分子代表天，分母代表地，中间的分数线就是天地之间的界限。这颗混沌之心保存了开天辟地前的原始力量。',
            mathTip: null,
            obtainMethod: '击败分数Boss后概率掉落',
            atk: 4, def: 4, element: 'ice', sortOrder: 18
        },
        {
            id: 'fs_ur_01', name: '数学之心·分数', rarity: 'UR', module: 'fraction',
            emoji: '💠', flavor: '蕴含着分数终极奥义的结晶', desc: '分数模块的至高收藏',
            category: 'mythic',
            story: '数学之心·分数散发着冰蓝色的寒光，它诞生于人类第一次理解"部分与整体"关系的那个伟大瞬间。这颗心脏中封存着分数世界的全部奥义——从最简单的二分之一到最复杂的分数运算。传说集齐六颗数学之心的勇者将获得看透万物本质的能力，而分数之心教导我们：整体可以被分割，分割后依然可以重新组合为整体。',
            mathTip: null,
            obtainMethod: '收集分数全部卡牌后解锁',
            atk: 6, def: 5, element: 'ice', sortOrder: 19
        },

        // ===== 小数模块 (19张) =====
        {
            id: 'xs_n_01', name: '小数点魔法', rarity: 'N', module: 'decimal',
            emoji: '•', flavor: '小小一个点，位置大不同', desc: '小数点的位置决定数值',
            category: 'knowledge',
            story: '小数点虽然只是一个小小的点，但它站的位置不同，数值就天差地别。1.0和10差了10倍呢！',
            mathTip: '小数点的位置决定数的大小，向右移一位数值变为原来的10倍',
            obtainMethod: '在小数模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 1
        },
        {
            id: 'xs_n_02', name: '乘10右移', rarity: 'N', module: 'decimal',
            emoji: '➡️', flavor: '×10，小数点右移一位', desc: '乘法中的小数规律',
            category: 'knowledge',
            story: '当一个小数乘以10的时候，小数点就像被推了一下，向右边移动一位。0.5变成5，3.14变成31.4。',
            mathTip: '乘以10小数点右移一位：0.5×10=5，3.14×10=31.4',
            obtainMethod: '在小数模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 2
        },
        {
            id: 'xs_n_03', name: '除10左移', rarity: 'N', module: 'decimal',
            emoji: '⬅️', flavor: '÷10，小数点左移一位', desc: '除法中的小数规律',
            category: 'knowledge',
            story: '除以10的时候，小数点往左边退一步。50变成5.0，3变成0.3。这和乘10正好是反过来的操作。',
            mathTip: '除以10小数点左移一位：50÷10=5，3÷10=0.3',
            obtainMethod: '在小数模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 3
        },
        {
            id: 'xs_n_04', name: '乘100双移', rarity: 'N', module: 'decimal',
            emoji: '⏩', flavor: '×100，右移两位', desc: '百倍放大的魔法',
            category: 'knowledge',
            story: '乘以100就是乘以10再乘以10，小数点一口气向右跳两步。0.05变成5，真是一个放大镜般的魔法！',
            mathTip: '乘以100小数点右移两位：0.05×100=5，1.23×100=123',
            obtainMethod: '在小数模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 4
        },
        {
            id: 'xs_n_05', name: '除100双缩', rarity: 'N', module: 'decimal',
            emoji: '⏪', flavor: '÷100，左移两位', desc: '百倍缩小的魔法',
            category: 'knowledge',
            story: '除以100小数点向左退两步，大数字瞬间变成了小数。500变成5.00，仿佛被施了缩小术。',
            mathTip: '除以100小数点左移两位：500÷100=5，23÷100=0.23',
            obtainMethod: '在小数模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 5
        },
        {
            id: 'xs_n_06', name: '千倍变换', rarity: 'N', module: 'decimal',
            emoji: '🔢', flavor: '×1000或÷1000', desc: '三位的跨越',
            category: 'knowledge',
            story: '乘以或除以1000，小数点要一口气走三步。这是小数世界里最大跨度的变换之一。',
            mathTip: '乘以1000小数点右移三位，除以1000左移三位：0.001×1000=1',
            obtainMethod: '在小数模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 6
        },
        {
            id: 'xs_n_07', name: '0.5的世界', rarity: 'N', module: 'decimal',
            emoji: '🌗', flavor: '一半的力量', desc: '最常见的小数',
            category: 'knowledge',
            story: '0.5是小数世界里最常见的居民，它就是"一半"的意思。月亮半圆的时候，就是0.5个满月。',
            mathTip: '0.5就是二分之一（1/2），在生活中表示"一半"的概念',
            obtainMethod: '在小数模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 7
        },
        {
            id: 'xs_n_08', name: '0.1的阶梯', rarity: 'N', module: 'decimal',
            emoji: '🪜', flavor: '十分之一步', desc: '从整数到小数的桥梁',
            category: 'knowledge',
            story: '0.1是连接整数和小数的第一级台阶。从0走到1需要10个0.1，就像爬楼梯一样一步步往上。',
            mathTip: '0.1就是十分之一（1/10），10个0.1等于1',
            obtainMethod: '在小数模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 8
        },
        {
            id: 'xs_r_01', name: '混世魔刀', rarity: 'R', module: 'decimal',
            emoji: '🗡️', flavor: '花果山第一代入侵者', desc: '混世魔王的武器',
            category: 'monster',
            story: '混世魔王是花果山遇到的第一个敌人，虽然实力不算太强，但它手中的这把魔刀却锋利无比。在小数世界里，它用刀把数字一刀两断，创造出各种小数。',
            mathTip: null,
            obtainMethod: '在小数模块击败混世魔王后掉落',
            atk: 2, def: 1, element: 'wind', sortOrder: 9
        },
        {
            id: 'xs_r_02', name: '黄风三昧', rarity: 'R', module: 'decimal',
            emoji: '🌪️', flavor: '迷人眼的妖风', desc: '黄风怪的特技',
            category: 'monster',
            story: '黄风怪最擅长吹出迷人眼的妖风，让人看不清小数点的位置。在它的三昧妖风中，0.1和0.01都会被吹得分不清楚，只有冷静计算才能破解。',
            mathTip: null,
            obtainMethod: '在小数模块击败黄风怪后掉落',
            atk: 3, def: 1, element: 'wind', sortOrder: 10
        },
        {
            id: 'xs_r_03', name: '黑熊袈裟', rarity: 'R', module: 'decimal',
            emoji: '🐻', flavor: '被偷走的锦斓袈裟', desc: '黑熊精的收藏',
            category: 'monster',
            story: '黑熊精偷走了唐僧的锦斓袈裟，把它藏在小数迷宫的最深处。据说袈裟上绣着所有小数和分数的对照表，是一件非常珍贵的数学宝物。',
            mathTip: null,
            obtainMethod: '在小数模块击败黑熊精后掉落',
            atk: 2, def: 2, element: 'wind', sortOrder: 11
        },
        {
            id: 'xs_r_04', name: '金角银角', rarity: 'R', module: 'decimal',
            emoji: '🫙', flavor: '紫金红葫芦，叫名字就收', desc: '金银角大王的宝贝',
            category: 'monster',
            story: '金角银角大王拥有五件宝贝，其中紫金红葫芦最厉害——只要叫你名字，你答应了就会被吸进去。在小数世界里，它们用宝贝收集各种小数。',
            mathTip: null,
            obtainMethod: '在小数模块击败金银角大王后掉落',
            atk: 3, def: 2, element: 'wind', sortOrder: 12
        },
        {
            id: 'xs_r_05', name: '白骨三变', rarity: 'R', module: 'decimal',
            emoji: '💀', flavor: '三次变化骗取师徒', desc: '白骨精的三段变身',
            category: 'monster',
            story: '白骨精善于伪装，先变少女，再变老妇，最后变老翁。在小数世界里，她把同一个数字变来变去——0.5变成0.50再变成0.500，看起来不同但本质相同。',
            mathTip: null,
            obtainMethod: '在小数模块击败白骨精后掉落',
            atk: 2, def: 2, element: 'wind', sortOrder: 13
        },
        {
            id: 'xs_sr_01', name: '定海神针', rarity: 'SR', module: 'decimal',
            emoji: '🏯', flavor: '如意金箍棒，重一万三千五百斤', desc: '孙悟空的兵器',
            effect: { type: 'weaponBoost', weapon: 'all', bonus: 1 },
            category: 'spell',
            story: '如意金箍棒原本是大禹治水时用来测量海水深度的定海神针，重一万三千五百斤。它能随心意变大变小，就像小数点移动一样可以让数字变大变小。',
            mathTip: null,
            obtainMethod: '在小数模块Hard难度中掉落',
            atk: 4, def: 2, element: 'wind', sortOrder: 14
        },
        {
            id: 'xs_sr_02', name: '筋斗云', rarity: 'SR', module: 'decimal',
            emoji: '☁️', flavor: '一个筋斗十万八千里', desc: '极速飞行之术',
            effect: { type: 'speedBoost' },
            category: 'spell',
            story: '筋斗云一翻就是十万八千里，108000用小数表示就是1.08×10的5次方。孙悟空骑着它在小数和大数之间自由穿梭。',
            mathTip: null,
            obtainMethod: '在小数模块Hard难度中掉落',
            atk: 3, def: 3, element: 'wind', sortOrder: 15
        },
        {
            id: 'xs_sr_03', name: '七十二变', rarity: 'SR', module: 'decimal',
            emoji: '🔄', flavor: '千变万化，无所不能', desc: '答题正确率提示',
            effect: { type: 'hintChance', value: 0.1 },
            category: 'spell',
            story: '七十二变让孙悟空能变成任何东西。在小数世界里，这门法术让数字也能自由变换——整数变小数，小数变分数，怎么变都行。',
            mathTip: null,
            obtainMethod: '在小数模块Hard难度中掉落',
            atk: 3, def: 2, element: 'wind', sortOrder: 16
        },
        {
            id: 'xs_ssr_01', name: '西游真经', rarity: 'SSR', module: 'decimal',
            emoji: '📕', flavor: '取经路上的智慧结晶', desc: '西天取经的终极宝典',
            category: 'legend',
            story: '历经九九八十一难，唐僧师徒终于取得真经。这本西游真经不仅记载了佛法，更隐藏着小数世界的终极奥秘。据说真经中每一页都用精确到小数点后108位的数字编码，解读它需要超凡的数学智慧。',
            mathTip: null,
            obtainMethod: '击败小数Boss后概率掉落',
            atk: 5, def: 3, element: 'wind', sortOrder: 17
        },
        {
            id: 'xs_ssr_02', name: '大闹天宫', rarity: 'SSR', module: 'decimal',
            emoji: '🏛️', flavor: '齐天大圣，到此一游！', desc: '悟空最辉煌的时刻',
            category: 'legend',
            story: '齐天大圣大闹天宫是西游记中最经典的篇章。孙悟空一个人打败了十万天兵天将，那一刻他的战斗力突破了所有小数限制，达到了传说中的整数级别。这张卡记录了那个让三界震动的辉煌时刻。',
            mathTip: null,
            obtainMethod: '击败小数Boss后概率掉落',
            atk: 5, def: 4, element: 'wind', sortOrder: 18
        },
        {
            id: 'xs_ur_01', name: '数学之心·小数', rarity: 'UR', module: 'decimal',
            emoji: '🔷', flavor: '蕴含着小数终极奥义的结晶', desc: '小数模块的至高收藏',
            category: 'mythic',
            story: '数学之心·小数散发着翠绿色的柔光，它诞生于人类第一次理解"整数之间还有无穷多个数"的那个震撼瞬间。这颗心脏中封存着小数世界的全部奥义——从0.1到0.001，从有限小数到无限循环小数。传说它能让持有者瞬间看穿任何小数和分数之间的转换关系，是连接整数世界与微观世界的神奇桥梁。集齐六颗数学之心，方能触及数学宇宙的终极真理。',
            mathTip: null,
            obtainMethod: '收集小数全部卡牌后解锁',
            atk: 6, def: 5, element: 'wind', sortOrder: 19
        },

        // ===== 单位模块 (19张) =====
        {
            id: 'dw_n_01', name: '长度之尺', rarity: 'N', module: 'unit',
            emoji: '📏', flavor: '千米→米→分米→厘米→毫米', desc: '长度单位的阶梯',
            category: 'knowledge',
            story: '从千米到毫米，长度单位就像一把神奇的尺子，一级一级地缩小。记住每一级之间的关系，你就能丈量整个世界。',
            mathTip: '长度单位换算：1千米=1000米，1米=10分米=100厘米=1000毫米',
            obtainMethod: '在单位模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 1
        },
        {
            id: 'dw_n_02', name: '质量之秤', rarity: 'N', module: 'unit',
            emoji: '⚖️', flavor: '吨→千克→克', desc: '质量单位的天平',
            category: 'knowledge',
            story: '古老的天平两端放着不同的砝码，它们之间的换算关系就是质量单位的秘密。一吨就是一千千克，一千克就是一千克。',
            mathTip: '质量单位换算：1吨=1000千克，1千克=1000克',
            obtainMethod: '在单位模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 2
        },
        {
            id: 'dw_n_03', name: '容积之杯', rarity: 'N', module: 'unit',
            emoji: '🫗', flavor: '升→毫升', desc: '容积单位的换算',
            category: 'knowledge',
            story: '一杯水有多少呢？用升来量还是用毫升来量？记住一升等于一千毫升，以后喝水也能练数学了。',
            mathTip: '容积单位换算：1升=1000毫升，一瓶矿泉水通常是500毫升=0.5升',
            obtainMethod: '在单位模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 3
        },
        {
            id: 'dw_n_04', name: '人民币之值', rarity: 'N', module: 'unit',
            emoji: '💰', flavor: '元→角→分', desc: '货币单位的换算',
            category: 'knowledge',
            story: '买东西的时候，元、角、分是我们最常接触的单位。1元=10角=100分，用好了就不会找错钱。',
            mathTip: '人民币单位：1元=10角=100分，是十进制换算的实际应用',
            obtainMethod: '在单位模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 4
        },
        {
            id: 'dw_n_05', name: '时间之钟', rarity: 'N', module: 'unit',
            emoji: '⏰', flavor: '小时→分钟→秒', desc: '时间是60进制',
            category: 'knowledge',
            story: '滴答滴答，时钟不停地走着。时间单位和其他单位不同——它用的是60进制，1小时是60分钟，1分钟是60秒。',
            mathTip: '时间是60进制：1小时=60分钟，1分钟=60秒，不是10进制哦',
            obtainMethod: '在单位模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 5
        },
        {
            id: 'dw_n_06', name: '面积之方', rarity: 'N', module: 'unit',
            emoji: '📐', flavor: '面积进率是100不是10', desc: '面积单位的特殊规律',
            category: 'knowledge',
            story: '面积单位和长度单位不一样，它们之间的进率不是10而是100。因为面积是二维的，两个10相乘就变成了100。',
            mathTip: '面积单位进率是100：1平方米=100平方分米=10000平方厘米',
            obtainMethod: '在单位模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 6
        },
        {
            id: 'dw_n_07', name: '千米等于公里', rarity: 'N', module: 'unit',
            emoji: '🛣️', flavor: '两种说法一个意思', desc: '千米和公里的关系',
            category: 'knowledge',
            story: '千米和公里其实是同一个东西的两种叫法，就像同一个人有大名和小名一样。1千米就是1公里。',
            mathTip: '千米和公里是同一个单位的两种说法：1千米=1公里=1000米',
            obtainMethod: '在单位模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 7
        },
        {
            id: 'dw_n_08', name: '千克等于公斤', rarity: 'N', module: 'unit',
            emoji: '🏋️', flavor: '两种说法一个意思', desc: '千克和公斤的关系',
            category: 'knowledge',
            story: '千克和公斤也是一对"双胞胎名字"，说的都是同一个重量单位。在菜市场，叔叔阿姨常说公斤，在课堂上老师常说千克。',
            mathTip: '千克和公斤是同一个单位的两种说法：1千克=1公斤=1000克',
            obtainMethod: '在单位模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 8
        },
        {
            id: 'dw_r_01', name: '土行孙遁术', rarity: 'R', module: 'unit',
            emoji: '🐹', flavor: '地底穿行千里', desc: '土行孙的地遁之术',
            category: 'monster',
            story: '土行孙身高不足三尺，却精通地遁之术，能在地底穿行千里。他用自己的身高来理解厘米和米的换算，成为了单位世界的地下守卫。',
            mathTip: null,
            obtainMethod: '在单位模块击败土行孙后掉落',
            atk: 2, def: 2, element: 'earth', sortOrder: 9
        },
        {
            id: 'dw_r_02', name: '哪吒风火轮', rarity: 'R', module: 'unit',
            emoji: '🔥', flavor: '脚踏风火，日行千里', desc: '哪吒的速度法宝',
            category: 'monster',
            story: '哪吒脚踏风火轮，日行千里。千里就是500千米，用他的速度来理解距离单位再合适不过了。风火轮旋转的速度也能用时间单位来计算。',
            mathTip: null,
            obtainMethod: '在单位模块击败哪吒后掉落',
            atk: 3, def: 1, element: 'thunder', sortOrder: 10
        },
        {
            id: 'dw_r_03', name: '雷震子之翼', rarity: 'R', module: 'unit',
            emoji: '⚡', flavor: '展翅万里', desc: '雷震子的雷翼',
            category: 'monster',
            story: '雷震子长着一对雷翼，展翅便能飞跃万里。他飞过的距离用千米来计算，翅膀扇动的频率用秒来衡量，是单位换算的活教材。',
            mathTip: null,
            obtainMethod: '在单位模块击败雷震子后掉落',
            atk: 3, def: 1, element: 'thunder', sortOrder: 11
        },
        {
            id: 'dw_r_04', name: '杨戬天眼', rarity: 'R', module: 'unit',
            emoji: '👁️', flavor: '洞察万物的第三只眼', desc: '二郎神的神通',
            category: 'monster',
            story: '二郎神杨戬的天眼能看穿一切伪装，在单位世界里他用天眼来分辨那些容易搞混的单位——千米和米、千克和克，一眼就能看出正确的换算关系。',
            mathTip: null,
            obtainMethod: '在单位模块击败杨戬后掉落',
            atk: 2, def: 2, element: 'earth', sortOrder: 12
        },
        {
            id: 'dw_r_05', name: '姜子牙钓竿', rarity: 'R', module: 'unit',
            emoji: '🎣', flavor: '愿者上钩', desc: '太公的智慧之竿',
            category: 'monster',
            story: '姜子牙用直钩钓鱼，愿者上钩。他的钓竿精确到毫米，钓线长度从厘米到米都计算得一丝不苟。这份耐心和精确正是学习单位换算所需要的。',
            mathTip: null,
            obtainMethod: '在单位模块击败姜子牙后掉落',
            atk: 2, def: 2, element: 'earth', sortOrder: 13
        },
        {
            id: 'dw_sr_01', name: '封神榜', rarity: 'SR', module: 'unit',
            emoji: '📜', flavor: '三百六十五位正神之位', desc: '封神大典的终极名册',
            effect: { type: 'scoreBoost', value: 1.2 },
            category: 'spell',
            story: '封神榜上记载了365位正神的名字，每一位神仙对应一天。这本名册不仅是封神的凭证，还隐藏着时间单位的秘密——一年365天的奥义。',
            mathTip: null,
            obtainMethod: '在单位模块Hard难度中掉落',
            atk: 3, def: 3, element: 'thunder', sortOrder: 14
        },
        {
            id: 'dw_sr_02', name: '打神鞭', rarity: 'SR', module: 'unit',
            emoji: '🏏', flavor: '只打封神榜上人', desc: '封神之战的神器',
            effect: { type: 'weaponBoost', weapon: 'all', bonus: 1 },
            category: 'spell',
            story: '打神鞭是姜子牙的专属武器，鞭长三尺六寸，恰好是一种古代长度单位的表达。挥动一次打神鞭能产生千钧之力，千钧就是三万斤。',
            mathTip: null,
            obtainMethod: '在单位模块Hard难度中掉落',
            atk: 4, def: 2, element: 'earth', sortOrder: 15
        },
        {
            id: 'dw_sr_03', name: '混元珠', rarity: 'SR', module: 'unit',
            emoji: '🔴', flavor: '集水火风雷于一身', desc: '太极生两仪的终极之球',
            effect: { type: 'bonusDamage', condition: 'unit', bonus: 1 },
            category: 'spell',
            story: '混元珠蕴含水火风雷四种元素的力量。它的直径精确到0.001毫米，重量精确到0.001克，温度精确到0.001度——是单位精确换算的终极象征。',
            mathTip: null,
            obtainMethod: '在单位模块Hard难度中掉落',
            atk: 3, def: 3, element: 'thunder', sortOrder: 16
        },
        {
            id: 'dw_ssr_01', name: '封神·天命', rarity: 'SSR', module: 'unit',
            emoji: '🌟', flavor: '天意难违，封神之路', desc: '封神演义的至高意志',
            category: 'legend',
            story: '封神天命是超越凡人理解的至高意志。它规定了天地万物的度量标准——山有多高用千米量，海有多深用米量，沙有多细用毫米量。这张卡承载着丈量天地的终极权柄，只有精通所有单位换算的人才配拥有它。',
            mathTip: null,
            obtainMethod: '击败单位Boss后概率掉落',
            atk: 5, def: 3, element: 'thunder', sortOrder: 17
        },
        {
            id: 'dw_ssr_02', name: '盘古开天', rarity: 'SSR', module: 'unit',
            emoji: '🌍', flavor: '开天辟地的伟力', desc: '天地之始的终极力量',
            category: 'legend',
            story: '盘古用一把巨斧劈开了混沌，天地由此诞生。他每天长高一丈（约3.33米），天每天高一丈，地每天厚一丈。经过一万八千年，天地之间相距九万里（45000千米）。这张卡记载了创世之初最宏大的单位换算故事。',
            mathTip: null,
            obtainMethod: '击败单位Boss后概率掉落',
            atk: 4, def: 4, element: 'earth', sortOrder: 18
        },
        {
            id: 'dw_ur_01', name: '数学之心·单位', rarity: 'UR', module: 'unit',
            emoji: '🔶', flavor: '蕴含着单位换算终极奥义的结晶', desc: '单位模块的至高收藏',
            category: 'mythic',
            story: '数学之心·单位闪耀着雷电般的紫金色光芒，它诞生于人类第一次用统一的标准来度量世界的那个划时代瞬间。这颗心脏中蕴含着所有度量衡的终极奥义——长度、质量、容积、时间、面积，万物皆可度量。传说拥有它的人能瞬间在任何单位之间自由转换，无论是千米和毫米，还是吨和克，都如同呼吸般自然。它教导我们：用正确的尺度去丈量，才能真正理解这个世界。',
            mathTip: null,
            obtainMethod: '收集单位全部卡牌后解锁',
            atk: 6, def: 5, element: 'thunder', sortOrder: 19
        },

        // ===== 乘法速记模块 (19张) =====
        {
            id: 'cf_n_01', name: '25×4=100', rarity: 'N', module: 'multiply',
            emoji: '🎯', flavor: '看到4想25', desc: '乘法速记第一定律',
            category: 'knowledge',
            story: '25和4是天生的好朋友，它们一见面就会变成100。这是乘法速记中最基础也最重要的一条定律。',
            mathTip: '25×4=100，看到4或25要立刻想到凑100，这是速算的关键技巧',
            obtainMethod: '在乘法速记模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 1
        },
        {
            id: 'cf_n_02', name: '125×8=1000', rarity: 'N', module: 'multiply',
            emoji: '🎱', flavor: '看到8想125', desc: '乘法速记第二定律',
            category: 'knowledge',
            story: '125和8的相遇会创造出1000。就像台球的8号球一样，这个组合在速算中是制胜的关键一击。',
            mathTip: '125×8=1000，看到8或125要想到凑1000，比25×4更进阶',
            obtainMethod: '在乘法速记模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 2
        },
        {
            id: 'cf_n_03', name: '50×2=100', rarity: 'N', module: 'multiply',
            emoji: '💫', flavor: '最简单的凑百', desc: '基础凑整技巧',
            category: 'knowledge',
            story: '50和2的组合是最简单的凑百搭档。虽然简单，但在复杂计算中往往能发挥出意想不到的妙用。',
            mathTip: '50×2=100，是最简单的凑整组合，计算中经常用到',
            obtainMethod: '在乘法速记模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 3
        },
        {
            id: 'cf_n_04', name: '25的朋友', rarity: 'N', module: 'multiply',
            emoji: '🤝', flavor: '25×2,4,8,12,16,20', desc: '25的系列乘积',
            category: 'knowledge',
            story: '25是一个社交达人，它和2交朋友得50，和4交朋友得100，和8交朋友得200。认识25的所有朋友，速算实力大增。',
            mathTip: '25的倍数：25×2=50，25×4=100，25×8=200，25×12=300，25×16=400',
            obtainMethod: '在乘法速记模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 4
        },
        {
            id: 'cf_n_05', name: '125的朋友', rarity: 'N', module: 'multiply',
            emoji: '🤜', flavor: '125×2,4,8,16,24', desc: '125的系列乘积',
            category: 'knowledge',
            story: '125比25更高级，它和8碰面变成1000，和16碰面变成2000。记住125的朋友圈，千位数的计算就不在话下了。',
            mathTip: '125的倍数：125×2=250，125×4=500，125×8=1000，125×16=2000',
            obtainMethod: '在乘法速记模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 5
        },
        {
            id: 'cf_n_06', name: '逆向思维', rarity: 'N', module: 'multiply',
            emoji: '🔄', flavor: '100÷4=25', desc: '除法验证乘法',
            category: 'knowledge',
            story: '正着算不出来的时候，试试反过来想。100除以4等于25，所以25乘以4就等于100。逆向思维是数学高手的法宝。',
            mathTip: '用除法验证乘法：如果a×b=c，那么c÷a=b，c÷b=a',
            obtainMethod: '在乘法速记模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 6
        },
        {
            id: 'cf_n_07', name: '75的秘密', rarity: 'N', module: 'multiply',
            emoji: '7️⃣', flavor: '75=25×3', desc: '拆分法的妙用',
            category: 'knowledge',
            story: '75看起来不好算，但只要把它拆成25×3，一切就变得简单了。拆分法是把复杂数字变简单的魔法。',
            mathTip: '拆分法：75=25×3，所以75×4=25×3×4=100×3=300',
            obtainMethod: '在乘法速记模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 7
        },
        {
            id: 'cf_n_08', name: '凑整大法', rarity: 'N', module: 'multiply',
            emoji: '🧮', flavor: '拆成已知的组合', desc: '乘法速记的核心思想',
            category: 'knowledge',
            story: '凑整大法是所有速算技巧的总纲领——把不好算的数拆成好算的组合，再利用已知结果快速得出答案。这是数学高手的核心武功。',
            mathTip: '凑整的核心思想：把复杂的乘法拆成简单的组合，如99×7=(100-1)×7=700-7=693',
            obtainMethod: '在乘法速记模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 8
        },
        {
            id: 'cf_r_01', name: '婴宁之笑', rarity: 'R', module: 'multiply',
            emoji: '🌸', flavor: '笑一笑，十年少', desc: '爱笑的小狐狸精',
            category: 'monster',
            story: '婴宁是聊斋中最爱笑的狐狸精，她的笑声像花一样绽放。在乘法速记的世界里，她总是笑嘻嘻地出题考你，答对了她会笑得更开心。',
            mathTip: null,
            obtainMethod: '在乘法速记模块击败婴宁后掉落',
            atk: 2, def: 1, element: 'earth', sortOrder: 9
        },
        {
            id: 'cf_r_02', name: '画皮鬼面', rarity: 'R', module: 'multiply',
            emoji: '🎭', flavor: '美丽外表下的秘密', desc: '画皮妖怪的面具',
            category: 'monster',
            story: '画皮妖最擅长伪装，就像那些看起来很难的乘法题，其实只要拆分一下就很简单。画皮鬼面提醒我们不要被表面迷惑，要看到数字背后的规律。',
            mathTip: null,
            obtainMethod: '在乘法速记模块击败画皮妖后掉落',
            atk: 3, def: 1, element: 'holy', sortOrder: 10
        },
        {
            id: 'cf_r_03', name: '聂小倩丝帕', rarity: 'R', module: 'multiply',
            emoji: '🧣', flavor: '三生三世的羁绊', desc: '聊斋最美的相遇',
            category: 'monster',
            story: '聂小倩是聊斋中最善良的女鬼，她用丝帕记录着每一道乘法算式。这条丝帕上绣着密密麻麻的速算公式，是她留给后人的珍贵礼物。',
            mathTip: null,
            obtainMethod: '在乘法速记模块击败聂小倩后掉落',
            atk: 2, def: 2, element: 'earth', sortOrder: 11
        },
        {
            id: 'cf_r_04', name: '黑山老妖气', rarity: 'R', module: 'multiply',
            emoji: '👹', flavor: '千年修炼的妖气', desc: '黑山老妖的威压',
            category: 'monster',
            story: '黑山老妖修炼了上千年，它的妖气弥漫在乘法速记的黑暗森林中。虽然看起来很可怕，但只要掌握了凑整的技巧，就能驱散它的妖气。',
            mathTip: null,
            obtainMethod: '在乘法速记模块击败黑山老妖后掉落',
            atk: 3, def: 2, element: 'holy', sortOrder: 12
        },
        {
            id: 'cf_r_05', name: '促织蟋蟀', rarity: 'R', module: 'multiply',
            emoji: '🦗', flavor: '小小蟋蟀，大大勇气', desc: '斗蟋蟀的传奇',
            category: 'monster',
            story: '促织虽然是只小蟋蟀，但它有着惊人的战斗力。就像乘法速记中那些看似不起眼的小技巧，用好了就能以小博大，创造奇迹。',
            mathTip: null,
            obtainMethod: '在乘法速记模块击败促织后掉落',
            atk: 2, def: 2, element: 'earth', sortOrder: 13
        },
        {
            id: 'cf_sr_01', name: '聊斋·灵符', rarity: 'SR', module: 'multiply',
            emoji: '📿', flavor: '驱邪避凶的灵符', desc: '聊斋道士的护身符',
            effect: { type: 'startShield', value: 1 },
            category: 'spell',
            story: '聊斋中的道士用朱砂画出灵符，能驱除一切妖邪。这张灵符上写着乘法速记的口诀，既能保护持有者不受妖怪伤害，又能提升速算能力。',
            mathTip: null,
            obtainMethod: '在乘法速记模块Hard难度中掉落',
            atk: 3, def: 3, element: 'holy', sortOrder: 14
        },
        {
            id: 'cf_sr_02', name: '狐仙幻术', rarity: 'SR', module: 'multiply',
            emoji: '🦊', flavor: '迷惑众生的幻术', desc: '狐仙的独门绝技',
            effect: { type: 'hintChance', value: 0.1 },
            category: 'spell',
            story: '聊斋中的狐仙精通幻术，能让你看到题目的"隐藏答案"。这门幻术可以在你遇到困难时提供一点小小的提示，帮你找到速算的捷径。',
            mathTip: null,
            obtainMethod: '在乘法速记模块Hard难度中掉落',
            atk: 3, def: 2, element: 'earth', sortOrder: 15
        },
        {
            id: 'cf_sr_03', name: '阎罗判笔', rarity: 'SR', module: 'multiply',
            emoji: '✒️', flavor: '一笔定生死', desc: '阎王爷的判决之笔',
            effect: { type: 'bonusDamage', condition: 'multiply', bonus: 1 },
            category: 'spell',
            story: '阎罗王用这支判笔审判善恶，一笔下去便定了结果。在乘法速记的战场上，这支笔象征着精准和果断——看到题目就下笔，不犹豫不迟疑。',
            mathTip: null,
            obtainMethod: '在乘法速记模块Hard难度中掉落',
            atk: 4, def: 2, element: 'holy', sortOrder: 16
        },
        {
            id: 'cf_ssr_01', name: '聊斋·鬼卷', rarity: 'SSR', module: 'multiply',
            emoji: '📕', flavor: '记载百鬼的奇书', desc: '聊斋志异的原本',
            category: 'legend',
            story: '聊斋·鬼卷是蒲松龄用一生心血写成的奇书原本。书中不仅记载了四百多个妖鬼故事，还在每个故事的字里行间隐藏着乘法速记的秘密。传说读完整本鬼卷的人会获得过目不忘的能力，任何乘法算式都能一眼看出答案。',
            mathTip: null,
            obtainMethod: '击败乘法速记Boss后概率掉落',
            atk: 5, def: 3, element: 'earth', sortOrder: 17
        },
        {
            id: 'cf_ssr_02', name: '蒲松龄之笔', rarity: 'SSR', module: 'multiply',
            emoji: '🖊️', flavor: '写尽人间百态', desc: '一支笔写出千古奇书',
            category: 'legend',
            story: '蒲松龄先生在路边设茶摊，请路人讲故事来换茶喝，用这支笔记下了无数奇闻异事。这支笔蕴含着化平凡为神奇的力量——就像乘法速记能把复杂的计算变得简单一样。一支笔改变了文学史，一个技巧改变了你的数学能力。',
            mathTip: null,
            obtainMethod: '击败乘法速记Boss后概率掉落',
            atk: 4, def: 4, element: 'holy', sortOrder: 18
        },
        {
            id: 'cf_ur_01', name: '数学之心·乘法', rarity: 'UR', module: 'multiply',
            emoji: '❤️‍🔥', flavor: '蕴含着乘法速记终极奥义的结晶', desc: '乘法模块的至高收藏',
            category: 'mythic',
            story: '数学之心·乘法燃烧着大地般厚重而热烈的金色光焰，它诞生于人类第一次发现"凑整"技巧的那个充满惊喜的瞬间。这颗心脏中蕴含着所有乘法速记的终极奥义——从25×4=100到125×8=1000，从拆分法到凑整大法。传说持有它的人能瞬间看穿任何乘法算式中隐藏的简化路径，让复杂的计算变得像呼吸一样自然。六颗数学之心中，乘法之心教导我们：智慧不在于硬算，而在于发现数字间美妙的联系。',
            mathTip: null,
            obtainMethod: '收集乘法速记全部卡牌后解锁',
            atk: 6, def: 5, element: 'earth', sortOrder: 19
        },

        // ===== 大九九模块 (19张) =====
        {
            id: 'djj_n_01', name: '11的秘诀', rarity: 'N', module: 'times',
            emoji: '🔑', flavor: '两头不动中间加', desc: '11×N的速算法',
            category: 'knowledge',
            story: '11的乘法有一个神奇的秘诀——两头不动，中间相加。比如11×23，两头是2和3，中间是2+3=5，答案就是253。',
            mathTip: '11×两位数的速算法：两头不动中间加，如11×23=253（中间2+3=5）',
            obtainMethod: '在大九九模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 1
        },
        {
            id: 'djj_n_02', name: '拆分法', rarity: 'N', module: 'times',
            emoji: '✂️', flavor: '拆成10+N来算', desc: '大九九的基本技巧',
            category: 'knowledge',
            story: '大九九中的数字看起来很大，但只要拆成10加几就简单了。比如12×7，拆成10×7+2×7=70+14=84。',
            mathTip: '拆分法：把两位数拆成10+N，如12×7=(10+2)×7=10×7+2×7=70+14=84',
            obtainMethod: '在大九九模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 2
        },
        {
            id: 'djj_n_03', name: '凑整法', rarity: 'N', module: 'times',
            emoji: '🧩', flavor: '看到15想半个30', desc: '利用整数简化运算',
            category: 'knowledge',
            story: '15是半个30，所以15×N可以先算30×N再除以2。这种凑整的思路在大九九中非常有用。',
            mathTip: '凑整法：15×N=30×N÷2，如15×6=30×6÷2=180÷2=90',
            obtainMethod: '在大九九模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 3
        },
        {
            id: 'djj_n_04', name: '平方数之美', rarity: 'N', module: 'times',
            emoji: '²', flavor: '11²=121, 12²=144...', desc: '完全平方数的魅力',
            category: 'knowledge',
            story: '完全平方数有着独特的美感——121、144、169、196，这些数字方方正正，像一块块完美的正方形。',
            mathTip: '常用平方数：11²=121，12²=144，13²=169，14²=196，15²=225',
            obtainMethod: '在大九九模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 4
        },
        {
            id: 'djj_n_05', name: '互补凑20', rarity: 'N', module: 'times',
            emoji: '🤲', flavor: '11×19, 12×18, 13×17...', desc: '两数之和为20的规律',
            category: 'knowledge',
            story: '当两个数加起来等于20时，它们的乘积有特殊规律：越接近10×10=100，乘积越大。这是大九九中美妙的对称之美。',
            mathTip: '互补凑20：两数之和为20时，可用(10+a)(10-a)=100-a²来快速计算',
            obtainMethod: '在大九九模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 5
        },
        {
            id: 'djj_n_06', name: '尾5平方法', rarity: 'N', module: 'times',
            emoji: '5️⃣', flavor: '15²→1×2接25→225', desc: '尾数是5的快速平方',
            category: 'knowledge',
            story: '尾数是5的数字求平方有捷径：十位数乘以比它大1的数，再接上25。15²=1×2接25=225。',
            mathTip: '尾5平方法：N5²=N×(N+1)接25，如15²=1×2=2，接25得225',
            obtainMethod: '在大九九模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 6
        },
        {
            id: 'djj_n_07', name: '相邻数平方', rarity: 'N', module: 'times',
            emoji: '↔️', flavor: '12×14=13²-1=168', desc: '相邻数相乘的秘密',
            category: 'knowledge',
            story: '两个相邻的数相乘，等于中间那个数的平方减1。这个规律在大九九中非常实用。12×14=13²-1=168。',
            mathTip: '相邻数积：(n-1)×(n+1)=n²-1，如12×14=13²-1=169-1=168',
            obtainMethod: '在大九九模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 7
        },
        {
            id: 'djj_n_08', name: '12的乘法表', rarity: 'N', module: 'times',
            emoji: '📊', flavor: '144,156,168,180...', desc: '时钟的数学',
            category: 'knowledge',
            story: '时钟上有12个数字，12的乘法在生活中无处不在。一年12个月，一打12个，掌握12的乘法表非常重要。',
            mathTip: '12的乘法表：12×12=144，12×13=156，12×14=168，12×15=180',
            obtainMethod: '在大九九模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 8
        },
        {
            id: 'djj_r_01', name: '海德薇信笺', rarity: 'R', module: 'times',
            emoji: '🦉', flavor: '来自猫头鹰的信', desc: '海德薇送来的入学通知',
            category: 'monster',
            story: '一只雪白的猫头鹰从窗外飞来，嘴里叼着一封用羊皮纸写成的信。信上写着大九九的入学通知，邀请你进入魔法数学学院的大门。',
            mathTip: null,
            obtainMethod: '在大九九模块击败海德薇后掉落',
            atk: 2, def: 1, element: 'thunder', sortOrder: 9
        },
        {
            id: 'djj_r_02', name: '分院帽碎片', rarity: 'R', module: 'times',
            emoji: '🎩', flavor: '勇气、智慧、忠诚、野心', desc: '四大学院的选择',
            category: 'monster',
            story: '古老的分院帽破碎了一角，但它依然能读取你内心的想法。它会根据你的数学天赋将你分配到最适合的学院——勇敢面对难题的格兰芬多，还是善于思考的拉文克劳？',
            mathTip: null,
            obtainMethod: '在大九九模块击败分院帽后掉落',
            atk: 2, def: 2, element: 'dark', sortOrder: 10
        },
        {
            id: 'djj_r_03', name: '魁地奇金飞贼', rarity: 'R', module: 'times',
            emoji: '⚽', flavor: '抓住它就赢了', desc: '150分的关键',
            category: 'monster',
            story: '金色飞贼在大九九的数字迷宫中飞速穿梭，速度极快。抓住它意味着立刻获得150分的奖励——而15×10正好等于150，大九九在这里也有用武之地。',
            mathTip: null,
            obtainMethod: '在大九九模块击败金飞贼后掉落',
            atk: 3, def: 1, element: 'thunder', sortOrder: 11
        },
        {
            id: 'djj_r_04', name: '家养小精灵袜', rarity: 'R', module: 'times',
            emoji: '🧦', flavor: '多比是自由的精灵！', desc: '自由的象征',
            category: 'monster',
            story: '一只小小的袜子就能让家养小精灵获得自由。多比用它的自由帮助数学勇者通过大九九的考验，是最忠诚的数学伙伴。',
            mathTip: null,
            obtainMethod: '在大九九模块击败多比后掉落',
            atk: 2, def: 2, element: 'dark', sortOrder: 12
        },
        {
            id: 'djj_r_05', name: '凤凰之泪', rarity: 'R', module: 'times',
            emoji: '💧', flavor: '凤凰的眼泪能治愈一切', desc: '福克斯的神奇力量',
            category: 'monster',
            story: '凤凰福克斯的眼泪拥有治愈一切的力量。在大九九的战斗中，凤凰之泪能修复因计算错误而受到的伤害，给予勇者再次挑战的勇气。',
            mathTip: null,
            obtainMethod: '在大九九模块击败凤凰后掉落',
            atk: 2, def: 3, element: 'thunder', sortOrder: 13
        },
        {
            id: 'djj_sr_01', name: '魔杖·老魔杖', rarity: 'SR', module: 'times',
            emoji: '🪄', flavor: '死亡圣器之一', desc: '最强大的魔杖',
            effect: { type: 'weaponBoost', weapon: 'all', bonus: 2 },
            category: 'spell',
            story: '老魔杖是死亡圣器中最强大的一件，接骨木制成，核心是夜骐尾毛。传说它的力量来源于对数学的终极理解——只有掌握了大九九全部奥义的人才能发挥它的全部威力。',
            mathTip: null,
            obtainMethod: '在大九九模块Hard难度中掉落',
            atk: 4, def: 2, element: 'dark', sortOrder: 14
        },
        {
            id: 'djj_sr_02', name: '隐形斗篷', rarity: 'SR', module: 'times',
            emoji: '🧥', flavor: '死亡圣器之一', desc: '隐身闪避一次攻击',
            effect: { type: 'dodgeChance', value: 0.15 },
            category: 'spell',
            story: '这件隐形斗篷能让穿戴者完全消失，即使是死神也找不到你。在大九九的战斗中，它能帮你躲过一次致命攻击，给你多一次答题的机会。',
            mathTip: null,
            obtainMethod: '在大九九模块Hard难度中掉落',
            atk: 3, def: 3, element: 'thunder', sortOrder: 15
        },
        {
            id: 'djj_sr_03', name: '复活石', rarity: 'SR', module: 'times',
            emoji: '💍', flavor: '死亡圣器之一', desc: '死而复生的力量',
            effect: { type: 'reviveChance', value: 0.1 },
            category: 'spell',
            story: '复活石能召回逝去者的灵魂。在数学世界里，它代表着"再来一次"的力量——即使生命值归零，也有机会死而复生，继续你的大九九挑战之旅。',
            mathTip: null,
            obtainMethod: '在大九九模块Hard难度中掉落',
            atk: 3, def: 3, element: 'dark', sortOrder: 16
        },
        {
            id: 'djj_ssr_01', name: '活点地图', rarity: 'SSR', module: 'times',
            emoji: '🗺️', flavor: '我庄严宣誓我没干好事', desc: '霍格沃茨的终极秘宝',
            category: 'legend',
            story: '活点地图由月牙脸、尖头叉子、大脚板和虫尾巴四人联手创造，能显示霍格沃茨每一个角落和每一个人的位置。在大九九的数学迷宫中，这张地图能揭示所有数字之间的隐藏联系，帮你找到最快的解题路径。只需念出"我庄严宣誓我没干好事"，地图就会显现。',
            mathTip: null,
            obtainMethod: '击败大九九Boss后概率掉落',
            atk: 5, def: 3, element: 'thunder', sortOrder: 17
        },
        {
            id: 'djj_ssr_02', name: '魔法石', rarity: 'SSR', module: 'times',
            emoji: '🔴', flavor: '尼可·勒梅的杰作', desc: '永生不死的传说',
            category: 'legend',
            story: '魔法石是炼金术士尼可·勒梅的毕生杰作，能将任何金属变成黄金，还能酿造出长生不老药。在大九九的世界里，魔法石象征着将复杂计算化为简单答案的终极炼金术。六百多年的智慧凝聚在这一颗小小的红色宝石中，拥有它便拥有了数学的永恒力量。',
            mathTip: null,
            obtainMethod: '击败大九九Boss后概率掉落',
            atk: 4, def: 4, element: 'dark', sortOrder: 18
        },
        {
            id: 'djj_ur_01', name: '数学之心·大九九', rarity: 'UR', module: 'times',
            emoji: '🔮', flavor: '蕴含着大九九终极奥义的结晶', desc: '大九九模块的至高收藏',
            category: 'mythic',
            story: '数学之心·大九九散发着神秘的紫色雷光，它诞生于人类第一次突破"九九乘法表"的极限、将乘法扩展到两位数的那个勇敢瞬间。这颗心脏中封存着11到19所有乘法组合的终极奥义——从11×11=121到19×19=361，每一个结果都是一把打开智慧之门的钥匙。传说持有它的人能在脑海中瞬间构建出完整的大九九矩阵，任何两位数乘法都能一眼看穿答案。它教导我们：勇于挑战更大的数字，才能发现更广阔的数学天地。',
            mathTip: null,
            obtainMethod: '收集大九九全部卡牌后解锁',
            atk: 6, def: 5, element: 'thunder', sortOrder: 19
        },

        // ===== 跨模块卡牌 (10张) =====
        {
            id: 'cross_n_01', name: '勤奋之星', rarity: 'N', module: 'cross',
            emoji: '⭐', flavor: '每天进步一点点', desc: '坚持练习的证明',
            category: 'knowledge',
            story: '每天坚持练习数学，就像天上的星星一样，日积月累终会发出耀眼的光芒。勤奋之星是对坚持者最好的奖励。',
            mathTip: '每天坚持练习10分钟，一个月就是300分钟，积少成多效果惊人',
            obtainMethod: '在任意模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 1
        },
        {
            id: 'cross_n_02', name: '错题收集者', rarity: 'N', module: 'cross',
            emoji: '📝', flavor: '错误是最好的老师', desc: '从错误中学习',
            category: 'knowledge',
            story: '每一道做错的题目都是一位好老师，它告诉你哪里还需要加强。把错题收集起来反复练习，是进步最快的秘诀。',
            mathTip: '把做错的题目记录下来，分析错误原因，反复练习直到完全掌握',
            obtainMethod: '在任意模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 2
        },
        {
            id: 'cross_n_03', name: '速算达人', rarity: 'N', module: 'cross',
            emoji: '🧠', flavor: '快而准的大脑', desc: '速算能力的证明',
            category: 'knowledge',
            story: '速算达人的大脑像一台高速计算机，看到题目就能立刻给出答案。但这不是天赋，而是日复一日训练的成果。',
            mathTip: '速算的秘诀是把常用的计算结果记住，做到看到就知道答案',
            obtainMethod: '在任意模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 3
        },
        {
            id: 'cross_n_04', name: '坚持不懈', rarity: 'N', module: 'cross',
            emoji: '💪', flavor: '坚持就是胜利', desc: '永不放弃的精神',
            category: 'knowledge',
            story: '数学学习的路上没有捷径，但有一条永远不会走错的路——坚持。只要不放弃，终有一天你会成为数学小达人。',
            mathTip: '遇到不会的题目不要放弃，多想想、多试试，总能找到解题方法',
            obtainMethod: '在任意模块战斗中概率掉落',
            atk: null, def: null, element: null, sortOrder: 4
        },
        {
            id: 'cross_r_01', name: '全模块通行证', rarity: 'R', module: 'cross',
            emoji: '🎫', flavor: '六大模块的冒险者', desc: '体验过所有模块',
            category: 'monster',
            story: '这张通行证盖满了六大模块的印章，证明持有者曾经踏足每一个数学领域。从乘法到分数，从小数到单位，真正的冒险者不会遗漏任何一个世界。',
            mathTip: null,
            obtainMethod: '在跨模块任务中击败怪物后掉落',
            atk: 2, def: 2, element: 'fire', sortOrder: 5
        },
        {
            id: 'cross_r_02', name: '妖怪图鉴大师', rarity: 'R', module: 'cross',
            emoji: '📖', flavor: '收集妖怪的行家', desc: '妖怪收集达人',
            category: 'monster',
            story: '妖怪图鉴大师走遍了六大模块，记录下每一只妖怪的习性和弱点。它的图鉴是冒险者们最重要的参考资料，知己知彼才能百战百胜。',
            mathTip: null,
            obtainMethod: '在跨模块任务中击败怪物后掉落',
            atk: 3, def: 2, element: 'ice', sortOrder: 6
        },
        {
            id: 'cross_sr_01', name: '数学小天才', rarity: 'SR', module: 'cross',
            emoji: '🌟', flavor: '数学是宇宙的语言', desc: '全面发展的数学能力',
            effect: { type: 'allBoost', value: 1.1 },
            category: 'spell',
            story: '数学小天才不是只擅长一个领域的专家，而是在所有数学模块都表现出色的全能型选手。这颗闪耀的星星代表着全面发展的数学能力。',
            mathTip: null,
            obtainMethod: '在跨模块Hard难度中掉落',
            atk: 4, def: 3, element: 'holy', sortOrder: 7
        },
        {
            id: 'cross_sr_02', name: '卡牌收藏家', rarity: 'SR', module: 'cross',
            emoji: '🗂️', flavor: '收集是一种艺术', desc: '卡牌掉率+5%',
            effect: { type: 'dropBoost', value: 0.05 },
            category: 'spell',
            story: '卡牌收藏家对每一张卡牌都爱不释手，精心整理和保管。拥有这张卡的人会发现卡牌掉率提升了——因为数学世界也尊重热爱收集的人。',
            mathTip: null,
            obtainMethod: '在跨模块Hard难度中掉落',
            atk: 3, def: 3, element: 'wind', sortOrder: 8
        },
        {
            id: 'cross_ssr_01', name: '传说猎人', rarity: 'SSR', module: 'cross',
            emoji: '🏅', flavor: '追寻传说的勇者', desc: '稀有卡牌掉率提升',
            category: 'legend',
            story: '传说猎人是数学世界中最执着的冒险者，他不知疲倦地追寻着每一个模块的传说级宝物。经过无数次战斗和挑战，他终于集齐了足够的勋章，获得了这枚象征至高荣耀的金牌。拥有它的人在之后的冒险中，更容易邂逅稀有的卡牌。',
            mathTip: null,
            obtainMethod: '击败跨模块Boss后概率掉落',
            atk: 5, def: 4, element: 'thunder', sortOrder: 9
        },
        {
            id: 'cross_ur_01', name: '数学之心·万象', rarity: 'UR', module: 'cross',
            emoji: '💖', flavor: '六大模块的力量汇聚于一心，数学的终极奥义在此绽放', desc: '全游戏的至高收藏，集齐六颗数学之心可召唤',
            category: 'mythic',
            story: '数学之心·万象是所有数学之心的集大成者，它散发着包含彩虹全部颜色的绚丽光芒。当六颗数学之心——乘法、分数、小数、单位、乘法速记、大九九——全部集齐后，它们会在宇宙中心汇聚，融合成这颗终极的万象之心。它蕴含着数学宇宙中一切运算法则的终极奥义，是理解万物本源的钥匙。传说拥有万象之心的人能听到数字之间的对话，看到公式背后的真理，感受到数学之美流淌在宇宙的每一个角落。这是数学冒险的终点，也是智慧旅程的新起点。',
            mathTip: null,
            obtainMethod: '收集全部六颗数学之心后解锁',
            atk: 6, def: 5, element: 'holy', sortOrder: 10
        }
    ],

    // Module themes configuration
    moduleThemes: {
        xiaojiujiu: { name: '小九九系列', color: '#E74C3C', gradient: 'linear-gradient(135deg, #E74C3C, #F39C12)', icon: '🔥', element: 'fire', totalCards: 19 },
        times:      { name: '大九九系列', color: '#8E44AD', gradient: 'linear-gradient(135deg, #8E44AD, #6C3483)', icon: '⚡', element: 'thunder', totalCards: 19 },
        multiply:   { name: '乘法速记系列', color: '#F39C12', gradient: 'linear-gradient(135deg, #F39C12, #E67E22)', icon: '💎', element: 'earth', totalCards: 19 },
        fraction:   { name: '分数系列', color: '#3498DB', gradient: 'linear-gradient(135deg, #3498DB, #2980B9)', icon: '🌊', element: 'ice', totalCards: 19 },
        decimal:    { name: '小数系列', color: '#27AE60', gradient: 'linear-gradient(135deg, #27AE60, #229954)', icon: '🌿', element: 'wind', totalCards: 19 },
        unit:       { name: '单位系列', color: '#9B59B6', gradient: 'linear-gradient(135deg, #9B59B6, #8E44AD)', icon: '🔮', element: 'thunder', totalCards: 19 },
        cross:      { name: '跨模块系列', color: '#E74C3C', gradient: 'linear-gradient(135deg, #E74C3C, #3498DB, #27AE60)', icon: '🌈', element: null, totalCards: 10 },
        tower:      { name: '试炼之塔系列', color: '#2C3E50', gradient: 'linear-gradient(135deg, #2C3E50, #8B0000)', icon: '🗼', element: 'dark', totalCards: 10 }
    },

    // Helper: get cards by module
    getCardsByModule(module) {
        return this.cards.filter(c => c.module === module || c.module === 'cross');
    },

    // Helper: get cards by rarity
    getCardsByRarity(rarity) {
        return this.cards.filter(c => c.rarity === rarity);
    },

    // Helper: get a specific card by id
    getCardById(id) {
        return this.cards.find(c => c.id === id);
    },

    // Helper: get total card count
    getTotalCount() {
        return this.cards.length;
    }
};

window.CardData = CardData;
