from langchain.memory import ConversationBufferMemory
from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationChain

personas = {
    'therapist': {
        'prompt': "I want you to act as my personal therapist. I'm going to tell you about my day...",
        'filename': 'therapist_log.md',
        # Add a placeholder for the conversation chain instance
        'conversation_chain': None,
    },
    'cool friend': {
        'prompt': "Let's chat like cool friends. Here's what's on my mind...",
        'filename': 'cool_friend_log.md',
        # Add a placeholder for the conversation chain instance
        'conversation_chain': None,
    },
    # Add more personas as needed
}


def get_or_create_conversation_chain(persona):
    # Check if the conversation chain for the persona already exists
    if personas[persona]['conversation_chain'] is None:
        # If not, create a new conversation chain for this persona
        personas[persona]['conversation_chain'] = ConversationChain(llm=chat, memory=ConversationBufferMemory())
    return personas[persona]['conversation_chain']

def gen_long_text(user_input, persona, filename):
    """Function to process text input based on persona."""
    # Check if the chosen persona exists in the personas dictionary
    if persona not in personas:
        print(f"Persona '{persona}' not found.")
        return None

    # Fetch details for the chosen persona
    preprompt = personas[persona]['prompt']
    
    # Retrieve or create the conversation chain for this persona
    conversation_chain = get_or_create_conversation_chain(persona)

    # Processing conversation
    prompt = preprompt + " " + user_input
    response_text = conversation_chain.run(prompt)
    
    # Log conversation to file
    # print_to_file(filename, user_input, response_text)
    print(user_input)
    print(response_text)

    return response_text
