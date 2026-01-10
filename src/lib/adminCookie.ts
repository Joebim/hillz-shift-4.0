import "server-only";

import crypto from "crypto";

export type AdminCookieUser = {
  uid: string;
  email: string | null;
  iat: number; // seconds
  exp: number; // seconds
};

const COOKIE_SECRET_ENV = "ADMIN_COOKIE_SECRET";

function base64UrlEncode(input: string | Buffer): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(input: string): string {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(b64, "base64").toString("utf8");
}

function getSecret(): string {
  const secret = process.env[COOKIE_SECRET_ENV];
  if (!secret) {
    // We intentionally hard-fail so you don't accidentally run an unsigned admin cookie in prod.
    throw new Error(
      `Missing ${COOKIE_SECRET_ENV}. Set it in .env.local (use a long random string).`
    );
  }
  return secret;
}

function hmac(payloadB64: string, secret: string): string {
  const sig = crypto.createHmac("sha256", secret).update(payloadB64).digest();
  return base64UrlEncode(sig);
}

export function signAdminUserCookie(user: AdminCookieUser): string {
  const payloadB64 = base64UrlEncode(JSON.stringify(user));
  const sigB64 = hmac(payloadB64, getSecret());
  return `${payloadB64}.${sigB64}`;
}

export function verifyAdminUserCookie(
  value: string | undefined
): AdminCookieUser | null {
  if (!value) return null;
  const [payloadB64, sigB64] = value.split(".");
  if (!payloadB64 || !sigB64) return null;

  const secret = getSecret();
  const expected = hmac(payloadB64, secret);

  try {
    const a = Buffer.from(sigB64);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return null;
    if (!crypto.timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  try {
    const parsed = JSON.parse(base64UrlDecode(payloadB64)) as AdminCookieUser;
    if (!parsed?.uid) return null;
    const now = Math.floor(Date.now() / 1000);
    if (typeof parsed.exp !== "number" || parsed.exp <= now) return null;
    return parsed;
  } catch {
    return null;
  }
}

