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
    },
    {
        id: 'xiao_zuanfeng', name: '小钻风', nameEn: 'Little Cyclone',
        emoji: '🌀', hp: 3, type: 'wind',
        attack: '💨', attackName: '钻风巡山', quips: ['大王叫我来巡山！', '我是小钻风！', '有情况！'],
        trait: '狮驼岭巡山小妖，自带主题曲',
        traitEn: 'Lion Camel Ridge patrol demon with his own theme song',
        story: '小钻风是狮驼岭最出名的巡山小妖，每天的工作就是在山里转悠。他有一首自己编的巡山歌，边走边唱，响彻山谷。结果孙悟空变成"总钻风"，三言两语就把他套了个底朝天。从此"大王叫我来巡山"成了网红金句。',
        storyEn: 'Little Cyclone is the most famous patrol demon of Lion Camel Ridge. His job is wandering the mountains singing his self-composed patrol song. Wukong disguised as "General Cyclone" and tricked him into spilling all the secrets. His song "The King sent me to patrol" became an internet meme.'
    },
    {
        id: 'benboerba', name: '奔波儿灞', nameEn: 'Benbo\'erba',
        emoji: '🐟', hp: 3, type: 'water',
        attack: '🌊', attackName: '鲶鱼摆尾', quips: ['灞波儿奔你快来！', '巡塔去咯~', '喝一杯？'],
        trait: '碧波潭鲶鱼精，名字比本人有名',
        traitEn: 'A catfish spirit more famous for his name than himself',
        story: '奔波儿灞是碧波潭万圣龙王手下的鲶鱼精。他和搭档灞波儿奔被派去巡塔，结果两人躲在塔心里猜拳喝酒，玩得不亦乐乎。被孙悟空抓住后，为了保命，把老板的秘密全抖了出来。他的名字读起来像鱼尾拍水的声音——噗通噗通。',
        storyEn: 'Benbo\'erba is a catfish spirit under Dragon King Wansheng. Sent to patrol the pagoda with his partner, they instead played drinking games inside. When caught by Wukong, he spilled all his boss\'s secrets to save his skin. His name sounds like a fish slapping water - splish splash.'
    },
    {
        id: 'baboerben', name: '灞波儿奔', nameEn: 'Babo\'erben',
        emoji: '🐡', hp: 3, type: 'dark',
        attack: '🖤', attackName: '黑鱼墨喷', quips: ['奔波儿灞等等我！', '我的名字不绕口！', '墨汁攻击！'],
        trait: '碧波潭黑鱼精，和搭档名字互为颠倒',
        traitEn: 'A blackfish spirit whose name mirrors his partner\'s',
        story: '灞波儿奔是奔波儿灞的搭档，一只黑鱼精。他俩的名字互为颠倒，就像水中的倒影。每次别人叫他们的名字都会搞混，连万圣龙王有时候都分不清谁是谁。他最大的特长是喷墨汁，但经常误伤自己的搭档。',
        storyEn: 'Babo\'erben is Benbo\'erba\'s partner, a blackfish spirit. Their names are mirror images of each other, and even their boss Dragon King Wansheng mixes them up. His special skill is spraying ink, but he frequently hits his own partner by accident.'
    },
    {
        id: 'youlai_youqu', name: '有来有去', nameEn: 'Come-and-Go',
        emoji: '👣', hp: 3, type: 'spirit',
        attack: '💫', attackName: '跑腿飞踢', quips: ['报——！', '大王！有消息！', '我跑得最快！'],
        trait: '黄眉大王的跑腿小妖，来去如风',
        traitEn: 'Yellow Brow King\'s messenger, swift as the wind',
        story: '有来有去是黄眉大王手下专门负责跑腿送信的小妖怪。他跑起来飞快，一天能跑好几个来回。他最自豪的就是自己的速度，逢人就说"我跑得比筋斗云还快"。当然，这话只有他自己信。不过在小妖界的跑腿届，他确实是第一名。',
        storyEn: 'Come-and-Go is Yellow Brow King\'s dedicated messenger demon. He runs incredibly fast, making several round trips a day. He proudly claims "I\'m faster than Cloud Somersault!" Of course, only he believes that. But among messenger demons, he truly is number one.'
    },
    {
        id: 'bashanhu', name: '巴山虎', nameEn: 'Mountain Tiger',
        emoji: '🐯', hp: 3, type: 'beast',
        attack: '🐾', attackName: '巴山爪击', quips: ['虎啸山林！', '倚海龙快跟上！', '吼——'],
        trait: '莲花洞巡山小虎妖，名字响亮实力弱',
        traitEn: 'A tiger demon with a mighty name but tiny might',
        story: '巴山虎是金角大王手下的巡山小妖，名字听起来霸气十足——"巴山"！虎！然而他被孙悟空一棍子打成了肉饼。事实上"巴山虎"在古语中是爬山虎（一种藤蔓植物）的意思。所以他本质上是一根……藤？这大概是西游记里最名不副实的妖怪了。',
        storyEn: 'Mountain Tiger is a patrol demon under Gold Horn King, with an intimidating name. But Wukong flattened him with one strike. Fun fact: "bashanhu" actually means "Boston ivy" (a climbing vine) in classical Chinese. So he\'s essentially a... vine? Probably the most misleadingly named monster in Journey to the West.'
    },
    {
        id: 'yihailong', name: '倚海龙', nameEn: 'Sea Dragon',
        emoji: '🐲', hp: 3, type: 'dragon',
        attack: '🌊', attackName: '倚海喷珠', quips: ['巴山虎等等我！', '龙行天下！', '水花四溅！'],
        trait: '莲花洞巡山小龙妖，和巴山虎是搭档',
        traitEn: 'A dragon demon paired with Mountain Tiger',
        story: '倚海龙是银角大王手下的巡山小妖，和巴山虎是对仗搭档。虎对龙、山对海，名字确实很讲究。可惜结局跟搭档一样惨——被孙悟空一棍子解决。他生前最大的遗憾就是：明明叫"龙"，却从来没有飞起来过。',
        storyEn: 'Sea Dragon is Silver Horn King\'s patrol demon, paired with Mountain Tiger. Tiger matches Dragon, Mountain matches Sea - the names are poetically balanced. Sadly, his fate was the same as his partner - one strike from Wukong. His biggest life regret: being called "Dragon" but never actually flying.'
    },
    {
        id: 'huxianfeng', name: '虎先锋', nameEn: 'Tiger Pioneer',
        emoji: '🐅', hp: 4, type: 'fighting',
        attack: '⚔️', attackName: '猛虎先锋斩', quips: ['冲锋！', '黄风大王万岁！', '虎威不可挡！'],
        trait: '黄风怪手下的虎精，冲锋在前的勇将',
        traitEn: 'A tiger general under Yellow Wind Demon, always charging first',
        story: '虎先锋是黄风怪手下最得力的干将，每次打仗都冲在最前面。他对黄风怪忠心耿耿，甚至不惜用自己当诱饵引开孙悟空。可惜他的武力值跟他的忠诚度完全不成正比——被悟空一棒子就打回了原形，原来是一只斑斓猛虎。',
        storyEn: 'Tiger Pioneer is Yellow Wind Demon\'s most loyal general, always charging first into battle. He\'s so loyal that he even used himself as bait to lure Wukong away. Unfortunately, his combat power doesn\'t match his loyalty - Wukong defeated him with one strike, revealing his true form as a striped tiger.'
    },
    {
        id: 'diaozuan_guguai', name: '刁钻古怪', nameEn: 'Tricky Oddball',
        emoji: '🦇', hp: 3, type: 'dark',
        attack: '🌙', attackName: '暗影偷袭', quips: ['嘿嘿嘿~', '古怪刁钻你来帮忙！', '暗处才安全！'],
        trait: '陷空山小妖，最擅长搞怪使坏',
        traitEn: 'A demon from Pitfall Mountain, master of mischief',
        story: '刁钻古怪是老鼠精手下的小妖怪，和搭档古怪刁钻一起看守陷空山无底洞。他俩的名字只是把词序颠倒了一下，这是吴承恩先生的独特幽默。刁钻古怪平时最喜欢在洞里布置各种陷阱，然后躲在暗处看路过的小动物踩中的样子。',
        storyEn: 'Tricky Oddball is Mouse Spirit\'s minion, guarding Bottomless Cave with his partner Oddball Tricky. Their names are just reversed word orders - a unique humor by author Wu Cheng\'en. His hobby is setting up traps in the cave and watching small animals stumble into them from the shadows.'
    },
    {
        id: 'guguai_diaozuan', name: '古怪刁钻', nameEn: 'Oddball Tricky',
        emoji: '🦉', hp: 3, type: 'ghost',
        attack: '👁️', attackName: '怪眼凝视', quips: ['刁钻古怪说得对！', '你中计了！', '嘻嘻~'],
        trait: '陷空山小妖搭档，名字颠倒的另一半',
        traitEn: 'The other half of the reversed-name duo',
        story: '古怪刁钻和刁钻古怪永远形影不离，走路时一个走左边一个走右边，就像照镜子一样。他们说话也互相颠倒——一个说"今天天气好"，另一个就说"好天气天今"。连老鼠精有时候都被他们搞得头疼，但又不舍得赶走他们，因为实在太有趣了。',
        storyEn: 'Oddball Tricky and Tricky Oddball are always inseparable, walking on opposite sides like mirror reflections. They even reverse each other\'s speech. Even Mouse Spirit gets headaches from them, but can\'t bear to dismiss them because they\'re just too entertaining.'
    },
    {
        id: 'jiruhuo', name: '急如火', nameEn: 'Quick-as-Fire',
        emoji: '🔥', hp: 3, type: 'fire',
        attack: '🔥', attackName: '火速冲锋', quips: ['快快快！', '急报！急报！', '火烧眉毛了！'],
        trait: '翠云山通风报信的小妖，性子最急',
        traitEn: 'A hasty little messenger demon from Emerald Cloud Mountain',
        story: '急如火是翠云山牛魔王手下的小妖怪，和搭档"快如风"一起负责通风报信。他最大的特点就是急——吃饭急、走路急、说话急、连睡觉都急。每次送信都跑得上气不接下气，经常话还没说完就晕过去了。牛魔王总是说："你倒是慢点说啊！"但他就是慢不下来。',
        storyEn: 'Quick-as-Fire is a messenger demon under Bull Demon King at Emerald Cloud Mountain. His defining trait is being in a hurry about EVERYTHING - eating, walking, talking, even sleeping. Every message delivery leaves him gasping for breath, often fainting before finishing his report. Bull Demon King keeps saying "Slow down!" but he just can\'t.'
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
    },
    {
        id: 'bailu_jing', name: '白鹿精', nameEn: 'White Deer Spirit',
        emoji: '🦌', hp: 5, type: 'spirit',
        attack: '🪄', attackName: '蟠龙拐杖', quips: ['长生不老指日可待！', '国王听我的！', '再吃一颗丹药~'],
        trait: '南极寿星的坐骑，偷了拐杖下凡当国丈',
        traitEn: 'The Star of Longevity\'s mount who stole his staff to play king-maker',
        story: '白鹿精原本是南极寿星的坐骑，偷了寿星的蟠龙拐杖跑到比丘国当国丈。他收了一只白面狐狸当女儿，把她献给国王当妃子，自己在幕后操控朝政。他最坏的计划是要用一千一百一十一个小孩的心肝做药引，幸好被悟空及时阻止。',
        storyEn: 'White Deer Spirit was the Star of Longevity\'s mount who stole his master\'s dragon staff and became the king\'s advisor in Bhiksu Kingdom. He adopted a fox spirit as his daughter, offered her to the king as a consort, and secretly controlled the court. His evil plan to use children\'s hearts as medicine was thankfully stopped by Wukong in time.'
    },
    {
        id: 'baimian_huli', name: '白面狐狸', nameEn: 'White-Face Fox',
        emoji: '🦊', hp: 5, type: 'psychic',
        attack: '💋', attackName: '迷心魅术', quips: ['陛下~', '人家好美呀~', '义父说的都对！'],
        trait: '比丘国的美人妖精，白鹿精的义女',
        traitEn: 'The beautiful fox spirit of Bhiksu Kingdom',
        story: '白面狐狸是白鹿精收养的义女，被献给比丘国国王当宠妃。她长得倾国倾城，整个比丘国的人都被她迷得神魂颠倒。她最大的本事不是打架，而是撒娇——据说她一撒娇，连天上的云都会停下来看。可惜再美的狐狸精也挡不住猴哥的一棒。',
        storyEn: 'White-Face Fox was adopted by White Deer Spirit and given to the King of Bhiksu as a consort. She was stunningly beautiful - the entire kingdom was enchanted. Her greatest skill wasn\'t fighting but pouting cutely. They say even clouds stopped to watch her act coy. But no fox charm can withstand Monkey King\'s staff.'
    },
    {
        id: 'nanshan_dawang', name: '南山大王', nameEn: 'South Mountain King',
        emoji: '🐆', hp: 5, type: 'beast',
        attack: '🔨', attackName: '花皮棒槌', quips: ['隐雾山是我的地盘！', '吃唐僧肉！', '看我的棒槌！'],
        trait: '隐雾山艾叶花皮豹子精，没有后台的野生妖怪',
        traitEn: 'A leopard spirit with no divine backing - a self-made demon',
        story: '南山大王是西游记里少有的"纯野生妖怪"——没有神仙背景，没有菩萨靠山，完全靠自己修炼。他是一只艾叶花皮豹子精，最大的武器就是一对大棒槌。虽然最后被八戒一钉耙解决了，但作为白手起家的妖怪，他的奋斗精神还是值得敬佩的。',
        storyEn: 'South Mountain King is a rare "wild-born demon" - no divine background, no bodhisattva patron, purely self-trained. He\'s a leopard spirit whose main weapons are a pair of clubs. Though Pigsy finished him off, as a self-made demon, his entrepreneurial spirit is somewhat admirable.'
    },
    {
        id: 'huangshi_jing', name: '黄狮精', nameEn: 'Yellow Lion Spirit',
        emoji: '🦁', hp: 5, type: 'beast',
        attack: '💎', attackName: '钉耙会·偷兵器', quips: ['好漂亮的兵器！', '拿来拿来！', '祖翁会保护我的！'],
        trait: '竹节山偷兵器的狮子精，九灵元圣的弟子',
        traitEn: 'A lion who stole weapons, disciple of Nine Spirits Sage',
        story: '黄狮精最大的爱好就是收藏各种兵器。有一天他发现了悟空、八戒、沙僧的武器，忍不住全偷走了，还开了个"钉耙会"炫耀。这下可捅了马蜂窝——三个人追上门来，他只好搬出祖翁九灵元圣当靠山。不过事实证明，偷别人东西终究不是好主意。',
        storyEn: 'Yellow Lion Spirit\'s biggest hobby is collecting weapons. When he found Wukong, Pigsy, and Sandy\'s weapons, he couldn\'t resist stealing all three and held a "Rake Exhibition" to show off. This stirred up a hornet\'s nest - all three came knocking. He had to call on his master Nine Spirits Sage for backup. Lesson: stealing never ends well.'
    },
    {
        id: 'mangshe_jing', name: '蟒蛇精', nameEn: 'Giant Python Spirit',
        emoji: '🐍', hp: 5, type: 'poison',
        attack: '🌀', attackName: '缠绕绞杀', quips: ['嘶嘶嘶——', '好大一口！', '缠住你~'],
        trait: '七绝山的巨蟒，身长能堵住整条山路',
        traitEn: 'A giant python so big it blocks entire mountain paths',
        story: '七绝山的蟒蛇精是一条巨大无比的红色大蟒蛇，身子粗得能把整条山路堵住。它的本事不是变化也不是法术，就是单纯的——大。大到什么程度呢？它打个喷嚏就能刮起一阵妖风。最后被悟空想办法钻进肚子里，从里面把它给戳了个稀巴烂。',
        storyEn: 'The Giant Python of Seven-Extremes Mountain is an enormous red serpent so thick it blocks entire mountain paths. Its power isn\'t transformation or magic - it\'s just being BIG. How big? Its sneeze creates a gale. Wukong eventually crawled inside its belly and poked it full of holes from within.'
    },
    {
        id: 'pihan_dawang', name: '辟寒大王', nameEn: 'Cold-Repelling King',
        emoji: '🦏', hp: 5, type: 'ice',
        attack: '❄️', attackName: '寒角冰封', quips: ['犀角一照！', '二弟三弟跟上！', '冻住！'],
        trait: '犀牛精三兄弟之首，犀角能辟寒',
        traitEn: 'The eldest of three rhino brothers, his horn repels cold',
        story: '辟寒大王是青龙山玄英洞的犀牛精三兄弟的大哥。三兄弟分别叫辟寒、辟暑、辟尘，犀角各有不同的功能。他们修行千年，最喜欢做的事是偷酥合香油点灯——对，就是偷油。三只犀牛精偷油的画面，想想就觉得很搞笑。',
        storyEn: 'Cold-Repelling King is the eldest of three rhino spirit brothers in Azure Dragon Mountain. Named Cold-Repelling, Heat-Repelling, and Dust-Repelling, their horns each have special powers. After a thousand years of cultivation, their favorite hobby is... stealing lamp oil. Three rhinos sneaking around to steal oil is quite a mental image.'
    },
    {
        id: 'pishu_dawang', name: '辟暑大王', nameEn: 'Heat-Repelling King',
        emoji: '🦏', hp: 5, type: 'fire',
        attack: '🔥', attackName: '暑角烈焰', quips: ['大哥说得对！', '热不怕！', '角顶你！'],
        trait: '犀牛精三兄弟之二，犀角能辟暑',
        traitEn: 'The second rhino brother, his horn repels heat',
        story: '辟暑大王是犀牛精老二，他的犀角能辟暑。别看犀牛长得粗笨，人家修炼了上千年呢。他最崇拜大哥辟寒，大哥说什么他都跟着说"对对对"。三兄弟经常因为偷油的分配问题吵架——你多喝了一口，我少分了一盏，简直跟小朋友分糖果一样。',
        storyEn: 'Heat-Repelling King is the second rhino brother. Despite looking clumsy, he\'s trained for over a thousand years. He idolizes his big brother, agreeing with everything. The three brothers often argue over how to split stolen oil - "you took an extra sip!", "I got less!" - just like kids fighting over candy.'
    },
    {
        id: 'pichen_dawang', name: '辟尘大王', nameEn: 'Dust-Repelling King',
        emoji: '🦏', hp: 5, type: 'earth',
        attack: '🌍', attackName: '尘角震地', quips: ['两位哥哥威武！', '尘归尘土归土！', '冲啊！'],
        trait: '犀牛精三兄弟之三，犀角能辟尘',
        traitEn: 'The youngest rhino brother, his horn repels dust',
        story: '辟尘大王是犀牛精老三，也是三兄弟中最小最活泼的一个。他总是嚷嚷着要出去闯荡，结果每次都被两个哥哥拉回来。三兄弟没有任何神仙背景，所以结局也是最惨的——全部被打死。这告诉我们，在西游记的世界里，没后台的妖怪最好低调一点。',
        storyEn: 'Dust-Repelling King is the youngest and most energetic of the three rhino brothers. He always wants to go adventuring but gets dragged back by his brothers. With no divine patron backing them, all three met a grim end. The lesson: in the Journey to the West universe, demons without connections should keep a low profile.'
    },
    {
        id: 'xingxian', name: '杏仙', nameEn: 'Apricot Fairy',
        emoji: '🌸', hp: 4, type: 'light',
        attack: '🌺', attackName: '落英缤纷', quips: ['愿与先生谈诗~', '花开花落~', '好美的月色~'],
        trait: '荆棘岭杏树精，最温柔的妖精',
        traitEn: 'An apricot tree spirit, the gentlest demon of all',
        story: '杏仙是西游记里最特别的妖精——她不吃人、不打架，只想跟唐僧谈诗论道。她是荆棘岭上修炼千年的杏树精，长得美丽温柔，一开口就是诗词歌赋。她对唐僧一见钟情，可惜和尚不解风情。最后被八戒一钉耙打回了原形，让人不禁感叹：文艺女青年的恋爱之路真是坎坷啊。',
        storyEn: 'Apricot Fairy is Journey to the West\'s most unique demon - she doesn\'t eat people or fight, just wants to discuss poetry with Tang Monk. A thousand-year-old apricot tree spirit, beautiful and gentle, she fell in love with Tang Monk at first sight. But the monk didn\'t reciprocate. Pigsy smashed her back to tree form. The literary girl\'s love life is truly tragic.'
    },
    {
        id: 'shibagong', name: '十八公', nameEn: 'Old Eighteen Pine',
        emoji: '🌲', hp: 4, type: 'earth',
        attack: '🌿', attackName: '松针漫天', quips: ['来来来，品茗论道！', '禅心似月~', '老朽年迈，不胜酒力~'],
        trait: '荆棘岭松树精，名字暗藏"松"字',
        traitEn: 'A pine spirit whose name hides the character for "pine"',
        story: '十八公是荆棘岭的松树精，"十八公"三个字合起来就是"松"字——这是吴承恩先生玩的文字游戏。他是树精们的老大哥，最喜欢请人喝茶吟诗。他假扮土地公把唐僧请到木仙庵喝茶聊天，虽然动机不纯，但不得不说，这是西游记里最文雅的一次"绑架"了。',
        storyEn: 'Old Eighteen Pine is a pine tree spirit. "十八公" (shiba-gong) combines to form the character "松" (pine) - a wordplay by author Wu Cheng\'en. As the elder of the tree spirits, he loves hosting tea and poetry sessions. He disguised as a land god to invite Tang Monk for tea - probably the most civilized "kidnapping" in Journey to the West.'
    },
    {
        id: 'wansheng_gongzhu', name: '万圣公主', nameEn: 'Princess Wansheng',
        emoji: '👸', hp: 4, type: 'water',
        attack: '💧', attackName: '碧波龙卷', quips: ['父王会保护我！', '九头驸马最棒！', '碧波潭万岁！'],
        trait: '碧波潭龙王之女，嫁给了九头虫',
        traitEn: 'Dragon King Wansheng\'s daughter, married to Nine-Headed Bug',
        story: '万圣公主是碧波潭万圣龙王的女儿，嫁给了九头虫当驸马。她帮老公偷了祭赛国的佛宝舍利子，算是西游记里的"犯罪夫妻档"。不过说实话，她也挺可怜的——老公被砍了一个头跑了，再也没回来过。独守空房的龙宫公主，想想都心酸。',
        storyEn: 'Princess Wansheng is the daughter of Dragon King Wansheng, married to Nine-Headed Bug. She helped her husband steal Buddhist relics - a criminal couple. But she\'s quite pitiable too - her husband lost a head in battle and fled, never returning. A dragon princess left alone in her underwater palace... how sad.'
    },
    {
        id: 'lingxuzi', name: '凌虚子', nameEn: 'Void Walker',
        emoji: '🐺', hp: 4, type: 'wind',
        attack: '🌬️', attackName: '苍狼嚎月', quips: ['黑熊老兄请喝茶~', '贫道有礼了~', '嗷呜~'],
        trait: '黑风山苍狼精，黑熊精的好朋友',
        traitEn: 'A grey wolf spirit, Black Bear Spirit\'s best friend',
        story: '凌虚子是一只苍狼精，住在黑风山，和黑熊精是好朋友。他平时装扮成道士的模样，看起来仙风道骨。他最倒霉的一天就是去参加黑熊精的"佛衣会"——本来是去喝茶看袈裟的，结果遇上了孙悟空，成了第一个被打的。做妖怪，交朋友要谨慎啊。',
        storyEn: 'Void Walker is a grey wolf spirit on Black Wind Mountain, best friends with Black Bear Spirit. He usually dresses as a Taoist priest, looking quite refined. His worst day ever was attending Black Bear\'s "Kasaya Party" - he came for tea and to admire the robe, but ran into Wukong and became the first casualty. Lesson: choose your friends carefully.'
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
    },
    {
        id: 'saitaisui', name: '赛太岁', nameEn: 'Match-for-Heaven',
        emoji: '🦁', hp: 7, type: 'ancient',
        attack: '🔔', attackName: '紫金铃·三灾', quips: ['紫金铃在此！', '放火放烟放沙！', '观音也管不着我！'],
        trait: '观音菩萨的坐骑金毛犼，偷了紫金铃下凡',
        traitEn: 'Guanyin\'s mount, the Golden-Haired Hou, who stole the Purple-Gold Bells',
        story: '赛太岁原本是观音菩萨的坐骑金毛犼，趁着看管他的牧童打瞌睡，咬断铁索逃到凡间。他还顺手偷了太上老君的紫金铃——一个放火、一个放烟、一个放沙，三管齐下。他霸占了麒麟山的金圣宫娘娘，连孙悟空都被紫金铃搞得灰头土脸。最后观音亲自来收回了这只调皮的坐骑。',
        storyEn: 'Match-for-Heaven was Guanyin\'s mount, a Golden-Haired Hou who escaped when his keeper fell asleep. He also stole Laozi\'s Purple-Gold Bells - one shoots fire, one smoke, one sand. He kidnapped the Golden Saint Queen, and even Wukong struggled against the bells. Eventually Guanyin came personally to reclaim her naughty mount.'
    },
    {
        id: 'wansheng_longwang', name: '万圣龙王', nameEn: 'Dragon King Wansheng',
        emoji: '🐉', hp: 7, type: 'dragon',
        attack: '🌊', attackName: '碧波潭·龙王怒涛', quips: ['碧波潭万圣龙王在此！', '水淹三军！', '我女婿有九个头！'],
        trait: '碧波潭的龙王，九头虫的岳父大人',
        traitEn: 'Dragon King of Turquoise Wave Pool, Nine-Headed Bug\'s father-in-law',
        story: '万圣龙王住在碧波潭，是个有点爱面子的龙族。他最大的骄傲就是自己的女婿九头虫——毕竟有九个头嘛，走出去多有面子。他和女婿一起偷了祭赛国的佛宝舍利子，还用法术把金光寺变成了废墟。可惜最后全家被一锅端，女婿还跑了，可以说是赔了夫人又折兵。',
        storyEn: 'Dragon King Wansheng lives in Turquoise Wave Pool, a dragon who cares about face. His greatest pride is his nine-headed son-in-law. Together they stole Buddhist relics and ruined a temple. In the end, the whole family got busted while his son-in-law fled. Talk about losing everything.'
    },
    {
        id: 'tongbi_yuanhou', name: '通臂猿猴', nameEn: 'Long-Armed Ape',
        emoji: '🦧', hp: 7, type: 'fighting',
        attack: '💪', attackName: '通臂连环拳', quips: ['四大灵猴！', '我的手臂最长！', '拳拳到肉！'],
        trait: '混世四猴之一，知天时、识地利',
        traitEn: 'One of the Four Spirit Monkeys, knows heaven\'s timing and earth\'s advantage',
        story: '通臂猿猴是传说中的混世四猴之一。据如来佛祖说，天地间有四种特别的猴子：灵明石猴（孙悟空）、赤尻马猴、通臂猿猴和六耳猕猴。通臂猿猴最大的特点是手臂超长，能够一只手伸到东海，另一只手够到西海。它知天时、识地利、会变化，是猴界的战略大师。',
        storyEn: 'Long-Armed Ape is one of the legendary Four Spirit Monkeys. According to Buddha, there are four special monkeys: Spirit Stone Monkey (Wukong), Red-Butt Horse Monkey, Long-Armed Ape, and Six-Eared Macaque. His arms are incredibly long - one can reach the Eastern Sea while the other touches the Western Sea. He knows timing, terrain, and transformation - the strategic mastermind of the monkey world.'
    },
    {
        id: 'chikao_mahou', name: '赤尻马猴', nameEn: 'Red-Butt Horse Monkey',
        emoji: '🐵', hp: 6, type: 'fire',
        attack: '🔥', attackName: '赤焰猴拳', quips: ['别看我屁股！', '四大灵猴在此！', '火焰旋风！'],
        trait: '混世四猴之一，晓阴阳、会人事',
        traitEn: 'One of the Four Spirit Monkeys, understands yin-yang and human affairs',
        story: '赤尻马猴也是混世四猴之一，名字的意思是"红屁股的马猴"——是的，他的屁股是红色的。虽然名字听起来有点好笑，但可别小看他。他晓阴阳、会人事、善出入、避死延生，是四大灵猴中最懂得察言观色的一位。唯一的缺点就是每次别人第一眼都盯着他的屁股看。',
        storyEn: 'Red-Butt Horse Monkey is another of the Four Spirit Monkeys. Yes, his name means "red-bottomed horse monkey." Despite the funny name, don\'t underestimate him. He understands yin-yang, human affairs, and knows how to escape death. He\'s the most socially perceptive of the four. His only issue: everyone stares at his butt first.'
    },
    {
        id: 'shili_guai', name: '狮猁怪', nameEn: 'Lion-Lynx Spirit',
        emoji: '🦁', hp: 7, type: 'beast',
        attack: '⚡', attackName: '狮吼雷霆', quips: ['朕是国王！', '三年了谁也没发现！', '文殊不在家~'],
        trait: '文殊菩萨的坐骑，在乌鸡国冒充国王三年',
        traitEn: 'Manjusri\'s mount who impersonated a king for three years',
        story: '狮猁怪是文殊菩萨的坐骑青毛狮子。奉佛旨下凡，把乌鸡国国王推进井里，自己变成国王的模样，冒充了整整三年！三年里没有一个人发现异常——连皇后都没看出来。这演技，简直可以拿奥斯卡金像奖。最后被悟空识破，文殊菩萨赶来把他骑回去了。',
        storyEn: 'Lion-Lynx Spirit is Manjusri Bodhisattva\'s blue-maned lion mount. Under Buddha\'s orders, he pushed the King of Crow-Cock Kingdom into a well and impersonated him for three full years! Nobody noticed - not even the queen. That\'s Oscar-level acting. Wukong finally saw through the disguise, and Manjusri came to ride him home.'
    },
    {
        id: 'hongmang_jing', name: '红蟒精', nameEn: 'Red Python Monster',
        emoji: '🐍', hp: 6, type: 'poison',
        attack: '☠️', attackName: '蟒毒喷雾', quips: ['嘶嘶嘶！', '这条路我说了算！', '缠！'],
        trait: '驼罗庄的巨蟒，毒气能覆盖整座山',
        traitEn: 'A giant python whose venom covers an entire mountain',
        story: '红蟒精盘踞在驼罗庄附近的大山上，是一条浑身赤红的巨蟒。它最厉害的不是力气，而是一身的毒气——毒雾一喷，方圆几里寸草不生。当地老百姓苦不堪言，只能每年献祭牛羊求它别下山。后来悟空和八戒联手，费了好大一番功夫才把它收拾掉。',
        storyEn: 'Red Python Monster coils around the mountains near Camel Village, a massive crimson serpent. Its most dangerous ability isn\'t strength but venom - one spray of poisonous mist kills everything within miles. Villagers had to sacrifice cattle annually to keep it away. Wukong and Pigsy had to team up to finally deal with it.'
    },
    {
        id: 'xueshi_jing', name: '雪狮精', nameEn: 'Snow Lion Spirit',
        emoji: '🦁', hp: 6, type: 'ice',
        attack: '❄️', attackName: '雪狮寒啸', quips: ['祖翁万岁！', '冻死你！', '雪花飘飘~'],
        trait: '九灵元圣弟子之一，通体雪白的狮子精',
        traitEn: 'One of Nine Spirits Sage\'s disciples, a pure white lion',
        story: '雪狮精是九灵元圣收的狮子弟子之一，全身雪白毛发，在阳光下亮得晃眼。它最擅长的是冰系攻击，吼一声就能让方圆十里下起大雪。它对祖翁九灵元圣忠心耿耿，听说黄狮精被欺负后第一个站出来要去报仇。可惜实力不够，最后还是要请祖翁出马。',
        storyEn: 'Snow Lion Spirit is one of Nine Spirits Sage\'s lion disciples, with snow-white fur that gleams in sunlight. Its specialty is ice attacks - one roar brings snowfall for miles. Extremely loyal to the Nine Spirits Sage, it was the first to volunteer for revenge when Yellow Lion was bullied. Sadly, it wasn\'t strong enough and had to call for backup.'
    },
    {
        id: 'suanni_jing', name: '狻猊精', nameEn: 'Suanni Spirit',
        emoji: '🔥', hp: 6, type: 'fire',
        attack: '🔥', attackName: '狻猊烈焰', quips: ['烟火缭绕！', '我最喜欢香火！', '燃烧吧！'],
        trait: '九灵元圣弟子之一，喜欢闻香火的狮子精',
        traitEn: 'A lion spirit who loves the smell of incense',
        story: '狻猊精也是九灵元圣的弟子之一。传说狻猊喜烟好坐，所以佛座上和香炉上经常能看到狻猊的形象。它最大的爱好就是趴在香炉旁边闻香——别的妖怪修炼打坐，它修炼闻香。久而久之，它自己身上也充满了檀香味，走到哪儿哪儿就像寺庙。',
        storyEn: 'Suanni Spirit is another disciple of Nine Spirits Sage. Legend says Suanni loves smoke and sitting still, which is why its image appears on Buddhist thrones and incense burners. Its favorite hobby is sniffing incense by the burner. Other demons meditate; it meditates on scents. Over time, it developed a permanent sandalwood fragrance - everywhere it goes smells like a temple.'
    },
    {
        id: 'naoshi_jing', name: '猱狮精', nameEn: 'Nimble Lion Spirit',
        emoji: '🐒', hp: 6, type: 'beast',
        attack: '💨', attackName: '猱狮闪击', quips: ['快如闪电！', '抓不到我！', '嗖！'],
        trait: '九灵元圣弟子之一，身手最敏捷的狮子精',
        traitEn: 'The most agile of Nine Spirits Sage\'s lion disciples',
        story: '猱狮精是九灵元圣弟子中身手最敏捷的一位。"猱"本身就是一种身手灵活的猿猴，所以猱狮精结合了狮子的力量和猿猴的敏捷。它打起架来上蹿下跳，让人眼花缭乱。可惜再快也快不过筋斗云——悟空一个翻身就追上了它。',
        storyEn: 'Nimble Lion Spirit is the most agile among Nine Spirits Sage\'s disciples. "猱" means a nimble monkey, so this spirit combines a lion\'s power with a monkey\'s agility. It bounces around in battle so fast it\'s dizzying. But nothing outpaces Cloud Somersault - Wukong caught up with one flip.'
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
    },
    {
        id: 'jiao_mowang', name: '蛟魔王', nameEn: 'Flood Dragon King',
        emoji: '🐉', hp: 9, type: 'water',
        attack: '🌊', attackName: '覆海狂涛', quips: ['覆海大圣在此！', '翻江倒海！', '二哥来也！'],
        trait: '七大圣之二·覆海大圣，翻江倒海的蛟龙',
        traitEn: 'The 2nd Great Sage - Sea-Overturning, a mighty flood dragon',
        story: '蛟魔王是七大圣中排行第二的覆海大圣，本体是一条威猛的蛟龙。当年孙悟空在花果山广交英豪，蛟魔王是第一批响应的妖王。他的绝技是翻江倒海——字面意义上的翻江倒海，一甩尾巴就能掀起滔天巨浪。悟空被压五指山后，蛟魔王便消失了踪迹，有传言说他化身为九头虫继续在碧波潭兴风作浪。',
        storyEn: 'Flood Dragon King is the 2nd of the Seven Great Sages - the Sea-Overturning Great Sage. A mighty flood dragon, he was among the first to ally with Wukong at Flower Fruit Mountain. His specialty is literally overturning seas - one tail whip creates tsunami-level waves. After Wukong was sealed under Five-Finger Mountain, he vanished. Some say he became the Nine-Headed Bug at Turquoise Wave Pool.'
    },
    {
        id: 'peng_mowang', name: '鹏魔王', nameEn: 'Roc Demon King',
        emoji: '🦅', hp: 9, type: 'wind',
        attack: '🌪️', attackName: '混天鹏翼', quips: ['混天大圣驾到！', '遮天蔽日！', '三哥展翅！'],
        trait: '七大圣之三·混天大圣，遮天蔽日的大鹏',
        traitEn: 'The 3rd Great Sage - Sky-Mingling, a sky-darkening roc',
        story: '鹏魔王是七大圣中排行第三的混天大圣，本体是一只巨大的鹏鸟。他展翅一飞就能遮天蔽日，让整个天空都暗下来。有学者认为鹏魔王就是后来在狮驼岭称霸的大鹏金翅雕——毕竟都是鹏嘛。如果这个推测是对的，那他可是七大圣中结局最好的一位——跟着如来佛祖混，吃喝不愁。',
        storyEn: 'Roc Demon King is the 3rd of the Seven Great Sages - the Sky-Mingling Great Sage. His true form is a massive roc that darkens the sky with its wingspan. Scholars theorize he later became the Golden-Winged Roc of Lion Camel Ridge. If true, he has the best ending among the seven - cushy retirement serving Buddha, with guaranteed meals.'
    },
    {
        id: 'shituo_wang', name: '狮驼王', nameEn: 'Lion Camel King',
        emoji: '🦁', hp: 9, type: 'earth',
        attack: '💥', attackName: '移山大力', quips: ['移山大圣！', '山岳为我所动！', '四哥最强！'],
        trait: '七大圣之四·移山大圣，力拔山兮气盖世',
        traitEn: 'The 4th Great Sage - Mountain-Mover, with earth-shattering strength',
        story: '狮驼王是七大圣中排行第四的移山大圣，本体是一头巨大的狮子。顾名思义，他最厉害的本事就是能移山——不是比喻，是真的能把一座山从这边搬到那边。有人认为他就是后来狮驼岭的青狮精（文殊菩萨的坐骑），也有人认为他们是不同的狮子。无论如何，在七大圣中，论蛮力他绝对是前三名。',
        storyEn: 'Lion Camel King is the 4th Great Sage - the Mountain-Moving Great Sage. His true form is a colossal lion with the literal ability to move mountains. Some believe he became the Green Lion Spirit of Lion Camel Ridge (Manjusri\'s mount), others think they\'re different lions. Either way, in terms of brute strength, he\'s easily top three among the Seven Great Sages.'
    },
    {
        id: 'mihou_wang', name: '猕猴王', nameEn: 'Macaque Demon King',
        emoji: '🐒', hp: 9, type: 'psychic',
        attack: '🔮', attackName: '通风幻术', quips: ['通风大圣！', '风中有我的眼睛！', '五哥看穿一切！'],
        trait: '七大圣之五·通风大圣，神出鬼没的猕猴',
        traitEn: 'The 5th Great Sage - Wind-Chaser, an elusive macaque king',
        story: '猕猴王是七大圣中排行第五的通风大圣。"通风"意味着来去飘忽、神出鬼没，他是七大圣中最神秘的一位。有人猜测他就是后来的六耳猕猴——那个能完美模仿孙悟空的神秘存在。如果是的话，那他可能是唯一一个差点取代主角的妖怪。不管真假，他的情报能力在妖界绝对是顶级的。',
        storyEn: 'Macaque Demon King is the 5th Great Sage - the Wind-Chasing Great Sage. "Wind-Chaser" means elusive and unpredictable. He\'s the most mysterious of the seven. Many speculate he\'s the Six-Eared Macaque who perfectly mimicked Wukong. If so, he\'s the only demon who almost replaced the protagonist. Regardless, his intelligence-gathering skills are unmatched in the demon world.'
    },
    {
        id: 'yurong_wang', name: '禺狨王', nameEn: 'Golden Snub-Nose King',
        emoji: '🐵', hp: 9, type: 'spirit',
        attack: '⚡', attackName: '驱神·万灵退散', quips: ['驱神大圣！', '神仙也得让路！', '六哥出手！'],
        trait: '七大圣之六·驱神大圣，连神仙都要退避三舍',
        traitEn: 'The 6th Great Sage - God-Driver, even deities step aside for him',
        story: '禺狨王是七大圣中排行第六的驱神大圣，本体是一只金丝猴。他的称号最霸气——"驱神"，意思是连神仙都要被他赶跑。虽然在原著中他只出现了名字，但光凭这个称号就足以让所有神仙闻风丧胆。他是七大圣中唯一以金丝猴为本体的，也被认为是猴族中最尊贵的存在之一。悟空排行第七，但论霸气，六哥也不遑多让。',
        storyEn: 'Golden Snub-Nose King is the 6th Great Sage - the God-Driving Great Sage. His true form is a golden snub-nosed monkey. His title is the most fearsome - "God-Driver" means even deities flee before him. Though he only appears by name in the novel, that title alone is enough to terrify immortals. As the only golden monkey among the seven, he\'s considered one of the most noble in the monkey kingdom. Wukong ranks 7th, but in sheer intimidation, Number Six holds his own.'
    }
];
