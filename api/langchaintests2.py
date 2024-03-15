from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from typing import Any, Dict, List, Union
from langchain.memory.chat_memory import BaseChatMemory
from langchain.schema.messages import BaseMessage, get_buffer_string


class CustomMemoryManager:
    def __init__(self):
        self.persona_memories = {}

    def save_context(self, persona_id, input_values, output_values):
        if persona_id not in self.persona_memories:
            self.persona_memories[persona_id] = []
        self.persona_memories[persona_id].append((input_values, output_values))

    def get_memory(self, persona_id):
        return self.persona_memories.get(persona_id, [])


class CustomConversationBufferMemory(BaseChatMemory):
    human_prefix: str = "Human"
    ai_prefix: str = "AI"
    memory_key: str = "history"
    k: int = 5
    persona_memories: Dict[str, List[BaseMessage]] = {}

    @property
    def buffer(self, persona_id: str) -> Union[str, List[BaseMessage]]:
        return self.buffer_as_messages(persona_id) if self.return_messages else self.buffer_as_str(persona_id)

    @property
    def buffer_as_str(self, persona_id: str) -> str:
        messages = self.persona_memories[persona_id][-self.k * 2 :] if self.k > 0 else []
        return get_buffer_string(messages, human_prefix=self.human_prefix, ai_prefix=self.ai_prefix)

    @property
    def buffer_as_messages(self, persona_id: str) -> List[BaseMessage]:
        return self.persona_memories[persona_id][-self.k * 2 :] if self.k > 0 else []

    @property
    def memory_variables(self) -> List[str]:
        return [self.memory_key]

    def load_memory_variables(self, inputs: Dict[str, Any], persona_id: str) -> Dict[str, Any]:
        return {self.memory_key: self.buffer(persona_id)}



class SimulatedConversationChain:
    def __init__(self, persona_name, memory_manager):
        self.persona_name = persona_name
        self.messages = []
        self.memory_manager = memory_manager

    def run(self, message, persona_id):
        # Simulate a response based on the input message and the persona
        response = f"Simulated response to '{message}' by {self.persona_name}"
        self.messages.append((message, response))
        
        # Save the context to the memory manager
        self.memory_manager.save_context(persona_id, {"input": message}, {"output": response})
        
        return response




class ConversationManager:
    def __init__(self):
        self.memory_manager = CustomMemoryManager()
        self.personas = {
            'therapist': {
                'prompt': "I want you to act as my personal therapist. I'm going to tell you about my day...",
                'conversation_chain': SimulatedConversationChain('therapist', self.memory_manager),
            },
            'cool friend': {
                'prompt': "Let's chat like cool friends. Here's what's on my mind...",
                'conversation_chain': SimulatedConversationChain('cool friend', self.memory_manager),
            },
        }

    def get_conversation_chain(self, persona):
        if persona in self.personas:
            return self.personas[persona]['conversation_chain']
        else:
            print(f"Persona '{persona}' not found.")
            return None

    def chat(self, persona, message, persona_id):
        conversation_chain = self.get_conversation_chain(persona)
        if conversation_chain:
            response = conversation_chain.run(message, persona_id)
            print(f"Bot ({persona}): {response}")


# Initialize the conversation manager
conversation_manager = ConversationManager()

def main():
    while True:
        persona = input("Choose a persona ('therapist' or 'cool friend', type 'exit' to quit): ").strip()
        if persona == 'exit':
            break
        if persona not in ['therapist', 'cool friend']:
            print("Invalid persona. Please try again.")
            continue
        message = input("You: ")
        persona_id = input("Enter a unique persona ID: ")
        conversation_manager.chat(persona, message, persona_id)

if __name__ == "__main__":
    main()

