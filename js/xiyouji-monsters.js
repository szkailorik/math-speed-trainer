/**
 * 西游记妖怪数据 - 小数规律模块
 * 36个妖怪，恐怖可爱风格
 * 取材自《西游记》最著名的妖怪角色
 */

// ===== 初级妖怪（简单模式）HP 3-4 =====
const xiyoujiEasyMonsters = [
    {
        id: 'hunshi_mogwang', name: '混世魔王', nameEn: 'Havoc Demon King',
        emoji: '👺', hp: 3, type: 'dark',
        attack: '🗡️', attackName: '魔刀乱舞', quips: ['本大王要吃了你！', '小的们上啊！', '花果山是我的！'],
        trait: '花果山的第一个入侵者，胆子大但实力弱',
        traitEn: 'The first invader of Flower Fruit Mountain, bold but weak',
        story: '混世魔王趁猴王外出学艺，偷偷霸占了水帘洞。他以为自己很厉害，结果悟空一回来，三两下就把他打跑了。现在他只敢在小数点旁边晃悠，看谁算错题就偷偷吓唬一下。',
        storyEn: 'The Havoc Demon King snuck into Water Curtain Cave while Monkey King was away studying. He thought he was tough, but Wukong defeated him in seconds. Now he only dares to lurk near decimal points, scaring anyone who gets a problem wrong.'
    },
    {
        id: 'yin_jiangjun', name: '寅将军', nameEn: 'General Tiger',
        emoji: '🐯', hp: 3, type: 'beast',
        attack: '🐾', attackName: '虎爪扑击', quips: ['嗷呜~', '虎虎生威！', '别跑别跑！'],
        trait: '取经路上遇到的第一只妖怪，虎头虎脑',
        traitEn: 'The first monster on the journey west, tiger-brained and cute',
        story: '寅将军是唐僧取经路上遇到的第一只妖怪。他长得虎头虎脑，看起来很凶，但其实特别怕打雷。每次听到雷声就会缩成一团，露出肚皮装可怜。小朋友算对题就能吓跑他！',
        storyEn: 'General Tiger was the first monster Tang Monk met on his journey. He looks fierce but is actually scared of thunder. Whenever he hears it, he curls up and shows his belly. Just solve the math problem to scare him away!'
    },
    {
        id: 'huangfeng_guai', name: '黄风怪', nameEn: 'Yellow Wind Demon',
        emoji: '🌪️', hp: 3, type: 'wind',
        attack: '💨', attackName: '三昧神风', quips: ['风来啦~', '吹你一脸沙！', '呼呼呼~'],
        trait: '能刮出迷人眼的妖风，但怕定风丹',
        traitEn: 'Creates blinding winds but fears the Wind-Fixing Pill',
        story: '黄风怪原本是灵山脚下的一只黄毛貂鼠精。他最厉害的招数就是吹黄风，把人的眼睛吹得睁不开。不过他有个可爱的习惯——每次刮风前都会先打喷嚏，所以大家都能提前躲开。',
        storyEn: 'Yellow Wind Demon was originally a yellow marten at the foot of Spirit Mountain. His strongest move is blowing yellow wind that blinds people. But he has a cute habit - he always sneezes before blowing, so everyone can dodge in time.'
    },
    {
        id: 'heixiong_jing', name: '黑熊精', nameEn: 'Black Bear Spirit',
        emoji: '🐻', hp: 4, type: 'dark',
        attack: '🖤', attackName: '黑风掌', quips: ['嘿嘿嘿~', '袈裟归我了！', '本熊不怕你！'],
        trait: '爱收藏宝贝的呆萌黑熊，实力不弱',
        traitEn: 'A cute black bear who loves collecting treasures',
        story: '黑熊精住在黑风山黑风洞，最大的爱好就是收藏各种宝贝。他偷了唐僧的锦斓袈裟，不是因为想当和尚，而是觉得穿起来特别好看。后来被观音菩萨收服，当了守山大神，终于有了正经工作。',
        storyEn: 'Black Bear Spirit lives in Black Wind Cave and loves collecting treasures. He stole Tang Monk\'s kasaya not to become a monk, but because he thought it looked pretty. Later, Guanyin tamed him and gave him a proper job as a mountain guardian.'
    },
    {
        id: 'huli_daxian', name: '虎力大仙', nameEn: 'Tiger Power Sage',
        emoji: '🐅', hp: 3, type: 'fighting',
        attack: '⚡', attackName: '虎啸天雷', quips: ['贫道法力无边！', '比试比试？', '虎啸！'],
        trait: '车迟国三仙之首，装腔作势',
        traitEn: 'Leader of the Three Sages, all bark and no bite',
        story: '虎力大仙是车迟国的国师，最擅长装模作样。他号称能呼风唤雨，其实都是靠小妖怪在后面帮忙。跟悟空比赛求雨的时候，差点被自己召来的雷给劈到，可把自己吓坏了。',
        storyEn: 'Tiger Power Sage is the state preceptor of Cart-Slow Kingdom, great at putting on airs. He claims he can summon rain, but it\'s all done by little demons helping from behind. When competing with Wukong to summon rain, he almost got struck by his own lightning!'
    },
    {
        id: 'luli_daxian', name: '鹿力大仙', nameEn: 'Deer Power Sage',
        emoji: '🦌', hp: 3, type: 'spirit',
        attack: '🍃', attackName: '仙鹿踏云', quips: ['哎呀呀~', '贫道不服！', '再来再来！'],
        trait: '喜欢跟人比赛猜谜的鹿精',
        traitEn: 'A deer spirit who loves riddle competitions',
        story: '鹿力大仙特别喜欢跟人比赛，什么猜谜、打坐、砍头他都要试试。问题是他每次都输，但每次输了都不服气，还要再来一次。这种屡败屡战的精神，倒是挺可爱的。',
        storyEn: 'Deer Power Sage loves competing in everything - riddles, meditation, even head-chopping contests. The problem is he always loses, but never gives up. His never-say-die spirit is actually kind of adorable.'
    },
    {
        id: 'yangli_daxian', name: '羊力大仙', nameEn: 'Ram Power Sage',
        emoji: '🐏', hp: 3, type: 'spirit',
        attack: '🌊', attackName: '沸油洗澡', quips: ['咩咩~', '贫道会炼丹！', '热水澡~'],
        trait: '最怕热油锅的胆小羊精',
        traitEn: 'A timid ram spirit who fears hot oil baths',
        story: '羊力大仙是三仙里最胆小的一个。他最得意的绝活是在油锅里洗澡，结果悟空偷偷把他的冷龙护体拿走了，他"噗通"跳进滚油锅里，被炸成了羊肉串。从此以后，他最怕的就是炸串店。',
        storyEn: 'Ram Power Sage is the most timid of the Three Sages. His proudest trick was bathing in boiling oil, but when Wukong secretly removed his cold dragon protection, he jumped in and became a lamb kebab. He\'s been afraid of BBQ shops ever since.'
    },
    {
        id: 'yumian_huli', name: '玉面狐狸', nameEn: 'Jade Fox Princess',
        emoji: '🦊', hp: 3, type: 'psychic',
        attack: '💋', attackName: '魅惑之术', quips: ['人家好怕怕~', '讨厌啦~', '哼！'],
        trait: '牛魔王的小妾，娇滴滴的狐狸精',
        traitEn: 'Bull Demon King\'s concubine, a coquettish fox spirit',
        story: '玉面狐狸是万岁狐王的女儿，嫁给了牛魔王当小妾。她最大的特点就是特别爱撒娇，打架的时候也是边打边喊"人家不要嘛"。虽然战斗力不强，但她的撒娇功力可是一流的。',
        storyEn: 'Jade Fox Princess is the daughter of the Fox King and married the Bull Demon King. Her biggest talent is acting cute - even in battle she whines "I don\'t wanna!" Her fighting skills are weak, but her cuteness level is off the charts.'
    },
    {
        id: 'jingxi_gui', name: '精细鬼', nameEn: 'Crafty Ghost',
        emoji: '👻', hp: 3, type: 'ghost',
        attack: '🫙', attackName: '葫芦吸魂', quips: ['嘿嘿我最聪明！', '上当啦！', '装进去吧！'],
        trait: '扛着紫金葫芦到处骗人的小妖',
        traitEn: 'A little demon who tricks people with his magic gourd',
        story: '精细鬼和伶俐虫是银角大王的两个小跟班。他俩负责扛着紫金葫芦和羊脂玉净瓶去收孙悟空。结果被悟空三言两语就骗走了宝贝，还觉得自己赚了。他俩是西游记里最搞笑的组合。',
        storyEn: 'Crafty Ghost and Clever Bug are Silver Horn King\'s two little minions. They were sent to capture Wukong with magic gourds, but got tricked into giving away their treasures and thought they made a good deal. They\'re the funniest duo in Journey to the West.'
    },
    {
        id: 'lingli_chong', name: '伶俐虫', nameEn: 'Clever Bug',
        emoji: '🪲', hp: 3, type: 'poison',
        attack: '🍶', attackName: '净瓶喷水', quips: ['我比精细鬼聪明！', '快进瓶子！', '嘻嘻嘻~'],
        trait: '自以为聪明其实总被骗的小虫精',
        traitEn: 'A bug spirit who thinks he\'s clever but always gets tricked',
        story: '伶俐虫觉得自己是世界上最聪明的妖怪，可是每次都被孙悟空耍得团团转。他有个口头禅："这次绝对不会上当！"然后下一秒就上当了。不过他从不气馁，这种乐观精神也算是优点吧。',
        storyEn: 'Clever Bug thinks he\'s the smartest monster in the world, but Wukong tricks him every time. His catchphrase is "I definitely won\'t fall for it this time!" - right before falling for it. But he never gets discouraged, which is kind of a good quality.'
    }
];

// ===== 中级妖怪（普通模式）HP 4-6 =====
const xiyoujiNormalMonsters = [
    {
        id: 'baigu_jing', name: '白骨精', nameEn: 'White Bone Spirit',
        emoji: '💀', hp: 5, type: 'ghost',
        attack: '💫', attackName: '三变化身', quips: ['变变变~', '这次你认不出我了！', '我是好人呀~'],
        trait: '最会变化的妖精，三次变身骗唐僧',
        traitEn: 'Master of disguise, fooled Tang Monk three times',
        story: '白骨精是西游记里最出名的妖怪之一。她三次变化成不同的人来骗唐僧，先变村姑，再变老婆婆，最后变老爷爷。虽然每次都被悟空识破，但她的演技确实不错——至少唐僧每次都信了。',
        storyEn: 'White Bone Spirit is one of the most famous monsters. She disguised herself three times to trick Tang Monk - first as a girl, then as an old woman, then as an old man. Though Wukong saw through each disguise, her acting was quite good - Tang Monk believed her every time!'
    },
    {
        id: 'jinjiao_dawang', name: '金角大王', nameEn: 'Gold Horn King',
        emoji: '👹', hp: 5, type: 'fire',
        attack: '🔥', attackName: '紫金葫芦烈焰', quips: ['叫你一声你敢答应吗？', '装进来吧！', '本大王法宝多得很！'],
        trait: '太上老君的金炉童子下凡，法宝多多',
        traitEn: 'Laozi\'s golden furnace boy, armed with many treasures',
        story: '金角大王原来是太上老君看金炉的童子，偷了五件法宝下凡当妖怪。他最得意的招数就是拿着紫金红葫芦喊你名字，你一答应就会被吸进去。所以遇到他的时候，千万别随便答"到"！',
        storyEn: 'Gold Horn King was originally Laozi\'s furnace-tending boy who stole five treasures to become a demon. His best trick is calling your name with his magic gourd - if you answer, you get sucked in! So never say "here" when you meet him!'
    },
    {
        id: 'yinjiao_dawang', name: '银角大王', nameEn: 'Silver Horn King',
        emoji: '😈', hp: 5, type: 'ice',
        attack: '❄️', attackName: '羊脂玉净瓶', quips: ['哥哥说得对！', '看我的法宝！', '冻住你！'],
        trait: '金角大王的弟弟，有样学样',
        traitEn: 'Gold Horn\'s younger brother, always copying his big bro',
        story: '银角大王什么都跟哥哥金角大王学。哥哥拿葫芦，他拿净瓶；哥哥喊名字，他也喊名字。虽然总是活在哥哥的阴影下，但他一直很努力。后来被太上老君收回去，继续当看银炉的童子。',
        storyEn: 'Silver Horn King copies everything from his big brother Gold Horn. Brother uses a gourd, he uses a vase; brother calls names, he calls names too. Though always in his brother\'s shadow, he tries his best. Eventually Laozi took him back to tend the silver furnace.'
    },
    {
        id: 'zhizhu_jing', name: '蜘蛛精', nameEn: 'Spider Spirits',
        emoji: '🕷️', hp: 4, type: 'poison',
        attack: '🕸️', attackName: '丝网缠绕', quips: ['姐妹们上！', '洗澡被偷看了！', '缠住你~'],
        trait: '盘丝洞七姐妹，最爱泡温泉',
        traitEn: 'Seven spider sisters from Silk Cave, love hot springs',
        story: '蜘蛛精是盘丝洞的七个姐妹，她们最大的爱好就是一起去泡温泉。每天的日程就是：早上织网、中午抓人、下午泡澡。结果有一天唐僧路过，被她们抓去差点变成了"唐僧泡饭"。',
        storyEn: 'The Spider Spirits are seven sisters from Silk Cave whose favorite activity is soaking in hot springs. Their daily routine: weave webs in the morning, catch people at noon, bath time in the afternoon. One day Tang Monk wandered by and almost became "Tang Monk soup!"'
    },
    {
        id: 'huangpao_guai', name: '黄袍怪', nameEn: 'Yellow Robe Demon',
        emoji: '🌙', hp: 5, type: 'dark',
        attack: '🌑', attackName: '暗月斩', quips: ['百花公主是我的！', '看我变老虎！', '星光闪耀！'],
        trait: '原是天上奎木狼星官，下凡谈恋爱',
        traitEn: 'Actually a star god who came to earth for love',
        story: '黄袍怪其实是天上二十八星宿之一的奎木狼星官。他为了跟喜欢的仙女在一起，放弃了天上的高级职位跑到凡间当妖怪。这大概是西游记里最浪漫（也最傻）的爱情故事了。',
        storyEn: 'Yellow Robe Demon is actually Kui Star Wolf, one of the 28 Star Gods. He gave up his heavenly position to be with the fairy he loved. This is probably the most romantic (and silliest) love story in Journey to the West.'
    },
    {
        id: 'kuimu_lang', name: '奎木狼', nameEn: 'Kui Star Wolf',
        emoji: '🐺', hp: 5, type: 'beast',
        attack: '🌟', attackName: '星辰冲击', quips: ['我是天上的星星！', '为爱下凡！', '嗷呜——'],
        trait: '为爱痴狂的星宿精灵',
        traitEn: 'A star spirit crazy in love',
        story: '奎木狼本是天上管理木星的神仙，温文尔雅，结果一看到披香殿的仙女就走不动路了。他偷偷跑到人间约会，被玉帝发现后罚他去太上老君那里烧火，从此变成了一只专门看炉子的狼。',
        storyEn: 'Kui Star Wolf was a refined celestial official managing Jupiter, until he fell head over heels for a fairy. He snuck to earth for dates, got caught by the Jade Emperor, and was sentenced to tend Laozi\'s furnace - becoming a wolf who watches ovens.'
    },
    {
        id: 'xiezi_jing', name: '蝎子精', nameEn: 'Scorpion Spirit',
        emoji: '🦂', hp: 5, type: 'poison',
        attack: '💉', attackName: '倒马毒桩', quips: ['连如来都怕我！', '扎你一下~', '毒不死你算我输！'],
        trait: '连如来佛祖都被她蜇过的狠角色',
        traitEn: 'Even Buddha was stung by her - a truly fierce one',
        story: '蝎子精可是西游记里最厉害的女妖怪之一！她曾经在雷音寺蜇了如来佛祖一下，连佛祖都疼得直念经。最后还是请来了昴日星官（一只大公鸡）才把她收服——因为鸡吃虫嘛！',
        storyEn: 'Scorpion Spirit is one of the fiercest female demons! She once stung Buddha himself, making even Buddha chant sutras in pain. In the end, they had to summon the Star God Mao (a giant rooster) to defeat her - because chickens eat bugs!'
    },
    {
        id: 'yutu_jing', name: '玉兔精', nameEn: 'Jade Rabbit Spirit',
        emoji: '🐰', hp: 4, type: 'light',
        attack: '🥕', attackName: '月光萝卜锤', quips: ['月亮上好无聊~', '嫦娥姐姐不管我~', '蹦蹦跳~'],
        trait: '从月宫偷跑下来的嫦娥宠物兔',
        traitEn: 'Chang\'e\'s pet rabbit who escaped from the Moon Palace',
        story: '玉兔精原本是嫦娥姐姐在月宫里养的小兔子，每天的工作就是捣药。后来她觉得捣药太无聊了，就偷偷跑到人间冒充公主。虽然她干了坏事，但看她蹦蹦跳跳的样子，实在让人凶不起来。',
        storyEn: 'Jade Rabbit was Chang\'e\'s pet in the Moon Palace, whose daily job was grinding medicine. Finding it too boring, she snuck to earth pretending to be a princess. Though she caused trouble, watching her hop around makes it impossible to stay mad.'
    },
    {
        id: 'laoshu_jing', name: '老鼠精', nameEn: 'Mouse Spirit',
        emoji: '🐭', hp: 5, type: 'dark',
        attack: '🔥', attackName: '三昧真火', quips: ['人家叫半截观音！', '李天王是我义父！', '吱吱~'],
        trait: '托塔李天王的义女，会用三昧真火',
        traitEn: 'Adopted daughter of Pagoda-Bearer Li, controls true fire',
        story: '老鼠精本名金鼻白毛老鼠精，她给自己取了个高大上的法号叫"半截观音"。她的义父是托塔天王李靖，可以说是妖界的"官二代"。不过她抓唐僧这件事可没跟义父商量过，结果被李天王亲自来抓走了。',
        storyEn: 'Mouse Spirit\'s real name is Golden-Nose White-Haired Mouse Spirit, but she gave herself the fancy title "Half Guanyin." Her adoptive father is Pagoda-Bearer Li Jing - she\'s basically demon royalty. But she kidnapped Tang Monk without asking daddy, so Li Jing came to take her home himself.'
    },
    {
        id: 'linggan_dawang', name: '灵感大王', nameEn: 'Goldfish King',
        emoji: '🐟', hp: 5, type: 'water',
        attack: '🌊', attackName: '通天河水淹', quips: ['通天河是我家！', '水淹金山！', '咕噜咕噜~'],
        trait: '观音菩萨莲花池里逃出来的金鱼',
        traitEn: 'A goldfish that escaped from Guanyin\'s lotus pond',
        story: '灵感大王原来是观音菩萨莲花池里的一条金鱼。他每天听菩萨讲经，结果听出了灵性。有一天趁菩萨不在家，他偷偷跳出莲花池游到了通天河，当起了河神。后来菩萨用竹篮把他捞了回去。',
        storyEn: 'Goldfish King was originally a goldfish in Guanyin\'s lotus pond. He gained spiritual power from listening to Guanyin\'s lectures daily. One day while Guanyin was out, he jumped into Tongtian River to play river god. Guanyin later scooped him back with a bamboo basket.'
    },
    {
        id: 'tieshan_gongzhu', name: '铁扇公主', nameEn: 'Princess Iron Fan',
        emoji: '💨', hp: 5, type: 'wind',
        attack: '🌬️', attackName: '芭蕉扇·狂风', quips: ['还我儿子！', '一扇扇你十万里！', '你这泼猴！'],
        trait: '牛魔王的正妻，手持芭蕉扇的女中豪杰',
        traitEn: 'Bull Demon King\'s wife, heroine with the Banana Leaf Fan',
        story: '铁扇公主是红孩儿的妈妈、牛魔王的正妻。她手中的芭蕉扇一扇能灭火，二扇能生风，三扇能下雨。悟空为了借扇子灭火焰山的火，变成小虫子钻进她肚子里闹腾，可把她折腾坏了。',
        storyEn: 'Princess Iron Fan is Red Boy\'s mom and Bull Demon King\'s wife. Her Banana Leaf Fan can extinguish fire, create wind, and summon rain. When Wukong needed to borrow it to put out Flame Mountain, he turned into a bug and jumped into her belly - what a stomachache!'
    },
    {
        id: 'jinchi_changlao', name: '金池长老', nameEn: 'Elder Gold Pond',
        emoji: '🏮', hp: 4, type: 'fire',
        attack: '🔥', attackName: '纵火烧寺', quips: ['好漂亮的袈裟！', '给我看看嘛~', '烧！都烧！'],
        trait: '为了袈裟放火烧寺的贪心老和尚',
        traitEn: 'A greedy old monk who set fire to his own temple for a kasaya',
        story: '金池长老是观音院的住持，活了270岁，收藏了几百件袈裟，可偏偏迷上了唐僧那件锦斓袈裟。为了得到它，他居然放火烧自己的寺庙！结果袈裟没到手，寺庙也烧没了。这就是贪心的下场。',
        storyEn: 'Elder Gold Pond was the abbot of Guanyin Temple, 270 years old with hundreds of kasayas, but he was obsessed with Tang Monk\'s special one. He set fire to his own temple to steal it! He ended up losing both the kasaya and his temple. That\'s what greed gets you.'
    }
];

// ===== 高级妖怪（困难模式）HP 6-8 =====
const xiyoujiHardMonsters = [
    {
        id: 'honghaier', name: '红孩儿', nameEn: 'Red Boy',
        emoji: '🔥', hp: 7, type: 'fire',
        attack: '🔥', attackName: '三昧真火', quips: ['我爸是牛魔王！', '烧烧烧！', '叔叔你是唐僧吗？'],
        trait: '牛魔王之子，口吐三昧真火的熊孩子',
        traitEn: 'Son of Bull Demon King, a fire-breathing brat',
        story: '红孩儿是牛魔王和铁扇公主的儿子，修炼了三百年，学会了吐三昧真火。这小子是西游记里最难对付的妖怪之一，连孙悟空都被他烧伤了。最后观音菩萨用天罡刀把他收服，让他当了善财童子。',
        storyEn: 'Red Boy is the son of Bull Demon King and Princess Iron Fan. After 300 years of training, he learned to breathe True Samadhi Fire. He\'s one of the toughest monsters - even Wukong got burned! Eventually Guanyin subdued him with celestial swords and made him the Good Fortune Boy.'
    },
    {
        id: 'huangmei_dawang', name: '黄眉大王', nameEn: 'Yellow Brow King',
        emoji: '⭕', hp: 7, type: 'ancient',
        attack: '🔔', attackName: '金铙合拢', quips: ['小雷音寺欢迎你！', '铛铛铛~', '我才是真佛祖！'],
        trait: '弥勒佛的敲磬童子，假冒佛祖',
        traitEn: 'Maitreya\'s bell boy, impersonating Buddha himself',
        story: '黄眉大王原是弥勒佛身边敲磬的小童子。他偷了弥勒佛的金铙和布袋，跑到小雷音寺假装佛祖。孙悟空差点被他的金铙扣住出不来。这告诉我们一个道理：遇到号称"免费的佛祖"要小心！',
        storyEn: 'Yellow Brow King was Maitreya Buddha\'s bell-ringing boy. He stole Maitreya\'s golden cymbals and cloth bag, then set up a fake temple pretending to be Buddha. Wukong nearly got trapped in his cymbals. Lesson: beware of anyone claiming to be "free Buddha!"'
    },
    {
        id: 'liuer_mihou', name: '六耳猕猴', nameEn: 'Six-Eared Macaque',
        emoji: '🐵', hp: 8, type: 'psychic',
        attack: '🪞', attackName: '完美复制', quips: ['我才是真悟空！', '你是假的！', '连如来都分不清！'],
        trait: '能完美模仿孙悟空的神秘猴王',
        traitEn: 'A mysterious monkey king who perfectly mimics Wukong',
        story: '六耳猕猴是西游记里最神秘的妖怪——他长得跟孙悟空一模一样，连能力都完全相同！从地府到天宫，没有任何人能分辨他们。最后只有如来佛祖用慧眼才看出真假。真假美猴王这一集，可以说是西游记最精彩的故事之一。',
        storyEn: 'Six-Eared Macaque is the most mysterious monster - he looks and fights exactly like Wukong! From the Underworld to Heaven, nobody could tell them apart. Only Buddha himself could see the difference. The True vs False Monkey King episode is one of Journey to the West\'s best stories.'
    },
    {
        id: 'baiyan_mojun', name: '百眼魔君', nameEn: 'Hundred-Eye Demon Lord',
        emoji: '👁️', hp: 7, type: 'poison',
        attack: '💛', attackName: '千目金光', quips: ['我有一百只眼！', '到处都是我的眼睛！', '看穿你了！'],
        trait: '全身长满眼睛的蜈蚣精，能放金光',
        traitEn: 'A centipede covered in eyes that shoot golden light',
        story: '百眼魔君就是蜈蚣精的另一个身份。他全身上下长满了眼睛，能从每只眼睛里射出金光。这招连孙悟空都招架不住。不过他有个弱点——特别怕公鸡叫。昴日星官一变成大公鸡，他就吓得动弹不得。',
        storyEn: 'Hundred-Eye Demon Lord is the centipede spirit\'s true form. Eyes cover his entire body, each shooting golden light. Even Wukong couldn\'t handle this attack. But he has one weakness - he\'s terrified of roosters! When the Star God turned into a giant rooster, he froze in fear.'
    },
    {
        id: 'dujiao_si', name: '独角兕大王', nameEn: 'Rhinoceros King',
        emoji: '🦏', hp: 7, type: 'earth',
        attack: '💎', attackName: '金刚琢·万物归一', quips: ['来来来都收走！', '这个圈圈厉害吧！', '法宝？都是我的！'],
        trait: '太上老君的坐骑，偷了金刚琢下凡',
        traitEn: 'Laozi\'s mount who stole the Diamond Bracelet',
        story: '独角兕大王是太上老君的坐骑青牛精。他偷了老君的金刚琢就跑了——这个金刚琢可了不得，能收走一切兵器法宝！孙悟空找了天兵天将来帮忙，所有武器都被金刚琢吸走了。最后只能请太上老君亲自来收回坐骑。',
        storyEn: 'Rhinoceros King is Laozi\'s mount, the Green Bull Spirit, who stole the Diamond Bracelet and ran away. This bracelet can absorb ALL weapons! When Wukong called for heavenly reinforcements, every single weapon got sucked up. Only Laozi himself could reclaim his mount.'
    },
    {
        id: 'jiutou_chong', name: '九头虫', nameEn: 'Nine-Headed Bug',
        emoji: '🐉', hp: 8, type: 'dragon',
        attack: '🔱', attackName: '九头齐攻', quips: ['我有九个脑袋！', '砍不完的！', '九头齐咬！'],
        trait: '碧波潭万圣龙王的女婿，有九个脑袋',
        traitEn: 'Son-in-law of Dragon King Wansheng, has nine heads',
        story: '九头虫是西游记里唯一一个被砍了一个头还能跑掉的妖怪。他有九个脑袋，被二郎神的哮天犬咬掉一个，还剩八个照样跑。他是万圣龙王的女婿，偷了祭赛国的舍利子。至今没被抓到，算是西游记的未解之谜。',
        storyEn: 'Nine-Headed Bug is the only monster who escaped even after losing a head! He has nine heads - Erlang Shen\'s celestial hound bit off one, but he still ran away with eight. He stole relics from a kingdom and was never caught - one of Journey to the West\'s unsolved mysteries.'
    },
    {
        id: 'tuolong_guai', name: '鼍龙怪', nameEn: 'Alligator Dragon',
        emoji: '🐊', hp: 6, type: 'water',
        attack: '🌊', attackName: '黑水漫天', quips: ['黑水河是我地盘！', '咕嘟咕嘟~', '水里你打不过我！'],
        trait: '西海龙王的外甥，黑水河里称霸',
        traitEn: 'Nephew of the Western Sea Dragon King, ruler of Black Water River',
        story: '鼍龙怪是西海龙王敖闰的外甥，也就是小白龙的表弟。他霸占了黑水河，把河水变成黑色的毒水。虽然他是龙族的亲戚，但因为闹得太过分，最后还是被他舅舅西海龙王亲自来教训了一顿。',
        storyEn: 'Alligator Dragon is the nephew of Western Sea Dragon King and White Dragon Horse\'s cousin. He took over Black Water River, turning it into poisonous black water. Despite being dragon royalty, he went too far and his own uncle came to discipline him.'
    },
    {
        id: 'ruyi_zhenxian', name: '如意真仙', nameEn: 'Ruyi True Immortal',
        emoji: '🧙', hp: 6, type: 'spirit',
        attack: '🪄', attackName: '如意钩·缠绕', quips: ['别想喝我的泉水！', '这是我弟的地盘！', '哼！'],
        trait: '红孩儿的叔叔，守着落胎泉不让人喝',
        traitEn: 'Red Boy\'s uncle, guards the Abortion Spring jealously',
        story: '如意真仙是牛魔王的弟弟、红孩儿的叔叔。他守着西梁女国的落胎泉，谁想喝水他都不让。他之所以这么小气，是因为他侄子红孩儿被观音收走了，他一直记恨着。不过最后还是被悟空打服了。',
        storyEn: 'Ruyi True Immortal is Bull Demon King\'s brother and Red Boy\'s uncle. He guards the Abortion Spring and won\'t let anyone drink. He\'s so stingy because he\'s still angry that Guanyin took his nephew Red Boy. Eventually Wukong beat some sense into him.'
    },
    {
        id: 'wugong_jing', name: '蜈蚣精', nameEn: 'Centipede Spirit',
        emoji: '🦎', hp: 6, type: 'poison',
        attack: '☠️', attackName: '百足毒雾', quips: ['密密麻麻~', '毒你一身！', '我的脚比你多！'],
        trait: '蜘蛛精的师兄，七个蜘蛛精的靠山',
        traitEn: 'Senior disciple of the spiders, their powerful protector',
        story: '蜈蚣精是蜘蛛精七姐妹的师兄，住在黄花观。他平时装成一个道士的模样，看起来文质彬彬的。但一旦现出原形，那密密麻麻的脚和全身的眼睛，就连最勇敢的小朋友看了都会起鸡皮疙瘩。',
        storyEn: 'Centipede Spirit is the senior fellow disciple of the seven Spider Sisters, living in Yellow Flower Temple. He normally looks like a refined Taoist priest. But when he reveals his true form with countless legs and eyes covering his body, even the bravest kids get goosebumps.'
    }
];

// ===== Boss妖怪 HP 8-12 =====
const xiyoujiBossMonsters = [
    {
        id: 'dapeng_jinchi', name: '大鹏金翅雕', nameEn: 'Golden-Winged Roc',
        emoji: '🦅', hp: 12, type: 'ancient',
        attack: '🌪️', attackName: '天崩地裂·金翅劈空', quips: ['如来是我舅舅！', '孙悟空你跑不了！', '覆天翅展！'],
        trait: '如来佛祖的亲戚，西游记最强妖怪',
        traitEn: 'Buddha\'s relative, the strongest demon in Journey to the West',
        story: '大鹏金翅雕是西游记里公认最强的妖怪！他是凤凰的儿子、如来佛祖的舅舅（孔雀大明王）的弟弟，算起来跟如来还是亲戚。他速度极快，一扇翅膀就能飞九万里，连孙悟空的筋斗云都追不上他。最后只有如来亲自出马才收服了他。',
        storyEn: 'Golden-Winged Roc is undeniably the strongest monster! He\'s the son of a phoenix and related to Buddha himself through his brother, the Peacock King. His speed is incredible - one wing flap covers 90,000 miles, faster than even Wukong\'s cloud-somersault. Only Buddha personally could subdue him.'
    },
    {
        id: 'jiuling_yuansheng', name: '九灵元圣', nameEn: 'Nine Spirits Sage',
        emoji: '🔮', hp: 10, type: 'ancient',
        attack: '⚡', attackName: '九头齐啸·天崩', quips: ['太乙天尊的坐骑在此！', '九头并吞！', '渺小的猴子！'],
        trait: '太乙救苦天尊的坐骑，九头狮子精',
        traitEn: 'Mount of Taiyi, the Nine-Headed Lion Spirit',
        story: '九灵元圣是太乙救苦天尊的坐骑，一只有九个头的狮子精。他是所有狮子精的祖宗，下凡后收了七个狮子精当徒弟。他厉害到连孙悟空都打不过，最后只能请他的主人太乙天尊来收回。能让悟空主动搬救兵的妖怪可不多！',
        storyEn: 'Nine Spirits Sage is the mount of Taiyi, a nine-headed lion spirit and ancestor of all lion demons. He took on seven lion spirits as disciples. He was so powerful that even Wukong couldn\'t beat him and had to ask his master Taiyi to come get him. Few monsters force Wukong to call for backup!'
    },
    {
        id: 'niumo_wang', name: '牛魔王', nameEn: 'Bull Demon King',
        emoji: '🐂', hp: 10, type: 'fire',
        attack: '🔥', attackName: '混天大力·烈焰冲锋', quips: ['俺老牛来也！', '小子找打！', '看我七十二变！'],
        trait: '妖界第一大佬，孙悟空的结拜兄弟',
        traitEn: 'Top boss of the demon world, Wukong\'s sworn brother',
        story: '牛魔王是妖界的绝对大佬，跟孙悟空是结拜兄弟。他住在翠云山芭蕉洞，是铁扇公主的老公、红孩儿的爸爸。他不仅力气大、法力强，还会七十二变。因为家庭矛盾（老婆嫌他在外面找小妾），他跟悟空打了好几场。可以说是西游记里最有"人味儿"的妖怪。',
        storyEn: 'Bull Demon King is the undisputed boss of demon-kind and Wukong\'s sworn brother. He\'s Princess Iron Fan\'s husband and Red Boy\'s dad. Strong, powerful, and knows 72 transformations. He fought Wukong multiple times due to family drama (his wife was mad about his concubine). He\'s the most "human" demon in Journey to the West.'
    },
    {
        id: 'qingshi_jing', name: '青狮精', nameEn: 'Green Lion Spirit',
        emoji: '🦁', hp: 9, type: 'beast',
        attack: '💥', attackName: '狮吼功·震天裂地', quips: ['文殊的坐骑可不是吃素的！', '吼！', '狮驼岭欢迎你！'],
        trait: '文殊菩萨的坐骑，狮驼岭三魔头之首',
        traitEn: 'Manjusri\'s mount, leader of the three Lion Camel Ridge demons',
        story: '青狮精是文殊菩萨的坐骑青狮，偷跑下凡到狮驼岭当大哥。他跟白象精、大鹏金翅雕组成了"狮驼岭三人组"，统治着狮驼国。他一口能吞下十万天兵，算是西游记里胃口最大的妖怪。后来被文殊菩萨骑着回去了。',
        storyEn: 'Green Lion Spirit is Manjusri Bodhisattva\'s mount who ran away to Lion Camel Ridge to be the boss. With White Elephant and Golden Roc, they formed the "Lion Camel Ridge Trio" ruling an entire kingdom. He can swallow 100,000 celestial soldiers in one bite! Manjusri eventually came to ride him home.'
    },
    {
        id: 'baixiang_jing', name: '白象精', nameEn: 'White Elephant Spirit',
        emoji: '🐘', hp: 9, type: 'beast',
        attack: '🌀', attackName: '象鼻卷天', quips: ['鼻子一卷！', '普贤菩萨不在家~', '大象无形！'],
        trait: '普贤菩萨的坐骑，力大无穷',
        traitEn: 'Samantabhadra\'s mount, possesses infinite strength',
        story: '白象精是普贤菩萨的坐骑白象，和青狮精一起偷跑下凡。他最厉害的招数就是用鼻子卷人——那长长的象鼻一卷，连孙悟空都被卷得晕头转向。虽然他是三魔头里排第二，但论力气，他说第二没人敢说第一。',
        storyEn: 'White Elephant Spirit is Samantabhadra Bodhisattva\'s mount who ran away with Green Lion. His best move is wrapping enemies with his trunk - even Wukong got dizzy from being swung around. He ranks second among the trio, but in pure strength, nobody dares to challenge him.'
    }
];
