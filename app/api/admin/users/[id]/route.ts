import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/src/lib/firebase/admin";
import { getSession } from "@/src/lib/auth/session";
import { UserRole } from "@/src/types/user";

const db = adminDb;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Allow user to update their own profile (name, photo); admins can update anything
    const isSelf = session.userId === id;
    const isAdmin = session.role === "super_admin" || session.role === "admin";

    if (!isSelf && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    const updates: Record<string, unknown> = { updatedAt: new Date() };

    // Profile fields — any authenticated user can update their own
    if (body.displayName !== undefined) updates.displayName = body.displayName;
    if (body.photoUrl !== undefined) updates.photoUrl = body.photoUrl;

    // Admin-only fields
    if (isAdmin) {
      if (body.role) updates.role = body.role as UserRole;
      if (body.managedEventIds !== undefined)
        updates.managedEventIds = body.managedEventIds;
      if (body.managedEventId !== undefined)
        updates.managedEventId = body.managedEventId;
      if (body.active !== undefined) updates.active = body.active;
    }

    await db.collection("users").doc(id).update(updates);

    // Keep Firebase custom claims in sync when role changes
    if (isAdmin && body.role) {
      await adminAuth.setCustomUserClaims(id, { role: body.role });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    if (id === session.userId) {
      return NextResponse.json(
        { error: "Cannot delete self" },
        { status: 400 },
      );
    }

    await db.collection("users").doc(id).delete();

    // Also remove from Firebase Auth
    try {
      await adminAuth.deleteUser(id);
    } catch {
      // Auth user may not exist — ignore
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
