from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr
from pydub import AudioSegment
import os
from text_processor import process_text  # Import the process_text function from text_processor.py

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/convert-audio-to-text', methods=['POST'])
def convert_audio_to_text():
    if 'audio' not in request.files:
        return jsonify({'status': 'error', 'message': 'No audio file provided'}), 400
    audio_file = request.files['audio']
    persona = request.form.get('personaName')
    filename = request.form.get('filename')

    print(f"Received audio from persona: {persona}")

    original_audio_path = os.path.join('uploads', audio_file.filename)
    audio_file.save(original_audio_path)

    # Convert audio to WAV format for speech recognition compatibility
    converted_audio_path = original_audio_path.replace(os.path.splitext(original_audio_path)[1], '.wav')
    try:
        audio = AudioSegment.from_file(original_audio_path)
        audio.export(converted_audio_path, format='wav')
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Failed to convert audio file: {str(e)}'}), 500

    # Convert the audio to text
    r = sr.Recognizer()
    try:
        with sr.AudioFile(converted_audio_path) as source:
            audio_data = r.record(source)
            text = r.recognize_google(audio_data)
            processed_text, refined_text = process_text(text, persona, filename)
            print(refined_text)
            return jsonify({'status': 'success', 'text': processed_text, 'refined_text': refined_text})
            # return jsonify({'status': 'success', 'text': text})
    except sr.UnknownValueError:
        return jsonify({'status': 'error', 'message': 'Speech recognition could not understand audio'}), 500
    except sr.RequestError as e:
        return jsonify({'status': 'error', 'message': f'Could not request results from speech recognition service; {str(e)}'}), 500
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Failed to convert audio to text: {str(e)}'}), 500

@app.route('/process-text', methods=['POST'])
def flask_process_text():
    data = request.get_json()
    text = data.get('text', '')
    persona = data.get('persona', '')
    filename = data.get('filename', '')
    print(f"Received text from persona: {persona}")

    # processed_text = text + " world"
    processed_text, refined_text = process_text(text, persona, filename)
    # return jsonify({'processed_text': processed_text}, {'refined_text': refined_text})
    return jsonify({'processed_text': processed_text, 'refined_text': refined_text})

if __name__ == '__main__':
    app.run(debug=True)
