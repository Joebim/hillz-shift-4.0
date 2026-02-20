import { NextRequest, NextResponse } from "next/server";
import {
  getDocument,
  updateDocument,
  deleteDocument,
} from "@/src/lib/firebase/firestore";
import { getSession } from "@/src/lib/auth/session";
import { Ministry } from "@/src/types/ministry";
import { updateMinistrySchema } from "@/src/schemas/ministry.schema";
import { successResponse, errorResponse } from "@/src/lib/api/response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ministryId: string }> },
) {
  try {
    const { ministryId } = await params;

    const ministry = await getDocument<Ministry>("ministries", ministryId);

    if (!ministry) {
      return errorResponse(
        "MINISTRY_NOT_FOUND",
        "Ministry not found",
        null,
        404,
      );
    }

    return successResponse(ministry);
  } catch (error) {
    console.error("Error fetching ministry:", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch ministry",
      error,
      500,
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ ministryId: string }> },
) {
  try {
    const session = await getSession();
    if (!session || !["admin", "super_admin"].includes(session.role)) {
      return errorResponse("UNAUTHORIZED", "Unauthorized access", null, 401);
    }

    const { ministryId } = await params;
    const body = await request.json();

    // Validate request body
    const validatedData = updateMinistrySchema.parse(body);

    // Update the document
    await updateDocument("ministries", ministryId, {
      ...validatedData,
      updatedAt: new Date().toISOString(),
    });

    const updatedMinistry = await getDocument<Ministry>(
      "ministries",
      ministryId,
    );

    return successResponse(updatedMinistry, "Ministry updated successfully");
  } catch (error: any) {
    console.error("Error updating ministry:", error);
    if (error.name === "ZodError") {
      return errorResponse("VALIDATION_ERROR", "Invalid data", error.errors);
    }
    return errorResponse(
      "INTERNAL_ERROR",
      "Failed to update ministry",
      error,
      500,
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ ministryId: string }> },
) {
  try {
    const session = await getSession();
    if (!session || !["admin", "super_admin"].includes(session.role)) {
      return errorResponse("UNAUTHORIZED", "Unauthorized access", null, 401);
    }

    const { ministryId } = await params;

    await deleteDocument("ministries", ministryId);

    return successResponse(null, "Ministry deleted successfully");
  } catch (error) {
    console.error("Error deleting ministry:", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Failed to delete ministry",
      error,
      500,
    );
  }
}
