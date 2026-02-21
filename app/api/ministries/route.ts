import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/src/lib/api/response";
import { queryDocuments, createDocument } from "@/src/lib/firebase/firestore";
import { getSession } from "@/src/lib/auth/session";
import { Ministry } from "@/src/types/ministry";
import { createMinistrySchema } from "@/src/schemas/ministry.schema";
import { ZodError } from "zod";
import { generateSlug } from "@/src/lib/utils";

/**
 * GET /api/ministries
 * List all active ministries (public)
 */
export async function GET() {
  try {
    // Check if admin is authenticated
    const session = await getSession();
    const isAdmin =
      session && ["super_admin", "admin", "editor"].includes(session.role);

    // Build filters
    const filters: Record<string, unknown> = {};

    // If not admin, only show active ministries
    if (!isAdmin) {
      filters.active = true;
    }

    // Query ministries
    const ministries = await queryDocuments<Ministry>(
      "ministries",
      filters,
      "order",
      100,
    );

    return successResponse(ministries);
  } catch (error) {
    console.error("Fetch ministries error:", error);
    return errorResponse(
      "FETCH_ERROR",
      "Failed to fetch ministries",
      (error as Error).message,
    );
  }
}

/**
 * POST /api/ministries
 * Create new ministry (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session || !["super_admin", "admin"].includes(session.role)) {
      return unauthorizedResponse("Admin access required");
    }

    const body = await request.json();

    // Validate request body
    const validated = createMinistrySchema.parse(body);

    // Generate slug if not provided
    if (!validated.slug) {
      validated.slug = generateSlug(validated.name);
    }

    // Create ministry
    const ministryId = await createDocument("ministries", validated);

    return successResponse({ id: ministryId }, "Ministry created successfully");
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error.errors);
    }

    console.error("Create ministry error:", error);
    return errorResponse(
      "CREATE_ERROR",
      "Failed to create ministry",
      (error as Error).message,
    );
  }
}
