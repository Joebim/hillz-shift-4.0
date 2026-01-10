import { NextResponse } from "next/server";
import { db } from "@/src/lib/firebaseAdmin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase().trim() || "";

    // Fetch all registrations (participants)
    const snapshot = await db
      .collection("registrations")
      .orderBy("createdAt", "desc")
      .get();

    let participants = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name || "",
      email: doc.data().email || "",
      phone: doc.data().phone || "",
    }));

    // Filter by search query if provided
    if (search) {
      participants = participants.filter(
        (participant) =>
          participant.name.toLowerCase().includes(search) ||
          participant.email.toLowerCase().includes(search) ||
          participant.phone.toLowerCase().includes(search)
      );
    }

    // Limit results to 20 for performance
    participants = participants.slice(0, 20);

    return NextResponse.json({
      success: true,
      participants,
      total: participants.length,
    });
  } catch (error: any) {
    console.error("[API Participants] Error fetching participants:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch participants" },
      { status: 500 }
    );
  }
}
