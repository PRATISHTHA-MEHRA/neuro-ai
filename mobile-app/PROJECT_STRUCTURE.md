# NeuroAI Mobile App - Complete Project Structure

## 📁 Project Directory Tree

```
mobile-app/
│
├── App.js                          # Main entry point with Auth0 integration
├── app.json                        # Expo configuration
├── package.json                    # Dependencies and scripts
├── babel.config.js                 # Babel configuration for Expo
├── metro.config.js                 # Metro bundler configuration
├── .gitignore                      # Git ignore rules
├── README.md                       # Project overview
├── SETUP.md                        # Detailed setup instructions
│
├── assets/                         # App-level assets
│   ├── icon-placeholder.txt        # App icon placeholder
│   └── splash-placeholder.txt      # Splash screen placeholder
│
└── src/                           # Source code directory
    │
    ├── screens/                   # All screen components
    │   ├── index.js               # Screen exports
    │   ├── HomeScreen.js          # Home/Landing page
    │   ├── LearningScreen.js      # Learning dashboard
    │   ├── DetectionScreen.js     # Test results & analysis
    │   ├── OverallTestScreen.js   # Overall phoneme test
    │   ├── CourseTestScreen.js    # Course-specific test
    │   ├── AboutScreen.js         # About page
    │   └── ArticlesScreen.js      # Articles & resources
    │
    ├── components/                # Reusable UI components
    │   ├── index.js               # Component exports
    │   ├── CourseModal.js         # Course card component
    │   ├── Footer.js              # App footer
    │   ├── Mic.js                 # Microphone button
    │   ├── RecordButton.js        # Recording action button
    │   ├── NavButton.js           # Navigation button
    │   ├── RecordingLoader.js     # Recording animation
    │   └── ArticlesComponent.js   # Article card
    │
    ├── navigation/                # Navigation configuration
    │   └── AppNavigator.js        # Stack & Tab navigation setup
    │
    ├── constants/                 # App constants
    │   └── theme.js               # Colors, sizes, fonts, API config
    │
    ├── utils/                     # Utility functions
    │   └── api.js                 # API service functions
    │
    └── assets/                    # App assets (images, fonts)
        └── README.md              # Assets documentation
```

## 📱 Screens Overview

### 1. HomeScreen (`HomeScreen.js`)
- **Purpose**: Landing page with hero section and features
- **Key Features**:
  - Hero section with call-to-action
  - Feature cards (8 features with icons)
  - Get Started button (triggers auth or navigation)
  - Browse Features scroll functionality
  - Responsive grid layout
- **Navigation**: Main entry point via bottom tabs

### 2. LearningScreen (`LearningScreen.js`)
- **Purpose**: Main learning dashboard
- **Key Features**:
  - Detection test banner
  - Calendar widget for tracking
  - Phoneme catalog with course cards
  - Recent articles section
  - Scrollable course list
- **Navigation**: Accessible when authenticated
- **Routes to**: CourseTest, OverallTest

### 3. DetectionScreen (`DetectionScreen.js`)
- **Purpose**: Display test results and remedies
- **Key Features**:
  - Test information display
  - Progress bar with character animation
  - Percentage visualization
  - Remedy suggestions for low scores (<= 50%)
  - Back to Learning & Try Again buttons
- **Navigation**: Receives percentage parameter from tests

### 4. OverallTestScreen (`OverallTestScreen.js`)
- **Purpose**: General phoneme detection test
- **Key Features**:
  - Letter-based word testing
  - Audio recording capability
  - Multiple attempts tracking
  - Average accuracy calculation
  - Next/Previous letter navigation
- **Navigation**: From Learning screen
- **API Integration**: Word fetching, audio recording

### 5. CourseTestScreen (`CourseTestScreen.js`)
- **Purpose**: Course-specific phoneme testing
- **Key Features**:
  - Targeted phoneme practice (e.g., V vs B)
  - Word generation for specific letters
  - Recording and analysis
  - Results navigation
- **Navigation**: From Learning via CourseModal
- **Routes to**: Detection (with results)

### 6. AboutScreen (`AboutScreen.js`)
- **Purpose**: Information about the app
- **Key Features**:
  - Mission statement
  - Features overview
  - Technology description
  - Contact information
- **Navigation**: Always accessible via bottom tabs

### 7. ArticlesScreen (`ArticlesScreen.js`)
- **Purpose**: Educational content and resources
- **Key Features**:
  - Article cards with metadata
  - Featured resources
  - Author and date information
- **Navigation**: Always accessible via bottom tabs

## 🧩 Components Overview

### UI Components

1. **CourseModal** - Displays phoneme course information
   - Props: Phoneme1, Phoneme2, Status, Color, Progress, onPress
   - Used in: LearningScreen

2. **Footer** - App footer with links
   - Features: Terms, Privacy, Contact, etc.
   - Used in: Various screens

3. **Mic** - Microphone button for recording
   - Props: onPress
   - Used in: Test screens

4. **RecordButton** - Customizable action button
   - Props: bgColor, text, textColor, onPress
   - Used in: Test screens

5. **NavButton** - Navigation button with sparkle icon
   - Props: text, onPress, currLetter
   - Used in: Test screens for next/previous

6. **RecordingLoader** - Animated loading dots
   - Shows during audio recording
   - Used in: Test screens

7. **ArticlesComponent** - Article preview card
   - Displays article info with author
   - Used in: ArticlesScreen, LearningScreen

## 🗺️ Navigation Structure

```
AppNavigator (Stack)
│
└── MainTabs (Bottom Tabs)
    ├── Home Tab → HomeScreen
    ├── Learning Tab → LearningScreen (Auth required)
    ├── About Tab → AboutScreen
    └── Articles Tab → ArticlesScreen

Stack Screens (Modal/Push):
├── Detection → DetectionScreen
├── OverallTest → OverallTestScreen
└── CourseTest → CourseTestScreen
```

### Navigation Flow

1. **Home → Learning**: Via Get Started button (if authenticated)
2. **Learning → OverallTest**: Via detection banner
3. **Learning → CourseTest**: Via course cards
4. **CourseTest → Detection**: Via View Results button
5. **Detection → Learning**: Via Back to Learning button
6. **Detection → CourseTest**: Via Try Again button

## 🎨 Styling System

### Theme Constants (`constants/theme.js`)

**Colors:**
- Primary: `#2D8CFF` (Blue)
- Secondary: `#89D85D` (Green)
- Purple: `#E5D1FF`
- Background: `#FFFFFF`
- Gray: `#F5F0F0`

**Sizes:**
- Headers: h1-h4 (32px - 20px)
- Body: body1-body4 (18px - 12px)
- Padding/Margin: 16-20px
- Border Radius: 8-24px

**Fonts:**
- Regular, Medium, SemiBold, Bold, Light
- Font family: Space Grotesk (web version)

## 🔌 API Integration

### API Endpoints (`utils/api.js`)

1. **generateWord(letter)** - Get word for specific letter
2. **testWord(letter)** - Get test word for letter
3. **recordAudio()** - Record and analyze audio
4. **getRemedy(percentage)** - Get improvement suggestions

### Base Configuration
- Base URL: `http://localhost:5000`
- Timeout: 10 seconds
- Headers: JSON content-type

## 🔐 Authentication

### Auth0 Integration (`App.js`)

**Features:**
- OAuth2 authentication
- Token-based session management
- Persistent login (AsyncStorage)
- User profile retrieval
- Logout with token revocation

**Configuration:**
- Domain: `dev-iabl8uxrj8a06ze7.us.auth0.com`
- Client ID: Configured in theme constants
- Redirect URI: Expo proxy-based

## 📦 Dependencies

### Core Dependencies
- **expo** (~51.0.0) - Expo SDK
- **react** (18.2.0) - React library
- **react-native** (0.74.5) - React Native

### Navigation
- **@react-navigation/native** - Navigation core
- **@react-navigation/native-stack** - Stack navigator
- **@react-navigation/bottom-tabs** - Tab navigator
- **react-native-screens** - Native screen support
- **react-native-safe-area-context** - Safe area handling

### Authentication
- **expo-auth-session** - OAuth authentication
- **expo-web-browser** - Browser-based auth
- **@react-native-async-storage/async-storage** - Storage

### UI & Features
- **react-native-calendars** - Calendar component
- **axios** - HTTP client
- **dayjs** - Date manipulation
- **expo-av** - Audio/video handling
- **expo-linear-gradient** - Gradient support

## 🚀 Getting Started

### Quick Start
```bash
cd mobile-app
npm install
npm start
```

### Run on Device
1. Install Expo Go app
2. Scan QR code

### Run on Emulator
```bash
npm run android  # Android
npm run ios      # iOS (Mac only)
```

## ✅ Features Checklist

- [x] Complete navigation system
- [x] Auth0 authentication
- [x] All screens converted
- [x] All components converted
- [x] API integration
- [x] Responsive mobile UI
- [x] Theme system
- [x] Bottom tab navigation
- [x] Stack navigation
- [x] Calendar integration
- [x] Audio recording setup
- [x] Progress tracking UI

## 📝 Notes

### Current State
- Uses emoji placeholders for images (🎤, 📚, etc.)
- Auth0 configured but needs redirect URI setup
- API endpoints point to localhost (update for production)
- Fonts use system defaults (Space Grotesk can be added)

### Next Steps
1. Copy actual images from frontend/src/assets
2. Configure Auth0 redirect URIs
3. Update API base URL for mobile access
4. Add custom fonts
5. Test on physical devices
6. Generate app icons and splash screens

## 🐛 Common Issues

### Metro Bundler
- Clear cache: `expo start -c`

### API Connection
- Use local IP instead of localhost
- Update API_BASE_URL in theme.js

### Auth0 Redirect
- Add redirect URI to Auth0 dashboard
- Format: `exp://YOUR_IP:19000/--/` or Expo proxy

## 📄 License

Copyright NeuroAI 2025

---

**Created**: January 2025
**Framework**: React Native + Expo
**Language**: JavaScript
**Minimum iOS**: 13.0
**Minimum Android**: 6.0 (API 23)
