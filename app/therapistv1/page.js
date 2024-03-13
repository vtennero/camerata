"use client";
import Navbar from "../components/Navbar";
import Textarea2 from "../components/Textarea2";
import AudioButton2 from "../components/AudioButton2";
import DisplayArea from "../components/DisplayArea";
import ProfilePicture from "../components/ProfilePicture";

export default function Home() {
  return (
    <div className="max-w-md mx-auto my-8 space-y-8">
      <Navbar />
      <ProfilePicture src="atlas.jpg" />
      <DisplayArea text="Here will be displayed the text" />
      <div className="flex space-x-4">
        <Textarea2 />
        <AudioButton2 />
      </div>
    </div>
  );
}
