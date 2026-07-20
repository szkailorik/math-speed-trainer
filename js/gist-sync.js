/**
 * GitHub Gist cross-device sync for Math Speed Trainer.
 *
 * The PAT and Gist id remain in this browser. Only app progress keys are
 * uploaded to the user's private Gist. Existing localStorage callers are
 * observed centrally so every game subsystem participates in sync.
 */
(function () {
    'use strict';

    var GIST_DESCRIPTION = 'math-speed-trainer-sync-v1';
    var GIST_FILENAME = 'math-speed-trainer.json';
    var TOKEN_KEY = 'MST_gist_token';
    var GIST_ID_KEY = 'MST_gist_id';
    var DEVICE_KEY = 'MST_sync_device_id';
    var META_KEY = 'MST_sync_key_meta';
    var LAST_PUSH_KEY = 'MST_sync_last_push';
    var LAST_PULL_KEY = 'MST_sync_last_pull';
    var AUTO_SYNC_INTERVAL = 15000;
    var nativeSetItem = Storage.prototype.setItem;
    var nativeRemoveItem = Storage.prototype.removeItem;
    var trackingPaused = false;
    var pushTimer = null;
    var syncPromise = null;
    var lastSyncAttempt = 0;

    function localGet(key) {
        try { return localStorage.getItem(key); } catch (e) { return null; }
    }

    function localSet(key, value) {
        try { nativeSetItem.call(localStorage, key, String(value)); } catch (e) {}
    }

    function localRemove(key) {
        try { nativeRemoveItem.call(localStorage, key); } catch (e) {}
    }

    function isSyncKey(key) {
        if (!key || key === 'mathSpeedTrainer_currentUser') return false;
        if (key === 'mathSpeedTrainer_users' || key === 'mathTrainer_knowledgeProgress' || key === 'mathTrainer_moduleStats') return true;
        return [
            'mathSpeedTrainer_',
            'questionWeights_',
            'mathCrystal_',
            'cardCollection_',
            'monsterCollection_',
            'chapterProgress_'
        ].some(function (prefix) { return key.indexOf(prefix) === 0; });
    }

    function getDeviceId() {
        var id = localGet(DEVICE_KEY);
        if (!id) {
            id = 'device-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
            localSet(DEVICE_KEY, id);
        }
        return id;
    }

    function readKeyMeta() {
        try { return JSON.parse(localGet(META_KEY) || '{}') || {}; } catch (e) { return {}; }
    }

    function writeKeyMeta(meta) {
        localSet(META_KEY, JSON.stringify(meta));
    }

    function markChanged(key, deleted) {
        if (trackingPaused || !isSyncKey(key)) return;
        var meta = readKeyMeta();
        meta[key] = {
            updatedAt: Date.now(),
            deviceId: getDeviceId(),
            deleted: !!deleted
        };
        writeKeyMeta(meta);
        schedulePush();
        updateButton('pending');
    }

    Storage.prototype.setItem = function (key, value) {
        nativeSetItem.call(this, key, value);
        if (this === localStorage) markChanged(String(key), false);
    };

    Storage.prototype.removeItem = function (key) {
        nativeRemoveItem.call(this, key);
        if (this === localStorage) markChanged(String(key), true);
    };

    function snapshotLocal(seedTime) {
        var meta = readKeyMeta();
        var items = {};
        var i;
        try {
            for (i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (!isSyncKey(key)) continue;
                var keyMeta = meta[key] || {};
                items[key] = {
                    value: localStorage.getItem(key),
                    updatedAt: Number(keyMeta.updatedAt) || Number(seedTime) || 0,
                    deviceId: keyMeta.deviceId || getDeviceId(),
                    deleted: false
                };
            }
        } catch (e) {}

        Object.keys(meta).forEach(function (key) {
            if (!isSyncKey(key) || !meta[key].deleted || items[key]) return;
            items[key] = {
                value: null,
                updatedAt: Number(meta[key].updatedAt) || Number(seedTime) || 0,
                deviceId: meta[key].deviceId || getDeviceId(),
                deleted: true
            };
        });

        return {
            schemaVersion: 1,
            app: 'math-speed-trainer',
            updatedAt: Date.now(),
            items: items
        };
    }

    function normalizeState(state) {
        if (!state || typeof state !== 'object' || !state.items || typeof state.items !== 'object') {
            return { schemaVersion: 1, app: 'math-speed-trainer', updatedAt: 0, items: {} };
        }
        var items = {};
        Object.keys(state.items).forEach(function (key) {
            var item = state.items[key];
            if (!isSyncKey(key) || !item || typeof item !== 'object') return;
            items[key] = {
                value: item.deleted ? null : String(item.value == null ? '' : item.value),
                updatedAt: Number(item.updatedAt) || 0,
                deviceId: String(item.deviceId || ''),
                deleted: !!item.deleted
            };
        });
        return {
            schemaVersion: 1,
            app: 'math-speed-trainer',
            updatedAt: Number(state.updatedAt) || 0,
            items: items
        };
    }

    function pickNewest(localItem, cloudItem) {
        if (!localItem) return cloudItem;
        if (!cloudItem) return localItem;
        if (cloudItem.updatedAt > localItem.updatedAt) return cloudItem;
        if (localItem.updatedAt > cloudItem.updatedAt) return localItem;
        return String(cloudItem.deviceId || '') >= String(localItem.deviceId || '') ? cloudItem : localItem;
    }

    function mergeStates(localState, cloudState) {
        var localNormalized = normalizeState(localState);
        var cloudNormalized = normalizeState(cloudState);
        var merged = { schemaVersion: 1, app: 'math-speed-trainer', updatedAt: Date.now(), items: {} };
        var keys = {};
        Object.keys(localNormalized.items).forEach(function (key) { keys[key] = true; });
        Object.keys(cloudNormalized.items).forEach(function (key) { keys[key] = true; });
        Object.keys(keys).forEach(function (key) {
            merged.items[key] = pickNewest(localNormalized.items[key], cloudNormalized.items[key]);
        });
        return merged;
    }

    function applyState(state) {
        var normalized = normalizeState(state);
        var meta = readKeyMeta();
        trackingPaused = true;
        try {
            Object.keys(normalized.items).forEach(function (key) {
                var item = normalized.items[key];
                if (item.deleted) localRemove(key);
                else localSet(key, item.value);
                meta[key] = {
                    updatedAt: item.updatedAt,
                    deviceId: item.deviceId,
                    deleted: item.deleted
                };
            });
            writeKeyMeta(meta);
        } finally {
            trackingPaused = false;
        }
    }

    function headers() {
        return {
            Accept: 'application/vnd.github+json',
            Authorization: 'Bearer ' + localGet(TOKEN_KEY),
            'Content-Type': 'application/json',
            'X-GitHub-Api-Version': '2022-11-28'
        };
    }

    async function api(url, options) {
        var response = await fetch(url, Object.assign({}, options || {}, { headers: headers() }));
        if (!response.ok) {
            var message = '';
            try { message = (await response.json()).message || ''; } catch (e) {}
            throw new Error('GitHub ' + response.status + (message ? ': ' + message : ''));
        }
        return response.status === 204 ? null : response.json();
    }

    async function connect() {
        if (!localGet(TOKEN_KEY)) throw new Error('请先粘贴 GitHub Token');
        var user = await api('https://api.github.com/user');
        var gistId = localGet(GIST_ID_KEY);

        if (gistId) {
            try {
                var known = await api('https://api.github.com/gists/' + gistId);
                return { user: user, gist: known, created: false };
            } catch (e) {
                if (String(e.message).indexOf('GitHub 404') === -1) throw e;
                localRemove(GIST_ID_KEY);
            }
        }

        var gists = await api('https://api.github.com/gists?per_page=100');
        var found = gists.find(function (gist) { return gist.description === GIST_DESCRIPTION; });
        if (found) {
            localSet(GIST_ID_KEY, found.id);
            return { user: user, gist: await api('https://api.github.com/gists/' + found.id), created: false };
        }

        var initial = snapshotLocal(Date.now());
        var files = {};
        files[GIST_FILENAME] = { content: JSON.stringify(initial, null, 2) };
        var created = await api('https://api.github.com/gists', {
            method: 'POST',
            body: JSON.stringify({ description: GIST_DESCRIPTION, public: false, files: files })
        });
        localSet(GIST_ID_KEY, created.id);
        localSet(LAST_PUSH_KEY, Date.now());
        return { user: user, gist: created, created: true };
    }

    async function stateFromGist(gist) {
        var file = gist && gist.files && gist.files[GIST_FILENAME];
        if (!file) return normalizeState(null);
        var content = file.content;
        if (file.truncated && file.raw_url) {
            var response = await fetch(file.raw_url, { headers: headers() });
            if (!response.ok) throw new Error('读取完整 Gist 失败 ' + response.status);
            content = await response.text();
        }
        try { return normalizeState(JSON.parse(content || '{}')); }
        catch (e) { throw new Error('云端同步文件格式损坏'); }
    }

    async function pushState(state) {
        var gistId = localGet(GIST_ID_KEY);
        if (!gistId) throw new Error('尚未连接 Gist');
        var files = {};
        files[GIST_FILENAME] = { content: JSON.stringify(normalizeState(state), null, 2) };
        await api('https://api.github.com/gists/' + gistId, {
            method: 'PATCH',
            body: JSON.stringify({ description: GIST_DESCRIPTION, files: files })
        });
        localSet(LAST_PUSH_KEY, Date.now());
    }

    function refreshRuntime() {
        try { if (typeof KnowledgeTracker !== 'undefined') KnowledgeTracker.init(); } catch (e) {}
        try {
            if (typeof UserManager !== 'undefined' && UserManager.getCurrentUser() && typeof loadProgress === 'function') loadProgress();
            if (typeof renderUserList === 'function') renderUserList();
            if (typeof updateCurrentUserBadge === 'function') updateCurrentUserBadge();
            if (typeof BattleMode !== 'undefined' && typeof BattleMode.loadTowerProgress === 'function') BattleMode.loadTowerProgress();
        } catch (e) { console.warn('同步后刷新界面失败', e); }
    }

    async function performSync(options) {
        options = options || {};
        if (!localGet(TOKEN_KEY)) return false;
        updateButton('syncing');
        var connection = await connect();
        var cloud = await stateFromGist(connection.gist);
        var merged = mergeStates(snapshotLocal(0), cloud);
        applyState(merged);
        await pushState(merged);
        localSet(LAST_PULL_KEY, Date.now());
        lastSyncAttempt = Date.now();
        refreshRuntime();
        updateButton('connected', connection.user && connection.user.login);
        renderModal();
        return true;
    }

    function syncNow(options) {
        if (syncPromise) return syncPromise;
        syncPromise = performSync(options).catch(function (error) {
            updateButton('error');
            if (!(options && options.quiet)) throw error;
            console.warn('Gist 自动同步失败', error);
            return false;
        }).finally(function () { syncPromise = null; });
        return syncPromise;
    }

    function schedulePush() {
        if (!localGet(TOKEN_KEY) || !localGet(GIST_ID_KEY)) return;
        clearTimeout(pushTimer);
        pushTimer = setTimeout(function () { syncNow({ quiet: true }); }, 1500);
    }

    function updateButton(state, login) {
        var button = document.getElementById('cloud-sync-button');
        if (!button) return;
        var labels = {
            local: '💾 仅本机',
            pending: '☁️ 待同步',
            syncing: '🔄 同步中',
            connected: '☁️ 已同步',
            error: '⚠️ 同步异常'
        };
        button.dataset.state = state;
        button.textContent = labels[state] || labels.local;
        button.title = login ? 'GitHub: ' + login : 'GitHub Gist 跨设备同步';
    }

    function formatTime(value) {
        var ts = Number(value) || 0;
        return ts ? new Date(ts).toLocaleString('zh-CN') : '尚未同步';
    }

    function renderModal() {
        var body = document.getElementById('cloud-sync-body');
        if (!body) return;
        var connected = !!(localGet(TOKEN_KEY) && localGet(GIST_ID_KEY));
        var gistId = localGet(GIST_ID_KEY);
        if (connected) {
            body.innerHTML =
                '<div class="cloud-sync-status-card"><strong>✅ 已连接私有 GitHub Gist</strong><br>' +
                '上次上传：' + formatTime(localGet(LAST_PUSH_KEY)) + '<br>' +
                '上次下载：' + formatTime(localGet(LAST_PULL_KEY)) + '</div>' +
                '<p>练习进度、错题、角色、装备、卡牌、章节和题目权重会在本机保存，并自动同步到你的私有 Gist。</p>' +
                '<div class="cloud-sync-actions">' +
                '<button class="cloud-sync-action" id="cloud-sync-now">立即双向同步</button>' +
                '<button class="cloud-sync-action secondary" id="cloud-sync-inspect">云端自检</button>' +
                '<button class="cloud-sync-action danger" id="cloud-sync-disconnect">断开同步</button>' +
                '<button class="cloud-sync-action secondary" id="cloud-sync-open-gist">查看 Gist</button>' +
                '</div><p class="cloud-sync-note">Token 只保存在当前浏览器，不会写入源码或 Cloudflare。切换设备时，粘贴同一个 Token 即可。</p>';
            document.getElementById('cloud-sync-now').onclick = handleManualSync;
            document.getElementById('cloud-sync-inspect').onclick = handleInspect;
            document.getElementById('cloud-sync-disconnect').onclick = handleDisconnect;
            document.getElementById('cloud-sync-open-gist').onclick = function () {
                window.open('https://gist.github.com/' + gistId, '_blank', 'noopener');
            };
        } else {
            body.innerHTML =
                '<p>使用与旧项目相同的 GitHub Token 方案：数据存在你自己的私有 Gist，不经过项目服务器。</p>' +
                '<ol><li>打开 GitHub Token 页面，创建 <strong>Tokens (classic)</strong></li>' +
                '<li>只勾选 <strong>gist</strong> 权限并生成 Token</li>' +
                '<li>在每台设备粘贴同一个 Token</li></ol>' +
                '<p><a href="https://github.com/settings/tokens/new?scopes=gist&description=math-speed-trainer" target="_blank" rel="noopener">打开 GitHub Token 生成页</a></p>' +
                '<input class="cloud-sync-token" id="cloud-sync-token" type="password" autocomplete="off" placeholder="粘贴 ghp_ 开头的 GitHub PAT">' +
                '<div class="cloud-sync-actions"><button class="cloud-sync-action" id="cloud-sync-connect">连接并同步</button></div>' +
                '<p class="cloud-sync-note">首次连接会保留本机数据；已有云端数据时按每项最后更新时间双向合并。</p>';
            document.getElementById('cloud-sync-connect').onclick = handleConnect;
        }
    }

    async function handleConnect() {
        var input = document.getElementById('cloud-sync-token');
        var token = input && input.value.trim();
        if (!token || token.length < 30) {
            alert('请粘贴完整的 GitHub Token。');
            return;
        }
        localSet(TOKEN_KEY, token);
        var button = document.getElementById('cloud-sync-connect');
        if (button) button.disabled = true;
        try {
            await syncNow();
            alert('云同步已连接。其他设备粘贴同一个 Token 即可同步。');
            closeModal();
        } catch (error) {
            localRemove(TOKEN_KEY);
            localRemove(GIST_ID_KEY);
            alert('连接失败：' + error.message + '\n\n请确认 Token 完整且勾选了 gist 权限。');
            renderModal();
        }
    }

    async function handleManualSync() {
        try {
            await syncNow();
            alert('双向同步完成。');
        } catch (error) { alert('同步失败：' + error.message); }
    }

    async function handleInspect() {
        var button = document.getElementById('cloud-sync-inspect');
        if (button) button.disabled = true;
        try {
            var connection = await connect();
            var state = await stateFromGist(connection.gist);
            var keys = Object.keys(state.items).filter(function (key) { return !state.items[key].deleted; });
            var users = state.items.mathSpeedTrainer_users;
            var userCount = 0;
            if (users && users.value) {
                try { userCount = JSON.parse(users.value).length; } catch (e) {}
            }
            alert('云端自检通过。\n同步数据项：' + keys.length + '\n用户档案：' + userCount + '\nGist：' + connection.gist.id.slice(0, 12) + '…');
        } catch (error) { alert('自检失败：' + error.message); }
        finally { if (button) button.disabled = false; }
    }

    function handleDisconnect() {
        if (!confirm('确定断开云同步吗？本机进度会保留。')) return;
        localRemove(TOKEN_KEY);
        localRemove(GIST_ID_KEY);
        localRemove(LAST_PUSH_KEY);
        localRemove(LAST_PULL_KEY);
        updateButton('local');
        renderModal();
    }

    function openModal() {
        renderModal();
        document.getElementById('cloud-sync-modal').classList.remove('hidden');
    }

    function closeModal() {
        document.getElementById('cloud-sync-modal').classList.add('hidden');
    }

    function initUi() {
        var button = document.getElementById('cloud-sync-button');
        var modal = document.getElementById('cloud-sync-modal');
        var close = document.getElementById('cloud-sync-close');
        if (button) button.addEventListener('click', openModal);
        if (close) close.addEventListener('click', closeModal);
        if (modal) modal.addEventListener('click', function (event) { if (event.target === modal) closeModal(); });
        updateButton(localGet(TOKEN_KEY) ? 'syncing' : 'local');
    }

    async function startup() {
        initUi();
        if (!localGet(TOKEN_KEY)) return false;
        try { return await syncNow({ quiet: true }); }
        catch (e) { return false; }
    }

    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState !== 'visible' || !localGet(TOKEN_KEY)) return;
        if (Date.now() - lastSyncAttempt >= AUTO_SYNC_INTERVAL) syncNow({ quiet: true });
    });
    window.addEventListener('online', function () { if (localGet(TOKEN_KEY)) syncNow({ quiet: true }); });

    window.GistSync = {
        startup: startup,
        syncNow: syncNow,
        openSettings: openModal,
        snapshot: snapshotLocal,
        isSyncKey: isSyncKey
    };
})();
