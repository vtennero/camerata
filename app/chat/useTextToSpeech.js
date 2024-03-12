import { useEffect } from "react";

// Custom hook to handle text-to-speech
const useTextToSpeech = (text) => {
  useEffect(() => {
    if (text) {
      const speechSynthesis = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      // You can customize the voice, pitch, rate, etc. here
      utterance.voice =
        speechSynthesis.getVoices().find((voice) => voice.lang === "en-US") ||
        speechSynthesis.getVoices()[0];
      speechSynthesis.speak(utterance);
    }
  }, [text]); // This will trigger the effect every time 'text' changes
};

export default useTextToSpeech;
