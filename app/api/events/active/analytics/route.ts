import { NextResponse } from "next/server";
import { adminDb } from "@/src/lib/firebase/admin";
import { getSession } from "@/src/lib/auth/session";
import { QueryDocumentSnapshot, DocumentData } from "firebase-admin/firestore";
import { Event } from "@/src/types/event";

export async function GET() {
  try {
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

    let ongoingEventDoc: QueryDocumentSnapshot<DocumentData> | null = null;
    let mostRecentPastEventDoc: QueryDocumentSnapshot<DocumentData> | null =
      null;

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

    const eventDoc = (ongoingEventDoc ||
      mostRecentPastEventDoc) as QueryDocumentSnapshot<DocumentData> | null;

    if (!eventDoc) {
      return NextResponse.json({
        success: true,
        data: null,
        message: "No valid ongoing or past event found",
      });
    }

    const event = { id: eventDoc.id, ...eventDoc.data() } as Event;

    const [registrationsSnapshot, invitationsSnapshot] = await Promise.all([
      adminDb
        .collection("registrations")
        .where("eventId", "==", event.id)
        .get(),
      adminDb.collection("invitations").where("eventId", "==", event.id).get(),
    ]);

    const groupByDate = (docs: FirebaseFirestore.QueryDocumentSnapshot[]) => {
      const counts: Record<string, number> = {};

      docs.forEach((doc) => {
        const data = doc.data();
        let dateObj: Date | null = null;

        if (data.createdAt && typeof data.createdAt.toDate === "function") {
          dateObj = data.createdAt.toDate();
        } else if (data.createdAt instanceof Date) {
          dateObj = data.createdAt;
        } else if (typeof data.createdAt === "string") {
          dateObj = new Date(data.createdAt);
        }

        if (dateObj && !isNaN(dateObj.getTime())) {
          const key = dateObj.toISOString().split("T")[0];
          counts[key] = (counts[key] || 0) + 1;
        }
      });
      return counts;
    };

    const regCounts = groupByDate(registrationsSnapshot.docs);
    const invCounts = groupByDate(invitationsSnapshot.docs);

    const processSeries = (counts: Record<string, number>) => {
      const sortedKeys = Object.keys(counts).sort();
      return sortedKeys.map((date) => ({
        x: date,
        y: counts[date],
      }));
    };

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
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
