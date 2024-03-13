// MicrophoneInput.jsx
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

export function MicrophoneInput({
  persona,
  filename,
  onProcessedText,
  onFormSubmit,
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const toggleRecording = async () => {
    if (!isRecording) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const options = { mimeType: "audio/webm" };
          const newMediaRecorder = new MediaRecorder(stream, options);
          newMediaRecorder.start();
          const audioChunks = [];
          newMediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
          };
          newMediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: options.mimeType });
            const audioFile = new File([audioBlob], "recording.webm", {
              type: options.mimeType,
            });
            await uploadAudio(audioFile);
          };
          setMediaRecorder(newMediaRecorder);
          setIsRecording(true);
        })
        .catch(console.error);
    } else {
      if (mediaRecorder) {
        mediaRecorder.stop();
        setIsRecording(false);
      }
    }
  };

  const uploadAudio = async (audioFile) => {
    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("personaName", persona);
    formData.append("filename", filename);
    const response = await fetch(
      "http://localhost:5000/convert-audio-to-text",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    onProcessedText(data.processed_text);
    onFormSubmit(data.input); // Assuming the text you want to send back is the current input state
    console.log("Full response data:", data); // Debugging log
  };

  return (
    <div>
      <Button
        className="bg-gray-100 dark:bg-gray-800"
        type="button"
        onClick={toggleRecording}
      >
        {isRecording ? "🔴" : "🎤"}
      </Button>

      <button></button>
    </div>
  );
}
