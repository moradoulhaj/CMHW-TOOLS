import React, { useState } from "react";
import { updateSessionStatuses } from "../../api/apiService";
import { toast } from "react-toastify";

const SessionModal = ({ isOpen, setSessionModalOpen, sessionData }) => {
  if (!isOpen) return null;

  const [updatedSessions, setUpdatedSessions] = useState(sessionData);
  const [isSessionsUpdated, setIsSessionsUpdated] = useState(false);
  // Handling the Close modal if no change made
  const HandleModalClose = () => {
    setUpdatedSessions(sessionData);
    setSessionModalOpen(false);
    
  };

  // Handle status change for each session
  const handleStatusChange = (index) => {
    const newSessions = [...updatedSessions];
    newSessions[index].isActive = !newSessions[index].isActive;
    setUpdatedSessions(newSessions);
    setIsSessionsUpdated(true);
  };

  // Handle Save Changes
  const handleSaveChanges = async () => {
    try {
      const sessionsToUpdate = updatedSessions.map((session) => ({
        id: session.id,
        status: session.isActive,
      }));

      await updateSessionStatuses(sessionsToUpdate);
      toast.success("Session statuses updated successfully!");

      setSessionModalOpen(false);
      // Close modal after saving changes
    } catch (error) {
      console.error("Error updating session statuses:", error);
      toast.error("Failed to update session statuses.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl">
        {/* Close Button */}
        <button
          onClick={HandleModalClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-200"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Session Details
        </h2>

        {/* Session Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left border border-gray-300">
                  Name
                </th>
                <th className="px-4 py-2 text-left border border-gray-300">
                  Username
                </th>
                <th className="px-4 py-2 text-left border border-gray-300">
                  Script
                </th>
                <th className="px-4 py-2 text-left border border-gray-300">
                  Config
                </th>
                <th className="px-4 py-2 text-left border border-gray-300">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {updatedSessions.map((session, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-100 transition duration-200"
                >
                  <td className="px-4 py-3 border border-gray-300">
                    {session.name}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {session.username}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {session.script}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {session.config}
                  </td>
                  <td
                    className="px-4 py-3 border border-gray-300 cursor-pointer"
                    onClick={() => handleStatusChange(index)}
                  >
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs font-semibold transition duration-200 ${
                        session.isActive
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {session.isActive ? "In Repo" : "Paused"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={HandleModalClose}
            className="px-6 py-2 text-lg font-semibold bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition duration-200"
          >
            Close
          </button>
          {isSessionsUpdated && (
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

export default SessionModal;
