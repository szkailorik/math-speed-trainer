/**
 * hero-system.js - Hero multi-layer visual system + combo attack animations
 * v16.0: Upgrades the hero from a single emoji to a layered character/weapon/effects system
 * with 5 combo attack stages (normal, awakened, will, godlike, invincible)
 */

// ===== 1. Initialize Hero Layers =====

BattleMode.initHeroLayers = function() {
    var heroSide = document.querySelector('.hero-side');
    if (!heroSide) return;

    // Remove existing layers if re-initializing
    var existing = heroSide.querySelector('.hero-layers');
    if (existing) existing.remove();

    var layers = document.createElement('div');
    layers.className = 'hero-layers';
    layers.innerHTML =
        '<div class="hero-effect-layer"></div>' +
        '<div class="hero-char-layer">🧙</div>' +
        '<div class="hero-weapon-layer">⚔️</div>';

    heroSide.appendChild(layers);

    // Initialize combo stage tracking
    if (!App.battle.comboStage) {
        App.battle.comboStage = 'normal';
    }
    App.battle._prevComboStage = 'normal';
};

// ===== 2. Update Combo Stage =====

BattleMode.updateComboStage = function(combo) {
    var stage;
    if (combo >= 15) {
        stage = 'invincible';
    } else if (combo >= 10) {
        stage = 'godlike';
    } else if (combo >= 5) {
        stage = 'will';
    } else if (combo >= 3) {
        stage = 'awakened';
    } else {
        stage = 'normal';
    }

    var prevStage = App.battle.comboStage || 'normal';
    App.battle.comboStage = stage;

    var changed = (stage !== prevStage);

    if (changed) {
        // Play stage transition sound
        var soundMap = {
            awakened: 'comboAwaken',
            will: 'comboWill',
            godlike: 'comboGodlike',
            invincible: 'comboInvincible'
        };
        if (soundMap[stage]) {
            playSound(soundMap[stage]);
        }

        // Update visuals for new stage
        this.updateHeroVisuals(stage);

        // Update CSS classes on hero-layers container
        var heroLayers = document.querySelector('.hero-layers');
        if (heroLayers) {
            heroLayers.classList.remove(
                'combo-normal', 'combo-awakened', 'combo-will',
                'combo-godlike', 'combo-invincible'
            );
            heroLayers.classList.add('combo-' + stage);
        }

        App.battle._prevComboStage = stage;
    }

    return changed;
};

// ===== 3. Get Combo Weapon =====

BattleMode.getComboWeapon = function(stage, module) {
    var weaponMap = {
        awakened: '🔥',
        will: '⚡',
        godlike: '💎',
        invincible: '🌟'
    };

    if (weaponMap[stage]) {
        return weaponMap[stage];
    }

    // Normal stage: use module's default weapon
    var mod = module || App.battle.module;
    var defaultWeapons = {
        xiaojiujiu: '⚔️',
        fraction: '🗡️',
        decimal: '🏹',
        unit: '🔱',
        multiply: '🪄',
        times: '⚔️'
    };
    return defaultWeapons[mod] || '⚔️';
};

// ===== 4. Update Hero Visuals =====

BattleMode.updateHeroVisuals = function(stage) {
    var charLayer = document.querySelector('.hero-char-layer');
    var weaponLayer = document.querySelector('.hero-weapon-layer');
    var effectLayer = document.querySelector('.hero-effect-layer');

    if (!charLayer || !weaponLayer || !effectLayer) return;

    // Remove all glow classes
    charLayer.classList.remove(
        'hero-glow-fire', 'hero-glow-lightning',
        'hero-glow-gold', 'hero-glow-rainbow'
    );

    // Clear effect layer
    effectLayer.innerHTML = '';

    // Get new weapon emoji
    weaponLayer.textContent = this.getComboWeapon(stage);

    if (stage === 'normal') {
        // No glow, no effects
        return;
    }

    if (stage === 'awakened') {
        charLayer.classList.add('hero-glow-fire');
        this._spawnFireSparks(effectLayer, 3 + Math.floor(Math.random() * 3));
    } else if (stage === 'will') {
        charLayer.classList.add('hero-glow-lightning');
        this._spawnElectricArcs(effectLayer);
    } else if (stage === 'godlike') {
        charLayer.classList.add('hero-glow-gold');
        this._spawnGoldParticles(effectLayer);
    } else if (stage === 'invincible') {
        charLayer.classList.add('hero-glow-rainbow');
        this._spawnRainbowStarfield(effectLayer);
    }
};

// Effect layer particle helpers

BattleMode._spawnFireSparks = function(container, count) {
    for (var i = 0; i < count; i++) {
        var spark = document.createElement('div');
        spark.className = 'hero-fire-spark';
        spark.textContent = '🔥';
        spark.style.position = 'absolute';
        spark.style.fontSize = (0.5 + Math.random() * 0.5) + 'rem';
        spark.style.left = (20 + Math.random() * 60) + '%';
        spark.style.top = (20 + Math.random() * 60) + '%';
        spark.style.animationDelay = (Math.random() * 0.5) + 's';
        container.appendChild(spark);
    }
};

BattleMode._spawnElectricArcs = function(container) {
    for (var i = 0; i < 4; i++) {
        var arc = document.createElement('div');
        arc.className = 'hero-electric-arc';
        arc.textContent = '⚡';
        arc.style.position = 'absolute';
        arc.style.fontSize = (0.6 + Math.random() * 0.4) + 'rem';
        arc.style.left = (10 + Math.random() * 80) + '%';
        arc.style.top = (10 + Math.random() * 80) + '%';
        arc.style.animationDelay = (i * 0.2) + 's';
        container.appendChild(arc);
    }
};

BattleMode._spawnGoldParticles = function(container) {
    for (var i = 0; i < 6; i++) {
        var particle = document.createElement('div');
        particle.className = 'hero-gold-particle';
        particle.textContent = '✨';
        particle.style.position = 'absolute';
        particle.style.fontSize = (0.4 + Math.random() * 0.5) + 'rem';
        var angle = (i / 6) * Math.PI * 2;
        particle.style.left = (50 + Math.cos(angle) * 35) + '%';
        particle.style.top = (50 + Math.sin(angle) * 35) + '%';
        particle.style.animationDelay = (i * 0.15) + 's';
        container.appendChild(particle);
    }
};

BattleMode._spawnRainbowStarfield = function(container) {
    var stars = ['⭐', '🌟', '💫', '✨', '🌈'];
    var count = Math.min(10, 50); // respect particle limit
    for (var i = 0; i < count; i++) {
        var star = document.createElement('div');
        star.className = 'hero-rainbow-star';
        star.textContent = stars[i % stars.length];
        star.style.position = 'absolute';
        star.style.fontSize = (0.4 + Math.random() * 0.6) + 'rem';
        star.style.left = (Math.random() * 100) + '%';
        star.style.top = (Math.random() * 100) + '%';
        star.style.animationDelay = (Math.random() * 1) + 's';
        container.appendChild(star);
    }
};

// ===== 5. Attack Animation Methods =====

// --- 5a. attackNormal: Combo 0-2, single weapon shot ---

BattleMode.attackNormal = function(targetEl, cb) {
    var self = this;
    var heroEmoji = document.querySelector('.hero-emoji');
    if (!heroEmoji) { if (cb) cb(); return; }

    playSound('attackNormal');

    // Hero raises hand (0.15s)
    self.setHeroState('cast_spell');

    setTimeout(function() {
        // Weapon flies to enemy (0.3s)
        var weapon = self.getRandomWeapon();
        self.fireWeaponHorizontal(weapon);

        setTimeout(function() {
            // Hit + damage number (0.2s)
            if (targetEl) {
                targetEl.classList.add('enemy-hit-flash');
                setTimeout(function() {
                    targetEl.classList.remove('enemy-hit-flash');
                }, 200);
            }

            self.setHeroState('idle');
            if (cb) cb();
        }, 300);
    }, 150);
};

// --- 5b. attackDouble: Combo 3-4, two rapid strikes ---

BattleMode.attackDouble = function(targetEl, cb) {
    var self = this;
    var arena = document.querySelector('.battle-arena');
    var heroEmoji = document.querySelector('.hero-emoji');
    if (!heroEmoji || !arena) { if (cb) cb(); return; }

    playSound('attackDouble');

    // Hero dash right (0.15s)
    heroEmoji.classList.add('hero-dash-right');

    setTimeout(function() {
        // Weapon1 flies (0.2s)
        var w1 = document.createElement('div');
        w1.className = 'arena-attack-projectile hero-projectile combo-projectile';
        w1.textContent = '🔥';
        arena.appendChild(w1);
        requestAnimationFrame(function() { w1.classList.add('fly'); });

        setTimeout(function() {
            w1.remove();
            // Hit "-1"
            if (targetEl) {
                targetEl.classList.add('enemy-hit-flash');
                setTimeout(function() { targetEl.classList.remove('enemy-hit-flash'); }, 150);
            }

            // Weapon2 flies (0.15s)
            var w2 = document.createElement('div');
            w2.className = 'arena-attack-projectile hero-projectile combo-projectile';
            w2.textContent = '🔥';
            arena.appendChild(w2);
            requestAnimationFrame(function() { w2.classList.add('fly'); });

            setTimeout(function() {
                w2.remove();
                // Hit "-1"
                if (targetEl) {
                    targetEl.classList.add('enemy-hit-flash');
                    setTimeout(function() { targetEl.classList.remove('enemy-hit-flash'); }, 150);
                }

                // Hero returns (0.15s)
                heroEmoji.classList.remove('hero-dash-right');
                self.setHeroState('idle');

                setTimeout(function() {
                    if (cb) cb();
                }, 150);
            }, 150);
        }, 200);
    }, 150);
};

// --- 5c. attackTriple: Combo 5-9, triple slash + finisher ---

BattleMode.attackTriple = function(targetEl, cb) {
    var self = this;
    var arena = document.querySelector('.battle-arena');
    var heroEmoji = document.querySelector('.hero-emoji');
    if (!heroEmoji || !arena) { if (cb) cb(); return; }

    playSound('attackTriple');

    // Hero teleport to center (0.1s)
    heroEmoji.classList.add('hero-teleport-center');

    setTimeout(function() {
        var arenaRect = arena.getBoundingClientRect();
        var cx = arenaRect.width * 0.5;
        var cy = arenaRect.height * 0.4;
        var tx = arenaRect.width * 0.75;
        var ty = arenaRect.height * 0.35;

        // Slash1 (0.1s)
        self.createSlashTrail(cx - 30, cy, tx, ty - 20, '#00bfff');

        setTimeout(function() {
            // Slash2 (0.1s)
            self.createSlashTrail(cx, cy - 20, tx + 10, ty, '#00e5ff');

            setTimeout(function() {
                // Slash3 (0.1s)
                self.createSlashTrail(cx + 10, cy + 10, tx - 10, ty + 20, '#76ff03');

                setTimeout(function() {
                    // Charge finisher (0.15s)
                    heroEmoji.classList.add('hero-charge');

                    setTimeout(function() {
                        heroEmoji.classList.remove('hero-charge');

                        // Heavy hit + big damage (0.2s)
                        if (targetEl) {
                            targetEl.classList.add('enemy-hit-heavy');
                            setTimeout(function() {
                                targetEl.classList.remove('enemy-hit-heavy');
                            }, 200);
                        }

                        // Hero returns (0.1s)
                        heroEmoji.classList.remove('hero-teleport-center');
                        self.setHeroState('idle');

                        setTimeout(function() {
                            if (cb) cb();
                        }, 100);
                    }, 150);
                }, 100);
            }, 100);
        }, 100);
    }, 100);
};

// --- 5d. attackCharged: Combo 10-14, charged attack with screen effects ---

BattleMode.attackCharged = function(targetEl, cb) {
    var self = this;
    var arena = document.querySelector('.battle-arena');
    var heroEmoji = document.querySelector('.hero-emoji');
    if (!heroEmoji || !arena) { if (cb) cb(); return; }

    playSound('attackCharged');

    // Screen dims slightly (0.1s)
    arena.classList.add('arena-dimmed');

    setTimeout(function() {
        // Hero charges: shrink then grow + gather particles (0.3s)
        heroEmoji.classList.add('hero-charging');

        var effectLayer = document.querySelector('.hero-effect-layer');
        if (effectLayer) {
            for (var i = 0; i < 8; i++) {
                var p = document.createElement('div');
                p.className = 'charge-gather-particle';
                p.textContent = '💎';
                p.style.position = 'absolute';
                p.style.fontSize = '0.8rem';
                var angle = (i / 8) * Math.PI * 2;
                p.style.left = (50 + Math.cos(angle) * 60) + '%';
                p.style.top = (50 + Math.sin(angle) * 60) + '%';
                p.style.animationDelay = (i * 0.03) + 's';
                effectLayer.appendChild(p);
                (function(el) {
                    setTimeout(function() { el.remove(); }, 400);
                })(p);
            }
        }

        setTimeout(function() {
            heroEmoji.classList.remove('hero-charging');

            // Release giant weapon (40% stage width) (0.3s)
            var giantWeapon = document.createElement('div');
            giantWeapon.className = 'giant-weapon-projectile';
            giantWeapon.textContent = '💎';
            giantWeapon.style.fontSize = (arena.offsetWidth * 0.15) + 'px';
            arena.appendChild(giantWeapon);
            requestAnimationFrame(function() {
                giantWeapon.classList.add('fly');
            });

            setTimeout(function() {
                giantWeapon.remove();

                // Explosion + screen shake (0.3s)
                self.screenShake('heavy');

                if (targetEl) {
                    targetEl.classList.add('enemy-hit-explosion');
                    setTimeout(function() {
                        targetEl.classList.remove('enemy-hit-explosion');
                    }, 300);
                }

                // Spawn explosion particles
                var explCount = Math.min(12, 50);
                for (var j = 0; j < explCount; j++) {
                    var ep = document.createElement('div');
                    ep.className = 'charged-explosion-particle';
                    ep.textContent = ['💥', '✨', '💎', '⚡'][j % 4];
                    ep.style.position = 'absolute';
                    ep.style.fontSize = (0.6 + Math.random() * 0.8) + 'rem';
                    ep.style.left = (60 + Math.random() * 30) + '%';
                    ep.style.top = (20 + Math.random() * 40) + '%';
                    ep.style.animationDelay = (Math.random() * 0.15) + 's';
                    arena.appendChild(ep);
                    (function(el) {
                        setTimeout(function() { el.remove(); }, 500);
                    })(ep);
                }

                arena.classList.remove('arena-dimmed');

                // Recover (0.1s)
                setTimeout(function() {
                    self.setHeroState('idle');
                    if (cb) cb();
                }, 100);
            }, 300);
        }, 300);
    }, 100);
};

// --- 5e. attackUltimate: Combo 15+, full-screen ultimate ---

BattleMode.attackUltimate = function(targetEl, cb) {
    var self = this;
    var arena = document.querySelector('.battle-arena');
    var heroEmoji = document.querySelector('.hero-emoji');
    if (!heroEmoji || !arena) { if (cb) cb(); return; }

    playSound('attackUltimate');

    // Screen flash white (0.1s)
    var flash = document.createElement('div');
    flash.className = 'ultimate-screen-flash';
    arena.appendChild(flash);

    setTimeout(function() {
        flash.remove();

        // Hero flies to center + enlarge (0.2s)
        heroEmoji.classList.add('hero-ultimate-center');

        setTimeout(function() {
            // Skill name flash "星辰一击!" (0.3s)
            var skillName = document.createElement('div');
            skillName.className = 'ultimate-skill-name';
            skillName.textContent = '星辰一击!';
            arena.appendChild(skillName);

            setTimeout(function() {
                skillName.remove();

                // Rainbow beam from hero to enemy (0.4s)
                var beam = document.createElement('div');
                beam.className = 'ultimate-rainbow-beam';
                arena.appendChild(beam);

                setTimeout(function() {
                    beam.remove();

                    // Full screen explosion + particles (0.3s)
                    self.screenShake('heavy');

                    var particleCount = Math.min(25, 50);
                    var explosionEmojis = ['🌟', '⭐', '💫', '✨', '🌈', '💥', '🔥', '⚡'];
                    for (var i = 0; i < particleCount; i++) {
                        var p = document.createElement('div');
                        p.className = 'ultimate-explosion-particle';
                        p.textContent = explosionEmojis[i % explosionEmojis.length];
                        p.style.position = 'absolute';
                        p.style.fontSize = (0.5 + Math.random() * 1.2) + 'rem';
                        p.style.left = (Math.random() * 100) + '%';
                        p.style.top = (Math.random() * 80) + '%';
                        p.style.animationDelay = (Math.random() * 0.2) + 's';
                        arena.appendChild(p);
                        (function(el) {
                            setTimeout(function() { el.remove(); }, 600);
                        })(p);
                    }

                    if (targetEl) {
                        targetEl.classList.add('enemy-hit-ultimate');
                        setTimeout(function() {
                            targetEl.classList.remove('enemy-hit-ultimate');
                        }, 300);
                    }

                    // Recover + damage number (0.2s)
                    setTimeout(function() {
                        heroEmoji.classList.remove('hero-ultimate-center');
                        self.setHeroState('idle');
                        if (cb) cb();
                    }, 200);
                }, 400);
            }, 300);
        }, 200);
    }, 100);
};

// ===== 6. Execute Combo Attack (main dispatch) =====

BattleMode.executeComboAttack = function(combo, targetEl, cb) {
    // Update combo stage first
    this.updateComboStage(combo);

    var stage = App.battle.comboStage;

    if (stage === 'invincible') {
        this.attackUltimate(targetEl, cb);
    } else if (stage === 'godlike') {
        this.attackCharged(targetEl, cb);
    } else if (stage === 'will') {
        this.attackTriple(targetEl, cb);
    } else if (stage === 'awakened') {
        this.attackDouble(targetEl, cb);
    } else {
        this.attackNormal(targetEl, cb);
    }
};

// ===== 7. Hero Hit Upgraded =====

BattleMode.heroHitUpgraded = function(consecutiveWrong, cb) {
    var self = this;
    var heroEmoji = document.querySelector('.hero-emoji');
    var arena = document.querySelector('.battle-arena');
    if (!heroEmoji) { if (cb) cb(); return; }

    var battle = App.battle;

    if (battle.playerHP <= 1) {
        // HP=1 when hit: slow motion + screen darken
        playSound('hit');
        arena.classList.add('arena-slow-motion');
        heroEmoji.classList.add('hero-hit-critical');

        self.screenShake('medium');

        setTimeout(function() {
            arena.classList.remove('arena-slow-motion');
            heroEmoji.classList.remove('hero-hit-critical');
            self.setHeroState('idle');
            if (cb) cb();
        }, 600);

    } else if (consecutiveWrong >= 2) {
        // 2+ wrong: kneel + panting + debris particles
        playSound('hit');
        heroEmoji.classList.add('hero-kneel');
        self.screenShake('medium');

        // Spawn debris
        var effectLayer = document.querySelector('.hero-effect-layer');
        if (effectLayer) {
            var debrisEmojis = ['💔', '❌', '💢'];
            for (var i = 0; i < 4; i++) {
                var debris = document.createElement('div');
                debris.className = 'hero-debris-particle';
                debris.textContent = debrisEmojis[i % debrisEmojis.length];
                debris.style.position = 'absolute';
                debris.style.fontSize = '0.7rem';
                debris.style.left = (30 + Math.random() * 40) + '%';
                debris.style.top = (50 + Math.random() * 30) + '%';
                debris.style.animationDelay = (i * 0.05) + 's';
                effectLayer.appendChild(debris);
                (function(el) {
                    setTimeout(function() { el.remove(); }, 500);
                })(debris);
            }
        }

        setTimeout(function() {
            heroEmoji.classList.remove('hero-kneel');
            self.setHeroState('idle');
            if (cb) cb();
        }, 500);

    } else {
        // 1 wrong: standard retreat + flash red
        playSound('hit');
        self.setHeroState('hit');
        heroEmoji.classList.add('hero-flash-red');
        self.screenShake('light');

        setTimeout(function() {
            heroEmoji.classList.remove('hero-flash-red');
            self.setHeroState('idle');
            if (cb) cb();
        }, 400);
    }
};

// ===== 8. Combo Break Animation =====

BattleMode.comboBreakAnimation = function(oldCombo, cb) {
    var self = this;

    if (oldCombo < 3) {
        // No special animation for low combos
        self.updateHeroVisuals('normal');
        App.battle.comboStage = 'normal';
        if (cb) cb();
        return;
    }

    // Combo >= 3: flame extinguish + shatter + glass break sound
    playSound('hit');

    var charLayer = document.querySelector('.hero-char-layer');
    var effectLayer = document.querySelector('.hero-effect-layer');
    var comboEl = document.getElementById('battle-combo');

    // Flame extinguish on hero
    if (charLayer) {
        charLayer.classList.add('hero-flame-extinguish');
    }

    // Shatter animation on combo number
    if (comboEl) {
        comboEl.classList.add('combo-shatter');
    }

    // Spawn shatter particles
    var arena = document.querySelector('.battle-arena');
    if (arena) {
        var shatterEmojis = ['💔', '🔸', '🔹', '✦'];
        for (var i = 0; i < 6; i++) {
            var shard = document.createElement('div');
            shard.className = 'combo-shatter-particle';
            shard.textContent = shatterEmojis[i % shatterEmojis.length];
            shard.style.position = 'absolute';
            shard.style.fontSize = (0.5 + Math.random() * 0.5) + 'rem';
            shard.style.left = (40 + Math.random() * 20) + '%';
            shard.style.top = (10 + Math.random() * 20) + '%';
            shard.style.animationDelay = (Math.random() * 0.1) + 's';
            arena.appendChild(shard);
            (function(el) {
                setTimeout(function() { el.remove(); }, 500);
            })(shard);
        }
    }

    setTimeout(function() {
        if (charLayer) {
            charLayer.classList.remove('hero-flame-extinguish');
        }
        if (comboEl) {
            comboEl.classList.remove('combo-shatter');
        }

        // Reset hero visuals to normal
        self.updateHeroVisuals('normal');
        App.battle.comboStage = 'normal';

        // Also reset hero-layers combo class
        var heroLayers = document.querySelector('.hero-layers');
        if (heroLayers) {
            heroLayers.classList.remove(
                'combo-normal', 'combo-awakened', 'combo-will',
                'combo-godlike', 'combo-invincible'
            );
            heroLayers.classList.add('combo-normal');
        }

        if (cb) cb();
    }, 400);
};

// ===== 9. Screen Shake Helper =====

BattleMode.screenShake = function(intensity) {
    var arena = document.querySelector('.battle-arena');
    if (!arena) return;

    var classMap = {
        light: 'shake-light',
        medium: 'shake-medium',
        heavy: 'shake-heavy'
    };

    var cls = classMap[intensity] || classMap.light;

    arena.classList.add(cls);

    setTimeout(function() {
        arena.classList.remove(cls);
    }, 300);
};

// ===== 10. Create Slash Trail Helper =====

BattleMode.createSlashTrail = function(startX, startY, endX, endY, color) {
    var arena = document.querySelector('.battle-arena');
    if (!arena) return;

    var trail = document.createElement('div');
    trail.className = 'slash-trail';

    // Calculate angle and length
    var dx = endX - startX;
    var dy = endY - startY;
    var length = Math.sqrt(dx * dx + dy * dy);
    var angle = Math.atan2(dy, dx) * (180 / Math.PI);

    trail.style.position = 'absolute';
    trail.style.left = startX + 'px';
    trail.style.top = startY + 'px';
    trail.style.width = length + 'px';
    trail.style.height = '3px';
    trail.style.background = 'linear-gradient(90deg, transparent, ' + (color || '#00bfff') + ', transparent)';
    trail.style.transform = 'rotate(' + angle + 'deg)';
    trail.style.transformOrigin = '0 50%';
    trail.style.opacity = '1';
    trail.style.borderRadius = '2px';
    trail.style.boxShadow = '0 0 8px ' + (color || '#00bfff') + ', 0 0 16px ' + (color || '#00bfff');
    trail.style.pointerEvents = 'none';
    trail.style.zIndex = '100';

    arena.appendChild(trail);

    // Fade out and remove
    requestAnimationFrame(function() {
        trail.style.transition = 'opacity 0.25s ease-out';
        trail.style.opacity = '0';
    });

    setTimeout(function() {
        trail.remove();
    }, 300);
};
