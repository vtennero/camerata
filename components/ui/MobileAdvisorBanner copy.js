// MobileAdvisorBanner.js
import React from "react";

const MobileAdvisorBanner = (persona) => {
  return (
    <div className="md:hidden bg-gray-200 text-black p-4 flex items-center justify-between">
      <div className="flex items-center">
        {/* Adjust the width and height to ensure a square shape */}
        <div className="w-32 h-32">
          <img
            className="w-full h-full object-cover" // This ensures the image covers the div, and won't stretch
            src={`${persona.persona}.png`}
            alt={`${persona.persona}`}
            style={{ aspectRatio: "1 / 1" }} // Ensures a square aspect ratio
          />
        </div>
        <div className="ml-4 text-lg font-semibold">{`${persona.persona}`}</div>
      </div>
    </div>
  );
};

export default MobileAdvisorBanner;
