/**
 * card-system.js - Card drop logic, collection, animations, card gallery
 * Major rewrite: crystal system, multi-dimensional filters, immersive detail view
 */

// ===== Element & Category Constants =====

BattleMode.ELEMENTS = {
    fire:    { name: '火', emoji: '🔥', color: '#e74c3c' },
    ice:     { name: '冰', emoji: '❄️', color: '#3498db' },
    poison:  { name: '毒', emoji: '🧪', color: '#27ae60' },
    dark:    { name: '暗', emoji: '🌑', color: '#2c3e50' },
    holy:    { name: '圣', emoji: '✨', color: '#f1c40f' },
    thunder: { name: '雷', emoji: '⚡', color: '#9b59b6' },
    earth:   { name: '地', emoji: '🪨', color: '#8b4513' },
    wind:    { name: '风', emoji: '🌿', color: '#27ae60' }
};

BattleMode.CATEGORIES = {
    knowledge: { name: '知识卡', icon: '📖' },
    monster:   { name: '怪物卡', icon: '👾' },
    spell:     { name: '法术卡', icon: '✨' },
    legend:    { name: '传说卡', icon: '👑' },
    mythic:    { name: '神话卡', icon: '💎' }
};

// ===== Crystal System =====

BattleMode.CRYSTAL_RATES = { N: 1, R: 3, SR: 10, SSR: 30, UR: 100 };

BattleMode.getCrystals = function() {
    var currentUser = UserManager.getCurrentUser();
    if (!currentUser) return 0;
    var key = 'mathCrystal_' + currentUser.id;
    try {
        var val = localStorage.getItem(key);
        return val ? parseInt(val, 10) || 0 : 0;
    } catch (e) {
        return 0;
    }
};

BattleMode.addCrystals = function(amount) {
    var currentUser = UserManager.getCurrentUser();
    if (!currentUser || amount <= 0) return;
    var key = 'mathCrystal_' + currentUser.id;
    var current = this.getCrystals();
    try {
        localStorage.setItem(key, String(current + amount));
    } catch (e) {
        console.error('Failed to save crystals', e);
    }
};

BattleMode.spendCrystals = function(amount) {
    var currentUser = UserManager.getCurrentUser();
    if (!currentUser || amount <= 0) return false;
    var current = this.getCrystals();
    if (current < amount) return false;
    var key = 'mathCrystal_' + currentUser.id;
    try {
        localStorage.setItem(key, String(current - amount));
        return true;
    } catch (e) {
        console.error('Failed to spend crystals', e);
        return false;
    }
};

// ===== Module Info Map =====

BattleMode.MODULE_INFO = {
    xiaojiujiu: { name: '小九九',   icon: '🔢', color: '#e74c3c' },
    times:      { name: '大九九',   icon: '📊', color: '#3498db' },
    multiply:   { name: '乘法速记', icon: '⚡', color: '#f39c12' },
    fraction:   { name: '分数',     icon: '📐', color: '#9b59b6' },
    decimal:    { name: '小数',     icon: '🔸', color: '#2ecc71' },
    unit:       { name: '单位换算', icon: '📏', color: '#e67e22' },
    cross:      { name: '跨模块',   icon: '🌟', color: '#1abc9c' },
    tower:      { name: '塔防',     icon: '🏰', color: '#8e44ad' }
};

// ===== Multi-Dimensional Filter State =====

BattleMode.cardFilters = {
    module: 'all',   // 'all'|module key
    rarity: 'all',   // 'all'|'N'|'R'|'SR'|'SSR'|'UR'
    status: 'all'    // 'all'|'collected'|'missing'|'new'
};

// ===== Collection Storage (new format with migration) =====

BattleMode.migrateCardCollection = function(col) {
    if (col.length > 0 && typeof col[0] === 'string') {
        return col.map(function(id) {
            return { id: id, obtainedAt: Date.now(), viewed: true };
        });
    }
    return col;
};

BattleMode.getCardCollection = function() {
    var currentUser = UserManager.getCurrentUser();
    if (!currentUser) return [];
    var key = 'cardCollection_' + currentUser.id;
    try {
        var data = localStorage.getItem(key);
        if (!data) return [];
        var col = JSON.parse(data);
        if (!Array.isArray(col)) return [];
        // Migrate old format if needed
        var migrated = BattleMode.migrateCardCollection(col);
        if (migrated !== col) {
            // Save migrated format back
            localStorage.setItem(key, JSON.stringify(migrated));
        }
        return migrated;
    } catch (e) {
        console.error('Failed to load card collection', e);
        return [];
    }
};

BattleMode.saveCardCollection = function(col) {
    var currentUser = UserManager.getCurrentUser();
    if (!currentUser) return;
    var key = 'cardCollection_' + currentUser.id;
    try {
        localStorage.setItem(key, JSON.stringify(col));
    } catch (e) {
        console.error('Failed to save card collection', e);
    }
};

// Helper: check if card is collected (by id)
BattleMode._isCardCollected = function(cardId, col) {
    return col.some(function(entry) { return entry.id === cardId; });
};

// Helper: get collection entry for a card
BattleMode._getCollectionEntry = function(cardId, col) {
    for (var i = 0; i < col.length; i++) {
        if (col[i].id === cardId) return col[i];
    }
    return null;
};

// ===== Card Drop Logic (enhanced with crystal conversion) =====

BattleMode.tryDropCard = function() {
    var battle = App.battle;
    var monster = battle.currentMonster;
    var isBoss = monster && monster.hp >= 8;

    // Calculate drop chance
    var dropChance = CardData.dropRates[battle.difficulty] || 0.15;

    // Bonuses
    if (battle.noDamageOnCurrentMonster) dropChance += 0.05;
    if (battle.combo >= 5) dropChance += 0.03;
    if (battle.activeItem && battle.activeItem.effect && battle.activeItem.effect.itemDropUp) dropChance += 0.02;

    // Boss guaranteed at least R
    if (isBoss) dropChance = 1.0;

    // Pity: 10 consecutive no-drops = guaranteed drop
    if (battle.cardDropCount >= 10) dropChance = 1.0;

    if (Math.random() < dropChance) {
        var rarity = this.rollCardRarity(isBoss);
        var card = this.getCardForRarity(rarity, battle.module);

        if (card) {
            var col = this.getCardCollection();
            var isDuplicate = this._isCardCollected(card.id, col);

            if (isDuplicate) {
                // Convert duplicate to crystals
                var crystalAmount = this.CRYSTAL_RATES[card.rarity] || 1;
                this.addCrystals(crystalAmount);

                // Reset pity counter
                battle.cardDropCount = 0;

                // Show crystal animation
                this._showCrystalDropAnimation(card, crystalAmount);
            } else {
                // Add to collection (new format)
                col.push({ id: card.id, obtainedAt: Date.now(), viewed: false });
                this.saveCardCollection(col);

                // Reset pity counter
                battle.cardDropCount = 0;

                // Show animation
                this.showCardDropAnimation(card);

                // Check achievements
                this.checkCardAchievements();
            }
        }
    } else {
        battle.cardDropCount++;
    }
};

// ===== Roll Card Rarity (unchanged) =====

BattleMode.rollCardRarity = function(isBoss) {
    var weights = isBoss ? CardData.bossRarityWeights : CardData.rarityWeights;
    var totalWeight = 0;
    var entries = Object.entries(weights);
    for (var i = 0; i < entries.length; i++) {
        totalWeight += entries[i][1];
    }
    var random = Math.random() * totalWeight;

    for (var j = 0; j < entries.length; j++) {
        random -= entries[j][1];
        if (random <= 0) return entries[j][0];
    }
    return 'N';
};

// ===== Get Card for Rarity (updated for new collection format) =====

BattleMode.getCardForRarity = function(rarity, module) {
    var col = this.getCardCollection();
    var collectedIds = col.map(function(entry) { return entry.id; });

    // Get cards of this rarity, prefer current module
    var moduleCards = CardData.cards.filter(function(c) {
        return c.rarity === rarity && c.module === module && collectedIds.indexOf(c.id) === -1;
    });
    var crossCards = CardData.cards.filter(function(c) {
        return c.rarity === rarity && c.module === 'cross' && collectedIds.indexOf(c.id) === -1;
    });
    var otherCards = CardData.cards.filter(function(c) {
        return c.rarity === rarity && c.module !== module && c.module !== 'cross' && collectedIds.indexOf(c.id) === -1;
    });

    // Priority: uncollected module cards > uncollected cross cards > uncollected other > any of rarity
    var pool = moduleCards.concat(crossCards, otherCards);

    if (pool.length > 0) {
        return pool[Math.floor(Math.random() * pool.length)];
    }

    // All collected for this rarity, return random (duplicate)
    var allOfRarity = CardData.cards.filter(function(c) { return c.rarity === rarity; });
    if (allOfRarity.length > 0) {
        return allOfRarity[Math.floor(Math.random() * allOfRarity.length)];
    }

    return null;
};

// ===== Crystal Drop Animation =====

BattleMode._showCrystalDropAnimation = function(card, crystalAmount) {
    if (!card) return;
    var rarityConfig = CardData.rarityConfig[card.rarity] || CardData.rarityConfig.N;

    var overlay = document.createElement('div');
    overlay.className = 'card-drop-overlay';
    overlay.innerHTML =
        '<div class="card-drop-container">' +
            '<div class="card-drop-card rarity-' + card.rarity + ' crystal-convert">' +
                '<div class="card-face card-back">' +
                    '<div class="card-back-pattern">🃏</div>' +
                '</div>' +
                '<div class="card-face card-front">' +
                    '<div class="card-rarity-badge" style="background: ' + rarityConfig.color + '">' + rarityConfig.name + '</div>' +
                    '<div class="card-drop-emoji">' + card.emoji + '</div>' +
                    '<div class="card-drop-name">' + card.name + '</div>' +
                    '<div class="card-drop-flavor" style="color: #aaa; font-size: 0.85em;">已拥有 - 转化为水晶</div>' +
                '</div>' +
            '</div>' +
            '<div class="card-drop-label">' +
                '<span class="card-drop-crystal">+' + crystalAmount + ' 💎</span>' +
            '</div>' +
        '</div>';

    document.body.appendChild(overlay);
    playSound('cardDrop');

    setTimeout(function() { overlay.classList.add('show'); }, 50);

    setTimeout(function() {
        var cardEl = overlay.querySelector('.card-drop-card');
        if (cardEl) cardEl.classList.add('flipped');
        playSound('cardFlip');
    }, 400);

    setTimeout(function() {
        var cardEl = overlay.querySelector('.card-drop-card');
        if (cardEl) cardEl.classList.add('glow');
    }, 900);

    setTimeout(function() {
        var labelEl = overlay.querySelector('.card-drop-label');
        if (labelEl) labelEl.classList.add('show');
    }, 1400);

    overlay.addEventListener('click', function() {
        overlay.classList.add('closing');
        setTimeout(function() {
            if (overlay.parentElement) overlay.remove();
        }, 500);
    });

    setTimeout(function() {
        if (overlay.parentElement) {
            overlay.classList.add('closing');
            setTimeout(function() {
                if (overlay.parentElement) overlay.remove();
            }, 500);
        }
    }, 2000);
};

// ===== Card Drop Animation (enhanced rarity effects) =====

BattleMode.showCardDropAnimation = function(card) {
    if (!card) return;

    var rarityConfig = CardData.rarityConfig[card.rarity] || CardData.rarityConfig.N;

    // Create overlay
    var overlay = document.createElement('div');
    overlay.className = 'card-drop-overlay';
    overlay.innerHTML =
        '<div class="card-drop-container">' +
            '<div class="card-drop-card rarity-' + card.rarity + '">' +
                '<div class="card-face card-back">' +
                    '<div class="card-back-pattern">🃏</div>' +
                '</div>' +
                '<div class="card-face card-front">' +
                    '<div class="card-rarity-badge" style="background: ' + rarityConfig.color + '">' + rarityConfig.name + '</div>' +
                    '<div class="card-drop-emoji">' + card.emoji + '</div>' +
                    '<div class="card-drop-name">' + card.name + '</div>' +
                    '<div class="card-drop-flavor">' + (card.flavor || '') + '</div>' +
                '</div>' +
            '</div>' +
            '<div class="card-drop-label">' +
                '<span class="card-drop-rarity" style="color: ' + rarityConfig.color + '">' + rarityConfig.label + '</span>' +
            '</div>' +
        '</div>';

    document.body.appendChild(overlay);

    // Play sound
    playSound('cardDrop');

    // Animation sequence
    // 1. Fly out from center (0.3s)
    setTimeout(function() { overlay.classList.add('show'); }, 50);

    // 2. Flip card (0.5s)
    setTimeout(function() {
        var cardEl = overlay.querySelector('.card-drop-card');
        if (cardEl) cardEl.classList.add('flipped');
        playSound('cardFlip');
    }, 400);

    // 3. Rarity glow effect
    setTimeout(function() {
        var cardEl = overlay.querySelector('.card-drop-card');
        if (cardEl) cardEl.classList.add('glow');

        // Special effects by rarity
        if (card.rarity === 'R') {
            // Subtle blue shimmer for R cards
            if (typeof createCardRevealEffect === 'function') {
                createCardRevealEffect('R', window.innerWidth / 2, window.innerHeight / 2);
            }
        } else if (card.rarity === 'SR') {
            if (typeof createCardRevealEffect === 'function') {
                createCardRevealEffect('SR', window.innerWidth / 2, window.innerHeight / 2);
            }
        } else if (card.rarity === 'SSR') {
            if (typeof createConfetti === 'function') createConfetti(30);
            var screenFlash = document.getElementById('screen-flash');
            if (screenFlash) {
                screenFlash.style.background = 'rgba(255, 215, 0, 0.3)';
                screenFlash.classList.add('show');
                setTimeout(function() {
                    screenFlash.classList.remove('show');
                    screenFlash.style.background = '';
                }, 300);
            }
        } else if (card.rarity === 'UR') {
            if (typeof createConfetti === 'function') createConfetti(50);
            overlay.classList.add('ur-reveal');
            // Extra screen flash for UR
            var screenFlash2 = document.getElementById('screen-flash');
            if (screenFlash2) {
                screenFlash2.style.background = 'rgba(231, 76, 60, 0.4)';
                screenFlash2.classList.add('show');
                setTimeout(function() {
                    screenFlash2.classList.remove('show');
                    screenFlash2.style.background = '';
                }, 500);
            }
        }
    }, 900);

    // 4. Show label
    setTimeout(function() {
        var labelEl = overlay.querySelector('.card-drop-label');
        if (labelEl) labelEl.classList.add('show');
    }, 1400);

    // 5. Auto-close after delay (tap to close early)
    var closeDelay = card.rarity === 'UR' ? 4000 : (card.rarity === 'SSR' ? 3000 : 2000);

    overlay.addEventListener('click', function() {
        overlay.classList.add('closing');
        setTimeout(function() {
            if (overlay.parentElement) overlay.remove();
        }, 500);
    });

    setTimeout(function() {
        if (overlay.parentElement) {
            overlay.classList.add('closing');
            setTimeout(function() {
                if (overlay.parentElement) overlay.remove();
            }, 500);
        }
    }, closeDelay);
};

// ===== Series Progress =====

BattleMode.getSeriesProgress = function(module) {
    var col = this.getCardCollection();
    var collectedIds = col.map(function(entry) { return entry.id; });
    var totalCards = CardData.cards.filter(function(c) { return c.module === module; });
    var collectedCards = totalCards.filter(function(c) { return collectedIds.indexOf(c.id) !== -1; });
    var total = totalCards.length;
    var collected = collectedCards.length;
    var percentage = total > 0 ? Math.round((collected / total) * 100) : 0;
    return { collected: collected, total: total, percentage: percentage };
};

// ===== Open Card Collection Page (enhanced) =====

BattleMode.openCardCollection = function() {
    showPage('card-collection');

    // Reset filters
    this.cardFilters = { module: 'all', rarity: 'all', status: 'all' };

    // Render all filter rows into the card-filter-tabs area
    var filterContainer = document.querySelector('.card-filter-tabs');
    if (filterContainer) {
        filterContainer.innerHTML = '';
        // Module filters
        var moduleRow = document.createElement('div');
        moduleRow.className = 'card-filter-row card-filter-modules';
        moduleRow.id = 'card-filter-modules';
        filterContainer.appendChild(moduleRow);
        this.renderModuleFilters();

        // Rarity filters
        var rarityRow = document.createElement('div');
        rarityRow.className = 'card-filter-row card-filter-rarities';
        rarityRow.id = 'card-filter-rarities';
        filterContainer.appendChild(rarityRow);
        this._renderRarityFilters();

        // Status filters
        var statusRow = document.createElement('div');
        statusRow.className = 'card-filter-row card-filter-statuses';
        statusRow.id = 'card-filter-statuses';
        filterContainer.appendChild(statusRow);
        this.renderStatusFilters();
    }

    // Crystal display
    this._renderCrystalDisplay();

    this.renderCardGrid();
    this.updateCardCollectionProgress();
};

// ===== Render Crystal Display =====

BattleMode._renderCrystalDisplay = function() {
    var header = document.querySelector('.card-collection-header');
    if (!header) return;

    // Remove existing crystal display
    var existing = header.querySelector('.crystal-display');
    if (existing) existing.remove();

    var crystals = this.getCrystals();
    var div = document.createElement('div');
    div.className = 'crystal-display';
    div.innerHTML = '💎 <span class="crystal-count">' + crystals + '</span>';
    div.style.cssText = 'font-size: 0.95em; color: #a78bfa; margin-top: 4px;';
    header.appendChild(div);
};

// ===== Module Filter Row =====

BattleMode.renderModuleFilters = function() {
    var self = this;
    var container = document.getElementById('card-filter-modules');
    if (!container) return;

    var col = this.getCardCollection();
    var collectedIds = col.map(function(entry) { return entry.id; });
    var modules = ['all', 'xiaojiujiu', 'times', 'multiply', 'fraction', 'decimal', 'unit', 'cross', 'tower'];

    var html = '';
    for (var i = 0; i < modules.length; i++) {
        var mod = modules[i];
        var isActive = self.cardFilters.module === mod;
        var info = mod === 'all' ? { name: '全部', icon: '📋', color: '#888' } : (self.MODULE_INFO[mod] || { name: mod, icon: '❓', color: '#888' });

        var count = '';
        if (mod === 'all') {
            count = collectedIds.length + '/' + CardData.cards.length;
        } else {
            var progress = self.getSeriesProgress(mod);
            count = progress.collected + '/' + progress.total;
        }

        html += '<button class="module-filter-btn' + (isActive ? ' active' : '') + '" data-module="' + mod + '" ' +
            'style="' + (isActive ? 'border-color:' + info.color + '; color:' + info.color + ';' : '') + '">' +
            '<span class="module-filter-icon">' + info.icon + '</span>' +
            '<span class="module-filter-count">' + count + '</span>' +
            '</button>';
    }
    container.innerHTML = html;

    // Bind events
    container.querySelectorAll('.module-filter-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            self.cardFilters.module = btn.dataset.module;
            self.renderModuleFilters();
            self.renderCardGrid();
        });
    });
};

// ===== Rarity Filter Row =====

BattleMode._renderRarityFilters = function() {
    var self = this;
    var container = document.getElementById('card-filter-rarities');
    if (!container) return;

    var rarities = ['all', 'N', 'R', 'SR', 'SSR', 'UR'];
    var labels = { all: '全部', N: 'N', R: 'R', SR: 'SR', SSR: 'SSR', UR: 'UR' };

    var html = '';
    for (var i = 0; i < rarities.length; i++) {
        var r = rarities[i];
        var isActive = self.cardFilters.rarity === r;
        var cfg = r === 'all' ? { color: '#888' } : (CardData.rarityConfig[r] || { color: '#888' });

        html += '<button class="rarity-filter-btn' + (isActive ? ' active' : '') + '" data-rarity="' + r + '" ' +
            'style="' + (isActive ? 'border-color:' + cfg.color + '; color:' + cfg.color + ';' : '') + '">' +
            labels[r] +
            '</button>';
    }
    container.innerHTML = html;

    container.querySelectorAll('.rarity-filter-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            self.cardFilters.rarity = btn.dataset.rarity;
            self._renderRarityFilters();
            self.renderCardGrid();
        });
    });
};

// ===== Status Filter Row =====

BattleMode.renderStatusFilters = function() {
    var self = this;
    var container = document.getElementById('card-filter-statuses');
    if (!container) return;

    var statuses = [
        { key: 'all', label: '全部' },
        { key: 'collected', label: '已收集' },
        { key: 'missing', label: '未收集' },
        { key: 'new', label: '新卡' }
    ];

    var html = '';
    for (var i = 0; i < statuses.length; i++) {
        var s = statuses[i];
        var isActive = self.cardFilters.status === s.key;
        html += '<button class="status-filter-btn' + (isActive ? ' active' : '') + '" data-status="' + s.key + '">' +
            s.label +
            '</button>';
    }
    container.innerHTML = html;

    container.querySelectorAll('.status-filter-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            self.cardFilters.status = btn.dataset.status;
            self.renderStatusFilters();
            self.renderCardGrid();
        });
    });
};

// ===== Render Card Grid (major rewrite with multi-filter) =====

BattleMode.renderCardGrid = function(filterOverride) {
    var grid = document.getElementById('card-grid');
    if (!grid) return;

    var col = this.getCardCollection();
    var collectedIds = col.map(function(entry) { return entry.id; });
    var cards = CardData.cards;

    // Determine active filters
    var filters;
    if (typeof filterOverride === 'string') {
        // Backward compatibility: string = rarity filter
        if (filterOverride === 'all') {
            filters = { module: 'all', rarity: 'all', status: 'all' };
        } else {
            filters = { module: 'all', rarity: filterOverride, status: 'all' };
        }
    } else if (filterOverride && typeof filterOverride === 'object') {
        filters = filterOverride;
    } else {
        filters = this.cardFilters;
    }

    // Apply module filter
    if (filters.module && filters.module !== 'all') {
        cards = cards.filter(function(c) { return c.module === filters.module; });
    }

    // Apply rarity filter
    if (filters.rarity && filters.rarity !== 'all') {
        cards = cards.filter(function(c) { return c.rarity === filters.rarity; });
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
        if (filters.status === 'collected') {
            cards = cards.filter(function(c) { return collectedIds.indexOf(c.id) !== -1; });
        } else if (filters.status === 'missing') {
            cards = cards.filter(function(c) { return collectedIds.indexOf(c.id) === -1; });
        } else if (filters.status === 'new') {
            cards = cards.filter(function(c) {
                var entry = BattleMode._getCollectionEntry(c.id, col);
                return entry && !entry.viewed;
            });
        }
    }

    if (cards.length === 0) {
        grid.innerHTML = '<div style="text-align:center; padding:40px; color:#888;">没有符合条件的卡牌</div>';
        return;
    }

    var self = this;
    grid.innerHTML = cards.map(function(card) {
        var isCollected = collectedIds.indexOf(card.id) !== -1;
        var entry = self._getCollectionEntry(card.id, col);
        var isNew = entry && !entry.viewed;
        var rarityConfig = CardData.rarityConfig[card.rarity] || CardData.rarityConfig.N;
        var moduleInfo = self.MODULE_INFO[card.module] || { icon: '❓', name: card.module };

        return '<div class="card-grid-item ' + (isCollected ? 'collected' : 'locked') + ' rarity-' + card.rarity + ' module-' + card.module + '" ' +
                'data-card-id="' + card.id + '">' +
            (isNew ? '<div class="card-grid-new">NEW</div>' : '') +
            '<div class="card-grid-emoji">' + (isCollected ? card.emoji : '❓') + '</div>' +
            '<div class="card-grid-name">' + (isCollected ? card.name : '???') + '</div>' +
            '<div class="card-grid-rarity" style="color: ' + rarityConfig.color + '">' + rarityConfig.name + '</div>' +
            '<div class="card-grid-module">' + moduleInfo.icon + '</div>' +
        '</div>';
    }).join('');

    // Bind click events
    grid.querySelectorAll('.card-grid-item.collected').forEach(function(item) {
        item.addEventListener('click', function() {
            var cardId = item.dataset.cardId;
            if (cardId) self.showCardDetail(cardId);
        });
    });
};

// ===== Show Card Detail (immersive full-screen rewrite) =====

BattleMode.showCardDetail = function(cardId) {
    var card = CardData.getCardById(cardId);
    if (!card) return;

    var col = this.getCardCollection();
    var entry = this._getCollectionEntry(cardId, col);

    // Mark as viewed
    if (entry && !entry.viewed) {
        entry.viewed = true;
        this.saveCardCollection(col);
    }

    var rarityConfig = CardData.rarityConfig[card.rarity] || CardData.rarityConfig.N;
    var moduleInfo = this.MODULE_INFO[card.module] || { name: card.module, icon: '❓', color: '#888' };

    // Use moduleThemes from CardData if available, else fallback to MODULE_INFO
    var moduleColor = moduleInfo.color;
    if (typeof CardData.moduleThemes !== 'undefined' && CardData.moduleThemes[card.module]) {
        moduleColor = CardData.moduleThemes[card.module].color || moduleColor;
    }

    // Card number within its module
    var moduleCards = CardData.cards.filter(function(c) { return c.module === card.module; });
    var cardIndex = -1;
    for (var i = 0; i < moduleCards.length; i++) {
        if (moduleCards[i].id === card.id) { cardIndex = i; break; }
    }
    var cardNumber = String(cardIndex + 1).padStart(3, '0');
    var totalInModule = String(moduleCards.length).padStart(3, '0');

    // Series progress
    var seriesProgress = this.getSeriesProgress(card.module);
    var pct = seriesProgress.percentage;

    // Element info
    var elementHtml = '';
    if (card.element && this.ELEMENTS[card.element]) {
        var elem = this.ELEMENTS[card.element];
        elementHtml = '<div class="stat-row">' +
            '<span>属性: ' + elem.emoji + ' ' + elem.name + '</span>' +
        '</div>';
    }

    // Category info
    var categoryLabel = '';
    if (card.category && this.CATEGORIES[card.category]) {
        categoryLabel = this.CATEGORIES[card.category].icon + ' ' + this.CATEGORIES[card.category].name;
    }

    // ATK/DEF stars
    var battleStatsHtml = '';
    if (card.atk || card.def) {
        var atkStars = '';
        var defStars = '';
        for (var a = 0; a < (card.atk || 0); a++) atkStars += '⭐';
        for (var d = 0; d < (card.def || 0); d++) defStars += '⭐';
        battleStatsHtml =
            '<div class="card-detail-section card-detail-stats">' +
                '<h3>⚔️ 战斗属性</h3>' +
                '<div class="stat-row">' +
                    '<span>ATK 攻击力: ' + (atkStars || '—') + '</span>' +
                '</div>' +
                '<div class="stat-row">' +
                    '<span>DEF 防御力: ' + (defStars || '—') + '</span>' +
                '</div>' +
                elementHtml +
            '</div>';
    }

    // Effect description
    var effectHtml = '';
    if (card.effect) {
        effectHtml =
            '<div class="card-detail-section">' +
                '<h3>✨ 卡牌效果</h3>' +
                '<p>' + this._describeEffect(card.effect) + '</p>' +
            '</div>';
    }

    // Math tip (if available)
    var mathTipHtml = '';
    if (card.mathTip) {
        mathTipHtml =
            '<div class="card-detail-section">' +
                '<h3>💡 数学知识</h3>' +
                '<p>' + card.mathTip + '</p>' +
            '</div>';
    }

    // Story section
    var storyHtml = '';
    if (card.story || card.desc) {
        storyHtml =
            '<div class="card-detail-section">' +
                '<h3>📜 背景故事</h3>' +
                '<p>' + (card.story || card.desc) + '</p>' +
            '</div>';
    }

    // Obtain method
    var obtainHtml = '';
    if (card.obtainMethod) {
        obtainHtml =
            '<div class="card-detail-section">' +
                '<h3>🎯 获取方式</h3>' +
                '<p>' + card.obtainMethod + '</p>' +
            '</div>';
    }

    // Related cards (same module, horizontal scroll)
    var collectedIds = col.map(function(e) { return e.id; });
    var relatedCards = moduleCards.filter(function(c) { return c.id !== card.id; });
    var relatedHtml = '';
    if (relatedCards.length > 0) {
        var relatedItems = relatedCards.map(function(rc) {
            var rcCollected = collectedIds.indexOf(rc.id) !== -1;
            var rcRarity = CardData.rarityConfig[rc.rarity] || CardData.rarityConfig.N;
            return '<div class="related-card-item ' + (rcCollected ? 'collected' : 'locked') + ' rarity-' + rc.rarity + '" ' +
                'data-related-id="' + rc.id + '">' +
                '<div class="related-card-emoji">' + (rcCollected ? rc.emoji : '❓') + '</div>' +
                '<div class="related-card-name">' + (rcCollected ? rc.name : '???') + '</div>' +
                '<div class="related-card-rarity" style="color:' + rcRarity.color + '">' + rcRarity.name + '</div>' +
            '</div>';
        }).join('');

        relatedHtml =
            '<div class="card-detail-section">' +
                '<h3>同系列卡牌</h3>' +
                '<div class="related-cards-scroll">' + relatedItems + '</div>' +
            '</div>';
    }

    // Obtained date
    var obtainedDate = '';
    if (entry && entry.obtainedAt) {
        var d = new Date(entry.obtainedAt);
        obtainedDate = d.getFullYear() + '-' +
            String(d.getMonth() + 1).padStart(2, '0') + '-' +
            String(d.getDate()).padStart(2, '0');
    }

    // Build full-screen detail
    var detailEl = document.getElementById('card-detail-modal');
    if (!detailEl) return;

    detailEl.innerHTML =
        '<div class="card-detail-fullscreen show">' +
            '<div class="card-detail-header">' +
                '<button class="card-detail-back">← 返回</button>' +
                '<span class="card-detail-number">#' + cardNumber + '/' + totalInModule + '</span>' +
            '</div>' +

            '<div class="card-detail-preview">' +
                '<div class="card-preview rarity-' + card.rarity + ' module-' + card.module + '" style="box-shadow: ' + rarityConfig.glow + '">' +
                    '<div class="card-preview-emoji">' + card.emoji + '</div>' +
                '</div>' +
            '</div>' +

            '<div class="card-detail-info">' +
                '<h2 class="card-detail-name">' + card.name + '</h2>' +
                (card.flavor ? '<p class="card-detail-flavor">"' + card.flavor + '"</p>' : '') +
                '<div class="card-detail-tags">' +
                    '<span class="tag-rarity rarity-' + card.rarity + '" style="background:' + rarityConfig.color + '; color:#fff; padding:2px 10px; border-radius:12px;">' + rarityConfig.label + '</span>' +
                    (categoryLabel ? '<span class="tag-category" style="padding:2px 10px; border-radius:12px; background:#333; color:#ddd;">' + categoryLabel + '</span>' : '') +
                    '<span class="tag-module" style="background:' + moduleColor + '; color:#fff; padding:2px 10px; border-radius:12px;">' + moduleInfo.icon + ' ' + moduleInfo.name + '</span>' +
                '</div>' +

                storyHtml +
                mathTipHtml +
                battleStatsHtml +
                effectHtml +
                obtainHtml +

                '<div class="card-detail-section">' +
                    '<h3>📦 所属系列</h3>' +
                    '<div class="series-progress">' +
                        '<span>' + moduleInfo.icon + ' ' + moduleInfo.name + '</span>' +
                        '<div class="progress-bar" style="flex:1; height:8px; background:#333; border-radius:4px; margin:0 10px; overflow:hidden;">' +
                            '<div class="progress-fill" style="width:' + pct + '%; height:100%; background:' + moduleColor + '; border-radius:4px; transition:width 0.3s;"></div>' +
                        '</div>' +
                        '<span>' + seriesProgress.collected + '/' + seriesProgress.total + '</span>' +
                    '</div>' +
                '</div>' +

                relatedHtml +

                (obtainedDate ?
                    '<div class="card-detail-footer" style="text-align:center; color:#888; padding:16px 0; font-size:0.9em;">' +
                        '📅 ' + obtainedDate + ' 获得' +
                    '</div>' : '') +
            '</div>' +
        '</div>';

    detailEl.classList.add('show');

    // Bind close button
    var self = this;
    var backBtn = detailEl.querySelector('.card-detail-back');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            detailEl.classList.remove('show');
            detailEl.innerHTML = '';
            // Refresh grid to update NEW badges
            self.renderCardGrid();
        });
    }

    // Bind related card clicks
    detailEl.querySelectorAll('.related-card-item.collected').forEach(function(item) {
        item.addEventListener('click', function() {
            var relId = item.dataset.relatedId;
            if (relId) self.showCardDetail(relId);
        });
    });
};

// ===== Describe Effect (unchanged) =====

BattleMode._describeEffect = function(effect) {
    if (!effect) return '';
    switch (effect.type) {
        case 'weaponBoost': return '武器伤害+' + effect.bonus;
        case 'comboTrigger': return effect.threshold + '连击时触发特效';
        case 'startShield': return '开局获得' + effect.value + '层护盾';
        case 'bonusDamage': return '特定条件下伤害+' + effect.bonus;
        case 'scoreBoost': return '积分×' + effect.value;
        case 'hintChance': return Math.round(effect.value * 100) + '%概率显示提示';
        case 'speedBoost': return '答题速度加成';
        case 'dodgeChance': return Math.round(effect.value * 100) + '%闪避攻击';
        case 'reviveChance': return Math.round(effect.value * 100) + '%死而复生';
        case 'allBoost': return '全属性×' + effect.value;
        case 'dropBoost': return '掉率+' + Math.round(effect.value * 100) + '%';
        case 'collectionBoost': return '图鉴收集加速';
        default: return '特殊效果';
    }
};

// ===== Update Collection Progress =====

BattleMode.updateCardCollectionProgress = function() {
    var col = this.getCardCollection();
    var total = CardData.getTotalCount();
    var collected = col.length;
    var percent = total > 0 ? Math.round((collected / total) * 100) : 0;

    var progressEl = document.getElementById('card-collection-progress');
    if (progressEl) {
        progressEl.textContent = collected + '/' + total;
    }

    var progressBar = document.getElementById('card-progress-fill');
    if (progressBar) {
        progressBar.style.width = percent + '%';
    }
};

// ===== Check Card Achievements =====

BattleMode.checkCardAchievements = function() {
    var col = this.getCardCollection();
    var achievements = App.stats.achievements;
    var total = CardData.getTotalCount();

    var checks = [
        { id: 'card_first', condition: col.length >= 1 },
        { id: 'card_10', condition: col.length >= 10 },
        { id: 'card_50', condition: col.length >= 50 },
        { id: 'card_100', condition: col.length >= 100 },
        { id: 'card_all', condition: col.length >= total }
    ];

    // Check rarity achievements
    var hasRarity = function(r) {
        return col.some(function(entry) {
            var c = CardData.getCardById(entry.id);
            return c && c.rarity === r;
        });
    };

    checks.push({ id: 'card_sr', condition: hasRarity('SR') });
    checks.push({ id: 'card_ssr', condition: hasRarity('SSR') });
    checks.push({ id: 'card_ur', condition: hasRarity('UR') });

    for (var i = 0; i < checks.length; i++) {
        var check = checks[i];
        if (check.condition && achievements.indexOf(check.id) === -1) {
            achievements.push(check.id);
            saveProgress();
            var ach = MathData.achievements.find(function(a) { return a.id === check.id; });
            if (ach) {
                (function(achObj) {
                    setTimeout(function() { showAchievement(achObj); }, 2500);
                })(ach);
            }
        }
    }
};

// ===== Card Count Display for Battle Header =====

BattleMode.getCardCount = function() {
    return this.getCardCollection().length;
};
