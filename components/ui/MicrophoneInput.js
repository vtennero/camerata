import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

export function MicrophoneInput({
  onProcessedText,
  onRefinedText,
  persona,
  filename,
  onChatHistory,
}) {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const options = { mimeType: "audio/webm" };
      const newMediaRecorder = new MediaRecorder(stream, options);
      let audioChunks = [];

      newMediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      newMediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: options.mimeType });
        const audioFile = new File([audioBlob], "recording.webm", {
          type: options.mimeType,
        });
        await uploadAudio(audioFile); // Once uploaded, it will internally handle the response and update the processed text
        audioChunks = []; // Clear the chunks after uploading
      };

      newMediaRecorder.start();
      setMediaRecorder(newMediaRecorder);
    });
  };

  const handleButtonClick = () => {
    if (recording && mediaRecorder) {
      mediaRecorder.stop(); // Stop the recording
      mediaRecorder.stream.getTracks().forEach((track) => track.stop()); // Stop the media stream
      setRecording(false);
    } else {
      startRecording();
      setRecording(true);
    }
  };

  const uploadAudio = async (audioFile) => {
    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("personaName", persona);
    formData.append("filename", filename);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/convert-audio-to-text`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      // Ensure that this key matches exactly what the backend is sending
      if (data.status === "success") {
        // Make sure 'processed_text' is the key the backend uses
        onProcessedText(data.processed_text); // This should now update correctly
        onRefinedText(data.refined_text);
        onChatHistory(data.chatHistory);
        console.log("MessageInput Chathistory received:", data.chatHistory); // Debugging log
      } else {
        console.error("Error in processing: ", data.message);
        // Handle any error or unsuccessful processing here
      }
    } catch (error) {
      console.error("Error uploading audio file:", error);
    }
  };

  return (
    <div className="flex justify-center">
      <Button
        onClick={handleButtonClick}
        className={`bg-blue-800 dark:bg-blue-600 ${
          recording ? "bg-red-600" : ""
        }`}
      >
        {recording ? "Stop Recording" : "Start Recording"}
      </Button>
    </div>
  );
}
