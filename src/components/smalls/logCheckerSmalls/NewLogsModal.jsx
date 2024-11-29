import { useState } from "react";
import TextAreaInput from "./TextAreaInput";

export default function NewLogsModal({ showNewLogsModal, setShowNewLogsModal, handleUpdateLogs }) {
  const [profilesInput, setProfilesInput] = useState("");
  const [newLogsInput, setNewLogsInput] = useState("");

  const handleNewLogsSubmit = () => {
    handleUpdateLogs(profilesInput, newLogsInput);
    setShowNewLogsModal(false); // Close the modal after submission
  };

  return (
    showNewLogsModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-2/4">
          <h2 className="text-xl font-semibold mb-4">Enter New Logs</h2>
          <div className="flex gap-4 mb-4">
            <div className="w-full">
              <TextAreaInput
                id="profilesInput"
                label="Profiles"
                value={profilesInput}
                onChange={(e) => setProfilesInput(e.target.value)}
              />
            </div>
            <div className="w-full">
              <TextAreaInput
                id="newLogsInput"
                label="New Logs"
                value={newLogsInput}
                onChange={(e) => setNewLogsInput(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowNewLogsModal(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              <i className="ri-close-line"></i>
            </button>
            <button
              onClick={handleNewLogsSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              <i className="ri-check-line"></i>
            </button>
          </div>
        </div>
      </div>
    )
  );
}
