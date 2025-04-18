import React, { useState } from "react";
import axios from "axios";
import { updateEntity } from "../../api/apiService";
import { toast } from "react-toastify";

const TimeDropsModal = ({
  isOpen,
  onClose,
  timeDrops,
  setTimeDrops,
  entityName,
}) => {
  if (!isOpen) return null;

  // State to track textarea value
  const [editedTimeDrops, setEditedTimeDrops] = useState(timeDrops.join("\n"));
  const [IstimeDropsChanged, setIsTimeDropsChanged] = useState(false);

  // Handle changes in the textarea
  const handleChange = (event) => {
    setEditedTimeDrops(event.target.value);
    setIsTimeDropsChanged(true);
  };

  // Function to send data to API
  const handleSaveChanges = async () => {
    const formattedData = {
      name: entityName, // Use the actual entity name
      timedrops: editedTimeDrops.replace(/\n/g, ","), // Convert new lines to commas
    };
    const entityId = entityName.replace("CMH", ""); // Extract number

    try {
      const response = await updateEntity(entityId, formattedData);
      toast.success("Time drops updated successfully!");
      setTimeDrops(response.timedrops.split(",")); // Update the time drops statet
      onClose();
    } catch (error) {
      console.error("Error updating time drops:", error);
      toast.error("Failed to update time drops.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold transition duration-200"
        >
          &times;
        </button>

        {/* Modal Title */}
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
          Time Drops Details for {entityName}
        </h2>

        {/* Textarea for Time Drops */}
        <div className="w-full">
          <textarea
            className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={editedTimeDrops}
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
          {IstimeDropsChanged && (
            <button
              onClick={handleSaveChanges}
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

export default TimeDropsModal;
