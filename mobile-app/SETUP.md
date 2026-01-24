# NeuroAI Mobile App - Installation & Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- For iOS: Xcode (Mac only)
- For Android: Android Studio with Android SDK

## Installation Steps

1. **Navigate to the mobile app directory:**
   ```bash
   cd mobile-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   or
   ```bash
   expo start
   ```

## Running the App

### On Physical Device (Recommended for testing)

1. Install **Expo Go** app from:
   - iOS: App Store
   - Android: Google Play Store

2. Scan the QR code shown in the terminal or browser with:
   - iOS: Camera app
   - Android: Expo Go app

### On Emulator/Simulator

**For Android:**
```bash
npm run android
```

**For iOS (Mac only):**
```bash
npm run ios
```

## Project Structure

```
mobile-app/
├── src/
│   ├── screens/          # All app screens (Home, Learning, etc.)
│   ├── components/       # Reusable components (Buttons, Cards, etc.)
│   ├── navigation/       # Navigation configuration
│   ├── assets/          # Images, fonts, and other assets
│   ├── constants/       # App constants (colors, API endpoints)
│   └── utils/          # Utility functions (API calls, helpers)
├── App.js              # Main app entry point
├── app.json           # Expo configuration
├── package.json       # Dependencies
└── README.md         # This file
```

## Features Implemented

✅ Complete navigation system with React Navigation
✅ Bottom tab navigation for main screens
✅ Stack navigation for detailed views
✅ Auth0 authentication integration
✅ All screens converted from web to mobile:
  - Home Screen
  - Learning Screen
  - Detection Screen
  - Overall Test Screen
  - Course Test Screen
  - About Screen
  - Articles Screen

✅ All components converted:
  - CourseModal
  - Footer
  - Mic
  - RecordButton
  - NavButton
  - RecordingLoader
  - ArticlesComponent

✅ API integration for:
  - Word generation
  - Audio recording
  - Phoneme detection
  - Remedy suggestions

✅ Responsive mobile UI
✅ Custom styling with theme constants

## Configuration

### API Endpoints
Update the API base URL in `src/constants/theme.js`:
```javascript
export const API_BASE_URL = 'http://your-server-address:5000';
```

### Auth0 Configuration
Update Auth0 credentials in `src/constants/theme.js`:
```javascript
export const AUTH0_CONFIG = {
  domain: 'your-auth0-domain',
  clientId: 'your-client-id',
};
```

## Assets

The app currently uses emoji placeholders for images. To add actual images:

1. Copy images from `frontend/src/assets/` to `mobile-app/src/assets/`
2. Import and use them in components:
   ```javascript
   import MicImage from '../assets/Mic.png';
   <Image source={MicImage} />
   ```

## Testing

The app is fully responsive and optimized for:
- Various screen sizes (phones and tablets)
- Both iOS and Android platforms
- Portrait orientation (recommended)

## Common Issues & Solutions

**Issue: Metro bundler not starting**
- Solution: Clear cache with `expo start -c`

**Issue: Cannot connect to backend**
- Solution: Use your computer's local IP instead of localhost
- Find IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- Update API_BASE_URL to `http://YOUR_IP:5000`

**Issue: Auth0 redirect not working**
- Solution: Add your redirect URI to Auth0 dashboard settings

## Next Steps

1. **Add custom fonts:**
   - Install expo-font: `expo install expo-font`
   - Load Space Grotesk fonts

2. **Add actual images:**
   - Copy all assets from frontend folder
   - Update components to use image files

3. **Test on real devices:**
   - Test authentication flow
   - Test audio recording
   - Verify API connectivity

4. **Build for production:**
   ```bash
   expo build:android
   expo build:ios
   ```

## Support

For issues or questions:
- Email: support@neuroai.com
- Documentation: https://docs.expo.dev

## License

Copyright NeuroAI 2025
