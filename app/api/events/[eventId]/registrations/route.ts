import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  validationErrorResponse,
} from "@/src/lib/api/response";
import {
  getDocument,
  createDocument,
  updateDocument,
  queryDocuments,
} from "@/src/lib/firebase/firestore";
import { Event } from "@/src/types/event";
import { createRegistrationSchema } from "@/src/schemas/registration.schema";
import { ZodError } from "zod";
import { generateRandomString } from "@/src/lib/utils";
import { sendRegistrationEmail } from "@/src/lib/email/send";
import { Registration } from "@/src/types/registration"; // Helper type

// Helper to safely convert Firestore Timestamp or string to Date
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toDate = (d: any) =>
  d && typeof d.toDate === "function" ? d.toDate() : new Date(d);

/**
 * GET /api/events/[eventId]/registrations
 * Get all registrations for an event
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    const { eventId } = await params;
    const registrations = await queryDocuments<Registration>("registrations", {
      eventId,
    });
    return successResponse(registrations, "Registrations fetched successfully");
  } catch (error) {
    console.error("Fetch registrations error:", error);
    return errorResponse(
      "FETCH_ERROR",
      "Failed to fetch registrations",
      (error as Error).message,
    );
  }
}

/**
 * POST /api/events/[eventId]/registrations
 * Add a registration (Admin endpoint)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    const { eventId } = await params;
    const body = await request.json();

    // Map Admin simple payload to full schema if needed
    // Admin payload: { name, email, type }
    let payload = { ...body, eventId };

    if (body.name && body.email && !body.attendee) {
      const nameParts = body.name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || "Attendee"; // Default last name

      payload = {
        eventId,
        attendee: {
          firstName,
          lastName,
          email: body.email,
          phone: "0000000000", // Placeholder
          customFields: {},
        },
        ticketType: body.type, // Map 'type' to 'ticketType'
        status: "confirmed", // Admin adds are explicitly confirmed usually
        checkedIn: false,
      };
    }

    // Validate request body
    const validated = createRegistrationSchema.parse(payload);

    // Check if event exists
    const event = await getDocument<Event>("events", eventId);
    if (!event) {
      return notFoundResponse("Event not found");
    }

    // Checking capacity/dates skipped for Admin overrides, or we can keep them.
    // Let's assume Admin overrides restrictions.

    // Generate confirmation code
    const confirmationCode = generateRandomString(16).toUpperCase();

    // Create registration
    const registrationId = await createDocument("registrations", {
      ...validated,
      confirmationCode,
      registrationDate: new Date(),
    });

    // Update event registration count
    await updateDocument("events", eventId, {
      registrationCount: (event.registrationCount || 0) + 1,
    });

    // Send confirmation email ?
    // Maybe admin doesn't want to spam, but confirmation is good.
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

    // Don't block response on email sending, but log errors
    sendRegistrationEmail(
      validated.attendee.email,
      validated.attendee.firstName,
      {
        title: event.title,
        date: toDate(event.startDate).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      confirmationCode,
      `${baseUrl}/events/${eventId}?code=${confirmationCode}`,
    ).catch((err) => console.error("Failed to send registration email:", err));

    return successResponse(
      {
        id: registrationId,
        confirmationCode,
        status: validated.status,
      },
      "Registration added successfully",
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse((error as ZodError).errors);
    }

    console.error("Registration error:", error);
    return errorResponse(
      "REGISTRATION_ERROR",
      "Failed to register",
      (error as Error).message,
    );
  }
}
