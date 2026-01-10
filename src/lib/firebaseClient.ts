import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// Firebase Client Configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAJvGhsHRhAYU_mdGnjsiDfnMdwyoZQG94",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "hillz-shift-4-55277.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "hillz-shift-4-55277",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "hillz-shift-4-55277.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "810127092860",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:810127092860:web:39984d2159e09a8b15adf9",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-H0N9H6VN9R"
};

// Initialize Firebase Client (only if not already initialized)
let app: FirebaseApp | undefined;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Export Firebase services (only available on client-side)
export const db: Firestore | null = typeof window !== 'undefined' ? getFirestore(app) : null;
export const auth: Auth | null = typeof window !== 'undefined' ? getAuth(app) : null;
export { app };
