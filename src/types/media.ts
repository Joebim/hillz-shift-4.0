import { Timestamp } from "firebase/firestore";

// Media Types
export type MediaFileType = "image" | "video" | "audio" | "document";

export interface MediaDimensions {
  width: number;
  height: number;
}

export interface Media {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;

  // Metadata
  uploadedBy: string;
  uploadedAt: Timestamp | Date;

  // Organization
  folder?: string;
  tags: string[];

  // Image-specific
  dimensions?: MediaDimensions;
}

// Media creation type
export type CreateMediaInput = Omit<Media, "id" | "uploadedAt">;

// Media filters
export interface MediaFilters {
  folder?: string;
  fileType?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
}
