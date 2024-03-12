from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import speech_recognition as sr
from audio_processing import get_audio_input

app = Flask(__name__)
# CORS(app, supports_credentials=True)
# CORS(app, supports_credentials=True, allow_headers=['Content-Type', 'Authorization'])
CORS(app) # This will enable CORS for all routes
app.config['UPLOAD_FOLDER'] = 'uploads/'

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

@app.route('/process-audio', methods=['POST'])
def process_audio():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    # Call get_audio_input without passing filename
    processed_text = get_audio_input()
    return jsonify({'processed_text': processed_text})

@app.route('/process-text', methods=['POST'])
def process_text():
    data = request.get_json()
    text = data.get('text', '')
    processed_text = text + " world"
    return jsonify({'processed_text': processed_text})


if __name__ == '__main__':
    app.run(debug=True)
