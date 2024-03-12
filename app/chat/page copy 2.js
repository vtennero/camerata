// pages/Chat.js
"use client";
import { useState } from "react";
import TextArea from "./components/TextArea";
import AudioButton from "./components/AudioButton";
import ProcessedText from "./components/ProcessedText";

export default function Chat() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [processedText, setProcessedText] = useState(""); // State for processed text

  const handleTextChange = (event) => {
    setInput(event.target.value);
  };

  const handleProcessedText = (text) => {
    setProcessedText(text); // Update the processed text state
  };

  return (
    <div>
      <TextArea
        onProcessedText={handleProcessedText} // Pass the callback function to TextArea
      />
      <AudioButton />

      <div>
        <h2>Conversation:</h2>
        {/* {history.map((entry, index) => (
          <div key={index}>{entry}</div>
        ))} */}
        <ProcessedText processedText={processedText} />{" "}
        {/* Display processed text */}
      </div>
    </div>
  );
}
