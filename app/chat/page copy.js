// pages/Chat.js
"use client";
import { useState } from "react";
import TextArea from "./components/TextArea";
import AudioButton from "./components/AudioButton";

export default function Chat() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);

  const handleTextChange = (event) => {
    setInput(event.target.value);
  };

  return (
    <div>
      <TextArea
        input={input}
        setInput={setInput}
        handleTextChange={handleTextChange}
      />
      <AudioButton />
      <div>
        <h2>Conversation:</h2>
        {history.map((entry, index) => (
          <div key={index}>{entry}</div>
        ))}
      </div>
    </div>
  );
}
