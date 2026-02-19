import { clearRefreshCookie } from '@/lib/auth';
import { json } from '@/lib/http';

export async function POST() {
  clearRefreshCookie();
  return json({ ok: true });
}
