import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/src/lib/api/response";
import { createSession } from "@/src/lib/auth/session";
import { adminAuth } from "@/src/lib/firebase/admin";
import { loginSchema } from "@/src/schemas/auth.schema";
import { ZodError } from "zod";

/**
 * POST /api/auth/login
 * Admin login endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // The frontend sends an idToken after signing in with the Client SDK.
    // The loginSchema originally required email/password, but our API
    // actually uses the idToken to create the session.
    const { idToken, email, password } = body;

    // Validate based on what was provided
    if (idToken) {
      // If we have an idToken, we can skip email/password validation
    } else if (email && password) {
      // Validate against schema if trying to login with email/password
      loginSchema.parse({ email, password });
    } else {
      return errorResponse(
        "MISSING_DATA",
        "Email/Password or ID Token is required",
        null,
        400,
      );
    }

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Check if user has admin role
    const userRecord = await adminAuth.getUser(decodedToken.uid);
    const customClaims = userRecord.customClaims || {};

    if (
      !customClaims.role ||
      !["super_admin", "admin", "editor", "viewer"].includes(
        customClaims.role as string,
      )
    ) {
      return errorResponse(
        "UNAUTHORIZED",
        "User does not have admin access",
        null,
        403,
      );
    }

    // Create session cookie
    await createSession(idToken);

    return successResponse(
      {
        user: {
          id: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          role: customClaims.role,
        },
      },
      "Login successful",
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error.errors);
    }

    console.error("Login error:", error);
    return errorResponse(
      "LOGIN_ERROR",
      "Login failed",
      (error as Error).message,
      500,
    );
  }
}
