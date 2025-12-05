(function () {
    const STORAGE_KEY = "go-toolkit-share-records";

    function readRecords() {
        if (typeof localStorage === "undefined") {
            return {};
        }
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return {};
            }
            const parsed = JSON.parse(raw);
            return parsed && typeof parsed === "object" ? parsed : {};
        } catch (err) {
            console.warn("Impossible de lire l'historique des partages", err);
            return {};
        }
    }

    function writeRecords(records) {
        if (typeof localStorage === "undefined") {
            return;
        }
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records || {}));
        } catch (err) {
            console.warn("Impossible de sauvegarder l'historique des partages", err);
        }
    }

    function getRecords() {
        return readRecords();
    }

    function upsertRecord(app, record) {
        if (!app || !record || !record.token) {
            return;
        }
        const normalizedApp = String(app).trim();
        if (!normalizedApp) {
            return;
        }
        const token = String(record.token).trim();
        if (!token) {
            return;
        }
        const records = readRecords();
        const next = Object.assign({}, records[normalizedApp] || {}, record, {
            token,
            updatedAt: record.updatedAt || new Date().toISOString()
        });
        records[normalizedApp] = next;
        writeRecords(records);
        return next;
    }

    function removeRecord(app) {
        const records = readRecords();
        if (records && Object.prototype.hasOwnProperty.call(records, app)) {
            delete records[app];
            writeRecords(records);
        }
    }

    window.goToolkitShareHistory = window.goToolkitShareHistory || {
        getRecords,
        upsertRecord,
        removeRecord,
        STORAGE_KEY
    };
})();
