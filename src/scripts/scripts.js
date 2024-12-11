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

export const downloadProcessedContent = async (processedContents, excelBlob = null) => {
  const zip = new JSZip();

  // Add the processed files to the zip
  processedContents.forEach(({ name, content }) => {
    zip.file(name, content);
  });

  // If an Excel blob is provided, add it to the zip
  if (excelBlob) {
    zip.file("Updated_Template.xlsx", excelBlob);
  }

  // Generate the zip file
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);

  // Create a link element to trigger the download
  const a = document.createElement("a");
  a.href = url;
  a.download = "processed_files.zip";
  a.click();

  // Clean up the URL object after download
  URL.revokeObjectURL(url);
};

export const separateNumbersAndTags = (input) => {
  const lines = input.trim().split("\n"); // Split the input by lines
  const profiles = [];
  const tags = [];

  lines.forEach((line) => {
    const [profile, tag] = line.split("\t"); // Split each line by tab
    if (profile && tag) {
      profiles.push(profile.trim());
      tags.push(tag.trim()); // Keep square brackets on the tags
    }
  });
  return { profiles, tags };
};

export const updateAndDownloadExcel = async (
  profilesByDrop,
  userStartTime,
  timeBetweenDrops,
  sessionName,
  configName,
  scriptName
) => {
  try {
    const response = await fetch("/merger/template.xlsx");
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const today = new Date();
    const predefinedDate = today.toLocaleDateString("en-GB");
    const [hours, minutes] = userStartTime.split(":");
    const formattedDate = `${predefinedDate.split('/').reverse().join('/')} ${hours}:${minutes}:00`;
    const startingDropTime = new Date(formattedDate);

    if (isNaN(startingDropTime)) throw new Error("Invalid Date format.");

    let currentStartTime = new Date(startingDropTime);
    profilesByDrop.forEach((profileGroup, index) => {
      const rowIndex = index + 2;
      worksheet[`A${rowIndex}`] = { v: index + 1 };
      worksheet[`B${rowIndex}`] = { v: sessionName };
      worksheet[`G${rowIndex}`] = { v: configName };
      worksheet[`C${rowIndex}`] = { v: scriptName };
      worksheet[`H${rowIndex}`] = { v: 3 };
      worksheet[`D${rowIndex}`] = { v: profileGroup.join("|") };
      const startTime = currentStartTime.toLocaleString();
      currentStartTime = new Date(currentStartTime.getTime() + timeBetweenDrops * 60000);
      const endTime = currentStartTime.toLocaleString();
      worksheet[`E${rowIndex}`] = { v: startTime };
      worksheet[`F${rowIndex}`] = { v: endTime };
      worksheet[`I${rowIndex}`] = { v: "Drop "};
    });

    // Convert workbook to Blob
    const excelBlob = new Blob([XLSX.write(workbook, { type: "array", bookType: "xlsx" })], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    return excelBlob;
  } catch (error) {
    console.error("Error updating Excel template:", error);
  }
};


