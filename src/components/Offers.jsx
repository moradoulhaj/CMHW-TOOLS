import React, { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmModal from "./smalls/ConfirmModal";
import FileList from "./smalls/FilesList";
import { Eye, RotateCcw, Upload } from "lucide-react";
import DelimiterSelector from "./smalls/DelimiterSelector";
import {
  detectSeparator,
  readFileContent,
} from "../scripts/scripts";
import FileViewer from "./smalls/FileViewer";

export default function Offers() {
  const [oldFiles, setOldFiles] = useState([]);
  const [processedContents, setProcessedContents] = useState([]);
  const [delimiter, setDelimiter] = useState("AUTO");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [separator, setSeparator] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // For single file display
  const oldFileInputRef = useRef(null);

  const HandleReset = () => {
    setOldFiles([]);
    setProcessedContents([]);
    setDelimiter("AUTO");
    setIsModalOpen(false);
    setSeparator("");
    setCurrentPage(0);
  };

  const handleDisplayTags = async () => {
    if (!oldFiles.length) {
      toast.error("Please upload files.");
      return;
    }
    if (delimiter === "AUTO") {
      setIsModalOpen(true);
      setSeparator(await detectSeparator(oldFiles));
      return;
    } else {
      processFiles(delimiter);
    }
  };

  const handleOldFileUpload = (event) => {
    setOldFiles(Array.from(event.target.files));
    setProcessedContents([]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files);
    setOldFiles(files);
    setProcessedContents([]);
  };

  const handleConfirmSeparator = () => {
    setIsModalOpen(false);
    processFiles(separator);
  };

  const handleCancelSeparator = () => {
    setIsModalOpen(false);
  };

  const processFiles = async (separator) => {
    const fileProcesses = oldFiles.map((file) =>
      readFileContent(file).then((content) => ({
        name: file.name,
        content: content.replace(/;/g, '\n'), // Replaces all ';' with '\n'
      }))
    );

    Promise.all(fileProcesses)
      .then((results) => {
        setProcessedContents(results);
        toast.success("Files read successfully!");
      })
      .catch((error) => console.error("Error processing files:", error));
  };

  // Handle file navigation
  const totalFiles = processedContents.length;

  const handleNextFile = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalFiles - 1));
  };

  const handlePreviousFile = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div
      className="flex flex-col items-center p-10 space-y-8 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 min-h-screen"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <ToastContainer theme="colored" />
      <h2 className="text-4xl font-extrabold text-blue-800 drop-shadow-lg">
        Read And Display File's Content
      </h2>

      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div>
          <input
            type="file"
            accept=".txt"
            multiple
            ref={oldFileInputRef}
            onChange={(e) => {
              handleOldFileUpload(e);
              setOldFiles(Array.from(e.target.files));
            }}
            style={{ display: "none" }}
          />
          <button
            className="w-full group relative flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            onClick={() => oldFileInputRef.current.click()}
          >
            <Upload className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">Upload Text Files</span>
          </button>
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

      <div className="flex flex-col items-center mt-4">
        <DelimiterSelector
          delimiter={delimiter}
          setDelimiter={setDelimiter}
          setProcessedContents={setProcessedContents}
          name={"normal"}

        />
      </div>

      <div
        className={`flex flex-col md:flex-row gap-10 w-full max-w-lg md:justify-center mt-6 ${
          isDragging ? "border-2 border-blue-500" : ""
        }`}
      >
        <FileList
          files={oldFiles}
          titre={"Uploaded Files"}
          setOldFiles={setOldFiles}
          setProcessedContents={setProcessedContents}
        />
      </div>

      <div className="flex gap-6 mt-6">
        <button
          onClick={handleDisplayTags}
          className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium ${
            processedContents.length ? "hidden" : ""
          }`}
        >
          <Eye className="w-5 h-5" />
          Read Files
        </button>
      </div>

      {/* Display single file content with pagination */}
      <div className="w-full max-w-4xl mt-6 p-4 border border-gray-300 rounded-lg">
      <FileViewer
        processedContents={processedContents}
        currentPage={currentPage}
        handlePreviousFile={handlePreviousFile}
        handleNextFile={handleNextFile}
      />
    
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        separator={separator}
        onConfirm={handleConfirmSeparator}
        onCancel={handleCancelSeparator}
      />
    </div>
  );
}
