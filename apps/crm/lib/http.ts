export const json = (data: unknown, init?: ResponseInit) =>
  Response.json(data, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) } });
