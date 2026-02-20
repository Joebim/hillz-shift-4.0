import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { getSession } from "@/src/lib/auth/session";

// Init Firestore (assuming global stored or re-init safely)
// Note: In Next.js, it's better to have a singleton for admin, but for now we follow pattern
import admin from "firebase-admin";

if (admin.apps.length === 0) {
  if (process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
          /\\n/g,
          "\n",
        ),
      }),
    });
  }
}

const db = getFirestore();

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json({
        data: { events: [], registrations: [], invitations: [] },
      });
    }

    const lowerQuery = query.toLowerCase();

    // Perform parallel searches
    // Note: Firestore doesn't support native full-text search.
    // We will fetch recent items or simple prefix search if capable,
    // or client-side filter if dataset small, BUT for scalability we simulate a search
    // by fetching a reasonable batch and filtering in memory for this MVP.
    // A real app should use Algolia or ElasticSearch.

    // 1. Search Events (Title)
    const eventsSnapshot = await db
      .collection("events")
      .orderBy("createdAt", "desc")
      .limit(50) // Limit scan
      .get();

    const events = eventsSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }) as any)
      .filter(
        (e) =>
          e.title?.toLowerCase().includes(lowerQuery) ||
          e.description?.toLowerCase().includes(lowerQuery),
      )
      .slice(0, 5);

    // 2. Search Registrations (Name, Email)
    const registrationsSnapshot = await db
      .collection("registrations")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();

    const registrations = registrationsSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }) as any)
      .filter(
        (r) =>
          r.name?.toLowerCase().includes(lowerQuery) ||
          r.email?.toLowerCase().includes(lowerQuery),
      )
      .slice(0, 5);

    // 3. Search Invitations (Invitee Name)
    const invitationsSnapshot = await db
      .collection("invitations")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();

    const invitations = invitationsSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }) as any)
      .filter((i) => i.inviteeName?.toLowerCase().includes(lowerQuery))
      .slice(0, 5);

    return NextResponse.json({
      data: {
        events,
        registrations,
        invitations,
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
