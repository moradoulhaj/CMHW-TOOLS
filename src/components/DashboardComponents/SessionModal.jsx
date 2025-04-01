import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createSession, updateSession } from "../../api/apiService";

const SessionModal = ({ isOpen, onClose, session, setSessionData, entityId }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    script: "",
    config: "",
    isActive: false,
    dep: entityId, // Set dep (department) to entityId initially
  });

  useEffect(() => {
    if (session) {
      setFormData({ ...session, dep:  entityId }); // If session exists, set dep.id or use entityId
    }
  }, [session, entityId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sessionData = { ...formData, dep: { id: formData.dep } }; // Set dep as an object with id

      if (session) {
        await updateSession(session.id, sessionData); // Pass session ID for update
        toast.success("Session updated successfully!");
      } else {
        const newSession = await createSession(sessionData); // For creating new session
        setSessionData((prev) => [...prev, newSession]);
        toast.success("Session created successfully!");
      }
      onClose();
    } catch (error) {
      toast.error("Error saving session.");
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">{session ? "Edit Session" : "Add Session"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            placeholder="Session Name"
            required
          />
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            placeholder="Username"
          />
          <input
            name="script"
            value={formData.script}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            placeholder="Script"
          />
          <input
            name="config"
            value={formData.config}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            placeholder="Config"
          />
          
          {/* Since entityId is used for dep, no need for a separate select */}
          <input type="hidden" name="dep" value={formData.dep} /> {/* Ensure dep is sent correctly */}

          <label className="block mb-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            Active
          </label>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default SessionModal;
