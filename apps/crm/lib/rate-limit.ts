const memory = new Map<string, { count: number; start: number }>();

export function checkRateLimit(ip: string, limit = 30, windowMs = 60_000) {
  const now = Date.now();
  const current = memory.get(ip);
  if (!current || now - current.start > windowMs) {
    memory.set(ip, { count: 1, start: now });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  memory.set(ip, current);
  return true;
}
