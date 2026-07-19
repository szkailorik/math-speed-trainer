import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = [
    'js/data.js',
    'js/shanhai-monsters.js',
    'js/xiyouji-monsters.js',
    'js/fengshen-monsters.js',
    'js/liaozhai-monsters.js',
    'js/hp-monsters.js',
    'js/monster-expansion.js',
    'js/character-art.js',
    'js/battle-data.js',
    'js/chapter-data.js',
    'js/monster-registry.js'
];

const context = vm.createContext({
    console,
    App: { battle: { module: 'xiaojiujiu' } },
    window: {}
});

for (const file of files) {
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
}

const modules = ['xiaojiujiu', 'fraction', 'decimal', 'unit', 'multiply', 'times'];
const report = JSON.parse(vm.runInContext(`JSON.stringify(${JSON.stringify(modules)}.map(function (module) {
    var monsters = BattleMode.getAllMonsters(module);
    return {
        module: module,
        count: monsters.length,
        issues: MonsterRegistry.validate(monsters, module),
        monsters: monsters.map(function (monster) {
            return { id: monster.id, name: monster.name, image: monster.image, assetStatus: monster.assetStatus };
        })
    };
}))`, context));

let failed = false;
const allIds = new Map();
const phoenixes = [];
for (const moduleReport of report) {
    const missingFiles = [];
    const duplicateIds = [];
    const statusCounts = {};
    const moduleIds = new Set();
    for (const monster of moduleReport.monsters) {
        statusCounts[monster.assetStatus] = (statusCounts[monster.assetStatus] || 0) + 1;
        if (!monster.image || !fs.existsSync(path.join(root, monster.image))) missingFiles.push({ id: monster.id, image: monster.image });
        if (moduleIds.has(monster.id)) duplicateIds.push({ id: monster.id, name: monster.name });
        moduleIds.add(monster.id);
        const prior = allIds.get(monster.id);
        if (prior && prior.name !== monster.name) duplicateIds.push({ id: monster.id, names: [prior.name, monster.name] });
        else allIds.set(monster.id, { name: monster.name, module: moduleReport.module });
        if (/凤凰|不死鸟|福克斯/.test(monster.name) || /(^|_)phoenix($|_)/i.test(monster.id)) phoenixes.push({ module: moduleReport.module, id: monster.id, name: monster.name, image: monster.image });
    }
    if (moduleReport.issues.length || missingFiles.length || duplicateIds.length) failed = true;
    console.log(`${moduleReport.module}: ${moduleReport.count} monsters, registry issues=${moduleReport.issues.length}, missing assets=${missingFiles.length}, duplicate IDs=${duplicateIds.length}, asset status=${JSON.stringify(statusCounts)}`);
    if (moduleReport.issues.length) console.log(moduleReport.issues);
    if (missingFiles.length) console.log(missingFiles);
    if (duplicateIds.length) console.log(duplicateIds);
}

const badPhoenixes = phoenixes.filter(monster => monster.image !== 'assets/characters/special/phoenix.png');
console.log(`phoenix records: ${phoenixes.length}, mismatches: ${badPhoenixes.length}`);
console.log(phoenixes);
if (badPhoenixes.length) failed = true;

const expansionCount = JSON.parse(vm.runInContext(`JSON.stringify(${JSON.stringify(modules)}.map(function (module) { return MonsterExpansion.get(module).length; }))`, context));
console.log(`expansion counts: ${expansionCount.join(', ')}`);
if (expansionCount.some(count => count !== 50)) failed = true;

if (failed) process.exitCode = 1;
