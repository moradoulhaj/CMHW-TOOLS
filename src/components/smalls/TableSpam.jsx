import React from "react";
import { toast } from "react-toastify";

export default function TableSpam({ matchedSessions, modeToTable }) {
  if (!matchedSessions || matchedSessions.length === 0) {
    return <p className="text-center text-gray-500">No data available</p>;
  }

  // Determine the max number of rows in any session
  const maxRows = Math.max(...matchedSessions.map(session => session.length));

  // Calculate total profiles count (excluding empty entries)
  const totalProfiles = matchedSessions.reduce((sum, session) => sum + session.length, 0);

  // Function to copy profiles with spam or only spam, keeping table alignment
  const handleCopy = (copySpamOnly = false) => {
    let headers = matchedSessions
      .map((_, index) => `${modeToTable === "session" ? "Session" : "Deploy"} ${index + 1}`)
      .join("\t"); // Join headers with tabs
  
    let rows = [...Array(maxRows)].map((_, rowIndex) =>
      matchedSessions
        .map(session => {
          const profile = session[rowIndex]?.[0] || ""; // "DE" if profile is missing
          const spam = session[rowIndex]?.[1] ? `(${session[rowIndex][1]})` : "(N)"; // "(N)" if spam is missing
          return copySpamOnly ? spam : `${profile} ${spam}`;
        })
        .join("\t") // Join row values with tabs
    );
  
    let dataToCopy = [headers, ...rows].join("\n"); // Join everything with new lines
    console.log(matchedSessions);
    navigator.clipboard.writeText(dataToCopy)
      .then(() => toast.info(copySpamOnly ? "Spam copied!" : "Profiles with spam copied!"))
      .catch(() => toast.info("Failed to copy!"));
  };
  
  
  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-blue-600 text-white">
            {matchedSessions.map((_, index) => (
              <th key={index} className="border p-2">
                {modeToTable === "session" ? "Session" : "Deploy"} {index + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(maxRows)].map((_, rowIndex) => (
            <tr key={rowIndex} className="border">
              {matchedSessions.map((session, colIndex) => {
                const profile = session[rowIndex]?.[0] || "-";
                const spam = session[rowIndex]?.[1] ? `(${session[rowIndex][1]})` : "";
                return (
                  <td key={colIndex} className="border p-2 text-center">
                    {profile} {spam}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Display total profiles count */}
      <p className="mt-4 text-center font-semibold text-gray-700">
        Total Profiles: {totalProfiles}
      </p>

      {/* Copy buttons */}
      <div className="flex justify-center gap-4 mt-4">
        <button 
          onClick={() => handleCopy(false)} 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Copy Profiles with Spam
        </button>
        <button 
          onClick={() => handleCopy(true)} 
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Copy Only Spam
        </button>
      </div>
    </div>
  );
}
