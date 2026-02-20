import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
} from "@/src/lib/api/response";
import { getSession } from "@/src/lib/auth/session";
import { queryDocuments, countDocuments } from "@/src/lib/firebase/firestore";
import { Event } from "@/src/types/event";
import { Registration } from "@/src/types/registration";
import { DashboardStats } from "@/src/types/api";

import { toJsDate } from "@/src/lib/utils";

/**
 * GET /api/analytics/dashboard
 * Get dashboard statistics (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (
      !session ||
      !["super_admin", "admin", "editor"].includes(session.role)
    ) {
      return unauthorizedResponse("Admin access required");
    }

    // Get total events
    const totalEvents = await countDocuments("events");

    // Get active events (published, upcoming, ongoing)
    const activeEvents = await countDocuments("events", {
      status: "published",
    });

    // Get total registrations
    const totalRegistrations = await countDocuments("registrations");

    // Get monthly registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const allRegistrations = await queryDocuments<Registration>(
      "registrations",
      {},
      "registrationDate",
    );
    const monthlyRegistrations = allRegistrations.filter((reg) => {
      const regDate = toJsDate(reg.registrationDate);
      return regDate >= thirtyDaysAgo;
    }).length;

    // Get pending invitations
    const pendingInvitations = await countDocuments("invitations", {
      status: "sent",
    });

    // Calculate total attendance (checked-in registrations)
    const totalAttendance = await countDocuments("registrations", {
      checkedIn: true,
    });

    const stats: DashboardStats = {
      totalEvents,
      activeEvents,
      totalRegistrations,
      monthlyRegistrations,
      pendingInvitations,
      totalAttendance,
    };

    return successResponse(stats);
  } catch (error) {
    console.error("Dashboard analytics error:", error);
    return errorResponse(
      "ANALYTICS_ERROR",
      "Failed to fetch dashboard statistics",
      (error as Error).message,
    );
  }
}
