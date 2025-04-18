import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { RotateCcw } from "lucide-react";

const NextDayModal = ({ isOpen, onClose, nextDaySeeds, setNextDaySeeds }) => {
  if (!isOpen) return null;

  // State to track textarea value
  const [isNextDayEdited, setIsNextDayEdited] = useState(false);

  // Handle changes in the textarea
  const handleChange = (event) => {
    setNextDaySeeds(event.target.value);
    setIsNextDayEdited(true);
  };

  // Function to send data to API
  const handleReset = async () => {
    setNextDaySeeds("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">

       {/* Modal Title */}
       <div>
          <h2 className="text-2xl font-semibold text-center  text-gray-800">
            Next Day Seeds
          </h2>
        </div>

        {/* Reset Button */}
        <div className=" text-gray-600 hover:text-gray-900 text-2xl font-bold transition duration-200">
          <RotateCcw
            className="w-5 h-5 text-blue-600 cursor-pointer "
            onClick={handleReset}
          />
        </div>


        </div>
 
        {/* Textarea for Time Drops */}
        <div className="w-full">
          <textarea
            className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={nextDaySeeds}
            onChange={handleChange}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 text-lg font-semibold bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 transition duration-200"
          >
            Close
          </button>
          {isNextDayEdited && (
            <button
              onClick={onClose}
              className="px-6 py-2 text-lg font-semibold bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NextDayModal;
