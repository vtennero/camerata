// ChatArea.jsx

function renderChatMessages(chatHistory) {
  // Check if chatHistory is defined and not empty before mapping over it
  if (chatHistory && chatHistory.length > 0) {
    return chatHistory.map((message, index) => {
      if (message.type === "ai") {
        return (
          <div
            key={index}
            className="flex items-center justify-start rounded-xl bg-gray-200 p-4 dark:bg-gray-800 mr-8"
          >
            <div className="grid gap-1 text-sm">
              <p>{message.content}</p>
            </div>
          </div>
        );
      } else if (message.type === "human") {
        return (
          <div
            key={index}
            className="flex items-center justify-end rounded-xl bg-gray-200 p-4 dark:bg-gray-800 ml-8"
          >
            <div className="grid gap-1 text-sm">
              <p>{message.content}</p>
            </div>
          </div>
        );
      }
      return null; // If message type is unknown, return null
    });
  } else {
    return null; // Return null if chatHistory is undefined or empty
  }
}

// export function ChatArea({
//   processedText,
//   refinedText,
//   submittedText,
//   chatHistory,
// }) {
//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-4">
//         {/* <div className="grid h-[100%] items-end p-4 gap-4">
//           {submittedText && (
//             <div className="flex items-center justify-end rounded-xl bg-gray-200 p-4 dark:bg-gray-800 ml-8">
//               <div className="grid gap-1 text-sm">
//                 <p>{submittedText}</p>
//               </div>
//             </div>
//           )}
//           {processedText && (
//             <div className="flex items-center justify-start rounded-xl bg-gray-200 p-4 dark:bg-gray-800 mr-8">
//               <div className="grid gap-1 text-sm">
//                 <p>{processedText}</p>
//               </div>
//             </div>
//           )}
//         </div> */}
//         <div>{renderChatMessages(chatHistory)}</div>
//       </div>
//     </div>
//   );
// }

export function ChatArea({
  processedText,
  refinedText,
  submittedText,
  chatHistory,
}) {
  console.log("Received chatHistory:", chatHistory); // For debugging

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {/* Render chat messages if chatHistory is defined */}
        {chatHistory ? (
          chatHistory.map((message, index) => (
            <p key={index}>{JSON.stringify(message)}</p>
          ))
        ) : (
          <p>No chat history available</p>
        )}
      </div>
    </div>
  );
}
