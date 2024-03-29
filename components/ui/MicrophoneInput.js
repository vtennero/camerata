// MicrophoneInput.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export function MicrophoneInput({
  persona,
  filename,
  onProcessedText,
  onFormSubmit,
  onProcessingComplete, // Callback to indicate processing is complete
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const toggleRecording = () => {
    if (!isRecording) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
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
            await uploadAudio(audioFile);
            audioChunks = []; // Clear the chunks after uploading
          };

          setMediaRecorder(newMediaRecorder);
          setIsRecording(true);
          newMediaRecorder.start();
        })
        .catch((error) =>
          console.error("Error accessing media devices:", error)
        );
    } else {
      mediaRecorder?.stop();
      setIsRecording(false);
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
      if (response.ok) {
        const data = await response.json();
        console.log("Full response data:", data);
        onProcessedText(data.processed_text);
        onRefinedText(data.refined_text); // Make sure this matches the prop name passed from the parent
      }
    } catch (error) {
      console.error("Failed to upload and process audio:", error);
    }
  };

  const MicrophoneIcon = () => (
    <svg className="h-6 w-6 " viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
      <path d="M19 10v2a7 7 0 01-14 0v-2a1 1 0 012 0v2a5 5 0 0010 0v-2a1 1 0 012 0z" />
      <path d="M12 19a6.966 6.966 0 004.472-1.58l1.415 1.414A8.964 8.964 0 0112 21a8.964 8.964 0 01-5.887-2.166l1.415-1.414A6.966 6.966 0 0012 19z" />
    </svg>
  );

  return (
    <div>
      <Button
        className={`${
          isRecording
            ? "bg-red-500 dark:bg-red-600"
            : "bg-green-400 dark:bg-green-500"
        } items-center justify-center rounded-md`}
        type="button"
        onClick={toggleRecording}
      >
        <MicrophoneIcon />
      </Button>
    </div>
  );
}
