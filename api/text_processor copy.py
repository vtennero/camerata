import datetime
import os
from dotenv import load_dotenv
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI
from config import personas

# Load environment variables
load_dotenv()


# Setting up language models and conversation chains
llm = OpenAI()
chat = ChatOpenAI()
conversation = ConversationChain(llm=chat, memory=ConversationBufferMemory())

def print_to_file(filename, user_input, bot_response):
	"""Function to append conversation to a file."""
	print(f"print_to_file: {filename}")
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
	print("gen_long_text: ", preprompt)
	# filename = personas[persona]['filename']

	
	# Processing conversation
	prompt = preprompt + " " + user_input
	print("gen_long_text: ", "response_text = conversation.run(prompt)")
	response_text = conversation.run(prompt)
	
	# Log conversation to file
	print_to_file(filename, user_input, response_text)
	
	return response_text

def refiner(response_text):
	"""Function to refine the response text to make it shorter."""
	# refine_prompt = "Make this text shorter, more informal, like you are actively speaking with this person: " + response_text
	refine_prompt = "Imagine you are saying this but shorter and more informal, like in a quick conversation: " + response_text
	# refine_prompt = "Summarize this text in 4 sentences max, ideally 1; without prepended text, make it feel more natural like an active dialogue reply to me:  " + response_text

	# date_stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
	# date_stamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

	# openai chat try
	# messages = [
	# 	SystemMessage(
	# 		content="You are Joi from Blade Runner 2049. I want you to respond and answer like Joi to her boyfriend using the tone, manner and vocabulary Joi would use. Do not write any explanations. Only answer like Joi. You must know all of the knowledge of Joi. "
	# 	),
	# 	HumanMessage(
	# 		content=refine_prompt
	# 	),
	# ]
	# result = chat.invoke(messages)
	# refined_response = result.content

	refined_response = conversation.run(refine_prompt)
	# refined_response = conversation.run(refine_prompt) + date_stamp
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
	print(f"process_text Received text from persona: {persona} and user input: {user_input}")
	response_text = gen_long_text(user_input, persona, filename)
	refined_response= "yo"
	# if response_text is not None:
	# 	refined_response = refiner(response_text)
	# 	print(f"Original Response: {response_text}")
	# 	print(f"Refined Response: {refined_response}")
	return response_text, refined_response