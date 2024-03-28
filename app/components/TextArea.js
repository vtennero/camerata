// components/TextArea.js
import React, { useState } from "react";
import axios from "axios";

const TextArea = ({ onProcessedText, onRefinedText, persona, filename }) => {
  const [input, setInput] = useState("");

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
      console.log("Full response data:", response.data); // Add this line
      onProcessedText(response.data.processed_text); // Call the callback function with the processed text
      console.log("Processed text received:", response.data.processed_text);
      onRefinedText(response.data.refined_text);
      console.log("Refined text received:", response.data.refined_text);
    } catch (error) {
      console.error("Error processing text:", error);
    }
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={handleTextChange}
        placeholder="Type your message here..."
      />
      <button onClick={handleSendText}>Send Text</button>
    </div>
  );
};

export default TextArea;
