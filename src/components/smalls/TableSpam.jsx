import React from "react";

export default function TableSpam({ matchedSessions }) {
  if (!matchedSessions || matchedSessions.length === 0) {
    return <p className="text-center text-gray-500">No data available</p>;
  }

  // Determine the max number of rows in any session
  const maxRows = Math.max(...matchedSessions.map(session => session.length));

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-blue-600 text-white">
            {matchedSessions.map((_, index) => (
              <th key={index} className="border p-2">
                Session {index + 1}
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
    </div>
  );
}
