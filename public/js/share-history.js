(function () {
    const STORAGE_KEY = "go-toolkit-share-records";
    const STORE = window.goToolkitDocStore?.createStore("share-history");
    const MEMORY_STORE = {};
    let cachedRecords = null;
    let loadPromise = null;

    async function migrateFromLocalStorage() {
        if (!STORE || typeof localStorage === "undefined") return null;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === "object") {
                await STORE.set("records", parsed);
                localStorage.removeItem(STORAGE_KEY);
                return parsed;
            }
        } catch (err) {
            console.warn("Migration de l'historique de partage échouée", err);
        }
        return null;
    }

    async function readRecords() {
        if (cachedRecords) return cachedRecords;
        if (loadPromise) return loadPromise;
        loadPromise = (async () => {
            try {
                if (STORE) {
                    const migrated = await migrateFromLocalStorage();
                    const stored = migrated || await STORE.get("records");
                    if (stored && typeof stored === "object") {
                        cachedRecords = stored;
                        return stored;
                    }
                }
                const raw = MEMORY_STORE.records;
                cachedRecords = raw && typeof raw === "object" ? raw : {};
                return cachedRecords;
            } catch (err) {
                console.warn("Impossible de lire l'historique des partages", err);
                cachedRecords = {};
                return cachedRecords;
            }
        })().finally(() => { loadPromise = null; });
        return loadPromise;
    }

    async function writeRecords(records) {
        cachedRecords = records || {};
        MEMORY_STORE.records = cachedRecords;
        if (!STORE) return;
        try {
            await STORE.set("records", cachedRecords);
        } catch (err) {
            console.warn("Impossible de sauvegarder l'historique des partages", err);
        }
    }

    async function refreshFromStore() {
        cachedRecords = null;
        loadPromise = null;
        return readRecords();
    }

    async function getRecords() {
        const records = await readRecords();
        return records;
    }

    async function upsertRecord(app, record) {
        if (!app || !record || !record.token) {
            return null;
        }
        const normalizedApp = String(app).trim();
        if (!normalizedApp) {
            return null;
        }
        const token = String(record.token).trim();
        if (!token) {
            return null;
        }
        const records = await readRecords();
        const next = Object.assign({}, records[normalizedApp] || {}, record, {
            token,
            updatedAt: record.updatedAt || new Date().toISOString()
        });
        records[normalizedApp] = next;
        await writeRecords(records);
        return next;
    }

    async function removeRecord(app) {
        const records = await readRecords();
        if (records && Object.prototype.hasOwnProperty.call(records, app)) {
            delete records[app];
            await writeRecords(records);
        }
    }

    window.goToolkitShareHistory = window.goToolkitShareHistory || {
        getRecords,
        upsertRecord,
        removeRecord,
        refreshFromStore,
        STORAGE_KEY
    };
})();
