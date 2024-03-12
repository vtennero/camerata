// pages/Chat.js
"use client";
import { useState } from "react";
import TextArea from "./components/TextArea";
import AudioButton from "./components/AudioButton";
import ProcessedText from "./components/ProcessedText";
import axios from "axios";

export default function Chat() {
  const [processedText, setProcessedText] = useState("");

  const handleAudioProcessed = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/process-audio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProcessedText(response.data.processed_text);
    } catch (error) {
      console.error("Error processing audio:", error);
    }
  };

  return (
    <div>
      <TextArea />
      <AudioButton onAudioProcessed={handleAudioProcessed} />
      <ProcessedText processedText={processedText} />
    </div>
  );
}
