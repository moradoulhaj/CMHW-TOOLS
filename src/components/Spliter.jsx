import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {

  RotateCcw,
  SeparatorVertical,

} from "lucide-react";
import TagsInput from "./TagsInput";


export default function Spliter() {
  const [processedContents, setProcessedContents] = useState([]);
  const [tagsToSplit, setTagsToSplit] = useState("");
 const [sessionCount,setSessionCount] = useState("")
  const HandleReset = () => {
    setOldFiles([]);
    setProcessedContents([]);
    setTagsToRemove("");
    setDelimiter("AUTO");
    setIsModalOpen(false);
    setSeparator("");
  };
  const handleSplit = () => {
    const lines = tagsToSplit.split("\n");
    if (lines.length === 0) {
      toast.error("No content to split!");
      return;
    }

    // Split the first line by tab to detect the number of sessions
    const firstLine = lines[0];
    const sessions = firstLine.split("\t");
    const count = sessions.length / 2; // Each session has a number and a tag
    setSessionCount(count); // Save session count for display


    // setProcessedContents(drops);
  };
  return (
    <div className="flex flex-col items-center p-10 space-y-8 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 min-h-screen">
      <ToastContainer theme="colored" />
      <h2 className="text-4xl font-extrabold text-blue-800 drop-shadow-lg">
        Remove Tags from Uploaded Text Files
      </h2>

      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div>
       
        </div>
        <div>
          <button
            onClick={HandleReset}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 border border-blue-600 transition-transform transition-colors duration-200 font-medium"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center mt-4"></div>

      <div className="flex flex-col items-center mt-4 w-full max-w-lg">
        <TagsInput
          tagsToRemove={tagsToSplit}
          setTagsToRemove={setTagsToSplit}
          setProcessedContents={setProcessedContents}
        />
      </div>

      <div
        className={
          "flex flex-col md:flex-row gap-10 w-full max-w-lg md:justify-center mt-6"
        }
      ></div>

      <div className="flex gap-6 mt-6">
        <button
          className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium ${
            processedContents.length ? "hidden" : ""
          }`}
          onClick={()=>handleSplit()}
        >
          <SeparatorVertical className="w-5 h-5" />
          Split
        </button>
        <button
          className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
            !processedContents.length ? "hidden" : ""
          }`}
          disabled={!processedContents.length}
        >
          Download Files
        </button>
      </div>
    </div>
  );
}
