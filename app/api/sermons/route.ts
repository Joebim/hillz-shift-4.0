import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/src/lib/api/response";
import { queryDocuments, createDocument } from "@/src/lib/firebase/firestore";
import { getSession } from "@/src/lib/auth/session";
import { Sermon } from "@/src/types/sermon";
import {
  createSermonSchema,
  sermonQuerySchema,
} from "@/src/schemas/sermon.schema";
import { ZodError } from "zod";
import { generateSlug } from "@/src/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const queryParams = Object.fromEntries(searchParams.entries());
    const validated = sermonQuerySchema.parse(queryParams);

    const filters: Record<string, unknown> = {};

    if (validated.category) {
      filters.category = validated.category;
    }

    if (validated.speaker) {
      filters.speaker = validated.speaker;
    }

    if (validated.series) {
      filters.series = validated.series;
    }

    if (validated.featured !== undefined) {
      filters.featured = validated.featured;
    }

    const sermons = await queryDocuments<Sermon>(
      "sermons",
      filters,
      "date",
      validated.limit || 50,
    );

    let filteredSermons = sermons;
    if (validated.search) {
      const searchLower = validated.search.toLowerCase();
      filteredSermons = sermons.filter(
        (sermon) =>
          sermon.title.toLowerCase().includes(searchLower) ||
          sermon.description.toLowerCase().includes(searchLower) ||
          sermon.speaker.toLowerCase().includes(searchLower) ||
          sermon.scripture.toLowerCase().includes(searchLower),
      );
    }

    return successResponse(filteredSermons);
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error.errors);
    }

    return errorResponse(
      "FETCH_ERROR",
      "Failed to fetch sermons",
      (error as Error).message,
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (
      !session ||
      !["super_admin", "admin", "editor"].includes(session.role)
    ) {
      return unauthorizedResponse("Admin access required");
    }

    const body = await request.json();

    if (!body.slug && body.title) {
      body.slug = generateSlug(body.title);
    }

    const validated = createSermonSchema.parse(body);

    const sermonId = await createDocument("sermons", {
      ...validated,
      createdBy: session.userId,
      viewCount: 0,
    });

    return successResponse({ id: sermonId }, "Sermon created successfully");
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error.errors);
    }

    return errorResponse(
      "CREATE_ERROR",
      "Failed to create sermon",
      (error as Error).message,
    );
  }
}
