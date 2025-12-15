(function (global) {
    const hasStreamingSupport =
        typeof ReadableStream !== "undefined" && typeof TextDecoder !== "undefined";

    function stringifyContent(content) {
        if (typeof content === "string") {
            return content;
        }
        if (Array.isArray(content)) {
            return content
                .map(part => {
                    if (typeof part === "string") {
                        return part;
                    }
                    if (typeof part?.text === "string") {
                        return part.text;
                    }
                    if (typeof part?.content === "string") {
                        return part.content;
                    }
                    if (typeof part?.delta === "string") {
                        return part.delta;
                    }
                    return "";
                })
                .join("");
        }
        if (typeof content?.text === "string") {
            return content.text;
        }
        if (typeof content?.delta === "string") {
            return content.delta;
        }
        return "";
    }

    function extractFromOutput(output) {
        if (!output) {
            return "";
        }
        if (typeof output === "string") {
            return output;
        }
        if (Array.isArray(output)) {
            return output.map(extractFromOutput).join("");
        }
        if (output.content) {
            return stringifyContent(output.content);
        }
        if (output.message?.content) {
            return stringifyContent(output.message.content);
        }
        return stringifyContent(output);
    }

    function normalizeChunk(payload) {
        if (!payload) {
            return "";
        }

        if (payload?.error?.message) {
            throw new Error(payload.error.message);
        }

        if (typeof payload.delta === "string") {
            return payload.delta;
        }

        if (typeof payload.output_text === "string") {
            return payload.output_text;
        }

        if (Array.isArray(payload.output_text)) {
            return payload.output_text.map(extractFromOutput).join("");
        }

        if (payload.output_text && typeof payload.output_text === "object") {
            return extractFromOutput(payload.output_text);
        }

        if (Array.isArray(payload.output)) {
            return extractFromOutput(payload.output);
        }

        if (typeof payload.content === "string") {
            return payload.content;
        }

        const choice = payload?.choices && payload.choices[0];
        if (choice) {
            const delta = choice.delta || {};
            const content = delta.content ?? choice.text ?? choice.message?.content;
            return stringifyContent(content);
        }

        return "";
    }

    async function parseJsonResponse(response) {
        const payload = await response.json();
        const normalized = normalizeChunk(payload);
        if (normalized && typeof normalized === "string") {
            return normalized.trim();
        }
        if (typeof payload === "string") {
            return payload.trim();
        }
        return "";
    }

    function buildHeaders(apiKey, headers) {
        const nextHeaders = {
            "Content-Type": "application/json",
            ...headers
        };
        if (apiKey) {
            nextHeaders.Authorization = `Bearer ${apiKey}`;
        }
        return nextHeaders;
    }

    async function consumeStream(response, stopCondition) {
        const reader = response.body?.getReader?.();
        if (!reader) {
            return parseJsonResponse(response);
        }
        const decoder = new TextDecoder();
        let buffer = "";
        let aggregated = "";

        const releaseReader = () => {
            try {
                reader.releaseLock();
            } catch (error) {
                // ignore
            }
        };

        const cancelStream = async () => {
            try {
                await reader.cancel();
            } catch (error) {
                // ignore
            }
        };

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                releaseReader();
                return aggregated.trim();
            }
            buffer += decoder.decode(value, { stream: true });
            const events = buffer.split("\n\n");
            buffer = events.pop() || "";
            for (const event of events) {
                const dataLine = event
                    .split("\n")
                    .filter(line => line.startsWith("data:"))
                    .map(line => line.replace(/^data:\s*/, ""))
                    .join("")
                    .trim();
                if (!dataLine) {
                    continue;
                }
                if (dataLine === "[DONE]") {
                    await cancelStream();
                    releaseReader();
                    return aggregated.trim();
                }
                try {
                    const payload = JSON.parse(dataLine);
                    const chunk = normalizeChunk(payload);
                    if (chunk) {
                        aggregated += chunk;
                        if (typeof stopCondition === "function" && stopCondition(aggregated)) {
                            await cancelStream();
                            releaseReader();
                            return aggregated.trim();
                        }
                    }
                    if (payload?.type === "response.error") {
                        await cancelStream();
                        releaseReader();
                        throw new Error(payload?.error?.message || "OpenAI response error");
                    }
                    if (
                        payload?.type === "response.completed" ||
                        payload?.type === "response.output_text.done"
                    ) {
                        await cancelStream();
                        releaseReader();
                        if (!aggregated && chunk) {
                            return String(chunk).trim();
                        }
                        return aggregated.trim();
                    }
                } catch (error) {
                    console.warn("OpenAI stream chunk parse failed", error);
                }
            }
        }
    }

    function toResponsesPayload(payload) {
        const next = { ...payload };

        if (Array.isArray(next.messages) && !next.input) {
            next.input = next.messages.map(message => ({
                role: message.role || "user",
                content: Array.isArray(message.content)
                    ? message.content.map(part => {
                        if (typeof part === "string") {
                            return { type: "input_text", text: part };
                        }
                        if (part && typeof part === "object") {
                            if (part.type && part.type.startsWith("input_")) {
                                return part;
                            }
                            if (typeof part.text === "string") {
                                return { type: "input_text", text: part.text };
                            }
                        }
                        return { type: "input_text", text: String(part ?? "") };
                    })
                    : [{ type: "input_text", text: String(message.content ?? "") }]
            }));
        }

        if (!next.reasoning && typeof next.reasoning_effort === "string") {
            next.reasoning = { effort: next.reasoning_effort };
        }

        delete next.messages;
        delete next.reasoning_effort;

        return next;
    }

    async function chatCompletion({ endpoint, apiKey, payload, headers = {}, stopCondition, signal }) {
        if (!endpoint) {
            throw new Error("Endpoint manquant");
        }
        if (!payload || typeof payload !== "object") {
            throw new Error("Payload OpenAI invalide");
        }
        const requestPayload = toResponsesPayload(payload);
        const wantsStream = hasStreamingSupport && requestPayload.stream === true;
        if (!wantsStream) {
            delete requestPayload.stream;
        }
        const response = await fetch(endpoint, {
            method: "POST",
            headers: buildHeaders(apiKey, headers),
            body: JSON.stringify(requestPayload),
            signal
        });

        if (!response.ok) {
            const errBody = await response.text();
            throw new Error(errBody || "API non disponible");
        }

        const contentType = response.headers.get("content-type") || "";
        const isStream = wantsStream && !!response.body && contentType.includes("text/event-stream");

        if (isStream) {
            return consumeStream(response, stopCondition);
        }

        return parseJsonResponse(response);
    }

    function buildOllamaPayload(payload, model) {
        // Ollama expects a simple payload: { model, prompt, stream }
        const next = {};
        next.model = model || payload?.model || "";
        // Build a single prompt string from messages / input / prompt
        if (Array.isArray(payload?.messages) && payload.messages.length) {
            // concatenate message contents
            next.prompt = payload.messages
                .map(m => (typeof m.content === "string" ? m.content : stringifyContent(m.content || m)))
                .filter(Boolean)
                .join("\n\n");
        } else if (typeof payload?.prompt === "string") {
            next.prompt = payload.prompt;
        } else if (payload?.input) {
            if (Array.isArray(payload.input)) {
                next.prompt = payload.input.map(item => stringifyContent(item?.content || item)).join("\n\n");
            } else {
                next.prompt = stringifyContent(payload.input);
            }
        } else {
            next.prompt = "";
        }
        // Request streaming from Ollama as recommended (stream: true).
        next.stream = true;
        return next;
    }

    function buildOllamaHeaders(apiKey) {
        const headers = {
            "Content-Type": "application/json"
        };
        if (apiKey) {
            headers.Authorization = `Bearer ${apiKey}`;
            headers["Ollama-Api-Key"] = apiKey;
            headers["X-Ollama-Api-Key"] = apiKey;
        }
        return headers;
    }

    async function callOllama(backend, payload, signal) {
        const requestBody = buildOllamaPayload(payload, backend.model);
        if (globalThis?.console) {
            console.info("[Ollama] payload", requestBody);
        }
        try {
            const response = await fetch(backend.endpoint, {
                method: "POST",
                headers: buildOllamaHeaders(backend.apiKey),
                body: JSON.stringify(requestBody),
                signal
            });
            if (!response.ok) {
                const body = await response.text().catch(() => "");
                console.error("[Ollama] non-ok response", {
                    endpoint: backend.endpoint,
                    status: response.status,
                    body: body
                });
                throw new Error(body || "Ollama indisponible");
            }
            const contentType = response.headers.get("content-type") || "";
            const wantsStream = requestBody.stream === true;
            const isStream = wantsStream && !!response.body && contentType.includes("text/event-stream");
            if (isStream) {
                const aggregated = (await consumeStream(response, undefined));
                if (globalThis?.console) {
                    console.info("[Ollama] response", aggregated);
                }
                return aggregated?.trim ? aggregated.trim() : aggregated;
            }
            const data = await response.json().catch(err => {
                console.error("[Ollama] invalid JSON response", { endpoint: backend.endpoint, err });
                throw err;
            });
            if (globalThis?.console) {
                var responseField = data && typeof data.response !== "undefined" ? data.response : (data?.message?.content || data?.message || data?.output || data);
                console.info("[Ollama] response", responseField);
            }
            const primary = typeof data?.response !== "undefined" ? data.response : (data?.message?.content || data?.message || data?.output || data);
            const normalized = extractFromOutput(primary);
            return typeof normalized === "string" ? normalized.trim() : "";
        } catch (err) {
            try {
                console.error("[Ollama] request failed", { endpoint: backend.endpoint, model: backend.model, error: err });
            } catch (logErr) {
                console.error("[Ollama] request failed (logging error)", err);
            }
            throw err;
        }
    }

    async function executeWithBackend(backend, payload, stopCondition, signal, endpointType) {
        const initial = { ...(payload || {}) };
        if (!initial.model && backend?.model) {
            initial.model = backend.model;
        }
        if (backend?.type === "ollama") {
            return callOllama(backend, initial, signal);
        }
        try {
            return await chatCompletion({
                endpoint: backend.endpoint,
                apiKey: backend.apiKey,
                payload: initial,
                stopCondition,
                signal
            });
        } catch (err) {
            if (err?.name === "AbortError") {
                throw err;
            }
            if (backend?.type === "openai" && global.GoToolkitAIBackend) {
                const fallback = await global.GoToolkitAIBackend.getBackend(endpointType, { forceProxy: true });
                const fallbackPayload = { ...initial };
                if (!fallbackPayload.model && fallback.model) {
                    fallbackPayload.model = fallback.model;
                }
                return chatCompletion({
                    endpoint: fallback.endpoint,
                    apiKey: fallback.apiKey,
                    payload: fallbackPayload,
                    stopCondition,
                    signal
                });
            }
            throw err;
        }
    }

    async function autoChatCompletion({ payload, stopCondition, signal, endpointType = "responses" } = {}) {
        const backendProvider = global.GoToolkitAIBackend;
        if (!backendProvider || typeof backendProvider.getBackend !== "function") {
            const fallbackEndpoint =
                global.GoToolkitIAConfig?.PROXY_ENDPOINTS?.responses || "https://openai.gotoolkit.workers.dev/v1/responses";
            return chatCompletion({
                endpoint: fallbackEndpoint,
                apiKey: "",
                payload: payload || {},
                stopCondition,
                signal
            });
        }
        const backend = await backendProvider.getBackend(endpointType);
        // if user explicitly selected Ollama but it's unavailable, raise an error so callers can show a proper toaster
        if (backend && backend.type === "ollama-unavailable") {
            const err = new Error("OllamaUnavailable");
            err.backendInfo = backend;
            throw err;
        }
        return executeWithBackend(backend, payload, stopCondition, signal, endpointType);
    }

    global.GoToolkitIAClient = {
        supportsStreaming: () => hasStreamingSupport,
        chatCompletion
    };

    // Backwards compatibility alias
    global.GoToolkitOpenAI = global.GoToolkitIAClient;

    global.GoToolkitIA = {
        chatCompletion: autoChatCompletion
    };
})(window);
