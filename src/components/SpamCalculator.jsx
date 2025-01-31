import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import TextAreaInput from "./smalls/logCheckerSmalls/TextAreaInput";
import { calcSessions } from "../scripts/spliterScripts";

export default function SpamCalculator() {
  const [profiles, setProfiles] = useState("");
  const [profilesWithSpam, setProfilesWithSpam] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!profiles.trim()) {
      toast.error("Please enter valid profiles!");
      return;
    }
  
    // Splitting profiles into columns (sessions) and adding an empty spam number field
    const rows = profiles
      .trim()
      .split("\n") // Split input by lines (rows of profiles)
      .map((line) => line.split("\t")); // Split each line into profiles
  
    // Now, create sessions based on columns
    const sessions = rows[0].map((_, colIndex) =>
      rows.map((row) => [row[colIndex], ""]) // Adding empty spam field
    );
    const profilesWithSpamArr = profilesWithSpam.split("\n").map((line) => line.split("\t"));
    console.log(sessions);

    console.log(profilesWithSpamArr);
  

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
      </div>

      <ToastContainer theme="colored" autoClose={1500} />
    </main>
  );
}
