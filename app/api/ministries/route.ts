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

export async function GET() {
  try {
    const session = await getSession();
    const isAdmin =
      session && ["super_admin", "admin", "editor"].includes(session.role);

    const filters: Record<string, unknown> = {};

    if (!isAdmin) {
      filters.active = true;
    }

    const ministries = await queryDocuments<Ministry>(
      "ministries",
      filters,
      "order",
      100,
    );

    return successResponse(ministries);
  } catch (error) {
    return errorResponse(
      "FETCH_ERROR",
      "Failed to fetch ministries",
      (error as Error).message,
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !["super_admin", "admin"].includes(session.role)) {
      return unauthorizedResponse("Admin access required");
    }

    const body = await request.json();

    if (!body.slug && body.name) {
      body.slug = generateSlug(body.name);
    }

    const validated = createMinistrySchema.parse(body);

    const ministryId = await createDocument("ministries", validated);

    return successResponse({ id: ministryId }, "Ministry created successfully");
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error.errors);
    }

    return errorResponse(
      "CREATE_ERROR",
      "Failed to create ministry",
      (error as Error).message,
    );
  }
}
