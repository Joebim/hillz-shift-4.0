import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/src/lib/api/response";
import { getDocument, updateDocument } from "@/src/lib/firebase/firestore";
import { getSession } from "@/src/lib/auth/session";
import { Registration } from "@/src/types/registration";
import { updateRegistrationSchema } from "@/src/schemas/registration.schema";
import { ZodError } from "zod";

/**
 * GET /api/registrations/[registrationId]
 * Get single registration details (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ registrationId: string }> },
) {
  try {
    // Check authentication
    const session = await getSession();
    if (
      !session ||
      !["super_admin", "admin", "editor"].includes(session.role)
    ) {
      return unauthorizedResponse("Admin access required");
    }

    const { registrationId } = await params;
    const registration = await getDocument<Registration>(
      "registrations",
      registrationId,
    );

    if (!registration) {
      return notFoundResponse("Registration not found");
    }

    return successResponse(registration);
  } catch (error) {
    console.error("Fetch registration error:", error);
    return errorResponse(
      "FETCH_ERROR",
      "Failed to fetch registration",
      (error as Error).message,
    );
  }
}

/**
 * PATCH /api/registrations/[registrationId]
 * Update registration (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ registrationId: string }> },
) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session || !["super_admin", "admin"].includes(session.role)) {
      return unauthorizedResponse("Admin access required");
    }

    const { registrationId } = await params;
    const body = await request.json();

    // Validate request body
    const validated = updateRegistrationSchema.parse(body);

    // Check if registration exists
    const registration = await getDocument<Registration>(
      "registrations",
      registrationId,
    );
    if (!registration) {
      return notFoundResponse("Registration not found");
    }

    // Update registration
    await updateDocument("registrations", registrationId, validated);

    return successResponse(
      { id: registrationId },
      "Registration updated successfully",
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error.errors);
    }

    console.error("Update registration error:", error);
    return errorResponse(
      "UPDATE_ERROR",
      "Failed to update registration",
      (error as Error).message,
    );
  }
}
