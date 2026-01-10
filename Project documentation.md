Hillz Shift 4.0 — Full Architecture & File Blueprint

This defines how the application will be organized, what lives where, and how each concern is separated cleanly.

🏗️ Project Structure
hillz-shift-4.0/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── route.ts
│   │   │
│   │   ├── registrations/
│   │   │   └── route.ts
│   │   │
│   │   ├── invitations/
│   │   │   └── route.ts
│   │   │
│   │   ├── email/
│   │   │   └── route.ts
│   │   │
│   │   ├── dashboard/
│   │   │   └── route.ts
│   │   │
│   │   └── analytics/
│   │       └── route.ts
│   │
│   ├── (site)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   │
│   │   ├── register/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   │
│   │   ├── invite/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   │
│   │   ├── success/
│   │   │   └── page.tsx
│   │   │
│   │   └── qr/
│   │       └── page.tsx
│   │
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx
│   │   │
│   │   ├── registrations/
│   │   │   └── page.tsx
│   │   │
│   │   ├── invitations/
│   │   │   └── page.tsx
│   │   │
│   │   └── analytics/
│   │       └── page.tsx
│   │
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── src/
│   ├── lib/
│   │   ├── firebaseAdmin.ts
│   │   ├── firebaseClient.ts
│   │   ├── email.ts
│   │   ├── auth.ts
│   │   └── analytics.ts
│   │
│   ├── utils/
│   │   ├── whatsapp.ts
│   │   ├── formatters.ts
│   │   └── validators.ts
│   │
│   ├── templates/
│   │   ├── email/
│   │   │   ├── invitationTemplate.ts
│   │   │   └── registrationTemplate.ts
│   │   │
│   │   └── whatsapp/
│   │       └── inviteMessage.ts
│   │
│   ├── store/
│   │   ├── useRegistrationStore.ts
│   │   ├── useInvitationStore.ts
│   │   └── useAdminStore.ts
│   │
│   ├── middleware/
│   │   └── adminAuthGuard.ts
│   │
│   ├── hooks/
│   │   ├── useAdminAuth.ts
│   │   └── useDashboard.ts
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Skeleton.tsx
│   │   │
│   │   ├── shared/
│   │   │   ├── Banner.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── EventHeader.tsx
│   │   │
│   │   ├── register/
│   │   │   └── RegistrationForm.tsx
│   │   │
│   │   ├── invite/
│   │   │   └── InvitationForm.tsx
│   │   │
│   │   └── admin/
│   │       ├── DashboardStats.tsx
│   │       ├── RegistrationsTable.tsx
│   │       ├── InvitationsTable.tsx
│   │       └── AnalyticsCharts.tsx
│   │
│   ├── types/
│   │   ├── Registration.ts
│   │   ├── Invitation.ts
│   │   └── Admin.ts
│   │
│   └── constants/
│       ├── routes.ts
│       └── roles.ts
│
├── public/
│   ├── banners/
│   ├── graphics/
│   └── icons/
│
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md

🔐 Admin Authentication — Placement Plan

Protected admin system includes:

Login page

Auth API

Middleware guard

Zustand auth store

Admin auth hook

Key files:

API → /app/api/auth/route.ts

Client auth logic → /src/lib/auth.ts

Middleware → /src/middleware/adminAuthGuard.ts

Admin hook → /src/hooks/useAdminAuth.ts

State → /src/store/useAdminStore.ts

Login page → /app/admin/login/page.tsx

Admin layout lock → /app/admin/layout.tsx

📊 Analytics — Placement Strategy

Analytics system will track:

Registrations count

Invitations sent

Conversion rates

Top inviters

Key files:

API → /app/api/analytics/route.ts

Logic → /src/lib/analytics.ts

Hook → /src/hooks/useDashboard.ts

UI → /src/components/admin/AnalyticsCharts.tsx

Page → /app/admin/analytics/page.tsx

📩 Email System — Placement Plan

Email services include:

Invitation email

Registration email confirmation

Files:

Email service core → /src/lib/email.ts

Templates → /src/templates/email/

API endpoint → /app/api/email/route.ts

📱 WhatsApp Deep Linking — Placement Plan

Used for sending invitation messages.

Files:

WhatsApp generator → /src/utils/whatsapp.ts

Message template → /src/templates/whatsapp/inviteMessage.ts

Used inside invitation page → /app/(site)/invite/page.tsx

🧾 QR Flow Handling — Placement Plan

Handles users scanning QR codes and landing correctly.

Files:

QR handler route → /app/(site)/qr/page.tsx

Logic can read URL params and redirect

Analytics tracks QR usage

🧱 Loading Skeletons — Placement Plan

For smooth UX.

Files:

Global Skeleton → /src/components/ui/Skeleton.tsx

Register page loader → /app/(site)/register/loading.tsx

Invite page loader → /app/(site)/invite/loading.tsx

Admin loader → /app/admin/loading.tsx

🏷️ Collections (Firestore)

Already planned earlier but storage meaning:

registrations

invitations

admins

analytics





Implementations

🔥 Firebase Setup

We will use:

Firebase Admin (Server Side — secure)

Firebase Client (if needed for client auth)

Firestore Database

NoAuth Users (Public form)

/src/lib/firebaseAdmin.ts
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FB_PROJECT_ID,
      clientEmail: process.env.FB_CLIENT_EMAIL,
      privateKey: process.env.FB_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const db = getFirestore();

📡 API Layer (All Server Logic Lives Here)

Everything backend lives in /app/api/**

1️⃣ Event Registration API

/app/api/registrations/route.ts

Handles:

Save registration

Prevent duplicate email

Returns success response

import { NextResponse } from "next/server";
import { db } from "@/src/lib/firebaseAdmin";

export async function POST(req: Request) {
  const data = await req.json();

  await db.collection("registrations").add({
    ...data,
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true });
}

2️⃣ Invitation API

/app/api/invitations/route.ts

Stores:

Inviter details

Invitee details

Status (pending, clicked, registered later)

import { NextResponse } from "next/server";
import { db } from "@/src/lib/firebaseAdmin";

export async function POST(req: Request) {
  const data = await req.json();

  await db.collection("invitations").add({
    ...data,
    status: "sent",
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true });
}

3️⃣ Email Sending API

Use Nodemailer or SendGrid (recommended)

/src/lib/email.ts

import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
});


Route handler:

/app/api/email/route.ts

import { transporter } from "@/src/lib/email";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, subject, message } = await req.json();

  await transporter.sendMail({
    from: process.env.EMAIL_USER!,
    to: email,
    subject,
    html: message,
  });

  return NextResponse.json({ success: true });
}

4️⃣ Admin Dashboard Data API

/app/api/dashboard/route.ts

Returns:

Registrations

Invitations

Leaders who invited people

import { db } from "@/src/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET() {
  const registrations = await db.collection("registrations").get();
  const invitations = await db.collection("invitations").get();

  return NextResponse.json({
    registrations: registrations.docs.map(d => ({ id: d.id, ...d.data() })),
    invitations: invitations.docs.map(d => ({ id: d.id, ...d.data() }))
  });
}

🧠 Zustand State Management

All state lives in src/store/

Registration Store

useRegistrationStore.ts

import { create } from "zustand";

export const useRegistrationStore = create((set) => ({
  form: {
    name: "",
    email: "",
    phone: "",
    heardFrom: ""
  },
  setField: (key: string, value: string) =>
    set((state: any) => ({
      form: { ...state.form, [key]: value }
    })),
}));

Invitation Store

useInvitationStore.ts

import { create } from "zustand";

export const useInvitationStore = create((set) => ({
  inviter: {},
  invitee: {},
  setInviter: (data: any) => set({ inviter: data }),
  setInvitee: (data: any) => set({ invitee: data }),
}));

Admin Store

useAdminStore.ts

import { create } from "zustand";

export const useAdminStore = create((set) => ({
  dashboard: null,
  setDashboard: (data: any) => set({ dashboard: data }),
}));

🖥️ Pages Breakdown
/register/page.tsx

Banner

Form inputs

Submit

Save to Firebase

Redirect to Success

/invite/page.tsx

Fields:

Inviter name, email, phone

Invitee name, email, phone

Submit

Trigger email + WhatsApp share

Save invite to Firebase

WhatsApp Message Format (example)
Hey! I’m inviting you to Hillz Shift 4.0 🎉
Register here: https://hillzshift.com/register


You will generate this dynamically.

/admin/*

Admin sees:

Total Registrations

Total Invitations

Leaderboard of inviters

🧪 Collections Structure
registrations
{
 name,
 email,
 phone,
 heardFrom,
 createdAt
}

invitations
{
 inviterName,
 inviterEmail,
 inviteeName,
 inviteeEmail,
 status,
 createdAt
}