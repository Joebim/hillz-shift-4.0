import { Timestamp } from "firebase/firestore";

export type SermonMediaType = "audio" | "video" | "both";
export type SermonCategory =
  | "sunday_service"
  | "bible_study"
  | "special_event"
  | "conference"
  | "other";

export interface Sermon {
  id: string;
  title: string;
  slug: string;
  description: string;

  speaker: string;
  series?: string;
  scripture: string;
  date: Timestamp | Date;

  mediaType: SermonMediaType;
  audioUrl?: string;
  videoUrl?: string;
  thumbnailUrl: string;
  duration?: number;

  tags: string[];
  category: SermonCategory;
  featured: boolean;
  viewCount: number;

  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  createdBy: string;
}

export type CreateSermonInput = Omit<
  Sermon,
  "id" | "viewCount" | "createdAt" | "updatedAt" | "createdBy"
>;
export type UpdateSermonInput = Partial<CreateSermonInput>;

export interface SermonFilters {
  category?: SermonCategory | SermonCategory[];
  speaker?: string;
  series?: string;
  featured?: boolean;
  search?: string;
  startDate?: Date;
  endDate?: Date;
}
