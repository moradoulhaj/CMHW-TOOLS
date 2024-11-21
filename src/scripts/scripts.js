import JSZip from "jszip";
import { BookTemplate } from "lucide-react";
import * as XLSX from "xlsx";
// Suggested code may be subject to a license. Learn more: ~LicenseLog:1752201820.
export const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

export const detectSeparator = async (oldFiles) => {
    if (oldFiles.length > 0) {
      const fileContent = await readFileContent(oldFiles[0]);
      const semicolonCount = (fileContent.match(/;/g) || []).length;
      const newlineCount = (fileContent.match(/\n/g) || []).length;
      return semicolonCount > newlineCount ? ";" : "\n";
    }
    return "no_detect";
  };

export const downloadProcessedContent = async (processedContents) => {
    const zip = new JSZip();
    processedContents.forEach(({ name, content }) => {
      zip.file(name, content);
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "processed_files.zip";
    a.click();

    URL.revokeObjectURL(url);
  };
  export const  separateNumbersAndTags = (input) =>  {
    const lines = input.trim().split('\n'); // Split the input by lines
    const profiles = [];
    const tags = [];
  
    lines.forEach(line => {
      const [profile, tag] = line.split('\t'); // Split each line by tab
      if (profile && tag) {
        profiles.push(profile.trim());
        tags.push(tag.trim()); // Keep square brackets on the tags
      }
    });
    return { profiles, tags };
  }

  export const updateAndDownloadExcel = async (profilesByDrop, userStartTime, timeBetweenDrops) => {
    try {
      // Load the template from the public folder
      const response = await fetch("/merger/template.xlsx"); // Ensure the path is correct
      const arrayBuffer = await response.arrayBuffer();
      
      // Read the workbook from the array buffer (without modifying styles)
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
  
      // Access the first worksheet (or adjust to your template sheet name)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  
      // Get today's date
      const today = new Date();
  
      // Format the date as DD/MM/YYYY (or adjust the format as needed)
      const predefinedDate = today.toLocaleDateString("en-GB"); // UK format: DD/MM/YYYY
      const [hours, minutes] = userStartTime.split(":");
  
      // Manually format the date string into a valid format (MM/DD/YYYY HH:mm:ss)
      const formattedDate = `${predefinedDate.split('/').reverse().join('/')} ${hours}:${minutes}:00`;
  
      // Create the starting time by parsing the formatted date string
      const startingDropTime = new Date(formattedDate);
  
      if (isNaN(startingDropTime)) {
        throw new Error("Invalid Date: The date string format may be incorrect.");
      }
  
      console.log("Starting Drop Time: ", startingDropTime); // This will print the start time
  
      // Convert startingDropTime to a Date object
      let currentStartTime = new Date(startingDropTime);
  
      // Loop through the profiles and update data while keeping formatting intact
      profilesByDrop.forEach((profileGroup, index) => {
        const rowIndex = index + 2;  // Adjusting for row 2 onwards
        
        // Modify the profile data in column D
        worksheet[`D${rowIndex}`] = { v: profileGroup.join("|") };
  
        // Calculate start and end times for each drop
        const startTime = currentStartTime.toLocaleString(); // Format to your preference
        currentStartTime = new Date(currentStartTime.getTime() + timeBetweenDrops * 60000); // Add the time between drops (in minutes)
        const endTime = currentStartTime.toLocaleString();  // Format the end time similarly
  
        // Set start and end times in columns E and F
        worksheet[`E${rowIndex}`] = { v: startTime }; // Start Time
        worksheet[`F${rowIndex}`] = { v: endTime };   // End Time
      });
  
      // Write the updated workbook to a file (preserving styles)
      XLSX.writeFile(workbook, "Updated_Template.xlsx");
  
      toast.success("Excel updated successfully!");
  
    } catch (error) {
      console.error("Error updating Excel template:", error);
      toast.error("Error updating Excel template.");
    }
  };
  
  
  