from langchain.memory import ChatMessageHistory
import dotenv
dotenv.load_dotenv()
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
chat = ChatOpenAI(model="gpt-3.5-turbo-1106", temperature=0.2)

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a helpful assistant. Answer all questions to the best of your ability.",
        ),
        MessagesPlaceholder(variable_name="messages"),
    ]
)

chain = prompt | chat

demo_ephemeral_chat_history = ChatMessageHistory()

demo_ephemeral_chat_history.add_user_message("hi!")

demo_ephemeral_chat_history.add_ai_message("whats up?")

demo_ephemeral_chat_history.messages

demo_ephemeral_chat_history.add_user_message(
    "Translate this sentence from English to French: I love programming."
)

response = chain.invoke({"messages": demo_ephemeral_chat_history.messages})

print(response)

demo_ephemeral_chat_history.add_ai_message(response)

demo_ephemeral_chat_history.add_user_message("What did you just say?")

response = chain.invoke({"messages": demo_ephemeral_chat_history.messages})

print(response)