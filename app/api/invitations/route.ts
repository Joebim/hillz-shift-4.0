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
    if (!inviterName || !inviterName.trim()) {
      const errorMsg = "Inviter name is required";
      console.error("[invitations:POST] validation_error", {
        requestId,
        error: errorMsg,
      });
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 400 }
      );
    }

    if (!inviteeName || !inviteeName.trim()) {
      const errorMsg = "Invitee name is required";
      console.error("[invitations:POST] validation_error", {
        requestId,
        error: errorMsg,
      });
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 400 }
      );
    }

    if (!inviteePhone || !inviteePhone.trim()) {
      const errorMsg = "WhatsApp number is required";
      console.error("[invitations:POST] validation_error", {
        requestId,
        error: errorMsg,
      });
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 400 }
      );
    }

    if (!location || !location.trim()) {
      const errorMsg = "Location is required";
      console.error("[invitations:POST] validation_error", {
        requestId,
        error: errorMsg,
      });
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 400 }
      );
    }

    if (!customMessage || !customMessage.trim()) {
      const errorMsg = "Custom message is required";
      console.error("[invitations:POST] validation_error", {
        requestId,
        error: errorMsg,
      });
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 400 }
      );
    }

    // Validate email format if provided (email is optional)
    const trimmedEmail = inviteeEmail?.trim();
    if (trimmedEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        const errorMsg = "Invalid email format";
        console.error("[invitations:POST] validation_error", {
          requestId,
          error: errorMsg,
        });
        return NextResponse.json(
          { success: false, error: errorMsg },
          { status: 400 }
        );
      }
    }

    // Save to Firestore
    const docRef = await db.collection("invitations").add({
      inviterName,
      inviteeName,
      inviteePhone,
      inviteeEmail: trimmedEmail || "",
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
    console.log("[invitations:POST] registration_link", {
      requestId,
      registrationLink,
    });

    // Send invitation email only if email is provided
    let emailResult = null;
    if (trimmedEmail) {
      emailResult = await sendEmail({
        to: trimmedEmail,
        subject: `You're Invited to Hillz Shift 4.0 by ${inviterName}`,
        html: invitationTemplate(
          inviteeName,
          inviterName,
          customMessage,
          registrationLink
        ),
        context: { requestId, purpose: "invitation" },
      });
      console.log("[invitations:POST] email_result", {
        requestId,
        success: emailResult.success,
      });
    } else {
      console.log("[invitations:POST] email_skipped", {
        requestId,
        reason: "no_email_provided",
      });
    }

    return NextResponse.json({
      success: true,
      id: docRef.id,
      registrationLink,
      hasEmail: Boolean(trimmedEmail),
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to send invitation";
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
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch invitations";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
