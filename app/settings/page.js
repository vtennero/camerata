"use client";
import SettingsComponent from "@/components/settings/SettingsComponent";
import Navbar from "@/components/ui/Navbar";

export default function Page() {
  return (
    <div className=" h-full min-h-screen bg-gray-200 dark:bg-gray-800">
      <Navbar />
      <div className="container mx-auto px-5 py-2 lg:px-32 lg:pt-24 ">
        <SettingsComponent />
      </div>
    </div>
  );
}
