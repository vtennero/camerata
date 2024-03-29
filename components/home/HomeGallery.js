"use client";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import Link from "next/link"; // Import Link

export default function HomeGallery() {
  const images = [
    "/joi.png",
    "/jcdenton.png",
    "/socrat.png",
    "/thorgal.png",
    "/connor.png",
    "/homer.png",
    "/jack.png",
    "/talleyrand.png",
  ];

  // Create a new array that contains objects with image paths, page names, and placeholder names
  const imageDetails = images.map((imagePath) => {
    const pageName = imagePath.replace(/^\/|\.png$/g, ""); // Remove leading slash and .jpg extension
    return {
      imagePath,
      pageName,
      placeholderName: pageName.charAt(0).toUpperCase() + pageName.slice(1), // Capitalize first letter for the placeholder
    };
  });

  return (
    <div className=" h-screen bg-gray-200 dark:bg-gray-800">
      <Navbar />
      <div className="container mx-auto px-5 py-2 lg:px-32 lg:pt-24 ">
        <div className="-m-1 flex flex-wrap md:-m-2 ">
          {imageDetails.map(
            ({ imagePath, pageName, placeholderName }, index) => (
              <div
                key={index}
                className="relative flex w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-1 md:p-2"
              >
                <Link
                  href={`/${pageName}`}
                  passHref
                  className="block mx-auto w-full h-full rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    className="w-full h-full object-cover object-center"
                    src={imagePath}
                    alt={placeholderName} // Use the placeholderName as the alt text for better accessibility
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-opacity-75 bg-gray-800 text-white text-sm text-center p-1 rounded-b-lg">
                    {placeholderName}
                  </div>
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
