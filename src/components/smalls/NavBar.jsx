

import React from "react";
import { NavLink } from "react-router-dom";
export default function Navbar() {
  // Array of links with paths and labels
  const links = [
    { path: "/", label: "Read and Show" },
    { path: "/removeTags", label: "Remove Sessions" },
    { path: "/addUsingTags", label: "Add Session Using Tags" },
    { path: "/delimiterSwitch", label: "Delimiter Switch" },
    { path: "/spliter", label: "Spliter" },
    { path: "/logChecker", label: "Log Checker" },
  ];



  return (
    <nav className="bg-gradient-to-r from-blue-500 to-blue-500 shadow-md">
      <ul className="flex justify-center space-x-6 py-4">
        {links.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `text-lg font-semibold px-3 py-2 rounded transition duration-300 ${
                  isActive ? "text-white bg-blue-800 shadow-md" : "hover:bg-blue-700"
                }`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

