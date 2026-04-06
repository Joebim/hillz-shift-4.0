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
} from "@/src/lib/firebase/firestore";
import { Event } from "@/src/types/event";
import { createRegistrationSchema } from "@/src/schemas/registration.schema";
import { ZodError } from "zod";
import { generateRandomString } from "@/src/lib/utils";
import { sendRegistrationEmail } from "@/src/lib/email/send";

type FirestoreDate = Date | string | number | { toDate: () => Date };
const toDate = (d: FirestoreDate) =>
  d && typeof (d as { toDate: () => Date }).toDate === "function"
    ? (d as { toDate: () => Date }).toDate()
    : new Date(d as string | number | Date);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    const { eventId } = await params;
    const body = await request.json();

    const validated = createRegistrationSchema.parse({
      ...body,
      eventId,
    });

    const event = await getDocument<Event>("events", eventId);
    if (!event) {
      return notFoundResponse("Event not found");
    }

    if (!event.registrationConfig.enabled) {
      return errorResponse(
        "REGISTRATION_CLOSED",
        "Registration is not enabled for this event",
        null,
        400,
      );
    }

    const now = new Date();
    const openDate = toDate(event.registrationOpenDate);
    const closeDate = toDate(event.registrationCloseDate);

    if (now < openDate) {
      return errorResponse(
        "REGISTRATION_NOT_OPEN",
        "Registration has not opened yet",
        null,
        400,
      );
    }

    if (now > closeDate) {
      return errorResponse(
        "REGISTRATION_CLOSED",
        "Registration has closed",
        null,
        400,
      );
    }

    if (
      event.registrationConfig.capacity &&
      event.registrationCount >= event.registrationConfig.capacity
    ) {
      validated.status = "waitlist";
    }

    const confirmationCode = generateRandomString(16).toUpperCase();

    const registrationId = await createDocument("registrations", {
      ...validated,
      confirmationCode,
      registrationDate: new Date(),
    });

    await updateDocument("events", eventId, {
      registrationCount: event.registrationCount + 1,
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

    sendRegistrationEmail(
      validated.attendee.email,
      validated.attendee.firstName,
      {
        title: event.title,
        isMembershipForm: event.isMembershipForm,
        date: toDate(event.startDate).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        venue: event.venue?.name,
        address: event.venue?.address,
        bannerImage: event.branding?.bannerImage || event.branding?.thumbnail,
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
      "Registration successful",
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse((error as ZodError).errors);
    }

    return errorResponse(
      "REGISTRATION_ERROR",
      "Failed to register",
      (error as Error).message,
    );
  }
}
