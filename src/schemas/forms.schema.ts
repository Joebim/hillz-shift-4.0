import { z } from "zod";

// Contact Form Schema
export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number").optional(),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(1, "Message is required").max(2000),
});

// Prayer Request Schema
export const prayerRequestSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number").optional(),
  requestType: z.enum([
    "personal",
    "family",
    "health",
    "financial",
    "spiritual",
    "other",
  ]),
  message: z.string().min(1, "Prayer request is required").max(2000),
  isUrgent: z.boolean().default(false),
  allowPublic: z.boolean().default(false),
});

// Newsletter Subscription Schema
export const newsletterSubscriptionSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required").max(100).optional(),
  preferences: z
    .object({
      weeklyUpdates: z.boolean().default(true),
      eventNotifications: z.boolean().default(true),
      sermonReleases: z.boolean().default(true),
    })
    .optional(),
});

// Export types
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type PrayerRequestInput = z.infer<typeof prayerRequestSchema>;
export type NewsletterSubscriptionInput = z.infer<
  typeof newsletterSubscriptionSchema
>;
