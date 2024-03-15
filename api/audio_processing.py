is_recording = False


import os
import io
import requests
import datetime
import pyaudio
import wave
import speech_recognition as sr
import pyttsx3
import keyboard
import threading
from pydub import AudioSegment
from pydub.playback import play
from dotenv import load_dotenv
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI
from config import personas

# Audio parameters
CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
frames = []

# Load environment variables
load_dotenv()

# Configuration Variables
openai_api_key = os.getenv('OPENAI_API_KEY')
url_template = "https://api.elevenlabs.io/v1/text-to-speech/{}/stream"

# Setting up language models and conversation chains
llm = OpenAI()
chat = ChatOpenAI()
conversation = ConversationChain(llm=chat, memory=ConversationBufferMemory())



# Functions
def play_text(text):
    """Function to convert text to speech using ElevenLabs API."""
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
    audio_data = b''.join(chunk for chunk in response.iter_content(chunk_size=CHUNK) if chunk)
    audio_segment = AudioSegment.from_file(io.BytesIO(audio_data), format="mp3")
    play(audio_segment)

def print_to_file(filename, victor_said, bot_said):
    """Function to append conversation to a file."""
    file_path = f"E:/Dropbox/PERSO/Obsidian Vault/aiconversations/{filename}"
    with open(file_path, "a") as file:
        now = datetime.datetime.now()
        file.write(f"{now:%Y-%m-%d_%H-%M-%S} Victor: {victor_said}\n")
        file.write(f"{now:%Y-%m-%d_%H-%M-%S} Bot: {bot_said}\n")

def record_audio(stream, frames):
    """Function to handle audio recording."""
    global is_recording
    while is_recording:
        audio_data = stream.read(CHUNK)
        frames.append(audio_data)

def listen_keyboard():
    """Function to listen for keyboard events."""
    global is_recording
    keyboard.wait('q')  # Wait for 'q' to be pressed
    is_recording = False

# def main():
#     # Here, define the 'persona' variable
#     persona = 'therapist'  # Or any other persona you have defined

#     # Fetch persona details
#     if persona in personas:
#         persona_details = personas[persona]
#     else:
#         print(f"Persona '{persona}' not found. Exiting.")
#         return

#     # Extract persona specific details
#     voice_id = persona_details['voice_id']
#     api_key = persona_details['api_key']
#     filename = persona_details['filename']
#     preprompt = persona_details['prompt']

#     # Set up and execute the main audio recording and processing logic
#     global frames
#     frames = []  # Make sure frames are reset for each recording session
#     setup_and_record_audio()  # You need to define this function to handle audio setup and recording
#     process_speech("recording.wav", preprompt, filename)  # You might want to handle filenames dynamically

def process_speech(wave_output_filename, preprompt, filename):
    """Function to process speech, convert it to text, and handle conversation."""
    r = sr.Recognizer()
    with sr.AudioFile(wave_output_filename) as source:
        audio_data = r.record(source)
    try:
        text = r.recognize_google(audio_data)
        print(f"✅ Recognized text: {text}")

        # Processing conversation
        prompt = preprompt + text
        response_text = conversation.run(prompt)
        print(f"⏩ Bot: {response_text}")

        # Log conversation to file
        now = datetime.datetime.now()
        file_name = f"{now:%Y-%m-%d_%H-%M-%S}_log.md"
        print_to_file(file_name, text, response_text)

        # Play response text (choose one)
        engine = pyttsx3.init()
        engine.say(response_text)
        engine.runAndWait()

        # Activate this for Eleven AI voice
        # play_text(response_text)

    except sr.UnknownValueError:
        print("Speech recognition could not understand the audio.")
    except sr.RequestError as e:
        print(f"Could not connect to the speech recognition service: {e}")


# def setup_and_record_audio():
#     global is_recording, frames

#     # Setup and recording logic
#     audio = pyaudio.PyAudio()
#     stream = audio.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)
#     is_recording = True
#     print("🔴 Recording started... Press 'q' to stop the recording.")
#     t1 = threading.Thread(target=record_audio, args=(stream, frames))
#     t2 = threading.Thread(target=listen_keyboard)
#     t1.start()
#     t2.start()
#     t1.join()
#     t2.join()

#     # Cleanup
#     print("✅ Recording finished!")
#     stream.stop_stream()
#     stream.close()
#     audio.terminate()

def setup_and_record_audio1():
    global is_recording, frames

    # Setup and recording logic
    audio = pyaudio.PyAudio()
    stream = audio.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)
    is_recording = True
    print("🔴 Recording started... Press 'q' to stop the recording.")
    t1 = threading.Thread(target=record_audio, args=(stream, frames))
    t2 = threading.Thread(target=listen_keyboard)
    t1.start()
    t2.start()
    t1.join()
    t2.join()

    # Finish and save recording
    print("✅ Recording finished!")
    stream.stop_stream()
    stream.close()
    audio.terminate()

    # Save the recording to a file
    wave_output_filename = "recording.wav"
    with wave.open(wave_output_filename, 'wb') as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(audio.get_sample_size(FORMAT))
        wf.setframerate(RATE)
        wf.writeframes(b''.join(frames))



def get_input_from_user():
    """Function to capture input from the user, either via text or voice."""
    # Here, you can decide how to receive the input, for example, using input() for text and your recording setup for voice
    mode = input("Enter 'text' for text input or 'voice' for voice input: ").strip().lower()
    if mode == 'text':
        return input("Enter your text: ")
    elif mode == 'voice':
        return get_audio_input()
    else:
        print("Invalid input mode. Please enter 'text' or 'voice'.")
        return None

def get_audio_input():
    """Function to handle voice input and convert it to text."""
    global frames  # Make sure to declare frames as global if it's used outside this function
    frames = []  # Reset frames each time for new recording
    setup_and_record_audio()  # This function needs to handle audio recording
    # Assuming 'recording.wav' is saved in setup_and_record_audio function
    return convert_audio_to_text('recording.wav')

def convert_audio_to_text(wave_output_filename):
    """Function to convert audio file to text."""
    r = sr.Recognizer()
    with sr.AudioFile(wave_output_filename) as source:
        audio_data = r.record(source)
    try:
        return r.recognize_google(audio_data)
    except sr.UnknownValueError:
        print("Speech recognition could not understand the audio.")
        return None
    except sr.RequestError as e:
        print(f"Could not request results from the speech recognition service; {e}")
        return None

def main():
    # Fetch persona details (same as before)
    persona = 'therapist'  # Change this to the default persona you want, or implement a method to choose dynamically

    # Check if the chosen persona exists in the personas dictionary
    if persona not in personas:
        print(f"Persona '{persona}' not found. Exiting.")
        return

    # Fetch details for the chosen persona
    persona_details = personas[persona]
    preprompt = persona_details['prompt']
    filename = persona_details['filename']
    voice_id = persona_details['voice_id']
    
    while True:  # Loop to allow for continuous input
        user_input = get_input_from_user()
        if user_input is None:
            continue  # Skip to the next iteration if there was an error or invalid mode

        # If the input is in text, directly use it; if it's from voice, it's already converted to text
        preprompt = personas[persona]['prompt']
        prompt = preprompt + " " + user_input
        response_text = conversation.run(prompt)
        print(f"⏩ Bot: {response_text}")

        # Log conversation to file, play response, etc.
        now = datetime.datetime.now()
        file_name = personas[persona]['filename']
        print_to_file(file_name, user_input, response_text)

        # Add any additional steps you want to repeat after each new input

if __name__ == "__main__":
    main()

# Add a global variable to track the recording state
is_recording = False

def setup_and_record_audio():
    global is_recording, frames

    # Toggle the recording state
    is_recording = not is_recording

    if is_recording:
        # Setup and recording logic
        audio = pyaudio.PyAudio()
        stream = audio.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)
        print("🔴 Recording started... Click the recording button again to stop.")
        t1 = threading.Thread(target=record_audio, args=(stream, frames))
        t1.start()
    else:
        # Finish and save recording
        print("✅ Recording finished!")
        stream.stop_stream()
        stream.close()
        audio.terminate()

        # Save the recording to a file
        wave_output_filename = "recording.wav"
        with wave.open(wave_output_filename, 'wb') as wf:
            wf.setnchannels(CHANNELS)
            wf.setsampwidth(audio.get_sample_size(FORMAT))
            wf.setframerate(RATE)
            wf.writeframes(b''.join(frames))

def record_audio(stream, frames):
    """Function to handle audio recording."""
    global is_recording
    while is_recording:
        audio_data = stream.read(CHUNK)
        frames.append(audio_data)
