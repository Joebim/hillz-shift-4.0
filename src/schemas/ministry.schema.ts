import { z } from "zod";

// Ministry Leader Schema
export const ministryLeaderSchema = z.object({
  name: z.string().min(1, "Leader name is required"),
  role: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  photo: z.string().url("Invalid photo URL").optional(),
  bio: z.string().optional(),
});

// Create Ministry Schema
export const createMinistrySchema = z.object({
  name: z.string().min(1, "Ministry name is required").max(100),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  description: z.string().min(1, "Description is required"),

  // Visual
  icon: z.string().min(1, "Icon is required"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
  image: z.string().url("Invalid image URL"),

  // Leadership
  leader: ministryLeaderSchema.optional(),

  // Details
  meetingSchedule: z.string().optional(),
  location: z.string().optional(),
  contactEmail: z.string().email("Invalid email").optional(),

  // Content
  activities: z.array(z.string()),

  // Metadata
  order: z.number().int().min(0),
  active: z.boolean().default(true),
});

// Update Ministry Schema
export const updateMinistrySchema = createMinistrySchema.partial();

// Export types
export type CreateMinistryInput = z.infer<typeof createMinistrySchema>;
export type UpdateMinistryInput = z.infer<typeof updateMinistrySchema>;
