import { NextResponse } from "next/server";
import { adminDb } from "@/src/lib/firebase/admin";
import { getSession } from "@/src/lib/auth/session";

/**
 * GET /api/events/metrics
 * Get global metrics for the events dashboard
 */
export async function GET() {
  try {
    // Check authentication
    const session = await getSession();
    if (
      !session ||
      !["super_admin", "admin", "editor"].includes(session.role)
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // 1. Find the target event for metrics (ongoing or most recently concluded)
    const now = new Date();
    const publishedEventsQuery = await adminDb
      .collection("events")
      .where("status", "==", "published")
      .get();

    let ongoingEventDoc: any = null;
    let mostRecentPastEventDoc: any = null;
    let nextUpcomingEventDoc: any = null;

    publishedEventsQuery.docs.forEach((doc) => {
      const data = doc.data();
      const startDate = data.startDate?.toDate
        ? data.startDate.toDate()
        : new Date(data.startDate);
      const endDate = data.endDate?.toDate
        ? data.endDate.toDate()
        : new Date(data.endDate);

      if (startDate <= now && endDate >= now) {
        if (!ongoingEventDoc) ongoingEventDoc = doc;
      } else if (endDate < now) {
        if (!mostRecentPastEventDoc) {
          mostRecentPastEventDoc = doc;
        } else {
          const prevEndDate = mostRecentPastEventDoc.data().endDate?.toDate
            ? mostRecentPastEventDoc.data().endDate.toDate()
            : new Date(mostRecentPastEventDoc.data().endDate);
          if (endDate.getTime() > prevEndDate.getTime()) {
            mostRecentPastEventDoc = doc;
          }
        }
      } else if (startDate > now) {
        if (!nextUpcomingEventDoc) {
          nextUpcomingEventDoc = doc;
        } else {
          const prevStartDate = nextUpcomingEventDoc.data().startDate?.toDate
            ? nextUpcomingEventDoc.data().startDate.toDate()
            : new Date(nextUpcomingEventDoc.data().startDate);
          if (startDate.getTime() < prevStartDate.getTime()) {
            nextUpcomingEventDoc = doc;
          }
        }
      }
    });

    const activeEventDoc =
      ongoingEventDoc || nextUpcomingEventDoc || mostRecentPastEventDoc;
    const activeEventId = activeEventDoc?.id;
    const activeEventData = activeEventDoc?.data();
    const activeEventTitle = activeEventData?.title || "No Event Found";

    // 2. Run remaining counts
    const [totalEventsSnapshot, invitationsSnapshot, registrationsSnapshot] =
      await Promise.all([
        adminDb.collection("events").count().get(),
        activeEventId
          ? adminDb
              .collection("invitations")
              .where("eventId", "==", activeEventId)
              .count()
              .get()
          : ({ data: () => ({ count: 0 }) } as any),
        activeEventId
          ? adminDb
              .collection("registrations")
              .where("eventId", "==", activeEventId)
              .count()
              .get()
          : ({ data: () => ({ count: 0 }) } as any),
      ]);

    const metrics = {
      totalEvents: totalEventsSnapshot.data().count,
      activeEvents: publishedEventsQuery.size,
      activeEventTitle,
      activeEventId,
      activeEventObj: activeEventData
        ? {
            id: activeEventId,
            title: activeEventTitle,
            status: activeEventData.status,
            startDate: activeEventData.startDate?.toDate
              ? activeEventData.startDate.toDate().toISOString()
              : activeEventData.startDate,
            endDate: activeEventData.endDate?.toDate
              ? activeEventData.endDate.toDate().toISOString()
              : activeEventData.endDate,
            registrationOpenDate: activeEventData.registrationOpenDate?.toDate
              ? activeEventData.registrationOpenDate.toDate().toISOString()
              : activeEventData.registrationOpenDate,
          }
        : null,
      totalInvitations: invitationsSnapshot.data().count,
      totalRegistrations: registrationsSnapshot.data().count,
    };

    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error("Fetch metrics error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch metrics" },
      { status: 500 },
    );
  }
}
