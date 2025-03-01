export const processData = (input) => {
    const lines = input.trim().split("\n"); // Split into lines and trim whitespace
  
    if (lines.length === 0) return { nextDay: null, onlyTags: "" }; // Edge case
  
    const nextDay = lines[0].split("\t")[0]; // Extract first number from first row
  
    const onlyTags = lines
      .map((line) => line.split("\t").slice(1).join("\t")) // Remove first column
      .join("\n") // Reconstruct data
  
    return { nextDay, onlyTags };
  };
  

import * as XLSX from "xlsx";

export const processExcelFiles = (files, seedsBySessions) => {
    // Get tomorrow's date
    const now = new Date();
    now.setDate(now.getDate() + 1); // Set to tomorrow
  
    // Set start time to 09:00 AM tomorrow
    const startTime = new Date(now);
    startTime.setHours(9, 0, 0, 0); // Set start time to 09:00 AM tomorrow
  
    // Set end time to 13:00 (1 PM) tomorrow
    const endTime = new Date(now);
    endTime.setHours(13, 0, 0, 0); // Set end time to 13:00 (1 PM)
  
    // Function to format date to DD/MM/YYYY HH:mm:ss AM/PM
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      const period = date.getHours() >= 12 ? "PM" : "AM";
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${period}`;
    };
  
    const processedFiles = files.map((file, index) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
  
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
  
          let jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
          if (jsonData.length === 0) {
            console.error(`Skipping empty file: ${file.name}`);
            return;
          }
  
          // Get the value from cell B3 (second column, third row)
          const admin = jsonData[2] && jsonData[2][1] ? jsonData[2][1] : "admin_3"; // B3 is at index [2][1]
  
          // Get last row to extract existing structure
          const lastRow = jsonData[jsonData.length - 1];
          const newRowNumber = parseInt(lastRow[0]) + 1 || 1; // Increment row number
  
          // Assign new profiles based on index or default to "500|600|700|800"
          const newProfiles = seedsBySessions[index].map(item => item[0]).join('|') || "check|error|700|800";
        
          // Generate new start & end times in the required format
          const newStartTime = formatDate(startTime); // Format start time
          const newEndTime = formatDate(endTime); // Format end time
  
          // Construct the new row
          const newRow = [
            25, 
            admin,  // Use the value from B3 for admin_3
            "Login_Gmail.js",  // Login_Gmail.js (same)
            newProfiles, // Updated profiles (could be based on the seeds or your logic)
            newStartTime, // Corrected start time (09:00 AM)
            newEndTime, // Corrected end time (13:00 PM)
            "check_status",  // check_status (same)
            2,  // 2 (same)
            `Drop ${newStartTime.split(" ")[1]}` // Update Drop label with correct time
          ];
  
          // Insert new row at row 29 (index 28)
          jsonData.splice(25, 0, newRow); // Insert at index 28 (row 29)
  
          // Convert JSON back to worksheet
          const newWorksheet = XLSX.utils.aoa_to_sheet(jsonData);
          const newWorkbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);
  
          // Create downloadable file
          const excelBuffer = XLSX.write(newWorkbook, { bookType: "xlsx", type: "array" });
          const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  
          resolve({ blob, fileName: `Updated_${file.name}` });
        };
  
        reader.readAsArrayBuffer(file);
      });
    });
  
    return Promise.all(processedFiles);
  };
  
  
  
  
