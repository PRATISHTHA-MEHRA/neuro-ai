# NeuroAI Mobile App

A React Native mobile application built with Expo for speech training and phoneme detection.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
- Install Expo Go app on your iOS or Android device
- Scan the QR code with Expo Go (Android) or Camera app (iOS)

### Run on Emulator/Simulator

For Android:
```bash
npm run android
```

For iOS:
```bash
npm run ios
```

## Features

- User Authentication with Auth0
- Speech Training and Detection
- Phoneme Catalog
- Progress Tracking
- Real-time Audio Recording
- Interactive Learning Interface

## Project Structure

```
mobile-app/
├── src/
│   ├── screens/          # All app screens
│   ├── components/       # Reusable components
│   ├── navigation/       # Navigation configuration
│   ├── assets/          # Images and fonts
│   ├── constants/       # App constants
│   └── utils/          # Utility functions
├── App.js              # Main app entry
├── app.json           # Expo configuration
└── package.json       # Dependencies
```

## Technologies Used

- React Native
- Expo
- React Navigation
- Auth0 (React Native)
- Axios
- Dayjs
