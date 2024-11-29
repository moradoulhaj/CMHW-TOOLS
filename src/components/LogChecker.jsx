import { useState } from "react";
import { checkLogs } from "../scripts/checker"; // Adjust the import path based on your folder structure
import Monitor from "./smalls/logCheckerSmalls/Monitor";
import TextAreaInput from "./smalls/logCheckerSmalls/TextAreaInput";

export default function LogChecker() {
  const [profiles, setProfiles] = useState("");
  const [logs, setLogs] = useState("");
  const [sent, setSent] = useState(false);
  const [result, setResult] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = checkLogs(profiles, logs);
    if (result.error) {
      alert(result.error);
    } else {
      setResult(result);
      setSent(true);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex flex-col items-center py-10">
      <div className="px-5 mt-4 w-full max-w-5xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <div className="w-full md:w-1/3">
              <TextAreaInput
                id="profiles"
                label="Profiles"
                value={profiles}
                onChange={(e) => setProfiles(e.target.value)}
                placeholder="Enter profiles..."
              />
            </div>
            <div className="w-full md:w-2/3">
              <TextAreaInput
                id="logs"
                label="Logs"
                value={logs}
                onChange={(e) => setLogs(e.target.value)}
                placeholder="Enter logs..."
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
    </main>
  );
}
