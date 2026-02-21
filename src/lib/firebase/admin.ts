import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

// Initialize Firebase Admin SDK
const initializeFirebaseAdmin = () => {
  if (getApps().length === 0) {
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n",
    );

    if (
      !privateKey ||
      !process.env.FIREBASE_ADMIN_PROJECT_ID ||
      !process.env.FIREBASE_ADMIN_CLIENT_EMAIL
    ) {
      throw new Error("Firebase Admin credentials are not properly configured");
    }

    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      }),
      storageBucket: `${process.env.FIREBASE_ADMIN_PROJECT_ID}.appspot.com`,
    });

    // Set Firestore settings immediately after initialization
    getFirestore().settings({
      ignoreUndefinedProperties: true,
    });
  }
};

// Initialize on module load
initializeFirebaseAdmin();

// Export Firestore instance
export const adminDb = getFirestore();

// Export Auth instance
export const adminAuth = getAuth();

// Export Storage instance
export const adminStorage = getStorage();

// Helper function to convert Firestore timestamp to Date
export const timestampToDate = (timestamp: unknown): Date => {
  if (!timestamp) return new Date();
  if (typeof (timestamp as any).toDate === "function") {
    return (timestamp as any).toDate();
  }
  if (timestamp instanceof Date) return timestamp;
  return new Date(timestamp as string | number);
};

// Helper function to create server timestamp
export const serverTimestamp = () => {
  return new Date();
};
