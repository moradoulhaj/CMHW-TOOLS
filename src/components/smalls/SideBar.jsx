import { AlignJustify, X } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ isOpen, toggle }) {
  const links = [
    { path: "/readAndShow", label: "Read and Show" },
    { path: "/removeTags", label: "Remove Sessions" },
    { path: "/addUsingTags", label: "Add Session Using Tags" },
    { path: "/delimiterSwitch", label: "Delimiter Switch" },
    { path: "/spliter", label: "Spliter" },
    { path: "/logChecker", label: "Checker" },
    { path: "/spamCalculator", label: "Spam Calculator" },
    { path: "/ramadanTask", label: "Ramadan Task" },
    { path: "/cleanChecker", label: "Clean Checker" },
    { path: "/spliterBeta", label: "Spliter Beta" },

  ];

  return (
    <>
  
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-blue-500 to-blue-600 shadow-lg p-4 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <h2 className="text-white text-xl font-bold mb-6 text-center">
          Menu
        </h2>

        <ul className="space-y-4">
          {links.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `block text-lg font-semibold px-4 py-2 rounded transition duration-300 text-white ${
                    isActive ? "bg-blue-800 shadow-md" : "hover:bg-blue-700"
                  }`
                }
                onClick={toggle} // Close sidebar when clicking a link
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
