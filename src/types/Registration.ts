import { Timestamp } from "firebase/firestore";

// Registration Types
export type RegistrationStatus =
  | "confirmed"
  | "pending"
  | "cancelled"
  | "waitlist";

export interface RegistrationAttendee {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  customFields: Record<string, unknown>;
}

export interface RegistrationPayment {
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId?: string;
  paymentDate?: Timestamp | Date;
}

export interface Registration {
  id: string;
  eventId: string;

  // Attendee Info
  attendee: RegistrationAttendee;
  name?: string;
  email?: string;

  // Registration Details
  status: RegistrationStatus;
  ticketType?: string;
  registrationDate: Timestamp | Date;
  confirmationCode: string;

  // Payment (if applicable)
  payment?: RegistrationPayment;

  // Invitation tracking
  invitedBy?: string;

  // Check-in (future feature)
  checkedIn: boolean;
  checkInTime?: Timestamp | Date;

  // Metadata
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// Registration creation/update types
export type CreateRegistrationInput = Omit<
  Registration,
  "id" | "confirmationCode" | "createdAt" | "updatedAt"
>;
export type UpdateRegistrationInput = Partial<
  Pick<Registration, "status" | "checkedIn" | "checkInTime" | "payment">
>;

// Registration filters
export interface RegistrationFilters {
  eventId?: string;
  status?: RegistrationStatus | RegistrationStatus[];
  search?: string;
  startDate?: Date;
  endDate?: Date;
  ticketType?: string;
  checkedIn?: boolean;
}

// Registration with event details
export interface RegistrationWithEvent extends Registration {
  eventTitle: string;
  eventDate: Date;
  eventVenue: string;
}
