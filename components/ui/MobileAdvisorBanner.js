// MobileAdvisorBanner.js
import React, { useEffect, useState } from "react";

const MobileAdvisorBanner = ({ persona }) => {
  const [description, setDescription] = useState(""); // State to hold the description
  const [personaName, setpersonaName] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Function to fetch persona description
    const fetchDescription = async () => {
      setIsLoading(true); // Set loading to false after fetching data
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/getPersonaDescription?name=${persona}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        console.error("Failed to fetch");
        setIsLoading(false); // Set loading to false after fetching data
        return;
      }
      const data = await response.json();
      setDescription(data.description); // Update the description state
      setpersonaName(data.name); // Update the description state
      setIsLoading(false); // Set loading to false after fetching data
    };

    fetchDescription(); // Call the fetch function
  }, [persona]); // Dependency array, re-fetch if persona changes

  if (isLoading) {
    return <div>Loading persona...</div>; // Display loading indicator
  }

  return (
    <div className="md:hidden bg-slate-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-400   p-4 flex items-start justify-between">
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
          <div className="text-sm font-semibold mb-1 text-gray-900 dark:text-gray-100">
            {personaName}
          </div>
          <div className="text-xs font-light text-gray-500  dark:text-gray-300">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAdvisorBanner;
