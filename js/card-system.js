/**
 * card-system.js - Card drop logic, collection, animations, card gallery
 */

// ===== Card Collection Storage =====

BattleMode.getCardCollection = function() {
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) return [];
    const key = 'cardCollection_' + currentUser.id;
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Failed to load card collection', e);
        return [];
    }
};

BattleMode.saveCardCollection = function(col) {
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) return;
    const key = 'cardCollection_' + currentUser.id;
    try {
        localStorage.setItem(key, JSON.stringify(col));
    } catch (e) {
        console.error('Failed to save card collection', e);
    }
};

// ===== Card Drop Logic =====

BattleMode.tryDropCard = function() {
    const battle = App.battle;
    const monster = battle.currentMonster;
    const isBoss = monster && monster.hp >= 8;

    // Calculate drop chance
    let dropChance = CardData.dropRates[battle.difficulty] || 0.15;

    // Bonuses
    if (battle.noDamageOnCurrentMonster) dropChance += 0.05;
    if (battle.combo >= 5) dropChance += 0.03;
    if (battle.activeItem && battle.activeItem?.effect?.itemDropUp) dropChance += 0.02;

    // Boss guaranteed at least R
    if (isBoss) dropChance = 1.0;

    // Pity: 10 consecutive no-drops = guaranteed drop
    if (battle.cardDropCount >= 10) dropChance = 1.0;

    if (Math.random() < dropChance) {
        const rarity = this.rollCardRarity(isBoss);
        const card = this.getCardForRarity(rarity, battle.module);

        if (card) {
            // Add to collection
            const col = this.getCardCollection();
            if (!col.includes(card.id)) {
                col.push(card.id);
                this.saveCardCollection(col);
            }

            // Reset pity counter
            battle.cardDropCount = 0;

            // Show animation
            this.showCardDropAnimation(card);

            // Check achievements
            this.checkCardAchievements();
        }
    } else {
        battle.cardDropCount++;
    }
};

// ===== Roll Card Rarity =====

BattleMode.rollCardRarity = function(isBoss) {
    const weights = isBoss ? CardData.bossRarityWeights : CardData.rarityWeights;
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;

    for (const [rarity, weight] of Object.entries(weights)) {
        random -= weight;
        if (random <= 0) return rarity;
    }
    return 'N';
};

// ===== Get Card for Rarity =====

BattleMode.getCardForRarity = function(rarity, module) {
    const col = this.getCardCollection();

    // Get cards of this rarity, prefer current module
    const moduleCards = CardData.cards.filter(c => c.rarity === rarity && c.module === module && !col.includes(c.id));
    const crossCards = CardData.cards.filter(c => c.rarity === rarity && c.module === 'cross' && !col.includes(c.id));
    const otherCards = CardData.cards.filter(c => c.rarity === rarity && c.module !== module && c.module !== 'cross' && !col.includes(c.id));

    // Priority: uncollected module cards > uncollected cross cards > uncollected other > any of rarity
    const pool = [...moduleCards, ...crossCards, ...otherCards];

    if (pool.length > 0) {
        return pool[Math.floor(Math.random() * pool.length)];
    }

    // All collected for this rarity, return random (duplicate)
    const allOfRarity = CardData.cards.filter(c => c.rarity === rarity);
    if (allOfRarity.length > 0) {
        return allOfRarity[Math.floor(Math.random() * allOfRarity.length)];
    }

    return null;
};

// ===== Card Drop Animation =====

BattleMode.showCardDropAnimation = function(card) {
    if (!card) return;

    const rarityConfig = CardData.rarityConfig[card.rarity] || CardData.rarityConfig.N;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'card-drop-overlay';
    overlay.innerHTML = `
        <div class="card-drop-container">
            <div class="card-drop-card rarity-${card.rarity}">
                <div class="card-face card-back">
                    <div class="card-back-pattern">🃏</div>
                </div>
                <div class="card-face card-front">
                    <div class="card-rarity-badge" style="background: ${rarityConfig.color}">${rarityConfig.name}</div>
                    <div class="card-drop-emoji">${card.emoji}</div>
                    <div class="card-drop-name">${card.name}</div>
                    <div class="card-drop-flavor">${card.flavor || ''}</div>
                </div>
            </div>
            <div class="card-drop-label">
                <span class="card-drop-rarity" style="color: ${rarityConfig.color}">${rarityConfig.label}</span>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Play sound
    playSound('cardDrop');

    // Animation sequence
    // 1. Fly out from center (0.3s)
    setTimeout(() => overlay.classList.add('show'), 50);

    // 2. Flip card (0.5s)
    setTimeout(() => {
        overlay.querySelector('.card-drop-card')?.classList.add('flipped');
        playSound('cardFlip');
    }, 400);

    // 3. Rarity glow effect
    setTimeout(() => {
        overlay.querySelector('.card-drop-card')?.classList.add('glow');

        // Special effects by rarity
        if (card.rarity === 'SR') {
            if (typeof createCardRevealEffect === 'function') {
                createCardRevealEffect('SR', window.innerWidth / 2, window.innerHeight / 2);
            }
        } else if (card.rarity === 'SSR') {
            createConfetti(30);
            const screenFlash = document.getElementById('screen-flash');
            if (screenFlash) {
                screenFlash.style.background = 'rgba(255, 215, 0, 0.3)';
                screenFlash.classList.add('show');
                setTimeout(() => {
                    screenFlash.classList.remove('show');
                    screenFlash.style.background = '';
                }, 300);
            }
        } else if (card.rarity === 'UR') {
            createConfetti(50);
            overlay.classList.add('ur-reveal');
        }
    }, 900);

    // 4. Show label (0.5s)
    setTimeout(() => {
        overlay.querySelector('.card-drop-label')?.classList.add('show');
    }, 1400);

    // 5. Auto-close after delay (tap to close early)
    const closeDelay = card.rarity === 'UR' ? 4000 : (card.rarity === 'SSR' ? 3000 : 2000);

    overlay.addEventListener('click', () => {
        overlay.classList.add('closing');
        setTimeout(() => overlay.remove(), 500);
    });

    setTimeout(() => {
        if (overlay.parentElement) {
            overlay.classList.add('closing');
            setTimeout(() => overlay.remove(), 500);
        }
    }, closeDelay);
};

// ===== Open Card Collection Page =====

BattleMode.openCardCollection = function() {
    showPage('card-collection');
    this.renderCardGrid('all');
    this.updateCardCollectionProgress();
};

// ===== Update Collection Progress =====

BattleMode.updateCardCollectionProgress = function() {
    const col = this.getCardCollection();
    const total = CardData.getTotalCount();
    const collected = col.length;
    const percent = Math.round((collected / total) * 100);

    const progressEl = document.getElementById('card-collection-progress');
    if (progressEl) {
        progressEl.textContent = `${collected}/${total}`;
    }

    const progressBar = document.getElementById('card-progress-fill');
    if (progressBar) {
        progressBar.style.width = percent + '%';
    }
};

// ===== Render Card Grid =====

BattleMode.renderCardGrid = function(filter) {
    const grid = document.getElementById('card-grid');
    if (!grid) return;

    const col = this.getCardCollection();
    let cards = CardData.cards;

    if (filter && filter !== 'all') {
        cards = cards.filter(c => c.rarity === filter);
    }

    grid.innerHTML = cards.map(card => {
        const isCollected = col.includes(card.id);
        const rarityConfig = CardData.rarityConfig[card.rarity] || CardData.rarityConfig.N;

        return `
            <div class="card-grid-item ${isCollected ? 'collected' : 'locked'} rarity-${card.rarity}"
                 data-card-id="${card.id}"
                 ${isCollected ? `onclick="BattleMode.showCardDetail('${card.id}')"` : ''}>
                <div class="card-grid-emoji">${isCollected ? card.emoji : '❓'}</div>
                <div class="card-grid-name">${isCollected ? card.name : '???'}</div>
                <div class="card-grid-rarity" style="color: ${rarityConfig.color}">${rarityConfig.name}</div>
            </div>
        `;
    }).join('');
};

// ===== Show Card Detail =====

BattleMode.showCardDetail = function(cardId) {
    const card = CardData.getCardById(cardId);
    if (!card) return;

    const rarityConfig = CardData.rarityConfig[card.rarity] || CardData.rarityConfig.N;

    const detail = document.getElementById('card-detail-modal');
    if (!detail) return;

    detail.innerHTML = `
        <div class="card-detail-overlay" onclick="this.parentElement.classList.remove('show')"></div>
        <div class="card-detail-content rarity-${card.rarity}">
            <div class="card-detail-header" style="border-color: ${rarityConfig.borderColor}">
                <span class="card-detail-rarity" style="background: ${rarityConfig.color}">${rarityConfig.label}</span>
                <button class="card-detail-close" onclick="document.getElementById('card-detail-modal').classList.remove('show')">&times;</button>
            </div>
            <div class="card-detail-emoji" style="box-shadow: ${rarityConfig.glow}">${card.emoji}</div>
            <h3 class="card-detail-name">${card.name}</h3>
            <p class="card-detail-flavor">"${card.flavor}"</p>
            <p class="card-detail-desc">${card.desc}</p>
            ${card.effect ? `<div class="card-detail-effect">✨ 效果: ${this._describeEffect(card.effect)}</div>` : ''}
            <div class="card-detail-id">${card.id}</div>
        </div>
    `;

    detail.classList.add('show');
};

BattleMode._describeEffect = function(effect) {
    if (!effect) return '';
    switch (effect.type) {
        case 'weaponBoost': return `武器伤害+${effect.bonus}`;
        case 'comboTrigger': return `${effect.threshold}连击时触发特效`;
        case 'startShield': return `开局获得${effect.value}层护盾`;
        case 'bonusDamage': return `特定条件下伤害+${effect.bonus}`;
        case 'scoreBoost': return `积分×${effect.value}`;
        case 'hintChance': return `${Math.round(effect.value * 100)}%概率显示提示`;
        case 'speedBoost': return '答题速度加成';
        case 'dodgeChance': return `${Math.round(effect.value * 100)}%闪避攻击`;
        case 'reviveChance': return `${Math.round(effect.value * 100)}%死而复生`;
        case 'allBoost': return `全属性×${effect.value}`;
        case 'dropBoost': return `掉率+${Math.round(effect.value * 100)}%`;
        case 'collectionBoost': return '图鉴收集加速';
        default: return '特殊效果';
    }
};

// ===== Check Card Achievements =====

BattleMode.checkCardAchievements = function() {
    const col = this.getCardCollection();
    const achievements = App.stats.achievements;
    const total = CardData.getTotalCount();

    const checks = [
        { id: 'card_first', condition: col.length >= 1 },
        { id: 'card_10', condition: col.length >= 10 },
        { id: 'card_50', condition: col.length >= 50 },
        { id: 'card_100', condition: col.length >= 100 },
        { id: 'card_all', condition: col.length >= total }
    ];

    // Check rarity achievements
    const hasRarity = (r) => col.some(id => {
        const c = CardData.getCardById(id);
        return c && c.rarity === r;
    });

    checks.push({ id: 'card_sr', condition: hasRarity('SR') });
    checks.push({ id: 'card_ssr', condition: hasRarity('SSR') });
    checks.push({ id: 'card_ur', condition: hasRarity('UR') });

    for (const check of checks) {
        if (check.condition && !achievements.includes(check.id)) {
            achievements.push(check.id);
            saveProgress();
            const ach = MathData.achievements.find(a => a.id === check.id);
            if (ach) {
                setTimeout(() => showAchievement(ach), 2500);
            }
        }
    }
};

// ===== Card Count Display for Battle Header =====

BattleMode.getCardCount = function() {
    return this.getCardCollection().length;
};
