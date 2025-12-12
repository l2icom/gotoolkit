;(function (global) {
    var STORAGE_KEYS = {
        API_KEY: "go-toolkit-api-key",
        OPENAI_MODEL: "go-toolkit-openai-model",
        OLLAMA_MODEL: "go-toolkit-ollama-model",
        OLLAMA_URL: "go-toolkit-ollama-url"
    };

    var DEFAULTS = {
        OPENAI_MODEL: "gpt-5-nano",
        OLLAMA_MODEL: "genma3",
        OLLAMA_URL: "http://localhost:11434"
    };

    var OPENAI_MODELS = ["gpt-5-nano", "gpt-5-mini"];
    var OLLAMA_MODELS = ["gpt-oss:latest", "genma3", "ministral-3:latest", "deepseek-r1"];

    var OPENAI_ENDPOINTS = {
        responses: "https://api.openai.com/v1/responses",
        chat: "https://api.openai.com/v1/chat/completions"
    };

    var PROXY_ENDPOINTS = {
        responses: "https://openai.gotoolkit.workers.dev/v1/responses",
        chat: "https://openai.gotoolkit.workers.dev/v1/chat/completions"
    };

    var OLLAMA_GENERATE_PATH = "/api/generate";
    var OLLAMA_CHAT_PATH = "/api/chat";
    var OLLAMA_PING_PATH = "/api/models";

    function safeStorageRead(key) {
        if (!global || !global.localStorage) {
            return "";
        }
        try {
            return global.localStorage.getItem(key) || "";
        } catch (err) {
            console.warn("GoToolkit IA config read failed", err);
            return "";
        }
    }

    function safeStorageWrite(key, value) {
        if (!global || !global.localStorage) {
            return;
        }
        try {
            if (value) {
                global.localStorage.setItem(key, value);
            } else {
                global.localStorage.removeItem(key);
            }
        } catch (err) {
            console.warn("GoToolkit IA config write failed", err);
        }
    }

    function normalizeUrl(value) {
        var trimmed = (value || "").trim();
        if (!trimmed) {
            return "";
        }
        if (!/^https?:\/\//i.test(trimmed)) {
            trimmed = "http://" + trimmed;
        }
        return trimmed.replace(/\/+$/, "");
    }

    var GoToolkitIAConfig = {
        OPENAI_MODELS: OPENAI_MODELS,
        OLLAMA_MODELS: OLLAMA_MODELS,
        getApiKey: function () {
            return (safeStorageRead(STORAGE_KEYS.API_KEY) || "").trim();
        },
        setApiKey: function (value) {
            safeStorageWrite(STORAGE_KEYS.API_KEY, (value || "").trim());
        },
        getOpenAiModel: function () {
            var model = safeStorageRead(STORAGE_KEYS.OPENAI_MODEL);
            return model || DEFAULTS.OPENAI_MODEL;
        },
        setOpenAiModel: function (value) {
            var normalized = (value || "").trim();
            if (!normalized) {
                normalized = DEFAULTS.OPENAI_MODEL;
            }
            safeStorageWrite(STORAGE_KEYS.OPENAI_MODEL, normalized);
        },
        getOllamaModel: function () {
            var model = safeStorageRead(STORAGE_KEYS.OLLAMA_MODEL);
            return model || DEFAULTS.OLLAMA_MODEL;
        },
        setOllamaModel: function (value) {
            var normalized = (value || "").trim();
            if (!normalized) {
                normalized = DEFAULTS.OLLAMA_MODEL;
            }
            safeStorageWrite(STORAGE_KEYS.OLLAMA_MODEL, normalized);
        },
        getOllamaUrl: function () {
            var stored = safeStorageRead(STORAGE_KEYS.OLLAMA_URL);
            var normalized = normalizeUrl(stored);
            return normalized || DEFAULTS.OLLAMA_URL;
        },
        setOllamaUrl: function (value) {
            var normalized = normalizeUrl(value);
            if (!normalized) {
                normalized = DEFAULTS.OLLAMA_URL;
            }
            safeStorageWrite(STORAGE_KEYS.OLLAMA_URL, normalized);
        },
        normalizeOllamaUrl: normalizeUrl,
        DEFAULTS: DEFAULTS,
        OPENAI_ENDPOINTS: OPENAI_ENDPOINTS,
        PROXY_ENDPOINTS: PROXY_ENDPOINTS
    };

    var GoToolkitAIBackend = (function () {
        var ongoingProbe = null;
        var lastProbeUrl = "";
        var lastProbeResult = false;

        function probeOllama(url) {
            if (!url) {
                return Promise.resolve(false);
            }
            if (ongoingProbe && ongoingProbe.url === url) {
                return ongoingProbe.promise;
            }
            var controller = new AbortController();
            var promise = (async function () {
                var timeoutId = setTimeout(function () {
                    controller.abort();
                }, 1800);
                try {
                    var response = await fetch(url + OLLAMA_PING_PATH, {
                        method: "GET",
                        signal: controller.signal,
                        cache: "no-cache"
                    });
                    var ok = response.ok;
                    console.info(`[GoToolkitIA] Ollama ping ${url + OLLAMA_PING_PATH} -> ${response.status}`);
                    lastProbeResult = ok;
                    lastProbeUrl = url;
                    return ok;
                } catch (err) {
                    lastProbeResult = false;
                    lastProbeUrl = url;
                    return false;
                } finally {
                    clearTimeout(timeoutId);
                    ongoingProbe = null;
                }
            })();
            ongoingProbe = { url: url, promise: promise };
            return promise;
        }

        function resolveOllamaPath(reqType) {
            return reqType === "generate" ? OLLAMA_GENERATE_PATH : OLLAMA_CHAT_PATH;
        }

        async function getBackend(endpointType, options) {
            var type = endpointType === "chat" ? "chat" : "responses";
            options = options || {};
            if (options.forceProxy) {
                return {
                    type: "proxy",
                    endpoint: PROXY_ENDPOINTS[type],
                    apiKey: "",
                    model: GoToolkitIAConfig.getOpenAiModel()
                };
            }
            var apiKey = GoToolkitIAConfig.getApiKey();
            if (apiKey) {
                return {
                    type: "openai",
                    endpoint: OPENAI_ENDPOINTS[type],
                    apiKey: apiKey,
                    model: GoToolkitIAConfig.getOpenAiModel()
                };
            }
            var ollamaUrl = GoToolkitIAConfig.getOllamaUrl();
            var available = await probeOllama(ollamaUrl);
            if (available) {
                return {
                    type: "ollama",
                    endpoint: ollamaUrl + resolveOllamaPath(type),
                    apiKey: "",
                    model: GoToolkitIAConfig.getOllamaModel()
                };
            }
            return {
                type: "proxy",
                endpoint: PROXY_ENDPOINTS[type],
                apiKey: "",
                model: GoToolkitIAConfig.getOpenAiModel()
            };
        }

        return {
            getBackend: getBackend,
            isOllamaAvailable: function () {
                return lastProbeResult;
            },
            getLastProbeInfo: function () {
                return { url: lastProbeUrl, available: lastProbeResult };
            }
        };
    })();

    global.GoToolkitIAConfig = global.GoToolkitIAConfig || GoToolkitIAConfig;
    global.GoToolkitAIBackend = global.GoToolkitAIBackend || GoToolkitAIBackend;
})(window);
