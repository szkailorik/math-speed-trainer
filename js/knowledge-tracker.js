/**
 * knowledge-tracker.js
 * 海拉鲁知识图鉴 — 掌握度追踪系统
 *
 * 追踪每个知识点（神庙）的掌握状态：
 *   undiscovered → discovered → mastered → perfected
 *
 * 数据存储在 localStorage: 'mathTrainer_knowledgeProgress'
 */

var KnowledgeTracker = {

    _storageKey: 'mathTrainer_knowledgeProgress',
    _progress: null,

    // ===== 初始化 =====

    init: function() {
        this._progress = this._load();
    },

    // ===== 记录答题 =====

    /**
     * 在练习/战斗中答题后调用
     * @param {string} module - 模块ID (xiaojiujiu/times/multiply/fraction/decimal/unit)
     * @param {string} questionText - 题目文本 (如 "6 × 7")
     * @param {boolean} isCorrect - 是否答对
     * @param {number} answerTime - 答题时间(秒)，答错传0
     */
    recordAnswer: function(module, questionText, isCorrect, answerTime) {
        if (!this._progress) this.init();
        if (!module || !questionText) return;

        // 找到关联的shrine IDs
        var shrineIds = this._findRelatedShrines(module, questionText);
        if (shrineIds.length === 0) return;

        var now = Date.now();

        for (var i = 0; i < shrineIds.length; i++) {
            var id = shrineIds[i];
            if (!this._progress[id]) {
                this._progress[id] = {
                    encountered: 0,
                    correct: 0,
                    totalTime: 0,
                    avgTime: 0,
                    lastSeen: 0,
                    status: 'discovered'
                };
            }

            var p = this._progress[id];
            p.encountered++;
            p.lastSeen = now;

            if (isCorrect) {
                p.correct++;
                if (answerTime > 0) {
                    p.totalTime += answerTime;
                    p.avgTime = p.totalTime / p.correct;
                }
            }

            // 重新计算状态
            p.status = this._calculateStatus(p);
        }

        this._save();
    },

    // ===== 查询 =====

    /**
     * 获取单个shrine的进度
     */
    getProgress: function(shrineId) {
        if (!this._progress) this.init();
        return this._progress[shrineId] || null;
    },

    /**
     * 获取shrine的状态
     * @returns {string} 'undiscovered'|'discovered'|'mastered'|'perfected'
     */
    getStatus: function(shrineId) {
        var p = this.getProgress(shrineId);
        if (!p) return 'undiscovered';
        return p.status || 'undiscovered';
    },

    /**
     * 获取一个区域的统计
     * @param {string} regionId - 区域ID
     * @returns {object} { total, discovered, mastered, perfected, percentage }
     */
    getRegionStats: function(regionId) {
        if (!this._progress) this.init();
        if (!KnowledgeData || !KnowledgeData.shrines || !KnowledgeData.shrines[regionId]) {
            return { total: 0, discovered: 0, mastered: 0, perfected: 0, percentage: 0 };
        }

        var shrines = KnowledgeData.shrines[regionId];
        var total = shrines.length;
        var discovered = 0;
        var mastered = 0;
        var perfected = 0;

        for (var i = 0; i < shrines.length; i++) {
            var status = this.getStatus(shrines[i].id);
            if (status === 'discovered') discovered++;
            else if (status === 'mastered') { mastered++; discovered++; }
            else if (status === 'perfected') { perfected++; mastered++; discovered++; }
        }

        var percentage = total > 0 ? Math.round((mastered + perfected) / total * 100) : 0;

        return {
            total: total,
            discovered: discovered,
            mastered: mastered,
            perfected: perfected,
            percentage: percentage
        };
    },

    /**
     * 检查是否触发贤者觉醒
     * @param {string} regionId
     * @returns {boolean} true if all required shrines are mastered
     */
    checkSageAwakening: function(regionId) {
        if (!KnowledgeData || !KnowledgeData.shrines || !KnowledgeData.shrines[regionId]) {
            return false;
        }

        var shrines = KnowledgeData.shrines[regionId];
        for (var i = 0; i < shrines.length; i++) {
            if (shrines[i].type === 'required') {
                var status = this.getStatus(shrines[i].id);
                if (status !== 'mastered' && status !== 'perfected') {
                    return false;
                }
            }
        }
        return true;
    },

    /**
     * 获取贤者觉醒记录
     */
    isSageAwakened: function(regionId) {
        if (!this._progress) this.init();
        return this._progress['_sage_' + regionId] === true;
    },

    /**
     * 标记贤者已觉醒
     */
    markSageAwakened: function(regionId) {
        if (!this._progress) this.init();
        this._progress['_sage_' + regionId] = true;
        this._save();
    },

    // ===== 内部方法 =====

    _calculateStatus: function(progress) {
        if (!progress || progress.encountered === 0) return 'undiscovered';

        var rate = progress.correct / progress.encountered;

        if (progress.correct >= 10 && rate >= 0.9 && progress.avgTime <= 3) {
            return 'perfected';
        }
        if (progress.correct >= 3 && rate >= 0.7) {
            return 'mastered';
        }
        return 'discovered';
    },

    /**
     * 根据模块和题目文本找到关联的shrine
     * 匹配逻辑：清理题目文本中的空格，检查shrine的items是否包含该表达式
     */
    _findRelatedShrines: function(module, questionText) {
        if (!KnowledgeData || !KnowledgeData.shrines || !KnowledgeData.shrines[module]) {
            return [];
        }

        var cleanQ = questionText.replace(/\s+/g, '').replace(/[×x]/gi, '×').replace(/[÷\/]/g, '÷');
        var shrines = KnowledgeData.shrines[module];
        var result = [];

        for (var i = 0; i < shrines.length; i++) {
            var items = shrines[i].items;
            for (var j = 0; j < items.length; j++) {
                var cleanItem = items[j].replace(/\s+/g, '').replace(/[×x]/gi, '×').replace(/[÷\/]/g, '÷');
                // 检查题目是否在item中出现（item可能包含额外说明文字）
                if (cleanItem.indexOf(cleanQ) !== -1 || cleanQ.indexOf(cleanItem.split('（')[0].split('=')[0]) !== -1) {
                    result.push(shrines[i].id);
                    break;
                }
            }
        }

        // 如果精确匹配失败，至少标记该模块的第一个shrine为discovered
        if (result.length === 0 && shrines.length > 0) {
            result.push(shrines[0].id);
        }

        return result;
    },

    _load: function() {
        try {
            var data = localStorage.getItem(this._storageKey);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            return {};
        }
    },

    _save: function() {
        try {
            localStorage.setItem(this._storageKey, JSON.stringify(this._progress));
        } catch (e) {
            // Storage full or unavailable
        }
    }
};

// 自动初始化
KnowledgeTracker.init();
