; (function (global) {
    const DEFAULT_PROXY_ENDPOINT = "https://openai.gotoolkit.workers.dev/v1/responses";
    const DEFAULT_DIRECT_ENDPOINT = "https://api.openai.com/v1/responses";
    const DEFAULT_MODEL = "gpt-5-nano";
    const SYSTEM_PROMPT =
        "Tu vérifies si un texte couvre des éléments donnés. Réponds uniquement avec un JSON {\"matches\":{\"critère\":true/false}} sans commentaire. Considère un critère rempli si le texte contient l'idée ou un synonyme clair.";
    const CHECKED_MARKER = "🗹";
    const UNCHECKED_MARKER = "☐";

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function normalizeCriterionKey(value) {
        return String(value || "")
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();
    }

    function getTemplateSummary(template) {
        if (!template) return "";
        const candidate =
            (template.description || template.text || "")
                .split(/\n/)[0]
                .trim() || template.name || template.title || template.label || "";
        return candidate.trim();
    }

    function getTemplateCriteria(template) {
        if (!template) return [];
        if (Array.isArray(template.criteria) && template.criteria.length) {
            return template.criteria.filter(Boolean);
        }
        const source = String(template.description || template.text || "");
        const lines = source
            .split(/\n/)
            .map(line => line.trim())
            .filter(Boolean);
        const markerRe = /^[🗹☐☑✓]/;
        return lines
            .filter(line => {
                return markerRe.test(line);
            })
            .map(line => line.replace(/^[🗹☐☑✓]\s*/, "").trim())
            .filter(Boolean);
    }

    function formatTooltipLines(template, statusMap, options = {}) {
        const includeSummary = options.includeSummary !== false;
        const summary = includeSummary ? getTemplateSummary(template) : "";
        const criteria = getTemplateCriteria(template);
        const normalizedStatus = {};
        if (statusMap && typeof statusMap === "object") {
            Object.keys(statusMap).forEach(key => {
                normalizedStatus[normalizeCriterionKey(key)] = Boolean(statusMap[key]);
            });
        }
        const lines = [];
        if (summary) {
            lines.push(escapeHtml(summary));
        }
        if (criteria.length) {
            criteria.forEach(item => {
                const key = normalizeCriterionKey(item);
                const matched = normalizedStatus[key] || false;
                const marker = matched ? options.checkedMarker || CHECKED_MARKER : options.uncheckedMarker || UNCHECKED_MARKER;
                lines.push(`${marker} ${escapeHtml(item)}`);
            });
        } else if (!summary && template) {
            const fallback = template.text || template.description || "";
            if (fallback) {
                lines.push(escapeHtml(fallback));
            }
        }
        return lines;
    }

    function countCompletedSentences(text) {
        if (!text) return 0;
        const matches = text.match(/[^.!?]+[.!?]+/g);
        return matches ? matches.length : 0;
    }

    function fallbackStatus(text, criteria) {
        const normalized = {};
        const lower = (text || "").toLowerCase();
        criteria.forEach(item => {
            const key = normalizeCriterionKey(item);
            const token = (item || "").replace(/[^\w]+/g, " ").trim().split(/\s+/)[0] || key;
            normalized[key] =
                (item && lower.includes(item.toLowerCase())) ||
                (token && lower.includes(token.toLowerCase()));
        });
        return normalized;
    }

    function normalizeMatches(criteria, matches) {
        const normalized = {};
        if (!matches || typeof matches !== "object") {
            return normalized;
        }
        criteria.forEach(item => {
            const key = normalizeCriterionKey(item);
            const candidates = [
                matches[item],
                matches[key],
                matches[item.replace(/\s+/g, "_")],
                matches[item.replace(/\s+/g, "_").toLowerCase()],
                matches[item.replace(/\s+/g, "").toLowerCase()]
            ];
            const val = candidates.find(v => typeof v !== "undefined");
            normalized[key] = val === true || val === "true" || val === 1;
        });
        return normalized;
    }

    function parseMatchesFromResponse(rawText) {
        if (!rawText) return {};
        let payload;
        try {
            const outer = JSON.parse(rawText);
            payload =
                outer?.choices?.[0]?.message?.content ||
                outer?.output ||
                outer?.result ||
                rawText;
        } catch (err) {
            payload = rawText;
        }
        if (typeof payload === "string") {
            try {
                const parsed = JSON.parse(payload);
                return parsed?.matches || parsed?.result || {};
            } catch (err) {
                return {};
            }
        }
        if (payload && typeof payload === "object") {
            return payload?.matches || payload?.result || {};
        }
        return {};
    }

    async function analyzeCriteria(options = {}) {
        const {
            text = "",
            template = null,
            signal,
            model: userModel,
            systemPrompt = SYSTEM_PROMPT,
            userPrompt
        } = options;
        const model =
            userModel ||
            (global.GoToolkitIAConfig && typeof global.GoToolkitIAConfig.getOpenAiModel === "function"
                ? global.GoToolkitIAConfig.getOpenAiModel()
                : DEFAULT_MODEL);
        if (!template || !template.id) {
            return {};
        }
        const criteria = getTemplateCriteria(template);
        if (!criteria.length) {
            return {};
        }
        const trimmedText = (text || "").trim();
        if (!trimmedText) {
            return {};
        }
        if (!global.GoToolkitIA || typeof global.GoToolkitIA.chatCompletion !== "function") {
            return fallbackStatus(trimmedText, criteria);
        }
        const payload = {
            model,
            messages: [
                { role: "system", content: systemPrompt },
                {
                    role: "user",
                    content:
                        userPrompt ||
                        `Texte à vérifier : """${trimmedText}"""` +
                        `\nCritères attendus (${criteria.length}) : ${criteria.join(", ")}` +
                        `\nRéponds STRICTEMENT au format {"matches":{"Critère":true/false}} avec les mêmes libellés.`
                }
            ],
            temperature: 1,
            response_format: { type: "json_object" }
        };
        try {
            const responseText = await global.GoToolkitIA.chatCompletion({
                payload,
                signal
            });
            const matches = parseMatchesFromResponse(responseText);
            return normalizeMatches(criteria, matches);
        } catch (err) {
            if (err?.name === "AbortError") {
                throw err;
            }
            console.warn("Analyse des critères OpenAI impossible", err);
            return fallbackStatus(trimmedText, criteria);
        }
    }

    global.GoToolkitTemplateCriteria = {
        getTemplateCriteria,
        getTemplateSummary,
        renderTooltipLines: formatTooltipLines,
        countCompletedSentences,
        analyzeCriteria,
        DEFAULT_PROXY_ENDPOINT,
        DEFAULT_DIRECT_ENDPOINT
    };
})(window);
