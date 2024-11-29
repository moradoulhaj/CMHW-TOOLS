import { useRef, useState } from "react";
import Modal from "./Modal";
import NewLogsModal from "./NewLogsModal";

export default function TextAreaWithCopy({ id, label, value, proxyDownProfiles }) {
  const textAreaRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [showNewLogsModal, setShowNewLogsModal] = useState(false);

  const countLines = (text) => (text ? text.split("\n").length : 0);

  const copyToClipboard = () => {
    textAreaRef.current.select();
    document.execCommand("copy");
  };

  const getIcon = (id) => {
    if (id === "pairedList") return <i className="ri-check-double-line"></i>;
    if (id === "proxyDown") return <i className="ri-pencil-fill"></i>;
    return <i className="ri-download-fill"></i>;
  };

  return (
    <>
      <div className="w-full border p-4 border-gray-300 bg-gray-50 rounded-lg shadow-lg">
        <label
          htmlFor={id}
          className="block mb-2 text-center text-gray-700 font-semibold"
        >
          {label}
          <span className="inline-flex items-center rounded-md bg-blue-100 px-2 ml-2 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            Lines: {countLines(value)}
          </span>
        </label>
        <textarea
          id={id}
          name={id}
          rows={10}
          style={{ height: "140px", resize: "none" }}
          className="block w-full rounded-md border border-gray-400 py-2 px-3 text-gray-900 bg-gray-100 shadow-sm focus:ring-2 focus:ring-indigo-500 sm:text-sm"
          value={value}
          ref={textAreaRef}
          readOnly
        />
        <div className="flex justify-center gap-4 mt-3">
          <button
            onClick={copyToClipboard}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition-all duration-200"
          >
            <i className="ri-clipboard-line"></i>
          </button>
          <button
            onClick={() => (id === "pairedList" ? setShowNewLogsModal(true) : setShowModal(true))}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition-all duration-200"
          >
            {getIcon(id)}
          </button>
        </div>
      </div>
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        proxyDownProfiles={proxyDownProfiles}
      />
      <NewLogsModal
        showNewLogsModal={showNewLogsModal}
        setShowNewLogsModal={setShowNewLogsModal}
      />
    </>
  );
}
