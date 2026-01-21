# Fake Teams Call

A React application that simulates a Microsoft Teams video call with fake participants.

## 🚀 Live Demo

**[https://francesconuzzodev.github.io/fake-teams-call/](https://francesconuzzodev.github.io/fake-teams-call/)**

## Features

- **Login screen**: Enter your initials (1-3 characters) to join the meeting
- **Participants grid**: Displays 6 participants (you + 5 others with different initials)
- **Real webcam**: Option to enable your camera
- **Purple border**: Every minute, one of the 5 participants lights up with a pulsing purple border
- **Screen sharing**: Shows a custom image (shareScreen.png)
- **Fullscreen mode**: Full screen display
- **Call timer**: Shows the call duration in real time

## Controls

| Button | Function |
|--------|----------|
| 🎤 | Toggle microphone (simulated) |
| 📹 | Toggle real webcam |
| 🖥️ | Share screen (shows shareScreen.png) | 
| 📞 | Leave the call |
| ⛶ | Fullscreen (top right) |
| 🟣 | Test purple border (for debug) |

## Installation

```bash
# Clone the repository
git clone <repository-url>

# Enter the folder
cd FakeTeamsCall

# Install dependencies
npm install

# Start the application
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Customization

### Images
Add to the `public/` folder:
- `logo.png` - Logo on the login screen
- `shareScreen.png` - Image shown during screen sharing

### Purple border interval
Edit the `HIGHLIGHT_INTERVAL` constant in `src/components/TeamsCall.js`:
```javascript
const HIGHLIGHT_INTERVAL = 60000; // 1 minute (in milliseconds)
```

### Participants
Edit the `OTHER_PARTICIPANTS` array in `src/components/TeamsCall.js` to change names, initials, and colors of the participants.

## Technologies

- React 18
- CSS3 (Flexbox, Grid, Animations)
- Web APIs (MediaDevices, Fullscreen)

## License

MIT
