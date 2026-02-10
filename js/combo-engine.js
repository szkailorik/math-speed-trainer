/**
 * combo-engine.js - Combo System 2.0 for Battle Mode (v16.0)
 *
 * Extends the global BattleMode object with 5-stage combo progression,
 * combo shield protection, memory recovery mechanics, and combo UI rendering.
 *
 * Dependencies:
 *   - BattleMode (battle-data.js)
 *   - App.battle state fields (core.js)
 *   - playSound(type) (effects.js)
 *   - checkAchievement(id) (battle-combat.js)
 *   - BattleMode.updateComboStage(combo) (hero-system.js)
 */

// ===== 1. Combo Stage Thresholds =====

BattleMode.COMBO_STAGES = {
    normal:     { min: 0,   max: 2,   name: '普通', color: '#ffffff' },
    awakened:   { min: 3,   max: 4,   name: '觉醒', color: '#ff6b35' },
    will:       { min: 5,   max: 9,   name: '战意', color: '#4a90d9' },
    godlike:    { min: 10,  max: 14,  name: '超神', color: '#f1c40f' },
    invincible: { min: 15,  max: 999, name: '无敌', color: '#e74c3c' }
};

// Stage emoji map (used in UI rendering)
BattleMode._COMBO_STAGE_EMOJIS = {
    normal:     '',
    awakened:   '\uD83D\uDD25',   // 🔥
    will:       '\u26A1',          // ⚡
    godlike:    '\uD83D\uDC8E',   // 💎
    invincible: '\uD83C\uDF1F'    // 🌟
};

// Internal tracking counters (not on App.battle, kept as BattleMode-private state)
BattleMode._previousCombo = 0;
BattleMode._memoryRecoveryCount = 0;
BattleMode._willCount = 0;

// ===== 2. getComboStage(combo) =====

/**
 * Returns the stage name string for a given combo count.
 * Pure function with no side effects.
 *
 * @param {number} combo - Current combo count
 * @returns {string} Stage key: 'normal' | 'awakened' | 'will' | 'godlike' | 'invincible'
 */
BattleMode.getComboStage = function(combo) {
    var stages = BattleMode.COMBO_STAGES;
    var keys = ['invincible', 'godlike', 'will', 'awakened', 'normal'];
    for (var i = 0; i < keys.length; i++) {
        if (combo >= stages[keys[i]].min) {
            return keys[i];
        }
    }
    return 'normal';
};

// ===== 3. processCorrectCombo() =====

/**
 * Called when the player answers correctly in battle.
 * Handles combo increment, memory recovery, shield activation,
 * stage transitions, and achievement checks.
 *
 * @returns {Object} { combo, stage, stageChanged, recovered, recoveredFrom }
 */
BattleMode.processCorrectCombo = function() {
    var battle = App.battle;
    var wasLastAnswerWrong = battle.lastAnswerWrong;
    var previousStage = battle.comboStage;
    var recovered = 0;
    var recoveredFrom = 0;

    // Attempt memory recovery if last answer was wrong
    if (wasLastAnswerWrong) {
        recoveredFrom = BattleMode._previousCombo;
        recovered = this.processMemoryRecovery();
    }

    // Increment combo
    battle.combo++;

    // Update max combo
    if (battle.combo > battle.maxCombo) {
        battle.maxCombo = battle.combo;
    }

    // Clear wrong-answer flag
    battle.lastAnswerWrong = false;

    // Activate combo shield when reaching combo 10+ for the first time
    if (!battle.comboShieldActive && battle.combo >= 10) {
        battle.comboShieldActive = true;
    }

    // Determine current stage
    var newStage = this.getComboStage(battle.combo);
    var stageChanged = (newStage !== previousStage);
    battle.comboStage = newStage;

    // Delegate visual stage update to hero-system
    if (typeof this.updateComboStage === 'function') {
        this.updateComboStage(battle.combo);
    }

    // Track 'will' stage entries for achievement
    if (stageChanged && newStage === 'will') {
        BattleMode._willCount++;
    }

    // Check combo achievements
    this.checkComboAchievements(battle.combo, newStage);

    // Update combo UI
    this.renderComboUI(battle.combo, newStage);

    return {
        combo: battle.combo,
        stage: newStage,
        stageChanged: stageChanged,
        recovered: recovered,
        recoveredFrom: recoveredFrom
    };
};

// ===== 4. processWrongCombo() =====

/**
 * Called when the player answers incorrectly in battle.
 * Handles combo shield check, combo break, and memory-recovery setup.
 *
 * @returns {Object} Result describing what happened:
 *   Shield used: { shieldUsed: true, newCombo, brokeCombo: false }
 *   Combo broken: { shieldUsed: false, newCombo: 0, brokeCombo: true, oldCombo }
 */
BattleMode.processWrongCombo = function() {
    var battle = App.battle;
    var currentCombo = battle.combo;

    // --- Shield protection check ---
    if (battle.comboShieldActive && currentCombo >= 10 && !battle.comboShieldUsed) {
        // Shield absorbs the hit: reduce combo by 3 instead of resetting
        battle.combo = Math.max(0, currentCombo - 3);
        battle.comboShieldUsed = true;
        battle.comboShieldActive = false;

        // Play shield break sound
        if (typeof playSound === 'function') {
            playSound('comboShieldBreak');
        }

        // Update stage after combo change
        battle.comboStage = this.getComboStage(battle.combo);
        if (typeof this.updateComboStage === 'function') {
            this.updateComboStage(battle.combo);
        }

        // Update UI
        this.renderComboUI(battle.combo, battle.comboStage);

        return {
            shieldUsed: true,
            newCombo: battle.combo,
            brokeCombo: false
        };
    }

    // --- Full combo break ---
    // Save current combo for memory recovery on next correct answer
    BattleMode._previousCombo = currentCombo;

    var oldCombo = currentCombo;

    // Reset combo
    battle.combo = 0;
    battle.lastAnswerWrong = true;

    // Update stage
    battle.comboStage = this.getComboStage(battle.combo);
    if (typeof this.updateComboStage === 'function') {
        this.updateComboStage(battle.combo);
    }

    // Show combo break visual if the lost combo was significant
    this.renderComboBreak(oldCombo);

    // Update UI
    this.renderComboUI(battle.combo, battle.comboStage);

    return {
        shieldUsed: false,
        newCombo: 0,
        brokeCombo: true,
        oldCombo: oldCombo
    };
};

// ===== 5. processMemoryRecovery() =====

/**
 * Called at the START of processCorrectCombo() when lastAnswerWrong is true.
 * If the previous combo was >= 3, restores 50% of it (floored).
 *
 * @returns {number} Amount of combo recovered (0 if none)
 */
BattleMode.processMemoryRecovery = function() {
    var previousCombo = BattleMode._previousCombo;

    if (previousCombo < 3) {
        return 0;
    }

    var recovered = Math.floor(previousCombo * 0.5);

    // Set combo to recovered value (processCorrectCombo will add +1 after this)
    App.battle.combo = recovered;

    // Play recovery sound
    if (typeof playSound === 'function') {
        playSound('comboRecover');
    }

    // Track for achievement
    BattleMode._memoryRecoveryCount++;
    if (BattleMode._memoryRecoveryCount >= 3) {
        if (typeof checkAchievement === 'function') {
            checkAchievement('combo_recover');
        }
    }

    // Clear saved combo so it can't be used again
    BattleMode._previousCombo = 0;

    return recovered;
};

// ===== 6. renderComboUI(combo, stage) =====

/**
 * Updates the combo display in the battle UI.
 * Creates or updates #combo-display element with stage info and progress bar.
 *
 * @param {number} combo - Current combo count
 * @param {string} stage - Current stage key
 */
BattleMode.renderComboUI = function(combo, stage) {
    var el = document.getElementById('combo-display');
    if (!el) {
        return; // DOM element not ready yet
    }

    // Hide when combo < 3
    if (combo < 3) {
        el.style.display = 'none';
        return;
    }

    el.style.display = '';

    var stageData = BattleMode.COMBO_STAGES[stage];
    var emoji = BattleMode._COMBO_STAGE_EMOJIS[stage] || '';
    var stageName = stageData ? stageData.name : '';
    var stageColor = stageData ? stageData.color : '#ffffff';

    // Calculate progress toward next stage
    var progress = 100;
    if (stage !== 'invincible' && stageData) {
        var stageRange = stageData.max - stageData.min + 1;
        var positionInStage = combo - stageData.min;
        progress = Math.min(100, Math.round((positionInStage / stageRange) * 100));
    }

    // Set class for CSS styling
    el.className = 'combo-stage-' + stage;

    // Build inner HTML
    el.innerHTML =
        '<span class="combo-icon">' + emoji + '</span>' +
        '<span class="combo-count" style="color:' + stageColor + '">' +
            '\u00D7' + combo +
        '</span>' +
        '<span class="combo-name" style="color:' + stageColor + '">' +
            stageName + '!' +
        '</span>' +
        '<div class="combo-progress">' +
            '<div class="combo-progress-fill' +
                (stage === 'invincible' ? ' combo-progress-pulse' : '') +
                '" style="width:' + progress + '%;background-color:' + stageColor + '"></div>' +
        '</div>';
};

// ===== 7. renderComboBreak(oldCombo) =====

/**
 * Shows a combo break visual effect when a significant combo is lost.
 * Creates a temporary overlay with shattering combo number, red flash,
 * and "连击中断!" text. Auto-removes after 0.8 seconds.
 *
 * @param {number} oldCombo - The combo count that was lost
 */
BattleMode.renderComboBreak = function(oldCombo) {
    // Only show effect for combos >= 3
    if (oldCombo < 3) {
        return;
    }

    // Play combo break sound
    if (typeof playSound === 'function') {
        playSound('comboBreak');
    }

    // Create overlay element
    var overlay = document.createElement('div');
    overlay.className = 'combo-break-overlay';
    overlay.innerHTML =
        '<div class="combo-break-flash"></div>' +
        '<div class="combo-break-content">' +
            '<div class="combo-break-number">' +
                '<span class="combo-fragment combo-frag-1">' + Math.floor(oldCombo / 10) + '</span>' +
                '<span class="combo-fragment combo-frag-2">' + (oldCombo % 10) + '</span>' +
            '</div>' +
            '<div class="combo-break-text">\u8FDE\u51FB\u4E2D\u65AD!</div>' +
        '</div>';

    // Style the overlay
    overlay.style.cssText =
        'position:fixed;top:0;left:0;width:100%;height:100%;' +
        'display:flex;align-items:center;justify-content:center;' +
        'z-index:9999;pointer-events:none;';

    document.body.appendChild(overlay);

    // Auto-remove after 0.8 seconds
    setTimeout(function() {
        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }, 800);
};

// ===== 8. checkComboAchievements(combo, stage) =====

/**
 * Checks and awards combo-related achievements.
 * Called from processCorrectCombo after each combo increment.
 *
 * Achievement list:
 *   combo_awakened   - first time reaching 'awakened' stage
 *   combo_will       - reaching 'will' stage 3 times
 *   combo_godlike    - first time reaching 'godlike' stage
 *   combo_invincible - first time reaching 'invincible' stage
 *   combo_unbroken   - reaching combo >= 30
 *
 * @param {number} combo - Current combo count
 * @param {string} stage - Current stage key
 */
BattleMode.checkComboAchievements = function(combo, stage) {
    if (typeof checkAchievement !== 'function') {
        return;
    }

    // First time reaching 'awakened'
    if (stage === 'awakened' || stage === 'will' || stage === 'godlike' || stage === 'invincible') {
        checkAchievement('combo_awakened');
    }

    // Reached 'will' stage 3 times
    if (BattleMode._willCount >= 3) {
        checkAchievement('combo_will');
    }

    // First time reaching 'godlike'
    if (stage === 'godlike' || stage === 'invincible') {
        checkAchievement('combo_godlike');
    }

    // First time reaching 'invincible'
    if (stage === 'invincible') {
        checkAchievement('combo_invincible');
    }

    // Combo >= 30 (unbroken streak)
    if (combo >= 30) {
        checkAchievement('combo_unbroken');
    }
};

// ===== 9. resetComboState() =====

/**
 * Resets all combo-related state to initial values.
 * Called at the start of each battle.
 */
BattleMode.resetComboState = function() {
    var battle = App.battle;

    // Core combo state
    battle.combo = 0;
    battle.maxCombo = 0;
    battle.comboStage = 'normal';

    // Shield mechanics
    battle.comboShieldActive = false;
    battle.comboShieldUsed = false;

    // Recovery mechanics
    battle.lastAnswerWrong = false;

    // Internal tracking (BattleMode-level)
    BattleMode._previousCombo = 0;
    BattleMode._memoryRecoveryCount = 0;
    BattleMode._willCount = 0;
};

// ===== 10. getComboMultiplier(stage) =====

/**
 * Returns display info for damage text based on the current combo stage.
 * Used to style damage numbers with stage-appropriate colors and sizes.
 *
 * @param {string} stage - Current stage key
 * @returns {Object} { color, size, prefix }
 */
BattleMode.getComboMultiplier = function(stage) {
    var multipliers = {
        normal:     { color: '#fff',    size: '1em',   prefix: '' },
        awakened:   { color: '#ff6b35', size: '1.1em', prefix: '' },
        will:       { color: '#4a90d9', size: '1.2em', prefix: '' },
        godlike:    { color: '#f1c40f', size: '1.5em', prefix: '' },
        invincible: { color: '#e74c3c', size: '2em',   prefix: '\u2605' } // ★
    };

    return multipliers[stage] || multipliers.normal;
};
