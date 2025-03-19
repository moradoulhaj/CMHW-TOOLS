import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotateCcw, Settings } from "lucide-react";
import TagsInput from "./smalls/TagsInput";
import SpliterModal from "./smalls/SpliterModal";
import {
  calcSessions,
  collectData,
  downloadZip,
  generateExcel,
  parseNumberTagPairs,
  splitSessionsByDrops,
} from "../scripts/spliterScripts";

export default function SpliterBeta() {
  const [processedContents, setProcessedContents] = useState([]);
  const [tagsToSplit, setTagsToSplit] = useState("");
  const [sessionCount, setSessionCount] = useState("");
  const [seedsBySessions, setSeedsBySessions] = useState([]);
  const [dropNumbers, setDropNumbers] = useState(1);
  const [seedsBySessionPerDrop, setSeedsBySessionPerDrop] = useState([]);
  const [delimiter, setDelimiter] = useState("\n");
  
  // Modal Settings State
  const [modalSettings, setModalSettings] = useState({
    isOpen: false,
    useFixedQuantity: false,
    fixedQuantity: "",
    shuffle: false,
    fastKill: false,
    loginNextDay: false,
  });

  const handleReset = () => {
    setProcessedContents([]);
    setTagsToSplit("");
    setSessionCount("");
    setSeedsBySessions([]);
    setSeedsBySessionPerDrop([]);
    setDropNumbers(1);
  };

  const handleSplit = async () => {
    if (!tagsToSplit) {
      toast.error("No tags provided!");
      return;
    }

    const firstLine = tagsToSplit.split("\n")[0];
    const sessionsNumber = calcSessions(firstLine);
    setSessionCount(sessionsNumber);

    if (!sessionsNumber) {
      toast.error("No valid sessions detected!");
      return;
    }

    const lines = tagsToSplit.split("\n").map(parseNumberTagPairs);
    const collectedData = await collectData(lines, sessionsNumber);

    if (collectedData === "wrongInput") return;

    setSeedsBySessions(collectedData);
    setSeedsBySessionPerDrop(splitSessionsByDrops(collectedData, dropNumbers));
    setProcessedContents(collectedData);
    toast.success("Splitting successful!");
  };

  return (
    <div className="flex flex-col items-center p-10 space-y-8 bg-gray-100 min-h-screen">
      <ToastContainer theme="colored" />

      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center bg-blue-500 p-4 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-white drop-shadow-md">Spliter</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setModalSettings((prev) => ({ ...prev, isOpen: true }))}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105 active:scale-95"
          >
            <Settings className="w-5 h-5" /> Settings
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md transition-transform transform hover:scale-105 active:scale-95"
          >
            <RotateCcw className="w-5 h-5" /> Reset
          </button>
        </div>
      </div>

      {/* Input Fields */}
      <div className="flex flex-wrap justify-center gap-6 w-full max-w-3xl">
        <div className="flex flex-col items-center">
          <label htmlFor="dropNumbers" className="text-gray-700 font-medium">Drop Numbers</label>
          <input
            id="dropNumbers"
            type="number"
            value={dropNumbers}
            onChange={(e) => setDropNumbers(e.target.value)}
            className="w-32 py-2 px-3 rounded border border-gray-300 shadow-md focus:ring focus:border-blue-500"
          />
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
        {!processedContents.length ? (
          <button
            onClick={handleSplit}
            className="px-8 py-3 text-lg font-semibold bg-purple-600 text-white rounded-lg shadow-md transition-all hover:bg-purple-700 hover:shadow-lg active:scale-95"
          >
            Split
          </button>
        ) : (
          <>
            <button
              onClick={() => generateExcel(seedsBySessionPerDrop)}
              className="px-8 py-3 text-lg font-semibold bg-green-600 text-white rounded-lg shadow-md transition-all hover:bg-green-700 hover:shadow-lg active:scale-95"
            >
              Download Excel
            </button>
            <button
              onClick={() => downloadZip(seedsBySessionPerDrop, delimiter)}
              className="px-8 py-3 text-lg font-semibold bg-red-600 text-white rounded-lg shadow-md transition-all hover:bg-red-700 hover:shadow-lg active:scale-95"
            >
              Download Zip
            </button>
          </>
        )}
      </div>

      {/* Spliter Modal */}
      <SpliterModal modalSettings={modalSettings} setModalSettings={setModalSettings} />
    </div>
  );
}
