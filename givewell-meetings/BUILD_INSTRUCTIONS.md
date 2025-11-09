# Building a Standalone App

Follow these steps to build an installable app for your phone:

## Step 1: Create an Expo Account (if you don't have one)

1. Go to https://expo.dev/signup
2. Create a free account
3. Verify your email

## Step 2: Log in to EAS CLI

Open a terminal and run:

```bash
cd ~/Projects/givewell-board-meetings/givewell-meetings
eas login
```

Enter your Expo username/email and password when prompted.

## Step 3: Build the App

### For Android (APK file):

```bash
eas build --platform android --profile preview
```

This will:
- Build the app in the cloud (takes ~15-20 minutes)
- Generate an APK file you can install on any Android phone
- Send you a download link when complete

### For iPhone (requires Apple Developer account):

```bash
eas build --platform ios --profile preview
```

Note: iOS builds require an Apple Developer account ($99/year)

## Step 4: Install on Your Phone

### Android:
1. Click the download link EAS sends you
2. Download the APK file to your phone
3. Open the file and tap "Install"
4. You may need to allow "Install from unknown sources" in settings

### iPhone:
1. EAS will guide you through TestFlight installation
2. Or you can build for the App Store

## Alternative: Quick Android Build (Local)

If you want to build locally without waiting for EAS:

```bash
# Install Android SDK first
eas build --platform android --local
```

This builds on your computer instead of in the cloud.

## After Building

Once installed, the app will:
- Work completely offline with local data
- Load episode data and descriptions
- Stream audio from GitHub
- Save your progress locally
- Work on any network (no computer needed!)

## Updating the App

When you want to release a new version:

1. Update the version in `app.json`:
   ```json
   "version": "1.1.0"
   ```

2. Build again with EAS
3. Install the new APK on your phone
