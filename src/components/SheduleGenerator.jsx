import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, RotateCcw } from "lucide-react";

import { fetchEntities, fetchEntityId } from "../api/apiService";
import SessionModal from "./SpliterComponents/SessionModal";
import { generateSchedule } from "../scripts/spliterScripts";
import JSZip from "jszip";

export default function SheduleGenerator() {
  const [timeDrops, setTimeDrops] = useState([]);
  const [editedTimeDrops, setEditedTimeDrops] = useState("");

  const [activeSessions, setActiveSessions] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [entities, setEntities] = useState([]);
  const [sessionData, setSessionData] = useState([]);
  const [seedsArray, setSeedsArray] = useState([]);
  const [removeTimeoutTasks, setRemoveTimeoutTasks] = useState(1);

  const [isSessionModalOpen, setSessionModalOpen] = useState(false);

  useEffect(() => {
    const loadEntities = async () => {
      try {
        const data = await fetchEntities();
        setEntities(data);
        if (data.length > 0) setSelectedEntity(data[0].id);
      } catch (error) {
        toast.error("Failed to fetch entities.");
      }
    };
    loadEntities();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchEntityId(selectedEntity);
        setLoading(false);
        const timedropsArray = data.timedrops ? data.timedrops.split(",") : [];
        setTimeDrops(timedropsArray);
        setEditedTimeDrops(timedropsArray.join("\n"));

        const sortedSessions = (data.sessions || []).sort(
          (a, b) => a.index - b.index
        );
        setActiveSessions(sortedSessions.filter((s) => s.isActive));
        setSessionData(sortedSessions);
      } catch (error) {
        toast.error("Failed to fetch data from API!");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedEntity, isSessionModalOpen]);

  const handleGenerateClick = async () => {
    if (!seedsArray.length || !activeSessions.length) {
      toast.error("Please load seeds and sessions first.");
      return;
    }
  
    // 🧹 Apply filtering if a valid timeout drop number is specified
    let filteredSeedsArray = seedsArray;
    let filteredTimeDrops = timeDrops;
  
    const timeoutLimit = parseInt(removeTimeoutTasks);
    if (!isNaN(timeoutLimit) && timeoutLimit > 0) {
      filteredSeedsArray = seedsArray.map((sessionDrops) =>
        sessionDrops.slice(0, timeoutLimit)
      );
      filteredTimeDrops = timeDrops.slice(0, timeoutLimit);
    }
  
    const zip = new JSZip();
  
    for (
      let sessionIndex = 0;
      sessionIndex < filteredSeedsArray.length;
      sessionIndex++
    ) {
      const sessionDrops = filteredSeedsArray[sessionIndex];
      const session = activeSessions[sessionIndex];
  
      try {
        let excelBlob = await generateSchedule(
          sessionDrops,
          filteredTimeDrops,
          session.username,
          session.config,
          session.script,
          true,
          false,
          [],
          3,
          true,
          false
        );
  
        zip.file(`Excels/${session.name}.xlsx`, excelBlob);
      } catch (error) {
        console.error(
          `Error generating Excel for session ${session.name}:`,
          error
        );
      }
    }
  
    zip.generateAsync({ type: "blob" }).then((zipBlob) => {
      saveAs(zipBlob, "Schedules.zip");
      toast.success("ZIP file generated and downloaded!");
    });
  };
  
  
//   const handleGenerateClick = async () => {
//     if (!seedsArray.length || !activeSessions.length) {
//       toast.error("Please load seeds and sessions first.");
//       return;
//     }
    
//     // 🧹 Optional filtering of timed-out tasks
//     if (removeTimeoutTasks!=1) {
         
        
      
//     }

//     const zip = new JSZip();

//     for (
//       let sessionIndex = 0;
//       sessionIndex < seedsArray.length;
//       sessionIndex++
//     ) {
//       const sessionDrops = seedsArray[sessionIndex];
//       const session = activeSessions[sessionIndex];

//       try {
//         let excelBlob = await generateSchedule(
//           sessionDrops,
//           timeDrops,
//           session.username,
//           session.config,
//           session.script,
//           true,
//           false,
//           [],
//           3,
//           true,
//           false
//         );

//         zip.file(`Excels/${session.name}.xlsx`, excelBlob);
//       } catch (error) {
//         console.error(
//           `Error generating Excel for session ${session.name}:`,
//           error
//         );
//       }
//     }

//     zip.generateAsync({ type: "blob" }).then((zipBlob) => {
//       saveAs(zipBlob, "Schedules.zip");
//       toast.success("ZIP file generated and downloaded!");
//     });
//   };

  const handleSessionClick = () => {
    if (sessionData.length === 0) {
      toast.error("No session data available!");
      return;
    }
    setSessionModalOpen(true);
  };

  const handleReset = () => {
    setTimeDrops([]);
    setSeedsArray([]);
    setEditedTimeDrops("");
  };

  const handleSaveTimeDrops = () => {
    const updatedDrops = editedTimeDrops
      .split("\n")
      .map((drop) => drop.trim())
      .filter((drop) => drop !== "");
    setTimeDrops(updatedDrops);
    toast.success("Time drops updated!");
  };

  return (
    <div className="flex flex-col items-center p-10 space-y-10 bg-gray-100 min-h-screen">
      <ToastContainer theme="colored" />

      {/* Header */}
      <div className="w-full max-w-5xl flex justify-between items-center bg-blue-500 p-5 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-white">Schedule Generator</h2>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
        >
          <RotateCcw size={20} /> Reset
        </button>
      </div>

      {/* Form Area */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel: Drop Numbers */}
        <div className="flex flex-col">
          <label
            htmlFor="dropNumbers"
            className="text-gray-700 font-semibold mb-2"
          >
            Drop Numbers
          </label>
          <textarea
            id="dropNumbers"
            value={editedTimeDrops}
            onChange={(e) => setEditedTimeDrops(e.target.value)}
            rows={editedTimeDrops.split("\n").length || 4}
            className="w-full p-3 border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
          <button
            onClick={handleSaveTimeDrops}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition"
          >
            Save Time Drops
          </button>
        </div>

        {/* Right Panel: Entity, Sessions & File Upload */}
        <div className="flex flex-col space-y-6">
          {/* Entity Selector */}
          <div>
            <label
              htmlFor="entitySelect"
              className="text-gray-700 font-semibold mb-1 block"
            >
              Select Entity
            </label>
            <select
              id="entitySelect"
              value={selectedEntity}
              onChange={(e) => {
                setSelectedEntity(e.target.value);
                setSessionData([]);
                setTimeDrops([]);
                setEditedTimeDrops("");
                setActiveSessions([]);
              }}
              className="w-full p-2 border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {entities.map((entity) => (
                <option key={entity.id} value={entity.id}>
                  {entity.name}
                </option>
              ))}
            </select>
          </div>

          {/* Session Count */}
          <div className="flex flex-col">
            <label
              htmlFor="sessionNumbers"
              className="text-gray-700 font-semibold mb-1"
            >
              Session In Repo
            </label>
            <div className="relative">
              <input
                id="sessionNumbers"
                type="number"
                value={activeSessions.length}
                readOnly
                className="w-full p-2 border border-gray-300 rounded shadow pr-10"
              />
              <Eye
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                size={20}
                onClick={handleSessionClick}
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label
              htmlFor="seedsUpload"
              className="text-gray-700 font-semibold mb-1 block"
            >
              Upload seedsBySessionPerDrop.txt
            </label>
            <input
              type="file"
              id="seedsUpload"
              accept=".txt"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                  try {
                    const json = JSON.parse(event.target.result);
                    setSeedsArray(json);
                    toast.success("Seeds array loaded!");
                    console.log("Uploaded seeds array:", json);
                  } catch (err) {
                    toast.error("Invalid JSON in uploaded file.");
                  }
                };
                reader.readAsText(file);
              }}
              className="w-full p-2 border border-gray-300 rounded shadow"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              id="removeTimeoutTasks"
              value={removeTimeoutTasks}
              onChange={(e) => setRemoveTimeoutTasks(e.target.value)}
            />
            <label
              htmlFor="removeTimeoutTasks"
              className="text-gray-700 font-medium"
            >
              Drop number
            </label>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="mt-8">
        <button
          className="px-10 py-3 text-lg font-semibold bg-purple-700 text-white rounded-lg shadow-md hover:bg-purple-800 transition"
          onClick={handleGenerateClick}
        >
          Generate Shedule
        </button>
      </div>

      {/* Session Modal */}
      <SessionModal
        isOpen={isSessionModalOpen}
        setSessionModalOpen={setSessionModalOpen}
        sessionData={sessionData}
      />
    </div>
  );
}
