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

  const MicrophoneIcon = () => (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
      <path d="M19 10v2a7 7 0 01-14 0v-2a1 1 0 012 0v2a5 5 0 0010 0v-2a1 1 0 012 0z" />
      <path d="M12 19a6.966 6.966 0 004.472-1.58l1.415 1.414A8.964 8.964 0 0112 21a8.964 8.964 0 01-5.887-2.166l1.415-1.414A6.966 6.966 0 0012 19z" />
    </svg>
  );

  return (
    <div className="flex justify-center">
      <button
        onClick={handleButtonClick} // Assuming this is your existing logic to handle start/stop recording
        className={`${
          recording
            ? "bg-red-500 dark:bg-red-600"
            : "bg-green-400 dark:bg-green-500"
        } flex items-center justify-center rounded-md p-2`}
        type="button"
      >
        <MicrophoneIcon />
      </button>
    </div>
  );
}
