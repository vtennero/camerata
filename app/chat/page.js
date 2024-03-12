// pages/Chat.js
"use client";
import { useEffect, useState } from "react";
import TextArea from "./components/TextArea";
import AudioButton from "./components/AudioButton";
import ProcessedText from "./components/ProcessedText";
import axios from "axios";

export default function Chat() {
  const [processedText, setProcessedText] = useState("");
  const [filename, setFilename] = useState("");

  useEffect(() => {
    generateFilename();
  }, []);

  const generateFilename = () => {
    const now = new Date();
    const timestamp = `${now.getFullYear()}${padZero(
      now.getMonth() + 1
    )}${padZero(now.getDate())}_${padZero(now.getHours())}${padZero(
      now.getMinutes()
    )}${padZero(now.getSeconds())}`;
    const persona = "therapist";
    const type = "log";
    const generatedFilename = `${persona}_${timestamp}_${type}.md`;
    setFilename(generatedFilename);
    console.log(generatedFilename);
  };

  const padZero = (num) => {
    return num.toString().padStart(2, "0");
  };

  const handleAudioProcessed = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setProcessedText(response.data.processed_text);
    } catch (error) {
      console.error("Error processing text:", error);
    }
  };

  return (
    <div>
      {filename && (
        <>
          <TextArea
            onProcessedText={setProcessedText}
            persona="therapist"
            filename={filename}
          />
          <AudioButton
            onProcessedText={setProcessedText}
            persona="therapist"
            filename={filename}
          />
          <ProcessedText processedText={processedText} />
        </>
      )}
    </div>
  );
}
