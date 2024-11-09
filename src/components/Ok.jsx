import React, { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JSZip from "jszip";
import ConfirmModal from "./ConfirmModal";
import FileList from "./FilesList";
import { Download, Trash2, Upload } from "lucide-react";
import DelimiterSelector from "./DelimiterSelector";

export default function Ok() {
  const [oldFiles, setOldFiles] = useState([]);
  const [processedContents, setProcessedContents] = useState([]); // State to hold processed content
  const [tagsToRemove, setTagsToRemove] = useState("");
  const [delimiter, setDelimiter] = useState("AUTO");
  const [detectedSeparator, setDetectedSeparator] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [separator, setSeparator] = useState("");

  const oldFileInputRef = useRef(null);
  const handleRemoveTags = async () => {
    if (!tagsToRemove) {
      toast.error("Please specify tags to remove.");
      return;
    } else if (!oldFiles.length) {
      toast.error("Please upload files.");
      return;
    }
    if (delimiter === "AUTO") {
      setIsModalOpen(true);
      setSeparator(await detectSeparator());
      return;
    } else {
      processFiles(delimiter);
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };
  // function to detect separator
  const detectSeparator = async () => {
    if (oldFiles.length > 0) {
      let delimiter = "";
      const fileContent = await readFileContent(oldFiles[0]);
      const semicolonCount = (fileContent.match(/;/g) || []).length;
      const newlineCount = (fileContent.match(/\n/g) || []).length;
      delimiter = semicolonCount > newlineCount ? ";" : "\n";
      return delimiter;
    }
    return "no_detect";
  };
  const handleOldFileUpload = (event) => {
    setOldFiles(Array.from(event.target.files));
  };
  const removeTags = async (content, tagsArray, delimiter) => {
    tagsArray.forEach((tag) => {
      content = content.split(tag).join("");
    });

    // Split content by lines to handle empty line removal
    const cleanedContentArray = content
      .split("\n") // Split by lines first
      .map(
        (line) =>
          line
            .split(delimiter) // Split by delimiter within each line
            .map((item) => item.trim())
            .filter((item) => item) // Remove empty items
            .join(delimiter) // Rejoin with delimiter
      )
      .filter((line) => line.trim() !== ""); // Remove empty lines

    // Rejoin lines with newline character to preserve line breaks
    const cleanedContent = cleanedContentArray.join("\n");

    return cleanedContent.trim();
  };

  const handleConfirmSeparator = () => {
    setIsModalOpen(false); // Close the modal
    processFiles(separator); // to remove the tags
  };

  const handleCancelSeparator = () => {
    setIsModalOpen(false); // Close the modal
  };
  const processFiles = async (separatoor) => {
    const tags = tagsToRemove
      .split("\n")
      .map((tag) => tag.trim())
      .filter((tag) => tag); // Split by new line and trim

    const fileProcesses = oldFiles.map((file) =>
      readFileContent(file).then((content) => ({
        name: file.name,
        content: removeTags(content, tags, separatoor), // Remove tags from each file's content
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
    <div className="flex flex-col items-center p-10 space-y-8 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 min-h-screen">
      <ToastContainer theme="colored" />
      <h2 className="text-4xl font-extrabold text-blue-800 drop-shadow-lg">
        Remove Tags from Uploaded Text Files
      </h2>

      <div className="flex flex-col md:flex-row gap-8 items-center">
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
            className="w-full group relative flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            onClick={() => oldFileInputRef.current.click()}
          >
            <Upload className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">Upload Text Files</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center mt-4">
        <DelimiterSelector delimiter={delimiter} setDelimiter={setDelimiter} />
      </div>

      <div className="flex flex-col items-center mt-4 w-full max-w-lg">
        <label className="text-lg font-semibold text-gray-800 mb-2">
          Tags to Remove (one per line):
        </label>
        <textarea
          value={tagsToRemove}
          onChange={(e) => setTagsToRemove(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 shadow-md focus:outline-none focus:border-blue-500 w-full h-32 resize-none"
          placeholder="Enter tags to remove, one per line"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-10 w-full max-w-lg md:justify-center mt-6">
        {/* Suggested code may be subject to a license. Learn more: ~LicenseLog:2755053658. */}
        <FileList files={oldFiles} titre={"Uploaded Files"} />
      </div>

      <div className="flex gap-6 mt-6">
        <button
          onClick={handleRemoveTags}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium"
        >
          <Trash2 className="w-5 h-5" />
          Remove Tags
        </button>
        <button
          className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
            !processedContents.length ? "hidden" : ""
          }`}
          onClick={downloadProcessedContent}
          disabled={!processedContents.length} // Disable if no processed contents
        >
          <Download className="w-5 h-5" />
          Download Files
        </button>
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
