import os
import datetime
from dotenv import load_dotenv
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI

# Load environment variables
load_dotenv()

# Configuration for different personas (if needed, else can be simplified)
personas = {
	'therapist': {
		'prompt': "I want you to act as my personal therapist. I'm going to tell you about my day...",
		'filename': 'therapist_log.md',
	},
	# Add more personas as needed
}

# Setting up language models and conversation chains
llm = OpenAI()
chat = ChatOpenAI()
conversation = ConversationChain(llm=chat, memory=ConversationBufferMemory())

def print_to_file(filename, user_input, bot_response):
	"""Function to append conversation to a file."""
	now = datetime.datetime.now()
	formatted_date = f"{now:%Y-%m-%d_%H-%M-%S}"
	# file_path = f"YourDirectory/{filename}"  # Change 'YourDirectory' to your actual directory path
	file_path = f"uploads/logs/therapist/{filename}"  # Update to the new path
	with open(file_path, "a") as file:
		file.write(f"{formatted_date} User: {user_input}\n")
		file.write(f"{formatted_date} Bot: {bot_response}\n")

def gen_long_text(user_input, persona, filename):
	"""Function to process text input based on persona."""
	# Check if the chosen persona exists in the personas dictionary
	if persona not in personas:
		print(f"Persona '{persona}' not found.")
		return None

	# Fetch details for the chosen persona
	preprompt = personas[persona]['prompt']
	# filename = personas[persona]['filename']

	
	# Processing conversation
	prompt = preprompt + " " + user_input
	response_text = conversation.run(prompt)
	
	# Log conversation to file
	print_to_file(filename, user_input, response_text)
	
	return response_text

def refiner(response_text):
	"""Function to refine the response text to make it shorter."""
	refine_prompt = "Make this text shorter, more informal, like you are actively speaking with this person: " + response_text
	# refine_prompt = "Summarize this text in 4 sentences max, ideally 1; without prepended text, make it feel more natural like an active dialogue reply to me:  " + response_text
	refined_response = conversation.run(refine_prompt)
	return refined_response

# def main(text, persona):
#     # Example usage of process_text
#     response_text = process_text(text, persona, personas[persona]['filename'])
#     if response_text is not None:
#         refined_response = refiner(response_text)
#         print(f"Original Response: {response_text}")
#         print(f"Refined Response: {refined_response}")
#     else:
#         print("No response generated.")

def process_text(user_input, persona, filename):
	print(f"Received text from persona: {persona} and user input: {user_input}")
	response_text = gen_long_text(user_input, persona, filename)
	if response_text is not None:
		refined_response = refiner(response_text)
		print(f"Original Response: {response_text}")
		print(f"Refined Response: {refined_response}")
	return response_text, refined_response