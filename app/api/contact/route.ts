import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/src/lib/api/response";
import { createDocument } from "@/src/lib/firebase/firestore";
import { contactFormSchema } from "@/src/schemas/forms.schema";
import { ZodError } from "zod";

/**
 * POST /api/contact
 * Submit contact form (public endpoint)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validated = contactFormSchema.parse(body);

    // Create contact submission
    const submissionId = await createDocument("contact_submissions", {
      ...validated,
      status: "new",
      submittedAt: new Date(),
    });

    // TODO: Send notification email to admin
    // TODO: Send confirmation email to user

    return successResponse(
      { id: submissionId },
      "Thank you for contacting us. We will get back to you soon!",
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error.errors);
    }

    console.error("Contact form error:", error);
    return errorResponse(
      "SUBMISSION_ERROR",
      "Failed to submit contact form",
      (error as Error).message,
    );
  }
}
