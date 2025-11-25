var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// index.js
var index_default = {
  async fetch(request, env) {
    const allowedOrigins = [
      "https://gotoolkit.web.app",
      "https://sherpa-5938b.firebaseapp.com"
    ];
    const origin = request.headers.get("Origin") || "";
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, x-app-token, x-client-id",
          "Vary": "Origin"
        }
      });
    }
    if (request.method !== "POST") {
      return new Response("Only POST", { status: 405 });
    }
    const clientIp = request.headers.get("CF-Connecting-IP") || "unknown";
    const ipWhitelist = ["78.112.62.208"];
    if (ipWhitelist.includes(clientIp)) {
      return forwardToOpenAI(request, env, origin);
    }
    let clientId = request.headers.get("x-client-id");
    if (!clientId || clientId.length > 100) {
      clientId = `anon:${clientIp}`;
    }
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const dailyLimit = 50;
    const quotaKey = `quota:${clientId}:${today}`;
    let dailyCount = 0;
    const storedDaily = await env.RATE_LIMIT.get(quotaKey);
    if (storedDaily) {
      dailyCount = parseInt(storedDaily, 10) || 0;
    }
    if (dailyCount >= dailyLimit) {
      return jsonError(
        origin,
        429,
        "DAILY_QUOTA_EXCEEDED",
        `Daily quota exceeded (${dailyLimit} requests per day).`
      );
    }
    await env.RATE_LIMIT.put(quotaKey, String(dailyCount + 1), {
      expirationTtl: 27 * 60 * 60
    });
    const windowMs = 6e4;
    const perMinuteLimit = 10;
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
        origin,
        429,
        "RATE_LIMIT_EXCEEDED",
        "Too many requests, please wait a bit."
      );
    }
    await env.RATE_LIMIT.put(rlKey, String(minuteCount + 1), {
      expirationTtl: 70
      // secondes
    });
    return forwardToOpenAI(request, env, origin);
  }
};
async function forwardToOpenAI(request, env, origin) {
  const raw = await request.text();
  const maxBytes = 1e4;
  if (raw.length > maxBytes) {
    return jsonError(origin, 413, "PAYLOAD_TOO_LARGE", "Payload too large.");
  }
  let payload = {};
  try {
    payload = raw ? JSON.parse(raw) : {};
  } catch (e) {
    return jsonError(origin, 400, "BAD_JSON", "Invalid JSON payload.");
  }
  const messages = Array.isArray(payload.messages) ? payload.messages : [];
  const maxMessages = 50;
  const maxContentLength = 7500;
  if (messages.length > maxMessages) {
    return jsonError(
      origin,
      413,
      "TOO_MANY_MESSAGES",
      `Too many messages (max ${maxMessages}).`
    );
  }
  for (const m of messages) {
    const content = m && m.content || "";
    if (content.length > maxContentLength) {
      return jsonError(
        origin,
        413,
        "MESSAGE_TOO_LONG",
        `A message is too long (max ${maxContentLength} characters).`
      );
    }
  }
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: payload.model ?? "gpt-5-nano",
      messages: messages.length ? messages : [{ role: "user", content: "Hello" }],
      temperature: payload.temperature ?? 1
    })
  });
  const headers = new Headers(r.headers);
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Cache-Control", "no-store");
  headers.set("Vary", "Origin");
  return new Response(r.body, { status: r.status, headers });
}
__name(forwardToOpenAI, "forwardToOpenAI");
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
__name(jsonError, "jsonError");

// ../../../../../../../../../../usr/lib/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../../../../../../../../usr/lib/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError2;

// .wrangler/tmp/bundle-qisRdd/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = index_default;

// ../../../../../../../../../../usr/lib/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-qisRdd/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
