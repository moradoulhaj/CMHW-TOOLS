import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  // Array of links with paths and labels
  const links = [
    { path: "/", label: "Read and Show (Offers)" },
    { path: "/remove", label: "Remove Sessions" },
    { path: "/addWithTags", label: "Add Session Using Tags" },
    { path: "/delimiterSwitch", label: "Delimiter Switch" },
    { path: "/spliter", label: "Spliter" },
    { path: "/logCheck", label: "Log Checker" },
  ];

  return (
    <nav className="bg-blue-200 shadow-md">
      <ul className="flex space-x-4 p-4">
        {links.map((link) => (
          <li key={link.path}>
            <Link to={link.path} className="text-blue-600 hover:text-blue-800">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
