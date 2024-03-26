import { useEffect, useState } from "react";

export const SidebarContent = ({ persona }) => {
  const [description, setDescription] = useState("");
  const [personaName, setpersonaName] = useState("");

  useEffect(() => {
    // Function to fetch persona description
    const fetchDescription = async () => {
      const response = await fetch(
        `http://localhost:5000/getPersonaDescription?name=${persona}`,
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
    <div className="hidden md:flex md:w-1/3 bg-gray-100 p-4 flex-col items-center justify-center space-y-4">
      <div className="w-64 h-64 bg-gray-300 flex items-center justify-center overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={`${persona}.png`}
          alt={`${persona}`}
          style={{ aspectRatio: "1 / 1" }}
        />
      </div>

      <div className="text-center text-lg font-semibold">{personaName}</div>
      <div className=" text-gray-600  text-justify">{description}</div>
    </div>
  );
};
