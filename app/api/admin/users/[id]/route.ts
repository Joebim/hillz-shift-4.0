import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { getSession } from "@/src/lib/auth/session";
import { UserRole } from "@/src/types/user";

const db = getFirestore();

// PATCH: Update user role / fields
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only super_admin can modify admin+ roles? Or generally restrict
    if (session.role !== "super_admin") {
      // Maybe restrict changing to/from super_admin unless super_admin
    }

    const { id } = await params;
    const body = await request.json();

    // Fields to update
    const updates: any = { updatedAt: new Date() };
    if (body.role) updates.role = body.role as UserRole;
    if (body.managedEventId) updates.managedEventId = body.managedEventId;
    if (body.active !== undefined) updates.active = body.active;
    if (body.displayName) updates.displayName = body.displayName;

    await db.collection("users").doc(id).update(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// DELETE: Remove user
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

    // Prevent self deletion?
    if (id === session.userId) {
      return NextResponse.json(
        { error: "Cannot delete self" },
        { status: 400 },
      );
    }

    await db.collection("users").doc(id).delete();

    // Also remove from Firebase Auth if synced? Scope out for now.

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
