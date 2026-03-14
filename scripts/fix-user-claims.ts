/**
 * fix-user-claims.ts
 *
 * One-time script to backfill Firebase custom claims for admin users
 * that were invited before the invite route was fixed.
 *
 * Usage:
 *   npx ts-node --project tsconfig.json scripts/fix-user-claims.ts
 *
 * Or run directly with:
 *   npx tsx scripts/fix-user-claims.ts
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

if (getApps().length === 0) {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n",
  );
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
      privateKey: privateKey!,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
    }),
  });
}

const db = getFirestore();
const auth = getAuth();

async function fixUserClaims() {
  console.log("Fetching all admin users from Firestore...");
  const snapshot = await db.collection("users").get();

  let fixed = 0;
  let skipped = 0;
  let errors = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const uid = doc.id;
    const role = data.role;

    if (!role) {
      console.warn(`  [SKIP] ${uid} — no role field in Firestore`);
      skipped++;
      continue;
    }

    try {
      const userRecord = await auth.getUser(uid);
      const existingClaims = userRecord.customClaims || {};

      if (existingClaims.role === role) {
        console.log(
          `  [OK]   ${data.email} — claims already correct (${role})`,
        );
        skipped++;
        continue;
      }

      await auth.setCustomUserClaims(uid, { role });
      console.log(`  [FIXED] ${data.email} — set role="${role}"`);
      fixed++;
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      if (e.code === "auth/user-not-found") {
        console.warn(`  [SKIP] ${data.email} — no Firebase Auth user found`);
        skipped++;
      } else {
        console.error(`  [ERROR] ${data.email} — ${e.message}`);
        errors++;
      }
    }
  }

  console.log(
    `\nDone. Fixed: ${fixed} | Skipped: ${skipped} | Errors: ${errors}`,
  );
}

fixUserClaims().catch(console.error);
