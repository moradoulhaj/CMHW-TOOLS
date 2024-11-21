import React, { useState } from "react";

export default function Modal({ isModalOpen, setIsModalOpen, onSave , setStartingDropNbr ,startingDropNbr  }) {
  // Local states to store the input values
  const [startingDropTime, setStartingDropTime] = useState("");
  const [timeBetweenDrops, setTimeBetweenDrops] = useState("");

  return (
    <div
      className={`fixed inset-0 ${
        isModalOpen ? "flex" : "hidden"
      } justify-center items-center bg-gray-900 bg-opacity-50 z-50`}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Drop Settings
        </h2>

        {/* Starting Drop Number and Time Inputs */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Starting Drop Number
            </label>
            <input
              type="number"
              value={startingDropNbr}
              onChange={(e) => setStartingDropNbr(e.target.value)}
              min="1"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Starting Drop Time
            </label>
            <input
              type="number"
              value={startingDropTime}
              onChange={(e) => setStartingDropTime(e.target.value)}
              min="0"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="11:00"
            />
          </div>
        </div>

        {/* Time Between Drops Input */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Between Drops (minutes)
          </label>
          <input
            type="number"
            value={timeBetweenDrops}
            onChange={(e) => setTimeBetweenDrops(e.target.value)}
            min="0"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
            placeholder="60"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 text-gray-700 font-medium"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            onClick={() => {
              onSave(startingDropNbr, startingDropTime, timeBetweenDrops);
              setIsModalOpen(false);
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
