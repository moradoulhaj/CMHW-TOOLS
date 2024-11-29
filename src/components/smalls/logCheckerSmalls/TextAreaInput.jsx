import React from "react";

const TextAreaInput = ({ id, label, value, onChange ,placeholder}) => {
  const countLines = (text) => (text ? text.split("\n").length : 0);

  return (
    <div className="w-full">
      <label htmlFor={id} className="block mb-1 text-gray-700 font-semibold">
        {label}
        <span className="ml-2 inline-flex items-center rounded-md bg-blue-100 px-2 text-xs font-medium text-blue-700 ring-1 ring-blue-500/20">
          {/* Lines: {countLines(value)} */}
        </span>
      </label>
      <textarea
        id={id}
        name={id}
        rows={5}
        style={{ resize: "none" }}
        className="block w-full p-3 rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-gray-400 sm:text-sm"
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextAreaInput;
