import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars
config({ path: resolve(__dirname, "..", ".env.local") });

// Initialize Firebase Admin
if (admin.apps.length === 0) {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n",
  );
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;

  if (!privateKey || !projectId || !clientEmail) {
    console.error("Missing Firebase Admin credentials in .env.local");
    process.exit(1);
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

const db = getFirestore();

async function seedNotifications() {
  console.log("🌱 Seeding notifications...");
  try {
    // 1. Get existing events to reference
    const eventsSnapshot = await db.collection("events").limit(5).get();
    if (eventsSnapshot.empty) {
      console.error("❌ No events found. Please seed events first.");
      return;
    }

    const events = eventsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const getRandomEvent = () =>
      events[Math.floor(Math.random() * events.length)];

    const notifications = [
      {
        type: "registration",
        actorName: "Roberto Ahman Person",
        action: "registered for",
        highlight: "Economy Class", // or just "Registration"
        suffix: "",
        timeAgo: "2 minutes ago", // In real app, use timestamp
        createdAt: new Date(Date.now() - 1000 * 60 * 2), // 2 mins ago
        read: false,
      },
      {
        type: "invitation",
        actorName: "Greysia Polli",
        action: "accepted invitation for",
        highlight: "VIP Access",
        suffix: "",
        timeAgo: "5 minutes ago",
        createdAt: new Date(Date.now() - 1000 * 60 * 5),
        read: false,
      },
      {
        type: "registration",
        actorName: "Stephanie Angelina",
        action: "registered for",
        highlight: "Business Class",
        suffix: "",
        timeAgo: "10 minutes ago",
        createdAt: new Date(Date.now() - 1000 * 60 * 10),
        read: true,
      },
      {
        type: "invitation",
        actorName: "System",
        action: "sent invitation to",
        highlight: "john.doe@example.com",
        suffix: "for event",
        timeAgo: "1 hour ago",
        createdAt: new Date(Date.now() - 1000 * 60 * 60),
        read: true,
      },
      {
        type: "system",
        actorName: "Admin",
        action: "published event",
        highlight: "",
        suffix: "",
        timeAgo: "2 hours ago",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: true,
      },
    ];

    for (const notif of notifications) {
      const event = getRandomEvent();
      // Construct the full notification object
      // We will store minimal data to render the notification
      const notificationData = {
        eventId: event.id,
        eventTitle: event.title,
        actorName: notif.actorName,
        action: notif.action,
        highlight: notif.highlight || event.title, // Fallback highlight
        suffix: notif.suffix,
        type: notif.type,
        createdAt: notif.createdAt,
        read: notif.read,
      };

      const docRef = await db.collection("notifications").add(notificationData);
      console.log(
        `✅ Created notification for ${event.title} (ID: ${docRef.id})`,
      );
    }

    console.log("✨ Notification seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedNotifications().then(() => process.exit(0));
