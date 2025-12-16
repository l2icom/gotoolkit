(() => {
    const STORAGE_KEY = "go-toolkit-capsule-drafts";

    function readRecords() {
        if (typeof window === "undefined" || !window.localStorage) {
            return {};
        }
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return {};
            const parsed = JSON.parse(raw);
            return parsed && typeof parsed === "object" ? parsed : {};
        } catch (err) {
            console.warn("Impossible de lire les capsules locales", err);
            return {};
        }
    }

    function writeRecords(records) {
        if (typeof window === "undefined" || !window.localStorage) {
            return;
        }
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records || {}));
        } catch (err) {
            console.warn("Impossible de sauvegarder les capsules locales", err);
        }
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

    function getAllRecords() {
        const records = readRecords();
        return Object.values(records)
            .map(normalizeRecord)
            .filter(Boolean);
    }

    function getRecord(id) {
        if (!id) {
            return null;
        }
        const records = readRecords();
        return normalizeRecord(records[id]);
    }

    function upsertRecord(record) {
        const normalized = normalizeRecord(record);
        if (!normalized) {
            return null;
        }
        const stored = readRecords();
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
        writeRecords(stored);
        return next;
    }

    function removeRecord(id) {
        if (!id) {
            return false;
        }
        const records = readRecords();
        if (!Object.prototype.hasOwnProperty.call(records, id)) {
            return false;
        }
        delete records[id];
        writeRecords(records);
        return true;
    }

    function setPinned(id, pinned) {
        const record = getRecord(id);
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
