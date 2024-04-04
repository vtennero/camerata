from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr
from pydub import AudioSegment
import os
import requests, datetime
import glob
from config import personas
from dotenv import load_dotenv
from langchain.memory import ChatMessageHistory
import dotenv
from langchain_openai import ChatOpenAI
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from config import personas
from langchain_core.messages import HumanMessage, AIMessage
from openai import OpenAI


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

dotenv_path = '../env.local'


openai_api_key = os.getenv("OPENAI_API_KEY")
# Load the environment variables from your specified file
load_dotenv(dotenv_path=dotenv_path)
persona_chat_histories = {persona: ChatMessageHistory() for persona in personas.keys()}



def create_chain_with_message_history_for_persona(persona_name):
    persona_settings = personas[persona_name]
    chat = ChatOpenAI(model="gpt-3.5-turbo-1106", temperature=0.2, openai_api_key=openai_api_key)  # Or reuse if possible
    prompt = ChatPromptTemplate.from_messages([
        ("system", persona_settings['prompt']),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}"),
    ])
    chain = prompt | chat
    return RunnableWithMessageHistory(
        chain,
        lambda session_id: persona_chat_histories[persona_name],
        input_messages_key="input",
        history_messages_key="chat_history",
    )

chains_with_message_history = {
    persona: create_chain_with_message_history_for_persona(persona)
    for persona in personas.keys()
}

@app.route('/convert-audio-to-text', methods=['POST'])
def convert_audio_to_text():
    if 'audio' not in request.files:
        return jsonify({'status': 'error', 'message': 'No audio file provided'}), 400
    audio_file = request.files['audio']
    persona = request.form.get('personaName')
    filename = request.form.get('filename')

    print(f"[convert_audio_to_text] Received audio from persona: {persona}")

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
            processed_text, chat_history = process_text_with_persona(text, persona, filename)  # Use the new function
            # serializable_messages = [message_to_dict(message) for message in chat_history]
            serializable_messages = "hello world"

            print(f"[convert_audio_to_text] Processed text: {processed_text}")
            # return jsonify({'status': 'success', 'processed_text': processed_text, 'refined_text': processed_text, 'input': text, 'chatHistory': serializable_messages})
            return jsonify({'status': 'success', 'processed_text': processed_text, 'refined_text': processed_text, 'input': text,})
            # return jsonify({'status': 'success', 'text': processed_text, 'refined_text': refined_text})
            # return jsonify({'status': 'success', 'text': text})
    except sr.UnknownValueError:
        return jsonify({'status': 'error', 'message': 'Speech recognition could not understand audio'}), 500
    except sr.RequestError as e:
        return jsonify({'status': 'error', 'message': f'Could not request results from speech recognition service; {str(e)}'}), 500
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Failed to convert audio to text: {str(e)}'}), 500

def message_to_dict(message):
    # Determine the message type based on the object's class and set the type field
    if isinstance(message, HumanMessage):
        message_type = 'human'
    elif isinstance(message, AIMessage):
        message_type = 'ai'
    else:
        raise ValueError("Unknown message type")

    # Return the message content and type without response_metadata
    return {
        'type': message_type,
        'content': message.content
    }



def process_text_with_persona(text, persona, filename):
    """
    Process text using the specified persona's chat history and return the processed text.
    """
    processed_text = "Text processing failed"  # Default response in case of failure
    if persona in chains_with_message_history:
        chain = chains_with_message_history[persona]
        try:
            response = chain.invoke(
                {"input": text},
                {"configurable": {"session_id": "unused"}}  # Adapt as needed
            )
            processed_text = response.content  # Assuming this is the correct way to access the content
        except Exception as e:
            processed_text = f"Failed to process text due to: {str(e)}"
    history = persona_chat_histories[persona].messages
    print("[process_text_with_persona] history:")
    print(history)
    return processed_text, history


@app.route('/process-text', methods=['POST'])
def flask_process_text():
    data = request.get_json()
    text = data.get('text', '')
    persona = data.get('persona', '')
    filename = data.get('filename', '')
    print(f"Received text from persona: {persona}")
    
    processed_text, chatHistory = process_text_with_persona(text, persona, filename)  # Use the new function
    print(f"[flask_process_text] Processed text: {processed_text}")
    print(f"[flask_process_text] memory text: {chatHistory}")
    serializable_chat_history = [message_to_dict(message) for message in chatHistory]
    print(f"[flask_process_text] trasnformed memory text: {serializable_chat_history}")

    return jsonify({'processed_text': processed_text, 'refined_text': processed_text, 'chatHistory': serializable_chat_history})

@app.route('/generate-audio', methods=['POST'])
def generate_audio():
    data = request.get_json()
    print(data)
    persona = data.get('persona', '')
    text = data.get('text', '')

    audio_dir = os.path.join('static', 'audio_files')
    
    # Clear out the existing audio files in the directory
    files = glob.glob(os.path.join(audio_dir, '*.mp3'))
    for f in files:
        os.remove(f)

    print(f"[generate_audio] Received text from persona: {persona}")
    if not text:
        return jsonify({'status': 'error', 'message': 'No text provided'}), 400
    # if not persona:
        # return jsonify({'status': 'error', 'message': 'No persona provided'}), 400
    # Generate a unique filename for the audio file
    filename = "audio_" + datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    # audio_file_path = generate_audio_file(text, filename, persona)  # Use the function you defined

    # Assuming the generate_audio_file function returns a relative path within static
    relative_path = generate_audio_file_w_openai(text, filename, persona)
    # relative_path = generate_audio_file_w_eleven(text, filename, persona)
    audio_url = request.host_url + 'static/' + relative_path

    return jsonify({'status': 'success', 'audioUrl': audio_url})

def generate_audio_file_w_openai(text, filename, persona):
    """Function to convert text to speech using OpenAI and save as an audio file."""
    # Prepare client
    client = OpenAI()

    # Select voice based on persona. This assumes a mapping between personas and OpenAI's voice model ids
    voice_id = personas[persona].get('open_ai_voice_id')  # Fallback to a default voice if not found

    # Create audio speech
    response = client.audio.speech.create(
        model="tts-1",  # Assuming this model works for all types of personas, adjust if necessary
        voice=voice_id,
        input=text
    )
    
    # Ensure the directory exists
    audio_dir = os.path.join('static', 'audio_files')
    if not os.path.exists(audio_dir):
        os.makedirs(audio_dir)
    
    audio_file_path = os.path.join(audio_dir, f"{filename}.mp3")
    
    # Save the audio file
    response.stream_to_file(audio_file_path)
    
    # Return a relative path to the audio file within the static directory
    return os.path.join('audio_files', f"{filename}.mp3")

def generate_audio_file_w_eleven(text, filename, persona):
    """Function to convert text to speech and save as an audio file."""
    url_template = "https://api.elevenlabs.io/v1/text-to-speech/{}/stream"
    url = url_template.format(personas[persona].get('voice_id'))
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

@app.route('/getPersonaDescription', methods=['GET'])
def get_persona_description():
    persona_name = request.args.get('name', '')
    persona = personas.get(persona_name.lower())  # Use .get() to avoid KeyError if the name is not found
    if persona:
        # return jsonify({'description': persona['description']})
        return jsonify({'description': persona['description'], 'name': persona['name']})
    else:
        return jsonify({"error": "Persona not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
