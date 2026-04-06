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
import { Registration } from "@/src/types/registration";

type FirestoreDate = Date | string | number | { toDate: () => Date };
const toDate = (d: FirestoreDate) =>
  d && typeof (d as { toDate: () => Date }).toDate === "function"
    ? (d as { toDate: () => Date }).toDate()
    : new Date(d as string | number | Date);

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
    return errorResponse(
      "FETCH_ERROR",
      "Failed to fetch registrations",
      (error as Error).message,
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    const { eventId } = await params;
    const body = await request.json();

    let payload = { ...body, eventId };

    if (body.name && body.email && !body.attendee) {
      const nameParts = body.name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || "Attendee";

      payload = {
        eventId,
        attendee: {
          firstName,
          lastName,
          email: body.email,
          phone: "0000000000",
          customFields: {},
        },
        ticketType: body.type,
        status: "confirmed",
        checkedIn: false,
      };
    }

    const validated = createRegistrationSchema.parse(payload);

    const event = await getDocument<Event>("events", eventId);
    if (!event) {
      return notFoundResponse("Event not found");
    }

    const confirmationCode = generateRandomString(16).toUpperCase();

    const registrationId = await createDocument("registrations", {
      ...validated,
      confirmationCode,
      registrationDate: new Date(),
    });

    await updateDocument("events", eventId, {
      registrationCount: (event.registrationCount || 0) + 1,
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
      "Registration added successfully",
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
