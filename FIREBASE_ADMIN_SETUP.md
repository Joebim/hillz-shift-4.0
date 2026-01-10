# Firebase Admin User Setup Guide

This guide explains how to set up an admin user for the Hillz Shift 4.0 admin panel using Firebase Authentication.

## Quick Start (Fastest Method)

1. **Enable Firebase Authentication**:

   - Go to [Firebase Console](https://console.firebase.google.com/project/hillz-shift-4-55277/authentication)
   - Click **Get Started** → **Sign-in method** tab → Enable **Email/Password**

2. **Create User Account**:

   - Go to **Users** tab → Click **Add user**
   - Enter email: `admin@hillzshift.org` (or your email)
   - Enter a strong password → Click **Add user**

3. **Set Email Allowlist**:

   - Open `.env.local` file in project root
   - Add: `ADMIN_EMAILS=admin@hillzshift.org`
   - Save and **restart your dev server**

4. **Test Login**:
   - Go to `http://localhost:3000/admin/login`
   - Enter your email and password
   - You should be redirected to the admin dashboard ✅

---

## Overview

The admin authentication system supports **two methods**:

1. **Email Allowlist** (Simple - Recommended for getting started) ⚡ Fastest
2. **Custom Claims** (More secure - Recommended for production) 🔒 Most Secure

---

## Method 1: Email Allowlist (Simplest)

### Step 1: Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **hillz-shift-4-55277**
3. Navigate to **Authentication** in the left sidebar
4. Click **Get Started** if you haven't enabled it yet
5. Go to the **Sign-in method** tab
6. Click on **Email/Password**
7. **Enable** it and click **Save**

### Step 2: Create Admin User Account

1. In Firebase Console, go to **Authentication** → **Users** tab
2. Click **Add user** button (or **Add account**)
3. Enter:
   - **Email**: `admin@hillzshift.org` (or your desired admin email)
   - **Password**: Choose a strong password
4. Click **Add user**

### Step 3: Configure Email Allowlist

1. In your project root, open or create `.env.local` file
2. Add the admin email(s) to `ADMIN_EMAILS`:

```env
# Single admin email
ADMIN_EMAILS=admin@hillzshift.org

# Multiple admin emails (comma-separated)
ADMIN_EMAILS=admin@hillzshift.org,superadmin@hillzshift.org,manager@hillzshift.org
```

3. **Restart your Next.js development server** for changes to take effect

### Step 4: Test Login

1. Navigate to `http://localhost:3000/admin/login`
2. Enter the email and password you created
3. You should be redirected to `/admin` dashboard

---

## Method 2: Custom Claims (More Secure - Recommended for Production)

Custom claims are better because they're part of the Firebase token itself and can't be easily bypassed.

### Step 1: Enable Firebase Authentication (Same as Method 1)

Follow Steps 1-2 from Method 1 to enable Email/Password auth and create a user account.

### Step 2: Set Custom Claim via Admin Script

Create a script to set the `admin` custom claim on your user:

**Option A: Using Firebase CLI (Recommended)**

1. Install Firebase CLI if you haven't:

```bash
npm install -g firebase-tools
```

2. Create a script file `scripts/set-admin-claim.js`:

```javascript
const admin = require("firebase-admin");
const path = require("path");

// Initialize Firebase Admin
const serviceAccount = require("../path-to-your-service-account-key.json"); // Download this from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function setAdminClaim(email) {
  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);

    // Set custom claim
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });

    console.log(
      `✅ Successfully set admin claim for ${email} (UID: ${user.uid})`
    );
    console.log(
      "⚠️  User must sign out and sign back in for changes to take effect."
    );
  } catch (error) {
    console.error("❌ Error setting admin claim:", error);
  }
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/set-admin-claim.js <email>");
  process.exit(1);
}

setAdminClaim(email).then(() => process.exit(0));
```

3. Run the script:

```bash
node scripts/set-admin-claim.js admin@hillzshift.org
```

**Option B: Using Existing Firebase Admin SDK**

Since you already have Firebase Admin configured via environment variables, you can create a simpler script:

```javascript
// scripts/set-admin-claim.js
const admin = require("firebase-admin");

// Your existing Firebase Admin initialization should work if env vars are set
// Just ensure your .env.local has FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY

async function setAdminClaim(email) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`✅ Admin claim set for ${email}`);
    console.log("⚠️  User must sign out and sign back in!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/set-admin-claim.js <email>");
  process.exit(1);
}

setAdminClaim(email).then(() => process.exit(0));
```

**Option C: Using the Provided Script (Easiest)**

A helper script is already included in the project at `scripts/set-admin-claim.mjs`.

1. **Install dotenv** (if not already installed):

```bash
npm install --save-dev dotenv
```

2. **Run the script**:

```bash
node scripts/set-admin-claim.mjs admin@hillzshift.org
```

The script will:

- ✅ Load your `.env.local` file automatically
- ✅ Use your existing Firebase Admin credentials
- ✅ Set the `admin: true` custom claim
- ✅ Provide clear success/error messages
- ✅ Warn you that the user must re-authenticate

### Step 3: User Must Re-authenticate

⚠️ **Important**: After setting custom claims, the user **must sign out and sign back in** for the new token (with claims) to be issued.

### Step 4: (Optional) Clear ADMIN_EMAILS for Production

If using custom claims, you can remove or leave empty `ADMIN_EMAILS` in `.env.local`:

```env
ADMIN_EMAILS=  # Empty - only custom claims will be checked
```

---

## Verification

### Check if Admin Access Works

1. Log in at `/admin/login`
2. If successful, you should see the admin dashboard at `/admin`
3. Try accessing protected API routes - they should work

### Troubleshooting

**Problem**: "Forbidden" error after login

- **Solution**: Check that the email is in `ADMIN_EMAILS` (Method 1) OR custom claim is set (Method 2)
- **For Method 2**: Ensure user signed out and signed back in after setting claims

**Problem**: "Auth failed" or "Invalid credentials"

- **Solution**: Verify user exists in Firebase Console → Authentication → Users
- **Solution**: Check that Email/Password provider is enabled

**Problem**: Can't access admin pages

- **Solution**: Check browser console and network tab for errors
- **Solution**: Verify `ADMIN_EMAILS` env variable is set correctly
- **Solution**: Restart your Next.js server after changing `.env.local`

---

## Security Best Practices

1. **Use Strong Passwords**: Admin accounts should have strong, unique passwords
2. **Enable 2FA** (if supported): Add an extra layer of security
3. **Use Custom Claims in Production**: More secure than email allowlist
4. **Limit Admin Emails**: Only add emails you absolutely trust
5. **Regular Audits**: Review admin users periodically in Firebase Console
6. **Environment Variables**: Never commit `.env.local` to version control

---

## Quick Reference

### Environment Variables

```env
# Required for Firebase Admin SDK
FIREBASE_PROJECT_ID=hillz-shift-4-55277
FIREBASE_CLIENT_EMAIL=your-service-account-email@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

# Required for Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=hillz-shift-4-55277.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=hillz-shift-4-55277

# Optional: Admin email allowlist
ADMIN_EMAILS=admin@hillzshift.org
```

### Firebase Console Links

- **Authentication**: https://console.firebase.google.com/project/hillz-shift-4-55277/authentication
- **Users**: https://console.firebase.google.com/project/hillz-shift-4-55277/authentication/users
- **Sign-in Methods**: https://console.firebase.google.com/project/hillz-shift-4-55277/authentication/providers

---

## Next Steps

After setting up your admin user:

1. ✅ Test login at `/admin/login`
2. ✅ Verify you can access `/admin` dashboard
3. ✅ Test protected API routes (`/api/dashboard`, `/api/registrations`, etc.)
4. ✅ (Optional) Set up additional admin users as needed
5. ✅ (Recommended) Use custom claims for production deployment
