import React, { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JSZip from "jszip";


export default function App() {
  const [oldFiles, setOldFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [mergedContents, setMergedContents] = useState([]);
  const [step, setStep] = useState(1);

  const oldFileInputRef = useRef(null);
  const newFileInputRef = useRef(null);

  const handleOldFileUpload = (event) => {
    const uploadedOldFiles = Array.from(event.target.files);
    setOldFiles(uploadedOldFiles);
  };

  const handleNewFileUpload = (event) => {
    const uploadedNewFiles = Array.from(event.target.files);
    setNewFiles(uploadedNewFiles);
  };

  const mergeFiles = () => {
    const readFileContent = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
      });
    };

    // Check if every new file has a corresponding old file
    for (const newFile of newFiles) {
      const match = newFile.name.match(/file_(\d+)/);
      const newIndex = match ? parseInt(match[1]) : -1;
      const oldIndex = newIndex + step; // Get the corresponding old file index

      const correspondingOldFile = oldFiles.find((file) => {
        const oldMatch = file.name.match(/file_(\d+)/);
        return oldMatch && parseInt(oldMatch[1]) === oldIndex;
      });

      if (!correspondingOldFile) {
        toast.error(`No corresponding old file found for ${newFile.name}`);
        return; // Stop the merging process if no corresponding old file
      }
    }

    // Proceed to merge files if all checks pass
    const fileMerges = oldFiles.map((oldFile) => {
      const match = oldFile.name.match(/file_(\d+)/);
      const oldIndex = match ? parseInt(match[1]) : -1;
      const newIndex = oldIndex - step;
      const newFile = newFiles.find((file) => {
        const newMatch = file.name.match(/file_(\d+)/);

        return newMatch && parseInt(newMatch[1]) === newIndex;
      });
     
   

      // Merge contents of corresponding files
      return readFileContent(oldFile).then((oldContent) => {
        if (newFile) {
          return readFileContent(newFile).then((newContent) => ({
            name: oldFile.name,
            content: oldContent + ";" + newContent,
          }));
        }
        return {
          name: oldFile.name,
          content: oldContent,
        };
      });
    });

    Promise.all(fileMerges)
      .then((results) => {
        setMergedContents(results);
        setOldFiles(results); // Update oldFiles with the merged contents
        toast.success("Files merged successfully!");
      })
      .catch((error) => console.error("Error reading files:", error));
  };

  const downloadMergedContent = async () => {
    const zip = new JSZip(); // Create a new ZIP archive
  
    // Add each merged file to the ZIP
    mergedContents.forEach(({ name, content }) => {
      zip.file(name, content);
    });
  
    // Generate the ZIP as a blob
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
  
    // Create an anchor element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "merged_files.zip"; // Name for the ZIP file
    a.click();
  
    URL.revokeObjectURL(url); // Clean up the object URL
  };
  

  return (
    <div className="flex flex-col items-center p-8 space-y-6 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 min-h-screen">
    <ToastContainer />
    <h2 className="text-3xl font-bold text-blue-700 drop-shadow-md">
      Merge Old and New Text Files
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
          Upload Old Files
        </button>
      </div>

      <div>
        <input
          type="file"
          accept=".txt"
          multiple
          ref={newFileInputRef}
          onChange={handleNewFileUpload}
          style={{ display: "none" }}
        />
        <button
          className="bg-green-500 text-white px-5 py-3 rounded-md shadow-md hover:bg-green-600 transition-colors duration-200"
          onClick={() => newFileInputRef.current.click()}
        >
          Upload New Files
        </button>
      </div>
    </div>

    <div className="flex flex-col items-center">
      <label className="text-lg font-medium text-gray-800 mb-1">
        Step Value (e.g., 3 to merge new file_1 with old file_4):
      </label>
      <input
        type="number"
        value={step}
        onChange={(e) => setStep(Number(e.target.value))}
        className="border border-gray-300 rounded-md px-3 py-2 text-center text-gray-700 shadow-sm focus:outline-none focus:border-blue-400"
        min="1"
      />
    </div>

    <div className="flex flex-col md:flex-row gap-8 w-full md:justify-center">
      <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-md">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
          Uploaded Old Files
        </h3>
        <ul className="list-disc list-inside space-y-2">
          {oldFiles.map((file, index) => (
            <li key={index} className="text-gray-600">
              {file.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-md">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
          Uploaded New Files
        </h3>
        <ul className="list-disc list-inside space-y-2">
          {newFiles.map((file, index) => (
            <li key={index} className="text-gray-600">
              {file.name}
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="flex gap-4 mt-4">
      <button
        className="bg-yellow-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-yellow-600 transition-colors duration-200"
        onClick={mergeFiles}
      >
        Merge Files
      </button>
      <button
        className="bg-purple-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-purple-600 transition-colors duration-200"
        onClick={downloadMergedContent}
        disabled={!mergedContents.length}
      >
        Download Merged Files
      </button>
    </div>
  </div>
  );
}
