import { NextResponse } from "next/server";
import { createDocument } from "@/src/lib/firebase/firestore";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Basic validation
    if (!data.request) {
      return NextResponse.json(
        { success: false, error: "Prayer request is required" },
        { status: 400 },
      );
    }

    const requestId = await createDocument("prayer_requests", {
      ...data,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: { id: requestId } });
  } catch (error) {
    console.error("Prayer request error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit prayer request" },
      { status: 500 },
    );
  }
}
