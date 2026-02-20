import { Timestamp } from "firebase/firestore";

// Ministry Types
export interface MinistryLeader {
  name: string;
  role?: string;
  email?: string;
  photo?: string;
  bio?: string;
}

export interface Ministry {
  id: string;
  name: string;
  slug: string;
  description: string;

  // Visual
  icon: string;
  color: string;
  image: string;

  // Leadership
  leader?: MinistryLeader;

  // Details
  meetingSchedule?: string;
  location?: string;
  contactEmail?: string;

  // Content
  activities: string[];

  // Metadata
  order: number;
  active: boolean;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// Ministry creation/update types
export type CreateMinistryInput = Omit<
  Ministry,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateMinistryInput = Partial<CreateMinistryInput>;
