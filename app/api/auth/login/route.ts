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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { idToken, email, password } = body;

    if (idToken) {
    } else if (email && password) {
      loginSchema.parse({ email, password });
    } else {
      return errorResponse(
        "MISSING_DATA",
        "Email/Password or ID Token is required",
        null,
        400,
      );
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);

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

    return errorResponse(
      "LOGIN_ERROR",
      "Login failed",
      (error as Error).message,
      500,
    );
  }
}
