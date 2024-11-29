
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

export const generateExcell = (seedsBySessionPerDrop) => {
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
  const maxDrops = Math.max(...seedsBySessionPerDrop.map(session => session.length));

  for (let dropIndex = 0; dropIndex < maxDrops; dropIndex++) {
    let maxPairsInDrop = Math.max(
      ...seedsBySessionPerDrop.map(session => session[dropIndex]?.length || 0)
    );

    if (maxPairsInDrop > 0) {
      // Merge Drop label cell
      merges.push({
        s: { r: currentRow, c: 0 }, // Start cell (row, column)
        e: { r: currentRow + maxPairsInDrop - 1, c: 0 }, // End cell (row, column)
      });

      // Add data for each pair within the drop
      for (let pairIndex = 0; pairIndex < maxPairsInDrop; pairIndex++) {
        const row = [pairIndex === 0 ? `Drop ${dropIndex + 1}` : ""]; // Drop label only on the first row of the drop
        seedsBySessionPerDrop.forEach(session => {
          const pair = session[dropIndex]?.[pairIndex];
          row.push(pair ? `${pair[0]}` : "", pair ? `${pair[1]}` : ""); // Add profile and tag for the session
        });
        worksheetData.push(row);
        currentRow++;
      }

      // Add an empty row between drops for visual spacing
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



