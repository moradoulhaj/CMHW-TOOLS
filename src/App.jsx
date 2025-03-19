import React from "react";
import Navbar from "./components/smalls/SideBar";
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
import Sidebar from "./components/smalls/SideBar";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50">
        <Sidebar />

        <div>
          <Routes>
          
            <Route path="/readAndShow" element={<Offers />} />
            <Route path="/removeTags" element={<RemoveSessions />} />
            <Route path="/addUsingTags" element={<AddSessionUsingTags />} />
            <Route path="/delimiterSwitch" element={<DelimiterSwitch />} />
            <Route path="/spliter" element={<Spliter />} />
            <Route path="/logChecker" element={<LogChecker />} />
            <Route path="/spamCalculator" element={<SpamCalculator />} />
            <Route path="/ramadanTask" element={<RamadanTask/>} />
            <Route path="/cleanChecker" element={<CleanChecker/>} />

            <Route path="*" element={<LogChecker />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
