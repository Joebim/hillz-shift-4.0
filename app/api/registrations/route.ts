import { NextResponse } from "next/server";
import { db } from "@/src/lib/firebaseAdmin";
import { sendEmail } from "@/src/lib/email";
import { registrationTemplate } from "@/src/templates/email/invitationTemplate";
import { AdminAuthError, requireAdminSession } from "@/src/lib/adminSession";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  const requestId = randomUUID();
  try {
    console.log("[registrations:POST] start", { requestId });
    const data = await request.json();
    const {
      name,
      email,
      phone,
      address,
      whoInvited,
      heardFrom,
      joiningMethod,
    } = data;
    console.log("[registrations:POST] payload", {
      requestId,
      name,
      email: typeof email === "string" ? email : null,
      hasPhone: Boolean(phone),
      hasAddress: Boolean(address),
      hasWhoInvited: Boolean(whoInvited),
      heardFrom,
      joiningMethod,
    });

    // Save to Firestore
    const docRef = await db.collection("registrations").add({
      name,
      email,
      phone,
      address,
      whoInvited,
      heardFrom,
      joiningMethod,
      createdAt: new Date().toISOString(),
    });
    console.log("[registrations:POST] saved", { requestId, id: docRef.id });

    // Send confirmation email
    const emailResult = await sendEmail({
      to: email,
      subject: "Registration Confirmed - Hillz Shift 4.0",
      html: registrationTemplate(name),
      context: { requestId, purpose: "registration_confirmation" },
    });
    console.log("[registrations:POST] email_result", {
      requestId,
      success: emailResult.success,
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to process registration";
    console.error("[registrations:POST] error", { requestId, errorMessage });
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await requireAdminSession();

    const snapshot = await db
      .collection("registrations")
      .orderBy("createdAt", "desc")
      .get();
    const registrations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(registrations);
  } catch (error: unknown) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json(
        { success: false, error: error.code },
        { status: error.code === "FORBIDDEN" ? 403 : 401 }
      );
    }
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch registrations";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
