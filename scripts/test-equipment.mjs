import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const users = [{ id: 'test', name: '测试勇者', avatar: '⚔️' }];
let saveCount = 0;
const emptyNode = () => ({
    className: '', textContent: '', innerHTML: '', dataset: {},
    classList: { add() {}, remove() {}, toggle() {} },
    appendChild() {}, remove() {}, querySelector() { return null; }, querySelectorAll() { return []; }
});

const context = vm.createContext({
    console,
    App: { stats: { totalScore: 0 }, adventure: null, battle: { active: true, combo: 0, module: 'xiaojiujiu' }, currentPage: 'battle' },
    UserManager: {
        getCurrentUser: () => users[0], getUsers: () => users,
        saveUsers() {}
    },
    BattleMode: {},
    document: {
        addEventListener() {}, getElementById() { return null; }, querySelector() { return null; }, querySelectorAll() { return []; },
        createElement: emptyNode, body: { appendChild() {} }
    },
    window: {},
    saveProgress() { saveCount++; },
    updateCurrentUserBadge() {}, requestAnimationFrame(callback) { callback(); },
    setTimeout() { return 0; }, clearInterval() {}, setInterval() { return 0; }
});

vm.runInContext(fs.readFileSync(path.join(root, 'js/adventure-system.js'), 'utf8'), context, { filename: 'adventure-system.js' });
const equipment = context.window.AdventureSystem;
const state = equipment.ensureState();
state.owned = equipment.catalog.map(item => item.id);

assert.equal(equipment.config.weaponSwitchCooldown, 60000);
assert.equal(equipment.switchBattleEquipment('weapon', 'bow'), true);
assert.equal(context.App.adventure.profile.weapon, 'bow');
assert.ok(context.App.adventure.cooldowns.weaponSwitchUntil > Date.now());
assert.equal(equipment.switchBattleEquipment('weapon', 'hammer'), false);
assert.equal(context.App.adventure.profile.weapon, 'bow');

context.App.adventure.profile.magic = 'spark';
context.App.adventure.cooldowns.magicReadyAt = {};
let outgoing = equipment.calculateOutgoingDamage(1, { defense: 1 }, true);
assert.equal(outgoing.weapon.attack, 2);
assert.equal(outgoing.magicDamage, 1);
assert.equal(outgoing.finalDamage, 2);
outgoing = equipment.calculateOutgoingDamage(1, { defense: 1 }, true);
assert.equal(outgoing.magicDamage, 0);
assert.equal(outgoing.finalDamage, 1);

context.App.adventure.profile.shield = 'sun';
let incoming = equipment.calculateIncomingDamage(2);
assert.deepEqual({ reduction: incoming.reduction, finalDamage: incoming.finalDamage }, { reduction: 1, finalDamage: 1 });
context.App.adventure.profile.shield = 'dragon';
incoming = equipment.calculateIncomingDamage(2);
assert.deepEqual({ reduction: incoming.reduction, finalDamage: incoming.finalDamage }, { reduction: 2, finalDamage: 0 });

const savedCooldown = context.App.adventure.cooldowns.weaponSwitchUntil;
equipment.ensureState();
assert.equal(context.App.adventure.cooldowns.weaponSwitchUntil, savedCooldown);
assert.ok(saveCount > 0);
console.log('equipment tests passed: catalog, real damage, shield reduction, persistent 60s switch cooldown');
