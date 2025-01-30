import { useState, useEffect } from "react";
import { checkLogs } from "../scripts/checker"; // Adjust the import path based on your folder structure
import Monitor from "./smalls/logCheckerSmalls/Monitor";
import TextAreaInput from "./smalls/logCheckerSmalls/TextAreaInput";
import { ToastContainer, toast } from "react-toastify";

export default function SpamCalculator() {
  return (
    <main className="min-h-[85vh] bg-gradient-to-br from-blue-100 via-white to-blue-50 flex flex-col items-center py-10">
      <div className="px-5 mt-4 w-full max-w-5xl">
        <form className="space-y-8">
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <div className="w-1/2 md:w-full">
              <TextAreaInput
                id="profiles"
                label="Profiles And Logs"
                value={combined}
                onChange={(e) => setCombined(e.target.value)}
                placeholder="Enter profiles with their logs"
              />
            </div>
            <div className="w-1/2 md:w-full">
              <TextAreaInput
                id="profiless"
                label="Profiles And Logs"
                onChange={(e) => setCombined(e.target.value)}
                placeholder="Enter profiles with their logs"
              />
            </div>
          </div>
        </form>
        <hr className="mt-8 border-blue-300" />
      </div>

      <ToastContainer theme="colored" autoClose={1500} />
    </main>
  );
}
