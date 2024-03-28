// MobileAdvisorBanner.js
import React, { useEffect, useState } from "react";

const MobileAdvisorBanner = ({ persona }) => {
  const [description, setDescription] = useState(""); // State to hold the description
  const [personaName, setpersonaName] = useState("");
  console.log("Backend Route:", process.env.NEXT_PUBLIC_BACKEND_ROUTE);
  // Your fetch call here

  useEffect(() => {
    // Function to fetch persona description
    const fetchDescription = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/getPersonaDescription?name=${persona}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        console.error("Failed to fetch");
        return;
      }
      const data = await response.json();
      setDescription(data.description); // Update the description state
      setpersonaName(data.name); // Update the description state
    };

    fetchDescription(); // Call the fetch function
  }, [persona]); // Dependency array, re-fetch if persona changes

  return (
    <div className="md:hidden bg-gray-200 text-black p-4 flex items-start justify-between">
      <div className="flex items-start w-full">
        <div className="w-1/4 flex-none" style={{ minWidth: "25%" }}>
          <img
            className="w-full h-auto"
            style={{ aspectRatio: "1 / 1" }}
            src={`${persona}.png`}
            alt={`${persona}`}
          />
        </div>
        <div className="pl-4 flex-grow">
          <div className="text-sm font-semibold mb-1">{personaName}</div>
          <div className="text-xs font-light text-gray-500">{description}</div>
        </div>
      </div>
    </div>
  );
};

export default MobileAdvisorBanner;
