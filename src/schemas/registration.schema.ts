import { z } from "zod";

/**
 * ── DEFAULT FIELDS ────────────────────────────────────────────────────────────
 * Every registration always collects: firstName, lastName, email, phone.
 * These are non-negotiable defaults embedded in the attendee object.
 * Event-specific questions are stored in customFields.
 */

// Registration Attendee Schema
export const registrationAttendeeSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  // Custom event-specific answers — keyed by field label
  customFields: z.record(z.any()).default({}),
});

// Registration Payment Schema
export const registrationPaymentSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().length(3, "Currency must be 3 characters"),
  status: z.enum(["pending", "completed", "failed", "refunded"]),
  transactionId: z.string().optional(),
  paymentDate: z.coerce.date().optional(),
});

// Create Registration Schema
export const createRegistrationSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),

  // Attendee Info
  attendee: registrationAttendeeSchema,

  // Registration Details
  status: z
    .enum(["confirmed", "pending", "cancelled", "waitlist"])
    .default("pending"),
  ticketType: z.string().optional(),

  // Payment
  payment: registrationPaymentSchema.optional(),

  // Invitation tracking
  invitedBy: z.string().optional(),

  // Check-in
  checkedIn: z.boolean().default(false),
});

// Update Registration Schema
export const updateRegistrationSchema = z.object({
  status: z.enum(["confirmed", "pending", "cancelled", "waitlist"]).optional(),
  checkedIn: z.boolean().optional(),
  checkInTime: z.coerce.date().optional(),
  payment: registrationPaymentSchema.optional(),
});

// Registration Query Params Schema
export const registrationQuerySchema = z.object({
  eventId: z.string().optional(),
  status: z.enum(["confirmed", "pending", "cancelled", "waitlist"]).optional(),
  search: z.string().optional(),
  ticketType: z.string().optional(),
  checkedIn: z.coerce.boolean().optional(),
  page: z.coerce.number().positive().optional(),
  limit: z.coerce.number().positive().max(100).optional(),
});

// Export types
export type CreateRegistrationInput = z.infer<typeof createRegistrationSchema>;
export type UpdateRegistrationInput = z.infer<typeof updateRegistrationSchema>;
export type RegistrationQueryParams = z.infer<typeof registrationQuerySchema>;
