from langchain.memory import ChatMessageHistory
import dotenv
dotenv.load_dotenv()
from langchain_openai import ChatOpenAI
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

chat = ChatOpenAI(model="gpt-3.5-turbo-1106", temperature=0.2)

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a helpful assistant. Answer all questions to the best of your ability.",
        ),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}"),
    ]
)

chain = prompt | chat

demo_ephemeral_chat_history_for_chain_02 = ChatMessageHistory()

chain_with_message_history_02 = RunnableWithMessageHistory(
    chain,
    lambda session_id: demo_ephemeral_chat_history_for_chain_02,
    input_messages_key="input",
    history_messages_key="chat_history",
)


chain_with_message_history_02.invoke(
    {"input": "My friend's cat's name is Deborah."},
    {"configurable": {"session_id": "unused"}},
)

response2 = chain_with_message_history_02.invoke(
    {"input": "What is friend's cat's name?"}, {"configurable": {"session_id": "unused"}}
)

response2 = chain_with_message_history_02.invoke(
    {"input": "Is my friend's cat's name Joe?"}, {"configurable": {"session_id": "unused"}}
)

print("response 2: " + response2.content)

print(demo_ephemeral_chat_history_for_chain_02.messages)