export default {
  async fetch(request, env) {
    const allowedOrigins = [
      "https://gotoolkit.web.app",
      "https://sherpa-5938b.firebaseapp.com"
    ];

    const origin = request.headers.get("Origin") || "";
    const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

    // 1) Vérifier l'origine autorisée
    if (!allowedOrigins.includes(origin)) {
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

    const clientIp = request.headers.get("CF-Connecting-IP") || "unknown";
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

    // 5) Quota journalier par client (ex: 100 req / jour / client)
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    const dailyLimit = 100;
    const quotaKey = `quota:${clientId}:${today}`;

    let dailyCount = 0;
    const storedDaily = await env.RATE_LIMIT.get(quotaKey);
    if (storedDaily) {
      dailyCount = parseInt(storedDaily, 10) || 0;
    }

    if (dailyCount >= dailyLimit) {
      return jsonError(
        corsOrigin,
        429,
        "DAILY_QUOTA_EXCEEDED",
        `Daily quota exceeded (${dailyLimit} requests per day).`
      );
    }

    // Incrémenter quota journalier (expire après ~27h pour être safe)
    await env.RATE_LIMIT.put(quotaKey, String(dailyCount + 1), {
      expirationTtl: 27 * 60 * 60
    });

    // 6) Rate limit court terme (fenêtre 1 minute) par client
    const windowMs = 60_000; // 1 minute
    const perMinuteLimit = 10; // 60 req / min / client

    const now = Date.now();
    const windowId = Math.floor(now / windowMs);
    const rlKey = `rl:${clientId}:${windowId}`;

    let minuteCount = 0;
    const storedMinute = await env.RATE_LIMIT.get(rlKey);
    if (storedMinute) {
      minuteCount = parseInt(storedMinute, 10) || 0;
    }

    if (minuteCount >= perMinuteLimit) {
      return jsonError(
        corsOrigin,
        429,
        "RATE_LIMIT_EXCEEDED",
        "Too many requests, please wait a bit."
      );
    }

    await env.RATE_LIMIT.put(rlKey, String(minuteCount + 1), {
      expirationTtl: 70 // secondes
    });

    // 7) Proxy vers OpenAI (avec limites de payload)
    return forwardToOpenAI(request, env, corsOrigin);
  }
};

async function forwardToOpenAI(request, env, corsOrigin) {
  // Lire le body brut pour contrôler la taille
  const raw = await request.text();
  const maxBytes = 10_000; // ≈ 10 KB max pour tout le payload

  if (raw.length > maxBytes) {
    return jsonError(corsOrigin, 413, "PAYLOAD_TOO_LARGE", "Payload too large.");
  }

  let payload = {};
  try {
    payload = raw ? JSON.parse(raw) : {};
  } catch (e) {
    return jsonError(corsOrigin, 400, "BAD_JSON", "Invalid JSON payload.");
  }

  // Sécurité sur messages
  const messages = Array.isArray(payload.messages) ? payload.messages : [];

  const maxMessages = 50;
  const maxContentLength = 7500; // chars par message

  if (messages.length > maxMessages) {
    return jsonError(
      corsOrigin,
      413,
      "TOO_MANY_MESSAGES",
      `Too many messages (max ${maxMessages}).`
    );
  }

  for (const m of messages) {
    const content = (m && m.content) || "";
    if (content.length > maxContentLength) {
      return jsonError(
        corsOrigin,
        413,
        "MESSAGE_TOO_LONG",
        `A message is too long (max ${maxContentLength} characters).`
      );
    }
  }

  let upstreamResponse;
  try {
    upstreamResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: payload.model ?? "gpt-5-nano",
        messages: messages.length
          ? messages
          : [{ role: "user", content: "Hello" }],
        temperature: payload.temperature ?? 1,
      })
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
