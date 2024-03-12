// AudioButton.js
import React from "react";

const AudioButton = () => {
  const startRecording = async () => {
    const response = await fetch("http://localhost:5000/start-recording", {
      method: "POST",
    });
    const data = await response.json();
    console.log(data);
  };

  const stopRecording = async () => {
    const response = await fetch("http://localhost:5000/stop-recording", {
      method: "POST",
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
    </div>
  );
};

export default AudioButton;
