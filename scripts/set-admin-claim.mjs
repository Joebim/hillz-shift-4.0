#!/usr/bin/env node

/**
 * Script to set admin custom claim on a Firebase user
 * 
 * Usage: node scripts/set-admin-claim.mjs <email>
 * Example: node scripts/set-admin-claim.mjs admin@hillzshift.org
 */

import admin from 'firebase-admin';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local in project root
config({ path: resolve(__dirname, '..', '.env.local') });

// Initialize Firebase Admin using environment variables
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  console.error('❌ Missing Firebase Admin credentials in .env.local');
  console.error('   Required: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
  process.exit(1);
}

try {
  // Check if already initialized (in case script is run multiple times)
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error.message);
  process.exit(1);
}

const email = process.argv[2];
if (!email) {
  console.error('❌ Usage: node scripts/set-admin-claim.mjs <email>');
  console.error('   Example: node scripts/set-admin-claim.mjs admin@hillzshift.org');
  process.exit(1);
}

async function setAdminClaim() {
  try {
    console.log(`🔍 Looking up user: ${email}...`);
    
    const user = await admin.auth().getUserByEmail(email);
    console.log(`✅ Found user: ${user.email} (UID: ${user.uid})`);
    
    // Check if already has admin claim
    const currentClaims = user.customClaims || {};
    if (currentClaims.admin === true) {
      console.log('ℹ️  User already has admin claim. Skipping...');
      return;
    }
    
    console.log('🔧 Setting admin custom claim...');
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
    console.log('✅ Successfully set admin claim!');
    console.log('');
    console.log('⚠️  IMPORTANT:');
    console.log('   1. User must sign out from the admin panel');
    console.log('   2. User must sign back in');
    console.log('   3. Only then will the new token (with admin claim) be issued');
    console.log('');
    console.log('   If the user is currently logged in, they need to:');
    console.log('   - Click logout button in admin panel');
    console.log('   - Login again at /admin/login');
    
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`❌ User not found: ${email}`);
      console.error('   Please create the user first in Firebase Console:');
      console.error('   https://console.firebase.google.com/project/hillz-shift-4-55277/authentication/users');
    } else {
      console.error('❌ Error:', error.message);
      console.error('   Code:', error.code || 'UNKNOWN');
    }
    process.exit(1);
  }
}

setAdminClaim().then(() => process.exit(0));