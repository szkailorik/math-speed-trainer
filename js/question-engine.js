/**
 * question-engine.js - v16.2 Intelligent Question Selection System
 *
 * Weighted question selection based on answer history.
 * Questions answered incorrectly or timed out appear more frequently.
 *
 * Weight rules:
 *   - Base weight: 1.0
 *   - Wrong answer: +1.5 (max 5.0)
 *   - Timeout: +2.0 (max 5.0)
 *   - Correct answer: -0.3 (min 0.5)
 *
 * Storage: localStorage key 'questionWeights' per user
 */

var QuestionEngine = {};

// ===== 1. Get Weights from localStorage =====

QuestionEngine.getWeights = function(userId) {
    var key = 'questionWeights_' + (userId || 'default');
    try {
        var data = localStorage.getItem(key);
        if (data) {
            return JSON.parse(data);
        }
    } catch (e) {
        // Corrupt data, reset
    }
    return {};
};

// ===== 2. Save Weights to localStorage =====

QuestionEngine.saveWeights = function(userId, weights) {
    var key = 'questionWeights_' + (userId || 'default');
    try {
        localStorage.setItem(key, JSON.stringify(weights));
    } catch (e) {
        // Storage full or unavailable
    }
};

// ===== 3. Update Weight for a Question =====

QuestionEngine.updateWeight = function(module, questionText, isCorrect, isTimeout) {
    var userId = '';
    if (typeof UserManager !== 'undefined' && typeof UserManager.getCurrentUser === 'function') {
        var user = UserManager.getCurrentUser();
        if (user) userId = user.id || user.name || '';
    }

    var weights = this.getWeights(userId);
    var weightKey = (module || 'default') + '::' + questionText;
    var current = weights[weightKey] || 1.0;

    if (isTimeout) {
        current = Math.min(5.0, current + 2.0);
    } else if (!isCorrect) {
        current = Math.min(5.0, current + 1.5);
    } else {
        current = Math.max(0.5, current - 0.3);
    }

    weights[weightKey] = Math.round(current * 100) / 100;
    this.saveWeights(userId, weights);
};

// ===== 4. Weighted Random Selection =====

QuestionEngine.weightedSelect = function(questions, count, module) {
    if (!questions || questions.length === 0) return [];
    if (questions.length <= count) return shuffle([].concat(questions));

    var userId = '';
    if (typeof UserManager !== 'undefined' && typeof UserManager.getCurrentUser === 'function') {
        var user = UserManager.getCurrentUser();
        if (user) userId = user.id || user.name || '';
    }

    var weights = this.getWeights(userId);
    var mod = module || 'default';

    // Build weighted list
    var weighted = [];
    var totalWeight = 0;
    for (var i = 0; i < questions.length; i++) {
        var q = questions[i];
        var weightKey = mod + '::' + q.q;
        var w = weights[weightKey] || 1.0;
        weighted.push({ question: q, weight: w, index: i });
        totalWeight += w;
    }

    // Weighted random sampling without replacement
    var selected = [];
    var remaining = weighted.slice();
    var remainingTotal = totalWeight;

    for (var j = 0; j < count && remaining.length > 0; j++) {
        var rand = Math.random() * remainingTotal;
        var cumulative = 0;
        var pickedIdx = 0;

        for (var k = 0; k < remaining.length; k++) {
            cumulative += remaining[k].weight;
            if (cumulative >= rand) {
                pickedIdx = k;
                break;
            }
        }

        selected.push(remaining[pickedIdx].question);
        remainingTotal -= remaining[pickedIdx].weight;
        remaining.splice(pickedIdx, 1);
    }

    return selected;
};

// ===== 5. Get Wrong Questions for a Module =====

QuestionEngine.getWrongMix = function(module, count) {
    if (typeof App === 'undefined' || !App.wrongBook) return [];

    var mod = module || 'default';
    var matched = [];

    for (var i = 0; i < App.wrongBook.length; i++) {
        var item = App.wrongBook[i];
        if (item.module === mod || !item.module) {
            matched.push(item);
        }
    }

    if (matched.length === 0) return [];

    // Shuffle and take up to count
    var shuffled = shuffle([].concat(matched));
    return shuffled.slice(0, Math.min(count, shuffled.length));
};

// ===== 6. Interlace Wrong Questions into Main Set =====

QuestionEngine.interlaceWrong = function(main, wrong, interval) {
    if (!wrong || wrong.length === 0) return main;

    var result = [];
    var wrongIdx = 0;
    var step = interval || 5;

    for (var i = 0; i < main.length; i++) {
        result.push(main[i]);
        if ((i + 1) % step === 0 && wrongIdx < wrong.length) {
            result.push(wrong[wrongIdx++]);
        }
    }

    // Append remaining wrong questions
    while (wrongIdx < wrong.length) {
        result.push(wrong[wrongIdx++]);
    }

    return result;
};

window.QuestionEngine = QuestionEngine;
