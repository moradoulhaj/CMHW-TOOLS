import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, RotateCcw, Settings } from "lucide-react";
import TagsInput from "./smalls/TagsInput";
import {
  calcSessions,
  collectData,
  downloadZip,
  generateExcel,
  parseNumberTagPairs,
  splitSessionsByDrops,
} from "../scripts/spliterScripts";
import { fetchEntityId } from "../api/apiService"; // Import API function
import SpliterSettingsModal from "./SpliterComponents/SpliterSettingsModal";
import SessionModal from "./SpliterComponents/SessionModal";
import TimeDropsModal from "./SpliterComponents/TimeDropsModal";
import NextDayModal from "./SpliterComponents/NextDayModal";

export default function SpliterBeta() {
  const [processedContents, setProcessedContents] = useState([]);
  const [tagsToSplit, setTagsToSplit] = useState("");
  const [sessionCount, setSessionCount] = useState("");
  const [seedsBySessions, setSeedsBySessions] = useState([]);
  const [timeDrops, setTimeDrops] = useState([]);
  const [activeSessions, setActiveSessions] = useState(0);
  const [selectedEntity, setSelectedEntity] = useState(1);

  const [seedsBySessionPerDrop, setSeedsBySessionPerDrop] = useState([]);
  const [delimiter, setDelimiter] = useState("\n");
  const [sessionData, setSessionData] = useState([]);
  //Next Day Seeds
  const [nextDaySeeds, setNextDaySeeds] = useState([]);

  // Modal states
  const [isSessionModalOpen, setSessionModalOpen] = useState(false); // Modal state
  //Entities Modal
  const entities = [
    ...Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      name: `CMH${i + 1}`,
    })),
    { id: 30, name: "CMH3-Offer" },
    { id: 60, name: "CMH6-Offer" },
    { id: 120, name: "CMH12-Offer" },

    { id: 150, name: "CMH15-Offer" },
    { id: 16, name: "CMH16" },
  ];
  const [isNextDayModalOpen, setIsNextDayModalOpen] = useState(false); // Modal state
  const [isTimeDropsModalOpen, setIsTimeDropsModalOpen] = useState(false); // Modal state
  // Modal Settings State
  const [modalSettings, setModalSettings] = useState({
    isOpen: false,
    useFixedQuantity: false,
    fixedQuantity: "",
    shuffle: false,
    fastKill: true,
    loginNextDay: true,
    timeType: 1,
    scheduleTasks : true
  });
  useEffect(() => {
    console.log();
    const fetchData = async () => {
      try {
        console.log("selectedEntity", selectedEntity);

        const data = await fetchEntityId(selectedEntity);

        const timedropsArray = data.timedrops ? data.timedrops.split(",") : [];
        setTimeDrops(timedropsArray);

        // Count only active sessions
        setActiveSessions(
          data.sessions
            ? data.sessions.filter((session) => session.isActive)
            : []
        );

        // Store session data in the state
        setSessionData(data.sessions || []);
      } catch (error) {
        toast.error("Failed to fetch data from API!");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedEntity, isSessionModalOpen]);

  // Handle opening the modal when clicking "Session Numbers"
  const handleSessionClick = () => {
    if (sessionData.length === 0) {
      toast.error("No session data available!");
      return;
    }
    setSessionModalOpen(true);
  };
  // Handle opening the modal when clicking "Time Drops"
  const handleTimeDropsClick = () => {
    if (timeDrops.length === 0) {
      toast.error("No TimeDrops data available!");
      return;
    }
    setIsTimeDropsModalOpen(true);
  };
  // Handle opening the modal when clicking "Next Day Seeds"
  const HandleNextDaySeeds = () => {
    setIsNextDayModalOpen(true);
  };

  const handleReset = () => {
    setProcessedContents([]);
    setTagsToSplit("");
  };

  const handleSplitClick = () => {
    setModalSettings((prev) => ({ ...prev, isOpen: true }));
  };

  // Here the split log
  const handleSplit = async () => {
    // if no tag area is empty
    if (tagsToSplit === "") {
      toast.error("No tags");
      return;
    }

    //Taking the first line of the input
    const firstLine = tagsToSplit.split("\n")[0];
    // then passung the first line to return the number of sessions
    const sessionsNumber = calcSessions(firstLine);
    setSessionCount(sessionsNumber);

    if (sessionsNumber === 0) {
      toast.error("No sessions");
      return;
    } else if (sessionsNumber != activeSessions.length) {
      toast.error("Session count mismatch");
      return;
    }
    const lines = tagsToSplit
      .split("\n")
      .map((line) => parseNumberTagPairs(line));

    const collectedData = await collectData(lines, sessionsNumber);

    setSeedsBySessions(collectedData);
    if (collectedData === "wrongIinput") {
      return;
    }

    const splitDataByDrops = splitSessionsByDrops(
      collectedData,
      timeDrops.length,
      modalSettings.useFixedQuantity,
      modalSettings.fixedQuantity
    );
    // generateExcel(splitDataByDrops)
    downloadZip(
      splitDataByDrops,
      delimiter,
      selectedEntity,
      timeDrops,
      activeSessions,
      modalSettings.fastKill,
      modalSettings.loginNextDay,
      nextDaySeeds,
      modalSettings.timeType,modalSettings.scheduleTasks

      
    );

    setSeedsBySessionPerDrop(splitDataByDrops);
    toast.success("Split successfully");
    setProcessedContents(collectedData);
  };

  return (
    <div className="flex flex-col items-center p-10 space-y-8 bg-gray-100 ">
      <ToastContainer theme="colored" />

      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center bg-blue-500 p-4 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-white drop-shadow-md">
          Spliter
        </h2>
        <div className="flex gap-4">
          <button
            onClick={HandleNextDaySeeds}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105 active:scale-95"
          >
            <Settings className="w-5 h-5" /> Next Day Seeds
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md transition-transform transform hover:scale-105 active:scale-95"
          >
            <RotateCcw className="w-5 h-5" /> Reset
          </button>
        </div>
      </div>
      {/* Entity Selection Dropdown */}
      <div className="flex flex-col items-center">
        <label htmlFor="entitySelect" className="text-gray-700 font-medium">
          Select Entity
        </label>
        <select
          id="entitySelect"
          value={selectedEntity}
          onChange={(e) => setSelectedEntity(e.target.value)}
          className="w-40 py-2 px-3 rounded border border-gray-300 shadow-md focus:ring focus:border-blue-500"
        >
          {entities.map((entity) => (
            <option key={entity.id} value={entity.id}>
              {entity.name}
            </option>
          ))}
        </select>
      </div>

      {/* Input Fields */}
      <div className="flex flex-wrap justify-center gap-6 w-full max-w-3xl">
        <div
          className="flex flex-col items-center relative"
          onClick={handleTimeDropsClick} // Open modal on click
        >
          <label htmlFor="dropNumbers" className="text-gray-700 font-medium">
            Drop Numbers
          </label>
          <div className="relative">
            <input
              id="dropNumbers"
              type="number"
              value={timeDrops.length}
              readOnly
              className="w-32 py-2 px-3 rounded border border-gray-300 shadow-md focus:ring focus:border-blue-500 pr-10"
            />
            <Eye
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              size={20}
            />
          </div>
        </div>
        <div
          className="flex flex-col items-center relative"
          onClick={handleSessionClick} // Open modal on click
        >
          <label htmlFor="sessionNumbers" className="text-gray-700 font-medium">
            Session In Repo
          </label>
          <div className="relative">
            {" "}
            <input
              id="sessionNumbers"
              type="number"
              value={activeSessions.length}
              readOnly
              className="w-32 py-2 px-3 rounded border border-gray-300 shadow-md focus:ring focus:border-blue-500 pr-10"
            />
            <Eye
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              size={20}
            />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <label htmlFor="delimiter" className="text-gray-700 font-medium">
            Delimiter
          </label>
          <select
            id="delimiter"
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            className="w-32 py-2 px-3 rounded border border-gray-300 shadow-md focus:ring focus:border-blue-500"
          >
            <option value="\n">New Line (\n)</option>
            <option value=";">Semicolon (;)</option>
          </select>
        </div>
      </div>

      {/* Tags Input */}
      <TagsInput
        tagsToRemove={tagsToSplit}
        setTagsToRemove={setTagsToSplit}
        setProcessedContents={setProcessedContents}
        content="Tags to split"
      />

      {/* Buttons */}
      <div className="flex gap-6 mt-6">
        <button
          onClick={handleSplitClick}
          className="px-8 py-3 text-lg font-semibold bg-purple-600 text-white rounded-lg shadow-md transition-all hover:bg-purple-700 hover:shadow-lg active:scale-95"
        >
          Split
        </button>
      </div>

      {/* Spliter Settings Modal */}
      <SpliterSettingsModal
        modalSettings={modalSettings}
        setModalSettings={setModalSettings}
        onApply={handleSplit}
      />

      {/* Session Modal */}
      <SessionModal
        isOpen={isSessionModalOpen}
        setSessionModalOpen={setSessionModalOpen}
        sessionData={sessionData}
      />
      <TimeDropsModal
        isOpen={isTimeDropsModalOpen}
        onClose={() => setIsTimeDropsModalOpen(false)}
        timeDrops={timeDrops}
        setTimeDrops={setTimeDrops}
        entityName={selectedEntity}
      />

      <NextDayModal
        isOpen={isNextDayModalOpen}
        onClose={() => setIsNextDayModalOpen(false)}
        nextDaySeeds={nextDaySeeds}
        setNextDaySeeds={setNextDaySeeds}
      />
    </div>
  );
}
