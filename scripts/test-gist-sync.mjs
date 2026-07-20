import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

class StorageMock {
    constructor() { this.values = new Map(); }
    get length() { return this.values.size; }
    key(index) { return Array.from(this.values.keys())[index] ?? null; }
    getItem(key) { return this.values.has(String(key)) ? this.values.get(String(key)) : null; }
    setItem(key, value) { this.values.set(String(key), String(value)); }
    removeItem(key) { this.values.delete(String(key)); }
}

const localStorage = new StorageMock();
const sessionStorage = new StorageMock();
let createdGist = null;
let patchedGist = null;

function response(data, status = 200) {
    return {
        ok: status >= 200 && status < 300,
        status,
        async json() { return data; },
        async text() { return typeof data === 'string' ? data : JSON.stringify(data); }
    };
}

async function fetchMock(url, options = {}) {
    const method = options.method || 'GET';
    if (url.endsWith('/user')) return response({ login: 'sync-test-user' });
    if (url.includes('/gists?')) return response([]);
    if (url.endsWith('/gists') && method === 'POST') {
        createdGist = JSON.parse(options.body);
        return response({ id: 'gist-test-id', files: createdGist.files });
    }
    if (url.endsWith('/gists/gist-test-id') && method === 'PATCH') {
        patchedGist = JSON.parse(options.body);
        return response({ id: 'gist-test-id', files: patchedGist.files });
    }
    throw new Error(`Unexpected request: ${method} ${url}`);
}

const document = {
    visibilityState: 'visible',
    addEventListener() {},
    getElementById() { return null; }
};
const window = {
    addEventListener() {},
    open() {},
    localStorage,
    sessionStorage
};

const context = vm.createContext({
    Storage: StorageMock,
    localStorage,
    sessionStorage,
    document,
    window,
    fetch: fetchMock,
    console,
    setTimeout,
    clearTimeout,
    Date,
    Math,
    JSON,
    Object,
    String,
    Number,
    Array,
    Promise
});

const source = fs.readFileSync(new URL('../js/gist-sync.js', import.meta.url), 'utf8');
vm.runInContext(source, context, { filename: 'gist-sync.js' });

localStorage.setItem('mathSpeedTrainer_users', JSON.stringify([{ id: 'kai', name: 'Kai' }]));
localStorage.setItem('mathSpeedTrainer_kai', JSON.stringify({ stats: { totalScore: 42 } }));
localStorage.setItem('mathSpeedTrainer_currentUser', 'kai');
localStorage.setItem('MST_gist_token', 'ghp_test_token_value_that_is_long_enough_123456');

assert.equal(window.GistSync.isSyncKey('mathSpeedTrainer_users'), true);
assert.equal(window.GistSync.isSyncKey('mathSpeedTrainer_kai'), true);
assert.equal(window.GistSync.isSyncKey('mathSpeedTrainer_currentUser'), false);
assert.equal(window.GistSync.isSyncKey('MST_gist_token'), false);

const snapshot = window.GistSync.snapshot(0);
assert.ok(snapshot.items.mathSpeedTrainer_users);
assert.ok(snapshot.items.mathSpeedTrainer_kai);
assert.equal(snapshot.items.mathSpeedTrainer_currentUser, undefined);
assert.equal(snapshot.items.MST_gist_token, undefined);

await window.GistSync.syncNow();
assert.equal(createdGist.public, false);
assert.equal(createdGist.description, 'math-speed-trainer-sync-v1');
assert.ok(patchedGist.files['math-speed-trainer.json']);

const uploaded = JSON.parse(patchedGist.files['math-speed-trainer.json'].content);
assert.ok(uploaded.items.mathSpeedTrainer_users);
assert.ok(uploaded.items.mathSpeedTrainer_kai);
assert.equal(uploaded.items.MST_gist_token, undefined);

console.log('gist sync tests passed: private gist, progress included, credentials excluded');
