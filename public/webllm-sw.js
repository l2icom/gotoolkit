// Service worker for WebLLM (ES module, registered with { type: "module" }).
import { ServiceWorkerMLCEngineHandler } from "https://esm.sh/@mlc-ai/web-llm";

// Ensure WebLLM stays on the browser path (no Node require).
try {
    self.process = { versions: {}, browser: true };
    self.require = function (moduleName) {
        if (moduleName === "url") {
            return {
                fileURLToPath: function (value) { return value; },
                URL: self.URL || function (u) { return u; }
            };
        }
        if (moduleName === "path") {
            return {
                dirname: function (v) { return v; },
                normalize: function (v) { return v; },
                join: function () { return Array.prototype.join.call(arguments, "/"); },
                resolve: function () { return Array.prototype.join.call(arguments, "/"); },
                basename: function (p) { return p; },
                extname: function () { return ""; },
                sep: "/"
            };
        }
        return {};
    };
    if (typeof self.createRequire !== "function") {
        self.createRequire = function () {
            return function (moduleName) {
                if (moduleName === "url") {
                    return {
                        fileURLToPath: function (value) { return value; },
                        URL: self.URL || function (u) { return u; }
                    };
                }
                if (moduleName === "path") {
                    return {
                        dirname: function (v) { return v; },
                        normalize: function (v) { return v; },
                        join: function () { return Array.prototype.join.call(arguments, "/"); },
                        resolve: function () { return Array.prototype.join.call(arguments, "/"); },
                        basename: function (p) { return p; },
                        extname: function () { return ""; },
                        sep: "/"
                    };
                }
                return {};
            };
        };
    }
} catch (err) {
    // ignore
}

// Instantiate handler on activation.
let handler = null;
self.addEventListener("activate", event => {
    event.waitUntil((async () => {
        try {
            handler = new ServiceWorkerMLCEngineHandler();
            console.log("[WebLLM SW] Activated");
        } catch (err) {
            console.error("[WebLLM SW] Activation failed", err);
        }
    })());
});
