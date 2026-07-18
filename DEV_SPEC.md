# 开发规格：角色、图鉴与动画

## 数据

- `js/monster-expansion.js` 是新增 300 个妖怪的唯一数据源。
- 每主题固定为 `18 easy + 18 normal + 12 hard + 2 boss`。
- 每项包含 `id/name/type/hp/attack/attackName/story/artGroup/artIndex/sourceBasis`。
- `BattleMode.getModuleMonsters()` 将新增角色合并到实际遭遇池；`getAllMonsters()` 将其合并到图鉴池。

## 美术

- `CharacterArt.monsterSource()` 优先读取 `assets/characters/expansion/<theme>/`。
- 六套各 50 张 512×512 WebP，共 300 张。
- 数学王国使用本轮生成的 25 个新母版与 25 个进阶变体；其余主题在远端生成服务不稳定时，从此前已生成且经主题考据的母版制作同族变体。
- `CharacterArt.cardMarkup()` 只替换怪物卡和明确的怪物首领纪念卡，避免改变知识卡语义。

## 动画

- `BattleMode.setHeroState()` 同时驱动 `.hero-layers`、角色层和武器层。
- `BattleMode.setEnemyState()` 根据属性映射四种动作原型。
- 保留原有 0.35 秒基础攻击节拍与回调顺序；只增加预备、发力、后坐和命中层次。
- `prefers-reduced-motion` 下压缩动画时长。

## 背景与声音

- `BattleMode.applyMonsterTheme()` 同时设置属性场景类与 `module-theme-*` 主题类。
- `css/scenes.css` 继续负责 24 种属性场景，并增加六套主题身份层；不引入额外网络背景资源。
- `playSound()` 复用共享 `AudioContext`，避免每次反馈都创建新上下文。
- `playBattleSound()` 在 ready / release / impact / enemyReady / enemyImpact 五个视觉节点合成轻量音色。
- 音色由主题基础频率、波形和妖怪 / 武器属性共同决定；音量保持低于答题反馈音。

## v26.0 冒险状态与兼容

- `js/adventure-system.js` 负责玩家 `profile`、可用积分 `coins`、`owned` 装备库、剧情、地图、钥匙、宝石和塔门。
- 新状态作为 `adventure` 字段写入原 `mathSpeedTrainer_<userId>` 数据；不更换旧存档键。
- 旧存档没有 `adventure` 时自动迁移：可用积分等于原累计总分；原总分达到 500 的玩家获得一把铜钥匙以保留旧塔资格。
- 所有总分奖励点同时调用 `AdventureSystem.creditCoins()`，购买只扣 `coins`，不扣 `stats.totalScore`。
- `UserManager` 的用户摘要保存资料副本，角色编辑保存后同步姓名与首页 / 战斗组合立绘。

## v26.0 战斗与塔

- `BattleMode.executeMoveAnimation()` 优先路由到 `performEquippedAttack()`；剑为突进挥砍，弓和法杖从武器层发射，战锤为蓄力砸击。
- `performEquippedAttack()` 只在命中帧调用原伤害回调；题目、伤害值和连击逻辑不变。
- `monsterAttack()` 将盾牌、闪避和扣血逻辑移动到 `enemyAttackAnimation()` 的碰撞回调内。
- `TOWER_COOLDOWN_MS` 为 0；`AdventureSystem.towerGateRequirement()` 定义关键楼层门槛，门只在首次开启时消耗道具。
- 每个塔层奖励 `20 + floor × 5` 可用积分，10 / 20 / 29 层额外奖励宝石；原卡牌奖励继续保留。
