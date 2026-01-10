import { initializeApp, cert, getApps, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

let app: App | undefined;

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!getApps().length && projectId && clientEmail && privateKey) {
  app = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
  });
} else if (getApps().length) {
  app = getApps()[0];
}

// Export Firestore - safe type assertion since app is checked before use
// In production, app will always be initialized due to environment variable checks
export const db: Firestore = app ? getFirestore(app) : (null as unknown as Firestore);

// Export Auth - safe type assertion since app is checked before use
// In production, app will always be initialized due to environment variable checks
export const auth: Auth = app ? getAuth(app) : (null as unknown as Auth);
