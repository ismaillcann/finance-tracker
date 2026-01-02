# Finance Tracker Mobile

A comprehensive mobile application for tracking and visualizing financial market data including stocks, indices, and cryptocurrencies with real-time updates and interactive charts.

## 🎯 Features

- **Real-time Market Data**: Track stocks, indices, and cryptocurrencies with live price updates
- **Interactive Charts**: Candlestick, line, and volume charts with zoom and pan capabilities
- **Personalized Watchlist**: Create and manage your custom watchlist
- **Comprehensive Metrics**: View open, high, low, close, volume, and market cap data
- **Cross-Platform**: Works on both iOS and Android
- **Dark Mode Support**: Beautiful UI with light and dark themes

## 🛠 Technology Stack

- **Frontend**: React Native 0.83.1 with TypeScript
- **Navigation**: React Navigation
- **Charts**: Victory Native
- **Backend**: Firebase (Authentication & Firestore)
- **Data APIs**: TwelveData (stocks/indices) & CoinGecko (crypto)
- **State Management**: TanStack Query (React Query)

## 📋 Prerequisites

- Node.js >= 20
- npm or yarn
- Xcode (for iOS development)
- Android Studio (for Android development)
- CocoaPods (for iOS dependencies)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/finance-tracker.git
cd finance-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install iOS dependencies

```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

### 4. Configure environment variables

Create a `.env` file in the root directory:

```env
TWELVEDATA_API_KEY=your_twelvedata_api_key
COINGECKO_API_KEY=your_coingecko_api_key
```

See [docs/API_SETUP.md](docs/API_SETUP.md) for detailed API setup instructions.

### 5. Configure Firebase

Follow the instructions in [docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md) to set up Firebase for authentication and Firestore.

### 6. Run the app

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Buttons, inputs, cards, loaders
│   └── charts/         # Chart components
├── screens/            # Screen components
│   ├── auth/          # Login, Register
│   ├── watchlist/     # Watchlist screen
│   └── asset/         # Asset detail screen
├── navigation/         # Navigation configuration
├── services/          # API services
│   ├── api/          # Financial data API
│   └── firebase/     # Firebase services
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
└── theme/             # Theme configuration
```

## 🧪 Testing

Run tests:
```bash
npm test
```

Run linter:
```bash
npm run lint
```

Type checking:
```bash
npx tsc --noEmit
```

## 📝 License

This project is part of a graduation thesis.

## 👨‍💻 Author

İsmail Can - Student ID: 2020556013

## 🙏 Acknowledgments

This project was developed as a graduation thesis focusing on modern mobile development technologies and advanced frontend engineering.
