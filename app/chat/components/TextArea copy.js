// components/TextArea.js
import React, { useState } from "react";

const TextArea = () => {
  const [input, setInput] = useState("");

  const handleTextChange = (event) => {
    setInput(event.target.value);
  };

  const handleSendText = () => {
    console.log(input);
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
