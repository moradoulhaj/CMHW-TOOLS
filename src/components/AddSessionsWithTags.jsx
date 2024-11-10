import React, { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JSZip, { file } from "jszip";

export default function AddSessionWithTags() {
  const [oldFiles, setOldFiles] = useState([]);
  const [processedFiles, setprocessedFiles] = useState([]); // State to hold processed content
  const [tagsToAdd, setTagsToAdd] = useState("");
  const [startingDropNbr, setStartingDropNbr] = useState(1);

  const oldFileInputRef = useRef(null);

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const handleOldFileUpload = (event) => {
    setOldFiles(Array.from(event.target.files));
  };

  const processFiles = async () => {
    const tags = tagsToAdd
      .split("\n")
      .map((tag) => tag.trim())
      .filter((tag) => tag); // Split by new line and trim

    let lastFile = oldFiles.at(-1);
    const match = lastFile.name.match(/file_(\d+)/);
    const lastFileIndex = match ? parseInt(match[1]) : -1;
    let dropsToAdd = lastFileIndex - startingDropNbr + 1;

    // Split tags across each drop for each file
    const tagsPerDrop = Math.floor(tags.length / dropsToAdd);
    const remainder = tags.length % dropsToAdd;

    // Array to store tags for each drop
    const tagsByDrop = [];
    let startIndex = 0;
    for (let i = 0; i < dropsToAdd; i++) {
      const endIndex =
        startIndex + tagsPerDrop + (i === dropsToAdd - 1 ? remainder : 0); // Add remainder to the last drop
      const dropTags = tags.slice(startIndex, endIndex);
      tagsByDrop.push(dropTags);
      startIndex = endIndex;
    }
    const modifiedFiles = await Promise.all(
      oldFiles.map(async (file, index) => {
        const match = file.name.match(/file_(\d+)/);
        const fileIndex = match ? parseInt(match[1]) : -1;
        if (fileIndex < startingDropNbr) {
          const content = await readFileContent(file);
          return { name: file.name, content: content };
        } else {
          const content = await readFileContent(file);
          const indexToAdd = fileIndex - startingDropNbr;
          const tagsToAppend = tagsByDrop[indexToAdd] || []; // Get tags for the current drop
          const modifiedContent = `${content}\n${tagsToAppend.join("\n")}`; // Append tags to content
          return { name: file.name, content: modifiedContent };
        }
      })
    );
    setprocessedFiles(modifiedFiles);
    toast.success("Tags added successfully!");
  };
  const downloadProcessedContent = async () => {
    if (processedFiles.length === 0) {
      toast.error(
        "No processed files to download. Please process files first."
      );
      return;
    }

    const zip = new JSZip();
    processedFiles.forEach(({ name, content }) => {
      zip.file(name, content);
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "processed_files.zip";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center p-8 space-y-6 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 min-h-screen">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-blue-700 drop-shadow-md"> Add Session Using Tags
      </h2>

      <div className="flex flex-col md:flex-row gap-10">
        <div>
          <input
            type="file"
            accept=".txt"
            multiple
            ref={oldFileInputRef}
            onChange={handleOldFileUpload}
            style={{ display: "none" }}
          />
          <button
            className="bg-blue-500 text-white px-5 py-3 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-200"
            onClick={() => oldFileInputRef.current.click()}
          >
            Upload Files
          </button>
        </div>
        <div className="gap-3">
          <label className="text-lg font-medium text-gray-800 mb-1">
            Drops Number:
          </label>
          &nbsp;
          <input
            type="number"
            value={startingDropNbr}
            onChange={(e) => setStartingDropNbr(e.target.value)}
            className="border border-gray-300 rounded-md px-5 py-3 text-center text-gray-700 shadow-sm focus:outline-none focus:border-blue-400"
            min="1"
          />
        </div>
      </div>

      <div className="flex flex-col items-center mt-4">
        <div>
          <label className="text-lg font-medium text-gray-800 mb-1">
            Tags to Remove (enter each tag on a new line):
          </label>
          <textarea
            value={tagsToAdd}
            onChange={(e) => setTagsToAdd(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 shadow-sm focus:outline-none focus:border-blue-400 w-full h-32"
            placeholder="Enter tags to remove, one per line"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-8 w-full md:justify-center mt-6">
          <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Uploaded Files
            </h3>
            <textarea
              className="w-full h-32 border border-gray-300 rounded-md p-2"
              value={oldFiles.map((file) => file.name).join("\n")}
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          className="bg-yellow-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-yellow-600 transition-colors duration-200"
          onClick={processFiles}
        >
          Remove Rdp
        </button>
        <button
          className="bg-purple-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-purple-600 transition-colors duration-200"
          onClick={downloadProcessedContent}
        >
          Download Files
        </button>
      </div>
    </div>
  );
}
