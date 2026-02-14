/**
 * knowledge-ui.js
 * 海拉鲁知识图鉴 — UI渲染系统
 *
 * 三层导航结构：
 *   Layer 1: 区域地图 (Region Map)
 *   Layer 2: 区域图鉴/神庙列表 (Shrine List)
 *   Layer 3: 知识详情 (Knowledge Detail)
 *
 * 另有：速查模式、快速测验、克洛格发现、贤者觉醒
 */

var KnowledgeUI = {

    _currentRegion: null,
    _currentShrine: null,
    _mode: 'quickview',  // 'quickview' (学习内容) or 'explore' (进度追踪)
    _quizState: null,

    // ===== 主入口 =====

    render: function() {
        var container = document.getElementById('learn-content');
        if (!container) return;

        if (this._mode === 'quickview') {
            this.renderQuickView(container);
        } else {
            this.renderRegionMap(container);
        }
    },

    // ===== Layer 1: 区域地图 =====

    renderRegionMap: function(container) {
        this._currentRegion = null;
        this._currentShrine = null;

        var regions = KnowledgeData.regions;
        var html = '<div class="knowledge-mode-bar">' +
            '<button class="knowledge-mode-btn" data-mode="quickview">📖 学习知识</button>' +
            '<button class="knowledge-mode-btn active" data-mode="explore">📊 学习进度</button>' +
            '</div>';

        // v22.0: Mode description
        html += '<div class="knowledge-mode-desc">查看每个知识板块的练习进度，点击可看详细内容。</div>';

        html += '<div class="region-map">';

        for (var i = 0; i < regions.length; i++) {
            var r = regions[i];
            var stats = KnowledgeTracker.getRegionStats(r.id);
            var sageAwakened = KnowledgeTracker.isSageAwakened(r.id);

            html += '<div class="region-card region-' + r.id + (sageAwakened ? ' sage-awakened' : '') + '" data-region="' + r.id + '" style="background:' + r.bgGradient + '">' +
                '<div class="region-card-header">' +
                    '<span class="region-icon">' + r.icon + '</span>' +
                    '<div class="region-info">' +
                        '<div class="region-name">' + r.nameShort + '</div>' +
                        '<div class="region-sage">' + r.sageIcon + ' ' + r.sage + '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="region-desc">' + r.desc + '</div>' +
                '<div class="region-card-footer">' +
                    this._renderProgressRing(stats.percentage, r.color, 36) +
                    '<div class="region-stats">' +
                        '<span class="region-stat-main">神庙 ' + (stats.mastered + stats.perfected) + '/' + stats.total + '</span>' +
                        (stats.perfected > 0 ? ' <span class="region-stat-star">⭐' + stats.perfected + '</span>' : '') +
                    '</div>' +
                '</div>' +
            '</div>';
        }

        html += '</div>';
        container.innerHTML = html;

        // 绑定事件
        this._bindRegionEvents(container);
    },

    // ===== Layer 2: 区域图鉴/神庙列表 =====

    renderRegionDetail: function(container, regionId) {
        this._currentRegion = regionId;
        this._currentShrine = null;

        var region = this._getRegion(regionId);
        if (!region) return;

        var shrines = KnowledgeData.shrines[regionId] || [];
        var stats = KnowledgeTracker.getRegionStats(regionId);
        var sageAwakened = KnowledgeTracker.isSageAwakened(regionId);

        var html = '<div class="region-detail" style="--region-color:' + region.color + '">';

        // Banner
        html += '<div class="region-banner" style="background:' + region.bgGradient + '">' +
            '<button class="knowledge-back-btn" data-action="back-to-map">← 返回</button>' +
            '<div class="region-banner-content">' +
                '<span class="region-banner-icon">' + region.icon + '</span>' +
                '<div class="region-banner-info">' +
                    '<div class="region-banner-name">' + region.name + '</div>' +
                    '<div class="region-banner-sage">' + region.sageIcon + ' ' + region.sage +
                        (sageAwakened ? ' <span class="sage-badge">✨ 已觉醒</span>' : '') +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="region-banner-progress">' +
                this._renderProgressRing(stats.percentage, region.color, 44) +
                '<span class="region-banner-pct">' + stats.percentage + '%</span>' +
            '</div>' +
        '</div>';

        // Shrine list
        html += '<div class="shrine-list">';

        for (var i = 0; i < shrines.length; i++) {
            var s = shrines[i];
            var status = KnowledgeTracker.getStatus(s.id);
            var progress = KnowledgeTracker.getProgress(s.id);

            // v22.0: Always show real names, use friendly status labels
            var statusLabel = status === 'undiscovered' ? '未练习' :
                              status === 'discovered' ? '已练习' :
                              status === 'mastered' ? '已掌握' : '完美掌握';

            html += '<div class="shrine-entry status-' + status + ' shrine-type-' + s.type + '" data-shrine="' + s.id + '" data-region="' + regionId + '">' +
                '<div class="shrine-entry-left">' +
                    '<span class="shrine-entry-icon">' + s.icon + '</span>' +
                    '<div class="shrine-entry-info">' +
                        '<div class="shrine-entry-name">' + s.name + '</div>' +
                        '<div class="shrine-entry-subtitle">' + s.subtitle +
                            ' <span class="shrine-type-badge shrine-type-' + s.type + '">' + s.typeLabel + '</span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="shrine-entry-right">' +
                    '<span class="shrine-status-label status-' + status + '">' + statusLabel + '</span>' +
                    (progress ? '<div class="shrine-entry-count">' + progress.correct + '/' + progress.encountered + '</div>' : '') +
                '</div>' +
            '</div>';
        }

        html += '</div>';

        // Practice button
        html += '<button class="knowledge-practice-btn" onclick="startPractice(\'' + region.module + '\');">' +
            '⚔️ 进入' + region.nameShort + '训练 →' +
        '</button>';

        html += '</div>';
        container.innerHTML = html;

        // Animate in
        var detail = container.querySelector('.region-detail');
        if (detail) detail.classList.add('hyrule-animate-in');

        this._bindShrineEvents(container);
    },

    // ===== Layer 3: 知识详情 =====

    renderShrineDetail: function(container, regionId, shrineId) {
        this._currentShrine = shrineId;

        var region = this._getRegion(regionId);
        var shrine = this._getShrine(regionId, shrineId);
        if (!region || !shrine) return;

        var status = KnowledgeTracker.getStatus(shrineId);
        var progress = KnowledgeTracker.getProgress(shrineId);
        // v22.0: Friendly status labels
        var statusLabel = status === 'undiscovered' ? '未练习' :
                          status === 'discovered' ? '已练习' :
                          status === 'mastered' ? '已掌握' : '完美掌握';

        var html = '<div class="knowledge-detail" style="--region-color:' + region.color + '">';

        // Header
        html += '<div class="knowledge-detail-header">' +
            '<button class="knowledge-back-btn" data-action="back-to-region" data-region="' + regionId + '">← ' + region.nameShort + '</button>' +
            '<div class="knowledge-detail-status"><span class="shrine-status-label status-' + status + '">' + statusLabel + '</span></div>' +
        '</div>';

        // Shrine name
        html += '<div class="knowledge-shrine-title">' +
            '<span class="knowledge-shrine-icon">' + shrine.icon + '</span>' +
            '<div>' +
                '<div class="knowledge-shrine-name">' + shrine.name + '</div>' +
                '<div class="knowledge-shrine-subtitle">' + shrine.subtitle + '</div>' +
            '</div>' +
        '</div>';

        // v22.0: Always show formula content (no lock)
        html += '<div class="knowledge-formula-box">';
        html += '<div class="knowledge-items">';
        for (var i = 0; i < shrine.items.length; i++) {
            html += '<span class="knowledge-item">' + shrine.items[i] + '</span>';
        }
        html += '</div>';
        html += '</div>';

        // Tip — always show
        if (shrine.tip) {
            html += '<div class="knowledge-section">' +
                '<div class="knowledge-section-title">💡 记忆秘技</div>' +
                '<div class="knowledge-section-text">' + shrine.tip + '</div>' +
            '</div>';
        }

        // Battle effect — always show
        if (shrine.battleEffect) {
            html += '<div class="knowledge-section">' +
                '<div class="knowledge-section-title">⚔️ 战斗效果</div>' +
                '<div class="knowledge-section-text">' + shrine.battleEffect + '</div>' +
            '</div>';
        }

        // Progress
        if (progress) {
            var rate = progress.encountered > 0 ? Math.round(progress.correct / progress.encountered * 100) : 0;
            html += '<div class="knowledge-section">' +
                '<div class="knowledge-section-title">📊 掌握情况</div>' +
                '<div class="knowledge-progress-stats">' +
                    '遇到' + progress.encountered + '次 · 答对' + progress.correct + '次 · 正确率' + rate + '%' +
                '</div>' +
                '<div class="knowledge-progress-bar">' +
                    '<div class="knowledge-progress-fill" style="width:' + rate + '%;background:' + (rate >= 90 ? 'var(--ancient-gold)' : rate >= 70 ? 'var(--zonai-green)' : 'var(--sheikah-blue)') + '"></div>' +
                '</div>' +
            '</div>';
        }

        // Related shrines
        if (shrine.related && shrine.related.length > 0) {
            html += '<div class="knowledge-section">' +
                '<div class="knowledge-section-title">🔗 关联神庙</div>' +
                '<div class="knowledge-related">';
            for (var j = 0; j < shrine.related.length; j++) {
                var relatedShrine = this._getShrine(regionId, shrine.related[j]);
                if (relatedShrine) {
                    var relStatus = KnowledgeTracker.getStatus(relatedShrine.id);
                    html += '<span class="knowledge-related-link status-' + relStatus + '" data-shrine="' + relatedShrine.id + '" data-region="' + regionId + '">' +
                        relatedShrine.icon + ' ' + relatedShrine.subtitle +
                    '</span>';
                }
            }
            html += '</div></div>';
        }

        // Quiz button
        html += '<button class="knowledge-quiz-btn" data-shrine="' + shrineId + '" data-region="' + regionId + '">' +
            '⚔️ 挑战此神庙' +
        '</button>';

        // Korok hint
        if (shrine.korok) {
            var korokFound = KnowledgeTracker.getProgress('_korok_' + shrineId);
            if (!korokFound) {
                html += '<div class="knowledge-korok-hint" data-shrine="' + shrineId + '">' +
                    '<span class="korok-seed">🌰</span> ' + (shrine.korokHint || '这里隐藏着一个速算秘技...') +
                '</div>';
            }
        }

        html += '</div>';
        container.innerHTML = html;

        // Animate
        var detail = container.querySelector('.knowledge-detail');
        if (detail) detail.classList.add('hyrule-animate-in');

        this._bindDetailEvents(container);
    },

    // ===== 速查模式 =====

    renderQuickView: function(container) {
        var tabs = KnowledgeData.regions;
        var activeTab = this._currentRegion || 'xiaojiujiu';

        var html = '<div class="knowledge-mode-bar">' +
            '<button class="knowledge-mode-btn active" data-mode="quickview">📖 学习知识</button>' +
            '<button class="knowledge-mode-btn" data-mode="explore">📊 学习进度</button>' +
            '</div>';

        // v22.0: Mode description
        html += '<div class="knowledge-mode-desc">选择板块查看公式和口诀，帮你快速记住知识点。</div>';

        html += '<div class="quick-view">';

        // Tabs
        html += '<div class="quick-view-tabs">';
        for (var i = 0; i < tabs.length; i++) {
            html += '<button class="quick-view-tab' + (tabs[i].id === activeTab ? ' active' : '') + '" data-tab="' + tabs[i].id + '" style="--tab-color:' + tabs[i].color + '">' +
                tabs[i].icon + ' ' + tabs[i].nameShort +
            '</button>';
        }
        html += '</div>';

        // Practice button — placed before cards so it's immediately visible
        var tabNames = { xiaojiujiu:'小九九', times:'大九九+平方', multiply:'乘法速记', fraction:'分数小数', decimal:'小数规律', unit:'单位换算' };
        html += '<button class="knowledge-practice-btn" onclick="startPractice(\'' + activeTab + '\');">' +
            '⚔️ 开始练习 ' + (tabNames[activeTab] || activeTab) + ' →' +
        '</button>';

        // Content - use original MathData.learnCards
        var cards = MathData.learnCards[activeTab] || [];
        html += '<div class="quick-view-content">';

        for (var j = 0; j < cards.length; j++) {
            html += '<div class="quick-view-card">' +
                '<div class="quick-view-card-title">' + cards[j].title + '</div>' +
                '<div class="quick-view-card-items">';
            for (var k = 0; k < cards[j].items.length; k++) {
                html += '<span class="quick-view-item">' + cards[j].items[k] + '</span>';
            }
            html += '</div></div>';
        }

        html += '</div>';
        container.innerHTML = html;

        this._bindQuickViewEvents(container);
    },

    // ===== 快速测验 =====

    startQuiz: function(regionId, shrineId) {
        var shrine = this._getShrine(regionId, shrineId);
        if (!shrine) return;

        // 从该模块的题库抽题
        var region = this._getRegion(regionId);
        if (!region) return;

        var allQuestions = [];
        var difficulties = ['easy', 'normal', 'hard', 'warmup'];
        var moduleData = MathData[region.module];

        if (moduleData) {
            for (var d = 0; d < difficulties.length; d++) {
                var qs = moduleData[difficulties[d]];
                if (qs) {
                    for (var qi = 0; qi < qs.length; qi++) {
                        allQuestions.push(qs[qi]);
                    }
                }
            }
        }

        // 过滤与该shrine相关的题目
        var relevantQs = [];
        for (var i = 0; i < allQuestions.length; i++) {
            var qText = allQuestions[i].q.replace(/\s+/g, '');
            for (var j = 0; j < shrine.items.length; j++) {
                var itemClean = shrine.items[j].replace(/\s+/g, '').split('（')[0].split('=')[0];
                if (qText.indexOf(itemClean) !== -1 || itemClean.indexOf(qText.split('=')[0]) !== -1) {
                    relevantQs.push(allQuestions[i]);
                    break;
                }
            }
        }

        // 如果找不到足够相关题目，从全题库随机取
        if (relevantQs.length < 3) {
            relevantQs = allQuestions.slice();
        }

        // 随机取5题（或更少）
        var quizQs = this._shuffleArray(relevantQs).slice(0, 5);

        this._quizState = {
            regionId: regionId,
            shrineId: shrineId,
            questions: quizQs,
            current: 0,
            correct: 0,
            total: quizQs.length
        };

        this._renderQuizQuestion();
    },

    _renderQuizQuestion: function() {
        var state = this._quizState;
        if (!state) return;

        if (state.current >= state.total) {
            this._renderQuizResult();
            return;
        }

        var q = state.questions[state.current];
        var container = document.getElementById('learn-content');
        if (!container) return;

        var region = this._getRegion(state.regionId);

        // Generate choices
        var choices = this._generateChoices(q.a);

        var html = '<div class="quiz-overlay" style="--region-color:' + (region ? region.color : '#00b4d8') + '">' +
            '<div class="quiz-header">' +
                '<span class="quiz-progress">' + (state.current + 1) + '/' + state.total + '</span>' +
                '<button class="quiz-close-btn" data-action="quiz-close">✕</button>' +
            '</div>' +
            '<div class="quiz-card">' +
                '<div class="quiz-question">' + q.q + ' = ?</div>' +
                '<div class="quiz-choices">';

        for (var i = 0; i < choices.length; i++) {
            html += '<button class="quiz-choice-btn" data-answer="' + choices[i] + '">' + choices[i] + '</button>';
        }

        html += '</div></div></div>';
        container.innerHTML = html;

        // Bind choice events
        var self = this;
        container.querySelectorAll('.quiz-choice-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var answer = Number(btn.dataset.answer);
                var isCorrect = answer === q.a;

                if (isCorrect) {
                    btn.classList.add('correct');
                    state.correct++;
                } else {
                    btn.classList.add('wrong');
                    // Highlight correct answer
                    container.querySelectorAll('.quiz-choice-btn').forEach(function(b) {
                        if (Number(b.dataset.answer) === q.a) b.classList.add('correct');
                    });
                }

                // Record answer
                var region = self._getRegion(state.regionId);
                if (region) {
                    KnowledgeTracker.recordAnswer(region.module, q.q, isCorrect, isCorrect ? 2 : 0);
                }

                // Disable all buttons
                container.querySelectorAll('.quiz-choice-btn').forEach(function(b) {
                    b.disabled = true;
                });

                // Next question after delay
                setTimeout(function() {
                    state.current++;
                    self._renderQuizQuestion();
                }, isCorrect ? 600 : 1200);
            });
        });

        // Close button
        var closeBtn = container.querySelector('.quiz-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                self.renderShrineDetail(container, state.regionId, state.shrineId);
            });
        }
    },

    _renderQuizResult: function() {
        var state = this._quizState;
        if (!state) return;

        var container = document.getElementById('learn-content');
        if (!container) return;

        var region = this._getRegion(state.regionId);
        var shrine = this._getShrine(state.regionId, state.shrineId);
        var allCorrect = state.correct === state.total;
        var rate = Math.round(state.correct / state.total * 100);

        var html = '<div class="quiz-overlay" style="--region-color:' + (region ? region.color : '#00b4d8') + '">' +
            '<div class="quiz-result">' +
                '<div class="quiz-result-icon">' + (allCorrect ? '⭐' : rate >= 60 ? '🟢' : '🔵') + '</div>' +
                '<div class="quiz-result-title">' + (allCorrect ? '完美通关！' : rate >= 60 ? '挑战成功！' : '继续加油！') + '</div>' +
                '<div class="quiz-result-score">' + state.correct + '/' + state.total + ' 正确</div>' +
                '<div class="quiz-result-shrine">' + (shrine ? shrine.name : '') + '</div>' +
                '<div class="quiz-result-actions">' +
                    '<button class="quiz-action-btn" data-action="quiz-retry">🔄 再试一次</button>' +
                    '<button class="quiz-action-btn quiz-action-primary" data-action="quiz-back">← 返回</button>' +
                '</div>' +
            '</div>' +
        '</div>';

        container.innerHTML = html;

        // Check sage awakening
        if (region) {
            var wasAwakened = KnowledgeTracker.isSageAwakened(state.regionId);
            if (!wasAwakened && KnowledgeTracker.checkSageAwakening(state.regionId)) {
                KnowledgeTracker.markSageAwakened(state.regionId);
                setTimeout(function() {
                    KnowledgeUI._showSageAwakening(region);
                }, 800);
            }
        }

        // Bind events
        var self = this;
        container.querySelectorAll('.quiz-action-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                if (btn.dataset.action === 'quiz-retry') {
                    self.startQuiz(state.regionId, state.shrineId);
                } else {
                    self.renderShrineDetail(container, state.regionId, state.shrineId);
                }
            });
        });
    },

    // ===== 贤者觉醒 =====

    _showSageAwakening: function(region) {
        var overlay = document.createElement('div');
        overlay.className = 'sage-overlay';
        overlay.innerHTML = '<div class="sage-popup">' +
            '<div class="sage-popup-icon">' + region.sageIcon + '</div>' +
            '<div class="sage-popup-name">' + region.sage + '</div>' +
            '<div class="sage-popup-msg">"你已经掌握了' + region.nameShort + '的力量！"</div>' +
            '<div class="sage-reward">' +
                '<div class="sage-reward-title">贤者之力已觉醒</div>' +
                '<div class="sage-reward-desc">' + region.nameShort + ' 全部必修神庙已掌握</div>' +
            '</div>' +
            '<button class="sage-continue-btn">继续冒险 →</button>' +
        '</div>';

        document.body.appendChild(overlay);

        // Play sound if available
        if (typeof playSound === 'function') {
            playSound('achievement');
        }

        overlay.querySelector('.sage-continue-btn').addEventListener('click', function() {
            overlay.classList.add('sage-fade-out');
            setTimeout(function() { overlay.remove(); }, 300);
        });
    },

    // ===== 克洛格发现 =====

    _showKorokDiscovery: function(shrine) {
        var overlay = document.createElement('div');
        overlay.className = 'korok-overlay';
        overlay.innerHTML = '<div class="korok-popup">' +
            '<div class="korok-popup-icon">🌰</div>' +
            '<div class="korok-popup-msg">"呀哈哈！你发现了我！"</div>' +
            '<div class="korok-reveal">' +
                '<div class="korok-reveal-title">💡 速算秘技：' + shrine.subtitle + '</div>' +
                '<div class="korok-reveal-hint">' + (shrine.korokHint || '') + '</div>' +
            '</div>' +
            '<button class="korok-dismiss-btn">🌱 记住了！</button>' +
        '</div>';

        document.body.appendChild(overlay);

        if (typeof playSound === 'function') {
            playSound('item_drop');
        }

        // Mark korok as found
        KnowledgeTracker.recordAnswer('_korok', shrine.id, true, 0);

        overlay.querySelector('.korok-dismiss-btn').addEventListener('click', function() {
            overlay.classList.add('korok-fade-out');
            setTimeout(function() { overlay.remove(); }, 300);
        });
    },

    // ===== 辅助渲染 =====

    _renderProgressRing: function(percentage, color, size) {
        var r = (size - 4) / 2;
        var c = 2 * Math.PI * r;
        var offset = c * (1 - percentage / 100);

        return '<svg class="progress-ring" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' +
            '<circle class="progress-ring-bg" cx="' + (size/2) + '" cy="' + (size/2) + '" r="' + r + '" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="3"/>' +
            '<circle class="progress-ring-fill" cx="' + (size/2) + '" cy="' + (size/2) + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="3" ' +
                'stroke-dasharray="' + c + '" stroke-dashoffset="' + offset + '" stroke-linecap="round" transform="rotate(-90 ' + (size/2) + ' ' + (size/2) + ')"/>' +
        '</svg>';
    },

    _renderStatusIcon: function(status) {
        var icons = {
            undiscovered: '<span class="status-icon status-locked">🔒</span>',
            discovered: '<span class="status-icon status-discovered">🔵</span>',
            mastered: '<span class="status-icon status-mastered">🟢</span>',
            perfected: '<span class="status-icon status-perfected">⭐</span>'
        };
        return icons[status] || icons.undiscovered;
    },

    _renderStatusBadge: function(status) {
        var labels = {
            undiscovered: '未发现',
            discovered: '已发现',
            mastered: '已掌握',
            perfected: '精通'
        };
        return '<span class="status-badge status-badge-' + status + '">' + labels[status] + '</span>';
    },

    // ===== 事件绑定 =====

    _bindRegionEvents: function(container) {
        var self = this;

        // Mode toggle
        container.querySelectorAll('.knowledge-mode-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                self._mode = btn.dataset.mode;
                self.render();
            });
        });

        // Region cards
        container.querySelectorAll('.region-card').forEach(function(card) {
            card.addEventListener('click', function() {
                self.renderRegionDetail(container, card.dataset.region);
            });
        });
    },

    _bindShrineEvents: function(container) {
        var self = this;

        // Back button
        var backBtn = container.querySelector('[data-action="back-to-map"]');
        if (backBtn) {
            backBtn.addEventListener('click', function() {
                self.renderRegionMap(container);
            });
        }

        // Shrine entries
        container.querySelectorAll('.shrine-entry').forEach(function(entry) {
            entry.addEventListener('click', function() {
                var status = KnowledgeTracker.getStatus(entry.dataset.shrine);
                if (status === 'undiscovered') {
                    // Show hint instead of detail
                    entry.classList.add('shrine-entry-shake');
                    setTimeout(function() { entry.classList.remove('shrine-entry-shake'); }, 500);
                    return;
                }
                self.renderShrineDetail(container, entry.dataset.region, entry.dataset.shrine);
            });
        });
    },

    _bindDetailEvents: function(container) {
        var self = this;

        // Back button
        var backBtn = container.querySelector('[data-action="back-to-region"]');
        if (backBtn) {
            backBtn.addEventListener('click', function() {
                self.renderRegionDetail(container, backBtn.dataset.region);
            });
        }

        // Quiz button
        var quizBtn = container.querySelector('.knowledge-quiz-btn');
        if (quizBtn) {
            quizBtn.addEventListener('click', function() {
                self.startQuiz(quizBtn.dataset.region, quizBtn.dataset.shrine);
            });
        }

        // Related shrine links
        container.querySelectorAll('.knowledge-related-link').forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.stopPropagation();
                var relStatus = KnowledgeTracker.getStatus(link.dataset.shrine);
                if (relStatus !== 'undiscovered') {
                    self.renderShrineDetail(container, link.dataset.region, link.dataset.shrine);
                }
            });
        });

        // Korok hint
        var korokHint = container.querySelector('.knowledge-korok-hint');
        if (korokHint) {
            korokHint.addEventListener('click', function() {
                var shrine = self._getShrine(self._currentRegion, korokHint.dataset.shrine);
                if (shrine) {
                    self._showKorokDiscovery(shrine);
                }
            });
        }
    },

    _bindQuickViewEvents: function(container) {
        var self = this;

        // Mode toggle
        container.querySelectorAll('.knowledge-mode-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                self._mode = btn.dataset.mode;
                self.render();
            });
        });

        // Tab switching
        container.querySelectorAll('.quick-view-tab').forEach(function(tab) {
            tab.addEventListener('click', function() {
                self._currentRegion = tab.dataset.tab;
                self.renderQuickView(container);
            });
        });
    },

    // ===== 数据查找 =====

    _getRegion: function(regionId) {
        var regions = KnowledgeData.regions;
        for (var i = 0; i < regions.length; i++) {
            if (regions[i].id === regionId) return regions[i];
        }
        return null;
    },

    _getShrine: function(regionId, shrineId) {
        var shrines = KnowledgeData.shrines[regionId] || [];
        for (var i = 0; i < shrines.length; i++) {
            if (shrines[i].id === shrineId) return shrines[i];
        }
        return null;
    },

    _shuffleArray: function(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = a[i]; a[i] = a[j]; a[j] = temp;
        }
        return a;
    },

    _generateChoices: function(correctAnswer) {
        var choices = [correctAnswer];
        var attempts = 0;

        while (choices.length < 4 && attempts < 20) {
            var offset = Math.floor(Math.random() * 10) + 1;
            if (Math.random() > 0.5) offset = -offset;
            var wrong = correctAnswer + offset;
            if (wrong > 0 && choices.indexOf(wrong) === -1) {
                choices.push(wrong);
            }
            attempts++;
        }

        // Fill remaining with random
        while (choices.length < 4) {
            var r = Math.floor(Math.random() * correctAnswer * 2) + 1;
            if (choices.indexOf(r) === -1) choices.push(r);
        }

        return this._shuffleArray(choices);
    }
};
