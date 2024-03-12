// components/TextArea.js
import React, { useState } from "react";
import axios from "axios";

const TextArea = ({ onProcessedText, persona, filename }) => {
  const [input, setInput] = useState("");

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
      onProcessedText(response.data.processed_text); // Call the callback function with the processed text
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
