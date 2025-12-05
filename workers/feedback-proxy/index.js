const API_VERSION = "v1";
const COLLECTION = "feedback";
const FIRESTORE_SCOPE = "https://www.googleapis.com/auth/datastore";
const FIREBASE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const DEFAULT_PROJECT_ID = "gotoolkit";
const textEncoder = new TextEncoder();
let serviceAccountConfig = null;
let signingKeyPromise = null;
let accessTokenCache = { token: null, expiresAt: 0 };

export default {
    async fetch(request, env) {
        try {
            const { pathname } = new URL(request.url);
            if (request.method === "OPTIONS") {
                return handleOptions(request, env);
            }
            if (request.method !== "POST") {
                return jsonResponse({ error: "Méthode non autorisée" }, 405, request, env, {
                    Allow: "POST, OPTIONS"
                });
            }
            if (!pathname.replace(/\/+/g, "/").startsWith(`/${API_VERSION}/feedback`)) {
                return jsonResponse({ error: "Ressource introuvable" }, 404, request, env);
            }

            const quotaError = await enforceRateLimit(request, env);
            if (quotaError) return quotaError;

            const payload = await readJson(request);
            const validationError = validatePayload(payload);
            if (validationError) {
                return jsonResponse({ error: validationError }, 400, request, env);
            }

            const stored = await saveFeedback(env, payload, request);
            return jsonResponse({ status: "ok", id: stored?.name || null }, 200, request, env);
        } catch (err) {
            console.error("Feedback worker error", err);
            return jsonResponse({ error: "Erreur interne" }, 500, request, env);
        }
    }
};

function parseAllowedOrigins(env) {
    const raw = env?.SHARE_ALLOWED_ORIGINS;
    if (!raw) return null;
    return raw.split(",").map(o => o.trim()).filter(Boolean);
}

function corsHeaders(request, env) {
    const allowedOrigins = parseAllowedOrigins(env);
    const origin = request.headers.get("Origin");
    const isLocalhost = origin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\\d+)?$/i.test(origin);
    const headers = {
        "Access-Control-Allow-Methods": "POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": isLocalhost
            ? origin
            : allowedOrigins && origin && allowedOrigins.includes(origin)
                ? origin
                : "*"
    };
    if (allowedOrigins) {
        headers["Vary"] = "Origin";
    }
    return headers;
}

function handleOptions(request, env) {
    return new Response(null, {
        status: 204,
        headers: {
            ...corsHeaders(request, env)
        }
    });
}

function jsonResponse(body, status, request, env, extra = {}) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            ...corsHeaders(request, env),
            ...extra
        }
    });
}

async function readJson(request) {
    const text = await request.text();
    if (!text || text.length > 10_000) {
        throw new Error("Payload trop volumineux ou vide");
    }
    return JSON.parse(text);
}

function validatePayload(payload) {
    if (!payload || typeof payload !== "object") return "Payload invalide";
    const type = String(payload.type || "").trim();
    const message = String(payload.message || "").trim();
    const email = payload.email ? String(payload.email).trim() : "";
    if (!type) return "Type requis";
    if (!message) return "Message requis";
    if (message.length > 4000) return "Message trop long";
    if (type === "partenariat" && !email) return "Email requis pour un partenariat";
    return null;
}

function getClientIp(request) {
    return (
        request.headers.get("CF-Connecting-IP") ||
        request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
        "unknown"
    );
}

async function enforceRateLimit(request, env) {
    const kv = env?.RATE_LIMIT;
    if (!kv?.get || !kv?.put) return null;
    const ip = getClientIp(request);
    const today = new Date().toISOString().slice(0, 10);
    const minuteWindow = Math.floor(Date.now() / 60_000);
    const dailyKey = `feedback:${ip}:day:${today}`;
    const minuteKey = `feedback:${ip}:min:${minuteWindow}`;
    const dailyLimit = 10;
    const minuteLimit = 1;

    const dailyCount = await readCounter(kv, dailyKey);
    if (dailyCount >= dailyLimit) {
        return jsonResponse({ error: "Quota quotidien atteint" }, 429, request, env);
    }
    const minuteCount = await readCounter(kv, minuteKey);
    if (minuteCount >= minuteLimit) {
        return jsonResponse({ error: "Trop de requêtes, réessaie dans une minute" }, 429, request, env);
    }

    await writeCounter(kv, dailyKey, dailyCount + 1, 27 * 60 * 60);
    await writeCounter(kv, minuteKey, minuteCount + 1, 90);
    return null;
}

async function readCounter(kv, key) {
    const stored = await kv.get(key);
    if (!stored) return 0;
    const value = parseInt(stored, 10);
    return Number.isNaN(value) ? 0 : value;
}

async function writeCounter(kv, key, value, ttlSeconds) {
    await kv.put(key, String(value), { expirationTtl: ttlSeconds });
}

function getServiceAccount(env) {
    if (serviceAccountConfig) return serviceAccountConfig;
    const raw = env?.FIREBASE_SERVICE_ACCOUNT;
    if (!raw) {
        throw new Error("Clé de service Firebase manquante");
    }
    serviceAccountConfig = JSON.parse(raw);
    if (!serviceAccountConfig.client_email || !serviceAccountConfig.private_key) {
        throw new Error("Clé de service incomplète");
    }
    return serviceAccountConfig;
}

function pemToArrayBuffer(pem) {
    const cleaned = pem.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
    const binary = atob(cleaned);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        buffer[i] = binary.charCodeAt(i);
    }
    return buffer.buffer;
}

function base64UrlEncode(buffer) {
    let string = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
        string += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(string);
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function getSigningKey(env) {
    if (signingKeyPromise) return signingKeyPromise;
    const account = getServiceAccount(env);
    const binary = pemToArrayBuffer(account.private_key);
    signingKeyPromise = crypto.subtle.importKey(
        "pkcs8",
        binary,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["sign"]
    );
    return signingKeyPromise;
}

async function getAccessToken(env) {
    const now = Date.now();
    if (accessTokenCache.token && now < accessTokenCache.expiresAt - 60_000) {
        return accessTokenCache.token;
    }
    const account = getServiceAccount(env);
    const iat = Math.floor(now / 1000);
    const exp = iat + 3600;
    const header = base64UrlEncode(textEncoder.encode(JSON.stringify({ alg: "RS256", typ: "JWT" })));
    const payload = base64UrlEncode(
        textEncoder.encode(
            JSON.stringify({
                iss: account.client_email,
                scope: FIRESTORE_SCOPE,
                aud: FIREBASE_TOKEN_URL,
                exp,
                iat
            })
        )
    );
    const toSign = `${header}.${payload}`;
    const key = await getSigningKey(env);
    const signature = await crypto.subtle.sign(
        { name: "RSASSA-PKCS1-v1_5" },
        key,
        textEncoder.encode(toSign)
    );
    const jwt = `${toSign}.${base64UrlEncode(signature)}`;
    const form = new URLSearchParams();
    form.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
    form.append("assertion", jwt);
    const response = await fetch(FIREBASE_TOKEN_URL, { method: "POST", body: form });
    if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new Error(`Auth Firebase échouée: ${response.status} ${body}`);
    }
    const data = await response.json();
    accessTokenCache = {
        token: data.access_token,
        expiresAt: now + data.expires_in * 1000
    };
    return accessTokenCache.token;
}

function getFirestoreBaseUrl(env) {
    const account = getServiceAccount(env);
    const projectId = env?.FIREBASE_PROJECT_ID || account.project_id || DEFAULT_PROJECT_ID;
    if (!projectId) throw new Error("projectId manquant");
    return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
}

async function saveFeedback(env, payload, request) {
    const accessToken = await getAccessToken(env);
    const base = getFirestoreBaseUrl(env);
    const url = `${base}/${COLLECTION}`;
    const body = {
        fields: toFields({
            type: payload.type,
            message: payload.message,
            email: payload.email || null,
            name: payload.name || null,
            page: payload.page || "index",
            userAgent: payload.userAgent || request.headers.get("User-Agent") || "",
            createdAt: { timestampValue: new Date().toISOString() }
        })
    };
    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`Firestore error ${response.status}: ${text}`);
    }
    return response.json();
}

function toFields(data) {
    const fields = {};
    for (const [key, value] of Object.entries(data)) {
        if (value === undefined) continue;
        if (value && value.timestampValue) {
            fields[key] = value;
            continue;
        }
        if (value === null || value === "") {
            fields[key] = { nullValue: null };
            continue;
        }
        fields[key] = { stringValue: String(value) };
    }
    return fields;
}
