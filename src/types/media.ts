import { Timestamp } from "firebase/firestore";

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

  uploadedBy: string;
  uploadedAt: Timestamp | Date;

  folder?: string;
  tags: string[];

  dimensions?: MediaDimensions;
}

export type CreateMediaInput = Omit<Media, "id" | "uploadedAt">;

export interface MediaFilters {
  folder?: string;
  fileType?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
}
