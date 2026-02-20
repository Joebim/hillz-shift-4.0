import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/src/lib/api/response";
import { createDocument, queryDocuments } from "@/src/lib/firebase/firestore";
import { newsletterSubscriptionSchema } from "@/src/schemas/forms.schema";
import { ZodError } from "zod";

/**
 * POST /api/newsletter
 * Subscribe to newsletter (public endpoint)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validated = newsletterSubscriptionSchema.parse(body);

    // Check if email already subscribed
    const existing = await queryDocuments("newsletter_subscribers", {
      email: validated.email,
    });

    if (existing.length > 0) {
      return errorResponse(
        "ALREADY_SUBSCRIBED",
        "This email is already subscribed",
        null,
        400,
      );
    }

    // Create subscription
    const subscriptionId = await createDocument("newsletter_subscribers", {
      ...validated,
      status: "active",
      subscribedAt: new Date(),
    });

    // TODO: Send welcome email

    return successResponse(
      { id: subscriptionId },
      "Thank you for subscribing to our newsletter!",
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error.errors);
    }

    console.error("Newsletter subscription error:", error);
    return errorResponse(
      "SUBSCRIPTION_ERROR",
      "Failed to subscribe",
      (error as Error).message,
    );
  }
}
