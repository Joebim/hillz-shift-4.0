
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface SearchParams {
  search?: string;
}

export interface DashboardStats {
  totalEvents: number;
  activeEvents: number;
  totalRegistrations: number;
  monthlyRegistrations: number;
  pendingInvitations: number;
  totalAttendance: number;
}

export interface EventAnalytics {
  eventId: string;
  totalRegistrations: number;
  registrationsByDate: Array<{
    date: string;
    count: number;
  }>;
  registrationsByTicketType: Array<{
    ticketType: string;
    count: number;
  }>;
  invitationStats: {
    sent: number;
    opened: number;
    accepted: number;
    declined: number;
  };
  registrationSources: Array<{
    source: string;
    count: number;
  }>;
}

export interface RegistrationTrend {
  date: string;
  count: number;
}

export interface CategoryStats {
  category: string;
  count: number;
}
