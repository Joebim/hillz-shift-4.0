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

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (
      !session ||
      !["super_admin", "admin", "editor"].includes(session.role)
    ) {
      return unauthorizedResponse("Admin access required");
    }

    const totalEvents = await countDocuments("events");

    const activeEvents = await countDocuments("events", {
      status: "published",
    });

    const totalRegistrations = await countDocuments("registrations");

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

    const pendingInvitations = await countDocuments("invitations", {
      status: "sent",
    });

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
    return errorResponse(
      "ANALYTICS_ERROR",
      "Failed to fetch dashboard statistics",
      (error as Error).message,
    );
  }
}
