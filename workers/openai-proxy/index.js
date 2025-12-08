export default {
  async fetch(request, env) {
    const allowedOrigins = [
      "https://gotoolkit.web.app",
      "https://sherpa-5938b.firebaseapp.com"
    ];

    const origin = request.headers.get("Origin") || "";
    const allowLocal =
      !origin ||
      origin.startsWith("http://localhost") ||
      origin.startsWith("http://127.0.0.1") ||
      origin.startsWith("http://192.168.");

    const corsOrigin = allowLocal
      ? origin || "*"
      : allowedOrigins.includes(origin)
        ? origin
        : allowedOrigins[0];

    // 1) Vérifier l'origine autorisée (autoriser localhost en dev)
    if (!allowLocal && !allowedOrigins.includes(origin)) {
      return new Response("Forbidden", {
        status: 403,
        headers: {
          "Access-Control-Allow-Origin": corsOrigin,
          "Vary": "Origin"
        }
      });
    }

    // 2) Préflight CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": corsOrigin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, x-app-token, x-client-id",
          "Vary": "Origin"
        }
      });
    }

    if (request.method !== "POST") {
      return new Response("Only POST", {
        status: 405,
        headers: {
          "Access-Control-Allow-Origin": corsOrigin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, x-app-token, x-client-id",
          "Allow": "POST, OPTIONS",
          "Vary": "Origin"
        }
      });
    }

    const clientIp = normalizeClientIp(request);
    const ipWhitelist = ["78.112.62.208"];

    // 3) IP whitelist → pas de quotas / rate limit, mais origine toujours contrôlée
    if (ipWhitelist.includes(clientIp)) {
      return forwardToOpenAI(request, env, corsOrigin);
    }

    // 4) Récupérer le clientId (ou fallback anonyme basé sur IP)
    let clientId = request.headers.get("x-client-id");
    if (!clientId || clientId.length > 100) {
      clientId = `anon:${clientIp}`;
    }

    // 5) Quota journalier par client (ex: 600 req / jour / client)
    const now = Date.now();
    const today = new Date(now).toISOString().slice(0, 10); // "YYYY-MM-DD"
    const dailyLimit = 300;
    const windowMs = 60_000; // 1 minute
    const perMinuteLimit = 30; // 20 req / min / client

    const quotaKey = `quota:${clientId}:${today}`;
    const windowId = Math.floor(now / windowMs);
    const rlKey = `rl:${clientId}:${windowId}`;

    const [storedDaily, storedMinute] = await Promise.all([
      env.RATE_LIMIT.get(quotaKey),
      env.RATE_LIMIT.get(rlKey)
    ]);

    const dailyCount = storedDaily ? parseInt(storedDaily, 10) || 0 : 0;
    if (dailyCount >= dailyLimit) {
      return jsonError(
        corsOrigin,
        429,
        "DAILY_QUOTA_EXCEEDED",
        `Daily quota exceeded (${dailyLimit} requests per day).`
      );
    }

    const minuteCount = storedMinute ? parseInt(storedMinute, 10) || 0 : 0;
    if (minuteCount >= perMinuteLimit) {
      return jsonError(
        corsOrigin,
        429,
        "RATE_LIMIT_EXCEEDED",
        "Too many requests, please wait a bit."
      );
    }

    // Incrémenter quota quotidien + fenêtre minute (TTL 27h / 70s) en parallèle.
    await Promise.all([
      env.RATE_LIMIT.put(quotaKey, String(dailyCount + 1), {
        expirationTtl: 27 * 60 * 60
      }),
      env.RATE_LIMIT.put(rlKey, String(minuteCount + 1), {
        expirationTtl: 70 // secondes
      })
    ]);

    // 7) Proxy vers OpenAI (avec limites de payload)
    return forwardToOpenAI(request, env, corsOrigin);
  }
};

function normalizeClientIp(request) {
  const raw =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For") ||
    "";
  const first = raw.split(",")[0].trim();
  if (!first) return "unknown";
  // Drop IPv6 brackets and port if present
  const withoutBrackets = first.replace(/^\[/, "").replace(/]$/, "");
  const [hostPart] = withoutBrackets.split(":");
  return hostPart || "unknown";
}

async function forwardToOpenAI(request, env, corsOrigin) {
  // Lire le body brut pour contrôler la taille
  const raw = await request.text();
  const maxBytes = 200_000; // ≈ 10 KB max pour tout le payload

  if (raw.length > maxBytes) {
    return jsonError(corsOrigin, 413, "PAYLOAD_TOO_LARGE", "Payload too large.");
  }

  let payload = {};
  try {
    payload = raw ? JSON.parse(raw) : {};
  } catch (e) {
    return jsonError(corsOrigin, 400, "BAD_JSON", "Invalid JSON payload.");
  }

  // Sécurité sur messages / input
  const messages = Array.isArray(payload.messages) ? payload.messages : [];
  const inputFromPayload = Array.isArray(payload.input) ? payload.input : null;

  const maxMessages = 50;
  const maxContentLength = 7500; // chars par message

  const safeMessages = (inputFromPayload || messages).map(m => ({
    role: m?.role || "user",
    content: m?.content ?? ""
  }));

  if (safeMessages.length > maxMessages) {
    return jsonError(
      corsOrigin,
      413,
      "TOO_MANY_MESSAGES",
      `Too many messages (max ${maxMessages}).`
    );
  }

  for (const m of safeMessages) {
    const content = (m && m.content) || "";
    const length = typeof content === "string" ? content.length : JSON.stringify(content || {}).length;
    if (length > maxContentLength) {
      return jsonError(
        corsOrigin,
        413,
        "MESSAGE_TOO_LONG",
        `A message is too long (max ${maxContentLength} characters).`
      );
    }
  }

  const input = inputFromPayload
    ? inputFromPayload
    : safeMessages.length
      ? safeMessages.map(msg => ({
        role: msg.role,
        content: Array.isArray(msg.content)
          ? msg.content.map(part => {
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
          : [{ type: "input_text", text: String(msg.content ?? "") }]
      }))
      : [{ role: "user", content: [{ type: "input_text", text: "Hello" }] }];

  const upstreamPayload = {
    model: payload.model ?? "gpt-5-nano",
    input,
    temperature: payload.temperature ?? 1
  };

  if (payload.stream === true) {
    upstreamPayload.stream = true;
  }

  if (!upstreamPayload.reasoning && payload.reasoning?.effort) {
    upstreamPayload.reasoning = { effort: payload.reasoning.effort };
  }

  let upstreamResponse;
  try {
    upstreamResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(upstreamPayload)
    });
  } catch (error) {
    console.error("OpenAI fetch failed", error);
    return jsonError(
      corsOrigin,
      502,
      "UPSTREAM_UNAVAILABLE",
      "OpenAI upstream unavailable."
    );
  }

  const headers = new Headers(upstreamResponse.headers);
  headers.set("Access-Control-Allow-Origin", corsOrigin);
  headers.set("Cache-Control", "no-store");
  headers.set("Vary", "Origin");

  return new Response(upstreamResponse.body, { status: upstreamResponse.status, headers });
}

function jsonError(origin, status, code, message) {
  const body = JSON.stringify({ error: { code, message } });
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
      "Vary": "Origin"
    }
  });
}
