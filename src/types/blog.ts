import { Timestamp } from "firebase/firestore";

export type BlogStatus = "draft" | "published" | "archived";

export interface BlogAuthor {
  id: string;
  name: string;
  photo?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  readingTime?: string;

  author: BlogAuthor;

  featuredImage: string;

  category: string;
  tags: string[];

  status: BlogStatus;
  publishedDate?: Timestamp | Date;

  viewCount: number;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export type CreateBlogPostInput = Omit<
  BlogPost,
  "id" | "viewCount" | "createdAt" | "updatedAt"
>;
export type UpdateBlogPostInput = Partial<CreateBlogPostInput>;

export interface BlogFilters {
  status?: BlogStatus | BlogStatus[];
  category?: string | string[];
  author?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
}
