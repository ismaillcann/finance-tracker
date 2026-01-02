# Finance Tracker - Mock Data Development Guide

## 🎯 Current Status

The app is now configured to run **without Firebase** using mock data services. This allows you to develop and test features before setting up Firebase.

## 🔑 Demo Credentials

Use these credentials to log in:

- **Email**: `demo@financetracker.com`
- **Password**: `demo123`

Or create a new account - it will be stored in memory (resets on app restart).

## 📊 Pre-loaded Mock Data

The demo account comes with a pre-populated watchlist:

1. **Apple Inc. (AAPL)** - Stock
2. **Alphabet Inc. (GOOGL)** - Stock  
3. **Bitcoin (BTC)** - Cryptocurrency

## 🏗️ Mock Services

### Authentication (`src/services/firebase/auth.mock.ts`)
- Sign up (creates in-memory user)
- Sign in (validates against mock users)
- Sign out
- Auth state management

### Firestore (`src/services/firebase/firestore.mock.ts`)
- Get user watchlist
- Add assets to watchlist
- Remove assets from watchlist
- Update watchlist order
- Real-time watchlist updates (simulated)

## 🚀 Running the App

### Option 1: iOS Simulator (Requires Xcode)

```bash
# Install Xcode Command Line Tools first
xcode-select --install

# Then run
npm run ios
```

### Option 2: Android Emulator

```bash
# Start Android emulator from Android Studio
# Then run
npm run android
```

### Option 3: Physical Device

1. Install Expo Go app on your phone
2. Run: `npx expo start`
3. Scan QR code with Expo Go

## 📝 Development Workflow

### Adding New Features

All Firebase calls are abstracted through service files:
- `src/services/firebase/auth.ts` - Authentication
- `src/services/firebase/firestore.ts` - Database

These currently export from `.mock.ts` files. When ready for Firebase:

1. Implement real Firebase in separate files
2. Update exports in `auth.ts` and `firestore.ts`
3. Add Firebase config files

### Testing API Integration

The app includes API services for:
- **TwelveData**: Stock market data
- **CoinGecko**: Cryptocurrency data

To test with real data:
1. Get API keys from [docs/API_SETUP.md](./API_SETUP.md)
2. Create `.env` file with keys
3. Restart Metro bundler

## 🔄 Switching to Real Firebase

When ready to use real Firebase:

### Step 1: Follow Firebase Setup
See [docs/FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

### Step 2: Install Firebase Packages

```bash
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
```

### Step 3: Create Real Firebase Services

Create `auth.firebase.ts` and `firestore.firebase.ts` with real Firebase implementation.

### Step 4: Update Service Exports

In `src/services/firebase/auth.ts`:
```typescript
// Change from:
export * from './auth.mock';

// To:
export * from './auth.firebase';
```

Same for `firestore.ts`.

### Step 5: Rebuild

```bash
cd ios && pod install && cd ..
npm run ios
```

## 🐛 Troubleshooting

### "Module not found" errors
```bash
npm install
npx react-native start --reset-cache
```

### iOS build issues
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Android build issues
```bash
cd android
./gradlew clean
cd ..
```

## 📱 Features to Implement Next

- [ ] Complete Watchlist screen with real-time prices
- [ ] Asset search functionality
- [ ] Asset detail screen with charts
- [ ] Price alerts
- [ ] Portfolio tracking

## 💡 Tips

- Mock data persists only in memory - restarting the app resets everything
- Use demo credentials for quick testing
- Add more mock data in `*.mock.ts` files as needed
- API calls work with real endpoints (rate limits apply)
