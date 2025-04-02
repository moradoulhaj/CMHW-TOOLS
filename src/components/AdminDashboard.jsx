import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Pencil, Trash, Plus } from "lucide-react";
import SessionModal from "./DashboardComponents/SessionModal";
import { deleteSession, fetchEntityId } from "../api/apiService";

const entities = [
  ...Array.from({ length: 15 }, (_, i) => ({ id: i + 1, name: `CMH${i + 1}` })),
  { id: 30, name: "CMH3-Offer" },
  { id: 60, name: "CMH6-Offer" },

  { id: 150, name: "CMH15-Offer" },
  { id: 16, name: "CMH16" },
];

const AdminDashboard = () => {
  const [selectedEntity, setSelectedEntity] = useState(1);
  const [sessionData, setSessionData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editSession, setEditSession] = useState(null);
  const [timeDrops, setTimeDrops] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchEntityId(selectedEntity);
        setSessionData(data.sessions || []);
        setTimeDrops(data.timedrops.split(",") || []);
      } catch (error) {
        toast.error("Failed to fetch data from API!");
      }
    };
    fetchData();
  }, [selectedEntity]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      await deleteSession(id);
      setSessionData((prev) => prev.filter((s) => s.id !== id));
      toast.success("Session deleted successfully!");
    }
  };

  return (
    <div className="p-8 max-w-[1500px] mx-auto bg-gray-100 min-h-screen">
      <ToastContainer theme="colored" />

      <div className="flex justify-center items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>

      <div className="w-full bg-white shadow-md rounded-lg p-4 mb-4 flex items-center justify-between">
        <div>
          {" "}
          <label htmlFor="entitySelect" className="text-gray-700 font-medium">
            Select Entity:
          </label>
          <select
            onChange={(e) => setSelectedEntity(parseInt(e.target.value))}
            className="w-48 py-2 px-3 border shadow-md rounded focus:ring focus:border-blue-500 transition ml-4"
          >
            {entities.map((entity) => (
              <option key={entity.id} value={entity.id}>
                {entity.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          {" "}
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Session
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-[14%] bg-white shadow-md rounded-lg p-4 flex flex-col">
          <label className="text-gray-700 font-medium bg-blue-100 border py-3 px-2 rounded">
            Time Drops:
            <span className="inline-flex items-center rounded-md bg-blue-100 px-2 ml-1 text-xs font-medium ring-1 ring-inset ring-blue-700/10 text-blue-700">
              {timeDrops.length}
            </span>
          </label>
          <textarea
            value={timeDrops.join("\n")}
            readOnly
            className="flex-grow p-3 border rounded bg-gray-100 resize-none cursor-not-allowed mt-2 text-center"
          />
        </div>

        <div className="w-full md:w-[86%] bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-100 text-gray-700">
                <th className="border p-3">ID</th>
                <th className="border p-3">Name</th>
                <th className="border p-3">Username</th>
                <th className="border p-3">Script</th>
                <th className="border p-3">Config</th>
                <th className="border p-3">Status</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessionData.length > 0 ? (
                sessionData.map((session) => (
                  <tr
                    key={session.id}
                    className="text-center hover:bg-gray-50 transition"
                  >
                    <td className="border p-2">{session.id}</td>
                    <td className="border p-2">{session.name}</td>
                    <td className="border p-2">{session.username || "N/A"}</td>
                    <td className="border p-2">{session.script || "N/A"}</td>
                    <td className="border p-2">{session.config || "N/A"}</td>
                    <td className="border p-2">
                      {session.isActive ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded">
                          Active
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="border p-2 flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditSession(session);
                          setModalOpen(true);
                        }}
                        className="flex items-center bg-yellow-500 text-white px-3 py-2 rounded-md shadow-md hover:bg-yellow-600 transition"
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                      </button>
                      <button
                        onClick={() => handleDelete(session.id)}
                        className="flex items-center bg-red-600 text-white px-3 py-2 rounded-md shadow-md hover:bg-red-700 transition"
                      >
                        <Trash className="w-4 h-4 mr-2" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 p-4">
                    No sessions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <SessionModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditSession(null);
          }}
          session={editSession}
          setSessionData={setSessionData}
          entityId={selectedEntity}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
