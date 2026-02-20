import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/src/lib/api/response";
import {
  getDocument,
  updateDocument,
  deleteDocument,
} from "@/src/lib/firebase/firestore";
import { getSession } from "@/src/lib/auth/session";
import { Sermon } from "@/src/types/sermon";
import { updateSermonSchema } from "@/src/schemas/sermon.schema";
import { ZodError } from "zod";

/**
 * GET /api/sermons/[sermonId]
 * Get single sermon details (public)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sermonId: string }> },
) {
  try {
    const { sermonId } = await params;
    const sermon = await getDocument<Sermon>("sermons", sermonId);

    if (!sermon) {
      return notFoundResponse("Sermon not found");
    }

    // Increment view count
    await updateDocument("sermons", sermonId, {
      viewCount: sermon.viewCount + 1,
    });

    return successResponse({
      ...sermon,
      viewCount: sermon.viewCount + 1,
    });
  } catch (error) {
    console.error("Fetch sermon error:", error);
    return errorResponse(
      "FETCH_ERROR",
      "Failed to fetch sermon",
      (error as Error).message,
    );
  }
}

/**
 * PATCH /api/sermons/[sermonId]
 * Update sermon (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sermonId: string }> },
) {
  try {
    // Check authentication
    const session = await getSession();
    if (
      !session ||
      !["super_admin", "admin", "editor"].includes(session.role)
    ) {
      return unauthorizedResponse("Admin access required");
    }

    const { sermonId } = await params;
    const body = await request.json();

    // Validate request body
    const validated = updateSermonSchema.parse(body);

    // Check if sermon exists
    const sermon = await getDocument<Sermon>("sermons", sermonId);
    if (!sermon) {
      return notFoundResponse("Sermon not found");
    }

    // Update sermon
    await updateDocument("sermons", sermonId, validated);

    return successResponse({ id: sermonId }, "Sermon updated successfully");
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error.errors);
    }

    console.error("Update sermon error:", error);
    return errorResponse(
      "UPDATE_ERROR",
      "Failed to update sermon",
      (error as Error).message,
    );
  }
}

/**
 * DELETE /api/sermons/[sermonId]
 * Delete sermon (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sermonId: string }> },
) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session || session.role !== "super_admin") {
      return unauthorizedResponse("Super admin access required");
    }

    const { sermonId } = await params;

    // Check if sermon exists
    const sermon = await getDocument<Sermon>("sermons", sermonId);
    if (!sermon) {
      return notFoundResponse("Sermon not found");
    }

    // Delete sermon
    await deleteDocument("sermons", sermonId);

    return successResponse(null, "Sermon deleted successfully");
  } catch (error) {
    console.error("Delete sermon error:", error);
    return errorResponse(
      "DELETE_ERROR",
      "Failed to delete sermon",
      (error as Error).message,
    );
  }
}
