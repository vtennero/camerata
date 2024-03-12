from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import speech_recognition as sr
from audio_processing import get_audio_input


app = Flask(__name__)
CORS(app) # This will enable CORS for all routes
app.config['UPLOAD_FOLDER'] = 'uploads/'

is_recording = False

# @app.route('/process-audio', methods=['POST'])
# def process_audio():
#     if 'file' not in request.files:
#         return jsonify({'error': 'No file part'}), 400
#     file = request.files['file']
#     filename = secure_filename(file.filename)
#     file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

#     # Assuming you have a function to process the audio file and return text
#     processed_text = get_audio_input(filename)
#     return jsonify({'processed_text': processed_text})

# @app.route('/process-audio', methods=['POST'])
# def process_audio():
#     if 'file' not in request.files:
#         return jsonify({'error': 'No file part'}), 400
#     file = request.files['file']
#     filename = secure_filename(file.filename)
#     file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

#     # Call get_audio_input without passing filename
#     processed_text = get_audio_input()
#     return jsonify({'processed_text': processed_text})

@app.route('/start-recording', methods=['POST'])
def start_recording():
    r = sr.Recognizer()
    mic = sr.Microphone()

    print('Recording...')
    with mic as source:
        audio = r.listen(source)

    # Save the audio file
    filename = "audio_file.wav"
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    with open(file_path, "wb") as file:
        file.write(audio.get_wav_data())
    return jsonify({'status': 'recording started and saved', 'filename': filename})


@app.route('/stop-recording', methods=['POST'])
def stop_recording():
    global is_recording
    is_recording = False
    # Logic to stop recording
    # This could involve setting a global variable or sending a signal to stop recording
    return jsonify({'status': 'recording stopped'})

@app.route('/process-text', methods=['POST'])
def process_text():
    data = request.get_json()
    text = data.get('text', '')
    processed_text = text + " world"
    return jsonify({'processed_text': processed_text})


if __name__ == '__main__':
    app.run(debug=True)
