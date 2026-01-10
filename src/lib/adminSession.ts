import "server-only";

import { cookies } from "next/headers";
import {
  verifyAdminUserCookie,
  type AdminCookieUser,
} from "@/src/lib/adminCookie";

export const ADMIN_USER_COOKIE_NAME = "hs_admin_user";

function getAllowedAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function isAllowedAdminEmail(email?: string | null): boolean {
  const allowed = getAllowedAdminEmails();
  if (allowed.length === 0) return true; // If not configured, allow any authenticated user.

  const normalized = (email || "").toLowerCase();
  return !!normalized && allowed.includes(normalized);
}

export class AdminAuthError extends Error {
  code: "UNAUTHENTICATED" | "FORBIDDEN";
  constructor(code: "UNAUTHENTICATED" | "FORBIDDEN") {
    super(code);
    this.code = code;
  }
}

export async function requireAdminSession(): Promise<AdminCookieUser> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(ADMIN_USER_COOKIE_NAME)?.value;

  const user = verifyAdminUserCookie(raw);
  if (!user) throw new AdminAuthError("UNAUTHENTICATED");

  if (!isAllowedAdminEmail(user.email)) throw new AdminAuthError("FORBIDDEN");
  return user;
}
