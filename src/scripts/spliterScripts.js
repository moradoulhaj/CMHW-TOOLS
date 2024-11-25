
export const calcSessions = (tagsToSplit) => {
  const lines = tagsToSplit.split("\n");
  if (lines.length === 0) {
    return;
  }

  // Split the first line by tab to detect the number of sessions
  const firstLine = lines[0];
  const sessions = firstLine.split("\t");
  return sessions.length / 2; // return the number of sessions
};

export const parseNumberTagPairs = (line) => {
  // Split the input by tabs to capture numbers, tags, and empty fields
  const elements = line.split("\t");
  // Initialize an empty result array to store pairs
  const result = [];

  // Iterate over elements two at a time
  for (let i = 0; i < elements.length; i += 2) {
    // Get the current number and tag, or use empty strings if missing
    const number = elements[i] || "";
    const tag = elements[i + 1] || "";
    result.push([number, tag]);
  }

  return result;
};
// to split tags by sesions
export const collectData = (lines, sessionsNumber) => {
  // Initialize the grouped structure with empty subarrays for each position
  const groupedProfilesAndTags = Array.from(
    { length: sessionsNumber },
    () => []
  );

  // Track whether we've encountered an empty pair for each column
  const stopPush = Array(sessionsNumber).fill(false);

  // Populate the grouped structure by column
  lines.forEach((pairs) => {
    pairs.forEach((pair, index) => {
      // Only push if we haven't encountered an empty pair in this column
      if (!stopPush[index]) {
        if (pair[0] === "" && pair[1] === "") {
          stopPush[index] = true; // Mark this column to stop pushing further
        } else {
          groupedProfilesAndTags[index].push(pair);
        }
      }
    });
  });

  return groupedProfilesAndTags;
};

// Function to split each session's pairs into chunks based on dropNumbers
export const splitSessionsByDrops = (collectedData, dropNumbers) => {
  return collectedData.map((session) => {
    const chunks = [];
    const seedsPerDropForSession = Math.ceil(session.length / dropNumbers);

    // Loop through the session and create chunks
    for (let i = 0; i < session.length; i += seedsPerDropForSession) {
      const chunk = session.slice(i, i + seedsPerDropForSession);
      chunks.push(chunk);
    }

    return chunks;
  });
};

// Function to generate Excel file from session data
import * as XLSX from "xlsx";

export const generateExcel = (seedsBySessionPerDrop) => {
  // Create a new workbook for the Excel file
  const workbook = XLSX.utils.book_new();

  // Initialize an array to hold all rows for the single worksheet
  const worksheetData = [];

  // Loop over each session
  seedsBySessionPerDrop.forEach((session, sessionIndex) => {
    worksheetData.push([`Session ${sessionIndex + 1}`]); // Label each session

    // Loop through each drop within the session
    session.forEach((drop, dropIndex) => {
      worksheetData.push([`Drop ${dropIndex + 1}`]); // Label each drop

      // Add each [profile, tag] pair within the drop to its own row
      drop.forEach((pair) => {
        worksheetData.push([pair[0], pair[1]]); // Add profile and tag in separate columns
      });

      worksheetData.push([]); // Add an empty row for spacing between drops
    });

    worksheetData.push([]); // Add an empty row for spacing between sessions
  });

  // Convert the worksheet data to a single sheet format and add it to the workbook
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  XLSX.utils.book_append_sheet(workbook, worksheet, "All Sessions");

  // Export the workbook to an Excel file and download it
  XLSX.writeFile(workbook, "sessions_data.xlsx");
};
