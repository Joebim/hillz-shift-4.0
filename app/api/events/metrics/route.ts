import { NextResponse } from "next/server";
import { adminDb } from "@/src/lib/firebase/admin";
import { getSession } from "@/src/lib/auth/session";
import { getDocument } from "@/src/lib/firebase/firestore";
import { User } from "@/src/types/user";
import { QueryDocumentSnapshot, DocumentData } from "firebase-admin/firestore";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const now = new Date();
    const isEventScoped =
      session.role === "event_manager" || session.role === "moderator";

    // Resolve managed event IDs for scoped roles
    let scopedEventIds: string[] = [];
    if (isEventScoped) {
      const user = await getDocument<User>("users", session.userId);
      scopedEventIds = user?.managedEventIds?.length
        ? user.managedEventIds
        : user?.managedEventId
          ? [user.managedEventId]
          : [];
    }

    let publishedEventsQuery: FirebaseFirestore.QuerySnapshot<DocumentData>;

    if (isEventScoped && scopedEventIds.length > 0) {
      // Firestore "in" supports up to 30 values
      publishedEventsQuery = await adminDb
        .collection("events")
        .where("__name__", "in", scopedEventIds)
        .get();
    } else if (isEventScoped) {
      // No assigned events — return zero metrics
      return NextResponse.json({
        success: true,
        data: {
          totalEvents: 0,
          activeEvents: 0,
          activeEventTitle: "No Events Assigned",
          activeEventId: null,
          activeEventObj: null,
          totalInvitations: 0,
          totalRegistrations: 0,
          scopedEventIds: [],
        },
      });
    } else {
      publishedEventsQuery = await adminDb
        .collection("events")
        .where("status", "==", "published")
        .get();
    }

    let ongoingEventDoc: QueryDocumentSnapshot<DocumentData> | null = null;
    let mostRecentPastEventDoc: QueryDocumentSnapshot<DocumentData> | null =
      null;
    let nextUpcomingEventDoc: QueryDocumentSnapshot<DocumentData> | null = null;

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

    const activeEventDoc = (ongoingEventDoc ||
      nextUpcomingEventDoc ||
      mostRecentPastEventDoc) as QueryDocumentSnapshot<DocumentData> | null;
    const activeEventId = activeEventDoc?.id;
    const activeEventData = activeEventDoc?.data();
    const activeEventTitle = activeEventData?.title || "No Event Found";

    // For scoped roles: count across ALL assigned events; for admins: count for active event
    let totalInvitations = 0;
    let totalRegistrations = 0;

    if (isEventScoped && scopedEventIds.length > 0) {
      const [invSnaps, regSnaps] = await Promise.all([
        Promise.all(
          scopedEventIds.map((eid) =>
            adminDb
              .collection("invitations")
              .where("eventId", "==", eid)
              .count()
              .get(),
          ),
        ),
        Promise.all(
          scopedEventIds.map((eid) =>
            adminDb
              .collection("registrations")
              .where("eventId", "==", eid)
              .count()
              .get(),
          ),
        ),
      ]);
      totalInvitations = invSnaps.reduce((sum, s) => sum + s.data().count, 0);
      totalRegistrations = regSnaps.reduce((sum, s) => sum + s.data().count, 0);
    } else if (activeEventId) {
      const [invSnap, regSnap] = await Promise.all([
        adminDb
          .collection("invitations")
          .where("eventId", "==", activeEventId)
          .count()
          .get(),
        adminDb
          .collection("registrations")
          .where("eventId", "==", activeEventId)
          .count()
          .get(),
      ]);
      totalInvitations = invSnap.data().count;
      totalRegistrations = regSnap.data().count;
    }

    const totalEventsCount = isEventScoped
      ? scopedEventIds.length
      : (await adminDb.collection("events").count().get()).data().count;

    const metrics = {
      totalEvents: totalEventsCount,
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
      totalInvitations,
      totalRegistrations,
      // Pass scoped IDs back to the client so it knows which events to show
      scopedEventIds: isEventScoped ? scopedEventIds : null,
    };

    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch metrics" },
      { status: 500 },
    );
  }
}
