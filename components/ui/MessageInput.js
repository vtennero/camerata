import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input"; // Ensure these are correctly imported
import { Button } from "@/components/ui/button";

export function MessageInput({
  onProcessedText,
  onRefinedText,
  persona,
  filename,
  onFormSubmit,
  onChatHistory,
}) {
  const [input, setInput] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents the default form submission behavior
    await handleSendText(); // Call the function to handle sending the message
    onFormSubmit(input); // Assuming the text you want to send back is the current input state
  };

  const handleTextChange = (event) => {
    setInput(event.target.value);
  };

  const handleSendText = async () => {
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
    } catch (error) {
      console.error("Error processing text:", error);
    }
  };

  // MessageInput.jsx
  return (
    <form className="flex w-full gap-2 items-center" onSubmit={handleSubmit}>
      <Input
        className="flex-1"
        value={input}
        onChange={handleTextChange}
        placeholder="Type a message..."
      />
      <Button type="submit">Send</Button>
    </form>
  );
}
