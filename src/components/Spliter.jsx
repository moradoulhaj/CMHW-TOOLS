import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotateCcw, SeparatorVertical } from "lucide-react";
import TagsInput from "./smalls/TagsInput";
import {
  calcSessions,
  collectData,
  generateExcel,
  parseNumberTagPairs,
  splitSessionsByDrops,
} from "../scripts/spliterScripts";

export default function Spliter() {
  const [processedContents, setProcessedContents] = useState([]);
  const [tagsToSplit, setTagsToSplit] = useState("");
  const [sessionCount, setSessionCount] = useState("");
  // Suggested code may be subject to a license. Learn more: ~LicenseLog:3081780946.
  const [seedsBySessions, setSeedsBySessions] = useState([]);
  const [dropNumbers, setDropNumbers] = useState(1);
  const [seedsBySessionPerDrop, setSeedsBySessionPerDrop] = useState([]);
  const handleDropNumberChange = (e) => {
    setDropNumbers(e.target.value);
    setProcessedContents([]);
  };
  const HandleReset = () => {
    setProcessedContents([]);
    setTagsToSplit("");
    setSessionCount("");
    setSeedsBySessions([]);
    setSeedsBySessionPerDrop([]);
    setDropNumbers(1);
  };

  const handleSplit = async () => {
    const sessionsNumber = calcSessions(tagsToSplit);
    setSessionCount(sessionsNumber);

    if (sessionsNumber === 0) {
      toast.alert("No sessions");
      return; // Exit early if no sessions
    }

    // Split input into lines and parse each line into pairs
    const lines = tagsToSplit
      .split("\n")
      .map((line) => parseNumberTagPairs(line));

    // Collect data by columns (sessions)
    const collectedData = await collectData(lines, sessionsNumber);
    setSeedsBySessions(collectedData);

    // Count seeds for each session
    const seedsCountBySession = collectedData.map((session) => session.length);

    // Split pairs of each session based on the number of drops
    const splitDataByDrops = splitSessionsByDrops(collectedData, dropNumbers);
    setSeedsBySessionPerDrop(splitDataByDrops);
    toast.success("Splited successfuly");
    // Optionally, store this count if needed for further processing
    setProcessedContents(collectedData);
  };
  useEffect(() => {
    console.log(seedsBySessionPerDrop);
  }, [seedsBySessionPerDrop]);
  return (
    <div className="flex flex-col items-center p-10 space-y-8 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 min-h-screen">
      <ToastContainer theme="colored" />
      <h2 className="text-4xl font-extrabold text-blue-800 drop-shadow-lg">
        Spliter
      </h2>

      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div>
          <button
            onClick={HandleReset}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 border border-blue-600 transition-transform transition-colors duration-200 font-medium"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>
        <div>
          <label htmlFor="dropNumbers">Drop Numbers</label>
          <input
            id="dropNumbers"
            type="number"
            value={dropNumbers}
            onChange={(e) => handleDropNumberChange(e)}
            placeholder="Enter number"
            className="w-24 py-2 px-3 rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-col items-center mt-4"></div>

      <div className="flex flex-col items-center mt-4 w-full max-w-lg">
        <TagsInput
          tagsToRemove={tagsToSplit}
          setTagsToRemove={setTagsToSplit}
          setProcessedContents={setProcessedContents}
          content="Tags to split"
        />
      </div>

      <div
        className={
          "flex flex-col md:flex-row gap-10 w-full max-w-lg md:justify-center mt-6"
        }
      ></div>

      <div className="flex gap-6 mt-6">
        <button
          className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed  ${
            processedContents.length ? "hidden" : ""
          }`}
          onClick={() => handleSplit()}
        >
          <SeparatorVertical className="w-5 h-5" />
          Split
        </button>
        <button
          className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
            !processedContents.length ? "hidden" : ""
          }`}
          onClick={() => generateExcel(seedsBySessionPerDrop)}
        >
          Download Excel
        </button>
      </div>
    </div>
  );
}
