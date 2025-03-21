import React, { useState } from "react";
import Sidebar from "./components/smalls/SideBar";
import RemoveSessions from "./components/RemoveSessions";
import Offers from "./components/Offers";
import DelimiterSwitch from "./components/DelimterSwitch";
import AddSessionUsingTags from "./components/AddSessionsUsinTags";
import Spliter from "./components/Spliter";
import LogChecker from "./components/LogChecker";
import SpamCalculator from "./components/SpamCalculator";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/smalls/Footer";
import RamadanTask from "./components/RamadanTask";
import CleanChecker from "./components/CleanChecker";
import { AlignJustify } from "lucide-react"; // Importing the menu icon
import SpliterBeta from "./components/SpliterBeta";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
          {/* Navbar */}
          <nav className="bg-blue-600 text-white p-3 flex items-center shadow-md justify-between ">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
              <AlignJustify size={28} />
            </button>
            <h1 className="mr-3 text-lg font-semibold">CMHW - TOOLS</h1>
          </nav>

          {/* Page Content */}
          <div className="flex-grow p-4">
            <Routes>
              <Route path="/readAndShow" element={<Offers />} />
              <Route path="/removeTags" element={<RemoveSessions />} />
              <Route path="/addUsingTags" element={<AddSessionUsingTags />} />
              <Route path="/delimiterSwitch" element={<DelimiterSwitch />} />
              <Route path="/spliter" element={<Spliter />} />
              <Route path="/logChecker" element={<LogChecker />} />
              <Route path="/spamCalculator" element={<SpamCalculator />} />
              <Route path="/ramadanTask" element={<RamadanTask />} />
              <Route path="/cleanChecker" element={<CleanChecker />} />
              <Route path="/spliterBeta" element={<SpliterBeta />} />

              <Route path="*" element={<LogChecker />} />
            </Routes>
          </div>

          {/* Footer - Stays at bottom */}
          <Footer />
        </div>
      </div>
    </Router>
  );
}
