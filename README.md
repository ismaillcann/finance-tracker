# Finance Tracker Mobile 📈

A premium mobile application for tracking financial markets, visualizing data, and staying updated with global news. Built as a graduation thesis project, featuring high-end UI/UX practices and modern engineering standards.

## ✨ Key Features

### 📊 Advanced Visualization
- **Interactive Charts**: Professional Area, Line, and Candlestick charts powered by `victory-native`.
- **Zoom & Pan**: Smooth gesture controls for detailed data inspection.
- **Dynamic Theming**: Charts adapt to price trends (Green/Red) and app theme (Light/Dark).

### 📰 Market Intelligence
- **News Tab**: Dedicated financial news feed with infinite scroll.
- **Premium Cards**: Visual-rich news cards with reliable source attribution and "time ago" logic.
- **In-App Browser**: Seamless reading experience.

### 💼 Portfolio Management
- **Watchlist**: Real-time tracking of Stocks, Indices, and Crypto.
- **Cloud Sync**: Securely syncs your watchlist across devices using **Firebase Firestore**.
- **Real-time Updates**: Live price monitoring associated with your account.

### 🎨 Premium User Experience
- **Onboarding Flow**: Smooth welcome screens for new users.
- **Haptic Feedback**: Tactile responses for interactions (selection, refresh, deletion).
- **Animations**: Fluid page transitions and micro-interactions.
- **Dark Mode**: Fully supported system-wide dark theme (`#1e293b` Slate Palette).

## 🛠 Tech Stack

- **Framework**: React Native 0.76+
- **Language**: TypeScript
- **Backend API**: Firebase (Auth & Firestore)
- **Financial API**: CoinGecko & TwelveData
- **Navigation**: React Navigation (Bottom Tabs & Native Stack)
- **State Management**: React Hooks & Context
- **Storage**: AsyncStorage (Local) & Firestore (Cloud)

## � Getting Started

### Prerequisites
- Node.js >= 18
- iOS Simulator (Xcode) or Android Emulator

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/ismaillconn/finance-tracker.git
   cd finance-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd ios && pod install && cd ..
   ```

3. **Configure Environment**
   Create a `.env` file in the root:
   ```env
   FIREBASE_API_KEY=...
   FIREBASE_AUTH_DOMAIN=...
   FIREBASE_PROJECT_ID=...
   FIREBASE_APP_ID=...
   # (See src/services/firebase/config.ts for full list)
   ```

4. **Run the App**
   ```bash
   npm run ios    # for iOS
   npm run android # for Android
   ```

## 👨‍💻 Author

**İsmail Can**  
Student ID: 2020556013  
*Graduation Thesis Project*
