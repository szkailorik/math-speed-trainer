/**
 * effects.js - Sound effects, visual effects, achievement popups
 */

// ===== Sound Effects =====
function playSound(type) {
    if (App.settings.sound !== 'on') return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    if (type === 'correct') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'wrong') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.setValueAtTime(150, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'streak') {
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
            gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
            gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.08 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.15);
            osc.start(ctx.currentTime + i * 0.08);
            osc.stop(ctx.currentTime + i * 0.08 + 0.2);
        });
    } else if (type === 'achievement') {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
            gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
            gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * 0.12 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.3);
            osc.start(ctx.currentTime + i * 0.12);
            osc.stop(ctx.currentTime + i * 0.12 + 0.35);
        });
    } else if (type === 'complete') {
        const melody = [
            { freq: 523.25, time: 0 },
            { freq: 587.33, time: 0.1 },
            { freq: 659.25, time: 0.2 },
            { freq: 783.99, time: 0.3 },
            { freq: 659.25, time: 0.45 },
            { freq: 783.99, time: 0.55 },
            { freq: 1046.5, time: 0.7 },
        ];
        melody.forEach(note => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);
            gain.gain.setValueAtTime(0, ctx.currentTime + note.time);
            gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + note.time + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + note.time + 0.2);
            osc.start(ctx.currentTime + note.time);
            osc.stop(ctx.currentTime + note.time + 0.25);
        });
    } else if (type === 'countdown') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.06);
    } else if (type === 'attack') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'hit') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'monsterAttack') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.setValueAtTime(200, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(150, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'defeat') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.type = 'sawtooth';
        osc2.type = 'square';
        osc1.frequency.setValueAtTime(400, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3);
        osc2.frequency.setValueAtTime(200, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc1.start(ctx.currentTime);
        osc2.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.45);
        osc2.stop(ctx.currentTime + 0.45);
    } else if (type === 'gameOver') {
        const notes = [392, 349.23, 329.63, 261.63];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.2);
            gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.2);
            gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.2 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.2 + 0.25);
            osc.start(ctx.currentTime + i * 0.2);
            osc.stop(ctx.currentTime + i * 0.2 + 0.3);
        });
    } else if (type === 'dodge') {
        // Quick whoosh sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'defend') {
        // Metallic clang
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1000, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'enrage') {
        // Low rumble rising
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'summon') {
        // Mystical ascending notes
        const notes = [261.63, 329.63, 392, 523.25, 659.25];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);
            gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.06);
            gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.06 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.06 + 0.12);
            osc.start(ctx.currentTime + i * 0.06);
            osc.stop(ctx.currentTime + i * 0.06 + 0.15);
        });
    } else if (type === 'cardDrop') {
        // Magical reveal - ascending sparkle
        const notes = [392, 523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
            gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
            gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.1 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.2);
            osc.start(ctx.currentTime + i * 0.1);
            osc.stop(ctx.currentTime + i * 0.1 + 0.25);
        });
    } else if (type === 'cardFlip') {
        // Short flip/whoosh
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'bossEntrance') {
        // Deep dramatic entrance
        const notes = [130.81, 164.81, 196, 130.81];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
            gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
            gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.15 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.2);
            osc.start(ctx.currentTime + i * 0.15);
            osc.stop(ctx.currentTime + i * 0.15 + 0.25);
        });

    // ===== v16.0 Sound Effects =====

    // --- Category 1: Attack Sounds (5 stages) ---

    } else if (type === 'attackNormal') {
        // Sawtooth 800->200Hz, 0.2s (similar to existing attack)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);

    } else if (type === 'attackDouble') {
        // Two rapid hits: 800->400Hz + 0.08s gap + 600->300Hz
        const t = ctx.currentTime;
        // First hit
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(800, t);
        osc1.frequency.exponentialRampToValueAtTime(400, t + 0.08);
        gain1.gain.setValueAtTime(0.2, t);
        gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc1.start(t);
        osc1.stop(t + 0.12);
        // Second hit after gap
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(600, t + 0.16);
        osc2.frequency.exponentialRampToValueAtTime(300, t + 0.24);
        gain2.gain.setValueAtTime(0.25, t + 0.16);
        gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.26);
        osc2.start(t + 0.16);
        osc2.stop(t + 0.3);

    } else if (type === 'attackTriple') {
        // Three quick sine tones (0.08s apart) + heavy square wave finisher 200->50Hz
        const t = ctx.currentTime;
        const tones = [700, 800, 900];
        tones.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + i * 0.08);
            gain.gain.setValueAtTime(0.2, t + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.08 + 0.06);
            osc.start(t + i * 0.08);
            osc.stop(t + i * 0.08 + 0.08);
        });
        // Heavy finisher
        const oscF = ctx.createOscillator();
        const gainF = ctx.createGain();
        oscF.connect(gainF);
        gainF.connect(ctx.destination);
        oscF.type = 'square';
        oscF.frequency.setValueAtTime(200, t + 0.28);
        oscF.frequency.exponentialRampToValueAtTime(50, t + 0.45);
        gainF.gain.setValueAtTime(0.25, t + 0.28);
        gainF.gain.exponentialRampToValueAtTime(0.01, t + 0.48);
        oscF.start(t + 0.28);
        oscF.stop(t + 0.5);

    } else if (type === 'attackCharged') {
        // Charge phase: sine 200->800Hz rising 0.3s, then release: sawtooth+square 1000->100Hz 0.3s
        const t = ctx.currentTime;
        // Charge phase
        const oscCharge = ctx.createOscillator();
        const gainCharge = ctx.createGain();
        oscCharge.connect(gainCharge);
        gainCharge.connect(ctx.destination);
        oscCharge.type = 'sine';
        oscCharge.frequency.setValueAtTime(200, t);
        oscCharge.frequency.exponentialRampToValueAtTime(800, t + 0.3);
        gainCharge.gain.setValueAtTime(0.15, t);
        gainCharge.gain.linearRampToValueAtTime(0.25, t + 0.25);
        gainCharge.gain.exponentialRampToValueAtTime(0.01, t + 0.32);
        oscCharge.start(t);
        oscCharge.stop(t + 0.35);
        // Release: dual oscillator
        const oscR1 = ctx.createOscillator();
        const oscR2 = ctx.createOscillator();
        const gainR = ctx.createGain();
        oscR1.connect(gainR);
        oscR2.connect(gainR);
        gainR.connect(ctx.destination);
        oscR1.type = 'sawtooth';
        oscR2.type = 'square';
        oscR1.frequency.setValueAtTime(1000, t + 0.32);
        oscR1.frequency.exponentialRampToValueAtTime(100, t + 0.6);
        oscR2.frequency.setValueAtTime(800, t + 0.32);
        oscR2.frequency.exponentialRampToValueAtTime(80, t + 0.6);
        gainR.gain.setValueAtTime(0.3, t + 0.32);
        gainR.gain.exponentialRampToValueAtTime(0.01, t + 0.62);
        oscR1.start(t + 0.32);
        oscR2.start(t + 0.32);
        oscR1.stop(t + 0.65);
        oscR2.stop(t + 0.65);

    } else if (type === 'attackUltimate') {
        // 3-note chord + ascending scale 0.4s -> double oscillator burst 0.3s -> sine echo 0.3s
        const t = ctx.currentTime;
        // 3-note chord (C-E-G)
        const chordFreqs = [523.25, 659.25, 783.99];
        chordFreqs.forEach((freq) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0.12, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
            osc.start(t);
            osc.stop(t + 0.18);
        });
        // Ascending scale
        const scaleFreqs = [523.25, 587.33, 659.25, 783.99, 1046.5];
        scaleFreqs.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, t + 0.15 + i * 0.05);
            gain.gain.setValueAtTime(0.15, t + 0.15 + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15 + i * 0.05 + 0.06);
            osc.start(t + 0.15 + i * 0.05);
            osc.stop(t + 0.15 + i * 0.05 + 0.08);
        });
        // Double oscillator burst
        const oscB1 = ctx.createOscillator();
        const oscB2 = ctx.createOscillator();
        const gainB = ctx.createGain();
        oscB1.connect(gainB);
        oscB2.connect(gainB);
        gainB.connect(ctx.destination);
        oscB1.type = 'sawtooth';
        oscB2.type = 'square';
        oscB1.frequency.setValueAtTime(1000, t + 0.45);
        oscB1.frequency.exponentialRampToValueAtTime(100, t + 0.7);
        oscB2.frequency.setValueAtTime(800, t + 0.45);
        oscB2.frequency.exponentialRampToValueAtTime(80, t + 0.7);
        gainB.gain.setValueAtTime(0.35, t + 0.45);
        gainB.gain.exponentialRampToValueAtTime(0.01, t + 0.72);
        oscB1.start(t + 0.45);
        oscB2.start(t + 0.45);
        oscB1.stop(t + 0.75);
        oscB2.stop(t + 0.75);
        // Sine echo
        const oscEcho = ctx.createOscillator();
        const gainEcho = ctx.createGain();
        oscEcho.connect(gainEcho);
        gainEcho.connect(ctx.destination);
        oscEcho.type = 'sine';
        oscEcho.frequency.setValueAtTime(600, t + 0.75);
        oscEcho.frequency.exponentialRampToValueAtTime(300, t + 1.0);
        gainEcho.gain.setValueAtTime(0.15, t + 0.75);
        gainEcho.gain.exponentialRampToValueAtTime(0.01, t + 1.05);
        oscEcho.start(t + 0.75);
        oscEcho.stop(t + 1.1);

    // --- Category 2: Hit Sounds (5 stages) ---

    } else if (type === 'hitNormal') {
        // Same as existing hit: square 150->50Hz
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);

    } else if (type === 'hitDouble') {
        // Two hits staggered 0.05s apart
        const t = ctx.currentTime;
        [0, 0.05].forEach((delay) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(150, t + delay);
            osc.frequency.exponentialRampToValueAtTime(50, t + delay + 0.1);
            gain.gain.setValueAtTime(0.22, t + delay);
            gain.gain.exponentialRampToValueAtTime(0.01, t + delay + 0.1);
            osc.start(t + delay);
            osc.stop(t + delay + 0.15);
        });

    } else if (type === 'hitTriple') {
        // Three hits + low frequency boom at end
        const t = ctx.currentTime;
        [0, 0.06, 0.12].forEach((delay) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(160, t + delay);
            osc.frequency.exponentialRampToValueAtTime(60, t + delay + 0.08);
            gain.gain.setValueAtTime(0.2, t + delay);
            gain.gain.exponentialRampToValueAtTime(0.01, t + delay + 0.1);
            osc.start(t + delay);
            osc.stop(t + delay + 0.12);
        });
        // Low boom
        const oscBoom = ctx.createOscillator();
        const gainBoom = ctx.createGain();
        oscBoom.connect(gainBoom);
        gainBoom.connect(ctx.destination);
        oscBoom.type = 'sine';
        oscBoom.frequency.setValueAtTime(60, t + 0.2);
        oscBoom.frequency.exponentialRampToValueAtTime(30, t + 0.4);
        gainBoom.gain.setValueAtTime(0.25, t + 0.2);
        gainBoom.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
        oscBoom.start(t + 0.2);
        oscBoom.stop(t + 0.45);

    } else if (type === 'hitCharged') {
        // Dual oscillator explosion 0.3s
        const t = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.type = 'square';
        osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(200, t);
        osc1.frequency.exponentialRampToValueAtTime(40, t + 0.25);
        osc2.frequency.setValueAtTime(150, t);
        osc2.frequency.exponentialRampToValueAtTime(30, t + 0.25);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 0.35);
        osc2.stop(t + 0.35);

    } else if (type === 'hitUltimate') {
        // Triple oscillator + reverb decay 0.5s
        const t = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const osc3 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.connect(gain);
        osc2.connect(gain);
        osc3.connect(gain);
        gain.connect(ctx.destination);
        osc1.type = 'square';
        osc2.type = 'sawtooth';
        osc3.type = 'sine';
        osc1.frequency.setValueAtTime(250, t);
        osc1.frequency.exponentialRampToValueAtTime(40, t + 0.3);
        osc2.frequency.setValueAtTime(180, t);
        osc2.frequency.exponentialRampToValueAtTime(30, t + 0.3);
        osc3.frequency.setValueAtTime(100, t);
        osc3.frequency.exponentialRampToValueAtTime(25, t + 0.4);
        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
        osc1.start(t);
        osc2.start(t);
        osc3.start(t);
        osc1.stop(t + 0.5);
        osc2.stop(t + 0.5);
        osc3.stop(t + 0.5);

    // --- Category 3: Combo Stage Transition Sounds ---

    } else if (type === 'comboAwaken') {
        // 2-note ascending + fire hum (sawtooth low 0.1s)
        const t = ctx.currentTime;
        const notes = [392, 523.25];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + i * 0.1);
            gain.gain.setValueAtTime(0.2, t + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.1 + 0.1);
            osc.start(t + i * 0.1);
            osc.stop(t + i * 0.1 + 0.12);
        });
        // Fire hum
        const oscHum = ctx.createOscillator();
        const gainHum = ctx.createGain();
        oscHum.connect(gainHum);
        gainHum.connect(ctx.destination);
        oscHum.type = 'sawtooth';
        oscHum.frequency.setValueAtTime(80, t + 0.22);
        gainHum.gain.setValueAtTime(0.1, t + 0.22);
        gainHum.gain.exponentialRampToValueAtTime(0.01, t + 0.32);
        oscHum.start(t + 0.22);
        oscHum.stop(t + 0.35);

    } else if (type === 'comboWill') {
        // 3-note ascending chord + electric buzz (square high tremolo 0.15s)
        const t = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + i * 0.08);
            gain.gain.setValueAtTime(0.18, t + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.08 + 0.1);
            osc.start(t + i * 0.08);
            osc.stop(t + i * 0.08 + 0.12);
        });
        // Electric buzz with tremolo
        const oscBuzz = ctx.createOscillator();
        const gainBuzz = ctx.createGain();
        oscBuzz.connect(gainBuzz);
        gainBuzz.connect(ctx.destination);
        oscBuzz.type = 'square';
        oscBuzz.frequency.setValueAtTime(1200, t + 0.28);
        oscBuzz.frequency.setValueAtTime(1400, t + 0.32);
        oscBuzz.frequency.setValueAtTime(1200, t + 0.36);
        oscBuzz.frequency.setValueAtTime(1400, t + 0.40);
        gainBuzz.gain.setValueAtTime(0.08, t + 0.28);
        gainBuzz.gain.exponentialRampToValueAtTime(0.01, t + 0.43);
        oscBuzz.start(t + 0.28);
        oscBuzz.stop(t + 0.45);

    } else if (type === 'comboGodlike') {
        // 4-note epic chord + resonance (sine+sawtooth layered 0.3s)
        const t = ctx.currentTime;
        const notes = [261.63, 329.63, 392, 523.25];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + i * 0.06);
            gain.gain.setValueAtTime(0.15, t + i * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.06 + 0.15);
            osc.start(t + i * 0.06);
            osc.stop(t + i * 0.06 + 0.18);
        });
        // Resonance layer: sine + sawtooth
        const oscRes1 = ctx.createOscillator();
        const oscRes2 = ctx.createOscillator();
        const gainRes = ctx.createGain();
        oscRes1.connect(gainRes);
        oscRes2.connect(gainRes);
        gainRes.connect(ctx.destination);
        oscRes1.type = 'sine';
        oscRes2.type = 'sawtooth';
        oscRes1.frequency.setValueAtTime(523.25, t + 0.3);
        oscRes2.frequency.setValueAtTime(261.63, t + 0.3);
        gainRes.gain.setValueAtTime(0.12, t + 0.3);
        gainRes.gain.exponentialRampToValueAtTime(0.01, t + 0.6);
        oscRes1.start(t + 0.3);
        oscRes2.start(t + 0.3);
        oscRes1.stop(t + 0.65);
        oscRes2.stop(t + 0.65);

    } else if (type === 'comboInvincible') {
        // 5-note ascending melody + sustained low resonance + high shimmer 0.5s
        const t = ctx.currentTime;
        const notes = [392, 523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + i * 0.06);
            gain.gain.setValueAtTime(0.15, t + i * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.06 + 0.1);
            osc.start(t + i * 0.06);
            osc.stop(t + i * 0.06 + 0.12);
        });
        // Sustained low resonance
        const oscLow = ctx.createOscillator();
        const gainLow = ctx.createGain();
        oscLow.connect(gainLow);
        gainLow.connect(ctx.destination);
        oscLow.type = 'sawtooth';
        oscLow.frequency.setValueAtTime(130.81, t + 0.35);
        gainLow.gain.setValueAtTime(0.08, t + 0.35);
        gainLow.gain.exponentialRampToValueAtTime(0.01, t + 0.7);
        oscLow.start(t + 0.35);
        oscLow.stop(t + 0.75);
        // High shimmer
        const oscShimmer = ctx.createOscillator();
        const gainShimmer = ctx.createGain();
        oscShimmer.connect(gainShimmer);
        gainShimmer.connect(ctx.destination);
        oscShimmer.type = 'sine';
        oscShimmer.frequency.setValueAtTime(2000, t + 0.35);
        oscShimmer.frequency.setValueAtTime(2200, t + 0.45);
        oscShimmer.frequency.setValueAtTime(2000, t + 0.55);
        oscShimmer.frequency.setValueAtTime(2400, t + 0.65);
        gainShimmer.gain.setValueAtTime(0.05, t + 0.35);
        gainShimmer.gain.exponentialRampToValueAtTime(0.01, t + 0.75);
        oscShimmer.start(t + 0.35);
        oscShimmer.stop(t + 0.8);

    } else if (type === 'comboBreak') {
        // Glass shatter: sine 2000->200Hz fast drop 0.15s + 3 random short scattered tones 0.2s
        const t = ctx.currentTime;
        const oscShatter = ctx.createOscillator();
        const gainShatter = ctx.createGain();
        oscShatter.connect(gainShatter);
        gainShatter.connect(ctx.destination);
        oscShatter.type = 'sine';
        oscShatter.frequency.setValueAtTime(2000, t);
        oscShatter.frequency.exponentialRampToValueAtTime(200, t + 0.15);
        gainShatter.gain.setValueAtTime(0.25, t);
        gainShatter.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
        oscShatter.start(t);
        oscShatter.stop(t + 0.2);
        // 3 random scattered tones
        const scatterFreqs = [1500, 800, 1200];
        scatterFreqs.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + 0.18 + i * 0.06);
            gain.gain.setValueAtTime(0.1, t + 0.18 + i * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18 + i * 0.06 + 0.05);
            osc.start(t + 0.18 + i * 0.06);
            osc.stop(t + 0.18 + i * 0.06 + 0.07);
        });

    } else if (type === 'comboShieldBreak') {
        // Metal clang: triangle 1500->500Hz + square random 0.2s
        const t = ctx.currentTime;
        const oscClang = ctx.createOscillator();
        const gainClang = ctx.createGain();
        oscClang.connect(gainClang);
        gainClang.connect(ctx.destination);
        oscClang.type = 'triangle';
        oscClang.frequency.setValueAtTime(1500, t);
        oscClang.frequency.exponentialRampToValueAtTime(500, t + 0.15);
        gainClang.gain.setValueAtTime(0.25, t);
        gainClang.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        oscClang.start(t);
        oscClang.stop(t + 0.22);
        // Square random scatter
        const oscRand = ctx.createOscillator();
        const gainRand = ctx.createGain();
        oscRand.connect(gainRand);
        gainRand.connect(ctx.destination);
        oscRand.type = 'square';
        oscRand.frequency.setValueAtTime(1000, t + 0.1);
        oscRand.frequency.setValueAtTime(600, t + 0.15);
        oscRand.frequency.setValueAtTime(1200, t + 0.2);
        oscRand.frequency.setValueAtTime(400, t + 0.25);
        gainRand.gain.setValueAtTime(0.1, t + 0.1);
        gainRand.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        oscRand.start(t + 0.1);
        oscRand.stop(t + 0.32);

    } else if (type === 'comboRecover') {
        // Wavy ascending: sine 300->600->400->800Hz wave pattern 0.3s
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.linearRampToValueAtTime(600, t + 0.08);
        osc.frequency.linearRampToValueAtTime(400, t + 0.16);
        osc.frequency.linearRampToValueAtTime(800, t + 0.28);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.32);
        osc.start(t);
        osc.stop(t + 0.35);

    // --- Category 4: Old Behavior Sound Completion ---

    } else if (type === 'selfDestruct') {
        // Countdown 3 high beeps 0.8s -> expanding hum 0.3s -> full-freq explosion 0.4s
        const t = ctx.currentTime;
        // 3 high beeps
        [0, 0.25, 0.5].forEach((delay) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, t + delay);
            gain.gain.setValueAtTime(0.2, t + delay);
            gain.gain.exponentialRampToValueAtTime(0.01, t + delay + 0.12);
            osc.start(t + delay);
            osc.stop(t + delay + 0.15);
        });
        // Expanding hum
        const oscHum = ctx.createOscillator();
        const gainHum = ctx.createGain();
        oscHum.connect(gainHum);
        gainHum.connect(ctx.destination);
        oscHum.type = 'sawtooth';
        oscHum.frequency.setValueAtTime(80, t + 0.8);
        oscHum.frequency.exponentialRampToValueAtTime(200, t + 1.1);
        gainHum.gain.setValueAtTime(0.1, t + 0.8);
        gainHum.gain.linearRampToValueAtTime(0.2, t + 1.05);
        gainHum.gain.exponentialRampToValueAtTime(0.01, t + 1.12);
        oscHum.start(t + 0.8);
        oscHum.stop(t + 1.15);
        // Explosion
        const oscExp1 = ctx.createOscillator();
        const oscExp2 = ctx.createOscillator();
        const gainExp = ctx.createGain();
        oscExp1.connect(gainExp);
        oscExp2.connect(gainExp);
        gainExp.connect(ctx.destination);
        oscExp1.type = 'sawtooth';
        oscExp2.type = 'square';
        oscExp1.frequency.setValueAtTime(500, t + 1.1);
        oscExp1.frequency.exponentialRampToValueAtTime(30, t + 1.5);
        oscExp2.frequency.setValueAtTime(300, t + 1.1);
        oscExp2.frequency.exponentialRampToValueAtTime(20, t + 1.5);
        gainExp.gain.setValueAtTime(0.35, t + 1.1);
        gainExp.gain.exponentialRampToValueAtTime(0.01, t + 1.5);
        oscExp1.start(t + 1.1);
        oscExp2.start(t + 1.1);
        oscExp1.stop(t + 1.55);
        oscExp2.stop(t + 1.55);

    } else if (type === 'heal') {
        // 4-note ascending sine melody 0.4s + gentle echo
        const t = ctx.currentTime;
        const notes = [392, 523.25, 659.25, 783.99];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + i * 0.1);
            gain.gain.setValueAtTime(0.2, t + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.1 + 0.15);
            osc.start(t + i * 0.1);
            osc.stop(t + i * 0.1 + 0.18);
        });
        // Gentle echo
        const oscEcho = ctx.createOscillator();
        const gainEcho = ctx.createGain();
        oscEcho.connect(gainEcho);
        gainEcho.connect(ctx.destination);
        oscEcho.type = 'sine';
        oscEcho.frequency.setValueAtTime(783.99, t + 0.45);
        oscEcho.frequency.exponentialRampToValueAtTime(523.25, t + 0.7);
        gainEcho.gain.setValueAtTime(0.08, t + 0.45);
        gainEcho.gain.exponentialRampToValueAtTime(0.01, t + 0.75);
        oscEcho.start(t + 0.45);
        oscEcho.stop(t + 0.8);

    } else if (type === 'escape') {
        // Poof: noise burst 0.1s + 3 diminishing footstep tones 0.3s
        const t = ctx.currentTime;
        // Noise burst (high frequency sawtooth as pseudo-noise)
        const oscNoise = ctx.createOscillator();
        const gainNoise = ctx.createGain();
        oscNoise.connect(gainNoise);
        gainNoise.connect(ctx.destination);
        oscNoise.type = 'sawtooth';
        oscNoise.frequency.setValueAtTime(3000, t);
        oscNoise.frequency.exponentialRampToValueAtTime(500, t + 0.08);
        gainNoise.gain.setValueAtTime(0.15, t);
        gainNoise.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        oscNoise.start(t);
        oscNoise.stop(t + 0.12);
        // 3 diminishing footstep tones
        const footsteps = [
            { freq: 300, vol: 0.15, delay: 0.15 },
            { freq: 280, vol: 0.1, delay: 0.25 },
            { freq: 260, vol: 0.05, delay: 0.35 }
        ];
        footsteps.forEach((step) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(step.freq, t + step.delay);
            osc.frequency.exponentialRampToValueAtTime(step.freq * 0.7, t + step.delay + 0.06);
            gain.gain.setValueAtTime(step.vol, t + step.delay);
            gain.gain.exponentialRampToValueAtTime(0.01, t + step.delay + 0.08);
            osc.start(t + step.delay);
            osc.stop(t + step.delay + 0.1);
        });

    } else if (type === 'taunt') {
        // 3 provocative drum beats (square 0.2s) + angry hum
        const t = ctx.currentTime;
        [0, 0.08, 0.16].forEach((delay, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(200 + i * 50, t + delay);
            osc.frequency.exponentialRampToValueAtTime(100, t + delay + 0.05);
            gain.gain.setValueAtTime(0.2, t + delay);
            gain.gain.exponentialRampToValueAtTime(0.01, t + delay + 0.06);
            osc.start(t + delay);
            osc.stop(t + delay + 0.08);
        });
        // Angry hum
        const oscHum = ctx.createOscillator();
        const gainHum = ctx.createGain();
        oscHum.connect(gainHum);
        gainHum.connect(ctx.destination);
        oscHum.type = 'sawtooth';
        oscHum.frequency.setValueAtTime(120, t + 0.25);
        oscHum.frequency.linearRampToValueAtTime(150, t + 0.35);
        oscHum.frequency.linearRampToValueAtTime(100, t + 0.45);
        gainHum.gain.setValueAtTime(0.12, t + 0.25);
        gainHum.gain.exponentialRampToValueAtTime(0.01, t + 0.48);
        oscHum.start(t + 0.25);
        oscHum.stop(t + 0.5);

    } else if (type === 'fear') {
        // Rapid trembling sine 0.3s + 2-note descending whimper 0.2s
        const t = ctx.currentTime;
        // Trembling sine (rapid frequency modulation)
        const oscTremor = ctx.createOscillator();
        const gainTremor = ctx.createGain();
        oscTremor.connect(gainTremor);
        gainTremor.connect(ctx.destination);
        oscTremor.type = 'sine';
        // Rapid trembling via frequency changes
        for (let i = 0; i < 10; i++) {
            oscTremor.frequency.setValueAtTime(400 + (i % 2) * 100, t + i * 0.03);
        }
        gainTremor.gain.setValueAtTime(0.15, t);
        gainTremor.gain.exponentialRampToValueAtTime(0.05, t + 0.3);
        oscTremor.start(t);
        oscTremor.stop(t + 0.32);
        // 2-note descending whimper
        const whimperNotes = [500, 300];
        whimperNotes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + 0.32 + i * 0.1);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.7, t + 0.32 + i * 0.1 + 0.08);
            gain.gain.setValueAtTime(0.12, t + 0.32 + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.32 + i * 0.1 + 0.1);
            osc.start(t + 0.32 + i * 0.1);
            osc.stop(t + 0.32 + i * 0.1 + 0.12);
        });

    // --- Category 5: New Behavior Sounds ---

    } else if (type === 'counter') {
        // Metal clash: triangle 1200Hz 0.05s -> bounce whoosh sine 400->1200Hz 0.15s -> low hit square 0.1s
        const t = ctx.currentTime;
        // Metal clash
        const oscClash = ctx.createOscillator();
        const gainClash = ctx.createGain();
        oscClash.connect(gainClash);
        gainClash.connect(ctx.destination);
        oscClash.type = 'triangle';
        oscClash.frequency.setValueAtTime(1200, t);
        gainClash.gain.setValueAtTime(0.25, t);
        gainClash.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
        oscClash.start(t);
        oscClash.stop(t + 0.07);
        // Bounce whoosh
        const oscWhoosh = ctx.createOscillator();
        const gainWhoosh = ctx.createGain();
        oscWhoosh.connect(gainWhoosh);
        gainWhoosh.connect(ctx.destination);
        oscWhoosh.type = 'sine';
        oscWhoosh.frequency.setValueAtTime(400, t + 0.07);
        oscWhoosh.frequency.exponentialRampToValueAtTime(1200, t + 0.2);
        gainWhoosh.gain.setValueAtTime(0.18, t + 0.07);
        gainWhoosh.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
        oscWhoosh.start(t + 0.07);
        oscWhoosh.stop(t + 0.25);
        // Low hit
        const oscLow = ctx.createOscillator();
        const gainLow = ctx.createGain();
        oscLow.connect(gainLow);
        gainLow.connect(ctx.destination);
        oscLow.type = 'square';
        oscLow.frequency.setValueAtTime(120, t + 0.22);
        oscLow.frequency.exponentialRampToValueAtTime(50, t + 0.3);
        gainLow.gain.setValueAtTime(0.2, t + 0.22);
        gainLow.gain.exponentialRampToValueAtTime(0.01, t + 0.32);
        oscLow.start(t + 0.22);
        oscLow.stop(t + 0.35);

    } else if (type === 'split') {
        // Tear sound: sawtooth 800->400Hz 0.15s -> two ascending pops staggered 0.05s
        const t = ctx.currentTime;
        // Tear
        const oscTear = ctx.createOscillator();
        const gainTear = ctx.createGain();
        oscTear.connect(gainTear);
        gainTear.connect(ctx.destination);
        oscTear.type = 'sawtooth';
        oscTear.frequency.setValueAtTime(800, t);
        oscTear.frequency.exponentialRampToValueAtTime(400, t + 0.15);
        gainTear.gain.setValueAtTime(0.2, t);
        gainTear.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
        oscTear.start(t);
        oscTear.stop(t + 0.2);
        // Two ascending pops
        [0, 0.05].forEach((delay, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600 + i * 200, t + 0.2 + delay);
            osc.frequency.exponentialRampToValueAtTime(900 + i * 200, t + 0.2 + delay + 0.04);
            gain.gain.setValueAtTime(0.18, t + 0.2 + delay);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2 + delay + 0.06);
            osc.start(t + 0.2 + delay);
            osc.stop(t + 0.2 + delay + 0.08);
        });

    } else if (type === 'curse') {
        // Dark whisper: low sawtooth 60-100Hz oscillating 0.4s + sine frequency wobble 0.3s
        const t = ctx.currentTime;
        // Low sawtooth oscillating
        const oscDark = ctx.createOscillator();
        const gainDark = ctx.createGain();
        oscDark.connect(gainDark);
        gainDark.connect(ctx.destination);
        oscDark.type = 'sawtooth';
        oscDark.frequency.setValueAtTime(60, t);
        oscDark.frequency.linearRampToValueAtTime(100, t + 0.1);
        oscDark.frequency.linearRampToValueAtTime(60, t + 0.2);
        oscDark.frequency.linearRampToValueAtTime(100, t + 0.3);
        oscDark.frequency.linearRampToValueAtTime(60, t + 0.4);
        gainDark.gain.setValueAtTime(0.15, t);
        gainDark.gain.exponentialRampToValueAtTime(0.01, t + 0.42);
        oscDark.start(t);
        oscDark.stop(t + 0.45);
        // Sine frequency wobble
        const oscWobble = ctx.createOscillator();
        const gainWobble = ctx.createGain();
        oscWobble.connect(gainWobble);
        gainWobble.connect(ctx.destination);
        oscWobble.type = 'sine';
        oscWobble.frequency.setValueAtTime(200, t + 0.15);
        oscWobble.frequency.linearRampToValueAtTime(350, t + 0.25);
        oscWobble.frequency.linearRampToValueAtTime(180, t + 0.35);
        oscWobble.frequency.linearRampToValueAtTime(300, t + 0.45);
        gainWobble.gain.setValueAtTime(0.08, t + 0.15);
        gainWobble.gain.exponentialRampToValueAtTime(0.01, t + 0.48);
        oscWobble.start(t + 0.15);
        oscWobble.stop(t + 0.5);

    } else if (type === 'shield') {
        // Energy gather: sine 200->600Hz 0.2s -> sustained triangle 500Hz 0.3s decay
        const t = ctx.currentTime;
        // Energy gather
        const oscGather = ctx.createOscillator();
        const gainGather = ctx.createGain();
        oscGather.connect(gainGather);
        gainGather.connect(ctx.destination);
        oscGather.type = 'sine';
        oscGather.frequency.setValueAtTime(200, t);
        oscGather.frequency.exponentialRampToValueAtTime(600, t + 0.2);
        gainGather.gain.setValueAtTime(0.15, t);
        gainGather.gain.linearRampToValueAtTime(0.2, t + 0.18);
        gainGather.gain.exponentialRampToValueAtTime(0.05, t + 0.22);
        oscGather.start(t);
        oscGather.stop(t + 0.25);
        // Sustained triangle
        const oscSustain = ctx.createOscillator();
        const gainSustain = ctx.createGain();
        oscSustain.connect(gainSustain);
        gainSustain.connect(ctx.destination);
        oscSustain.type = 'triangle';
        oscSustain.frequency.setValueAtTime(500, t + 0.22);
        gainSustain.gain.setValueAtTime(0.18, t + 0.22);
        gainSustain.gain.exponentialRampToValueAtTime(0.01, t + 0.52);
        oscSustain.start(t + 0.22);
        oscSustain.stop(t + 0.55);

    } else if (type === 'transform') {
        // Energy storm: 3 oscillators random freq 0.3s -> silence 0.1s -> burst ascending 0.3s
        const t = ctx.currentTime;
        // Energy storm: 3 oscillators
        const stormTypes = ['sine', 'sawtooth', 'square'];
        const stormFreqs = [300, 500, 700];
        stormTypes.forEach((waveType, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = waveType;
            osc.frequency.setValueAtTime(stormFreqs[i], t);
            osc.frequency.linearRampToValueAtTime(stormFreqs[i] * 1.5, t + 0.1);
            osc.frequency.linearRampToValueAtTime(stormFreqs[i] * 0.8, t + 0.2);
            osc.frequency.linearRampToValueAtTime(stormFreqs[i] * 1.2, t + 0.28);
            gain.gain.setValueAtTime(0.1, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
            osc.start(t);
            osc.stop(t + 0.32);
        });
        // Burst ascending after silence gap
        const oscBurst = ctx.createOscillator();
        const gainBurst = ctx.createGain();
        oscBurst.connect(gainBurst);
        gainBurst.connect(ctx.destination);
        oscBurst.type = 'sawtooth';
        oscBurst.frequency.setValueAtTime(200, t + 0.4);
        oscBurst.frequency.exponentialRampToValueAtTime(1500, t + 0.65);
        gainBurst.gain.setValueAtTime(0.25, t + 0.4);
        gainBurst.gain.exponentialRampToValueAtTime(0.01, t + 0.7);
        oscBurst.start(t + 0.4);
        oscBurst.stop(t + 0.72);

    // --- Category 6: Monster Attack by Personality ---

    } else if (type === 'monsterAttackViolent') {
        // Heavy: square 100->30Hz 0.2s + crumble decay
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(100, t);
        osc.frequency.exponentialRampToValueAtTime(30, t + 0.2);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        osc.start(t);
        osc.stop(t + 0.35);
        // Crumble decay
        const oscCrumble = ctx.createOscillator();
        const gainCrumble = ctx.createGain();
        oscCrumble.connect(gainCrumble);
        gainCrumble.connect(ctx.destination);
        oscCrumble.type = 'sawtooth';
        oscCrumble.frequency.setValueAtTime(60, t + 0.15);
        oscCrumble.frequency.exponentialRampToValueAtTime(20, t + 0.35);
        gainCrumble.gain.setValueAtTime(0.08, t + 0.15);
        gainCrumble.gain.exponentialRampToValueAtTime(0.01, t + 0.38);
        oscCrumble.start(t + 0.15);
        oscCrumble.stop(t + 0.4);

    } else if (type === 'monsterAttackCunning') {
        // Quick: sawtooth 800->1200->200Hz 0.15s flash
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.linearRampToValueAtTime(1200, t + 0.06);
        osc.frequency.exponentialRampToValueAtTime(200, t + 0.15);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
        osc.start(t);
        osc.stop(t + 0.2);

    } else if (type === 'monsterAttackDefensive') {
        // Steady: triangle 400->200Hz 0.25s + dull echo
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, t);
        osc.frequency.exponentialRampToValueAtTime(200, t + 0.25);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);
        osc.start(t);
        osc.stop(t + 0.3);
        // Dull echo
        const oscEcho = ctx.createOscillator();
        const gainEcho = ctx.createGain();
        oscEcho.connect(gainEcho);
        gainEcho.connect(ctx.destination);
        oscEcho.type = 'triangle';
        oscEcho.frequency.setValueAtTime(250, t + 0.2);
        oscEcho.frequency.exponentialRampToValueAtTime(150, t + 0.4);
        gainEcho.gain.setValueAtTime(0.06, t + 0.2);
        gainEcho.gain.exponentialRampToValueAtTime(0.01, t + 0.42);
        oscEcho.start(t + 0.2);
        oscEcho.stop(t + 0.45);

    } else if (type === 'monsterAttackSinister') {
        // Dark: sawtooth 80->120Hz + random frequency tremor 0.3s
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, t);
        osc.frequency.linearRampToValueAtTime(120, t + 0.08);
        osc.frequency.linearRampToValueAtTime(80, t + 0.15);
        osc.frequency.linearRampToValueAtTime(110, t + 0.2);
        osc.frequency.linearRampToValueAtTime(90, t + 0.25);
        osc.frequency.linearRampToValueAtTime(120, t + 0.3);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.32);
        osc.start(t);
        osc.stop(t + 0.35);

    } else if (type === 'monsterAttackTimid') {
        // Weak: single high sine 1000Hz 0.05s, low gain
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, t);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
        osc.start(t);
        osc.stop(t + 0.07);

    } else if (type === 'monsterAttackBoss') {
        // Epic: dual oscillators 60+80Hz rumble 0.15s -> sawtooth+square burst 300->50Hz 0.3s
        const t = ctx.currentTime;
        // Dual oscillator rumble
        const oscRumble1 = ctx.createOscillator();
        const oscRumble2 = ctx.createOscillator();
        const gainRumble = ctx.createGain();
        oscRumble1.connect(gainRumble);
        oscRumble2.connect(gainRumble);
        gainRumble.connect(ctx.destination);
        oscRumble1.type = 'sine';
        oscRumble2.type = 'sine';
        oscRumble1.frequency.setValueAtTime(60, t);
        oscRumble2.frequency.setValueAtTime(80, t);
        gainRumble.gain.setValueAtTime(0.2, t);
        gainRumble.gain.exponentialRampToValueAtTime(0.05, t + 0.15);
        oscRumble1.start(t);
        oscRumble2.start(t);
        oscRumble1.stop(t + 0.18);
        oscRumble2.stop(t + 0.18);
        // Sawtooth + square burst
        const oscBurst1 = ctx.createOscillator();
        const oscBurst2 = ctx.createOscillator();
        const gainBurst = ctx.createGain();
        oscBurst1.connect(gainBurst);
        oscBurst2.connect(gainBurst);
        gainBurst.connect(ctx.destination);
        oscBurst1.type = 'sawtooth';
        oscBurst2.type = 'square';
        oscBurst1.frequency.setValueAtTime(300, t + 0.15);
        oscBurst1.frequency.exponentialRampToValueAtTime(50, t + 0.42);
        oscBurst2.frequency.setValueAtTime(250, t + 0.15);
        oscBurst2.frequency.exponentialRampToValueAtTime(40, t + 0.42);
        gainBurst.gain.setValueAtTime(0.3, t + 0.15);
        gainBurst.gain.exponentialRampToValueAtTime(0.01, t + 0.45);
        oscBurst1.start(t + 0.15);
        oscBurst2.start(t + 0.15);
        oscBurst1.stop(t + 0.48);
        oscBurst2.stop(t + 0.48);

    // --- Category 7: Tower-Specific Sounds ---

    } else if (type === 'towerEnter') {
        // Stone door: low rumble sine 50-80Hz 0.8s + decay echo 0.4s
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(50, t);
        osc.frequency.linearRampToValueAtTime(80, t + 0.3);
        osc.frequency.linearRampToValueAtTime(55, t + 0.5);
        osc.frequency.linearRampToValueAtTime(75, t + 0.7);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.linearRampToValueAtTime(0.2, t + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);
        osc.start(t);
        osc.stop(t + 0.85);
        // Decay echo
        const oscEcho = ctx.createOscillator();
        const gainEcho = ctx.createGain();
        oscEcho.connect(gainEcho);
        gainEcho.connect(ctx.destination);
        oscEcho.type = 'sine';
        oscEcho.frequency.setValueAtTime(65, t + 0.7);
        oscEcho.frequency.exponentialRampToValueAtTime(40, t + 1.1);
        gainEcho.gain.setValueAtTime(0.06, t + 0.7);
        gainEcho.gain.exponentialRampToValueAtTime(0.01, t + 1.1);
        oscEcho.start(t + 0.7);
        oscEcho.stop(t + 1.15);

    } else if (type === 'towerFloorUp') {
        // 3-note ascending (C-E-G): sine 261->329->392Hz each 0.1s
        const t = ctx.currentTime;
        const notes = [261.63, 329.63, 392];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + i * 0.1);
            gain.gain.setValueAtTime(0.2, t + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.1 + 0.12);
            osc.start(t + i * 0.1);
            osc.stop(t + i * 0.1 + 0.15);
        });

    } else if (type === 'towerBossGate') {
        // Chain rattling: sawtooth tremor 0.4s -> low metal clash 0.3s -> echo
        const t = ctx.currentTime;
        // Chain rattling tremor
        const oscChain = ctx.createOscillator();
        const gainChain = ctx.createGain();
        oscChain.connect(gainChain);
        gainChain.connect(ctx.destination);
        oscChain.type = 'sawtooth';
        // Tremor via rapid frequency changes
        for (let i = 0; i < 8; i++) {
            oscChain.frequency.setValueAtTime(300 + (i % 2) * 200, t + i * 0.05);
        }
        gainChain.gain.setValueAtTime(0.12, t);
        gainChain.gain.exponentialRampToValueAtTime(0.03, t + 0.4);
        oscChain.start(t);
        oscChain.stop(t + 0.42);
        // Low metal clash
        const oscClash = ctx.createOscillator();
        const gainClash = ctx.createGain();
        oscClash.connect(gainClash);
        gainClash.connect(ctx.destination);
        oscClash.type = 'triangle';
        oscClash.frequency.setValueAtTime(800, t + 0.4);
        oscClash.frequency.exponentialRampToValueAtTime(200, t + 0.6);
        gainClash.gain.setValueAtTime(0.25, t + 0.4);
        gainClash.gain.exponentialRampToValueAtTime(0.01, t + 0.7);
        oscClash.start(t + 0.4);
        oscClash.stop(t + 0.72);
        // Echo
        const oscEcho = ctx.createOscillator();
        const gainEcho = ctx.createGain();
        oscEcho.connect(gainEcho);
        gainEcho.connect(ctx.destination);
        oscEcho.type = 'triangle';
        oscEcho.frequency.setValueAtTime(300, t + 0.65);
        oscEcho.frequency.exponentialRampToValueAtTime(100, t + 0.9);
        gainEcho.gain.setValueAtTime(0.05, t + 0.65);
        gainEcho.gain.exponentialRampToValueAtTime(0.01, t + 0.92);
        oscEcho.start(t + 0.65);
        oscEcho.stop(t + 0.95);

    } else if (type === 'towerVictory') {
        // 8-note epic ascending melody 2s + bell echo
        const t = ctx.currentTime;
        const melody = [261.63, 329.63, 392, 523.25, 587.33, 659.25, 783.99, 1046.5];
        melody.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + i * 0.2);
            gain.gain.setValueAtTime(0, t + i * 0.2);
            gain.gain.linearRampToValueAtTime(0.2, t + i * 0.2 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.2 + 0.2);
            osc.start(t + i * 0.2);
            osc.stop(t + i * 0.2 + 0.25);
        });
        // Bell echo (triangle high note with slow decay)
        const oscBell = ctx.createOscillator();
        const gainBell = ctx.createGain();
        oscBell.connect(gainBell);
        gainBell.connect(ctx.destination);
        oscBell.type = 'triangle';
        oscBell.frequency.setValueAtTime(1046.5, t + 1.6);
        gainBell.gain.setValueAtTime(0.15, t + 1.6);
        gainBell.gain.exponentialRampToValueAtTime(0.01, t + 2.0);
        oscBell.start(t + 1.6);
        oscBell.stop(t + 2.05);

    } else if (type === 'towerDefeat') {
        // Low descending crumble 0.5s + fading echo
        const t = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.type = 'sawtooth';
        osc2.type = 'square';
        osc1.frequency.setValueAtTime(300, t);
        osc1.frequency.exponentialRampToValueAtTime(40, t + 0.4);
        osc2.frequency.setValueAtTime(200, t);
        osc2.frequency.exponentialRampToValueAtTime(30, t + 0.4);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 0.55);
        osc2.stop(t + 0.55);
        // Fading echo
        const oscEcho = ctx.createOscillator();
        const gainEcho = ctx.createGain();
        oscEcho.connect(gainEcho);
        gainEcho.connect(ctx.destination);
        oscEcho.type = 'sine';
        oscEcho.frequency.setValueAtTime(100, t + 0.4);
        oscEcho.frequency.exponentialRampToValueAtTime(40, t + 0.8);
        gainEcho.gain.setValueAtTime(0.05, t + 0.4);
        gainEcho.gain.exponentialRampToValueAtTime(0.01, t + 0.82);
        oscEcho.start(t + 0.4);
        oscEcho.stop(t + 0.85);
    }
}

// ===== Ambient / Looping Sound System (v16.0) =====

/**
 * Plays a looping ambient sound. Returns an object with a stop() method.
 * Caller is responsible for stopping the ambient sound when no longer needed.
 *
 * @param {string} type - The ambient sound type
 * @returns {{ stop: function }|null} - Handle to stop the ambient sound, or null if sound is off
 */
function playAmbientSound(type) {
    if (App.settings.sound !== 'on') return null;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;

    const ctx = new AudioContext();
    let intervalId = null;
    let stopped = false;
    const activeOscillators = [];

    // Helper: create a managed oscillator that cleans up
    function createManagedOsc(waveType, freq, gainVal, startTime, stopTime) {
        if (stopped) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = waveType;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(gainVal, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, stopTime);
        osc.start(startTime);
        osc.stop(stopTime + 0.05);
        activeOscillators.push(osc);
        return { osc, gain };
    }

    if (type === 'towerAmbientIntro') {
        // Faint wind + random water drops
        // Sustained wind: low sine hum
        const windOsc = ctx.createOscillator();
        const windGain = ctx.createGain();
        windOsc.connect(windGain);
        windGain.connect(ctx.destination);
        windOsc.type = 'sine';
        windOsc.frequency.setValueAtTime(60, ctx.currentTime);
        windGain.gain.setValueAtTime(0.04, ctx.currentTime);
        windOsc.start(ctx.currentTime);
        activeOscillators.push(windOsc);

        // Random water drops via interval
        intervalId = setInterval(() => {
            if (stopped) return;
            const t = ctx.currentTime;
            const freq = 800 + Math.random() * 1200;
            createManagedOsc('sine', freq, 0.03 + Math.random() * 0.03, t, t + 0.05 + Math.random() * 0.05);
        }, 600 + Math.random() * 1200);

    } else if (type === 'towerAmbientTrial') {
        // Random crackle noises + low 40Hz hum
        const humOsc = ctx.createOscillator();
        const humGain = ctx.createGain();
        humOsc.connect(humGain);
        humGain.connect(ctx.destination);
        humOsc.type = 'sawtooth';
        humOsc.frequency.setValueAtTime(40, ctx.currentTime);
        humGain.gain.setValueAtTime(0.04, ctx.currentTime);
        humOsc.start(ctx.currentTime);
        activeOscillators.push(humOsc);

        intervalId = setInterval(() => {
            if (stopped) return;
            const t = ctx.currentTime;
            const freq = 1000 + Math.random() * 3000;
            createManagedOsc('sawtooth', freq, 0.02 + Math.random() * 0.02, t, t + 0.02 + Math.random() * 0.04);
        }, 300 + Math.random() * 600);

    } else if (type === 'towerAmbientInferno') {
        // Sustained 30-50Hz rumble + occasional high shrieks
        const rumbleOsc = ctx.createOscillator();
        const rumbleGain = ctx.createGain();
        rumbleOsc.connect(rumbleGain);
        rumbleGain.connect(ctx.destination);
        rumbleOsc.type = 'sawtooth';
        rumbleOsc.frequency.setValueAtTime(35, ctx.currentTime);
        rumbleGain.gain.setValueAtTime(0.06, ctx.currentTime);
        rumbleOsc.start(ctx.currentTime);
        activeOscillators.push(rumbleOsc);

        // Slowly modulate rumble frequency
        const rumbleLfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        rumbleLfo.connect(lfoGain);
        lfoGain.connect(rumbleOsc.frequency);
        rumbleLfo.type = 'sine';
        rumbleLfo.frequency.setValueAtTime(0.3, ctx.currentTime);
        lfoGain.gain.setValueAtTime(10, ctx.currentTime);
        rumbleLfo.start(ctx.currentTime);
        activeOscillators.push(rumbleLfo);

        // Occasional high shrieks
        intervalId = setInterval(() => {
            if (stopped) return;
            const t = ctx.currentTime;
            const freq = 1500 + Math.random() * 2000;
            createManagedOsc('sine', freq, 0.03 + Math.random() * 0.03, t, t + 0.08 + Math.random() * 0.1);
        }, 1500 + Math.random() * 3000);

    } else if (type === 'towerBossTheme') {
        // Square wave rhythm at 120BPM + low bassline
        const bpm = 120;
        const beatInterval = 60000 / bpm; // ms per beat

        // Low bassline drone
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.connect(bassGain);
        bassGain.connect(ctx.destination);
        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(55, ctx.currentTime);
        bassGain.gain.setValueAtTime(0.06, ctx.currentTime);
        bassOsc.start(ctx.currentTime);
        activeOscillators.push(bassOsc);

        // Rhythmic square wave beats
        let beatIndex = 0;
        const bassPattern = [55, 55, 65.41, 55]; // A1, A1, C2, A1
        intervalId = setInterval(() => {
            if (stopped) return;
            const t = ctx.currentTime;
            const patternFreq = bassPattern[beatIndex % bassPattern.length];
            beatIndex++;

            // Rhythmic hit
            createManagedOsc('square', patternFreq * 2, 0.08, t, t + 0.08);
            // Update bass note
            bassOsc.frequency.setValueAtTime(patternFreq, t);
        }, beatInterval);

    } else {
        // Unknown ambient type, close the context
        ctx.close();
        return null;
    }

    // Return handle to stop the ambient sound
    return {
        stop: function() {
            if (stopped) return;
            stopped = true;
            if (intervalId !== null) {
                clearInterval(intervalId);
            }
            // Stop all active oscillators gracefully
            activeOscillators.forEach(osc => {
                try { osc.stop(); } catch(e) { /* already stopped */ }
            });
            // Close the audio context after a brief delay
            setTimeout(() => {
                try { ctx.close(); } catch(e) {}
            }, 200);
        }
    };
}

/**
 * Stops an ambient sound that was started with playAmbientSound().
 * @param {{ stop: function }|null} ambientRef - The handle returned by playAmbientSound()
 */
function stopAmbientSound(ambientRef) {
    if (ambientRef && typeof ambientRef.stop === 'function') {
        ambientRef.stop();
    }
}

// ===== Vibration =====
function vibrate(pattern) {
    if (navigator.vibrate) {
        navigator.vibrate(pattern);
    }
}

// ===== Visual Feedback =====
function showFeedback(isCorrect, feedbackId = 'feedback') {
    const feedback = document.getElementById(feedbackId);
    const icon = feedback.querySelector('.feedback-icon');
    const text = feedback.querySelector('.feedback-text');

    feedback.classList.remove('correct', 'wrong', 'show');

    if (isCorrect) {
        feedback.classList.add('correct');
        icon.textContent = '\u2713';
        text.textContent = ['\u592A\u68D2\u4E86\uFF01', '\u6B63\u786E\uFF01', '\u5389\u5BB3\uFF01', '\u7EE7\u7EED\u4FDD\u6301\uFF01'][Math.floor(Math.random() * 4)];
    } else {
        feedback.classList.add('wrong');
        icon.textContent = '\u2717';
        text.textContent = ['\u518D\u60F3\u60F3', '\u52A0\u6CB9\uFF01', '\u4E0B\u6B21\u4E00\u5B9A\u884C'][Math.floor(Math.random() * 3)];
    }

    feedback.classList.add('show');

    setTimeout(() => {
        feedback.classList.remove('show');
    }, 1000);
}

// ===== Confetti & Particles =====
function createConfetti(count = 50) {
    const colors = ['#6C5CE7', '#34C759', '#FF9500', '#FF3B30', '#5AC8FA', '#AF52DE', '#FFD60A', '#FF6B6B', '#4ECDC4'];
    const shapes = ['square', 'circle', 'triangle'];
    const effectsLayer = document.getElementById('effects-layer');

    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';

        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const size = 6 + Math.random() * 10;

        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = color;
        confetti.style.color = color;
        confetti.style.animationDelay = Math.random() * 0.8 + 's';
        confetti.style.animationDuration = (2.5 + Math.random() * 2) + 's';
        confetti.style.width = size + 'px';
        confetti.style.height = size + 'px';

        if (shape === 'circle') {
            confetti.style.borderRadius = '50%';
        } else if (shape === 'triangle') {
            confetti.style.width = '0';
            confetti.style.height = '0';
            confetti.style.backgroundColor = 'transparent';
            confetti.style.borderLeft = size/2 + 'px solid transparent';
            confetti.style.borderRight = size/2 + 'px solid transparent';
            confetti.style.borderBottom = size + 'px solid ' + color;
        }

        effectsLayer.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }
}

function createStarBurst(x, y, count = 8) {
    const stars = ['\u2B50', '\u2728', '\uD83C\uDF1F', '\uD83D\uDCAB', '\u26A1', '\uD83D\uDCA5'];
    const effectsLayer = document.getElementById('effects-layer');

    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star-burst';
        star.textContent = stars[Math.floor(Math.random() * stars.length)];
        star.style.fontSize = (1 + Math.random() * 1.5) + 'rem';

        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        const distance = 40 + Math.random() * 60;

        star.style.left = x + 'px';
        star.style.top = y + 'px';
        star.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
        star.style.setProperty('--ty', Math.sin(angle) * distance + 'px');

        effectsLayer.appendChild(star);
        setTimeout(() => star.remove(), 800);
    }
}

function createEnergyWave(x, y) {
    const effectsLayer = document.getElementById('effects-layer');

    for (let i = 0; i < 3; i++) {
        const wave = document.createElement('div');
        wave.className = 'energy-wave';
        wave.style.left = (x - 50) + 'px';
        wave.style.top = (y - 50) + 'px';
        wave.style.animationDelay = (i * 0.15) + 's';
        effectsLayer.appendChild(wave);
        setTimeout(() => wave.remove(), 1000);
    }
}

function createFloatingHearts(x, y, count = 5) {
    const hearts = ['\u2764\uFE0F', '\uD83D\uDC96', '\uD83D\uDC95', '\uD83D\uDC97', '\uD83D\uDC9D'];
    const effectsLayer = document.getElementById('effects-layer');

    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = (x - 20 + Math.random() * 40) + 'px';
        heart.style.top = y + 'px';
        heart.style.animationDelay = (i * 0.1) + 's';
        effectsLayer.appendChild(heart);
        setTimeout(() => heart.remove(), 1200);
    }
}

function createComboText(streak) {
    const texts = {
        3: '\uD83D\uDD25 \u4E09\u8FDE!',
        5: '\u26A1 \u4E94\u8FDE\u51FB!',
        10: '\uD83D\uDCA5 \u5341\u8FDE\u65A9!',
        15: '\uD83C\uDF1F \u8D85\u795E!',
        20: '\uD83D\uDC51 \u65E0\u654C!'
    };

    const text = texts[streak];
    if (!text) return;

    const combo = document.createElement('div');
    combo.className = 'combo-text';
    combo.textContent = text;
    combo.style.left = '50%';
    combo.style.top = '30%';
    combo.style.transform = 'translateX(-50%)';

    document.body.appendChild(combo);
    setTimeout(() => combo.remove(), 1200);
}

function createScorePopup(element, score, isCorrect) {
    const popup = document.createElement('div');
    popup.className = 'score-popup ' + (isCorrect ? 'correct' : 'wrong');
    popup.textContent = isCorrect ? '+' + score : '\u00D7';

    const rect = element.getBoundingClientRect();
    popup.style.left = (rect.left + rect.width / 2) + 'px';
    popup.style.top = rect.top + 'px';

    document.body.appendChild(popup);

    if (isCorrect) {
        createEnergyWave(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    setTimeout(() => popup.remove(), 1000);
}

// ===== Achievements =====
function showAchievement(achievement) {
    const popup = document.getElementById('achievement-popup');
    const desc = document.getElementById('achievement-desc');
    const icon = popup.querySelector('.achievement-icon');

    icon.textContent = achievement.icon;
    desc.textContent = achievement.desc;

    popup.classList.remove('hidden');
    setTimeout(() => popup.classList.add('show'), 10);

    playSound('achievement');
    createConfetti();

    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.classList.add('hidden'), 300);
    }, 2500);
}

function checkAchievements(streak, totalCorrect) {
    MathData.achievements.forEach(achievement => {
        if (App.stats.achievements.includes(achievement.id)) return;

        if (achievement.condition && achievement.condition(streak, totalCorrect)) {
            App.stats.achievements.push(achievement.id);
            saveProgress();
            showAchievement(achievement);
        }
    });
}

// ===== v15.0 New Particle Effects =====

function createWeaponTrail(color) {
    const effectsLayer = document.getElementById('effects-layer');
    if (!effectsLayer) return;
    const count = 6;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'weapon-trail-particle';
        particle.style.background = color || '#ffaa00';
        particle.style.left = (30 + Math.random() * 40) + '%';
        particle.style.top = (20 + Math.random() * 30) + '%';
        particle.style.animationDelay = (i * 0.05) + 's';
        effectsLayer.appendChild(particle);
        setTimeout(() => particle.remove(), 600);
    }
}

function createBossEntrance(x, y) {
    const effectsLayer = document.getElementById('effects-layer');
    if (!effectsLayer) return;
    const count = 12;
    const emojis = ['💀', '⚡', '🔥', '💫', '✨'];

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'boss-entrance-particle';
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';

        const angle = (i / count) * Math.PI * 2;
        const distance = 50 + Math.random() * 80;

        particle.style.left = (x || window.innerWidth * 0.75) + 'px';
        particle.style.top = (y || window.innerHeight * 0.25) + 'px';
        particle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
        particle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');

        effectsLayer.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}

function createCardRevealEffect(rarity, x, y) {
    const effectsLayer = document.getElementById('effects-layer');
    if (!effectsLayer) return;

    const colorMap = {
        SR: '#9b59b6',
        SSR: '#f39c12',
        UR: '#e74c3c'
    };
    const color = colorMap[rarity] || '#9b59b6';
    const count = rarity === 'UR' ? 30 : (rarity === 'SSR' ? 20 : 12);
    const emojis = rarity === 'UR' ? ['🌈', '⭐', '✨', '💫', '🌟'] :
                   rarity === 'SSR' ? ['⭐', '✨', '💛', '🌟'] :
                   ['✨', '💜', '⭐'];

    for (let i = 0; i < Math.min(count, 50); i++) {
        const particle = document.createElement('div');
        particle.className = 'card-reveal-particle';
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.style.fontSize = (0.6 + Math.random() * 1) + 'rem';

        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        const distance = 40 + Math.random() * 100;

        particle.style.left = (x || window.innerWidth / 2) + 'px';
        particle.style.top = (y || window.innerHeight / 2) + 'px';
        particle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
        particle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
        particle.style.animationDelay = (Math.random() * 0.3) + 's';

        effectsLayer.appendChild(particle);
        setTimeout(() => particle.remove(), 1200);
    }
}
