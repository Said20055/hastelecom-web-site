import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import type { Role } from '@prisma/client';

export type AccessPayload = { sub: string; role: Role; email: string; name: string };

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || '15m';
const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL || '7d';

export function signAccessToken(payload: AccessPayload) {
  return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: ACCESS_TOKEN_TTL });
}

export function signRefreshToken(payload: Pick<AccessPayload, 'sub' | 'role'>) {
  return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: REFRESH_TOKEN_TTL });
}

export function verifyToken<T>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as T;
  } catch {
    return null;
  }
}

export function setRefreshCookie(token: string) {
  cookies().set('refreshToken', token, {
    httpOnly: true,
    path: '/crm/api/auth',
    sameSite: 'lax',
    secure: false,
    maxAge: 7 * 24 * 3600
  });
}

export function clearRefreshCookie() {
  cookies().set('refreshToken', '', { httpOnly: true, path: '/crm/api/auth', expires: new Date(0) });
}

export function getUserFromRequest(req: NextRequest): AccessPayload | null {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  return verifyToken<AccessPayload>(token);
}

export function requireRole(roles: Role[], role: Role) {
  return roles.includes(role);
}
