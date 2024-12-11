export const calcSessions = (firstLine) => {
  // Split the first line by tab to detect the number of sessions

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
  if (sessionsNumber === 0 || !Number.isInteger(sessionsNumber)) {
    toast.error("Make sure ur tags are correct then re-check again.");
    return "wrongIinput";
  }
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
    const seedsPerDropForSession = Math.floor(session.length / dropNumbers);
    let remainder = session.length % dropNumbers; // Remaining seeds after even split

    let start = 0;

    // Distribute seeds across drops
    for (let i = 0; i < dropNumbers; i++) {
      let end = start + seedsPerDropForSession + (remainder > 0 ? 1 : 0);
      chunks.push(session.slice(start, end));
      start = end;
      if (remainder > 0) remainder--; // Use up the remainder
    }

    return chunks;
  });
};

// Function to generate Excel file from session data
import * as XLSX from "xlsx";

export const generateExcel = (seedsBySessionPerDrop) => {
  const worksheetData = [];

  // Prepare headers for each session
  const headerRow = ["Drop"]; // First column for drop labels
  seedsBySessionPerDrop.forEach((_, sessionIndex) => {
    headerRow.push(`Session ${sessionIndex + 1}`, ""); // One column for profile, one for tag
  });
  worksheetData.push(headerRow);

  // To track merge ranges
  const merges = [];

  // Loop through drops and sessions to structure data
  let currentRow = 1; // Start after header row
  const maxDrops = Math.max(
    ...seedsBySessionPerDrop.map((session) => session.length)
  );

  for (let dropIndex = 0; dropIndex < maxDrops; dropIndex++) {
    let maxPairsInDrop = Math.max(
      ...seedsBySessionPerDrop.map((session) => session[dropIndex]?.length || 0)
    );

    if (maxPairsInDrop > 0) {
      // Merge Drop label cell
      merges.push({
        s: { r: currentRow, c: 0 }, // Start cell (row, column)
        e: { r: currentRow + maxPairsInDrop - 1, c: 0 }, // End cell (row, column)
      });

      // Add data for each pair within the drop
      for (let pairIndex = 0; pairIndex < maxPairsInDrop; pairIndex++) {
        const row = [pairIndex === 0 ? dropIndex + 1 : ""]; // Drop label only on the first row of the drop
        seedsBySessionPerDrop.forEach((session) => {
          const pair = session[dropIndex]?.[pairIndex];
          row.push(pair ? `${pair[0]}` : null, pair ? `${pair[1]}` : null); // Add profile and tag for the session
        });
        worksheetData.push(row);
        currentRow++;
      }

      // Add an empty row between drops for visual spacing
      // Add a blank row for visual separation
      worksheetData.push([]);

      currentRow++;
    }
  }

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  worksheet["!merges"] = merges; // Apply merge settings

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sessions");

  XLSX.writeFile(workbook, "sessions_data.xlsx");
};

import JSZip from "jszip";
import { toast } from "react-toastify";

export const downloadZip = async (seedsBySessionPerDrop, delimiter) => {
  // Normalize delimiter: convert "\\n" to actual newline
  if (delimiter === "\\n") {
    delimiter = "\n";
  }
  // Initialize an array to hold tags for each drop across all sessions
  const combinedDrops = [];
  const zip = new JSZip();

  // Iterate through all sessions and their drops
  seedsBySessionPerDrop.forEach((session) => {
    session.forEach((drop, dropIndex) => {
      // If the drop index doesn't exist in combinedDrops, initialize it as an empty array
      if (!combinedDrops[dropIndex]) {
        combinedDrops[dropIndex] = [];
      }

      // Push the tags of the current drop from the current session into the combinedDrops array
      const dropTags = drop.map(([_, tag]) => tag);
      combinedDrops[dropIndex].push(...dropTags);
    });
  });
  // Create a file for each drop
  combinedDrops.forEach((tags, dropIndex) => {
    const fileName = `file_${dropIndex + 1}.txt`; // file_x where x is the 1-based drop index
    const fileContent = tags.join(delimiter); // Join tags with newlines
    zip.file(fileName, fileContent); // Add the file to the zip
  });

  // Generate and trigger download
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "drops.zip";
  a.click();

  // Clean up
  URL.revokeObjectURL(url);
};
export const downloadShedule = (seedsBySessionPerDrop) => {
  seedsBySessionPerDrop.forEach((session, sessionIndex) => {
    console.log(`Session ${sessionIndex + 1}:`);
    
    const formattedDrops = session.map((drop, dropIndex) => {
      // Extract only the numbers and join them with '|'
      const numbers = drop.map((pair) => pair[0]);
      const joinedNumbers = numbers.join("|");
      console.log(`  Drop ${dropIndex + 1}: ${joinedNumbers}`);
      return joinedNumbers;
    });

  });
};

export const generateSceduleExcel = () => {
  
}