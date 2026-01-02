# Finance Tracker - Testing Guide

## 🧪 How to Test the Application

### Option 1: iOS Simulator (Recommended for Mac)

1. **Install CocoaPods dependencies** (one-time setup):
   ```bash
   cd ios
   pod install
   cd ..
   ```

2. **Start Metro bundler**:
   ```bash
   npm start
   ```

3. **Run on iOS** (in a new terminal):
   ```bash
   npm run ios
   ```

### Option 2: Android Emulator

1. **Start Android emulator** from Android Studio

2. **Start Metro bundler**:
   ```bash
   npm start
   ```

3. **Run on Android** (in a new terminal):
   ```bash
   npm run android
   ```

### Option 3: Physical Device

#### iOS (Requires Apple Developer Account):
1. Open `ios/FinanceTracker.xcworkspace` in Xcode
2. Select your device
3. Click Run

#### Android:
1. Enable USB debugging on your device
2. Connect via USB
3. Run: `npm run android`

## 🎯 What to Test

### 1. Authentication Flow
- [ ] Open the app → Should show Login screen
- [ ] Try invalid credentials → Should show error
- [ ] Use demo credentials:
  - Email: `demo@financetracker.com`
  - Password: `demo123`
- [ ] Should successfully log in
- [ ] Create new account → Should work
- [ ] Sign out → Should return to login

### 2. Watchlist Screen
- [ ] After login → Should see "My Watchlist"
- [ ] Should see 3 pre-loaded assets (AAPL, GOOGL, BTC)
- [ ] Pull down to refresh → Should reload prices
- [ ] Prices should update automatically every 60 seconds
- [ ] Each card should show:
  - Asset symbol and name
  - Current price
  - Percentage change (green/red)

### 3. Search & Add Assets
- [ ] Tap "Add Asset" button
- [ ] Search modal should open
- [ ] Type "TSLA" → Should show Tesla results
- [ ] Type "ETH" → Should show Ethereum results
- [ ] Filter by "Stock" → Should show only stocks
- [ ] Filter by "Crypto" → Should show only crypto
- [ ] Tap on a result → Should add to watchlist
- [ ] Return to watchlist → New asset should appear

### 4. Real-time Price Updates
- [ ] Wait 60 seconds on watchlist screen
- [ ] Prices should automatically refresh
- [ ] Percentage changes should update
- [ ] Colors should change (green for up, red for down)

### 5. UI/UX Testing
- [ ] Dark mode: Change system theme → App should adapt
- [ ] Light mode: Change back → App should adapt
- [ ] Empty state: Remove all assets → Should show empty message
- [ ] Loading states: Pull to refresh → Should show loading
- [ ] Responsive: Rotate device → UI should adapt

## 🐛 Known Issues & Limitations

### Current Limitations:
1. **No Firebase**: Using mock data (resets on app restart)
2. **No Charts**: Chart visualization not yet implemented
3. **No Asset Details**: Tapping asset doesn't open detail screen yet
4. **API Rate Limits**: Free tier APIs have request limits
5. **No Persistence**: Watchlist resets when app closes

### Expected Behavior:
- Mock data includes demo user and 3 pre-loaded assets
- Real API calls for price data (may be slow or fail due to rate limits)
- Authentication works but data doesn't persist

## 📊 Testing with Real API Data

### Setup API Keys (Optional):

1. Get free API keys:
   - TwelveData: https://twelvedata.com/
   - CoinGecko: https://www.coingecko.com/

2. Create `.env` file:
   ```env
   TWELVEDATA_API_KEY=your_key_here
   COINGECKO_API_KEY=your_key_here
   ```

3. Restart Metro bundler:
   ```bash
   npm start --reset-cache
   ```

### Without API Keys:
- App will use demo/fallback mode
- Some features may not work
- Prices may not update

## 🔍 Debugging

### Metro Bundler Issues:
```bash
# Clear cache and restart
npm start --reset-cache
```

### iOS Build Issues:
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### Android Build Issues:
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Check Logs:
```bash
# iOS
npx react-native log-ios

# Android
npx react-native log-android
```

## ✅ Test Checklist Summary

- [ ] App launches successfully
- [ ] Login with demo credentials works
- [ ] Watchlist displays with 3 assets
- [ ] Prices are visible (may be loading)
- [ ] Pull-to-refresh works
- [ ] Search opens and works
- [ ] Can add new assets
- [ ] Sign out works
- [ ] Dark/Light mode works
- [ ] No crashes or errors

## 📝 Reporting Issues

If you encounter issues, note:
1. Device/Simulator used
2. iOS/Android version
3. Error messages in Metro bundler
4. Screenshots of the issue
5. Steps to reproduce

## 🚀 Next Steps After Testing

Once basic testing is complete:
1. Implement chart visualization
2. Add asset detail screen
3. Set up real Firebase
4. Add more features (alerts, portfolio, etc.)
