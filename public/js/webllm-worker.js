// Web worker for WebLLM; keeps heavy compute off the main thread.
import { WebWorkerMLCEngineHandler } from "https://esm.sh/@mlc-ai/web-llm";

// Browser-only shims to avoid Node paths inside the bundle.
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

const handler = new WebWorkerMLCEngineHandler();
self.onmessage = msg => handler.onmessage(msg);
