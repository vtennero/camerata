// pages/Chat.js
"use client";
import { useEffect, useState } from "react";
import TextArea from "../components/TextArea";
import AudioButton from "../components/AudioButton";
import ProcessedText from "../components/ProcessedText";
import axios from "axios";
import useTextToSpeech from "./useTextToSpeech";

export default function Chat() {
  const [processedText, setProcessedText] = useState("");
  const [refinedText, setRefinedText] = useState("");
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

  const handleProcessedText = (text) => {
    console.log("Updating processed text with:", text);
    setProcessedText(text);
  };

  // This function is called by child components to update refined text
  const handleRefinedText = (text) => {
    console.log("Updating refined text with:", text);
    setRefinedText(text);
  };

  useTextToSpeech(refinedText);

  return (
    <div>
      {filename && (
        <>
          <TextArea
            onProcessedText={handleProcessedText}
            onRefinedText={handleRefinedText}
            persona="therapist"
            filename={filename}
          />
          <AudioButton
            onProcessedText={handleProcessedText}
            onRefinedText={handleRefinedText}
            persona="therapist"
            filename={filename}
          />
          <ProcessedText
            processedText={processedText}
            refinedText={refinedText}
          />
        </>
      )}
    </div>
  );
}
