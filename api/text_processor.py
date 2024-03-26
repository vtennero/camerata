import datetime
import os
from dotenv import load_dotenv
from langchain.memory import ChatMessageHistory
import dotenv
dotenv.load_dotenv()
from langchain_openai import ChatOpenAI
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from config import personas

# Load environment variables
load_dotenv()



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


	refined_response = conversation.run(refine_prompt)
	# refined_response = conversation.run(refine_prompt) + date_stamp
	return refined_response




def	chatwithai(user_input, persona, filename):
	chat = ChatOpenAI(model="gpt-3.5-turbo-1106", temperature=0.2)
	prompt = ChatPromptTemplate.from_messages(
		[
			(
				"system",
				personas[persona]['prompt'],
			),
			MessagesPlaceholder(variable_name="chat_history"),
			("human", "{input}"),
		]
	)

	chain = prompt | chat
	chathistory = "demo_ephemeral_chat_history_for_chain_" + persona

	chain_with_message_history_01 = RunnableWithMessageHistory(
		chain,
		lambda session_id: demo_ephemeral_chat_history_for_chain_01,
		input_messages_key="input",
		history_messages_key="chat_history",
	)

	chain_with_message_history_01.invoke(
		{"input": "My friend's cat's name is Joe."},
		{"configurable": {"session_id": "unused"}},
	)


	response1 = chain_with_message_history_01.invoke(
		{"input": "What is friend's cat's name?"}, {"configurable": {"session_id": "unused"}}
	)
	return response1.content



def process_text(user_input, persona, filename):
	print(f"process_text Received text from persona: {persona} and user input: {user_input}")
	# response_text = gen_long_text(user_input, persona, filename)
	response_text = chatwithai(user_input, persona, filename)
	refined_response= "hello"
	# if response_text is not None:
	# 	refined_response = refiner(response_text)
	# 	print(f"Original Response: {response_text}")
	# 	print(f"Refined Response: {refined_response}")
	return response_text, refined_response