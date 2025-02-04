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

export const generateExceel = (seedsBySessionPerDrop) => {
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

export const generateExcel = (seedsBySessionPerDrop) => {
  const worksheetData = [];
  const profileSheetData = []; // Data for the second sheet

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
      worksheetData.push([]);
      currentRow++;
    }

    // Create a row for the profiles sheet (drop level)
    const profileRow = [dropIndex + 1]; // Drop number in the first column
    seedsBySessionPerDrop.forEach((session) => {
      const profiles =
        session[dropIndex]
          ?.map((pair) => pair[0]) // Collect profile IDs
          .join("|") || ""; // Join profiles with "|" or empty if none
      profileRow.push(profiles);
    });
    profileSheetData.push(profileRow);
  }

  // Add headers to the profiles sheet
  const profileSheetHeader = ["Drop"];
  seedsBySessionPerDrop.forEach((_, sessionIndex) =>
    profileSheetHeader.push(`Session ${sessionIndex + 1}`)
  );
  profileSheetData.unshift(profileSheetHeader); // Add header row to the top

  // Create worksheets
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  worksheet["!merges"] = merges; // Apply merge settings

  const profileSheet = XLSX.utils.aoa_to_sheet(profileSheetData);

  // Create and save the workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sessions");
  XLSX.utils.book_append_sheet(workbook, profileSheet, "Profiles by Drop");

  XLSX.writeFile(workbook, "sessions_data.xlsx");
};

////////////////////
// export const downloadShedule = (seedsBySessionPerDrop) => {
//   generateScheduleExcelForSessions(seedsBySessionPerDrop, "https://raw.githubusercontent.com/moradoulhaj/API/refs/heads/main/configsCMHW.json")
//   .then(files => {
//     // Handle the generated files (e.g., offer them for download)
//     files.forEach(file => {
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(file.blob);
//       link.download = file.fileName;
//       link.click();
//     });
//   })
//   .catch(error => {
//     console.error("Error generating schedule:", error);
//   });
// };

// //////////////////////////////////////////////////
// // export const generateScheduleExcelForSessions = async (
// //   seedsBySessionPerDrop,
// //   userStartTime,
// //   timeBetweenDrops,
// //   sessionNames,
// //   configName,
// //   scriptName
// // ) => {
// //   try {
// //     const response = await fetch("/CMHW-TOOLS/template.xlsx");
// //     const arrayBuffer = await response.arrayBuffer();
// //     const templateWorkbook = XLSX.read(arrayBuffer, { type: "array" });

// //     const today = new Date();
// //     const predefinedDate = today.toLocaleDateString("en-GB");
// //     const [hours, minutes] = userStartTime.split(":");
// //     const formattedDate = `${predefinedDate
// //       .split("/")
// //       .reverse()
// //       .join("/")} ${hours}:${minutes}:00`;
// //     const startingDropTime = new Date(formattedDate);

// //     if (isNaN(startingDropTime)) throw new Error("Invalid Date format.");

// //     let files = [];

// //     seedsBySessionPerDrop.forEach((sessionDrops, sessionIndex) => {
// //       const workbook = XLSX.utils.book_new();
// //       const worksheet = XLSX.utils.aoa_to_sheet([]); // Start with an empty worksheet
// //       let currentStartTime = new Date(startingDropTime);

// //       // Add header row
// //       XLSX.utils.sheet_add_aoa(worksheet, [
// //         [
// //           "TaskId",
// //           "Session",
// //           "Script_Name",
// //           "Profiles",
// //           "Start_at",
// //           "End_at",
// //           "Config_name",
// //           "Time_type",
// //           "Description",
// //         ],
// //       ]);

// //       sessionDrops.forEach((drop, dropIndex) => {
// //         const profileGroup = drop.map((profile) => profile[0]).join("|"); // Combine profiles as numbers separated by '|'
// //         const startTime = currentStartTime.toLocaleString(); // Start time
// //         currentStartTime = new Date(
// //           currentStartTime.getTime() + timeBetweenDrops * 60000
// //         ); // Increment start time
// //         const endTime = currentStartTime.toLocaleString(); // End time

// //         XLSX.utils.sheet_add_aoa(
// //           worksheet,
// //           [
// //             [
// //               dropIndex + 1, // TaskId (Drop number)
// //               sessionNames[sessionIndex], // Session name
// //               scriptName, // Script name
// //               profileGroup, // Profiles combined as numbers separated by |
// //               startTime, // Start_at time
// //               endTime, // End_at time
// //               configName, // Config_name
// //               "3", // Time_type
// //               "Drop", // Description
// //             ],
// //           ],
// //           { origin: -1 }
// //         ); // Add each row at the next available row
// //       });

// //       XLSX.utils.book_append_sheet(workbook, worksheet, "Schedule");
// //       const excelBlob = new Blob(
// //         [XLSX.write(workbook, { type: "array", bookType: "xlsx" })],
// //         {
// //           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
// //         }
// //       );

// //       files.push({
// //         blob: excelBlob,
// //         fileName: `${sessionNames[sessionIndex]}_Schedule.xlsx`,
// //       });
// //     });

// //     return files;
// //   } catch (error) {
// //     console.error("Error updating Excel template:", error);
// //   }
// // };
// /////////////////////////////////////////////////
// export const generateScheduleExcelForSessions = async (
//   seedsBySessionPerDrop,
//   configUrl
// ) => {
//   try {
//     // Fetch configuration from the provided URL (e.g., GitHub or Google Drive)
//     const {
//       sessionNames, // Array of session names
//       scriptNames,  // Array of script names
//       configNames,  // Array of config names
//       timeBetweenDrops,
//       dropsTimes,   // Specific drop times
//     } = await fetchDynamicConfig(configUrl);
//     ();
//     // Fetch the template Excel file
//     const response = await fetch("/CMHW-TOOLS/template.xlsx");
//     const arrayBuffer = await response.arrayBuffer();
//     const templateWorkbook = XLSX.read(arrayBuffer, { type: "array" });

//     const today = new Date();

//     let files = [];

//     seedsBySessionPerDrop.forEach((sessionDrops, sessionIndex) => {
//       const workbook = XLSX.utils.book_new();
//       const worksheet = XLSX.utils.aoa_to_sheet([]); // Start with an empty worksheet
//       let currentStartTime = new Date(today); // Initialize with today's date

//       // Add header row to the worksheet
//       XLSX.utils.sheet_add_aoa(worksheet, [
//         [
//           "TaskId",
//           "Session",
//           "Script_Name",
//           "Profiles",
//           "Start_at",
//           "End_at",
//           "Config_name",
//           "Time_type",
//           "Description",
//         ],
//       ]);

//       sessionDrops.forEach((drop, dropIndex) => {
//         const profileGroup = drop.map((profile) => profile[0]).join("|"); // Combine profiles as numbers separated by '|'

//         // Use the dropsTimes for each drop if available
//         const dropTime = dropsTimes[dropIndex] || "00:00"; // Default to "00:00" if no time is defined

//         const [hours, minutes] = dropTime.split(":");
//         currentStartTime.setHours(hours);
//         currentStartTime.setMinutes(minutes);

//         const startTime = currentStartTime.toLocaleString(); // Start time

//         // For the end time, calculate 5 minutes before the start time of the next drop
//         let endTime;
//         if (sessionDrops[dropIndex + 1]) {
//           // There is a next drop
//           let nextDropTime = dropsTimes[dropIndex + 1] || "00:00"; // Get the time for the next drop
//           const [nextHours, nextMinutes] = nextDropTime.split(":");
//           const nextDropStartTime = new Date(currentStartTime);
//           nextDropStartTime.setHours(nextHours);
//           nextDropStartTime.setMinutes(nextMinutes);

//           endTime = new Date(nextDropStartTime.getTime() - 5 * 60000); // Subtract 5 minutes
//         } else {
//           // If no next drop, default to the current start time minus 5 minutes (or another fallback logic)
//           endTime = new Date(currentStartTime.getTime() - 5 * 60000);
//         }

//         const endFormattedTime = endTime.toLocaleString(); // Format end time

//         currentStartTime = new Date(currentStartTime.getTime() + timeBetweenDrops * 60000); // Increment start time for the next drop

//         // Add each drop's row to the worksheet
//         XLSX.utils.sheet_add_aoa(
//           worksheet,
//           [
//             [
//               dropIndex + 1, // TaskId (Drop number)
//               sessionNames[sessionIndex], // Session name (specific to this session)
//               scriptNames[sessionIndex], // Script name (specific to this session)
//               profileGroup, // Profiles combined as numbers separated by |
//               startTime, // Start_at time
//               endFormattedTime, // End_at time (5 minutes before the next drop)
//               configNames[sessionIndex], // Config_name (specific to this session)
//               "3", // Time_type
//               "Drop", // Description
//             ],
//           ],
//           { origin: -1 }
//         ); // Add each row at the next available row
//       });

//       XLSX.utils.book_append_sheet(workbook, worksheet, "Schedule");

//       // Convert the workbook to a Blob
//       const excelBlob = new Blob(
//         [XLSX.write(workbook, { type: "array", bookType: "xlsx" })],
//         {
//           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         }
//       );

//       files.push({
//         blob: excelBlob,
//         fileName: `${sessionNames[sessionIndex]}_Schedule.xlsx`,
//       });
//     });

//     return files;
//   } catch (error) {
//     console.error("Error generating Excel schedule:", error);
//   }
// };

// //////////////////////////////////////////////////////////////
// const fetchDynamicConfig = async (configUrl) => {
//   try {
//     const response = await fetch(configUrl);
//     if (!response.ok) {
//       throw new Error("Failed to fetch configuration");
//     }
//     const config = await response.json();
//     return config;
//   } catch (error) {
//     console.error("Error fetching dynamic config:", error);
//     throw error;
//   }
// };
