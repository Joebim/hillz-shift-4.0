import { NextResponse } from "next/server";
import { auth } from "@/src/lib/firebaseAdmin";
import { ADMIN_USER_COOKIE_NAME } from "@/src/lib/adminSession";
import { cookies } from "next/headers";
import {
  signAdminUserCookie,
  verifyAdminUserCookie,
  type AdminCookieUser,
} from "@/src/lib/adminCookie";

const SESSION_EXPIRES_DAYS = 7;
const SESSION_EXPIRES_SECONDS = SESSION_EXPIRES_DAYS * 24 * 60 * 60;

function getAllowedAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function isAllowedAdminEmail(email?: string | null): boolean {
  const allowed = getAllowedAdminEmails();
  if (allowed.length === 0) return true;
  const normalized = (email || "").toLowerCase();
  return !!normalized && allowed.includes(normalized);
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(ADMIN_USER_COOKIE_NAME)?.value;

    const user = verifyAdminUserCookie(raw);
    if (!user) {
      return NextResponse.json({
        authenticated: false,
        reason: "NO_OR_INVALID_COOKIE",
      });
    }

    if (!isAllowedAdminEmail(user.email)) {
      return NextResponse.json({
        authenticated: false,
        reason: "FORBIDDEN",
        email: user.email,
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: { uid: user.uid, email: user.email },
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Error";
    return NextResponse.json({
      authenticated: false,
      reason: "ERROR",
      error: errorMessage,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const idToken = body?.idToken as string | undefined;

    if (!idToken) {
      return NextResponse.json(
        { success: false, error: "Missing idToken" },
        { status: 400 }
      );
    }

    const decoded = await auth.verifyIdToken(idToken);

    // Allow either: custom claim admin=true OR email allowlist (if configured).
    const hasAdminClaim = (decoded as { admin?: boolean })?.admin === true;
    const isEmailAllowed = isAllowedAdminEmail(decoded.email);

    if (!hasAdminClaim && !isEmailAllowed) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const now = Math.floor(Date.now() / 1000);
    const user: AdminCookieUser = {
      uid: decoded.uid,
      email: decoded.email || null,
      iat: now,
      exp: now + SESSION_EXPIRES_SECONDS,
    };
    const signed = signAdminUserCookie(user);

    const res = NextResponse.json({
      success: true,
      user: { uid: user.uid, email: user.email },
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: SESSION_EXPIRES_SECONDS,
    };
    res.cookies.set(ADMIN_USER_COOKIE_NAME, signed, cookieOptions);

    return res;
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Auth failed";
    const res = NextResponse.json(
      { success: false, error: errorMessage },
      { status: 401 }
    );
    res.cookies.set(ADMIN_USER_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return res;
  }
}

export async function DELETE() {
  // Best-effort logout: clear the session cookie.
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_USER_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
