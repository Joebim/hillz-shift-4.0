import { z } from "zod";

// Base Sermon Object Schema
export const sermonBaseSchema = z.object({
  title: z.string().min(1, "Sermon title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  description: z.string().min(1, "Description is required"),

  // Content
  speaker: z.string().min(1, "Speaker name is required"),
  series: z.string().optional(),
  scripture: z.string().min(1, "Scripture reference is required"),
  date: z.coerce.date(),

  // Media
  mediaType: z.enum(["audio", "video", "both"]),
  audioUrl: z.string().url("Invalid audio URL").optional(),
  videoUrl: z.string().url("Invalid video URL").optional(),
  thumbnailUrl: z.string().url("Invalid thumbnail URL"),
  duration: z.number().positive().optional(),

  // Metadata
  tags: z.array(z.string()).optional().default([]),
  category: z
    .enum([
      "sunday_service",
      "bible_study",
      "special_event",
      "conference",
      "other",
    ])
    .optional()
    .default("other"),
  featured: z.boolean().default(false),
});

// Create Sermon Schema (with refinements)
export const createSermonSchema = sermonBaseSchema.refine(
  (data) => {
    if (data.mediaType === "audio" && !data.audioUrl) {
      return false;
    }
    if (data.mediaType === "video" && !data.videoUrl) {
      return false;
    }
    if (data.mediaType === "both" && (!data.audioUrl || !data.videoUrl)) {
      return false;
    }
    return true;
  },
  {
    message: "Media URL required based on media type",
    path: ["mediaType"],
  },
);

// Update Sermon Schema
export const updateSermonSchema = sermonBaseSchema.partial();

// Sermon Query Params Schema
export const sermonQuerySchema = z.object({
  category: z
    .enum([
      "sunday_service",
      "bible_study",
      "special_event",
      "conference",
      "other",
    ])
    .optional(),
  speaker: z.string().optional(),
  series: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  search: z.string().optional(),
  page: z.coerce.number().positive().optional(),
  limit: z.coerce.number().positive().max(100).optional(),
});

// Export types
export type CreateSermonInput = z.infer<typeof createSermonSchema>;
export type UpdateSermonInput = z.infer<typeof updateSermonSchema>;
export type SermonQueryParams = z.infer<typeof sermonQuerySchema>;
