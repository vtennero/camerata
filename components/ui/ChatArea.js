// ChatArea.jsx
export function ChatArea({ processedText, refinedText, submittedText }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid h-[100%] items-end p-4 gap-4">
          {submittedText && (
            <div className="flex items-center justify-end rounded-xl bg-gray-200 p-4 dark:bg-gray-800">
              <div className="grid gap-1 text-sm">
                <p>{submittedText}</p>
              </div>
            </div>
          )}
          {processedText && (
            <div className="flex items-center justify-end rounded-xl bg-gray-200 p-4 dark:bg-gray-800">
              <div className="grid gap-1 text-sm">
                <p>{processedText}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
