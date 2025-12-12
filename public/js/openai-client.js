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
        const normalized = {
            model: model || payload?.model || ""
        };
        const messages = Array.isArray(payload?.messages) && payload.messages.length ? payload.messages : null;
        if (messages) {
            normalized.messages = messages;
        } else if (payload?.prompt) {
            normalized.messages = [{ role: "user", content: payload.prompt }];
        } else if (payload?.input) {
            normalized.messages = Array.isArray(payload.input)
                ? payload.input.map(item => ({
                      role: item?.role || "user",
                      content: stringifyContent(item?.content || item)
                  }))
                : [{ role: "user", content: stringifyContent(payload.input) }];
        }
        const copyFields = ["temperature", "max_tokens", "top_p", "stop", "n", "presence_penalty", "frequency_penalty"];
        for (const key of copyFields) {
            if (typeof payload?.[key] !== "undefined") {
                normalized[key] = payload[key];
            }
        }
        normalized.stream = false;
        return normalized;
    }

    async function callOllama(backend, payload, signal) {
        const requestBody = buildOllamaPayload(payload, backend.model);
        const response = await fetch(backend.endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody),
            signal
        });
        if (!response.ok) {
            const body = await response.text().catch(() => "");
            throw new Error(body || "Ollama indisponible");
        }
        const data = await response.json();
        const primary = data?.message?.content || data?.message || data?.output || data;
        const normalized = extractFromOutput(primary);
        return typeof normalized === "string" ? normalized.trim() : "";
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
        return executeWithBackend(backend, payload, stopCondition, signal, endpointType);
    }

    global.GoToolkitOpenAI = {
        supportsStreaming: () => hasStreamingSupport,
        chatCompletion
    };

    global.GoToolkitIA = {
        chatCompletion: autoChatCompletion
    };
})(window);
