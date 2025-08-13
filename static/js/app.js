const socket = io();
const video = document.getElementById('video');
const statusDiv = document.getElementById('status');

let currentIndex = 0;
const buttons = document.querySelectorAll('.nav-btn');

// Navigation function
function navigateTo(page) {
  statusDiv.innerText = `Navigating to ${page}...`;
  console.log(`Navigating to: ${page}`);
  // Simulate navigation delay
  setTimeout(() => {
    statusDiv.innerText = `Welcome to ${page} page!`;
  }, 1000);
}

function highlightButton(index) {
  buttons.forEach(btn => btn.classList.remove('highlighted'));
  buttons[index].classList.add('highlighted');
  statusDiv.innerText = `Button ${index + 1} selected: ${buttons[index].textContent}`;
  console.log(`Button highlighted: ${index} - ${buttons[index].textContent}`);
}

// Initialize with first button highlighted
highlightButton(currentIndex);

// Gesture handling with debouncing
let lastGestureTime = 0;
const GESTURE_DEBOUNCE = 300; // Reduced debounce for more responsive detection

socket.on('gesture', data => {
  const now = Date.now();
  console.log(`Gesture received: ${JSON.stringify(data)} at ${now}`);
  
  if (now - lastGestureTime < GESTURE_DEBOUNCE) {
    console.log(`Gesture ignored due to debouncing. Time since last: ${now - lastGestureTime}ms`);
    return; // Ignore gestures that are too close together
  }
  
  const gesture = data.gesture;
  lastGestureTime = now;
  
  statusDiv.innerText = `Detected: ${gesture}`;
  console.log(`Processing gesture: ${gesture}`);

  if (gesture === 'tilt_right') {
    currentIndex = (currentIndex + 1) % buttons.length;
    highlightButton(currentIndex);
    console.log(`Moved right to button ${currentIndex}`);
  } else if (gesture === 'tilt_left') {
    currentIndex = (currentIndex - 1 + buttons.length) % buttons.length;
    highlightButton(currentIndex);
    console.log(`Moved left to button ${currentIndex}`);
  } else if (gesture === 'blink') {
    // Simulate button click
    buttons[currentIndex].click();
    // Trigger the navigation
    const buttonText = buttons[currentIndex].textContent;
    const page = buttonText.toLowerCase().replace(/[^a-z]/g, '');
    navigateTo(page);
    console.log(`Button clicked via blink: ${page}`);
  }
});

// Handle camera frames from Python backend
let currentFrameImg = null;

socket.on('camera_frame', data => {
  try {
    console.log('Received camera frame:', data.head_direction, data.blink_count);
    
    // Create or update the image element
    if (!currentFrameImg) {
      currentFrameImg = document.createElement('img');
      currentFrameImg.style.width = '100%';
      currentFrameImg.style.height = 'auto';
      currentFrameImg.style.borderRadius = '15px';
      currentFrameImg.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
      currentFrameImg.style.border = '3px solid white';
      currentFrameImg.style.maxWidth = '640px';
      
      // Replace the video element with the image
      const videoContainer = document.getElementById('video');
      if (videoContainer) {
        videoContainer.parentNode.replaceChild(currentFrameImg, videoContainer);
      }
    }
    
    // Update the image source
    currentFrameImg.src = 'data:image/jpeg;base64,' + data.frame;
    
    // Update status with head direction and blink count
    if (data.head_direction && data.blink_count !== undefined) {
      statusDiv.innerText = `Head: ${data.head_direction} | Blinks: ${data.blink_count}`;
    }
    
  } catch (error) {
    console.error('Error processing camera frame:', error);
    statusDiv.innerText = `Camera error: ${error.message}`;
  }
});

// Add keyboard support as fallback
document.addEventListener('keydown', (e) => {
  console.log(`Key pressed: ${e.key}`);
  switch(e.key) {
    case 'ArrowLeft':
      currentIndex = (currentIndex - 1 + buttons.length) % buttons.length;
      highlightButton(currentIndex);
      break;
    case 'ArrowRight':
      currentIndex = (currentIndex + 1) % buttons.length;
      highlightButton(currentIndex);
      break;
    case 'Enter':
    case ' ':
      buttons[currentIndex].click();
      const buttonText = buttons[currentIndex].textContent;
      const page = buttonText.toLowerCase().replace(/[^a-z]/g, '');
      navigateTo(page);
      break;
  }
});

// Connection status
socket.on('connect', () => {
  statusDiv.innerText = "Connected to gesture tracker!";
  console.log("Connected to Socket.IO server");
});

socket.on('disconnect', () => {
  statusDiv.innerText = "Disconnected from gesture tracker";
  console.log("Disconnected from Socket.IO server");
});

socket.on('error', (data) => {
  console.error("Server error:", data);
  statusDiv.innerText = `Error: ${data.message}`;
});

// Test gesture function for debugging
window.testGesture = function(gesture) {
  console.log(`Testing gesture: ${gesture}`);
  socket.emit('test_gesture', {gesture: gesture});
};

// Initialize status
statusDiv.innerText = "Waiting for camera feed from gesture tracker...";
console.log("JavaScript initialized, waiting for camera frames..."); 