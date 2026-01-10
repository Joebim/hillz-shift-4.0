import { NextResponse } from "next/server";
import { db } from "@/src/lib/firebaseAdmin";
import { AdminAuthError, requireAdminSession } from "@/src/lib/adminSession";

export async function GET() {
  try {
    await requireAdminSession();

    const regSnapshot = await db.collection("registrations").get();
    const invSnapshot = await db.collection("invitations").get();

    const registrations = regSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const invitations = invSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Calculate stats
    const totalRegistrations = registrations.length;
    const totalInvitations = invitations.length;

    // Top inviters calculation
    const inviterCounts: Record<string, number> = {};
    invitations.forEach((inv: any) => {
      inviterCounts[inv.inviterName] =
        (inviterCounts[inv.inviterName] || 0) + 1;
    });

    const topInviters = Object.entries(inviterCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      totalRegistrations,
      totalInvitations,
      topInviters,
      registrations,
      invitations,
    });
  } catch (error: any) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json(
        { success: false, error: error.code },
        { status: error.code === "FORBIDDEN" ? 403 : 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
