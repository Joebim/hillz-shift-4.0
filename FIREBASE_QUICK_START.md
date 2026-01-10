# Firebase Quick Start Guide

A condensed version for experienced developers.

## 1. Create Firebase Project
- Go to https://console.firebase.google.com/
- Click "Add project" → Name it → Create

## 2. Enable Firestore (Free Default Database)
- Click "Firestore Database" → "Create database"
- **Important:** Use the default database (first/default option)
- Do NOT select "Create a named database" (requires paid plan)
- Choose "Start in production mode" → Select location → Enable
- Verify you see "(default)" next to database name after creation

## 3. Get Service Account Key
- Project Settings (gear icon) → Service accounts tab
- Click "Generate new private key" → Download JSON

## 4. Extract Credentials from JSON
```json
{
  "project_id": "your-project-id",           // → FIREBASE_PROJECT_ID
  "client_email": "firebase-adminsdk-...",    // → FIREBASE_CLIENT_EMAIL
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"  // → FIREBASE_PRIVATE_KEY
}
```

## 5. Create `.env.local`
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"

EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 6. Set Firestore Rules (Default Database)
Firestore Database → Rules tab (make sure you're in default database) → Replace with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```
Click "Publish" (rules apply to default database)

**Free Tier Limits:** 50K reads/day, 20K writes/day, 1 GB storage - sufficient for most events

## 7. Test Connection
Restart dev server:
```bash
npm run dev
```

Your Firebase setup is ready! Collections will be created automatically when data is written.

## Collections Structure

- `registrations` - Event registrations
- `invitations` - Invitation records  
- `admins` - Admin users (optional)
- `analytics` - Analytics data (optional)

---

**Full documentation:** See `FIREBASE_SETUP.md` for detailed instructions and troubleshooting.
