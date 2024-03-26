import Image from "next/image";
import Navbar from "../components/Navbar";

export default function GalleryPage() {
  const images = ["/joi.jpg", "/atlas.jpg"];
  return (
    <div className=" h-screen">
      <Navbar />
      <div className="container mx-auto px-5 py-2 lg:px-32 lg:pt-24">
        <div className="-m-1 flex flex-wrap md:-m-2">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative flex w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-1 md:p-2"
            >
              <div className="block mx-auto w-full h-full rounded-lg shadow-md overflow-hidden">
                <img
                  className="w-full h-full object-cover object-center"
                  src={image}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-opacity-75 bg-gray-800 text-white text-sm text-center p-1 rounded-b-lg">
                  Placeholder Name
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
