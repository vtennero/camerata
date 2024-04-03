import { useEffect, useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import Navbar from "../ui/Navbar";

function SettingsComponent() {
  const [model, setModel] = useState("");
  const [audioService, setAudioService] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Options for the dropdowns
  const modelOptions = [
    "gpt-4-0125-preview",
    "gpt-4-turbo-preview",
    "gpt-4",
    "gpt-3.5-turbo",
  ];
  const audioServiceOptions = ["OpenAI", "ElevenLabs"];
  const session = useSession();

  useEffect(() => {
    // Function to fetch current settings
    const fetchCurrentSettings = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/current-settings`
      );
      if (response.ok) {
        const data = await response.json();
        setModel(data.model);
        setAudioService(data.audio_service);
      } else {
        // Handle errors or set defaults
      }
    };

    fetchCurrentSettings();
  }, []);

  const updateSetting = async (settingName, settingValue) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/update-setting`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: settingName, value: settingValue }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.status === "success") {
        setFeedbackMessage(
          `${settingName.replace("_", " ")} updated to ${settingValue}`
        );
      } else {
        setFeedbackMessage("Failed to save option");
      }
    } else {
      setFeedbackMessage("Failed to save option");
    }

    setTimeout(() => setFeedbackMessage(""), 3000);
  };
  // Handlers for dropdown changes
  const handleModelChange = (e) => {
    setModel(e.target.value);
    updateSetting("MODEL", e.target.value);
  };

  const handleAudioServiceChange = (e) => {
    setAudioService(e.target.value);
    updateSetting("AUDIO_SERVICE", e.target.value);
  };

  if (!session) {
    return <div>Please log in to view this content.</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-bold text-xl">Model</h2>
        <select
          value={model}
          onChange={handleModelChange}
          className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {modelOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div>
        <h2 className="font-bold text-xl">Audio Service</h2>
        <select
          value={audioService}
          onChange={handleAudioServiceChange}
          className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {audioServiceOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {feedbackMessage && (
        <div className="text-green-500">{feedbackMessage}</div>
      )}
    </div>
  );
}

export default SettingsComponent;
