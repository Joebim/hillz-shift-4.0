import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { getSession } from "@/src/lib/auth/session";
import { User, CreateUserInput } from "@/src/types/user";
import admin from "firebase-admin";

// Initialize Firebase Admin (Singleton check)
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

// Helper to check for super_admin
async function isSuperAdmin(userId: string) {
  const userDoc = await db.collection("users").doc(userId).get();
  if (!userDoc.exists) return false;
  const userData = userDoc.data() as User;
  return userData.role === "super_admin";
}

// GET: List all users
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only super_admin or admin can list users
    if (session.role !== "super_admin" && session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const usersSnapshot = await db
      .collection("users")
      .orderBy("createdAt", "desc")
      .get();
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ data: users });
  } catch (error) {
    console.error("List users error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// POST: Create a new user (Invite) - Simplified creation
// For this MVP, we create a user document directly. User would sign in via Auth provider later? index by email
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only super_admin can create users/invites? Or admins too? Let's say Admin+
    if (session.role !== "super_admin" && session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { email, displayName, role, managedEventId } = body;

    if (!email || !displayName || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check uniqueness
    const existing = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();
    if (!existing.empty) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 },
      );
    }

    const newUser: Partial<User> = {
      email,
      displayName,
      role,
      managedEventId: managedEventId || null,
      permissions: [],
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      photoUrl: "",
    };

    // Note: In a real system, we'd also create an auth record in Firebase Auth
    // But the prompt just asks for CRUD endpoint logic to make functionality work.
    // We will store in Firestore 'users' which is what our app reads.
    // ID generation
    const newDocRef = db.collection("users").doc();
    await newDocRef.set({ id: newDocRef.id, ...newUser });

    return NextResponse.json({ data: { id: newDocRef.id, ...newUser } });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
