import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Sidebar({ isOpen, toggle }) {
  const [deprecatedOpen, setDeprecatedOpen] = useState({});
  const [categoryOpen, setCategoryOpen] = useState({
    tool: true,
    desktop: true,
  });
const links = [
    { path: "/readAndShow", label: "Read and Show", category: "tool", status: "active" },
    { path: "/removeTags", label: "Remove Sessions", category: "tool", status: "active" },
    { path: "/addUsingTags", label: "Add Session", category: "tool", status: "deprecated" },
    { path: "/delimiterSwitch", label: "Delimiter Switch", category: "tool", status: "deprecated" },
    { path: "/spliter", label: "Drive Spliter", category: "tool", status: "active" },
    { path: "/logChecker", label: "Log Checker", category: "tool", status: "deprecated" },
    { path: "/logCheckerBeta", label: "Log Checker - TEST", category: "tool", status: "deprecated" },
    { path: "/logCheckerNew", label: "Log Checker - NEW", category: "tool", status: "active" },
    { path: "/spamCalculator", label: "Spam Calculator", category: "tool", status: "active" },
    { path: "/ramadanTask", label: "Next Day Login", category: "tool", status: "deprecated" },
    { path: "/addSessionBeta", label: "Add Session Beta", category: "tool", status: "active" },
    { path: "/spliterBeta", label: "Spliter Beta", category: "tool", status: "active" },
    { path: "/updateTask", label: "Remove TO Tasks", category: "tool", status: "active" },
    { path: "/sheduleGenerator", label: "Shedule Generator", category: "tool", status: "active" },

    { path: "/logAnalyser", label: "Log Analyse", category: "desktop", status: "active" },
    { path: "/emailDuplicateChecker", label: "Email Duplicate Checker", category: "desktop", status: "active" },

    { path: "/compareTwoLists", label: "Compare Two Lists", category: "desktop", status: "active" },
    { path: "/notExistingProfiles", label: "Not Existing Profiles", category: "desktop", status: "active" },
    { path: "/emailsOfProfiles", label: "Emails of Profiles", category: "desktop", status: "active" },
    { path: "/profilesOfEmails", label: "Profiles of Emails", category: "desktop", status: "active" },
  ];

  const categories = ["tool", "desktop"];

  const toggleCategory = (category) => {
    setCategoryOpen((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleDropdown = (category) => {
    setDeprecatedOpen((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const renderLinks = (category, status) =>
    links
      .filter((link) => link.category === category && link.status === status)
      .map((link) => (
        <li key={link.path}>
          <NavLink
            to={link.path}
            className={({ isActive }) =>
              `block text-sm font-medium px-4 py-2 rounded transition duration-300 text-white ${
                isActive ? "bg-blue-800 shadow-md" : "hover:bg-blue-700"
              }`
            }
            onClick={toggle}
          >
            {link.label}
          </NavLink>
        </li>
      ));

  return (
    <div
      className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-blue-500 to-blue-600 shadow-lg p-4 overflow-y-auto transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-64"
      }`}
    >
      <h2 className="text-white text-xl font-bold mb-6 text-center">Menu</h2>

      {categories.map((category) => {
        const hasDeprecated = links.some(
          (link) => link.category === category && link.status === "deprecated"
        );

        return (
          <div key={category} className="mb-6">
            <button
              onClick={() => toggleCategory(category)}
              className="flex items-center justify-between w-full text-lg font-semibold text-white capitalize mb-2 hover:bg-blue-700 px-2 py-1 rounded transition"
            >
              <span>{category}</span>
              {categoryOpen[category] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {categoryOpen[category] && (
              <>
                <ul className="space-y-2">{renderLinks(category, "active")}</ul>

                {hasDeprecated && (
                  <>
                    <button
                      onClick={() => toggleDropdown(category)}
                      className="flex items-center justify-between w-full text-sm text-blue-100 italic mt-3 px-2 py-1 rounded hover:bg-blue-700 transition"
                    >
                      <span>Deprecated</span>
                      {deprecatedOpen[category] ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>

                    {deprecatedOpen[category] && (
                      <ul className="space-y-1 ml-3 border-l border-blue-300 pl-2">
                        {renderLinks(category, "deprecated")}
                      </ul>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
