import { Timestamp } from "firebase/firestore";

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

  attendee: RegistrationAttendee;
  name?: string;
  email?: string;

  status: RegistrationStatus;
  ticketType?: string;
  registrationDate: Timestamp | Date;
  confirmationCode: string;

  payment?: RegistrationPayment;

  invitedBy?: string;

  checkedIn: boolean;
  checkInTime?: Timestamp | Date;

  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export type CreateRegistrationInput = Omit<
  Registration,
  "id" | "confirmationCode" | "createdAt" | "updatedAt"
>;
export type UpdateRegistrationInput = Partial<
  Pick<Registration, "status" | "checkedIn" | "checkInTime" | "payment">
>;

export interface RegistrationFilters {
  eventId?: string;
  status?: RegistrationStatus | RegistrationStatus[];
  search?: string;
  startDate?: Date;
  endDate?: Date;
  ticketType?: string;
  checkedIn?: boolean;
}

export interface RegistrationWithEvent extends Registration {
  eventTitle: string;
  eventDate: Date;
  eventVenue: string;
}
