import React, { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JSZip from "jszip";

export default function RemoveSessions() {
  const [oldFiles, setOldFiles] = useState([]);
  const [processedContents, setProcessedContents] = useState([]); // State to hold processed content
  const [tagsToRemove, setTagsToRemove] = useState("");

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

  const removeTags = (content, tags) => {
    tags.forEach((tag) => {
        // Remove all occurrences of each tag from content
        content = content.split(tag).join("");
    });

    // Remove extra whitespace and empty lines
    const cleanedContent = content
        .split('\n')
        .filter(line => line.trim() !== '') // Remove empty lines
        .join('\n') // Join lines back together
        .trim(); // Remove trailing newline characters

    return cleanedContent;
};





  const processFiles = async () => {
    if (!tagsToRemove) {
      toast.error("Please specify tags to remove.");
      return;
    }

    const tags = tagsToRemove
      .split("\n")
      .map((tag) => tag.trim())
      .filter((tag) => tag); // Split by new line and trim

    const fileProcesses = oldFiles.map((file) =>
      readFileContent(file).then((content) => ({
        name: file.name,
        content: removeTags(content, tags), // Remove tags from each file's content
      }))
    );

    Promise.all(fileProcesses)
      .then((results) => {
        setProcessedContents(results); // Store processed contents in state
        toast.success("Tags removed successfully!");
      })
      .catch((error) => console.error("Error processing files:", error));
  };

  const downloadProcessedContent = async () => {
    const zip = new JSZip();

    processedContents.forEach(({ name, content }) => {
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
      <h2 className="text-3xl font-bold text-blue-700 drop-shadow-md">
        Remove Tags from Uploaded Text Files
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
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
      </div>

      <div className="flex flex-col items-center mt-4">
        <div>
          <label className="text-lg font-medium text-gray-800 mb-1">
            Tags to Remove (enter each tag on a new line):
          </label>
          <textarea
            value={tagsToRemove}
            onChange={(e) => setTagsToRemove(e.target.value)}
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
          disabled={!processedContents.length} // Disable if no processed contents
        >
          Download Files
        </button>
      </div>
    </div>
  );
}
