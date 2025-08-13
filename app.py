from flask import Flask, render_template, Response
from flask_socketio import SocketIO
import cv2
import mediapipe as mp
import math

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Mediapipe setup
mp_face_mesh = mp.solutions.face_mesh
BLINK_THRESHOLD = 0.21
CONSEC_FRAMES = 2
LEFT_EYE = [33, 160, 158, 133, 153, 144]
RIGHT_EYE = [263, 387, 385, 362, 380, 373]

blink_counter = 0
frame_counter = 0
head_dir = "Center"

def euclidean_dist(p1, p2):
    return math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2 + (p1.z - p2.z)**2)

def eye_aspect_ratio(landmarks, eye_indices):
    A = euclidean_dist(landmarks[eye_indices[1]], landmarks[eye_indices[5]])
    B = euclidean_dist(landmarks[eye_indices[2]], landmarks[eye_indices[4]])
    C = euclidean_dist(landmarks[eye_indices[0]], landmarks[eye_indices[3]])
    return (A + B) / (2.0 * C)

def gen_frames():
    global blink_counter, frame_counter, head_dir
    cap = cv2.VideoCapture(0)

    with mp_face_mesh.FaceMesh(
        max_num_faces=1,
        refine_landmarks=True,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    ) as face_mesh:

        while True:
            success, image = cap.read()
            if not success:
                break

            rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            results = face_mesh.process(rgb_image)
            head_dir_new = head_dir

            if results.multi_face_landmarks:
                landmarks = results.multi_face_landmarks[0].landmark

                # Blink detection
                leftEAR = eye_aspect_ratio(landmarks, LEFT_EYE)
                rightEAR = eye_aspect_ratio(landmarks, RIGHT_EYE)
                ear = (leftEAR + rightEAR) / 2.0

                if ear < BLINK_THRESHOLD:
                    frame_counter += 1
                else:
                    if frame_counter >= CONSEC_FRAMES:
                        blink_counter += 1
                        socketio.emit('gesture', {'gesture': 'blink', 'count': blink_counter})
                    frame_counter = 0

                # Head tilt detection
                chin = landmarks[152]
                left_eye_outer = landmarks[33]
                right_eye_outer = landmarks[263]

                eye_mid_x = (left_eye_outer.x + right_eye_outer.x) / 2
                eye_mid_y = (left_eye_outer.y + right_eye_outer.y) / 2
                eye_mid_z = (left_eye_outer.z + right_eye_outer.z) / 2

                dx = chin.x - eye_mid_x
                dy = chin.y - eye_mid_y
                dz = chin.z - eye_mid_z

                pitch_angle = math.degrees(math.atan2(dz, dy))
                PITCH_THRESHOLD = 5

                if pitch_angle > PITCH_THRESHOLD:
                    head_dir_new = "Up"
                elif pitch_angle < -PITCH_THRESHOLD:
                    head_dir_new = "Down"
                else:
                    tilt_angle = math.degrees(math.atan2(dx, dy))
                    TILT_ANGLE_THRESHOLD = 5
                    if tilt_angle > TILT_ANGLE_THRESHOLD:
                        head_dir_new = "Right"
                    elif tilt_angle < -TILT_ANGLE_THRESHOLD:
                        head_dir_new = "Left"
                    else:
                        head_dir_new = "Center"

                if head_dir_new != head_dir:
                    head_dir = head_dir_new
                    socketio.emit('gesture', {'gesture': head_dir})

            ret, buffer = cv2.imencode('.jpg', cv2.flip(image, 1))
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    cap.release()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5050)