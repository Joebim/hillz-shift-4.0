import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/firebaseAdmin";
import { getSession } from "@/src/lib/auth/session";
import { User, CreateUserInput } from "@/src/types/user";
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

async function isSuperAdmin(userId: string) {
  const userDoc = await db.collection("users").doc(userId).get();
  if (!userDoc.exists) return false;
  const userData = userDoc.data() as User;
  return userData.role === "super_admin";
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "super_admin" && session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { email, displayName, role, managedEventId } = body;

    if (!email || !displayName || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

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

    const newDocRef = db.collection("users").doc();
    await newDocRef.set({ id: newDocRef.id, ...newUser });

    return NextResponse.json({ data: { id: newDocRef.id, ...newUser } });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
