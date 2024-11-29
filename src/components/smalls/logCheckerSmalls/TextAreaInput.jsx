import React from "react";

const TextAreaInput = ({ id, label, value, onChange }) => {
  const countLines = (text) => (text ? text.split("\n").length : 0);

  return (
    <div className="w-full">
      <label htmlFor={id} className="block mb-2 text-gray-700 font-medium">
        {label}:
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 ml-2 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          Lines :{countLines(value)}
        </span>
      </label>
      <textarea
        id={id}
        name={id}
        rows={3}
        style={{ height: "150px", resize: "none" }}
        className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default TextAreaInput;
