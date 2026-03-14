import { Timestamp } from "firebase/firestore";

export type UserRole = "super_admin" | "admin" | "moderator" | "event_manager";

/** Roles that have access to Settings page and higher-level admin features */
export const ADMIN_ROLES: UserRole[] = ["super_admin", "admin"];

/** Roles that are scoped to specific event(s) */
export const EVENT_SCOPED_ROLES: UserRole[] = ["event_manager", "moderator"];

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoUrl?: string;

  role: UserRole;
  /** Single event (legacy) */
  managedEventId?: string | null;
  /** Multi-event support */
  managedEventIds?: string[];
  permissions: string[];

  active: boolean;
  lastLogin?: Timestamp | Date;

  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export type CreateUserInput = Omit<
  User,
  "id" | "lastLogin" | "createdAt" | "updatedAt"
>;
export type UpdateUserInput = Partial<CreateUserInput>;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  role: UserRole;
  expiresAt: number;
}

export interface SessionUser extends AuthSession {
  displayName: string;
  photoUrl: string | null;
  managedEventIds?: string[];
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}
