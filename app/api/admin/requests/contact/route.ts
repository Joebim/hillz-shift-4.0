import { NextResponse } from "next/server";
import { queryDocuments } from "@/src/lib/firebase/firestore";

export async function GET() {
  try {
    const contacts = await queryDocuments(
      "contact_requests",
      {},
      "createdAt",
      100,
    );
    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    console.error("Error fetching contact requests:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contact requests" },
      { status: 500 },
    );
  }
}
