import { Timestamp } from "firebase/firestore";

// Invitation Types
export type InvitationStatus = "sent" | "opened" | "accepted" | "declined";

export interface Invitation {
  id: string;
  eventId: string;

  // ── Default fields — always collected ─────────────────────────────────
  senderName: string; // inviter's full name
  senderEmail: string; // inviter's email (may be synthetic for WhatsApp flows)
  recipientName: string; // guest full name
  recipientPhone: string; // guest phone / WhatsApp

  // Optional defaults
  recipientEmail?: string;

  // Legacy aliases (kept for backward compatibility)
  inviteeName?: string;
  inviteeEmail?: string;
  inviterName?: string;
  inviterEmail?: string;

  // Custom event-specific data
  personalMessage?: string;
  customFields?: Record<string, unknown>;

  // Status
  status: InvitationStatus;
  sentDate: Timestamp | Date;
  openedDate?: Timestamp | Date;
  respondedDate?: Timestamp | Date;

  // Tracking
  invitationCode: string;
  registrationId?: string;

  // Metadata
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// Invitation creation/update types
export type CreateInvitationInput = Omit<
  Invitation,
  "id" | "invitationCode" | "status" | "sentDate" | "createdAt" | "updatedAt"
>;
export type UpdateInvitationInput = Partial<
  Pick<Invitation, "status" | "openedDate" | "respondedDate" | "registrationId">
>;

// Invitation filters
export interface InvitationFilters {
  eventId?: string;
  status?: InvitationStatus | InvitationStatus[];
  search?: string;
  startDate?: Date;
  endDate?: Date;
}

// Invitation with event details
export interface InvitationWithEvent extends Invitation {
  eventTitle: string;
  eventDate: Date;
}
