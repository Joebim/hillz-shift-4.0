import { Timestamp } from "firebase/firestore";

// Blog Types
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

  // Author
  author: BlogAuthor;

  // Media
  featuredImage: string;

  // Categorization
  category: string;
  tags: string[];

  // Publishing
  status: BlogStatus;
  publishedDate?: Timestamp | Date;

  // Metadata
  viewCount: number;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// Blog creation/update types
export type CreateBlogPostInput = Omit<
  BlogPost,
  "id" | "viewCount" | "createdAt" | "updatedAt"
>;
export type UpdateBlogPostInput = Partial<CreateBlogPostInput>;

// Blog filters
export interface BlogFilters {
  status?: BlogStatus | BlogStatus[];
  category?: string | string[];
  author?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
}
