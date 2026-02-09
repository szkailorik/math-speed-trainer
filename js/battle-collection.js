/**
 * battle-collection.js - Monster codex/collection system (all 6 modules)
 */

// ===== Collection Page (xiaojiujiu) =====

BattleMode.openCollection = function() {
    this.renderCollection('all');
    this.updateCollectionCount();
    showPage('collection');
};

BattleMode.updateCollectionCount = function() {
    const stats = this.getCollectionStats();

    const countEl = document.getElementById('collection-count');
    if (countEl) countEl.textContent = `${stats.collected}/${stats.total}`;

    const statsEl = document.getElementById('collection-stats');
    if (statsEl) statsEl.textContent = `${stats.collected}/${stats.total}`;

    const bannerCount = document.getElementById('collection-banner-count');
    if (bannerCount) bannerCount.textContent = `${stats.collected} / ${stats.total}`;

    const percentEl = document.getElementById('collection-percent');
    if (percentEl) percentEl.textContent = `${stats.percentage}%`;

    const ringFill = document.getElementById('collection-ring-fill');
    if (ringFill) {
        const circumference = 220;
        const offset = circumference - (circumference * stats.percentage / 100);
        ringFill.style.strokeDashoffset = offset;
    }
};

BattleMode.renderCollection = function(filter) {
    filter = filter || 'all';
    const grid = document.getElementById('collection-grid');
    if (!grid) return;

    const allMonsters = this.getAllMonsters();
    const collection = this.getCollection();

    const typeNames = {
        ghost: '\u5E7D\u7075', psychic: '\u8D85\u80FD', dark: '\u6697', poison: '\u6BD2',
        fire: '\u706B', water: '\u6C34', flying: '\u98DE\u884C', normal: '\u666E\u901A',
        ice: '\u51B0', fighting: '\u683C\u6597', rock: '\u5CA9\u77F3', electric: '\u7535',
        bug: '\u866B', dragon: '\u9F99', steel: '\u94A2', fairy: '\u5996\u7CBE', ground: '\u5730\u9762',
        earth: '\u571F', wind: '\u98CE', thunder: '\u96F7', light: '\u5149',
        beast: '\u517D', spirit: '\u7075', ancient: '\u592A\u53E4'
    };

    let html = '';
    let visibleCount = 0;

    allMonsters.forEach(monster => {
        const isCollected = collection.includes(monster.id);
        if (filter === 'collected' && !isCollected) return;
        if (filter === 'locked' && isCollected) return;

        visibleCount++;

        if (isCollected) {
            html += `
                <div class="collection-card collected" data-id="${monster.id}">
                    <span class="collection-card-emoji">${monster.emoji}</span>
                    <span class="collection-card-name">${monster.name}</span>
                    <span class="collection-card-type type-${monster.type}">${typeNames[monster.type] || '\u666E\u901A'}</span>
                </div>
            `;
        } else {
            html += `
                <div class="collection-card locked">
                    <span class="collection-card-emoji">\u2753</span>
                    <span class="collection-card-name">???</span>
                    <span class="collection-card-type">\u672A\u89E3\u9501</span>
                </div>
            `;
        }
    });

    if (visibleCount === 0) {
        if (filter === 'collected') {
            html = `
                <div class="collection-empty">
                    <div class="collection-empty-icon">\uD83D\uDCD6</div>
                    <div class="collection-empty-text">\u8FD8\u6CA1\u6709\u6536\u96C6\u5230\u4EFB\u4F55\u5996\u602A<br>\u5FEB\u53BB\u6218\u6597\u6536\u96C6\u5427!</div>
                </div>
            `;
        } else if (filter === 'locked') {
            html = `
                <div class="collection-empty">
                    <div class="collection-empty-icon">\uD83C\uDF89</div>
                    <div class="collection-empty-text">\u606D\u559C! \u4F60\u5DF2\u7ECF\u6536\u96C6\u4E86\u5168\u90E8\u5996\u602A!</div>
                </div>
            `;
        }
    }

    grid.innerHTML = html;

    grid.querySelectorAll('.collection-card.collected').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const monster = allMonsters.find(m => m.id === id);
            if (monster) {
                this.showMonsterDetail(monster);
            }
        });
    });

    const collectionPage = document.getElementById('collection-page');
    if (collection.length >= allMonsters.length) {
        collectionPage?.classList.add('collection-complete');
    } else {
        collectionPage?.classList.remove('collection-complete');
    }

    this.updateCollectionCount();
};

// ===== Monster Detail =====

BattleMode.showMonsterDetail = function(monster) {
    const typeNames = {
        ghost: '\u5E7D\u7075\u7CFB', psychic: '\u8D85\u80FD\u7CFB', dark: '\u6697\u7CFB', poison: '\u6BD2\u7CFB',
        fire: '\u706B\u7CFB', water: '\u6C34\u7CFB', flying: '\u98DE\u884C\u7CFB', normal: '\u666E\u901A\u7CFB',
        ice: '\u51B0\u7CFB', fighting: '\u683C\u6597\u7CFB', rock: '\u5CA9\u77F3\u7CFB', electric: '\u7535\u7CFB',
        bug: '\u866B\u7CFB', dragon: '\u9F99\u7CFB', steel: '\u94A2\u7CFB', fairy: '\u5996\u7CBE\u7CFB', ground: '\u5730\u9762\u7CFB',
        earth: '\u571F\u7CFB', wind: '\u98CE\u7CFB', thunder: '\u96F7\u7CFB', light: '\u5149\u7CFB',
        beast: '\u517D\u7CFB', spirit: '\u7075\u7CFB', ancient: '\u592A\u53E4\u7CFB',
        demon: '\u5996\u7CFB', creature: '\u751F\u7269\u7CFB', wizard: '\u5DEB\u5E08\u7CFB'
    };

    const typeColors = {
        ghost: '#705898', psychic: '#f85888', dark: '#705848', poison: '#a040a0',
        fire: '#f08030', water: '#6890f0', flying: '#a890f0', normal: '#a8a878',
        ice: '#98d8d8', fighting: '#c03028', rock: '#b8a038', electric: '#f8d030',
        bug: '#a8b820', dragon: '#7038f8', steel: '#b8b8d0', fairy: '#ee99ac', ground: '#e0c068',
        earth: '#c4a54a', wind: '#81c784', thunder: '#fdd835', light: '#fff176',
        beast: '#8d6e63', spirit: '#ce93d8', ancient: '#78909c',
        demon: '#e53935', creature: '#43a047', wizard: '#5c6bc0'
    };

    document.getElementById('detail-emoji').textContent = monster.emoji;
    document.getElementById('detail-name').textContent = monster.name;
    document.getElementById('detail-name-en').textContent = monster.nameEn;
    document.getElementById('detail-type').innerHTML = `<span class="type-badge ${monster.type}">${typeNames[monster.type] || '\u666E\u901A\u7CFB'}</span>`;
    document.getElementById('detail-hp').textContent = monster.hp;
    document.getElementById('detail-attack-icon').textContent = monster.attack;
    document.getElementById('detail-attack-name').textContent = monster.attackName;
    document.getElementById('detail-trait').textContent = monster.trait;
    document.getElementById('detail-trait-en').textContent = monster.traitEn;
    document.getElementById('detail-story').textContent = monster.story;
    document.getElementById('detail-story-en').textContent = monster.storyEn;

    const heroColor = typeColors[monster.type] || '#a8a878';
    document.getElementById('detail-hero-bg').style.background = `linear-gradient(180deg, ${heroColor}22 0%, transparent 100%)`;

    document.getElementById('monster-detail-modal').classList.remove('hidden');
};

BattleMode.closeMonsterDetail = function() {
    document.getElementById('monster-detail-modal').classList.add('hidden');
};

// ===== Shanhai Collection (fraction) =====

BattleMode.openShanhaiCollection = function() {
    this.renderShanhaiCollection('all');
    this.updateFractionCollectionCount();
    showPage('shanhai-collection');
};

BattleMode.updateFractionCollectionCount = function() {
    const stats = this.getCollectionStats('fraction');

    const countEl = document.getElementById('fraction-collection-count');
    if (countEl) countEl.textContent = `${stats.collected}/${stats.total}`;

    const statsEl = document.getElementById('shanhai-collection-stats');
    if (statsEl) statsEl.textContent = `${stats.collected}/${stats.total}`;

    const bannerCount = document.getElementById('shanhai-banner-count');
    if (bannerCount) bannerCount.textContent = `${stats.collected} / ${stats.total}`;

    const percentEl = document.getElementById('shanhai-percent');
    if (percentEl) percentEl.textContent = `${stats.percentage}%`;

    const ringFill = document.getElementById('shanhai-ring-fill');
    if (ringFill) {
        const circumference = 220;
        const offset = circumference - (circumference * stats.percentage / 100);
        ringFill.style.strokeDashoffset = offset;
    }
};

BattleMode.renderShanhaiCollection = function(filter) {
    filter = filter || 'all';
    const grid = document.getElementById('shanhai-collection-grid');
    if (!grid) return;

    const allMonsters = this.getAllMonsters('fraction');
    const collection = this.getCollection('fraction');

    const typeNames = {
        fire: '\u706B', water: '\u6C34', earth: '\u571F', wind: '\u98CE', thunder: '\u96F7',
        ice: '\u51B0', dark: '\u6697', light: '\u5149', poison: '\u6BD2', beast: '\u517D',
        dragon: '\u9F99', spirit: '\u7075', ancient: '\u592A\u53E4'
    };

    let html = '';
    let visibleCount = 0;

    allMonsters.forEach(monster => {
        const isCollected = collection.includes(monster.id);
        if (filter === 'collected' && !isCollected) return;
        if (filter === 'locked' && isCollected) return;

        visibleCount++;

        if (isCollected) {
            html += `
                <div class="collection-card collected shanhai-card" data-id="${monster.id}" data-module="fraction">
                    <span class="collection-card-emoji">${monster.emoji}</span>
                    <span class="collection-card-name">${monster.name}</span>
                    <span class="collection-card-type type-${monster.type}">${typeNames[monster.type] || '\u666E\u901A'}</span>
                </div>
            `;
        } else {
            html += `
                <div class="collection-card locked shanhai-card">
                    <span class="collection-card-emoji">\u2753</span>
                    <span class="collection-card-name">???</span>
                    <span class="collection-card-type">\u672A\u89E3\u9501</span>
                </div>
            `;
        }
    });

    if (visibleCount === 0) {
        if (filter === 'collected') {
            html = `<div class="collection-empty"><div class="collection-empty-icon">\uD83D\uDCDC</div><div class="collection-empty-text">\u8FD8\u6CA1\u6709\u6536\u96C6\u5230\u5C71\u6D77\u7ECF\u5996\u602A<br>\u5FEB\u53BB\u6311\u6218\u5206\u6570\u5C0F\u6570\u5427!</div></div>`;
        } else if (filter === 'locked') {
            html = `<div class="collection-empty"><div class="collection-empty-icon">\uD83C\uDF89</div><div class="collection-empty-text">\u606D\u559C! \u4F60\u5DF2\u7ECF\u6536\u5F55\u4E86\u5168\u90E8\u5C71\u6D77\u7ECF\u5996\u602A!</div></div>`;
        }
    }

    grid.innerHTML = html;

    grid.querySelectorAll('.collection-card.collected').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const monster = allMonsters.find(m => m.id === id);
            if (monster) {
                this.showMonsterDetail(monster);
            }
        });
    });

    this.updateFractionCollectionCount();
};

// ===== Xiyouji Collection (decimal) =====

BattleMode.openXiyoujiCollection = function() {
    this.renderXiyoujiCollection('all');
    this.updateDecimalCollectionCount();
    showPage('xiyouji-collection');
};

BattleMode.updateDecimalCollectionCount = function() {
    const stats = this.getCollectionStats('decimal');

    const countEl = document.getElementById('decimal-collection-count');
    if (countEl) countEl.textContent = `${stats.collected}/${stats.total}`;

    const statsEl = document.getElementById('xiyouji-collection-stats');
    if (statsEl) statsEl.textContent = `${stats.collected}/${stats.total}`;

    const bannerCount = document.getElementById('xiyouji-banner-count');
    if (bannerCount) bannerCount.textContent = `${stats.collected} / ${stats.total}`;

    const percentEl = document.getElementById('xiyouji-percent');
    if (percentEl) percentEl.textContent = `${stats.percentage}%`;

    const ringFill = document.getElementById('xiyouji-ring-fill');
    if (ringFill) {
        const circumference = 220;
        const offset = circumference - (circumference * stats.percentage / 100);
        ringFill.style.strokeDashoffset = offset;
    }
};

BattleMode.renderXiyoujiCollection = function(filter) {
    filter = filter || 'all';
    const grid = document.getElementById('xiyouji-collection-grid');
    if (!grid) return;

    const allMonsters = this.getAllMonsters('decimal');
    const collection = this.getCollection('decimal');

    const typeNames = {
        fire: '\u706B', water: '\u6C34', earth: '\u571F', wind: '\u98CE', thunder: '\u96F7',
        ice: '\u51B0', dark: '\u6697', light: '\u5149', poison: '\u6BD2', beast: '\u517D',
        dragon: '\u9F99', spirit: '\u7075', ancient: '\u592A\u53E4', ghost: '\u5E7D\u7075',
        psychic: '\u8D85\u80FD', fighting: '\u683C\u6597'
    };

    let html = '';
    let visibleCount = 0;

    allMonsters.forEach(monster => {
        const isCollected = collection.includes(monster.id);
        if (filter === 'collected' && !isCollected) return;
        if (filter === 'locked' && isCollected) return;

        visibleCount++;

        if (isCollected) {
            html += `
                <div class="collection-card collected xiyouji-card" data-id="${monster.id}" data-module="decimal">
                    <span class="collection-card-emoji">${monster.emoji}</span>
                    <span class="collection-card-name">${monster.name}</span>
                    <span class="collection-card-type type-${monster.type}">${typeNames[monster.type] || '\u666E\u901A'}</span>
                </div>
            `;
        } else {
            html += `
                <div class="collection-card locked xiyouji-card">
                    <span class="collection-card-emoji">\u2753</span>
                    <span class="collection-card-name">???</span>
                    <span class="collection-card-type">\u672A\u89E3\u9501</span>
                </div>
            `;
        }
    });

    if (visibleCount === 0) {
        if (filter === 'collected') {
            html = `<div class="collection-empty"><div class="collection-empty-icon">\uD83D\uDCD6</div><div class="collection-empty-text">\u8FD8\u6CA1\u6709\u6536\u96C6\u5230\u897F\u6E38\u8BB0\u5996\u602A<br>\u5FEB\u53BB\u6311\u6218\u5C0F\u6570\u89C4\u5F8B\u5427!</div></div>`;
        } else if (filter === 'locked') {
            html = `<div class="collection-empty"><div class="collection-empty-icon">\uD83C\uDF89</div><div class="collection-empty-text">\u606D\u559C! \u4F60\u5DF2\u7ECF\u6536\u5F55\u4E86\u5168\u90E8\u897F\u6E38\u8BB0\u5996\u602A!</div></div>`;
        }
    }

    grid.innerHTML = html;

    grid.querySelectorAll('.collection-card.collected').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const monster = allMonsters.find(m => m.id === id);
            if (monster) {
                this.showMonsterDetail(monster);
            }
        });
    });

    this.updateDecimalCollectionCount();
};

// ===== Fengshen Collection (unit) =====

BattleMode.openFengshenCollection = function() {
    this.renderFengshenCollection('all');
    this.updateUnitCollectionCount();
    showPage('fengshen-collection');
};

BattleMode.updateUnitCollectionCount = function() {
    const stats = this.getCollectionStats('unit');

    const countEl = document.getElementById('unit-collection-count');
    if (countEl) countEl.textContent = `${stats.collected}/${stats.total}`;

    const statsEl = document.getElementById('fengshen-collection-stats');
    if (statsEl) statsEl.textContent = `${stats.collected}/${stats.total}`;

    const bannerCount = document.getElementById('fengshen-banner-count');
    if (bannerCount) bannerCount.textContent = `${stats.collected} / ${stats.total}`;

    const percentEl = document.getElementById('fengshen-percent');
    if (percentEl) percentEl.textContent = `${stats.percentage}%`;

    const ringFill = document.getElementById('fengshen-ring-fill');
    if (ringFill) {
        const circumference = 220;
        const offset = circumference - (circumference * stats.percentage / 100);
        ringFill.style.strokeDashoffset = offset;
    }
};

BattleMode.renderFengshenCollection = function(filter) {
    filter = filter || 'all';
    const grid = document.getElementById('fengshen-collection-grid');
    if (!grid) return;

    const allMonsters = this.getAllMonsters('unit');
    const collection = this.getCollection('unit');

    const typeNames = {
        fire: '\u706B', water: '\u6C34', earth: '\u571F', wind: '\u98CE', thunder: '\u96F7',
        ice: '\u51B0', dark: '\u6697', light: '\u5149', poison: '\u6BD2', beast: '\u517D',
        dragon: '\u9F99', spirit: '\u7075', ancient: '\u592A\u53E4', ghost: '\u5E7D\u7075',
        psychic: '\u8D85\u80FD', fighting: '\u683C\u6597'
    };

    let html = '';
    let visibleCount = 0;

    allMonsters.forEach(monster => {
        const isCollected = collection.includes(monster.id);
        if (filter === 'collected' && !isCollected) return;
        if (filter === 'locked' && isCollected) return;

        visibleCount++;

        if (isCollected) {
            html += `
                <div class="collection-card collected fengshen-card" data-id="${monster.id}" data-module="unit">
                    <span class="collection-card-emoji">${monster.emoji}</span>
                    <span class="collection-card-name">${monster.name}</span>
                    <span class="collection-card-type type-${monster.type}">${typeNames[monster.type] || '\u666E\u901A'}</span>
                </div>
            `;
        } else {
            html += `
                <div class="collection-card locked fengshen-card">
                    <span class="collection-card-emoji">\u2753</span>
                    <span class="collection-card-name">???</span>
                    <span class="collection-card-type">\u672A\u89E3\u9501</span>
                </div>
            `;
        }
    });

    if (visibleCount === 0) {
        if (filter === 'collected') {
            html = `<div class="collection-empty"><div class="collection-empty-icon">\uD83D\uDCDC</div><div class="collection-empty-text">\u8FD8\u6CA1\u6709\u6536\u96C6\u5230\u5C01\u795E\u6F14\u4E49\u5996\u602A<br>\u5FEB\u53BB\u6311\u6218\u5355\u4F4D\u6362\u7B97\u5427!</div></div>`;
        } else if (filter === 'locked') {
            html = `<div class="collection-empty"><div class="collection-empty-icon">\uD83C\uDF89</div><div class="collection-empty-text">\u606D\u559C! \u4F60\u5DF2\u7ECF\u6536\u5F55\u4E86\u5168\u90E8\u5C01\u795E\u6F14\u4E49\u5996\u602A!</div></div>`;
        }
    }

    grid.innerHTML = html;

    grid.querySelectorAll('.collection-card.collected').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const monster = allMonsters.find(m => m.id === id);
            if (monster) {
                this.showMonsterDetail(monster);
            }
        });
    });

    this.updateUnitCollectionCount();
};

// ===== Liaozhai Collection (multiply) =====

BattleMode.openLiaozhaiCollection = function() {
    this.renderLiaozhaiCollection('all');
    this.updateMultiplyCollectionCount();
    showPage('liaozhai-collection');
};

BattleMode.updateMultiplyCollectionCount = function() {
    const stats = this.getCollectionStats('multiply');

    const countEl = document.getElementById('multiply-collection-count');
    if (countEl) countEl.textContent = `${stats.collected}/${stats.total}`;

    const statsEl = document.getElementById('liaozhai-collection-stats');
    if (statsEl) statsEl.textContent = `${stats.collected}/${stats.total}`;

    const bannerCount = document.getElementById('liaozhai-banner-count');
    if (bannerCount) bannerCount.textContent = `${stats.collected} / ${stats.total}`;

    const percentEl = document.getElementById('liaozhai-percent');
    if (percentEl) percentEl.textContent = `${stats.percentage}%`;

    const ringFill = document.getElementById('liaozhai-ring-fill');
    if (ringFill) {
        const circumference = 220;
        const offset = circumference - (circumference * stats.percentage / 100);
        ringFill.style.strokeDashoffset = offset;
    }
};

BattleMode.renderLiaozhaiCollection = function(filter) {
    filter = filter || 'all';
    const grid = document.getElementById('liaozhai-collection-grid');
    if (!grid) return;

    const allMonsters = this.getAllMonsters('multiply');
    const collection = this.getCollection('multiply');

    const typeNames = {
        ghost: '\u9B3C', demon: '\u5996', fairy: '\u4ED9', spirit: '\u7075', beast: '\u517D',
        fox: '\u72D0', snake: '\u86C7', flower: '\u82B1', bird: '\u79BD', fish: '\u9C7C'
    };

    let html = '';
    let visibleCount = 0;

    allMonsters.forEach(monster => {
        const isCollected = collection.includes(monster.id);
        if (filter === 'collected' && !isCollected) return;
        if (filter === 'locked' && isCollected) return;

        visibleCount++;

        if (isCollected) {
            html += `
                <div class="collection-card collected liaozhai-card" data-id="${monster.id}" data-module="multiply">
                    <span class="collection-card-emoji">${monster.emoji}</span>
                    <span class="collection-card-name">${monster.name}</span>
                    <span class="collection-card-type type-${monster.type}">${typeNames[monster.type] || '\u5996'}</span>
                </div>
            `;
        } else {
            html += `
                <div class="collection-card locked liaozhai-card">
                    <span class="collection-card-emoji">\u2753</span>
                    <span class="collection-card-name">???</span>
                    <span class="collection-card-type">\u672A\u89E3\u9501</span>
                </div>
            `;
        }
    });

    if (visibleCount === 0) {
        if (filter === 'collected') {
            html = `<div class="collection-empty"><div class="collection-empty-icon">\uD83D\uDC7B</div><div class="collection-empty-text">\u8FD8\u6CA1\u6709\u6536\u96C6\u5230\u804A\u658B\u5FD7\u5F02\u9B3C\u602A<br>\u5FEB\u53BB\u6311\u6218\u4E58\u6CD5\u901F\u8BB0\u5427!</div></div>`;
        } else if (filter === 'locked') {
            html = `<div class="collection-empty"><div class="collection-empty-icon">\uD83C\uDF89</div><div class="collection-empty-text">\u606D\u559C! \u4F60\u5DF2\u7ECF\u6536\u5F55\u4E86\u5168\u90E8\u804A\u658B\u5FD7\u5F02\u9B3C\u602A!</div></div>`;
        }
    }

    grid.innerHTML = html;

    grid.querySelectorAll('.collection-card.collected').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const monster = allMonsters.find(m => m.id === id);
            if (monster) {
                this.showMonsterDetail(monster);
            }
        });
    });

    this.updateMultiplyCollectionCount();
};

// ===== HP Collection (times) =====

BattleMode.openHpCollection = function() {
    this.renderHpCollection('all');
    this.updateTimesCollectionCount();
    showPage('hp-collection');
};

BattleMode.updateTimesCollectionCount = function() {
    const stats = this.getCollectionStats('times');

    const countEl = document.getElementById('times-collection-count');
    if (countEl) countEl.textContent = `${stats.collected}/${stats.total}`;

    const statsEl = document.getElementById('hp-collection-stats');
    if (statsEl) statsEl.textContent = `${stats.collected}/${stats.total}`;

    const bannerCount = document.getElementById('hp-banner-count');
    if (bannerCount) bannerCount.textContent = `${stats.collected} / ${stats.total}`;

    const percentEl = document.getElementById('hp-percent');
    if (percentEl) percentEl.textContent = `${stats.percentage}%`;

    const ringFill = document.getElementById('hp-ring-fill');
    if (ringFill) {
        const circumference = 220;
        const offset = circumference - (circumference * stats.percentage / 100);
        ringFill.style.strokeDashoffset = offset;
    }
};

BattleMode.renderHpCollection = function(filter) {
    filter = filter || 'all';
    const grid = document.getElementById('hp-collection-grid');
    if (!grid) return;

    const allMonsters = this.getAllMonsters('times');
    const collection = this.getCollection('times');

    const typeNames = {
        ghost: '\u5E7D\u7075', creature: '\u751F\u7269', wizard: '\u5DEB\u5E08', spirit: '\u7CBE\u7075', beast: '\u9B54\u517D',
        dark: '\u9ED1\u6697', dragon: '\u9F99', bird: '\u98DE\u79BD', plant: '\u690D\u7269', goblin: '\u5996\u7CBE'
    };

    let html = '';
    let visibleCount = 0;

    allMonsters.forEach(monster => {
        const isCollected = collection.includes(monster.id);
        if (filter === 'collected' && !isCollected) return;
        if (filter === 'locked' && isCollected) return;

        visibleCount++;

        if (isCollected) {
            html += `
                <div class="collection-card collected hp-card" data-id="${monster.id}" data-module="times">
                    <span class="collection-card-emoji">${monster.emoji}</span>
                    <span class="collection-card-name">${monster.name}</span>
                    <span class="collection-card-type type-${monster.type}">${typeNames[monster.type] || '\u9B54\u6CD5'}</span>
                </div>
            `;
        } else {
            html += `
                <div class="collection-card locked hp-card">
                    <span class="collection-card-emoji">\u2753</span>
                    <span class="collection-card-name">???</span>
                    <span class="collection-card-type">\u672A\u89E3\u9501</span>
                </div>
            `;
        }
    });

    if (visibleCount === 0) {
        if (filter === 'collected') {
            html = `<div class="collection-empty"><div class="collection-empty-icon">\uD83E\uDDD9</div><div class="collection-empty-text">\u8FD8\u6CA1\u6709\u6536\u96C6\u5230\u9B54\u6CD5\u751F\u7269<br>\u5FEB\u53BB\u6311\u6218\u5927\u4E5D\u4E5D\u8868\u5427!</div></div>`;
        } else if (filter === 'locked') {
            html = `<div class="collection-empty"><div class="collection-empty-icon">\uD83C\uDF89</div><div class="collection-empty-text">\u606D\u559C! \u4F60\u5DF2\u7ECF\u6536\u5F55\u4E86\u5168\u90E8\u9B54\u6CD5\u751F\u7269!</div></div>`;
        }
    }

    grid.innerHTML = html;

    grid.querySelectorAll('.collection-card.collected').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const monster = allMonsters.find(m => m.id === id);
            if (monster) {
                this.showMonsterDetail(monster);
            }
        });
    });

    this.updateTimesCollectionCount();
};

// ===== Collection Achievement Checks =====

BattleMode.checkCollectionAchievements = function() {
    const modules = ['xiaojiujiu', 'fraction', 'decimal', 'unit', 'multiply', 'times'];
    const totalCollected = modules.reduce((sum, m) => sum + this.getCollection(m).length, 0);
    const achievements = App.stats.achievements;

    const milestones = [
        { count: 10, id: 'collect_10' },
        { count: 50, id: 'collect_50' },
        { count: 100, id: 'collect_100' },
        { count: 200, id: 'collect_200' }
    ];

    milestones.forEach(ms => {
        if (totalCollected >= ms.count && !achievements.includes(ms.id)) {
            achievements.push(ms.id);
            saveProgress();
            const ach = MathData.achievements.find(a => a.id === ms.id);
            if (ach) setTimeout(() => showAchievement(ach), 1500);
        }
    });

    const totalAll = modules.reduce((sum, m) => sum + this.getAllMonsters(m).length, 0);
    if (totalCollected >= totalAll && totalAll > 0 && !achievements.includes('collect_all')) {
        achievements.push('collect_all');
        saveProgress();
        const ach = MathData.achievements.find(a => a.id === 'collect_all');
        if (ach) setTimeout(() => showAchievement(ach), 2000);
    }
};
