import { NextResponse } from "next/server";
import { db } from "@/src/lib/firebaseAdmin";
import { sendEmail } from "@/src/lib/email";
import { invitationTemplate } from "@/src/templates/email/invitationTemplate";
import { AdminAuthError, requireAdminSession } from "@/src/lib/adminSession";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      inviterName,
      inviteeName,
      inviteePhone,
      inviteeEmail,
      location,
      customMessage,
    } = data;

    // Save to Firestore
    const docRef = await db.collection("invitations").add({
      inviterName,
      inviteeName,
      inviteePhone,
      inviteeEmail: inviteeEmail || null,
      location,
      customMessage,
      status: "sent",
      createdAt: new Date().toISOString(),
    });

    // Registration link (replace with actual domain)
    const registrationLink = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/register?ref=${docRef.id}`;

    // Send invitation email only if email is provided
    if (inviteeEmail) {
      await sendEmail({
        to: inviteeEmail,
        subject: `You're Invited to Hillz Shift 4.0 by ${inviterName}`,
        html: invitationTemplate(inviteeName, inviterName, customMessage, registrationLink),
      });
    }

    return NextResponse.json({ 
      success: true, 
      id: docRef.id,
      registrationLink,
      hasEmail: !!inviteeEmail
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to send invitation";
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
