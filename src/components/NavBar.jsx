import React from "react";

export default function Navbar({ selectedOption, onOptionChange }) {
  return (
    <nav className="bg-blue-700 w-full p-4 flex justify-around text-white">
      <button
        className={`py-2 px-4 rounded-md ${
          selectedOption === "add" ? "bg-blue-500" : "bg-blue-700 hover:bg-blue-600"
        }`}
        onClick={() => onOptionChange("readAndShow")}
      >
Read & show      </button>
      
      <button
        className={`py-2 px-4 rounded-md ${
          selectedOption === "remove" ? "bg-blue-500" : "bg-blue-700 hover:bg-blue-600"
        }`}
        onClick={() => onOptionChange("remove")}
      >
        Remove Sessions
      </button>
      
      <button
        className={`py-2 px-4 rounded-md ${
          selectedOption === "addWithTags" ? "bg-blue-500" : "bg-blue-700 hover:bg-blue-600"
        }`}
        onClick={() => onOptionChange("addWithTags")}
      >
        Add Session with Tags 
      </button>
    </nav>
  );
}
