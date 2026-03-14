import { z } from "zod";

export const ministryLeaderSchema = z.object({
  name: z.string().min(1, "Leader name is required"),
  role: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  photo: z.string().url("Invalid photo URL").optional(),
  bio: z.string().optional(),
});

export const createMinistrySchema = z.object({
  name: z.string().min(1, "Ministry name is required").max(100),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  description: z.string().min(1, "Description is required"),
  category: z.string().optional(),

  icon: z.string().min(1, "Icon is required"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
  image: z.string().url("Invalid image URL"),

  leader: ministryLeaderSchema.optional(),

  meetingSchedule: z.string().optional(),
  location: z.string().optional(),
  contactEmail: z.string().email("Invalid email").optional(),

  activities: z.array(z.string()).optional().default([]),

  order: z.number().int().min(0).optional().default(0),
  active: z.boolean().default(true),
});

export const updateMinistrySchema = createMinistrySchema.partial();

export type CreateMinistryInput = z.infer<typeof createMinistrySchema>;
export type UpdateMinistryInput = z.infer<typeof updateMinistrySchema>;
