/**
 * momentum-system.js — 隐藏动态难度调整系统（v20.0）
 * 灵感来源：Resident Evil 4 的隐藏Rank系统
 *
 * 核心原则：
 * 1. 玩家永远不知道这个系统的存在
 * 2. 调整幅度微妙，不让玩家感觉被"放水"
 * 3. 目标是让每个孩子都停留在"心流通道"内
 */

var MomentumSystem = {

    value: 50,
    floor: 10,
    ceiling: 90,
    smoothWindow: [],

    // 题目类型时间系数
    moduleMultipliers: {
        xiaojiujiu: 1.0,
        times: 1.3,
        multiply: 1.2,
        fraction: 1.4,
        decimal: 1.4,
        unit: 1.3,
        wrong: 1.2
    },

    // 基础时限（毫秒）
    baseTimes: {
        easy: 8000,
        normal: 5000,
        hard: 3500
    },

    // 危险区阈值（毫秒）
    dangerThresholds: {
        easy: 2000,
        normal: 1500,
        hard: 1000
    },

    // 郊狼时间（毫秒）
    coyoteTimes: {
        easy: 800,
        normal: 500,
        hard: 300
    },

    // 难度帽
    difficultyCaps: {
        easy:   { floor: 20, ceiling: 80 },
        normal: { floor: 10, ceiling: 90 },
        hard:   { floor: 0,  ceiling: 100 }
    },

    // ===== 初始化 =====

    init: function(difficulty) {
        this.value = 50;
        this.smoothWindow = [];
        var cap = this.difficultyCaps[difficulty] || this.difficultyCaps.normal;
        this.floor = cap.floor;
        this.ceiling = cap.ceiling;
    },

    // ===== 事件处理 =====

    onCorrect: function(speedRank, combo) {
        var gain = { S: 8, A: 5, B: 3, C: 1 }[speedRank] || 3;
        if (combo >= 10) gain *= 2;
        else if (combo >= 5) gain *= 1.5;
        this.value = Math.min(this.ceiling, this.value + Math.round(gain));
        this._pushWindow(1);
    },

    onWrong: function() {
        this.value = Math.max(this.floor, this.value - 12);
        this._pushWindow(0);
    },

    onTimeout: function() {
        this.value = Math.max(this.floor, this.value - 8);
        this._pushWindow(0);
    },

    _pushWindow: function(val) {
        this.smoothWindow.push(val);
        if (this.smoothWindow.length > 10) this.smoothWindow.shift();
    },

    // ===== 时间计算 =====

    /**
     * 计算答题时限（毫秒）
     * @param {string} difficulty - easy/normal/hard
     * @param {string} module - 题目模块ID
     * @param {boolean} hasGuardianLight - 是否有守护之光
     * @returns {number} 时限（毫秒）
     */
    calculateTimeLimit: function(difficulty, module, hasGuardianLight) {
        var baseTime = this.baseTimes[difficulty] || 5000;
        var moduleMult = this.moduleMultipliers[module] || 1.0;
        var momentumMult = this.getTimeMultiplier();
        var result = Math.round(baseTime * moduleMult * momentumMult);

        if (hasGuardianLight) {
            result += 2000;
        }

        return result;
    },

    /**
     * 获取危险区阈值
     */
    getDangerThreshold: function(difficulty) {
        return this.dangerThresholds[difficulty] || 1500;
    },

    /**
     * 获取郊狼时间
     */
    getCoyoteTime: function(difficulty) {
        return this.coyoteTimes[difficulty] || 500;
    },

    // ===== 气势值查询 =====

    getTimeMultiplier: function() {
        if (this.value <= 20) return 1.30;
        if (this.value <= 40) return 1.15;
        if (this.value <= 60) return 1.00;
        if (this.value <= 80) return 1.00;
        return 0.90;
    },

    getZone: function() {
        if (this.value <= 20) return 'low';
        if (this.value <= 40) return 'recovery';
        if (this.value <= 60) return 'stable';
        if (this.value <= 80) return 'high';
        return 'peak';
    },

    getRecentAccuracy: function() {
        if (this.smoothWindow.length === 0) return 0.5;
        var sum = 0;
        for (var i = 0; i < this.smoothWindow.length; i++) {
            sum += this.smoothWindow[i];
        }
        return sum / this.smoothWindow.length;
    },

    // ===== 保护机制 =====

    /**
     * 怪物是否应该"失手"（HP=1时的保护）
     */
    shouldMonsterMiss: function(playerHP) {
        if (playerHP > 1) return false;
        if (this.value > 30) return false;
        return Math.random() < 0.25;
    },

    /**
     * 是否触发守护之光（连续答错保护）
     */
    shouldActivateGuardian: function(consecutiveWrong) {
        return consecutiveWrong >= 3 && this.value <= 30;
    },

    /**
     * 是否允许超时重做（Easy/Normal第一次超时）
     */
    shouldAllowRetry: function(difficulty, hasRetried) {
        if (difficulty === 'hard') return false;
        if (hasRetried) return false;
        return true;
    },

    /**
     * 获取鼓励语
     */
    getEncourageMessage: function() {
        var messages = [
            '别灰心，再来一次！',
            '你可以的，慢慢想！',
            '深呼吸，仔细看题！',
            '错误是学习的阶梯！',
            '每个高手都从失败开始！',
            '加油，你离成功很近了！'
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }
};

window.MomentumSystem = MomentumSystem;
