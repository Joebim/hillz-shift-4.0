import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase client configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate configuration
const validateConfig = () => {
  const missingKeys: string[] = [];
  if (!firebaseConfig.apiKey) missingKeys.push("NEXT_PUBLIC_FIREBASE_API_KEY");
  if (!firebaseConfig.authDomain)
    missingKeys.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
  if (!firebaseConfig.projectId)
    missingKeys.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  if (!firebaseConfig.storageBucket)
    missingKeys.push("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
  if (!firebaseConfig.messagingSenderId)
    missingKeys.push("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
  if (!firebaseConfig.appId) missingKeys.push("NEXT_PUBLIC_FIREBASE_APP_ID");

  if (missingKeys.length > 0) {
    // Only throw in development to avoid crashing production for minor env issues
    // but here we keep it as requested to ensure setup is correct
    const errorMsg = `Missing Firebase configuration: ${missingKeys.join(", ")}. Check your .env.local file.`;
    console.error(errorMsg);
    if (process.env.NODE_ENV === "development") {
      throw new Error(errorMsg);
    }
  }
};

// Initialize Firebase
validateConfig();
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
