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

    if (!allowLocal && !allowedOrigins.includes(origin)) {
      return new Response("Forbidden", {
        status: 403,
        headers: {
          "Access-Control-Allow-Origin": corsOrigin,
          "Vary": "Origin"
        }
      });
    }

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
          Allow: "POST, OPTIONS",
          Vary: "Origin"
        }
      });
    }

    const clientIp = normalizeClientIp(request);
    const ipWhitelist = ["78.112.62.208"];

    if (ipWhitelist.includes(clientIp)) {
      return forwardToOpenRouter(request, env, corsOrigin);
    }

    let clientId = request.headers.get("x-client-id");
    if (!clientId || clientId.length > 100) {
      clientId = `anon:${clientIp}`;
    }

    const now = Date.now();
    const today = new Date(now).toISOString().slice(0, 10);
    const dailyLimit = 300;
    const windowMs = 60_000;
    const perMinuteLimit = 30;

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

    await Promise.all([
      env.RATE_LIMIT.put(quotaKey, String(dailyCount + 1), {
        expirationTtl: 27 * 60 * 60
      }),
      env.RATE_LIMIT.put(rlKey, String(minuteCount + 1), {
        expirationTtl: 70
      })
    ]);

    return forwardToOpenRouter(request, env, corsOrigin);
  }
};

async function forwardToOpenRouter(request, env, corsOrigin) {
  const raw = await request.text();
  const maxBytes = 200_000;

  if (raw.length > maxBytes) {
    return jsonError(corsOrigin, 413, "PAYLOAD_TOO_LARGE", "Payload too large.");
  }

  let payload = {};
  try {
    payload = raw ? JSON.parse(raw) : {};
  } catch (e) {
    return jsonError(corsOrigin, 400, "BAD_JSON", "Invalid JSON payload.");
  }

  if (!env.OPENROUTER_API_KEY) {
    return jsonError(corsOrigin, 500, "MISSING_ENV", "OpenRouter API key missing.");
  }

  let upstreamResponse;
  try {
    upstreamResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error("OpenRouter fetch failed", error);
    return jsonError(
      corsOrigin,
      502,
      "UPSTREAM_UNAVAILABLE",
      "OpenRouter upstream unavailable."
    );
  }

  const headers = new Headers(upstreamResponse.headers);
  headers.set("Access-Control-Allow-Origin", corsOrigin);
  headers.set("Cache-Control", "no-store");
  headers.set("Vary", "Origin");

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers
  });
}

function normalizeClientIp(request) {
  const raw =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For") ||
    "";
  const first = raw.split(",")[0].trim();
  if (!first) return "unknown";
  const withoutBrackets = first.replace(/^\[/, "").replace(/]$/, "");
  const [hostPart] = withoutBrackets.split(":");
  return hostPart || "unknown";
}

function jsonError(origin, status, code, message) {
  const body = JSON.stringify({ error: { code, message } });
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
      Vary: "Origin"
    }
  });
}
