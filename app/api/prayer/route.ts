import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/src/lib/api/response";
import { createDocument } from "@/src/lib/firebase/firestore";
import { prayerRequestSchema } from "@/src/schemas/forms.schema";
import { ZodError } from "zod";

/**
 * POST /api/prayer
 * Submit prayer request (public endpoint)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validated = prayerRequestSchema.parse(body);

    // Create prayer request
    const requestId = await createDocument("prayer_requests", {
      ...validated,
      status: "new",
      submittedAt: new Date(),
    });

    // TODO: Send notification email to prayer team
    // TODO: Send confirmation email to user

    return successResponse(
      { id: requestId },
      "Your prayer request has been received. Our prayer team will be praying for you.",
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error.errors);
    }

    console.error("Prayer request error:", error);
    return errorResponse(
      "SUBMISSION_ERROR",
      "Failed to submit prayer request",
      (error as Error).message,
    );
  }
}
