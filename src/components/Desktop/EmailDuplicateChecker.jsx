import React, { useState } from "react";
import TextAreaWithCopyDesktop from "./Small Components/TextAreaWithCopyDesktop";
import { ToastContainer } from "react-toastify";
import { FileIcon } from "lucide-react"; // Import the FileIcon from Lucid

export default function EmailDuplicateChecker() {
  const [inputMode, setInputMode] = useState("paste"); // 'paste' or 'file'
  const [emailsInput, setEmailsInput] = useState("");
  const [fileEmails, setFileEmails] = useState("");
  const [fileName, setFileName] = useState(""); // State to store the file name
  const [error, setError] = useState("Nothing"); // State for erroooooooooor

  const [results, setResults] = useState({
    duplicates: "",
    uniques: "",
    withoutDuplicates: "",
  });

  // const normalizeAlias = (email) => {
  //   const [alias, domain] = email.trim().split("@");

  //   return alias.toLowerCase() + "@" + domain.toLowerCase();
  // };
  const normalizeAlias = (email, position) => {
    try {
      const [alias, domain] = email.trim().split("@");
      if (domain !== "gmail.com") {
        setError(
          `🚫 Invalid Email Detected! | EMAIL: ${email} | POSITION: ${position} | REASON: Not a Gmail account`
        );
        return null;
      }
      return alias.toLowerCase() + "@" + domain.toLowerCase();
    } catch {
      return null;
    }
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileEmails(event.target.result);
      setEmailsInput(event.target.result);
    };
    reader.readAsText(file);

    // Store the file name to display to the user
    setFileName(file.name);

    // Clear the file input after reading the file to force React to detect the change
    e.target.value = null;
  };

  const processEmails = () => {
    setError("Nothing")
    const input = inputMode === "paste" ? emailsInput : fileEmails;

    const allEmails = input
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const seen = {};
    const duplicates = new Set();
    const normalizedMap = {};
    var i = 1;
    for (const email of allEmails) {
      const normalized = normalizeAlias(email ,i);
      if(!normalized){
        return ;
      }
      if (seen[normalized]) {
        duplicates.add(seen[normalized]);
        duplicates.add(email);
      } else {
        seen[normalized] = email;
        normalizedMap[normalized] = email;
      }
      i++;
    }

    const uniqueOriginals = allEmails.filter(
      (email) =>
        !duplicates.has(email) &&
        Object.values(seen).filter((v) => v === email).length === 1
    );

    const withoutDuplicates = Array.from(new Set(Object.values(normalizedMap)));

    setResults({
      duplicates: Array.from(duplicates).sort().join("\n"),
      uniques: uniqueOriginals.join("\n"),
      withoutDuplicates: withoutDuplicates.join("\n"),
    });
  };

  const renderResultTextAreas = () => {
    const categories = [
      { id: "duplicates", label: "Duplicates", data: results.duplicates },
      { id: "uniques", label: "Unique Emails", data: results.uniques },
      {
        id: "withoutDuplicates",
        label: "Cleaned (no dupes)",
        data: results.withoutDuplicates,
      },
    ];

    return categories.map(({ id, label, data }) => {
      if (!data?.length) return null;
      return (
        <TextAreaWithCopyDesktop key={id} id={id} label={label} value={data} />
      );
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Email Deduplicator
      </h2>

      {/* Toggle Buttons */}
      <div className="flex justify-center mb-6 space-x-4">
        <button
          className={`px-4 py-2 rounded-md font-medium ${
            inputMode === "paste"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setInputMode("paste")}
        >
          Paste Emails
        </button>
        <button
          className={`px-4 py-2 rounded-md font-medium ${
            inputMode === "file"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setInputMode("file")}
        >
          Upload File
        </button>
      </div>
      {/* Error div */}
      {error !== "Nothing" && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center mb-4">
          <strong className="font-bold">Error: </strong>
          <span className=" ">{error}</span>
        </div>
      )}
      {/* Input Section */}
      <div className="mb-6">
        {inputMode === "paste" ? (
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Paste Emails:
            </label>
            <textarea
              rows="10"
              className="w-full p-3 border rounded-md shadow-sm resize-none"
              value={emailsInput}
              onChange={(e) => setEmailsInput(e.target.value)}
              placeholder="Paste one email per line..."
            />
          </div>
        ) : (
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Upload .txt or .csv File:
            </label>
            <input
              key={Date.now()} // Adding key to force re-render
              type="file"
              accept=".txt,.csv"
              className="block w-full border rounded-md p-2"
              onChange={handleFileUpload}
            />
            {/* Display the file name and icon if it's uploaded */}
            {fileName && (
              <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                <FileIcon size={18} /> {/* Lucid File Icon */}
                <p>Uploaded File: {fileName}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Process Button */}
      <div className="text-center mb-6">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
          onClick={processEmails}
        >
          Process Emails
        </button>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderResultTextAreas()}
      </div>

      <ToastContainer />
    </div>
  );
}
