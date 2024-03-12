import { useState } from "react";

function Textarea2() {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    // You can define what happens when the message is sent
    alert(message);
  };

  return (
    <div className="flex w-3/4 flex-col space-y-2">
      <textarea
        className="p-2 border rounded-md"
        rows="5"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button
        className="bg-blue-500 text-white p-2 rounded-lg"
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  );
}

export default Textarea2;
