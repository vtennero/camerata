import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input"; // Ensure these are correctly imported
import { Button } from "@/components/ui/button";

export function MessageInput({
  onProcessedText,
  onRefinedText,
  persona,
  filename,
}) {
  const [input, setInput] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents the default form submission behavior
    await handleSendText(); // Call the function to handle sending the message
  };

  const handleTextChange = (event) => {
    setInput(event.target.value);
  };

  const handleSendText = async () => {
    try {
      const response = await axios.post("http://localhost:5000/process-text", {
        text: input,
        persona: persona, // The persona passed as a prop
        filename: filename,
      });
      console.log("Full response data:", response.data); // Debugging log
      onProcessedText(response.data.processed_text); // Call the callback function with the processed text
      console.log("Processed text received:", response.data.processed_text); // Debugging log
      onRefinedText(response.data.refined_text);
      console.log("Refined text received:", response.data.refined_text); // Debugging log
      setInput(""); // Clear the input after sending
    } catch (error) {
      console.error("Error processing text:", error);
    }
  };

  //   return (
  //     <form className="flex w-full gap-2" onSubmit={handleSubmit}>
  //       <Input
  //         className="flex-1 min-h-[40px]"
  //         value={input}
  //         onChange={handleTextChange}
  //         placeholder="Type a message..."
  //       />
  //       <Button type="submit">Send</Button>
  //     </form>
  //   );
  // }

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
