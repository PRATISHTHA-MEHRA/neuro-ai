# Assets Folder

This folder contains all the images, fonts, and other assets used in the mobile app.

## Structure

- **Images**: Store all image files (PNG, JPEG, SVG) used in the app
- **Fonts**: Store custom font files if needed

## Note

To add images from your frontend folder:
1. Copy all images from `frontend/src/assets/` to this folder
2. Import them in your components using:
   ```javascript
   import MicImage from '../assets/Mic.png';
   ```

Or use require syntax:
   ```javascript
   <Image source={require('../assets/Mic.png')} />
   ```

For now, the app uses emoji placeholders (🎤, 📚, etc.) for visual elements.
You can replace these with actual images later.
