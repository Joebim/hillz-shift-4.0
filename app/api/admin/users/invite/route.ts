import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { getSession } from "@/src/lib/auth/session";
import { User, UserRole } from "@/src/types/user";
import admin from "firebase-admin";
import nodemailer from "nodemailer";
import crypto from "crypto";

if (admin.apps.length === 0) {
  if (process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
          /\\n/g,
          "\n",
        ),
      }),
    });
  }
}

const db = getFirestore();

function generatePassword(length = 12) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(crypto.randomInt(0, n));
  }
  return retVal;
}

async function sendInviteEmail(
  email: string,
  displayName: string,
  password: string,
  role: string,
) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/login`;

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"Admin System" <noreply@example.com>',
    to: email,
    subject: "You have been invited to the Admin Dashboard",
    html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2>Welcome, ${displayName}!</h2>
                <p>You have been invited to join the <strong>Hillz Shift Admin Platform</strong> as a <strong>${role}</strong>.</p>
                <p>Here are your login credentials:</p>
                <div style="background: #f4f4f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Password:</strong> <code style="font-size: 1.2em; background: #e4e4e7; padding: 2px 5px; border-radius: 4px;">${password}</code></p>
                </div>
                <p>Please login and change your password immediately.</p>
                <a href="${loginUrl}" style="display: inline-block; background: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Login to Dashboard</a>
            </div>
        `,
  });
  return info;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "super_admin" && session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { email, displayName, role, managedEventId, managedEventIds } = body;
    const eventIds: string[] = managedEventIds?.length
      ? managedEventIds
      : managedEventId
        ? [managedEventId]
        : [];

    if (!email || !displayName || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existingDocs = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();
    if (!existingDocs.empty) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 },
      );
    }

    const password = generatePassword();
    let firebaseAuthUid = "";

    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName,
        emailVerified: true,
      });
      firebaseAuthUid = userRecord.uid;

      // Set custom claims so the login route can verify the admin role.
      // Without this, the login endpoint returns 403 "User does not have admin access"
      // because it checks userRecord.customClaims.role, not Firestore.
      await admin.auth().setCustomUserClaims(firebaseAuthUid, { role });
    } catch (authError: unknown) {
      const err = authError as { code?: string };
      if (err.code === "auth/email-already-exists") {
        return NextResponse.json(
          { error: "User exists in Auth system already" },
          { status: 409 },
        );
      }
      throw authError;
    }

    const newUser: Partial<User> = {
      id: firebaseAuthUid,
      email,
      displayName,
      role,
      managedEventId: eventIds[0] || null,
      managedEventIds: eventIds,
      permissions: [],
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      photoUrl: "",
    };

    await db.collection("users").doc(firebaseAuthUid).set(newUser);

    let emailSent = false;
    try {
      if (
        process.env.SMTP_USER &&
        !process.env.SMTP_USER.includes("example.com")
      ) {
        await sendInviteEmail(email, displayName, password, role);
        emailSent = true;
      }
    } catch (emailError) {
      // Email sending is best-effort; don't fail the whole request
    }

    return NextResponse.json({
      success: true,
      data: newUser,
      emailSent,
      tempPassword: emailSent ? undefined : password,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
