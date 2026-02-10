/**
 * app.js - v14.0 Entry point (DOMContentLoaded only)
 *
 * Module load order (in index.html):
 *   data.js -> 5 monster files -> core.js -> effects.js -> practice.js ->
 *   daily.js -> ui-pages.js -> battle-data.js -> battle-collection.js ->
 *   battle-combat.js -> app.js
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize user page and event listeners
    initUserPage();
    initEventListeners();

    // Click user badge to switch users
    document.getElementById('current-user-badge').addEventListener('click', () => {
        showPage('user');
        renderUserList();
    });

    // Prevent iOS double-tap zoom
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Prevent iOS Safari pull-to-refresh
    document.body.addEventListener('touchmove', (e) => {
        if (e.target.closest('.learn-content, .wrong-list, .settings-list, .achievements-grid')) {
            return;
        }
    }, { passive: true });

    // iOS standalone mode detection
    if (window.navigator.standalone === true) {
        document.body.classList.add('ios-standalone');
    }

    // Handle iOS soft keyboard - enhanced
    const answerInput = document.getElementById('answer-input');

    // Use visualViewport API to detect keyboard
    if (window.visualViewport) {
        let initialHeight = window.visualViewport.height;

        window.visualViewport.addEventListener('resize', () => {
            const currentHeight = window.visualViewport.height;
            const heightDiff = initialHeight - currentHeight;

            if (heightDiff > 150) {
                document.body.classList.add('keyboard-active');
                if (document.activeElement === answerInput) {
                    setTimeout(() => {
                        answerInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                }
            } else {
                document.body.classList.remove('keyboard-active');
            }
        });
    }

    // Input focus handling
    if (answerInput) {
        answerInput.addEventListener('focus', () => {
            document.body.classList.add('keyboard-active');
            setTimeout(() => {
                const questionCard = document.getElementById('question-card');
                if (questionCard) {
                    questionCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                setTimeout(() => {
                    answerInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 150);
            }, 300);
        });

        answerInput.addEventListener('blur', () => {
            setTimeout(() => {
                if (document.activeElement !== answerInput) {
                    document.body.classList.remove('keyboard-active');
                    window.scrollTo(0, 0);
                }
            }, 100);
        });
    }

    // Handle other input fields
    document.querySelectorAll('input:not(#answer-input)').forEach(input => {
        input.addEventListener('focus', () => {
            setTimeout(() => {
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });

    // Keyboard shortcuts (1234 to select answers)
    document.addEventListener('keydown', (e) => {
        if (App.currentPage === 'practice' || App.currentPage === 'daily' || App.currentPage === 'battle') {
            const key = e.key;
            if (['1', '2', '3', '4'].includes(key)) {
                let choicesContainer;
                if (App.currentPage === 'battle') {
                    choicesContainer = document.getElementById('battle-choices');
                } else if (App.currentPage === 'daily') {
                    choicesContainer = document.getElementById('daily-choices');
                } else {
                    choicesContainer = document.getElementById('choices');
                }
                const buttons = choicesContainer.querySelectorAll('.battle-choice-btn:not(:disabled), .choice-btn:not(:disabled)');
                const index = parseInt(key) - 1;
                if (buttons[index]) {
                    buttons[index].click();
                }
            }
        }
    });

    // Initialize battle mode
    BattleMode.init();

    // v15.0: Card collection entry
    document.getElementById('open-card-collection')?.addEventListener('click', () => {
        BattleMode.openCardCollection();
    });

    // v15.0: Card collection page events
    document.getElementById('card-collection-back')?.addEventListener('click', () => {
        showPage('home');
        updateHomeStats();
    });

    document.querySelectorAll('.card-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.card-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            BattleMode.renderCardGrid(btn.dataset.filter);
        });
    });

    // v16.0: Trial Tower entry
    document.getElementById('trial-tower-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (BattleMode.isTowerUnlocked()) {
            BattleMode.showTowerLobby();
        } else {
            alert('试炼之塔尚未解锁！\n需要总分达到500分才能开启。');
        }
    });

    // v16.0: Battle result/fail buttons - handle tower mode
    document.getElementById('battle-retry-btn')?.addEventListener('click', () => {
        if (App.tower.active || App.tower.maxFloorReached > 0) {
            BattleMode.showTowerLobby();
        }
    });
    document.getElementById('battle-home-btn')?.addEventListener('click', () => {
        if (App.tower.active) {
            App.tower.active = false;
        }
    });
    document.getElementById('battle-retry-fail-btn')?.addEventListener('click', () => {
        if (App.tower.active || App.tower.maxFloorReached > 0) {
            BattleMode.showTowerLobby();
        }
    });
    document.getElementById('battle-home-fail-btn')?.addEventListener('click', () => {
        if (App.tower.active) {
            App.tower.active = false;
        }
    });
});
