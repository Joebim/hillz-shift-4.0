import { adminAuth } from "../firebase/admin";
import { cookies } from "next/headers";
import { AuthSession } from "@/src/types/user";

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "admin_session";
const SESSION_MAX_AGE = parseInt(process.env.SESSION_MAX_AGE || "604800"); // 7 days

/**
 * Create a new admin session
 */
export async function createSession(idToken: string): Promise<string> {
  const expiresIn = SESSION_MAX_AGE * 1000;
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
    maxAge: SESSION_MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return sessionCookie;
}

/**
 * Get current admin session
 */
export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true,
    );
    return {
      userId: decodedClaims.uid,
      email: decodedClaims.email || "",
      role: (decodedClaims.role as any) || "viewer",
      expiresAt: decodedClaims.exp * 1000,
    };
  } catch (error) {
    console.error("Session verification failed:", error);
    return null;
  }
}

/**
 * Destroy current admin session
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Verify if user has required role
 */
export async function verifyRole(requiredRoles: string[]): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;
  return requiredRoles.includes(session.role);
}
