import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import TextAreaInput from "./smalls/logCheckerSmalls/TextAreaInput";
import TableDisplay from "./smalls/TableSpam";

export default function SpamCalculator() {
  const [profiles, setProfiles] = useState("");
  const [profilesWithSpam, setProfilesWithSpam] = useState("");
  const [matchedSessions, setMatchedSessions] = useState([]); // Store the matched data

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!profiles?.trim()) {
      toast.error("Please enter valid profiles!");
      return;
    }
  
    const profilesWithSpamData = profilesWithSpam || "";
  
    // Step 1: Convert profiles input into a structured array.
    const rows = profiles
      .trim()
      .split("\n")
      .map((line) => line.split("\t"));
  
    // Step 2: Convert rows into sessions (column-based grouping)
    const sessions = rows[0].map((_, colIndex) =>
      rows.map((row) => [row[colIndex], ""]).filter(([profile]) => profile) // Remove empty values
    );
  
    // Step 3: Convert profilesWithSpam input into an array
    const profilesWithSpamArr = profilesWithSpamData
      .trim()
      .split("\n")
      .map((line) => line.split("\t"));
  
    // Step 4: Create a Map for spam numbers
    const spamMap = new Map();
    profilesWithSpamArr.forEach(([profile, spam]) => {
      if (profile) spamMap.set(profile, spam);
    });
  
    // Step 5: Count occurrences of each profile in sessions
    const profileCount = new Map();
    sessions.flat().forEach(([profile]) => {
      if (profile) profileCount.set(profile, (profileCount.get(profile) || 0) + 1);
    });
  
    // Step 6: Assign spam numbers and mark duplicates
    let newMatchedSessions = sessions.map((session) =>
      session.map(([profile]) => {
        const spamNumber = spamMap.get(profile) || "";
        const isDuplicate = profileCount.get(profile) > 1;
        return [profile, isDuplicate ? `${spamNumber} D` : spamNumber];
      })
    );
  
    // **Step 7: Sort Sessions Numerically**
    newMatchedSessions = newMatchedSessions.map((session) =>
      session.sort((a, b) => Number(a[0]) - Number(b[0])) // Sort based on profile numbers
    );
  
    setMatchedSessions(newMatchedSessions);
    console.log("Sorted Matched Sessions:", newMatchedSessions);
    toast.success("Profiles matched with spam successfully!");
  };
  
  

  return (
    <main className="min-h-[85vh] bg-gradient-to-br from-blue-100 via-white to-blue-50 flex flex-col items-center py-10">
      <div className="px-5 mt-4 w-full max-w-4xl">
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <div className="w-full md:w-1/2">
              <TextAreaInput
                id="profiles"
                value={profiles}
                label="Profiles And Logs"
                placeholder="Enter profiles by sessions:"
                onChange={(e) => setProfiles(e.target.value)}
              />
            </div>
            <div className="w-full md:w-1/2">
              <TextAreaInput
                id="profilesWithSpam"
                value={profilesWithSpam}
                label="Profiles With Spam"
                placeholder="Enter profiles with spam: 1111 2"
                onChange={(e) => setProfilesWithSpam(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
            >
              Match
            </button>
          </div>
        </form>
        <hr className="mt-8 border-blue-300" />

        {/* Render table only if matchedSessions has data */}
        {matchedSessions.length > 0 && <TableDisplay matchedSessions={matchedSessions} />}
      </div>

      <ToastContainer theme="colored" autoClose={1500} />
    </main>
  );
}
