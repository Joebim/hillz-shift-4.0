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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const queryParams = Object.fromEntries(searchParams.entries());
    const validated = blogQuerySchema.parse(queryParams);

    const session = await getSession();
    const isAdmin =
      session && ["super_admin", "admin", "editor"].includes(session.role);

    const filters: Record<string, unknown> = {};

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

    const posts = await queryDocuments<BlogPost>(
      "blog",
      filters,
      "publishedDate",
      validated.limit || 50,
    );

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

    return errorResponse(
      "FETCH_ERROR",
      "Failed to fetch blog posts",
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

    const validated = createBlogPostSchema.parse(body);

    const postId = await createDocument("blog", {
      ...validated,
      viewCount: 0,
    });

    return successResponse({ id: postId }, "Blog post created successfully");
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error.errors);
    }

    return errorResponse(
      "CREATE_ERROR",
      "Failed to create blog post",
      (error as Error).message,
    );
  }
}
