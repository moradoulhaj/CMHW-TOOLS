import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProxiesModal from "../ProxiesModal";

export default function TextAreaWithCopy({ id, label, value ,setIsModalOpen ,forProxies }) {

  const textAreaRef = useRef(null);

  const countLines = (text) => (text ? text.split("\n").length : 0);
  const copyToProfilesAndTagsToClipboard = () => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        toast.info("Profiles and Their Tags copied successfully!");
      })
      .catch(() => {
        toast.error("Failed to copy Profiles and Tags.");
      });
  };

  const copyProfilesNumbersToClipboard = () => {
    const profileNumbers = value
      .split("\n")
      .map((line) => line.split("\t")[0]) // Assumes profiles are the first tab-separated value
      .join("\n");

    navigator.clipboard
      .writeText(profileNumbers)
      .then(() => {
        toast.success("Profiles numbers copied!");
      })
      .catch(() => {
        toast.error("Failed to copy Profile numbers.");
      });
  };

  return (
    <>
      <div
        className={`w-full ${forProxies ? "sm:w-[100%]" :"sm:w-[30%]"} max-w-xl border p-5 border-gray-300 rounded-lg shadow-lg ${
          label == "Active" ? "bg-green-300" : "bg-white-white"
        }`}
      >
        <label
          htmlFor={id}
          className={`block mb-3 text-center font-semibold   ${
            label == "Active" ? "text-white" : " text-gray-800"
          }`}
        >
          {label}
          <span className="inline-flex items-center rounded-md bg-blue-100 px-2 ml-2 text-xs font-medium  ring-1 ring-inset ring-blue-700/10 text-blue-700">
            Lines: {countLines(value)}
          </span>
        </label>
        <textarea
          id={id}
          name={id}
          rows={12}
          style={{ height: "160px", resize: "none" }}
          className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 bg-gray-50 shadow-sm focus:ring-2 focus:ring-blue-500 sm:text-sm"
          value={value}
          ref={textAreaRef}
          readOnly
        />
        <div className="flex justify-center gap-6 mt-4">
          <button
            onClick={copyProfilesNumbersToClipboard}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-all duration-200 shadow-md"
            title="Copy profile numbers to clipboard"
          >
            <i className="ri-numbers-line"></i>
          </button>
          <button
            onClick={copyToProfilesAndTagsToClipboard}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-all duration-200 shadow-md"
            title="Copy profiles and their associated tags to clipboard"
          >
            <i className="ri-clipboard-line"></i>
          </button>
       
        </div>
      </div>
    </>
  );
}
