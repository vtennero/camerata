// MobileAdvisorBanner.js
import React from "react";

const MobileAdvisorBanner = () => {
  return (
    <div className="md:hidden bg-gray-200 text-black p-4 flex items-center justify-between">
      <div className="flex items-center">
        {/* Adjust the width and height to ensure a square shape */}
        <div className="w-16 h-16">
          <img
            className="w-full h-full object-cover" // This ensures the image covers the div, and won't stretch
            src="atlas.jpg" // Your image path
            alt="Support Agent"
            style={{ aspectRatio: "1 / 1" }} // Ensures a square aspect ratio
          />
        </div>
        <div className="ml-4 text-lg font-semibold">Support Agent</div>
      </div>
    </div>
  );
};

export default MobileAdvisorBanner;
