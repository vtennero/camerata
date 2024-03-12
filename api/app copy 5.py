from flask import Flask, request, jsonify, g
from flask_cors import CORS
import speech_recognition as sr
import os

app = Flask(__name__)
CORS(app) # This will enable CORS for all routes
app.config['UPLOAD_FOLDER'] = 'uploads/'

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
    
    # Store the filename in the g object
    g.filename = filename
    
    return jsonify({'status': 'recording started and saved', 'filename': filename})

@app.route('/stop-recording', methods=['POST'])
def stop_recording():
    # Check if the filename attribute exists in the g object
    if hasattr(g, 'filename'):
        audio_file_path = os.path.join(app.config['UPLOAD_FOLDER'], g.filename)
        recognized_text = audio_to_text(audio_file_path)
        return jsonify({'status': 'recording stopped and text converted', 'text': recognized_text})
    else:
        return jsonify({'status': 'error', 'message': 'No recording found'})

def audio_to_text(file_path):
    r = sr.Recognizer()
    with sr.AudioFile(file_path) as source:
        audio_data = r.record(source)
        try:
            text = r.recognize_google(audio_data)
            print(f"Recognized Text: {text}")
            return text
        except:
            print("Sorry, I did not get that")
            return "Sorry, I did not get that"

if __name__ == '__main__':
    app.run(debug=True)
