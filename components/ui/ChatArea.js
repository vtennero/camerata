export function ChatArea({
  processedText,
  refinedText,
  submittedText,
  chatHistory,
}) {
  return (
    <div className="flex flex-col h-full dark:bg-gray-800 bg-white dark:border-gray-400 border-gray-100 border-l">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid p-4 gap-4">
          {chatHistory.map((chat, index) =>
            chat.type === "human" ? (
              <div
                key={index}
                className="flex items-center justify-end rounded-xl bg-blue-600 text-white dark:text-gray-100 p-4 ml-8"
              >
                <div className="grid gap-1 text-sm">
                  <p>{chat.content}</p>
                </div>
              </div>
            ) : (
              <div
                key={index}
                className="flex items-center justify-start rounded-xl bg-gray-100 p-4 dark:bg-gray-700 dark:text-gray-100 mr-8"
              >
                <div className="grid gap-1 text-sm">
                  <p>{chat.content}</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
