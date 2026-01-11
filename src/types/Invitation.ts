export interface Invitation {
  id?: string;
  inviterName: string;
  inviteeName: string;
  inviteePhone: string;
  inviteeEmail?: string;
  location: string;
  customMessage: string;
  status: "sent" | "pending" | "registered";
  createdAt: string | Date;
}

export interface InvitationFormData {
  inviterName: string;
  inviteeName: string;
  inviteePhone: string;
  inviteeEmail: string;
  location: string;
  customMessage: string;
}
