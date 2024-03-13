from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr
from pydub import AudioSegment
import os
from text_processor import process_text  # Import the process_text function from text_processor.py
import requests, datetime
import glob

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
            return jsonify({'status': 'success', 'processed_text': processed_text, 'refined_text': refined_text, 'input': text})
            # return jsonify({'status': 'success', 'text': processed_text, 'refined_text': refined_text})
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

@app.route('/generate-audio', methods=['POST'])
def generate_audio():

    audio_dir = os.path.join('static', 'audio_files')
    
    # Clear out the existing audio files in the directory
    files = glob.glob(os.path.join(audio_dir, '*.mp3'))
    for f in files:
        os.remove(f)

    data = request.get_json()
    text = data.get('text', '')
    if not text:
        return jsonify({'status': 'error', 'message': 'No text provided'}), 400
    
    # Generate a unique filename for the audio file
    filename = "audio_" + datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    audio_file_path = generate_audio_file(text, filename)  # Use the function you defined

    # Assuming the generate_audio_file function returns a relative path within static
    relative_path = generate_audio_file(text, filename)
    audio_url = request.host_url + 'static/' + relative_path

    return jsonify({'status': 'success', 'audioUrl': audio_url})

def generate_audio_file(text, filename):
    """Function to convert text to speech and save as an audio file."""
    url_template = "https://api.elevenlabs.io/v1/text-to-speech/{}/stream"
    url = url_template.format(os.getenv('VOICE_ID'))
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": os.getenv("XI_API_KEY")
    }
    data = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.5
        }
    }
    response = requests.post(url, json=data, headers=headers, stream=True)
    audio_data = b''.join(chunk for chunk in response.iter_content(chunk_size=1024) if chunk)
    
    # Ensure the directory exists
    audio_dir = os.path.join('static', 'audio_files')
    if not os.path.exists(audio_dir):
        os.makedirs(audio_dir)
    
    audio_file_path = os.path.join(audio_dir, f"{filename}.mp3")
    with open(audio_file_path, 'wb') as audio_file:
        audio_file.write(audio_data)
    
    # Return a relative path to the audio file within the static directory
    return os.path.join('audio_files', f"{filename}.mp3")


if __name__ == '__main__':
    app.run(debug=True)
