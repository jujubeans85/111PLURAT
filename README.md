# 111PLURAT

A Progressive Web App (PWA) Lo-Fi Music Player

## Features

- 🎵 Beautiful, modern music player interface
- 📱 Progressive Web App - installable on mobile and desktop
- 🎨 Animated vinyl disc visualization
- 🎚️ Volume control
- 📋 Playlist with 4 lo-fi tracks
- ⚡ Offline support via Service Worker
- 📱 Responsive design for all screen sizes

## Files Structure

```
.
├── index.html          # Main HTML file with player UI
├── style.css           # Styling for the music player
├── app.js              # JavaScript logic for player functionality
├── manifest.json       # PWA manifest configuration
├── service-worker.js   # Service worker for offline functionality
└── tracks/             # Music tracks directory
    ├── 01_lofi_nights.mp3
    ├── 02_dreamscape_drift.mp3
    ├── 03_soft_pulse.mp3
    └── 04_acoustic_breeze.mp3
```

## Usage

1. Open `index.html` in a modern web browser
2. Or serve the files using a web server:
   ```bash
   python3 -m http.server 8000
   ```
   Then navigate to `http://localhost:8000`

3. Install as PWA:
   - On desktop: Click the install button when prompted
   - On mobile: Use "Add to Home Screen" option

## Technologies Used

- HTML5 Audio API
- CSS3 with animations and gradients
- Vanilla JavaScript (ES6+)
- Service Worker API for offline functionality
- Web App Manifest for PWA capabilities

## Browser Support

Works best on modern browsers that support:
- HTML5 Audio
- Service Workers
- Web App Manifest
- CSS Grid and Flexbox
