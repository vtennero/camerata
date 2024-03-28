import React, { useState } from "react";

const AudioButton = ({ persona, filename, onProcessedText }) => {
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const startRecording = async () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        // Adjust this to 'audio/webm' or 'audio/ogg' if 'audio/wav' is not supported in your browser.
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
      })
      .catch(console.error);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop(); // This will trigger the onstop event
    }
  };

  const uploadAudio = async (audioFile) => {
    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("personaName", persona); // Use the extracted page name here
    formData.append("filename", filename); // Use the extracted page name here
    const response = await fetch(
      // "http://localhost:5000/convert-audio-to-text",
      `${process.env.BACKEND_ROUTE}/convert-audio-to-text`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    onProcessedText(data.processed_text); // Call the callback function with the processed text

    console.log(data);
  };

  return (
    <div>
      <div>
        <button onClick={startRecording}>Start Recording</button>
      </div>
      <div>
        <button onClick={stopRecording}>Stop Recording</button>
      </div>
    </div>
  );
};

export default AudioButton;
