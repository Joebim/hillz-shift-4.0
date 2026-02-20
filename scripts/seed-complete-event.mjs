import admin from "firebase-admin";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import fs from "fs";

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

// Load backup data
const loadBackup = (filename) => {
  const path = resolve(__dirname, "..", "backup", filename);
  if (!fs.existsSync(path)) {
    console.log(`Backup file not found: ${path}`);
    return [];
  }
  return JSON.parse(fs.readFileSync(path, "utf-8"));
};

const registrations = loadBackup("registrations.json");
const invitations = loadBackup("invitations.json");
// Function to convert ISO date strings to Firestore Timestamps
const toTimestamp = (dateStr) => {
  return dateStr ? Timestamp.fromDate(new Date(dateStr)) : Timestamp.now();
};

async function seedCompleteEvent() {
  console.log("🌱 Starting complete event seeding...");

  try {
    // 1. Delete existing events (optional, but requested by user to ensure clean slate)
    // Note: In a real production scenario, be careful with deleting all events.
    console.log("⚠️ Deleting existing events...");
    const eventsSnapshot = await db.collection("events").get();
    const batch = db.batch();
    eventsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log("✅ Existing events deleted.");

    // 2. Create the main SHIFT 4.0 Event
    const eventData = {
      title: "SHIFT 4.0 - A DATE WITH JESUS",
      slug: "shift-4-0-date-with-jesus",
      description:
        "SHIFT Conference is established by the instruction of the Holy Spirit with a mandate to bring men and women up the hill - The holy hill of Zion, the place of Christ's dominion on earth.\n\nIt is a time of full immersion into the mysteries of Christ via His word and a time of supplication thereby transforming men and women into a people of God's presence - true carriers of divine presence into every room they enter and exercising Christ's dominion on earth.\n\nCome expecting clarity, fellowship, and an unveiling of Christ.",
      shortDescription:
        "Empowering a generation for spiritual excellence and purposeful living. Join the movement.",
      status: "published",
      startDate: toTimestamp("2026-01-31T10:00:00"),
      endDate: toTimestamp("2026-01-31T17:00:00"),
      registrationOpenDate: toTimestamp("2025-12-01T00:00:00"),
      registrationCloseDate: toTimestamp("2026-01-31T09:00:00"),
      venue: {
        name: "IKENGA HALL, RADISSON IKEJA",
        address: "42/44 ISAAC JOHN STREET, GRA IKEJA",
        city: "LAGOS",
        state: "LAGOS",
        country: "NIGERIA",
        postalCode: "",
      },
      branding: {
        primaryColor: "#7C3AED", // Violet based on UI
        secondaryColor: "#4C1D95",
        bannerImage:
          "https://res.cloudinary.com/dr1decnfd/image/upload/v1771433180/shift-flyer1_z0ftia.jpg", // User provided image
        thumbnail:
          "https://res.cloudinary.com/dr1decnfd/image/upload/v1771433180/shift-flyer1_z0ftia.jpg",
      },
      category: "conference",
      tags: ["spiritual", "conference", "worship", "word", "shift"],
      featured: true,
      eventBibleVerse: "MARK 14:62",
      theme: "THE WORD, SEATED AT THE RIGHT HAND OF POWER",
      themeBibleVerse: "MARK 14:62",
      contacts: ["Convener@themysteryofchrist.org", "+44 20 3957 1854"],
      links: ["https://themysteryofchrist.org"],
      channels: [
        {
          id: "spotify",
          name: "Spotify",
          title: "Spotify Premiere",
          description:
            "Listen to “Mastering the Mystery of Christ” series. Prepare your spirit before the event.",
          link: "https://open.spotify.com/",
          image: "https://img.icons8.com/color/48/spotify.png",
          barcode: "SP-CODE",
        },
        {
          id: "google_meet",
          name: "Google Meet",
          title: "Live Streaming",
          description:
            "Can't make it in person? Join us live via Google Meet for an immersive online experience.",
          link: "https://meet.google.com/",
          image: "https://img.icons8.com/color/48/google-meet.png",
        },
      ],
      ministers: [],
      registrationConfig: {
        enabled: true,
        price: 0,
        currency: "NGN",
        requiresApproval: false,
        fields: [],
      },
      mediaLinks: {
        spotifyUrl: "https://open.spotify.com/",
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: "system_admin",
      // Metrics - calculated from backup data
      registrationCount: registrations.length,
      invitationCount: invitations.length,
    };

    const eventRef = await db.collection("events").add(eventData);
    const eventId = eventRef.id;
    console.log(`✅ Event created: ${eventData.title} (ID: ${eventId})`);

    // 3. Seed Registrations as sub-collection of event (or top-level if that's your schema)
    console.log(`🌱 Seeding ${registrations.length} registrations...`);
    const regBatchSize = 500;

    // Process registrations in batches
    for (let i = 0; i < registrations.length; i += regBatchSize) {
      const chunk = registrations.slice(i, i + regBatchSize);
      const batch = db.batch();

      chunk.forEach((reg) => {
        const regRef = db
          .collection("registrations")
          .doc(reg.id || db.collection("registrations").doc().id);

        batch.set(regRef, {
          ...reg,
          eventId: eventId, // Link to the new event
          eventTitle: eventData.title,
          createdAt: toTimestamp(reg.createdAt), // Fix date format
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      });

      await batch.commit();
      console.log(`   - Batch ${Math.floor(i / regBatchSize) + 1} committed.`);
    }

    // 4. Seed Invitations
    console.log(`🌱 Seeding ${invitations.length} invitations...`);
    // Process invitations in batches
    for (let i = 0; i < invitations.length; i += regBatchSize) {
      const chunk = invitations.slice(i, i + regBatchSize);
      const batch = db.batch();

      chunk.forEach((inv) => {
        const invRef = db
          .collection("invitations")
          .doc(inv.id || db.collection("invitations").doc().id);
        batch.set(invRef, {
          ...inv,
          eventId: eventId,
          eventTitle: eventData.title,
          createdAt: toTimestamp(inv.createdAt),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      });

      await batch.commit();
      console.log(`   - Batch ${Math.floor(i / regBatchSize) + 1} committed.`);
    }

    // 5. Seed Additional Events (Kingdom Life & Youth Explosion)
    console.log("🌱 Seeding additional events...");

    const additionalEvents = [
      {
        title: "Kingdom Life Conference 2026",
        slug: "kingdom-life-conference-2026",
        description:
          "A gathering of believers focused on living out the kingdom life in everyday society. Join us for transformative sessions.",
        shortDescription: "Living the Kingdom life daily.",
        status: "published",
        startDate: toTimestamp("2026-05-15T09:00:00"),
        endDate: toTimestamp("2026-05-17T18:00:00"),
        registrationOpenDate: toTimestamp("2026-03-01T00:00:00"),
        registrationCloseDate: toTimestamp("2026-05-14T23:59:59"),
        venue: {
          name: "Main Sanctuary",
          address: "12 Kingdom Avenue",
          city: "Abuja",
          state: "FCT",
          country: "Nigeria",
          postalCode: "",
        },
        branding: {
          primaryColor: "#0ea5e9", // Sky blue
          secondaryColor: "#0284c7",
          bannerImage:
            "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200",
          thumbnail:
            "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400",
        },
        category: "conference",
        tags: ["kingdom", "life", "conference"],
        featured: false,
        registrationConfig: {
          enabled: true,
          price: 0,
          currency: "NGN",
          requiresApproval: false,
          fields: [],
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: "system_admin",
        registrationCount: 0,
        invitationCount: 0,
      },
      {
        title: "Youth Explosion: Ignite",
        slug: "youth-explosion-ignite",
        description:
          "An energetic night of worship, music, and word specifically for the next generation. Don't miss out!",
        shortDescription: "High energy youth worship night.",
        status: "published",
        startDate: toTimestamp("2026-08-22T16:00:00"),
        endDate: toTimestamp("2026-08-22T21:00:00"),
        registrationOpenDate: toTimestamp("2026-07-01T00:00:00"),
        registrationCloseDate: toTimestamp("2026-08-22T12:00:00"),
        venue: {
          name: "The Arena",
          address: "5 Youth Drive",
          city: "Lagos",
          state: "Lagos",
          country: "Nigeria",
          postalCode: "",
        },
        branding: {
          primaryColor: "#f97316", // Orange
          secondaryColor: "#ea580c",
          bannerImage:
            "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200",
          thumbnail:
            "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400",
        },
        category: "concert",
        tags: ["youth", "music", "worship"],
        featured: false,
        registrationConfig: {
          enabled: true,
          price: 1000,
          currency: "NGN",
          requiresApproval: false,
          fields: [],
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: "system_admin",
        registrationCount: 0,
        invitationCount: 0,
      },
    ];

    for (const event of additionalEvents) {
      const docRef = await db.collection("events").add(event);
      console.log(
        `✅ Created additional event: ${event.title} (ID: ${docRef.id})`,
      );
    }

    console.log("✨ Complete seeding finished!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedCompleteEvent().then(() => process.exit(0));
