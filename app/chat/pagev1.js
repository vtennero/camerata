"use client";
import { useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);

  const handleTextChange = (event) => {
    setInput(event.target.value);
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={handleTextChange}
        placeholder="Type your message here..."
      />
      <button>Send Text</button>
      <button>Start/Stop Recording</button>
      <div>
        <h2>Conversation:</h2>
        {history.map((entry, index) => (
          <div key={index}>{entry}</div>
        ))}
      </div>
    </div>
  );
}
