// components/AudioButton.js
import React from "react";

const AudioButton = () => {
  return (
    <button onClick={() => console.log("Start/Stop Recording button clicked")}>
      Start/Stop Recording
    </button>
  );
};

export default AudioButton;
