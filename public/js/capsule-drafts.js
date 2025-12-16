(() => {
    const STORAGE_KEY = "go-toolkit-capsule-drafts";
    const STORE = window.goToolkitDocStore?.createStore("capsule-drafts");
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
            console.warn("Migration des capsules locales échouée", err);
        }
        return null;
    }

    function normalizeRecord(value) {
        if (!value || typeof value !== "object") {
            return null;
        }
        const id = (value.id || value.uuid || "").toString().trim();
        if (!id) {
            return null;
        }
        const app = (value.app || "").toString().trim();
        if (!app) {
            return null;
        }
        return {
            id,
            app,
            payload: value.payload,
            title: typeof value.title === "string" ? value.title : "",
            description: typeof value.description === "string" ? value.description : "",
            updatedAt: value.updatedAt || new Date().toISOString(),
            pinned: Boolean(value.pinned)
        };
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
                console.warn("Impossible de lire les capsules locales", err);
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
            console.warn("Impossible de sauvegarder les capsules locales", err);
        }
    }

    async function getAllRecords() {
        const records = await readRecords();
        return Object.values(records)
            .map(normalizeRecord)
            .filter(Boolean);
    }

    async function getRecord(id) {
        if (!id) {
            return null;
        }
        const records = await readRecords();
        return normalizeRecord(records[id]);
    }

    async function upsertRecord(record) {
        const normalized = normalizeRecord(record);
        if (!normalized) {
            return null;
        }
        const stored = await readRecords();
        const existing = normalizeRecord(stored[normalized.id]);
        const next = {
            id: normalized.id,
            app: normalized.app,
            payload: normalized.payload,
            title: normalized.title || (existing && existing.title) || "",
            description: normalized.description || (existing && existing.description) || "",
            updatedAt: normalized.updatedAt || new Date().toISOString(),
            pinned:
                typeof record.pinned === "boolean"
                    ? record.pinned
                    : (existing && existing.pinned) || false
        };
        stored[next.id] = next;
        await writeRecords(stored);
        return next;
    }

    async function removeRecord(id) {
        if (!id) {
            return false;
        }
        const records = await readRecords();
        if (!Object.prototype.hasOwnProperty.call(records, id)) {
            return false;
        }
        delete records[id];
        await writeRecords(records);
        return true;
    }

    async function setPinned(id, pinned) {
        const record = await getRecord(id);
        if (!record) {
            return null;
        }
        return upsertRecord({
            ...record,
            pinned: Boolean(pinned),
            updatedAt: new Date().toISOString()
        });
    }

    function generateId() {
        if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
            return crypto.randomUUID();
        }
        const bytes = new Uint8Array(16);
        if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
            crypto.getRandomValues(bytes);
        } else {
            for (let i = 0; i < bytes.length; i += 1) {
                bytes[i] = Math.floor(Math.random() * 256);
            }
        }
        return Array.from(bytes)
            .map(byte => byte.toString(16).padStart(2, "0"))
            .join("");
    }

    window.goToolkitCapsuleDrafts = window.goToolkitCapsuleDrafts || {
        STORAGE_KEY,
        getAllRecords,
        getRecord,
        upsertRecord,
        removeRecord,
        setPinned,
        generateId
    };
})();
