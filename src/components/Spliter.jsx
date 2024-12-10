import React, { useState , lazy } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotateCcw } from "lucide-react";
import TagsInput from "./smalls/TagsInput";
import {
  calcSessions,
  collectData,
  downloadZip,
  generateExcel,
  parseNumberTagPairs,
  splitSessionsByDrops,
} from "../scripts/spliterScripts";

export default function Spliter() {
  const [processedContents, setProcessedContents] = useState([]);
  const [tagsToSplit, setTagsToSplit] = useState("");
  const [sessionCount, setSessionCount] = useState("");
  const [seedsBySessions, setSeedsBySessions] = useState([]);
  const [dropNumbers, setDropNumbers] = useState(1);
  const [seedsBySessionPerDrop, setSeedsBySessionPerDrop] = useState([]);
  const [delimiter, setDelimiter] = useState(";");

  const handleDropNumberChange = (e) => {
    setDropNumbers(e.target.value);
    setProcessedContents([]);
  };

  const handleReset = () => {
    setProcessedContents([]);
    setTagsToSplit("");
    setSessionCount("");
    setSeedsBySessions([]);
    setSeedsBySessionPerDrop([]);
    setDropNumbers(1);
  };

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
    }
    
    const lines = tagsToSplit
      .split("\n")
      .map((line) => parseNumberTagPairs(line));

    const collectedData = await collectData(lines, sessionsNumber);
    setSeedsBySessions(collectedData);
    if (collectedData === "wrongIinput") {
      return;
    }
    const splitDataByDrops = splitSessionsByDrops(collectedData, dropNumbers);
    setSeedsBySessionPerDrop(splitDataByDrops);

    toast.success("Split successfully");
    setProcessedContents(collectedData);
  };

  return (
    <div className="flex flex-col items-center p-10 space-y-8 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 min-h-screen">
      <ToastContainer theme="colored" />
      <h2 className="text-4xl font-extrabold text-blue-800 drop-shadow-lg">
        Spliter
      </h2>

      <div className="flex flex-col md:flex-row gap-8 items-center">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 border border-blue-600 transition-transform transition-colors duration-200 font-medium"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </button>

        <div>
          <label htmlFor="dropNumbers" className="block text-gray-700">
            Drop Numbers
          </label>
          <input
            id="dropNumbers"
            type="number"
            value={dropNumbers}
            onChange={handleDropNumberChange}
            placeholder="Enter number"
            className="w-24 py-2 px-3 rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="delimiter" className="block text-gray-700">
            Delimiter
          </label>
          <select
            id="delimiter"
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            className="w-24 py-2 px-3 rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
          >
            <option value=";">Semicolon (;)</option>
            {/* <option value=",">Comma (,)</option> */}
            <option value="\n">Newline (\\n)</option>
            {/* <option value="|">Pipe (|)</option> */}
          </select>
        </div>
      </div>

      <div className="flex flex-col items-center mt-4 w-full max-w-lg">
        <TagsInput
          tagsToRemove={tagsToSplit}
          setTagsToRemove={setTagsToSplit}
          setProcessedContents={setProcessedContents}
          content="Tags to split"
        />
      </div>

      <div className="flex gap-6 mt-6">
        <button
          className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
            processedContents.length ? "hidden" : ""
          }`}
          onClick={handleSplit}
        >
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
        <button
          className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-400 to-red-400 text-white rounded-lg shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
            !processedContents.length ? "hidden" : ""
          }`}
          onClick={() => downloadZip(seedsBySessionPerDrop, delimiter)}
        >
          Download Zipped Files
        </button>
      </div>
    </div>
  );
}
