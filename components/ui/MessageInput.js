import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input"; // Ensure these are correctly imported
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

export function MessageInput({
  onProcessedText,
  onRefinedText,
  persona,
  filename,
  onFormSubmit,
  onChatHistory,
}) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents the default form submission behavior
    await handleSendText(); // Call the function to handle sending the message
    onFormSubmit(input); // Assuming the text you want to send back is the current input state
  };

  const handleTextChange = (event) => {
    setInput(event.target.value);
  };

  const handleSendText = async () => {
    setIsLoading(true); // Start loading

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/process-text`,
        {
          text: input,
          persona: persona, // The persona passed as a prop
          filename: filename,
        }
      );
      console.log("MessageInput Full response data:", response.data); // Debugging log
      onProcessedText(response.data.processed_text); // Call the callback function with the processed text
      console.log(
        "MessageInput Processed text received:",
        response.data.processed_text
      ); // Debugging log
      onRefinedText(response.data.refined_text);
      console.log(
        "MessageInput Refined text received:",
        response.data.refined_text
      ); // Debugging log
      onChatHistory(response.data.chatHistory);
      console.log(
        "MessageInput Chathistory received:",
        response.data.chatHistory
      ); // Debugging log
      setInput(""); // Clear the input after sending
      setIsLoading(false); // Start loading
    } catch (error) {
      console.error("Error processing text:", error);
      setIsLoading(false); // Start loading
    }
  };

  // MessageInput.jsx
  return (
    <form className="flex w-full gap-2 items-center " onSubmit={handleSubmit}>
      <Input
        className="flex-1"
        value={input}
        onChange={handleTextChange}
        placeholder="Type a message..."
      />
      <Button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded bg-blue-800 text-white dark:bg-blue-600 disabled:bg-blue-500/80 disabled:cursor-not-allowed min-w-[76px]"
      >
        {isLoading ? (
          <>
            <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
          </>
        ) : (
          "Send"
        )}
      </Button>
    </form>
  );
}
