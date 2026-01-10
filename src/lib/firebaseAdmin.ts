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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db: Firestore = app ? getFirestore(app) : (null as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const auth: Auth = app ? getAuth(app) : (null as any);
