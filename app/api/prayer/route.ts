import { NextResponse } from "next/server";
import { createDocument } from "@/src/lib/firebase/firestore";
import { createAdminNotification } from "@/src/lib/notification";

export async function POST(req: Request) {
  try {
    const data = await req.json();

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

    await createAdminNotification({
      type: "prayer",
      actorName: data.name || "Anonymous",
      action: "submitted a prayer request",
      highlight: data.category || "General",
      suffix: "",
    });

    return NextResponse.json({ success: true, data: { id: requestId } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to submit prayer request" },
      { status: 500 },
    );
  }
}
