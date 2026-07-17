/**
 * monster-expansion.js - v25.0 visual/content expansion packs.
 *
 * Adds exactly 50 collectible encounters to each of the six themes. The packs
 * deliberately reuse the existing HP/difficulty bands so question generation,
 * damage, drops and progression rules stay unchanged.
 */

var MonsterExpansion = (function() {
    var themeMeta = {
        xiaojiujiu: {
            folder: 'math', label: '数学王国', basis: '原创数学王国角色',
            types: ['psychic', 'electric', 'normal', 'earth', 'flying', 'fire'],
            attacks: [['🔢', '数字弹'], ['✨', '算式闪光'], ['📐', '格阵冲击'], ['💫', '心算波']]
        },
        fraction: {
            folder: 'shanhai', label: '山海秘境', basis: '《山海经》异兽与山川意象',
            types: ['beast', 'water', 'flying', 'earth', 'fire', 'ancient'],
            attacks: [['🐾', '荒野扑击'], ['🌊', '沧波术'], ['🍃', '山岚卷'], ['🔥', '赤焰息']]
        },
        decimal: {
            folder: 'xiyou', label: '西行云海', basis: '《西游记》章节与法宝意象衍生',
            types: ['beast', 'wind', 'fire', 'water', 'demon', 'spirit'],
            attacks: [['🌀', '妖风卷'], ['🔥', '三昧火星'], ['💧', '洞府水箭'], ['✨', '法宝灵光']]
        },
        unit: {
            folder: 'fengshen', label: '封神殿堂', basis: '《封神演义》人物、阵法与法器意象',
            types: ['fighting', 'thunder', 'fire', 'earth', 'spirit', 'ancient'],
            attacks: [['⚔️', '玄兵斩'], ['⚡', '雷符'], ['🔥', '火阵'], ['🪬', '阵图灵光']]
        },
        multiply: {
            folder: 'liaozhai', label: '聊斋月夜', basis: '《聊斋志异》篇目与狐鬼花妖意象',
            types: ['ghost', 'spirit', 'dark', 'fairy', 'poison', 'psychic'],
            attacks: [['👻', '幽影袭'], ['🏮', '灯魂火'], ['🌙', '月华术'], ['📜', '墨符卷']]
        },
        times: {
            folder: 'academy', label: '原创魔法学院', basis: '原创学院生物与校园器物',
            types: ['wizard', 'flying', 'creature', 'psychic', 'light', 'dark'],
            attacks: [['🪄', '星屑咒'], ['📚', '书页旋风'], ['🔮', '水晶波'], ['✨', '学院灵光']]
        }
    };

    var catalogs = {
        xiaojiujiu: {
            easy: ['进位萤', '借位鼹', '因数狐', '倍数蛾', '余数尾兽', '等号卫兵', '加号精', '减号灵', '乘号螳螂', '除号水母', '零泡泡', '一角芽', '二翼豆', '三眼团', '四方龟', '五指花', '六边蜂', '七点瓢虫'],
            normal: ['八音蛛', '九环蛇', '十格蟹', '口诀雀', '算珠狸', '算盘甲', '竖式熊', '进位星萤', '借位铁鼹', '因数灵狐', '倍数月蛾', '余数九尾兽', '等式圣卫', '正号火精', '负号冰灵', '乘法刃螳', '除法潮母', '零界泡王'],
            hard: ['一角树皇', '双翼豆将', '三眼云团', '四方玄龟', '五瓣掌花', '六棱蜂王', '七星瓢骑', '八音蛛后', '九环蟒王', '十格蟹将', '口诀神雀', '算珠天狸'],
            boss: ['黄金算盘神甲', '竖式宗师熊']
        },
        fraction: {
            easy: ['狌狌', '猼訑', '䍺兽', '鯥鱼', '类兽', '狸力', '犀渠', '灌灌', '青耕', '讙兽', '驳兽', '诸犍', '长右', '猾褢', '彘兽', '狡兽', '胜遇', '数斯'],
            normal: ['文鳐', '鴢鸟', '鵸鵌', '鸾鸟', '孟极', '峳峳', '狙如', '赤冠狌狌', '云纹猼訑', '玄角䍺王', '沧海鯥王', '百变类兽', '开山狸力', '金角犀渠', '玄羽灌灌', '碧火青耕', '千声讙王', '银角驳王'],
            hard: ['巨牙诸犍', '长臂山君', '凶纹猾褢', '赤鬃彘王', '白角狡王', '风暴胜遇', '星羽数斯', '云海文鳐', '月瞳鴢王', '三首鵸鵌', '九彩鸾皇', '雪原孟极'],
            boss: ['大荒峳峳', '昆仑狙如王']
        },
        decimal: {
            easy: ['水脏洞狼先锋', '水脏洞蛇将', '黑风山白衣秀士', '黑风山苍狼道人', '黄风岭虎伥', '流沙河浪妖', '五庄观参果灵', '白虎岭骷髅兵', '宝象国花斑豹', '平顶山狐阿七', '压龙山狐先锋', '乌鸡井龙魂', '车迟国道童', '通天河鳜鱼怪', '金兜山犀童', '女儿国如意侍灵', '毒敌山琵琶侍女', '荆棘岭藤童'],
            normal: ['凌空子', '拂云叟', '赤身鬼', '有去无来', '迎风怪', '獬豸洞巡山兵', '盘丝洞蛛童', '水脏洞狼将军', '水脏洞蛇元帅', '白衣秀士真身', '苍狼道人真身', '黄风岭虎将', '流沙河浪将', '五庄观参果仙灵', '白虎岭骨将', '宝象国豹王', '平顶山狐军师', '压龙山狐长老'],
            hard: ['乌鸡井龙王魂', '车迟国道童长', '通天河鳜鱼将', '金兜山犀将', '如意侍灵长', '琵琶洞侍女长', '荆棘岭藤翁', '凌空子松仙', '拂云叟竹仙', '赤身鬼王', '有去无来使', '迎风妖将'],
            boss: ['金毛獬豸统领', '盘丝洞蛛后']
        },
        unit: {
            easy: ['常昊蛇将', '吴龙蜈将', '朱子真猪将', '杨显羊将', '戴礼犬将', '金大升牛将', '陈奇哈将', '郑伦哼将', '黄天祥少年将', '崇黑虎飞虎将', '邓九公老将', '苏护冀州将', '洪锦旗门将', '龙吉公主', '太鸾先锋', '黄飞彪', '黄飞豹', '武吉樵将'],
            normal: ['秦完天君', '赵江天君', '董全天君', '袁角天君', '孙良天君', '白礼天君', '姚宾天君', '常昊玄蛇将', '吴龙百足将', '朱子真獠牙将', '杨显玄羊将', '戴礼啸天将', '金大升撼山将', '陈奇哈气神将', '郑伦哼声神将', '黄天祥飞骑将', '崇黑虎神鹰将', '邓九公镇军将'],
            hard: ['苏护冀州侯影', '洪锦旗门元帅', '龙吉公主仙将', '太鸾破阵先锋', '黄飞彪虎将', '黄飞豹豹将', '武吉伐纣将', '秦完天绝阵主', '赵江地烈阵主', '董全风吼阵主', '袁角寒冰阵主', '孙良化血阵主'],
            boss: ['白礼烈焰阵灵', '姚宾落魂阵灵']
        },
        multiply: {
            easy: ['咬鬼女', '捉狐影', '荞中怪', '宅妖', '王六郎水魂', '画壁仙', '口技鬼', '瞳人精', '耳中人', '尸变客', '水莽草灵', '小官人纸偶', '龙飞相公', '九山王', '酒虫', '木雕美人', '织成女', '荷花三娘子'],
            normal: ['葛巾花仙', '黄英菊仙', '青凤', '红玉', '莲香', '林四娘', '伍秋月', '咬鬼夜叉女', '捉狐玄影', '荞中怪王', '宅妖真身', '王六郎河伯影', '画壁天仙', '口技百声鬼', '瞳人双生精', '耳中人夜游神', '尸变客魇', '水莽草鬼王'],
            hard: ['小官人纸将', '龙飞相公真身', '九山王山君', '酒虫王', '木雕美人灵', '织成天女影', '荷花三娘仙', '葛巾牡丹仙', '黄英菊主', '青凤九尾影', '红玉剑狐', '莲香双生灵'],
            boss: ['林四娘幽城主', '伍秋月太阴灵']
        },
        times: {
            easy: ['墨羽信鸦', '月纹猫头鹰', '星灯小仙', '铜铃书鼠', '寻宝绒獾', '墨水水獭', '卷轴毛球', '羽笔啄啄鸟', '茶壶寄居蟹', '扫帚尾狐', '钥匙甲虫', '书签壁虎', '校钟蝙蝠', '粉笔小鬼', '课桌木灵', '盆栽豆精', '窗帘云雀', '黄铜纽扣怪'],
            normal: ['藏书馆书页龙', '楼梯石像猫', '温室露珠妖', '药草园月蛙', '观星塔镜鸦', '厨房蜜糖怪', '礼堂烛焰灵', '墨羽星信鸦', '月纹贤者猫头鹰', '星灯仙灵长', '铜铃书鼠王', '黄金寻宝绒獾', '深蓝墨水水獭', '皇家卷轴毛球', '银羽笔啄啄鸟', '黄铜茶壶蟹', '月光扫帚尾狐', '宝库钥匙甲虫'],
            hard: ['图书馆书签龙', '钟塔校钟蝠王', '白垩粉笔幽灵', '古木课桌灵', '温室盆栽豆王', '彩窗云雀', '黄铜纽扣巨怪', '禁书书页龙', '回廊石像猫王', '月华露珠妖', '银冠月蛙', '观星镜鸦王'],
            boss: ['学院蜜糖巨怪', '永恒烛焰灵王']
        }
    };

    // The five non-math themes use the previously generated, researched base
    // silhouettes as visual lineages. Prefixes make every encounter a distinct
    // collectible form while keeping its name faithful to the on-screen body.
    var artLineages = {
        fraction: ['白泽', '精卫', '九尾狐', '青鸟', '鹿蜀', '猼訑', '当康', '讹兽', '夔', '英招', '毕方', '穷奇', '饕餮', '梼杌', '混沌', '烛龙'],
        decimal: ['花果山灵猴', '白骨精', '黑熊精', '黄风怪', '红孩儿', '铁扇公主', '蜘蛛精', '蝎子精', '牛魔王', '金角', '虎力大仙', '天界守将'],
        unit: ['朝歌盾将', '哪吒', '杨戬', '姜子牙', '雷震子', '土行孙', '魔家将', '通天教主'],
        multiply: ['花灵', '灯笼狐灵', '月下女鬼', '画皮妖', '符剑客', '黑山妖', '九尾狐后', '幽冥判王'],
        times: ['猫头鹰信使', '蓝翼小仙', '寻宝獾', '树枝守卫', '金色绒球', '盆栽曼德拉', '城堡幽灵骑士', '角冠暗影术士']
    };
    var familyPrefixes = ['幼年·', '灵纹·', '玄甲·', '星辉·', '赤金·', '月影·', '王者·'];

    var difficultyHp = { easy: 3, normal: 5, hard: 7, boss: 10 };
    var difficultyOrder = ['easy', 'normal', 'hard', 'boss'];

    function makeId(module, difficulty, index) {
        var prefix = { xiaojiujiu: 'mx', fraction: 'sx', decimal: 'xyx', unit: 'fsx', multiply: 'lzx', times: 'acx' }[module];
        return prefix + '_' + difficulty.charAt(0) + '_' + String(index + 1).padStart(2, '0');
    }

    function buildPack(module) {
        var meta = themeMeta[module];
        var artIndex = 0;
        var pack = {};
        difficultyOrder.forEach(function(difficulty) {
            pack[difficulty] = catalogs[module][difficulty].map(function(name, localIndex) {
                var attack = meta.attacks[artIndex % meta.attacks.length];
                var type = meta.types[artIndex % meta.types.length];
                var lineage = artLineages[module];
                if (lineage) {
                    var familyIndex = artIndex % lineage.length;
                    var familyTier = Math.floor(artIndex / lineage.length);
                    name = (difficulty === 'boss' ? '至尊·' : familyPrefixes[familyTier]) + lineage[familyIndex];
                }
                var monster = {
                    id: makeId(module, difficulty, localIndex),
                    name: name,
                    nameEn: meta.label + ' Creature ' + String(artIndex + 1).padStart(2, '0'),
                    emoji: attack[0],
                    hp: difficultyHp[difficulty],
                    type: type,
                    difficulty: difficulty,
                    attack: attack[0],
                    attackName: attack[1],
                    quips: ['来试试这一题！', '我守着下一道关卡！', '算得又快又准才算赢！'],
                    enterQuips: [name + '登场！', '欢迎来到' + meta.label + '！'],
                    deathQuips: ['这次是你算得更快！', '我会在图鉴里等你！'],
                    trait: meta.basis + '，采用儿童友好的游戏化造型',
                    traitEn: 'A child-friendly creature inspired by ' + meta.label,
                    story: name + '来自' + meta.label + '。它的造型依据“' + meta.basis + '”设计，并经过儿童向游戏化处理；它只扩充遭遇与收集内容，不改变数学题目和战斗规则。',
                    storyEn: name + ' is a collectible encounter from ' + meta.label + '.',
                    expansion: true,
                    artGroup: meta.folder,
                    artIndex: artIndex,
                    sourceBasis: meta.basis
                };
                if (difficulty === 'boss') {
                    monster.isBoss = true;
                    monster.behaviors = ['threaten', 'defend', 'enrage'];
                }
                artIndex++;
                return monster;
            });
        });
        return pack;
    }

    var packs = {};
    Object.keys(catalogs).forEach(function(module) {
        packs[module] = buildPack(module);
    });

    function get(module, difficulty) {
        if (!packs[module]) return [];
        if (difficulty) return packs[module][difficulty] || [];
        return difficultyOrder.reduce(function(all, key) {
            return all.concat(packs[module][key]);
        }, []);
    }

    return { get: get, packs: packs, catalogs: catalogs, themeMeta: themeMeta };
})();

window.MonsterExpansion = MonsterExpansion;
