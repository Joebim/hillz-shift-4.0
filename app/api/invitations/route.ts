import { NextResponse } from "next/server";
import { db } from "@/src/lib/firebaseAdmin";
import { sendEmail } from "@/src/lib/email";
import { invitationTemplate } from "@/src/templates/email/invitationTemplate";
import { AdminAuthError, requireAdminSession } from "@/src/lib/adminSession";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  const requestId = randomUUID();
  try {
    console.log("[invitations:POST] start", { requestId });
    const data = await request.json();
    const {
      inviterName,
      inviteeName,
      inviteePhone,
      inviteeEmail,
      location,
      customMessage,
    } = data;

    console.log("[invitations:POST] payload", {
      requestId,
      inviterName,
      inviteeName,
      hasInviteePhone: Boolean(inviteePhone),
      hasInviteeEmail: Boolean(inviteeEmail),
      location,
      hasCustomMessage: Boolean(customMessage),
    });

    // Validate required fields
    if (!inviteeEmail || !inviteeEmail.trim()) {
      const errorMsg = "Email of invitee is required";
      console.error("[invitations:POST] validation_error", { requestId, error: errorMsg });
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 400 }
      );
    }

    // Save to Firestore
    const docRef = await db.collection("invitations").add({
      inviterName,
      inviteeName,
      inviteePhone,
      inviteeEmail: inviteeEmail.trim(),
      location,
      customMessage,
      status: "sent",
      createdAt: new Date().toISOString(),
    });
    console.log("[invitations:POST] saved", { requestId, id: docRef.id });

    // Registration link (replace with actual domain)
    const registrationLink = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/register?ref=${docRef.id}`;
    console.log("[invitations:POST] registration_link", { requestId, registrationLink });

    // Send invitation email (now required)
    const emailResult = await sendEmail({
      to: inviteeEmail.trim(),
      subject: `You're Invited to Hillz Shift 4.0 by ${inviterName}`,
      html: invitationTemplate(inviteeName, inviterName, customMessage, registrationLink),
      context: { requestId, purpose: "invitation" },
    });
    console.log("[invitations:POST] email_result", {
      requestId,
      success: emailResult.success,
    });

    return NextResponse.json({ 
      success: true, 
      id: docRef.id,
      registrationLink,
      hasEmail: true
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to send invitation";
    console.error("[invitations:POST] error", { requestId, errorMessage });
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
      .collection("invitations")
      .orderBy("createdAt", "desc")
      .get();
    const invitations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(invitations);
  } catch (error: unknown) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json(
        { success: false, error: error.code },
        { status: error.code === "FORBIDDEN" ? 403 : 401 }
      );
    }
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch invitations";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
