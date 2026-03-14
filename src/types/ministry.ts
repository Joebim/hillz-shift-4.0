import { Timestamp } from "firebase/firestore";

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
  category?: string;

  icon: string;
  color: string;
  image: string;

  leader?: MinistryLeader;

  meetingSchedule?: string;
  location?: string;
  contactEmail?: string;

  activities: string[];

  order: number;
  active: boolean;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export type CreateMinistryInput = Omit<
  Ministry,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateMinistryInput = Partial<CreateMinistryInput>;
