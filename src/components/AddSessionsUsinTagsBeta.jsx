import React, { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  downloadProcessedContent,
  readFileContent,
  separateNumbersAndTags,
  updateAndDownloadExcel,
} from "../scripts/scripts";
import FileList from "./smalls/FilesList";
import TagsInput from "./smalls/TagsInput";
import Modal from "./smalls/Modal";
import ModalBeta from "./smalls/ModalBeta";
import {
  collectData,
  parseNumberTagPairs,
  splitSessionsByDrops,
} from "../scripts/spliterScripts";

export default function AddSessionUsingTagsBeta() {
  const [oldFiles, setOldFiles] = useState([]);
  const [processedFiles, setprocessedFiles] = useState([]);
  const [tagsToAdd, setTagsToAdd] = useState("");
  const [startingDropNbr, setStartingDropNbr] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [profilesByDrop, setProfilesByDrop] = useState([]);
  const [excelBlob, setExcelBlob] = useState(null);
  const oldFileInputRef = useRef(null);

  const [selectedEntity, setSelectedEntity] = useState(1);

  const entities = [
    ...Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      name: `CMH${i + 1}`,
    })),
    { id: 30, name: "CMH3-Offer" },
    { id: 60, name: "CMH6-Offer" },
    { id: 150, name: "CMH15-Offer" },
    { id: 16, name: "CMH16" },
  ];

  const HandleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleOldFileUpload = (event) => {
    setOldFiles(Array.from(event.target.files));
  };
  const processFiles = async (
    selectedSession,
    newTimedrops,
    startingTimeDrops
  ) => {
    if (!tagsToAdd.trim() || oldFiles.length === 0) {
      toast.error("No tags or files provided.");
      return;
    }

    const lines = tagsToAdd
      .split("\n")
      .map((line) => parseNumberTagPairs(line));

    const collectedData = await collectData(lines, 1);
    if (collectedData === "wrongIinput") {
      toast.error("Invalid input format.");
      return;
    }

    const splitDataByDrops = splitSessionsByDrops(
      collectedData,
      newTimedrops.length,
      false,
      0
    );
    let indexToAdd = 0;
    const modifiedFiles = await Promise.all(
      oldFiles.map(async (file) => {
        const match = file.name.match(/file_(\d+)/);
        const fileIndex = match ? parseInt(match[1]) : -1;

        const content = await readFileContent(file);
        if (fileIndex < startingTimeDrops) {
          console.log(file.name, content);

          return { name: file.name, content };
        }

        const tagsToAppend = (splitDataByDrops[0][indexToAdd] || []).map(
          ([_, tag]) => tag
        ); // Extract only tags
        const modifiedContent = tagsToAppend.length
          ? `${content}\n${tagsToAppend.join("\n")}`
          : content;

        indexToAdd++;
        console.log(file.name, modifiedContent);

        return { name: file.name, content: modifiedContent };
      })
    );
    generateSchedule(
      sessionDrops,
      newTimedrops,
      selectedSession.username,
      selectedSession.config,
      selectedSession.script,
      true,
      false,
      "loginNextDay ? collectedData[sessionIndex] : []"
    )
      .then((excelBlob) => {
        zip.file(`Excels/${session.name}.xlsx`, excelBlob);
      })
      .catch((error) =>
        console.error(
          "Error generating Excel for session:",
          session.name,
          error
        )
      );
    
    setprocessedFiles(modifiedFiles); // ✅ Update state
    toast.success("Files processed successfully!");
  };

  return (
    <div className="flex flex-col items-center p-8 space-y-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      <h2 className="text-4xl font-bold text-blue-800 shadow-sm tracking-wide">
        Add Session Using Tags
      </h2>

      <div className="w-full max-w-md">
        <label
          htmlFor="entitySelect"
          className="block text-gray-700 font-semibold mb-1"
        >
          Select Entity
        </label>
        <select
          id="entitySelect"
          value={selectedEntity}
          onChange={(e) => setSelectedEntity(e.target.value)}
          className="w-full py-2 px-3 rounded border border-gray-300 shadow-md focus:ring focus:border-blue-500"
        >
          {entities.map((entity) => (
            <option key={entity.id} value={entity.id}>
              {entity.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="flex flex-col items-center">
          <input
            type="file"
            accept=".txt"
            multiple
            ref={oldFileInputRef}
            onChange={handleOldFileUpload}
            className="hidden"
          />
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition font-semibold"
            onClick={() => oldFileInputRef.current.click()}
          >
            Upload Files
          </button>
        </div>
      </div>

      <div className="w-full max-w-lg">
        <TagsInput
          tagsToRemove={tagsToAdd}
          setTagsToRemove={setTagsToAdd}
          setProcessedContents={setprocessedFiles}
        />
      </div>

      <div
        className={`w-full max-w-lg mt-6 ${
          isDragging ? "border-2 border-blue-500 rounded-lg" : ""
        }`}
      >
        <FileList
          files={oldFiles}
          titre={"Uploaded Files"}
          setOldFiles={setOldFiles}
          setProcessedContents={setprocessedFiles}
        />
      </div>

      <div className="flex gap-6 mt-8">
        <button
          className="px-6 py-3 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition font-medium"
          onClick={HandleOpenSettings}
        >
          Add Session
        </button>
        <button
          className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition font-medium"
          onClick={() => downloadProcessedContent(processedFiles, excelBlob)}
        >
          Download Files
        </button>
      </div>

      <ModalBeta
        isModalOpen={isSettingsOpen}
        setIsModalOpen={setIsSettingsOpen}
        // Suggested code may be subject to a license. Learn more: ~LicenseLog:3731383436.
        onSave={processFiles}
        selectedEntity={selectedEntity}
      />
    </div>
  );
}
