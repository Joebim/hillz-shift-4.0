import { z } from "zod";

export const blogAuthorSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Author name is required"),
  photo: z.string().url("Invalid photo URL").optional(),
});

export const createBlogPostSchema = z.object({
  title: z.string().min(1, "Post title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  excerpt: z.string().min(1, "Excerpt is required").max(500),
  content: z.string().min(1, "Content is required"),

  author: blogAuthorSchema,

  featuredImage: z.string().url("Invalid featured image URL"),

  category: z.string().optional().default("general"),
  tags: z.array(z.string()).optional().default([]),

  status: z.enum(["draft", "published", "archived"]),
  publishedDate: z.coerce.date().optional(),
});

export const updateBlogPostSchema = createBlogPostSchema.partial();

export const blogQuerySchema = z.object({
  status: z.enum(["draft", "published", "archived"]).optional(),
  category: z.string().optional(),
  author: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().positive().optional(),
  limit: z.coerce.number().positive().max(100).optional(),
});

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
export type BlogQueryParams = z.infer<typeof blogQuerySchema>;
