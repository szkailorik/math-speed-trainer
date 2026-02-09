/**
 * card-data.js - 143 card definitions for the card collection system
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
        { id: 'xjj_n_01', name: '九九口诀', rarity: 'N', module: 'xiaojiujiu', emoji: '📖', flavor: '一一得一，一二得二...', desc: '九九乘法表的起源' },
        { id: 'xjj_n_02', name: '乘法小能手', rarity: 'N', module: 'xiaojiujiu', emoji: '✏️', flavor: '熟能生巧', desc: '练习是最好的老师' },
        { id: 'xjj_n_03', name: '除法逆运算', rarity: 'N', module: 'xiaojiujiu', emoji: '🔄', flavor: '乘法的反面', desc: '42÷6=7, 因为6×7=42' },
        { id: 'xjj_n_04', name: '交换律', rarity: 'N', module: 'xiaojiujiu', emoji: '🔀', flavor: '3×4 = 4×3', desc: '交换因数，积不变' },
        { id: 'xjj_n_05', name: '连击之力', rarity: 'N', module: 'xiaojiujiu', emoji: '🔥', flavor: '连续答对的快感', desc: '连击越多伤害越高' },
        { id: 'xjj_n_06', name: '速算入门', rarity: 'N', module: 'xiaojiujiu', emoji: '⚡', flavor: '快而准', desc: '速度是训练出来的' },
        { id: 'xjj_n_07', name: '5的乘法表', rarity: 'N', module: 'xiaojiujiu', emoji: '🖐️', flavor: '5,10,15,20...', desc: '尾数规律：5和0交替' },
        { id: 'xjj_n_08', name: '9的乘法规律', rarity: 'N', module: 'xiaojiujiu', emoji: '9️⃣', flavor: '十位加个位等于9', desc: '18,27,36,45,54,63,72,81' },
        // R级 (5张) - 怪物专属卡
        { id: 'xjj_r_01', name: '噗噗鬼之魂', rarity: 'R', module: 'xiaojiujiu', emoji: '👻', flavor: '噗噗~别怕我~', desc: '数学世界最可爱的小幽灵', effect: null },
        { id: 'xjj_r_02', name: '眨眨眼之瞳', rarity: 'R', module: 'xiaojiujiu', emoji: '👁️', flavor: '看穿一切的目光', desc: '害羞的神秘眼睛妖怪', effect: null },
        { id: 'xjj_r_03', name: '毒毒菇之孢', rarity: 'R', module: 'xiaojiujiu', emoji: '🍄', flavor: '其实只会让你打喷嚏', desc: '颜色鲜艳但心地善良', effect: null },
        { id: 'xjj_r_04', name: '烈烈猴之焰', rarity: 'R', module: 'xiaojiujiu', emoji: '🐒', flavor: '永不停歇的热血', desc: '用火焰算术操锻炼身体', effect: null },
        { id: 'xjj_r_05', name: '蝙蝙侠之声', rarity: 'R', module: 'xiaojiujiu', emoji: '🦇', flavor: '6和9，傻傻分不清', desc: '倒着看世界的小蝙蝠', effect: null },
        // SR级 (3张) - 武器技能卡
        { id: 'xjj_sr_01', name: '火球术精通', rarity: 'SR', module: 'xiaojiujiu', emoji: '🔥', flavor: '一击必杀的魔法', desc: '火球术伤害+1', effect: { type: 'weaponBoost', weapon: 'fire', bonus: 1 } },
        { id: 'xjj_sr_02', name: '闪电连锁', rarity: 'SR', module: 'xiaojiujiu', emoji: '⚡', flavor: '连击时放出闪电', desc: '5连击时触发额外闪电', effect: { type: 'comboTrigger', threshold: 5 } },
        { id: 'xjj_sr_03', name: '乘法护盾', rarity: 'SR', module: 'xiaojiujiu', emoji: '🛡️', flavor: '九九归一，护身不败', desc: '每局开始获得1层护盾', effect: { type: 'startShield', value: 1 } },
        // SSR级 (2张)
        { id: 'xjj_ssr_01', name: '九九魔王印', rarity: 'SSR', module: 'xiaojiujiu', emoji: '👹', flavor: '吾乃九九乘法之终极守护者！', desc: '击败九九魔王获得的勋章' },
        { id: 'xjj_ssr_02', name: '连击大师之证', rarity: 'SSR', module: 'xiaojiujiu', emoji: '💫', flavor: '连续15击的传奇时刻', desc: '达成15连击的荣耀证明' },
        // UR级 (1张)
        { id: 'xjj_ur_01', name: '数学之心·乘法', rarity: 'UR', module: 'xiaojiujiu', emoji: '💎', flavor: '蕴含着乘法终极奥义的结晶', desc: '小九九模块的至高收藏' },

        // ===== 分数模块 (19张) =====
        { id: 'fs_n_01', name: '分子与分母', rarity: 'N', module: 'fraction', emoji: '📐', flavor: '上面是分子，下面是分母', desc: '分数的基本构成' },
        { id: 'fs_n_02', name: '约分之道', rarity: 'N', module: 'fraction', emoji: '✂️', flavor: '化繁为简', desc: '找到最大公因数' },
        { id: 'fs_n_03', name: '通分之术', rarity: 'N', module: 'fraction', emoji: '🔗', flavor: '统一分母', desc: '找到最小公倍数' },
        { id: 'fs_n_04', name: '十分之规律', rarity: 'N', module: 'fraction', emoji: '🔟', flavor: '十分之几等于零点几', desc: '分母是10的分数规律' },
        { id: 'fs_n_05', name: '百分之规律', rarity: 'N', module: 'fraction', emoji: '💯', flavor: '百分之几等于零点零几', desc: '分母是100的分数规律' },
        { id: 'fs_n_06', name: '二分之一', rarity: 'N', module: 'fraction', emoji: '½', flavor: '0.5，一半的力量', desc: '最常用的分数' },
        { id: 'fs_n_07', name: '四分之系列', rarity: 'N', module: 'fraction', emoji: '🍕', flavor: '0.25, 0.5, 0.75', desc: '四分之一到四分之三' },
        { id: 'fs_n_08', name: '五分之系列', rarity: 'N', module: 'fraction', emoji: '⭐', flavor: '0.2的倍数', desc: '五分之一到五分之四' },
        { id: 'fs_r_01', name: '精卫填海图', rarity: 'R', module: 'fraction', emoji: '🐦', flavor: '不屈不挠的精神', desc: '小精卫的英姿' },
        { id: 'fs_r_02', name: '九尾狐之尾', rarity: 'R', module: 'fraction', emoji: '🦊', flavor: '九条尾巴九份力', desc: '传说中的九尾之力' },
        { id: 'fs_r_03', name: '应龙鳞片', rarity: 'R', module: 'fraction', emoji: '🐲', flavor: '古老的龙鳞散发光芒', desc: '应龙脱落的一片鳞' },
        { id: 'fs_r_04', name: '麒麟祥云', rarity: 'R', module: 'fraction', emoji: '☁️', flavor: '瑞兽脚下的祥云', desc: '太平盛世的象征' },
        { id: 'fs_r_05', name: '凤凰羽毛', rarity: 'R', module: 'fraction', emoji: '🪶', flavor: '百鸟之王的赐福', desc: '闪耀七彩的神羽' },
        { id: 'fs_sr_01', name: '八分之秘术', rarity: 'SR', module: 'fraction', emoji: '🔮', flavor: '0.125的魔力', desc: '掌握八分之系列', effect: { type: 'bonusDamage', condition: 'fraction_8', bonus: 1 } },
        { id: 'fs_sr_02', name: '山海经·图鉴', rarity: 'SR', module: 'fraction', emoji: '📜', flavor: '记载万物的古籍', desc: '山海经妖怪图鉴完成度+', effect: { type: 'collectionBoost' } },
        { id: 'fs_sr_03', name: '分数互换术', rarity: 'SR', module: 'fraction', emoji: '🔄', flavor: '分数与小数自由转换', desc: '分数小数互换伤害+1', effect: { type: 'bonusDamage', condition: 'convert', bonus: 1 } },
        { id: 'fs_ssr_01', name: '山海经·封印', rarity: 'SSR', module: 'fraction', emoji: '🏔️', flavor: '封印着远古力量的山海宝卷', desc: '来自山海经的至高秘宝' },
        { id: 'fs_ssr_02', name: '混沌之心', rarity: 'SSR', module: 'fraction', emoji: '🌀', flavor: '天地未分之前的力量', desc: '传说中的混沌结晶' },
        { id: 'fs_ur_01', name: '数学之心·分数', rarity: 'UR', module: 'fraction', emoji: '💠', flavor: '蕴含着分数终极奥义的结晶', desc: '分数模块的至高收藏' },

        // ===== 小数模块 (19张) =====
        { id: 'xs_n_01', name: '小数点魔法', rarity: 'N', module: 'decimal', emoji: '•', flavor: '小小一个点，位置大不同', desc: '小数点的位置决定数值' },
        { id: 'xs_n_02', name: '乘10右移', rarity: 'N', module: 'decimal', emoji: '➡️', flavor: '×10，小数点右移一位', desc: '乘法中的小数规律' },
        { id: 'xs_n_03', name: '除10左移', rarity: 'N', module: 'decimal', emoji: '⬅️', flavor: '÷10，小数点左移一位', desc: '除法中的小数规律' },
        { id: 'xs_n_04', name: '乘100双移', rarity: 'N', module: 'decimal', emoji: '⏩', flavor: '×100，右移两位', desc: '百倍放大的魔法' },
        { id: 'xs_n_05', name: '除100双缩', rarity: 'N', module: 'decimal', emoji: '⏪', flavor: '÷100，左移两位', desc: '百倍缩小的魔法' },
        { id: 'xs_n_06', name: '千倍变换', rarity: 'N', module: 'decimal', emoji: '🔢', flavor: '×1000或÷1000', desc: '三位的跨越' },
        { id: 'xs_n_07', name: '0.5的世界', rarity: 'N', module: 'decimal', emoji: '🌗', flavor: '一半的力量', desc: '最常见的小数' },
        { id: 'xs_n_08', name: '0.1的阶梯', rarity: 'N', module: 'decimal', emoji: '🪜', flavor: '十分之一步', desc: '从整数到小数的桥梁' },
        { id: 'xs_r_01', name: '混世魔刀', rarity: 'R', module: 'decimal', emoji: '🗡️', flavor: '花果山第一代入侵者', desc: '混世魔王的武器' },
        { id: 'xs_r_02', name: '黄风三昧', rarity: 'R', module: 'decimal', emoji: '🌪️', flavor: '迷人眼的妖风', desc: '黄风怪的特技' },
        { id: 'xs_r_03', name: '黑熊袈裟', rarity: 'R', module: 'decimal', emoji: '🐻', flavor: '被偷走的锦斓袈裟', desc: '黑熊精的收藏' },
        { id: 'xs_r_04', name: '金角银角', rarity: 'R', module: 'decimal', emoji: '🫙', flavor: '紫金红葫芦，叫名字就收', desc: '金银角大王的宝贝' },
        { id: 'xs_r_05', name: '白骨三变', rarity: 'R', module: 'decimal', emoji: '💀', flavor: '三次变化骗取师徒', desc: '白骨精的三段变身' },
        { id: 'xs_sr_01', name: '定海神针', rarity: 'SR', module: 'decimal', emoji: '🏯', flavor: '如意金箍棒，重一万三千五百斤', desc: '孙悟空的兵器', effect: { type: 'weaponBoost', weapon: 'all', bonus: 1 } },
        { id: 'xs_sr_02', name: '筋斗云', rarity: 'SR', module: 'decimal', emoji: '☁️', flavor: '一个筋斗十万八千里', desc: '极速飞行之术', effect: { type: 'speedBoost' } },
        { id: 'xs_sr_03', name: '七十二变', rarity: 'SR', module: 'decimal', emoji: '🔄', flavor: '千变万化，无所不能', desc: '答题正确率提示', effect: { type: 'hintChance', value: 0.1 } },
        { id: 'xs_ssr_01', name: '西游真经', rarity: 'SSR', module: 'decimal', emoji: '📕', flavor: '取经路上的智慧结晶', desc: '西天取经的终极宝典' },
        { id: 'xs_ssr_02', name: '大闹天宫', rarity: 'SSR', module: 'decimal', emoji: '🏛️', flavor: '齐天大圣，到此一游！', desc: '悟空最辉煌的时刻' },
        { id: 'xs_ur_01', name: '数学之心·小数', rarity: 'UR', module: 'decimal', emoji: '🔷', flavor: '蕴含着小数终极奥义的结晶', desc: '小数模块的至高收藏' },

        // ===== 单位模块 (19张) =====
        { id: 'dw_n_01', name: '长度之尺', rarity: 'N', module: 'unit', emoji: '📏', flavor: '千米→米→分米→厘米→毫米', desc: '长度单位的阶梯' },
        { id: 'dw_n_02', name: '质量之秤', rarity: 'N', module: 'unit', emoji: '⚖️', flavor: '吨→千克→克', desc: '质量单位的天平' },
        { id: 'dw_n_03', name: '容积之杯', rarity: 'N', module: 'unit', emoji: '🫗', flavor: '升→毫升', desc: '容积单位的换算' },
        { id: 'dw_n_04', name: '人民币之值', rarity: 'N', module: 'unit', emoji: '💰', flavor: '元→角→分', desc: '货币单位的换算' },
        { id: 'dw_n_05', name: '时间之钟', rarity: 'N', module: 'unit', emoji: '⏰', flavor: '小时→分钟→秒', desc: '时间是60进制' },
        { id: 'dw_n_06', name: '面积之方', rarity: 'N', module: 'unit', emoji: '📐', flavor: '面积进率是100不是10', desc: '面积单位的特殊规律' },
        { id: 'dw_n_07', name: '千米等于公里', rarity: 'N', module: 'unit', emoji: '🛣️', flavor: '两种说法一个意思', desc: '千米和公里的关系' },
        { id: 'dw_n_08', name: '千克等于公斤', rarity: 'N', module: 'unit', emoji: '🏋️', flavor: '两种说法一个意思', desc: '千克和公斤的关系' },
        { id: 'dw_r_01', name: '土行孙遁术', rarity: 'R', module: 'unit', emoji: '🐹', flavor: '地底穿行千里', desc: '土行孙的地遁之术' },
        { id: 'dw_r_02', name: '哪吒风火轮', rarity: 'R', module: 'unit', emoji: '🔥', flavor: '脚踏风火，日行千里', desc: '哪吒的速度法宝' },
        { id: 'dw_r_03', name: '雷震子之翼', rarity: 'R', module: 'unit', emoji: '⚡', flavor: '展翅万里', desc: '雷震子的雷翼' },
        { id: 'dw_r_04', name: '杨戬天眼', rarity: 'R', module: 'unit', emoji: '👁️', flavor: '洞察万物的第三只眼', desc: '二郎神的神通' },
        { id: 'dw_r_05', name: '姜子牙钓竿', rarity: 'R', module: 'unit', emoji: '🎣', flavor: '愿者上钩', desc: '太公的智慧之竿' },
        { id: 'dw_sr_01', name: '封神榜', rarity: 'SR', module: 'unit', emoji: '📜', flavor: '三百六十五位正神之位', desc: '封神大典的终极名册', effect: { type: 'scoreBoost', value: 1.2 } },
        { id: 'dw_sr_02', name: '打神鞭', rarity: 'SR', module: 'unit', emoji: '🏏', flavor: '只打封神榜上人', desc: '封神之战的神器', effect: { type: 'weaponBoost', weapon: 'all', bonus: 1 } },
        { id: 'dw_sr_03', name: '混元珠', rarity: 'SR', module: 'unit', emoji: '🔴', flavor: '集水火风雷于一身', desc: '太极生两仪的终极之球', effect: { type: 'bonusDamage', condition: 'unit', bonus: 1 } },
        { id: 'dw_ssr_01', name: '封神·天命', rarity: 'SSR', module: 'unit', emoji: '🌟', flavor: '天意难违，封神之路', desc: '封神演义的至高意志' },
        { id: 'dw_ssr_02', name: '盘古开天', rarity: 'SSR', module: 'unit', emoji: '🌍', flavor: '开天辟地的伟力', desc: '天地之始的终极力量' },
        { id: 'dw_ur_01', name: '数学之心·单位', rarity: 'UR', module: 'unit', emoji: '🔶', flavor: '蕴含着单位换算终极奥义的结晶', desc: '单位模块的至高收藏' },

        // ===== 乘法速记模块 (19张) =====
        { id: 'cf_n_01', name: '25×4=100', rarity: 'N', module: 'multiply', emoji: '🎯', flavor: '看到4想25', desc: '乘法速记第一定律' },
        { id: 'cf_n_02', name: '125×8=1000', rarity: 'N', module: 'multiply', emoji: '🎱', flavor: '看到8想125', desc: '乘法速记第二定律' },
        { id: 'cf_n_03', name: '50×2=100', rarity: 'N', module: 'multiply', emoji: '💫', flavor: '最简单的凑百', desc: '基础凑整技巧' },
        { id: 'cf_n_04', name: '25的朋友', rarity: 'N', module: 'multiply', emoji: '🤝', flavor: '25×2,4,8,12,16,20', desc: '25的系列乘积' },
        { id: 'cf_n_05', name: '125的朋友', rarity: 'N', module: 'multiply', emoji: '🤜', flavor: '125×2,4,8,16,24', desc: '125的系列乘积' },
        { id: 'cf_n_06', name: '逆向思维', rarity: 'N', module: 'multiply', emoji: '🔄', flavor: '100÷4=25', desc: '除法验证乘法' },
        { id: 'cf_n_07', name: '75的秘密', rarity: 'N', module: 'multiply', emoji: '7️⃣', flavor: '75=25×3', desc: '拆分法的妙用' },
        { id: 'cf_n_08', name: '凑整大法', rarity: 'N', module: 'multiply', emoji: '🧮', flavor: '拆成已知的组合', desc: '乘法速记的核心思想' },
        { id: 'cf_r_01', name: '婴宁之笑', rarity: 'R', module: 'multiply', emoji: '🌸', flavor: '笑一笑，十年少', desc: '爱笑的小狐狸精' },
        { id: 'cf_r_02', name: '画皮鬼面', rarity: 'R', module: 'multiply', emoji: '🎭', flavor: '美丽外表下的秘密', desc: '画皮妖怪的面具' },
        { id: 'cf_r_03', name: '聂小倩丝帕', rarity: 'R', module: 'multiply', emoji: '🧣', flavor: '三生三世的羁绊', desc: '聊斋最美的相遇' },
        { id: 'cf_r_04', name: '黑山老妖气', rarity: 'R', module: 'multiply', emoji: '👹', flavor: '千年修炼的妖气', desc: '黑山老妖的威压' },
        { id: 'cf_r_05', name: '促织蟋蟀', rarity: 'R', module: 'multiply', emoji: '🦗', flavor: '小小蟋蟀，大大勇气', desc: '斗蟋蟀的传奇' },
        { id: 'cf_sr_01', name: '聊斋·灵符', rarity: 'SR', module: 'multiply', emoji: '📿', flavor: '驱邪避凶的灵符', desc: '聊斋道士的护身符', effect: { type: 'startShield', value: 1 } },
        { id: 'cf_sr_02', name: '狐仙幻术', rarity: 'SR', module: 'multiply', emoji: '🦊', flavor: '迷惑众生的幻术', desc: '狐仙的独门绝技', effect: { type: 'hintChance', value: 0.1 } },
        { id: 'cf_sr_03', name: '阎罗判笔', rarity: 'SR', module: 'multiply', emoji: '✒️', flavor: '一笔定生死', desc: '阎王爷的判决之笔', effect: { type: 'bonusDamage', condition: 'multiply', bonus: 1 } },
        { id: 'cf_ssr_01', name: '聊斋·鬼卷', rarity: 'SSR', module: 'multiply', emoji: '📕', flavor: '记载百鬼的奇书', desc: '聊斋志异的原本' },
        { id: 'cf_ssr_02', name: '蒲松龄之笔', rarity: 'SSR', module: 'multiply', emoji: '🖊️', flavor: '写尽人间百态', desc: '一支笔写出千古奇书' },
        { id: 'cf_ur_01', name: '数学之心·乘法', rarity: 'UR', module: 'multiply', emoji: '❤️‍🔥', flavor: '蕴含着乘法速记终极奥义的结晶', desc: '乘法模块的至高收藏' },

        // ===== 大九九模块 (19张) =====
        { id: 'djj_n_01', name: '11的秘诀', rarity: 'N', module: 'times', emoji: '🔑', flavor: '两头不动中间加', desc: '11×N的速算法' },
        { id: 'djj_n_02', name: '拆分法', rarity: 'N', module: 'times', emoji: '✂️', flavor: '拆成10+N来算', desc: '大九九的基本技巧' },
        { id: 'djj_n_03', name: '凑整法', rarity: 'N', module: 'times', emoji: '🧩', flavor: '看到15想半个30', desc: '利用整数简化运算' },
        { id: 'djj_n_04', name: '平方数之美', rarity: 'N', module: 'times', emoji: '²', flavor: '11²=121, 12²=144...', desc: '完全平方数的魅力' },
        { id: 'djj_n_05', name: '互补凑20', rarity: 'N', module: 'times', emoji: '🤲', flavor: '11×19, 12×18, 13×17...', desc: '两数之和为20的规律' },
        { id: 'djj_n_06', name: '尾5平方法', rarity: 'N', module: 'times', emoji: '5️⃣', flavor: '15²→1×2接25→225', desc: '尾数是5的快速平方' },
        { id: 'djj_n_07', name: '相邻数平方', rarity: 'N', module: 'times', emoji: '↔️', flavor: '12×14=13²-1=168', desc: '相邻数相乘的秘密' },
        { id: 'djj_n_08', name: '12的乘法表', rarity: 'N', module: 'times', emoji: '📊', flavor: '144,156,168,180...', desc: '时钟的数学' },
        { id: 'djj_r_01', name: '海德薇信笺', rarity: 'R', module: 'times', emoji: '🦉', flavor: '来自猫头鹰的信', desc: '海德薇送来的入学通知' },
        { id: 'djj_r_02', name: '分院帽碎片', rarity: 'R', module: 'times', emoji: '🎩', flavor: '勇气、智慧、忠诚、野心', desc: '四大学院的选择' },
        { id: 'djj_r_03', name: '魁地奇金飞贼', rarity: 'R', module: 'times', emoji: '⚽', flavor: '抓住它就赢了', desc: '150分的关键' },
        { id: 'djj_r_04', name: '家养小精灵袜', rarity: 'R', module: 'times', emoji: '🧦', flavor: '多比是自由的精灵！', desc: '自由的象征' },
        { id: 'djj_r_05', name: '凤凰之泪', rarity: 'R', module: 'times', emoji: '💧', flavor: '凤凰的眼泪能治愈一切', desc: '福克斯的神奇力量' },
        { id: 'djj_sr_01', name: '魔杖·老魔杖', rarity: 'SR', module: 'times', emoji: '🪄', flavor: '死亡圣器之一', desc: '最强大的魔杖', effect: { type: 'weaponBoost', weapon: 'all', bonus: 2 } },
        { id: 'djj_sr_02', name: '隐形斗篷', rarity: 'SR', module: 'times', emoji: '🧥', flavor: '死亡圣器之一', desc: '隐身闪避一次攻击', effect: { type: 'dodgeChance', value: 0.15 } },
        { id: 'djj_sr_03', name: '复活石', rarity: 'SR', module: 'times', emoji: '💍', flavor: '死亡圣器之一', desc: '死而复生的力量', effect: { type: 'reviveChance', value: 0.1 } },
        { id: 'djj_ssr_01', name: '活点地图', rarity: 'SSR', module: 'times', emoji: '🗺️', flavor: '我庄严宣誓我没干好事', desc: '霍格沃茨的终极秘宝' },
        { id: 'djj_ssr_02', name: '魔法石', rarity: 'SSR', module: 'times', emoji: '🔴', flavor: '尼可·勒梅的杰作', desc: '永生不死的传说' },
        { id: 'djj_ur_01', name: '数学之心·大九九', rarity: 'UR', module: 'times', emoji: '🔮', flavor: '蕴含着大九九终极奥义的结晶', desc: '大九九模块的至高收藏' },

        // ===== 跨模块卡牌 (10张) =====
        { id: 'cross_n_01', name: '勤奋之星', rarity: 'N', module: 'cross', emoji: '⭐', flavor: '每天进步一点点', desc: '坚持练习的证明' },
        { id: 'cross_n_02', name: '错题收集者', rarity: 'N', module: 'cross', emoji: '📝', flavor: '错误是最好的老师', desc: '从错误中学习' },
        { id: 'cross_n_03', name: '速算达人', rarity: 'N', module: 'cross', emoji: '🧠', flavor: '快而准的大脑', desc: '速算能力的证明' },
        { id: 'cross_n_04', name: '坚持不懈', rarity: 'N', module: 'cross', emoji: '💪', flavor: '坚持就是胜利', desc: '永不放弃的精神' },
        { id: 'cross_r_01', name: '全模块通行证', rarity: 'R', module: 'cross', emoji: '🎫', flavor: '六大模块的冒险者', desc: '体验过所有模块' },
        { id: 'cross_r_02', name: '妖怪图鉴大师', rarity: 'R', module: 'cross', emoji: '📖', flavor: '收集妖怪的行家', desc: '妖怪收集达人' },
        { id: 'cross_sr_01', name: '数学小天才', rarity: 'SR', module: 'cross', emoji: '🌟', flavor: '数学是宇宙的语言', desc: '全面发展的数学能力', effect: { type: 'allBoost', value: 1.1 } },
        { id: 'cross_sr_02', name: '卡牌收藏家', rarity: 'SR', module: 'cross', emoji: '🗂️', flavor: '收集是一种艺术', desc: '卡牌掉率+5%', effect: { type: 'dropBoost', value: 0.05 } },
        { id: 'cross_ssr_01', name: '传说猎人', rarity: 'SSR', module: 'cross', emoji: '🏅', flavor: '追寻传说的勇者', desc: '稀有卡牌掉率提升' },
        { id: 'cross_ur_01', name: '数学之心·万象', rarity: 'UR', module: 'cross', emoji: '💖', flavor: '六大模块的力量汇聚于一心，数学的终极奥义在此绽放', desc: '全游戏的至高收藏，集齐六颗数学之心可召唤' }
    ],

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
