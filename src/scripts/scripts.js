import JSZip from "jszip";


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
