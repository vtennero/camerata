// MainChat.js
"use client";

import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { MicrophoneInput } from "./MicrophoneInput";
import { MessageInput } from "./MessageInput";

import { ChatArea } from "./ChatArea";
import Navbar from "@/components/ui/Navbar";
import { useEffect, useState } from "react";
import MobileAdvisorBanner from "./MobileAdvisorBanner";
import { SidebarContent } from "./Sidebar";
import { useSession } from "@/contexts/SessionContext";

export function MainChat({ persona }) {
  const [processedText, setProcessedText] = useState("");
  const [refinedText, setRefinedText] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [filename, setFilename] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const session = useSession();

  useEffect(() => {
    const fetchAudio = async () => {
      if (refinedText) {
        console.log("Triggering useEffect for refinedText:", refinedText);
        try {
          console.log(
            "Sending request to generate-audio with text:",
            refinedText
          );
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/generate-audio`,
            {
              // const response = await fetch("http://localhost:5000/generate-audio", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                persona: persona,
              },
              body: JSON.stringify({ text: refinedText, persona: persona }),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Received response from generate-audio:", data);

          if (!data.audioUrl) {
            throw new Error("No audio URL in response");
          }

          console.log("Playing audio from URL:", data.audioUrl);
          const audio = new Audio(data.audioUrl);
          audio
            .play()
            .then(() => {
              console.log("Audio playback started");
            })
            .catch((error) => {
              console.error("Error during audio playback:", error);
            });
        } catch (error) {
          console.error("Error in fetchAudio:", error);
        }
      }
    };

    fetchAudio();
  }, [refinedText, persona]);

  useEffect(() => {
    generateFilename(persona);
  }, [persona]);

  const generateFilename = () => {
    const now = new Date();
    const timestamp = `${now.getFullYear()}${padZero(
      now.getMonth() + 1
    )}${padZero(now.getDate())}_${padZero(now.getHours())}${padZero(
      now.getMinutes()
    )}${padZero(now.getSeconds())}`;
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

  const handleRefinedText = (text) => {
    console.log("Updating refined text with:", text);
    setRefinedText(text);
  };

  const handleChatHistory = (text) => {
    console.log("Updating history text with:", text);
    setChatHistory(text);
  };

  const handleFormSubmit = (textInput) => {
    console.log("Form submitted with text:", textInput);
  };

  if (!session) {
    return (
      <div className="flex flex-col h-screen">
        <Navbar />
        <div>Please log in to view this content.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <MobileAdvisorBanner persona={persona} />
      <div className="flex flex-1 overflow-hidden">
        <SidebarContent persona={persona} className="md:w-1/3" />
        <div key="1" className="flex flex-col flex-1 md:w-2/3">
          <div className="flex-1 overflow-y-auto">
            <ChatArea chatHistory={chatHistory} />
          </div>
          <div className="p-4 flex gap-2 items-center sticky bottom-0 bg-white dark:bg-gray-900 border-l border-t dark:border-gray-400 border-gray-100">
            <MessageInput
              onProcessedText={handleProcessedText}
              onRefinedText={handleRefinedText}
              persona={persona}
              filename={filename}
              onFormSubmit={handleFormSubmit}
              onChatHistory={handleChatHistory}
            />
            <MicrophoneInput
              onProcessedText={handleProcessedText}
              onRefinedText={handleRefinedText}
              persona={persona}
              filename={filename}
              onFormSubmit={handleFormSubmit}
              onChatHistory={handleChatHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
