import { NextResponse } from "next/server";
import { adminDb } from "@/src/lib/firebase/admin";
import { getSession } from "@/src/lib/auth/session";
import { Event } from "@/src/types/event";

/**
 * GET /api/events/active/analytics
 * Get analytics for the current active event (Registrations & Invitations)
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

    // 1. Find the target event for analytics (ongoing or most recently concluded)
    const now = new Date();
    const publishedEventsQuery = await adminDb
      .collection("events")
      .where("status", "==", "published")
      .get();

    if (publishedEventsQuery.empty) {
      return NextResponse.json({
        success: true,
        data: null,
        message: "No active published event found",
      });
    }

    let ongoingEventDoc: any = null;
    let mostRecentPastEventDoc: any = null;

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
      }
    });

    const eventDoc = ongoingEventDoc || mostRecentPastEventDoc;

    if (!eventDoc) {
      return NextResponse.json({
        success: true,
        data: null,
        message: "No valid ongoing or past event found",
      });
    }

    const event = { id: eventDoc.id, ...eventDoc.data() } as Event;

    // 2. Fetch all registrations and invitations for this event to build the graph
    // (In production, use pre-aggregated stats or limit by date/count)
    const [registrationsSnapshot, invitationsSnapshot] = await Promise.all([
      adminDb
        .collection("registrations")
        .where("eventId", "==", event.id)
        .get(),
      adminDb.collection("invitations").where("eventId", "==", event.id).get(),
    ]);

    // Helper: Group docs by date (YYYY-MM-DD)
    const groupByDate = (docs: FirebaseFirestore.QueryDocumentSnapshot[]) => {
      const counts: Record<string, number> = {};

      docs.forEach((doc) => {
        const data = doc.data();
        let dateObj: Date | null = null;

        // Handle various timestamp formats (Firestore Timestamp, Date, string)
        if (data.createdAt && typeof data.createdAt.toDate === "function") {
          dateObj = data.createdAt.toDate();
        } else if (data.createdAt instanceof Date) {
          dateObj = data.createdAt;
        } else if (typeof data.createdAt === "string") {
          dateObj = new Date(data.createdAt);
        }

        if (dateObj && !isNaN(dateObj.getTime())) {
          // Format as YYYY-MM-DD
          const key = dateObj.toISOString().split("T")[0];
          counts[key] = (counts[key] || 0) + 1;
        }
      });
      return counts;
    };

    const regCounts = groupByDate(registrationsSnapshot.docs);
    const invCounts = groupByDate(invitationsSnapshot.docs);

    // Helper to turn map into sorted series array
    const processSeries = (counts: Record<string, number>) => {
      // Sort by date key
      const sortedKeys = Object.keys(counts).sort();
      return sortedKeys.map((date) => ({
        x: date,
        y: counts[date],
      }));
    };

    // Construct analytics payload
    const analytics = {
      event: {
        id: event.id,
        title: event.title,
      },
      registrations: processSeries(regCounts),
      invitations: processSeries(invCounts),
    };

    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("Fetch active event analytics error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
