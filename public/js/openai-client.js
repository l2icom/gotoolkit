(function (global) {
    const hasStreamingSupport =
        typeof ReadableStream !== "undefined" && typeof TextDecoder !== "undefined";

    function normalizeChunk(payload) {
        const choice = payload?.choices && payload.choices[0];
        if (!choice) {
            return "";
        }
        const delta = choice.delta || {};
        const content = delta.content;
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
                    return "";
                })
                .join("");
        }
        if (typeof delta.text === "string") {
            return delta.text;
        }
        if (typeof choice.text === "string") {
            return choice.text;
        }
        return "";
    }

    async function parseJsonResponse(response) {
        const payload = await response.json();
        const choice = payload?.choices && payload.choices[0];
        if (!choice) {
            return "";
        }
        if (choice.message?.content) {
            return String(choice.message.content).trim();
        }
        if (typeof choice.text === "string") {
            return choice.text.trim();
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
                    const chunk = normalizeChunk(JSON.parse(dataLine));
                    if (chunk) {
                        aggregated += chunk;
                        if (typeof stopCondition === "function" && stopCondition(aggregated)) {
                            await cancelStream();
                            releaseReader();
                            return aggregated.trim();
                        }
                    }
                } catch (error) {
                    console.warn("OpenAI stream chunk parse failed", error);
                }
            }
        }
    }

    async function chatCompletion({ endpoint, apiKey, payload, headers = {}, stopCondition }) {
        if (!endpoint) {
            throw new Error("Endpoint manquant");
        }
        if (!payload || typeof payload !== "object") {
            throw new Error("Payload OpenAI invalide");
        }
        const requestPayload = { ...payload };
        const wantsStream = hasStreamingSupport && requestPayload.stream === true;
        if (!wantsStream) {
            delete requestPayload.stream;
        }
        const response = await fetch(endpoint, {
            method: "POST",
            headers: buildHeaders(apiKey, headers),
            body: JSON.stringify(requestPayload)
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

    global.GoToolkitOpenAI = {
        supportsStreaming: () => hasStreamingSupport,
        chatCompletion
    };
})(window);
