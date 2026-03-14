import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/src/lib/firebase/admin";
import { getSession } from "@/src/lib/auth/session";
import { formatDistanceToNow } from "date-fns";

const DEFAULT_LIMIT = 20;

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (
      !session ||
      ![
        "super_admin",
        "admin",
        "editor",
        "moderator",
        "event_manager",
      ].includes(session.role)
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT));
    const lastId = searchParams.get("lastId");

    let query = adminDb
      .collection("notifications")
      .orderBy("createdAt", "desc")
      .limit(limit);

    if (lastId) {
      const lastDoc = await adminDb
        .collection("notifications")
        .doc(lastId)
        .get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    const snapshot = await query.get();

    const notifications = snapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate
        ? data.createdAt.toDate()
        : new Date(data.createdAt);

      return {
        id: doc.id,
        actorName: data.actorName || "System",
        action: data.action || "",
        highlight: data.highlight || "",
        suffix: data.suffix || "",
        eventTitle: data.eventTitle || "",
        createdAt: createdAt.toISOString(),
        time: formatDistanceToNow(createdAt, { addSuffix: true }),
        read: data.read || false,
        type: data.type || "info",
        highlightColor: getHighlightColor(data.type),
      };
    });

    return NextResponse.json({
      success: true,
      data: notifications,
      hasMore: notifications.length === limit,
      lastId:
        notifications.length > 0
          ? notifications[notifications.length - 1].id
          : null,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}

function getHighlightColor(type: string): string {
  switch (type) {
    case "registration":
      return "text-violet-600 font-semibold";
    case "invitation":
      return "text-blue-500 font-semibold";
    case "system":
      return "text-amber-500 font-semibold";
    default:
      return "text-gray-900 font-semibold";
  }
}
