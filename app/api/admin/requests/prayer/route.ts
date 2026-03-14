import { NextResponse } from "next/server";
import { queryDocuments } from "@/src/lib/firebase/firestore";

export async function GET() {
  try {
    const prayers = await queryDocuments(
      "prayer_requests",
      {},
      "createdAt",
      100,
    );
    return NextResponse.json({ success: true, data: prayers });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch prayer requests" },
      { status: 500 },
    );
  }
}
