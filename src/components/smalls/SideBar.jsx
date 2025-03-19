import { AlignJustify , X } from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const [togle, setTogle] = useState(false);

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
  ];

  return (
    <div className={`w-64 h-screen bg-gradient-to-b from-blue-500 to-blue-600 shadow-lg p-4 fixed ${togle ? "-left-[210px]" : "translate-x-0"}`}>
      <div className="flex justify-between items-center ">
        
        <h2 className="text-white text-xl font-bold mb-6 text-center">Menu</h2>
        <a  onClick={()=>setTogle(!togle)}>
          {togle ?  <AlignJustify className="text-white text-xl font-bold mb-6 text-center" onClick={()=>setTogle(!togle)}/> : <X className="text-white text-xl font-bold mb-6 text-center"/>}
        </a>
      </div>

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
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
