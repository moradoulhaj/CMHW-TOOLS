import React from "react";

export default function FileViewer({
  processedContents,
  currentPage,
  handlePreviousFile,
  handleNextFile,
}) {
  const totalFiles = processedContents.length;

  return (
    <div className="w-full max-w-4xl mt-6 p-4 border border-gray-300 rounded-lg">
      {totalFiles > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-blue-800 mb-4">File Content</h3>
          <div className="mb-4">
            <h4 className="text-lg font-bold">{processedContents[currentPage].name}</h4>
            <pre className="text-sm whitespace-pre-wrap break-words">
              {processedContents[currentPage].content}
            </pre>
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePreviousFile}
              disabled={currentPage === 0}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md ${
                currentPage === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700">
              File {currentPage + 1} of {totalFiles}
            </span>
            <button
              onClick={handleNextFile}
              disabled={currentPage === totalFiles - 1}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md ${
                currentPage === totalFiles - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
