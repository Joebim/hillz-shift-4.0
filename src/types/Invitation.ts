import { Timestamp } from "firebase/firestore";

// Invitation Types
export type InvitationStatus = "sent" | "opened" | "accepted" | "declined";

export interface Invitation {
  id: string;
  eventId: string;

  // Sender Info
  senderName: string;
  senderEmail: string;

  // Recipient Info
  recipientEmail: string;
  recipientName?: string;
  personalMessage?: string;
  customFields?: Record<string, any>;

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
