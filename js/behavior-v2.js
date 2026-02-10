/**
 * behavior-v2.js - v16.0 Extended Monster Behaviors & Personality System
 * 5 new behaviors: counter, split, curse, shield, transform
 * 6 personality types that determine behavior preferences
 * Extends global BattleMode object (loaded after monster-behavior.js)
 */

// ===== Personality System Constants =====

BattleMode.PERSONALITIES = {
    cunning:    { name: '狡猾型', icon: '🦊', behaviorWeights: { dodge: 0.30, taunt: 0.20, escape: 0.15, fear: 0.05, counter: 0.10, split: 0.10, curse: 0.10 } },
    violent:    { name: '暴力型', icon: '💢', behaviorWeights: { enrage: 0.30, counter: 0.25, taunt: 0.15, fear: 0.05, dodge: 0.05, selfDestruct: 0.10, shield: 0.10 } },
    defensive:  { name: '防御型', icon: '🛡️', behaviorWeights: { defend: 0.30, shield: 0.25, heal: 0.20, counter: 0.10, fear: 0.05, taunt: 0.10 } },
    sinister:   { name: '阴险型', icon: '🕷️', behaviorWeights: { curse: 0.25, selfDestruct: 0.20, summon: 0.20, split: 0.15, dodge: 0.10, taunt: 0.10 } },
    timid:      { name: '胆小型', icon: '🐰', behaviorWeights: { fear: 0.30, escape: 0.30, dodge: 0.15, heal: 0.15, taunt: 0.05, defend: 0.05 } },
    domineering:{ name: '霸道型', icon: '👑', behaviorWeights: { transform: 0.15, summon: 0.15, defend: 0.15, counter: 0.15, enrage: 0.15, shield: 0.10, curse: 0.10, taunt: 0.05 } }
};

// Default quips for v2 behaviors
var DefaultQuipsV2 = {
    counter:   ['反弹!', '还给你!', '你打我？我打你!', '别想轻易伤到我!'],
    split:     ['分裂!', '我变多了!', '嘿嘿，砍不完的!', '一变二!'],
    curse:     ['受死吧...', '诅咒降临!', '你已被诅咒...', '嘿嘿嘿...'],
    shield:    ['防护罩!', '你打不穿的!', '铁壁!', '给我挡住!'],
    transform: ['见识我的真面目!', '变身!', '这才是真正的我!', '第二形态!']
};

window.DefaultQuipsV2 = DefaultQuipsV2;

// ===== Get Monster Personality =====

BattleMode.getMonsterPersonality = function(monster) {
    if (!monster) return 'cunning';

    // If monster has explicit personality field, use it
    if (monster.personality && BattleMode.PERSONALITIES[monster.personality]) {
        return monster.personality;
    }

    // Assign based on monster type
    var type = monster.type;
    if (type === 'fire' || type === 'dragon') return 'violent';
    if (type === 'ice' || type === 'rock' || type === 'steel') return 'defensive';
    if (type === 'fox' || type === 'ghost' || type === 'spirit') return 'cunning';
    if (type === 'poison' || type === 'dark' || type === 'undead') return 'sinister';
    if (type === 'small' || type === 'animal' || type === 'insect') return 'timid';

    // Boss monsters (HP >= 8) are domineering
    if (monster.hp >= 8) return 'domineering';

    // Default: random from 5 common types
    var commonTypes = ['cunning', 'violent', 'defensive', 'sinister', 'timid'];
    return commonTypes[Math.floor(Math.random() * commonTypes.length)];
};

// ===== Execute Counter =====

BattleMode.executeCounter = function(cb) {
    var battle = App.battle;
    var monster = battle.currentMonster;

    playSound('counter');

    var quips = DefaultQuipsV2.counter;
    var quip = quips[Math.floor(Math.random() * quips.length)];
    var enemyEmoji = document.getElementById('monster-emoji');
    var heroEl = document.getElementById('hero-sprite');
    var arena = document.querySelector('.battle-arena');

    // Step 1: Monster blocks - shield emoji appears (0.15s)
    var shieldEl = document.createElement('div');
    shieldEl.className = 'behavior-effect counter-shield';
    shieldEl.textContent = '🛡️';
    shieldEl.style.cssText = 'position:absolute;font-size:2rem;z-index:100;opacity:0;transition:opacity 0.15s;';
    if (enemyEmoji) {
        enemyEmoji.parentNode.appendChild(shieldEl);
        shieldEl.style.left = enemyEmoji.offsetLeft + 'px';
        shieldEl.style.top = enemyEmoji.offsetTop + 'px';
    } else if (arena) {
        arena.appendChild(shieldEl);
        shieldEl.style.right = '20%';
        shieldEl.style.top = '30%';
    }
    requestAnimationFrame(function() { shieldEl.style.opacity = '1'; });

    setTimeout(function() {
        // Step 2: Weapon bounces back toward hero (0.2s)
        shieldEl.style.opacity = '0';
        var bounceEl = document.createElement('div');
        bounceEl.className = 'behavior-effect counter-bounce';
        bounceEl.textContent = '⚔️';
        bounceEl.style.cssText = 'position:absolute;font-size:1.5rem;z-index:100;transition:transform 0.2s ease-in,opacity 0.2s;';
        if (arena) {
            arena.appendChild(bounceEl);
            bounceEl.style.right = '60%';
            bounceEl.style.top = '40%';
            requestAnimationFrame(function() {
                bounceEl.style.transform = 'translateX(-80px) rotate(360deg)';
            });
        }

        setTimeout(function() {
            // Step 3: Hero hit animation (0.2s)
            bounceEl.remove();
            shieldEl.remove();
            if (heroEl) {
                heroEl.classList.add('hit-flash');
                setTimeout(function() { heroEl.classList.remove('hit-flash'); }, 200);
            }

            // Apply damage
            battle.playerHP = Math.max(0, battle.playerHP - 1);
            battle.noDamageTaken = false;
            battle.counterPending = false;
            BattleMode.updateUI();

            setTimeout(function() {
                // Step 4: "反击!" text (0.3s)
                if (enemyEmoji) {
                    BattleMode.showSpeechBubble(enemyEmoji, quip, 800);
                }
                BattleMode.showBattleFeedback(false, '⚔️ 反击! -1 HP，下次攻击+1');

                setTimeout(function() {
                    if (cb) cb({ countered: true });
                }, 300);
            }, 200);
        }, 200);
    }, 150);
};

// ===== Execute Split =====

BattleMode.executeSplit = function(cb) {
    var battle = App.battle;
    var monster = battle.currentMonster;

    playSound('split');

    var quips = DefaultQuipsV2.split;
    var quip = quips[Math.floor(Math.random() * quips.length)];
    var enemyEmoji = document.getElementById('monster-emoji');
    var arena = document.querySelector('.battle-arena');
    var monsterChar = monster ? (monster.emoji || '👾') : '👾';

    // Step 1: Monster death animation starts (midpoint preparation)
    if (enemyEmoji) {
        enemyEmoji.style.transition = 'transform 0.3s, opacity 0.3s';
        enemyEmoji.style.transform = 'scale(0.5)';
        enemyEmoji.style.opacity = '0.5';
    }

    setTimeout(function() {
        // Step 2: Two small emojis fly out left and right (0.3s)
        var splitLeft = document.createElement('div');
        var splitRight = document.createElement('div');
        splitLeft.className = 'behavior-effect split-fragment split-left';
        splitRight.className = 'behavior-effect split-fragment split-right';
        splitLeft.textContent = monsterChar;
        splitRight.textContent = monsterChar;
        var splitStyle = 'position:absolute;font-size:1rem;z-index:100;transition:transform 0.3s ease-out,opacity 0.3s;';
        splitLeft.style.cssText = splitStyle + 'right:25%;top:30%;';
        splitRight.style.cssText = splitStyle + 'right:15%;top:30%;';

        if (arena) {
            arena.appendChild(splitLeft);
            arena.appendChild(splitRight);
        }

        requestAnimationFrame(function() {
            splitLeft.style.transform = 'translateX(-50px) scale(0.8)';
            splitRight.style.transform = 'translateX(50px) scale(0.8)';
        });

        setTimeout(function() {
            // Step 3: One disappears, one stays as the "split" (0.2s)
            splitLeft.style.opacity = '0';
            setTimeout(function() { splitLeft.remove(); }, 200);

            // Restore enemy emoji as the remaining split
            if (enemyEmoji) {
                enemyEmoji.style.transform = 'scale(0.7)';
                enemyEmoji.style.opacity = '1';
            }

            // Set split state
            battle.splitActive = true;
            BattleMode.updateUI();

            setTimeout(function() {
                // Step 4: "分裂!" text (0.3s)
                if (enemyEmoji) {
                    BattleMode.showSpeechBubble(enemyEmoji, quip, 800);
                }
                BattleMode.showBattleFeedback(false, '💥 分裂! 需要额外答题!');

                setTimeout(function() {
                    splitRight.remove();
                    if (cb) cb({ split: true });
                }, 300);
            }, 200);
        }, 300);
    }, 300);
};

// ===== Execute Curse =====

BattleMode.executeCurse = function(cb) {
    var battle = App.battle;
    var monster = battle.currentMonster;

    playSound('curse');

    var quips = DefaultQuipsV2.curse;
    var quip = quips[Math.floor(Math.random() * quips.length)];
    var enemyEmoji = document.getElementById('monster-emoji');
    var heroEl = document.getElementById('hero-sprite');
    var arena = document.querySelector('.battle-arena');

    // Step 1: Purple magic circle on ground (0.2s)
    var circleEl = document.createElement('div');
    circleEl.className = 'behavior-effect curse-circle';
    circleEl.textContent = '⭕';
    circleEl.style.cssText = 'position:absolute;font-size:2.5rem;z-index:90;opacity:0;transition:opacity 0.2s;' +
        'filter:hue-rotate(270deg) brightness(0.7);left:15%;bottom:15%;';
    if (arena) {
        arena.appendChild(circleEl);
        requestAnimationFrame(function() { circleEl.style.opacity = '1'; });
    }

    setTimeout(function() {
        // Step 2: Dark mist rises and wraps hero (0.3s)
        var mistEl = document.createElement('div');
        mistEl.className = 'behavior-effect curse-mist';
        mistEl.textContent = '🌫️';
        mistEl.style.cssText = 'position:absolute;font-size:2rem;z-index:95;opacity:0;transition:opacity 0.3s,transform 0.3s;' +
            'left:15%;bottom:20%;filter:hue-rotate(270deg);';
        if (arena) {
            arena.appendChild(mistEl);
            requestAnimationFrame(function() {
                mistEl.style.opacity = '0.8';
                mistEl.style.transform = 'translateY(-40px)';
            });
        }

        setTimeout(function() {
            // Step 3: "诅咒!" text + hero turns slightly purple/dark (0.2s)
            circleEl.style.opacity = '0';
            mistEl.style.opacity = '0';
            setTimeout(function() {
                circleEl.remove();
                mistEl.remove();
            }, 300);

            // Apply purple tint to hero
            if (heroEl) {
                heroEl.classList.add('cursed');
                heroEl.style.filter = 'hue-rotate(270deg) brightness(0.8)';
            }

            // Set curse state
            battle.monsterCursed = true;
            battle.curseRemainingTurns = 2;

            if (enemyEmoji) {
                BattleMode.showSpeechBubble(enemyEmoji, quip, 800);
            }
            BattleMode.showBattleFeedback(false, '🔮 诅咒! 接下来2题选项增加!');

            setTimeout(function() {
                if (cb) cb({ cursed: true });
            }, 200);
        }, 300);
    }, 200);
};

// ===== Execute Shield =====

BattleMode.executeShield = function(behavior, cb) {
    var battle = App.battle;
    var monster = battle.currentMonster;

    playSound('shield');

    var quips = DefaultQuipsV2.shield;
    var quip = quips[Math.floor(Math.random() * quips.length)];
    var enemyEmoji = document.getElementById('monster-emoji');
    var arena = document.querySelector('.battle-arena');

    // Step 1: Energy gathering effect around monster (0.2s)
    var energyEl = document.createElement('div');
    energyEl.className = 'behavior-effect shield-energy';
    energyEl.textContent = '✨';
    energyEl.style.cssText = 'position:absolute;font-size:1.5rem;z-index:100;opacity:0;transition:opacity 0.2s;';
    if (enemyEmoji) {
        energyEl.style.left = enemyEmoji.offsetLeft + 'px';
        energyEl.style.top = (enemyEmoji.offsetTop - 10) + 'px';
        enemyEmoji.parentNode.appendChild(energyEl);
    } else if (arena) {
        arena.appendChild(energyEl);
        energyEl.style.right = '20%';
        energyEl.style.top = '25%';
    }
    requestAnimationFrame(function() { energyEl.style.opacity = '1'; });

    setTimeout(function() {
        energyEl.style.opacity = '0';

        // Step 2: Shield emoji materializes in front of monster (0.2s)
        var shieldEl = document.createElement('div');
        shieldEl.className = 'behavior-effect shield-barrier';
        shieldEl.textContent = '🛡️';
        shieldEl.style.cssText = 'position:absolute;font-size:2.5rem;z-index:100;opacity:0;transition:opacity 0.2s;';
        if (enemyEmoji) {
            shieldEl.style.left = (enemyEmoji.offsetLeft - 20) + 'px';
            shieldEl.style.top = enemyEmoji.offsetTop + 'px';
            enemyEmoji.parentNode.appendChild(shieldEl);
        } else if (arena) {
            arena.appendChild(shieldEl);
            shieldEl.style.right = '22%';
            shieldEl.style.top = '28%';
        }
        requestAnimationFrame(function() { shieldEl.style.opacity = '1'; });

        setTimeout(function() {
            // Step 3: Blue glow on shield (0.1s)
            shieldEl.style.textShadow = '0 0 15px #4488ff, 0 0 30px #4488ff';

            setTimeout(function() {
                energyEl.remove();
                shieldEl.style.opacity = '0';
                setTimeout(function() { shieldEl.remove(); }, 200);

                // Set shield state
                battle.monsterShielded = true;
                BattleMode.updateUI();

                // Step 4: "护盾!" text (0.2s)
                if (enemyEmoji) {
                    BattleMode.showSpeechBubble(enemyEmoji, quip, 800);
                }
                BattleMode.showBattleFeedback(false, '🛡️ 护盾! 需连续答对2题才能破盾!');

                setTimeout(function() {
                    if (cb) cb({ shielded: true });
                }, 200);
            }, 100);
        }, 200);
    }, 200);
};

// ===== Execute Transform =====

BattleMode.executeTransform = function(cb) {
    var battle = App.battle;
    var monster = battle.currentMonster;

    playSound('transform');

    var quips = DefaultQuipsV2.transform;
    var quip = quips[Math.floor(Math.random() * quips.length)];
    var enemyEmoji = document.getElementById('monster-emoji');
    var arena = document.querySelector('.battle-arena');
    var screenFlash = document.getElementById('screen-flash');

    var phase2Emoji = (monster && monster.phase2Emoji) ? monster.phase2Emoji : (monster ? monster.emoji : '👾');
    var phase2Name = (monster && monster.phase2Name) ? monster.phase2Name : ((monster ? monster.name : '怪物') + '·真');
    var phase2HP = (monster && monster.phase2HP) ? monster.phase2HP : Math.ceil(battle.monsterMaxHP * 0.5);

    // Step 1: Screen flash white (0.1s)
    if (screenFlash) {
        screenFlash.style.background = 'white';
        screenFlash.classList.add('show');
    }

    setTimeout(function() {
        if (screenFlash) {
            screenFlash.classList.remove('show');
            screenFlash.style.background = '';
        }

        // Step 2: Monster shrinks + dark energy swirl (0.3s)
        if (enemyEmoji) {
            enemyEmoji.style.transition = 'transform 0.3s ease-in, filter 0.3s';
            enemyEmoji.style.transform = 'scale(0.3) rotate(360deg)';
            enemyEmoji.style.filter = 'brightness(0.3)';
        }

        // Create dark energy swirl particles
        var swirlParticles = [];
        if (arena) {
            for (var i = 0; i < 6; i++) {
                var particle = document.createElement('div');
                particle.className = 'behavior-effect transform-swirl';
                particle.textContent = '🌀';
                particle.style.cssText = 'position:absolute;font-size:1rem;z-index:100;opacity:0;transition:all 0.3s;';
                particle.style.right = (15 + Math.random() * 15) + '%';
                particle.style.top = (20 + Math.random() * 20) + '%';
                arena.appendChild(particle);
                swirlParticles.push(particle);
                requestAnimationFrame(function() { particle.style.opacity = '0.8'; });
            }
        }

        setTimeout(function() {
            // Step 3: Silence + dark screen (0.1s)
            swirlParticles.forEach(function(p) { p.style.opacity = '0'; });
            if (screenFlash) {
                screenFlash.style.background = 'rgba(0,0,0,0.8)';
                screenFlash.classList.add('show');
            }

            setTimeout(function() {
                // Clean up swirl particles
                swirlParticles.forEach(function(p) { p.remove(); });

                // Step 4: New form erupts with energy burst (0.3s)
                if (screenFlash) {
                    screenFlash.classList.remove('show');
                    screenFlash.style.background = '';
                }

                // Change monster appearance
                if (enemyEmoji) {
                    enemyEmoji.textContent = phase2Emoji;
                    enemyEmoji.style.transition = 'transform 0.3s ease-out, filter 0.3s';
                    enemyEmoji.style.transform = 'scale(1.2)';
                    enemyEmoji.style.filter = 'brightness(1.2)';
                }

                // Energy burst particles
                if (arena) {
                    for (var j = 0; j < 8; j++) {
                        var burst = document.createElement('div');
                        burst.className = 'behavior-effect transform-burst';
                        var burstEmojis = ['⚡', '💥', '🔥', '✨'];
                        burst.textContent = burstEmojis[Math.floor(Math.random() * burstEmojis.length)];
                        burst.style.cssText = 'position:absolute;font-size:1.2rem;z-index:100;transition:all 0.3s;';
                        var angle = (j / 8) * Math.PI * 2;
                        burst.style.right = (20 + Math.cos(angle) * 10) + '%';
                        burst.style.top = (30 + Math.sin(angle) * 15) + '%';
                        arena.appendChild(burst);
                        (function(el, a) {
                            requestAnimationFrame(function() {
                                el.style.transform = 'translate(' + (Math.cos(a) * 60) + 'px,' + (Math.sin(a) * 60) + 'px)';
                                el.style.opacity = '0';
                            });
                        })(burst, angle);
                        setTimeout(function(el) { return function() { el.remove(); }; }(burst), 500);
                    }
                }

                setTimeout(function() {
                    // Step 5: New name + "变身!" text (0.3s)
                    // Update battle state for phase 2
                    battle.monsterPhase = 2;
                    if (monster) {
                        monster.emoji = phase2Emoji;
                        monster.name = phase2Name;
                    }

                    // Normalize monster scale
                    if (enemyEmoji) {
                        enemyEmoji.style.transition = 'transform 0.2s';
                        enemyEmoji.style.transform = 'scale(1)';
                        enemyEmoji.style.filter = '';
                    }

                    // Update monster name display
                    var nameEl = document.getElementById('monster-name');
                    if (nameEl) {
                        nameEl.textContent = phase2Name;
                    }

                    if (enemyEmoji) {
                        BattleMode.showSpeechBubble(enemyEmoji, quip, 1000);
                    }
                    BattleMode.showBattleFeedback(false, '🔄 变身! 怪物进入第二形态!');

                    setTimeout(function() {
                        // Step 6: HP bar refills animation (0.2s)
                        battle.monsterHP = phase2HP;
                        battle.monsterMaxHP = phase2HP;
                        BattleMode.updateUI();

                        setTimeout(function() {
                            if (cb) cb({ transformed: true });
                        }, 200);
                    }, 300);
                }, 300);
            }, 100);
        }, 300);
    }, 100);
};

// ===== Check Behavior V2 =====
// Called from existing checkBehaviorTrigger in monster-behavior.js
// Returns behavior name string or null

BattleMode.checkBehaviorV2 = function(phase, context) {
    var battle = App.battle;
    var monster = battle.currentMonster;
    if (!monster) return null;

    var personality = BattleMode.getMonsterPersonality(monster);
    var hpPercent = battle.monsterMaxHP > 0 ? (battle.monsterHP / battle.monsterMaxHP) : 1;

    // Counter: afterCorrect, violent/domineering personality, boss, 10% chance
    if (phase === 'afterCorrect') {
        if ((personality === 'violent' || personality === 'domineering') && monster.hp >= 8) {
            if (Math.random() < 0.10) {
                return 'counter';
            }
        }
    }

    // Split: onDeath, monster has splitOnDeath flag
    if (phase === 'onDeath') {
        if (monster.splitOnDeath && !battle.splitActive) {
            return 'split';
        }
    }

    // Curse: afterWrong, sinister personality, 30% chance, not already cursed
    if (phase === 'afterWrong') {
        if (personality === 'sinister' && !battle.monsterCursed) {
            if (Math.random() < 0.30) {
                return 'curse';
            }
        }
    }

    // Shield: hpThreshold, defensive personality, HP < 70%, not already shielded, once per monster
    if (phase === 'hpThreshold') {
        if (personality === 'defensive' && hpPercent < 0.70 && !battle.monsterShielded && !battle._shieldUsed) {
            battle._shieldUsed = true;
            return 'shield';
        }
    }

    // Transform: hpThreshold, monsterPhase === 1, HP < 30%, monster has phase2Emoji
    if (phase === 'hpThreshold') {
        if (battle.monsterPhase === 1 && hpPercent < 0.30 && monster.phase2Emoji) {
            return 'transform';
        }
    }

    return null;
};

// ===== Update Curse State =====
// Called each turn. Returns true if curse was active this turn.

BattleMode.updateCurseState = function() {
    var battle = App.battle;

    if (!battle.monsterCursed) return false;

    battle.curseRemainingTurns--;

    if (battle.curseRemainingTurns <= 0) {
        battle.monsterCursed = false;
        battle.curseRemainingTurns = 0;

        // Remove purple tint from hero
        var heroEl = document.getElementById('hero-sprite');
        if (heroEl) {
            heroEl.classList.remove('cursed');
            heroEl.style.filter = '';
        }

        BattleMode.showBattleFeedback(true, '诅咒解除!');
    }

    return true;
};

// ===== Add Curse Distractor =====
// Called when generating choices if curse is active.
// Adds a 5th option close to the correct answer but wrong.
// Returns the new options array (5 items).

BattleMode.addCurseDistractor = function(options, correctAnswer) {
    if (!options || !Array.isArray(options)) return options;

    // Generate a distractor close to the correct answer but not duplicating existing options
    var distractor = correctAnswer;
    var attempts = 0;
    var maxAttempts = 20;

    while (attempts < maxAttempts) {
        // Create a value close to correct answer: +/- 1 or 2
        var offset = (Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * 2) + 1);
        distractor = correctAnswer + offset;

        // Ensure distractor is not already in options and not equal to correct answer
        if (distractor !== correctAnswer && options.indexOf(distractor) === -1) {
            break;
        }
        attempts++;
    }

    // If we couldn't find a unique distractor, try a different range
    if (distractor === correctAnswer || options.indexOf(distractor) !== -1) {
        distractor = correctAnswer + 3;
        if (options.indexOf(distractor) !== -1) {
            distractor = correctAnswer - 3;
        }
    }

    var newOptions = options.slice();
    // Insert distractor at a random position
    var insertIndex = Math.floor(Math.random() * (newOptions.length + 1));
    newOptions.splice(insertIndex, 0, distractor);

    return newOptions;
};

// ===== Reset Behavior V2 State =====
// Called at battle start and between stages

BattleMode.resetBehaviorV2State = function() {
    var battle = App.battle;
    battle.monsterShielded = false;
    battle.monsterCursed = false;
    battle.curseRemainingTurns = 0;
    battle.monsterPhase = 1;
    battle.splitActive = false;
    battle.counterPending = false;
    battle._shieldUsed = false;

    // Remove any lingering visual effects from previous stage
    var heroEl = document.getElementById('hero-sprite');
    if (heroEl) {
        heroEl.classList.remove('cursed');
        heroEl.style.filter = '';
    }

    // Clean up any leftover behavior effect elements
    var leftoverEffects = document.querySelectorAll('.behavior-effect');
    for (var i = 0; i < leftoverEffects.length; i++) {
        leftoverEffects[i].remove();
    }
};

// ===== Track Personality =====
// Adds personality to App.battle.personalitiesEncountered if not already there

BattleMode.trackPersonality = function(personality) {
    var battle = App.battle;
    if (!battle.personalitiesEncountered) {
        battle.personalitiesEncountered = [];
    }

    if (battle.personalitiesEncountered.indexOf(personality) === -1) {
        battle.personalitiesEncountered.push(personality);
    }

    // Check achievement: all 6 personality types encountered
    var allPersonalities = Object.keys(BattleMode.PERSONALITIES);
    if (battle.personalitiesEncountered.length >= allPersonalities.length) {
        var allEncountered = true;
        for (var i = 0; i < allPersonalities.length; i++) {
            if (battle.personalitiesEncountered.indexOf(allPersonalities[i]) === -1) {
                allEncountered = false;
                break;
            }
        }
        if (allEncountered) {
            checkAchievement('all_personality');
        }
    }
};

// ===== Track Behavior V2 =====
// Adds behavior to App.battle.behaviorsEncountered if not already there

BattleMode.trackBehaviorV2 = function(behaviorName) {
    var battle = App.battle;
    if (!battle.behaviorsEncountered) {
        battle.behaviorsEncountered = [];
    }

    if (battle.behaviorsEncountered.indexOf(behaviorName) === -1) {
        battle.behaviorsEncountered.push(behaviorName);
    }

    // Check achievement: all 14 behaviors encountered (9 old + 5 new)
    var allBehaviors = [
        'dodge', 'taunt', 'enrage', 'fear', 'defend', 'summon', 'escape', 'selfDestruct', 'heal',
        'counter', 'split', 'curse', 'shield', 'transform'
    ];

    if (battle.behaviorsEncountered.length >= allBehaviors.length) {
        var allEncountered = true;
        for (var i = 0; i < allBehaviors.length; i++) {
            if (battle.behaviorsEncountered.indexOf(allBehaviors[i]) === -1) {
                allEncountered = false;
                break;
            }
        }
        if (allEncountered) {
            checkAchievement('behavior_master');
        }
    }
};
