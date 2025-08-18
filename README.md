# Gesture-Controlled Navigation

A web application that allows users to navigate through buttons using head movements and eye blinks captured through their webcam. The camera feed is integrated directly into the web interface with real-time gesture detection.

## Features

- **Integrated Camera Feed**: Real-time camera display directly in the web browser
- **Head Movement Detection**: Tilt your head left/right to navigate between buttons
- **Eye Blink Detection**: Blink to click/select the highlighted button
- **Face Mesh Visualization**: See the detected facial landmarks and mesh overlay
- **Responsive Web Interface**: Modern, mobile-friendly design
- **Keyboard Fallback**: Use arrow keys and Enter as an alternative
- **Debug Tools**: Built-in testing buttons to verify gesture recognition

## Quick Start

### Prerequisites

- Python 3.7 or higher
- Webcam
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd Gesture-Recognition
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Open your browser**
   Navigate to: `http://localhost:5050`

## How to Use

### Gesture Controls

- **👈 Tilt Head Left**: Move to the previous button
- **👉 Tilt Head Right**: Move to the next button  
- **😉 Blink**: Click the currently highlighted button

## 📁 Project Structure

```
Gesture-Recognition/
├── app.py                 # Main Flask application
├── gesture_tracker.py     # Computer vision and gesture detection
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # Main web interface
├── static/
│   ├── css/
│   │   └── styles.css    # Styling
│   └── js/
│       └── app.js        # Frontend JavaScript
└── README.md             # This file
```

## Troubleshooting

### Common Issues

1. **Camera not working**
   - Ensure your browser has permission to access the camera
   - Check if another application is using the camera
   - Try refreshing the page
   - Look for "Waiting for camera feed from gesture tracker..." message
   - Check browser console (F12) for error messages

2. **Gestures not detected**
   - Ensure good lighting conditions
   - Position yourself clearly in front of the camera
   - Check that your face is fully visible
   - Use the debug buttons to test if the system is working
   - Check browser console (F12) for error messages

### Performance Tips

- Close other applications using the camera
- Ensure good lighting for better face detection
- Position yourself 1-2 feet from the camera
- Keep your head movements deliberate and clear
- Make sure your entire face is visible in the camera

### Debug Steps

1. **Check terminal output**: Look for "Gesture tracker started" message
2. **Check browser console**: Press F12 and look for connection messages
3. **Test debug buttons**: Use the orange debug buttons to test gesture recognition
4. **Check camera feed**: Should show your face with mesh overlay and text
5. **Verify camera access**: Ensure browser has permission to access webcam

## 🔒 Privacy & Security

- All video processing happens locally on your computer
- No video data is sent to external servers
- Camera access is only used for gesture detection
- You can close the browser tab to stop camera access

## 📱 Browser Compatibility

- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve this project!

## 📄 License

This project is open source and available under the MIT License.

---

**Enjoy navigating with gestures! 🎉** 
