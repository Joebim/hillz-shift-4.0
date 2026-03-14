import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/src/lib/api/response";
import { createDocument, queryDocuments } from "@/src/lib/firebase/firestore";
import { newsletterSubscriptionSchema } from "@/src/schemas/forms.schema";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validated = newsletterSubscriptionSchema.parse(body);

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

    const subscriptionId = await createDocument("newsletter_subscribers", {
      ...validated,
      status: "active",
      subscribedAt: new Date(),
    });

    return successResponse(
      { id: subscriptionId },
      "Thank you for subscribing to our newsletter!",
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error.errors);
    }

    return errorResponse(
      "SUBSCRIPTION_ERROR",
      "Failed to subscribe",
      (error as Error).message,
    );
  }
}
