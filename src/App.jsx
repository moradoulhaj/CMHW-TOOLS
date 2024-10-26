import React, { useState, useRef } from 'react';

export default function App() {
  const [oldFiles, setOldFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [mergedContent, setMergedContent] = useState('');

  const oldFileInputRef = useRef(null);
  const newFileInputRef = useRef(null);

  // Handler for uploading old files
  const handleOldFileUpload = (event) => {
    const uploadedOldFiles = Array.from(event.target.files);
    setOldFiles(uploadedOldFiles);
  };

  // Handler for uploading new files
  const handleNewFileUpload = (event) => {
    const uploadedNewFiles = Array.from(event.target.files);
    setNewFiles(uploadedNewFiles);
  };

  // Function to merge file contents (old + new)
  const mergeFiles = () => {
    const readFiles = (files) => {
      return Promise.all(
        files.map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
          });
        })
      );
    };

    Promise.all([readFiles(oldFiles), readFiles(newFiles)])
      .then((contents) => {
        const oldContent = contents[0].join('\n'); // Join old file contents
        const newContent = contents[1].join('\n'); // Join new file contents
        const merged = oldContent + '\n' + newContent; // Append new contents to old
        setMergedContent(merged); // Update the state with merged content
      })
      .catch((error) => console.error('Error reading files:', error));
  };

  // Function to download merged content
  const downloadMergedContent = () => {
    if (oldFiles.length === 0) {
      console.error("No old files uploaded");
      return;
    }

    const firstOldFileName = oldFiles[0].name; // Keep the original name of the first old file
    const blob = new Blob([mergedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = firstOldFileName; // Use the same name as the original old file
    a.click();

    URL.revokeObjectURL(url); // Clean up URL object
  };



  return (
    <div className="flex flex-col items-center p-8 space-y-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800">Merge Old and New Text Files</h2>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Upload Old Files Button */}
        <div>
          <input
            type="file"
            accept=".txt"
            multiple
            ref={oldFileInputRef}
            onChange={handleOldFileUpload}
            style={{ display: 'none' }}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => oldFileInputRef.current.click()}
          >
            Upload Old Files
          </button>
        </div>

        {/* Upload New Files Button */}
        <div>
          <input
            type="file"
            accept=".txt"
            multiple
            ref={newFileInputRef}
            onChange={handleNewFileUpload}
            style={{ display: 'none' }}
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => newFileInputRef.current.click()}
          >
            Upload New Files
          </button>
        </div>
      </div>

      {/* Display uploaded files */}
      <div className="text-left">
        <h3 className="text-xl font-semibold text-gray-700">Uploaded Old Files:</h3>
        <ul>
          {oldFiles.map((file, index) => (
            <li key={index} className="text-gray-600">{file.name}</li>
          ))}
        </ul>

        <h3 className="text-xl font-semibold text-gray-700 mt-4">Uploaded New Files:</h3>
        <ul>
          {newFiles.map((file, index) => (
            <li key={index} className="text-gray-600">{file.name}</li>
          ))}
        </ul>
      </div>

      {/* Merge and Download Buttons */}
      <button 
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        onClick={mergeFiles}
      >
        Merge Files
      </button>
      <button 
        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        onClick={downloadMergedContent}
        disabled={!mergedContent} // Disable if there's no merged content
      >
        Download Merged File
      </button>
    </div>
  );
}
