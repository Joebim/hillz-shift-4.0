import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
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

const events = [
  {
    title: "Sunday Divine Service",
    slug: "sunday-divine-service-feb-2025",
    description:
      "Join us for a powerful time of worship and the word. Expect a move of God! This service will be a time of refreshing and renewal for everyone who attends.",
    shortDescription: "A powerful time of worship and word.",
    status: "published",
    startDate: new Date("2025-02-23T09:00:00"),
    endDate: new Date("2025-02-23T12:00:00"),
    registrationOpenDate: new Date("2025-02-01T00:00:00"),
    registrationCloseDate: new Date("2025-02-22T23:59:59"),
    venue: {
      name: "Main Sanctuary",
      address: "123 Faith Lane",
      city: "Grace City",
      state: "GC",
      country: "Kingdom",
      postalCode: "77777",
      coordinates: {
        lat: 6.5244,
        lng: 3.3792,
      },
    },
    branding: {
      primaryColor: "#7C3AED",
      secondaryColor: "#C4B5FD",
      bannerImage:
        "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200",
      thumbnail:
        "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400",
    },
    category: "service",
    tags: ["worship", "sunday", "service", "faith"],
    speakers: [],
    schedule: [],
    faqs: [],
    registrationConfig: {
      enabled: false,
      price: 0,
      capacity: 500,
      currency: "NGN",
      requiresApproval: false,
      fields: [],
    },
    invitationConfig: {
      enabled: true,
      fields: [
        {
          id: "field-1",
          label: "How did you hear about us?",
          type: "select",
          required: false,
          options: ["Friend", "Social Media", "Website"],
        },
      ],
    },
    mediaLinks: {
      youtubeUrl: "https://youtube.com/live/123",
      facebook: "https://facebook.com/live/123",
      instagram: "https://instagram.com/live/123",
    },
    featured: true,
    eventBibleVerse: "Psalm 122:1",
    theme: "Gathering of Saints",
    themeBibleVerse: "Hebrews 10:25",
    contacts: ["pastor@hillz.com", "+1234567890"],
    links: ["https://hillz.com/sunday-service"],
    channels: [
      {
        id: "ch_youtube",
        name: "YouTube",
        title: "Sunday Live Stream",
        description: "Join us live on YouTube for high quality streaming.",
        image: "https://img.icons8.com/color/48/youtube-play.png",
        link: "https://youtube.com/hillz",
        barcode: "YT-123456",
        otherContacts: ["tech@hillz.com"],
      },
      {
        id: "ch_spotify",
        name: "Spotify",
        title: "Worship Playlist",
        description: "Listen to the songs we will be singing this Sunday.",
        image: "https://img.icons8.com/color/48/spotify.png",
        link: "https://spotify.com/playlist/123",
      },
    ],
    ministers: [
      {
        id: "min_1",
        name: "Pastor John Doe",
        position: "Senior Pastor",
        type: "primary",
        photo:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
        bio: "Pastor John has been leading Hillz church for over 10 years.",
        socialLinks: {
          twitter: "https://twitter.com/pastorjohn",
          instagram: "https://instagram.com/pastorjohn",
        },
      },
      {
        id: "min_2",
        name: "Minister Sarah",
        position: "Worship Leader",
        type: "secondary",
        photo:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system_admin",
    registrationCount: 0,
    invitationCount: 0,
  },
  {
    title: "Leadership Conference 2025",
    slug: "leadership-conference-2025",
    description:
      "Empowering leaders for the next generation. A 3-day intensive workshop designed to equip you with the tools needed for effective ministry.",
    shortDescription: "Empowering next-gen leaders.",
    status: "published",
    startDate: new Date("2025-03-15T18:00:00"),
    endDate: new Date("2025-03-18T21:00:00"),
    venue: {
      name: "Conference Hall",
      address: "456 Wisdom Blvd",
      city: "Grace City",
      state: "GC",
      country: "Kingdom",
      postalCode: "77777",
    },
    branding: {
      primaryColor: "#3B82F6",
      secondaryColor: "#93C5FD",
      bannerImage:
        "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=1200",
      thumbnail:
        "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=400",
    },
    category: "conference",
    tags: ["leadership", "conference", "growth", "equipping"],
    speakers: [],
    schedule: [],
    faqs: [],
    registrationConfig: {
      enabled: true,
      price: 5000,
      currency: "NGN",
      capacity: 200,
      requiresApproval: true,
      fields: [
        {
          id: "field-2",
          label: "Dietary Requirements",
          type: "text",
          required: true,
          placeholder: "e.g., Vegan, Gluten-free",
        },
      ],
    },
    invitationConfig: {
      enabled: false,
      fields: [],
    },
    mediaLinks: {
      resourcesUrl: "https://hillz.com/resources/leadership-2025",
    },
    featured: false,
    eventBibleVerse: "Proverbs 11:14",
    theme: "Visionary Leadership",
    themeBibleVerse: "Habakkuk 2:2",
    contacts: ["events@hillz.com"],
    links: ["https://hillz.com/conference/2025"],
    channels: [
      {
        id: "ch_zoom",
        name: "Zoom",
        title: "Virtual Access",
        description: "Join the conference sessions remotely.",
        image: "https://img.icons8.com/color/48/zoom.png",
        link: "https://zoom.us/j/123456789",
        otherContacts: ["zoom-support@hillz.com"],
      },
    ],
    ministers: [
      {
        id: "min_3",
        name: "Dr. Myles",
        position: "Guest Speaker",
        type: "guest",
        photo:
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
        bio: "Renowned leadership expert and author.",
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system_admin",
    registrationCount: 0,
    invitationCount: 0,
  },
  {
    title: "SHIFT 4.0",
    slug: "shift-4-0",
    description:
      "SHIFT Conference is established by the instruction of the Holy Spirit with a mandate to bring men and women up the hill - The holy hill of Zion, the place of Christ's dominion on earth.\n\nIt is a time of full immersion into the mysteries of Christ via His word and a time of supplication thereby transforming men and women into a people of God's presence - true carriers of divine presence into every room they enter and exercising Christ's dominion on earth.\n\nCome expecting clarity, fellowship, and an unveiling of Christ.",
    shortDescription:
      "A DATE WITH JESUS THE WORD, SEATED AT THE RIGHT HAND OF POWER (MARK 14:62). Empowering a generation for spiritual excellence and purposeful living. Join the movement.",
    status: "published",
    startDate: new Date("2026-01-31T10:00:00"),
    endDate: new Date("2026-01-31T17:00:00"),
    venue: {
      name: "IKENGA HALL, RADISSON IKEJA LAGOS",
      address: "42/44 ISAAC JOHN STREET",
      city: "GRA IKEJA LAGOS",
      country: "NIGERIA",
      coordinates: { lat: 6.5862, lng: 3.3562 },
    },
    branding: {
      primaryColor: "#050A30",
      secondaryColor: "#7EC8E3",
      bannerImage:
        "https://res.cloudinary.com/dr1decnfd/image/upload/v1771433180/shift-flyer1_z0ftia.jpg",
      thumbnail:
        "https://res.cloudinary.com/dr1decnfd/image/upload/v1771433180/shift-flyer1_z0ftia.jpg",
    },
    category: "conference",
    tags: ["shift", "conference", "word", "encounter"],
    speakers: [],
    schedule: [],
    faqs: [],
    registrationConfig: {
      enabled: true,
      price: 0,
      currency: "NGN",
      requiresApproval: false,
      fields: [
        { id: "field-1", label: "Address", type: "text", required: false },
        {
          id: "field-2",
          label: "Who Invited You",
          type: "text",
          required: false,
        },
        {
          id: "field-3",
          label: "How did you hear about us",
          type: "select",
          options: ["friend", "social-media", "church", "other"],
          required: false,
        },
        {
          id: "field-4",
          label: "Joining Method",
          type: "radio",
          options: ["in-person", "online"],
          required: true,
        },
      ],
    },
    invitationConfig: {
      enabled: true,
      fields: [
        {
          id: "field-1",
          label: "Invitee Phone Number",
          type: "phone",
          required: false,
        },
        { id: "field-2", label: "Location", type: "text", required: false },
      ],
    },
    mediaLinks: {
      spotifyUrl: "https://open.spotify.com",
    },
    featured: true,
    eventBibleVerse: "Mark 14:62",
    theme: "A DATE WITH JESUS THE WORD, SEATED AT THE RIGHT HAND OF POWER",
    contacts: ["Convener@themysteryofchrist.org", "+44 20 3957 1854"],
    links: ["https://themysteryofchrist.org"],
    channels: [
      {
        id: "ch_google_meet",
        name: "Google Meet",
        title: "Live Streaming",
        description:
          "Can't make it in person? Join us live via Google Meet for an immersive online experience.",
        link: "https://meet.google.com",
      },
    ],
    ministers: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system_admin",
    registrationCount: 41,
    invitationCount: 20,
  },
];

async function clearCollection(name) {
  const snapshot = await db.collection(name).get();
  if (snapshot.empty) return;
  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
  console.log(`✅ Deleted ${snapshot.size} ${name}.`);
}

async function clearOldData() {
  console.log("🧹 Clearing existing data...");
  await clearCollection("events");
  await clearCollection("registrations");
  await clearCollection("invitations");
}

async function seedEvents() {
  await clearOldData();
  console.log("🌱 Seeding events...");
  try {
    for (const event of events) {
      const docRef = await db.collection("events").add(event);
      console.log(`✅ Created event: ${event.title} (ID: ${docRef.id})`);

      if (event.slug === "shift-4-0") {
        const shiftId = docRef.id;

        // Seed Registrations
        const regRaw = fs.readFileSync(
          resolve(__dirname, "..", "backup", "registrations.json"),
          "utf8",
        );
        const registrations = JSON.parse(regRaw);
        if (registrations.length > 0) {
          const regBatch = db.batch();
          registrations.forEach((r) => {
            const d = {
              eventId: shiftId,
              attendee: {
                firstName: r.name ? r.name.split(" ")[0] : "",
                lastName:
                  r.name && r.name.split(" ").length > 1
                    ? r.name.split(" ").slice(1).join(" ")
                    : "",
                email: r.email || "",
                phone: r.phone || "",
                customFields: {
                  address: r.address || "",
                  whoInvited: r.whoInvited || "",
                  heardFrom: r.heardFrom || "",
                  joiningMethod: r.joiningMethod || "",
                },
              },
              status: "confirmed",
              registrationDate: new Date(r.createdAt),
              confirmationCode: Math.random()
                .toString(36)
                .substring(7)
                .toUpperCase(),
              createdAt: new Date(r.createdAt),
              updatedAt: new Date(r.createdAt),
              checkedIn: false,
            };
            regBatch.set(db.collection("registrations").doc(), d);
          });
          await regBatch.commit();
          console.log(
            `✅ Seeded ${registrations.length} registrations for SHIFT 4.0`,
          );
        }

        // Seed Invitations
        const invRaw = fs.readFileSync(
          resolve(__dirname, "..", "backup", "invitations.json"),
          "utf8",
        );
        const invitations = JSON.parse(invRaw);
        if (invitations.length > 0) {
          const invBatch = db.batch();
          invitations.forEach((i) => {
            const d = {
              eventId: shiftId,
              senderName: i.inviterName || "",
              senderEmail: "admin@hillzshift.com",
              recipientEmail: i.inviteeEmail || "no-email@example.com",
              recipientName: i.inviteeName || "",
              personalMessage: i.customMessage || "",
              customFields: {
                inviteePhone: i.inviteePhone || "",
                location: i.location || "",
              },
              status: i.status || "sent",
              sentDate: new Date(i.createdAt),
              invitationCode: Math.random()
                .toString(36)
                .substring(7)
                .toUpperCase(),
              createdAt: new Date(i.createdAt),
              updatedAt: new Date(i.createdAt),
            };
            invBatch.set(db.collection("invitations").doc(), d);
          });
          await invBatch.commit();
          console.log(
            `✅ Seeded ${invitations.length} invitations for SHIFT 4.0`,
          );
        }
      }
    }
    console.log("✨ Seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedEvents().then(() => process.exit(0));
