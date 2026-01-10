import { NextResponse } from "next/server";
import { db } from "@/src/lib/firebaseAdmin";
import { AdminAuthError, requireAdminSession } from "@/src/lib/adminSession";
import { Registration } from "@/src/types/Registration";
import { Invitation } from "@/src/types/Invitation";

export async function GET() {
  try {
    await requireAdminSession();

    const regSnapshot = await db.collection("registrations").get();
    const invSnapshot = await db.collection("invitations").get();

    const registrations: Registration[] = regSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Registration[];
    
    const invitations: Invitation[] = invSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Invitation[];

    // Calculate stats
    const totalRegistrations = registrations.length;
    const totalInvitations = invitations.length;

    // Top inviters calculation
    const inviterCounts: Record<string, number> = {};
    invitations.forEach((inv) => {
      const inviterName = inv.inviterName || 'Unknown';
      inviterCounts[inviterName] = (inviterCounts[inviterName] || 0) + 1;
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
  } catch (error: unknown) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json(
        { success: false, error: error.code },
        { status: error.code === "FORBIDDEN" ? 403 : 401 }
      );
    }
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
