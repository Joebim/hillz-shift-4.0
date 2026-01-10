# Firebase Setup Guide for Hillz Shift 4.0

This guide will walk you through setting up Firebase and connecting it to your Next.js project.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Create Firebase Project](#step-1-create-firebase-project)
3. [Step 2: Enable Firestore Database](#step-2-enable-firestore-database)
4. [Step 3: Create Service Account](#step-3-create-service-account)
5. [Step 4: Get Credentials](#step-4-get-credentials)
6. [Step 5: Configure Environment Variables](#step-5-configure-environment-variables)
7. [Step 6: Verify Installation](#step-6-verify-installation)
8. [Step 7: Set Firestore Security Rules](#step-7-set-firestore-security-rules)
9. [Step 8: Test the Connection](#step-8-test-the-connection)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Google account
- Firebase Admin SDK already installed (`firebase-admin` is in your `package.json`)
- Node.js and npm/yarn installed
- Access to your project root directory
- **Free Firebase Plan** (Spark plan) - We're using the free default database to stay within budget

---

## Step 1: Create Firebase Project

1. **Go to Firebase Console**

   - Visit: https://console.firebase.google.com/
   - Sign in with your Google account

2. **Create a New Project**

   - Click **"Add project"** or **"Create a project"**
   - Enter project name: `hillz-shift-4-0` (or your preferred name)
   - Click **"Continue"**

3. **Configure Google Analytics (Optional)**

   - You can enable or disable Google Analytics
   - **Note:** Google Analytics is free and doesn't affect your database plan
   - Click **"Continue"** or **"Create project"**

4. **Wait for Project Creation**

   - Firebase will set up your project (takes ~30 seconds)
   - Click **"Continue"** when ready

5. **Verify Plan**
   - Ensure you're on the **Spark (Free) plan**
   - This plan includes the free default Firestore database
   - No credit card required for basic usage
   - You can check your plan in Project Settings → Usage and billing

---

## Step 2: Enable Firestore Database

**Important:** We're using the **free default database** (no named databases). Named databases require a paid Blaze plan.

1. **Navigate to Firestore**

   - In the Firebase Console, click on **"Firestore Database"** in the left sidebar
   - If you don't see it, click **"Build"** → **"Firestore Database"**

2. **Create Default Database**

   - Click **"Create database"**
   - You'll see options for database setup
   - **Important:** Use the default database option (the first/default option)
   - Do NOT select "Create a named database" as that requires a paid plan

3. **Choose Security Rules**

   - Select **"Start in production mode"** (we'll set up security rules later)
   - Click **"Next"**

4. **Choose Location**

   - Select a database location closest to your users
   - For Nigeria/Lagos: Choose `europe-west` or `us-central`
   - **Note:** Location selection is free for the default database
   - Click **"Enable"**
   - Wait for the database to be created (~30 seconds)

5. **Verify Database Type**
   - After creation, you should see "(default)" next to your database name
   - This confirms you're using the free default database
   - No additional costs will be incurred for basic usage

---

## Step 3: Create Service Account

The service account allows your Next.js server to communicate with Firebase securely.

1. **Navigate to Project Settings**

   - Click the **gear icon** ⚙️ next to "Project Overview"
   - Select **"Project settings"**

2. **Go to Service Accounts Tab**

   - Click on the **"Service accounts"** tab at the top

3. **Generate New Private Key**
   - Under "Firebase Admin SDK"
   - Click **"Generate new private key"**
   - A warning dialog will appear
   - Click **"Generate key"**
   - A JSON file will be downloaded (keep this secure - **DO NOT commit to Git!**)

---

## Step 4: Get Credentials

The downloaded JSON file contains all the information you need. Open it in a text editor.

The file will look like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

You need to extract these three values:

- `project_id` → `FIREBASE_PROJECT_ID`
- `client_email` → `FIREBASE_CLIENT_EMAIL`
- `private_key` → `FIREBASE_PRIVATE_KEY`

---

## Step 5: Configure Environment Variables

1. **Create `.env.local` file** (if it doesn't exist)

   - In your project root directory
   - Create a file named `.env.local`

2. **Add Environment Variables**

   Open `.env.local` and add:

   ```env
   # Firebase Admin SDK Configuration
   FIREBASE_PROJECT_ID=your-project-id-here
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
   ```

   **Important Notes:**

   - Replace the values with the actual values from your JSON file
   - The `FIREBASE_PRIVATE_KEY` must be wrapped in quotes
   - Keep the `\n` characters in the private key (they represent newlines)
   - The private key should span multiple lines (but in .env it will be on one line with `\n`)

3. **Example `.env.local`:**

   ```env
   # Firebase Configuration
   FIREBASE_PROJECT_ID=hillz-shift-4-0
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc12@hillz-shift-4-0.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

   # Email Configuration (for nodemailer)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Add to `.gitignore`** (if not already there)
   - Ensure `.env.local` is in your `.gitignore` file
   - Never commit this file to version control!

---

## Step 6: Verify Installation

Your project already has `firebase-admin` installed. Verify it's working:

1. **Check Installation**

   ```bash
   npm list firebase-admin
   ```

2. **Your Firebase Admin Setup**
   - File location: `src/lib/firebaseAdmin.ts`
   - It's already configured to read from environment variables
   - No changes needed here!

---

## Step 7: Set Firestore Security Rules

Since we're using Firebase Admin SDK (server-side), we can restrict client access.

**Note:** For the default database, you set rules directly without specifying a database name.

1. **Navigate to Firestore Rules**

   - Go to Firebase Console → Firestore Database → **"Rules"** tab
   - Make sure you're in the "(default)" database view

2. **Set Production Rules**

   Replace the default rules with:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Deny all client-side access
       // Only server-side (Admin SDK) can access
       match /{document=**} {
         allow read, write: if false;
       }

       // Optional: Allow public read for specific collections if needed
       // match /public/{document} {
       //   allow read: if true;
       //   allow write: if false;
       // }
     }
   }
   ```

   **Note:** The `{database}` variable will automatically match your default database.

3. **Click "Publish"**
   - This ensures only your server can access the database
   - Rules are applied to your default database immediately

---

## Step 8: Test the Connection

You can test Firebase connection in two ways:

### Option 1: Use Existing API Routes (Recommended)

Test with your actual API routes:

1. **Start Development Server**

   ```bash
   npm run dev
   ```

2. **Test Registration API** (creates a test registration)

   ```bash
   curl -X POST http://localhost:3000/api/registrations \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "phone": "+2341234567890",
       "address": "Test Location",
       "whoInvited": "Test Inviter",
       "heardFrom": "test"
     }'
   ```

   Expected response:

   ```json
   {
     "success": true,
     "id": "firestore-document-id"
   }
   ```

3. **Test GET Registrations**

   Visit: `http://localhost:3000/api/registrations`

   Should return an array of registrations (including your test one).

4. **Check Firestore Console**

   - Go to Firebase Console → Firestore Database
   - You should see the `registrations` collection with your test data

5. **Clean Up** (optional)
   - Delete test registration from Firestore Console if needed

### Option 2: Create Test Route (Temporary)

If you prefer a dedicated test route:

1. **Create Test Route** (for testing only)

   Create file: `app/api/test-firebase/route.ts`

   ```typescript
   import { NextResponse } from "next/server";
   import { db } from "@/src/lib/firebaseAdmin";

   export async function GET() {
     try {
       // Verify db is initialized
       if (!db) {
         return NextResponse.json(
           {
             success: false,
             error:
               "Firebase Admin not initialized. Check environment variables.",
           },
           { status: 500 }
         );
       }

       // Test write
       const testRef = await db.collection("test").add({
         message: "Firebase connection test",
         timestamp: new Date().toISOString(),
       });

       // Test read
       const testDoc = await testRef.get();
       const data = testDoc.data();

       // Clean up test document
       await testRef.delete();

       return NextResponse.json({
         success: true,
         message: "Firebase connection successful!",
         testData: data,
         note: "Test document created, read, and deleted successfully.",
       });
     } catch (error: any) {
       return NextResponse.json(
         {
           success: false,
           error: error.message,
           message:
             "Firebase connection failed. Check your environment variables.",
           hint: "Verify FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set correctly.",
         },
         { status: 500 }
       );
     }
   }
   ```

2. **Test the Connection**

   ```bash
   npm run dev
   ```

   Visit: `http://localhost:3000/api/test-firebase`

   Expected response:

   ```json
   {
     "success": true,
     "message": "Firebase connection successful!",
     "testData": {
       "message": "Firebase connection test",
       "timestamp": "2024-01-01T12:00:00.000Z"
     },
     "note": "Test document created, read, and deleted successfully."
   }
   ```

3. **Delete Test Route** (after verification)
   - Remove `app/api/test-firebase/route.ts` once confirmed

---

## Create Firestore Collections Structure

Your application uses these collections. They will be created automatically when data is written, but here's the structure:

### Collections

1. **`registrations`** - Event registrations

   ```typescript
   {
     name: string;
     email: string;
     phone: string;
     address: string;
     whoInvited: string;
     heardFrom: string;
     createdAt: string; // ISO date string
   }
   ```

2. **`invitations`** - Invitation records

   ```typescript
   {
     inviterName: string;
     inviteeName: string;
     inviteePhone: string;
     inviteeEmail: string | null; // optional, can be null
     location: string;
     customMessage: string;
     status: "sent" | "pending" | "registered";
     createdAt: string; // ISO date string
   }
   ```

3. **`admins`** - Admin users (optional, for future use)

   ```typescript
   {
     email: string;
     role: string;
     createdAt: string;
   }
   ```

4. **`analytics`** - Analytics data (optional, for future use)
   ```typescript
   {
     event: string;
     data: object;
     timestamp: string;
   }
   ```

**Note:** Collections are created automatically when you write data. No manual setup needed!

---

## API Routes Implementation (Server-Side)

Your API routes are correctly implemented to work with the **default Firestore database** (free tier). All routes use Firebase Admin SDK for secure server-side access.

**Important:** Since you're using the **default database**, no database name needs to be specified. The Firebase Admin SDK automatically uses the default database.

Your application has the following API routes that interact with Firestore:

### 1. Registration API - `/app/api/registrations/route.ts`

**POST `/api/registrations`** - Create a new registration

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+234 123 456 7890",
  "address": "Gbagada, Lagos",
  "whoInvited": "Jane Smith",
  "heardFrom": "social-media"
}
```

Response (success):

```json
{
  "success": true,
  "id": "firestore-document-id"
}
```

Response (error):

```json
{
  "success": false,
  "error": "error message"
}
```

**Features:**

- Saves registration to Firestore `registrations` collection
- Automatically adds `createdAt` timestamp (ISO string format)
- Sends confirmation email to registrant
- Returns Firestore document ID

**GET `/api/registrations`** - Retrieve all registrations

Response (success):

```json
[
  {
    "id": "document-id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+234 123 456 7890",
    "address": "Gbagada, Lagos",
    "whoInvited": "Jane Smith",
    "heardFrom": "social-media",
    "createdAt": "2024-01-31T10:00:00.000Z"
  },
  ...
]
```

Response (error):

```json
{
  "success": false,
  "error": "error message"
}
```

**Features:**

- Returns all registrations ordered by `createdAt` in descending order (newest first)
- Each registration includes Firestore document ID
- Automatically handles pagination if needed (Firestore default limit is applied)

---

### 2. Invitation API - `/app/api/invitations/route.ts`

**POST `/api/invitations`** - Create a new invitation

Request body:

```json
{
  "inviterName": "John Doe",
  "inviteeName": "Jane Smith",
  "inviteePhone": "+234 123 456 7890",
  "inviteeEmail": "jane@example.com", // optional
  "location": "Lagos, Nigeria",
  "customMessage": "You're invited to Hillz Shift 4.0!"
}
```

Response (success):

```json
{
  "success": true,
  "id": "firestore-document-id",
  "registrationLink": "http://localhost:3000/register?ref=document-id",
  "hasEmail": true
}
```

Response (error):

```json
{
  "success": false,
  "error": "error message"
}
```

**Features:**

- Saves invitation to Firestore `invitations` collection
- Sets status to `"sent"` automatically
- Automatically adds `createdAt` timestamp (ISO string format)
- Generates registration link with invitation reference ID
- Sends email invitation **only if** `inviteeEmail` is provided
- Returns registration link for WhatsApp sharing

**GET `/api/invitations`** - Retrieve all invitations

Response (success):

```json
[
  {
    "id": "document-id",
    "inviterName": "John Doe",
    "inviteeName": "Jane Smith",
    "inviteePhone": "+234 123 456 7890",
    "inviteeEmail": "jane@example.com",
    "location": "Lagos, Nigeria",
    "customMessage": "You're invited!",
    "status": "sent",
    "createdAt": "2024-01-31T10:00:00.000Z"
  },
  ...
]
```

Response (error):

```json
{
  "success": false,
  "error": "error message"
}
```

**Features:**

- Returns all invitations ordered by `createdAt` in descending order (newest first)
- Each invitation includes Firestore document ID
- `inviteeEmail` may be `null` if not provided during invitation creation
- Uses automatic single-field index (no manual index setup needed)
- Works with default database (no database name specified)

**Implementation Details:**

```typescript
// ✅ Correct - Works with default database
const snapshot = await db
  .collection("invitations")
  .orderBy("createdAt", "desc") // Single-field index - works automatically
  .get();
```

---

### 3. Dashboard API - `/app/api/dashboard/route.ts`

**GET `/api/dashboard`** - Get dashboard statistics (for admin dashboard)

Response (success):

```json
{
  "totalRegistrations": 150,
  "totalInvitations": 75,
  "topInviters": [
    { "name": "John Doe", "count": 10 },
    { "name": "Jane Smith", "count": 8 },
    { "name": "Mike Johnson", "count": 5 }
  ],
  "registrations": [
    {
      "id": "doc-id",
      "name": "John Doe",
      "email": "john@example.com",
      ...
    },
    ...
  ],
  "invitations": [
    {
      "id": "doc-id",
      "inviterName": "John Doe",
      "inviteeName": "Jane Smith",
      ...
    },
    ...
  ]
}
```

Response (error):

```json
{
  "success": false,
  "error": "error message"
}
```

**Features:**

- Returns total counts for registrations and invitations
- Calculates top 5 inviters by invitation count (sorted descending)
- Includes full arrays of all registrations and invitations (no ordering - for dashboard display)
- Used by admin dashboard for analytics and statistics
- Works with default database (no database name specified)
- No `orderBy` needed for simple counts (more efficient)

**Implementation Details:**

```typescript
// ✅ Correct - Works with default database
// Simple queries without orderBy are most efficient
const regSnapshot = await db.collection("registrations").get();
const invSnapshot = await db.collection("invitations").get();

// Process in memory (efficient for datasets under 10K documents)
const registrations = regSnapshot.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
}));
```

### API Implementation Best Practices

**✅ Correct Patterns (Using Default Database):**

1. **Writing Data:**

   ```typescript
   // ✅ No database name needed - uses default automatically
   const docRef = await db.collection("registrations").add({
     name: "John Doe",
     createdAt: new Date().toISOString(), // Always include timestamp
   });
   ```

2. **Reading Data with OrderBy:**

   ```typescript
   // ✅ Single-field orderBy works automatically (no index setup needed)
   const snapshot = await db
     .collection("registrations")
     .orderBy("createdAt", "desc")
     .get();
   ```

3. **Simple Queries:**

   ```typescript
   // ✅ No orderBy = most efficient, works immediately
   const snapshot = await db.collection("registrations").get();
   ```

4. **Error Handling:**
   ```typescript
   // ✅ Always wrap in try-catch
   try {
     const docRef = await db.collection("registrations").add(data);
     return NextResponse.json({ success: true, id: docRef.id });
   } catch (error: any) {
     return NextResponse.json(
       { success: false, error: error.message },
       { status: 500 }
     );
   }
   ```

**❌ Common Mistakes to Avoid:**

1. **Don't specify database name:**

   ```typescript
   // ❌ WRONG - Don't do this with default database
   const db = getFirestore(app, "my-database-name");

   // ✅ CORRECT - Uses default database automatically
   const db = getFirestore(app);
   ```

2. **Don't forget timestamps:**

   ```typescript
   // ❌ WRONG - Missing createdAt
   await db.collection("registrations").add({ name, email });

   // ✅ CORRECT - Includes timestamp
   await db.collection("registrations").add({
     name,
     email,
     createdAt: new Date().toISOString(),
   });
   ```

3. **Don't forget document IDs:**

   ```typescript
   // ❌ WRONG - Missing document ID
   const data = snapshot.docs.map((doc) => doc.data());

   // ✅ CORRECT - Includes document ID
   const data = snapshot.docs.map((doc) => ({
     id: doc.id,
     ...doc.data(),
   }));
   ```

### Testing API Routes

**Test Registration Endpoint:**

```bash
# POST registration
curl -X POST http://localhost:3000/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+234 123 456 7890",
    "address": "Gbagada, Lagos",
    "whoInvited": "Friend",
    "heardFrom": "social-media"
  }'

# GET all registrations
curl http://localhost:3000/api/registrations
```

**Test Invitation Endpoint:**

```bash
# POST invitation
curl -X POST http://localhost:3000/api/invitations \
  -H "Content-Type: application/json" \
  -d '{
    "inviterName": "John Doe",
    "inviteeName": "Jane Smith",
    "inviteePhone": "+234 123 456 7890",
    "inviteeEmail": "jane@example.com",
    "location": "Lagos, Nigeria",
    "customMessage": "You are invited!"
  }'

# GET all invitations
curl http://localhost:3000/api/invitations
```

**Test Dashboard Endpoint:**

```bash
curl http://localhost:3000/api/dashboard
```

- Note: This endpoint loads all documents - consider pagination for large datasets

---

## Firebase Admin Implementation

Your Firebase Admin setup is located at `/src/lib/firebaseAdmin.ts`:

**Key Points:**

- Uses environment variables: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
- Automatically handles multiple initialization attempts (prevents duplicate app errors)
- Exports `db` (Firestore instance) and `auth` (Auth instance) for use in API routes
- **Works with default database automatically** - No database name needs to be specified
- Compatible with free Spark plan (default database is free)

**Code Implementation:**

```typescript
// ✅ Correct - Uses default database automatically
import { getFirestore } from "firebase-admin/firestore";

// No database name specified = uses default database
export const db: Firestore = app ? getFirestore(app) : (null as any);

// Usage in API routes:
await db.collection("registrations").add({ ... }); // ✅ Works with default database
```

**Important:** Your current implementation is correct! The `getFirestore(app)` call without a database name parameter automatically uses the default database, which is perfect for the free tier.

**Usage in API Routes:**

```typescript
import { db } from "@/src/lib/firebaseAdmin";

// Access collections (default database)
const docRef = await db.collection("registrations").add({...});
const snapshot = await db.collection("registrations").get();
```

**Important:** Since you're using the default database, you don't need to specify a database name. Firebase Admin SDK automatically uses the default database.

**Code Example:**

```typescript
// ✅ Correct - works with default database
const docRef = await db.collection("registrations").add({
  name: "John Doe",
  email: "john@example.com",
  // ...
});

// ✅ Correct - query with orderBy (requires index for non-default fields)
const snapshot = await db
  .collection("registrations")
  .orderBy("createdAt", "desc")
  .get();
```

---

## Firestore Indexes

Your API routes use `orderBy("createdAt", "desc")` queries. Firestore requires indexes for certain queries.

### Automatic Indexes

The `createdAt` field queries are automatically indexed by Firestore, so **no manual index setup is needed** for your current queries.

### Manual Indexes (If Needed)

If you need to query by other fields (e.g., `email`, `heardFrom`), you may need to create composite indexes:

1. **Go to Firestore Console**

   - Navigate to Firestore Database → **"Indexes"** tab
   - Click **"Create Index"** if needed

2. **Example Index** (only if needed for future queries):
   - Collection: `registrations`
   - Fields: `email` (Ascending)
   - Query scope: Collection

**Current Implementation:** No manual indexes needed! Your queries work with automatic indexing.

---

## Troubleshooting

### Issue: "Firebase App named '[DEFAULT]' already exists"

**Solution:** Your `firebaseAdmin.ts` already handles this with `getApps().length` check. This shouldn't happen, but if it does, the code will use the existing app.

### Issue: "Error: Cannot find module 'firebase-admin'"

**Solution:**

```bash
npm install firebase-admin
# or
yarn add firebase-admin
```

### Issue: "Error: The default Firebase app does not exist"

**Solution:**

- Check your `.env.local` file exists and has correct values
- Ensure environment variables are named correctly (case-sensitive)
- Restart your Next.js dev server after adding environment variables

### Issue: "Error: private_key must be a string"

**Solution:**

- Ensure `FIREBASE_PRIVATE_KEY` is wrapped in quotes
- Keep the `\n` characters (they represent newlines)
- The private key should include `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`

### Issue: "Permission denied"

**Solution:**

- Check Firestore Security Rules (should be set to deny all for production)
- Verify your service account has proper permissions
- Regenerate the service account key if needed
- Ensure you're working with the default database, not a named database

### Issue: "Database quota exceeded" or "Quota limit reached"

**Solution:**

- Check your Firebase Console → Usage tab to see current usage
- Free tier limits: 50K reads/day, 20K writes/day, 1 GB storage
- For most events, this is more than sufficient
- If you exceed limits, Firebase will pause operations until the next day (reads/writes reset daily)
- Consider optimizing queries or upgrading to Blaze plan only if consistently exceeding limits
- Storage (1 GB) is a hard limit - archive old data if needed

### Issue: Environment variables not loading

**Solution:**

- Make sure file is named exactly `.env.local` (not `.env`, `.env.local.txt`, etc.)
- Restart your development server after changing `.env.local`
- In Next.js, environment variables are only available at build/run time
- Check that variable names match exactly (case-sensitive)

### Issue: "Firestore collection not found"

**Solution:**

- Collections are created automatically on first write
- This is normal - Firestore creates collections dynamically
- Check Firebase Console → Firestore Database to see collections appear
- If you see this error, it means no data has been written yet - submit a registration or invitation to create the collection

### Issue: "The query requires an index"

**Solution:**

- Click on the error message in your browser/console - it will contain a direct link to create the index
- Or go to Firebase Console → Firestore Database → Indexes tab
- Click "Create Index" and follow the prompts
- Wait for index creation to complete (usually takes 1-5 minutes)
- Your current queries (`orderBy("createdAt")`) should work automatically - this error only appears for complex queries

### Issue: "orderBy is not supported"

**Solution:**

- Ensure you're ordering by a field that exists in your documents
- Check that `createdAt` is being saved as a string (ISO format) in all documents
- For single-field `orderBy`, Firestore automatically creates indexes - no manual setup needed
- If using `where` with `orderBy`, you may need a composite index

### Issue: API returns empty array

**Solution:**

- Check that data exists in Firestore Console
- Verify the collection name matches exactly (case-sensitive)
- Check that `orderBy("createdAt")` field exists in your documents
- Ensure documents have `createdAt` field set (your API adds this automatically)

---

## Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Never share your service account JSON file** publicly
3. **Use Firebase Admin SDK only on server-side** (API routes, server components)
4. **Set Firestore rules** to deny all client-side access
5. **Rotate service account keys** periodically
6. **Use different Firebase projects** for development and production (both can use free plans)

## Free Tier Limitations & Budget Considerations

**Firestore Free Tier (Spark Plan) Limits:**

- **Storage:** 1 GB total
- **Document Reads:** 50,000/day
- **Document Writes:** 20,000/day
- **Document Deletes:** 20,000/day
- **Network Egress:** 10 GB/month

**For Hillz Shift 4.0 Event:**

- Each registration = 1 write operation
- Each invitation = 1 write operation
- Admin dashboard queries = read operations
- **Estimated:** ~1,000-5,000 registrations = well within free limits

**Tips to Stay Within Free Tier:**

1. Only query what you need (avoid unnecessary reads)
2. Batch operations when possible
3. Use indexes efficiently
4. Monitor usage in Firebase Console → Usage tab
5. Set up billing alerts if you upgrade to Blaze plan later (optional)

**When to Consider Upgrade:**

- If you expect >20,000 registrations/day
- If you need >1 GB storage
- If you need additional features (Cloud Functions, etc.)

---

## Production Deployment

For production (Vercel, Netlify, etc.):

1. **Add Environment Variables** in your hosting platform's dashboard

   - Go to Project Settings → Environment Variables
   - Add the same variables: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
   - Also add Firebase Client SDK variables if using: `NEXT_PUBLIC_FIREBASE_API_KEY`, etc.

2. **Deploy**

   - Your app will use these environment variables in production
   - They're secure and not exposed to the client

3. **Monitor Usage (Free Plan)**
   - Keep an eye on your Firestore usage in Firebase Console
   - Free tier includes: 1 GB storage, 50K reads/day, 20K writes/day, 20K deletes/day
   - For most small to medium events, the free tier is sufficient
   - You can upgrade to Blaze (pay-as-you-go) only if you exceed limits

---

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Admin SDK for Node.js](https://firebase.google.com/docs/admin/setup)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

---

## Quick Checklist

- [ ] Firebase project created on Spark (Free) plan
- [ ] Firestore default database enabled (not a named database)
- [ ] Database location selected (free for default database)
- [ ] Service account key downloaded
- [ ] `.env.local` file created with correct values
- [ ] `.env.local` added to `.gitignore`
- [ ] Firestore security rules set for default database
- [ ] Connection tested successfully
- [ ] Server restarted after adding environment variables
- [ ] Verified free tier limits are sufficient for your event size
- [ ] API routes tested (POST and GET endpoints working)
- [ ] Verified API routes use default database (no database name specified)

---

## API Routes Verification Summary

**✅ Your API Routes Are Correctly Implemented:**

1. **`/api/registrations`** ✅

   - POST: Creates registrations in default database
   - GET: Retrieves registrations with automatic indexing
   - Uses `db.collection("registrations")` - works with default database

2. **`/api/invitations`** ✅

   - POST: Creates invitations in default database
   - GET: Retrieves invitations with automatic indexing
   - Uses `db.collection("invitations")` - works with default database

3. **`/api/dashboard`** ✅
   - GET: Aggregates data from default database
   - Uses efficient queries without unnecessary orderBy
   - Works with default database

**Key Implementation Details:**

- ✅ All routes use `db` from `firebaseAdmin.ts` (default database)
- ✅ No database name specified anywhere (correct for free tier)
- ✅ All queries use automatic single-field indexes
- ✅ Error handling is properly implemented
- ✅ Timestamps are included in all documents
- ✅ Document IDs are included in all responses

**Your implementation is production-ready for the free tier!** 🎉

---

**Need Help?** Check the troubleshooting section or review the Firebase console for any error messages.
