import { useState } from "react";
import Monitor from "../parts/Monitor";
import { checkLogs } from "../scripts/checker"; // Adjust the import path based on your folder structure
import TextAreaInput from "../small components/TextAreaInput"; // Adjust the import path based on your folder structure

export default function LogChecker() {
  const [profiles, setProfiles] = useState("");
  const [logs, setLogs] = useState("");
  const [sent, setSent] = useState(true);
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
    <main>
      <div className="px-5 mt-2">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <div className="w-1/5">
              <TextAreaInput
                id="profiles"
                label="Profiles"
                value={profiles}
                onChange={(e) => setProfiles(e.target.value)}
              />
            </div>
            <div className="w-1/2">
              <TextAreaInput
                id="logs"
                label="Logs"
                value={logs}
                onChange={(e) => setLogs(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full flex justify-center">
            <button
              type="submit"
              className="mt-1 bg-blue-600 py-1 w-1/2 rounded-full text-white hover:bg-blue-100 font-medium transition-2 hover:text-sky-700"
            >
              Check
            </button>
          </div>
        </form>
        <hr className="mt-2 border-indigo-600" />
      </div>
      {sent && <Monitor  result={result} />}
    </main>
  );
}
