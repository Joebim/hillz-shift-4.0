import { Timestamp } from "firebase/firestore";

export type InvitationStatus = "sent" | "opened" | "accepted" | "declined";

export interface Invitation {
  id: string;
  eventId: string;

  senderName: string; 
  senderEmail: string; 
  recipientName: string;
  recipientPhone: string;

  recipientEmail?: string;

  inviteeName?: string;
  inviteeEmail?: string;
  inviterName?: string;
  inviterEmail?: string;

  personalMessage?: string;
  customFields?: Record<string, unknown>;

  status: InvitationStatus;
  sentDate: Timestamp | Date;
  openedDate?: Timestamp | Date;
  respondedDate?: Timestamp | Date;

  invitationCode: string;
  registrationId?: string;

  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export type CreateInvitationInput = Omit<
  Invitation,
  "id" | "invitationCode" | "status" | "sentDate" | "createdAt" | "updatedAt"
>;
export type UpdateInvitationInput = Partial<
  Pick<Invitation, "status" | "openedDate" | "respondedDate" | "registrationId">
>;

export interface InvitationFilters {
  eventId?: string;
  status?: InvitationStatus | InvitationStatus[];
  search?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface InvitationWithEvent extends Invitation {
  eventTitle: string;
  eventDate: Date;
}
