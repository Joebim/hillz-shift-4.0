import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { getSession } from "@/src/lib/auth/session";
import { Event } from "@/src/types/event";
import { Registration } from "@/src/types/registration";
import { Invitation } from "@/src/types/invitation";

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

    const eventsSnapshot = await db
      .collection("events")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const events = eventsSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }) as unknown as Event)
      .filter(
        (e) =>
          e.title?.toLowerCase().includes(lowerQuery) ||
          e.description?.toLowerCase().includes(lowerQuery),
      )
      .slice(0, 5);

    const registrationsSnapshot = await db
      .collection("registrations")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();

    const registrations = registrationsSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }) as unknown as Registration)
      .filter(
        (r) =>
          r.name?.toLowerCase().includes(lowerQuery) ||
          r.email?.toLowerCase().includes(lowerQuery),
      )
      .slice(0, 5);

    const invitationsSnapshot = await db
      .collection("invitations")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();

    const invitations = invitationsSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }) as unknown as Invitation)
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
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
