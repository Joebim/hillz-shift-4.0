import { z } from "zod";

// Blog Author Schema
export const blogAuthorSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Author name is required"),
  photo: z.string().url("Invalid photo URL").optional(),
});

// Create Blog Post Schema
export const createBlogPostSchema = z.object({
  title: z.string().min(1, "Post title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  excerpt: z.string().min(1, "Excerpt is required").max(500),
  content: z.string().min(1, "Content is required"),

  // Author
  author: blogAuthorSchema,

  // Media
  featuredImage: z.string().url("Invalid featured image URL"),

  // Categorization
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()),

  // Publishing
  status: z.enum(["draft", "published", "archived"]),
  publishedDate: z.coerce.date().optional(),
});

// Update Blog Post Schema
export const updateBlogPostSchema = createBlogPostSchema.partial();

// Blog Query Params Schema
export const blogQuerySchema = z.object({
  status: z.enum(["draft", "published", "archived"]).optional(),
  category: z.string().optional(),
  author: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().positive().optional(),
  limit: z.coerce.number().positive().max(100).optional(),
});

// Export types
export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
export type BlogQueryParams = z.infer<typeof blogQuerySchema>;
