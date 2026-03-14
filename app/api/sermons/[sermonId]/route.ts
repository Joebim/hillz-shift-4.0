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

    await updateDocument("sermons", sermonId, {
      viewCount: sermon.viewCount + 1,
    });

    return successResponse({
      ...sermon,
      viewCount: sermon.viewCount + 1,
    });
  } catch (error) {
    return errorResponse(
      "FETCH_ERROR",
      "Failed to fetch sermon",
      (error as Error).message,
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sermonId: string }> },
) {
  try {
    
    const session = await getSession();
    if (
      !session ||
      !["super_admin", "admin", "editor"].includes(session.role)
    ) {
      return unauthorizedResponse("Admin access required");
    }

    const { sermonId } = await params;
    const body = await request.json();

    const validated = updateSermonSchema.parse(body);

    const sermon = await getDocument<Sermon>("sermons", sermonId);
    if (!sermon) {
      return notFoundResponse("Sermon not found");
    }

    await updateDocument("sermons", sermonId, validated);

    return successResponse({ id: sermonId }, "Sermon updated successfully");
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error.errors);
    }

    return errorResponse(
      "UPDATE_ERROR",
      "Failed to update sermon",
      (error as Error).message,
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sermonId: string }> },
) {
  try {
    
    const session = await getSession();
    if (!session || session.role !== "super_admin") {
      return unauthorizedResponse("Super admin access required");
    }

    const { sermonId } = await params;

    const sermon = await getDocument<Sermon>("sermons", sermonId);
    if (!sermon) {
      return notFoundResponse("Sermon not found");
    }

    await deleteDocument("sermons", sermonId);

    return successResponse(null, "Sermon deleted successfully");
  } catch (error) {
    return errorResponse(
      "DELETE_ERROR",
      "Failed to delete sermon",
      (error as Error).message,
    );
  }
}
