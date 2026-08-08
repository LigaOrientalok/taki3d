const WINDOW_MS = 60_000;
const MAX_KEYS = 10_000;

export function clientIp(req) {
  const fwd = req.headers?.["x-forwarded-for"];
  if (typeof fwd === "string") return fwd.split(",")[0].trim() || "unknown";
  return "unknown";
}

export function createLimiter(max, windowMs = WINDOW_MS) {
  const hits = new Map();
  return function check(key) {
    const now = Date.now();
    if (hits.size > MAX_KEYS) {
      for (const [k, entry] of hits) {
        if (entry.resetAt <= now) hits.delete(k);
      }
    }
    const entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return { ok: true, remaining: max - 1, retryAfter: 0 };
    }
    entry.count += 1;
    const remaining = max - entry.count;
    return {
      ok: remaining >= 0,
      remaining: Math.max(0, remaining),
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  };
}

export function tooMany(res, retryAfter, message) {
  res.setHeader("Retry-After", String(retryAfter));
  return res.status(429).json({ error: message });
}
