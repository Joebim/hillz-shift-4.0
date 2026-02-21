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

/**
 * GET /api/sermons
 * List all sermons (public)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const queryParams = Object.fromEntries(searchParams.entries());
    const validated = sermonQuerySchema.parse(queryParams);

    // Build filters
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

    // Query sermons
    const sermons = await queryDocuments<Sermon>(
      "sermons",
      filters,
      "date",
      validated.limit || 50,
    );

    // Filter by search if provided
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

    console.error("Fetch sermons error:", error);
    return errorResponse(
      "FETCH_ERROR",
      "Failed to fetch sermons",
      (error as Error).message,
    );
  }
}

/**
 * POST /api/sermons
 * Create new sermon (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (
      !session ||
      !["super_admin", "admin", "editor"].includes(session.role)
    ) {
      return unauthorizedResponse("Admin access required");
    }

    const body = await request.json();

    // Validate request body
    const validated = createSermonSchema.parse(body);

    // Generate slug if not provided
    if (!validated.slug) {
      validated.slug = generateSlug(validated.title);
    }

    // Create sermon
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

    console.error("Create sermon error:", error);
    return errorResponse(
      "CREATE_ERROR",
      "Failed to create sermon",
      (error as Error).message,
    );
  }
}
