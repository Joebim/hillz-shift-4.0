import { NextRequest, NextResponse } from "next/server";
import {
  getDocument,
  updateDocument,
  deleteDocument,
} from "@/src/lib/firebase/firestore";
import { getSession } from "@/src/lib/auth/session";
import { BlogPost } from "@/src/types/blog";
import { updateBlogPostSchema } from "@/src/schemas/blog.schema";
import { successResponse, errorResponse } from "@/src/lib/api/response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const { postId } = await params;

    // In admin mode or if public but fetching by ID, we might need auth check if it's a draft?
    // For simplicity, allow fetching any post by ID, but maybe hide drafts if not admin?
    // Let's just return the post. The frontend can decide what to show based on status.
    const post = await getDocument<BlogPost>("blog", postId);

    if (!post) {
      return errorResponse("POST_NOT_FOUND", "Blog post not found", null, 404);
    }

    return successResponse(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Failed to fetch blog post",
      error,
      500,
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const session = await getSession();
    if (
      !session ||
      !["admin", "super_admin", "editor"].includes(session.role)
    ) {
      return errorResponse("UNAUTHORIZED", "Unauthorized access", null, 401);
    }

    const { postId } = await params;
    const body = await request.json();

    // Validate request body
    const validatedData = updateBlogPostSchema.parse(body);

    // Update the document
    await updateDocument("blog", postId, {
      ...validatedData,
      updatedAt: new Date().toISOString(),
    });

    // Return the updated document data (or at least success)
    const updatedPost = await getDocument<BlogPost>("blog", postId);

    return successResponse(updatedPost, "Blog post updated successfully");
  } catch (error: any) {
    console.error("Error updating blog post:", error);
    if (error.name === "ZodError") {
      return errorResponse("VALIDATION_ERROR", "Invalid data", error.errors);
    }
    return errorResponse(
      "INTERNAL_ERROR",
      "Failed to update blog post",
      error,
      500,
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const session = await getSession();
    if (!session || !["admin", "super_admin"].includes(session.role)) {
      return errorResponse("UNAUTHORIZED", "Unauthorized access", null, 401);
    }

    const { postId } = await params;

    await deleteDocument("blog", postId);

    return successResponse(null, "Blog post deleted successfully");
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Failed to delete blog post",
      error,
      500,
    );
  }
}
