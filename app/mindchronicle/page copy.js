"use client";
import React, { useState, useMemo } from "react";

// Navbar component
const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white p-4 mb-6">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold">MindChronicle</h1>
      </div>
    </nav>
  );
};

// Subcomponent for the time period menu
const TimePeriodMenu = ({ selectedPeriod, onSelect }) => {
  const periods = ["Daily", "Weekly", "Monthly", "Yearly"];

  return (
    <div className="flex space-x-2 mb-4">
      {periods.map((period) => (
        <button
          key={period}
          onClick={() => onSelect(period)}
          className={`px-4 py-2 transition-colors ${
            selectedPeriod === period
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          {period}
        </button>
      ))}
    </div>
  );
};

// Subcomponent for rendering entries
const EntriesComponent = ({ entries }) => {
  return (
    <div className="space-y-2">
      {entries.map((entry, index) => (
        <div key={index} className="bg-gray-800 p-4 border border-gray-700">
          <h2 className="text-xl mb-2 text-gray-100">{entry.title}</h2>
          <p className="text-gray-300">{entry.content}</p>
        </div>
      ))}
    </div>
  );
};

// Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center space-x-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-700 text-white disabled:opacity-50"
      >
        Previous
      </button>
      <span className="px-4 py-2 text-white">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-700 text-white disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

// Generate dummy data (unchanged from previous version)

// Generate dummy data
const generateDummyData = () => {
  const data = {
    Daily: [],
    Weekly: [],
    Monthly: [],
    Yearly: [],
  };

  const currentDate = new Date();

  // Generate daily entries
  for (let i = 0; i < 100; i++) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - i);
    data.Daily.push({
      title: `${date.toLocaleDateString("en-US", {
        weekday: "long",
      })}, ${date.getDate()} ${date.toLocaleDateString("en-US", {
        month: "long",
      })} ${date.getFullYear()}`,
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Entry for ${
        i + 1
      } days ago.`,
    });
  }

  // Generate weekly entries
  for (let i = 0; i < 100; i++) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - i * 7);
    const weekNumber = Math.ceil((date.getDate() - date.getDay() + 1) / 7);
    data.Weekly.push({
      title: `Week ${weekNumber}, ${date.getFullYear()}`,
      content: `Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Entry for ${
        i + 1
      } weeks ago.`,
    });
  }

  // Generate monthly entries
  for (let i = 0; i < 100; i++) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - i);
    data.Monthly.push({
      title: `${date.toLocaleDateString("en-US", {
        month: "long",
      })} ${date.getFullYear()}`,
      content: `Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Entry for ${
        i + 1
      } months ago.`,
    });
  }

  // Generate yearly entries
  for (let i = 0; i < 100; i++) {
    const year = currentDate.getFullYear() - i;
    data.Yearly.push({
      title: `${year}`,
      content: `Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Entry for ${year}.`,
    });
  }

  return data;
};

const dummyData = generateDummyData();

// Main MindChronicle component
const MindChronicle = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Daily");
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 30;

  const paginatedEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    return dummyData[selectedPeriod].slice(startIndex, endIndex);
  }, [selectedPeriod, currentPage]);

  const totalPages = Math.ceil(
    dummyData[selectedPeriod].length / entriesPerPage
  );

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <TimePeriodMenu
          selectedPeriod={selectedPeriod}
          onSelect={handlePeriodChange}
        />
        <EntriesComponent entries={paginatedEntries} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default MindChronicle;
