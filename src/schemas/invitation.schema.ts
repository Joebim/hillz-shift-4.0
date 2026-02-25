import { z } from "zod";

/**
 * ── DEFAULT FIELDS ────────────────────────────────────────────────────────────
 * Every invitation always collects:
 *   - senderName   (inviter's name)
 *   - recipientName (guest's name)
 *   - recipientPhone (guest's phone / WhatsApp)
 *   - recipientEmail (guest's email — optional)
 *   - personalMessage (invitation note)
 * These are non-negotiable defaults.
 * Event-specific questions are stored in customFields.
 */

// Create Invitation Schema
export const createInvitationSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),

  // Default: Sender (inviter)
  senderName: z.string().min(1, "Sender name is required").max(100),
  senderEmail: z.string().email("Invalid sender email"),

  // Default: Recipient (guest) — name + phone required
  recipientName: z.string().min(1, "Guest name is required").max(100),
  recipientPhone: z
    .string()
    .min(10, "Invalid phone number")
    .optional()
    .or(z.literal("")),

  // Default: recipient email (optional)
  recipientEmail: z
    .string()
    .email("Invalid recipient email")
    .optional()
    .or(z.literal("")),

  // Default: personal message
  personalMessage: z.string().max(1000).optional(),

  // Custom event-specific answers — keyed by field label
  customFields: z.record(z.any()).optional(),
});

// Update Invitation Schema
export const updateInvitationSchema = z.object({
  status: z.enum(["sent", "opened", "accepted", "declined"]).optional(),
  openedDate: z.coerce.date().optional(),
  respondedDate: z.coerce.date().optional(),
  registrationId: z.string().optional(),
});

// Accept Invitation Schema
export const acceptInvitationSchema = z.object({
  invitationCode: z.string().min(1, "Invitation code is required"),
  attendee: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Invalid phone number"),
    customFields: z.record(z.any()).optional(),
  }),
});

// Invitation Query Params Schema
export const invitationQuerySchema = z.object({
  eventId: z.string().optional(),
  status: z.enum(["sent", "opened", "accepted", "declined"]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().positive().optional(),
  limit: z.coerce.number().positive().max(100).optional(),
});

// Export types
export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
export type UpdateInvitationInput = z.infer<typeof updateInvitationSchema>;
export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;
export type InvitationQueryParams = z.infer<typeof invitationQuerySchema>;
