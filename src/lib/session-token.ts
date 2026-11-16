import { SignJWT, jwtVerify } from 'jose';

/**
 * Admin session token: a short HS256 JWT stored in an HTTP-only cookie.
 * Kept free of `next/headers` so the proxy (src/proxy.ts) can import it too.
 */
export const SESSION_COOKIE = 'adzan_admin_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET must be set and at least 32 characters (try: openssl rand -base64 32)');
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ['HS256'] });
    return payload.role === 'admin';
  } catch {
    return false;
  }
}
