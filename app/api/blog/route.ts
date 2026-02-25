import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/src/lib/api/response";
import { queryDocuments, createDocument } from "@/src/lib/firebase/firestore";
import { getSession } from "@/src/lib/auth/session";
import { BlogPost } from "@/src/types/blog";
import {
  createBlogPostSchema,
  blogQuerySchema,
} from "@/src/schemas/blog.schema";
import { ZodError } from "zod";
import { generateSlug } from "@/src/lib/utils";

/**
 * GET /api/blog
 * List all published blog posts (public) or all posts (admin)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const queryParams = Object.fromEntries(searchParams.entries());
    const validated = blogQuerySchema.parse(queryParams);

    // Check if admin is authenticated
    const session = await getSession();
    const isAdmin =
      session && ["super_admin", "admin", "editor"].includes(session.role);

    // Build filters
    const filters: Record<string, unknown> = {};

    // If not admin, only show published posts
    if (!isAdmin) {
      filters.status = "published";
    } else if (validated.status) {
      filters.status = validated.status;
    }

    if (validated.category) {
      filters.category = validated.category;
    }

    if (validated.author) {
      filters["author.id"] = validated.author;
    }

    // Query blog posts
    const posts = await queryDocuments<BlogPost>(
      "blog",
      filters,
      "publishedDate",
      validated.limit || 50,
    );

    // Filter by search if provided
    let filteredPosts = posts;
    if (validated.search) {
      const searchLower = validated.search.toLowerCase();
      filteredPosts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower),
      );
    }

    return successResponse(filteredPosts);
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error.errors);
    }

    console.error("Fetch blog posts error:", error);
    return errorResponse(
      "FETCH_ERROR",
      "Failed to fetch blog posts",
      (error as Error).message,
    );
  }
}

/**
 * POST /api/blog
 * Create new blog post (admin only)
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

    // Generate slug if not provided
    if (!body.slug && body.title) {
      body.slug = generateSlug(body.title);
    }

    // Validate request body
    const validated = createBlogPostSchema.parse(body);

    // Create blog post
    const postId = await createDocument("blog", {
      ...validated,
      viewCount: 0,
    });

    return successResponse({ id: postId }, "Blog post created successfully");
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error.errors);
    }

    console.error("Create blog post error:", error);
    return errorResponse(
      "CREATE_ERROR",
      "Failed to create blog post",
      (error as Error).message,
    );
  }
}
