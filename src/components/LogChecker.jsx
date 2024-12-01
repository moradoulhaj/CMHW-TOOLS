import { useState } from "react";
import { checkLogs } from "../scripts/checker"; // Adjust the import path based on your folder structure
import Monitor from "./smalls/logCheckerSmalls/Monitor";
import TextAreaInput from "./smalls/logCheckerSmalls/TextAreaInput";
import { ToastContainer, toast } from "react-toastify";

export default function LogChecker() {
  const [profiles, setProfiles] = useState("");
  const [logs, setLogs] = useState("");
  const [sent, setSent] = useState(false);
  const [result, setResult] = useState({});
  const [combined, setCombined] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Split the combined input into lines
    const lines = combined.split("\n");
    // Split each line into its components: profile, tag, log
    const profilesAndTags = lines.map((line) => line.split("\t"));

    // Extract profiles and logs from the parsed data
    const profiles = profilesAndTags
      .map(([profile, tag]) => `${profile}\t${tag || ""}`)
      .join("\n");
    const logs = profilesAndTags.map(([, , log]) => log || "").join("\n");

    setProfiles(profiles);
    setLogs(logs);

    // Perform the log check
    const profilesArr = profiles.split("\n");
    const logsArr = logs.split("\n");
  
    
    if (profilesArr.length !== logsArr.length) {
      toast.error("Profiles number and Logs number do not match");
      return;
    } else {
      const result = checkLogs(profiles, logs);
      setResult(result);
      setSent(true);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex flex-col items-center py-10">
      <div className="px-5 mt-4 w-full max-w-5xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <div className="w-full md:w-full">
              <TextAreaInput
                id="profiles"
                label="Profiles And Logs"
                value={combined}
                onChange={(e) => setCombined(e.target.value)}
                placeholder="Enter profiles with their logs"
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 py-2 px-8 rounded-full text-white hover:bg-blue-500 hover:shadow-lg transition-all duration-300 font-semibold tracking-wide w-full md:w-1/2"
            >
              Check
            </button>
          </div>
        </form>
        <hr className="mt-8 border-blue-300" />
      </div>
      {sent && (
        <div className="mt-8 w-full max-w-5xl">
          <Monitor result={result} />
        </div>
      )}
      <ToastContainer theme="colored" />
    </main>
  );
}
