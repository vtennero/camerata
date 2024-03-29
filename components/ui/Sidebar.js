import { useEffect, useState } from "react";

export const SidebarContent = ({ persona }) => {
  const [description, setDescription] = useState("");
  const [personaName, setpersonaName] = useState("");

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
    <div className="hidden md:flex md:w-1/3 bg-slate-100 dark:bg-gray-900 p-4 flex-col items-center justify-center space-y-4">
      <div className="w-64 h-64   flex items-center justify-center overflow-hidden">
        <img
          className="w-full h-full object-cover dark:border-gray-400 border border-gray-200"
          src={`${persona}.png`}
          alt={`${persona}`}
          style={{ aspectRatio: "1 / 1" }}
        />
      </div>

      <div className="text-center text-lg font-bold text-gray-900">
        {personaName}
      </div>
      <div className=" text-gray-600 dark:text-slate-400 text-justify">
        {description}
      </div>
    </div>
  );
};
