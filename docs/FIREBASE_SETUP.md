# Firebase Setup Guide

This guide will help you set up Firebase for the Finance Tracker application.

## Prerequisites

- A Google account
- Node.js and npm installed

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `finance-tracker` (or your preferred name)
4. Disable Google Analytics (optional for this project)
5. Click **"Create project"**

## Step 2: Register Your Apps

### For iOS:

1. In Firebase Console, click the iOS icon
2. Enter iOS bundle ID: `com.financetracker` (must match your Xcode project)
3. Download `GoogleService-Info.plist`
4. Move the file to `/ios/FinanceTracker/` directory
5. Open Xcode and add the file to your project (right-click on FinanceTracker folder → Add Files)

### For Android:

1. In Firebase Console, click the Android icon
2. Enter Android package name: `com.financetracker` (must match your build.gradle)
3. Download `google-services.json`
4. Move the file to `/android/app/` directory

## Step 3: Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Click **Save**

## Step 4: Set Up Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in test mode"** (we'll add security rules later)
4. Choose a location closest to your users
5. Click **"Enable"**

## Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. In Firebase Console, go to **Project Settings** (gear icon)
3. Scroll down to **"Your apps"** section
4. Copy the Firebase configuration values
5. Update your `.env` file with these values:
   ```env
   FIREBASE_API_KEY=your_api_key_here
   FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

## Step 6: Install iOS Dependencies

```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

## Step 7: Verify Installation

Run the app to verify Firebase is properly configured:

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

## Firestore Security Rules (Production)

Before deploying to production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /watchlists/{watchlistId} {
      allow read, write: if request.auth != null && 
                           resource.data.userId == request.auth.uid;
    }
  }
}
```

## Troubleshooting

### iOS Issues:
- Make sure `GoogleService-Info.plist` is added to Xcode project
- Clean build folder: Product → Clean Build Folder
- Reinstall pods: `cd ios && pod install`

### Android Issues:
- Verify `google-services.json` is in `/android/app/`
- Check package name matches in `build.gradle`
- Clean and rebuild: `cd android && ./gradlew clean`

## Next Steps

After completing this setup, you can:
- Register new users
- Sign in with email/password
- Store user data in Firestore
- Manage watchlists per user
