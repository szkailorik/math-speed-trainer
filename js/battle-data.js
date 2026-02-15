/**
 * battle-data.js - BattleMode object definition + monster/item/weapon data
 */

const BattleMode = {
    // ===== 宝可梦风格怪兽 - 有点恐怖又有点可爱 =====
    // 参考宝可梦的命名风格和角色设计

    // 初级怪兽（简单模式用）- HP 3-4
    easyMonsters: [
        // 幽灵可爱系
        {
            id: 'pupu_ghost', name: '噗噗鬼', nameEn: 'Pupu Ghost', emoji: '👻', hp: 3, type: 'ghost',
            attack: '👅', attackName: '舔舔攻击', quips: ['噗噗~', '舔舔你~', '嘻嘻嘻!'],
            trait: '喜欢恶作剧的小幽灵', traitEn: 'A mischievous little ghost who loves pranks',
            story: '噗噗鬼是数学世界里最可爱的小幽灵。它总是躲在算式后面，等小朋友一答对题目就开心地跳出来说"噗噗"！据说它最怕的就是乘法表背得特别熟的小朋友。',
            storyEn: 'Pupu Ghost is the cutest little ghost in Math World. It always hides behind equations and happily jumps out saying "Pupu" when kids answer correctly! Legend says it fears children who have memorized their times tables.'
        },
        {
            id: 'blinky', name: '眨眨眼', nameEn: 'Blinky', emoji: '👁️', hp: 3, type: 'psychic',
            attack: '💫', attackName: '瞪眼术', quips: ['看着你~', '眨眨~', '盯——'],
            trait: '能看穿一切的神秘眼睛', traitEn: 'A mysterious eye that sees everything',
            story: '眨眨眼其实是一只害羞的小妖怪。它用大眼睛盯着你看，其实只是想交朋友！当你做对数学题时，它会开心地眨眨眼表示称赞。',
            storyEn: 'Blinky is actually a shy little monster. When it stares at you with its big eye, it just wants to make friends! It blinks happily to praise you when you solve math problems correctly.'
        },
        {
            id: 'shadow_kid', name: '小黑影', nameEn: 'Shadow Kid', emoji: '🫥', hp: 3, type: 'dark',
            attack: '🖤', attackName: '影子偷袭', quips: ['嘿嘿~', '找不到我~', '在这里!'],
            trait: '爱玩捉迷藏的影子精灵', traitEn: 'A shadow spirit who loves hide and seek',
            story: '小黑影住在每个人的影子里。它最喜欢在你做数学题时偷偷出来玩。如果你算得又快又准，它就会害羞地躲回影子里，因为它觉得你太厉害了！',
            storyEn: 'Shadow Kid lives in everyone\'s shadow. It loves to come out and play when you\'re doing math. If you calculate fast and accurately, it shyly hides back in your shadow because it thinks you\'re amazing!'
        },
        {
            id: 'fortune_ball', name: '咕噜球', nameEn: 'Fortune Ball', emoji: '🔮', hp: 4, type: 'psychic',
            attack: '✨', attackName: '神秘光线', quips: ['咕噜噜~', '预言中...', '命运呀~'],
            trait: '能预测答案的水晶球', traitEn: 'A crystal ball that predicts answers',
            story: '咕噜球是一个会预言的小水晶球妖怪。它总是说"我看到你的未来...你会算对这道题！"虽然有时候预言不太准，但它的鼓励总能给小朋友信心。',
            storyEn: 'Fortune Ball is a fortune-telling crystal ball monster. It always says "I see your future... you will solve this problem!" Though its predictions aren\'t always accurate, its encouragement gives kids confidence.'
        },
        // 毒系可爱
        {
            id: 'toxic_shroom', name: '毒毒菇', nameEn: 'Toxic Shroom', emoji: '🍄', hp: 3, type: 'poison',
            attack: '☁️', attackName: '毒孢子', quips: ['毒毒~', '别吃我!', '孢子喷!'],
            trait: '颜色鲜艳但心地善良', traitEn: 'Colorful but kind-hearted',
            story: '毒毒菇看起来很危险，但其实它的"毒"只是让人打喷嚏而已。它住在数学森林里，用彩色的帽子吸引小朋友来做算术题。答对了就能摘到美味的无毒小蘑菇当奖励！',
            storyEn: 'Toxic Shroom looks dangerous, but its "poison" only makes you sneeze. Living in Math Forest, it uses its colorful cap to attract kids to do arithmetic. Answer correctly and you can pick delicious non-toxic mushrooms as a reward!'
        },
        {
            id: 'hissy', name: '嘶嘶蛇', nameEn: 'Hissy', emoji: '🐍', hp: 4, type: 'poison',
            attack: '💜', attackName: '毒牙咬', quips: ['嘶嘶~', '咬一口~', '毒毒哒!'],
            trait: '其实很怕冷的小蛇', traitEn: 'A little snake that\'s actually afraid of cold',
            story: '嘶嘶蛇喜欢用身体摆出数字的形状。它最拿手的就是摆出"8"，因为那是它盘起来睡觉的姿势！冬天的时候它会请求小朋友多做几道题，用脑袋发热来给它取暖。',
            storyEn: 'Hissy loves to shape numbers with its body. It\'s best at making "8" because that\'s how it curls up to sleep! In winter, it asks kids to solve more problems so the heat from thinking can keep it warm.'
        },
        {
            id: 'stinky_flower', name: '臭臭花', nameEn: 'Stinky Flower', emoji: '🌸', hp: 3, type: 'poison',
            attack: '💨', attackName: '臭气弹', quips: ['臭臭~', '闻闻看~', '香香的?'],
            trait: '以为自己很香的小花', traitEn: 'A flower that thinks it smells nice',
            story: '臭臭花一直以为自己是世界上最香的花。每次放出"香气"时都很得意，完全不知道大家都在捂鼻子。但只要你答对题目，它就会收起臭气，送你一朵真正香香的小花！',
            storyEn: 'Stinky Flower always thinks it\'s the most fragrant flower in the world. It\'s proud when releasing its "perfume," not knowing everyone is holding their noses. But answer correctly, and it gives you a truly fragrant flower!'
        },
        // 火系小怪
        {
            id: 'puff_flame', name: '呼呼焰', nameEn: 'Puff Flame', emoji: '🔥', hp: 3, type: 'fire',
            attack: '✨', attackName: '火星溅', quips: ['呼呼~', '烫烫!', '着火啦!'],
            trait: '一激动就冒火星', traitEn: 'Sparks fly when excited',
            story: '呼呼焰是从计算器里蹦出来的小火苗。当小朋友按计算器按得太快时，它就会被"算"出来！它最喜欢9×9=81这道题，因为答案让它感觉暖暖的。',
            storyEn: 'Puff Flame is a little flame that bounced out of a calculator. When kids press calculator buttons too fast, it gets "calculated" out! Its favorite is 9×9=81 because the answer makes it feel warm.'
        },
        {
            id: 'fire_monkey', name: '烈烈猴', nameEn: 'Fire Monkey', emoji: '🐒', hp: 4, type: 'fire',
            attack: '🔥', attackName: '火焰拳', quips: ['吱吱!', '猴拳!', '跳跳烧!'],
            trait: '永远充满活力的火猴', traitEn: 'An energetic fire monkey',
            story: '烈烈猴一刻也停不下来，它用跳来跳去消耗身上的火焰能量。如果不动就会越来越热！它发明了"火焰算术操"，边跳边背乘法表，现在已经是数学体操冠军了。',
            storyEn: 'Fire Monkey can\'t stop moving - it jumps around to burn off its flame energy. If it stops, it gets hotter! It invented "Flame Math Exercise," doing multiplication while jumping, and is now the Math Gymnastics champion.'
        },
        // 水系小怪
        {
            id: 'bubbles', name: '泡泡怪', nameEn: 'Bubbles', emoji: '🫧', hp: 3, type: 'water',
            attack: '💦', attackName: '泡泡攻击', quips: ['泡泡~', '咕噜噜~', '湿湿的!'],
            trait: '住在泡泡里的小精灵', traitEn: 'A sprite living in bubbles',
            story: '泡泡怪住在一个永远不会破的魔法泡泡里。它喜欢把数学题写在泡泡上飘给小朋友。如果你算对了，它会开心地吹出彩虹泡泡作为奖励！',
            storyEn: 'Bubbles lives in a magic bubble that never pops. It loves writing math problems on bubbles and floating them to kids. Answer correctly, and it happily blows rainbow bubbles as a reward!'
        },
        {
            id: 'inky', name: '墨墨鱼', nameEn: 'Inky', emoji: '🦑', hp: 4, type: 'water',
            attack: '🖤', attackName: '墨汁喷射', quips: ['喷喷~', '墨墨黑~', '缠住你!'],
            trait: '用墨汁写字的小章鱼', traitEn: 'A squid that writes with ink',
            story: '墨墨鱼有八只触手，可以同时写八道算式！它是海底学校的数学老师，用自己的墨汁当墨水。据说它喷出的特殊墨汁写的答案永远不会错。',
            storyEn: 'Inky has eight tentacles that can write eight equations at once! It\'s a math teacher at the underwater school, using its own ink. Legend says answers written with its special ink are never wrong.'
        },
        // 恐怖可爱混合
        {
            id: 'fang_monster', name: '牙牙怪', nameEn: 'Fang Monster', emoji: '👹', hp: 4, type: 'dark',
            attack: '🦷', attackName: '獠牙撕咬', quips: ['嘿嘿~', '牙痒痒~', '咬咬!'],
            trait: '其实是素食主义者', traitEn: 'Actually a vegetarian',
            story: '牙牙怪有着吓人的大獠牙，但其实它只吃蔬菜！那些大牙齿是用来嚼胡萝卜的。它装凶只是想提醒小朋友："要像我咬蔬菜一样，一口一口「咬」掉数学题！"',
            storyEn: 'Fang Monster has scary big fangs, but actually only eats vegetables! Those big teeth are for chewing carrots. It acts fierce to remind kids: "Bite through math problems like I bite vegetables - one bite at a time!"'
        },
        {
            id: 'bone_boy', name: '骨骨仔', nameEn: 'Bone Boy', emoji: '💀', hp: 3, type: 'ghost',
            attack: '🦴', attackName: '骨头飞', quips: ['咔咔~', '骨头响~', '接骨头!'],
            trait: '爱跳骨头舞的小骷髅', traitEn: 'A skeleton who loves bone dancing',
            story: '骨骨仔是个爱跳舞的小骷髅。它的骨头可以拆下来拼成数字！它最喜欢的游戏是用骨头拼出算式答案，但有时候会把自己拼错，变成奇怪的形状，逗得大家哈哈大笑。',
            storyEn: 'Bone Boy is a dancing skeleton. Its bones can be removed and arranged into numbers! Its favorite game is spelling answers with bones, but sometimes it arranges itself wrong into funny shapes, making everyone laugh.'
        },
        {
            id: 'batty', name: '蝙蝙侠', nameEn: 'Batty', emoji: '🦇', hp: 4, type: 'flying',
            attack: '🔊', attackName: '超声尖叫', quips: ['吱吱~', '黑夜来~', '听到了吗?'],
            trait: '喜欢倒挂着做题', traitEn: 'Likes to solve problems upside down',
            story: '蝙蝙侠总是倒挂着，所以它看数字都是反的！6变成9，9变成6。这让它做乘法时总是搞混。但正因为如此，它发明了"倒立数学法"，帮助小朋友记住6和9的区别。',
            storyEn: 'Batty always hangs upside down, so it sees numbers reversed! 6 becomes 9, 9 becomes 6. This confuses its multiplication. But because of this, it invented "Upside-Down Math" to help kids tell 6 and 9 apart.'
        },
        {
            id: 'weird_ball', name: '怪怪球', nameEn: 'Weird Ball', emoji: '👾', hp: 3, type: 'normal',
            attack: '💫', attackName: '怪异冲撞', quips: ['哔哔~', '外星来的~', '变形!'],
            trait: '来自外星的数学迷', traitEn: 'A math fan from outer space',
            story: '怪怪球是从外星来地球学习"地球数学"的小外星人。在它的星球上，1+1=3！所以它来地球重新学习数学。现在它已经是九九乘法表的专家了，经常发信息回母星分享学习心得。',
            storyEn: 'Weird Ball is an alien who came to Earth to learn "Earth Math." On its planet, 1+1=3! So it came to relearn math. Now it\'s an expert at times tables and often sends messages home sharing what it learned.'
        },
        // v15.0 新增怪兽
        {
            id: 'moji_cat', name: '墨迹猫', emoji: '🐱', hp: 3, type: 'psychic',
            attack: '🐾', attackName: '墨爪印', quips: ['喵~', '我来涂鸦~', '墨墨哒!'],
            behaviors: ['dodge', 'taunt'],
            tauntQuips: ['喵哈哈~你好笨!', '这都算不对?', '猫猫看不起你~'],
            enterQuips: ['喵~墨迹猫参上!', '准备被我涂黑吧!'],
            deathQuips: ['喵...被擦掉了...', '我的墨水...'],
            trait: '用墨水作画的淘气猫', traitEn: 'A naughty cat that paints with ink',
            story: '墨迹猫全身黑乎乎的，走到哪里都会留下墨水脚印。它最喜欢在数学作业上涂鸦，把算式变成有趣的图画。',
            storyEn: 'Ink Cat is all black and leaves inky pawprints everywhere. It loves doodling on math homework, turning equations into fun drawings.'
        },
        {
            id: 'bubble_frog', name: '泡泡蛙', emoji: '🐸', hp: 4, type: 'water',
            attack: '🫧', attackName: '泡泡弹', quips: ['呱呱~', '泡泡攻击!', '吹泡泡~'],
            behaviors: ['dodge', 'escape'],
            escapeQuips: ['呱!溜了溜了~', '水里见!'],
            enterQuips: ['呱呱~泡泡蛙来啦!', '吹泡泡咯!'],
            deathQuips: ['泡泡...破了...', '呱呜...'],
            trait: '爱吹泡泡的小青蛙', traitEn: 'A little frog that loves blowing bubbles',
            story: '泡泡蛙住在九九潭里，它能吹出装着数字的泡泡。如果你能算对泡泡里的算式，泡泡就会变成彩虹色！',
            storyEn: 'Bubble Frog lives in Times Pond, blowing bubbles filled with numbers. If you solve the equation in a bubble, it turns rainbow-colored!'
        },
        // v16.0 新增怪兽
        {
            id: 'suan_shu_tu', name: '算术兔', emoji: '🐰', hp: 3, type: 'normal',
            difficulty: 'easy',
            personality: 'timid',
            story: '算术兔是九九乘法表世界里最胆小的小妖怪。它总是躲在算式后面偷偷看小朋友做题，一旦被发现就会"噗"地分裂成两只更小的兔子逃跑。据说它的耳朵能接收到正确答案的电波，但因为太害羞了从来不告诉别人。',
            enterQuips: ['哇...好多人...算术兔好害怕...', '请...请不要看我...'],
            deathQuips: ['呜呜...算术兔要消失了...', '再见...希望下次能更勇敢...'],
            tauntQuips: ['你...你别过来...', '算术兔虽然害怕...但不会认输的...'],
            fearQuips: ['太可怕了！算术兔要分裂逃跑了！', '救命！好厉害的连击！'],
            behaviors: ['split'],
            attackEmoji: '🥕'
        },
        {
            id: 'gui_ji_shu', name: '诡计鼠', emoji: '🐭', hp: 3, type: 'dark',
            difficulty: 'easy',
            personality: 'cunning',
            story: '诡计鼠住在数学迷宫的最深处，它的小眼睛滴溜溜转，脑子里全是花花肠子。它最喜欢在算式里偷偷把数字换掉，让小朋友算错。不过只要你算得够快，它就来不及做手脚，只能灰溜溜地躲开。',
            enterQuips: ['嘿嘿嘿~诡计鼠来啦！', '让我看看谁会上当~'],
            deathQuips: ['可恶...我的诡计失败了...', '下次一定能骗到你！'],
            tauntQuips: ['嘻嘻，你猜这个答案对不对~', '上当了吧？哈哈！'],
            fearQuips: ['怎么可能算这么快！', '我...我的诡计没用了！'],
            behaviors: ['dodge'],
            attackEmoji: '🧀'
        },
    ],

    // 中级怪兽（普通模式用）- HP 4-6
    normalMonsters: [
        // 幽灵恐怖系
        {
            id: 'ghost_lantern', name: '幽幽灯', nameEn: 'Ghost Lantern', emoji: '🕯️', hp: 4, type: 'ghost',
            attack: '🔥', attackName: '鬼火焚烧', quips: ['幽幽~', '灵魂之火~', '别吹灭!'],
            trait: '照亮黑暗中的数学题', traitEn: 'Illuminates math problems in the dark',
            story: '幽幽灯是由100根用完的铅笔变成的。这些铅笔都曾被小朋友用来做数学作业，写完最后一个字就化作幽幽灯的火焰。它的光能让任何隐藏的数学题显形。',
            storyEn: 'Ghost Lantern formed from 100 used-up pencils. These pencils were all used by kids for math homework, becoming flames after writing their last word. Its light can reveal any hidden math problem.'
        },
        {
            id: 'pumpkin_king', name: '南瓜王', nameEn: 'Pumpkin King', emoji: '🎃', hp: 5, type: 'ghost',
            attack: '🔮', attackName: '暗影球', quips: ['嘿嘿~', '万圣节到!', '南瓜炸弹!'],
            trait: '万圣节数学派对主持人', traitEn: 'Host of the Halloween Math Party',
            story: '每年万圣节，南瓜王都会举办数学派对。它会在南瓜里塞满糖果，只要答对乘法题就能拿一颗！它的头可以摘下来当计算器用，按它的鼻子就会显示答案。',
            storyEn: 'Every Halloween, Pumpkin King hosts a math party. It fills pumpkins with candy - solve multiplication problems to get one! Its head can be removed and used as a calculator - press its nose to show the answer.'
        },
        {
            id: 'curse_doll', name: '咒咒娃', nameEn: 'Curse Doll', emoji: '🪆', hp: 5, type: 'ghost',
            attack: '📍', attackName: '诅咒针', quips: ['咒咒~', '戳戳你~', '痛不痛?'],
            trait: '被遗弃的玩具变成的妖怪', traitEn: 'A monster from an abandoned toy',
            story: '咒咒娃原本是一个被遗忘在阁楼里的套娃。它太孤单了，就学会了数学来打发时间。现在它会用"诅咒"帮助粗心的小朋友——如果你计算错误，它会让你的手"不由自主"地写出正确答案！',
            storyEn: 'Curse Doll was a nesting doll forgotten in an attic. So lonely, it learned math to pass time. Now it uses "curses" to help careless kids - if you calculate wrong, it makes your hand "involuntarily" write the correct answer!'
        },
        {
            id: 'night_owl', name: '夜哭鸟', nameEn: 'Night Owl', emoji: '🦉', hp: 4, type: 'ghost',
            attack: '🌙', attackName: '夜啼', quips: ['咕咕~', '夜深了~', '失眠吧!'],
            trait: '专门守护夜间学习的猫头鹰', traitEn: 'An owl guarding night study sessions',
            story: '夜哭鸟是所有熬夜做作业的小朋友的守护神。它的叫声听起来很吓人，但其实是在提醒："太晚了，明天再做！"如果你非要熬夜，它会陪着你，用咕咕声报出正确答案。',
            storyEn: 'Night Owl is the guardian of all kids doing late-night homework. Its cry sounds scary but actually reminds you: "Too late, do it tomorrow!" If you must stay up, it keeps you company, hooting out correct answers.'
        },
        // 毒系恐怖
        {
            id: 'toxic_slime', name: '毒液怪', nameEn: 'Toxic Slime', emoji: '🧪', hp: 5, type: 'poison',
            attack: '💜', attackName: '腐蚀液', quips: ['滋滋~', '溶解你~', '酸酸的!'],
            trait: '能溶解错误答案', traitEn: 'Can dissolve wrong answers',
            story: '毒液怪是从化学实验室逃出来的实验品。它的液体只会溶解写错的答案，正确答案反而会变得更清晰！很多小朋友都偷偷请它帮忙检查作业。',
            storyEn: 'Toxic Slime escaped from a chemistry lab. Its liquid only dissolves wrong answers while making correct ones clearer! Many kids secretly ask it to check their homework.'
        },
        {
            id: 'spider_lady', name: '蜘蛛娘', nameEn: 'Spider Lady', emoji: '🕷️', hp: 5, type: 'bug',
            attack: '🕸️', attackName: '蛛网陷阱', quips: ['丝丝~', '网住你~', '逃不掉!'],
            trait: '用蛛丝编织知识网', traitEn: 'Weaves knowledge webs with silk',
            story: '蜘蛛娘用银色的蛛丝编织"知识网"。每当小朋友学会新的数学知识，她就在网上加一根新丝线。她说学得越多，网就越大越美丽，还能用来接住从天上掉下来的灵感！',
            storyEn: 'Spider Lady weaves "knowledge webs" with silver silk. When kids learn new math, she adds a new thread. She says the more you learn, the bigger and more beautiful the web becomes, and it can catch inspiration falling from the sky!'
        },
        {
            id: 'nightmare_beast', name: '噩梦兽', nameEn: 'Nightmare Beast', emoji: '😱', hp: 5, type: 'dark',
            attack: '💭', attackName: '恐惧波', quips: ['怕怕~', '做噩梦~', '哈哈哈!'],
            trait: '吃掉数学恐惧的怪兽', traitEn: 'A monster that eats math fear',
            story: '噩梦兽其实是个好妖怪！它专门吃小朋友对数学的恐惧。每当有人害怕数学考试，它就会出现把恐惧吃掉。吃完后它会打个大大的嗝，然后你就会觉得数学其实很有趣！',
            storyEn: 'Nightmare Beast is actually a good monster! It eats kids\' fear of math. When someone fears a math test, it appears to eat that fear. After eating, it burps loudly, and you\'ll find math is actually fun!'
        },
        // 冰系恐怖
        {
            id: 'ice_spirit', name: '冰魂灵', nameEn: 'Ice Spirit', emoji: '🥶', hp: 4, type: 'ice',
            attack: '❄️', attackName: '冰冻吐息', quips: ['冷冷~', '冻僵吧~', '好冰!'],
            trait: '来自北极的数学精灵', traitEn: 'A math spirit from the Arctic',
            story: '冰魂灵来自北极，身体由永不融化的魔法冰晶组成。它最喜欢把数学题冻在冰块里，让小朋友用脑袋的热量把冰融化来看题目。它说这样可以让大脑"热身"！',
            storyEn: 'Ice Spirit is from the Arctic, made of magic ice that never melts. It loves freezing math problems in ice blocks, letting kids melt them with brain heat to see the problems. It says this "warms up" the brain!'
        },
        {
            id: 'snow_fairy', name: '雪妖精', nameEn: 'Snow Fairy', emoji: '⛄', hp: 5, type: 'ice',
            attack: '🌨️', attackName: '暴风雪', quips: ['飘飘~', '雪花飞~', '白茫茫!'],
            trait: '用雪花写字的妖精', traitEn: 'A fairy that writes with snowflakes',
            story: '雪妖精可以控制每一片雪花的形状。它把数学公式写在雪花上从天上飘下来，整个冬天都像是一场"数学雪"。收集够100片公式雪花，就能堆出一个会说话的智慧雪人！',
            storyEn: 'Snow Fairy controls each snowflake\'s shape. It writes math formulas on snowflakes that float down from the sky, making winter a "math snow." Collect 100 formula snowflakes to build a talking wisdom snowman!'
        },
        // 格斗恶系
        {
            id: 'fury_fist', name: '怒怒拳', nameEn: 'Fury Fist', emoji: '👊', hp: 5, type: 'fighting',
            attack: '💢', attackName: '愤怒连击', quips: ['嘿哈!', '生气了!', '揍你!'],
            trait: '越算越有力气', traitEn: 'Gets stronger with each calculation',
            story: '怒怒拳是个超级热血的小妖怪。它相信"数学就是力量"！每算对一道题，它的拳头就会变大一点。它的梦想是算够10000道题，那时候它的拳头就能打碎小行星！',
            storyEn: 'Fury Fist is a super passionate little monster. It believes "Math is Power!" With each correct answer, its fists grow bigger. Its dream is to solve 10,000 problems - then its fists can smash asteroids!'
        },
        {
            id: 'shadow_ninja', name: '影忍者', nameEn: 'Shadow Ninja', emoji: '🥷', hp: 5, type: 'dark',
            attack: '🗡️', attackName: '暗影斩', quips: ['嘘...', '无声无息~', '背后!'],
            trait: '来无影去无踪的数学高手', traitEn: 'A math master who comes and goes silently',
            story: '影忍者是数学忍者学院的优等生。它可以在0.1秒内算出任何乘法，然后消失在影子里。它教导小朋友："速算就像忍术，要快、准、狠！"',
            storyEn: 'Shadow Ninja is a top student at the Math Ninja Academy. It can calculate any multiplication in 0.1 seconds, then vanish into shadows. It teaches kids: "Speed math is like ninjutsu - fast, accurate, and decisive!"'
        },
        // 岩石系
        {
            id: 'stone_face', name: '石头精', nameEn: 'Stone Face', emoji: '🗿', hp: 6, type: 'rock',
            attack: '💥', attackName: '岩石崩', quips: ['石头脸~', '硬邦邦~', '砸!'],
            trait: '世界上最有耐心的老师', traitEn: 'The most patient teacher in the world',
            story: '石头精已经在数学山上站了一万年，见证了无数小朋友学习数学。它的表情永远不变，因为它知道：学数学需要耐心，就像石头一样稳定。它会一直等到你算出正确答案。',
            storyEn: 'Stone Face has stood on Math Mountain for 10,000 years, witnessing countless kids learn math. Its expression never changes because it knows: learning math needs patience, stable like stone. It will wait until you find the correct answer.'
        },
        {
            id: 'diamond_beast', name: '钻石兽', nameEn: 'Diamond Beast', emoji: '💎', hp: 5, type: 'rock',
            attack: '✨', attackName: '钻石风暴', quips: ['闪闪~', '最硬的~', '切割!'],
            trait: '全身由正确答案组成', traitEn: 'Made entirely of correct answers',
            story: '钻石兽的身体是由无数正确答案结晶而成的。每个闪亮的切面都刻着一道算式。据说集齐它身上所有的算式，就能获得"数学之心"——永远不会算错的神奇能力！',
            storyEn: 'Diamond Beast\'s body crystallized from countless correct answers. Each shiny facet has an equation carved in it. Legend says collecting all its equations grants the "Math Heart" - the magical ability to never calculate wrong!'
        },
        // 电系
        {
            id: 'thunder_mouse', name: '雷雷鼠', nameEn: 'Thunder Mouse', emoji: '🐭', hp: 4, type: 'electric',
            attack: '⚡', attackName: '十万伏特', quips: ['嗞嗞~', '来电了~', '麻麻!'],
            trait: '用电流传递知识', traitEn: 'Transmits knowledge through electricity',
            story: '雷雷鼠的胡须能接收"知识电波"。当它的脸颊发光时，就是在给你发送答案提示！但要小心，如果你不认真听，它会轻轻电你一下，让你的头发竖起来提醒你专心。',
            storyEn: 'Thunder Mouse\'s whiskers receive "knowledge waves." When its cheeks glow, it\'s sending you answer hints! But be careful - if you don\'t pay attention, it gives a little zap to make your hair stand up as a reminder to focus.'
        },
        {
            id: 'electric_demon', name: '电鬼怪', nameEn: 'Electric Demon', emoji: '👿', hp: 5, type: 'electric',
            attack: '💛', attackName: '雷电冲击', quips: ['嘿嘿~', '电死你~', '滋滋滋!'],
            trait: '住在插座里的小恶魔', traitEn: 'A little demon living in power outlets',
            story: '电鬼怪住在家里的插座中，它喜欢在小朋友用计算器时偷偷帮忙。如果你按错了数字，它会故意让计算器短路，逼你用脑子算。它说："要相信自己的大脑，不是计算器！"',
            storyEn: 'Electric Demon lives in home outlets and loves helping when kids use calculators. If you press wrong numbers, it short-circuits the calculator, forcing you to use your brain. It says: "Trust your brain, not the calculator!"'
        },
        // 超能力
        {
            id: 'fortune_cat', name: '占卜猫', nameEn: 'Fortune Cat', emoji: '🐱', hp: 5, type: 'psychic',
            attack: '👁️', attackName: '预知未来', quips: ['喵~', '命运已定~', '逃不掉~'],
            trait: '能预见考试题目的神猫', traitEn: 'A mystical cat that foresees test questions',
            story: '占卜猫有九条命，每条命都用来学习不同的数学知识。它能预测第二天的数学考试会考什么，但它只会给你三个神秘的提示。据说认真思考提示的孩子都能考满分！',
            storyEn: 'Fortune Cat has nine lives, each used to learn different math. It can predict what\'s on tomorrow\'s test but gives only three mysterious hints. Legend says kids who think carefully about the hints always get perfect scores!'
        },
        {
            id: 'mind_baby', name: '念力娃', nameEn: 'Mind Baby', emoji: '🧠', hp: 5, type: 'psychic',
            attack: '💫', attackName: '精神冲击', quips: ['嗡嗡~', '读心术~', '我知道!'],
            trait: '可以读取知识的小精灵', traitEn: 'A sprite that can read knowledge',
            story: '念力娃的头很大，因为里面装满了从别人脑袋里"借"来的知识。它不会偷走知识，只是复制一份。如果你遇到难题，它会把历史上所有数学家的解题方法都传给你！',
            storyEn: 'Mind Baby has a big head because it\'s full of knowledge "borrowed" from others. It doesn\'t steal, just copies. When you face a hard problem, it can transmit solving methods from all mathematicians in history!'
        },
        // 虫系恐怖
        {
            id: 'giant_mantis', name: '巨螳螂', nameEn: 'Giant Mantis', emoji: '🦗', hp: 5, type: 'bug',
            attack: '🔪', attackName: '镰刀斩', quips: ['咔嚓~', '切切切~', '锋利!'],
            trait: '用镰刀切分数字', traitEn: 'Divides numbers with its scythes',
            story: '巨螳螂的两把镰刀可以把任何数字一分为二。它是除法运算的专家！不过它很善良，从不伤害任何生物，只切数学题。它的梦想是成为"除法武士"。',
            storyEn: 'Giant Mantis can split any number in two with its scythes. It\'s a division expert! But it\'s kind, never hurting any creature, only cutting math problems. Its dream is to become a "Division Samurai."'
        },
        {
            id: 'bee_queen', name: '毒蜂王', nameEn: 'Bee Queen', emoji: '🐝', hp: 6, type: 'bug',
            attack: '📍', attackName: '毒针乱射', quips: ['嗡嗡~', '蜂群来袭~', '刺刺刺!'],
            trait: '统领数学蜜蜂军团', traitEn: 'Commands an army of math bees',
            story: '毒蜂王统领着一万只工蜂，每只工蜂都负责记住一个算式。需要答案时，蜜蜂们就会排列成正确的数字形状！它们酿的"知识蜜"喝一口就能记住一整页公式。',
            storyEn: 'Bee Queen commands 10,000 worker bees, each memorizing one equation. When an answer is needed, bees arrange into the correct number shape! Their "knowledge honey" helps you memorize a whole page of formulas with one sip.'
        },
        // v15.0 新增怪兽
        {
            id: 'clock_spirit', name: '时钟精灵', emoji: '⏰', hp: 5, type: 'psychic',
            attack: '⏳', attackName: '时间暂停', quips: ['滴答滴答~', '时间到!', '赶快赶快!'],
            behaviors: ['taunt', 'enrage'],
            tauntQuips: ['太慢了!时间不等人!', '滴答滴答~倒计时!'],
            enterQuips: ['叮当!时钟精灵报时!', '几点了?战斗时间到!'],
            deathQuips: ['时间...停止了...', '滴...答...'],
            trait: '掌控时间的精灵', traitEn: 'A spirit that controls time',
            story: '时钟精灵住在魔法学校的大钟楼里。它喜欢用倒计时催促小朋友做算术，但其实它只是太兴奋了想看答案。',
            storyEn: 'Clock Spirit lives in the magic school\'s clock tower. It loves using countdowns to rush kids doing arithmetic, but it\'s really just excited to see the answers.'
        },
        {
            id: 'puzzle_cube', name: '魔方怪', emoji: '🧊', hp: 5, type: 'steel',
            attack: '🔲', attackName: '方块碾压', quips: ['转转转~', '你能解开我吗?', '六面都是陷阱!'],
            behaviors: ['defend', 'taunt'],
            defendQuips: ['铁壁防御!', '打不破的!'],
            enterQuips: ['魔方怪旋转登场!', '来解一解我吧!'],
            deathQuips: ['散架了...', '零件掉了...'],
            trait: '不断旋转变形的方块', traitEn: 'A constantly rotating and transforming cube',
            story: '魔方怪是由九九乘法表凝聚而成的立方体妖怪。它身上每一面都刻着不同的算式，只有全部答对才能让它停止旋转。',
            storyEn: 'Puzzle Cube is a cubic monster formed from the times table. Each face is carved with different equations - answer them all to stop its spinning.'
        },
        // v16.0 新增怪兽
        {
            id: 'nu_huo_niu', name: '怒火牛', emoji: '🐂', hp: 5, type: 'fire',
            difficulty: 'normal',
            personality: 'violent',
            story: '怒火牛是从九九乘法表里冲出来的暴脾气公牛。它的角上刻满了算式，每答错一题它就会更加愤怒，鼻孔喷出灼热的火焰。但如果你连续答对三题，它就会变得温顺无比，还会用舌头舔你的手表示敬佩。它的座右铭是"用力量证明一切"。',
            enterQuips: ['哞——！怒火牛冲锋！', '谁惹我谁倒霉！'],
            deathQuips: ['哞...牛也有倒下的时候...', '好厉害...我服了...'],
            tauntQuips: ['就这？连牛都打不过？', '我的角可不是摆设！'],
            fearQuips: ['怎...怎么连击这么猛！', '慢点慢点，让牛喘口气！'],
            behaviors: ['counter'],
            attackEmoji: '🔥'
        },
        {
            id: 'tie_jia_gui', name: '铁甲龟', emoji: '🐢', hp: 5, type: 'steel',
            difficulty: 'normal',
            personality: 'defensive',
            story: '铁甲龟在数学王国已经活了一千年，龟壳上镀了九层铁甲，每一层刻着一段乘法口诀。它从不主动攻击，但防御力惊人——据说连龙的火焰都烧不穿它的壳。小朋友们经常爬到它的壳上做题，因为那是整个数学世界最安全的地方。',
            enterQuips: ['铁甲龟慢吞吞地出现了~', '千年老龟，稳如泰山！'],
            deathQuips: ['龟壳...裂开了...', '千年防线...被突破了...'],
            tauntQuips: ['尽管打，我一点都不痛~', '打了这么久才这点伤害？'],
            fearQuips: ['壳上有裂缝了！', '这个攻击力...太恐怖了！'],
            behaviors: ['shield'],
            attackEmoji: '🛡️'
        },
        {
            id: 'yin_ying_ya', name: '阴影鸦', emoji: '🐦‍⬛', hp: 4, type: 'dark',
            difficulty: 'normal',
            personality: 'sinister',
            story: '阴影鸦是数学黑暗面的使者，全身漆黑如墨，只有眼睛发出诡异的紫光。它会在你做题时突然飞到头顶，用阴森的叫声打断你的思路。它最擅长的就是在关键时刻施加诅咒，让算式中的数字变得模糊不清。不过据说它其实是被黑暗侵蚀的好鸟，只要击败它就能解除它身上的诅咒。',
            enterQuips: ['嘎——！阴影降临！', '黑暗中...有双眼睛在看你...'],
            deathQuips: ['嘎...黑暗...散去了...', '谢谢你...解除了我的诅咒...'],
            tauntQuips: ['看不清题目了吧？嘿嘿~', '诅咒已经开始生效了~'],
            fearQuips: ['光...太亮了！', '不要用连击破除我的黑暗！'],
            behaviors: ['curse'],
            attackEmoji: '🌑'
        },
    ],

    // 高级怪兽（困难模式用）- HP 6-8
    hardMonsters: [
        // 龙系恐怖
        {
            id: 'flame_dragon', name: '炎龙兽', nameEn: 'Flame Dragon', emoji: '🐲', hp: 6, type: 'dragon',
            attack: '🔥', attackName: '龙焰吐息', quips: ['吼!', '烧成灰~', '龙之怒!'],
            trait: '守护数学宝藏的火龙', traitEn: 'Fire dragon guarding math treasures',
            story: '炎龙兽守护着传说中的"数学宝藏"——一本记载了所有数学奥秘的金色书籍。只有击败它才能翻开书的一页。据说整本书有99页，对应九九乘法表的每一个答案。',
            storyEn: 'Flame Dragon guards the legendary "Math Treasure" - a golden book containing all math secrets. Only by defeating it can you turn a page. The book has 99 pages, one for each answer in the times tables.'
        },
        {
            id: 'sea_dragon', name: '海龙王', nameEn: 'Sea Dragon King', emoji: '🐉', hp: 7, type: 'dragon',
            attack: '🌊', attackName: '深渊漩涡', quips: ['哗哗~', '海啸来了~', '淹没你!'],
            trait: '深海数学迷宫的主人', traitEn: 'Master of the deep sea math maze',
            story: '海龙王住在深海的数学迷宫里。迷宫的每条路都是一道算式，只有选择正确答案的路才能前进。它看起来凶猛，但其实很欢迎勇敢来挑战的小朋友。',
            storyEn: 'Sea Dragon King lives in a deep sea math maze. Each path is an equation - only choosing the correct answer lets you advance. It looks fierce but actually welcomes brave kids who come to challenge.'
        },
        {
            id: 'bone_dragon', name: '骨龙魔', nameEn: 'Bone Dragon', emoji: '🦴', hp: 7, type: 'dragon',
            attack: '💀', attackName: '亡灵之息', quips: ['咔咔咔~', '死亡降临~', '化为骨~'],
            trait: '由错误答案堆积而成', traitEn: 'Formed from accumulated wrong answers',
            story: '骨龙魔是由无数被丢弃的错误答案组成的。它很悲伤，因为没人喜欢错误。但它告诉小朋友："错误不可怕，每个错误都是通向正确的阶梯。"它希望有一天能变回正确答案。',
            storyEn: 'Bone Dragon formed from countless discarded wrong answers. It\'s sad because nobody likes mistakes. But it tells kids: "Mistakes aren\'t scary - each one is a step toward being right." It hopes to become a correct answer someday.'
        },
        // 恶系Boss级
        {
            id: 'night_wolf', name: '暗夜狼', nameEn: 'Night Wolf', emoji: '🐺', hp: 7, type: 'dark',
            attack: '🌙', attackName: '月下猎杀', quips: ['嗷呜~', '月圆之夜~', '撕碎你!'],
            trait: '月圆之夜最强的狼', traitEn: 'The strongest wolf under a full moon',
            story: '暗夜狼只在月圆之夜出现。它用嚎叫把数学问题传向月球，再把答案反射回来。它说月亮是最大的"计算器"，因为月亮表面的环形山就像键盘上的按钮。',
            storyEn: 'Night Wolf only appears on full moons. It howls math problems to the moon and receives answers reflected back. It says the moon is the biggest "calculator" because its craters are like keyboard buttons.'
        },
        {
            id: 'demon_king', name: '恶魔王', nameEn: 'Demon King', emoji: '😈', hp: 7, type: 'dark',
            attack: '🔥', attackName: '地狱之火', quips: ['嘿嘿嘿~', '堕落吧~', '灵魂归我!'],
            trait: '收集数学灵魂的恶魔', traitEn: 'A demon collecting math souls',
            story: '恶魔王喜欢收集"数学灵魂"——小朋友做对题目时散发出的智慧光芒。但它不是坏人，收集灵魂是为了在数学世界停电时用来照明。它是数学世界的"灯塔守护者"。',
            storyEn: 'Demon King collects "math souls" - the wisdom light kids emit when solving problems correctly. But it\'s not evil - it collects souls to light up Math World during blackouts. It\'s the "lighthouse keeper" of Math World.'
        },
        {
            id: 'death_bird', name: '死神鸟', nameEn: 'Death Bird', emoji: '🦅', hp: 6, type: 'dark',
            attack: '💀', attackName: '死亡俯冲', quips: ['咕咕~', '死神来了~', '带你走!'],
            trait: '带走错误答案的使者', traitEn: 'Messenger that carries away wrong answers',
            story: '死神鸟其实是个清洁工！它专门把作业本上的错误答案叼走，带到"错误回收站"处理。处理完的错误会变成新的知识种子，种下去就能长出正确答案！',
            storyEn: 'Death Bird is actually a cleaner! It carries wrong answers from homework to the "Error Recycling Center." Processed errors become knowledge seeds that grow into correct answers when planted!'
        },
        // 钢铁机械
        {
            id: 'steel_mech', name: '钢铁魔', nameEn: 'Steel Mech', emoji: '🤖', hp: 7, type: 'steel',
            attack: '🔩', attackName: '金属风暴', quips: ['嘀嘀~', '系统启动~', '消灭目标!'],
            trait: '最精确的计算机器人', traitEn: 'The most accurate calculating robot',
            story: '钢铁魔是古代数学家用青铜和魔法制作的计算机器人。它的芯片里存储了所有数学公式，但它很羡慕人类可以"理解"数学，而不只是"计算"数学。',
            storyEn: 'Steel Mech is a calculating robot made by ancient mathematicians with bronze and magic. Its chip stores all math formulas, but it envies humans who can "understand" math, not just "calculate" it.'
        },
        {
            id: 'gear_beast', name: '齿轮兽', nameEn: 'Gear Beast', emoji: '⚙️', hp: 6, type: 'steel',
            attack: '🔧', attackName: '齿轮绞杀', quips: ['咔嚓~', '旋转粉碎~', '碾碎你!'],
            trait: '由无数齿轮组成的生物', traitEn: 'A creature made of countless gears',
            story: '齿轮兽的身体由大大小小的齿轮组成，每个齿轮代表一个数字。当你做对算式时，它的齿轮就会完美咬合，发出美妙的机械音乐。做错了...它就会卡住，需要你帮它修好！',
            storyEn: 'Gear Beast\'s body has gears of all sizes, each representing a number. When you solve correctly, its gears mesh perfectly, making beautiful mechanical music. Get it wrong... it jams and needs your help to fix!'
        },
        // 妖精恐怖
        {
            id: 'dark_elf', name: '暗精灵', nameEn: 'Dark Elf', emoji: '🧝', hp: 6, type: 'fairy',
            attack: '✨', attackName: '黑暗祝福', quips: ['呵呵~', '诅咒你~', '永眠吧!'],
            trait: '被误解的善良精灵', traitEn: 'A kind elf who is misunderstood',
            story: '暗精灵不是坏精灵！它的"黑暗祝福"其实是让你在黑暗中也能看到数学题的魔法。它生活在没有阳光的地下，用这个魔法帮助很多迷路的孩子找到回家的数学路。',
            storyEn: 'Dark Elf isn\'t evil! Its "dark blessing" is actually magic to see math problems in the dark. Living underground without sunlight, it uses this magic to help lost children find their way home through math paths.'
        },
        {
            id: 'nightmare_horse', name: '噩梦马', nameEn: 'Nightmare Horse', emoji: '🐴', hp: 7, type: 'fairy',
            attack: '🌙', attackName: '噩梦踏蹄', quips: ['嘶嘶~', '噩梦开始~', '踏碎你!'],
            trait: '在梦中教数学的神马', traitEn: 'A divine horse that teaches math in dreams',
            story: '噩梦马其实是"好梦马"！它会在你睡觉时进入你的梦境，把白天没学会的数学变成好玩的冒险故事。很多孩子早上醒来突然会做难题，都是噩梦马的功劳！',
            storyEn: 'Nightmare Horse is actually a "Good Dream Horse!" It enters your dreams while sleeping, turning unlearned math into fun adventures. Many kids suddenly solve hard problems in the morning - all thanks to Nightmare Horse!'
        },
        // 地面毒系
        {
            id: 'scorpion_king', name: '沙蝎王', nameEn: 'Scorpion King', emoji: '🦂', hp: 7, type: 'ground',
            attack: '💜', attackName: '剧毒尾刺', quips: ['沙沙~', '毒尾一击~', '中毒了!'],
            trait: '沙漠数学王国的统治者', traitEn: 'Ruler of the Desert Math Kingdom',
            story: '沙蝎王统治着沙漠中的数学金字塔。金字塔的每一层都藏着数学谜题，从底层的加减法到顶层的乘除法。它的毒刺不会伤人，只会让被刺中的人暂时只能思考数学题！',
            storyEn: 'Scorpion King rules the math pyramid in the desert. Each level holds math puzzles, from addition at the bottom to division at the top. Its stinger doesn\'t hurt - it just makes you temporarily think only about math!'
        },
        // v15.0 新增怪兽
        {
            id: 'storm_dragon_jr', name: '小暴龙', emoji: '🐲', hp: 7, type: 'dragon',
            attack: '🌪️', attackName: '龙卷风暴', quips: ['吼!!', '烧！', '龙之怒!'],
            behaviors: ['enrage', 'defend'],
            enterQuips: ['小暴龙降临!', '颤抖吧!'],
            deathQuips: ['吼...下次一定...', '龙不会认输!'],
            enrageQuips: ['暴怒!!加攻!', '不要惹龙!'],
            trait: '脾气火爆的小龙', traitEn: 'A small dragon with a fiery temper',
            story: '小暴龙是龙族中年纪最小的一只。虽然个子不大，但脾气特别大！它觉得数学题就像龙的宝藏一样需要守护。',
            storyEn: 'Storm Dragon Jr. is the youngest of the dragon clan. Though small, it has a huge temper! It thinks math problems are dragon treasure that must be guarded.'
        },
        {
            id: 'crystal_spider', name: '水晶蜘蛛', emoji: '🕷️', hp: 7, type: 'ice',
            attack: '🕸️', attackName: '冰丝缠绕', quips: ['嘶嘶~', '被我网住了!', '冰冰凉~'],
            behaviors: ['dodge', 'fear'],
            dodgeQuips: ['嘿嘿~闪开了!', '蛛丝太快了~'],
            fearQuips: ['好...好可怕的连击...', '不要再答了!'],
            enterQuips: ['水晶蜘蛛结网中...', '我的丝线比钢铁还硬!'],
            deathQuips: ['丝线...断了...', '我的水晶网...'],
            trait: '用冰晶丝结网的蜘蛛', traitEn: 'A spider that weaves webs of crystal ice',
            story: '水晶蜘蛛的丝线是用纯净的冰晶制成的，阳光下闪闪发光。它编织的蛛网上写满了数学公式，像一幅美丽的艺术品。',
            storyEn: 'Crystal Spider\'s silk is made of pure ice crystal, sparkling in sunlight. Its web is covered with math formulas, like a beautiful work of art.'
        },
        // v16.0 新增怪兽
        {
            id: 'yan_mo_xiong', name: '炎魔熊', emoji: '🐻', hp: 7, type: 'fire',
            difficulty: 'hard',
            personality: 'violent',
            story: '炎魔熊是数学火山深处最凶猛的野兽，全身燃烧着熊熊烈火，每一步都会在地上留下滚烫的脚印。它是乘法王国的守卫长，负责阻拦实力不够的挑战者。当它进入暴怒状态时，火焰会变成蓝色，攻击力翻倍。只有连续快速答题才能在它暴怒前击败它。',
            enterQuips: ['吼！！炎魔熊从火山中走出！', '火焰就是我的铠甲！'],
            deathQuips: ['火焰...熄灭了...', '好强...下次我会更猛的...'],
            tauntQuips: ['这点攻击像挠痒痒！', '你的速度配不上你的勇气！'],
            fearQuips: ['蓝焰都挡不住！？', '不可能！竟然这么快！'],
            behaviors: ['counter', 'enrage'],
            attackEmoji: '🔥'
        },
        {
            id: 'huan_ying_hu', name: '幻影狐', emoji: '🦊', hp: 6, type: 'psychic',
            difficulty: 'hard',
            personality: 'cunning',
            story: '幻影狐是九尾狐的远亲，虽然只有三条尾巴，但它的幻术已经出神入化。它能在战斗中制造出完美的分身，让你根本分不清哪个是真的哪个是假的。每答对一题它就会分裂出新的分身，但同时也会露出破绽让你有机会闪避。在整个数学世界，它的智商排名前三。',
            enterQuips: ['嘻嘻~你看到的是真的我吗？', '幻影狐有三条命哦~'],
            deathQuips: ['原来...真身也会倒下...', '聪明反被聪明误...'],
            tauntQuips: ['哪个是真的？猜猜看~', '我的分身比本体还厉害！'],
            fearQuips: ['连我的分身都被秒杀了！', '好可怕的计算速度...'],
            behaviors: ['dodge', 'split'],
            attackEmoji: '💜'
        },
        {
            id: 'ming_jie_ya', name: '冥界鸦', emoji: '🦅', hp: 6, type: 'dark',
            difficulty: 'hard',
            personality: 'sinister',
            story: '冥界鸦是从算式墓地飞出来的不祥之鸟，浑身散发着幽冷的紫色光芒。它收集了所有被丢弃的错误答案，用这些错误的力量诅咒挑战者。当它血量降低时，会选择自爆，将积累的错误能量全部释放出来。不过传说中，如果你能在它自爆前打败它，就能获得永不犯错的祝福。',
            enterQuips: ['嘎嘎嘎...冥界的使者来了...', '错误的亡灵在呼唤...'],
            deathQuips: ['错误...终将消散...', '冥界...在等我回去...'],
            tauntQuips: ['你犯过的错误我都记得~', '诅咒会让你越来越慢...'],
            fearQuips: ['不...错误的力量快要用完了...', '别再答对了！'],
            behaviors: ['curse', 'selfDestruct'],
            attackEmoji: '💀'
        },
    ],

    // Boss怪兽（困难模式最终关卡）- HP 8-12 - 恐怖但可爱的终极Boss
    bossMonsters: [
        {
            id: 'fossil_rex', name: '骨骨霸龙', nameEn: 'Fossil Rex', emoji: '🦖', hp: 8, type: 'dragon',
            attack: '🦴', attackName: '化石咆哮', quips: ['吼吼吼!', '亿年前的王!', '骨头砸!'],
            trait: '来自远古的数学恐龙', traitEn: 'An ancient math dinosaur',
            story: '骨骨霸龙是一亿年前的数学老师转化而成的化石恐龙。那时候的数学只有加法，所以它一直在学习新的运算。它是数学世界年纪最大的居民，知道数学发展的全部历史。',
            storyEn: 'Fossil Rex was a math teacher from 100 million years ago, turned into a fossil dinosaur. Back then, only addition existed, so it keeps learning new operations. It\'s the oldest resident of Math World, knowing all of math\'s history.'
        },
        {
            id: 'phoenix', name: '炎炎鸟王', nameEn: 'Phoenix King', emoji: '🐦‍🔥', hp: 9, type: 'fire',
            attack: '🔥', attackName: '涅槃烈焰', quips: ['燃燃燃!', '不死鸟!', '化为灰烬!'],
            trait: '从错误中重生的神鸟', traitEn: 'Divine bird reborn from mistakes',
            story: '炎炎鸟王每次被击败都会从灰烬中重生，变得更强大。它代表了学习数学的精神——失败了不要紧，从错误中学习，你就会变得更强！它的羽毛燃烧时会显示鼓励的话语。',
            storyEn: 'Phoenix King is reborn from ashes each time it\'s defeated, becoming stronger. It represents the spirit of learning math - failure is okay, learn from mistakes and grow stronger! Its burning feathers display encouraging words.'
        },
        {
            id: 'ice_lord', name: '冷冷魔君', nameEn: 'Ice Lord', emoji: '🥶', hp: 9, type: 'ice',
            attack: '❄️', attackName: '冰封万里', quips: ['好冷呀~', '冻冻你~', '变冰棍!'],
            trait: '冷静思考的化身', traitEn: 'Embodiment of cool-headed thinking',
            story: '冷冷魔君代表"冷静"的力量。它教导大家：做数学题时不要慌张，像冰一样冷静才能算得准。它的城堡全是冰做的，每块冰砖上都刻着让人冷静的数学口诀。',
            storyEn: 'Ice Lord represents the power of "staying cool." It teaches: don\'t panic with math problems, be cool like ice to calculate accurately. Its castle is all ice, with calming math rhymes carved on every ice brick.'
        },
        {
            id: 'thunder_king', name: '雷雷大王', nameEn: 'Thunder King', emoji: '⚡', hp: 9, type: 'electric',
            attack: '💛', attackName: '万雷轰顶', quips: ['劈里啪啦!', '电电电!', '麻痹吧!'],
            trait: '速度与准确的代言人', traitEn: 'Ambassador of speed and accuracy',
            story: '雷雷大王代表"快速准确"。它的闪电比任何东西都快，但从不出错。它说："不要追求快而丢了准，也不要追求准而忘了快。像闪电一样，又快又准才是最棒的！"',
            storyEn: 'Thunder King represents "fast and accurate." Its lightning is faster than anything but never wrong. It says: "Don\'t sacrifice accuracy for speed, or speed for accuracy. Be like lightning - fast AND accurate is the best!"'
        },
        {
            id: 'alien_eye', name: '外星大眼', nameEn: 'Alien Eye', emoji: '👽', hp: 10, type: 'psychic',
            attack: '🛸', attackName: '脑电波', quips: ['嗡嗡~', '读取中~', '交出答案!'],
            trait: '跨星际的数学研究者', traitEn: 'Interstellar math researcher',
            story: '外星大眼来自数学星球，那里的生物用数学作为语言。它来地球是为了研究为什么地球小朋友能把枯燥的数字变成有趣的游戏。它最感动的发现是：原来"快乐"可以让学习变简单！',
            storyEn: 'Alien Eye is from Math Planet where creatures speak in math. It came to Earth to study why kids can turn boring numbers into fun games. Its most touching discovery: "happiness" can make learning easier!'
        },
        {
            id: 'math_demon_king', name: '九九魔王', nameEn: 'Times Table King', emoji: '👹', hp: 12, type: 'dark',
            attack: '💀', attackName: '九九归一', quips: ['哈哈哈!', '算不出来吧!', '乖乖受死!'],
            trait: '九九乘法表的终极守护者', traitEn: 'Ultimate guardian of the times tables',
            story: '九九魔王是数学世界最强的Boss，但它其实是个老好人！它故意装得很凶，是为了激励小朋友努力学习打败它。每次被击败它都很开心，因为这意味着又有一个孩子掌握了乘法表。它的愿望是被全世界的小朋友都打败！',
            storyEn: 'Times Table King is Math World\'s strongest boss, but it\'s actually a nice guy! It acts fierce to motivate kids to study hard and defeat it. It\'s happy when beaten because it means another child mastered times tables. Its wish is to be defeated by every child in the world!'
        },
        // v15.0 新增Boss
        {
            id: 'math_king', name: '算术之王', emoji: '👑', hp: 10, type: 'dragon',
            attack: '⚔️', attackName: '王者审判', quips: ['跪下!', '无人能敌!', '数学之王降临!'],
            behaviors: ['defend', 'summon', 'enrage'],
            defendQuips: ['王者不可侵犯!', '铜墙铁壁!'],
            summonQuips: ['小的们，上!', '卫兵来了!'],
            enrageQuips: ['放肆!!', '算术之王的怒火!'],
            enterQuips: ['算术之王驾到!', '万兽臣服!'],
            deathQuips: ['不可能...王者怎么会输...', '记住这个名字...算术之王!'],
            trait: '统治九九王国的霸主', traitEn: 'The overlord ruling the Kingdom of Times Tables',
            story: '算术之王是九九乘法表的最终守护者。它头戴金冠，手持算式权杖，统治着整个数学王国。只有最勇敢、最聪明的小勇者才能挑战它！',
            storyEn: 'Math King is the ultimate guardian of the times table. Wearing a golden crown and wielding an equation scepter, it rules the entire Math Kingdom. Only the bravest and smartest heroes can challenge it!'
        },
        // v16.0 新增Boss
        {
            id: 'jiu_jiu_shen_long', name: '九九神龙', emoji: '🐲', hp: 10, type: 'dragon',
            difficulty: 'boss',
            personality: 'domineering',
            story: '九九神龙是隐藏在乘法表最深处的上古神兽，传说它的九十九片鳞片上分别刻着九九乘法表的每一个算式。它沉睡了千年，只有当有人集齐所有正确答案时才会苏醒。苏醒后的神龙会进入二阶段形态——真·九九神龙，此时它的力量增强数倍，鳞片变成金色，能召唤小龙守卫，并用铁壁防御抵挡攻击。只有最顶尖的速算达人才能战胜它！',
            enterQuips: ['千年沉睡...今日苏醒！九九神龙降世！', '乘法表的力量在我鳞片上燃烧！'],
            deathQuips: ['九十九片鳞片...全部碎裂...你是真正的速算之王！', '千年之后...再来挑战...'],
            tauntQuips: ['小小挑战者，你的速度还不够！', '九九八十一种方式让你失败！'],
            fearQuips: ['竟然...伤到了我的鳞片！', '这个速度...千年来第一次见到！'],
            behaviors: ['transform', 'summon', 'defend', 'counter'],
            attackEmoji: '🌟',
            phase2Emoji: '🐉',
            phase2Name: '真·九九神龙',
            phase2HP: 6
        },
        {
            id: 'suan_shi_mo_zun', name: '算式魔尊', emoji: '😈', hp: 8, type: 'dark',
            difficulty: 'boss',
            personality: 'domineering',
            story: '算式魔尊是数学世界黑暗面的终极统治者，它能将任何算式扭曲成错误的形态。它的身体由无数错误答案堆积而成，散发着令人窒息的紫黑色雾气。当它进入第二阶段时，会变身为真·算式魔尊，此时它的诅咒之力达到巅峰，还会释放护盾保护自己并进入狂暴状态。传说只有心中毫无畏惧、头脑清晰如水的勇者才能击破它的黑暗结界。',
            enterQuips: ['哈哈哈！算式魔尊驾到！数字在我面前颤抖！', '错误就是力量！混沌就是秩序！'],
            deathQuips: ['不...黑暗怎么会输给光明...', '算式...恢复了正确的形态...'],
            tauntQuips: ['你的答案在我眼里都是错的！', '黑暗诅咒会让你的脑子一片空白！'],
            fearQuips: ['怎么可能！每一题都答对了！', '我的错误之力...在消散...'],
            behaviors: ['transform', 'curse', 'shield', 'enrage'],
            attackEmoji: '💀',
            phase2Emoji: '👿',
            phase2Name: '真·算式魔尊',
            phase2HP: 6
        },
    ],

    // 为了兼容性保留的旧数组（会在运行时动态生成）
    monsters: [],

    // ===== 妖怪图鉴收集系统 =====
    // 获取所有妖怪列表
    // 获取当前模块的所有妖怪
    getAllMonsters(module) {
        const m = module || App.battle.module || 'xiaojiujiu';
        if (m === 'fraction') {
            var frBase = [
                ...shanhaiFractionEasyMonsters,
                ...shanhaiFractionNormalMonsters,
                ...shanhaiFractionHardMonsters,
                ...shanhaiFractionBossMonsters
            ];
            // v23.2: Merge chapter BOSS and chapter-exclusive monsters
            if (typeof chapterBossMonsters !== 'undefined' && chapterBossMonsters.fraction) {
                frBase = frBase.concat(chapterBossMonsters.fraction);
            }
            if (typeof chapterMonsters_sh_ch1 !== 'undefined') frBase = frBase.concat(chapterMonsters_sh_ch1);
            if (typeof chapterMonsters_sh_ch2 !== 'undefined') frBase = frBase.concat(chapterMonsters_sh_ch2);
            if (typeof chapterMonsters_sh_ch3 !== 'undefined') frBase = frBase.concat(chapterMonsters_sh_ch3);
            return frBase;
        }
        if (m === 'decimal') {
            var dcBase = [
                ...xiyoujiEasyMonsters,
                ...xiyoujiNormalMonsters,
                ...xiyoujiHardMonsters,
                ...xiyoujiBossMonsters
            ];
            // v23.2: Merge chapter BOSS and chapter-exclusive monsters
            if (typeof chapterBossMonsters !== 'undefined' && chapterBossMonsters.decimal) {
                dcBase = dcBase.concat(chapterBossMonsters.decimal);
            }
            if (typeof chapterMonsters_xy_ch1 !== 'undefined') dcBase = dcBase.concat(chapterMonsters_xy_ch1);
            if (typeof chapterMonsters_xy_ch2 !== 'undefined') dcBase = dcBase.concat(chapterMonsters_xy_ch2);
            if (typeof chapterMonsters_xy_ch3 !== 'undefined') dcBase = dcBase.concat(chapterMonsters_xy_ch3);
            return dcBase;
        }
        if (m === 'unit') {
            var utBase = [
                ...fengshenEasyMonsters,
                ...fengshenNormalMonsters,
                ...fengshenHardMonsters,
                ...fengshenBossMonsters
            ];
            // v23.2: Merge chapter BOSS and chapter-exclusive monsters
            if (typeof chapterBossMonsters !== 'undefined' && chapterBossMonsters.unit) {
                utBase = utBase.concat(chapterBossMonsters.unit);
            }
            if (typeof chapterMonsters_fs_ch1 !== 'undefined') utBase = utBase.concat(chapterMonsters_fs_ch1);
            if (typeof chapterMonsters_fs_ch2 !== 'undefined') utBase = utBase.concat(chapterMonsters_fs_ch2);
            if (typeof chapterMonsters_fs_ch3 !== 'undefined') utBase = utBase.concat(chapterMonsters_fs_ch3);
            return utBase;
        }
        if (m === 'multiply') {
            var mpBase = [
                ...liaozhaiEasyMonsters,
                ...liaozhaiNormalMonsters,
                ...liaozhaiHardMonsters,
                ...liaozhaiBossMonsters
            ];
            // v23.2: Merge chapter BOSS and chapter-exclusive monsters
            if (typeof chapterBossMonsters !== 'undefined' && chapterBossMonsters.multiply) {
                mpBase = mpBase.concat(chapterBossMonsters.multiply);
            }
            if (typeof chapterMonsters_lz_ch1 !== 'undefined') mpBase = mpBase.concat(chapterMonsters_lz_ch1);
            if (typeof chapterMonsters_lz_ch2 !== 'undefined') mpBase = mpBase.concat(chapterMonsters_lz_ch2);
            if (typeof chapterMonsters_lz_ch3 !== 'undefined') mpBase = mpBase.concat(chapterMonsters_lz_ch3);
            return mpBase;
        }
        if (m === 'times') {
            var tmBase = [
                ...hpEasyMonsters,
                ...hpNormalMonsters,
                ...hpHardMonsters,
                ...hpBossMonsters
            ];
            // v23.2: Merge chapter BOSS and chapter-exclusive monsters
            if (typeof chapterBossMonsters !== 'undefined' && chapterBossMonsters.times) {
                tmBase = tmBase.concat(chapterBossMonsters.times);
            }
            if (typeof chapterMonsters_hp_ch1 !== 'undefined') tmBase = tmBase.concat(chapterMonsters_hp_ch1);
            if (typeof chapterMonsters_hp_ch2 !== 'undefined') tmBase = tmBase.concat(chapterMonsters_hp_ch2);
            if (typeof chapterMonsters_hp_ch3 !== 'undefined') tmBase = tmBase.concat(chapterMonsters_hp_ch3);
            return tmBase;
        }
        var base = [
            ...this.easyMonsters,
            ...this.normalMonsters,
            ...this.hardMonsters,
            ...this.bossMonsters
        ];
        // v23.0: Merge chapter BOSS monsters
        if (typeof chapterBossMonsters !== 'undefined' && chapterBossMonsters.xiaojiujiu) {
            base = base.concat(chapterBossMonsters.xiaojiujiu);
        }
        // v23.1: Merge chapter-exclusive monsters (33 new)
        if (typeof chapterMonsters_ch1 !== 'undefined') {
            base = base.concat(chapterMonsters_ch1);
        }
        if (typeof chapterMonsters_ch2 !== 'undefined') {
            base = base.concat(chapterMonsters_ch2);
        }
        if (typeof chapterMonsters_ch3 !== 'undefined') {
            base = base.concat(chapterMonsters_ch3);
        }
        return base;
    },

    // 获取模块的怪兽数组
    getModuleMonsters(module) {
        if (module === 'fraction') {
            return {
                easy: shanhaiFractionEasyMonsters,
                normal: shanhaiFractionNormalMonsters,
                hard: shanhaiFractionHardMonsters,
                boss: shanhaiFractionBossMonsters
            };
        }
        if (module === 'decimal') {
            return {
                easy: xiyoujiEasyMonsters,
                normal: xiyoujiNormalMonsters,
                hard: xiyoujiHardMonsters,
                boss: xiyoujiBossMonsters
            };
        }
        if (module === 'unit') {
            return {
                easy: fengshenEasyMonsters,
                normal: fengshenNormalMonsters,
                hard: fengshenHardMonsters,
                boss: fengshenBossMonsters
            };
        }
        if (module === 'multiply') {
            return {
                easy: liaozhaiEasyMonsters,
                normal: liaozhaiNormalMonsters,
                hard: liaozhaiHardMonsters,
                boss: liaozhaiBossMonsters
            };
        }
        if (module === 'times') {
            return {
                easy: hpEasyMonsters,
                normal: hpNormalMonsters,
                hard: hpHardMonsters,
                boss: hpBossMonsters
            };
        }
        return {
            easy: this.easyMonsters,
            normal: this.normalMonsters,
            hard: this.hardMonsters,
            boss: this.bossMonsters
        };
    },

    // 获取收集记录
    getCollection(module) {
        const currentUser = UserManager.getCurrentUser();
        if (!currentUser) return [];
        const m = module || App.battle.module || 'xiaojiujiu';
        const suffix = m === 'xiaojiujiu' ? '' : '_' + m;
        const key = 'monsterCollection_' + currentUser.id + suffix;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },

    // 保存收集记录
    saveCollection(collection, module) {
        const currentUser = UserManager.getCurrentUser();
        if (!currentUser) return;
        const m = module || App.battle.module || 'xiaojiujiu';
        const suffix = m === 'xiaojiujiu' ? '' : '_' + m;
        const key = 'monsterCollection_' + currentUser.id + suffix;
        localStorage.setItem(key, JSON.stringify(collection));
    },

    // 添加妖怪到收集
    addToCollection(monsterId) {
        const collection = this.getCollection();
        if (!collection.includes(monsterId)) {
            collection.push(monsterId);
            this.saveCollection(collection);
            return true;
        }
        return false;
    },

    // 检查妖怪是否已收集
    isCollected(monsterId, module) {
        return this.getCollection(module).includes(monsterId);
    },

    // 获取收集统计
    getCollectionStats(module) {
        const all = this.getAllMonsters(module);
        const collected = this.getCollection(module);
        return {
            total: all.length,
            collected: collected.length,
            percentage: Math.round((collected.length / all.length) * 100)
        };
    },

    // 显示新收集提示
    showNewCollectionToast(monster) {
        const mod = App.battle.module;
        const toastMap = {
            fraction: { icon: '📜', title: '山海经更新!' },
            decimal: { icon: '📖', title: '西游记更新!' },
            unit: { icon: '📜', title: '封神演义更新!' },
            multiply: { icon: '👻', title: '聊斋志异更新!' },
            times: { icon: '🧙', title: '魔法生物更新!' }
        };
        const toast_ = toastMap[mod] || { icon: '📖', title: '图鉴更新!' };
        const toastIcon = toast_.icon;
        const toastTitle = toast_.title;
        const toast = document.createElement('div');
        toast.className = 'collection-toast';
        toast.innerHTML = `
            <div class="collection-toast-content">
                <span class="collection-toast-icon">${toastIcon}</span>
                <span class="collection-toast-text">
                    <strong>${toastTitle}</strong><br>
                    ${monster.emoji} ${monster.name} 已收录
                </span>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    },

    // ===== 道具系统 =====
    items: [
        // 攻击道具 - 造成额外伤害
        { id: 'fire_crystal', name: '火焰水晶', emoji: '🔴', type: 'attack', effect: { damage: 2 }, desc: '下次攻击+2伤害', rarity: 'common' },
        { id: 'ice_shard', name: '寒冰碎片', emoji: '🔵', type: 'attack', effect: { damage: 2, freeze: true }, desc: '冰冻攻击+2伤害', rarity: 'common' },
        { id: 'thunder_stone', name: '雷电宝石', emoji: '🟡', type: 'attack', effect: { damage: 3 }, desc: '闪电攻击+3伤害', rarity: 'rare' },
        { id: 'dragon_fang', name: '龙牙', emoji: '🦷', type: 'attack', effect: { damage: 4 }, desc: '龙之力量+4伤害', rarity: 'epic' },
        { id: 'ultimate_orb', name: '究极宝珠', emoji: '🔮', type: 'attack', effect: { damage: 5, pierce: true }, desc: '究极攻击+5穿透伤害', rarity: 'legendary' },

        // 治疗道具 - 恢复生命
        { id: 'potion', name: '红色药水', emoji: '🧪', type: 'heal', effect: { hp: 1 }, desc: '恢复1点HP', rarity: 'common' },
        { id: 'super_potion', name: '超级药水', emoji: '💊', type: 'heal', effect: { hp: 2 }, desc: '恢复2点HP', rarity: 'rare' },
        { id: 'max_potion', name: '全满药水', emoji: '💉', type: 'heal', effect: { hpFull: true }, desc: '完全恢复HP', rarity: 'epic' },
        { id: 'revive', name: '复活草', emoji: '🌿', type: 'heal', effect: { revive: true }, desc: '防止一次死亡', rarity: 'legendary' },

        // 增益道具 - 临时增强
        { id: 'combo_boost', name: '连击护符', emoji: '📿', type: 'buff', effect: { comboBonus: 2 }, desc: '连击伤害+2', rarity: 'rare' },
        { id: 'double_strike', name: '双重打击', emoji: '⚔️', type: 'buff', effect: { doubleHit: true }, desc: '下次攻击命中两次', rarity: 'rare' },
        { id: 'critical_gem', name: '暴击宝石', emoji: '💎', type: 'buff', effect: { critChance: 0.5 }, desc: '50%暴击(双倍伤害)', rarity: 'epic' },
        { id: 'shield', name: '护盾结界', emoji: '🛡️', type: 'buff', effect: { shield: 1 }, desc: '抵挡1次攻击', rarity: 'rare' },
        { id: 'golden_apple', name: '黄金苹果', emoji: '🍎', type: 'buff', effect: { maxHpUp: 1 }, desc: '最大HP+1', rarity: 'legendary' },

        // 特殊道具 - 独特效果
        { id: 'star_piece', name: '星星碎片', emoji: '⭐', type: 'special', effect: { scoreBonus: 50 }, desc: '额外获得50分', rarity: 'common' },
        { id: 'lucky_coin', name: '幸运金币', emoji: '🪙', type: 'special', effect: { itemDropUp: true }, desc: '提高道具掉落率', rarity: 'rare' },
        { id: 'time_hourglass', name: '时间沙漏', emoji: '⏳', type: 'special', effect: { skipMonster: true }, desc: '跳过当前怪兽', rarity: 'legendary' },
    ],

    // 道具掉落配置
    itemDropConfig: {
        baseChance: 0.15,  // 基础掉落率15%
        comboBonus: 0.02,  // 每连击增加2%
        maxChance: 0.4,    // 最大掉落率40%
        rarityWeights: {
            common: 50,
            rare: 30,
            epic: 15,
            legendary: 5
        }
    },

    // ===== 特殊武器系统 =====
    // 武器配置 - 更丰富的攻击方式
    weapons: [
        { emoji: '🔥', name: '火球术', weight: 20, sound: 'fire', color: '#ff6b35' },
        { emoji: '🧊', name: '冰冻箭', weight: 15, sound: 'ice', color: '#74b9ff' },
        { emoji: '⚡', name: '闪电链', weight: 15, sound: 'thunder', color: '#ffeaa7' },
        { emoji: '⭐', name: '流星雨', weight: 15, sound: 'star', color: '#fdcb6e' },
        { emoji: '🌈', name: '彩虹光', weight: 10, sound: 'rainbow', color: '#a29bfe' },
        { emoji: '💣', name: '超级炸弹', weight: 5, sound: 'bomb', color: '#2d3436' },
        { emoji: '🌟', name: '圣光术', weight: 10, sound: 'holy', color: '#fff9c4' },
        { emoji: '🌀', name: '龙卷风', weight: 10, sound: 'wind', color: '#81ecec' }
    ],

    // 道具增强武器
    specialWeapons: [
        { emoji: '🐉', name: '神龙怒吼', damage: 5, color: '#e74c3c' },
        { emoji: '☄️', name: '陨石撞击', damage: 6, color: '#e67e22' },
        { emoji: '🌋', name: '火山爆发', damage: 7, color: '#c0392b' },
        { emoji: '🌊', name: '海啸狂澜', damage: 5, color: '#3498db' },
        { emoji: '💫', name: '星辰坠落', damage: 8, color: '#9b59b6' },
    ],

    // ===== v21.0: 模块独占道具 =====
    moduleItems: {
        xiaojiujiu: [
            { id: 'xjj_jiujiu_charm', name: '九九护符', emoji: '📿', type: 'buff', effect: { comboBonus: 3 }, desc: '连击伤害+3（小九九独占）', rarity: 'rare', module: 'xiaojiujiu', hint: '仅在小九九模块掉落' },
            { id: 'xjj_multiply_eye', name: '乘法之眼', emoji: '👁️', type: 'buff', effect: { antiDodge: true }, desc: '看穿怪物闪避（小九九独占）', rarity: 'epic', module: 'xiaojiujiu', hint: '仅在小九九模块掉落' },
            { id: 'xjj_koujue_book', name: '口诀天书', emoji: '📜', type: 'buff', effect: { allStatsUp: 1 }, desc: '攻防+1（小九九独占）', rarity: 'legendary', module: 'xiaojiujiu', hint: '仅在小九九模块掉落' },
        ],
        times: [
            { id: 'times_crystal_ball', name: '魔法水晶球', emoji: '🔮', type: 'buff', effect: { critChance: 0.3 }, desc: '暴击率+30%（大九九独占）', rarity: 'rare', module: 'times', hint: '仅在大九九模块掉落' },
            { id: 'times_sorting_hat', name: '分院帽', emoji: '🎩', type: 'buff', effect: { bestWeapon: true }, desc: '自动选择最优武器（大九九独占）', rarity: 'epic', module: 'times', hint: '仅在大九九模块掉落' },
            { id: 'times_elder_wand', name: '老魔杖', emoji: '🪄', type: 'attack', effect: { damage: 6, doubleDamage: true }, desc: '单次伤害翻倍（大九九独占）', rarity: 'legendary', module: 'times', hint: '仅在大九九模块掉落' },
        ],
        multiply: [
            { id: 'mult_fox_mask', name: '狐仙面具', emoji: '🎭', type: 'buff', effect: { dodgeNext: true }, desc: '闪避下次攻击（乘法独占）', rarity: 'rare', module: 'multiply', hint: '仅在乘法速记模块掉落' },
            { id: 'mult_liaozhai_scroll', name: '聊斋古卷', emoji: '📕', type: 'heal', effect: { revive: true, hp: 1 }, desc: '复活+1HP（乘法独占）', rarity: 'epic', module: 'multiply', hint: '仅在乘法速记模块掉落' },
            { id: 'mult_huapi', name: '画皮', emoji: '🖼️', type: 'buff', effect: { invincible: 3 }, desc: '无敌3题（乘法独占）', rarity: 'legendary', module: 'multiply', hint: '仅在乘法速记模块掉落' },
        ],
        fraction: [
            { id: 'frac_jingwei_stone', name: '精卫之石', emoji: '🪨', type: 'buff', effect: { shield: 2 }, desc: '护盾+2（分数独占）', rarity: 'rare', module: 'fraction', hint: '仅在分数模块掉落' },
            { id: 'frac_phoenix_feather', name: '凤凰之羽', emoji: '🪶', type: 'heal', effect: { revive: true, hpFull: true }, desc: '死亡时满血复活（分数独占）', rarity: 'epic', module: 'fraction', hint: '仅在分数模块掉落' },
            { id: 'frac_shanhai_mirror', name: '山海宝鉴', emoji: '📖', type: 'buff', effect: { damageUp: 3 }, desc: '所有伤害+3（分数独占）', rarity: 'legendary', module: 'fraction', hint: '仅在分数模块掉落' },
        ],
        decimal: [
            { id: 'dec_jingu_shard', name: '金箍棒碎片', emoji: '🏮', type: 'attack', effect: { damage: 2, multiHit: 3 }, desc: '攻击+2连续3次（小数独占）', rarity: 'rare', module: 'decimal', hint: '仅在小数模块掉落' },
            { id: 'dec_dinghai_pin', name: '定海神针·缩', emoji: '📌', type: 'buff', effect: { enemyDamageHalf: true }, desc: '怪物攻击减半（小数独占）', rarity: 'epic', module: 'decimal', hint: '仅在小数模块掉落' },
            { id: 'dec_ruyi_jingu', name: '如意金箍棒', emoji: '🔱', type: 'buff', effect: { allDamageMultiplier: 1.5 }, desc: '全场伤害×1.5（小数独占）', rarity: 'legendary', module: 'decimal', hint: '仅在小数模块掉落' },
        ],
        unit: [
            { id: 'unit_fenghuo_shard', name: '风火轮碎片', emoji: '💫', type: 'buff', effect: { timeBonus: 2000 }, desc: '答题时间+2秒（单位独占）', rarity: 'rare', module: 'unit', hint: '仅在单位换算模块掉落' },
            { id: 'unit_dashen_whip', name: '打神鞭', emoji: '⚡', type: 'buff', effect: { pierceDefense: true }, desc: '无视怪物防御（单位独占）', rarity: 'epic', module: 'unit', hint: '仅在单位换算模块掉落' },
            { id: 'unit_fengshen_list', name: '封神榜', emoji: '📋', type: 'attack', effect: { executeBelow: 3 }, desc: '一击必杀HP≤3怪物（单位独占）', rarity: 'legendary', module: 'unit', hint: '仅在单位换算模块掉落' },
        ]
    },

    // ===== v21.0: 模块独占武器 =====
    moduleWeapons: {
        xiaojiujiu: [
            { emoji: '💊', name: '九转仙丹', weight: 8, sound: 'holy', color: '#ff69b4', module: 'xiaojiujiu' },
            { emoji: '🧮', name: '算盘珠', weight: 8, sound: 'star', color: '#daa520', module: 'xiaojiujiu' },
        ],
        times: [
            { emoji: '🦉', name: '守护神兽', weight: 8, sound: 'wind', color: '#8b4513', module: 'times' },
            { emoji: '✨', name: '魔咒之光', weight: 8, sound: 'holy', color: '#ffd700', module: 'times' },
        ],
        multiply: [
            { emoji: '👻', name: '鬼火', weight: 8, sound: 'fire', color: '#00ff88', module: 'multiply' },
            { emoji: '🦊', name: '狐狸火', weight: 8, sound: 'fire', color: '#ff4500', module: 'multiply' },
        ],
        fraction: [
            { emoji: '🐲', name: '神兽咆哮', weight: 8, sound: 'thunder', color: '#8b0000', module: 'fraction' },
            { emoji: '📛', name: '灵符', weight: 8, sound: 'ice', color: '#ffd700', module: 'fraction' },
        ],
        decimal: [
            { emoji: '⭕', name: '紧箍咒', weight: 8, sound: 'thunder', color: '#ff1493', module: 'decimal' },
            { emoji: '🐒', name: '七十二变', weight: 8, sound: 'rainbow', color: '#ff8c00', module: 'decimal' },
        ],
        unit: [
            { emoji: '🌩️', name: '天雷', weight: 8, sound: 'thunder', color: '#4169e1', module: 'unit' },
            { emoji: '🌀', name: '土遁术', weight: 8, sound: 'wind', color: '#8b4513', module: 'unit' },
        ]
    },

    // ===== v21.0: 模块掉落率配置 =====
    moduleDropConfig: {
        xiaojiujiu: { sharedChance: 0.15, exclusiveChance: 0.08, bossExclusiveChance: 0.25 },
        times:      { sharedChance: 0.13, exclusiveChance: 0.10, bossExclusiveChance: 0.30 },
        multiply:   { sharedChance: 0.12, exclusiveChance: 0.12, bossExclusiveChance: 0.35 },
        fraction:   { sharedChance: 0.10, exclusiveChance: 0.15, bossExclusiveChance: 0.40 },
        decimal:    { sharedChance: 0.10, exclusiveChance: 0.15, bossExclusiveChance: 0.40 },
        unit:       { sharedChance: 0.10, exclusiveChance: 0.15, bossExclusiveChance: 0.40 }
    },

};
