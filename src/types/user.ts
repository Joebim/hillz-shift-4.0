import { Timestamp } from "firebase/firestore";

// User/Admin Types
export type UserRole = "super_admin" | "admin" | "moderator" | "event_manager";

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoUrl?: string;

  // Role & Permissions
  role: UserRole;
  managedEventId?: string; // For event_manager role
  permissions: string[];

  // Status
  active: boolean;
  lastLogin?: Timestamp | Date;

  // Metadata
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// User creation/update types
export type CreateUserInput = Omit<
  User,
  "id" | "lastLogin" | "createdAt" | "updatedAt"
>;
export type UpdateUserInput = Partial<CreateUserInput>;

// Auth types
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
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}
